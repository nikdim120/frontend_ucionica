# Poreklo i izmene

Samostalni SQLite pilot sa delovima i nastavnim izvorima freeCodeCampa. Nije potpuna migracija njegove aplikacije, Gatsby klijenta ili MongoDB API-ja.

## freeCodeCamp

- Izvor: https://github.com/freeCodeCamp/freeCodeCamp
- Commit: 2b283a9ac933093d354e697f2fe5a61033da2991
- BSD-3-Clause licenca: vendor/FREECODECAMP-LICENSE.md.
- Vendor sadrži neizmenjene primere lab-business-card, lab-checkout-page i lab-book-catalog-table za poređenje.
- Lekcije su nove objedinjene srpske adaptacije, ne prevod svih koraka. Curriculum/course.mjs navodi sadržajne izvore svake lekcije.
- Testovi su novi deklarativni testovi, ne kompletan skup originalnih FCC testova.

## CSSHelp

- Izvor: https://github.com/freeCodeCamp/curriculum-helpers
- Commit: fcb1a05b930f64f3e06a59a41ec903fe0f64082a
- Izvorna datoteka: packages/helpers/lib/index.ts.
- Vendor/css-help.mjs sadrži izdvojenu i transpajlovanu CSSHelp klasu.
- Globalni CSSRule zamenjen je dokumentovim defaultView.CSSRule za izolovane JSDOM dokumente.
- GetIsDeclaredAfter je ekvivalentna izdvojena pomoćna funkcija bez globalnog browser objekta.
- Runner koristi getCSSRules i nad njim čita relevantne deklaracije.
- Licenca: vendor/CURRICULUM-HELPERS-LICENSE.

## Ostalo

Monaco, React, Fastify i Tailwind zadržavaju licence svojih npm paketa. Slika slušalica je originalna SVG ilustracija napravljena za pilot. UI, API, SQLite šema, srpski tekstovi i provere su novi rad.

Verzije su zaključane u package-lock.json. Originalni repozitorijumi nisu potrebni za pokretanje ZIP paketa.

## Kompletna neaktivna RWD v9 rezerva

`reserve/freecodecamp-responsive-web-design-v9/upstream/` sadrži neizmenjene git datoteke sa istog FCC commit-a navedenog iznad. Svih 158 celina ima sve korake iz challengeOrder: 1.553 Markdown koraka. Uz metapodatke celina, superblok, engleski intro.json i licencu sačuvano je 1.714 izvornih datoteka. SHA-256 popis je u manifest.json. Rezerva nije aktivni prevod ni izvršiva FCC aplikacija. Spoljni mediji nisu lokalno arhivirani. Originalna licenca je u upstream/LICENSE.md.

## Verzija 0.2 — proširena aktivna putanja

Osam novih srpskih lekcija objedinjeno obrađuje tipografiju, relativne jedinice, CSS promenljive, slike, tri responsive etape, pozicioniranje i SVG/iframe/animaciju. Postojeće lekcije dopunjene su FAQ-om, pristupačnošću, metapodacima i stanjima kontrola. Nove lekcije navode odgovarajuće FCC blokove u source-map.json. Tekstovi i deklarativni testovi su nove adaptacije, ne doslovan prevod originalnog toka. Tastatura.svg, ranac.svg i promo.html su originalni lokalni nastavni primeri. Sačuvana FCC rezerva i njene izvorne datoteke nisu menjane.


## Verzija 0.3 — model kutije i slike u lekcijama

Deset neizmenjenih PNG/JPEG ilustracija preuzeto je iz zvaničnog freeCodeCamp/cdn repozitorijuma (build/curriculum/), 23. oktobra 2026. Pojedinačne raw/CDN adrese i SHA-256 su u public/lesson-images/sources.json. BSD-3-Clause licenca CDN repozitorijuma sačuvana je kao FCC-CDN-LICENSE.txt; kredit je vidljiv uz slike u lekcijama. Licenca rezervnog nastavnog koda ostaje odvojena i nije menjana.

Interaktivni BoxModelLab, računi dimenzija, nove srpske dopune i testovi su novi rad. Laboratorija koristi ResizeObserver i stvarne dimenzije elementa; spoljni razmak prikazuje simulirano i to je objašnjeno u interfejsu. Deklarativne provere proširene su computed stilom kartice. To nije kompletan test browser geometrije.

## Verzija 0.4 — Dan 2

Curriculum/day-two.mjs i day-two-quizzes.mjs sadrže 18 novih srpskih objedinjenih lekcija i 40 novih pitanja. Izvori su navedeni uz svaku lekciju i u source-map.json. Flex/Grid teme prate FCC blokove; container queries, Tailwind i alati dopunjeni su zvaničnim MDN/Tailwind/Chrome/Git izvorima. Ovo nisu originalni FCC testovi niti doslovan prevod svih njegovih koraka.

Flex/Grid/container laboratorije, referentne skice, merenje rasporeda, podrška za katalog.html i novi testovi su novi rad. Slike proizvoda i postojeće FCC ilustracije ponovo se koriste sa prethodnim licencama. Rezervnih 1.714 originalnih datoteka nije menjano. Prezentacija Dana 2 isporučuje se odvojeno i sadrži izvore u beleškama.

## Verzija 0.5 — četiri dana i uvodni JavaScript

Catalog.mjs raspoređuje svih 40 postojećih ID-jeva kroz četiri dana uz neizmenjene osnovne rubrike. Četiri nove JS etape i osam pitanja su novi srpski primeri iste eProdavnice. Teme su povezane sa zvaničnim JetBrains Academy javascript-course sekcijama Introduction, Variables, Data Types, Operators, Conditional Statements, Functions, Data Structures i Loops. Ovo nije kopija celog JetBrains kursa, izvornih testova ili IDE integracije. Povezivanje sa DOM-om, tekstovi, kvizovi i testovi su novi rad.

CourseIntro, dnevni ciljevi i obrazloženja, kriterijumi preduslova za React, izolovan browser JS runner i povezivanje script.js sa izvozom su novi rad. TypeScript parser se koristi bez izvršavanja studentskog koda na serveru. FCC rezerva i ilustracije ostaju po prethodnim licencama.


## Izdanje 0.6.0 — sažeta putanja i Bootstrap

Novi curriculum/accelerated-layout.mjs objedinjuje prethodne srpske adaptacije; originalne lekcije ostaju lokalno. Aktivne izvore navodi curriculum/source-map.json. Bootstrap CSS 5.3.8 preuzet sa https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css; originalna MIT licenca sa https://raw.githubusercontent.com/twbs/bootstrap/v5.3.8/LICENSE je u vendor/BOOTSTRAP-LICENSE.txt. Nisu uključeni Bootstrap JS ni Popper. public/testiranje-dan-1.html je naš obrazac za korisničko testiranje i beleženje vremena.
