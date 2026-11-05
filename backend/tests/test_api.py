"""Tests for the API. The AI call is replaced by a fake, so no Groq key is needed."""
import pytest
from fastapi.testclient import TestClient

import main


@pytest.fixture
def client(tmp_path, monkeypatch):
    # Use a throwaway database so tests never touch reviews.db
    monkeypatch.setattr(main, "DB_PATH", str(tmp_path / "test_reviews.db"))
    main.init_db()
    return TestClient(main.app)


def fake_dispatch_ok(pr_title, code_diff):
    return {
        "change_type": "Bug Fix",
        "risk_level": "high",
        "reviewComment": "Flagged for review.",
        "assigned_reviewer": "Human Reviewer",
        "needs_human_review": True,
        "agents_run": ["triage_agent", "escalation_check"],
    }


def test_health(client):
    assert client.get("/health").json()["status"] == "healthy"


def test_create_review_returns_ai_result(client, monkeypatch):
    monkeypatch.setattr("ai_agents.graph.dispatch", fake_dispatch_ok)
    r = client.post("/api/reviews", json={"pr_title": "t", "code_diff": "+x"})
    assert r.status_code == 200
    body = r.json()
    assert body["risk_level"] == "high"
    assert body["needs_human_review"] is True
    assert body["agents_run"] == ["triage_agent", "escalation_check"]


def test_review_is_saved_and_listed(client, monkeypatch):
    monkeypatch.setattr("ai_agents.graph.dispatch", fake_dispatch_ok)
    client.post("/api/reviews", json={"pr_title": "t", "code_diff": "+x"})
    reviews = client.get("/api/reviews").json()
    assert len(reviews) == 1
    assert reviews[0]["pr_title"] == "t"


def test_ai_failure_returns_clear_error_not_fake_answer(client, monkeypatch):
    def boom(pr_title, code_diff):
        raise RuntimeError("model unavailable")

    monkeypatch.setattr("ai_agents.graph.dispatch", boom)
    r = client.post("/api/reviews", json={"pr_title": "t", "code_diff": "+x"})
    assert r.status_code == 503
    # and nothing fake was saved
    assert client.get("/api/reviews").json() == []


def test_missing_diff_is_rejected(client):
    r = client.post("/api/reviews", json={"pr_title": "only a title"})
    assert r.status_code == 422


def test_stats_with_no_reviews(client):
    assert client.get("/api/reviews/stats").json()["totalReviews"] == 0


def test_cors_blocks_unknown_origin(client):
    r = client.get("/health", headers={"Origin": "https://evil.example.com"})
    assert r.headers.get("access-control-allow-origin") != "*"
    assert r.headers.get("access-control-allow-origin") != "https://evil.example.com"


def test_cors_allows_frontend_origin(client):
    r = client.get("/health", headers={"Origin": "http://localhost:5173"})
    assert r.headers.get("access-control-allow-origin") == "http://localhost:5173"
