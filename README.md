# 🛡 Gmail Risk Analyzer

An AI-powered phishing risk detection Chrome extension that analyzes email content and predicts potential harm before user interaction.

This tool helps users identify suspicious emails before clicking malicious links, reducing phishing-related risks.

---

## 🚀 Features

- Dynamic phishing risk scoring (0–100%)
- Urgency and psychological manipulation detection
- Suspicious link and domain analysis
- Trusted sender domain verification
- Authority impersonation detection
- Context-aware trust adjustment (reduces false positives)
- Premium modal UI with dynamic risk-based color feedback
- Chrome extension integration with Gmail

---

## 🧠 How It Works

The system evaluates emails using a hybrid scoring approach.

### 🔴 Risk Signals
- Urgency keywords (e.g., "urgent", "verify", "suspended")
- Manipulation phrases (e.g., "immediate action required")
- Suspicious domain extensions (.xyz, .top, .click, etc.)
- Generic greeting detection ("Dear Customer")
- Authority impersonation patterns

### 🟢 Trust Signals
- Verified trusted sender domain
- Link-domain consistency check
- Official footer indicators (privacy policy, unsubscribe, etc.)

Final Risk Score = Risk Signals – Trust Signals  
Score is normalized between 0–100 and categorized as:

- 0–39 → Low Risk  
- 40–69 → Medium Risk  
- 70–100 → High Risk  

---

## 🏗 Project Structure

```
gmail-risk-analyzer/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── extension/
│   ├── manifest.json
│   ├── content.js
│   └── icons/
│
└── README.md
```

---

## 🖥 Backend Setup (Local Development)

1. Navigate to backend folder:

```
cd backend
```

2. Create virtual environment:

```
python -m venv venv
```

3. Activate environment (Windows):

```
venv\Scripts\activate
```

4. Install dependencies:

```
pip install -r requirements.txt
```

5. Run the FastAPI server:

```
uvicorn main:app --reload
```

The API will run at:

```
http://127.0.0.1:8000
```

---

## 🧩 Chrome Extension Installation (Developer Mode)

1. Open Google Chrome
2. Go to: `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the `extension` folder

The Gmail Risk Analyzer will now integrate with Gmail.

---

## 🌍 Deployment

The backend can be deployed using free hosting services such as:

- Render
- Railway
- AWS (Free Tier)
- Azure (Student credits)

After deployment, update the backend API URL inside `content.js`.

---

## 📌 Future Improvements

- LLM-based contextual explanation engine
- Domain reputation API integration
- Gmail dark mode compatibility
- Chrome Web Store publication
- Real-time inbox monitoring
- Adaptive machine learning scoring model

---

## ⚠ Disclaimer

This tool is developed for educational and cybersecurity awareness purposes.  
It does not guarantee 100% phishing detection accuracy.

Users should always verify suspicious emails independently.

---

## 👨‍💻 Author

Developed by Harish Raghul  
Computer Science Student | AI & Cybersecurity Enthusiast