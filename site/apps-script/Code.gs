/**
 * Random Tattoo Studio — prijem upita sa sajta
 * --------------------------------------------
 * Upisuje svaki upit u Google tabelu i salje jedan mejl sa obavestenjem.
 *
 * Sajt salje GET sa parametrima u adresi. Apps Script svaki POST preusmerava
 * i pretvara u GET, cime se gubi e.postData, pa je GET jedini pouzdan put.
 * doPost je svejedno ostavljen, za slucaj da se front promeni.
 */

/* ================= PODESAVANJA ================= */

// Tvoj mejl dok se testira. Klijentov ide tek posle provere, uz nov deploy.
var NOTIFY_TO   = 'pavlegosic9@gmail.com';
var SENDER_NAME = 'Random Tattoo Studio, sajt';
var BRAND       = 'Random Tattoo Studio';
// Tabela sa upitima, vezuje se na dnu mejla. Prazno = link se ne prikazuje.
var SHEET_URL   = '';
// Prazno kad je skripta vezana za tabelu. Popuni ako je samostalna.
var SHEET_ID    = '';

// Linkovi za zakazivanje po umetniku (isti kao na sajtu, polje calLink).
var CAL = {
  lemson: 'https://cal.eu/randomtattoo/konsultacije',
  anja:   'https://cal.eu/randomtattoo/konsultacije-anja',
  enco:   'https://cal.eu/randomtattoo/konsultacije-enco'
};

/* ================= PALETA =================
   Svetla, po kucnom standardu. Crvena je samo akcenat: linija na vrhu,
   nadnaslov i glavno dugme. Vrednosti su iz styles.css sajta. */

var C = {
  page:      '#F4F4F2',
  card:      '#FFFFFF',
  panel:     '#F7F7F5',
  line:      '#E6E5E1',
  brand:     '#ED1C1D', // --ember
  brandDark: '#C8201F', // --ember-cta, dovoljno tamna za beo tekst
  ink:       '#14161A',
  body:      '#3C4046',
  muted:     '#7A7F87',
  onBrand:   '#FFFFFF'
};

var RADIUS = '16px';
var RPILL  = '8px';
var SANS   = 'Helvetica,Arial,sans-serif';

/* ================= ULAZ ================= */

function doGet(e) {
  var d = readParams_(e);
  if (!d.ime && !d.email && !d.ideja) {
    return json_({ ok: true, service: BRAND + ' prijem upita' });
  }
  return handle_(d);
}

function doPost(e) {
  var d = readParams_(e);
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var k in body) if (body[k]) d[k] = body[k];
    } catch (err) { /* nije JSON, parametri su vec procitani */ }
  }
  return handle_(d);
}

function handle_(d) {
  var sheetErr = '';
  // Namerno odvojeno: pad upisa u tabelu ne sme da kosta upit.
  try { saveRow_(d); } catch (err) { sheetErr = String(err); }
  try {
    sendEmail_(d);
  } catch (err) {
    return json_({ ok: false, error: String(err), sheetError: sheetErr });
  }
  return json_({ ok: true, sheetError: sheetErr });
}

function readParams_(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  return {
    ime:       p.ime       || '',
    email:     p.email     || '',
    ideja:     p.ideja     || '',
    reference: p.reference || '',
    tip:       p.tip       || '',
    umetnik:   p.umetnik   || '',
    velicina:  p.velicina  || '',
    rok:       p.rok       || '',
    strana:    p.strana    || ''
  };
}

/* ================= TABELA ================= */

function saveRow_(d) {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Nema tabele: veži skriptu za tabelu ili popuni SHEET_ID.');
  var sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Stiglo', 'Ime', 'Email', 'Šta', 'Kod koga', 'Veličina', 'Kada', 'Ideja', 'Reference', 'Strana']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    d.ime || '', d.email || '',
    labelTip_(d.tip), labelUmetnik_(d.umetnik), labelVelicina_(d.velicina), labelRok_(d.rok),
    d.ideja || '', d.reference || '', d.strana || ''
  ]);
}

/* ================= PREVOD ODGOVORA ================= */
/* Sajt salje kratke oznake; u mejlu i tabeli stoji ljudski tekst. */

function labelTip_(v) {
  return ({ 'nova': 'Nova tetovaža', 'dorada': 'Dorada postojeće',
            'prekrivanje': 'Prekrivanje stare', 'ne-znam': 'Još ne zna' })[v] || v || '';
}
function labelUmetnik_(v) {
  return ({ 'lemson': 'Lemson', 'anja': 'Anja', 'enco': 'Enco',
            'svejedno': 'Svejedno kod koga' })[v] || v || '';
}
function labelVelicina_(v) {
  return ({ 'sitno': 'Sitno, do dlana', 'srednje': 'Srednje, podlaktica ili list',
            'veliko': 'Veliki projekat, rukav ili leđa', 'ne-znam': 'Ne zna još' })[v] || v || '';
}
function labelRok_(v) {
  return ({ 'odmah': 'Što pre', 'mesec': 'U narednih mesec dana',
            'raspitujem': 'Samo se raspituje' })[v] || v || '';
}

