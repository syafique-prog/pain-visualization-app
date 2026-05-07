import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ── safe curve ── */
function mkCurve(rawPts) {
  const vecs = rawPts.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  for (let i = 1; i < vecs.length - 1; i++) {
    const d1 = vecs[i].clone().sub(vecs[i - 1]);
    const d2 = vecs[i + 1].clone().sub(vecs[i]);
    if (d1.clone().cross(d2).lengthSq() < 1e-6) { vecs[i].x += 0.003; vecs[i].z += 0.002; }
  }
  return new THREE.CatmullRomCurve3(vecs);
}

/* ── tapered tube ── */
function taperedTube(curve, rFn, seg = 22, rad = 12) {
  const fr = curve.computeFrenetFrames(seg, false);
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, p = curve.getPoint(t), r = Math.max(0.004, rFn(t));
    const N = fr.normals[Math.min(i, fr.normals.length - 1)];
    const B = fr.binormals[Math.min(i, fr.binormals.length - 1)];
    for (let j = 0; j <= rad; j++) {
      const a = (j / rad) * Math.PI * 2, cx = Math.cos(a), sx = Math.sin(a);
      const nx = cx*N.x+sx*B.x, ny = cx*N.y+sx*B.y, nz = cx*N.z+sx*B.z;
      pos.push(p.x+r*nx, p.y+r*ny, p.z+r*nz);
      nor.push(nx, ny, nz); uv.push(j/rad, t);
    }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < rad; j++) {
      const a = (rad+1)*i+j, b = (rad+1)*(i+1)+j;
      idx.push(a, b, a+1, b, b+1, a+1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal",   new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv",       new THREE.Float32BufferAttribute(uv,  2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

const thinTube = (c, r = 0.016, seg = 18, rad = 6) => taperedTube(c, () => r, seg, rad);

/* ─────────────────────────────────────────────────────
   FULL BODY — smooth procedural human mesh
───────────────────────────────────────────────────── */
function buildFull(mat) {
  const g = new THREE.Group();

  const add = (geo, px = 0, py = 0, pz = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.scale.set(sx, sy, sz);
    g.add(m);
    return m;
  };

  // ── Head ──
  const headMesh = add(new THREE.SphereGeometry(0.40, 56, 40), 0, 2.50, -0.01, 0.97, 1.12, 0.90);
  headMesh.name = "head";

  // ── Neck ──
  add(new THREE.CylinderGeometry(0.128, 0.175, 0.46, 24), 0, 2.05, 0.01, 1, 1, 0.86);

  // ── Torso via LatheGeometry (natural silhouette) ──
  const tPts = [
    new THREE.Vector2(0.010, 1.90),
    new THREE.Vector2(0.175, 1.86),
    new THREE.Vector2(0.330, 1.80),
    new THREE.Vector2(0.448, 1.68),
    new THREE.Vector2(0.500, 1.52),
    new THREE.Vector2(0.492, 1.36),
    new THREE.Vector2(0.465, 1.18),
    new THREE.Vector2(0.428, 1.00),
    new THREE.Vector2(0.362, 0.84),
    new THREE.Vector2(0.298, 0.68),
    new THREE.Vector2(0.290, 0.52),
    new THREE.Vector2(0.318, 0.36),
    new THREE.Vector2(0.392, 0.17),
    new THREE.Vector2(0.438, -0.02),
    new THREE.Vector2(0.404, -0.20),
    new THREE.Vector2(0.248, -0.32),
    new THREE.Vector2(0.068, -0.39),
    new THREE.Vector2(0.010, -0.41),
  ];
  const torsoMesh = new THREE.Mesh(new THREE.LatheGeometry(tPts, 48), mat);
  torsoMesh.scale.z = 0.68;
  g.add(torsoMesh);

  // ── Arms ──
  // 시작점(x≈0.44)을 몸통 어깨 안쪽에 겹치게 → 구체 없이 자연스럽게 붙음
  [-1, 1].forEach(s => {
    const uaC = mkCurve([
      [s*0.46, 1.62, 0.02],
      [s*0.54, 1.38, 0.04],
      [s*0.58, 1.10, 0.04],
      [s*0.60, 0.84, 0.04],
    ]);
    g.add(new THREE.Mesh(taperedTube(uaC, t => 0.148 - t*0.036, 22, 18), mat));

    const laC = mkCurve([
      [s*0.60, 0.84, 0.04],
      [s*0.60, 0.58, 0.03],
      [s*0.59, 0.30, 0.02],
      [s*0.58, 0.04, 0.02],
    ]);
    g.add(new THREE.Mesh(taperedTube(laC, t => 0.112 - t*0.038, 20, 18), mat));

    const handC = mkCurve([
      [s*0.580,  0.040, 0.020],
      [s*0.578, -0.034, 0.026],
      [s*0.574, -0.112, 0.030],
      [s*0.570, -0.190, 0.034],
    ]);
    g.add(new THREE.Mesh(taperedTube(handC, t => 0.074 + t*0.014, 10, 14), mat));

    for (let f = 0; f < 4; f++) {
      const xo = s * (f - 1.5) * 0.026;
      const fc = mkCurve([
        [s*0.570 + xo, -0.194, 0.036],
        [s*0.568 + xo, -0.330, 0.040],
      ]);
      g.add(new THREE.Mesh(taperedTube(fc, t => 0.030 - t*0.007, 7, 9), mat));
    }
    const tc = mkCurve([
      [s*0.620, -0.104, 0.030],
      [s*0.616, -0.192, 0.034],
    ]);
    g.add(new THREE.Mesh(taperedTube(tc, t => 0.032 - t*0.008, 7, 9), mat));
  });

  // ── Legs ──
  [-1, 1].forEach(s => {
    // 허벅지 — 골반 안쪽에서 시작해 겹침으로 자연 연결
    const thC = mkCurve([
      [s*0.18, -0.08, 0.02],
      [s*0.24, -0.50, 0.04],
      [s*0.26, -0.92, 0.04],
      [s*0.272, -1.28, 0.02],
    ]);
    g.add(new THREE.Mesh(taperedTube(thC, t => 0.225 - t*0.088, 24, 20), mat));

    // 종아리 — 끝 반지름: 0.140 + 0 - 0.072 = 0.068
    const caC = mkCurve([
      [s*0.272, -1.28,  0.040],
      [s*0.270, -1.540, 0.002],
      [s*0.268, -1.820, -0.028],
      [s*0.262, -2.002, -0.050],  // ← 이 끝점에서 발이 이어져야 함
    ]);
    g.add(new THREE.Mesh(taperedTube(caC, t => {
      const b = t < 0.38 ? (t / 0.38) * 0.042 : ((1 - t) / 0.62) * 0.042;
      return 0.140 + b - t * 0.072;
    }, 24, 18), mat));

    // 발목 브리지 — 종아리에서 수직으로 내려가 발목 베이스 형성
    // (바로 앞으로 꺾으면 Frenet 프레임 비틀림 → 발이 뒤집혀 보임)
    const ankleC = mkCurve([
      [s*0.262, -2.002, -0.050],
      [s*0.261, -2.040, -0.050],
      [s*0.260, -2.075, -0.030],
    ]);
    g.add(new THREE.Mesh(taperedTube(ankleC, () => 0.066, 6, 12), mat));

    // 발 — 발목 베이스에서 수평으로 +z 방향으로 뻗음
    const footC = mkCurve([
      [s*0.260, -2.077, -0.026],
      [s*0.255, -2.095,  0.068],
      [s*0.248, -2.108,  0.168],
      [s*0.242, -2.116,  0.255],
    ]);
    g.add(new THREE.Mesh(taperedTube(footC, t => 0.072 + t*0.030, 12, 14), mat));
  });

  // Invisible head collider for raycasting
  const hitGeo = new THREE.SphereGeometry(0.44, 16, 12);
  const hitMesh = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
  hitMesh.scale.set(0.97, 1.12, 0.90);
  hitMesh.position.set(0, 2.50, -0.01);
  hitMesh.name = "head";
  g.add(hitMesh);

  return g;
}

/* ─────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────── */
function buildSkeleton() {
  const bMat = new THREE.MeshStandardMaterial({ color: 0xf2e8d0, roughness: 0.42, metalness: 0.06 });
  const dMat = new THREE.MeshStandardMaterial({ color: 0xbfad92, roughness: 0.75, metalness: 0.01 });
  const g = new THREE.Group();

  // Skull
  const sg = new THREE.SphereGeometry(0.40, 32, 24);
  const skull = new THREE.Mesh(sg, bMat);
  skull.scale.set(0.97, 1.12, 0.90); skull.position.set(0, 2.50, -0.01); skull.name = "head";
  g.add(skull);

  // Jaw
  const jg = new THREE.SphereGeometry(0.22, 20, 14);
  const jaw = new THREE.Mesh(jg, bMat);
  jaw.scale.set(1.3, 0.6, 0.88); jaw.position.set(0, 2.10, 0.14);
  g.add(jaw);

  // Vertebral column
  for (let i = 0; i < 24; i++) {
    const y = i < 7 ? 1.94 - i*0.100 : i < 19 ? 1.22 - (i-7)*0.088 : 0.16 - (i-19)*0.096;
    const r = i < 7 ? 0.068 : i < 19 ? 0.098 : 0.130;
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(r, r+0.012, 0.068, 10), bMat);
    vert.position.set(0, y, 0); g.add(vert);
    // Spinous process
    const spLen = i < 7 ? 0.10 : i < 19 ? 0.14 + (i-7)*0.003 : 0.18;
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.038, spLen), bMat);
    sp.position.set(0, y, -(spLen/2 + 0.038)); g.add(sp);
    // Intervertebral disc
    if (i > 0) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(r*1.14, r*1.14, 0.022, 10), dMat);
      disc.position.set(0, y - 0.048, 0); g.add(disc);
    }
  }

  // Sacrum
  const sac = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 10), bMat);
  sac.position.set(0, -0.38, -0.02); sac.rotation.z = Math.PI; g.add(sac);

  // Clavicles
  [-1, 1].forEach(s => {
    const clav = mkCurve([[s*0.08,1.58,0.02],[s*0.30,1.62,0.07],[s*0.58,1.56,0.04]]);
    g.add(new THREE.Mesh(taperedTube(clav, () => 0.034, 12, 8), bMat));
    // Scapula
    const sc = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.022), bMat);
    sc.position.set(s*0.52, 1.28, -0.12); sc.rotation.y = s*0.22; g.add(sc);
  });

  // Ribs (12 pairs)
  for (let i = 0; i < 12; i++) {
    const ry = 1.42 - i*0.085;
    const maxR = i < 7 ? 0.54 + i*0.010 : 0.54 - (i-7)*0.040;
    [-1, 1].forEach(s => {
      const pts = [];
      for (let a = 0; a <= 12; a++) {
        const ang = (a/12) * Math.PI;
        pts.push([s*Math.cos(ang)*maxR, ry - Math.abs(Math.sin(ang))*0.17, -Math.sin(ang)*0.13]);
      }
      g.add(new THREE.Mesh(taperedTube(mkCurve(pts),
        t => t < 0.1 ? 0.020+t*0.040 : t > 0.85 ? 0.028-(t-0.85)*0.14 : 0.028,
        14, 6), bMat));
    });
  }

  // Sternum
  g.add(new THREE.Mesh(taperedTube(
    mkCurve([[0.003,1.52,0.06],[0,1.28,0.07],[-0.003,1.04,0.06],[0,0.82,0.04]]),
    t => 0.044 + t*0.018, 12, 7), bMat));

  // Pelvis
  const pelPts = [[0.05,-0.04],[0.30,-0.06],[0.50,-0.12],[0.58,-0.24],[0.52,-0.38],[0.30,-0.46],[0.08,-0.48]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(pelPts, 32), bMat));

  // Humerus (upper arm bone)
  const humC = mkCurve([[-0.46,1.62,0],[-0.54,1.38,0.04],[-0.58,1.10,0.04],[-0.60,0.84,0.04]]);
  const humG = taperedTube(humC, t => 0.066 - t*0.018, 18, 9);
  g.add(new THREE.Mesh(humG, bMat));
  const rhm = new THREE.Mesh(humG, bMat); rhm.scale.x = -1; g.add(rhm);

  // Radius & Ulna
  [mkCurve([[-0.60,0.84,0.06],[-0.59,0.56,0.04],[-0.58,0.06,0.01]]),
   mkCurve([[-0.59,0.84,-0.02],[-0.59,0.56,-0.04],[-0.58,0.06,-0.01]])].forEach(c => {
    const fg = taperedTube(c, () => 0.036, 14, 7);
    g.add(new THREE.Mesh(fg, bMat));
    const m = new THREE.Mesh(fg, bMat); m.scale.x = -1; g.add(m);
  });

  // Femur (thigh bone)
  const femC = mkCurve([[-0.22,0.04,0],[-0.25,-0.35,0.04],[-0.27,-0.80,0.04],[-0.28,-1.22,0.02]]);
  const femG = taperedTube(femC, t => 0.096 - t*0.034, 20, 9);
  g.add(new THREE.Mesh(femG, bMat));
  const rfm = new THREE.Mesh(femG, bMat); rfm.scale.x = -1; g.add(rfm);

  // Knee caps
  [-0.28, 0.28].forEach(x => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.054, 12, 10), bMat);
    p.position.set(x, -1.23, 0.07); g.add(p);
  });

  // Tibia & Fibula
  [
    [mkCurve([[-0.27,-1.22,0.03],[-0.28,-1.60,0.02],[-0.27,-1.97,0.01]]), 0.056],
    [mkCurve([[-0.32,-1.22,0.01],[-0.33,-1.60,0.01],[-0.30,-1.97,0.01]]), 0.026],
  ].forEach(([c, r]) => {
    const tg = taperedTube(c, () => r, 16, 8);
    g.add(new THREE.Mesh(tg, bMat));
    const m = new THREE.Mesh(tg, bMat); m.scale.x = -1; g.add(m);
  });

  // Heel bones (calcaneus)
  [-0.27, 0.27].forEach(x => {
    const hg = new THREE.SphereGeometry(0.070, 12, 10);
    const h = new THREE.Mesh(hg, bMat); h.scale.set(1.5, 0.8, 1.2);
    h.position.set(x, -2.04, -0.05); g.add(h);
  });

  return g;
}

