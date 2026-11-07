# AI CodeReview Pro

**Multi-agent code review system built with LangGraph, RAG, and an observability dashboard.**

> **v2: evolved from AI Support Pro.** Originally built as an AI customer support system. The same LangGraph multi-agent engine now triages pull requests, flags high-risk changes for human review, and writes review comments.

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

A working AI code review system. Every incoming pull request goes through a graph of specialized agents (triage, review focus, review writing, and human escalation) orchestrated by LangGraph. A built-in observability dashboard shows agent execution.

**Try it:** sign in, submit a PR title and diff, and watch the agent flow appear in the dashboard. One of the quick-test scenarios (a password-hashing change) triggers the high-risk escalation path.

---

## Architecture

```
Pull Request
      ↓
Triage Agent
  change type + risk level + a one-sentence risk reason that names the specific flaw
      ↓
Escalation Check
  high/critical risk, or sensitive keywords (auth, payment, secret, migration...)
      ↓
Knowledge Agent
  decides what the review should focus on
      ↓
Response Agent
  writes the review comment (never "Approve" on high-risk changes)
      ↓
Needs human review?
  ├── no  → done (AI review)
  └── yes → Escalation Response Agent
            adds the risk reason, flags for mandatory senior engineer review
```

Every PR gets a full AI review. High-risk PRs are then **also** flagged for mandatory human review, and the AI never approves them on its own. The routing is plain code (LangGraph conditional edges), not prompt instructions.

---

## Projects Inside

### Project 1: LangGraph Multi-Agent Routing

- Built with LangGraph, not simple LLM chaining
- Each agent is a separate node with its own prompt and responsibility
- A conditional edge decides whether a finished review is also escalated to a human
- The `agents_run` field in the API response shows exactly which agents fired

### Project 2: Observability Dashboard

- Dashboard embedded in the main app, behind auth
- Shows agent execution frequency, escalation rate, and reviews by change type and risk level
- Auto-refreshes every 10 seconds
- Built with Recharts and a FastAPI stats endpoint

### Project 3: RAG Pipeline

- Qdrant Cloud vector store with fastembed embeddings (all-MiniLM-L6-v2)
- Knowledge base (style guide and security checklist) chunked and indexed in Qdrant
- `/api/rag/ask` retrieves relevant chunks and generates cited answers via Groq
- "Ask AI" search UI inside the dashboard

### Project 4: Authentication

- Google, GitHub, and email/password sign-in via Supabase Auth
- Dashboard is gated behind login; the landing page stays public

---

## Test Results

I tested the reviewer on 20 small diffs: 19 with one planted bug each, plus 1 clean file as a control. A catch means the review comment or the risk reason named the actual bug.

| Metric                       | First run | After fixes (3 runs) |
| ---------------------------- | --------- | -------------------- |
| Planted bugs named           | 17 / 19   | 19, 19, 19 / 19      |
| Escalated to a human         | 11 / 19   | 13 / 19 every run    |
| Clean file wrongly escalated | 0 / 1     | 0 / 1                |

**What I fixed after the first run**

- The payment and permission reviews named the area ("touches payments") but not the bug. I changed the triage prompt to require the specific flaw.
- Open CORS with credentials was rated low. I added a rule that security misconfigurations are at least medium.
- High-risk PRs skipped the detailed review, so they only got a one-line comment. Prompt tuning alone did not fix this. I changed the graph so every PR is reviewed first and risky ones are escalated after.

**Known weaknesses**

- The clean file is never approved. In all 3 runs it was not escalated, but it got "Request Changes" over style and Unicode nitpicks.
- The 6 logic bugs (off-by-one, null handling, infinite loop, race condition, unclosed connection, divide by zero) are reviewed by the AI but not escalated. That is by design, but their risk ratings move between low and medium from run to run.
- For the payment PR, the risk line names the real bug (price trusted from the client), while the longer review notes focus on a different issue.
- I wrote the bugs myself, they are simple, I tuned on this same set, and I ran it 3 times. The score is optimistic. Next step: test on real open-source PRs.

**Reproduce**

```bash
python make_test_prs.py     # creates test-prs/ with 20 diffs and the answer key
# start the backend, then:
python run_tests.py         # writes test-prs/results.csv
```

Raw outputs of the runs are in `test-prs/`.

---

## Tech Stack

