# ai-agents/responder.py
import sys
import json
import os
from groq import Groq


def generate_reply(subject: str, description: str, category: str | None) -> str:
    """
    Use the Groq LLM to generate a support reply.
    Falls back to a safe static reply if anything goes wrong, so the app never breaks.
    """

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        # No API key set – return fallback so backend and UI keep working
        return (
            "Hi there,\n\n"
            "Thanks for reaching out. Our automated reply system is temporarily "
            "unavailable, but a member of our support team will review your request "
            "and follow up shortly.\n\n"
            "Best regards,\n"
            "Support Team"
        )

    client = Groq(api_key=api_key)

    # Build a clear prompt for the model
    prompt = f"""
You are a senior customer support agent for a SaaS product called "AI Support Pro".

Subject: {subject}
Category: {category}
Description: {description}

Write a concise, friendly, and professional reply to the customer:
- 3–6 sentences
- Do NOT mention that you are an AI
- Be specific to their issue based on the subject and description
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # You can change to any Groq-supported model
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful, concise customer support agent.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        reply_text = completion.choices[0].message.content
        return reply_text
    except Exception:
        # If Groq call fails, keep app stable with a generic reply
        return (
            "Hi there,\n\n"
            "Thanks for contacting us. We have received your request and are "
            "experiencing an issue with our automated reply system. A human "
            "support agent will review your ticket and follow up soon.\n\n"
            "Best regards,\n"
            "Support Team"
        )


def main():
    raw = sys.stdin.read()
    data = json.loads(raw)

    subject = data.get("subject", "")
    description = data.get("description", "")
    category = data.get("category")

    reply = generate_reply(subject, description, category)
    print(json.dumps({"suggestedReply": reply}))


if __name__ == "__main__":
    main()