/* ─────────────────────────────────────────────────────
   MUSCLES
───────────────────────────────────────────────────── */
function buildMuscles() {
  const mMat = new THREE.MeshStandardMaterial({
    color: 0xb82020, roughness: 0.52, metalness: 0.04,
    emissive: 0x3a0808, emissiveIntensity: 0.28,
  });
  const mMatDark = new THREE.MeshStandardMaterial({
    color: 0x942222, roughness: 0.60, metalness: 0.02,
    emissive: 0x280606, emissiveIntensity: 0.20,
  });
  const g = new THREE.Group();

  // Head overlay
  const ho = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x922222, roughness: 0.55, transparent: true, opacity: 0.48, emissive: 0x200000, emissiveIntensity: 0.3 })
  );
  ho.scale.set(0.97, 1.18, 0.92); ho.position.set(0, 2.50, -0.01); ho.name = "head";
  g.add(ho);

  const sym = (pts, rFn, seg = 16, rad = 11, alt = false) => {
    const geo = taperedTube(mkCurve(pts), rFn, seg, rad);
    g.add(new THREE.Mesh(geo, alt ? mMatDark : mMat));
    const m = new THREE.Mesh(geo, alt ? mMatDark : mMat); m.scale.x = -1; g.add(m);
  };

  // Pectoralis (chest)
  sym([[-0.10,1.42,0.09],[-0.32,1.36,0.16],[-0.52,1.24,0.13],[-0.64,1.12,0.08]],
      t => 0.115 + Math.sin(t*Math.PI)*0.062, 16, 12);

  // Trapezius (upper back/neck)
  sym([[0.004,1.62,-0.06],[-0.30,1.50,-0.10],[-0.58,1.38,-0.06]],
      t => 0.062 + t*0.042, 12, 9, true);

  // Sternocleidomastoid (neck)
  sym([[0,1.60,0.10],[-0.14,1.74,0.04],[-0.18,1.88,-0.02]],
      t => 0.042 + Math.sin(t*Math.PI)*0.022, 10, 8);

  // Deltoid (shoulder)
  sym([[-0.46,1.52,0.02],[-0.54,1.40,0.10],[-0.58,1.22,0.04]],
      t => 0.125 - t*0.042, 12, 11);

  // Biceps
  sym([[-0.50,1.38,0.07],[-0.56,1.12,0.15],[-0.59,0.85,0.14],[-0.60,0.60,0.10]],
      t => 0.064 + Math.sin(t*Math.PI)*0.062, 16, 10);

  // Triceps
  sym([[-0.50,1.30,-0.06],[-0.56,1.05,-0.09],[-0.59,0.75,-0.07],[-0.60,0.56,-0.02]],
      t => 0.072 + Math.sin(t*Math.PI)*0.052, 16, 10, true);

  // Forearm
  sym([[-0.60,0.56,0.04],[-0.59,0.32,0.03],[-0.58,0.08,0.02]],
      t => 0.064 - t*0.022, 12, 9);

  // Rectus abdominis (abs) — 3 segments per side
  for (let i = 0; i < 3; i++) {
    const y0 = 1.22 - i*0.26;
    [-0.11, 0.11].forEach(x => {
      g.add(new THREE.Mesh(
        taperedTube(mkCurve([[x,y0,0.13],[x+0.002,y0-0.10,0.14],[x,y0-0.20,0.13]]),
          () => 0.060, 8, 9),
        i % 2 === 0 ? mMat : mMatDark));
    });
  }

  // Obliques
  sym([[-0.22,0.90,0.10],[-0.40,0.64,0.12],[-0.50,0.38,0.08]],
      t => 0.052 + t*0.022, 12, 9, true);

  // Gluteus
  sym([[-0.22,0.04,-0.04],[-0.38,-0.08,-0.14],[-0.45,-0.26,-0.11],[-0.34,-0.38,-0.04]],
      t => 0.128 + Math.sin(t*Math.PI)*0.072, 14, 12);

  // Quadriceps (front thigh)
  sym([[-0.26,0.00,0.08],[-0.27,-0.40,0.12],[-0.28,-0.85,0.10],[-0.28,-1.20,0.04]],
      t => 0.105 + Math.sin(t*Math.PI*0.9)*0.082, 22, 12);

  // Hamstrings (back thigh)
  sym([[-0.24,-0.02,-0.08],[-0.26,-0.40,-0.12],[-0.28,-0.84,-0.10],[-0.28,-1.20,-0.04]],
      t => 0.086 + Math.sin(t*Math.PI)*0.064, 20, 11, true);

  // Gastrocnemius (calf back)
  sym([[-0.27,-1.22,-0.05],[-0.28,-1.50,-0.12],[-0.27,-1.77,-0.09],[-0.27,-1.97,-0.02]],
      t => 0.044 + Math.sin(t*Math.PI*0.85)*0.104, 18, 11);

  // Tibialis anterior (shin)
  sym([[-0.28,-1.22,0.09],[-0.28,-1.57,0.12],[-0.27,-1.96,0.06]],
      t => 0.044 + (1-t)*0.020, 14, 8, true);

  return g;
}

