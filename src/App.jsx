import { useState } from "react";
import "./App.css";
import translations from "./translations";
import BodySelector from "./BodySelector";
import HeadSelector from "./HeadSelector";

function emptyEntry() {
  return { location: [], painType: null, intensity: 5, onset: null, trend: null, pastPainType: null, pastIntensity: null };
}

// ─── Progress bar ───────────────────────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: "4px", padding: "0 20px 12px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: "4px", borderRadius: "2px",
            backgroundColor: i < step ? "#6B21A8" : "#E9D5FF",
            transition: "background-color 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Mini Entry Card ─────────────────────────────────────────
function MiniEntryCard({ entry, index, t, totalEntries }) {
  const { location, painType, intensity } = entry;
  const intensityColor = intensity <= 3 ? "#22C55E" : intensity <= 6 ? "#F59E0B" : "#EF4444";
  const type = PAIN_TYPES.find(p => p.id === painType);
  const locationLabel = location?.map(k => t[k]).join(", ") || "—";

  return (
    <div style={{
      borderRadius: "12px", padding: "12px 14px",
      border: "1.5px solid #E9D5FF", backgroundColor: "#FDFBFF",
      marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px",
    }}>
      {totalEntries > 1 && (
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          backgroundColor: "#6B21A8", color: "#fff",
          fontSize: "11px", fontWeight: "700",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {index + 1}
        </div>
      )}
      {type && (
        <div style={{ flexShrink: 0 }}>
          <PainTypeIcon id={type.id} color={type.color} selected={true} size={36} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#1F0A3C", marginBottom: "2px" }}>
          {locationLabel}
        </div>
        <div style={{ fontSize: "12px", color: type?.color || "#666" }}>{t[painType] || "—"}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "20px", fontWeight: "800", color: intensityColor, lineHeight: 1 }}>{intensity}</div>
        <div style={{ fontSize: "10px", color: "#9CA3AF" }}>/10</div>
      </div>
    </div>
  );
}

