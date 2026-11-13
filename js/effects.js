(() => {
  const d = document, h = d.documentElement;
  const R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $ = (s, c = d) => [...c.querySelectorAll(s)];
  h.classList.add("js");

  addEventListener("DOMContentLoaded", () => {
    // Boot screen -> hero counters
    const L = d.getElementById("loader");
    const go = () => {
      if (!L || L.done) return;
      L.done = 1; L.classList.add("done"); h.classList.add("ready");
      setTimeout(() => L.remove(), 700);
      $("[data-count]").forEach(el => {
        const to = +el.dataset.count, dec = +el.dataset.dec || 0, s = performance.now();
        (function f(n) {
          const p = Math.min((n - s) / 1400, 1);
          el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
          if (p < 1) requestAnimationFrame(f);
        })(s);
      });
    };
    L?.addEventListener("click", go);
    setTimeout(go, R ? 0 : 1700);

    $(".code-lines p").forEach((p, i) => p.style.setProperty("--i", i));
    const tk = d.getElementById("ticker"); if (tk) tk.innerHTML += tk.innerHTML;

    // Terminal yang mengetik sendiri
    const ty = d.querySelector(".typing");
    const cmds = ["ready_to_build", "ping esp32-s3 --telegram", "SELECT * FROM skills;", 'git commit -m "keep building"'];
    if (ty && !R) {
      let i = 0, j = 0, del = 0;
      (function tick() {
        const w = cmds[i]; j += del ? -1 : 1; ty.textContent = w.slice(0, j);
        let ms = del ? 28 : 70;
        if (!del && j === w.length) { del = 1; ms = 1800; }
        else if (del && !j) { del = 0; i = (i + 1) % cmds.length; ms = 350; }
        setTimeout(tick, ms);
      })();
    }

    // Progress bar, header, nav aktif
    const pg = d.getElementById("progress"), hd = d.querySelector(".site-header");
    const sc = () => {
      const m = h.scrollHeight - innerHeight;
      pg.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`;
      hd.classList.toggle("scrolled", scrollY > 20);
    };
    addEventListener("scroll", sc, { passive: true }); sc();
    const links = $('.nav a[href^="#"]');
    const so = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id))),
      { rootMargin: "-45% 0px -50% 0px" });
    $("main section[id]").forEach(s => so.observe(s));

    // Reveal saat scroll + efek scramble pada label section
    const G = "01<>/{}[]#$%&*+=?";
    const scr = el => {
      const f = el.textContent; let n = 0;
      const id = setInterval(() => {
        el.textContent = [...f].map((c, i) => c === " " || c === "/" || i < n ? c : G[Math.random() * G.length | 0]).join("");
        if (n++ >= f.length) { el.textContent = f; clearInterval(id); }
      }, 35);
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el); el.classList.add("in");
      const si = el.matches(".section-index") ? el : el.querySelector(".section-index");
      if (si && !R) scr(si);
      setTimeout(() => el.classList.remove("reveal", "in"), 1100 + parseFloat(el.style.getPropertyValue("--d") || 0) * 1000);
    }), { threshold: .12 });
    $(".section-heading,.about-lead,.fact,.skill-card,.project-card,.timeline-item,.achievement-grid article,.cert-card,.contact-inner>*").forEach(el => {
      el.style.setProperty("--d", ([...el.parentNode.children].indexOf(el) * .08).toFixed(2) + "s");
      el.classList.add("reveal"); io.observe(el);
    });

    // Cursor spotlight, glow & tilt kartu
    if (fine && !R) {
      const sp = d.getElementById("spot");
      addEventListener("pointermove", e => { sp.style.setProperty("--x", e.clientX + "px"); sp.style.setProperty("--y", e.clientY + "px"); }, { passive: true });
      $(".skill-card,.achievement-grid article,.project-card,.cert-card").forEach(c => {
        const tilt = !c.matches(".project-card,.cert-card"); c.classList.add("glow");
        c.addEventListener("pointermove", e => {
          const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
          if (tilt) c.style.transform = `perspective(800px) rotateX(${(.5 - y / r.height) * 8}deg) rotateY(${(x / r.width - .5) * 8}deg) translateY(-3px)`;
        });
        c.addEventListener("pointerleave", () => c.style.transform = "");
      });
    }

    // Jaringan partikel interaktif
    const cv = d.getElementById("net");
    if (cv && !R) {
      const x = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 1.5);
      let W, H, P = [], lw = 0; const m = { x: -999, y: -999 }, D = 140 * dpr, M = 190 * dpr;
      const init = () => {
        if (innerWidth === lw && P.length) return; lw = innerWidth;
        W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
        const n = Math.min(70, Math.round(innerWidth * innerHeight / 26000));
        P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr }));
      };
      init(); addEventListener("resize", init);
      addEventListener("pointermove", e => { m.x = e.clientX * dpr; m.y = e.clientY * dpr; }, { passive: true });
      const line = (a, bx, by, l, lim, col, w) => {
        x.strokeStyle = `rgba(${col},${w * (1 - l / lim)})`; x.lineWidth = dpr * .8;
        x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(bx, by); x.stroke();
      };
      (function f() {
        if (!d.hidden) {
          x.clearRect(0, 0, W, H);
          for (let i = 0; i < P.length; i++) {
            const a = P[i]; a.x += a.vx; a.y += a.vy;
            if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
            x.fillStyle = "rgba(110,231,210,.7)"; x.beginPath(); x.arc(a.x, a.y, 1.4 * dpr, 0, 6.3); x.fill();
            for (let j = i + 1; j < P.length; j++) {
              const b = P[j], l = Math.hypot(a.x - b.x, a.y - b.y);
              if (l < D) line(a, b.x, b.y, l, D, "122,167,255", .22);
            }
            const dm = Math.hypot(a.x - m.x, a.y - m.y);
            if (dm < M) line(a, m.x, m.y, dm, M, "110,231,210", .45);
          }
        }
        requestAnimationFrame(f);
      })();
    }
  });
})();
