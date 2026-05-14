from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from datetime import datetime


app = FastAPI(
    title="AI Support Pro API",
    description="Multi-Agent Customer Support System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allow all origins (you can restrict this later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request validation
class TicketCreate(BaseModel):
    subject: str
    description: str


# ============================================
# ROOT & HEALTH ENDPOINTS
# ============================================

@app.get("/")
@app.head("/")
def read_root():
    return {
        "message": "🚀 AI Support Pro API is running!",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "healthy", "service": "AI Support Pro"}


# ============================================
# AGENT ENDPOINTS
# ============================================

@app.get("/api/status")
@app.head("/api/status")
def api_status():
    return {
        "api": "online",
        "agents": {
            "triage": "ready",
            "knowledge": "ready",
            "response": "ready",
            "escalation": "ready"
        }
    }


@app.get("/api/agents")
@app.head("/api/agents")
def get_agents():
    return {
        "agents": [
            {"name": "Triage Agent", "status": "active"},
            {"name": "Knowledge Agent", "status": "active"},
            {"name": "Response Agent", "status": "active"},
            {"name": "Escalation Agent", "status": "active"}
        ]
    }


# ============================================
# TICKET ENDPOINTS
# ============================================

@app.get("/api/tickets")
@app.head("/api/tickets")
async def get_tickets():
    """Get all support tickets"""
    return [
        {
            "id": "TICK-001",
            "subject": "Cannot login to my account",
            "description": "Getting error 'Invalid credentials' when trying to login",
            "category": "Technical",
            "priority": "high",
            "status": "open",
            "suggestedReply": "Please try resetting your password using the 'Forgot Password' link.",
            "created_at": "2026-05-14T18:30:00Z"
        },
        {
            "id": "TICK-002",
            "subject": "Billing inquiry",
            "description": "I was charged twice for my subscription",
            "category": "Billing",
            "priority": "high",
            "status": "in_progress",
            "suggestedReply": "We apologize for the inconvenience. Our billing team will review your account and process a refund within 3-5 business days.",
            "created_at": "2026-05-14T17:15:00Z"
        },
        {
            "id": "TICK-003",
            "subject": "Feature request",
            "description": "Would love to see dark mode support",
            "category": "Feature Request",
            "priority": "low",
            "status": "open",
            "suggestedReply": "Thank you for your suggestion! We've added this to our product roadmap.",
            "created_at": "2026-05-14T16:00:00Z"
        }
    ]


@app.get("/api/tickets/stats")
@app.head("/api/tickets/stats")
async def get_ticket_stats():
    """Get ticket statistics and analytics"""
    return {
        "total": 150,
        "open": 35,
        "in_progress": 45,
        "resolved": 70,
        "avg_response_time": "1.8 seconds",
        "satisfaction_rate": 4.7,
        "automation_rate": "92%",
        "categories": {
            "Technical": 60,
            "Billing": 40,
            "Feature Request": 25,
            "General": 25
        }
    }


@app.post("/api/tickets")
async def create_ticket(ticket: TicketCreate):
    """Create a new support ticket with AI-powered categorization"""
    
    # Simple AI logic to categorize and prioritize
    subject_lower = ticket.subject.lower()
    description_lower = ticket.description.lower()
    
    # Determine category
    if any(word in subject_lower + description_lower for word in ["login", "password", "access", "error", "bug"]):
        category = "Technical"
        priority = "high"
        suggested_reply = "Our technical team is investigating this issue. We'll get back to you within 2 hours."
    elif any(word in subject_lower + description_lower for word in ["billing", "charge", "payment", "refund", "invoice"]):
        category = "Billing"
        priority = "high"
        suggested_reply = "Our billing team will review your account and respond within 24 hours."
    elif any(word in subject_lower + description_lower for word in ["feature", "request", "suggest", "improvement"]):
        category = "Feature Request"
        priority = "low"
        suggested_reply = "Thank you for your suggestion! We've added it to our product roadmap."
    else:
        category = "General"
        priority = "medium"
        suggested_reply = "Thank you for contacting us. Our support team will review your inquiry shortly."
    
    # Generate ticket ID
    ticket_id = f"TICK-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    return {
        "id": ticket_id,
        "subject": ticket.subject,
        "description": ticket.description,
        "category": category,
        "priority": priority,
        "status": "open",
        "suggestedReply": suggested_reply,
        "created_at": datetime.now().isoformat() + "Z",
        "assigned_agent": "AI Triage Agent"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)