/* ─────────────────────────────────────────────────────
   NERVES
───────────────────────────────────────────────────── */
function buildNerves() {
  const nMat = new THREE.MeshStandardMaterial({
    color: 0xffd200, roughness: 0.22, metalness: 0.45,
    emissive: 0xffcc00, emissiveIntensity: 0.55,
  });
  const nMatThin = new THREE.MeshStandardMaterial({
    color: 0xffe040, roughness: 0.25, metalness: 0.35,
    emissive: 0xffcc00, emissiveIntensity: 0.40,
  });
  const g = new THREE.Group();

  // Head overlay
  const ho = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x886600, roughness: 0.45, transparent: true, opacity: 0.30, emissive: 0xffaa00, emissiveIntensity: 0.18 })
  );
  ho.scale.set(0.97, 1.18, 0.92); ho.position.set(0, 2.50, -0.01); ho.name = "head";
  g.add(ho);

  const n = (pts, r = 0.016) => new THREE.Mesh(thinTube(mkCurve(pts), r, 20, 6), nMat);
  const sym = (pts, r = 0.016) => {
    g.add(n(pts, r));
    const m = n(pts, r); m.scale.x = -1; g.add(m);
  };

  // Spinal cord
  g.add(n([[0.002,1.96,-0.02],[0,1.40,-0.04],[-0.002,0.82,-0.04],[0,0.20,-0.02],[0.001,-0.38,0]], 0.034));

  // Brachial plexus (neck → arm)
  [1.62,1.54,1.46,1.38,1.30].forEach((y, i) => {
    sym([[0,y,-0.03],[-(0.14+i*0.05),y-0.08,0.02],[-(0.36+i*0.03),y-0.16,0.04],[-0.48,1.44,0.02]], 0.012);
  });

  // Arm nerves
  sym([[-0.48,1.44,0.02],[-0.55,1.18,0.10],[-0.59,0.82,0.10],[-0.60,0.45,0.06],[-0.59,0.10,0.02]], 0.016);
  sym([[-0.48,1.40,-0.02],[-0.55,1.12,-0.04],[-0.58,0.76,-0.04],[-0.60,0.38,-0.02],[-0.58,0.08,0]], 0.014);
  sym([[-0.50,1.34,0.06],[-0.56,1.06,0.10],[-0.59,0.74,0.10],[-0.60,0.36,0.05],[-0.59,0.06,0.02]], 0.012);

  // Intercostal nerves
  for (let i = 0; i < 6; i++) {
    const y = 1.30 - i*0.10;
    sym([[0.002,y,-0.04],[-0.22,y-0.01,0.04],[-0.44,y-0.02,0.06],[-0.62,y-0.05,0.04]], 0.010);
  }

  // Lumbar plexus
  [0.14, 0.02, -0.10, -0.20].forEach(y => {
    sym([[0.001,y,-0.04],[-0.16,y-0.07,0.02],[-0.28,y-0.12,0.04]], 0.012);
  });

  // Sciatic nerve
  sym([[-0.18,-0.12,-0.06],[-0.24,-0.44,-0.10],[-0.27,-0.88,-0.08],[-0.27,-1.24,-0.04],[-0.27,-1.62,-0.02]], 0.028);

  // Peroneal branch
  sym([[-0.27,-1.24,-0.04],[-0.30,-1.54,0.07],[-0.28,-1.90,0.07]], 0.014);

  // Tibial branch
  sym([[-0.27,-1.24,-0.04],[-0.27,-1.56,-0.10],[-0.27,-1.90,-0.07]], 0.014);

  // Femoral nerve (front)
  sym([[-0.16,-0.08,0.10],[-0.22,-0.42,0.12],[-0.26,-0.86,0.10]], 0.016);

  return g;
}

