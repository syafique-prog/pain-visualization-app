import { useState } from "react";
import headImage from "./assets/head.png";

// Region configuration
// symmetrical = clicking either side selects BOTH
const REGIONS = [
  { key: "top",         label: "Top of Head",   symmetrical: true  },
  { key: "forehead",    label: "Forehead",       symmetrical: true  },
  { key: "leftTemple",  label: "Left Temple",    symmetrical: false },
  { key: "rightTemple", label: "Right Temple",   symmetrical: false },
  { key: "leftEye",     label: "Left Eye Area",  symmetrical: false },
  { key: "rightEye",    label: "Right Eye Area", symmetrical: false },
  { key: "leftCheek",   label: "Left Cheek",     symmetrical: false },
  { key: "rightCheek",  label: "Right Cheek",    symmetrical: false },
  { key: "leftSide",    label: "Left Side",      symmetrical: false },
  { key: "rightSide",   label: "Right Side",     symmetrical: false },
];

const PATHS = {
  // ── TOP OF HEAD (symmetrical — both light up together) ──
top_left: {
    regionKey: "top",
    d: "M 103,9 Q 116,8 133,11 Q 148,15 150,22 Q 148,30 134,34 Q 118,36 100,35 Q 82,34 68,30 Q 60,23 66,16 Q 76,9 103,9 Z",
  },
  top_right: {
    regionKey: "top",
    d: "M 329,9 Q 341,9 355,13 Q 366,21 357,29 Q 344,30 328,31 Q 312,31 285,28 Q 278,21 289,13 Q 303,9 329,9 Z",
  },

  // ── FOREHEAD (symmetrical — both light up together) ──
  forehead_left: {
    regionKey: "forehead",
    d: "M 100,55 Q 148,44 200,52 Q 215,75 205,95 Q 158,102 105,94 Q 88,75 100,55 Z",
  },
  forehead_right: {
    regionKey: "forehead",
    d: "M 268,55 Q 316,44 368,52 Q 383,75 373,95 Q 326,102 273,94 Q 256,75 268,55 Z",
  },

  // ── LEFT TEMPLE
  // Left image: the temple on the LEFT side of the left head (back area)
  leftTemple_left: {
    regionKey: "leftTemple",
    d: "M 58,80 Q 90,68 118,78 Q 128,105 118,130 Q 88,138 56,122 Q 44,102 58,80 Z",
  },
  // Right image: the temple on the LEFT side of the right head (back area)
  leftTemple_right: {
    regionKey: "leftTemple",
    d: "M 392,75 Q 408,65 428,72 Q 432,98 425,122 Q 406,130 388,118 Q 378,97 392,75 Z",
  },

  // ── RIGHT TEMPLE
  // Left image: the temple on the RIGHT side of the left head (front area)
  rightTemple_left: {
    regionKey: "rightTemple",
    d: "M 170,78 Q 205,65 235,75 Q 242,100 232,125 Q 205,134 172,122 Q 158,100 170,78 Z",
  },
  // Right image: the temple on the RIGHT side of the right head (front area)
  rightTemple_right: {
    regionKey: "rightTemple",
    d: "M 222,75 Q 255,63 282,73 Q 288,98 278,122 Q 252,130 220,118 Q 207,97 222,75 Z",
  },

  // ── LEFT EYE
  leftEye_left: {
    regionKey: "leftEye",
    d: "M 158,108 Q 188,98 215,107 Q 220,128 210,145 Q 185,152 158,142 Q 146,126 158,108 Z",
  },
  leftEye_right: {
    regionKey: "leftEye",
    d: "M 288,105 Q 318,95 345,104 Q 350,125 340,142 Q 315,149 288,139 Q 276,123 288,105 Z",
  },

  // ── RIGHT EYE
  rightEye_left: {
    regionKey: "rightEye",
    d: "M 108,108 Q 138,98 160,107 Q 165,128 155,145 Q 130,152 108,142 Q 96,126 108,108 Z",
  },
  rightEye_right: {
    regionKey: "rightEye",
    d: "M 338,105 Q 362,95 385,104 Q 390,125 382,142 Q 360,149 338,139 Q 326,123 338,105 Z",
  },

  // ── LEFT CHEEK
  leftCheek_left: {
    regionKey: "leftCheek",
    d: "M 148,155 Q 188,142 222,155 Q 228,185 215,210 Q 182,220 148,207 Q 132,182 148,155 Z",
  },
  leftCheek_right: {
    regionKey: "leftCheek",
    d: "M 282,150 Q 318,138 350,150 Q 356,180 343,205 Q 312,215 280,202 Q 265,178 282,150 Z",
  },

  // ── RIGHT CHEEK
  rightCheek_left: {
    regionKey: "rightCheek",
    d: "M 62,158 Q 100,145 135,157 Q 140,186 128,210 Q 97,220 62,207 Q 46,182 62,158 Z",
  },
  rightCheek_right: {
    regionKey: "rightCheek",
    d: "M 352,155 Q 382,143 408,155 Q 413,183 402,207 Q 378,217 350,205 Q 336,180 352,155 Z",
  },

  // ── LEFT SIDE OF HEAD
  leftSide_left: {
    regionKey: "leftSide",
    d: "M 28,148 Q 58,135 80,150 Q 85,188 75,225 Q 48,235 25,218 Q 12,188 28,148 Z",
  },
  leftSide_right: {
    regionKey: "leftSide",
    d: "M 410,145 Q 432,135 432,160 L 432,220 Q 420,232 405,220 Q 396,188 410,145 Z",
  },

  // ── RIGHT SIDE OF HEAD
  rightSide_left: {
    regionKey: "rightSide",
    d: "M 192,200 Q 222,188 248,200 Q 252,228 240,252 Q 215,260 190,248 Q 176,226 192,200 Z",
  },
  rightSide_right: {
    regionKey: "rightSide",
    d: "M 185,198 Q 215,186 240,198 Q 244,226 232,250 Q 208,258 183,246 Q 170,224 185,198 Z",
  },
};

