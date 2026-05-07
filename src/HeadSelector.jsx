import { useState } from "react";
import headImage from "./assets/head.png";

const REGIONS = [
  { key: "top",        symmetrical: true  },
  { key: "forehead",   symmetrical: true  },
  { key: "leftTemple", symmetrical: false },
  { key: "rightTemple",symmetrical: false },
  { key: "leftEye",    symmetrical: false },
  { key: "rightEye",   symmetrical: false },
  { key: "leftCheek",  symmetrical: false },
  { key: "rightCheek", symmetrical: false },
  { key: "leftSide",   symmetrical: false },
  { key: "rightSide",  symmetrical: false },
];

const REGION_COLOR = {
  top:         { fill: "rgba(124,58,237,0.38)",  chip: "#7C3AED", bg: "#EDE9FE" },
  forehead:    { fill: "rgba(37,99,235,0.38)",   chip: "#2563EB", bg: "#DBEAFE" },
  leftTemple:  { fill: "rgba(217,119,6,0.38)",   chip: "#D97706", bg: "#FEF3C7" },
  rightTemple: { fill: "rgba(217,119,6,0.38)",   chip: "#D97706", bg: "#FEF3C7" },
  leftEye:     { fill: "rgba(220,38,38,0.38)",   chip: "#DC2626", bg: "#FEE2E2" },
  rightEye:    { fill: "rgba(220,38,38,0.38)",   chip: "#DC2626", bg: "#FEE2E2" },
  leftCheek:   { fill: "rgba(5,150,105,0.38)",   chip: "#059669", bg: "#D1FAE5" },
  rightCheek:  { fill: "rgba(5,150,105,0.38)",   chip: "#059669", bg: "#D1FAE5" },
  leftSide:    { fill: "rgba(219,39,119,0.38)",  chip: "#DB2777", bg: "#FCE7F3" },
  rightSide:   { fill: "rgba(219,39,119,0.38)",  chip: "#DB2777", bg: "#FCE7F3" },
};

// Paths measured from actual red-circle pixel positions in head.png (1616×973 → SVG 432×260, scale 3.74×).
// scipy connected-component analysis detected 14 regions (7 per face side).
// The "extra" oval between temporal muscle and eye is merged into the temple region.
const PATHS = {
  // ── Top of head (crown) ──
  top_left: {
    regionKey: "top",
    d: "M 107,8 Q 148,8 148,20 Q 148,32 107,32 Q 66,32 66,20 Q 66,8 107,8 Z",
  },
  top_right: {
    regionKey: "top",
    d: "M 321,9 Q 362,9 362,21 Q 362,33 321,33 Q 281,33 281,21 Q 281,9 321,9 Z",
  },
  // ── Forehead (frontal region, front of each face profile) ──
  forehead_left: {
    regionKey: "forehead",
    d: "M 157,39 Q 182,39 182,61 Q 182,82 157,82 Q 133,82 133,61 Q 133,39 157,39 Z",
  },
  forehead_right: {
    regionKey: "forehead",
    d: "M 273,39 Q 298,39 298,61 Q 298,82 273,82 Q 249,82 249,61 Q 249,39 273,39 Z",
  },
  // ── Left temple (temporal muscle + supra-orbital junction, left face) ──
  leftTemple_left: {
    regionKey: "leftTemple",
    d: "M 91,40 Q 135,40 135,71 Q 135,102 91,102 Q 48,102 48,71 Q 48,40 91,40 Z",
  },
  // ── Right temple (temporal muscle + supra-orbital junction, right face) ──
  rightTemple_right: {
    regionKey: "rightTemple",
    d: "M 338,40 Q 382,40 382,71 Q 382,102 338,102 Q 295,102 295,71 Q 295,40 338,40 Z",
  },
  // ── Left eye / orbit (left face) ──
  leftEye_left: {
    regionKey: "leftEye",
    d: "M 161,82 Q 178,82 178,100 Q 178,117 161,117 Q 144,117 144,100 Q 144,82 161,82 Z",
  },
  // ── Right eye / orbit (right face) ──
  rightEye_right: {
    regionKey: "rightEye",
    d: "M 269,82 Q 286,82 286,100 Q 286,117 269,117 Q 252,117 252,100 Q 252,82 269,82 Z",
  },
  // ── Left cheek (left face) ──
  leftCheek_left: {
    regionKey: "leftCheek",
    d: "M 123,113 Q 142,113 142,143 Q 142,173 123,173 Q 105,173 105,143 Q 105,113 123,113 Z",
  },
  // ── Right cheek (right face) ──
  rightCheek_right: {
    regionKey: "rightCheek",
    d: "M 306,113 Q 325,113 325,143 Q 325,173 306,173 Q 288,173 288,143 Q 288,113 306,113 Z",
  },
  // ── Left side / ear-jaw area (left face) ──
  leftSide_left: {
    regionKey: "leftSide",
    d: "M 40,105 Q 59,105 59,143 Q 59,180 40,180 Q 22,180 22,143 Q 22,105 40,105 Z",
  },
  // ── Right side / ear-jaw area (right face) ──
  rightSide_right: {
    regionKey: "rightSide",
    d: "M 389,105 Q 408,105 408,143 Q 408,181 389,181 Q 371,181 371,143 Q 371,105 389,105 Z",
  },
};