/* ================= MEJL ================= */

function sendEmail_(d) {
  MailApp.sendEmail(NOTIFY_TO, buildSubject_(d), buildPlain_(d), {
    name: SENDER_NAME,
    htmlBody: buildHtml_(d),
    replyTo: d.email || undefined   // odgovor ide pravo coveku
  });
}

function buildSubject_(d) {
  var ko = d.ime || 'Nov kontakt';
  var kod = labelUmetnik_(d.umetnik);
  return 'Nov upit sa sajta: ' + ko + (kod && kod !== 'Svejedno kod koga' ? ' (' + kod + ')' : '');
}

function buildPlain_(d) {
  return [
    'NOV UPIT SA SAJTA',
    '',
    'Ime:       ' + (d.ime || ''),
    'Email:     ' + (d.email || ''),
    'Šta:       ' + labelTip_(d.tip),
    'Kod koga:  ' + labelUmetnik_(d.umetnik),
    'Veličina:  ' + labelVelicina_(d.velicina),
    'Kada:      ' + labelRok_(d.rok),
    'Reference: ' + (d.reference || ''),
    '',
    'IDEJA',
    (d.ideja || '(nije napisano)'),
    '',
    'Poslato sa sajta' + (d.strana ? ' (' + d.strana + ')' : '') + '.'
  ].join('\n');
}

/**
 * Pravila su namerna, vidi reference/gotchas.md:
 *  - samo tabele i inline stilovi, bez flex/grid, bez web fontova, bez slika
 *  - !important na svaku boju + bgcolor na svaki blok (tamni rezim ne sme da prefarba)
 *  - color-scheme meta zaustavlja Apple Mail da invertuje
 *  - nista vazno ne stoji na border-radius (Outlook ga poravna, i to je u redu)
 *  - dugmad su celije tabele sa paddingom, ne stilizovani linkovi
 */
