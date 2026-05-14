import sys
import json

def classify_ticket(subject: str, description: str):
    text = f"{subject} {description}".lower()

    # Very simple keyword-based rules
    if any(word in text for word in ["payment", "card", "invoice", "billing", "refund"]):
        category = "Billing"
    elif any(word in text for word in ["error", "bug", "crash", "issue", "login", "password"]):
        category = "Technical"
    else:
        category = "General"

    if any(word in text for word in ["urgent", "immediately", "asap", "cannot", "can't", "failed", "error"]):
        priority = "High"
    elif any(word in text for word in ["soon", "whenever", "later"]):
        priority = "Low"
    else:
        priority = "Medium"

    return {
        "category": category,
        "priority": priority
    }

def main():
    # Read JSON from stdin
    raw = sys.stdin.read()
    data = json.loads(raw)
    subject = data.get("subject", "")
    description = data.get("description", "")

    result = classify_ticket(subject, description)
    print(json.dumps(result))

if __name__ == "__main__":
    main()