export default function HeadSelector({ onNext, onBack, setPainData, t }) {
  const [selected, setSelected] = useState([]);

  const toggle = (regionKey) => {
    setSelected(prev =>
      prev.includes(regionKey)
        ? prev.filter(k => k !== regionKey)
        : [...prev, regionKey]
    );
  };

  const isSelected = (key) => selected.includes(key);

  const handleNext = () => {
    setPainData(prev => ({ ...prev, location: selected }));
    onNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "8px", display: "block" }}
        >
          {t.back}
        </button>
        <h2 style={{ margin: "0 0 4px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>
          {t.whereDoesItHurt}
        </h2>
        <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>{t.selectArea}</p>
      </div>

      {/* Head diagram */}
      <div style={{ position: "relative", margin: "8px 16px 0", flexShrink: 0 }}>
        <img
          src={headImage}
          alt="Head diagram"
          style={{ width: "100%", display: "block", borderRadius: "12px" }}
        />
        <svg
          viewBox="0 0 432 260"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          {Object.entries(PATHS).map(([pathId, { regionKey, d }]) => {
            const color = REGION_COLOR[regionKey];
            return (
              <path
                key={pathId}
                d={d}
                onClick={() => toggle(regionKey)}
                fill={isSelected(regionKey) ? color.fill : "rgba(255,255,255,0.05)"}
                stroke={isSelected(regionKey) ? color.chip : "transparent"}
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "fill 0.15s ease" }}
              />
            );
          })}
        </svg>
      </div>

      {/* Region chips */}
      <div style={{
        padding: "12px 16px 8px",
        display: "flex", flexWrap: "wrap", gap: "7px",
        overflowY: "auto", flex: 1,
      }}>
        {REGIONS.map(region => {
          const color = REGION_COLOR[region.key];
          const sel = isSelected(region.key);
          return (
            <button
              key={region.key}
              onClick={() => toggle(region.key)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 12px", borderRadius: "20px",
                border: "2px solid",
                borderColor: sel ? color.chip : "#E5E7EB",
                backgroundColor: sel ? color.bg : "#FAFAFA",
                color: sel ? color.chip : "#666",
                cursor: "pointer", fontSize: "13px", fontWeight: sel ? "700" : "500",
                transition: "all 0.15s",
              }}
            >
              <span style={{
                width: "10px", height: "10px", borderRadius: "50%",
                backgroundColor: color.chip, flexShrink: 0,
                opacity: sel ? 1 : 0.35,
              }} />
              {t[region.key]}
            </button>
          );
        })}
      </div>

      {/* Selection status + Next */}
      <div style={{ padding: "8px 16px 16px", flexShrink: 0 }}>
        <div style={{
          minHeight: "32px", fontSize: "13px", fontWeight: "600",
          color: selected.length > 0 ? "#6B21A8" : "#BBB",
          marginBottom: "10px", lineHeight: "1.5",
        }}>
          {selected.length > 0
            ? `✓ ${selected.map(k => t[k]).join(", ")}`
            : t.tapToSelect}
        </div>
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          style={{
            width: "100%", padding: "14px", fontSize: "16px", fontWeight: "600",
            backgroundColor: selected.length > 0 ? "#6B21A8" : "#D1D5DB",
            color: "#fff", border: "none", borderRadius: "12px",
            cursor: selected.length > 0 ? "pointer" : "not-allowed",
            boxShadow: selected.length > 0 ? "0 4px 14px rgba(107,33,168,0.35)" : "none",
          }}
        >
          {t.next}
        </button>
      </div>

    </div>
  );
}
