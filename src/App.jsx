import { useState } from "react";
import translations from "./translations";
import HeadSelector from "./HeadSelector";

function BackButton({ onBack, t }) {
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
      {t.back}
    </button>
  );
}

function StartScreen({ onNext, t }) {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>{t.appTitle}</h1>
      <p>{t.appDesc}</p>
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
        {t.start}
      </button>
    </div>
  );
}

function PainTypeSelector({ onNext, onBack, painData, setPainData, t }) {
  const painTypes = [
    { id: "throbbing", emoji: "💓" },
    { id: "stabbing", emoji: "⚡" },
    { id: "pressure", emoji: "🪨" },
    { id: "burning", emoji: "🔥" },
    { id: "electric", emoji: "⚡️" },
    { id: "hollow", emoji: "🌀" },
  ];

  const selected = painData.painType;

  const handleSelect = (id) => {
    setPainData((prev) => ({ ...prev, painType: id }));
  };

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} t={t} /></div>
      <h2>{t.whatKindOfPain}</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>{t.selectType}</p>

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
              {t[type.id]}
            </div>
            <div style={{
              fontSize: "12px",
              color: selected === type.id ? "#7E22CE" : "#888",
            }}>
              {t[`${type.id}_desc`]}
            </div>
          </div>
        ))}
      </div>

      <p style={{
        color: "#6B21A8",
        fontWeight: "bold",
        minHeight: "24px",
        marginBottom: "12px",
      }}>
        {selected ? `${t.selected}: ${t[selected]}` : t.tapPainType}
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
        {t.next}
      </button>
    </div>
  );
}

function IntensitySlider({ onNext, onBack, painData, setPainData, t }) {
  const intensity = painData.intensity ?? 5;

  const handleChange = (e) => {
    setPainData((prev) => ({ ...prev, intensity: Number(e.target.value) }));
  };

  const getColor = (val) => {
    if (val <= 3) return "#22C55E";
    if (val <= 6) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = (val) => {
    if (val <= 3) return t.mild;
    if (val <= 6) return t.moderate;
    if (val <= 8) return t.severe;
    return t.verySevere;
  };

  const color = getColor(intensity);

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} t={t} /></div>
      <h2>{t.howIntense}</h2>
      <p style={{ color: "#666", marginBottom: "32px" }}>{t.dragSlider}</p>

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
        <span>{t.noPain}</span>
        <span>{t.worstPain}</span>
      </div>

      {/* Pain dot scale */}
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
        {t.seeSummary}
      </button>
    </div>
  );
}

function SummaryCard({ painData, onRestart, onBack, t }) {
  const { location, painType, intensity } = painData;

  const getIntensityColor = (val) => {
    if (val <= 3) return "#22C55E";
    if (val <= 6) return "#F59E0B";
    return "#EF4444";
  };

  const getIntensityLabel = (val) => {
    if (val <= 3) return t.mild;
    if (val <= 6) return t.moderate;
    if (val <= 8) return t.severe;
    return t.verySevere;
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

  const summaryPhrase = t.summaryPhrase(
    t[location],
    t[painType],
    intensity,
    label
  );

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}><BackButton onBack={onBack} t={t} /></div>
      <h2 style={{ marginBottom: "4px" }}>{t.painSummary}</h2>
      <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
        {t.reviewShare}
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
          <span style={{ color: "#666", fontSize: "14px" }}>{t.painLocation}</span>
          <span style={{
            fontWeight: "bold",
            color: "#6B21A8",
            fontSize: "15px",
          }}>
            {t[location]}
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
            {painTypeEmojis[painType]} {t.painType}
          </span>
          <span style={{
            fontWeight: "bold",
            color: "#6B21A8",
            fontSize: "15px",
          }}>
            {t[painType]}
          </span>
        </div>

        {/* Intensity row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <span style={{ color: "#666", fontSize: "14px" }}>{t.intensity}</span>
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
            {t.suggestedPhrase}
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
        {t.startAgain}
      </button>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("en");
  const [painData, setPainData] = useState({
    location: null,
    painType: null,
    intensity: null,
  });

  const t = translations[lang];

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);
  const restart = () => {
    setStep(0);
    setPainData({ location: null, painType: null, intensity: null });
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>

      {/* Language Selector */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "12px 24px",
        borderBottom: "1px solid #E9D5FF",
        backgroundColor: "#F9F5FF",
      }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #6B21A8",
            color: "#6B21A8",
            fontWeight: "bold",
            cursor: "pointer",
            backgroundColor: "#fff",
            fontSize: "14px",
          }}
        >
          <option value="en">🇬🇧 English</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="ms">🇲🇾 Bahasa Melayu</option>
        </select>
      </div>

      {step === 0 && <StartScreen onNext={goNext} t={t} />}
      {step === 1 && <HeadSelector onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} t={t} />}
      {step === 2 && <PainTypeSelector onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} t={t} />}
      {step === 3 && <IntensitySlider onNext={goNext} onBack={goBack} painData={painData} setPainData={setPainData} t={t} />}
      {step === 4 && <SummaryCard painData={painData} onRestart={restart} onBack={goBack} t={t} />}
    </div>
  );
}