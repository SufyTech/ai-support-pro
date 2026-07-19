# graph.py
# LangGraph-based multi-agent orchestration for AI Code Review Bot

import os
import json
from typing import TypedDict
from langgraph.graph import StateGraph, END
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────
# STATE DEFINITION
# This is the shared memory that all agents
# read from and write to.
# Think of it as a PR review form that gets
# filled in step by step.
# ─────────────────────────────────────────

class ReviewState(TypedDict):
    # Input from user
    pr_title: str
    code_diff: str

    # Filled by Triage Agent
    change_type: str
    risk_level: str
    risk_reason: str

    # Filled by Knowledge Agent
    review_focus: str

    # Filled by Response Agent
    review_comment: str

    # Filled by Escalation Agent
    needs_human_review: bool
    assigned_to: str

    # Tracks which agents ran
    agents_run: list


# ─────────────────────────────────────────
# AGENT 1: TRIAGE AGENT
#
# What it does:
# Reads the PR title and code diff
# Decides the change type and risk level
#
# Why it exists:
# Before any other agent can review, we need
# to know WHAT kind of change this is and
# HOW risky it is. This drives all other
# decisions in the graph.
# ─────────────────────────────────────────

def triage_agent(state: ReviewState) -> ReviewState:
    print(">> Triage Agent running...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a code review triage agent.
                Analyze the pull request title and diff, and return ONLY a JSON object with:
                - change_type: one of [Feature, Bug Fix, Refactor, Dependency Update, Documentation]
                - risk_level: one of [low, medium, high, critical]
                - risk_reason: one sentence explaining the risk level

                Mark risk_level as "high" or "critical" if the diff touches authentication,
                payments, database migrations, environment/secrets config, or access control.

                Return ONLY valid JSON, no other text."""
            },
            {
                "role": "user",
                "content": f"PR Title: {state['pr_title']}\nDiff:\n{state['code_diff']}"
            }
        ],
        temperature=0.1,
        max_tokens=200
    )

    try:
        result = json.loads(response.choices[0].message.content.strip())
    except:
        result = {
            "change_type": "Refactor",
            "risk_level": "medium",
            "risk_reason": "Unable to classify automatically"
        }

    return {
        **state,
        "change_type": result.get("change_type", "Refactor"),
        "risk_level": result.get("risk_level", "medium"),
        "risk_reason": result.get("risk_reason", ""),
        "agents_run": state.get("agents_run", []) + ["triage_agent"]
    }


# ─────────────────────────────────────────
# AGENT 2: ESCALATION CHECK
#
# What it does:
# Looks at risk_level from Triage Agent
# Decides if this needs a human reviewer or
# can get an automated first-pass review
#
# Why it exists:
# This is the DECISION POINT in our graph.
# High-risk changes (auth, payments, migrations)
# should never be rubber-stamped by AI alone —
# they get flagged for a human instead.
# ─────────────────────────────────────────

def escalation_check(state: ReviewState) -> ReviewState:
    print(">> Escalation Check running...")

    risk_level = state.get("risk_level", "medium")
    diff = state.get("code_diff", "").lower()

    sensitive_patterns = [
        "password", "secret", "api_key", "auth",
        "payment", "stripe", "migration", "drop table",
        "delete from", ".env"
    ]

    needs_human_review = (
        risk_level in ("high", "critical") or
        any(pattern in diff for pattern in sensitive_patterns)
    )

    return {
        **state,
        "needs_human_review": needs_human_review,
        "assigned_to": "Human Reviewer" if needs_human_review else "AI Reviewer",
        "agents_run": state.get("agents_run", []) + ["escalation_check"]
    }


# ─────────────────────────────────────────
# ROUTING FUNCTION
#
# What it does:
# This is NOT an agent. This is a router.
# It looks at the state and tells LangGraph
# which node to go to next.
# ─────────────────────────────────────────

def route_after_escalation(state: ReviewState) -> str:
    if state.get("needs_human_review"):
        return "escalated"
    else:
        return "continue"


# ─────────────────────────────────────────
# AGENT 3: KNOWLEDGE AGENT
#
# What it does:
# Only runs for lower-risk changes
# Determines what the review should focus on
# based on the change type
#
# Why it exists:
# A "Dependency Update" needs a different review
# lens than a "Feature" or "Bug Fix" — this agent
# sets that focus before the review is written.
# ─────────────────────────────────────────

def knowledge_agent(state: ReviewState) -> ReviewState:
    print(">> Knowledge Agent running...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": f"""You are a code review knowledge agent for {state['change_type']} changes.
                State the single most important thing this review should focus on, in 1-2 sentences. No fluff."""
            },
            {
                "role": "user",
                "content": f"PR Title: {state['pr_title']}\nDiff:\n{state['code_diff']}"
            }
        ],
        temperature=0.2,
        max_tokens=150
    )

    return {
        **state,
        "review_focus": response.choices[0].message.content.strip(),
        "agents_run": state.get("agents_run", []) + ["knowledge_agent"]
    }


# ─────────────────────────────────────────
# AGENT 4: RESPONSE AGENT
#
# What it does:
# Takes everything collected so far
# Writes the final review comment
#
# Why it exists:
# This agent has the FULL context now —
# change type, risk level, and review focus —
# so it can write a much sharper review than
# if it worked alone.
# ─────────────────────────────────────────

def response_agent(state: ReviewState) -> ReviewState:
    print(">> Response Agent running...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a senior software engineer doing a code review.
                Write a clear, constructive review comment.
                - Be direct but respectful
                - Point out specific concerns if any, referencing the diff
                - Give a clear verdict: Approve, Request Changes, or Comment
                - Keep it under 4 sentences
                - Do not use placeholder text"""
            },
            {
                "role": "user",
                "content": f"""
                PR Title: {state['pr_title']}
                Change Type: {state['change_type']}
                Risk Level: {state['risk_level']}
                Review Focus: {state['review_focus']}
                Diff:
                {state['code_diff']}

                Write the review comment:
                """
            }
        ],
        temperature=0.4,
        max_tokens=250
    )

    return {
        **state,
        "review_comment": response.choices[0].message.content.strip(),
        "agents_run": state.get("agents_run", []) + ["response_agent"]
    }


