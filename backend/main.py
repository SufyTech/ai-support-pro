from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sqlite3
import json
from datetime import datetime

DB_PATH = "reviews.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            pr_title TEXT,
            code_diff TEXT,
            change_type TEXT,
            risk_level TEXT,
            status TEXT,
            reviewComment TEXT,
            createdAt TEXT,
            assigned_reviewer TEXT,
            needs_human_review INTEGER,
            agents_run TEXT
        )
    """)
    conn.commit()
    conn.close()
    # NOTE: seed data intentionally removed. The table starts empty and
    # only fills in as real PRs come through POST /api/reviews.

def row_to_dict(row):
    d = dict(row)
    d["needs_human_review"] = bool(d["needs_human_review"])
    d["agents_run"] = json.loads(d["agents_run"]) if d["agents_run"] else []
    return d

init_db()

app = FastAPI(
    title="AI Code Review Bot API",
    description="Multi-Agent Automated Code Review System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

class ReviewCreate(BaseModel):
    pr_title: str
    code_diff: str

class RAGQuery(BaseModel):
    question: str

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "AI Code Review Bot API is running!", "status": "operational", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "healthy", "service": "AI Code Review Bot"}

@app.get("/api/status")
@app.head("/api/status")
def api_status():
    return {"api": "online", "agents": {"triage": "ready", "knowledge": "ready", "response": "ready", "escalation": "ready"}}

@app.get("/api/agents")
@app.head("/api/agents")
def get_agents():
    return {"agents": [
        {"name": "Triage Agent", "status": "active"},
        {"name": "Knowledge Agent", "status": "active"},
        {"name": "Response Agent", "status": "active"},
        {"name": "Escalation Agent", "status": "active"}
    ]}

@app.get("/api/reviews")
@app.head("/api/reviews")
async def get_reviews():
    conn = get_db()
    rows = conn.execute("SELECT * FROM reviews ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.get("/api/reviews/stats")
@app.head("/api/reviews/stats")
async def get_review_stats():
    conn = get_db()
    rows = conn.execute("SELECT * FROM reviews").fetchall()
    conn.close()
    reviews = [row_to_dict(r) for r in rows]

    total = len(reviews)
    if total == 0:
        return {"totalReviews": 0, "escalated": 0, "normal": 0, "escalation_rate": 0,
                "agents_frequency": {}, "change_types": {}, "risk_levels": {}}

    escalated = sum(1 for r in reviews if r["needs_human_review"])

    agents_frequency = {}
    for r in reviews:
        for agent in r["agents_run"]:
            agents_frequency[agent] = agents_frequency.get(agent, 0) + 1

    change_types = {}
    for r in reviews:
        c = r["change_type"]
        change_types[c] = change_types.get(c, 0) + 1

    risk_levels = {}
    for r in reviews:
        p = r["risk_level"]
        risk_levels[p] = risk_levels.get(p, 0) + 1

    return {
        "totalReviews": total,
        "escalated": escalated,
        "normal": total - escalated,
        "escalation_rate": round((escalated / total) * 100, 1),
        "agents_frequency": agents_frequency,
        "change_types": change_types,
        "risk_levels": risk_levels
    }

@app.post("/api/reviews")
async def create_review(review: ReviewCreate):
    change_type = "Refactor"
    risk_level = "medium"
    review_comment = "Thank you for the PR. Our review system will process it shortly."
    assigned_reviewer = "AI Reviewer"
    needs_human_review = False
    agents_run = []

    try:
        from ai_agents.graph import dispatch
        ai_response = dispatch(pr_title=review.pr_title, code_diff=review.code_diff)
        change_type = ai_response.get("change_type", change_type)
        risk_level = ai_response.get("risk_level", risk_level)
        review_comment = ai_response.get("reviewComment", review_comment)
        assigned_reviewer = ai_response.get("assigned_reviewer", assigned_reviewer)
        needs_human_review = ai_response.get("needs_human_review", False)
        agents_run = ai_response.get("agents_run", [])
    except Exception as e:
        print(f"AI dispatch failed, using fallback: {e}")

    review_id = f"PR-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    created_at = datetime.now().isoformat() + "Z"

    conn = get_db()
    conn.execute(
        "INSERT INTO reviews VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (review_id, review.pr_title, review.code_diff, change_type, risk_level, "open",
         review_comment, created_at, assigned_reviewer, int(needs_human_review), json.dumps(agents_run))
    )
    conn.commit()
    conn.close()

    return {
        "id": review_id,
        "pr_title": review.pr_title,
        "code_diff": review.code_diff,
        "change_type": change_type,
        "risk_level": risk_level,
        "status": "open",
        "reviewComment": review_comment,
        "createdAt": created_at,
        "assigned_reviewer": assigned_reviewer,
        "needs_human_review": needs_human_review,
        "agents_run": agents_run
    }

# ============================================
# RAG ENDPOINTS
# ============================================

@app.post("/api/rag/ask")
async def rag_ask(query: RAGQuery):
    """Ask a question against the knowledge base using RAG"""
    try:
        from ai_agents.rag import ask
        result = ask(query.question)
        return {
            "question": query.question,
            "answer": result["answer"],
            "sources": result["sources"],
            "chunks_used": result["chunks_used"]
        }
    except Exception as e:
        return {"error": str(e), "answer": "RAG system encountered an error.", "sources": []}

@app.get("/api/rag/status")
async def rag_status():
    """Check RAG knowledge base status"""
    try:
        from ai_agents.rag import qdrant, COLLECTION_NAME, ensure_collection
        ensure_collection()
        count = qdrant.count(collection_name=COLLECTION_NAME).count
        return {
            "status": "ready",
            "chunks_indexed": count,
            "collection": COLLECTION_NAME
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)