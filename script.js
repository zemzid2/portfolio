/* ================================================================
   PORTFOLIO — script.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ─────────────────────────────────────────── */
  const cur  = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  // Smooth trailing ring
  (function raf() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cur2.style.left = rx + 'px';
    cur2.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  // Scale up on interactive elements
  const interactables = 'a, button, .srv-card, .pcard, .tcard, .htab, .pf-btn, .tool-chip';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });


  /* ── SCROLL REVEAL ─────────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      el.classList.add('in');

      // Stagger children if they have a delay class pattern
      const children = el.querySelectorAll('[data-delay]');
      children.forEach(c => {
        c.style.transitionDelay = c.dataset.delay + 's';
      });

      // Animate skill bars when about section reveals
      el.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });

      // Animate stat underlines in hero
      el.querySelectorAll('.hstat').forEach(h => h.classList.add('lit'));

      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => io.observe(el));


  /* ── ACTIVE NAV ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObs.observe(s));


  /* ── PARALLAX ORBS ─────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const speed = i % 2 === 0 ? 0.12 : -0.08;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });


  /* ── HERO TABS ─────────────────────────────────────────────── */
  document.querySelectorAll('.htab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.htab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });


  /* ── PORTFOLIO FILTER (visual only) ───────────────────────── */
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  /* ── CONTACT FORM ──────────────────────────────────────────── */
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      submitBtn.textContent = '✓ Sent! I\'ll reply within 1 hour';
      submitBtn.style.background = 'linear-gradient(90deg, #00d44e, #05f560)';
      submitBtn.style.boxShadow  = '0 0 30px rgba(5,245,96,.45)';
      setTimeout(() => {
        submitBtn.textContent    = 'Send Message →';
        submitBtn.style.background = '';
        submitBtn.style.boxShadow  = '';
      }, 3500);
    });
  }


  /* ── NAV SCROLL BEHAVIOUR ──────────────────────────────────── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(6,10,6,0.82)'
      : 'rgba(6,10,6,0.55)';
  }, { passive: true });


  /* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── NUMBER COUNT-UP ANIMATION ─────────────────────────────── */
  // Triggers once when hero stats section is visible
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.hstat-n').forEach(el => {
        const raw = el.textContent.trim();
        const num = parseInt(raw);
        if (isNaN(num)) return;
        const suffix = raw.replace(/[0-9]/g, '');
        let start = 0;
        const end = num;
        const dur = 1400;
        const step = 16;
        const inc  = (end / (dur / step));
        const timer = setInterval(() => {
          start += inc;
          if (start >= end) { clearInterval(timer); start = end; }
          el.textContent = Math.floor(start) + suffix;
        }, step);
      });
      statsObs.disconnect();
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObs.observe(statsEl);


  /* ── TILT EFFECT ON SERVICE CARDS ──────────────────────────── */
  document.querySelectorAll('.srv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'transform 0s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .35s, border-color .35s, box-shadow .35s';
    });
  });


  /* ── GLASSMORPHISM SHIMMER ON HOVER ─────────────────────────── */
  // Adds a moving highlight reflection across glass cards
  document.querySelectorAll('.glass, .hf-card, .proc-step, .tcard').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });

});
