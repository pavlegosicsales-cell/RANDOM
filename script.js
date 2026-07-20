/* =========================================================
   RANDOM TATTOO STUDIO — script.js
   Moduli: data, nav, reveal, gallery, lightbox, accordion, form, artistPage
   Vanilla JS, bez biblioteka.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- PODACI ------------------------------------- */
  // Kategorije: realizam (Lemson), fine-line (Anja), blackwork (Enco)
  var ARTISTS = {
    lemson: {
      name: 'Lemson',
      cat: 'realizam',
      style: { sr: 'REALIZAM · APSTRAKTNE BOJE', en: 'REALISM · ABSTRACT COLOUR' },
      ig: '@mr_lemson',
      igUrl: 'https://instagram.com/mr_lemson',
      portrait: 'assets/artists/lemson.jpg',
      count: 31,
      lead: { sr: 'Lemson radi u dva sveta koja mali broj umetnika može da premosti, hiperprecizna preciznost crno-belog realizma i slobodna, izražajna energija apstraktnih boja.',
              en: 'Lemson works across two worlds few artists can bridge, the razor precision of black and grey realism and the loose, expressive energy of abstract colour.' },
      desc: { sr: 'Bez obzira na stil, svaki komad nosi isti kvalitet: izgleda živo.',
              en: 'Whatever the style, every piece carries the same quality: it looks alive.' }
    },
    anja: {
      name: 'Anja',
      cat: 'fine-line',
      style: { sr: 'FINA LINIJA · LINEWORK', en: 'FINE LINE · LINEWORK' },
      ig: '@alex.anja.tattoo',
      igUrl: 'https://instagram.com/alex.anja.tattoo',
      portrait: 'assets/artists/anja.jpg',
      count: 11,
      lead: { sr: 'Anjin rad je tih i precizan, i upravo zbog toga je toliko moćan. Njene tetovaže fine linije su elegantne, promišljene i napravljene da lepo stare.',
              en: 'Anja\'s work is quiet and precise, and that is exactly why it hits so hard. Her fine line tattoos are elegant, considered and built to age well.' },
      desc: { sr: 'Savršeno za one koji žele nešto rafinirano i duboko lično.',
              en: 'Perfect for anyone who wants something refined and deeply personal.' }
    },
    enco: {
      name: 'Enco',
      cat: 'blackwork',
      style: { sr: 'GRAFITI · URBANI STIL', en: 'GRAFFITI · URBAN STYLE' },
      ig: '@enco_enco.tattoo',
      igUrl: 'https://instagram.com/enco_enco.tattoo',
      portrait: 'assets/artists/enco.jpg',
      count: 34,
      lead: { sr: 'Enco prenosi ulične zidove na tvoju kožu. Ukorenjen u grafiti kulturu, njegov rad je smeo, izražajan i pun karaktera.',
              en: 'Enco brings the street walls onto your skin. Rooted in graffiti culture, his work is bold, expressive and full of character.' },
      desc: { sr: 'Ako želiš nešto što privlači pažnju, Enco je tvoj umetnik.',
              en: 'If you want something that turns heads, Enco is your artist.' }
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
    'enco-9': [1170, 1463], 'enco-10': [1170, 1463], 'enco-11': [1170, 1463],
    'lemson-12': [1440, 1440], 'lemson-13': [1440, 1440], 'lemson-14': [1440, 1918], 'lemson-15': [1440, 1439], 'lemson-16': [1440, 1920], 'lemson-17': [1440, 1920], 'lemson-18': [1440, 1918], 'lemson-19': [1440, 1800], 'lemson-20': [1440, 1800], 'lemson-21': [1440, 1440], 'lemson-22': [1440, 1440], 'lemson-23': [1440, 1920], 'lemson-24': [1440, 1800], 'lemson-25': [1440, 1920], 'lemson-26': [1440, 1800], 'lemson-27': [1440, 1800], 'lemson-28': [1440, 1920], 'lemson-29': [1440, 1799], 'lemson-30': [1440, 1796], 'lemson-31': [1440, 1918],
    'anja-8': [1170, 1560], 'anja-9': [1170, 1560], 'anja-10': [1170, 1560], 'anja-11': [1170, 1416],
    'enco-12': [1170, 1500], 'enco-13': [1170, 1463], 'enco-14': [1170, 1463], 'enco-15': [1170, 1463], 'enco-16': [1170, 1170], 'enco-17': [1170, 1463], 'enco-18': [1170, 1463], 'enco-19': [1170, 1557], 'enco-20': [1170, 1463], 'enco-21': [1170, 1463], 'enco-22': [1170, 1463], 'enco-23': [1170, 1463], 'enco-24': [1170, 1463], 'enco-25': [1170, 1463], 'enco-26': [1170, 1463], 'enco-27': [1080, 1350], 'enco-28': [1170, 1170], 'enco-29': [1170, 1499], 'enco-30': [1170, 1463], 'enco-31': [1170, 1462], 'enco-32': [1170, 1460], 'enco-33': [1170, 1463], 'enco-34': [1170, 1499]
  };

  var CAT_ALT = {
    'realizam': 'Realistična crno-bela tetovaža',
    'fine-line': 'Fine line tetovaža tankih linija',
    'blackwork': 'Blackwork / grafiti tetovaža'
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
        // Jedinstven, opisni alt (stil + umetnik + Beograd + redni broj) — bez izmišljanja motiva
        alt: CAT_ALT[a.cat] + ', ' + a.name + ', Random Tattoo Studio Beograd (br. ' + i + ')'
      });
    }
    return list;
  }
  // Nasumično mešanje (Fisher–Yates) — galerija NE ide redom po umetniku
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var WORKS = shuffle(worksFor('lemson').concat(worksFor('anja'), worksFor('enco')));

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 711px)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var lenisInst = null;
  function lenisStop() { if (lenisInst) lenisInst.stop(); }
  function lenisStart() { if (lenisInst) lenisInst.start(); }

  // Prevod iz i18n rečnika (fallback: srpski)
  function tr(key, fallback) {
    try {
      var l = (window.RandomI18N && window.RandomI18N.current()) || 'sr';
      var v = window.RandomI18N && window.RandomI18N.t(key, l);
      return v != null ? v : fallback;
    } catch (e) { return fallback; }
  }

  /* ---------- NAV (scroll pozadina) ---------------------- */
  function initNav() {
    var nav = $('.nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 80); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- STAGGERED MOBILNI MENI (gsap) -------------- */
  function initStaggeredMenu() {
    var wrap = $('.sm'), toggle = $('.nav__toggle');
    if (!wrap || !toggle) return;
    var panel = $('.sm-panel', wrap);
    var preLayers = $$('.sm-prelayer', wrap);
    var position = wrap.getAttribute('data-position') || 'right';
    var offscreen = position === 'left' ? -100 : 100;
    var isOpen = false, busy = false, openTl = null, closeTween = null;

    if (typeof gsap === 'undefined') {
      // Fallback bez gsap-a: obično otvaranje/zatvaranje
      toggle.addEventListener('click', function () {
        isOpen = !isOpen;
        wrap.classList.toggle('open', isOpen);
        toggle.classList.toggle('is-open', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
        if (isOpen) lenisStop(); else lenisStart();
      });
      return;
    }

    gsap.set([panel].concat(preLayers), { xPercent: offscreen, opacity: 1 });

    function buildOpen() {
      if (openTl) openTl.kill();
      if (closeTween) { closeTween.kill(); closeTween = null; }
      var labels = $$('.sm-label', panel);
      var numItems = $$('.sm-list[data-numbering] .sm-item', panel);
      var socialsTitle = $('.sm-socials-title', panel);
      var socialLinks = $$('.sm-socials-link', panel);
      if (labels.length) gsap.set(labels, { yPercent: 140, rotate: 10 });
      if (numItems.length) gsap.set(numItems, { '--sm-num-opacity': 0 });
      if (socialsTitle) gsap.set(socialsTitle, { opacity: 0 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

      var tl = gsap.timeline({ paused: true });
      preLayers.forEach(function (el, i) {
        tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
      });
      var lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
      var panelInsert = lastTime + (preLayers.length ? 0.08 : 0);
      var panelDur = 0.65;
      tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDur, ease: 'power4.out' }, panelInsert);
      if (labels.length) {
        var itemsStart = panelInsert + panelDur * 0.15;
        tl.to(labels, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart);
        if (numItems.length) tl.to(numItems, { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } }, itemsStart + 0.1);
      }
      var socialsStart = panelInsert + panelDur * 0.4;
      if (socialsTitle) tl.to(socialsTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) tl.to(socialLinks, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { each: 0.08, from: 'start' } }, socialsStart + 0.04);
      openTl = tl;
      return tl;
    }
    function playOpen() {
      if (busy) return; busy = true;
      var tl = buildOpen();
      tl.eventCallback('onComplete', function () { busy = false; });
      tl.play(0);
    }
    function playClose() {
      if (openTl) { openTl.kill(); openTl = null; }
      var all = preLayers.concat([panel]);
      if (closeTween) closeTween.kill();
      closeTween = gsap.to(all, { xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto', onComplete: function () { busy = false; } });
    }
    function toggleMenu() {
      isOpen = !isOpen;
      wrap.classList.toggle('open', isOpen);
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('no-scroll', isOpen);
      if (isOpen) { lenisStop(); playOpen(); } else { lenisStart(); playClose(); }
    }
    toggle.addEventListener('click', toggleMenu);
    $$('.sm-item', panel).forEach(function (a) { a.addEventListener('click', function () { if (isOpen) toggleMenu(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) toggleMenu(); });
  }

  /* ---------- DONJI BLUR (samo tokom skrola) ------------- */
  function initBottomBlur() {
    var blur = $('.bottom-blur');
    if (!blur) return;
    var TOP = 80, BOTTOM = 40, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      var docH = document.documentElement.scrollHeight;
      var atTop = y < TOP;                                   // hero u mirovanju
      var atBottom = y + window.innerHeight >= docH - BOTTOM; // stiglo do footera
      blur.classList.toggle('show', !atTop && !atBottom);
    }
    update();
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
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
    }, { threshold: isMobile ? 0.02 : 0.15, rootMargin: isMobile ? '0px 0px 12% 0px' : '0px 0px -80px 0px' });
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
    img.loading = 'lazy'; img.decoding = 'async';
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

  /* ---------- HYPE GALERIJA (galerija.html) -------------- */
  // Edge-to-edge grid, isti format, kursor-zoom, ime umetnika izranja, "Prikaži još"
  function initHypeGallery() {
    $$('[data-gallery-hype]').forEach(hypeGalleryOn);
  }
  function hypeGalleryOn(grid) {
    var section = grid.closest('section') || document;
    var moreBtn = $('[data-gallery-more]', section);
    var NAMES = { 'realizam': 'Lemson', 'fine-line': 'Anja', 'blackwork': 'Enco' };
    var pool, INIT, STEP = 6;
    if (grid.hasAttribute('data-artist-gallery')) {   // artist stranica → samo radovi tog umetnika
      var params = new URLSearchParams(window.location.search);
      var aid = params.get('id'); if (!ARTISTS[aid]) aid = 'lemson';
      pool = worksFor(aid); INIT = 9;
    } else {
      pool = WORKS.slice(); INIT = 12;
    }
    var shown = 0;

    // reveal na skrol
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' }) : null;

    function makeTile(item) {
      var li = document.createElement('li');
      li.className = 'tile';
      li.setAttribute('data-cat', item.cat);
      var img = document.createElement('img');
      img.src = item.src; img.alt = item.alt;
      img.width = item.w; img.height = item.h;
      img.loading = 'lazy'; img.decoding = 'async';
      img.className = 'img_view_animation';
      if (reduceMotion || !io) { img.classList.add('visible'); }
      else { io.observe(img); img.addEventListener('load', function () { img.classList.add('visible'); }); }
      var name = document.createElement('div');
      name.className = 'master-name-overlay';
      name.textContent = 'Artist \u00b7 ' + (NAMES[item.cat] || 'Random');
      li.appendChild(img);
      li.appendChild(name);
      return li;
    }

    function renderMore(count) {
      pool.slice(shown, shown + count).forEach(function (it) { grid.appendChild(makeTile(it)); });
      shown = Math.min(shown + count, pool.length);
      if (moreBtn) moreBtn.parentNode.style.display = shown >= pool.length ? 'none' : '';
    }

    // kursor-zoom (desktop): zumira tačno gde je miš
    if (!isMobile && !reduceMotion) {
      grid.addEventListener('mousemove', function (e) {
        var img = e.target.closest('.img_view_animation'); if (!img) return;
        var r = img.getBoundingClientRect();
        img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100).toFixed(2) + '% ' + ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%';
      });
      grid.addEventListener('mouseover', function (e) { var img = e.target.closest('.img_view_animation'); if (img) img.style.transform = 'scale(1.3)'; });
      grid.addEventListener('mouseout', function (e) { var img = e.target.closest('.img_view_animation'); if (img) img.style.transform = 'scale(1)'; });
    }

    // klik → lightbox (kroz sve učitane pločice)
    if (lb) {
      grid.addEventListener('click', function (e) {
        var li = e.target.closest('.tile'); if (!li) return;
        var tiles = $$('.tile', grid);
        var list = tiles.map(function (t) { var i = $('img', t); return { src: i.src, alt: i.alt }; });
        openLb(list, tiles.indexOf(li));
      });
    }

    renderMore(INIT);
    if (moreBtn) moreBtn.addEventListener('click', function () { renderMore(STEP); });
  }

  /* ---------- BLOG WHEEL (rotirajući luk, samo desktop) -- */
  function initBlogWheel() {
    var wheel = $('[data-wheel]');
    if (!wheel) return;
    var hub = $('[data-wheel-hub]', wheel);
    var items = $$('.wheel__item', hub);
    if (!items.length) return;
    // Telefon/tablet ili reduce → ostaje grid (CSS), bez luka i draga
    if (window.innerWidth < 1024 || reduceMotion) return;

    // Mali ugao između kartica = blag nagib i tri u kadru. Da petlja ostane
    // beskonačna BEZ praznina, kartice se ponavljaju u krug (6 × 4 = 24 pozicije).
    var degree = 15;
    var slots = Math.round(360 / degree);
    var base = items.slice();
    var repeats = Math.max(1, Math.round(slots / base.length));
    for (var r = 1; r < repeats; r++) {
      base.forEach(function (it) { hub.appendChild(it.cloneNode(true)); });
    }
    items = $$('.wheel__item', hub);
    items.forEach(function (it, i) {
      it.style.transform = 'rotate(' + (i * degree) + 'deg)';   // kartica 0 u vrhu, ostale oko kruga
    });

    // Kartica najbliža vrhu mora da bude iznad susednih (inače joj naslov prekriju)
    function updateZ() {
      var rot = 0;
      try { rot = parseFloat(gsap.getProperty(hub, 'rotation')) || 0; } catch (e) {}
      items.forEach(function (it, i) {
        var a = (i * degree + rot) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        it.style.zIndex = String(Math.round(200 - Math.abs(a)));
      });
    }
    updateZ();

    // Ulet na skrol: kartice izrone i slože se (jednom)
    if (typeof gsap !== 'undefined') {
      var played = false;
      var run = function () {
        if (played) return; played = true;
        gsap.from(items, {
          opacity: 0, scale: 0.6, y: 80, duration: 0.9,
          ease: 'power3.out', stagger: 0.09
        });
      };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) { run(); io.disconnect(); }
        }, { threshold: 0.2 });
        io.observe(wheel);
      } else { run(); }
    }

    // Vučenje: rotacija huba u granicama luka, uz snap na karticu
    if (typeof Draggable !== 'undefined') {
      try { if (gsap && gsap.registerPlugin) gsap.registerPlugin(Draggable); } catch (e) {}
      Draggable.create(hub, {
        type: 'rotation',
        inertia: false,
        snap: function (v) { return Math.round(v / degree) * degree; },  // bez granica → beskonačno vrtenje
        onDrag: updateZ,
        onDragEnd: function () { updateZ(); window.setTimeout(updateZ, 320); }
      });
    }

    // kartice raspoređene → otkrij točak (bez bljeska naslaganih kartica na load)
    hub.classList.add('is-ready');
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
      if (err) err.textContent = ok ? '' : tr('form.required', 'Ovo polje je obavezno.');
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
      btn.textContent = tr('form.sending', 'ŠALJEM…');
      form.setAttribute('data-loading', '1');
      // Bez backend-a: simuliraj slanje, pa zameni formu porukom
      window.setTimeout(function () {
        var msg = document.createElement('p');
        msg.className = 'form__success';
        msg.setAttribute('role', 'status');
        msg.textContent = tr('form.success', 'Javićemo ti se u roku od 24h.');
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
    if (!ARTISTS[id]) id = 'lemson';        // bez ?id= ili nepoznat id → fallback (worksFor koristi isti id)
    var a = ARTISTS[id];

    document.title = a.name + ' — Random Tattoo Studio';
    var set = function (sel, txt) { var el = $(sel); if (el && txt != null) el.textContent = txt; };
    // Polje moze biti string ili { sr, en } — biramo po trenutnom jeziku
    function pick(field, lang) { var f = a[field]; return (f && typeof f === 'object') ? (f[lang] || f.sr) : f; }
    function paint() {
      var lang = (window.RandomI18N && window.RandomI18N.current()) || 'sr';
      set('[data-a-name]', a.name);
      set('[data-a-style]', pick('style', lang));
      set('[data-a-lead]', pick('lead', lang));
      set('[data-a-desc]', pick('desc', lang));
    }
    paint();
    document.addEventListener('langchange', paint);   // prevedi radove kad se promeni jezik

    var ig = $('[data-a-ig]');
    if (ig) { ig.textContent = a.ig; ig.href = a.igUrl; }

    // ---- SEO: meta + JSON-LD po umetniku (TODO: zameniti SITE_URL kad domen bude aktivan) ----
    var SITE = 'https://randomtattoo.rs';
    var url = SITE + '/artist.html?id=' + id;
    var lang0 = (window.RandomI18N && window.RandomI18N.current()) || 'sr';
    var styleTxt = pick('style', lang0);
    var descTxt = pick('lead', lang0);
    var portrait = $('[data-a-portrait]');
    if (portrait) {
      portrait.src = a.portrait;
      portrait.alt = a.name + ', tattoo umetnik, ' + styleTxt + ', Random Tattoo Studio Beograd';
    }
    function meta(attr, key, val) {
      var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
    }
    document.title = a.name + ' — ' + styleTxt + ' | Random Tattoo Studio Beograd';
    meta('name', 'description', a.name + ', ' + styleTxt + '. ' + descTxt);
    meta('property', 'og:title', document.title);
    meta('property', 'og:description', descTxt);
    meta('property', 'og:url', url);
    meta('property', 'og:image', SITE + '/assets/artists/' + id + '.jpg');
    var can = document.head.querySelector('link[rel="canonical"]');
    if (can) can.setAttribute('href', url);
    var KNOWS = { lemson: ['Realizam', 'Black and Grey', 'Apstraktne boje', 'Portreti'], anja: ['Fine Line', 'Linework'], enco: ['Grafiti', 'Urbani stil', 'Blackwork'] };
    var personLd = { '@context': 'https://schema.org', '@type': 'Person', name: a.name, jobTitle: 'Tattoo Artist', worksFor: { '@id': SITE + '/#business' }, knowsAbout: KNOWS[id] || [], image: SITE + '/assets/artists/' + id + '.jpg', sameAs: [a.igUrl], url: url };
    var bcLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Početna', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Umetnici', item: SITE + '/index.html#artisti' },
      { '@type': 'ListItem', position: 3, name: a.name, item: url }
    ] };
    [personLd, bcLd].forEach(function (obj) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(obj); document.head.appendChild(s); });
    // Radove puni hypeGalleryOn (data-gallery-hype data-artist-gallery)
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
      img.src = it.src; img.alt = it.alt; img.loading = 'lazy'; img.decoding = 'async';
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
    makeMarquee($('.review-row'), 36);
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
      img.src = it.src; img.alt = it.alt; img.loading = 'lazy'; img.decoding = 'async';
      fig.appendChild(img);
      ring.appendChild(fig);
      nodes.push({ el: fig, img: img, angle: i * anglePer });
    });
    var bar = $('[data-hprogress]');
    // Dugme + progress liniju premesti na <body> da budu iznad donjeg blura
    var cta = $('.circular-cta'), prog = $('.circular-progress');
    if (cta) { document.body.appendChild(cta); cta.classList.add('circular-cta--fixed'); }
    if (prog) { document.body.appendChild(prog); prog.classList.add('circular-progress--fixed'); }
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
      var pinned = -top > 0 && -top < total;                      // vidljivi samo dok galerija drži ekran
      if (cta) cta.classList.toggle('show', pinned);
      if (prog) prog.classList.toggle('show', pinned);
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
  // Radi na svim [data-assemble] stage-ovima; svaki može imati više
  // [data-assemble-text] linija (svaka se sklapa oko svog centra).
  function initAssemble() {
    var stages = $$('[data-assemble]');
    if (!stages.length) return;
    stages.forEach(function (stage) {
      var texts = $$('[data-assemble-text]', stage);
      if (!texts.length) return;
      var lines = texts.map(function (textEl) {
        var raw = textEl.textContent;
        textEl.textContent = '';
        var chars = raw.split('');
        var center = (chars.length - 1) / 2;
        var spans = [];
        chars.forEach(function (ch, i) {
          var s = document.createElement('span');
          if (ch === ' ') { s.className = 'sp'; s.innerHTML = '&nbsp;'; }
          else s.textContent = ch;
          s._d = i - center;
          textEl.appendChild(s);
          spans.push(s);
        });
        return spans;
      });
      if (reduceMotion) return;                 // ostaje složeno
      // Naslovi (manji) = nežno slaganje bez preokretanja; veliki statement = jače
      var soft = stage.classList.contains('assemble-head');
      // Na telefonu naslov skoro puni širinu → bez horizontalnog razmicanja (inače curi van ekrana)
      var AMT = soft ? (isMobile ? 0 : 14) : 50;   // horizontalni razmak po slovu
      var ROT = soft ? 6 : 50;                     // rotacija po slovu
      var ticking = false;
      function update() {
        ticking = false;
        var rect = stage.getBoundingClientRect();
        var vh = window.innerHeight;
        // 0 = tek ulazi odozdo, 0.5 = centriran, 1 = izlazi na vrh
        var progress = ((isMobile ? vh * 1.12 : vh) - rect.top) / (vh + rect.height);
        progress = Math.max(0, Math.min(1, progress));
        var inv = 1 - Math.min(1, progress / 0.5);   // složeno kad dođe do centra, pa ostaje
        lines.forEach(function (spans) {
          spans.forEach(function (s) {
            var x = (s._d * AMT * inv).toFixed(1);
            var rot = (s._d * ROT * inv).toFixed(1);
            s.style.transform = 'translateX(' + x + 'px) rotateX(' + rot + 'deg)';
          });
        });
      }
      function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    });
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

  /* ---------- KRUŽNI ROTIRAJUĆI TEKST -------------------- */
  function initCircularText() {
    var el = $('[data-circular-text]');
    if (!el) return;
    var letters = Array.prototype.slice.call(el.getAttribute('data-circular-text'));
    var N = letters.length;
    letters.forEach(function (ch, i) {
      var s = document.createElement('span');
      s.textContent = ch;
      var deg = (360 / N) * i;
      var f = Math.PI / N, off = (f * i).toFixed(2);
      var t = 'rotateZ(' + deg.toFixed(2) + 'deg) translate3d(' + off + 'px,' + off + 'px,0)';
      s.style.transform = t; s.style.webkitTransform = t;
      el.appendChild(s);
    });

    // Rotacija vođena iz JS-a — menjanje CSS animation-duration na :hover
    // pravi skok (browser preračuna poziciju), pa umesto toga ovde
    // glatko lerp-ujemo brzinu ka cilju: nikad ne preskače.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    var angle = 0;
    var baseSpeed = 360 / 22;   // deg/s (isto kao stara 22s animacija)
    var hoverSpeed = 360 / 6;   // deg/s (isto kao stari 6s hover)
    var speed = baseSpeed;
    var target = baseSpeed;
    var hot = el.parentNode || el; // ceo badge = veća hover zona
    hot.addEventListener('mouseenter', function () { target = hoverSpeed; });
    hot.addEventListener('mouseleave', function () { target = baseSpeed; });

    var last = null;
    function frame(now) {
      if (last === null) last = now;
      var dt = (now - last) / 1000;
      last = now;
      speed += (target - speed) * Math.min(1, dt * 6); // glatko ubrzanje/usporenje
      angle = (angle + speed * dt) % 360;
      var t = 'rotate(' + angle.toFixed(3) + 'deg)';
      el.style.transform = t; el.style.webkitTransform = t;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- SCROLL REVEAL (reči izranjaju na skrol) --- */
  function initScrollReveal() {
    var els = $$('.about__body p, .artist-row__desc, .step__desc, .step__list li, .section-head .lead, .reviews__intro .lead');
    if (!els.length) return;
    var items = [];
    els.forEach(function (el) {
      var parts = el.textContent.split(/(\s+)/);
      el.textContent = '';
      var words = [];
      parts.forEach(function (w) {
        if (w.trim() === '') { el.appendChild(document.createTextNode(w)); return; }
        var s = document.createElement('span'); s.className = 'reveal-word'; s.textContent = w;
        el.appendChild(s); words.push(s);
      });
      items.push({ el: el, words: words });
    });
    var baseOpacity = 0.1, blurStrength = 8, baseRotation = 4, spread = 0.55;
    if (reduceMotion) {
      items.forEach(function (it) { it.el.style.transform = 'none'; it.words.forEach(function (w) { w.style.opacity = '1'; w.style.filter = 'none'; }); });
      return;
    }
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        // napredak zavisi od visine elementa: dugački (O studiju) ostaju isti,
        // kratki (bullet/lead) se završe ranije, na sredini ekrana
        var p = ((isMobile ? vh * 1.12 : vh) - r.top) / ((isMobile ? vh * 0.5 : vh * 0.62) + r.height); p = Math.max(0, Math.min(1, p));
        it.el.style.transform = 'rotate(' + (baseRotation * (1 - p)).toFixed(2) + 'deg)';
        var N = it.words.length;
        it.words.forEach(function (w, i) {
          var wp = (p - (i / N) * spread) / (1 - spread); wp = Math.max(0, Math.min(1, wp));
          w.style.opacity = (baseOpacity + (1 - baseOpacity) * wp).toFixed(3);
          w.style.filter = 'blur(' + (blurStrength * (1 - wp)).toFixed(2) + 'px)';
        });
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------- BLUR APPEAR (hero) ------------------------ */
  function initBlurReveal() {
    var els = $$('[data-blur]');
    if (!els.length) return;
    var gi = 0, all = [];
    els.forEach(function (el) {
      var targets = el.children.length ? Array.prototype.slice.call(el.children) : [el];
      targets.forEach(function (t) {
        var parts = t.textContent.split(/(\s+)/);
        t.textContent = '';
        parts.forEach(function (w) {
          if (w.trim() === '') { t.appendChild(document.createTextNode(w)); return; }
          var s = document.createElement('span');
          s.className = 'blur-word';
          s.textContent = w;
          s.style.setProperty('--bw', (10 + Math.floor(Math.random() * 8)) + 'px');
          s.style.setProperty('--sc', (0.9 + Math.sin(gi * 0.2) * 0.05).toFixed(3));
          s.style.setProperty('--bd', (2.0 + Math.cos(gi * 0.3) * 0.3).toFixed(2) + 's');
          s.style.setProperty('--dl', (gi * 0.09).toFixed(2) + 's');
          t.appendChild(s);
          all.push(s); gi++;
        });
      });
    });
    if (reduceMotion) { all.forEach(function (s) { s.classList.add('in'); }); return; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { all.forEach(function (s) { s.classList.add('in'); }); });
    });
  }

  /* ---------- INK / GOO KURSOR -------------------------- */
  function initInkCursor() {
    var cursor = document.getElementById('ink-cursor');
    if (!cursor || reduceMotion) return;
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;
    var amount = 20, width = 26, sineDots = Math.floor(amount * 0.3), idleTimeout = 150;
    var mouse = { x: window.innerWidth / 2 - width / 2, y: window.innerHeight / 2 - width / 2 };
    var dots = [], idle = false, timeoutID;
    for (var i = 0; i < amount; i++) {
      var scale = 1 - 0.05 * i;
      var el = document.createElement('span');
      cursor.appendChild(el);
      dots.push({ index: i, x: mouse.x, y: mouse.y, el: el, scale: scale, range: width / 2 - width / 2 * scale + 2, angleX: 0, angleY: 0, anglespeed: 0.05, lockX: 0, lockY: 0 });
    }
    function lock(d) { d.lockX = d.x; d.lockY = d.y; d.angleX = Math.PI * 2 * Math.random(); d.angleY = Math.PI * 2 * Math.random(); }
    function goInactive() { idle = true; dots.forEach(lock); }
    function resetIdle() { clearTimeout(timeoutID); idle = false; timeoutID = setTimeout(goInactive, idleTimeout); }
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX - width / 2; mouse.y = e.clientY - width / 2; resetIdle(); });
    function draw(d) {
      if (!idle || d.index <= sineDots) {
        d.el.style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) scale(' + d.scale + ')';
      } else {
        d.angleX += d.anglespeed; d.angleY += d.anglespeed;
        d.x = d.lockX + Math.sin(d.angleX) * d.range;
        d.y = d.lockY + Math.sin(d.angleY) * d.range;
        d.el.style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) scale(' + d.scale + ')';
      }
    }
    function render() {
      var x = mouse.x, y = mouse.y;
      dots.forEach(function (d, i) {
        var next = dots[i + 1] || dots[0];
        d.x = x; d.y = y; draw(d);
        if (!idle || i <= sineDots) { x += (next.x - d.x) * 0.35; y += (next.y - d.y) * 0.35; }
      });
      requestAnimationFrame(render);
    }
    resetIdle();
    render();
  }

  /* ---------- FRAME DUGMAD + scramble (otkucavanje) ----- */
  function initButtons() {
    var CORNERS = [['tl', 'M8 16v-8h8'], ['tr', 'M16 16v-8h-8'], ['br', 'M16 8v8h-8'], ['bl', 'M8 8v8h8']];
    function cornerSVG(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; }
    var SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $$('.btn').forEach(function (btn) {
      if (btn.hasAttribute('data-fb')) return;
      btn.setAttribute('data-fb', '1');
      var isSubmit = btn.classList.contains('auth-card__submit');
      var text = btn.textContent.replace(/[→←↑↓]/g, '').trim();
      btn.textContent = '';
      var label = document.createElement('span');
      label.className = 'btn__label';
      label.textContent = text;
      btn.appendChild(label);
      // strelica (sekundarno) — osim galerija hero dugmeta (bez strelice, sa scramble-om)
      if (btn.classList.contains('btn-secondary') && !btn.classList.contains('gallery-hero__cta')) {
        var arrow = document.createElement('span');
        arrow.className = 'btn__arrow'; arrow.setAttribute('aria-hidden', 'true');
        arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        btn.appendChild(arrow);
      }
      // ugaoni markeri (ne na submit — ima overflow hidden zbog shimmer-a)
      if (!isSubmit) {
        CORNERS.forEach(function (c) {
          var s = document.createElement('span');
          s.className = 'btn__corner btn__corner--' + c[0];
          s.setAttribute('aria-hidden', 'true');
          s.innerHTML = cornerSVG(c[1]);
          btn.appendChild(s);
        });
      }
      // scramble na hover — primarno/light dugme
      if (!reduceMotion && (btn.classList.contains('btn-primary') || btn.classList.contains('btn-light') || btn.classList.contains('gallery-more') || btn.classList.contains('gallery-hero__cta')) && !isSubmit) {
        btn.addEventListener('mouseenter', function () {
          var original = label.textContent;   // citaj trenutni tekst (jezik moze biti promenjen)
          if (!label.style.minWidth) label.style.minWidth = label.offsetWidth + 'px';
          var frame = 0;
          clearInterval(label._t);
          label._t = setInterval(function () {
            var out = '';
            for (var i = 0; i < original.length; i++) {
              var ch = original[i];
              out += (ch === ' ') ? ' ' : (i <= frame ? original[i] : SC[Math.floor(Math.random() * 26)]);
            }
            label.textContent = out;
            frame += 0.5;
            if (frame >= original.length) { label.textContent = original; clearInterval(label._t); }
          }, 35);
        });
      }
    });
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
    if (reduceMotion || isMobile || typeof Lenis === 'undefined') return;   // telefon → native skrol
    lenisInst = new Lenis({ duration: 1.05, smoothWheel: true });
    function raf(t) { lenisInst.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // hash linkovi — glatko skrolovanje do sekcije
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.hasAttribute('data-cal-link')) return;   // Cal dugme — otvara popup, ne skroluj nikuda
        var href = a.getAttribute('href');
        if (href.length > 1) {
          var t = document.querySelector(href);
          if (t) { e.preventDefault(); lenisInst.scrollTo(t, { offset: -80 }); }
        }
      });
    });
  }

  /* ---------- PROCES SHADER POZADINA -------------------- */
  // Suptilna plazma (WebGL). Bez ljubičaste: near-black bg + toplo siva linija.
  function initProcShader() {
    var canvas = $('[data-proces-shader]');
    if (!canvas || reduceMotion) return;
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;                                      // no WebGL → crna traka

    var vs = 'attribute vec4 aVertexPosition;void main(){gl_Position=aVertexPosition;}';
    var fs = [
      'precision highp float;',
      'uniform vec2 iResolution; uniform float iTime;',
      'const float overallSpeed=0.2;',
      'const float gridSmoothWidth=0.015;',
      'const float scale=5.0;',
      // toplo-siva linija umesto ljubičaste
      'const vec4 lineColor=vec4(0.42,0.38,0.35,1.0);',
      'const float minLineWidth=0.006; const float maxLineWidth=0.08;',
      'const float lineSpeed=1.0*overallSpeed; const float lineAmplitude=1.0; const float lineFrequency=0.2;',
      'const float warpSpeed=0.2*overallSpeed; const float warpFrequency=0.5; const float warpAmplitude=1.0;',
      'const float offsetFrequency=0.5; const float offsetSpeed=1.33*overallSpeed;',
      'const float minOffsetSpread=0.6; const float maxOffsetSpread=2.0;',
      'const int linesPerGroup=9;',
      '#define drawCircle(pos,radius,coord) smoothstep(radius+gridSmoothWidth,radius,length(coord-(pos)))',
      '#define drawSmoothLine(pos,halfWidth,t) smoothstep(halfWidth,0.0,abs(pos-(t)))',
      '#define drawCrispLine(pos,halfWidth,t) smoothstep(halfWidth+gridSmoothWidth,halfWidth,abs(pos-(t)))',
      'float random(float t){return (cos(t)+cos(t*1.3+1.3)+cos(t*1.4+1.4))/3.0;}',
      'float getPlasmaY(float x,float horizontalFade,float offset){return random(x*lineFrequency+iTime*lineSpeed)*horizontalFade*lineAmplitude+offset;}',
      'void main(){',
      '  vec2 fragCoord=gl_FragCoord.xy; vec4 fragColor;',
      '  vec2 uv=fragCoord.xy/iResolution.xy;',
      '  vec2 space=(fragCoord-iResolution.xy/2.0)/iResolution.x*2.0*scale;',
      '  float horizontalFade=1.0-(cos(uv.x*6.28)*0.5+0.5);',
      '  float verticalFade=1.0-(cos(uv.y*6.28)*0.5+0.5);',
      '  space.y+=random(space.x*warpFrequency+iTime*warpSpeed)*warpAmplitude*(0.5+horizontalFade);',
      '  space.x+=random(space.y*warpFrequency+iTime*warpSpeed+2.0)*warpAmplitude*horizontalFade;',
      '  vec4 lines=vec4(0.0);',
      // čista crna pozadina — da se canvas stopi sa #000 trakom (bez pomeranja boje na scroll)
      '  vec4 bgColor1=vec4(0.0,0.0,0.0,1.0);',
      '  vec4 bgColor2=vec4(0.0,0.0,0.0,1.0);',
      '  for(int l=0;l<linesPerGroup;l++){',
      '    float normalizedLineIndex=float(l)/float(linesPerGroup);',
      '    float offsetTime=iTime*offsetSpeed;',
      '    float offsetPosition=float(l)+space.x*offsetFrequency;',
      '    float rand=random(offsetPosition+offsetTime)*0.5+0.5;',
      '    float halfWidth=mix(minLineWidth,maxLineWidth,rand*horizontalFade)/2.0;',
      '    float offset=random(offsetPosition+offsetTime*(1.0+normalizedLineIndex))*mix(minOffsetSpread,maxOffsetSpread,horizontalFade);',
      '    float linePosition=getPlasmaY(space.x,horizontalFade,offset);',
      '    float line=drawSmoothLine(linePosition,halfWidth,space.y)/2.0+drawCrispLine(linePosition,halfWidth*0.15,space.y);',
      '    float circleX=mod(float(l)+iTime*lineSpeed,25.0)-12.0;',
      '    vec2 circlePosition=vec2(circleX,getPlasmaY(circleX,horizontalFade,offset));',
      '    float circle=drawCircle(circlePosition,0.01,space)*4.0;',
      '    line=line+circle;',
      '    lines+=line*lineColor*rand;',
      '  }',
      '  fragColor=mix(bgColor1,bgColor2,uv.x);',
      '  fragColor*=verticalFade;',
      '  fragColor.a=1.0;',
      '  fragColor+=lines;',
      '  gl_FragColor=fragColor;',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vsh = compile(gl.VERTEX_SHADER, vs), fsh = compile(gl.FRAGMENT_SHADER, fs);
    if (!vsh || !fsh) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh); gl.attachShader(prog, fsh); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aVertexPosition');
    var uRes = gl.getUniformLocation(prog, 'iResolution');
    var uTime = gl.getUniformLocation(prog, 'iTime');

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = canvas.clientWidth || canvas.offsetWidth || 1;
      var h = canvas.clientHeight || canvas.offsetHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }
    var start = performance.now();
    function frame() {
      if (visible) {
        var t = (performance.now() - start) / 1000;
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- ARTISTI SMOKE POZADINA (WebGL2) ----------- */
  // Suptilan animirani dim, tintovan u našu Ember boju. Diskretno (opacity + maska).
  function initArtistiShader() {
    if (reduceMotion) return;
    $$('[data-artisti-shader]').forEach(artistiShaderOn);
  }
  function artistiShaderOn(canvas) {
    if (isMobile && !canvas.hasAttribute('data-mobile')) return;   // difolt: skip telefon; data-mobile → radi i na telefonu
    var gl = canvas.getContext('webgl2');
    if (!gl) return;                                      // treba WebGL2 → fallback soot

    var vs = '#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}';
    var fs = [
      '#version 300 es',
      'precision highp float;',
      'out vec4 O;',
      'uniform float time; uniform vec2 resolution; uniform vec3 u_color;',
      '#define FC gl_FragCoord.xy',
      '#define R resolution',
      '#define T (time+660.)',
      'float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}',
      'float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}',
      'void main(){',
      '  vec2 uv=(FC-.5*R)/R.y;',
      '  vec3 col=vec3(1);',
      '  uv.x+=.25;',
      '  uv*=vec2(2,1);',
      '  float n=fbm(uv*.28-vec2(T*.01,0));',
      '  n=noise(uv*3.+n*2.);',
      '  col.r-=fbm(uv+vec2(0,T*.015)+n);',
      '  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);',
      '  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);',
      '  col=mix(col,u_color,dot(col,vec3(.21,.71,.07)));',
      '  col=clamp(col,0.0,1.);',                       // puna snaga odmah (bez fade-a)
      '  O=vec4(col,1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vsh = compile(gl.VERTEX_SHADER, vs), fsh = compile(gl.FRAGMENT_SHADER, fs);
    if (!vsh || !fsh) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh); gl.attachShader(prog, fsh); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1, -1,-1, 1,1, 1,-1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'position');
    var uRes = gl.getUniformLocation(prog, 'resolution');
    var uTime = gl.getUniformLocation(prog, 'time');
    var uColor = gl.getUniformLocation(prog, 'u_color');
    var color = [0.75, 0.22, 0.17];   // default Ember (--ember #C0392B)
    if (canvas.dataset.color) { var cc = canvas.dataset.color.split(',').map(Number); if (cc.length === 3 && cc.every(function (n) { return !isNaN(n); })) color = cc; }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var visible = false, started = false, start = performance.now();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !started) { started = true; start = performance.now(); }  // fade kreće kad sekcija uđe
      }, { threshold: 0 }).observe(canvas);
    } else { visible = true; }
    function frame() {
      if (visible) {
        var t = (performance.now() - start) / 1000 * 1.6;   // malo brže kretanje
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.uniform3fv(uColor, color);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- RECENZIJE ETHEREAL SHADOW ----------------- */
  // Uvijanje mekog bloba: rotiramo hue turbulencije koja hrani displacement.
  function initReviewsShadow() {
    var hue = $('[data-ethereal-hue]');
    if (!hue || reduceMotion || isMobile) return;        // reduce/telefon → statična pozadina (perf)
    var bg = $('.reviews-bg');
    var visible = true;
    if (bg && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(bg);
    }
    var start = performance.now(), LOOP = 12000, last = 0, FT = 1000 / 30;  // ~30fps, spor loop
    function frame(now) {
      if (visible && now - last >= FT) {
        last = now;
        var v = ((now - start) % LOOP) / LOOP * 360;
        hue.setAttribute('values', v.toFixed(1));
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- SCROLL SATURACIJA (telefon) --------------- */
  // Bez hovera na telefonu — slike dobijaju boju kad dođu u sredinu ekrana.
  function initScrollSaturation() {
    if (reduceMotion || !isMobile) return;
    var imgs = $$('[data-gallery] img, .artist-row__media img, .reviews__media img, .scroller__item img, .artist-portrait img');
    if (!imgs.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight, center = vh / 2;
      imgs.forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;         // van ekrana
        var imgCenter = r.top + r.height / 2;
        var d = Math.abs(imgCenter - center) / (vh * 0.62);    // 0 u centru, 1 na ivici
        var g = Math.max(0, Math.min(1, d));
        img.style.filter = 'grayscale(' + g.toFixed(3) + ') brightness(' + (0.9 + 0.1 * (1 - g)).toFixed(3) + ')';
      });
    }
    var lastT = 0;
    function onScroll() {
      var now = performance.now();
      if (now - lastT < 120) return;                     // throttle ~8fps (CSS tranzicija izgladi)
      lastT = now;
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------- LOKACIJA (expand mapa) -------------------- */
  /* ---------- DARKVEIL POZADINA (kontakt, brend boje) ----
     Vanilla WebGL adaptacija React Bits DarkVeil (ogl). CPPN plazma shader,
     rekolorisan u soot→ember. Pola rezolucije, pauza van ekrana, samo desktop. */
  function initDarkVeil() {
    if (reduceMotion || isMobile) return;
    $$('[data-darkveil]').forEach(darkVeilOn);
  }
  function darkVeilOn(canvas) {
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) return;

    var vs = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
    var fs = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH',
      'precision highp float;',
      '#else',
      'precision mediump float;',
      '#endif',
      'uniform vec2 uResolution;uniform float uTime;uniform float uWarp;',
      'vec4 buf[8];',
      'mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);',
      'mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);',
      'vec4 sigmoid(vec4 x){return 1./(1.+exp(-x));}',
      'vec4 cppn_fn(vec2 coordinate,float in0,float in1,float in2){',
      'buf[6]=vec4(coordinate.x,coordinate.y,0.3948333106474662+in0,0.36+in1);',
      'buf[7]=vec4(0.14+in2,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);',
      'buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.21808943,1.1243913,-1.7969975,5.0294676);',
      'buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);',
      'buf[0]=sigmoid(buf[0]);buf[1]=sigmoid(buf[1]);',
      'buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);',
      'buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);',
      'buf[2]=sigmoid(buf[2]);buf[3]=sigmoid(buf[3]);',
      'buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);',
      'buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);',
      'buf[4]=sigmoid(buf[4]);buf[5]=sigmoid(buf[5]);',
      'buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);',
      'buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);',
      'buf[6]=sigmoid(buf[6]);buf[7]=sigmoid(buf[7]);',
      'buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);',
      'buf[0]=sigmoid(buf[0]);',
      'return vec4(buf[0].x,buf[0].y,buf[0].z,1.);',
      '}',
      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/uResolution.xy*2.-1.;',
      '  uv.x*=uResolution.x/uResolution.y; uv.y*=-1.;',
      '  uv+=uWarp*vec2(sin(uv.y*6.283+uTime*0.5),cos(uv.x*6.283+uTime*0.5))*0.05;',
      '  vec4 c=cppn_fn(uv,0.1*sin(0.3*uTime),0.1*sin(0.69*uTime),0.1*sin(0.44*uTime));',
      // --- BREND REKOLOR: struktura plazme -> soot→ember (bez ljubičaste) ---
      '  float l=dot(c.rgb,vec3(0.299,0.587,0.114));',
      '  l=smoothstep(0.12,0.86,clamp(l,0.0,1.0));',   // razvuci kontrast — plazma jasno vidljiva',
      '  vec3 base=vec3(0.10,0.055,0.05);',            // tamno toplo (skoro soot)',
      '  vec3 ember=vec3(0.82,0.26,0.19);',            // brend crvena',
      '  vec3 emberHot=vec3(1.0,0.55,0.36);',          // uzareni vrh tokova',
      '  vec3 col=mix(base,ember,l);',
      '  col=mix(col,emberHot,smoothstep(0.72,1.0,l));',
      '  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var v = compile(gl.VERTEX_SHADER, vs), f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'uResolution');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uWarp = gl.getUniformLocation(prog, 'uWarp');
    var SCALE = 0.5, SPEED = 0.4;

    function resize() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * SCALE));
      canvas.height = Math.max(1, Math.floor(h * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var visible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    } else { visible = true; }

    var start = performance.now();
    function frame() {
      if (visible) {
        gl.uniform1f(uTime, (performance.now() - start) / 1000 * SPEED);
        gl.uniform1f(uWarp, 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- AURALIS (artist hero pozadina) ------------- */
  // WebGL1 snoise ambijent, rekolorisan u brend ember; radi i na telefonu (lagan)
  function initAura() {
    if (reduceMotion) return;
    $$('[data-aura]').forEach(auraOn);
  }
  function auraOn(canvas) {
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) return;
    var vs = 'attribute vec2 position;varying vec2 vUv;void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}';
    var fs = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH',
      'precision highp float;',
      '#else',
      'precision mediump float;',
      '#endif',
      'varying vec2 vUv;',
      'uniform vec2 u_res; uniform float u_time;',
      'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}',
      'float snoise(vec2 v){',
      '  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
      '  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);',
      '  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);',
      '  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);',
      '  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
      '  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;',
      '  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;',
      '  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);',
      '  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;',
      '  return 130.0*dot(m,g);',
      '}',
      'void main(){',
      '  vec2 uv=vUv; float ratio=u_res.x/u_res.y; vec2 p=uv*vec2(ratio,1.0); float t=u_time*0.2;',
      '  float n1=snoise(p*0.5+t); float n2=snoise(p*0.9-t*0.5+n1);',
      '  float light=pow(abs(n2),2.5)*0.5;',
      '  vec3 col=vec3(0.05,0.028,0.024);',              // topla soot baza',
      '  vec3 c0=vec3(0.75,0.22,0.17);',                 // brend ember',
      '  vec3 c1=vec3(0.95,0.42,0.24);',                 // uzareni vrh',
      '  col+=c0*smoothstep(0.1,1.0,n1)*0.55;',
      '  col+=c1*light;',
      '  float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453+u_time);',
      '  col+=(grain-0.5)*0.05;',
      '  float dist=length(uv-0.5); col*=smoothstep(1.25,0.15,dist);',
      '  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);',
      '}'
    ].join('\n');
    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var v = compile(gl.VERTEX_SHADER, vs), f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prog, 'u_res');
    var uTime = gl.getUniformLocation(prog, 'u_time');
    var SCALE = isMobile ? 0.4 : 0.6, SPEED = 0.3;
    function resize() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * SCALE));
      canvas.height = Math.max(1, Math.floor(h * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    var visible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    } else { visible = true; }
    var start = performance.now();
    function frame() {
      if (visible) {
        gl.uniform1f(uTime, (performance.now() - start) / 1000 * SPEED);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  function initLocationMap() {
    var el = $('[data-lmap]');
    if (!el) return;
    var card = $('.lmap__card', el);
    function toggle() {
      var open = el.classList.toggle('is-open');
      el.setAttribute('aria-expanded', String(open));
    }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    // 3D tilt — samo desktop (bez hovera na telefonu)
    if (reduceMotion || isMobile || !card) return;
    var frame = null;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        card.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 12).toFixed(2) + 'deg');
      });
    });
    el.addEventListener('mouseleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- INIT --------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    ensureLightbox();
    initNav();
    initStaggeredMenu();
    initGallery();
    initHypeGallery();
    initBlogWheel();
    initCircular();
    initScroller();
    initReviewsMarquee();
    initArtistPage();
    initAccordion();
    initForm();
    initButtons();
    initBlurReveal();
    initInkCursor();
    initTilt();
    initLocationMap();
    initDarkVeil();
    initAura();
    initAssemble();
    initScrollReveal();
    initCircularText();
    initCount();
    initBottomBlur();
    initScrollSaturation();
    initProcShader();
    initArtistiShader();
    initReviewsShadow();
    initLenis();
    initReveal(); // poslednji — nakon što je DOM napunjen galerijom
  });
})();
