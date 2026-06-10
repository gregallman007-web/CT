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
