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
  { key: "backOfHead", label: "Back of Head", symmetrical: true },
];

// naming a bit inconsistent — some regions are named after the side of the head, some after the side of the face. Could rename to be more consistent, but would require updating 
// translations and maybe some UI text. For now just keeping as is since it’s not too confusing and we can clean up later if needed.
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
    d: "M 153,39 Q 166,44 175,54 Q 179,65 179,77 Q 178,80 169,79 Q 159,78 147,81 Q 141,80 136,69 Q 132,60 132,50 Q 141,42 153,39 Z",
  },
  forehead_right: {
    regionKey: "forehead",
    d: "M 275,39 Q 289,42 296,50 Q 293,65 290,76 Q 287,81 276,80 Q 268,78 262,79 Q 252,80 248,70 Q 252,57 259,46 Q 269,40 275,39 Z",
  },

  // ── RIGHT TEMPLE
  // Left image: the temple on the RIGHT side of the right head (back area)
  rightTemple_left: {
    regionKey: "rightTemple",
    d: "M 126,64 Q 133,73 134,85 Q 132,95 128,100 Q 113,103 104,99 Q 100,91 100,86 Q 108,77 118,70 Q 124,65 126,64 Z",
  },

  // ── LEFT TEMPLE
  // Right image: the temple on the LEFT side of the left head (front area)
  leftTemple_right: {
    regionKey: "leftTemple",
    d: "M 303,65 Q 313,72 321,78 Q 328,84 328,92 Q 324,99 310,101 Q 301,101 295,88 Q 295,75 299,68 Q 303,65 303,65 Z",
  },

  // ── LEFT EYE
  leftEye_left: {
    regionKey: "rightEye",
    d: "M 161,84 Q 169,85 176,93 Q 176,100 172,109 Q 162,115 150,112 Q 144,103 145,91 Q 153,85 161,84 Z",
  },

  // ── RIGHT EYE
  leftEye_right: {
    regionKey: "leftEye",
    d: "M 269,83 Q 278,86 284,92 Q 284,105 277,115 Q 270,116 259,113 Q 254,105 252,97 Q 257,88 266,84 Q 269,83 269,83 Z",
  },

  // ── LEFT CHEEK
  leftCheek_right: {
    regionKey: "leftCheek",
    d: "M 302,114 Q 312,115 320,128 Q 322,139 323,152 Q 321,161 312,170 Q 302,169 297,159 Q 292,145 288,133 Q 290,123 297,116 Q 302,114 302,114 Z",
  },

  // ── RIGHT CHEEK
  rightCheek_left: {
    regionKey: "rightCheek",
    d: "M 122,114 Q 134,117 141,125 Q 140,137 134,149 Q 131,160 126,170 Q 116,170 108,164 Q 104,154 105,141 Q 109,129 113,119 Q 122,113 130,114 Z",
  },

  // RIGHT SIDE OF HEAD
  rightSide_left: {
    regionKey: "rightSide",
    d: "M 80,41 Q 100,43 114,49 Q 119,60 111,70 Q 98,77 83,80 Q 72,82 66,94 Q 62,97 51,87 Q 47,70 51,55 Q 61,45 76,41 Q 80,41 80,41 Z",
  },

  //LEFT SIDE OF HEAD
  rightSide_right: {
    regionKey: "leftSide",
    d: "M 349,41 Q 363,44 374,51 Q 380,64 380,81 Q 374,92 368,97 Q 361,91 354,82 Q 341,80 325,76 Q 316,69 310,59 Q 314,50 325,44 Q 338,41 349,41 Z",
  },

  // ── BACK OF HEAD
  backOfHead_left: {
    regionKey: "backOfHead",
    d: "M 34,105 Q 48,115 57,141 Q 56,162 51,174 Q 42,179 30,170 Q 23,156 20,139 Q 23,120 28,109 Q 34,105 34,105 Z",
  },

  backOfHead_right: {
    regionKey: "backOfHead",
    d: "M 395,106 Q 406,119 407,144 Q 400,166 390,178 Q 383,179 375,175 Q 370,160 371,143 Q 376,125 382,114 Q 393,106 395,106 Z",
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