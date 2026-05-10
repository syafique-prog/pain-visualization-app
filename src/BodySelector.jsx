import { useState } from "react";

export default function BodySelector({ onNext, onBack, t }) {
  const [toast, setToast] = useState(false);

  const handleClick = (part) => {
    if (part === "head") {
      onNext();
    } else {
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }
  };

  const muted = "#A78BFA";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "6px", display: "block" }}
        >
          {t.back}
        </button>
        <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: i < 2 ? "#6B21A8" : "#E9D5FF", transition: "background-color 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "#7C3AED", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {t.stepArea}
        </div>
        <h2 style={{ margin: "0 0 2px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.selectBodyPart}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>{t.tapBodyPart}</p>
      </div>

      {/* 2D Body Diagram */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(180deg, #0C0020 0%, #130030 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <svg
          viewBox="0 0 180 440"
          style={{ height: "min(340px, 88%)", width: "auto", overflow: "visible" }}
        >
          {/* Neck */}
          <rect x="81" y="95" width="18" height="18" rx="5"
            fill={muted} opacity="0.30" />

          {/* Torso */}
          <path
            d="M 57,113 C 43,117 39,144 41,174 C 43,204 49,222 55,238 L 125,238 C 131,222 137,204 139,174 C 141,144 137,117 123,113 Z"
            fill={muted} opacity="0.28"
            onClick={() => handleClick("torso")}
            style={{ cursor: "pointer" }}
          />

          {/* Left upper arm */}
          <path d="M 57,118 L 23,216 L 33,220 L 65,124 Z"
            fill={muted} opacity="0.24"
            onClick={() => handleClick("arm")}
            style={{ cursor: "pointer" }} />
          {/* Right upper arm */}
          <path d="M 123,118 L 157,216 L 147,220 L 115,124 Z"
            fill={muted} opacity="0.24"
            onClick={() => handleClick("arm")}
            style={{ cursor: "pointer" }} />

          {/* Left forearm */}
          <path d="M 23,214 L 15,288 L 25,290 L 33,218 Z"
            fill={muted} opacity="0.20"
            onClick={() => handleClick("arm")}
            style={{ cursor: "pointer" }} />
          {/* Right forearm */}
          <path d="M 157,214 L 165,288 L 155,290 L 147,218 Z"
            fill={muted} opacity="0.20"
            onClick={() => handleClick("arm")}
            style={{ cursor: "pointer" }} />

          {/* Left thigh */}
          <path d="M 63,236 L 55,346 L 75,348 L 83,236 Z"
            fill={muted} opacity="0.26"
            onClick={() => handleClick("leg")}
            style={{ cursor: "pointer" }} />
          {/* Right thigh */}
          <path d="M 117,236 L 125,346 L 105,348 L 97,236 Z"
            fill={muted} opacity="0.26"
            onClick={() => handleClick("leg")}
            style={{ cursor: "pointer" }} />

          {/* Left calf */}
          <path d="M 55,344 L 51,416 L 71,416 L 75,346 Z"
            fill={muted} opacity="0.20"
            onClick={() => handleClick("leg")}
            style={{ cursor: "pointer" }} />
          {/* Right calf */}
          <path d="M 125,344 L 129,416 L 109,416 L 105,346 Z"
            fill={muted} opacity="0.20"
            onClick={() => handleClick("leg")}
            style={{ cursor: "pointer" }} />

          {/* HEAD — interactive, pulsing glow */}
          <ellipse
            cx="90" cy="53" rx="36" ry="43"
            fill="#7C3AED"
            opacity="0.92"
            onClick={() => handleClick("head")}
            className="head-glow"
            style={{ cursor: "pointer" }}
          />
          {/* Ripple rings */}
          <ellipse cx="90" cy="53" rx="36" ry="43"
            fill="none" stroke="#A78BFA" strokeWidth="2"
            opacity="0"
            style={{ animation: "ripple 2s ease-out 0s infinite", transformOrigin: "90px 53px" }} />
          <ellipse cx="90" cy="53" rx="36" ry="43"
            fill="none" stroke="#A78BFA" strokeWidth="1.5"
            opacity="0"
            style={{ animation: "ripple 2s ease-out 0.7s infinite", transformOrigin: "90px 53px" }} />

          {/* Head label */}
          <text x="90" y="48" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="11" fontWeight="700" style={{ pointerEvents: "none" }}>
            머리
          </text>
          <text x="90" y="64" textAnchor="middle" fill="rgba(255,255,255,0.60)" fontSize="9" style={{ pointerEvents: "none" }}>
            TAP
          </text>
        </svg>

        {toast && (
          <div style={{
            position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
            background: "rgba(30,10,60,0.92)", color: "#fff", padding: "10px 20px",
            borderRadius: "20px", fontSize: "13px", fontWeight: "600",
            whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", zIndex: 99,
          }}>
            {t.comingSoon}
          </div>
        )}
      </div>

    </div>
  );
}
