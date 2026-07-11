/* =========================================================
   RANDOM TATTOO STUDIO — script.js
   Moduli: data, nav, reveal, gallery, lightbox, accordion, form, artistPage
   Vanilla JS, bez biblioteka.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- PODACI ------------------------------------- */
  // Kategorije: realizam (Mr Lemson), fine-line (Alex Anja), blackwork (Enco Enco)
  var ARTISTS = {
    lemson: {
      name: 'Mr Lemson',
      cat: 'realizam',
      style: 'REALIZAM · BLACK & GREY',
      ig: '@mr_lemson',
      igUrl: 'https://instagram.com/mr_lemson',
      portrait: 'assets/artists/lemson.jpg',
      count: 11,
      lead: 'Portreti, životinje, sve što traži da izgleda kao fotografija. Radi velike projekte — sleeve, grudi, leđa.',
      desc: 'Ako ti treba nešto što ljudi moraju dvaput da pogledaju da shvate da je tetovaža, to je njegov teren.'
    },
    anja: {
      name: 'Alex Anja',
      cat: 'fine-line',
      style: 'FINE LINE · ORNAMENTAL',
      ig: '@alex.anja.tattoo',
      igUrl: 'https://instagram.com/alex.anja.tattoo',
      portrait: 'assets/artists/anja.jpg',
      count: 7,
      lead: 'Tanke linije, floral, delikatne kompozicije.',
      desc: 'Ono što izgleda jednostavno a najteže je za izvesti — jer nema gde da se sakrije greška.'
    },
    enco: {
      name: 'Enco Enco',
      cat: 'blackwork',
      style: 'BLACKWORK · ILUSTRATIVNO',
      ig: '@enco_enco.tattoo',
      igUrl: 'https://instagram.com/enco_enco.tattoo',
      portrait: 'assets/artists/enco.jpg',
      count: 11,
      lead: 'Grafički pristup, jak kontrast, autorski pečat.',
      desc: 'Ako hoćeš nešto što niko drugi nema — dođi sa idejom, ne sa slikom sa Pinteresta.'
    }
  };

  // Dimenzije slika (za width/height — sprečava layout shift)
  var DIMS = {
    'lemson-1': [1440, 1918], 'lemson-2': [1638, 2031], 'lemson-3': [1440, 1919],
    'lemson-4': [1440, 1440], 'lemson-5': [1365, 1820], 'lemson-6': [1440, 1800],
    'lemson-7': [1440, 1800], 'lemson-8': [1440, 1440], 'lemson-9': [1440, 1440],
    'lemson-10': [1440, 1800], 'lemson-11': [1350, 1687],
    'anja-1': [1170, 1560], 'anja-2': [1170, 1560], 'anja-3': [1170, 1170],
    'anja-4': [1170, 1560], 'anja-5': [1170, 1552], 'anja-6': [1170, 1463], 'anja-7': [1170, 1552],
    'enco-1': [1170, 1463], 'enco-2': [1170, 1463], 'enco-3': [1440, 1918], 'enco-4': [1440, 1918],
    'enco-5': [1170, 1170], 'enco-6': [1170, 1462], 'enco-7': [1170, 1170], 'enco-8': [1170, 1463],
    'enco-9': [1170, 1463], 'enco-10': [1170, 1463], 'enco-11': [1170, 1463]
  };

  var CAT_ALT = {
    'realizam': 'Crno-beli realistični rad',
    'fine-line': 'Fine line rad tankih linija',
    'blackwork': 'Blackwork ilustrativni rad'
  };

  // Sastavi radove po umetniku, pa interleave za "SVI" prikaz
  function worksFor(id) {
    var a = ARTISTS[id], list = [];
    for (var i = 1; i <= a.count; i++) {
      var key = id + '-' + i, d = DIMS[key] || [1170, 1463];
      list.push({
        src: 'assets/works/' + key + '.jpg',
        cat: a.cat,
        w: d[0], h: d[1],
        alt: CAT_ALT[a.cat] + ', ' + a.name
      });
    }
    return list;
  }
  function interleave(arrs) {
    var out = [], max = 0, i, j;
    for (i = 0; i < arrs.length; i++) max = Math.max(max, arrs[i].length);
    for (i = 0; i < max; i++)
      for (j = 0; j < arrs.length; j++)
        if (arrs[j][i]) out.push(arrs[j][i]);   // svih 29 radova, izmešano
    return out;
  }
  var WORKS = interleave([worksFor('lemson'), worksFor('anja'), worksFor('enco')]);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var lenisInst = null;
  function lenisStop() { if (lenisInst) lenisInst.stop(); }
  function lenisStart() { if (lenisInst) lenisInst.start(); }

  /* ---------- NAV ---------------------------------------- */
  function initNav() {
    var nav = $('.nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 80); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    var toggle = $('.nav__toggle'),
        overlay = $('.nav-overlay'),
        close = $('.nav-overlay__close');
    if (!toggle || !overlay) return;
    var open = function () { overlay.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll'); lenisStop(); };
    var shut = function () { overlay.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll'); lenisStart(); };
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    $$('a', overlay).forEach(function (a) { a.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  /* ---------- SCROLL REVEAL ------------------------------ */
  function initReveal() {
    var els = $$('.reveal');
    // Stagger: 80ms po elementu unutar istog roditelja, max 5 pa reset
    var counters = new Map();
    els.forEach(function (el) {
      var p = el.parentNode;
      var idx = counters.get(p) || 0;
      counters.set(p, idx + 1);
      if (!reduceMotion) el.style.transitionDelay = ((idx % 5) * 80) + 'ms';
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');   // jednom otkriven — ostaje
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- GALERIJA ----------------------------------- */
  function makeWork(item) {
    var fig = document.createElement('figure');
    fig.className = 'work';
    fig.setAttribute('data-cat', item.cat);
    var img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.width = item.w; img.height = item.h;
    img.loading = 'lazy';
    fig.appendChild(img);
    return fig;
  }

  function initGallery() {
    $$('[data-gallery]').forEach(function (grid) {
      if (grid.closest('[data-artist-page]')) return; // artist stranicu puni initArtistPage
      var section = grid.closest('section') || document;
      var limit = parseInt(grid.getAttribute('data-limit'), 10);
      var items = isNaN(limit) ? WORKS : WORKS.slice(0, limit);
      items.forEach(function (it) { grid.appendChild(makeWork(it)); });

      var empty = $('.gallery-empty', section);
      var filters = $$('.filter', section);

      function apply(cat) {
        var shown = 0;
        $$('.work', grid).forEach(function (w) {
          var match = cat === 'all' || w.getAttribute('data-cat') === cat;
          w.style.display = match ? '' : 'none';
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      }

      filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filters.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
          btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
          var cat = btn.getAttribute('data-filter');
          grid.classList.add('fading');
          window.setTimeout(function () {
            apply(cat);
            grid.classList.remove('fading');
          }, reduceMotion ? 0 : 200);
        });
      });

      bindLightbox(grid);
    });
  }

  /* ---------- LIGHTBOX ----------------------------------- */
  var lb, lbImg, lbList = [], lbIndex = 0, lbLastFocus = null;
  function ensureLightbox() {
    lb = $('.lightbox');
    if (!lb) return null;
    lbImg = $('.lightbox__img', lb);
    var close = $('.lightbox__close', lb),
        prev = $('.lightbox__prev', lb),
        next = $('.lightbox__next', lb);
    close.addEventListener('click', closeLb);
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { e.preventDefault(); } // focus trap: drži fokus u dialogu
    });
    return lb;
  }
  function showLb() {
    var it = lbList[lbIndex];
    lbImg.src = it.src; lbImg.alt = it.alt;
  }
  function step(dir) {
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length; // loop
    showLb();
  }
  function openLb(list, index) {
    if (!lb) return;
    lbList = list; lbIndex = index;
    lbLastFocus = document.activeElement;
    lb.classList.add('open');
    document.body.classList.add('no-scroll');
    lenisStop();
    showLb();
    $('.lightbox__close', lb).focus();
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
    lenisStart();
    if (lbLastFocus) lbLastFocus.focus();
  }
  function bindLightbox(grid) {
    if (!lb) return;
    grid.addEventListener('click', function (e) {
      var fig = e.target.closest('.work');
      if (!fig) return;
      var visible = $$('.work', grid).filter(function (w) { return w.style.display !== 'none'; });
      var list = visible.map(function (w) { var i = $('img', w); return { src: i.src, alt: i.alt }; });
      openLb(list, visible.indexOf(fig));
    });
  }

  /* ---------- ACCORDION (FAQ) ---------------------------- */
  function initAccordion() {
    $$('.acc').forEach(function (acc, i) {
      var trigger = $('.acc__trigger', acc),
          panel = $('.acc__panel', acc);
      if (!trigger || !panel) return;
      var openIt = function (state) {
        trigger.setAttribute('aria-expanded', String(state));
        panel.style.maxHeight = state ? panel.scrollHeight + 'px' : '0px';
      };
      openIt(i === 0); // prvi otvoren po defaultu
      trigger.addEventListener('click', function () {
        openIt(trigger.getAttribute('aria-expanded') !== 'true');
      });
    });
    // Re-izračunaj visinu na resize za otvorene panele
    window.addEventListener('resize', function () {
      $$('.acc__trigger[aria-expanded="true"]').forEach(function (t) {
        var panel = $('.acc__panel', t.closest('.acc'));
        panel.style.maxHeight = panel.scrollHeight + 'px';
      });
    });
  }

  /* ---------- FORMA -------------------------------------- */
  function initForm() {
    var form = $('#kontakt-forma');
    if (!form) return;
    var fields = $$('[data-required]', form);

    function validate(field) {
      var wrap = field.closest('.field'),
          err = $('.field__error', wrap),
          ok = field.value.trim() !== '';
      wrap.classList.toggle('error', !ok);
      if (err) err.textContent = ok ? '' : 'Ovo polje je obavezno.';
      return ok;
    }
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validate(f); }); // validacija na blur
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (f) { if (!validate(f)) valid = false; });
      if (!valid) {
        var firstErr = $('.field.error [data-required]', form);
        if (firstErr) firstErr.focus();
        return;
      }
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'ŠALJEM…';
      form.setAttribute('data-loading', '1');
      // Bez backend-a: simuliraj slanje, pa zameni formu porukom
      window.setTimeout(function () {
        var msg = document.createElement('p');
        msg.className = 'form__success';
        msg.setAttribute('role', 'status');
        msg.textContent = 'Javićemo ti se u roku od 24h.';
        form.replaceWith(msg);
      }, 700);
    });
  }

  /* ---------- ARTIST STRANICA ---------------------------- */
  function initArtistPage() {
    var root = $('[data-artist-page]');
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var a = ARTISTS[id] || ARTISTS.lemson;

    document.title = a.name + ' — Random Tattoo Studio';
    var set = function (sel, txt) { var el = $(sel); if (el) el.textContent = txt; };
    set('[data-a-name]', a.name);
    set('[data-a-style]', a.style);
    set('[data-a-lead]', a.lead);
    set('[data-a-desc]', a.desc);

    var ig = $('[data-a-ig]');
    if (ig) { ig.textContent = a.ig; ig.href = a.igUrl; }
    var portrait = $('[data-a-portrait]');
    if (portrait) {
      portrait.src = a.portrait;
      portrait.alt = 'Portret — ' + a.name;
    }
    // Napuni galeriju radovima ovog umetnika
    var grid = $('[data-gallery]', root);
    if (grid) {
      worksFor(id).forEach(function (it) { grid.appendChild(makeWork(it)); });
      bindLightbox(grid);
    }
  }

  /* ---------- LIVE SAT (BEOGRAD) ------------------------- */
  function initClock() {
    var el = $('#clock');
    if (!el) return;
    function tick() {
      var t = new Date().toLocaleTimeString('sr-RS', {
        timeZone: 'Europe/Belgrade', hour: '2-digit', minute: '2-digit', hour12: false
      });
      el.textContent = 'Beograd ' + t;
    }
    tick();
    window.setInterval(tick, 1000 * 30);
  }

  /* ---------- MARQUEE (Ticker auto-scroll) -------------- */
  function makeMarquee(el, seconds) {
    if (reduceMotion || !el) return;
    var kids = Array.prototype.slice.call(el.children);
    if (!kids.length) return;
    var track = document.createElement('div');
    track.className = 'm-track';
    kids.forEach(function (k) { track.appendChild(k); });
    kids.forEach(function (k) { var c = k.cloneNode(true); c.setAttribute('data-clone', '1'); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; track.appendChild(c); });
    el.classList.add('marquee');
    el.appendChild(track);
    el.style.setProperty('--marquee-dur', (seconds || 45) + 's');
  }

  /* ---------- SCROLLER (skorašnji radovi → marquee) ----- */
  function initScroller() {
    var row = $('[data-scroller]');
    if (!row) return;
    WORKS.slice(0, 10).forEach(function (it) {
      var fig = document.createElement('figure');
      fig.className = 'scroller__item';
      var img = document.createElement('img');
      img.src = it.src; img.alt = it.alt; img.loading = 'lazy';
      img.width = it.w; img.height = it.h;
      fig.appendChild(img);
      row.appendChild(fig);
    });
    makeMarquee(row, 40); // auto-scroll kao Taylor Ticker
    // klik -> lightbox (izuzmi klonove)
    row.addEventListener('click', function (e) {
      var fig = e.target.closest('.scroller__item');
      if (!fig) return;
      var items = $$('.scroller__item', row).filter(function (w) { return !w.hasAttribute('data-clone'); });
      var list = items.map(function (w) { var i = $('img', w); return { src: i.src, alt: i.alt }; });
      var idx = items.indexOf(fig);
      if (idx < 0) { var src = $('img', fig).src; for (var k = 0; k < list.length; k++) { if (list[k].src === src) { idx = k; break; } } }
      openLb(list, Math.max(0, idx));
    });
  }

  /* ---------- RECENZIJE → marquee ----------------------- */
  function initReviewsMarquee() {
    makeMarquee($('.review-row'), 55);
  }

  /* ---------- INSTAGRAM GRID ----------------------------- */
  function initIG() {
    var grid = $('[data-ig]');
    if (!grid) return;
    // 12 kvadrata, izmešani radovi
    WORKS.slice(0, 12).forEach(function (it) {
      var fig = document.createElement('figure');
      fig.className = 'ig-item';
      var img = document.createElement('img');
      img.src = it.src; img.alt = it.alt; img.loading = 'lazy';
      fig.appendChild(img);
      grid.appendChild(fig);
    });
    grid.addEventListener('click', function (e) {
      var fig = e.target.closest('.ig-item');
      if (!fig) return;
      var items = $$('.ig-item', grid);
      var list = items.map(function (w) { var i = $('img', w); return { src: i.src, alt: i.alt }; });
      openLb(list, items.indexOf(fig));
    });
  }

  /* ---------- KRUŽNA 3D GALERIJA (pin-scroll rotacija) -- */
  function initCircular() {
    var ring = $('[data-ring]'), stage = $('[data-circular]');
    if (!ring || !stage) return;
    if (reduceMotion) return;                          // fallback mozaik (CSS)
    if (!window.matchMedia('(min-width: 1200px)').matches) return; // samo desktop
    var items = WORKS.slice(0, 12);
    var N = items.length, anglePer = 360 / N, radius = 620;
    var nodes = [];
    items.forEach(function (it, i) {
      var fig = document.createElement('figure');
      fig.className = 'circular-item';
      fig.style.transform = 'rotateY(' + (i * anglePer) + 'deg) translateZ(' + radius + 'px)';
      fig.dataset.index = i;
      var img = document.createElement('img');
      img.src = it.src; img.alt = it.alt; img.loading = 'lazy';
      fig.appendChild(img);
      ring.appendChild(fig);
      nodes.push({ el: fig, img: img, angle: i * anglePer });
    });
    var bar = $('[data-hprogress]');
    var ticking = false;
    function update() {
      ticking = false;
      var total = stage.offsetHeight - window.innerHeight;
      var top = stage.getBoundingClientRect().top;
      var scrolled = Math.min(Math.max(-top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;
      var rotation = progress * 360;
      ring.style.transform = 'rotateY(' + (-rotation) + 'deg)';   // radovi dolaze redom
      if (bar) bar.style.width = (progress * 100).toFixed(1) + '%';
      nodes.forEach(function (n) {
        var rel = (n.angle - rotation) % 360; if (rel < 0) rel += 360;
        var norm = rel > 180 ? 360 - rel : rel;          // 0 = ispred (u fokusu)
        n.el.style.opacity = Math.max(0.18, 1 - norm / 150).toFixed(3);
        n.el.style.zIndex = String(Math.round(1000 - norm));
        var gray = Math.min(1, norm / 50);               // u fokusu → 100% boja
        var bright = (0.6 + 0.4 * (1 - norm / 180)).toFixed(3);
        n.img.style.filter = 'grayscale(' + gray.toFixed(3) + ') brightness(' + bright + ')';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    ring.addEventListener('click', function (e) {
      var fig = e.target.closest('.circular-item');
      if (!fig) return;
      var list = items.map(function (it) { return { src: it.src, alt: it.alt }; });
      openLb(list, parseInt(fig.dataset.index, 10) || 0);
    });
  }

  /* ---------- SCROLL-ASSEMBLE (slova se sklapaju) -------- */
  function initAssemble() {
    var stage = $('[data-assemble]'), textEl = $('[data-assemble-text]');
    if (!stage || !textEl) return;
    var raw = textEl.textContent;
    textEl.textContent = '';
    var chars = raw.split('');
    var center = (chars.length - 1) / 2;
    var spans = [];
    chars.forEach(function (ch, i) {
      var s = document.createElement('span');
      if (ch === ' ') { s.className = 'sp'; s.innerHTML = '&nbsp;'; }
      else s.textContent = ch;
      var d = i - center;
      s._d = d;
      textEl.appendChild(s);
      spans.push(s);
    });
    if (reduceMotion) return;                 // ostaje složeno
    var ticking = false;
    function update() {
      ticking = false;
      var total = stage.offsetHeight - window.innerHeight;
      var top = stage.getBoundingClientRect().top;
      var scrolled = Math.min(Math.max(-top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;
      var inv = 1 - Math.min(1, progress / 0.5);   // složeno do progress 0.5
      spans.forEach(function (s) {
        var x = (s._d * 50 * inv).toFixed(1);
        var rot = (s._d * 50 * inv).toFixed(1);
        s.style.transform = 'translateX(' + x + 'px) rotateX(' + rot + 'deg)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------- COUNT-UP STATISTIKA (od 0) ---------------- */
  function initCount() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var dur = 1400, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 3D TILT (glass kontakt kartica) ----------- */
  function initTilt() {
    var card = $('.auth-card');
    if (!card || reduceMotion) return;
    var frame = null;
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        card.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
      });
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- LENIS SMOOTH SCROLL ----------------------- */
  function initLenis() {
    if (reduceMotion || typeof Lenis === 'undefined') return;
    lenisInst = new Lenis({ duration: 1.05, smoothWheel: true });
    function raf(t) { lenisInst.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // hash linkovi — glatko skrolovanje do sekcije
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.length > 1) {
          var t = document.querySelector(href);
          if (t) { e.preventDefault(); lenisInst.scrollTo(t, { offset: -80 }); }
        }
      });
    });
  }

  /* ---------- INIT --------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    ensureLightbox();
    initNav();
    initClock();
    initGallery();
    initCircular();
    initScroller();
    initReviewsMarquee();
    initIG();
    initArtistPage();
    initAccordion();
    initForm();
    initTilt();
    initAssemble();
    initCount();
    initLenis();
    initReveal(); // poslednji — nakon što je DOM napunjen galerijom
  });
})();
