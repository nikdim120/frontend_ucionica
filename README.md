# eProdavnica — četiri dana pre Reacta

Verzija **0.6.0** · 24. oktobar 2026.

Sva četiri dana su obavezan preduslov za nastavak ka Reactu. Posle njih slede detaljniji JavaScript i praktična provera.

**34 praktične etape, 71 kviz pitanja, jedan zajednički projekat.** Dan 1 i Dan 2 nisu sadržajno menjani. Flexbox/Grid su objedinjeni u Danu 3; Dan 4 ih primenjuje kroz Tailwind i završavanje projekta, uz zaseban Bootstrap primer od 30 minuta.

Procena: 1180 minuta osnovnog rada + 74 minuta kvizova = **20 h 54 min**. Pauze, instalacija i dodatna lokalna vežba računaju se posebno. Ovo nije potvrđeno početničko vreme.

## Pokretanje i tvoj test Dana 1

Potrebni su Node.js **24 ili noviji** i npm. Raspakuj ceo ZIP u novi direktorijum. Na Windows-u pokreni **pokreni.bat**, ili:

    npm ci
    npm start

Otvori **http://localhost:4173** u Chrome-u. Terminal ostaje otvoren; prekid je Ctrl+C. Gotov dist/ je uključen; prvi put nije potreban build. SQLite se sam kreira u data/course.sqlite. Baza i node_modules nisu uključeni. Ako PowerShell blokira npm.ps1, koristi npm.cmd ili CMD. macOS/Linux: bash pokreni.sh. Za instalaciju je potreban internet; lekcije, editor, Tailwind i Bootstrap zatim rade lokalno.

**Detaljno uputstvo i obrazac vremena:** otvori **http://localhost:4173/testiranje-dan-1.html** ili dvoklikni public/testiranje-dan-1.html.

1. U posebnom profilu uradi funkcionalnu proveru (15–20 minuta); ne ubrajaj je u kurs.
2. Za procenu sadržaja kreni iz čistog profila, kroz uvod i svih osam etapa, bez unapred ubačenih rešenja.
3. Beleži čitanje, pisanje koda, ispravke, kviz, pomoć i rad u VS Code-u. Napravi pauzu kada bi je napravio student.
4. Posebno oceni box model, razumljivost zahteva, vezu teorije sa zadatkom i poruke provera.
5. U obrascu sačuvaj JSON beleške. To nije studentski izvoz napretka niti rezervna kopija naloga.

**Dan 1: 4 h 53 min** = uvod 60 + praktične etape 215 + kvizovi 18. Tvoj nastavnički prolaz nije pouzdana procena početnika. Platforma meri približnu aktivnost u svom prozoru; spoljni VS Code i dugo čitanje bez interakcije mogu biti potcenjeni. Koristi i ručni zapis vremena.

## Aktuelna podela

| Dan | Fokus | Etapa | Procena sa JS i kvizovima |
|---|---|---:|---:|
| 1 | Prva stranica, box model i prvi klik | 8 | 4 h 53 min |
| 2 | Forme, tabele, responsive i obračun | 12 | 5 h 49 min |
| 3 | Flexbox i Grid u jednom danu | 7 | 5 h 8 min |
| 4 | Tailwind, Bootstrap i završna isporuka | 7 | 5 h 4 min |

## Šta je ubrzano u Danu 3 i 4

- Šest Flex/Grid celina zamenjuje dvanaest pojedinačnih etapa: ose i poravnanje; dimenzije/prelamanje; kartica i popravka zaglavlja; prilagodljiva mreža; oblasti i span; zajednička primena/provera sadržaja.
- Jedan objedinjeni zadatak po novoj celini, uz kratak primer, nagoveštaje i kviz. Nema dodatnih obaveznih ponavljanja posle prolaza.
- Detaljne imenovane linije, implicitne kolone, dense, subgrid i container queries ostaju u izvornim lokalnim materijalima za kasnije; nisu zasebni obavezni zadaci.
- Tailwind kartica/formular/stanja su jedna etapa; Flex/Grid utility klase druga; nova katalog.html i popravka rasporeda ostaju samostalne etape.
- Bootstrap je kratko poređenje na izdvojenoj kopiji proizvoda. Koristi lokalni Bootstrap 5.3.8 CSS i MIT licencu. Standardni Bootstrap sistem kolona koristi Flexbox. Nema dodatnog framework JS-a ni mešanja Bootstrap/Tailwind stilova na istoj stranici.
- JS prikaz niza proizvoda i lokalni filter ostaju. Završna isporuka zadržava funkcionalni filter i traži objašnjenje, GitHub i izmenu uživo.

