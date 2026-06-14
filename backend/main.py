from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sqlite3
import json
from datetime import datetime

DB_PATH = "tickets.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            subject TEXT,
            description TEXT,
            category TEXT,
            priority TEXT,
            status TEXT,
            suggestedReply TEXT,
            createdAt TEXT,
            assigned_agent TEXT,
            needs_escalation INTEGER,
            agents_run TEXT
        )
    """)
    # Seed only if table is empty
    count = conn.execute("SELECT COUNT(*) FROM tickets").fetchone()[0]
    if count == 0:
        seeds = [
            ("TICK-001", "Cannot login to my account", "Getting error 'Invalid credentials' when trying to login", "Login", "high", "open", "Please try resetting your password using the Forgot Password link.", "2026-06-12T08:10:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
            ("TICK-002", "Billing inquiry — charged twice", "I was charged twice for my subscription this month.", "Billing", "high", "open", "We apologize. Our billing team will process a refund within 3-5 business days.", "2026-06-12T09:22:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
            ("TICK-003", "Unauthorized transaction on account", "Someone made a fraudulent charge of $500. This is urgent fraud.", "Billing", "urgent", "open", "A senior human agent has been assigned and will contact you within 1 hour.", "2026-06-12T10:05:00Z", "Human Agent", 1, json.dumps(["triage_agent", "escalation_check", "escalation_response_agent"])),
            ("TICK-004", "Password reset link not working", "I forgot my password and the reset link expired.", "Login", "medium", "open", "We have sent a new password reset link to your email.", "2026-06-12T11:30:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
            ("TICK-005", "API rate limit exceeded", "Getting 429 errors on all API calls since this morning.", "Technical", "high", "open", "Your plan limit has been reached. Please upgrade or wait for the reset.", "2026-06-12T12:15:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
            ("TICK-006", "Account suspended without warning", "My account was suspended suddenly. I need immediate help.", "Account", "urgent", "open", "A senior human agent has been assigned and will contact you within 1 hour.", "2026-06-12T13:40:00Z", "Human Agent", 1, json.dumps(["triage_agent", "escalation_check", "escalation_response_agent"])),
            ("TICK-007", "Feature request — dark mode", "Would love to see dark mode support in the dashboard.", "General", "low", "open", "Thank you for your suggestion! We have added this to our product roadmap.", "2026-06-12T14:00:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
            ("TICK-008", "Integration with Slack not working", "The Slack integration stopped sending notifications yesterday.", "Technical", "medium", "open", "Please reconnect the Slack integration from Settings > Integrations.", "2026-06-12T15:20:00Z", "AI Agent", 0, json.dumps(["triage_agent", "escalation_check", "knowledge_agent", "response_agent"])),
        ]
        conn.executemany("INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?)", seeds)
        conn.commit()
    conn.close()

def row_to_dict(row):
    d = dict(row)
    d["needs_escalation"] = bool(d["needs_escalation"])
    d["agents_run"] = json.loads(d["agents_run"]) if d["agents_run"] else []
    return d

# Init DB on startup
init_db()

app = FastAPI(
    title="AI Support Pro API",
    description="Multi-Agent Customer Support System",
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

class TicketCreate(BaseModel):
    subject: str
    description: str

class RAGQuery(BaseModel):
    question: str
    
@app.get("/")
@app.head("/")
def read_root():
    return {"message": "AI Support Pro API is running!", "status": "operational", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "healthy", "service": "AI Support Pro"}

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

@app.get("/api/tickets")
@app.head("/api/tickets")
async def get_tickets():
    conn = get_db()
    rows = conn.execute("SELECT * FROM tickets ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.get("/api/tickets/stats")
@app.head("/api/tickets/stats")
async def get_ticket_stats():
    conn = get_db()
    rows = conn.execute("SELECT * FROM tickets").fetchall()
    conn.close()
    tickets = [row_to_dict(r) for r in rows]

    total = len(tickets)
    if total == 0:
        return {"totalTickets": 0, "escalated": 0, "normal": 0, "escalation_rate": 0,
                "agents_frequency": {}, "categories": {}, "priorities": {}}

    escalated = sum(1 for t in tickets if t["needs_escalation"])

    agents_frequency = {}
    for t in tickets:
        for agent in t["agents_run"]:
            agents_frequency[agent] = agents_frequency.get(agent, 0) + 1

    categories = {}
    for t in tickets:
        c = t["category"]
        categories[c] = categories.get(c, 0) + 1

    priorities = {}
    for t in tickets:
        p = t["priority"]
        priorities[p] = priorities.get(p, 0) + 1

    return {
        "totalTickets": total,
        "escalated": escalated,
        "normal": total - escalated,
        "escalation_rate": round((escalated / total) * 100, 1),
        "agents_frequency": agents_frequency,
        "categories": categories,
        "priorities": priorities
    }

@app.post("/api/tickets")
async def create_ticket(ticket: TicketCreate):
    category = "General"
    priority = "medium"
    suggested_reply = "Thank you for contacting us. Our support team will review your inquiry shortly."
    assigned_agent = "AI Agent"
    needs_escalation = False
    agents_run = []

    try:
        from ai_agents.graph import dispatch
        ai_response = dispatch(subject=ticket.subject, description=ticket.description)
        category = ai_response.get("category", category)
        priority = ai_response.get("priority", priority)
        suggested_reply = ai_response.get("suggestedReply", suggested_reply)
        assigned_agent = ai_response.get("assigned_agent", assigned_agent)
        needs_escalation = ai_response.get("needs_escalation", False)
        agents_run = ai_response.get("agents_run", [])
    except Exception as e:
        print(f"AI dispatch failed, using fallback: {e}")

    ticket_id = f"TICK-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    created_at = datetime.now().isoformat() + "Z"

    conn = get_db()
    conn.execute(
        "INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (ticket_id, ticket.subject, ticket.description, category, priority, "open",
         suggested_reply, created_at, assigned_agent, int(needs_escalation), json.dumps(agents_run))
    )
    conn.commit()
    conn.close()

    return {
        "id": ticket_id,
        "subject": ticket.subject,
        "description": ticket.description,
        "category": category,
        "priority": priority,
        "status": "open",
        "suggestedReply": suggested_reply,
        "createdAt": created_at,
        "assigned_agent": assigned_agent,
        "needs_escalation": needs_escalation,
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
        from ai_agents.rag import get_or_create_collection
        collection = get_or_create_collection()
        return {
            "status": "ready",
            "chunks_indexed": collection.count(),
            "collection": "ai_support_pro_docs"
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)