// ─── Start Screen ───────────────────────────────────────────
function StartScreen({ onNext, t }) {
  const [history] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pain-app-sessions") || "[]"); }
    catch { return []; }
  });

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>

      {/* Hero — always fills the full screen, content vertically centered */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px", textAlign: "center",
        minHeight: "100%", boxSizing: "border-box",
        position: "relative",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "24px",
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "40px", margin: "0 auto 28px",
          boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
        }}>
          🧠
        </div>

        <h1 style={{ color: "#1F0A3C", fontWeight: "700", fontSize: "26px", margin: "0 0 14px" }}>
          {t.appTitle}
        </h1>
        <p style={{ color: "#6B7280", lineHeight: "1.75", fontSize: "14px", margin: "0 0 40px", maxWidth: "300px" }}>
          {t.appDesc}
        </p>

        <button
          onClick={onNext}
          style={{
            padding: "16px 44px", fontSize: "16px", fontWeight: "700",
            backgroundColor: "#6B21A8", color: "#fff", border: "none",
            borderRadius: "14px", cursor: "pointer", letterSpacing: "0.3px",
            boxShadow: "0 4px 18px rgba(107,33,168,0.45)",
            width: "100%", maxWidth: "280px",
          }}
        >
          {t.start}
        </button>

        <div style={{ marginTop: "36px", display: "flex", gap: "24px" }}>
          {["📍", "😣", "🕐", "📊", "📋"].map((icon, i) => (
            <span key={i} style={{ fontSize: "22px" }}>{icon}</span>
          ))}
        </div>

        {/* Scroll hint when history exists */}
        {history.length > 0 && (
          <div style={{
            position: "absolute", bottom: "18px", left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
          }}>
            <span style={{ fontSize: "11px", color: "#C4B5FD", fontWeight: "600", letterSpacing: "0.5px" }}>
              {t.pastRecords}
            </span>
            <span style={{ fontSize: "14px", color: "#C4B5FD", lineHeight: 1 }}>↓</span>
          </div>
        )}
      </div>

      {/* History — below the fold, revealed by scrolling */}
      {history.length > 0 && (
        <div style={{ padding: "20px 20px 28px", borderTop: "1px solid #F3E8FF" }}>
          <div style={{ fontSize: "12px", color: "#7C3AED", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" }}>
            📋 {t.pastRecords}
          </div>
          {history.map((session, si) => (
            <div key={si} style={{
              borderRadius: "12px", border: "1.5px solid #E9D5FF",
              backgroundColor: "#FDFBFF", padding: "12px 14px", marginBottom: "10px",
            }}>
              <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "600", marginBottom: "10px" }}>
                {formatDate(session.date)} · {session.entries.length}개 부위
              </div>
              {session.entries.map((entry, ei) => {
                const type = PAIN_TYPES.find(p => p.id === entry.painType);
                const locLabel = entry.location?.map(k => t[k]).join(", ") || "—";
                const iColor = entry.intensity <= 3 ? "#22C55E" : entry.intensity <= 6 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={ei} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: ei < session.entries.length - 1 ? "6px" : 0 }}>
                    {type && <PainTypeIcon id={type.id} color={type.color} selected={false} size={24} />}
                    <span style={{ fontSize: "12px", color: "#374151", flex: 1 }}>{locLabel}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: iColor }}>{entry.intensity}/10</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pain Type Selector ─────────────────────────────────────
const PAIN_TYPES = [
  { id: "throbbing", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { id: "stabbing",  color: "#9333EA", bg: "#FAF5FF", border: "#E9D5FF" },
  { id: "electric",  color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  { id: "pressure",  color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  { id: "burning",   color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" },
  { id: "hollow",    color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
];

function PainTypeIcon({ id, color, selected, size = 52 }) {
  const dim = selected ? undefined : 0.38;

  if (id === "throbbing") {
    // 심장 박동처럼 파문이 중심에서 밖으로 퍼짐 (ripple-out)
    const ripple = (delay) => selected ? {
      animation: `throb-ripple 1.1s ease-out ${delay}s infinite`,
      transformOrigin: "28px 28px",
    } : { opacity: 0.12 };
    const core = selected ? {
      animation: "throb-core 1.1s cubic-bezier(0.25,0.8,0.25,1) infinite",
      transformOrigin: "28px 28px",
    } : { opacity: 0.35 };
    return (
      <svg viewBox="0 0 56 56" width={size} height={size} style={{ overflow: "visible" }}>
        {/* 두 파문 링 — 시차를 두고 바깥으로 퍼짐 */}
        <circle cx="28" cy="28" r="9" fill="none" stroke={color} strokeWidth="2.5" style={ripple(0.55)} />
        <circle cx="28" cy="28" r="9" fill="none" stroke={color} strokeWidth="2"   style={ripple(0)} />
        {/* 심장처럼 두근대는 코어 */}
        <circle cx="28" cy="28" r="9" fill={color} style={core} />
      </svg>
    );
  }

  if (id === "stabbing") {
    return (
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <path
          d="M28,2 L33,16 L46,10 L40,23 L54,28 L40,33 L46,46 L33,40 L28,54 L23,40 L10,46 L16,33 L2,28 L16,23 L10,10 L23,16 Z"
          fill={color} style={{ opacity: dim }}
        />
      </svg>
    );
  }

  if (id === "electric") {
    return (
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <polygon points="36,2 20,30 29,30 18,54 38,26 29,26" fill={color} style={{ opacity: dim }} />
      </svg>
    );
  }

  if (id === "pressure") {
    return (
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <circle cx="28" cy="28" r="9" fill={color} style={{ opacity: dim }} />
        <polygon points="2,28 13,21 13,25.5 21,25.5 21,30.5 13,30.5 13,35"  fill={color} style={{ opacity: dim }} />
        <polygon points="54,28 43,21 43,25.5 35,25.5 35,30.5 43,30.5 43,35" fill={color} style={{ opacity: dim }} />
      </svg>
    );
  }

  if (id === "burning") {
    return (
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <path
          d="M28,54 C16,52 10,44 12,36 C12,27 18,20 20,14 C21,8 22,4 22,4 C25,11 23,18 27,22 C28,15 31,9 36,5 C37,14 33,20 37,28 C41,21 43,16 43,16 C46,24 46,32 44,38 C42,48 36,54 28,54 Z"
          fill={color} style={{ opacity: dim }}
        />
      </svg>
    );
  }

  if (id === "hollow") {
    // 파문 없음 — 무거운 덩어리가 통째로 천천히 숨쉬는 느낌
    // 바깥으로 퍼지는 링 대신, 채워진 레이어가 겹쳐 묵직함 표현
    return (
      <svg viewBox="0 0 56 56" width={size} height={size}>
        {/* 외곽 안개층 */}
        <circle cx="28" cy="28" r="24" fill={color} style={{ opacity: selected ? 0.11 : 0.05 }} />
        {/* 중간 무게층 */}
        <circle cx="28" cy="28" r="17" fill={color} style={{ opacity: selected ? 0.24 : 0.09 }} />
        {/* 조밀한 내부 */}
        <circle cx="28" cy="28" r="11" fill={color} style={{ opacity: selected ? 0.55 : 0.18 }} />
        {/* 중심 묵직한 점 */}
        <circle cx="28" cy="28" r="5"  fill={color} style={{ opacity: selected ? 0.90 : 0.30 }} />
      </svg>
    );
  }

  return null;
}

function PainTypeSelector({ onNext, onBack, painData, setPainData, t }) {
  const selected = painData.painType;

  const handleSelect = (id) => {
    setPainData(prev => ({ ...prev, painType: id }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={{ padding: "16px 20px 4px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <ProgressBar step={2} total={6} />
        <h2 style={{ margin: "0 0 4px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.whatKindOfPain}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>{t.selectType}</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "10px", padding: "12px 20px", flex: 1, overflowY: "auto",
      }}>
        {PAIN_TYPES.map(type => {
          const sel = selected === type.id;
          return (
            <div
              key={type.id}
              onClick={() => handleSelect(type.id)}
              style={{
                borderRadius: "16px", padding: "14px 10px 12px",
                border: "2.5px solid",
                borderColor: sel ? type.color : type.border,
                backgroundColor: sel ? type.bg : "#fff",
                cursor: "pointer", textAlign: "center",
                transition: "all 0.15s ease",
                boxShadow: sel ? `0 4px 16px ${type.color}28` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60px", marginBottom: "6px" }}>
                <div className={sel ? `pain-icon-${type.id}` : ""}>
                  <PainTypeIcon id={type.id} color={type.color} selected={sel} />
                </div>
              </div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: sel ? type.color : "#374151", marginBottom: "3px" }}>
                {t[type.id]}
              </div>
              <div style={{ fontSize: "10px", color: sel ? type.color : "#9CA3AF", lineHeight: "1.4" }}>
                {t[`${type.id}_desc`]}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "0 20px 20px", flexShrink: 0 }}>
        <div style={{
          minHeight: "28px", fontSize: "13px", fontWeight: "600",
          color: selected ? "#6B21A8" : "#BBB", marginBottom: "10px",
        }}>
          {selected ? `✓ ${t[selected]}` : t.tapPainType}
        </div>
        <button
          onClick={onNext}
          disabled={!selected}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: selected ? "#6B21A8" : "#D1D5DB",
            color: "#fff", border: "none", borderRadius: "12px",
            cursor: selected ? "pointer" : "not-allowed",
            boxShadow: selected ? "0 4px 14px rgba(107,33,168,0.35)" : "none",
          }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}

// ─── Pain History Selector ──────────────────────────────────
const ONSET_OPTIONS = [
  { key: "onset_today",     dayNum: "0"    },
  { key: "onset_1to3days",  dayNum: "1–3"  },
  { key: "onset_1week",     dayNum: "7"    },
  { key: "onset_2to3weeks", dayNum: "14–21"},
  { key: "onset_1month",    dayNum: "30+"  },
];

const TREND_OPTIONS = [
  { key: "trend_worse",           color: "#EF4444", path: "M 5,40 Q 30,25 55,6",                                               endY: 6  },
  { key: "trend_same",            color: "#6B7280", path: "M 5,25 L 55,25",                                                     endY: 25 },
  { key: "trend_fluctuating",     color: "#F59E0B", path: "M 5,25 C 12,6 18,6 24,25 C 30,44 36,44 42,25 C 46,12 50,12 55,25", endY: 25 },
  { key: "trend_betterThenWorse", color: "#8B5CF6", path: "M 5,18 C 18,36 32,44 35,44 C 42,44 50,20 55,8",                     endY: 8  },
];

function TrendMiniGraph({ path, endY, color, selected }) {
  const c = selected ? color : "#D1D5DB";
  return (
    <svg viewBox="0 0 60 50" width="66" height="44" style={{ display: "block", overflow: "hidden" }}>
      <line x1="5" y1="44" x2="55" y2="44" stroke="#F3F4F6" strokeWidth="1.5" />
      <path d={path} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="55" cy={endY} r="3.5" fill={c} />
    </svg>
  );
}

function OnsetBar({ onset, setPainData, t }) {
  const display = [...ONSET_OPTIONS].reverse();
  const selDispIdx = onset
    ? ONSET_OPTIONS.length - 1 - ONSET_OPTIONS.findIndex(o => o.key === onset)
    : -1;
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "600", letterSpacing: "0.5px" }}>← PAST</span>
        <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "600", letterSpacing: "0.5px" }}>NOW →</span>
      </div>
      <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
        {display.map((opt, di) => {
          const filled = selDispIdx !== -1 && di >= selDispIdx;
          const sel = onset === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => setPainData(prev => ({ ...prev, onset: opt.key }))}
              style={{
                flex: 1, height: "52px",
                borderRadius: di === 0 ? "12px 4px 4px 12px" : di === display.length - 1 ? "4px 12px 12px 4px" : "4px",
                backgroundColor: filled ? "#6B21A8" : "#EDE9FE",
                border: sel ? "2.5px solid #4C1D95" : "2.5px solid transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background-color 0.2s",
                boxShadow: sel ? "0 2px 10px rgba(107,33,168,0.45)" : "none",
              }}
            >
              <span style={{ fontSize: opt.dayNum.length > 3 ? "9px" : "12px", fontWeight: "800", color: filled ? "#fff" : "#7C3AED", lineHeight: 1 }}>
                {opt.dayNum}<span style={{ fontSize: "8px", fontWeight: "600", opacity: 0.8 }}>d</span>
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        {display.map((opt) => {
          const sel = onset === opt.key;
          return (
            <div key={opt.key} style={{ flex: 1, textAlign: "center" }}>
              <span style={{ fontSize: "9px", display: "block", color: sel ? "#6B21A8" : "#9CA3AF", fontWeight: sel ? "700" : "400", lineHeight: "1.3" }}>
                {t[opt.key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PainHistorySelector({ onNext, onBack, painData, setPainData, t }) {
  const { onset, trend, pastPainType, pastIntensity } = painData;
  const canProceed = onset && trend;
  const setPast = (key, val) => setPainData(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={{ padding: "16px 20px 4px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <ProgressBar step={3} total={6} />
        <h2 style={{ margin: "0 0 2px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          🕐 {t.whenDidItStart}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>{t.selectOnset}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 0" }}>

        <OnsetBar onset={onset} setPainData={setPainData} t={t} />

        <div style={{ borderTop: "1px solid #F3E8FF", marginBottom: "20px" }} />

        <h3 style={{ margin: "0 0 4px", color: "#1F0A3C", fontSize: "15px", fontWeight: "700" }}>
          {t.howWasItThen}
        </h3>
        <p style={{ margin: "0 0 10px", color: "#9CA3AF", fontSize: "11px" }}>{t.tapToSelect}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "7px", marginBottom: "16px" }}>
          {PAIN_TYPES.map(type => {
            const sel = pastPainType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setPainData(prev => ({
                  ...prev,
                  pastPainType: sel ? null : type.id,
                  pastIntensity: sel ? null : prev.pastIntensity,
                }))}
                style={{
                  borderRadius: "12px", padding: "10px 6px 8px",
                  border: "2px solid",
                  borderColor: sel ? type.color : "#E5E7EB",
                  backgroundColor: sel ? type.bg : "#FAFAFA",
                  cursor: "pointer", textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow: sel ? `0 2px 8px ${type.color}28` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                  <PainTypeIcon id={type.id} color={type.color} selected={sel} size={38} />
                </div>
                <span style={{ fontSize: "10px", fontWeight: sel ? "700" : "500", color: sel ? type.color : "#6B7280" }}>
                  {t[type.id]}
                </span>
              </div>
            );
          })}
        </div>

        {pastPainType && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 10px", color: "#1F0A3C", fontSize: "14px", fontWeight: "700" }}>
              {t.pastIntensityLabel}
            </h3>
            <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginBottom: "6px" }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => setPast("pastIntensity", pastIntensity === i + 1 ? null : i + 1)}
                  style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    backgroundColor: (pastIntensity ?? 0) >= i + 1 ? "#6B7280" : "#E5E7EB",
                    cursor: "pointer", transition: "background-color 0.15s",
                    border: pastIntensity === i + 1 ? "2px solid #374151" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
            {pastIntensity && (
              <div style={{ textAlign: "center", fontSize: "12px", color: "#6B7280", fontWeight: "600" }}>
                {pastIntensity} / 10
              </div>
            )}
          </div>
        )}

        <div style={{ borderTop: "1px solid #F3E8FF", marginBottom: "20px" }} />

        <h3 style={{ margin: "0 0 12px", color: "#1F0A3C", fontSize: "15px", fontWeight: "700" }}>
          📊 {t.howHasItChanged}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {TREND_OPTIONS.map(opt => {
            const sel = trend === opt.key;
            return (
              <div
                key={opt.key}
                onClick={() => setPainData(prev => ({ ...prev, trend: opt.key }))}
                style={{
                  borderRadius: "14px", padding: "12px 8px 10px",
                  border: "2px solid",
                  borderColor: sel ? opt.color : "#E5E7EB",
                  backgroundColor: sel ? `${opt.color}12` : "#FAFAFA",
                  cursor: "pointer", textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow: sel ? `0 2px 10px ${opt.color}30` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                  <TrendMiniGraph path={opt.path} endY={opt.endY} color={opt.color} selected={sel} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: sel ? "700" : "500", color: sel ? opt.color : "#6B7280", lineHeight: "1.3", display: "block" }}>
                  {t[opt.key]}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ height: "8px" }} />
      </div>

      <div style={{ padding: "8px 20px 20px", flexShrink: 0 }}>
        <div style={{ minHeight: "28px", fontSize: "13px", fontWeight: "600", color: canProceed ? "#6B21A8" : "#BBB", marginBottom: "10px" }}>
          {canProceed ? `✓ ${t[onset]} · ${t[trend]}` : t.selectOnset}
        </div>
        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: canProceed ? "#6B21A8" : "#D1D5DB",
            color: "#fff", border: "none", borderRadius: "12px",
            cursor: canProceed ? "pointer" : "not-allowed",
            boxShadow: canProceed ? "0 4px 14px rgba(107,33,168,0.35)" : "none",
          }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}

// ─── Intensity Slider ───────────────────────────────────────
const FACES = ["😶", "🙂", "😐", "😕", "😟", "😣", "😖", "😫", "😩", "😭"];

function IntensitySlider({ onNext, onBack, painData, setPainData, t }) {
  const intensity = painData.intensity ?? 5;
  const getColor = (v) => v <= 3 ? "#22C55E" : v <= 6 ? "#F59E0B" : "#EF4444";
  const getLabel = (v) => v <= 3 ? t.mild : v <= 6 ? t.moderate : v <= 8 ? t.severe : t.verySevere;
  const color = getColor(intensity);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={{ padding: "16px 20px 4px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <ProgressBar step={4} total={6} />
        <h2 style={{ margin: "0 0 4px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.howIntense}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>{t.dragSlider}</p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "72px", lineHeight: 1, marginBottom: "8px" }}>
            {FACES[intensity - 1]}
          </div>
          <div style={{ fontSize: "64px", fontWeight: "800", color, lineHeight: 1, transition: "color 0.25s" }}>
            {intensity}
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700", color, marginTop: "6px", transition: "color 0.25s" }}>
            {getLabel(intensity)}
          </div>
        </div>

        <input
          type="range" min="1" max="10" value={intensity}
          onChange={e => setPainData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
          style={{ width: "100%", accentColor: color, height: "8px", cursor: "pointer", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF", marginBottom: "28px" }}>
          <span>{t.noPain}</span>
          <span>{t.worstPain}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: "24px", height: "24px", borderRadius: "50%",
              backgroundColor: i < intensity ? color : "#E5E7EB",
              transition: "background-color 0.2s",
            }} />
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 20px", flexShrink: 0 }}>
        <button
          onClick={onNext}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: "#6B21A8", color: "#fff", border: "none",
            borderRadius: "12px", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(107,33,168,0.35)",
          }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}

// ─── Add More Screen ─────────────────────────────────────────
function AddMoreScreen({ entries, currentEntry, onAddMore, onGoSummary, onBack, t }) {
  const allSoFar = currentEntry.location.length > 0
    ? [...entries, currentEntry]
    : entries;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={{ padding: "16px 20px 4px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <ProgressBar step={5} total={6} />
        <h2 style={{ margin: "0 0 4px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.anotherAreaQ}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>
          {allSoFar.length === 1 ? t.entryLabel + " 1" : `${allSoFar.length}개 부위 선택됨`}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 0" }}>
        {allSoFar.map((entry, i) => (
          <MiniEntryCard key={i} entry={entry} index={i} t={t} totalEntries={allSoFar.length} />
        ))}
      </div>

      <div style={{ padding: "12px 20px 20px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={onAddMore}
          style={{
            width: "100%", padding: "14px", fontSize: "15px", fontWeight: "600",
            backgroundColor: "#fff", color: "#6B21A8",
            border: "2px solid #6B21A8", borderRadius: "12px", cursor: "pointer",
          }}
        >
          {t.addAnotherArea}
        </button>
        <button
          onClick={onGoSummary}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: "#6B21A8", color: "#fff", border: "none",
            borderRadius: "12px", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(107,33,168,0.35)",
          }}
        >
          {t.seeSummary}
        </button>
      </div>
    </div>
  );
}

// ─── Entry Block ─────────────────────────────────────────────
function EntryBlock({ entry, index, t, totalEntries }) {
  const { location, painType, intensity, onset, trend, pastPainType, pastIntensity } = entry;
  const getColor = (v) => v <= 3 ? "#22C55E" : v <= 6 ? "#F59E0B" : "#EF4444";
  const getLabel = (v) => v <= 3 ? t.mild : v <= 6 ? t.moderate : v <= 8 ? t.severe : t.verySevere;

  const color = getColor(intensity);
  const label = getLabel(intensity);
  const expr = t.medicalExpressions?.[painType];
  const locationLabel = location?.map(k => t[k]).join(", ") || "—";

  const PAIN_ICONS = { throbbing: "💓", stabbing: "⚡", pressure: "🪨", burning: "🔥", electric: "⚡️", hollow: "🌀" };
  const TREND_ICONS = { trend_worse: "📈", trend_same: "➡️", trend_fluctuating: "〰️", trend_betterThenWorse: "↕️" };

  const renderRow = (icon, lbl, value, valueColor) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #F3E8FF", paddingBottom: "10px", marginBottom: "10px" }}>
      <span style={{ color: "#888", fontSize: "13px" }}>{icon} {lbl}</span>
      <span style={{ fontWeight: "700", color: valueColor || "#6B21A8", fontSize: "13px", textAlign: "right", maxWidth: "55%" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ marginBottom: "16px" }}>
      {totalEntries > 1 && (
        <div style={{
          fontSize: "11px", fontWeight: "700", color: "#7C3AED",
          textTransform: "uppercase", letterSpacing: "0.8px",
          marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{
            width: "18px", height: "18px", borderRadius: "50%",
            backgroundColor: "#7C3AED", color: "#fff",
            fontSize: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{index + 1}</span>
          {t.entryLabel} {index + 1}
        </div>
      )}

      <div style={{
        backgroundColor: "#FDFBFF", border: "2px solid #E9D5FF",
        borderRadius: "16px", padding: "16px", marginBottom: "10px",
      }}>
        {renderRow("📍", t.painLocation, `머리 › ${locationLabel}`)}
        {painType && renderRow("😣", t.painType, `${PAIN_ICONS[painType] || "•"} ${t[painType]}`)}
        {onset && renderRow("🕐", t.painOnset, t[onset])}
        {trend && renderRow(TREND_ICONS[trend] || "〰️", t.painTrend, t[trend])}

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>📊 {t.intensity}</span>
            <span style={{ fontWeight: "700", color, fontSize: "13px" }}>
              {intensity} / 10 — {label}
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: "8px", borderRadius: "4px",
                backgroundColor: i < intensity ? color : "#E5E7EB",
              }} />
            ))}
          </div>
        </div>
      </div>

      {pastPainType && (
        <div style={{
          backgroundColor: "#F5F3FF", borderRadius: "16px",
          padding: "14px 16px", marginBottom: "10px",
          border: "1.5px solid #DDD6FE",
        }}>
          <div style={{ fontSize: "11px", color: "#7C3AED", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>
            💫 {t.painChangedTitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "700", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "8px" }}>
                {t.pastStateLabel}
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                <PainTypeIcon id={pastPainType} color={PAIN_TYPES.find(p => p.id === pastPainType)?.color || "#9CA3AF"} selected={false} size={40} />
              </div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6B7280" }}>{t[pastPainType]}</div>
              {pastIntensity && (
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>{pastIntensity} / 10</div>
              )}
            </div>

            <div style={{ fontSize: "24px", color: "#7C3AED", flexShrink: 0, opacity: 0.7 }}>→</div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#6B21A8", fontWeight: "700", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "8px" }}>
                {t.nowStateLabel}
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                <PainTypeIcon id={painType} color={PAIN_TYPES.find(p => p.id === painType)?.color || "#6B21A8"} selected={true} size={40} />
              </div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: PAIN_TYPES.find(p => p.id === painType)?.color || "#6B21A8" }}>{t[painType]}</div>
              <div style={{ fontSize: "11px", color: "#6B21A8", marginTop: "3px", fontWeight: "600" }}>{intensity} / 10</div>
            </div>
          </div>

          {pastIntensity && (
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: "5px", borderRadius: "3px", backgroundColor: i < pastIntensity ? "#9CA3AF" : "#E5E7EB" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: "5px", borderRadius: "3px", backgroundColor: i < intensity ? color : "#E5E7EB" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{t.pastStateLabel}: {pastIntensity}/10</span>
                <span style={{ fontSize: "10px", color: "#6B21A8", fontWeight: "700" }}>{t.nowStateLabel}: {intensity}/10</span>
              </div>
            </div>
          )}
        </div>
      )}

      {expr && (
        <div style={{
          backgroundColor: "#F5F3FF", borderRadius: "16px",
          padding: "16px", border: "1.5px solid #DDD6FE",
        }}>
          <div style={{ fontSize: "12px", color: "#7C3AED", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" }}>
            💬 {t.expressionTitle}
          </div>

          <div style={{ backgroundColor: "#EDE9FE", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "#7C3AED", fontWeight: "600", marginBottom: "4px" }}>
              {t.medicalTerm}
            </div>
            <div style={{ fontSize: "14px", color: "#3B0764", fontWeight: "700" }}>
              {expr.medical}
            </div>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px 14px", borderLeft: "4px solid #7C3AED" }}>
            <div style={{ fontSize: "11px", color: "#7C3AED", fontWeight: "600", marginBottom: "6px" }}>
              {t.koreanExpr}
            </div>
            <div style={{ fontSize: "14px", color: "#1F0A3C", lineHeight: "1.65" }}>
              "{expr.phrase(locationLabel)}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary Card ───────────────────────────────────────────
function SummaryCard({ entries, currentEntry, onConsent, onBack, t }) {
  const allEntries = [...entries, currentEntry].filter(e => e.location?.length > 0 && e.painType);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={{ padding: "16px 20px 4px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <ProgressBar step={6} total={6} />
        <h2 style={{ margin: "0 0 2px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.painSummary}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>{t.reviewShare}</p>
      </div>

      <div style={{ padding: "0 20px 4px", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
          border: "1.5px solid #F59E0B",
          borderRadius: "10px", padding: "10px 14px",
        }}>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>⚠️</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#92400E", lineHeight: 1.4 }}>
            {t.disclaimer}
          </span>
        </div>
      </div>

      <div style={{ padding: "12px 20px 0", flex: 1, overflowY: "auto" }}>
        {allEntries.map((entry, i) => (
          <EntryBlock
            key={i}
            entry={entry}
            index={i}
            t={t}
            totalEntries={allEntries.length}
          />
        ))}

        <button
          onClick={onConsent}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: "#6B21A8", color: "#fff", border: "none",
            borderRadius: "12px", cursor: "pointer", marginTop: "4px", marginBottom: "24px",
            boxShadow: "0 4px 14px rgba(107,33,168,0.35)",
          }}
        >
          {t.shareBtn}
        </button>
      </div>
    </div>
  );
}

// ─── Consent Screen ──────────────────────────────────────────
function ConsentScreen({ onSave, onDiscard, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 28px", textAlign: "center" }}>
      <div style={{
        width: "80px", height: "80px", borderRadius: "24px",
        background: "linear-gradient(135deg, #6B21A8, #9333EA)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "38px", marginBottom: "28px",
        boxShadow: "0 8px 24px rgba(107,33,168,0.4)",
      }}>
        💾
      </div>

      <h2 style={{ color: "#1F0A3C", fontWeight: "700", fontSize: "22px", margin: "0 0 14px" }}>
        {t.savePromptTitle}
      </h2>
      <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: "1.75", margin: "0 0 40px", maxWidth: "280px" }}>
        {t.savePromptDesc}
      </p>

      <div style={{ width: "100%", maxWidth: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={onSave}
          style={{
            width: "100%", padding: "15px", fontSize: "16px", fontWeight: "700",
            backgroundColor: "#6B21A8", color: "#fff", border: "none",
            borderRadius: "14px", cursor: "pointer",
            boxShadow: "0 4px 18px rgba(107,33,168,0.45)",
          }}
        >
          {t.saveConfirm}
        </button>
        <button
          onClick={onDiscard}
          style={{
            width: "100%", padding: "15px", fontSize: "15px", fontWeight: "600",
            backgroundColor: "#fff", color: "#9CA3AF",
            border: "1.5px solid #E5E7EB", borderRadius: "14px", cursor: "pointer",
          }}
        >
          {t.discardBtn}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("ko");
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(emptyEntry());

  const t = translations[lang];

  const goNext = () => setStep(p => p + 1);
  const goBack = () => {
    if (step === 2 && entries.length > 0) {
      setStep(6);
    } else {
      setStep(p => p - 1);
    }
  };

  const handleAddMore = () => {
    setEntries(prev => [...prev, currentEntry]);
    setCurrentEntry(emptyEntry());
    setStep(2);
  };

  const handleGoSummary = () => setStep(7);
  const handleConsent = () => setStep(8);

  const restart = () => {
    setStep(0);
    setEntries([]);
    setCurrentEntry(emptyEntry());
  };

  const handleSave = () => {
    try {
      const validEntries = [...entries, currentEntry].filter(e => e.location?.length > 0 && e.painType);
      const session = { date: new Date().toISOString(), entries: validEntries };
      const existing = JSON.parse(localStorage.getItem("pain-app-sessions") || "[]");
      localStorage.setItem("pain-app-sessions", JSON.stringify([session, ...existing].slice(0, 20)));
    } catch {}
    restart();
  };

  const handleDiscard = () => restart();

  return (
    <div style={{
      width: "100%", height: "100%",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      backgroundColor: "#fff",
      display: "flex", flexDirection: "column",
    }}>

      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        padding: "12px 18px", borderBottom: "1px solid #F3E8FF",
        backgroundColor: "#FDFBFF", flexShrink: 0,
      }}>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          style={{
            padding: "5px 10px", borderRadius: "8px",
            border: "1.5px solid #DDD6FE", color: "#6B21A8",
            fontWeight: "600", cursor: "pointer",
            backgroundColor: "#fff", fontSize: "13px", outline: "none",
          }}
        >
          <option value="en">🇬🇧 EN</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="ms">🇲🇾 BM</option>
        </select>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {step === 0 && <StartScreen onNext={goNext} t={t} />}
        {step === 1 && <BodySelector onNext={goNext} onBack={goBack} t={t} />}
        {step === 2 && (
          <HeadSelector
            onNext={goNext} onBack={goBack}
            painData={currentEntry} setPainData={setCurrentEntry} t={t}
          />
        )}
        {step === 3 && (
          <PainTypeSelector
            onNext={goNext} onBack={goBack}
            painData={currentEntry} setPainData={setCurrentEntry} t={t}
          />
        )}
        {step === 4 && (
          <PainHistorySelector
            onNext={goNext} onBack={goBack}
            painData={currentEntry} setPainData={setCurrentEntry} t={t}
          />
        )}
        {step === 5 && (
          <IntensitySlider
            onNext={goNext} onBack={goBack}
            painData={currentEntry} setPainData={setCurrentEntry} t={t}
          />
        )}
        {step === 6 && (
          <AddMoreScreen
            entries={entries} currentEntry={currentEntry}
            onAddMore={handleAddMore} onGoSummary={handleGoSummary}
            onBack={goBack} t={t}
          />
        )}
        {step === 7 && (
          <SummaryCard
            entries={entries} currentEntry={currentEntry}
            onConsent={handleConsent} onBack={goBack} t={t}
          />
        )}
        {step === 8 && (
          <ConsentScreen onSave={handleSave} onDiscard={handleDiscard} t={t} />
        )}
      </div>
    </div>
  );
}
