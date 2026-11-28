/* era.js (index.html only): the time-machine layer.
   Scrolling the homepage travels forward through computing history. Every section is an era band (data-era):
   1947 transistor → 1958 integrated circuit → 1971 microprocessor → 1976 public-key crypto / cyber security → 1991 the web →
   (the internet revolution) → 1999 GPU → 2006 cloud → (2009 blockchain) → (2012 AlexNet) → 2017 Transformer → 2020 foundation models →
   2022 ChatGPT, Claude & LLMs → (quantum, now) → the future.
   Every era matches its section: Security is the cyber-security era, Writing the web, References the LLM era.
   This file draws each era's skyline (the border above the section), floats that era's technology icons and emoji,
   draws the four interludes (internet, blockchain, AlexNet, quantum), and runs the fixed "time machine" dial. Shapes come from a seeded RNG, so every
   visit draws the same picture. Decoration only: aria-hidden, static under reduced motion.
   Icons: assets/tech/ (drawn for this site, see assets/tech/CREDITS.md). Colours come from each band's CSS variables. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = 'assets/tech/';
  const W = 1440;
  const n = v => Math.round(v * 10) / 10;
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const between = (r, a, b) => a + r() * (b - a);
  const pick = (r, list) => list[Math.floor(r() * list.length)];
  const svg = (h, body, cls = '', pos = '') =>
    `<svg class="${cls}" style="${pos}" viewBox="0 0 ${W} ${h}" preserveAspectRatio="xMidYMax slice" width="100%" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`;
  const fill = v => `style="fill:var(${v})"`;
  const R = (x, y, w, h, v, extra = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" ${fill(v)} ${extra}/>`;
  const C = (x, y, r, v, extra = '') => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" ${fill(v)} ${extra}/>`;
  const S = (d, v, w, extra = '') => `<path d="${d}" style="fill:none;stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const SIG = (d, w, dash, r, op = 0.9) => `<path d="${d}" class="sig" style="fill:none;stroke:var(--glow);--d:${n(between(r, 0, 4))}s" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${dash}" opacity="${op}"/>`;
  const base = (y, h) => R(-60, y, W + 120, h - y + 4, '--band');
  const LEDS = ['#3CCB7F', '#39C5E0', '#F2C230'];
  const led = (r, x, y, rad = 2) => `<circle class="led" cx="${n(x)}" cy="${n(y)}" r="${rad}" style="fill:${pick(r, LEDS)};--d:${n(between(r, 0, 3))}s"/>`;
  // a PCB trace: runs right, jogs 45° up or down, carries a moving signal pulse
  const trace = (r, y0, v, w = 2) => { let x = -40, y = y0, d = `M${x} ${y}`;
    while (x < W + 40) { x += between(r, 60, 180); d += `H${n(x)}`; if (r() < 0.6) { const dy = pick(r, [-14, -8, 8, 14]); x += Math.abs(dy); y += dy; d += `L${n(x)} ${n(y)}`; } }
    return S(d, v, w) + SIG(d, w + 0.6, '10 230', r); };

  /* ── skylines: each returns [height, svg body] ── */
  const EDGE = {
    // 1958: DIP packages, resistors and capacitors on a circuit board
    dip(r) { const h = 140; let b = '';
      for (let i = 0; i < 4; i++) b += trace(r, 40 + i * 18, '--back', 2);
      for (let x = 8; x < W; x += between(r, 30, 70)) b += C(x, between(r, 30, 110), 3, '--back');
      for (let x = -20; x < W + 40;) {
        const kind = r();
        if (kind < 0.55) { const w = between(r, 70, 170), hh = between(r, 20, 30), y = 118 - hh;
          for (let px = x + 8; px < x + w - 6; px += 12) b += R(px, 116, 4, 8, '--back2');
          b += R(x, y, w, hh, '--deep', 'rx="2"') + `<circle cx="${n(x + 10)}" cy="${n(y + hh / 2)}" r="4" ${fill('--back2')}/>`; x += w + between(r, 18, 50); }
        else if (kind < 0.8) { const w = 36; b += S(`M${n(x)} 118v-10h6M${n(x + w + 12)} 108h-6v10`, '--back2', 2) + R(x + 6, 100, w, 14, '--back2', 'rx="7"');
          for (let k = 0; k < 3; k++) b += R(x + 14 + k * 8, 100, 3, 14, '--deep', 'opacity=".55"'); x += w + 40; }
        else { const hh = between(r, 30, 46); b += R(x, 118 - hh, 22, hh, '--deep', 'rx="4"') + R(x, 118 - hh, 22, 5, '--back2', 'rx="2"') + R(x + 6, 118 - hh + 8, 3, hh - 14, '--back2', 'opacity=".7"'); x += 60; }
      }
      return [h, b + base(122, h)]; },
    // 1971: a die floorplan drawn as a city: logic blocks, SRAM arrays, bond wires to the pads
    silicon(r) { const h = 170; let b = '';
      for (let x = -20; x < W + 40;) { const w = between(r, 40, 110), hh = between(r, 40, 110); b += R(x, 150 - hh, w, hh, '--back'); x += w + between(r, 2, 10); }
      for (let x = -10; x < W + 40;) { const w = between(r, 50, 130), hh = between(r, 24, 70), y = 150 - hh; b += R(x, y, w, hh, '--back2');
        if (r() < 0.6) for (let gx = x + 5; gx < x + w - 6; gx += 8) for (let gy = y + 6; gy < 146; gy += 8) b += R(gx, gy, 4, 4, '--band', 'opacity=".55"');
        else b += S(`M${n(x + 6)} ${n(y + 10)}H${n(x + w - 6)}M${n(x + 6)} ${n(y + 18)}H${n(x + w * 0.6)}`, '--deep', 1.4, 'opacity=".6"');
        if (r() < 0.35) b += S(`M${n(x + w / 2)} ${n(y)}Q${n(x + w / 2 + 20)} ${n(y - 40)} ${n(x + w / 2 + 46)} ${n(y - 6)}`, '--deep', 1.2, 'opacity=".7"');
        x += w + between(r, 4, 14); }
      for (let x = 10; x < W; x += 26) b += R(x, 152, 14, 8, '--deep', 'opacity=".75"');
      return [h, b + base(160, h)]; },
    // 1969–1983: radio towers, a packet-switched mesh, packets in flight
    mesh(r) { const h = 160; let b = '', nodes = [];
      for (let x = 20; x < W; x += between(r, 70, 130)) nodes.push([x, between(r, 30, 110)]);
      nodes.forEach((p, i) => { [1, 2].forEach(k => { const q = nodes[i + k]; if (q && (k === 1 || r() < 0.5)) {
        const d = `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`; b += S(d, '--back2', 1.6) + SIG(d, 2.4, '6 234', r); } }); });
      nodes.forEach(([x, y]) => b += C(x, y, 5, '--deep') + C(x, y, 9, '--deep', 'opacity=".15"'));
      [[110, 70], [560, 90], [980, 64], [1330, 84]].forEach(([x, th]) => {
        b += S(`M${x - th * 0.22} 150L${x} ${150 - th}L${x + th * 0.22} 150M${x - th * 0.15} ${150 - th * 0.33}H${x + th * 0.15}M${x - th * 0.08} ${150 - th * 0.66}H${x + th * 0.08}M${x - th * 0.15} ${150 - th * 0.33}L${x + th * 0.08} ${150 - th * 0.66}`, '--deep', 2.2);
        b += C(x, 150 - th - 4, 3.5, '--deep') + S(`M${x - 12} ${150 - th - 12}a16 16 0 0 0 0 16M${x + 12} ${150 - th - 12}a16 16 0 0 1 0 16`, '--deep', 1.6, 'opacity=".7"'); });
      return [h, b + base(150, h)]; },
    // 1991: the desk where the web arrived: CRTs, beige towers, keyboards, a mouse
    desks(r) { const h = 150; let b = '';
      for (let x = -20; x < W + 40;) { const k = r();
        if (k < 0.45) { const w = between(r, 70, 92), hh = w * 0.78, y = 120 - hh - 12;
          b += R(x, y, w, hh, '--deep', 'rx="8"') + R(x + 8, y + 8, w - 16, hh - 20, '--back', 'rx="6"') + S(`M${n(x + 16)} ${n(y + 20)}l6 4-6 4M${n(x + 26)} ${n(y + 30)}h12`, '--glow', 2.2);
          b += R(x + w / 2 - 12, 108, 24, 12, '--deep') + R(x + 6, 120 - 4, w - 12, 4, '--back2'); x += w + between(r, 14, 30); }
        else if (k < 0.7) { const hh = between(r, 64, 84); b += R(x, 120 - hh, 30, hh, '--back2', 'rx="2"') + R(x + 5, 128 - hh, 20, 4, '--deep') + R(x + 5, 136 - hh, 20, 4, '--deep') + led(r, x + 24, 112, 1.8); x += 30 + between(r, 14, 30); }
        else if (k < 0.9) { const w = between(r, 80, 110); b += `<path d="M${n(x)} 120l6-12h${n(w - 12)}l6 12z" ${fill('--back2')}/>`;
          for (let kx = x + 10; kx < x + w - 8; kx += 9) b += R(kx, 112, 6, 3, '--deep', 'opacity=".6"'); x += w + 18; }
        else { b += `<path d="M${n(x)} 120c0-12 4-16 9-16s9 4 9 16z" ${fill('--deep')}/>` + S(`M${n(x + 9)} 104c0-10 12-8 14-20`, '--deep', 1.4); x += 46; }
      }
      return [h, b + base(120, h)]; },
    // cyber security: binary rain falling onto a firewall, padlocks along the top
    vault(r) { const h = 170; let b = '';
      for (let x = 8; x < W; x += 22) for (let y = 50; y < 96; y += 14) if (r() < 0.55)
        b += `<text x="${x}" y="${y}" class="${r() < 0.15 ? 'led' : ''}" style="font:600 11px var(--font-mono);fill:var(--back2);--d:${n(between(r, 0, 3))}s" opacity="${n(between(r, 0.35, 0.9))}">${r() < 0.5 ? 0 : 1}</text>`;
      for (let row = 0; row < 4; row++) { const y = 112 + row * 12;
        for (let x = row % 2 ? -18 : -40; x < W + 40; x += 38) b += R(x, y, 35, 10, row % 2 ? '--back2' : '--deep', `rx="1" opacity="${row % 2 ? 1 : 0.8}"`); }
      for (let x = 70; x < W; x += between(r, 170, 260)) {
        b += S(`M${n(x - 7)} 92v-6a7 7 0 0 1 14 0v6`, '--deep', 3) + R(x - 12, 92, 24, 19, '--deep', 'rx="3"') + C(x, 100, 2.6, '--band') + R(x - 1, 101, 2, 5, '--band'); }
      return [h, b + base(160, h)]; },
    // blockchain: isometric blocks stacked like a skyline
    blocks(r) { const h = 160; let b = '';
      const cube = (x, y, s) => `<path d="M${n(x)} ${n(y)}l${n(s)} ${n(-s * 0.55)} ${n(s)} ${n(s * 0.55)} ${n(-s)} ${n(s * 0.55)}z" ${fill('--back')}/>` +
        `<path d="M${n(x)} ${n(y)}l${n(s)} ${n(s * 0.55)}v${n(s)}l${n(-s)} ${n(-s * 0.55)}z" ${fill('--back2')}/>` +
        `<path d="M${n(x + s)} ${n(y + s * 0.55)}l${n(s)} ${n(-s * 0.55)}v${n(s)}l${n(-s)} ${n(s * 0.55)}z" ${fill('--deep')} opacity=".85"/>`;
      for (let x = -30; x < W + 40;) { const s = between(r, 22, 34), stack = Math.floor(between(r, 1, 4));
        for (let k = 0; k < stack; k++) b += cube(x, 150 - s * 1.55 - k * s, s);
        if (r() < 0.5) b += S(`M${n(x + s * 2)} ${n(150 - s)}h${n(between(r, 14, 30))}`, '--glow', 2, 'stroke-dasharray="4 4" opacity=".8"');
        x += s * 2 + between(r, 14, 36); }
      return [h, b + base(150, h)]; },
    // 2012: layers of a neural network spanning the page, signals flowing forward
    neurons(r) { const h = 170; let b = '', cols = [];
      for (let x = 20; x < W; x += between(r, 90, 140)) { const k = Math.floor(between(r, 3, 6)), ys = []; for (let i = 0; i < k; i++) ys.push(30 + (i + 0.5) * 110 / k + between(r, -6, 6)); cols.push([x, ys]); }
      cols.forEach(([x, ys], i) => { const nx = cols[i + 1]; if (nx) ys.forEach(y => nx[1].forEach(y2 => { const d = `M${n(x)} ${n(y)}L${n(nx[0])} ${n(y2)}`;
        b += S(d, '--back2', 1, 'opacity=".55"'); if (r() < 0.12) b += SIG(d, 2, '5 235', r); })); });
      cols.forEach(([x, ys]) => ys.forEach(y => b += C(x, y, 6, '--deep') + C(x, y, 2.4, '--band')));
      return [h, b + base(156, h)]; },
    // 2017: a sequence of tokens; arcs are attention between them
    tokens(r) { const h = 160; let b = '', xs = [];
      for (let x = -10; x < W + 40;) { const w = between(r, 34, 70), hh = between(r, 18, 46); xs.push(x + w / 2); b += R(x, 140 - hh, w, hh, r() < 0.3 ? '--deep' : '--back2', 'rx="5"'); x += w + 8; }
      for (let i = 0; i < 46; i++) { const a = Math.floor(r() * xs.length), bb = Math.min(xs.length - 1, a + 1 + Math.floor(r() * 6)); if (a === bb) continue;
        const x1 = xs[a], x2 = xs[bb], top = 90 - Math.min(80, (x2 - x1) * 0.35);
        b += S(`M${n(x1)} 92Q${n((x1 + x2) / 2)} ${n(top)} ${n(x2)} 92`, '--deep', between(r, 0.8, 2.4), `opacity="${n(between(r, 0.25, 0.7))}"`); }
      return [h, b + base(140, h)]; },
    // 1999: a graphics card seen edge-on: GPU die between HBM stacks, power stages, memory, fans, I/O bracket, gold fingers
    board(r) { const h = 170, g = 132; let b = R(-60, g, W + 120, 16, '--deep', 'opacity=".85"'); let last = '';
      for (let x = 0; x < W + 20; x += 9) if (r() < 0.8) b += `<rect x="${x}" y="${g + 16}" width="6" height="8" style="fill:#C9A14A" opacity=".85"/>`;
      const mods = {
        die(x) { let o = R(x, g - 10, 170, 10, '--back2', 'rx="1"') + R(x + 20, g - 16, 130, 6, '--back');
          o += R(x + 55, g - 32, 60, 16, '--deep', 'rx="2"') + R(x + 62, g - 29, 46, 2, '--glow', 'opacity=".8"');
          for (const hx of [x + 24, x + 124]) for (let k = 0; k < 5; k++) o += R(hx, g - 20 - k * 5, 22, 4, k % 2 ? '--deep' : '--back2', 'rx="1"');
          return [o, 180]; },
        vrm(x) { let o = '', w = 0; for (let k = 0; k < 6; k++) { o += R(x + w, g - 16, 15, 16, '--deep', 'rx="3"') + R(x + w + 3, g - 13, 9, 3, '--back2'); w += 20; }
          for (let k = 0; k < 5; k++) o += R(x + w + k * 11, g - 24, 8, 24, '--back2', 'rx="4"') + R(x + w + k * 11, g - 24, 8, 3, '--deep', 'rx="1.5"'); return [o, w + 60]; },
        fans(x) { let o = ''; for (let k = 0; k < 2; k++) { const cx = x + 60 + k * 120, cy = g - 40; o += C(cx, cy, 52, '--back') + C(cx, cy, 52, '--band', 'opacity=".0"');
          for (let a = 0; a < 7; a++) { const t = a * 0.8976; o += S(`M${n(cx)} ${n(cy)}Q${n(cx + 30 * Math.cos(t + 0.5))} ${n(cy + 30 * Math.sin(t + 0.5))} ${n(cx + 48 * Math.cos(t))} ${n(cy + 48 * Math.sin(t))}`, '--back2', 4); }
          o += C(cx, cy, 12, '--deep'); } return [R(x, g - 10, 240, 10, '--deep', 'opacity=".6"') + o, 250]; },
        mem(x) { let o = ''; for (let k = 0; k < 6; k++) o += R(x + k * 26, g - 7, 22, 7, '--deep', 'rx="1"') + R(x + k * 26 + 3, g - 6, 6, 1.5, '--glow', 'opacity=".6"'); return [o, 166]; },
        io(x) { let o = R(x, g - 92, 16, 92, '--back2', 'rx="2"'); for (let k = 0; k < 4; k++) o += R(x + 4, g - 84 + k * 20, 8, 12, '--deep', 'rx="1"'); return [o, 50]; },
        fins(x) { let o = ''; const run = Math.floor(between(r, 14, 24)), hh = between(r, 40, 66); for (let k = 0; k < run; k++) o += R(x + k * 7, g - hh, 3, hh, '--back2');
          o += S(`M${n(x + 8)} ${g}V${n(g - hh * 0.8)}M${n(x + run * 7 - 8)} ${g}V${n(g - hh * 0.8)}`, '--deep', 5, 'opacity=".75"'); return [o, run * 7 + 16]; },
      };
      for (let x = -30; x < W + 40;) { let k; do k = pick(r, Object.keys(mods)); while (k === last); last = k; const [o, w] = mods[k](x); b += o; x += w + between(r, 10, 30); }
      return [h, b + base(g + 24, h)]; },
    // 2006: a data-centre floor: compute racks, storage arrays, a tape library, a spine switch with fibre, cooling, batteries
    datacenter(r) { const h = 200, g = 184, FIB = ['#39C5E0', '#F2C230', '#3CCB7F', '#7FA3FF']; let b = S(`M-40 16H${W + 40}`, '--back2', 6), last = '';
      for (let x = -40; x < W + 40; x += 22) b += R(x, g, 20, 16, '--back', 'opacity=".6"');
      const frame = (x, w, hh) => R(x, g - hh, w, hh, '--back2', 'rx="2"') + R(x + 3, g - hh + 3, w - 6, hh - 6, '--back', 'rx="1" opacity=".55"');
      const mods = {
        compute(x) { const w = 54, hh = between(r, 130, 160); let o = frame(x, w, hh); for (let u = g - hh + 8; u < g - 8; u += 8) { o += R(x + 6, u, w - 12, 5, '--deep', 'rx="1" opacity=".55"'); if (r() < 0.6) o += led(r, x + w - 10, u + 2.5, 1.5); } return [o, w]; },
        storage(x) { const w = 60, hh = between(r, 120, 150); let o = frame(x, w, hh);
          for (let y = g - hh + 10; y < g - 20; y += 22) for (let k = 0; k < 6; k++) { o += R(x + 6 + k * 8.4, y, 6, 18, '--deep', 'rx="1" opacity=".7"'); if (r() < 0.4) o += led(r, x + 9 + k * 8.4, y + 15, 1.2); } return [o, w]; },
        tape(x) { const w = 110, hh = 140; let o = frame(x, w, hh) + R(x + 10, g - hh + 12, w - 20, hh - 40, '--band', 'rx="2" opacity=".9"');
          for (let s = 0; s < 5; s++) for (let k = 0; k < 11; k++) o += `<rect x="${n(x + 14 + k * 8)}" y="${n(g - hh + 18 + s * 19)}" width="6" height="14" rx="1" style="fill:${pick(r, FIB)}" opacity=".75"/>`;
          o += S(`M${x + 20} ${g - hh + 30}h70M${x + 60} ${g - hh + 30}v38l12 6`, '--deep', 3) + R(x + 68, g - hh + 70, 12, 10, '--deep', 'rx="2"');
          o += R(x + 14, g - 22, w - 28, 8, '--deep', 'rx="2" opacity=".6"'); return [o, w]; },
        spine(x) { const w = 58, hh = 150; let o = frame(x, w, hh);
          for (let y = g - hh + 10; y < g - 10; y += 10) for (let k = 0; k < 5; k++) o += R(x + 6 + k * 9.5, y, 7, 5, '--deep', 'rx="1"');
          for (let k = 0; k < 9; k++) { const c = pick(r, FIB), sx = x + 8 + k * 5; o += `<path d="M${n(sx)} ${g - hh + 12}C${n(sx)} 60 ${n(sx + between(r, -120, 120))} 50 ${n(sx + between(r, -200, 200))} 18" style="fill:none;stroke:${c}" stroke-width="1.6" opacity=".8"/>`; }
          return [o, w]; },
        crac(x) { const w = 80, hh = 104; let o = frame(x, w, hh);
          for (const cy of [g - hh + 30, g - hh + 72]) { o += C(x + w / 2, cy, 18, '--deep', 'opacity=".25"'); for (let a = 0; a < 6; a++) o += S(`M${n(x + w / 2)} ${n(cy)}l${n(16 * Math.cos(a * 1.047))} ${n(16 * Math.sin(a * 1.047))}`, '--deep', 3); o += C(x + w / 2, cy, 4, '--deep'); }
          o += SIG(`M${x + w / 2} ${g - hh - 4}V${g - hh - 60}`, 2, '8 30', r, 0.7); return [o, w]; },
        ups(x) { const w = 64, hh = 96; let o = frame(x, w, hh);
          for (let y = g - hh + 10; y < g - 12; y += 16) o += R(x + 8, y, w - 16, 11, '--deep', 'rx="2" opacity=".75"') + R(x + 12, y + 4, between(r, 10, w - 28), 3, '--glow', 'opacity=".9"');
          return [o + `<path d="M${x + w / 2 + 3} ${g - hh - 22}l-8 12h6l-4 10 10-13h-6l4-9z" style="fill:#F2C230"/>`, w]; },
      };
      for (let x = -20; x < W + 40;) { let k; do k = pick(r, ['compute', 'compute', 'storage', 'storage', 'spine', 'spine', 'crac', 'ups', 'tape']); while (k === last); last = k; const [o, w] = mods[k](x); b += o; x += w + between(r, 4, 16); }
      return [h, b + base(g + 14, h)]; },
    // 2020: an AI supercomputer: GPU node trays, an NVLink switch with its copper spine, liquid-cooling manifolds, InfiniBand, a coolant unit
    superpod(r) { const h = 180, g = 168; let b = '', last = '';
      for (let i = 0; i < 6; i++) { const y = 12 + i * 3; b += S(`M-40 ${y}C360 ${y + 30} 1080 ${y - 20} ${W + 40} ${y + 8}`, '--deep', 1.4, 'opacity=".45"'); }
      const frame = (x, w, hh) => R(x, g - hh, w, hh, '--back', 'rx="2"');
      const mods = {
        node(x) { const w = 66, hh = between(r, 118, 140); let o = frame(x, w, hh);
          for (let y = g - hh + 6; y < g - 14; y += 15) { o += R(x + 4, y, w - 8, 12, '--back2', 'rx="1" opacity=".7"'); for (let k = 0; k < 8; k++) o += R(x + 7 + k * 7, y + 3, 5, 6, '--glow', 'opacity=".35"'); o += led(r, x + w - 8, y + 6, 1.4); }
          return [o, w]; },
        nvswitch(x) { const w = 66, hh = 140; let o = frame(x, w, hh);
          for (let k = 0; k < 22; k++) o += `<path d="M${n(x + 5 + k * 2.6)} ${g - hh + 6}V${g - hh + 70}" style="stroke:#C37A3E" stroke-width="1.6" opacity=".85"/>`;
          for (let y = g - hh + 78; y < g - 8; y += 9) for (let k = 0; k < 6; k++) o += R(x + 6 + k * 9.5, y, 7, 5, '--deep', 'rx="1"');
          return [o, w]; },
        manifold(x) { const hh = 146; let o = '';
          [['#3AA0E8', 0], ['#E8704A', 14]].forEach(([c, dx]) => { o += `<rect x="${x + dx}" y="${g - hh}" width="8" height="${hh}" rx="4" style="fill:${c}" opacity=".75"/>`;
            for (let y = g - hh + 14; y < g; y += 18) o += `<circle cx="${x + dx + 4}" cy="${y}" r="4.5" style="fill:${c}"/>`; });
          return [o, 30]; },
        ib(x) { const w = 62, hh = 110; let o = frame(x, w, hh);
          for (let y = g - hh + 10; y < g - 10; y += 9) for (let k = 0; k < 6; k++) o += R(x + 5 + k * 9.2, y, 7, 5, '--deep', 'rx="1" opacity=".8"');
          for (let k = 0; k < 6; k++) { const d = `M${n(x + 8 + k * 9)} ${g - hh}C${n(x + k * 9)} ${g - hh - 40} ${n(x + between(r, -160, 220))} 40 ${n(x + between(r, -240, 300))} 16`; o += S(d, '--deep', 1.4, 'opacity=".55"') + SIG(d, 2, '10 200', r); }
          return [o, w]; },
        cdu(x) { const w = 78, hh = 92; let o = frame(x, w, hh) + R(x + 10, g - hh + 10, 30, hh - 30, '--back2', 'rx="12"') + C(x + 58, g - 30, 12, '--deep') + C(x + 58, g - 30, 5, '--glow');
          o += `<path d="M${x + 40} ${g - hh + 24}h18v${hh - 66}" style="fill:none;stroke:#3AA0E8" stroke-width="4"/><path d="M${x + 40} ${g - 30}h6" style="fill:none;stroke:#E8704A" stroke-width="4"/>`;
          return [o, w]; },
      };
      for (let x = -20; x < W + 40;) { let k; do k = pick(r, Object.keys(mods)); while (k === last); last = k; const [o, w] = mods[k](x); b += o; x += w + between(r, 4, 12); }
      return [h, b + base(g, h)]; },
    // 2022: a conversation skyline: chat bubbles, a model typing, sparkles
    chat(r) { const h = 170, g = 150; let b = '';
      for (let x = -20, i = 0; x < W + 40; i++) { const w = between(r, 90, 210), hh = between(r, 34, 64), y = between(r, 40, g - hh - 14), left = i % 2 === 0;
        const tail = left ? `M${n(x + 18)} ${n(y + hh)}l-8 14 22-14z` : `M${n(x + w - 18)} ${n(y + hh)}l8 14-22-14z`;
        b += `<path d="${tail}" ${fill(left ? '--back2' : '--back')}/>` + R(x, y, w, hh, left ? '--back2' : '--back', 'rx="14"');
        if (r() < 0.3) for (let k = 0; k < 3; k++) b += `<circle cx="${n(x + 22 + k * 12)}" cy="${n(y + hh / 2)}" r="3.6" class="led" style="fill:var(--deep);--d:${n(k * 0.4)}s"/>`;
        else for (let k = 0; k < Math.floor(hh / 16); k++) b += R(x + 14, y + 11 + k * 14, (w - 28) * between(r, 0.5, 1), 5, '--deep', 'rx="2.5" opacity=".55"');
        if (r() < 0.35) { const sx = x + w - 6, sy = y - 4; b += `<path d="M${n(sx)} ${n(sy - 9)}l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z" ${fill('--glow')}/>`; }
        x += w + between(r, 16, 40); }
      return [h, b + base(g, h)]; },
    // quantum: superposed waves and a probability-density packet
    wave(r) { const h = 150; let b = '';
      for (let k = 0; k < 5; k++) { const A = between(r, 8, 22), L = between(r, 120, 260), ph = between(r, 0, 6), y0 = 70 + k * 10; let d = '';
        for (let x = -40; x <= W + 40; x += 8) d += (d ? 'L' : 'M') + n(x) + ' ' + n(y0 + A * Math.sin(x / L * 6.283 + ph));
        b += S(d, k % 2 ? '--back2' : '--deep', 1.6, `opacity="${n(0.35 + k * 0.1)}"`); }
      [[300, 70], [820, 110], [1220, 80]].forEach(([cx, sg]) => { let d = `M${cx - sg * 3} 140`;
        for (let x = cx - sg * 3; x <= cx + sg * 3; x += 4) { const g = Math.exp(-((x - cx) ** 2) / (2 * sg * sg)); d += `L${n(x)} ${n(140 - 70 * g * Math.cos((x - cx) / 9) ** 2)}`; }
        b += `<path d="${d}Z" ${fill('--back2')} opacity=".8"/>`; });
      return [h, b + base(140, h)]; },
    // next: light beams converging on a vanishing point over a perspective grid
    horizon(r) { const h = 170, vx = 720, vy = 70; let b = C(vx, vy + 6, 60, '--back2', 'opacity=".5"') + C(vx, vy + 6, 34, '--glow', 'opacity=".5"');
      for (let i = -14; i <= 14; i++) b += S(`M${vx + i * 8} ${vy}L${vx + i * 110} ${h + 20}`, '--back2', 1.2, 'opacity=".7"');
      for (let k = 1; k < 9; k++) { const y = vy + (h - vy) * (k / 8) ** 1.8; b += S(`M-40 ${n(y)}H${W + 40}`, '--back2', 1.1, 'opacity=".6"'); }
      for (let i = -12; i <= 12; i += 3) b += SIG(`M${vx + i * 110} ${h + 20}L${vx + i * 8} ${vy}`, 1.8, '24 216', r, 0.85);
      return [h, `<rect x="-60" y="${vy}" width="${W + 120}" height="${h - vy + 4}" ${fill('--band')} opacity=".55"/>` + b]; },
  };

  /* ── interludes (drawn across the whole band) ── */
  const T = (x, y, txt, size, v, extra = '') => `<text x="${n(x)}" y="${n(y)}" style="font:600 ${size}px var(--font-mono);fill:var(${v})" ${extra}>${txt}</text>`;
  const hex = (r, k) => { let s = ''; for (let i = 0; i < k; i++) s += '0123456789abcdef'[Math.floor(r() * 16)]; return s; };
  const OVER = {
    // the internet revolution: a wired globe, browsers, email and search around it, undersea fibre below
    internet(r) { const h = 400, cx = 720, cy = 175, G = 140; let b = '';
      b += C(cx, cy, G + 30, '--glow', 'opacity=".08"') + C(cx, cy, G, '--band', 'opacity=".7"') + S(`M${cx - G} ${cy}a${G} ${G} 0 1 0 ${2 * G} 0a${G} ${G} 0 1 0 ${-2 * G} 0`, '--deep', 2);
      for (const lat of [-60, -30, 0, 30, 60]) { const a = lat * Math.PI / 180; b += `<ellipse cx="${cx}" cy="${n(cy - G * Math.sin(a))}" rx="${n(G * Math.cos(a))}" ry="${n(G * Math.cos(a) * 0.16)}" style="fill:none;stroke:var(--back2)" stroke-width="1.2"/>`; }
      for (const lon of [20, 50, 75]) b += `<ellipse cx="${cx}" cy="${cy}" rx="${n(G * Math.sin(lon * Math.PI / 180))}" ry="${G}" style="fill:none;stroke:var(--back2)" stroke-width="1.2"/>`;
      const city = []; for (let i = 0; i < 16; i++) { const la = between(r, -1.0, 1.1), lo = between(r, -1.35, 1.35); city.push([cx + G * Math.cos(la) * Math.sin(lo), cy - G * Math.sin(la)]); }
      for (let i = 0; i < 22; i++) { const [x1, y1] = pick(r, city), [x2, y2] = pick(r, city); if (x1 === x2) continue;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = mx - cx, dy = my - cy, L = Math.hypot(dx, dy) || 1, lift = 30 + Math.hypot(x2 - x1, y2 - y1) * 0.25;
        const d = `M${n(x1)} ${n(y1)}Q${n(mx + dx / L * lift)} ${n(my + dy / L * lift)} ${n(x2)} ${n(y2)}`; b += S(d, '--deep', 1.2, 'opacity=".5"') + SIG(d, 2.2, '8 220', r); }
      city.forEach(([x, y]) => b += C(x, y, 3.5, '--deep') + C(x, y, 8, '--glow', 'opacity=".25"'));
      const panel = (x, y, w, hh, kind) => { let o = R(x, y, w, hh, '--band', 'rx="6" opacity=".92"') + `<rect x="${n(x)}" y="${n(y)}" width="${w}" height="${hh}" rx="6" style="fill:none;stroke:var(--deep)" stroke-width="1.6"/>`;
        if (kind === 'browser') { o += S(`M${x} ${y + 16}h${w}`, '--deep', 1.4) + [8, 16, 24].map(k => C(x + k, y + 8, 2.2, '--deep')).join('') + R(x + 34, y + 4, w - 42, 8, '--back', 'rx="4"') + T(x + 38, y + 11, 'http://', 7, '--deep');
          o += R(x + 10, y + 26, w * 0.35, hh - 36, '--back2', 'rx="2"'); for (let k = 0; k < 4; k++) o += R(x + w * 0.42 + 6, y + 28 + k * 11, w * between(r, 0.25, 0.48), 4, '--back2', 'rx="2"'); }
        if (kind === 'email') o += S(`M${x} ${y}l${w / 2} ${hh * 0.6} ${w / 2} ${-hh * 0.6}`, '--deep', 1.6) + T(x + w / 2 - 6, y + hh - 10, '@', 14, '--deep');
        if (kind === 'search') o += C(x + 18, y + hh / 2, 7, '--band', 'style="fill:none;stroke:var(--deep)" stroke-width="2"') + S(`M${x + 23} ${y + hh / 2 + 5}l6 6`, '--deep', 2.4) + R(x + 38, y + hh / 2 - 3, w - 52, 6, '--back2', 'rx="3"');
        if (kind === 'chat') for (let k = 0; k < 3; k++) o += R(x + 10 + (k % 2) * 30, y + 10 + k * 14, w - 50, 9, k % 2 ? '--back2' : '--back', 'rx="4.5"');
        return o; };
      [[150, 50, 190, 120, 'browser', 340], [1100, 40, 190, 120, 'browser', 1100], [300, 230, 120, 70, 'email', 420], [1010, 230, 190, 40, 'search', 1010], [70, 210, 140, 60, 'chat', 210], [1240, 200, 140, 60, 'chat', 1240]]
        .forEach(([x, y, w, hh, k, ax]) => { b += S(`M${ax} ${y + hh / 2}L${cx + (ax < cx ? -G : G) * 0.9} ${cy + between(r, -40, 40)}`, '--deep', 1, 'stroke-dasharray="3 5" opacity=".6"') + panel(x, y, w, hh, k); });
      for (let k = 0; k < 4; k++) { let d = `M-40 ${348 + k * 9}`; for (let x = 0; x <= W + 40; x += 120) d += `Q${x - 60} ${n(340 + k * 9 + between(r, -10, 10))} ${x} ${348 + k * 9}`;
        b += S(d, '--back2', 1.6) + SIG(d, 2.2, '18 260', r); }
      return [h, b, 'top:70px']; },
    // blockchain: blocks of transactions, each sealed with the hash of the one before
    chain(r) { const h = 300; let b = '', prev = '0000000000';
      for (let i = 0; i < 6; i++) { const x = 40 + i * 236, y = 70 + (i % 2) * 34, w = 186, hh = 132, hs = '00' + hex(r, 8);
        b += R(x + 6, y + 6, w, hh, '--back2', 'rx="8" opacity=".6"') + R(x, y, w, hh, '--band', 'rx="8"') + `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="8" style="fill:none;stroke:var(--deep)" stroke-width="1.8"/>`;
        b += R(x, y, w, 24, '--deep', 'rx="8"') + R(x, y + 14, w, 10, '--deep') + T(x + 12, y + 16, i ? `BLOCK ${i}` : 'BLOCK 0 · GENESIS', 10, '--band');
        b += T(x + 12, y + 42, `prev #${prev}…`, 9.5, '--deep', 'opacity=".75"') + T(x + 12, y + 58, `hash #${hs}…`, 9.5, '--deep');
        for (let k = 0; k < 4; k++) b += R(x + 12, y + 72 + k * 13, between(r, 70, 160), 6, k % 2 ? '--back' : '--back2', 'rx="3"');
        if (i < 5) { const x1 = x + w, y1 = y + hh / 2, x2 = x + 236, y2 = 70 + ((i + 1) % 2) * 34 + hh / 2, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          b += `<ellipse cx="${n(mx - 9)}" cy="${n(my)}" rx="13" ry="7" style="fill:none;stroke:var(--deep)" stroke-width="3.4"/><ellipse cx="${n(mx + 9)}" cy="${n(my)}" rx="13" ry="7" style="fill:none;stroke:var(--glow)" stroke-width="3.4"/>`;
          b += SIG(`M${x1} ${n(y1)}L${x2} ${n(y2)}`, 2, '6 40', r); }
        prev = hs; }
      return [h, b, 'top:90px']; },
    // 2012: the classic convolutional net picture: an image, shrinking stacks of feature maps, dense layers, a class
    deep(r) { const h = 300; let b = '';
      const box = (x, y, w, hh, dz, v, op) => `<path d="M${n(x)} ${n(y)}h${n(w)}l${n(dz)} ${n(-dz)}h${n(-w)}z" ${fill(v)} opacity="${op}"/>` +
        `<path d="M${n(x + w)} ${n(y)}l${n(dz)} ${n(-dz)}v${n(hh)}l${n(-dz)} ${n(dz)}z" ${fill(v)} opacity="${op * 0.8}"/>` + `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(hh)}" opacity="${op}" style="fill:var(${v});stroke:var(--band)" stroke-width="1"/>`;
      for (let gx = 0; gx < 8; gx++) for (let gy = 0; gy < 8; gy++) b += R(130 + gx * 14, 90 + gy * 14, 13, 13, '--back2', `opacity="${n(between(r, 0.3, 1))}"`);
      const stacks = [[340, 70, 30, 150, 46], [520, 100, 40, 100, 36], [700, 124, 50, 64, 26], [880, 136, 56, 44, 20], [1030, 140, 60, 36, 16]];
      stacks.forEach(([x, y, w, hh, dz], i) => { for (let k = 3; k >= 0; k--) b += box(x + k * 7, y + k * 3, w, hh, dz, i % 2 ? '--back2' : '--deep', 0.35 + k * 0.12); });
      const dense = [[1180, 8], [1270, 8], [1360, 4]]; let prev = null;
      dense.forEach(([x, k]) => { const ys = []; for (let i = 0; i < k; i++) ys.push(150 - (k - 1) * 11 + i * 22);
        if (prev) prev[1].forEach(y1 => ys.forEach(y2 => b += S(`M${prev[0]} ${n(y1)}L${x} ${n(y2)}`, '--back2', 0.8, 'opacity=".6"')));
        ys.forEach(y => b += C(x, y, 6, '--deep')); prev = [x, ys]; });
      b += SIG('M250 150H330M480 150H515M640 150H700M800 150H880M985 150H1030M1120 150H1170', 2.2, '14 60', r);
      return [h, b, 'top:96px']; },
    // quantum: a dilution refrigerator (the "chandelier") with its qubit chip, Bloch spheres either side
    quantum(r) { const h = 400, cx = 720; let b = C(cx, 300, 120, '--glow', 'opacity=".1"');
      const gold = 'style="fill:#C9A14A"', plates = [[40, 300], [100, 240], [160, 180], [220, 128], [276, 80]];
      for (let k = 0; k < plates.length - 1; k++) { const [y, w] = plates[k], [y2, w2] = plates[k + 1];
        for (const s of [-1, 1]) b += `<path d="M${n(cx + s * (w2 / 2 - 8))} ${y + 8}V${y2}" style="stroke:#B08A3A" stroke-width="5"/>`;
        for (let c = -2; c <= 2; c++) { const x = cx + c * w2 / 6; let d = `M${n(x)} ${y + 8}`; for (let yy = y + 14; yy < y2; yy += 10) d += `Q${n(x + 6)} ${yy - 5} ${n(x)} ${yy}`; b += S(d, '--deep', 1.2, 'opacity=".7"'); } }
      plates.forEach(([y, w]) => b += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="9" rx="2" ${gold}/>` + `<rect x="${cx - w / 2}" y="${y + 9}" width="${w}" height="3" style="fill:#8C6A28"/>`);
      b += `<rect x="${cx - 26}" y="300" width="52" height="30" rx="3" ${gold}/>` + R(cx - 16, 306, 32, 18, '--deep', 'rx="2"');
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) b += `<circle cx="${cx - 9 + i * 9}" cy="${311 + j * 8}" r="2.2" class="led" style="fill:var(--glow);--d:${n(between(r, 0, 3))}s"/>`;
      b += S(`M${cx - 70} 30h140`, '--deep', 4);
      const bloch = (x, y, R0, a) => { const vx = x + R0 * 0.8 * Math.cos(a), vy = y - R0 * 0.8 * Math.sin(a);
        return C(x, y, R0, '--band', 'opacity=".6"') + S(`M${x - R0} ${y}a${R0} ${R0} 0 1 0 ${2 * R0} 0a${R0} ${R0} 0 1 0 ${-2 * R0} 0`, '--deep', 1.8) +
          `<ellipse cx="${x}" cy="${y}" rx="${R0}" ry="${n(R0 * 0.3)}" style="fill:none;stroke:var(--back2)" stroke-width="1.4" stroke-dasharray="4 4"/>` + S(`M${x} ${y - R0 - 8}v${2 * R0 + 16}`, '--back2', 1.2) +
          S(`M${x} ${y}L${n(vx)} ${n(vy)}`, '--glow', 3) + C(vx, vy, 5, '--glow') + T(x - 9, y - R0 - 14, '|0⟩', 12, '--deep') + T(x - 9, y + R0 + 24, '|1⟩', 12, '--deep'); };
      b += bloch(330, 170, 80, 0.9) + bloch(1110, 190, 70, 2.3);
      for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const x = 60 + i * 34, y = 300 + j * 30;
        if (i < 4) b += S(`M${x} ${y}h34`, '--back2', 1.4); if (j < 2) b += S(`M${x} ${y}v30`, '--back2', 1.4); b += S(`M${x - 7} ${y}h14M${x} ${y - 7}v14`, '--deep', 3.4); }
      for (let i = 0; i < 4; i++) { let d = ''; for (let x = 1230; x <= 1420; x += 4) d += (d ? 'L' : 'M') + x + ' ' + n(320 + i * 14 + 10 * Math.sin((x + i * 30) / 14) * Math.exp(-(((x - 1325) / 70) ** 2))); b += S(d, i % 2 ? '--back2' : '--deep', 1.6); }
      return [h, b, 'top:60px']; },
  };

  /* ── eras: icons that float in the band, emoji, skyline and the dial label ── */
  // icons: names in assets/tech/; 'logo:<id>' = a Simple Icons mark from assets/icons/tech-logos.svg, in its brand colour
  const ERA = {
    transistor:  { year: 1947, label: 'The transistor', icon: 'transistor',
      icons: ['transistor', 'vacuum-tube', 'ai-chip', 'transistor-symbol', 'qubit', 'oscilloscope', 'rocket', 'dna', 'atom', 'robot', 'resistor', 'telescope'], emoji: ['💡', '🤖', '🚀', '⚛️', '🧠', '🔭'] },
    ic:          { year: 1958, label: 'Integrated circuit', icon: 'ic-dip', edge: 'dip',
      icons: ['ic-dip', 'gate-and', 'logo:arduino', 'gate-or', 'gate-not', 'logo:raspberrypi', 'transistor-symbol', 'wafer', 'satellite', 'rocket', 'capacitor', 'diode'], emoji: ['🧮', '🔬', '🛰️', '🌕', '📻'] },
    cpu:         { year: 1971, label: 'Microprocessor', icon: 'cpu', edge: 'silicon',
      icons: ['cpu', 'logo:intel', 'ram', 'logo:arm', 'floppy', 'logo:amd', 'punch-card', 'logo:riscv', 'hdd', 'logo:c', 'terminal', 'logo:linux', 'wafer', 'logo:gnu'], emoji: ['💾', '🧮', '⌨️', '🕹️'] },
    crypto:      { year: 1976, label: 'Public-key crypto', icon: 'shield', edge: 'vault',
      icons: ['shield', 'logo:letsencrypt', 'key', 'logo:wireguard', 'fingerprint', 'logo:signal', 'firewall', 'logo:wireshark', 'bug', 'logo:kalilinux', 'hash', 'lock-chip'], emoji: ['🔐', '🛡️', '🔑', '🕵️', '🐛'] },
    web:         { year: 1991, label: 'World Wide Web', icon: 'browser', edge: 'desks',
      icons: ['browser', 'logo:html5', 'email', 'logo:javascript', 'search', 'logo:firefoxbrowser', 'crt', 'logo:wikipedia', 'wifi', 'logo:webassembly', 'chat', 'logo:stackoverflow'], emoji: ['🌐', '💻', '✉️', '🔎', '📱', '💬'] },
    internet:    { year: null, label: 'The internet revolution', icon: 'globe', edge: 'mesh', over: 'internet', icons: [], emoji: [] },
    gpu:         { year: 1999, label: 'The GPU', icon: 'gpu', edge: 'board',
      icons: ['gpu', 'logo:nvidia', 'fan', 'logo:amd', 'vr', 'logo:opencv', 'ram', 'logo:python', 'drone', 'ai-chip'], emoji: ['🎮', '⚡', '🥽', '🔥', '🖼️'] },
    cloud:       { year: 2006, label: 'The cloud', icon: 'cloud', edge: 'datacenter',
      icons: ['cloud', 'logo:linux', 'database', 'logo:kubernetes', 'container', 'logo:docker', 'router', 'logo:ubuntu', 'ssd', 'logo:postgresql', 'terminal', 'logo:redis',
              'fiber', 'logo:apachekafka', 'droplet', 'logo:ceph', 'solar', 'logo:nginx', 'switch', 'logo:terraform', 'server-rack', 'logo:prometheus'], emoji: ['☁️', '🗄️', '🌐', '🐧', '📦'] },
    chain:       { year: 2009, label: 'Blockchain', icon: 'blockchain', edge: 'blocks', over: 'chain', icons: [], emoji: [] },
    deep:        { year: 2012, label: 'Deep learning on GPUs', icon: 'neural-net', edge: 'neurons', over: 'deep', icons: [], emoji: [] },
    transformer: { year: 2017, label: 'The Transformer', icon: 'attention', edge: 'tokens',
      icons: ['attention', 'logo:pytorch', 'neural-net', 'logo:tensorflow', 'robot', 'logo:huggingface', 'dna', 'logo:jupyter', 'sparkle', 'logo:keras', 'robot-arm', 'logo:numpy'], emoji: ['🧠', '🤖', '🧬', '📊', '♟️'] },
    cluster:     { year: 2020, label: 'Foundation models', icon: 'server-rack', edge: 'superpod',
      icons: ['gpu', 'logo:nvidia', 'droplet', 'logo:ray', 'fiber', 'logo:pytorch', 'switch', 'logo:kubernetes', 'ai-chip', 'logo:opentelemetry', 'fan', 'logo:cplusplus'], emoji: ['🧠', '⚡', '🛰️', '💧'] },
    llm:         { year: 2022, label: 'ChatGPT, Claude & LLMs', icon: 'chat', edge: 'chat',
      icons: ['chat', 'logo:claude', 'sparkle', 'logo:anthropic', 'attention', 'logo:googlegemini', 'robot', 'logo:mistralai', 'shield', 'logo:meta', 'bci', 'logo:ollama', 'logo:huggingface', 'logo:langchain'], emoji: ['💬', '✨', '🤖', '🧠', '📚'] },
    quantum:     { year: 'Now', label: 'Quantum computing', icon: 'qubit', edge: 'wave', over: 'quantum', icons: [], emoji: [] },
    next:        { year: 'Next', label: 'The future', icon: 'rocket', edge: 'horizon',
      icons: ['rocket', 'planet', 'logo:qiskit', 'fusion', 'bci', 'logo:rust', 'robot-arm', 'solar', 'photonic', 'dna', 'telescope', 'drone'], emoji: ['🚀', '🪐', '🧬', '🔭', '🦾', '🌌'] },
  };
  const LOGO = { amd: '#ED1C24', android: '#3DDC84', anthropic: null, apachekafka: null, arduino: '#00878F', arm: '#0091BD', c: '#A8B9CC', ceph: '#EF5C55', claude: '#D97757',
    cplusplus: '#00599C', docker: '#2496ED', firefoxbrowser: '#FF7139', gnu: '#A42E2B', googlegemini: '#8E75B2', html5: '#E34F26', huggingface: '#FFD21E', intel: '#0071C5',
    javascript: '#F7DF1E', jupyter: '#F37626', kalilinux: '#557C94', keras: '#D00000', kubernetes: '#326CE5', langchain: '#7FC8FF', letsencrypt: '#2C6CB0', linux: '#FCC624',
    meta: '#0467DF', mistralai: '#FA520F', nginx: '#009639', numpy: '#4DABCF', nvidia: '#76B900', ollama: null, opencv: '#5C3EE8', opentelemetry: null, postgresql: '#4169E1',
    prometheus: '#E6522C', python: '#3776AB', pytorch: '#EE4C2C', qiskit: '#6929C4', raspberrypi: '#A22846', ray: '#028CF0', redis: '#FF4438', riscv: '#3A4FB0', rust: null,
    signal: '#3B45FD', stackoverflow: '#F58025', tensorflow: '#FF6F00', terraform: '#844FBA', ubuntu: '#E95420', webassembly: '#654FF0', wikipedia: null, wireguard: '#88171A', wireshark: '#1679A7' };
  const SPIN = new Set(['atom', 'gear', 'qubit', 'planet']);
  const PULSE = new Set(['ai-chip', 'quantum-chip', 'cryostat', 'wifi', 'sparkle', 'chat', 'shield']);
  const url = f => `url("${new URL(A + f + '.svg', document.baseURI).href}")`;

  const float = (scene, era, r) => {
    era.icons.forEach((f, i) => {
      if (f.startsWith('logo:')) { const id = f.slice(5), margin = r() < 0.6, sz = n(between(r, margin ? 26 : 22, margin ? 44 : 34));
        const x = margin ? (r() < 0.5 ? between(r, 0.5, 8.5) : between(r, 91.5, 98.5)) : between(r, 4, 94);
        scene.insertAdjacentHTML('beforeend', `<svg class="tlg${margin ? ' ti-m' : ' tlg-soft'}" style="left:${n(x)}%;top:${n(between(r, 4, 86))}%;width:${sz}px;height:${sz}px;--c:${LOGO[id] || 'var(--deep)'};--d:${n(between(r, 0, 9))}s;--t:${n(between(r, 8, 14))}s;--dx:${n(between(r, -16, 16))}px" aria-hidden="true" focusable="false"><use href="assets/icons/tech-logos.svg#${id}"/></svg>`);
        return; }
      const el = document.createElement('i'), margin = i % 2 === 0, sz = n(between(r, margin ? 34 : 26, margin ? 62 : 44));
      const x = margin ? (r() < 0.5 ? between(r, 0.5, 8) : between(r, 92, 98.5)) : between(r, 4, 94);
      el.className = 'ti' + (margin ? ' ti-m' : ' ti-soft') + (SPIN.has(f) ? ' ti-spin' : '') + (PULSE.has(f) ? ' ti-pulse' : '');
      el.style.webkitMaskImage = el.style.maskImage = url(f);
      el.style.cssText += `left:${n(x)}%;top:${n(between(r, 4, 86))}%;width:${sz}px;height:${sz}px;--d:${n(between(r, 0, 9))}s;--t:${n(between(r, SPIN.has(f) ? 24 : 7, SPIN.has(f) ? 50 : 13))}s;--dx:${n(between(r, -18, 18))}px`;
      scene.appendChild(el); });
    era.emoji.forEach(e => { const el = document.createElement('span'), margin = r() < 0.6; el.className = 'te' + (margin ? ' te-m' : ''); el.textContent = e;
      const x = margin ? (r() < 0.5 ? between(r, 1, 9) : between(r, 91, 98)) : between(r, 10, 90);
      el.style.cssText = `left:${n(x)}%;top:${n(between(r, 6, 88))}%;--fs:${n(between(r, 18, 30))}px;--d:${n(between(r, 0, 9))}s;--dx:${n(between(r, -16, 16))}px`;
      scene.appendChild(el); });
  };

  const bands = [...document.querySelectorAll('[data-era]')];
  bands.forEach((sec, i) => {
    const era = ERA[sec.dataset.era]; if (!era) return;
    const r = rng(1009 * (i + 3));
    if (era.edge) { const [h, body] = EDGE[era.edge](r); const e = document.createElement('div');
      e.className = 'edge edge-' + era.edge; e.setAttribute('aria-hidden', 'true'); e.innerHTML = svg(h, body); sec.prepend(e); }
    const scene = document.createElement('div'); scene.className = 'scene'; scene.setAttribute('aria-hidden', 'true');
    if (era.over) { const [h, body, pos] = OVER[era.over](r); scene.insertAdjacentHTML('beforeend', svg(h, body, 'over', pos)); }
    float(scene, era, r);
    sec.prepend(scene);
  });

  /* ── the time machine: a fixed dial that rolls to the year of the section you are reading ── */
  const timed = bands.filter(b => ERA[b.dataset.era] && ERA[b.dataset.era].year !== null);
  if (timed.length) {
    const dial = document.createElement('div'); dial.className = 'era-dial'; dial.setAttribute('aria-hidden', 'true');
    dial.innerHTML = `<i></i><span class="yr"></span><span class="nm"></span><span class="ticks">${timed.map(() => '<b></b>').join('')}</span><span class="hint">time machine · scroll to travel forward</span>`;
    document.body.appendChild(dial);
    const [ic, yr, nm] = [dial.querySelector('i'), dial.querySelector('.yr'), dial.querySelector('.nm')], ticks = [...dial.querySelectorAll('.ticks b')];
    let shown = null, raf = 0;
    const set = idx => { const sec = timed[idx], era = ERA[sec.dataset.era]; if (shown === idx) return;
      const from = shown === null ? null : ERA[timed[shown].dataset.era].year; shown = idx;
      ic.style.webkitMaskImage = ic.style.maskImage = url(era.icon);
      const probe = document.createElement('i'); probe.style.cssText = 'position:absolute;color:var(--deep)'; sec.appendChild(probe);
      dial.style.setProperty('--dial', getComputedStyle(probe).color); probe.remove();
      nm.textContent = era.label; ticks.forEach((t, k) => t.classList.toggle('on', k <= idx));
      cancelAnimationFrame(raf);
      if (RM || typeof era.year !== 'number' || typeof from !== 'number') { yr.textContent = era.year; return; }
      const t0 = performance.now(), step = now => { const p = Math.min(1, (now - t0) / 700), e = 1 - (1 - p) ** 3;
        yr.textContent = Math.round(from + (era.year - from) * e); if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step); };
    set(0);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(timed.indexOf(e.target)); }), { rootMargin: '-45% 0px -50% 0px' });
    timed.forEach(s => io.observe(s));
    addEventListener('scroll', () => dial.classList.add('moved'), { once: true, passive: true });
  }

  if (RM) document.documentElement.classList.add('still');
})();