/* ─────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────── */
export default function BodySelector({ onNext, onBack, t }) {
  const mountRef  = useRef(null);
  const sceneRef  = useRef({});
  const [layer, setLayer] = useState("full");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let raf;
    try {
      const W = el.clientWidth || 358, H = el.clientHeight || 500;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x08001a);

      const cam = new THREE.PerspectiveCamera(34, W/H, 0.1, 60);
      cam.position.set(0, 0.36, 9.6);
      cam.lookAt(0, 0.36, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = false;
      el.appendChild(renderer.domElement);

      // ── Lighting ──
      // Ambient — cool deep blue fill
      scene.add(new THREE.AmbientLight(0x1a1a3a, 1.2));

      // Key light — warm from upper-right-front
      const keyL = new THREE.DirectionalLight(0xfff4e0, 2.4);
      keyL.position.set(2.8, 5, 5.5); scene.add(keyL);

      // Fill light — cool from left
      const fillL = new THREE.DirectionalLight(0x8ab0ff, 0.75);
      fillL.position.set(-3.5, 1.5, 3); scene.add(fillL);

      // Rim light — strong from back (makes body "pop" against dark bg)
      const rimL = new THREE.DirectionalLight(0xffffff, 1.05);
      rimL.position.set(0, 1.5, -5.5); scene.add(rimL);

      // Top light
      const topL = new THREE.DirectionalLight(0xffe8d0, 0.55);
      topL.position.set(0, 7, 1); scene.add(topL);

      // Under light — subtle warm bounce
      const underL = new THREE.DirectionalLight(0xff8844, 0.18);
      underL.position.set(0, -4, 2); scene.add(underL);

      // Head glow point light (pulses)
      const headGlow = new THREE.PointLight(0x7C3AED, 0, 4.0);
      headGlow.position.set(0, 2.58, 1.2);
      headGlow.name = "headGlow";
      scene.add(headGlow);

      // ── Materials & Groups ──
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xcec6be,
        roughness: 0.60,
        metalness: 0.05,
      });

      const fullGroup   = buildFull(skinMat);
      const boneGroup   = buildSkeleton();
      const muscleGroup = buildMuscles();
      const nerveGroup  = buildNerves();

      boneGroup.visible = false; muscleGroup.visible = false; nerveGroup.visible = false;
      [fullGroup, boneGroup, muscleGroup, nerveGroup].forEach(gr => scene.add(gr));
      sceneRef.current = { fullGroup, boneGroup, muscleGroup, nerveGroup, renderer, scene, cam };

      // ── Raycaster ──
      const raycaster = new THREE.Raycaster();
      const onPointerDown = e => {
        const rect = el.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        raycaster.setFromCamera({
          x:  ((cx - rect.left) / rect.width)  * 2 - 1,
          y: -((cy - rect.top)  / rect.height) * 2 + 1,
        }, cam);
        const hits = raycaster.intersectObjects(scene.children, true);
        if (hits.length > 0) {
          if (hits[0].object.name === "head") onNext();
          else { setToast(true); setTimeout(() => setToast(false), 2200); }
        }
      };
      el.addEventListener("pointerdown", onPointerDown);
      sceneRef.current.cleanup = () => el.removeEventListener("pointerdown", onPointerDown);

      // ── Render loop ──
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const elapsed = performance.now() / 1000;
        scene.rotation.y = Math.sin(elapsed * 0.18) * 0.22;
        const pulse = 0.5 + Math.abs(Math.sin(elapsed * 1.6)) * 2.2;
        scene.traverse(child => {
          if (child.name === "headGlow") child.intensity = pulse;
        });
        renderer.render(scene, cam);
      };
      animate();
    } catch (err) {
      console.error("BodySelector:", err);
      setError(err.message);
    }
    return () => {
      cancelAnimationFrame(raf);
      sceneRef.current.cleanup?.();
      const { renderer } = sceneRef.current;
      if (renderer) {
        if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const { fullGroup, boneGroup, muscleGroup, nerveGroup } = sceneRef.current;
    if (!fullGroup) return;
    fullGroup.visible   = layer === "full";
    boneGroup.visible   = layer === "bone";
    muscleGroup.visible = layer === "muscle";
    nerveGroup.visible  = layer === "nerve";
  }, [layer]);

  const TABS = [
    { key: "full",   label: t.layerFull,   color: "#7C3AED", icon: "🧍" },
    { key: "bone",   label: t.layerBone,   color: "#D97706", icon: "🦴" },
    { key: "muscle", label: t.layerMuscle, color: "#DC2626", icon: "💪" },
    { key: "nerve",  label: t.layerNerve,  color: "#F59E0B", icon: "✨" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B21A8", fontSize: "15px", cursor: "pointer", fontWeight: "600", padding: "4px 0", marginBottom: "6px", display: "block" }}>{t.back}</button>
        <h2 style={{ margin: "0 0 2px", color: "#1F0A3C", fontSize: "20px", fontWeight: "700" }}>{t.selectBodyPart}</h2>
        <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>{t.tapBodyPart}</p>
      </div>

      <div style={{ display: "flex", gap: "6px", padding: "0 16px 8px", flexShrink: 0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setLayer(tab.key)} style={{
            flex: 1, padding: "7px 2px", borderRadius: "10px", border: "2px solid",
            borderColor: layer === tab.key ? tab.color : "#E5E7EB",
            backgroundColor: layer === tab.key ? tab.color + "1a" : "#FAFAFA",
            color: layer === tab.key ? tab.color : "#888",
            fontSize: "12px", fontWeight: layer === tab.key ? "700" : "500",
            cursor: "pointer", transition: "all 0.15s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
          }}>
            <span style={{ fontSize: "17px", lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {error ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", padding: "20px", fontSize: "13px", textAlign: "center" }}>
          렌더링 오류: {error}
        </div>
      ) : (
        <div ref={mountRef} style={{ flex: 1, position: "relative", overflow: "hidden", cursor: "pointer" }} />
      )}

      <div style={{ padding: "8px 16px 10px", textAlign: "center", color: "#7C3AED", fontSize: "13px", fontWeight: "600", flexShrink: 0 }}>
        {t.tapHead}
      </div>

      {toast && (
        <div style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", background: "rgba(30,10,60,0.92)", color: "#fff", padding: "10px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", zIndex: 99 }}>
          {t.comingSoon}
        </div>
      )}
    </div>
  );
}
