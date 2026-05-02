import { useState } from "react";

function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        color: "#6B21A8",
        fontSize: "15px",
        cursor: "pointer",
        padding: "8px 0",
        fontWeight: "bold",
      }}
    >
      ← Back
    </button>
  );
}

function StartScreen({ onNext }) {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Pain Questionnaire</h1>
      <p>This tool helps you describe your pain visually.</p>
      <button onClick={onNext}>Start</button>
    </div>
  );
}

function HeadSelector({ onNext, onBack, painData, setPainData }) {
  const selected = painData.location;

  const handleSelect = (id) => {
    setPainData((prev) => ({ ...prev, location: id }));
  };

  const regionColor = (id) =>
    selected === id ? "#6B21A8" : "#E9D5FF";

  const regionStroke = (id) =>
    selected === id ? "#3B0764" : "#9333EA";

  const labelColor = (id) =>
    selected === id ? "#fff" : "#6B21A8";

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} /></div>
      <h2>Where does it hurt?</h2>
      <p>Tap the area on the head</p>

      <svg
        viewBox="0 0 200 260"
        width="300"
        height="390"
        style={{ margin: "0 auto", display: "block", cursor: "pointer" }}
      >
        {/* ── Neck ── */}
        <rect x="82" y="220" width="36" height="35" rx="6"
          fill="#f5d0a9" stroke="#c8a07a" strokeWidth="1" />

        {/* ── Head outline ── */}
        <ellipse cx="100" cy="120" rx="72" ry="88"
          fill="#f5d0a9" stroke="#c8a07a" strokeWidth="2" />

        {/* ── TOP OF HEAD ── */}
        <ellipse
          cx="100" cy="60" rx="55" ry="38"
          fill={regionColor("top_of_head")}
          stroke={regionStroke("top_of_head")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("top_of_head")}
        />
        <text x="100" y="55" textAnchor="middle"
          fontSize="9" fill={labelColor("top_of_head")}
          pointerEvents="none" fontWeight="bold">
          Top of
        </text>
        <text x="100" y="67" textAnchor="middle"
          fontSize="9" fill={labelColor("top_of_head")}
          pointerEvents="none" fontWeight="bold">
          Head
        </text>

        {/* ── FOREHEAD ── */}
        <ellipse
          cx="100" cy="100" rx="48" ry="22"
          fill={regionColor("forehead")}
          stroke={regionStroke("forehead")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("forehead")}
        />
        <text x="100" y="104" textAnchor="middle"
          fontSize="9" fill={labelColor("forehead")}
          pointerEvents="none" fontWeight="bold">
          Forehead
        </text>

        {/* ── LEFT TEMPLE (user's left, visually right) ── */}
        <ellipse
          cx="163" cy="128" rx="20" ry="28"
          fill={regionColor("left_temple")}
          stroke={regionStroke("left_temple")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("left_temple")}
        />
        <text x="163" y="125" textAnchor="middle"
          fontSize="8" fill={labelColor("left_temple")}
          pointerEvents="none" fontWeight="bold">
          Left
        </text>
        <text x="163" y="136" textAnchor="middle"
          fontSize="8" fill={labelColor("left_temple")}
          pointerEvents="none" fontWeight="bold">
          Temple
        </text>

        {/* ── RIGHT TEMPLE (user's right, visually left) ── */}
        <ellipse
          cx="37" cy="128" rx="20" ry="28"
          fill={regionColor("right_temple")}
          stroke={regionStroke("right_temple")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("right_temple")}
        />
        <text x="37" y="125" textAnchor="middle"
          fontSize="8" fill={labelColor("right_temple")}
          pointerEvents="none" fontWeight="bold">
          Right
        </text>
        <text x="37" y="136" textAnchor="middle"
          fontSize="8" fill={labelColor("right_temple")}
          pointerEvents="none" fontWeight="bold">
          Temple
        </text>

        {/* ── AROUND EYES ── */}
        <ellipse
          cx="100" cy="138" rx="45" ry="18"
          fill={regionColor("around_eyes")}
          stroke={regionStroke("around_eyes")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("around_eyes")}
        />
        {/* Simple eye shapes */}
        <ellipse cx="82" cy="137" rx="10" ry="5"
          fill="#fff" stroke="#aaa" strokeWidth="0.8" pointerEvents="none" />
        <circle cx="82" cy="137" r="3"
          fill="#555" pointerEvents="none" />
        <ellipse cx="118" cy="137" rx="10" ry="5"
          fill="#fff" stroke="#aaa" strokeWidth="0.8" pointerEvents="none" />
        <circle cx="118" cy="137" r="3"
          fill="#555" pointerEvents="none" />
        <text x="100" y="153" textAnchor="middle"
          fontSize="8" fill={labelColor("around_eyes")}
          pointerEvents="none" fontWeight="bold">
          Around Eyes
        </text>

        {/* ── BACK OF HEAD ── */}
        <ellipse
          cx="100" cy="195" rx="42" ry="22"
          fill={regionColor("back_of_head")}
          stroke={regionStroke("back_of_head")}
          strokeWidth="1.5"
          fillOpacity="0.75"
          onClick={() => handleSelect("back_of_head")}
        />
        {/* Simple mouth shape for face landmark */}
        <path d="M 88 178 Q 100 186 112 178"
          fill="none" stroke="#aaa" strokeWidth="1.2" pointerEvents="none" />
        <text x="100" y="200" textAnchor="middle"
          fontSize="9" fill={labelColor("back_of_head")}
          pointerEvents="none" fontWeight="bold">
          Back of Head
        </text>

        {/* ── Nose landmark (purely visual) ── */}
        <ellipse cx="100" cy="160" rx="5" ry="7"
          fill="#e8c49a" stroke="#c8a07a" strokeWidth="0.8" pointerEvents="none" />

        {/* ── Ears (visual only) ── */}
        <ellipse cx="28" cy="148" rx="7" ry="11"
          fill="#f5d0a9" stroke="#c8a07a" strokeWidth="1" pointerEvents="none" />
        <ellipse cx="172" cy="148" rx="7" ry="11"
          fill="#f5d0a9" stroke="#c8a07a" strokeWidth="1" pointerEvents="none" />
      </svg>

      {/* Selected label display */}
      <p style={{ marginTop: "12px", color: "#6B21A8", fontWeight: "bold", minHeight: "24px" }}>
        {selected
          ? `Selected: ${selected.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`
          : "Tap a region to select"}
      </p>

      <button
        onClick={onNext}
        disabled={!selected}
        style={{
          marginTop: "8px",
          padding: "14px 32px",
          fontSize: "16px",
          backgroundColor: selected ? "#6B21A8" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: selected ? "pointer" : "not-allowed",
        }}
      >
        Next →
      </button>
    </div>
  );
}