export default function HeadSelector({ onNext, onBack, t }) {
  const [selected, setSelected] = useState([]);

  const handlePathClick = (regionKey) => {
    const region = REGIONS.find((r) => r.key === regionKey);
    if (!region) return;

    if (region.symmetrical) {
      // Toggle both sides together
      if (selected.includes(regionKey)) {
        setSelected((prev) => prev.filter((k) => k !== regionKey));
      } else {
        setSelected((prev) => [...prev, regionKey]);
      }
    } else {
      // Toggle just this side
      if (selected.includes(regionKey)) {
        setSelected((prev) => prev.filter((k) => k !== regionKey));
      } else {
        setSelected((prev) => [...prev, regionKey]);
      }
    }
  };

  const isSelected = (regionKey) => selected.includes(regionKey);

  const selectedLabels = selected
    .map((key) => REGIONS.find((r) => r.key === key)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ textAlign: "left" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#6B21A8",
            fontSize: "15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← {t?.back ?? "Back"}
        </button>
      </div>

      <h2>{t?.whereDoesItHurt ?? "Where does it hurt?"}</h2>
      <p style={{ color: "#666" }}>
        {t?.selectArea ?? "Tap the area on the head"}
      </p>

      {/* Image + SVG overlay container */}
      <div style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
      }}>
        {/* Background image */}
        <img
          src={headImage}
          alt="Head diagram"
          style={{ width: "100%", display: "block" }}
        />

        {/* SVG overlay */}
        <svg
          viewBox="0 0 432 260"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {Object.entries(PATHS).map(([pathId, { regionKey, d }]) => (
            <path
              key={pathId}
              d={d}
              onClick={() => handlePathClick(regionKey)}
              fill={isSelected(regionKey) ? "rgba(220, 38, 38, 0.35)" : "rgba(0,0,0,0)"}
              stroke="transparent"
              strokeWidth="2"
              style={{ cursor: "pointer", transition: "fill 0.15s ease" }}
            />
          ))}
        </svg>
      </div>

      {/* Selected regions text */}
      <div style={{
        marginTop: "16px",
        minHeight: "28px",
        fontSize: "15px",
        fontWeight: "bold",
        color: selected.length > 0 ? "#6B21A8" : "#aaa",
      }}>
        {selected.length > 0
          ? `You have selected: ${selectedLabels}`
          : "No region selected"}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={selected.length === 0}
        style={{
          marginTop: "16px",
          padding: "14px 32px",
          fontSize: "16px",
          backgroundColor: selected.length > 0 ? "#6B21A8" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: selected.length > 0 ? "pointer" : "not-allowed",
        }}
      >
        {t?.next ?? "Next →"}
      </button>
    </div>
  );
}