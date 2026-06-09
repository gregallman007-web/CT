/* Connective Technologies — animated circuit-board background.
   PCB-style traces with light pulses that flow horizontally and vertically.
   Renders transparently into any <canvas class="circuit-canvas"> so the
   element's own CSS background shows through. */
(function () {
  const TEAL = '0,225,202';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, traces = [], pulses = [], last = 0;

    function makeTrace(gap) {
      let x = Math.round((Math.random() * W) / gap) * gap;
      let y = Math.round((Math.random() * H) / gap) * gap;
      const pts = [[x, y]];
      const segs = 3 + Math.floor(Math.random() * 4);
      let horiz = Math.random() < 0.5;
      for (let s = 0; s < segs; s++) {
        const len = (1 + Math.floor(Math.random() * 4)) * gap;
        if (horiz) x += (Math.random() < 0.5 ? -1 : 1) * len;
        else y += (Math.random() < 0.5 ? -1 : 1) * len;
        x = Math.max(0, Math.min(W, x));
        y = Math.max(0, Math.min(H, y));
        pts.push([x, y]);
        horiz = !horiz;
      }
      let total = 0; const cum = [0];
      for (let k = 1; k < pts.length; k++) {
        total += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
        cum.push(total);
      }
      return { pts, cum, total };
    }

    function posAt(t, d) {
      d = Math.max(0, Math.min(t.total, d));
      for (let k = 1; k < t.pts.length; k++) {
        if (d <= t.cum[k]) {
          const seg = t.cum[k] - t.cum[k - 1];
          const f = seg ? (d - t.cum[k - 1]) / seg : 0;
          const a = t.pts[k - 1], b = t.pts[k];
          return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        }
      }
      return t.pts[t.pts.length - 1];
    }

    function spawnPulse() {
      const t = traces[Math.floor(Math.random() * traces.length)];
      if (!t || t.total < 20) return;
      pulses.push({
        t, d: Math.random() * t.total,
        speed: 45 + Math.random() * 70,
        dir: Math.random() < 0.5 ? 1 : -1,
        len: 28 + Math.random() * 46,
        life: 0, ttl: 4 + Math.random() * 5
      });
    }

    function build() {
      const gap = 48;
      traces = [];
      const count = Math.max(14, Math.round((W * H) / 22000));
      for (let i = 0; i < count; i++) traces.push(makeTrace(gap));
      pulses = [];
      if (!reduce) for (let i = 0; i < Math.round(count * 0.32); i++) spawnPulse();
    }

    function drawTrace(t) {
      ctx.beginPath();
      ctx.moveTo(t.pts[0][0], t.pts[0][1]);
      for (let k = 1; k < t.pts.length; k++) ctx.lineTo(t.pts[k][0], t.pts[k][1]);
      ctx.strokeStyle = 'rgba(' + TEAL + ',0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(' + TEAL + ',0.20)';
      for (const p of [t.pts[0], t.pts[t.pts.length - 1]]) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.8, 0, 6.3);
        ctx.fill();
      }
    }

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      for (const t of traces) drawTrace(t);
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (const t of traces) drawTrace(t);
      ctx.lineCap = 'round';
      for (const p of pulses) {
        p.d += p.speed * p.dir * dt;
        p.life += dt;
        if (p.d < 0) p.d += p.t.total;
        if (p.d > p.t.total) p.d -= p.t.total;
        const head = posAt(p.t, p.d);
        const tail = posAt(p.t, p.d - p.dir * p.len);
        const grad = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
        grad.addColorStop(0, 'rgba(' + TEAL + ',0)');
        grad.addColorStop(1, 'rgba(140,245,230,0.95)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tail[0], tail[1]);
        ctx.lineTo(head[0], head[1]);
        ctx.stroke();
        ctx.fillStyle = 'rgba(150,250,236,0.95)';
        ctx.shadowColor = 'rgba(' + TEAL + ',0.9)';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(head[0], head[1], 2, 0, 6.3);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (pulses[i].life > pulses[i].ttl) { pulses.splice(i, 1); spawnPulse(); }
      }
      requestAnimationFrame(frame);
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) drawStatic();
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduce) { last = performance.now(); requestAnimationFrame(frame); }
  }

  document.querySelectorAll('canvas.circuit-canvas').forEach(initCanvas);
})();
