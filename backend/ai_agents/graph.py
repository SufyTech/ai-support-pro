# graph.py
# LangGraph-based multi-agent orchestration for AI Support Pro

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
# Think of it as a ticket form that gets
# filled in step by step.
# ─────────────────────────────────────────

class TicketState(TypedDict):
    # Input from user
    subject: str
    description: str
    
    # Filled by Triage Agent
    category: str
    priority: str
    urgency_reason: str
    
    # Filled by Knowledge Agent
    solution_approach: str
    
    # Filled by Response Agent
    suggested_reply: str
    
    # Filled by Escalation Agent
    needs_escalation: bool
    assigned_to: str
    
    # Tracks which agents ran
    # We will use this in observability later
    agents_run: list


# ─────────────────────────────────────────
# AGENT 1: TRIAGE AGENT
# 
# What it does:
# Reads the ticket subject and description
# Decides the category and priority
# 
# Why it exists:
# Before any other agent can help, we need
# to know WHAT type of problem this is and
# HOW urgent it is. This drives all other
# decisions in the graph.
# ─────────────────────────────────────────

def triage_agent(state: TicketState) -> TicketState:
    print(">> Triage Agent running...")
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a customer support triage agent. 
                Analyze the support ticket and return ONLY a JSON object with:
                - category: one of [Technical, Billing, Login, Feature Request, General]
                - priority: one of [low, medium, high, urgent]
                - urgency_reason: one sentence explaining the priority
                
                Return ONLY valid JSON, no other text."""
            },
            {
                "role": "user",
                "content": f"Subject: {state['subject']}\nDescription: {state['description']}"
            }
        ],
        temperature=0.1,
        max_tokens=200
    )
    
    try:
        result = json.loads(response.choices[0].message.content.strip())
    except:
        result = {
            "category": "General",
            "priority": "medium",
            "urgency_reason": "Unable to classify automatically"
        }
    
    # Write results back to state
    # and track that this agent ran
    return {
        **state,
        "category": result.get("category", "General"),
        "priority": result.get("priority", "medium"),
        "urgency_reason": result.get("urgency_reason", ""),
        "agents_run": state.get("agents_run", []) + ["triage_agent"]
    }


# ─────────────────────────────────────────
# AGENT 2: ESCALATION CHECK
#
# What it does:
# Looks at priority from Triage Agent
# Decides if this needs a human or can
# be handled by AI
#
# Why it exists:
# This is the DECISION POINT in our graph.
# This is what makes LangGraph powerful.
# Based on this decision, the graph takes
# a completely different path.
# Urgent tickets → go to human
# Normal tickets → go to Knowledge Agent
# ─────────────────────────────────────────

def escalation_check(state: TicketState) -> TicketState:
    print(">> Escalation Check running...")
    
    priority = state.get("priority", "medium")
    description = state.get("description", "").lower()
    
    # Check for urgent priority or sensitive words
    sensitive_words = [
        "legal", "lawsuit", "fraud", 
        "hack", "breach", "stolen", "lawyer"
    ]
    
    needs_escalation = (
        priority == "urgent" or 
        any(word in description for word in sensitive_words)
    )
    
    return {
        **state,
        "needs_escalation": needs_escalation,
        "assigned_to": "Human Agent" if needs_escalation else "AI Agent",
        "agents_run": state.get("agents_run", []) + ["escalation_check"]
    }


# ─────────────────────────────────────────
# ROUTING FUNCTION
#
# What it does:
# This is NOT an agent. This is a router.
# It looks at the state and tells LangGraph
# which node to go to next.
#
# Why it exists:
# This is the core of LangGraph. Without this
# routing function, we just have sequential
# functions like before. With this, the graph
# makes intelligent decisions about flow.
# ─────────────────────────────────────────

def route_after_escalation(state: TicketState) -> str:
    if state.get("needs_escalation"):
        # Skip AI response, go straight to end
        return "escalated"
    else:
        # Continue to knowledge agent
        return "continue"


# ─────────────────────────────────────────
# AGENT 3: KNOWLEDGE AGENT
#
# What it does:
# Only runs for NON-urgent tickets
# Finds the best solution approach
# based on the category
#
# Why it exists:
# Different categories need different
# solution strategies. A billing issue
# needs a different approach than a
# technical bug.
# ─────────────────────────────────────────

def knowledge_agent(state: TicketState) -> TicketState:
    print(">> Knowledge Agent running...")
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": f"""You are a knowledge agent for {state['category']} issues.
                Find the best solution approach in 1-2 sentences. No fluff."""
            },
            {
                "role": "user",
                "content": f"Subject: {state['subject']}\nDescription: {state['description']}"
            }
        ],
        temperature=0.2,
        max_tokens=150
    )
    
    return {
        **state,
        "solution_approach": response.choices[0].message.content.strip(),
        "agents_run": state.get("agents_run", []) + ["knowledge_agent"]
    }


# ─────────────────────────────────────────
# AGENT 4: RESPONSE AGENT
#
# What it does:
# Takes everything collected so far
# Writes the final reply to the customer
#
# Why it exists:
# This agent has the FULL context now.
# It knows category, priority, and the
# solution approach. So it can write
# a much better reply than if it worked
# alone without the other agents.
# ─────────────────────────────────────────

def response_agent(state: TicketState) -> TicketState:
    print(">> Response Agent running...")
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a professional customer support agent.
                Write a helpful, empathetic reply.
                - Be warm but professional
                - Give a clear next step
                - Keep it under 3 sentences
                - Do not use placeholder text"""
            },
            {
                "role": "user",
                "content": f"""
                Subject: {state['subject']}
                Description: {state['description']}
                Category: {state['category']}
                Priority: {state['priority']}
                Solution Approach: {state['solution_approach']}
                
                Write the customer reply:
                """
            }
        ],
        temperature=0.4,
        max_tokens=200
    )
    
    return {
        **state,
        "suggested_reply": response.choices[0].message.content.strip(),
        "agents_run": state.get("agents_run", []) + ["response_agent"]
    }


