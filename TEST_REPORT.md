# Provera 0.6.0 — 24. oktobar 2026.

Prethodni izveštaji ispod ovog odeljka opisuju prethodne verzije. Aktuelna putanja ima 34 etape i 71 pitanje.

## Aktuelna provera

Prošlo: TypeScript, svih 143 automatskih testova i produkcioni build. Provere obuhvataju referentna/početna rešenja, JS interakcije uključujući završnu isporuku, API, SQLite, React/JSDOM navigaciju, lokalni Bootstrap izvoz/pregled i čuvanje ranijeg rada. Produkcioni API vraća verziju 0.6.0, 34 etape, 71 pitanje i ispravne dnevne procene. Početna stranica i obrazac testiranja preko HTTP-a vraćaju 200. JSDOM provera obrasca potvrđuje devet redova, deset kontrolnih stavki, sabiranje vremena i čuvanje beležaka.

## Granice

JSDOM nije vizuelna provera u Chrome-u. Izgled i početničko trajanje proverava korisnik prema public/testiranje-dan-1.html. Nema procene da je 293 minuta potvrđeno početničko vreme.

---

# Izdanje 0.5.0 — četiri dana pre Reacta

Datum: 23. oktobar 2026.

- TypeScript, svih **127 automatskih testova** i produkcioni build prolaze. Ostaje upozorenje o veličini Monaco bundle-a.
- Sva 40 postojeća ID-ja ostaju, a dodata su 4 JS ID-ja. Raspodela: 8/12/13/11 etapa po danima, uz 96 pitanja. Provere potvrđuju očuvanje postojećeg koda, pomoći i prolaza po istoj rubrici 0.3.0.
- Svako od četiri JS referentna rešenja prolazi izvršavanje DOM interakcije u JSDOM-u; početni primeri ne prolaze. Provereni su klik, input/obračun, niz i prikaz kartica, checkbox/filter i kasnija interakcija posle čitanja.
- JS API proverava jednokratni pokušaj vezan za korisnika/lekciju/isti kod, odbija ponovnu upotrebu i izmenjen kod, čuva script.js i izvozi/uvozi povezani projekat. Klijentski rezultat je označen browser-reported; to nije zaštićen ispitni dokaz.
- Provereni su blokada umetnutih script/onerror elemenata, nonce/CSP bez mreže i česte beskonačne petlje/sintaksne greške. Server parsira, ali ne izvršava studentski JS. AST zaštita nije potpuna izolacija resursa.
- React/JSDOM integraciona provera prikazuje stvarni početni uvod, četiri dana i JS datoteku, ubacuje rešenje, pokreće JS pokušaj, prosleđuje rezultat okvira u API i potvrđuje sačuvan prolaz i prelazak na naredni dan. Ispravljena je trka u navigaciji pri promeni dana i sporijem učitavanju demonstracije.
- Lokalni produkcioni HTTP server vraća početnu 200, appVersion 0.5.0, četiri dana, 44 etape, 96 pitanja, obavezan preduslov za React i JS dokument sa dve kontrolisane nonce skripte. Rezerva vraća 404.
- FCC rezerva ostaje celovita i nedostupna preko HTTP-a. Pun dogovoreni Flex/Grid sadržaj je zadržan.

## Granice provere

JSDOM ne zamenjuje Chrome prikaz niti verifikuje stvarno browser sandbox/CSP izvršavanje. Lokalno ručno proveriti sve četiri JS interakcije, Monaco, teme, navigaciju, box model, Flex/Grid laboratorije, geometriju na pet širina, zoom, tastaturu i izvoz/uvoz. Koraci su u README-u. Izgled i samostalnost ocenjuje nastavnik. Windows/macOS pokretanje nije izvršavano ovde. Prethodni PPTX materijali nisu ponovo podeljeni u ovoj izmeni.

---

## Istorija prethodnih izdanja

# Aktuelno izdanje 0.4.0 — Dan 2

Datum: 23. oktobar 2026.