**Backend**

```
FastAPI                 REST API and review processing
LangGraph               Agent graph orchestration
Groq                    LLM inference (gpt-oss-120b for agents, gpt-oss-20b for RAG answers)
Qdrant Cloud            Vector store for RAG
fastembed               Document embeddings (all-MiniLM-L6-v2)
Python                  Core runtime
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

# agents_run: ["triage_agent", "escalation_check", "knowledge_agent", "response_agent"]

# Submit a high-risk PR (touches auth)
curl -X POST https://ai-support-pro-backend.onrender.com/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"pr_title":"Update password hashing logic","code_diff":"- password = hash(password)\n+ password = md5(password)"}'

# agents_run: ["triage_agent", "escalation_check", "knowledge_agent", "response_agent", "escalation_response_agent"]
# assigned_reviewer: "Human Reviewer"

# Ask the RAG knowledge base
curl -X POST https://ai-support-pro-backend.onrender.com/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How should I handle password hashing?"}'

# View real-time stats
curl https://ai-support-pro-backend.onrender.com/api/reviews/stats
```

The backend runs on a free Render plan, so the first request after a quiet period can take up to 30 seconds.

---

## Run Locally

```bash
# Clone
git clone https://github.com/SufyTech/ai-support-pro.git
cd ai-support-pro/ai-support-pro-final

# Backend (Python 3.11 recommended)
cd backend
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1      macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Create backend/.env with GROQ_API_KEY, QDRANT_URL, QDRANT_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd ../frontend
npm install
# Add VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY to frontend/.env
npm run dev
# → http://localhost:5173
```

---

## Key Design Decisions

**Why LangGraph over plain LLM calls?**
Each agent is an explicit node in a directed graph. The routing logic is code, not prompt instructions, which makes it testable, debuggable, and easy to extend.

**Why review every PR before escalating?**
My first design sent high-risk PRs straight to a human and skipped the detailed review. The result was a one-line comment that named the area ("touches payments") but not the bug. Now every PR gets a full review, and escalation is added on top. The cost is two extra model calls on escalated PRs.

**Why keep a keyword check next to the AI risk rating?**
The model's risk level changes between runs. A simple keyword rule (password, secret, payment, migration...) makes sure obviously sensitive changes are always escalated, even when the model rates them medium. The weakness: keywords can match harmless words, such as "auth" inside "author".

**Why Qdrant Cloud over local ChromaDB?**
The original ChromaDB setup worked locally but did not deploy well because of the embedding model size on free-tier hosting. Migrating to Qdrant Cloud made the RAG endpoint work in production, not only on localhost.

**Why put the dashboard behind auth?**
It keeps the public demo page clean while giving a gated, SaaS-style dashboard for signed-in users.

---

## Problems I Hit

- **Model shut down:** Groq retired `llama-3.1-8b-instant`. Every call silently fell back to a default "medium risk" answer, and the dashboard looked normal. I found it by checking whether the AI actually ran, then switched to `gpt-oss-120b`.
- **Cut-off JSON:** the new model uses tokens for reasoning, so a small `max_tokens` cut the answer off and the JSON broke. I raised it to 1000.
- **Silent failures:** a bare `except` hid both problems. The triage step now logs parse failures. Still to fix: the API itself should return a clear error instead of a default answer when the AI call fails.
- **Shallow reviews on risky PRs:** described under Key Design Decisions. Prompt tuning did not fix it; changing the graph did.
- **Wrong test environment:** my local shell used a Python environment with a newer `langgraph`, so the project failed to import. A fresh virtual environment on Python 3.11 fixed it.

---

## What I'd Add With More Time

- Automated tests and CI for the escalation rules
- Test on real open-source PRs, not only synthetic diffs
- Return a clear error when the AI call fails
- Persistent review storage (PostgreSQL instead of SQLite)
- Restrict CORS to the frontend domain instead of `*`
- Real GitHub PR integration (pull diffs through the GitHub API instead of manual paste)
- Hybrid BM25 and vector search on the knowledge base
- Per-repo custom style guides instead of one shared knowledge base

---

## About

**Sufiyan Khan**, AI Engineer, Satara
Building AI systems with LangGraph, RAG, and FastAPI. Open to remote roles.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sufiyan-khan-a86521301)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SufyTech)

📧 suzkhan135@gmail.com
