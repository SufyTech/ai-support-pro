import os
import sys

# Fake key so importing the code never needs a real Groq key (tests never call Groq)
os.environ.setdefault("GROQ_API_KEY", "test-key-not-real")
os.environ.setdefault("QDRANT_URL", "http://localhost:6333")
os.environ.setdefault("QDRANT_API_KEY", "test-key-not-real")

# Make `import main` and `import ai_agents` work when pytest runs from backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
