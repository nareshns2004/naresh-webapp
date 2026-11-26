/* nature.js (index.html only): the wildlife layer.
   Every homepage section is a habitat on one walk through the wild: endless sky → rainforest → savanna → wetland →
   forest → high peaks → lagoon → tundra → deep sea → aviary → sunset. This file draws each habitat's horizon (the border
   between two sections), hangs creepers and branches, and places the animals that live there. Shapes are generated
   from a seeded RNG, so every visit draws the same landscape. Decoration only: aria-hidden, static under reduced motion.
   Silhouettes: assets/wildlife/ (credits in assets/wildlife/CREDITS.md). Colours come from each band's CSS variables. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = 'assets/wildlife/';
  const W = 1440;
  const n = v => Math.round(v * 10) / 10;
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const between = (r, a, b) => a + r() * (b - a);
  const svg = (h, body, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 ${W} ${h}" preserveAspectRatio="xMidYMax slice" width="100%" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`;
  const fill = v => `style="fill:var(${v})"`;
  const P = (d, v, extra = '') => `<path d="${d}" ${fill(v)} ${extra}/>`;
  const S = (d, v, w, extra = '') => `<path d="${d}" style="fill:none;stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

  // closed smooth ground line through pts, down to the bottom of the box
  const ground = (pts, h) => {
    let d = `M-60 ${h}L${n(pts[0][0])} ${n(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      d += `Q${n(x0)} ${n(y0)} ${n((x0 + x1) / 2)} ${n((y0 + y1) / 2)}`;
    }
    const last = pts[pts.length - 1];
    return d + `L${n(last[0])} ${n(last[1])}L${W + 60} ${h}Z`;
  };
  const wave = (r, base, amp, step) => { const p = []; for (let x = -60; x <= W + 60; x += step * between(r, 0.7, 1.3)) p.push([x, base - amp * r()]); return p; };
  const jag = (r, base, amp, step) => { const p = []; let y = base - amp / 2;
    for (let x = -60; x <= W + 60; x += step * between(r, 0.5, 1.4)) { y = Math.min(base, Math.max(base - amp, y + between(r, -amp, amp) * 0.7)); p.push([x, y]); }
    return 'M-60 400' + p.map(([x, y]) => `L${n(x)} ${n(y)}`).join('') + `L${W + 60} 400Z`; };

  /* ── trees & plants ── */
  const pine = (x, g, h) => { const T = 4, R = [], L = [];
    for (let k = 1; k <= T; k++) { const y = g - h + (k * h * 0.82) / T, w = h * 0.1 + (k * h * 0.26) / T;
      R.push([x + w, y]); if (k < T) R.push([x + w * 0.4, y - h * 0.03]); }
    R.push([x + h * 0.04, g - h * 0.18], [x + h * 0.04, g + 4]);
    R.forEach(([px, py]) => L.unshift([2 * x - px, py]));
    return `M${n(x)} ${n(g - h)}` + R.concat(L).map(([px, py]) => `L${n(px)} ${n(py)}`).join('') + 'Z'; };
  const acacia = (r, x, g, h, v) => { const lean = between(r, -0.15, 0.15) * h, tx = x + lean, ty = g - h * 0.78, cw = h * between(r, 0.9, 1.3);
    let out = S(`M${n(x)} ${g + 4}Q${n(x + lean * 0.2)} ${n(g - h * 0.4)} ${n(tx)} ${n(ty)}M${n(tx)} ${n(ty)}L${n(tx - cw * 0.28)} ${n(ty - h * 0.14)}M${n(tx)} ${n(ty)}L${n(tx + cw * 0.3)} ${n(ty - h * 0.16)}`, v, Math.max(2, h * 0.05));
    for (let i = 0; i < 5; i++) out += `<ellipse cx="${n(tx + between(r, -0.4, 0.4) * cw)}" cy="${n(ty - h * between(r, 0.14, 0.24))}" rx="${n(cw * between(r, 0.22, 0.38))}" ry="${n(h * between(r, 0.07, 0.11))}" ${fill(v)}/>`;
    return out; };
  const palm = (r, x, g, h, v) => { const tx = x - h * 0.28, ty = g - h;
    let out = S(`M${x} ${g + 4}Q${n(x + h * 0.08)} ${n(g - h * 0.55)} ${n(tx)} ${n(ty)}`, v, Math.max(3, h * 0.05));
    for (let i = 0; i < 8; i++) { const a = (-160 + i * 42 + between(r, -8, 8)) * Math.PI / 180, L = h * between(r, 0.38, 0.55);
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.6 + L * 0.35, mx = tx + Math.cos(a) * L * 0.5, my = ty + Math.sin(a) * L * 0.5 - 6;
      out += P(`M${n(tx)} ${n(ty)}Q${n(mx)} ${n(my - 6)} ${n(ex)} ${n(ey)}Q${n(mx)} ${n(my + 5)} ${n(tx)} ${n(ty)}Z`, v); }
    return out; };
  const baobab = (r, x, g, h, v) => { const tw = h * 0.22, ty = g - h * 0.62;
    let out = P(`M${n(x - tw)} ${g + 4}Q${n(x - tw * 0.7)} ${n(g - h * 0.3)} ${n(x - tw * 0.55)} ${n(ty)}L${n(x + tw * 0.55)} ${n(ty)}Q${n(x + tw * 0.7)} ${n(g - h * 0.3)} ${n(x + tw)} ${g + 4}Z`, v);
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32, L = h * between(r, 0.22, 0.38), sx = x + (i - 3) * tw * 0.16;
      out += S(`M${n(sx)} ${n(ty + 2)}Q${n(sx + Math.cos(a) * L * 0.4)} ${n(ty - L * 0.5)} ${n(sx + Math.cos(a) * L)} ${n(ty + Math.sin(a) * L)}`, v, 2.4);
      out += `<circle cx="${n(sx + Math.cos(a) * L)}" cy="${n(ty + Math.sin(a) * L)}" r="${n(h * 0.06)}" ${fill(v)}/>`; }
    return out; };
  const reeds = (r, x, g, v) => { let out = '';
    for (let i = 0; i < 9; i++) { const bx = x + between(r, -16, 16), L = between(r, 26, 62), lean = between(r, -10, 10);
      out += S(`M${n(bx)} ${g}Q${n(bx + lean * 0.3)} ${n(g - L * 0.6)} ${n(bx + lean)} ${n(g - L)}`, v, 1.6);
      if (r() < 0.45) out += `<ellipse cx="${n(bx + lean * 0.92)}" cy="${n(g - L * 0.88)}" rx="2.6" ry="7" transform="rotate(${n(lean)} ${n(bx + lean)} ${n(g - L * 0.88)})" ${fill(v)}/>`; }
    return out; };
  const leaf = (x, y, a, L, wd, v, op = 1) => { const c = Math.cos(a), s = Math.sin(a), ex = x + c * L, ey = y + s * L, mx = x + c * L / 2, my = y + s * L / 2;
    return P(`M${n(x)} ${n(y)}Q${n(mx - s * wd)} ${n(my + c * wd)} ${n(ex)} ${n(ey)}Q${n(mx + s * wd)} ${n(my - c * wd)} ${n(x)} ${n(y)}Z`, v, op < 1 ? `opacity="${op}"` : ''); };
  const bloom = (x, y, rad, v) => { let o = '';
    for (let i = 0; i < 5; i++) { const a = i * 1.2566; o += `<circle cx="${n(x + Math.cos(a) * rad)}" cy="${n(y + Math.sin(a) * rad)}" r="${n(rad * 0.75)}" ${fill(v)}/>`; }
    return o + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(rad * 0.45)}" style="fill:#F6D365"/>`; };

  /* ── flowers: real colours (they read on light and dark bands alike) ── */
  const petal = (cx, cy, a, L, wd, col, op = 1) => { const c = Math.cos(a), s = Math.sin(a), ex = cx + c * L, ey = cy + s * L, mx = cx + c * L * 0.55, my = cy + s * L * 0.55;
    return `<path d="M${n(cx)} ${n(cy)}Q${n(mx - s * wd)} ${n(my + c * wd)} ${n(ex)} ${n(ey)}Q${n(mx + s * wd)} ${n(my - c * wd)} ${n(cx)} ${n(cy)}Z" style="fill:${col}" opacity="${op}"/>`; };
  const FLOWER = {
    lotus(x, y, k) { let o = '';
      [[-2.1, 26, '#F4A6C4'], [-1.05, 26, '#F4A6C4'], [-2.5, 22, '#F7BFD4'], [-0.65, 22, '#F7BFD4'], [-1.85, 30, '#EC7FA8'], [-1.3, 30, '#EC7FA8'], [-1.57, 32, '#E4628F']]
        .forEach(([a, L, c]) => o += petal(x, y, a, L * k, 7 * k, c));
      return `<ellipse cx="${n(x)}" cy="${n(y + 3 * k)}" rx="${n(22 * k)}" ry="${n(5 * k)}" style="fill:#3E8C5A" opacity=".8"/>` + o + `<circle cx="${n(x)}" cy="${n(y - 8 * k)}" r="${n(3.2 * k)}" style="fill:#F6D365"/>`; },
    hibiscus(x, y, k, col = '#E0344B') { let o = '';
      for (let i = 0; i < 5; i++) o += petal(x, y, i * 1.2566 - 1.57, 16 * k, 10 * k, col);
      o += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(5 * k)}" style="fill:#7A1027"/>`;
      return o + `<path d="M${n(x)} ${n(y)}l${n(10 * k)} ${n(-14 * k)}" style="stroke:#F6D365;fill:none" stroke-width="${n(1.6 * k)}"/><circle cx="${n(x + 10 * k)}" cy="${n(y - 14 * k)}" r="${n(2.2 * k)}" style="fill:#F6D365"/>`; },
    orchid(x, y, k) { let o = '';
      [[-1.57, 14, 5, '#C77DFF'], [0.5, 13, 5, '#C77DFF'], [2.64, 13, 5, '#C77DFF'], [-0.55, 13, 7, '#E0AAFF'], [-2.6, 13, 7, '#E0AAFF']].forEach(([a, L, wd, c]) => o += petal(x, y, a, L * k, wd * k, c));
      return o + `<ellipse cx="${n(x)}" cy="${n(y + 6 * k)}" rx="${n(5 * k)}" ry="${n(6 * k)}" style="fill:#9D4EDD"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(2 * k)}" style="fill:#FFD166"/>`; },
    passion(x, y, k) { let o = '';
      for (let i = 0; i < 10; i++) o += petal(x, y, i * 0.628, 16 * k, 5 * k, i % 2 ? '#F1E9FF' : '#D8C8F5');
      for (let i = 0; i < 36; i++) { const a = i * 0.1745; o += `<path d="M${n(x + Math.cos(a) * 5 * k)} ${n(y + Math.sin(a) * 5 * k)}L${n(x + Math.cos(a) * 13 * k)} ${n(y + Math.sin(a) * 13 * k)}" style="stroke:${i % 3 ? '#6A2C91' : '#FFFFFF'}" stroke-width="${n(0.9 * k)}"/>`; }
      return o + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(4 * k)}" style="fill:#9BBF4A"/>`; },
    sunflower(x, y, k, col = '#F5B82E', seed = '#5A3714') { let o = '';
      for (let i = 0; i < 22; i++) o += petal(x, y, i * 0.2856, 16 * k, 3.6 * k, col);
      o += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(8 * k)}" style="fill:${seed}"/>`;
      for (let i = 1; i < 70; i++) { const a = i * 2.39996, rr = Math.sqrt(i) * 0.9 * k;     // golden-angle phyllotaxis
        o += `<circle cx="${n(x + Math.cos(a) * rr)}" cy="${n(y + Math.sin(a) * rr)}" r="${n(0.55 * k)}" style="fill:#C98B2B"/>`; }
      return o; },
  };
  const pick = (r, list) => list[Math.floor(r() * list.length)];

  /* ── fractals of nature ── */
  const fernMask = (() => { let url; return () => { if (url) return url;        // Barnsley fern, drawn once into a canvas and used as a mask
    const c = document.createElement('canvas'); c.width = 260; c.height = 420; const g = c.getContext('2d'); g.fillStyle = '#000';
    let x = 0, y = 0; const r = rng(7);
    for (let i = 0; i < 26000; i++) { const p = r(); let nx, ny;
      if (p < 0.01) { nx = 0; ny = 0.16 * y; } else if (p < 0.86) { nx = 0.85 * x + 0.04 * y; ny = -0.04 * x + 0.85 * y + 1.6; }
      else if (p < 0.93) { nx = 0.2 * x - 0.26 * y; ny = 0.23 * x + 0.22 * y + 1.6; } else { nx = -0.15 * x + 0.28 * y; ny = 0.26 * x + 0.24 * y + 0.44; }
      x = nx; y = ny; g.fillRect(130 + x * 38, 415 - y * 40, 1.3, 1.3); }
    return (url = c.toDataURL()); }; })();
  const fractalTree = (r, h) => { let d = '';
    const grow = (x, y, a, L, depth) => { if (depth === 0 || L < 2) return; const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L;
      d += `M${n(x)} ${n(y)}L${n(x2)} ${n(y2)}`; grow(x2, y2, a - between(r, 0.3, 0.5), L * between(r, 0.66, 0.78), depth - 1); grow(x2, y2, a + between(r, 0.3, 0.5), L * between(r, 0.66, 0.78), depth - 1); };
    grow(100, h, -Math.PI / 2, h * 0.3, 9);
    return `<svg viewBox="0 0 200 ${h}" width="200" height="${h}"><path d="${d}" style="fill:none;stroke:var(--deep)" stroke-width="1.2" stroke-linecap="round"/></svg>`; };
  const nautilus = () => { let d = '', ch = '';                                   // logarithmic spiral with its chambers
    const R = t => 2.2 * Math.exp(0.1759 * t), pt = t => [100 + R(t) * Math.cos(t), 100 + R(t) * Math.sin(t)];
    for (let t = 0; t <= 6 * Math.PI; t += 0.08) { const [x, y] = pt(t); d += (d ? 'L' : 'M') + n(x) + ' ' + n(y); }
    for (let t = 2.4; t <= 6 * Math.PI; t += 0.55) { const [x1, y1] = pt(t), [x2, y2] = pt(t - 2 * Math.PI); ch += `M${n(x1)} ${n(y1)}Q${n((x1 + x2) / 2 + 3)} ${n((y1 + y2) / 2 - 3)} ${n(x2)} ${n(y2)}`; }
    return `<svg viewBox="0 0 200 200" width="150" height="150"><path d="${d}" style="fill:#F3E3C3;stroke:#B9824A" stroke-width="2"/><path d="${ch}" style="fill:none;stroke:#B9824A" stroke-width="1.3" opacity=".8"/>` +
      `<path d="${d}" style="fill:none;stroke:#8C5A2B" stroke-width="2.4"/></svg>`; };
  const flowerArt = (r, kind, k) => `<svg viewBox="-40 -40 80 80" width="${n(80 * k)}" height="${n(80 * k)}">${FLOWER[kind](0, 0, 1.4)}</svg>`;

  /* ── horizons: each returns [height, svg body] ── */
  const EDGE = {
    mountains(r) { const h = 170;
      return [h, P(jag(r, 120, 110, 70), '--m1') + P(jag(r, 140, 80, 55), '--m2') + P(ground(wave(r, 160, 18, 90), h), '--band')]; },
    canopy(r) { const h = 150; let b = '';
      for (let x = -40; x < W + 60; x += between(r, 70, 160)) { const cy = between(r, 34, 56), rr = between(r, 26, 40);
        b += S(`M${n(x)} 120L${n(x + between(r, -6, 6))} ${n(cy)}`, '--deep', 5, 'opacity=".55"');
        for (let k = 0; k < 4; k++) b += `<circle cx="${n(x + between(r, -rr, rr) * 0.8)}" cy="${n(cy + between(r, -8, 10))}" r="${n(rr * between(r, 0.55, 0.85))}" ${fill('--deep')} opacity=".5"/>`; }
      for (let x = -40; x < W + 60; x += between(r, 30, 52)) b += `<circle cx="${n(x)}" cy="${n(between(r, 70, 92))}" r="${n(between(r, 30, 50))}" ${fill('--back')}/>`;
      for (let x = -30; x < W + 60; x += between(r, 26, 42)) b += `<circle cx="${n(x)}" cy="${n(between(r, 116, 130))}" r="${n(between(r, 24, 36))}" ${fill('--band')}/>`;
      return [h, b + `<rect x="-60" y="132" width="${W + 120}" height="40" ${fill('--band')}/>`]; },
    savanna(r) { const h = 150; let b = P(ground(wave(r, 128, 14, 120), h), '--back');
      [[90, 70], [250, 46], [560, 34], [980, 40], [1190, 82], [1330, 52]].forEach(([x, th]) => b += acacia(r, x, 134, th, x === 90 || x === 1190 ? '--deep' : '--back2'));
      b += baobab(r, 760, 134, 64, '--back2') + baobab(r, 1430, 136, 50, '--back2');
      b += P(ground(wave(r, 140, 6, 140), h), '--band');
      for (let i = 0; i < 70; i++) { const x = between(r, 0, W), y = 141; b += S(`M${n(x)} ${y}l${n(between(r, -4, 4))} -${n(between(r, 5, 11))}M${n(x + 3)} ${y}l${n(between(r, -3, 5))} -${n(between(r, 4, 9))}`, '--deep', 1.2, 'opacity=".55"'); }
      return [h, b]; },
    reeds(r) { const h = 130; let b = '';
      for (let x = -40; x < W + 60; x += between(r, 22, 40)) b += `<circle cx="${n(x)}" cy="${n(between(r, 92, 102))}" r="${n(between(r, 14, 26))}" ${fill('--back')}/>`;
      b += `<rect x="-60" y="104" width="${W + 120}" height="40" ${fill('--band')}/>`;
      [40, 150, 330, 610, 900, 1120, 1260, 1400].forEach(x => b += reeds(r, x, 108, '--deep'));
      for (let i = 0; i < 16; i++) { const x = between(r, 0, W), y = between(r, 112, 124); b += S(`M${n(x)} ${n(y)}h${n(between(r, 18, 46))}`, '--deep', 1, 'opacity=".35"'); }
      [[470, 114], [520, 120], [760, 116], [1010, 121]].forEach(([x, y]) => b += P(`M${x} ${y}m-14 0a14 4.5 0 1 0 28 0l-14 0z`, '--deep', 'opacity=".55"'));
      [[230, 112, 0.8], [560, 114, 0.95], [700, 112, 0.7], [1180, 114, 0.9], [1330, 112, 0.65]].forEach(([x, y, k]) => b += FLOWER.lotus(x, y, k));
      return [h, b]; },
    pines(r) { const h = 170; let b = '';
      for (let x = -20; x < W + 40; x += between(r, 22, 40)) b += P(pine(x, 150, between(r, 70, 130)), '--back');
      for (let x = -10; x < W + 40; x += between(r, 40, 90)) b += P(pine(x, 160, between(r, 50, 100)), '--back2');
      return [h, b + P(ground(wave(r, 158, 8, 110), h), '--band')]; },
    peaks(r) { const h = 190, pts = []; let b = '';
      for (let x = -60, up = true; x <= W + 60; x += between(r, 60, 140), up = !up) pts.push([x, up ? between(r, 20, 70) : between(r, 110, 140)]);
      b += P('M-60 400' + pts.map(([x, y]) => `L${n(x)} ${n(y)}`).join('') + `L${W + 60} 400Z`, '--back');
      pts.forEach(([x, y], i) => { if (y < 75 && i && i < pts.length - 1) { const [xl, yl] = pts[i - 1], [xr, yr] = pts[i + 1], t = 0.22;
        const lx = x + (xl - x) * t, ly = y + (yl - y) * t, rx = x + (xr - x) * t, ry = y + (yr - y) * t;
        b += P(`M${n(x)} ${n(y)}L${n(rx)} ${n(ry)}L${n((x + rx) / 2)} ${n(ry - 4)}L${n(x)} ${n(ry + 3)}L${n((x + lx) / 2)} ${n(ly - 2)}L${n(lx)} ${n(ly)}Z`, '--snow'); } });
      b += P(jag(r, 176, 50, 60), '--back2');
      return [h, b + P(ground(wave(r, 180, 6, 120), h), '--band')]; },
    waves(r) { const h = 160; let b = '';
      const sine = (base, amp, per, ph) => { let d = `M-60 ${h}L-60 ${base}`; for (let x = -60; x <= W + 60; x += 12) d += `L${x} ${n(base + Math.sin((x / per) * 6.283 + ph) * amp)}`; return d + `L${W + 60} ${h}Z`; };
      b += P(`M980 ${h}Q1180 92 1440 110L1440 ${h}Z`, '--sand');
      b += palm(r, 1240, 116, 104, '--deep') + palm(r, 1330, 118, 74, '--deep');
      [[1120, 108, 0.8, '#E0344B'], [1166, 104, 0.6, '#F28C28'], [1395, 106, 0.75, '#D63A7E'], [1290, 112, 0.55, '#E0344B']].forEach(([x, y, k, c]) => b += FLOWER.hibiscus(x, y, k, c));
      b += P(sine(126, 6, 180, 0.4), '--back') + P(sine(138, 5, 130, 2.1), '--band');
      for (let i = 0; i < 12; i++) { const x = between(r, 0, 1000), y = between(r, 142, 154); b += S(`M${n(x)} ${n(y)}q8 -4 16 0t16 0`, '--deep', 1.1, 'opacity=".35"'); }
      return [h, b]; },
    ice(r) { const h = 150; let b = '';
      for (let x = -60; x < W + 60;) { const w = between(r, 70, 200), top = between(r, 60, 112), sk = between(r, -20, 20);
        b += P(`M${n(x)} 140L${n(x + w * 0.15 + sk)} ${n(top + 10)}L${n(x + w * 0.45)} ${n(top)}L${n(x + w * 0.8 + sk)} ${n(top + 16)}L${n(x + w)} 140Z`, '--back');
        b += P(`M${n(x + w * 0.45)} ${n(top)}L${n(x + w * 0.8 + sk)} ${n(top + 16)}L${n(x + w * 0.6)} 140L${n(x + w * 0.5)} 140Z`, '--snow', 'opacity=".7"');
        x += w * between(r, 0.7, 1.1); }
      return [h, b + P(jag(r, 146, 10, 50), '--band')]; },
    surface(r) { const h = 110;
      const sine = (base, amp, per, ph) => { let d = `M-60 ${h}L-60 ${base}`; for (let x = -60; x <= W + 60; x += 12) d += `L${x} ${n(base + Math.sin((x / per) * 6.283 + ph) * amp)}`; return d + `L${W + 60} ${h}Z`; };
      return [h, P(sine(58, 9, 220, 0), '--back') + P(sine(76, 7, 150, 1.7), '--band')]; },
    bush(r) { const h = 90; let b = '';
      for (let x = -40; x < W + 60; x += between(r, 26, 46)) b += `<circle cx="${n(x)}" cy="${n(between(r, 56, 72))}" r="${n(between(r, 20, 34))}" ${fill('--back')}/>`;
      for (let x = -40; x < W + 60; x += between(r, 60, 140)) b += bloom(x, between(r, 42, 66), between(r, 3.5, 5.5), r() < 0.5 ? '--bloom1' : '--bloom2');
      for (let x = 30; x < W; x += between(r, 110, 200)) { const kind = pick(r, ['hibiscus', 'orchid', 'passion']); b += FLOWER[kind](x, between(r, 40, 60), between(r, 0.55, 0.8)); }
      return [h, b + P(ground(wave(r, 80, 8, 70), h), '--band')]; },
    dusk(r) { const h = 160; let b = `<circle cx="720" cy="112" r="74" style="fill:#FFB347" opacity=".55"/><circle cx="720" cy="112" r="52" style="fill:#FFC46B" opacity=".9"/>`;
      b += P(ground(wave(r, 116, 34, 260), h), '--back');
      [[150, 92, '--deep'], [1290, 70, '--deep'], [420, 40, '--back2'], [1060, 46, '--back2']].forEach(([x, th, v]) => b += acacia(r, x, x === 150 || x === 1290 ? 132 : 122, th, v));
      [560, 600, 640, 690, 760, 800, 850, 890].forEach((x, i) => { const top = 112 - (i % 3) * 9; b += S(`M${x} 146L${x + 2} ${top}`, '--deep', 2) + FLOWER.sunflower(x + 2, top, 0.55 - (i % 3) * 0.06); });
      return [h, b + P(ground(wave(r, 140, 10, 160), h), '--band')]; },
    volcanic(r) { const h = 200; let b = '';
      b += `<circle cx="1080" cy="40" r="60" style="fill:#FF7A2F" opacity=".18"/>`;
      for (let i = 0; i < 9; i++) b += `<circle cx="${n(1080 + i * 14 + between(r, -10, 10))}" cy="${n(30 - i * 9)}" r="${n(14 + i * 4)}" style="fill:#7D7470" opacity="${n(0.5 - i * 0.04)}"/>`;
      b += P('M900 200L1040 52L1060 46L1100 46L1120 52L1280 200Z', '--back2');
      b += P('M1056 48L1080 40L1104 48L1096 70L1086 56L1076 76L1066 58Z', '--lava');
      b += P(ground(wave(r, 150, 30, 200), h), '--back');
      for (let x = 20; x < W; x += between(r, 110, 220)) b += r() < 0.5 ? palm(r, x, 168, between(r, 50, 90), '--deep') : P(pine(x, 170, between(r, 60, 110)), '--deep');
      for (let i = 0; i < 22; i++) { const x = between(r, 0, W); b += leaf(x, 176, -2.2, 22, 6, '--deep', 0.8) + leaf(x, 176, -0.9, 22, 6, '--deep', 0.8) + leaf(x, 176, -1.57, 26, 6, '--deep', 0.8); }
      return [h, b + P(ground(wave(r, 178, 6, 120), h), '--band')]; },
    glacier(r) { const h = 190; let b = '';
      for (let x = -40; x < W + 60;) { const w = between(r, 120, 260), top = between(r, 20, 70);
        b += P(`M${n(x)} 140L${n(x + w * 0.1)} ${n(top)}L${n(x + w * 0.55)} ${n(top - 10)}L${n(x + w)} ${n(top + 12)}L${n(x + w * 1.05)} 140Z`, '--back');
        b += P(`M${n(x + w * 0.55)} ${n(top - 10)}L${n(x + w)} ${n(top + 12)}L${n(x + w * 0.9)} 140L${n(x + w * 0.62)} 140Z`, '--snow', 'opacity=".8"');
        for (let k = 1; k < 4; k++) b += S(`M${n(x + w * 0.15)} ${n(top + k * 24)}h${n(w * 0.8)}`, '--deep', 1, 'opacity=".2"');
        x += w; }
      b += P(ground(wave(r, 150, 20, 220), h), '--back2');
      for (let i = 0; i < 60; i++) { const x = between(r, 0, W); b += S(`M${n(x)} 172l${n(between(r, -3, 3))} -${n(between(r, 4, 9))}`, '--deep', 1, 'opacity=".4"'); }
      return [h, b + P(ground(wave(r, 172, 6, 140), h), '--band')]; },
  };

  /* ── overhangs: creepers and a flowering branch that hang into the top of a section ── */
  const creepers = r => { const h = 190; let b = '';
    const xs = [14, 44, 80, 112, 150, 190, 232, 262, 1180, 1214, 1252, 1290, 1326, 1362, 1398, 1430];
    for (let i = 0; i < 20; i++) xs.push(between(r, 300, 1140));
    xs.forEach(x => { const margin = x < 270 || x > 1170, L = margin ? between(r, 70, 185) : between(r, 18, 56);
      let d = `M${n(x)} 0`, y = 0, cx = x; const seg = 22; let k = 0;
      while (y < L) { const ny = Math.min(L, y + seg), nx = x + Math.sin(ny / 26 + x) * 6;
        d += `Q${n(cx + (k % 2 ? 7 : -7))} ${n(y + seg / 2)} ${n(nx)} ${n(ny)}`; cx = nx; y = ny; k++; }
      b += S(d, '--deep', 2, 'opacity=".85"');
      for (let yy = 8; yy < L; yy += between(r, 8, 13)) { const side = r() < 0.5 ? -1 : 1, lx = x + Math.sin(yy / 26 + x) * 6;
        b += leaf(lx, yy, side > 0 ? between(r, 0.3, 0.9) : between(r, 2.3, 2.8), between(r, 12, 20), between(r, 4.5, 7), r() < 0.35 ? '--back2' : '--deep', 0.92); }
      if (margin && r() < 0.8) { const fx = x + Math.sin(L / 26 + x) * 6; b += r() < 0.45 ? FLOWER.orchid(fx, L + 6, between(r, 0.6, 0.85)) : bloom(fx, L + 2, between(r, 3, 4.5), r() < 0.5 ? '--bloom1' : '--bloom2'); } });
    return [h, b]; };
  const branch = r => { const h = 230; let b = '';
    const limb = (x0, y0, x1, y1, cx, cy, t0, t1, v) => { const pts = [];
      for (let i = 0; i <= 24; i++) { const t = i / 24, x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy), l = Math.hypot(dx, dy), th = (t0 + (t1 - t0) * t) / 2;
        pts.push([x, y, -dy / l * th, dx / l * th]); }
      return P('M' + pts.map(([x, y, a, c]) => `${n(x + a)} ${n(y + c)}`).join('L') + 'L' + pts.reverse().map(([x, y, a, c]) => `${n(x - a)} ${n(y - c)}`).join('L') + 'Z', v); };
    b += limb(-40, 30, 760, 92, 300, 120, 26, 4, '--deep');
    [[120, 66, 210, 150, 150, 120], [330, 92, 400, 14, 380, 50], [520, 98, 610, 170, 560, 150], [640, 92, 700, 40, 690, 70]].forEach(([a, c, d, e, f, g]) => b += limb(a, c, d, e, f, g, 8, 2, '--deep'));
    [[210, 150], [400, 14], [610, 170], [700, 40], [760, 92], [60, 50], [470, 104]].forEach(([x, y]) => {
      for (let i = 0; i < 9; i++) b += leaf(x, y, between(r, 0, 6.28), between(r, 14, 26), between(r, 5, 8), r() < 0.4 ? '--back2' : '--deep', 0.95);
      b += bloom(x + between(r, -10, 10), y + between(r, -8, 8), between(r, 4, 6), r() < 0.5 ? '--bloom1' : '--bloom2');
      const kind = pick(r, ['hibiscus', 'orchid', 'passion']); b += FLOWER[kind](x + between(r, -14, 14), y + between(r, -10, 10), between(r, 0.7, 0.95)); });
    return [h, b]; };

  /* ── animals ── a = [file, x (% of viewport), y = feet (px from section top; negative = up on the horizon; 'bN' = N px above the bottom), height px, options] */
  const AR = { 't-rex': 200 / 140, sauropod: 210 / 200, triceratops: 200 / 120, stegosaurus: 222 / 120, plesiosaur: 2.2, smilodon: 2, megaloceros: 180 / 172, oryx: 200 / 220, elk: 200 / 220, caribou: 200 / 220, 'moose-bull': 200 / 180, cassowary: 132 / 172, narwhal: 290 / 80, walrus: 200 / 130,
    'arctic-tern': 150 / 70, frigatebird: 200 / 74, seal: 2, 'bald-eagle': 100 / 150, panda: 140 / 150, 'man-of-war': 100 / 220, 'jelly-pink': 0.5, 'jelly-cyan': 0.5, peacock: 200 / 116, crocodile: 200 / 64, 'eagle-soar': 2.5, 'vulture-soar': 2.5, albatross: 240 / 50, 'crane-fly': 200 / 60, flock: 140 / 44, 'bird-of-paradise': 120 / 124 };
  const HAB = {
    sky:        { foot: 'mountains', animals: [['arctic-tern', 40, 190, 22, 'fly d32'], ['arctic-tern', 43, 210, 18, 'fly d32'], ['frigatebird', 66, 70, 26, 'fly slow d80'], ['vulture-soar', 76, 230, 40, 'soar c=#3A3530'], ['swallow', 70, 260, 18, 'fly d40'], ['albatross', 58, 120, 26, 'fly slow d55'], ['eagle-soar', 2, 420, 34, 'soar m'], ['crane-fly', 30, 92, 22, 'fly d20'], ['crane-fly', 27.5, 106, 18, 'fly d20'], ['crane-fly', 25, 120, 16, 'fly d20'], ['crane-fly', 22.5, 132, 14, 'fly d20'], ['flock', 84, 150, 22, 'fly slow d10'], ['eagle-soar', 50, 52, 22, 'soar'], ['vulture-soar', 92, 330, 24, 'circle m']] },
    rainforest: { extra: [['monstera-leaf', 96, 40, 110, 'm fossil'], ['monstera-leaf', 0, 60, 90, 'flip m fossil']],  fx: ['rays', 'mist', 'motes'], trail: ['paw-cat', 'b175'], edge: 'canopy', over: creepers, animals: [['cassowary', 15, 'b150', 84, 'm c=#1E2A3A'], ['leopard', 78, -98, 40, 'coat-leopard'], ['parrot', 96, 330, 40, 'flip m c=#D7263D'], ['butterfly', 88, 260, 22, 'flutter m c=#2E86DE'], ['hummingbird', 6, 260, 26, 'hover m c=#1FA67A'], ['glyph-fern', 0, 'b170', 230, 'm'], ['glyph-fern', 93, 420, 200, 'flip m'], ['gorilla', 89.5, 'b150', 60, 'm'], ['snake', 9, 'b150', 40, 'm'], ['toucan', 4, -96, 44, 'flip'], ['sloth', 92.5, 120, 66, 'm'], ['hummingbird', 10, 120, 30, 'hover m'], ['butterfly', 95, 210, 26, 'flutter m'], ['butterfly', 3, 300, 22, 'flutter m'], ['frog', 96, 'b150', 34, 'm'], ['tiger', 2.5, 'b150', 76, 'coat-tiger m']] },
    savanna:    { fx: ['haze', 'dust'], trail: ['paw-cat', 'b175'], edge: 'savanna', animals: [['oryx', 58, -12, 76, ''], ['leopard', 26, -12, 48, 'coat-leopard'], ['giraffe', 33, -14, 106, 'coat-giraffe flip'], ['zebra', 64, -12, 52, 'coat-zebra'], ['zebra', 75, -12, 46, 'coat-zebra flip'], ['ostrich', 51, -12, 44, 'flip'], ['lion', 96, 280, 46, 'm c=#B87A2A'], ['vulture', 82.4, -96, 30, ''], ['giraffe', 7, -18, 128, ''], ['giraffe', 11.5, -14, 92, ''], ['zebra', 70, -12, 56, ''], ['elephant', 82, -14, 84, 'flip'], ['rhino', 93, -12, 52, ''], ['ostrich', 47, -12, 50, ''], ['vulture-soar', 94, 200, 26, 'circle m'], ['vulture-soar', 3, 330, 20, 'circle late m']] },
    wetland:    { fx: ['shimmer', 'mist'], trail: ['paw-bird', 'b175'], edge: 'reeds', animals: [['flamingo', 30, -14, 54, 'c=#E8789A'], ['flamingo', 32.5, -12, 46, 'c=#E8789A flip'], ['frog', 57, -16, 22, 'c=#4E9A3E'], ['swan', 50, -12, 34, ''], ['otter', 62, -10, 30, ''], ['beaver', 36, -10, 30, ''], ['crocodile', 22, -14, 30, 'flip'], ['hippo', 76, -10, 56, ''], ['heron', 89, -18, 84, ''], ['shoebill-stork', 6, -16, 70, 'flip'], ['dragonfly', 94, 120, 26, 'hover m'], ['dragonfly', 4, 200, 22, 'hover late m']] },
    forest:     { extra: [['birch-trees', 0.5, 'b150', 150, 'm fossil'], ['birch-trees', 93, 'b150', 130, 'm fossil'], ['mushrooms-cluster', 12, 'b150', 34, 'm c=#C0533A']],  fx: ['moon', 'mist'], trail: ['paw-bear', 'b175'], edge: 'pines', animals: [['panda', 30, -6, 74, 'art'], ['elk', 52, -10, 96, ''], ['moose-bull', 42, -10, 84, ''], ['owl', 97, 360, 44, 'm c=#8C6A3E'], ['glyph-tree', 2, 'b160', 220, 'm'], ['glyph-tree', 90, 'b160', 200, 'm'], ['moose', 70, -8, 66, ''], ['deer', 8, -10, 82, ''], ['polar-bear', 86, -10, 60, 'flip'], ['fox', 93, -10, 44, ''], ['owl', 3, 190, 52, 'm'], ['squirrel', 96, 160, 34, 'm'], ['rabbit', 14, -8, 28, '']], particles: ['firefly', 26] },
    peaks:      { fx: ['clouds', 'rays'], trail: ['deer-track', 'b175'], edge: 'peaks', animals: [['bald-eagle', 93, 380, 88, 'art m'], ['vulture-soar', 66, -110, 40, 'soar c=#2F2A26'], ['eagle-soar', 40, -96, 30, 'soar late c=#4A2F1B'], ['arctic-tern', 25, -120, 24, 'fly d12'], ['swallow', 60, -120, 24, 'fly'], ['eagle-soar', 14, -112, 36, 'soar'], ['vulture-soar', 82, -120, 28, 'circle'], ['deer-track', 95, 120, 26, 'track m'], ['deer-track', 93, 170, 26, 'track m'], ['deer-track', 95.5, 220, 26, 'track m'], ['deer-track', 93.5, 270, 26, 'track m']] },
    lagoon:     { fx: ['caustics', 'shimmer'], trail: ['paw-bird', 'b175'], edge: 'waves', animals: [['frigatebird', 50, -150, 30, 'fly slow d30'], ['flamingo', 12.5, -24, 64, 'c=#F07FA0'], ['flamingo', 5, -26, 84, 'c=#E8789A'], ['clownfish', 90, 380, 26, 'swim m c=#F07C2A'], ['tropical-fish', 6, 380, 32, 'swim m c=#F2C230'], ['glyph-nautilus', 1, 'b150', 150, 'm'], ['dolphin', 42, -40, 46, 'bob'], ['seagull', 30, -120, 24, 'fly slow'], ['flamingo', 5, -26, 84, ''], ['flamingo', 9, -22, 70, ''], ['eating-pelican', 70, -30, 56, ''], ['sea-turtle', 3, 260, 60, 'swim m'], ['tropical-fish', 94, 200, 34, 'swim back m'], ['clownfish', 96, 300, 28, 'swim m'], ['seahorse', 2.5, 'b170', 56, 'bob m'], ['coral', 95, 'b150', 90, 'm'], ['crab', 7, 'b150', 32, 'm']] },
    tundra:     { fx: ['aurora'], trail: ['paw-bear', 'b175'], edge: 'ice', animals: [['walrus', 28, -18, 54, ''], ['seal', 40, -14, 34, ''], ['seal', 47, -12, 28, 'flip'], ['caribou', 62, -20, 92, ''], ['caribou', 68, -18, 74, 'flip'], ['arctic-tern', 20, -150, 26, 'fly d5'], ['arctic-tern', 23, -138, 20, 'fly d5'], ['arctic-tern', 76, 120, 22, 'fly d50'], ['polar-bear', 82, -24, 70, ''], ['penguin', 8, -20, 52, ''], ['penguin', 11, -18, 44, 'flip'], ['penguin', 13.5, -16, 38, ''], ['wolf-howl', 95, 140, 64, 'm'], ['fox', 3, 220, 40, 'm']], particles: ['snow', 40], flakes: 16 },
    abyss:      { fx: ['rays', 'marine-snow'], edge: 'surface', animals: [['man-of-war', 58, 120, 140, 'art bob'], ['man-of-war', 30, 70, 90, 'art bob late'], ['jelly-pink', 2, 360, 120, 'art bob m'], ['jelly-cyan', 91, 600, 120, 'art bob late m'], ['jelly-pink', 96, 900, 80, 'art bob m'], ['narwhal', 38, 'b104', 40, 'glide back'], ['narwhal', 54, 'b128', 32, 'glide back late'], ['squid', 4, 'b560', 70, 'bob m'], ['giant-squid', 86, 'b40', 150, 'bob late m'], ['angler-fish', 3, 'b90', 56, 'm'], ['glow', 6.6, 'b142', 10, 'm'], ['whale-tail', 84, -26, 60, ''], ['whale', 1, 230, 110, 'glide m'], ['octopus', 93, 'b200', 110, 'bob m'], ['jellyfish', 95, 120, 60, 'bob m'], ['jellyfish', 4, 520, 44, 'bob late m'], ['manta-ray', 90, 420, 70, 'glide back m'], ['school-of-fish', 6, 'b220', 70, 'swim m']], particles: ['bubble', 30] },
    aviary:     { fx: ['mist', 'petals'], edge: 'bush', over: branch, animals: [['peacock', 70, 'b160', 76, 'm c=#1F7A8C'], ['bird-of-paradise', 46, 90, 56, 'c=#E9A23B'], ['parrot', 30, 40, 44, 'c=#D7263D'], ['hummingbird', 8, 300, 28, 'hover m c=#1FA67A'], ['cassowary', 96, 'b160', 90, 'm c=#1E2A3A'], ['glyph-sunflower', 1, 'b180', 120, 'm'], ['parrot', 21, 80, 62, 'flip'], ['bird-of-paradise', 38.5, 122, 74, ''], ['toucan', 4.5, 52, 46, ''], ['hummingbird', 92, 120, 32, 'hover m'], ['peacock', 87, 'b160', 80, 'm'], ['crane-fly', 60, 30, 26, 'fly'], ['butterfly', 97, 300, 22, 'flutter m']] },
    jurassic:   { edge: 'volcanic', trail: ['velociraptor-tracks', 'b230'], animals: [
                  ['sauropod', 3, -10, 150, ''], ['sauropod', 14, -14, 96, ''], ['t-rex', 84, -8, 92, 'flip'], ['triceratops', 30, -8, 56, ''], ['triceratops', 37, -6, 40, ''],
                  ['stegosaurus', 56, -8, 58, ''], ['velociraptor', 70, -8, 34, ''], ['velociraptor', 73, -6, 30, ''], ['velociraptor', 76, -8, 32, ''],
                  ['pterodactylus', 22, -150, 40, 'fly d18'], ['pterodactylus', 26, -132, 30, 'fly d18'], ['pterodactylus', 46, -160, 34, 'soar'], ['dinosaur-egg', 47, -6, 16, ''], ['dinosaur-egg', 48.4, -6, 14, ''],
                  ['ammonite-fossil', 8, 120, 60, 'fossil'], ['trilobite', 22, 190, 34, 'fossil'], ['dinosaur-bones', 40, 150, 90, 'fossil'], ['archaeopteryx-fossil', 62, 110, 64, 'fossil'],
                  ['t-rex-skull', 78, 200, 70, 'fossil'], ['fishbone', 90, 120, 40, 'fossil'], ['ammonite-fossil', 52, 220, 40, 'fossil'], ['fern', 30, 100, 44, 'fossil'], ['ginkgo-leaf', 95, 230, 36, 'fossil'], ['trilobite', 70, 236, 26, 'fossil']] },
    iceage:     { edge: 'glacier', trail: ['paw-cat', 'b230'], flakes: 18, animals: [
                  ['mammoth', 6, -8, 96, ''], ['mammoth', 13, -8, 70, ''], ['mammoth', 18.5, -8, 48, ''], ['rhino', 32, -8, 56, 'c=#6B4A2B'], ['smilodon', 46, -8, 50, ''],
                  ['megaloceros', 60, -8, 104, ''], ['polar-bear', 76, -8, 56, 'c=#5A3E2B'], ['bison', 88, -8, 54, 'c=#5C4330'], ['wolf-howl', 95, -150, 50, ''],
                  ['mammoth', 40, 200, 120, 'fossil frozen'], ['snowflake', 12, 140, 40, 'fossil'], ['snowflake', 84, 210, 30, 'fossil'], ['dinosaur-bones', 70, 150, 70, 'fossil'], ['fishbone', 24, 220, 34, 'fossil']] },
    sunset:     { fx: ['glow'], trail: ['paw-dog', 'b120'], edge: 'dusk', animals: [['oryx', 70, -20, 66, ''], ['ostrich', 24, -20, 46, ''], ['frigatebird', 30, -170, 24, 'fly slow d15'], ['arctic-tern', 66, -150, 18, 'fly d25'], ['elephant', 13, -24, 74, ''], ['elephant', 17.5, -22, 44, ''], ['giraffe', 85, -22, 112, ''], ['zebra', 93, -18, 50, ''], ['flock', 55, -120, 30, 'fly slow'], ['crane-fly', 40, -96, 18, 'fly']] },
  };

  const GLYPH = { 'glyph-fern': [260 / 420, null], 'glyph-tree': [1, () => fractalTree(rng(5), 200)], 'glyph-nautilus': [1, nautilus], 'glyph-sunflower': [1, () => flowerArt(null, 'sunflower', 1.6)] };
  const place = (host, [file, x, y, hgt, opt]) => { const el = document.createElement('i'); const toks = (opt || '').split(' ').filter(Boolean);
    const ar = GLYPH[file] ? GLYPH[file][0] : AR[file] || 1;
    el.className = 'an ' + toks.filter(o => !o.startsWith('c=')).map(o => o.startsWith('coat-') ? o : 'an-' + o).join(' ');
    const col = toks.find(o => o.startsWith('c=')); if (col) el.style.background = col.slice(2);
    const asset = u => `url("${new URL(A + u + '.svg', document.baseURI).href}")`;   // set images directly: a url() inside a custom property would resolve against the stylesheet
    if (file === 'glow') el.className = 'pt pt-glow an-m';
    else if (file === 'glyph-fern') { const u = `url(${fernMask()})`; el.style.webkitMaskImage = u; el.style.maskImage = u; el.classList.add('an-glyph'); }
    else if (GLYPH[file]) { el.innerHTML = GLYPH[file][1](); el.classList.add('an-glyph', 'an-inline'); }
    else if (toks.includes('art')) el.style.backgroundImage = asset(file);
    else { const u = asset(file); el.style.webkitMaskImage = u; el.style.maskImage = u; }
    toks.filter(o => o.startsWith('coat-')).forEach(o => el.style.backgroundImage = asset(o));
    el.style.left = x + '%'; el.style.setProperty('--x', x + 'vw'); el.style.width = n(hgt * ar) + 'px'; el.style.height = hgt + 'px';
    if (typeof y === 'string') el.style.bottom = y.slice(1) + 'px'; else el.style.top = (y - hgt) + 'px';   // y = where its feet are
    const dl = (opt || '').match(/\bd(\d+)\b/); el.style.setProperty('--d', (dl ? dl[1] : n(between(Math.random, 0, 6))) + 's');
    host.appendChild(el); };
  const particles = (host, [kind, count]) => { const r = rng(count * 7);
    for (let i = 0; i < count; i++) { const p = document.createElement('i'); p.className = 'pt pt-' + kind;
      p.style.left = n(between(r, 0, 100)) + '%'; p.style.top = n(between(r, 2, 96)) + '%';
      p.style.setProperty('--d', n(between(r, 0, 12)) + 's'); p.style.setProperty('--s', n(between(r, 0.6, 1.4)));
      host.appendChild(p); } };

  const FX_PARTS = { motes: 30, dust: 34, petals: 26, 'marine-snow': 60, sparks: 24 };
  const fx = (host, list) => list.forEach(name => {
    if (FX_PARTS[name]) return particles(host, [name, FX_PARTS[name]]);
    const d = document.createElement('div'); d.className = 'fx fx-' + name;
    if (name === 'clouds') for (let i = 0; i < 5; i++) { const c = document.createElement('i'); c.style.setProperty('--i', i); d.appendChild(c); }
    host.appendChild(d); });
  const trail = (host, [file, at]) => { const t = document.createElement('div'); t.className = 'trail'; t.style.bottom = at.slice(1) + 'px';
    const u = `url("${new URL(A + file + '.svg', document.baseURI).href}")`, count = 34;
    for (let i = 0; i < count; i++) { const p = document.createElement('i'); p.style.webkitMaskImage = u; p.style.maskImage = u;
      p.style.left = n((i + 0.5) * 100 / count) + '%'; p.style.setProperty('--y', n(Math.sin(i / 3) * 16 + (i % 2 ? 7 : -7)) + 'px');
      p.style.setProperty('--i', i); t.appendChild(p); }
    host.appendChild(t); };
  const flakes = (host, count) => { const r = rng(91), u = `url("${new URL(A + 'snowflake.svg', document.baseURI).href}")`;
    for (let i = 0; i < count; i++) { const p = document.createElement('i'); p.className = 'pt pt-flake'; p.style.webkitMaskImage = u; p.style.maskImage = u;
      p.style.left = n(between(r, 0, 100)) + '%'; p.style.top = n(between(r, 0, 90)) + '%';
      p.style.setProperty('--d', n(between(r, 0, 14)) + 's'); p.style.setProperty('--s', n(between(r, 0.6, 1.6))); host.appendChild(p); } };

  document.querySelectorAll('[data-habitat]').forEach((sec, i) => {
    const hab = HAB[sec.dataset.habitat]; if (!hab) return;
    const r = rng(1009 * (i + 3));
    if (hab.edge) { const [h, body] = EDGE[hab.edge](r); const e = document.createElement('div');
      e.className = 'edge edge-' + hab.edge; e.setAttribute('aria-hidden', 'true'); e.innerHTML = svg(h, body); sec.prepend(e); }
    const scene = document.createElement('div'); scene.className = 'scene'; scene.setAttribute('aria-hidden', 'true');
    if (hab.over) { const [h, body] = hab.over(r); scene.insertAdjacentHTML('beforeend', svg(h, body, 'over')); }
    (hab.animals || []).concat(hab.extra || []).forEach(a => place(scene, a));
    if (hab.particles) particles(scene, hab.particles);
    if (hab.flakes) flakes(scene, hab.flakes);
    if (hab.fx) fx(scene, hab.fx);
    if (hab.trail) trail(scene, hab.trail);
    sec.prepend(scene);
    if (hab.foot) { const [h, body] = EDGE[hab.foot](r); const f = document.createElement('div');
      f.className = 'foot'; f.setAttribute('aria-hidden', 'true'); f.innerHTML = svg(h, body); sec.append(f); }
  });

  // night sky: stars for dark mode (CSS hides them in light mode)
  const sky = document.querySelector('[data-habitat="sky"] .scene');
  if (sky) { const r = rng(42); for (let i = 0; i < 70; i++) { const s = document.createElement('i'); s.className = 'pt pt-star';
    s.style.left = n(between(r, 0, 100)) + '%'; s.style.top = n(between(r, 0, 70)) + '%'; s.style.setProperty('--d', n(between(r, 0, 5)) + 's'); s.style.setProperty('--s', n(between(r, 0.5, 1.5))); sky.appendChild(s); } }

  if (RM) document.documentElement.classList.add('still');
})();