function buildHtml_(d) {
  var ime = d.ime || 'Neko';
  var prvo = (String(ime).split(' ')[0] || 'njemu').slice(0, 18);
  var mailable = /.+@.+\..+/.test(String(d.email || ''));
  var link = String(d.reference || '').trim();
  var linkOk = /^https?:\/\/\S+$/i.test(link);

  var rows = [
    ['Ime',       d.ime],
    ['Email',     d.email, mailable ? 'mailto:' + esc_(d.email) : ''],
    ['Šta',       labelTip_(d.tip)],
    ['Kod koga',  labelUmetnik_(d.umetnik)],
    ['Veličina',  labelVelicina_(d.velicina)],
    ['Kada',      labelRok_(d.rok)],
    ['Reference', link, linkOk ? esc_(link) : '']
  ].filter(function (r) { return r[1]; }).map(function (r, i, all) {
    var border = (i === all.length - 1) ? '' : 'border-bottom:1px solid ' + C.line + ';';
    var value = r[2]
      ? '<a href="' + r[2] + '" style="color:' + C.ink + ' !important;text-decoration:none;' +
        'border-bottom:1px solid ' + C.line + ';word-break:break-all;">' + esc_(r[1]) + '</a>'
      : esc_(r[1]);
    return '<tr>' +
      '<td bgcolor="' + C.card + '" width="120" style="background-color:' + C.card + ' !important;' + border +
        'padding:15px 16px 15px 0;color:' + C.muted + ' !important;font:700 11px/1.35 ' + SANS + ';' +
        'letter-spacing:.13em;text-transform:uppercase;vertical-align:top;">' + r[0] + '</td>' +
      '<td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' + border +
        'padding:13px 0;color:' + C.ink + ' !important;font:400 17px/1.45 ' + SANS + ';">' + value + '</td>' +
    '</tr>';
  }).join('');

  var panel =
    '<tr><td bgcolor="' + C.panel + '" style="background-color:' + C.panel + ' !important;' +
      'border-left:3px solid ' + C.brand + ';border-radius:' + RPILL + ';padding:20px 22px;">' +
      '<div style="color:' + C.muted + ' !important;font:700 11px/1.2 ' + SANS + ';letter-spacing:.13em;' +
        'text-transform:uppercase;padding-bottom:10px;">Ideja</div>' +
      '<div style="color:' + C.body + ' !important;font:400 16px/1.65 ' + SANS + ';white-space:pre-wrap;">' +
        esc_(d.ideja || 'Nije napisano.') + '</div>' +
    '</td></tr>';

  var solid = function (href, label) {
    return '<td bgcolor="' + C.brandDark + '" style="background-color:' + C.brandDark + ' !important;' +
      'border-radius:' + RPILL + ';padding:15px 30px;">' +
      '<a href="' + href + '" style="color:' + C.onBrand + ' !important;text-decoration:none;' +
      'font:700 13px/1 ' + SANS + ';letter-spacing:.1em;text-transform:uppercase;">' + label + '</a></td>';
  };
  var ghost = function (href, label) {
    return '<td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
      'border:1px solid ' + C.line + ';border-radius:' + RPILL + ';padding:14px 28px;">' +
      '<a href="' + href + '" style="color:' + C.ink + ' !important;text-decoration:none;' +
      'font:700 13px/1 ' + SANS + ';letter-spacing:.1em;text-transform:uppercase;">' + label + '</a></td>';
  };

  var mailHref = 'mailto:' + esc_(d.email) + '?subject=' +
    encodeURIComponent('Odgovor na tvoj upit, ' + BRAND);
  var cal = CAL[d.umetnik] || '';

  var buttons = '';
  if (mailable && cal) {
    buttons = solid(mailHref, 'Odgovori ' + esc_(prvo)) +
      '<td width="10" style="width:10px;">&nbsp;</td>' + ghost(cal, 'Otvori kalendar');
  } else if (mailable) {
    buttons = solid(mailHref, 'Odgovori ' + esc_(prvo));
  } else if (cal) {
    buttons = solid(cal, 'Otvori kalendar');
  }

  var actions = buttons
    ? '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:28px 40px 38px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' + buttons + '</tr></table>' +
      '</td></tr>'
    : '<tr><td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;height:34px;font-size:0;line-height:0;">&nbsp;</td></tr>';

  return '' +
'<!DOCTYPE html><html><head><meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<meta name="color-scheme" content="light dark">' +
'<meta name="supported-color-schemes" content="light dark">' +
'<style>:root{color-scheme:light dark;supported-color-schemes:light dark;}' +
'@media (max-width:600px){.pad{padding-left:24px !important;padding-right:24px !important;}' +
'.hd{font-size:26px !important;}}</style></head>' +
'<body style="margin:0;padding:0;background-color:' + C.page + ' !important;" bgcolor="' + C.page + '">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
  'bgcolor="' + C.page + '" style="background-color:' + C.page + ' !important;">' +
'<tr><td align="center" style="padding:32px 12px 44px;">' +

  '<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;max-width:600px;">' +

  '<tr><td style="padding:0;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
    'border:1px solid ' + C.line + ';border-radius:' + RADIUS + ';">' +

    '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
      'border-top:4px solid ' + C.brand + ';border-radius:' + RADIUS + ' ' + RADIUS + ' 0 0;padding:34px 40px 28px;">' +
      '<div style="color:' + C.brand + ' !important;font:700 11px/1.2 ' + SANS + ';letter-spacing:.2em;' +
        'text-transform:uppercase;">' + esc_(BRAND) + '</div>' +
      '<div class="hd" style="color:' + C.ink + ' !important;font:700 32px/1.15 ' + SANS + ';' +
        'letter-spacing:-.01em;padding-top:14px;">Nov upit</div>' +
      '<div style="color:' + C.muted + ' !important;font:400 15px/1.5 ' + SANS + ';padding-top:10px;">' +
        esc_(ime) + (labelUmetnik_(d.umetnik) ? ' &middot; ' + esc_(labelUmetnik_(d.umetnik)) : '') + '</div>' +
    '</td></tr>' +

    (rows ? '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:0 40px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
        'bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
        'border-top:1px solid ' + C.line + ';">' + rows + '</table>' +
    '</td></tr>' : '') +

    '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:26px 40px 0;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + panel + '</table>' +
    '</td></tr>' +

    actions +

  '</table></td></tr>' +

    '<tr><td class="pad" bgcolor="' + C.page + '" style="background-color:' + C.page + ' !important;padding:20px 40px 0;">' +
      '<div style="color:' + C.muted + ' !important;font:700 11px/1.7 ' + SANS + ';letter-spacing:.12em;' +
        'text-transform:uppercase;">Obrazac sa sajta' +
        (d.strana ? ' &nbsp;&middot;&nbsp; ' + esc_(d.strana) : '') + '</div>' +
      (SHEET_URL ? '<div style="padding-top:8px;"><a href="' + SHEET_URL + '" ' +
        'style="color:' + C.muted + ' !important;font:400 12px/1.7 ' + SANS + ';' +
        'text-decoration:underline;">Otvori tabelu sa svim upitima</a></div>' : '') +
    '</td></tr>' +

  '</table>' +
  '<!--[if mso]></td></tr></table><![endif]-->' +
'</td></tr></table></body></html>';
}

/* ================= POMOCNE ================= */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
