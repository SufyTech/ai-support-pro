"""
Runs every .diff file in this folder through your LOCAL review API
and saves the results to results.csv.

How to use:
1. Start your backend locally:   uvicorn main:app --port 8000
2. Keep this file in the project root (next to make_test_prs.py)
3. Run:   python run_tests.py
"""
import csv
import glob
import os
import time

import httpx

API_URL = "http://localhost:8000/api/reviews"
HERE = os.path.dirname(os.path.abspath(__file__))
# Works from the project root (finds test-prs folder) or from inside test-prs
FOLDER = HERE if glob.glob(os.path.join(HERE, "*.diff")) else os.path.join(HERE, "test-prs")
OUT_FILE = os.path.join(FOLDER, "results.csv")

files = sorted(glob.glob(os.path.join(FOLDER, "*.diff")))
print(f"Found {len(files)} diff files\n")

rows = []
for path in files:
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as f:
        diff = f.read()

    print(f"Running {name} ...", end=" ", flush=True)
    try:
        r = httpx.post(
            API_URL,
            json={"pr_title": name, "code_diff": diff},
            timeout=120,
        )
        r.raise_for_status()
        d = r.json()
        agents = d.get("agents_run", [])
        # If no agents ran, the AI call failed and the API used its default answer.
        ai_failed = len(agents) == 0
        rows.append({
            "pr": name,
            "risk_level": d.get("risk_level"),
            "needs_human_review": d.get("needs_human_review"),
            "agents_run": "|".join(agents),
            "ai_failed_fallback_used": ai_failed,
            "review_comment": (d.get("reviewComment") or "").replace("\n", " "),
            "caught_yes_no": "",   # YOU fill this in by reading the comment
            "notes": "",
        })
        print("FALLBACK (AI failed)" if ai_failed else f"ok, risk={d.get('risk_level')}")
    except Exception as e:
        rows.append({
            "pr": name, "risk_level": "", "needs_human_review": "",
            "agents_run": "", "ai_failed_fallback_used": True,
            "review_comment": f"ERROR: {e}", "caught_yes_no": "", "notes": "",
        })
        print(f"ERROR: {e}")

    time.sleep(2)  # avoid hitting Groq rate limits

with open(OUT_FILE, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

print(f"\nDone. Saved to {OUT_FILE}")
print("Now open results.csv and fill the 'caught_yes_no' column.")
