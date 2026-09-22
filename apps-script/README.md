# Prijem upita sa forme (Google Apps Script)

`Code.gs` prima upit sa sajta, upisuje red u Google tabelu i salje jedan mejl
sa obavestenjem.

## Postavljanje

1. Napravi Google tabelu (npr. "Random Tattoo, upiti sa sajta").
2. U njoj: **Ekstenzije → Apps Script**.
3. Obrisi sve iz `Code.gs` i nalepi sadrzaj `apps-script/Code.gs` iz ovog repozitorijuma.
4. Proveri da `NOTIFY_TO` pokazuje na **tvoj** mejl dok se testira.
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Kopiraj `/exec` adresu i upisi je u `FORM_ENDPOINT` u `script.js`
   (blok "FORMA (wizard)").

**Stanje:** deployovano i ukljuceno na sajtu 22.09.2026. `NOTIFY_TO` je jos
uvek Pavlov mejl, sto je namerno dok se ne potvrdi da sve radi.

## Kad se nesto menja u skripti

**Izmena koda sama po sebi ne menja ono sto je zivo.**
Deploy → Manage deployments → olovka na postojecem → Version: **New version** → Deploy.
Ovo je greska koja svima prodje bar jednom.

## Pustanje klijentu

Jedna linija: `NOTIFY_TO` na mejl studija, pa **nov deploy verzije**.
Do tada sve probe stizu tebi, sto i jeste poenta.

## Sta stize u mejlu

Ime, mejl, i odgovori iz wizarda (sta, kod koga, velicina, kada), link ka
referenci ako je poslata, i sama ideja u zasebnom panelu.

Dva dugmeta: **Odgovori** (mailto, ide pravo coveku) i **Otvori kalendar**
(Cal termin bas tog umetnika kog je izabrao). Ako mejl nije ispravan ili
umetnik nije izabran, to dugme se ne prikazuje umesto da bude mrtvo.

## Ogranicenja, da se zna

- Sajt salje `no-cors`, pa browser **ne moze da procita odgovor**. Poruka
  "Hvala sto si nam pisao" se prikazuje i ako slanje ne uspe. Zato je vredno
  povremeno proveriti tabelu.
- Upis u tabelu i slanje mejla su namerno odvojeni: ako upis padne, mejl
  svejedno ide. Gubitak upita zbog tabele je najgori moguci ishod.
- Besplatan Gmail nalog salje do 100 mejlova dnevno, Workspace 1500.

## Pregled izgleda mejla bez deploya

```bash
node <putanja>/03-form-backend-setup/scripts/preview.js apps-script/Code.gs <izlazni-folder>
```

Skripta iscrta mejl za pun upit i za osam rubnih slucajeva (prazno, bez
umetnika, los link, napad kroz polja, preliv teksta) i napravi slike.
