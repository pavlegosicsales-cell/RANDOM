/* =========================================================
   RANDOM TATTOO STUDIO — i18n (srpski / engleski)
   Vanilla, bez biblioteka.

   Kako radi:
   - Kratki UI tekstovi: <element data-i18n="kljuc">  → tekst iz REČNIKA ispod.
   - Atributi:           data-i18n-attr="placeholder:kljuc, aria-label:drugi.kljuc"
   - Dugački tekstovi (blog članci): dvojezični markup — <div lang="sr"> / <div lang="en">,
     prebacuje se preko CSS-a (html[data-lang="en"] [lang="sr"] { display:none }).
   - Izbor se pamti u localStorage i postavlja <html lang> i <html data-lang>.
   ========================================================= */
(function () {
  'use strict';

  var STORE = 'random-lang';
  var DEFAULT = 'sr';

  var T = {
    /* ---------- NAV ---------- */
    'nav.home':      { sr: 'Početna',   en: 'Home' },
    'nav.gallery':   { sr: 'Galerija',  en: 'Gallery' },
    'nav.blog':      { sr: 'Blog',      en: 'Blog' },
    'nav.contact':   { sr: 'Kontakt',   en: 'Contact' },
    'nav.cta':       { sr: 'Zakaži Konsultaciju', en: 'Book a Consultation' },
    'nav.menu':      { sr: 'Otvori meni', en: 'Open menu' },
    'nav.skip':      { sr: 'Preskoči na sadržaj', en: 'Skip to content' },
    'nav.instagram': { sr: 'Instagram', en: 'Instagram' },

    /* ---------- ZAJEDNIČKO ---------- */
    'common.location':   { sr: 'Beograd, Srbija', en: 'Belgrade, Serbia' },
    'common.scroll':     { sr: 'Skroluj dole ↓',  en: 'Scroll down ↓' },
    'common.viewWorks':  { sr: 'Pogledaj radove', en: 'View works' },
    'common.readMore':   { sr: 'Pročitaj',        en: 'Read' },

    /* ---------- POČETNA — hero ---------- */
    'home.status':    { sr: 'Primamo nove klijente', en: 'Taking new clients' },
    'home.title1':    { sr: 'Umetnost koja',  en: 'Art that' },
    'home.title2':    { sr: 'ostaje uz tebe', en: 'stays with you' },
    'home.lead':      { sr: 'Prilagođene tetovaže rađene ručno, napravljene da traju ceo život.',
                        en: 'Custom tattoos made by hand, built to last a lifetime.' },

    /* ---------- POČETNA — galerija ---------- */
    'home.gal.label': { sr: '/ Galerija', en: '/ Gallery' },
    'home.gal.title': { sr: 'Radovi',     en: 'Our work' },
    'home.gal.lead':  { sr: 'Bez filtera, bez ulepšavanja. Ovako izgleda kad zaraste.',
                        en: 'No filters, no touch-ups. This is how it looks once healed.' },
    'home.gal.all':   { sr: 'Cela galerija →', en: 'Full gallery →' },
    'home.gal.hint':  { sr: 'Skroluj — kroz sve radove', en: 'Scroll — through all works' },
    'home.gal.empty': { sr: 'Nema radova u ovoj kategoriji', en: 'No works in this category' },

    /* ---------- POČETNA — artisti ---------- */
    'home.art.label': { sr: '/ Artisti', en: '/ Artists' },
    'home.art.title': { sr: 'Umetnici',  en: 'Artists' },
    'home.art.lead':  { sr: 'Svako od nas radi svoje. Ne pokušavamo da budemo sve za svakoga — zato svaki rad izgleda kao da je rađen baš za tebe.',
                        en: 'Each of us does our own thing. We do not try to be everything to everyone — that is why every piece looks like it was made just for you.' },
    'art.lemson.role':  { sr: '01 // Artista · od 2018', en: '01 // Artist · since 2018' },
    'art.lemson.style': { sr: 'Realizam · Apstraktne boje', en: 'Realism · Abstract colour' },
    'art.lemson.desc':  { sr: 'Lemson radi u dva sveta koja mali broj umetnika može da premosti — hiperprecizna preciznost crno-belog realizma i slobodna, izražajna energija apstraktnih boja. Bez obzira na stil, svaki komad nosi isti kvalitet: izgleda živo.',
                          en: 'Lemson works across two worlds few artists can bridge — the razor precision of black and grey realism and the loose, expressive energy of abstract colour. Whatever the style, every piece carries the same quality: it looks alive.' },
    'art.anja.role':    { sr: '02 // Artista · od 2020', en: '02 // Artist · since 2020' },
    'art.anja.style':   { sr: 'Fina linija · Linework', en: 'Fine line · Linework' },
    'art.anja.desc':    { sr: 'Anjin rad je tih i precizan — i upravo zbog toga je toliko moćan. Njene tetovaže fine linije su elegantne, promišljene i napravljene da lepo stare. Savršeno za one koji žele nešto rafinirano i duboko lično.',
                          en: 'Anja\'s work is quiet and precise — and that is exactly why it hits so hard. Her fine line tattoos are elegant, considered and built to age well. Perfect for anyone who wants something refined and deeply personal.' },
    'art.enco.role':    { sr: '03 // Artista · od 2019', en: '03 // Artist · since 2019' },
    'art.enco.style':   { sr: 'Grafiti · Urbani stil', en: 'Graffiti · Urban style' },
    'art.enco.desc':    { sr: 'Enco prenosi ulične zidove na tvoju kožu. Ukorenjen u grafiti kulturu, njegov rad je smeo, izražajan i pun karaktera. Ako želiš nešto što privlači pažnju, Enco je tvoj umetnik.',
                          en: 'Enco brings the street walls onto your skin. Rooted in graffiti culture, his work is bold, expressive and full of character. If you want something that turns heads, Enco is your artist.' },
    'art.link':         { sr: 'Pogledaj radove →', en: 'View works →' },

    /* tagovi */
    'tag.realizam':   { sr: 'Realizam', en: 'Realism' },
    'tag.bandg':      { sr: 'Black & Grey', en: 'Black & Grey' },
    'tag.apstraktne': { sr: 'Apstraktne boje', en: 'Abstract colour' },
    'tag.portreti':   { sr: 'Portreti', en: 'Portraits' },
    'tag.sleeve':     { sr: 'Sleeve', en: 'Sleeve' },
    'tag.finalinija': { sr: 'Fina linija', en: 'Fine line' },
    'tag.linework':   { sr: 'Linework', en: 'Linework' },
    'tag.elegantno':  { sr: 'Elegantno', en: 'Elegant' },
    'tag.precizno':   { sr: 'Precizno', en: 'Precise' },
    'tag.licno':      { sr: 'Lično', en: 'Personal' },
    'tag.grafiti':    { sr: 'Grafiti', en: 'Graffiti' },
    'tag.urbano':     { sr: 'Urbano', en: 'Urban' },
    'tag.smelo':      { sr: 'Smelo', en: 'Bold' },
    'tag.izrazajno':  { sr: 'Izražajno', en: 'Expressive' },
    'tag.karakter':   { sr: 'Karakter', en: 'Character' },

    /* ---------- POČETNA — skorašnji radovi ---------- */
    'home.recent.label': { sr: '/ Skorašnji radovi', en: '/ Recent work' },
    'home.recent.title': { sr: 'Sveže sa stolice',   en: 'Fresh off the chair' },

    /* ---------- POČETNA — proces ---------- */
    'home.proc.label': { sr: '/ Proces', en: '/ Process' },
    'home.proc.title': { sr: 'Proces',   en: 'Process' },
    'home.proc.lead':  { sr: 'Bez iznenađenja. Evo tačno šta te čeka od prve poruke do zarastanja.',
                         en: 'No surprises. Here is exactly what to expect, from first message to healed.' },
    'proc.1.title': { sr: 'Reci šta hoćeš', en: 'Tell us what you want' },
    'proc.1.desc':  { sr: 'Zakaži konsultaciju ili nam napiši poruku. Ne moraš da imaš gotovu ideju — dovoljno je da znaš otprilike šta te vuče. Zajedno ćemo iskristalisati.',
                      en: 'Book a consultation or just message us. You do not need a finished idea — knowing roughly what pulls you is enough. We will shape it together.' },
    'proc.1.li1':   { sr: 'Zakaži konsultaciju ili pošalji ideju i reference', en: 'Book a consultation or send your idea and references' },
    'proc.1.li2':   { sr: 'Kažemo ti ko od nas je pravi za taj rad', en: 'We tell you which of us is right for the piece' },
    'proc.1.li3':   { sr: 'Dogovorimo veličinu i cenu', en: 'We agree on size and price' },
    'proc.2.title': { sr: 'Zakaži termin', en: 'Book your slot' },
    'proc.2.desc':  { sr: 'Kad se složimo oko dizajna, rezervišemo ti datum. Kapara potvrđuje termin i odbija se od konačne cene.',
                      en: 'Once we agree on the design, we hold a date for you. A deposit confirms the slot and comes off the final price.' },
    'proc.2.li1':   { sr: 'Potvrdiš skicu, veličinu i poziciju', en: 'You confirm the sketch, size and placement' },
    'proc.2.li2':   { sr: 'Dobiješ procenu cene — konačna zavisi od finalne veličine i pozicije', en: 'You get a price estimate — the final depends on size and placement' },
    'proc.2.li3':   { sr: 'Kapara ti čuva termin', en: 'The deposit holds your slot' },
    'proc.3.title': { sr: 'Dan tetoviranja', en: 'Tattoo day' },
    'proc.3.desc':  { sr: 'Dođi naspavan i najeden. Ostalo je na nama. Radimo koliko treba, ne koliko je zakazano.',
                      en: 'Come rested and fed. The rest is on us. We work as long as it takes, not as long as it was booked.' },
    'proc.3.li1':   { sr: 'Tetoviranje u studiju, sa pauzama koliko ti treba', en: 'Tattooing in the studio, with as many breaks as you need' },
    'proc.3.li2':   { sr: 'Prolazimo kroz negu pre nego što izađeš', en: 'We go through aftercare before you leave' },
    'proc.3.li3':   { sr: 'Ostajemo dostupni dok ne zaraste', en: 'We stay reachable until it is healed' },

    /* ---------- POČETNA — o studiju ---------- */
    'home.about.label': { sr: '/ O studiju', en: '/ About' },
    'home.about.title': { sr: 'Ne radimo generičko', en: 'We do not do generic' },
    'home.about.p1':    { sr: 'Random Tattoo Studio je mali, umetnički studio u srcu Beograda. Verujemo da svaka tetovaža treba da bude jedinstvena kao i osoba koja je nosi — zbog toga radimo isključivo po porudžbini.',
                          en: 'Random Tattoo Studio is a small, artist-run studio in the heart of Belgrade. We believe every tattoo should be as unique as the person wearing it — which is why we only work custom.' },
    'home.about.p2':    { sr: 'Bez gotovih dizajna sa zida. Bez kopija. Samo originalna umetnost napravljena za tebe, od strane umetnika kojima je stalo do svog zanata.',
                          en: 'No flash off the wall. No copies. Just original art made for you, by artists who care about their craft.' },

    /* ---------- POČETNA — statement ---------- */
    'home.assemble1': { sr: 'Ovo ostaje', en: 'This stays' },
    'home.assemble2': { sr: 'zauvek',     en: 'forever' },

    /* ---------- POČETNA — recenzije ---------- */
    'home.rev.label': { sr: '/ Recenzije',    en: '/ Reviews' },
    'home.rev.title': { sr: 'Šta kažu ljudi', en: 'What people say' },
    'home.rev.lead':  { sr: 'Bez ulepšavanja — ovo su njihove reči. Ljudi koji su nam verovali svoju ideju i izašli sa radom koji nose zauvek.',
                        en: 'No polishing — these are their words. People who trusted us with their idea and walked out with a piece they wear forever.' },
    'rev.1.text': { sr: 'Došao sam sa nejasnom idejom, izašao sa radom koji mi svi komentarišu. Nisu žurili ni sekund.',
                    en: 'I came in with a vague idea and left with a piece everyone comments on. They never rushed a second.' },
    'rev.2.text': { sr: 'Čisto, profesionalno, i iskreno mi rekli šta neće lepo da stoji. Cenim to više nego da su samo uzeli pare.',
                    en: 'Clean, professional, and they honestly told me what would not sit well. I value that more than them just taking the money.' },
    'rev.3.text': { sr: 'Prva tetovaža, bio sam nervozan. Objasnili su sve, pauze kad god mi treba. Vratiću se sigurno.',
                    en: 'First tattoo, I was nervous. They explained everything, breaks whenever I needed. I will definitely be back.' },
    'rev.4.text': { sr: 'Fine line rad tako čist da izgleda kao da je odštampan. Tačno ono što sam tražila.',
                    en: 'Fine line work so clean it looks printed. Exactly what I asked for.' },

    /* ---------- POČETNA — brojke ---------- */
    'stat.1': { sr: 'Umetnika · tri stila', en: 'Artists · three styles' },
    'stat.2': { sr: 'Custom radovi',        en: 'Custom work' },
    'stat.3': { sr: 'Urađenih tetovaža',    en: 'Tattoos done' },

    /* ---------- POČETNA — pitanja ---------- */
    'home.faq.label': { sr: '/ Česta pitanja', en: '/ FAQ' },
    'home.faq.title': { sr: 'Pitanja koja svi postavljaju', en: 'The questions everyone asks' },
    'faq.1.q': { sr: 'Koliko košta?', en: 'How much does it cost?' },
    'faq.1.a': { sr: 'Zavisi od umetnika, veličine i koliko je rad kompleksan. Zato ne pišemo cenovnik — bio bi netačan. Pošalji nam ideju i dobićeš konkretnu procenu, bez obaveze. Ono što možemo da obećamo: nećeš dobiti iznenađenje na kraju.',
                 en: 'It depends on the artist, the size and how complex the piece is. That is why we do not publish a price list — it would be wrong. Send us your idea and you will get a concrete estimate, no obligation. What we can promise: no surprises at the end.' },
    'faq.2.q': { sr: 'Boli li?', en: 'Does it hurt?' },
    'faq.2.a': { sr: 'Da, ali manje nego što misliš. Zavisi od mesta — rebra i laktovi su najgori, ruke i noge se lako trpe. Pravimo pauze kad god ti treba. Niko nikad nije pobegao sa stolice.',
                 en: 'Yes, but less than you think. It depends on the spot — ribs and elbows are the worst, arms and legs are easy to take. We break whenever you need. Nobody has ever run off the chair.' },
    'faq.3.q': { sr: 'Nemam ideju, samo znam otprilike šta hoću.', en: 'I have no idea, I only roughly know what I want.' },
    'faq.3.a': { sr: 'To je češće nego što misliš i potpuno je u redu. Dođi sa onim što imaš — raspoloženje, motiv, sliku koja ti se sviđa. Naš posao je da to pretvorimo u nešto što stoji na tebi.',
                 en: 'That is more common than you think and completely fine. Come with what you have — a mood, a motif, a picture you like. Our job is to turn that into something that sits on you.' },
    'faq.4.q': { sr: 'Mogu li da dođem bez zakazivanja?', en: 'Can I walk in without an appointment?' },
    'faq.4.a': { sr: 'Možeš. Za manje radove često možemo odmah, za veće ćemo se dogovoriti oko termina. Svrati, popij kafu, pitaj šta te zanima — ne moraš ništa da zakažeš tog dana.',
                 en: 'You can. For smaller pieces we can often do it right away, for bigger ones we will arrange a slot. Drop by, have a coffee, ask what you want — you do not have to book anything that day.' },
    'faq.5.q': { sr: 'Koliko se čeka termin?', en: 'How long is the wait?' },
    'faq.5.a': { sr: 'Zavisi od umetnika i od toga koliko je veliki rad. Javi se pa ćemo ti reći iskreno — ne obećavamo termine koje ne možemo da ispunimo.',
                 en: 'It depends on the artist and how big the piece is. Get in touch and we will tell you honestly — we do not promise slots we cannot keep.' },
    'faq.6.q': { sr: 'Šta ako mi se ne dopadne skica?', en: 'What if I do not like the sketch?' },
    'faq.6.a': { sr: 'Menjamo je. Skica se radi dok ti ne bude po volji — nema tetoviranja dok ne kažeš „to je to". Ovo ti ostaje ceo život, nema žurbe.',
                 en: 'We change it. The sketch gets reworked until you are happy — no tattooing until you say "that is it". This stays with you for life, there is no rush.' },
    'faq.7.q': { sr: 'Radite li cover-up?', en: 'Do you do cover-ups?' },
    'faq.7.a': { sr: 'Zavisi šta pokrivamo. Pošalji fotografiju postojeće tetovaže i reći ćemo ti iskreno šta je moguće, a šta nije. Ne prihvatamo cover-up ako mislimo da rezultat neće biti dobar.',
                 en: 'It depends what we are covering. Send a photo of the existing tattoo and we will tell you honestly what is possible and what is not. We do not take on a cover-up if we think the result will not be good.' },
    'faq.8.q': { sr: 'Kako se neguje sveža tetovaža?', en: 'How do I care for a fresh tattoo?' },
    'faq.8.a': { sr: 'Sve ti objasnimo pre nego što izađeš i dobiješ pisano uputstvo. Ukratko: peri, maži, ne češi, izbegavaj sunce, bazen i saunu prve dve nedelje. Ako nešto deluje čudno — javi se, tu smo.',
                 en: 'We explain everything before you leave and you get written instructions. In short: wash it, moisturise it, do not scratch, avoid sun, pools and saunas for the first two weeks. If anything looks off — call us, we are here.' },
    'faq.9.q': { sr: 'Od koliko godina?', en: 'What is the age limit?' },
    'faq.9.a': { sr: '18+. Bez izuzetaka.', en: '18+. No exceptions.' },

    /* ---------- KONTAKT / FORMA ---------- */
    'contact.label':     { sr: '/ Kontakt', en: '/ Contact' },
    'contact.title':     { sr: 'Kontakt',   en: 'Contact' },
    'contact.heroLead':  { sr: 'Piši nam ideju ili svrati na kafu. Odgovaramo u roku od 24h.',
                           en: 'Send us your idea or drop by for a coffee. We reply within 24h.' },
    'contact.heroCta':   { sr: 'Kontaktiraj nas', en: 'Get in touch' },
    'contact.talkLabel': { sr: '/ Razgovor', en: '/ Let\'s talk' },
    'contact.talkTitle': { sr: 'Hajde da Porazgovaramo', en: 'Let\'s Have a Talk' },
    'contact.talkLead':  { sr: 'Svaka dobra tetovaža počinje razgovorom. Reci nam šta imaš na umu — stil, ideju, raspoloženje, sliku — i mi ćemo preuzeti od tu. Javićemo ti se da zakažemo besplatnu konsultaciju.',
                           en: 'Every good tattoo starts with a conversation. Tell us what you have in mind — a style, an idea, a mood, a picture — and we will take it from there. We will get back to you to book a free consultation.' },
    'form.title':    { sr: 'Piši Nam', en: 'Write to Us' },
    'form.sub':      { sr: 'Piši nam ideju — javljamo se u roku od 24h.', en: 'Send us your idea — we reply within 24h.' },
    'form.name':     { sr: 'Ime', en: 'Name' },
    'form.email':    { sr: 'Email adresa', en: 'Email address' },
    'form.artist':   { sr: 'Kod koga bi? — svejedno', en: 'Who with? — no preference' },
    'form.idea':     { sr: 'Ispričaj nam ideju', en: 'Tell us your idea' },
    'form.ref':      { sr: 'Reference — link ka slici (opciono)', en: 'References — image link (optional)' },
    'form.submit':   { sr: 'Pošalji Svoju Ideju', en: 'Send Your Idea' },
    'form.sending':  { sr: 'ŠALJEM…', en: 'SENDING…' },
    'form.success':  { sr: 'Javićemo ti se u roku od 24h.', en: 'We will get back to you within 24h.' },
    'form.required': { sr: 'Ovo polje je obavezno.', en: 'This field is required.' },
    'contact.note':  { sr: 'Nisi siguran odakle da počneš? To je sasvim u redu. Svrati na konsultaciju — besplatna je, bez obaveza, i možda ćeš otići sa idejom na koju nisi ni pomislio.',
                       en: 'Not sure where to start? That is completely fine. Come in for a consultation — it is free, no strings, and you might leave with an idea you never thought of.' },
    'contact.address':  { sr: 'Adresa', en: 'Address' },
    'contact.hours':    { sr: 'Radno vreme', en: 'Opening hours' },
    'contact.phone':    { sr: 'Telefon', en: 'Phone' },
    'contact.hoursVal': { sr: 'Pon – Uto · Samo po dogovoru<br>Sre – Pet · 12:00 – 21:00<br>Sub · 12:00 – 18:00<br>Ned · Zatvoreno',
                          en: 'Mon – Tue · By appointment only<br>Wed – Fri · 12:00 – 21:00<br>Sat · 12:00 – 18:00<br>Sun · Closed' },
    'contact.city':     { sr: 'Paje Jovanovića 33<br>Beograd', en: 'Paje Jovanovića 33<br>Belgrade' },
    'lmap.hint':  { sr: 'Klikni da proširiš', en: 'Click to expand' },
    'lmap.dir':   { sr: 'Pogledaj mapu →',    en: 'Open map →' },
    'lmap.loc':   { sr: 'Paje Jovanovića 33, Beograd', en: 'Paje Jovanovića 33, Belgrade' },

    /* ---------- KONSULTACIJE (galerija) ---------- */
    'consult.label': { sr: '/ Konsultacija', en: '/ Consultation' },
    'consult.title': { sr: 'Zakaži besplatnu konsultaciju', en: 'Book a free consultation' },
    'consult.text':  { sr: 'Nisi siguran odakle da počneš? Naš tim ti pravi besplatnu skicu. Izabraćemo umetnika koji je pravi za tvoju ideju — spreman da izvede i najsmelije zamisli.',
                       en: 'Not sure where to start? Our team will make you a free sketch. We will pick the artist who is right for your idea — ready to pull off even the boldest one.' },
    'consult.li1':   { sr: 'Besplatno, bez obaveza', en: 'Free, no obligation' },
    'consult.li2':   { sr: 'Predlog umetnika i stila', en: 'Artist and style suggestion' },
    'consult.li3':   { sr: 'Okvirna procena cene i termina', en: 'Ballpark price and timing' },
    'consult.cta':   { sr: 'Zakaži konsultaciju', en: 'Book a consultation' },
    'gal.kontakt.title': { sr: 'Zakaži svoj termin', en: 'Book your slot' },
    'gal.kontakt.lead':  { sr: 'Piši nam ideju ili zakaži besplatnu konsultaciju — javljamo se u roku od 24h.',
                           en: 'Send us your idea or book a free consultation — we reply within 24h.' },

    /* ---------- GALERIJA ---------- */
    'gal.title1':  { sr: 'Naši',   en: 'Our' },
    'gal.title2':  { sr: 'radovi', en: 'work' },
    'gal.heroLead':{ sr: 'Svaka tetovaža u našem portfoliju počela je kao razgovor. Evo gde su se neki od tih razgovora završili.',
                     en: 'Every tattoo in our portfolio started as a conversation. Here is where some of those conversations ended up.' },
    'gal.more':    { sr: 'Prikaži još radova', en: 'Show more work' },
    'gal.artist':  { sr: 'Artist', en: 'Artist' },

    /* ---------- BLOG ---------- */
    'blog.label':     { sr: '/ Blog', en: '/ Blog' },
    'blog.title':     { sr: 'Blog',   en: 'Blog' },
    'blog.heroLead':  { sr: 'Priče iz studija, nega tetovaža i sve što treba da znaš pre nego što sedneš u stolicu.',
                        en: 'Stories from the studio, aftercare, and everything you should know before you sit in the chair.' },
    'blog.heroCta':   { sr: 'Pogledaj blogove', en: 'Read the blog' },
    'blog.listTitle': { sr: 'Priče iz studija', en: 'Stories from the studio' },
    'blog.listLead':  { sr: 'Nega, mitovi, bol, zaceljivanje — sve što treba da znaš pre i posle tetoviranja, iz prve ruke.',
                        en: 'Aftercare, myths, pain, healing — everything you should know before and after, first hand.' },
    'blog.drag':      { sr: 'Vuci da zavrtiš', en: 'Drag to spin' },
    'blog.back':      { sr: '← Blog', en: '← Blog' },
    'blog.readTime':  { sr: 'min čitanja', en: 'min read' },

    /* blog kategorije + naslovi */
    'blog.koza-pamti.cat':    { sr: 'Nauka o koži', en: 'Skin science' },
    'blog.koza-pamti.title':  { sr: 'Koža pamti, ali se i menja', en: 'Skin remembers, but it also changes' },
    'blog.osecaj-bola.cat':   { sr: 'Pre prve tetovaže', en: 'Before your first tattoo' },
    'blog.osecaj-bola.title': { sr: 'Osećaj bola zavisi od mesta na telu', en: 'How much it hurts depends on where you put it' },
    'blog.mitovi.cat':        { sr: 'Mitovi', en: 'Myths' },
    'blog.mitovi.title':      { sr: 'Zašto ne smeš da veruješ svemu što pročitaš o tetovažama', en: 'Why you should not believe everything you read about tattoos' },
    'blog.zivotni-stil.cat':  { sr: 'Nega i vreme', en: 'Care and time' },
    'blog.zivotni-stil.title':{ sr: 'Kako tvoj životni stil oblikuje izgled tetovaže godinama kasnije', en: 'How your lifestyle shapes your tattoo years later' },
    'blog.zaceljivanje.cat':  { sr: 'Zaceljivanje', en: 'Healing' },
    'blog.zaceljivanje.title':{ sr: 'Šta se zapravo dešava dok tvoja tetovaža zaceljuje', en: 'What actually happens while your tattoo heals' },
    'blog.higijena.cat':      { sr: 'Higijena i bezbednost', en: 'Hygiene and safety' },
    'blog.higijena.title':    { sr: 'Zašto svaki tattoo studio insistira na higijeni koliko i na dizajnu', en: 'Why every tattoo studio insists on hygiene as much as on design' },
    'blog.soon.title': { sr: 'Uskoro', en: 'Coming soon' },

    /* ---------- ARTIST STRANICA ---------- */
    'artist.label':    { sr: 'Artista · Random Tattoo Studio', en: 'Artist · Random Tattoo Studio' },
    'artist.works':    { sr: 'Radovi', en: 'Work' },
    'artist.selected': { sr: 'Izbor radova', en: 'Selected work' },
    'artist.all':      { sr: '← Svi umetnici', en: '← All artists' },

    /* ---------- FOOTER ---------- */
    'footer.slogan':  { sr: 'Random Tattoo Studio. Beograd. Umetnost na koži. Napravljena za tebe.',
                        en: 'Random Tattoo Studio. Belgrade. Art on skin. Made for you.' },
    'footer.discover':{ sr: 'Otkrij', en: 'Discover' },
    'footer.social':  { sr: 'Social', en: 'Social' },
    'footer.contact': { sr: 'Kontakt', en: 'Contact' },
    'footer.addr':    { sr: 'Paje Jovanovića 33, Beograd', en: 'Paje Jovanovića 33, Belgrade' },
    'footer.h1':      { sr: 'Sre–Pet · 12–21h', en: 'Wed–Fri · 12–21h' },
    'footer.h2':      { sr: 'Sub · 12–18h', en: 'Sat · 12–18h' },
    'footer.h3':      { sr: 'Pon–Uto po dogovoru · Ned zatvoreno', en: 'Mon–Tue by appointment · Sun closed' },
    'footer.copy':    { sr: '© 2026 Random Tattoo Studio · Beograd', en: '© 2026 Random Tattoo Studio · Belgrade' },
    'footer.top':     { sr: 'Nazad na vrh ↑', en: 'Back to top ↑' },

    /* ---------- PREKIDAČ ---------- */
    'lang.sr': { sr: 'Srpski',  en: 'Serbian' },
    'lang.en': { sr: 'Engleski', en: 'English' }
  };

  function get(key, lang) {
    var e = T[key];
    if (!e) return null;
    return e[lang] != null ? e[lang] : e[DEFAULT];
  }

  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);

    // tekst
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var v = get(el.getAttribute('data-i18n'), lang);
      if (v == null) return;
      if (v.indexOf('<br>') > -1) el.innerHTML = v; else el.textContent = v;
    });

    // atributi: data-i18n-attr="placeholder:kljuc, aria-label:drugi"
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length < 2) return;
        var v = get(p[1].trim(), lang);
        if (v != null) el.setAttribute(p[0].trim(), v);
      });
    });

    // prekidač — prikaži trenutni jezik
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-current]'), function (el) {
      el.textContent = lang.toUpperCase();
    });
    Array.prototype.forEach.call(document.querySelectorAll('.lang__opt'), function (btn) {
      var on = btn.getAttribute('data-lang-set') === lang;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', String(on));
    });

    try { localStorage.setItem(STORE, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function current() {
    var l = null;
    try { l = localStorage.getItem(STORE); } catch (e) {}
    return (l === 'en' || l === 'sr') ? l : DEFAULT;
  }

  function initSwitch() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (root) {
      var btn = root.querySelector('.lang__btn');
      var menu = root.querySelector('.lang__menu');
      if (!btn || !menu) return;

      function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
      function open() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.hidden) open(); else close();
      });
      Array.prototype.forEach.call(root.querySelectorAll('.lang__opt'), function (opt) {
        opt.addEventListener('click', function () {
          apply(opt.getAttribute('data-lang-set'));
          close();
        });
      });
      document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    });
  }

  window.RandomI18N = { apply: apply, current: current, t: get };

  document.addEventListener('DOMContentLoaded', function () {
    initSwitch();
    apply(current());
  });
})();