- TypeScript, svih **112 automatskih testova** i produkcioni build prolaze. Ostaje upozorenje o veličini Monaco bundle-a.
- Svih 18 novih referentnih rešenja prolazi; svih 18 novih početnih primera pada. Postojeće 22 lekcije Dana 1 ostaju proverene.
- Pokriveni su 40 etapa, 88 pitanja, zasebni ID-jevi dana, čuvanje katalog.html, ocenjivanje odabrane datoteke, ZIP izvoz/uvoz obe stranice i Tailwind klasa koje postoje samo na novoj stranici.
- Proverena je sanitizacija studentskih skripti, CSP/nonce fiksne skripte za merenje i pasivan običan pregled. Browser geometrija nije izvršena u automatizovanom Chrome-u.
- Celovitost FCC rezerve proverena je postojećim testovima; ostaje nedostupna preko HTTP-a.
- PPTX Dana 2: 120 slajdova, 5 nativnih tabela, 40 kviz pitanja, puna rešenja i objašnjenja u beleškama. Prošle su provere paketa, geometrije i fontova; svih 120 slajdova renderovano je i vizuelno pregledano. Nije otvaran u Microsoft PowerPoint-u.

## Obavezna lokalna ručna provera

U Chrome-u proveriti izbor dana, Monaco, obe teme, stvarne Flex/Grid/container laboratorije, merenje na pet širina, zoom 200%, tastaturu, višestranični izvoz i uvoz. Rezultati merenja u platformi nisu sačuvani praktični prolazi. Koraci su u README-u. Windows/macOS pokretanje nije izvršavano ovde.

---

Prethodni izveštaji odnose se na tadašnje verzije:

# Dopuna 0.3.1 — kvizovi

- Dodata 22 kviza sa 48 pitanja i procenom dodatnih 47 minuta. Kviz ne menja praktičnu rubriku niti dodeljuje praktični prolaz.
- Testovi proveravaju strukturu svih pitanja, referentne odgovore, odsustvo ključa i objašnjenja pre predaje, odbijanje nepotpunog unosa, ocenu pogrešnih/ispravnih odgovora, broj pokušaja i najbolji rezultat.
- Provereni su odvajanje profila, odbijanje nepoznate lekcije i stranog origin-a, JSON izvoz, upornost kroz ponovno otvaranje baze i čuvanje kviza posle resetovanja koda.
- TypeScript, 73 automatska testa i produkcioni build prolaze. Vizuelni prikaz kartice, radio opcije, fokus tastature i obe teme ostaju za ručnu lokalnu Chrome proveru. JSDOM/API testovi nisu vizuelna provera.

---

# Dopuna 0.3.0 — završetak Dana 1

Datum: 23. oktobar 2026.

- TypeScript, svih **70/70 automatskih testova** i produkcioni build prolaze. Ostaje upozorenje o veličini Monaco bundle-a.
- Svih 22 referentna rešenja prolaze, svih 22 početna primera padaju.
- Novi testovi pokrivaju račun dimenzija za oba box-sizing režima, graničnu širinu manju od padding-a/ivica, direktno pogrešan box-sizing i longhand padding koji pregažava ispravan shorthand.
- Provereno je da svih deset slika u lekcijama ima lokalnu datoteku, opis, izvor i licencu. Rezervni FCC sadržaj ostaje netaknut i nedostupan studentima preko HTTP-a.
- Dodatne HTML/form/table provere uključene su u referentne i početne primere.
- Vizuelno ponašanje laboratorije, ResizeObserver merenja, slike i obe teme treba potvrditi lokalno u Chrome-u koracima iz README-a. Automatski JSDOM testovi ne mere stvarni browser raspored. Aktuelno ručno Chrome testiranje nije završeno zbog ograničenja dostupnog preglednika.
- Produkcioni HTTP handler vraća verziju 0.3.0, 22 lekcije, laboratoriju i svih deset slika sa odgovarajućim tipovima sadržaja. Licenca i manifest su dostupni; rezerva vraća 404.
- Detaljan PPTX pripremljen je odvojeno: 107 slajdova za sve 22 etape, sa 18 slajdova modela kutije. Struktura paketa, geometrija i fontovi prošli su proveru. Svi slajdovi renderovani su i vizuelno pregledani. Nije izvršeno otvaranje u Microsoft PowerPoint-u.

