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
      b += P(ground(wave(r, 140, 6, 140), h), '--band');
      for (let i = 0; i < 70; i++) { const x = between(r, 0, W), y = 141; b += S(`M${n(x)} ${y}l${n(between(r, -4, 4))} -${n(between(r, 5, 11))}M${n(x + 3)} ${y}l${n(between(r, -3, 5))} -${n(between(r, 4, 9))}`, '--deep', 1.2, 'opacity=".55"'); }
      return [h, b]; },
    reeds(r) { const h = 130; let b = '';
      for (let x = -40; x < W + 60; x += between(r, 22, 40)) b += `<circle cx="${n(x)}" cy="${n(between(r, 92, 102))}" r="${n(between(r, 14, 26))}" ${fill('--back')}/>`;
      b += `<rect x="-60" y="104" width="${W + 120}" height="40" ${fill('--band')}/>`;
      [40, 150, 330, 610, 900, 1120, 1260, 1400].forEach(x => b += reeds(r, x, 108, '--deep'));
      for (let i = 0; i < 16; i++) { const x = between(r, 0, W), y = between(r, 112, 124); b += S(`M${n(x)} ${n(y)}h${n(between(r, 18, 46))}`, '--deep', 1, 'opacity=".35"'); }
      [[470, 114], [520, 120], [760, 116], [1010, 121]].forEach(([x, y]) => b += P(`M${x} ${y}m-14 0a14 4.5 0 1 0 28 0l-14 0z`, '--deep', 'opacity=".55"'));
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
      return [h, b + P(ground(wave(r, 80, 8, 70), h), '--band')]; },
    dusk(r) { const h = 160; let b = P(ground(wave(r, 116, 34, 260), h), '--back');
      [[150, 92, '--deep'], [1290, 70, '--deep'], [420, 40, '--back2'], [1060, 46, '--back2']].forEach(([x, th, v]) => b += acacia(r, x, x === 150 || x === 1290 ? 132 : 122, th, v));
      return [h, b + P(ground(wave(r, 140, 10, 160), h), '--band')]; },
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
      if (margin && r() < 0.8) b += bloom(x + Math.sin(L / 26 + x) * 6, L + 2, between(r, 3, 4.5), r() < 0.5 ? '--bloom1' : '--bloom2'); });
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
      b += bloom(x + between(r, -10, 10), y + between(r, -8, 8), between(r, 4, 6), r() < 0.5 ? '--bloom1' : '--bloom2'); });
    return [h, b]; };

  /* ── animals ── a = [file, x (% of viewport), y = feet (px from section top; negative = up on the horizon; 'bN' = N px above the bottom), height px, options] */
  const AR = { peacock: 200 / 116, crocodile: 200 / 64, 'eagle-soar': 2.5, 'vulture-soar': 2.5, albatross: 240 / 50, 'crane-fly': 200 / 60, flock: 140 / 44, 'bird-of-paradise': 120 / 124 };
  const HAB = {
    sky:        { foot: 'mountains', animals: [['swallow', 70, 260, 18, 'fly d40'], ['albatross', 58, 120, 26, 'fly slow d55'], ['eagle-soar', 2, 420, 34, 'soar m'], ['crane-fly', 30, 92, 22, 'fly d20'], ['crane-fly', 27.5, 106, 18, 'fly d20'], ['crane-fly', 25, 120, 16, 'fly d20'], ['crane-fly', 22.5, 132, 14, 'fly d20'], ['flock', 84, 150, 22, 'fly slow d10'], ['eagle-soar', 50, 52, 22, 'soar'], ['vulture-soar', 92, 330, 24, 'circle m']] },
    rainforest: { edge: 'canopy', over: creepers, animals: [['gorilla', 89.5, 'b150', 60, 'm'], ['snake', 9, 'b150', 40, 'm'], ['toucan', 4, -96, 44, 'flip'], ['sloth', 92.5, 120, 66, 'm'], ['hummingbird', 10, 120, 30, 'hover m'], ['butterfly', 95, 210, 26, 'flutter m'], ['butterfly', 3, 300, 22, 'flutter m'], ['frog', 96, 'b150', 34, 'm'], ['tiger', 3, 'b150', 70, 'm']] },
    savanna:    { edge: 'savanna', animals: [['vulture', 82.4, -96, 30, ''], ['giraffe', 7, -18, 128, ''], ['giraffe', 11.5, -14, 92, ''], ['zebra', 70, -12, 56, ''], ['elephant', 82, -14, 84, 'flip'], ['rhino', 93, -12, 52, ''], ['ostrich', 47, -12, 50, ''], ['vulture-soar', 94, 200, 26, 'circle m'], ['vulture-soar', 3, 330, 20, 'circle late m']] },
    wetland:    { edge: 'reeds', animals: [['swan', 50, -12, 34, ''], ['otter', 62, -10, 30, ''], ['beaver', 36, -10, 30, ''], ['crocodile', 22, -14, 30, 'flip'], ['hippo', 76, -10, 56, ''], ['heron', 89, -18, 84, ''], ['shoebill-stork', 6, -16, 70, 'flip'], ['dragonfly', 94, 120, 26, 'hover m'], ['dragonfly', 4, 200, 22, 'hover late m']] },
    forest:     { edge: 'pines', animals: [['moose', 70, -8, 66, ''], ['deer', 8, -10, 82, ''], ['polar-bear', 86, -10, 60, 'flip'], ['fox', 93, -10, 44, ''], ['owl', 3, 190, 52, 'm'], ['squirrel', 96, 160, 34, 'm'], ['rabbit', 14, -8, 28, '']], particles: ['firefly', 26] },
    peaks:      { edge: 'peaks', animals: [['swallow', 60, -120, 24, 'fly'], ['eagle-soar', 14, -150, 40, 'soar'], ['vulture-soar', 82, -170, 30, 'circle'], ['deer-track', 95, 120, 26, 'track m'], ['deer-track', 93, 170, 26, 'track m'], ['deer-track', 95.5, 220, 26, 'track m'], ['deer-track', 93.5, 270, 26, 'track m']] },
    lagoon:     { edge: 'waves', animals: [['dolphin', 42, -40, 46, 'bob'], ['seagull', 30, -120, 24, 'fly slow'], ['flamingo', 5, -26, 84, ''], ['flamingo', 9, -22, 70, ''], ['eating-pelican', 70, -30, 56, ''], ['sea-turtle', 3, 260, 60, 'swim m'], ['tropical-fish', 94, 200, 34, 'swim back m'], ['clownfish', 96, 300, 28, 'swim m'], ['seahorse', 2.5, 'b170', 56, 'bob m'], ['coral', 95, 'b150', 90, 'm'], ['crab', 7, 'b150', 32, 'm']] },
    tundra:     { edge: 'ice', animals: [['polar-bear', 82, -24, 70, ''], ['penguin', 8, -20, 52, ''], ['penguin', 11, -18, 44, 'flip'], ['penguin', 13.5, -16, 38, ''], ['wolf-howl', 95, 140, 64, 'm'], ['fox', 3, 220, 40, 'm']], particles: ['snow', 40] },
    abyss:      { edge: 'surface', animals: [['whale-tail', 84, -26, 60, ''], ['whale', 1, 230, 110, 'glide m'], ['octopus', 93, 'b200', 110, 'bob m'], ['jellyfish', 95, 120, 60, 'bob m'], ['jellyfish', 4, 520, 44, 'bob late m'], ['manta-ray', 90, 420, 70, 'glide back m'], ['school-of-fish', 6, 'b220', 70, 'swim m']], particles: ['bubble', 30] },
    aviary:     { edge: 'bush', over: branch, animals: [['parrot', 21, 80, 62, 'flip'], ['bird-of-paradise', 38.5, 122, 74, ''], ['toucan', 4.5, 52, 46, ''], ['hummingbird', 92, 120, 32, 'hover m'], ['peacock', 87, 'b160', 80, 'm'], ['crane-fly', 60, 30, 26, 'fly'], ['butterfly', 97, 300, 22, 'flutter m']] },
    sunset:     { edge: 'dusk', animals: [['elephant', 13, -24, 74, ''], ['elephant', 17.5, -22, 44, ''], ['giraffe', 85, -22, 112, ''], ['zebra', 93, -18, 50, ''], ['flock', 55, -120, 30, 'fly slow'], ['crane-fly', 40, -96, 18, 'fly']] },
  };

  const place = (host, [file, x, y, hgt, opt]) => { const el = document.createElement('i'); const ar = AR[file] || 1;
    el.className = 'an ' + (opt || '').split(' ').filter(Boolean).map(o => 'an-' + o).join(' ');
    const u = `url("${new URL(A + file + '.svg', document.baseURI).href}")`;   // set the mask directly: a url() inside a custom property would resolve against the stylesheet
    el.style.webkitMaskImage = u; el.style.maskImage = u;
    el.style.left = x + '%'; el.style.setProperty('--x', x + 'vw'); el.style.width = n(hgt * ar) + 'px'; el.style.height = hgt + 'px';
    if (typeof y === 'string') el.style.bottom = y.slice(1) + 'px'; else el.style.top = (y - hgt) + 'px';   // y = where its feet are
    const dl = (opt || '').match(/\bd(\d+)\b/); el.style.setProperty('--d', (dl ? dl[1] : n(between(Math.random, 0, 6))) + 's');
    host.appendChild(el); };
  const particles = (host, [kind, count]) => { const r = rng(count * 7);
    for (let i = 0; i < count; i++) { const p = document.createElement('i'); p.className = 'pt pt-' + kind;
      p.style.left = n(between(r, 0, 100)) + '%'; p.style.top = n(between(r, 2, 96)) + '%';
      p.style.setProperty('--d', n(between(r, 0, 12)) + 's'); p.style.setProperty('--s', n(between(r, 0.6, 1.4)));
      host.appendChild(p); } };

  document.querySelectorAll('[data-habitat]').forEach((sec, i) => {
    const hab = HAB[sec.dataset.habitat]; if (!hab) return;
    const r = rng(1009 * (i + 3));
    if (hab.edge) { const [h, body] = EDGE[hab.edge](r); const e = document.createElement('div');
      e.className = 'edge edge-' + hab.edge; e.setAttribute('aria-hidden', 'true'); e.innerHTML = svg(h, body); sec.prepend(e); }
    const scene = document.createElement('div'); scene.className = 'scene'; scene.setAttribute('aria-hidden', 'true');
    if (hab.over) { const [h, body] = hab.over(r); scene.insertAdjacentHTML('beforeend', svg(h, body, 'over')); }
    (hab.animals || []).forEach(a => place(scene, a));
    if (hab.particles) particles(scene, hab.particles);
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