function PainTypeSelector({ onNext, onBack, painData, setPainData }) {
  const painTypes = [
    { id: "throbbing", label: "Throbbing", emoji: "💓", desc: "Pulsing, beating pain" },
    { id: "stabbing", label: "Stabbing", emoji: "⚡", desc: "Sharp, sudden pain" },
    { id: "pressure", label: "Pressure", emoji: "🪨", desc: "Squeezing, heavy feeling" },
    { id: "burning", label: "Burning", emoji: "🔥", desc: "Hot, stinging sensation" },
    { id: "electric", label: "Electric", emoji: "⚡️", desc: "Shooting, tingling pain" },
    { id: "hollow", label: "Hollow", emoji: "🌀", desc: "Empty, dull ache" },
  ];

  const selected = painData.painType;

  const handleSelect = (id) => {
    setPainData((prev) => ({ ...prev, painType: id }));
  };

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} /></div>
      <h2>What kind of pain is it?</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Select the type that feels closest
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "24px",
      }}>
        {painTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleSelect(type.id)}
            style={{
              padding: "16px 12px",
              borderRadius: "12px",
              border: "2px solid",
              borderColor: selected === type.id ? "#6B21A8" : "#ddd",
              backgroundColor: selected === type.id ? "#F3E8FF" : "#fff",
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>
              {type.emoji}
            </div>
            <div style={{
              fontWeight: "bold",
              fontSize: "15px",
              color: selected === type.id ? "#6B21A8" : "#333",
              marginBottom: "4px",
            }}>
              {type.label}
            </div>
            <div style={{
              fontSize: "12px",
              color: selected === type.id ? "#7E22CE" : "#888",
            }}>
              {type.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Selected label */}
      <p style={{
        color: "#6B21A8",
        fontWeight: "bold",
        minHeight: "24px",
        marginBottom: "12px",
      }}>
        {selected
          ? `Selected: ${painTypes.find(t => t.id === selected)?.label}`
          : "Tap a pain type to select"}
      </p>

      <button
        onClick={onNext}
        disabled={!selected}
        style={{
          padding: "14px 32px",
          fontSize: "16px",
          backgroundColor: selected ? "#6B21A8" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: selected ? "pointer" : "not-allowed",
        }}
      >
        Next →
      </button>
    </div>
  );
}

