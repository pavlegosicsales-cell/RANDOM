/* =========================================================
   Cal.eu — zakazivanje konsultacije.

   Svaki umetnik radi svojim danima (Mile pon/cet, Enco uto/pet,
   Anja ned/sre), pa svaki ima svoj tip termina i svoj kalendar.

   - Dugme u kontekstu umetnika (artist strana, kartica)  -> odmah njegov kalendar
   - Globalno "Zakazi konsultaciju" (nav, hero, sekcije)  -> prvo izbor umetnika

   Linkovi po umetniku stoje u ARTISTS[id].calLink (dolaze iz Sanityja),
   pa klijent moze sam da ih promeni bez diranja koda.
   ========================================================= */
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.eu/embed/embed.js", "init");
Cal("init", "konsultacije", { origin: "https://app.cal.eu" });
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns.konsultacije("ui", { "cssVarsPerTheme": { "light": { "cal-brand": "#000000" }, "dark": { "cal-brand": "#ED1C1D" } }, "hideEventTypeDetails": false, "layout": "month_view" });

(function () {
  'use strict';

  var FALLBACK = 'randomtattoo/konsultacije';
  var CFG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}';

  function artists() {
    var a = window.RANDOM_ARTISTS;
    if (!a) return [];
    return Object.keys(a).map(function (id) {
      return { id: id, name: a[id].name, style: a[id].style, link: a[id].calLink || FALLBACK };
    });
  }

  function t(key, fallback) {
    var I = window.RandomI18N;
    if (!I) return fallback;
    try { return I.t(key, I.current()) || fallback; } catch (e) { return fallback; }
  }

  /* Otvara Cal modal za dati link. Cal embed slusa klik na [data-cal-link],
     pa drzimo jedno skriveno dugme i samo mu menjamo link pre klika.
     (Ranije smo ga pravili i odmah brisali — Cal ume da procita atribute tek
     posle klika, pa je uklanjanje bilo trka koju ne moramo da rizikujemo.) */
  var proxy = null;
  function openCal(link) {
    if (!proxy) {
      proxy = document.createElement('button');
      proxy.type = 'button';
      proxy.setAttribute('aria-hidden', 'true');
      proxy.tabIndex = -1;
      proxy.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px';
      proxy.setAttribute('data-cal-namespace', 'konsultacije');
      proxy.setAttribute('data-cal-config', CFG);
      document.body.appendChild(proxy);
    }
    proxy.setAttribute('data-cal-link', link);
    proxy.click();
  }

  /* ---------- Izbor umetnika ---------- */
  var picker = null;

  function buildPicker() {
    var list = artists();
    if (!list.length) return null;

    var wrap = document.createElement('div');
    wrap.className = 'calpick';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', t('cal.pick.title', 'Kod koga zakazuješ?'));
    wrap.hidden = true;

    var card = document.createElement('div');
    card.className = 'calpick__card';

    var head = document.createElement('div');
    head.className = 'calpick__head';
    head.innerHTML =
      '<span class="label calpick__label" data-i18n="cal.pick.label">/ Konsultacija</span>' +
      '<h2 class="calpick__title" data-i18n="cal.pick.title">Kod koga zakazuješ?</h2>' +
      '<p class="calpick__lead" data-i18n="cal.pick.lead">Svako od nas radi svojim danima. Izaberi umetnika pa ti otvaramo njegove slobodne termine.</p>';
    card.appendChild(head);

    var row = document.createElement('div');
    row.className = 'calpick__row';
    list.forEach(function (a) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calpick__artist';
      btn.innerHTML =
        '<span class="calpick__name"></span>' +
        '<span class="calpick__style"></span>';
      btn.querySelector('.calpick__name').textContent = a.name;
      btn.querySelector('.calpick__style').textContent =
        (a.style && (a.style.sr || a.style.en)) || '';
      btn.addEventListener('click', function () {
        close();
        openCal(a.link);
      });
      row.appendChild(btn);
    });
    card.appendChild(row);

    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'calpick__close';
    x.setAttribute('aria-label', t('common.close', 'Zatvori'));
    x.innerHTML = '&times;';
    x.addEventListener('click', close);
    card.appendChild(x);

    wrap.appendChild(card);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.body.appendChild(wrap);
    // i18n je vec odradio prolaz kroz stranu pre nego sto je ovaj prozor postojao
    try { if (window.RandomI18N) window.RandomI18N.apply(window.RandomI18N.current()); } catch (e) {}
    return wrap;
  }

  function open() {
    if (!picker) picker = buildPicker();
    if (!picker) { openCal(FALLBACK); return; }      // bez podataka o umetnicima -> stari tok
    picker.hidden = false;
    document.body.classList.add('calpick-open');
    var first = picker.querySelector('.calpick__artist');
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!picker) return;
    picker.hidden = true;
    document.body.classList.remove('calpick-open');
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  /* ---------- Kacenje na dugmad ---------- */
  function wire() {
    var sel = '[data-i18n="nav.cta"], [data-i18n="consult.cta"]';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      // Dugme koje pripada umetniku (artist strana ili kartica) -> direktno njegov kalendar
      var scope = el.closest('[data-artist-page], [data-artist-id]');
      var id = scope && (scope.getAttribute('data-artist-id') ||
                         (new URLSearchParams(window.location.search)).get('id'));
      var direct = null;
      if (id && window.RANDOM_ARTISTS && window.RANDOM_ARTISTS[id]) {
        direct = window.RANDOM_ARTISTS[id].calLink || FALLBACK;
      }

      el.addEventListener('click', function (e) {
        e.preventDefault();          // href ostaje kao fallback ako JS padne
        if (direct) openCal(direct);
        else open();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
