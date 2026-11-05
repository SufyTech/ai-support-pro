"""
Fills the 'caught_yes_no' and 'notes' columns in test-prs/results.csv.

Rule used: "yes" only if the review comment names the planted bug.
Run from the project root:  python fill_results.py
"""
import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, "test-prs", "results.csv")

# PRs where the comment did NOT name the planted bug (none in run 3)
MISSED = set()

NOTES = {
    "07-payment-from-client.diff": "Now says price is trusted from the client",
    "08-migration-drops-column.diff": "Rated medium by AI, escalated by keyword rule",
    "12-always-true-condition.diff": "Now names the always-true 'or owner' condition",
    "15-open-cors.diff": "Now rated high and escalated",
    "20-clean-no-bug.diff": "Clean PR, not escalated (correct); style nitpicks only",
}

with open(PATH, encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

for r in rows:
    r["caught_yes_no"] = "no" if r["pr"] in MISSED else "yes"
    r["notes"] = NOTES.get(r["pr"], "")

with open(PATH, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

# Summary (the clean PR, file 20, is not counted as a planted bug)
bugs = [r for r in rows if not r["pr"].startswith("20-")]
caught = sum(1 for r in bugs if r["caught_yes_no"] == "yes")
print(f"Caught {caught} of {len(bugs)} planted bugs")
print("done")