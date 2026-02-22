console.log("📌 Gmail Phishing Risk Analyzer loaded");
const style = document.createElement("style");
style.innerHTML = `
#risk-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100vh;
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.85);
  box-shadow: -8px 0 30px rgba(0,0,0,0.25);
  padding: 24px;
  z-index: 999999;
  transform: translateX(100%);
  transition: transform 0.4s ease;
  font-family: 'Segoe UI', sans-serif;
}

#risk-panel.active {
  transform: translateX(0);
}

.risk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.risk-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.risk-bar-container {
  height: 12px;
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 6px;
}

.risk-bar {
  height: 100%;
  transition: width 0.6s ease;
}

.pulse {
  animation: pulseGlow 1.5s infinite;
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 0px rgba(217,48,37,0.6); }
  50% { box-shadow: 0 0 15px rgba(217,48,37,0.9); }
  100% { box-shadow: 0 0 0px rgba(217,48,37,0.6); }
}
`;
document.head.appendChild(style);

// Create floating button once
function createFloatingButton() {
  if (document.getElementById("phishing-risk-fab")) return;

  const button = document.createElement("button");
  button.id = "phishing-risk-fab";
  button.innerText = "🔍 Analyze Email Risk";

  button.style.position = "fixed";
  button.style.bottom = "24px";
  button.style.right = "24px";
  button.style.zIndex = "99999";
  button.style.padding = "12px 16px";
  button.style.background = "#d93025";
  button.style.color = "#ffffff";
  button.style.border = "none";
  button.style.borderRadius = "50px";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

  button.onclick = async () => {
    const bodyDiv = document.querySelector("div.a3s");
    if (!bodyDiv) {
        alert("No email detected");
        return;
    }

    const emailText = bodyDiv.innerText.trim();

    button.innerText = "Analyzing...";
    button.disabled = true;

    try {
        const response = await fetch("https://gmail-phising-analyser.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: "unknown",
                subject: "unknown",
                body: emailText,
                links: []
            })
        });

        const result = await response.json();
        showResultPopup(result);

    } catch (error) {
        alert("Backend not reachable");
        console.error(error);
    }

    button.innerText = "🔍 Analyze Email Risk";
    button.disabled = false;
};

  document.body.appendChild(button);
  console.log("✅ Floating Analyze button injected");
}

// Observe page load
const observer = new MutationObserver(() => {
  if (window.location.hostname.includes("mail.google.com")) {
    createFloatingButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
function showResultPopup(result) {
  const existing = document.getElementById("risk-modal");
  if (existing) existing.remove();

  let bgColor = "#e6f4ea";     // green
  let accent = "#188038";

  if (result.risk_score >= 70) {
    bgColor = "#fdecea";       // red
    accent = "#d93025";
  } else if (result.risk_score >= 40) {
    bgColor = "#fff4e5";       // orange
    accent = "#f9ab00";
  }

  // Backdrop blur
  const overlay = document.createElement("div");
  overlay.id = "risk-modal";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.25)";
  overlay.style.backdropFilter = "blur(4px)";
  overlay.style.zIndex = "999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  const modal = document.createElement("div");
  modal.style.width = "380px";
  modal.style.maxHeight = "80vh";
  modal.style.overflowY = "auto";
  modal.style.background = bgColor;
  modal.style.borderRadius = "16px";
  modal.style.padding = "22px";
  modal.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
  modal.style.fontFamily = "Segoe UI, sans-serif";
  modal.style.transform = "scale(0.9)";
  modal.style.transition = "all 0.25s ease";

  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0;">🛡 Risk Analyzer</h2>
      <span style="
        background:${accent};
        color:white;
        padding:6px 12px;
        border-radius:20px;
        font-size:12px;
        font-weight:bold;
      ">
        ${result.verdict}
      </span>
    </div>

    <div style="margin-top:18px;">
      <div style="font-size:14px;">Risk Score</div>
      <div style="
        height:12px;
        background:#ddd;
        border-radius:8px;
        overflow:hidden;
        margin-top:6px;
      ">
        <div style="
          width:${result.risk_score}%;
          height:100%;
          background:${accent};
          transition:width 0.6s ease;
        "></div>
      </div>
      <div style="margin-top:6px; font-weight:bold; color:${accent};">
        ${result.risk_score}/100
      </div>
    </div>

    <div style="margin-top:20px;">
      <strong>Detected Signals</strong>
      <ul style="margin-top:8px; line-height:1.6;">
        ${result.signals.map(s => `<li>${s}</li>`).join("")}
      </ul>
    </div>

    <div style="
      margin-top:18px;
      padding:12px;
      border-radius:10px;
      background:rgba(0,0,0,0.05);
      font-size:14px;
    ">
      ${
        result.risk_score >= 70
          ? "⚠ Do NOT click any links. Delete immediately."
          : result.risk_score >= 40
          ? "⚠ Verify sender before interacting."
          : "✓ No immediate threat detected."
      }
    </div>

    <button id="close-risk-modal" style="
      margin-top:20px;
      padding:10px;
      width:100%;
      border:none;
      border-radius:10px;
      background:black;
      color:white;
      cursor:pointer;
      font-weight:bold;
    ">
      Close
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setTimeout(() => {
    modal.style.transform = "scale(1)";
  }, 50);

  document.getElementById("close-risk-modal").onclick = () => {
    overlay.remove();
  };
}