function IntensitySlider({ onNext, onBack, painData, setPainData }) {
  const intensity = painData.intensity ?? 5;

  const handleChange = (e) => {
    setPainData((prev) => ({ ...prev, intensity: Number(e.target.value) }));
  };

  const getColor = (val) => {
    if (val <= 3) return "#22C55E";  // green
    if (val <= 6) return "#F59E0B";  // amber
    return "#EF4444";                // red
  };

  const getLabel = (val) => {
    if (val <= 3) return "Mild";
    if (val <= 6) return "Moderate";
    if (val <= 8) return "Severe";
    return "Very Severe";
  };

  const color = getColor(intensity);

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} /></div>
      <h2>How intense is the pain?</h2>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Drag the slider to rate your pain
      </p>

      {/* Big number display */}
      <div style={{
        fontSize: "80px",
        fontWeight: "bold",
        color: color,
        lineHeight: 1,
        marginBottom: "8px",
        transition: "color 0.2s ease",
      }}>
        {intensity}
      </div>

      {/* Severity label */}
      <div style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: color,
        marginBottom: "32px",
        transition: "color 0.2s ease",
      }}>
        {getLabel(intensity)}
      </div>

      {/* Slider */}
      <input
        type="range"
        min="1"
        max="10"
        value={intensity}
        onChange={handleChange}
        style={{
          width: "100%",
          accentColor: color,
          height: "8px",
          cursor: "pointer",
          marginBottom: "12px",
        }}
      />

      {/* Min / Max labels */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: "#888",
        marginBottom: "40px",
      }}>
        <span>1 — No pain</span>
        <span>10 — Worst pain</span>
      </div>

      {/* Pain dot scale visual */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "6px",
        marginBottom: "40px",
      }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: i < intensity ? color : "#E5E7EB",
              transition: "background-color 0.2s ease",
            }}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        style={{
          padding: "14px 32px",
          fontSize: "16px",
          backgroundColor: "#6B21A8",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        See Summary →
      </button>
    </div>
  );
}

