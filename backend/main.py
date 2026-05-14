from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI(
    title="AI Support Pro API",
    description="Multi-Agent Customer Support System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# Get allowed origins from environment
CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "*")
allowed_origins = [CLIENT_ORIGIN] if CLIENT_ORIGIN != "*" else ["*"]


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.head("/")  # ✅ Added HEAD support for UptimeRobot
def read_root():
    return {
        "message": "🚀 AI Support Pro API is running!",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
        "allowed_origins": allowed_origins
    }


@app.get("/health")
@app.head("/health")  # ✅ Added HEAD support for UptimeRobot
def health_check():
    return {"status": "healthy", "service": "AI Support Pro"}


@app.get("/api/status")
@app.head("/api/status")  # ✅ Added HEAD support
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
@app.head("/api/agents")  # ✅ Added HEAD support
def get_agents():
    return {
        "agents": [
            {"name": "Triage Agent", "status": "active"},
            {"name": "Knowledge Agent", "status": "active"},
            {"name": "Response Agent", "status": "active"},
            {"name": "Escalation Agent", "status": "active"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)