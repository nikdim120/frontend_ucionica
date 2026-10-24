# Neaktivna freeCodeCamp HTML/CSS rezerva

Kompletan engleski izvorni sadržaj superbloka `responsive-web-design-v9` iz https://github.com/freeCodeCamp/freeCodeCamp, commit `2b283a9ac933093d354e697f2fe5a61033da2991`.

Sačuvano je 158 celina, 1.553 uređena koraka i 1.714 izvornih datoteka. Obuhvaćeni su HTML, semantika, forme, tabele, pristupačnost, osnove računara i kompletan CSS deo, uključujući Flexbox, Grid, responzivnost i animacije. Markdown datoteke sadrže teoriju, pitanja, početni kod, testove i rešenja gde postoje u originalu. Sačuvani su redosled, engleski uvodni tekstovi i BSD-3-Clause licenca.

Originalni zapis za sertifikacioni ispit takođe je sačuvan. To nije privatna banka pitanja ni sistem za izdavanje sertifikata. Stariji Legacy Responsive Web Design kursevi i drugi sertifikati nisu deo ove rezerve.

`upstream/` prati originalne putanje bez izmena. `manifest.json` beleži commit, redosled i SHA-256 svakog izvornog fajla. `external-urls.json` popisuje spoljne veze. Slike, video i drugi udaljeni resursi nisu preuzeti: ovo je potpuna kopija navedenog izvornog nastavnog sadržaja, a ne offline kopija celog FCC sajta.

## Odvojeno od aktivne putanje

Rezerva nije prevedena ni registrovana u `curriculum/course.mjs`. Aplikacija i dalje prikazuje naše 22 srpske lekcije. Server ne učitava rezervu; direktorijum nije deo `public/` ili `dist/`. HTTP pristup je blokiran u produkcionom i razvojnom režimu. Originalni FCC testovi nisu izvršeni u našem pilotu: njihovo kasnije uključivanje zahteva prilagođavanje okruženja.

## Kasnije uključivanje pojedinih delova

1. Izaberi celinu iz manifest.json; originalni redosled je u upstream/curriculum/structure/blocks/.
2. Prevedi izabrano gradivo na srpski uz engleske termine u zagradama. Rezervu ostavi neizmenjenu.
3. Napravi aktivnu lekciju sa početnim fajlovima i proverama u našem formatu. Zabeleži izvorni ID i commit u mapi izvora.
4. Proveri rešenje, početni kod i ručni prolazak, pa registruj lekciju u aktivnoj putanji.

Za svesno osvežavanje iz lokalnog FCC checkout-a: `python3 scripts/snapshot-fcc-reserve.py /putanja/do/freeCodeCamp`. Ovo se nikada ne izvršava pri instalaciji, pokretanju ili build-u aplikacije. Novo izdanje prvo pregledaj; broj koraka u testu rezerve namerno je vezan za ovu verziju.