# ─────────────────────────────────────────
# ESCALATION RESPONSE AGENT
#
# What it does:
# Only runs for URGENT tickets
# Writes a different reply that tells
# the customer a human will contact them
#
# Why it exists:
# Urgent tickets need a different tone.
# We should not give an AI-generated
# solution for fraud or legal issues.
# ─────────────────────────────────────────

def escalation_response_agent(state: TicketState) -> TicketState:
    print(">> Escalation Response Agent running...")
    
    return {
        **state,
        "suggested_reply": f"We have received your urgent request regarding '{state['subject']}'. A senior human agent has been assigned and will contact you within 1 hour. We take this matter very seriously.",
        "agents_run": state.get("agents_run", []) + ["escalation_response_agent"]
    }


# ─────────────────────────────────────────
# BUILD THE GRAPH
#
# This is where we connect all agents.
# Think of this like drawing a flowchart
# in code. Each add_node is a box.
# Each add_edge is an arrow between boxes.
# add_conditional_edges is a decision diamond.
# ─────────────────────────────────────────

def build_graph():
    # Create the graph with our state
    graph = StateGraph(TicketState)
    
    # Add all agent nodes
    graph.add_node("triage_agent", triage_agent)
    graph.add_node("escalation_check", escalation_check)
    graph.add_node("knowledge_agent", knowledge_agent)
    graph.add_node("response_agent", response_agent)
    graph.add_node("escalation_response_agent", escalation_response_agent)
    
    # Set starting point
    graph.set_entry_point("triage_agent")
    
    # After triage, always go to escalation check
    graph.add_edge("triage_agent", "escalation_check")
    
    # After escalation check, make a decision
    # This is the KEY difference from your old code
    graph.add_conditional_edges(
        "escalation_check",
        route_after_escalation,
        {
            "escalated": "escalation_response_agent",
            "continue": "knowledge_agent"
        }
    )
    
    # Normal path: knowledge → response → end
    graph.add_edge("knowledge_agent", "response_agent")
    graph.add_edge("response_agent", END)
    
    # Escalation path: escalation response → end
    graph.add_edge("escalation_response_agent", END)
    
    return graph.compile()


# ─────────────────────────────────────────
# MAIN DISPATCH FUNCTION
# This replaces your old dispatch() function
# Same input, same output format
# But now powered by LangGraph
# ─────────────────────────────────────────

def dispatch(subject: str, description: str) -> dict:
    
    # Build the graph
    app = build_graph()
    
    # Set initial state
    initial_state = {
        "subject": subject,
        "description": description,
        "category": "",
        "priority": "",
        "urgency_reason": "",
        "solution_approach": "",
        "suggested_reply": "",
        "needs_escalation": False,
        "assigned_to": "",
        "agents_run": []
    }
    
    # Run the graph
    final_state = app.invoke(initial_state)
    
    # Return same format as before
    # so your existing API still works
    return {
        "category": final_state["category"],
        "priority": final_state["priority"],
        "urgency_reason": final_state["urgency_reason"],
        "solution_approach": final_state["solution_approach"],
        "suggestedReply": final_state["suggested_reply"],
        "needs_escalation": final_state["needs_escalation"],
        "assigned_agent": final_state["assigned_to"],
        "agents_run": final_state["agents_run"]
    }