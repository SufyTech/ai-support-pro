import sys
import json
import os
import logging

# Redirect all AutoGen logs to /dev/null BEFORE importing
logging.basicConfig(level=logging.CRITICAL)
logging.getLogger().setLevel(logging.CRITICAL)

# Suppress all warnings and info
import warnings
warnings.filterwarnings('ignore')

from autogen import AssistantAgent, UserProxyAgent  # type: ignore

# Suppress AutoGen logging
logging.getLogger("autogen").setLevel(logging.CRITICAL)


def read_input():
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    return json.loads(raw)


def write_output(data):
    sys.stdout.write(json.dumps(data))
    sys.stdout.flush()


def main():
    # Redirect stderr to suppress all debug output
    original_stderr = sys.stderr
    sys.stderr = open(os.devnull, 'w')
    
    try:
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

        groq_key = os.environ.get("GROQ_API_KEY")
        if not groq_key:
            write_output({
                "category": None,
                "priority": None,
                "suggestedReply": None,
            })
            return

        ticket_text = f"Subject: {subject}\n\nDescription: {description}"

        llm_config = {
            "config_list": [
                {
                    "api_type": "groq",
                    "model": "llama-3.1-8b-instant",
                    "api_key": groq_key,
                }
            ]
        }

        classifier_agent = AssistantAgent(
            "classifier_agent",
            system_message=(
                "You are a SaaS support ticket classifier.\n"
                "Your job is to assign:\n"
                "1) category: one of [\"Billing\", \"Login\", \"Outage\", \"Account\", \"Other\"].\n"
                "2) priority: one of [\"High\", \"Medium\", \"Low\"].\n\n"
                "You MUST respond with STRICT JSON only, no explanation, no markdown, "
                "no extra keys:\n"
                "{ \"category\": \"Billing|Login|Outage|Account|Other\","
                "  \"priority\": \"High|Medium|Low\" }"
            ),
            llm_config=llm_config,
        )

        responder_agent = AssistantAgent(
            "responder_agent",
            system_message=(
                "You are a senior SaaS support agent.\n"
                "Write a short (4–6 sentences), empathetic reply that can be sent "
                "directly to the customer.\n"
                "Be specific, mention what you will do or what they should try next.\n"
                "Reply in plain text only, no JSON, no markdown, no headings."
            ),
            llm_config=llm_config,
        )

        user_proxy = UserProxyAgent(
            "user_proxy",
            human_input_mode="NEVER",
            code_execution_config=False,
            max_consecutive_auto_reply=0,
        )

        classification_prompt = (
            "Classify this customer support ticket.\n\n"
            f"{ticket_text}\n\n"
            "Think about urgency and business impact:\n"
            "- Use \"High\" for outages, production incidents, security problems, or blocked payments.\n"
            "- Use \"Medium\" for important but not blocking issues.\n"
            "- Use \"Low\" for minor questions or cosmetic issues.\n\n"
            "Now respond ONLY with JSON like "
            "{\"category\":\"Billing\",\"priority\":\"High\"} with double quotes and no trailing commas."
        )

        class_response = user_proxy.initiate_chat(
            classifier_agent,
            message=classification_prompt,
            max_turns=1,
            silent=True,
        )

        category = None
        priority = None

        try:
            class_text = str(class_response.chat_history[-1]["content"])
            parsed = json.loads(class_text)
            category = parsed.get("category")
            priority = parsed.get("priority")
        except Exception:
            category = None
            priority = None

        reply_prompt = (
            "Write a reply for this customer support ticket:\n\n"
            f"{ticket_text}\n\n"
            "Assume this has already been classified by an internal system.\n"
            "Your reply should:\n"
            "- Acknowledge the problem.\n"
            "- Explain next steps or what you're checking on your side.\n"
            "- Be friendly but concise.\n"
            "Reply in plain text only."
        )

        reply_response = user_proxy.initiate_chat(
            responder_agent,
            message=reply_prompt,
            max_turns=1,
            silent=True,
        )

        suggested_reply = None

        try:
            suggested_reply = str(reply_response.chat_history[-1]["content"])
        except Exception:
            suggested_reply = None

        write_output({
            "category": category,
            "priority": priority,
            "suggestedReply": suggested_reply,
        })
    
    finally:
        # Restore stderr
        sys.stderr.close()
        sys.stderr = original_stderr


if __name__ == "__main__":
    main()