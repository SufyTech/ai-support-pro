"""
Creates a folder called test-prs with 20 small diff files,
each with ONE planted bug (the last one is clean, to test false alarms).
Also creates planted_bugs.csv = the answer key.

Run:  python make_test_prs.py
"""
import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "test-prs")
os.makedirs(OUT, exist_ok=True)

# (slug, PR title, file path, planted bug, added code)
CASES = [
("01-sql-injection", "Add user lookup by name", "app/users.py", "SQL injection",
"""def find_user(conn, name):
    query = "SELECT * FROM users WHERE name = '" + name + "'"
    return conn.execute(query).fetchall()
"""),
("02-hardcoded-api-key", "Add payment client", "app/payment_client.py", "Hardcoded API key",
"""import requests

API_KEY = "FAKE_KEY_for_testing_only"

def create_charge(amount, token):
    return requests.post(
        "https://api.payments.example/v1/charges",
        headers={"Authorization": "Bearer " + API_KEY},
        json={"amount": amount, "source": token},
    ).json()
"""),
("03-missing-auth-check", "Add delete user endpoint", "app/routes.py", "Missing auth check on destructive endpoint",
"""@router.delete("/users/{user_id}")
def delete_user(user_id: int, db=Depends(get_db)):
    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    return {"deleted": user_id}
"""),
("04-off-by-one", "Add batch processor", "app/batch.py", "Off-by-one error (IndexError)",
"""def process_all(items):
    results = []
    for i in range(len(items) + 1):
        results.append(items[i].strip().lower())
    return results
"""),
("05-null-not-handled", "Add email normalizer", "app/profile.py", "None not handled (AttributeError)",
"""def get_email(db, user_id):
    user = db.get(user_id)
    return user.email.lower()
"""),
("06-password-logged", "Add login logging", "app/auth.py", "Password written to logs",
"""import logging
logger = logging.getLogger(__name__)

def login(email, password):
    logger.info(f"Login attempt: email={email} password={password}")
    return check_credentials(email, password)
"""),
("07-payment-from-client", "Add checkout endpoint", "app/checkout.py", "Price trusted from the client",
"""@router.post("/checkout")
def checkout(request: Request):
    data = request.json()
    amount = data["amount"]
    return charge_card(data["card_token"], amount)
"""),
("08-migration-drops-column", "Clean up users table", "migrations/0042_cleanup_users.sql", "Migration drops a column with live data",
"""ALTER TABLE users DROP COLUMN email;
ALTER TABLE users DROP COLUMN phone;
"""),
("09-path-traversal", "Add file download", "app/files.py", "Path traversal (no input validation)",
"""@router.get("/download")
def download(name: str):
    with open("/var/data/uploads/" + name, "rb") as f:
        return Response(f.read())
"""),
("10-infinite-loop", "Add retry for API calls", "app/retry.py", "Infinite loop (no retry limit)",
"""def call_with_retry(fn):
    while True:
        try:
            return fn()
        except ConnectionError:
            time.sleep(1)
            continue
"""),
("11-race-condition", "Add visit counter", "app/stats.py", "Race condition on shared counter",
"""visits = 0

def record_visit():
    global visits
    current = visits
    time.sleep(0.001)
    visits = current + 1
"""),
("12-always-true-condition", "Add admin check", "app/permissions.py", "Always-true condition (role check bypass)",
"""def is_privileged(user):
    if user.role == "admin" or "owner":
        return True
    return False
"""),
("13-unclosed-connection", "Add report query", "app/reports.py", "Database connection never closed",
"""def count_orders():
    conn = sqlite3.connect("orders.db")
    cur = conn.execute("SELECT COUNT(*) FROM orders")
    return cur.fetchone()[0]
"""),
("14-md5-hashing", "Add password hashing", "app/security.py", "Weak password hashing (MD5)",
"""import hashlib

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()
"""),
("15-open-cors", "Enable CORS", "app/main.py", "CORS open to all origins with credentials",
"""app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""),
("16-divide-by-zero", "Add average score", "app/scores.py", "Division by zero on empty list",
"""def average_score(scores):
    return sum(scores) / len(scores)
"""),
("17-swallowed-exception", "Add charge wrapper", "app/billing.py", "Exception swallowed silently",
"""def safe_charge(customer, amount):
    try:
        charge(customer, amount)
    except:
        pass
"""),
("18-admin-no-role-check", "Add admin export", "app/admin.py", "Admin endpoint with no role check",
"""@router.get("/admin/export-users")
def export_users(user=Depends(get_current_user), db=Depends(get_db)):
    rows = db.execute("SELECT * FROM users").fetchall()
    return [dict(r) for r in rows]
"""),
("19-secret-in-config", "Add production config", "config/settings.py", "Secrets committed in config file",
"""DATABASE_URL = "postgresql://admin:Pr0dP@ssw0rd!@db.internal:5432/app"
JWT_SECRET = "super-secret-signing-key-2024"
DEBUG = False
"""),
("20-clean-no-bug", "Add slugify helper", "app/utils.py", "NONE (clean PR, should not be flagged)",
"""import re

def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")
"""),
]

key_rows = []
for slug, title, path, bug, code in CASES:
    lines = code.rstrip("\n").split("\n")
    diff = (
        f"PR title: {title}\n\n"
        f"diff --git a/{path} b/{path}\n"
        f"--- a/{path}\n+++ b/{path}\n"
        f"@@ -0,0 +1,{len(lines)} @@\n"
        + "\n".join("+" + ln for ln in lines) + "\n"
    )
    with open(os.path.join(OUT, slug + ".diff"), "w", encoding="utf-8") as f:
        f.write(diff)
    key_rows.append([slug + ".diff", bug])

with open(os.path.join(OUT, "planted_bugs.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["pr", "planted_bug"])
    w.writerows(key_rows)

print(f"Created {len(CASES)} diff files in: {OUT}")
