from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import re
from urllib.parse import urlparse

app = FastAPI()

# Enable CORS (needed for Chrome extension)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmailRequest(BaseModel):
    sender: str
    subject: str
    body: str
    links: List[str] = []


@app.post("/analyze")
def analyze_email(email: EmailRequest):
    risk_score = 0
    signals = []

    body_lower = email.body.lower()

    # ------------------------------------------------
    # 1️⃣ Urgency Detection
    # ------------------------------------------------
    urgency_keywords = [
        "urgent", "immediately", "act now",
        "verify", "suspended", "limited time"
    ]

    urgency_hits = sum(1 for word in urgency_keywords if word in body_lower)

    if urgency_hits >= 3:
        risk_score += 30
    elif urgency_hits == 2:
        risk_score += 20
    elif urgency_hits == 1:
        risk_score += 10

    if urgency_hits > 0:
        signals.append("Urgent or pressure language detected")

    # ------------------------------------------------
    # 2️⃣ Psychological Manipulation
    # ------------------------------------------------
    manipulation_keywords = [
        "failure to respond",
        "immediate action required",
        "permanent suspension",
        "verify immediately",
        "account will be closed",
        "avoid termination"
    ]

    if any(word in body_lower for word in manipulation_keywords):
        risk_score += 20
        signals.append("Psychological pressure tactics detected")

    # ------------------------------------------------
    # 3️⃣ Authority Impersonation
    # ------------------------------------------------
    authority_keywords = [
        "bank", "admin", "it support",
        "government", "security",
        "support team", "billing department",
        "finance department", "account team"
    ]

    if any(word in body_lower for word in authority_keywords):
        risk_score += 20
        signals.append("Possible authority impersonation")

    # ------------------------------------------------
    # 4️⃣ Suspicious Domain Extensions
    # ------------------------------------------------
    suspicious_tlds = [".xyz", ".top", ".click", ".info", ".ru"]

    if any(tld in body_lower for tld in suspicious_tlds):
        risk_score += 25
        signals.append("Suspicious domain extension detected")

    # ------------------------------------------------
    # 5️⃣ URL Extraction
    # ------------------------------------------------
    url_pattern = r"http[s]?://\S+"
    urls_found = re.findall(url_pattern, email.body)

    if len(urls_found) > 0:
        risk_score += 15
        signals.append("Suspicious links detected")

    # ------------------------------------------------
    # 6️⃣ Generic Greeting Detection
    # ------------------------------------------------
    generic_greetings = [
        "dear customer",
        "dear user",
        "valued customer",
        "dear client"
    ]

    if any(greet in body_lower for greet in generic_greetings):
        risk_score += 10
        signals.append("Generic greeting detected")

    # ------------------------------------------------
    # 7️⃣ Trusted Sender Domain Check (Trust Signal)
    # ------------------------------------------------
    trusted_domains = [
        "tcs.com",
        "google.com",
        "microsoft.com",
        "amazon.com",
        "infosys.com"
    ]

    sender_domain = ""
    if "@" in email.sender:
        sender_domain = email.sender.split("@")[-1].lower()

    if sender_domain in trusted_domains:
        risk_score -= 20
        signals.append("Verified trusted sender domain")

    # ------------------------------------------------
    # 8️⃣ Link Domain Consistency Check
    # ------------------------------------------------
    for url in urls_found:
        domain = urlparse(url).netloc.lower()
        if sender_domain and sender_domain in domain:
            risk_score -= 10
            signals.append("Link matches sender domain")

    # ------------------------------------------------
    # 9️⃣ Official Footer Indicators
    # ------------------------------------------------
    legit_indicators = [
        "copyright",
        "all rights reserved",
        "unsubscribe",
        "privacy policy",
        "terms and conditions"
    ]

    if any(word in body_lower for word in legit_indicators):
        risk_score -= 10
        signals.append("Contains official footer indicators")

    # ------------------------------------------------
    # 🔟 Normalize Score (Prevent Negative)
    # ------------------------------------------------
    risk_score = max(0, min(risk_score, 100))

    # ------------------------------------------------
    # Final Verdict Logic
    # ------------------------------------------------
    if risk_score >= 70:
        verdict = "High Risk"
    elif risk_score >= 40:
        verdict = "Medium Risk"
    else:
        verdict = "Low Risk"

    return {
        "risk_score": risk_score,
        "signals": signals,
        "verdict": verdict
    }
    # ------------------------------------------------
    # 1️⃣1️⃣ Strong Legitimacy Override
    # ------------------------------------------------
    if (
        sender_domain in trusted_domains
        and len(urls_found) > 0
        and all(sender_domain in urlparse(url).netloc.lower() for url in urls_found)
    ):
        # Cap risk if fully consistent trusted domain
        risk_score = min(risk_score, 10)
        signals.append("Domain consistency verified")