function SummaryCard({ painData, onRestart, onBack }) {
  const { location, painType, intensity } = painData;

  const getIntensityColor = (val) => {
    if (val <= 3) return "#22C55E";
    if (val <= 6) return "#F59E0B";
    return "#EF4444";
  };

  const getIntensityLabel = (val) => {
    if (val <= 3) return "Mild";
    if (val <= 6) return "Moderate";
    if (val <= 8) return "Severe";
    return "Very Severe";
  };

  const formatLocation = (str) =>
    str?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatPainType = (str) =>
    str?.replace(/\b\w/g, (c) => c.toUpperCase());

  const painTypeDescriptions = {
    throbbing: "pulsing and beating",
    stabbing: "sharp and sudden",
    pressure: "heavy and squeezing",
    burning: "hot and stinging",
    electric: "shooting and tingling",
    hollow: "dull and achy",
  };

  const painTypeEmojis = {
    throbbing: "💓",
    stabbing: "⚡",
    pressure: "🪨",
    burning: "🔥",
    electric: "⚡️",
    hollow: "🌀",
  };

  const color = getIntensityColor(intensity);
  const label = getIntensityLabel(intensity);

  // Auto-generated summary phrase
  const summaryPhrase = `The patient has ${getIntensityLabel(intensity).toLowerCase()} ${painTypeDescriptions[painType]} pain in the ${formatLocation(location)?.toLowerCase()}, rated ${intensity} out of 10.`;

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} /></div>
      <h2 style={{ marginBottom: "4px" }}>Pain Summary</h2>
      <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
        Review and share with your interpreter
      </p>

      {/* Summary card */}
      <div style={{
        backgroundColor: "#F9F5FF",
        border: "2px solid #6B21A8",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        textAlign: "left",
      }}>

        {/* Location row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E9D5FF",
          paddingBottom: "12px",
          marginBottom: "12px",
        }}>
          <span style={{ color: "#666", fontSize: "14px" }}>📍 Pain Location</span>
          <span style={{
            fontWeight: "bold",
            color: "#6B21A8",
            fontSize: "15px",
          }}>
            {formatLocation(location)}
          </span>
        </div>

        {/* Pain type row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E9D5FF",
          paddingBottom: "12px",
          marginBottom: "12px",
        }}>
          <span style={{ color: "#666", fontSize: "14px" }}>
            {painTypeEmojis[painType]} Pain Type
          </span>
          <span style={{
            fontWeight: "bold",
            color: "#6B21A8",
            fontSize: "15px",
          }}>
            {formatPainType(painType)}
          </span>
        </div>

        {/* Intensity row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <span style={{ color: "#666", fontSize: "14px" }}>🔢 Intensity</span>
          <span style={{
            fontWeight: "bold",
            color: color,
            fontSize: "15px",
          }}>
            {intensity} / 10 — {label}
          </span>
        </div>

        {/* Dot scale */}
        <div style={{
          display: "flex",
          gap: "5px",
          justifyContent: "center",
          marginBottom: "20px",
        }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: i < intensity ? color : "#E5E7EB",
            }} />
          ))}
        </div>

        {/* Summary phrase box */}
        <div style={{
          backgroundColor: "#EDE9FE",
          borderRadius: "10px",
          padding: "14px",
          borderLeft: "4px solid #6B21A8",
        }}>
          <p style={{
            fontSize: "12px",
            color: "#7C3AED",
            fontWeight: "bold",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            💬 Suggested phrase for interpreter
          </p>
          <p style={{
            fontSize: "15px",
            color: "#3B0764",
            margin: 0,
            lineHeight: "1.6",
          }}>
            "{summaryPhrase}"
          </p>
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        style={{
          padding: "14px 32px",
          fontSize: "16px",
          backgroundColor: "#6B21A8",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        🔄 Start Again
      </button>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [painData, setPainData] = useState({
    location: null,
    painType: null,
    intensity: null,
  });

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);
  const restart = () => {
    setStep(0);
    setPainData({ location: null, painType: null, intensity: null });
  };

  return (
  <div style={{ maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
    {step === 0 && <StartScreen onNext={goNext} />}
    {step === 1 && <HeadSelector onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} />}
    {step === 2 && <PainTypeSelector onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} />}
    {step === 3 && <IntensitySlider onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} />}
    {step === 4 && <SummaryCard painData={painData} onRestart={restart} onBack={goBack} />}
  </div>
);
}