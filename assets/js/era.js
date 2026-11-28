/* era.js (index.html only): the time-machine layer.
   Scrolling the homepage travels forward through computing history. Every section is an era band (data-era):
   1947 transistor → 1958 integrated circuit → 1971 microprocessor → 1976 public-key crypto / cyber security → 1991 the web →
   (the internet revolution) → 1999 GPU → 2006 cloud → (2009 blockchain) → 2012 deep learning → 2020 foundation models →
   2022 ChatGPT, Claude & LLMs → (quantum, now) → the future.
   Every era matches its section: Security is the cyber-security era, Writing the web, References the LLM era.
   This file draws each era's skyline (the border above the section), floats that era's technology icons and emoji,
   draws the three interludes (internet, blockchain, quantum), and runs the fixed "time machine" dial. Shapes come from a seeded RNG, so every
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
    // 1999: a long GPU cooler: fin stacks, heat pipes, fans behind
    heatsink(r) { const h = 160; let b = '';
      for (let x = 60; x < W; x += between(r, 160, 260)) { const rr = between(r, 34, 52); b += C(x, 150 - rr * 0.7, rr, '--back') + S(`M${n(x - rr * 0.7)} ${n(150 - rr * 0.7)}h${n(rr * 1.4)}M${n(x)} ${n(150 - rr * 1.4)}v${n(rr * 1.4)}`, '--back2', 3); }
      for (let x = -20; x < W + 40;) { const run = Math.floor(between(r, 14, 36)), hh = between(r, 40, 80);
        for (let k = 0; k < run; k++) b += R(x + k * 7, 140 - hh, 3, hh, '--back2');
        b += S(`M${n(x + 10)} 142V${n(140 - hh * 0.75)}M${n(x + run * 7 - 10)} 142V${n(140 - hh * 0.75)}`, '--deep', 5, 'opacity=".75"');
        x += run * 7 + between(r, 10, 30); }
      b += R(-60, 136, W + 120, 8, '--deep', 'opacity=".8"');
      return [h, b + base(144, h)]; },
    // 2006: rows of racks in a warehouse-scale computer, cable trays above, status LEDs
    racks(r) { const h = 180; let b = S(`M-40 22H${W + 40}`, '--back2', 4);
      for (let x = 30; x < W; x += 54) b += S(`M${x} 22q12 ${n(between(r, 14, 30))} 24 0`, '--back2', 1.4, 'opacity=".7"');
      for (let x = -10; x < W + 40;) { const w = between(r, 44, 58), hh = between(r, 110, 140), y = 170 - hh;
        b += R(x, y, w, hh, '--back2', 'rx="2"');
        for (let u = y + 8; u < 164; u += 9) { b += R(x + 5, u, w - 10, 6, '--back', 'rx="1"'); if (r() < 0.5) b += led(r, x + w - 9, u + 3, 1.6); }
        x += w + between(r, 3, 6); if (r() < 0.12) x += 40; }
      return [h, b + base(170, h)]; },
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
    // 2020s: a machine hall: tall racks, glowing optical cabling overhead
    superpod(r) { const h = 150; let b = '';
      for (let i = 0; i < 7; i++) { const y = 14 + i * 3; b += S(`M-40 ${y}C360 ${y + 30} 1080 ${y - 20} ${W + 40} ${y + 8}`, '--deep', 1.4, 'opacity=".45"'); }
      for (let x = -10; x < W + 40;) { const w = between(r, 46, 60), hh = between(r, 90, 116), y = 142 - hh;
        b += R(x, y, w, hh, '--back', 'rx="2"') + R(x + 4, y + 4, w - 8, hh - 8, '--back2', 'rx="1" opacity=".55"');
        for (let u = y + 10; u < 136; u += 7) if (r() < 0.55) b += `<rect x="${n(x + 8)}" y="${n(u)}" width="${n(between(r, 6, w - 20))}" height="2" class="led" style="fill:var(--glow);--d:${n(between(r, 0, 3))}s" opacity=".8"/>`;
        x += w + 4; if (r() < 0.1) x += 34; }
      return [h, b + base(142, h)]; },
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
  const ERA = {
    transistor:  { year: 1947, label: 'The transistor', icon: 'transistor',
      icons: ['transistor', 'vacuum-tube', 'ai-chip', 'transistor-symbol', 'qubit', 'oscilloscope', 'rocket', 'dna', 'atom', 'robot'], emoji: ['💡', '🤖', '🚀', '⚛️', '🧠'] },
    ic:          { year: 1958, label: 'Integrated circuit', icon: 'ic-dip', edge: 'dip',
      icons: ['ic-dip', 'gate-and', 'gate-or', 'gate-not', 'transistor-symbol', 'wafer', 'ic-dip', 'rocket', 'satellite'], emoji: ['🧮', '🔬', '🛰️', '🌕'] },
    cpu:         { year: 1971, label: 'Microprocessor', icon: 'cpu', edge: 'silicon',
      icons: ['cpu', 'ic-dip', 'bits', 'gear', 'punch-card', 'floppy', 'hdd', 'wafer', 'ai-chip', 'telescope'], emoji: ['💾', '🧮', '⌨️', '🕹️'] },
    crypto:      { year: 1976, label: 'Public-key crypto', icon: 'shield', edge: 'vault',
      icons: ['shield', 'key', 'lock-chip', 'fingerprint', 'firewall', 'bug', 'hash', 'shield', 'key', 'network'], emoji: ['🔐', '🛡️', '🔑', '🕵️', '🐛'] },
    web:         { year: 1991, label: 'World Wide Web', icon: 'browser', edge: 'desks',
      icons: ['browser', 'globe', 'email', 'search', 'crt', 'laptop', 'wifi', 'phone', 'chat'], emoji: ['🌐', '💻', '✉️', '🔎', '📱', '💬'] },
    internet:    { year: null, label: 'The internet revolution', icon: 'globe', edge: 'mesh', over: 'internet', icons: [], emoji: [] },
    gpu:         { year: 1999, label: 'The GPU', icon: 'gpu', edge: 'heatsink',
      icons: ['gpu', 'ai-chip', 'neural-net', 'gpu', 'vr', 'nic', 'cpu', 'drone'], emoji: ['🎮', '⚡', '🥽', '🔥'] },
    cloud:       { year: 2006, label: 'The cloud', icon: 'cloud', edge: 'racks',
      icons: ['cloud', 'server-rack', 'switch', 'network', 'phone', 'lock-chip', 'nic', 'cloud'], emoji: ['☁️', '🗄️', '🌐', '📱'] },
    chain:       { year: 2009, label: 'Blockchain', icon: 'blockchain', edge: 'blocks', over: 'chain', icons: [], emoji: [] },
    learning:    { year: 2012, label: 'Deep learning', icon: 'neural-net', edge: 'neurons',
      icons: ['neural-net', 'attention', 'robot', 'ai-chip', 'dna', 'robot-arm', 'sparkle', 'drone'], emoji: ['🧠', '🤖', '🧬', '📊', '♟️'] },
    cluster:     { year: 2020, label: 'Foundation models', icon: 'server-rack', edge: 'superpod',
      icons: ['gpu', 'server-rack', 'nic', 'fiber', 'switch', 'ai-chip', 'network', 'gpu'], emoji: ['🧠', '⚡', '🛰️'] },
    llm:         { year: 2022, label: 'ChatGPT, Claude & LLMs', icon: 'chat', edge: 'tokens',
      icons: ['chat', 'sparkle', 'attention', 'robot', 'chat', 'ai-chip', 'shield', 'bci', 'sparkle'], emoji: ['💬', '✨', '🤖', '🧠', '📚'] },
    quantum:     { year: 'Now', label: 'Quantum computing', icon: 'qubit', edge: 'wave', over: 'quantum', icons: [], emoji: [] },
    next:        { year: 'Next', label: 'The future', icon: 'rocket', edge: 'horizon',
      icons: ['rocket', 'planet', 'fusion', 'bci', 'robot-arm', 'qubit', 'photonic', 'dna', 'telescope', 'drone'], emoji: ['🚀', '🪐', '🧬', '🔭', '🦾', '🌌'] },
  };
  const SPIN = new Set(['atom', 'gear', 'qubit', 'planet']);
  const PULSE = new Set(['ai-chip', 'quantum-chip', 'cryostat', 'wifi', 'sparkle', 'chat', 'shield']);
  const url = f => `url("${new URL(A + f + '.svg', document.baseURI).href}")`;

  const float = (scene, era, r) => {
    era.icons.forEach((f, i) => {
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
