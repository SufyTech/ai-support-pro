# AI Code Review Bot

**Autonomous multi-agent code review system built with LangGraph, RAG, and real-time observability.**

> **v2 — Evolved from AI Support Pro.** Originally built as an AI customer support system; the same LangGraph multi-agent engine has been repurposed into a Code Review Bot that triages pull requests, flags high-risk changes, and writes review comments. Same architecture, new use case.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-6c6cff?style=for-the-badge)](https://ai-support-pro-theta.vercel.app/)
[![GitHub](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SufyTech/ai-support-pro/)
[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sufiyan-khan-a86521301)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?flat-square&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?flat-square&logo=python&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF6B6B?flat-square)
![Qdrant](https://img.shields.io/badge/Qdrant_Cloud-DC244C?flat-square)

---

## What This Is

A fully working AI code review system where incoming pull requests are automatically routed through a graph of specialized agents — triage, knowledge retrieval, review generation, and human escalation — all orchestrated by LangGraph. A built-in observability dashboard shows agent execution in real time.

**Try it:** Sign in, submit a PR title and diff, and watch the agent flow appear in the observability dashboard. One of the quick-test scenarios (a password-hashing change) deliberately triggers the high-risk escalation path so you can see it live.

---

## Architecture

```
Pull Request
      ↓
┌─────────────────────────────────────┐
│  Triage Agent                       │
│  Classifies change type + risk      │
│  using Groq llama-3.1-8b-instant    │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  Escalation Check                   │
│  Flags auth/payments/migrations     │
└────────┬──────────────────┬─────────┘
         │                  │
     Normal path       High-risk path
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
│ Writes review│
└──────────────┘
```

Both paths are fully implemented and tested. The system correctly skips knowledge/response agents for high-risk PRs, routing them straight to mandatory human review instead.

---

## Projects Inside

### Project 1 — LangGraph Multi-Agent Routing
- Built with LangGraph (not simple LLM chaining)
- Two distinct routing paths based on PR risk level
- Each agent is a separate node with its own prompt and responsibility
- `agents_run` field in API response shows exactly which agents fired

### Project 2 — Observability Dashboard
- Real-time dashboard embedded in the main app (behind auth)
- Shows agent execution frequency, escalation rate, review breakdown by change type/risk level
- Auto-refreshes every 10 seconds
- Built with Recharts + FastAPI stats endpoint

### Project 3 — RAG Pipeline
- Qdrant Cloud vector store with sentence-transformers embeddings
- Knowledge base (style guide + security checklist) chunked and indexed on startup
- `/api/rag/ask` endpoint retrieves relevant chunks + generates cited answers via Groq
- "Ask AI" search UI integrated directly into the dashboard

### Project 4 — Authentication
- Google, GitHub, and email/password sign-in via Supabase Auth
- Dashboard is gated behind login; landing page stays public
- Clean SaaS-style flow: marketing page → sign in → dashboard

---

## Tech Stack

**Backend**
```
FastAPI          REST API + review processing
LangGraph        Agent graph orchestration
Groq             LLM inference (llama-3.1-8b-instant)
Qdrant Cloud     Vector store for RAG
sentence-transformers  Document embeddings (all-MiniLM-L6-v2)
Python           Core runtime
```

**Frontend**
```
React 18 + TypeScript   Component architecture
Vite                    Build tooling
Tailwind CSS            Styling
Framer Motion           Animations
Recharts                Observability charts
Supabase Auth           Google/GitHub/email authentication
```

**Deployment**
```
Vercel    Frontend
Render    Backend API
```

---

## Live API

```bash
# Submit a normal-risk PR
curl -X POST https://ai-support-pro-backend.onrender.com/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"pr_title":"Bump lodash to 4.17.21","code_diff":"- \"lodash\": \"4.17.15\"\n+ \"lodash\": \"4.17.21\""}'

# Response shows exactly which agents ran
# agents_run: ["triage_agent", "escalation_check", "knowledge_agent", "response_agent"]

# Submit a high-risk PR (touches auth)
curl -X POST https://ai-support-pro-backend.onrender.com/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"pr_title":"Update password hashing logic","code_diff":"- password = hash(password)\n+ password = md5(password)"}'

# agents_run: ["triage_agent", "escalation_check", "escalation_response_agent"]
# assigned_reviewer: "Human Reviewer"

# Ask the RAG knowledge base
curl -X POST https://ai-support-pro-backend.onrender.com/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How should I handle password hashing?"}'

# View real-time stats
curl https://ai-support-pro-backend.onrender.com/api/reviews/stats
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
# Add GROQ_API_KEY, QDRANT_URL, QDRANT_API_KEY to .env
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd ../frontend
npm install
# Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY to .env
npm run dev
# → http://localhost:5173
```

---

## Key Design Decisions

**Why LangGraph over plain LLM calls?**
Each agent is an explicit node in a directed graph. The routing logic is code, not prompt instructions — making it testable, debuggable, and easy to extend.

**Why Qdrant Cloud over local ChromaDB?**
The original ChromaDB setup worked locally but didn't deploy well due to embedding model size on free-tier hosting — the same issue I'd already diagnosed and fixed in a separate RAG project. Migrating to Qdrant Cloud reused that fix and made the RAG endpoint actually work in production, not just on localhost.

**Why embed the observability dashboard behind auth instead of on the public page?**
Keeps the marketing/demo experience clean for visitors while giving a real, gated SaaS-style dashboard for signed-in use — the same pattern used by real production tools.

---

## What I'd Add With More Time

- Persistent review storage (PostgreSQL instead of SQLite)
- Streaming responses via WebSocket
- Hybrid BM25/vector search on the knowledge base
- Real GitHub PR integration (pull diffs directly via the GitHub API instead of manual paste)
- Per-repo custom style guides instead of a single shared knowledge base

---

## About

**Sufiyan Khan** — AI Engineer, Satara
Building production-grade AI systems. Open to remote roles.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sufiyan-khan-a86521301)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SufyTech)

📧 suzkhan135@gmail.com
