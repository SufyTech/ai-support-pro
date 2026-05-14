import sys
import json

from crewai import Agent, Task, Crew  # type: ignore

def read_input():
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    return json.loads(raw)

def write_output(data):
    sys.stdout.write(json.dumps(data))
    sys.stdout.flush()

def main():
    payload = read_input()
    subject = payload.get("subject", "")
    description = payload.get("description", "")

    if not subject or not description:
        write_output({
            "category": None,
            "priority": None,
            "suggestedReply": None,
        })
        return

    ticket_text = f"Subject: {subject}\n\nDescription: {description}"

    # Agents will use the default LLM configured via environment variables
    classifier = Agent(
        role="Support Ticket Classifier",
        goal="Classify the ticket into a support category and priority level.",
        backstory=(
            "You help a SaaS support team by quickly categorizing tickets and "
            "assigning a clear priority based on urgency and business impact."
        ),
        verbose=False,
        allow_delegation=False,
    )

    responder = Agent(
        role="Customer Support Specialist",
        goal="Write a clear, empathetic reply to the customer based on the ticket.",
        backstory=(
            "You are an expert SaaS support agent who writes concise, friendly, "
            "and helpful replies that directly address the customer's issue."
        ),
        verbose=False,
        allow_delegation=False,
    )

    classification_task = Task(
        description=(
            "Read the following ticket and decide:\n"
            "- A short category like Billing, Login, Outage, Account, or Other.\n"
            "- A priority: High, Medium, or Low.\n\n"
            f"{ticket_text}\n\n"
            "Respond ONLY in strict JSON with keys: category, priority."
        ),
        agent=classifier,
        expected_output="A JSON object with keys: category, priority.",
    )

    responder_task = Task(
        description=(
            "Write a concise, empathetic reply to the customer for this ticket:\n\n"
            f"{ticket_text}\n\n"
            "Use a professional but friendly tone. Focus on what they should try "
            "next or what you will do. Reply directly to the customer.\n\n"
            "Return ONLY the reply text, no JSON."
        ),
        agent=responder,
        expected_output="A plain text reply suitable to send to the customer.",
    )

    crew = Crew(
        agents=[classifier, responder],
        tasks=[classification_task, responder_task],
        verbose=False,
    )

    result = crew.kickoff()

    category = None
    priority = None
    suggested_reply = None

    try:
        raw_classification = getattr(classification_task, "output", None)
        if raw_classification is not None:
            raw_str = (
                raw_classification.raw
                if hasattr(raw_classification, "raw")
                else str(raw_classification)
            )
            try:
                parsed = json.loads(raw_str)
                category = parsed.get("category")
                priority = parsed.get("priority")
            except Exception:
                category = None
                priority = None

        raw_reply = getattr(responder_task, "output", None)
        if raw_reply is not None:
            suggested_reply = (
                raw_reply.raw if hasattr(raw_reply, "raw") else str(raw_reply)
            )

    except Exception:
        category = None
        priority = None
        suggested_reply = None

    write_output({
        "category": category,
        "priority": priority,
        "suggestedReply": suggested_reply,
    })


if __name__ == "__main__":
    main()