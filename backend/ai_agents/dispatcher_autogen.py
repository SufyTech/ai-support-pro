# dispatcher_autogen.py
# Real AI-powered multi-agent ticket dispatcher using Groq

import os
import json
import sys
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────
# AGENT 1: TRIAGE AGENT
# Classifies the ticket category and priority
# ─────────────────────────────────────────
def triage_agent(subject: str, description: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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
                "content": f"Subject: {subject}\nDescription: {description}"
            }
        ],
        temperature=0.1,
        max_tokens=200
    )
    
    try:
        result = json.loads(response.choices[0].message.content.strip())
        return result
    except:
        return {
            "category": "General",
            "priority": "medium",
            "urgency_reason": "Unable to classify automatically"
        }


# ─────────────────────────────────────────
# AGENT 2: KNOWLEDGE AGENT
# Finds the best solution approach
# ─────────────────────────────────────────
def knowledge_agent(subject: str, description: str, category: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": f"""You are a customer support knowledge agent specializing in {category} issues.
                Your job is to identify the best solution approach for this ticket.
                Return a brief solution strategy in 1-2 sentences. No fluff."""
            },
            {
                "role": "user",
                "content": f"Subject: {subject}\nDescription: {description}"
            }
        ],
        temperature=0.2,
        max_tokens=150
    )
    
    return response.choices[0].message.content.strip()


# ─────────────────────────────────────────
# AGENT 3: RESPONSE AGENT
# Generates the final customer reply
# ─────────────────────────────────────────
def response_agent(subject: str, description: str, category: str, priority: str, solution_approach: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are a professional customer support agent.
                Write a helpful, empathetic, and concise reply to the customer.
                - Be warm but professional
                - Give a clear next step
                - Keep it under 3 sentences
                - Do not use placeholder text like [your name]"""
            },
            {
                "role": "user",
                "content": f"""
                Ticket Subject: {subject}
                Customer Description: {description}
                Category: {category}
                Priority: {priority}
                Solution Approach: {solution_approach}
                
                Write the customer reply:
                """
            }
        ],
        temperature=0.4,
        max_tokens=200
    )
    
    return response.choices[0].message.content.strip()


# ─────────────────────────────────────────
# AGENT 4: ESCALATION AGENT
# Decides if human escalation is needed
# ─────────────────────────────────────────
def escalation_agent(priority: str, category: str, description: str) -> dict:
    needs_escalation = priority == "urgent" or any(
        word in description.lower() 
        for word in ["legal", "lawsuit", "fraud", "hack", "breach", "stolen", "lawyer"]
    )
    
    return {
        "needs_escalation": needs_escalation,
        "escalation_reason": "High priority or sensitive issue detected" if needs_escalation else None,
        "assigned_to": "Human Agent" if needs_escalation else "AI AutoGen Agent"
    }


# ─────────────────────────────────────────
# MAIN DISPATCHER
# Orchestrates all 4 agents in sequence
# ─────────────────────────────────────────
def dispatch(subject: str, description: str) -> dict:
    # Agent 1: Triage
    triage_result = triage_agent(subject, description)
    category = triage_result.get("category", "General")
    priority = triage_result.get("priority", "medium")
    
    # Agent 2: Knowledge
    solution_approach = knowledge_agent(subject, description, category)
    
    # Agent 3: Response
    suggested_reply = response_agent(subject, description, category, priority, solution_approach)
    
    # Agent 4: Escalation
    escalation_result = escalation_agent(priority, category, description)
    
    return {
        "category": category,
        "priority": priority,
        "urgency_reason": triage_result.get("urgency_reason", ""),
        "solution_approach": solution_approach,
        "suggestedReply": suggested_reply,
        "needs_escalation": escalation_result["needs_escalation"],
        "assigned_agent": escalation_result["assigned_to"]
    }


# ─────────────────────────────────────────
# Run as script (called from main.py)
# ─────────────────────────────────────────
if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = dispatch(
        subject=input_data["subject"],
        description=input_data["description"]
    )
    print(json.dumps(result))