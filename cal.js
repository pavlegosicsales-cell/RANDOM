/* =========================================================
   Cal.com — popup za zakazivanje konsultacije.
   Zakaci se na SVAKO "Zakazi konsultaciju" dugme na sajtu
   (sva koriste data-i18n="nav.cta" ili data-i18n="consult.cta").
   Klik otvara Cal modal; href ostaje kao fallback ako JS/Cal padne.
   ========================================================= */
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.eu/embed/embed.js", "init");
Cal("init", "konsultacije", { origin: "https://app.cal.eu" });
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns.konsultacije("ui", { "cssVarsPerTheme": { "light": { "cal-brand": "#0E0B0A" }, "dark": { "cal-brand": "#80190E" } }, "hideEventTypeDetails": false, "layout": "month_view" });

/* Zakaci Cal atribute na svu "Zakazi konsultaciju" dugmad. Cal embed koristi
   delegaciju klika (globalni listener trazi [data-cal-link] predak), pa je dovoljno
   postaviti atribute — ne treba nam poseban click handler. */
document.addEventListener('DOMContentLoaded', function () {
  var sel = '[data-i18n="nav.cta"], [data-i18n="consult.cta"]';
  var cfg = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}';
  Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
    el.setAttribute('data-cal-link', 'randomtattoo/konsultacije');
    el.setAttribute('data-cal-namespace', 'konsultacije');
    el.setAttribute('data-cal-config', cfg);
  });
});
