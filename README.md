# AI Support Pro

**Autonomous multi-agent customer support system built with LangGraph, RAG, and real-time observability.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-6c6cff?style=for-the-badge)](https://ai-support-pro-theta.vercel.app/)
[![GitHub](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SufyTech/ai-support-pro/)
[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sufiyan-khan-a86521301)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?flat-square&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?flat-square&logo=python&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF6B6B?flat-square)

---

## What This Is

A fully working AI support system where incoming tickets are automatically routed through a graph of specialized agents — triage, knowledge retrieval, response generation, and human escalation — all orchestrated by LangGraph. A built-in observability dashboard shows agent execution in real time.

**Try it:** Submit a ticket on the live demo. Watch the agent flow appear in the observability dashboard.

---

## Architecture

```
Customer Ticket
      ↓
┌─────────────────────────────────────┐
│  Triage Agent                       │
│  Classifies category + priority     │
│  using Groq llama-3.1-8b-instant    │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  Escalation Check                   │
│  Routes based on urgency/fraud      │
└────────┬──────────────────┬─────────┘
         │                  │
    Normal path        Urgent/Fraud path
         ↓                  ↓
┌──────────────┐    ┌───────────────────┐
│ Knowledge    │    │ Escalation        │
│ Agent        │    │ Response Agent    │
│ RAG lookup   │    │ Human handoff     │
└──────┬───────┘    └───────────────────┘
       ↓
┌──────────────┐
│ Response     │
│ Agent        │
│ Drafts reply │
└──────────────┘
```

Both paths are fully implemented and tested. The system correctly skips knowledge/response agents for urgent tickets.

---

## Projects Inside

### Project 1 — LangGraph Multi-Agent Routing
- Built with LangGraph (not simple LLM chaining)
- Two distinct routing paths based on ticket urgency
- Each agent is a separate node with its own prompt and responsibility
- `agents_run` field in API response shows exactly which agents fired

### Project 2 — Observability Dashboard
- Real-time dashboard embedded in the main frontend
- Shows agent execution frequency, escalation rate, ticket breakdown by category/priority
- Auto-refreshes every 10 seconds
- Built with Recharts + FastAPI stats endpoint

### Project 3 — RAG Pipeline
- ChromaDB vector store with sentence-transformers embeddings
- 3 knowledge base documents chunked and indexed on startup
- `/api/rag/ask` endpoint retrieves relevant chunks + generates cited answers via Groq
- "Ask AI" search UI integrated directly into the frontend

---

## Tech Stack

**Backend**
```
FastAPI          REST API + ticket processing
LangGraph        Agent graph orchestration
Groq             LLM inference (llama-3.1-8b-instant)
ChromaDB         Vector store for RAG
sentence-transformers  Document embeddings (all-MiniLM-L6-v2)
Python           Core runtime
```

**Frontend**
```
React 18 + TypeScript   Component architecture
Vite                    Build tooling
Tailwind CSS            Styling
Framer Motion           Animations + boot sequence
Recharts                Observability charts
```

**Deployment**
```
Vercel    Frontend
Render    Backend API
```

---

## Live API

```bash
# Submit a normal ticket
curl -X POST https://ai-support-pro-backend.onrender.com/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Cannot reset password","description":"Reset link not arriving"}'

# Response shows exactly which agents ran
# agents_run: ["triage_agent", "escalation_check", "knowledge_agent", "response_agent"]

# Submit an urgent/fraud ticket
curl -X POST https://ai-support-pro-backend.onrender.com/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Unauthorized transaction","description":"Fraudulent charge of $500, urgent"}'

# agents_run: ["triage_agent", "escalation_check", "escalation_response_agent"]
# assigned_agent: "Human Agent"

# Ask the RAG knowledge base
curl -X POST https://ai-support-pro-backend.onrender.com/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How do I cancel my subscription?"}'

# View real-time stats
curl https://ai-support-pro-backend.onrender.com/api/tickets/stats
```

---

## Run Locally

```bash
# Clone
git clone https://github.com/SufyTech/ai-support-pro.git
cd ai-support-pro/ai-support-pro-final

# Backend
cd backend
pip install -r requirements.txt
# Add GROQ_API_KEY to .env
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Key Design Decisions

**Why LangGraph over plain LLM calls?**
Each agent is an explicit node in a directed graph. The routing logic is code, not prompt instructions — making it testable, debuggable, and easy to extend.

**Why ChromaDB + sentence-transformers over a managed vector DB?**
Zero external dependencies. The embeddings download once and cache locally. The RAG pipeline works offline after first run.

**Why embed the observability dashboard in the main frontend?**
One URL for recruiters to share. Everything — product demo, agent monitoring, RAG search — is visible in one place without context switching.

---

## What I'd Add With More Time

- Persistent ticket storage (PostgreSQL instead of in-memory)
- Auth layer for the dashboard
- Streaming responses via WebSocket
- More knowledge base documents + hybrid BM25/vector search
- Deployment of the RAG endpoint (currently local only due to model size)

---

## About

**Sufiyan Khan** — AI Engineer, Pune  
Building production-grade AI systems. Open to remote roles.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sufiyan-khan-a86521301)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SufyTech)

📧 suzkhan135@gmail.com