## Postojeći rad i kompatibilnost

Dan 1 i 2 zadržavaju iste ID-jeve, zahteve, kvizove i rubriku. Novi objedinjeni zadaci imaju nove ID-jeve, pa stari prolaz ne daje automatski prolaz za nov zadatak. Stari rad se ne briše iz baze; stare pojedinačne etape nisu u studentskoj putanji, ali stari API ID ostaje dostupan za izvoz rada. Originalni moduli course.mjs i day-two.mjs ostaju za kasnije dopune.

Za nadogradnju prvo zaustavi stari server i kopiraj data/ kao rezervu. Novu verziju raspakuj posebno, pa po potrebi prenesi kopiju data/; ne prepisuj bazu dok server radi. Za čist test nemoj prenositi staru bazu i koristi novi Chrome profil.

## Izvoz i uvoz za VS Code

- HTML/CSS etapa: index.html i styles.css u korenu ZIP-a.
- Etape sa novom stranicom: dodaj katalog.html.
- JS etape: dodaj script.js; četvrti dan dodaj i katalog.html.
- Resursi assets/ već postoje u platformi. Proizvoljan upload slika i npm projekata nije deo pilota.
- ZIP do 2 MB; svaka kodna datoteka do 100.000 znakova. Uvoz sam ne dodeljuje prolaz.
- Tailwind izvoz uključuje gotov tailwind.css sa klasama iz obe HTML stranice. Za nove klase u lokalnom izvozu ponovi uvoz/izvoz ili podesi lokalni Tailwind build.

JS etape su kontrolne tačke na istoj prodavnici sa pripremljenim HTML/CSS-om. Njihov kod se ne prenosi automatski u naredni HTML/CSS zadatak. Postojeći studentski rad se ne prepisuje; nastavnik može izabrati koje lokalne izmene student spaja u završnu verziju. Ovo sprečava da JS greška blokira učenje rasporeda.

## Čuvanje i prelazak sa ranije verzije

Zaustavi stari server, kopiraj ceo data/ direktorijum kao rezervu, raspakuj novu aplikaciju u novi direktorijum i po potrebi prenesi bazu u novi data/. Koristi isti Chrome profil i istu adresu. Ne prepisuj bazu dok server radi.

Sačuvanih 40 ID-jeva i rubrika 0.3.0 ostaju stabilni. Kod, prolazi po toj rubrici, pomoć, kvizovi i vreme ostaju vezani za istu lekciju, iako je ona sada drugog dana i drugog rednog broja. Stariji prolazi po drugim rubrikama mogu tražiti novu proveru kao ranije. Reset briše samo izabranu etapu uz potvrdu; kvizovi i aktivno vreme se ne brišu. JSON izvoz napretka nije potpuna restauracija naloga.

Probni nalog koristi HttpOnly kolačić: localhost i 127.0.0.1 su različite adrese. Novi privatni profil dobija drugi nalog. GitHub prijava i nastavnički nalog još nisu implementirani.

## Teme, aktivno vreme i kvizovi

VS Code sličan interfejs i Monaco imaju svetlu/tamnu temu koja se pamti. Studentska stranica zadržava sopstvene boje. Postoji i jednostavan editor.