---

# Dopuna 0.2.1 — Dan 1: teme i aktivno vreme

- Dodate su VS Code slične svetla i tamna tema celog interfejsa i standardne Monaco vs/vs-dark teme. Izbor se čuva lokalno i ne menja studentski pregled.
- Merenje aktivnosti ima serverom ograničene intervale, ponovljive poruke bez dupliranja i zaštitu od preklapanja više kartica.
- Testovi pokrivaju idle, skrivenu karticu, gubitak fokusa, ručnu pauzu, uspavljivanje, promenu zadatka, ponovno otvaranje baze i odvajanje profila. Poseban React/JSDOM test proverava povezivanje frontend merača sa API porukama.
- Aktuelno: svih 67 automatskih testova, TypeScript i produkcioni build prolaze.
- Vizuelni izgled obe teme i stvarno ponašanje fokus/visibility događaja u Chrome-u ostaju za lokalnu ručnu proveru. React/JSDOM provera ne zamenjuje vizuelni test.
- Nastavni sadržaj Dana 1 ostaje 22 zadatka. Promena izgleda ne poništava prolaze po istoj rubrici 0.2.0. Plan Dana 2 je u README-u i nije registrovan u studentskoj putanji.

---

# Izveštaj o proveri — 0.2

Datum: 23. oktobar 2026. Okruženje: Linux, Node.js 24.19.0.

## Aktuelno izdanje

- TypeScript provera prolazi.
- Svih **61/61 automatskih testova** prolazi.
- Produkcioni build prolazi; ostaje prethodno upozorenje o većem Monaco bundle-u.
- Svih 22 referentna rešenja prolaze; nijedan početni primer ne dobija lažni prolaz.
- Provereni su pogrešan breakpoint, kasnije pravilo u media bloku, preširoka kartica i nedostajući reduced-motion upit.
- Sve tri slike postaju lokalni resursi u pregledu. Samo pripremljeni lokalni promotivni iframe prikazuje se u dozvoljenim lekcijama; spoljni iframe i proizvoljni srcdoc se uklanjaju.
- ZIP izvozi sve tri slike, lokalni promo.html, HTML/CSS i README; Tailwind izvoz uključuje generisani CSS. Izvezeni HTML/CSS ponovo prolaze proveru.
- Preuzimanje praznih datoteka za intervju ne menja sačuvani rad.
- Stari ID-jevi ostaju stabilni, novi redosled je poseban podatak. Stari kod se čuva, dok prolaz po starim zahtevima traži novu proveru.
- Produkcioni server zaista je pokrenut na lokalnom HTTP portu: početna stranica, verzija 0.2.0, 22 lekcije i sva četiri lokalna resursa vraćaju očekivane odgovore. Rezerva vraća 404.
- Referentni HTML nema duplirane ID-jeve. Demo ima tri proizvoda i FAQ.
- SHA-256 provera svih 1.714 originalnih FCC datoteka prolazi; svi 1.553 izvorna koraka ostaju sačuvani i rezerva je nedostupna preko HTTP-a u oba režima.

## Granice aktuelne provere

Aktuelna vizuelna provera kroz Chrome nije završena: dostupni preglednik odbio je ponovno učitavanje zbog pravila okruženja. Nije pokušano zaobilaženje te zabrane. Automatske provere DOM-a, HTTP-a i ciljnih CSS deklaracija ne mere stvarni raspored niti dokazuju odsustvo prelivanja pri svim širinama i zoom-u.

Lokalno u Chrome-u treba potvrditi: 360/540/768/980/1280px, zoom 200%, tastaturu i skip link, odsecanje slika, visinu lepljivog zaglavlja, prikaz lokalnog iframe-a i reduced motion. Tačni koraci su u README.md. Originalni FCC studentski testovi u rezervi nisu izvršavani.

