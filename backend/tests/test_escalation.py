"""Tests for the escalation rules. No AI calls, so they are fast and free."""
from ai_agents.graph import escalation_check, route_after_response


def make_state(risk_level, diff):
    return {
        "pr_title": "test",
        "code_diff": diff,
        "risk_level": risk_level,
        "agents_run": [],
    }


def test_high_risk_is_escalated():
    result = escalation_check(make_state("high", "+x = 1"))
    assert result["needs_human_review"] is True
    assert result["assigned_to"] == "Human Reviewer"


def test_critical_risk_is_escalated():
    result = escalation_check(make_state("critical", "+x = 1"))
    assert result["needs_human_review"] is True


def test_low_risk_clean_diff_is_not_escalated():
    result = escalation_check(make_state("low", "+def add(a, b):\n+    return a + b"))
    assert result["needs_human_review"] is False
    assert result["assigned_to"] == "AI Reviewer"


def test_keyword_rule_escalates_even_if_ai_says_low():
    # Safety net: the AI risk level can change between runs, the keyword rule does not
    result = escalation_check(make_state("low", '+logger.info("password=" + pw)'))
    assert result["needs_human_review"] is True


def test_keyword_rule_covers_payment_and_migration():
    assert escalation_check(make_state("low", "+stripe.charge(5)"))["needs_human_review"] is True
    assert escalation_check(make_state("low", "+-- migration\n+DROP TABLE users"))["needs_human_review"] is True


def test_escalation_check_records_the_agent():
    result = escalation_check(make_state("low", "+x = 1"))
    assert "escalation_check" in result["agents_run"]


def test_route_after_response():
    assert route_after_response({"needs_human_review": True}) == "escalated"
    assert route_after_response({"needs_human_review": False}) == "done"
