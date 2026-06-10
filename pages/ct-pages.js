/* ============================================================
   CONNECTIVE TECHNOLOGIES — Inner page shared behaviour
   ============================================================ */
(function(){
  /* ----- Header scroll state ----- */
  const nav = document.getElementById('nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Mobile menu ----- */
  const mm = document.getElementById('mobileMenu');
  const tog = document.getElementById('navToggle');
  if (tog && mm) {
    tog.addEventListener('click', () => mm.classList.toggle('open'));
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));
  }

  /* ----- Treated image bands (adds imagery mid-page) ----- */
  (function(){
    const slug = location.pathname.split('/').pop().replace('.html','');
    const isGroup = /^ct-/.test(slug);
    const grid = document.querySelector('.help-grid');
    if (!grid) return;
    const help = grid.closest('section');
    if (!help) return;
    const PMAP = { 'managed-services':'people-support', 'cyber-security':'grp-ops', 'cloud-hybrid':'people-collab', 'connectivity':'grp-business', 'ai-transformation':'grp-pro', 'compliance-governance':'grp-social' };
    const img = isGroup ? 'people-collab' : PMAP[slug];
    if (!img) return;
    // Merge the "How CT helps" cards onto a treated image (one dark section, no duplicate heading)
    help.classList.add('helpband');
    help.classList.remove('alt');
    const fill = document.createElement('img'); fill.className = 'img-fill'; fill.src = '../assets/' + img + '.webp'; fill.alt = '';
    const veil = document.createElement('div'); veil.className = 'slate-veil';
    const circ = document.createElement('div'); circ.className = 'circuit-layer';
    help.insertBefore(circ, help.firstChild);
    help.insertBefore(veil, help.firstChild);
    help.insertBefore(fill, help.firstChild);
  })();

  /* ----- Reveal on scroll ----- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
    io.observe(el);
  });

  /* ----- Section line-breakers ----- */
  document.querySelectorAll('.sec.why, .outcome, .teamband, .imgband, .helpband, .bluefoot').forEach((sec) => {
    if (sec.querySelector(':scope > .pulse-divider')) return;
    const pd = document.createElement('div');
    pd.className = 'pulse-divider';
    pd.setAttribute('aria-hidden', 'true');
    pd.innerHTML = '<div class="pd-line"></div><div class="pd-head"></div>';
    sec.insertBefore(pd, sec.firstChild);
  });
  const pio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('run'); pio.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.pulse-divider').forEach(d => pio.observe(d));

  /* ----- Group hero hexagon: rounded clip + teal ring (matches homepage) ----- */
  (function(){
    const hex = document.querySelector('.hero-hex');
    if (!hex) return;
    const V = [[150,0],[300,88],[300,250],[150,338],[0,250],[0,88]], W = 300, H = 338;
    function rounded(r, asPath){
      const n = V.length; let out = []; let d = '';
      for (let i = 0; i < n; i++){
        const p = V[(i-1+n)%n], v = V[i], q = V[(i+1)%n];
        const d1x = p[0]-v[0], d1y = p[1]-v[1], l1 = Math.hypot(d1x,d1y);
        const d2x = q[0]-v[0], d2y = q[1]-v[1], l2 = Math.hypot(d2x,d2y);
        const rr = Math.min(r, l1/2, l2/2);
        const a = [v[0]+d1x/l1*rr, v[1]+d1y/l1*rr], b = [v[0]+d2x/l2*rr, v[1]+d2y/l2*rr];
        if (asPath){ d += (i===0?'M':'L') + a[0].toFixed(2)+' '+a[1].toFixed(2) + ' Q'+v[0]+' '+v[1]+' '+b[0].toFixed(2)+' '+b[1].toFixed(2)+' '; }
        else { for (let t = 0; t <= 1.0001; t += 0.0625){ const mt = 1-t, x = mt*mt*a[0]+2*mt*t*v[0]+t*t*b[0], y = mt*mt*a[1]+2*mt*t*v[1]+t*t*b[1]; out.push((x/W*100).toFixed(3)+'% '+(y/H*100).toFixed(3)+'%'); } }
      }
      return asPath ? d + 'Z' : 'polygon(' + out.join(',') + ')';
    }
    const clip = rounded(34, false);
    const st = document.createElement('style');
    st.textContent = '.hero-hex .hx-photo img{clip-path:' + clip + '}.hero-hex .hx-back{clip-path:' + clip + '}';
    document.head.appendChild(st);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'hx-ring'); svg.setAttribute('viewBox', '0 0 300 338'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', rounded(34, true)); path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#34e8d3'); path.setAttribute('stroke-width', '3.5'); path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path); hex.appendChild(svg);
  })();

  /* ----- Card hover spark (light tracing the border) ----- */
  document.querySelectorAll('.helpband .help-card').forEach((card) => {
    if (card.querySelector('.card-spark')) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'card-spark');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    ['sp-trail', 'sp-head'].forEach((cls) => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('class', cls);
      r.setAttribute('x', '0.8'); r.setAttribute('y', '0.8');
      r.setAttribute('width', '98.4'); r.setAttribute('height', '98.4');
      r.setAttribute('rx', '3'); r.setAttribute('ry', '3');
      r.setAttribute('pathLength', '100');
      svg.appendChild(r);
    });
    card.appendChild(svg);
  });

  /* ----- Animated pulse canvas on the footer (matches homepage) ----- */
  (function(){
    const foot = document.querySelector('.bluefoot');
    if (!foot) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'circuit-canvas footer-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const grid = foot.querySelector(':scope > .circuit-layer');
    if (grid) grid.replaceWith(canvas); else foot.insertBefore(canvas, foot.firstChild);
    const s = document.createElement('script');
    s.src = '../assets/hero-circuit.js';
    document.body.appendChild(s);
  })();

  /* ----- News: recent articles (article pages) + share buttons (news page) ----- */
  (function(){
    const A = [
      {s:'cyber-essentials-2026', t:'Cyber Essentials in 2026: what the latest updates mean for you', tag:'Cyber Security', img:'news-datacenter'},
      {s:'protecting-patient-data', t:'Protecting patient data: IT priorities for modern healthcare', tag:'Healthcare', img:'news-health'},
      {s:'technology-that-scales', t:'Technology that scales: supporting growth without the growing pains', tag:'Business', img:'news-business'},
      {s:'hybrid-working-three-years-on', t:'Hybrid working, three years on: what actually works', tag:'Hybrid Working', img:'news-hybrid'},
      {s:'cutting-through-ai-hype', t:'Cutting through the AI hype: practical first steps for SMEs', tag:'AI & Transformation', img:'news-ai'}
    ];
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const SHAREBTNS = '<span class="sr-label">Share</span>'
      + '<button class="sr-btn" data-share="linkedin" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 7.5a1.94 1.94 0 11-.02-3.88 1.94 1.94 0 01.02 3.88zM5.3 9h3.3v10.5H5.3V9zm5.4 0h3.16v1.43h.05c.44-.8 1.5-1.65 3.1-1.65 3.3 0 3.9 2.1 3.9 4.9v5.82h-3.3v-5.16c0-1.23 0-2.8-1.74-2.8-1.74 0-2 1.34-2 2.72v5.24h-3.3V9z"/></svg></button>'
      + '<button class="sr-btn" data-share="x" aria-label="Share on X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-7.2 8.2L22 21h-6.6l-4.3-5.6L6.2 21H3.2l7.7-8.8L2.5 3h6.7l3.9 5.2L17.5 3zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3z"/></svg></button>'
      + '<button class="sr-btn" data-share="email" aria-label="Share by email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></button>'
      + '<button class="sr-btn" data-share="copy" aria-label="Copy link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg></button>';
    const foot = document.querySelector('.bluefoot');
    if (document.querySelector('.article-hero') && foot) {
      const hw = document.querySelector('.article-hero .wrap');
      if (hw && !hw.querySelector('.share-row')) {
        const sr = document.createElement('div'); sr.className = 'share-row';
        sr.innerHTML = SHAREBTNS;
        hw.appendChild(sr);
      }
      const cur = location.pathname.split('/').pop().replace('.html','');
      const others = A.filter(a => a.s !== cur).slice(0, 3);
      const cards = others.map(a => '<a class="ncard reveal" href="' + a.s + '.html"><div class="nc-media"><img src="../assets/news/' + a.img + '.webp" alt="' + a.t + '"></div><div class="nc-body"><span class="news-tag">' + a.tag + '</span><h3>' + a.t + '</h3><span class="nc-read">Read article ' + arrow + '</span></div></a>').join('');
      const sec = document.createElement('section');
      sec.className = 'sec recent-sec';
      sec.innerHTML = '<div class="wrap"><div class="s-head reveal"><div class="s-kicker"><span class="kd"></span>Keep reading</div><h2 class="s-title">Recent articles</h2></div><div class="news-grid">' + cards + '</div></div>';
      foot.parentNode.insertBefore(sec, foot);
      const rio = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }); }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
      sec.querySelectorAll('.reveal').forEach(el => rio.observe(el));
    }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-share]');
      if (!b) return;
      const url = encodeURIComponent(location.href);
      const title = encodeURIComponent(document.title);
      const t = b.getAttribute('data-share');
      if (t === 'linkedin') window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'noopener');
      else if (t === 'x') window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + title, '_blank', 'noopener');
      else if (t === 'email') location.href = 'mailto:?subject=' + title + '&body=' + url;
      else if (t === 'copy') { try { navigator.clipboard.writeText(location.href); } catch(err){} b.classList.add('copied'); setTimeout(() => b.classList.remove('copied'), 1600); }
    });
  })();

  /* ----- Contact form ----- */
  const cform = document.getElementById('contactForm');
  if (cform) {
    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!cform.checkValidity()) { cform.reportValidity(); return; }
      cform.style.display = 'none';
      const ok = document.getElementById('cfSuccess');
      if (ok) ok.classList.add('show');
    });
  }

  /* ----- Book-a-call modal ----- */
  const modal = document.getElementById('bookModal');
  if (modal) {
    const form = document.getElementById('modalForm');
    const succ = document.getElementById('modalSuccess');
    const open = () => { modal.classList.add('open'); if (form) form.style.display = 'block'; if (succ) succ.style.display = 'none'; };
    const close = () => modal.classList.remove('open');
    document.addEventListener('click', e => { if (e.target.closest('[data-book]')) { open(); if (mm) mm.classList.remove('open'); } });
    const x = document.getElementById('modalClose');
    if (x) x.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    const sub = document.getElementById('modalSubmit');
    if (sub) sub.addEventListener('click', () => { if (form) form.style.display = 'none'; if (succ) succ.style.display = 'block'; });
  }

  /* ----- Coming-soon stub links ----- */
  let toast = document.getElementById('navToast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'navToast'; document.body.appendChild(toast); }
  let t = null;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-nav]');
    if (!a) return;
    e.preventDefault();
    const label = (a.textContent || 'This page').trim().replace(/\s+/g, ' ');
    toast.innerHTML = '<b>' + label + '</b> is coming soon — this page is part of the full sitemap.';
    toast.classList.add('show');
    if (mm) mm.classList.remove('open');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('show'), 3200);
  });
})();
