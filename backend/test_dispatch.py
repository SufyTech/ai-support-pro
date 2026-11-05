from dotenv import load_dotenv
load_dotenv()

import traceback
from ai_agents.graph import dispatch

try:
    result = dispatch(
        pr_title="test",
        code_diff='+query = "SELECT * FROM users WHERE id=" + uid',
    )
    print("RESULT:", result)
except Exception:
    traceback.print_exc()