Aktivno vreme raste dok je prozor vidljiv/fokusiran i bilo je interakcije u poslednjih 60 sekundi. Ručna pauza, gubitak fokusa, skrivena kartica i uspavljivanje zaustavljaju brojanje. Sinhronizacija je približno svakih 10 sekundi; preklopljene kartice ne udvostručuju vreme. Vreme je procena aktivnosti u platformi, ne dokaz pažnje/samostalnosti; spoljni VS Code se ne meri pouzdano. Naglo zatvaranje može izgubiti poslednji nesinhronizovani interval.

Svaka etapa ima formativni kviz sa četiri opcije, jednim tačnim odgovorom, nagoveštajem i objašnjenjem posle predaje. Predati odgovori i rezultati čuvaju se u SQLite-u; nezavršeni izbori se ne čuvaju. Kviz sam ne daje praktičan prolaz i nema obavezno ponavljanje.

## Izvršavanje i granice provera

Običan HTML/CSS pregled ostaje pasivan. Samo četiri označene JS etape podržavaju script.js i ručno pokretanje. Server parsira i priprema kod, ali ga ne izvršava. Izvršavanje i DOM provere odvijaju se u sandbox okviru bez same-origin, formulara i mrežnog pristupa. Česte beskonačne petlje i rekurzije imaju ubačenu zaštitu; postoji i prekid čekanja. Ovo nije potpuna zaštita od namernog iscrpljivanja resursa.

JS rezultate prijavljuje pregledač. Server veže jednokratan pokušaj za profil, lekciju i neizmenjen kod, ali klijentska prijava nije pouzdan ispitni dokaz protiv namernog falsifikovanja. Nema serverskog izvršavanja proizvoljnog JS-a. Za učionički ispit potreban je zaseban izvršni servis i nastavnikova provera.

HTML/CSS testovi proveravaju ciljna svojstva i osnovne zahteve. Raspored meri geometriju u korisnikovom pregledaču na pet širina, ali se rezultat ne čuva i ne dodeljuje praktičan prolaz. Izgled, zoom, tastatura i samostalna izmena proveravaju se ručno. Aktuelna Chrome vizuelna provera nije završena u ovom okruženju; automatski JSDOM/API testovi nisu vizuelno testiranje.

Glavna pretraga, puna korpa, prava porudžbina, backend i React nisu implementirani. JS primeri rade u jasno označenoj sekciji projekta. Posle četiri dana slede detaljniji JS, ES6 priprema za React, DOM/događaji, pa asinhroni JS i json-server.

## Izvori i neaktivna rezerva

- HTML/CSS: objedinjene srpske adaptacije FCC tema; izvori u curriculum/source-map.json.
- Uvodni JS: novi primeri eProdavnice sa referentnim temama iz https://github.com/jetbrains-academy/javascript-course. Ovo nije uvoz celog JetBrains kursa ni pun prevod njegovih zadataka.
- Originalni izvori i licence: PROVENANCE.md, vendor/ i public/lesson-images/.
- Kompletna neaktivna FCC RWD v9 rezerva ostaje: 158 celina, 1.553 koraka, 1.714 originalnih datoteka. Nije u studentskom API-ju ni dostupna preko HTTP-a.
- Prezentacije za Dan 1 i 2 isporučene su zasebno. Ovaj paket ažurira aplikaciju, ne PPTX.

## Razvoj

    npm run dev
    npm run verify

Verify radi TypeScript, sve automatske testove i produkcioni build. Posle promena servera ponovo ga pokreni. Drugi port: npm start -- --port 4174. Podrazumevano se sluša samo 127.0.0.1.


## Sve aktivne etape

### Dan 1 — Prva stranica, box model i prvi klik

Razumeš cilj, napišeš HTML/CSS karticu i povežeš prvo dugme sa JavaScriptom.

