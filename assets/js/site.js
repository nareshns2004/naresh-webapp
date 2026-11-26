/* Shared behaviour for every page: mobile nav, scroll reveal, active nav link, writing index + filters,
   command palette (⌘K / Ctrl+K / "/"), scroll progress. */
(function () {
  const SCRIPT = document.currentScript;
  const ROOT = SCRIPT ? new URL('../../', SCRIPT.src) : new URL('/', location.href);
  document.documentElement.classList.remove('no-js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.prefersReducedMotion = () => reduceMotion.matches;

  // Theme toggle: light/dark override of the system setting, remembered per browser
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches;
  const themeBtn = document.querySelector('.theme-toggle');
  const syncThemeBtn = () => {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', `Switch to ${isDark() ? 'light' : 'dark'} theme`);
    themeBtn.textContent = isDark() ? '☀' : '☾';
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable: theme lasts for this page */ }
      syncThemeBtn();
      document.dispatchEvent(new CustomEvent('themechange'));
    });
    systemDark.addEventListener('change', syncThemeBtn);
    syncThemeBtn();
  }

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Writing index (index.html only): rendered from window.POSTS in data.js, with topic filters
  const grid = document.getElementById('writing-grid');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (grid && window.POSTS) {
    const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', year: 'numeric' });
    const TONE = { Efficiency: 'copper', Reliability: 'accent', Security: 'fault' };
    const posts = [...window.POSTS].sort((a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.date.localeCompare(a.date));
    grid.innerHTML = posts.map(p => {
      const ext = p.kind === 'external';
      const tone = TONE[p.tag] || '';
      const cls = tone === 'copper' ? ' eff' : tone === 'fault' ? ' sec' : '';
      return `<a class="card post-card reveal${p.featured ? ' featured' : ''}${cls}" data-tag="${esc(p.tag)}" href="${esc(p.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>
        <div class="post-meta">
          <span class="chip${tone ? ' chip-' + tone : ''}">${esc(p.tag)}</span>
          <span>${fmt(p.date)}${p.minutes ? ` · ${p.minutes} min` : ''}</span>
          ${ext ? '<span class="post-kind">Read ↗</span>' : ''}
        </div>
        <h3 class="post-title">${esc(p.title)}</h3>
        <p class="post-summary">${esc(p.summary)}</p>
      </a>`;
    }).join('');
    const bar = document.getElementById('writing-filters');
    if (bar) {
      const counts = posts.reduce((m, p) => (m[p.tag] = (m[p.tag] || 0) + 1, m), {});
      const tags = ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a])];
      bar.innerHTML = tags.map(t => `<button type="button" data-f="${esc(t)}" aria-pressed="${t === 'All'}">${esc(t)}<span class="c">${t === 'All' ? posts.length : counts[t]}</span></button>`).join('');
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const f = b.dataset.f;
        bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        grid.querySelectorAll('.post-card').forEach(c => c.classList.toggle('hide', f !== 'All' && c.dataset.tag !== f));
      });
    }
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  }

  // Highlight the nav link for the section in view
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  // The endless procession above every footer: three lanes (sky, land, deep sea) looping left to right (decoration)
  const siteCss = document.querySelector('link[href*="site.css"]');
  const footEl = document.querySelector('.footer');
  if (siteCss && footEl) {
    const WL = new URL('../wildlife/', siteCss.href);
    const AR = { crocodile: 3.1, walrus: 1.54, seal: 2, narwhal: 3.6, oryx: 0.91, elk: 0.91, caribou: 0.91, 'moose-bull': 1.11, cassowary: 0.77,
      peacock: 1.72, 'crane-fly': 3.3, 'arctic-tern': 2.1, frigatebird: 2.7, 'eagle-soar': 2.5, 'vulture-soar': 2.5, albatross: 4.8, flock: 3.2,
      'man-of-war': 0.45, 'jelly-pink': 0.5, 'jelly-cyan': 0.5, panda: 0.93 };
    // [file, height, options]  f = flip to face right, c=#hex colour, coat-*, art (full colour), up=N px above the lane floor
    const LANES = {
      sky: { speed: 46, items: [['eagle-soar', 30, 'up=10'], ['arctic-tern', 20, 'up=24'], ['vulture-soar', 38, 'c=#7A5A3A'], ['frigatebird', 22, 'up=18'],
        ['crane-fly', 18, 'up=4'], ['crane-fly', 15, 'up=14'], ['crane-fly', 13, 'up=24'], ['albatross', 22, 'up=12'], ['eagle-soar', 26, 'c=#8A5A35 up=20'],
        ['swallow', 18, 'up=6'], ['vulture-soar', 30, 'up=16'], ['seagull', 20, 'up=2'], ['flock', 22, 'up=20'], ['arctic-tern', 16, 'up=8'],
        ['eagle-soar', 34, 'c=#9A6A3E up=2'], ['frigatebird', 26, 'up=22'], ['hummingbird', 16, 'up=10 c=#1FA67A'], ['vulture-soar', 42, 'c=#6E5A4A up=6'], ['albatross', 18, 'up=26']] },
      land: { speed: 30, items: [
        // savanna
        ['elephant', 62], ['elephant', 34], ['giraffe', 78, 'f coat-giraffe'], ['zebra', 46, 'f coat-zebra'], ['zebra', 42, 'f coat-zebra'], ['rhino', 44, 'f'],
        ['hippo', 40, 'f'], ['leopard', 34, 'f coat-leopard'], ['ostrich', 50], ['oryx', 58], ['lion', 34, 'c=#B87A2A'],
        // desert & outback
        ['camel', 56], ['kangaroo', 46],
        // prairie & northern forest
        ['bison', 46], ['bison', 40], ['deer', 52], ['rabbit', 18], ['fox', 26], ['elk', 68], ['moose-bull', 60], ['panda', 46, 'art'],
        // amazon & asian jungle
        ['leopard', 36, 'f coat-leopard'], ['tiger', 44, 'f coat-tiger'], ['gorilla', 44], ['cassowary', 54, 'c=#1E2A3A'], ['crocodile', 22],
        ['frog', 16, 'c=#4E9A3E'], ['peacock', 40, 'c=#1F7A8C'], ['flamingo', 50, 'c=#E8789A'], ['heron', 50],
        // polar ice
        ['polar-bear', 44, 'c=#C9D6E2'], ['caribou', 62], ['caribou', 54], ['walrus', 36], ['seal', 22], ['penguin', 34], ['penguin', 30], ['penguin', 26], ['fox', 24, 'c=#D5DEE6']] },
      sea: { speed: 24, items: [['whale', 46, 'f'], ['narwhal', 22], ['narwhal', 18], ['dolphin', 34], ['manta-ray', 40, 'up=6'], ['jelly-pink', 46, 'art up=6'],
        ['sea-turtle', 34], ['school-of-fish', 34], ['octopus', 36], ['man-of-war', 50, 'art'], ['angler-fish', 28], ['tropical-fish', 22, 'c=#F2C230'],
        ['squid', 32], ['jelly-cyan', 42, 'art up=10'], ['clownfish', 18, 'c=#F07C2A'], ['seahorse', 30], ['giant-squid', 40], ['whale', 38, 'f'], ['crab', 18, 'c=#E4683A']] },
    };
    const proc = document.createElement('div'); proc.className = 'procession'; proc.setAttribute('aria-hidden', 'true');
    Object.entries(LANES).forEach(([lane, { speed, items }]) => {
      const L = document.createElement('div'); L.className = 'lane lane-' + lane;
      const track = document.createElement('div'); track.className = 'track'; let half = 0;
      for (let copy = 0; copy < 2; copy++) items.forEach(([file, h, opt = '']) => {
        const t = opt.split(' '), w = Math.round(h * (AR[file] || 1)), gap = 26 + (h % 7) * 4, el = document.createElement('i');
        el.className = 'pa' + (t.includes('f') ? ' flip' : '') + (t.includes('art') ? ' art' : '');
        el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.marginRight = gap + 'px';
        const up = t.find(o => o.startsWith('up=')); if (up) el.style.marginBottom = up.slice(3) + 'px';
        const col = t.find(o => o.startsWith('c=')); if (col) el.style.backgroundColor = col.slice(2);
        const u = `url("${new URL(file + '.svg', WL).href}")`;
        if (t.includes('art')) el.style.backgroundImage = u; else { el.style.webkitMaskImage = u; el.style.maskImage = u; }
        const coat = t.find(o => o.startsWith('coat-')); if (coat) { el.style.backgroundImage = `url("${new URL(coat + '.svg', WL).href}")`; el.classList.add('coated'); }
        if (!copy) half += w + gap;
        track.appendChild(el); });
      track.style.setProperty('--t', Math.round(half / speed) + 's');
      L.appendChild(track); proc.appendChild(L); });
    footEl.before(proc); footEl.classList.add('has-procession');
  }

  // A trail of big-cat paw prints leading into the footer (decoration)
  const foot = document.querySelector('.footer');
  if (foot) { const row = document.createElement('div'); row.className = 'paw-row'; row.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 24; i++) { const p = document.createElement('i'); p.style.setProperty('--i', i); p.style.setProperty('--y', (i % 2 ? 6 : -6) + 'px'); row.appendChild(p); }
    foot.before(row); }

  // Scroll progress (thin tricolour bar under the nav, with a hummingbird flying along it)
  const nav = document.querySelector('.nav');
  if (nav && !reduceMotion.matches) {
    const bar = document.createElement('div'); bar.className = 'nav-progress'; bar.setAttribute('aria-hidden', 'true');
    const bird = document.createElement('div'); bird.className = 'nav-prowler'; bird.setAttribute('aria-hidden', 'true');
    nav.append(bar, bird);
    let ticking = false;
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0;
      bar.style.setProperty('--progress', p); bird.style.setProperty('--progress', p);
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }


  // Command palette: ⌘K / Ctrl+K / "/" opens; arrows + Enter; Esc closes.
  const onHome = !!document.getElementById('writing-grid');
  const href = h => onHome && h.startsWith('#') ? h : new URL('index.html' + h, ROOT).href;
  const ext = u => ({ go: () => window.open(u, '_blank', 'noopener') });
  const items = [
    ...[['Work', '#work'], ['Core stack', '#stack'], ['Security · threat map', '#security'], ['Writing', '#writing'], ['Evidence', '#evidence'],
        ['Toolbox', '#foundations'], ['Profiles', '#profiles'], ['Book: AI/ML Infrastructure Engineering', '#book'], ['References: AI/ML infra curriculum & papers', '#references'], ['Contact', '#contact']]
      .map(([t, h]) => ({ k: 'section', t, go: () => { location.href = href(h); } })),
    ...(window.POSTS || []).map(p => ({ k: p.tag, t: p.title, go: () => { location.href = new URL(p.url, ROOT).href; } })),
    { k: 'repo', t: 'goodput: fault-tolerant training orchestrator', ...ext('https://github.com/nareshns2004/goodput-fault-tolerant-training-orchestrator') },
    { k: 'repo', t: 'kvwire: disaggregated inference engine', ...ext('https://github.com/nareshns2004/kvwire-disaggregated-inference-engine') },
    { k: 'model', t: 'qwen3-nccl-rca-lora: NCCL root-cause model', ...ext('https://huggingface.co/nareshns2004/qwen3-nccl-rca-lora') },
    { k: 'space', t: 'nccl-incident-rca: incident triage Space', ...ext('https://huggingface.co/spaces/nareshns2004/nccl-incident-rca') },
    { k: 'dataset', t: 'rdma-kv-transfer-traces: KV-transfer dataset', ...ext('https://huggingface.co/datasets/nareshns2004/rdma-kv-transfer-traces') },
    { k: 'space', t: 'disagg-kv-explorer: move or recompute KV', ...ext('https://huggingface.co/spaces/nareshns2004/disagg-kv-explorer') },
    { k: 'repo', t: 'nicprof: NIC counter → step-time attribution', ...ext('https://github.com/nareshns2004/ai-nic-performance-profiler') },
    { k: 'repo', t: 'kptk: kernel performance toolkit', ...ext('https://github.com/nareshns2004/kernel-performance-toolkit') },
    { k: 'profile', t: 'GitHub', ...ext('https://github.com/nareshns2004') },
    { k: 'profile', t: 'Hugging Face', ...ext('https://huggingface.co/nareshns2004') },
    { k: 'profile', t: 'LinkedIn', ...ext('https://www.linkedin.com/in/nareshns2004/') },
    { k: 'profile', t: 'Substack', ...ext('https://substack.com/@nareshns2004') },
    { k: 'profile', t: 'YouTube', ...ext('https://www.youtube.com/@nareshns2004') },
    { k: 'profile', t: 'X / Twitter · @naresh_swe24', ...ext('https://x.com/naresh_swe24') },
    { k: 'profile', t: 'LeetCode', ...ext('https://leetcode.com/u/nareshns2004/') },
    { k: 'action', t: 'Toggle light / dark theme', go: () => themeBtn && themeBtn.click() },
  ];
  let pal = null, input, list, sel = 0, shown = [], lastFocus = null;
  function score(q, t) {
    if (!q) return 1;
    t = t.toLowerCase(); q = q.toLowerCase();
    const i = t.indexOf(q); if (i >= 0) return 100 - i;
    let j = 0, s = 0;
    for (const ch of t) { if (ch === q[j]) { j++; s++; if (j === q.length) return s; } }
    return 0;
  }
  function render() {
    const q = input.value.trim();
    shown = items.map(it => ({ it, s: Math.max(score(q, it.t), score(q, it.k) * 0.5) })).filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s).slice(0, 40).map(x => x.it);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length ? shown.map((it, i) =>
      `<li role="option" id="pal-${i}" aria-selected="${i === sel}" data-i="${i}"><span class="pk">${esc(it.k)}</span><span>${esc(it.t)}</span></li>`).join('')
      : '<li class="empty">No matches. Try “rdma”, “pickle” or “agent”.</li>';
    input.setAttribute('aria-activedescendant', shown.length ? 'pal-' + sel : '');
    const cur = list.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function build() {
    pal = document.createElement('div');
    pal.className = 'palette'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-modal', 'true'); pal.setAttribute('aria-label', 'Command palette');
    pal.innerHTML = `<div class="palette-backdrop"></div><div class="palette-box">
      <input class="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-autocomplete="list" placeholder="Jump to a post, section, repo or profile…" autocomplete="off" spellcheck="false">
      <ul class="palette-list" id="pal-list" role="listbox"></ul>
      <div class="palette-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div></div>`;
    document.body.appendChild(pal);
    input = pal.querySelector('input'); list = pal.querySelector('ul');
    input.addEventListener('input', () => { sel = 0; render(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    list.addEventListener('mousemove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; render(); } });
    list.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) run(+li.dataset.i); });
    pal.querySelector('.palette-backdrop').addEventListener('click', close);
  }
  function open() {
    if (!pal) build();
    lastFocus = document.activeElement;
    pal.classList.add('open'); input.value = ''; sel = 0; render(); input.focus();
  }
  function close() { if (!pal) return; pal.classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function run(i) { const it = shown[i]; if (!it) return; close(); it.go(); }
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); pal && pal.classList.contains('open') ? close() : open(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); open(); }
  });
  document.querySelectorAll('[data-palette-open]').forEach(b => b.addEventListener('click', open));
  if (!/Mac|iPhone|iPad/.test(navigator.platform || '')) document.querySelectorAll('kbd').forEach(k => { if (k.textContent === '⌘K') k.textContent = 'Ctrl K'; });

  // For the engineers who open DevTools first.
  try {
    console.log('%c NK %c Reading the source? Good instinct.', 'background:#1D4ED8;color:#fff;font-weight:700;padding:2px 6px;border-radius:3px', 'font-weight:600');
    console.log('No framework, no build step, no trackers. Source: https://github.com/nareshns2004/naresh-webapp\nHiring for GPU infra or AI-infra security? ' + EMAIL);
  } catch (e) { /* no console */ }
})();