Prethodne ručne UI provere ispod odnose se samo na verziju 0.1.

---

# Istorija provera — verzija 0.1

Datum: 23. oktobar 2026.
Okruženje: Linux, Node.js 24.19.0, Chrome za proveru interfejsa.

## Automatski

Npm run verify je završen uspešno:

- TypeScript: prolaz.
- Testovi: **35/35 prolazi**.
- Produkcioni build: prolaz.

Pokriveno:

- Svih 14 referentnih rešenja prolazi.
- Nijedan početni kod ne dobija lažni prolaz.
- Kasnija pogrešna CSS deklaracija se prepoznaje.
- Tailwind se kompajlira, a stari CSS ne može prikriti obaveznu preradu.
- Studentske skripte se ne izvršavaju; aktivni sadržaj se uklanja iz preview-a.
- Čuvanje, prolaz, evidencija pomoći i revizije rade preko API-ja.
- Drugi probni korisnik ne dobija tuđe kodne datoteke.
- Zastarela revizija se odbija sa 409.
- SQLite rad i prolaz ostaju posle zatvaranja i ponovnog otvaranja servera.
- Reset je ograničen na izabrani zadatak.
- ZIP odgovor sadrži lokalnu sliku i kompajliran Tailwind.
- Ponovno ocenjivanje izvezenog HTML/CSS-a prolazi.

Produkcioni server proverен je i kroz njegov HTTP handler: početni HTML vraća 200 sa text/html tipom.

## Interfejs — ručno kroz Chrome

Potvrđeno:

- Početni ekran i demonstracija eProdavnice.
- Monaco editor i alternativa preko običnog tekstualnog polja.
- Neuspešni testovi praznog zadatka.
- Prvi nagoveštaj i objašnjeno rešenje.
- Ubacivanje rešenja i prolaz prvog zadatka.
- Sačuvani kod i napredak posle osvežavanja.
- Promena koda, čuvanje i prelazak u drugi zadatak.
- Stvarni Tailwind prikaz: p-6 daje 24px padding.
- Slika u preview-u je učitana.
- Uvoz ZIP datoteke kroz file chooser i ponovni prolaz testova.
- Otvaranje Git/GitHub vodiča.

## Dopuna: neaktivna FCC rezerva (23. oktobar 2026.)

- TypeScript provera, svih 38 automatskih testova i produkcioni build prolaze.
- Svih 1.553 koraka iz izvornog challengeOrder postoji; svih 1.714 sačuvanih izvornih datoteka odgovara SHA-256 popisu.
- Studentski API i dalje vraća istih 14 aktivnih ID-jeva. Rezerva nije deo studentskog sadržaja.
- HTTP pristup rezervi vraća 404 i u produkcionom i u razvojnom režimu, uključujući kodiranu putanju i Vite /@fs putanju.
- Originalni FCC studentski testovi nisu izvršavani; proverena je celovitost njihovih izvornih datoteka. Prethodna ručna UI provera odnosi se na postojeći interfejs; ova dopuna ga ne menja.

## Granice provere

- ZIP sadržaj i HTTP odgovor provereni su automatski. Završetak preuzimanja nije potvrđen kroz download događaj ugrađenog cloud pregledača. To je stavka za prvi lokalni Chrome test.
- Windows/macOS skripte su pripremljene; izvršavanje je proveravano na Linux-u, ne na tim operativnim sistemima.
- Šira učionica, nalog preko GitHub-a i produkciono opterećenje nisu deo ovog pilota.
- Automatski CSS testovi nisu potpuna vizuelna provera svih ravnopravnih rešenja.
- Postoji upozorenje o većem Monaco bundle-u; build uspeva, editor se učitava odvojeno.

## HTTP provera 0.4.0

Produkcioni server pokrenut je na lokalnom HTTP portu: početna 200, appVersion 0.4.0, 40 lekcija (22/18), kviz pitanja 48/40. Običan katalog pregled nema script elemente, dokument merenja ima samo jednu skriptu platforme. HTTP pristup rezervi vraća 404.