| Br. | Tema | ID | Rad bez kviza | Kviz |
|---|---|---|---:|---:|
| 1 | Prva stranica, prvi red koda | 01 | 10 min | 2 min |
| 2 | Proizvodi, slike i veze | 02 | 20 min | 2 min |
| 3 | Semantika prodavnice | 03 | 20 min | 2 min |
| 4 | CSS: od selektora do cene | 04 | 15 min | 2 min |
| 5 | Kartica i model kutije | 05 | 65 min | 4 min |
| 6 | Čitljiva stranica proizvoda | 15 | 20 min | 2 min |
| 7 | Jedinstven izgled: CSS promenljive | 16 | 20 min | 2 min |
| 8 | Prvi klik: HTML, CSS i JavaScript zajedno | js-01 | 45 min | 2 min |

Uvod se dodaje posebno: 60 minuta.

### Dan 2 — Forme, tabele, responsive i obračun

Praviš upotrebljiv formular i tabelu, prilagođavaš sadržaj telefonu i računaš iznos.

| Br. | Tema | ID | Rad bez kviza | Kviz |
|---|---|---|---:|---:|
| 1 | Prvi formular porudžbine | 06 | 25 min | 2 min |
| 2 | Dostava, izbori i grupisanje | 07 | 25 min | 2 min |
| 3 | Validacija i vidljiv fokus | 08 | 25 min | 2 min |
| 4 | Tabela karakteristika | 09 | 20 min | 2 min |
| 5 | CSS za pregledne podatke | 10 | 15 min | 2 min |
| 6 | Slike različitih proporcija | 17 | 20 min | 2 min |
| 7 | Responsive 1: prvo telefon | 18 | 25 min | 2 min |
| 8 | Responsive 2: prilagodljive dimenzije | 19 | 25 min | 2 min |
| 9 | Responsive 3: pronađi uzrok prelivanja | 20 | 25 min | 2 min |
| 10 | Oznaka Akcija i lepljivo zaglavlje | 21 | 20 min | 2 min |
| 11 | Promotivna sekcija: SVG, iframe i animacija | 22 | 30 min | 2 min |
| 12 | Količina i ukupan iznos porudžbine | js-02 | 70 min | 2 min |

### Dan 3 — Flexbox i Grid u jednom danu

Razumeš ose, veličine, prelamanje, mrežu i prikaz niza proizvoda.

| Br. | Tema | ID | Rad bez kviza | Kviz |
|---|---|---|---:|---:|
| 1 | Flexbox: ose, poravnanje i razmak | layout-01 | 40 min | 2 min |
| 2 | Flexbox: veličine, prelamanje i dugačak sadržaj | layout-02 | 45 min | 4 min |
| 3 | Kartica i popravka Flex zaglavlja | layout-03 | 30 min | 2 min |
| 4 | Grid: kolone i prilagodljiva mreža proizvoda | layout-04 | 45 min | 4 min |
| 5 | Grid: istaknuta kartica i oblasti stranice | layout-05 | 35 min | 2 min |
| 6 | Grid i Flex zajedno: provera stvarnog sadržaja | layout-06 | 40 min | 2 min |
| 7 | Od objekta proizvoda do HTML kartice | js-03 | 55 min | 2 min |

### Dan 4 — Tailwind, Bootstrap i završna isporuka

Primenjuješ Flex/Grid kroz Tailwind, praviš novu stranicu, porediš Bootstrap i povezuješ lokalni filter.

| Br. | Tema | ID | Rad bez kviza | Kviz |
|---|---|---|---:|---:|
| 1 | Tailwind: kartica, formular i stanja | tw-01 | 45 min | 2 min |
| 2 | Tailwind: Flex, Grid i responsive klase | tw-02 | 35 min | 2 min |
| 3 | Nova Tailwind stranica od praznih datoteka | 2-16 | 50 min | 2 min |
| 4 | Stvarni sadržaj, tastatura i popravka rasporeda | 2-17 | 30 min | 2 min |
| 5 | Bootstrap: isti katalog sa gotovim klasama | bootstrap-01 | 30 min | 2 min |
| 6 | Prvi filter kataloga: podaci, uslov i događaj | js-04 | 55 min | 2 min |
| 7 | Završna isporuka: projekat, GitHub i odbrana | delivery-01 | 45 min | 2 min |