# ─────────────────────────────────────────
# ESCALATION RESPONSE AGENT
#
# What it does:
# Only runs for high/critical risk PRs
# Writes a different message that flags
# the PR for mandatory human review
#
# Why it exists:
# High-risk changes (auth, payments, migrations)
# should never get an AI-generated approval —
# this agent hands it off clearly instead.
# ─────────────────────────────────────────

def escalation_response_agent(state: ReviewState) -> ReviewState:
    print(">> Escalation Response Agent running...")

    return {
        **state,
        "review_comment": f"This PR ('{state['pr_title']}') touches high-risk code ({state['risk_reason']}). It has been flagged for mandatory senior engineer review before merge. No automated approval has been given.",
        "agents_run": state.get("agents_run", []) + ["escalation_response_agent"]
    }


# ─────────────────────────────────────────
# BUILD THE GRAPH
# ─────────────────────────────────────────

def build_graph():
    graph = StateGraph(ReviewState)

    graph.add_node("triage_agent", triage_agent)
    graph.add_node("escalation_check", escalation_check)
    graph.add_node("knowledge_agent", knowledge_agent)
    graph.add_node("response_agent", response_agent)
    graph.add_node("escalation_response_agent", escalation_response_agent)

    graph.set_entry_point("triage_agent")

    graph.add_edge("triage_agent", "escalation_check")

    graph.add_conditional_edges(
        "escalation_check",
        route_after_escalation,
        {
            "escalated": "escalation_response_agent",
            "continue": "knowledge_agent"
        }
    )

    graph.add_edge("knowledge_agent", "response_agent")
    graph.add_edge("response_agent", END)
    graph.add_edge("escalation_response_agent", END)

    return graph.compile()


# ─────────────────────────────────────────
# MAIN DISPATCH FUNCTION
# ─────────────────────────────────────────

def dispatch(pr_title: str, code_diff: str) -> dict:

    app = build_graph()

    initial_state = {
        "pr_title": pr_title,
        "code_diff": code_diff,
        "change_type": "",
        "risk_level": "",
        "risk_reason": "",
        "review_focus": "",
        "review_comment": "",
        "needs_human_review": False,
        "assigned_to": "",
        "agents_run": []
    }

    final_state = app.invoke(initial_state)

    return {
        "change_type": final_state["change_type"],
        "risk_level": final_state["risk_level"],
        "risk_reason": final_state["risk_reason"],
        "review_focus": final_state["review_focus"],
        "reviewComment": final_state["review_comment"],
        "needs_human_review": final_state["needs_human_review"],
        "assigned_reviewer": final_state["assigned_to"],
        "agents_run": final_state["agents_run"]
    }