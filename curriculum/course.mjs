// Original Serbian course. Adaptation map: source-map.json.
import {extendCourse} from './extensions.mjs';
import {finishDayOne} from './day-one.mjs';
export const courseVersion='0.3.0';
const doc = body => '<!DOCTYPE html>\n<html lang="sr-Latn">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>eProdavnica studentske opreme</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n'+body+'\n</body>\n</html>';
const heading='<h1>eProdavnica</h1>\n<p>Oprema za tvoje sledeće ideje.</p>';
const products='<ul class="categories"><li><a href="#proizvodi">Oprema</a></li><li><a href="#porudzbina">Porudžbina</a></li></ul>\n<section id="proizvodi">\n  <h2>Izdvajamo iz ponude</h2>\n  <article class="product-card">\n    <img src="/assets/slusalice.svg" alt="Bežične slušalice u maslinastoj boji">\n    <p class="eyebrow">Zvuk bez ometanja</p>\n    <h3>Studio slušalice</h3>\n    <p class="price">4.990 RSD</p>\n    <p>Udobne slušalice za učenje, rad i omiljenu muziku.</p>\n    <a href="#porudzbina">Poruči proizvod</a>\n  </article>\n</section>';
const semantic='<header>'+heading+'\n<nav aria-label="Glavna navigacija"><a href="#proizvodi">Proizvodi</a> · <a href="#porudzbina">Porudžbina</a></nav></header>\n<main>'+products+'</main>\n<footer><p>Studentska eProdavnica · nastavni projekat</p></footer>';
const baseCSS='body {\n  font-family: Arial, sans-serif;\n  color: #21332d;\n  background-color: #f6f5ef;\n  margin: 0;\n  padding: 24px;\n}\nh1 { color: #2d6548; }\na { color: #245c40; }\n.price { font-weight: bold; }\n';
const cardCSS=baseCSS+'\n* { box-sizing: border-box; }\n.product-card {\n  max-width: 380px;\n  padding: 24px;\n  margin: 24px auto;\n  border: 1px solid #d9dfd4;\n  border-radius: 16px;\n  background-color: white;\n}\n.product-card img { max-width: 100%; height: auto; border-radius: 10px; }\n';
const simpleForm='<section id="porudzbina">\n  <h2>Poruči proizvod</h2>\n  <form>\n    <label for="customer">Ime i prezime</label>\n    <input id="customer" name="customer" type="text" autocomplete="name">\n    <label for="email">Imejl adresa</label>\n    <input id="email" name="email" type="email" autocomplete="email">\n    <button type="submit">Pošalji probnu porudžbinu</button>\n  </form>\n</section>';
const extraFields='    <fieldset>\n      <legend>Način dostave</legend>\n      <label><input type="radio" name="delivery" value="courier" checked> Kurirska služba</label>\n      <label><input type="radio" name="delivery" value="pickup"> Lično preuzimanje</label>\n    </fieldset>\n    <label for="quantity">Količina</label>\n    <input id="quantity" name="quantity" type="number" min="1" max="5" value="1">\n    <label for="color">Boja</label>\n    <select id="color" name="color"><option value="olive">Maslinasta</option><option value="black">Crna</option></select>\n    <label for="note">Napomena</label>\n    <textarea id="note" name="note"></textarea>\n    <label><input type="checkbox" name="terms" required> Prihvatam uslove probne porudžbine</label>\n';
const fullForm=simpleForm.replace('    <button',extraFields+'    <button').replace('autocomplete="name"','autocomplete="name" required minlength="3"').replace('autocomplete="email"','autocomplete="email" required');
const formCSS=cardCSS+'\nform { max-width: 520px; margin: 24px 0; }\nlabel { display: block; margin-top: 12px; }\ninput:not([type="radio"]):not([type="checkbox"]), select, textarea {\n  display: block; width: 100%; padding: 10px; margin-top: 6px;\n  border: 1px solid #66766b; border-radius: 6px; font: inherit;\n}\nfieldset { margin-top: 18px; border: 1px solid #66766b; }\nbutton { padding: 12px 20px; margin-top: 18px; background: #2d6548; color: white; border-radius: 8px; cursor: pointer; }\ninput:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible {\n  outline: 3px solid #986900; outline-offset: 3px;\n}\n';
const withForm=(form)=>semantic.replace('</main>',form+'\n</main>');
const table='<section id="karakteristike">\n  <h2>Detalji koji prave razliku</h2>\n  <table>\n    <caption>Karakteristike Studio slušalica</caption>\n    <thead><tr><th scope="col">Osobina</th><th scope="col">Vrednost</th></tr></thead>\n    <tbody>\n      <tr><th scope="row">Povezivanje</th><td>Bluetooth 5.3</td></tr>\n      <tr><th scope="row">Baterija</th><td>Do 30 sati</td></tr>\n      <tr><th scope="row">Masa</th><td>220 g</td></tr>\n    </tbody>\n  </table>\n</section>';
const completeHTML=withForm(fullForm).replace('</main>',table+'\n</main>');
const tableCSS=formCSS+'\ntable { width: 100%; max-width: 640px; border-collapse: collapse; margin: 24px 0; }\ncaption { text-align: left; margin-bottom: 12px; font-weight: bold; }\nth, td { border: 1px solid #cad4c7; padding: 12px; text-align: left; }\nthead { background-color: #e3eddd; }\ntbody tr:nth-child(even) { background-color: #edf3e8; }\n';
const twHTML=completeHTML.replace('class="product-card"','class="product-card mx-auto my-6 max-w-sm rounded-2xl border border-stone-200 bg-white p-6"').replace('class="price"','class="price text-xl font-bold text-emerald-800"').replace('<form>','<form class="max-w-xl rounded-xl bg-white p-6">').replace('<button type="submit">','<button type="submit" class="rounded-lg bg-emerald-800 px-5 py-3 text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2">');
const test=(label,type,selector,value,extra={})=>({label,type,selector,value,...extra});
const exists=(label,selector,count=1)=>test(label,'exists',selector,count);
const attr=(label,selector,name,value)=>test(label,'attr',selector,value,{name});
const css=(label,selector,property,value)=>test(label,'css',selector,value,{property});
const publicSource=b=>'https://github.com/freeCodeCamp/freeCodeCamp/tree/main/curriculum/challenges/english/blocks/'+b;
const lessons=[];
function add(title,group,minutes,theory,example,requirements,hints,seed,solution,tests,blocks,explanation,tailwind=false){
 const id=String(lessons.length+1).padStart(2,'0');
 lessons.push({id,title,group,minutes,theory,example,requirements,hints,seed,solution,tests,sources:blocks.map(b=>({label:b,url:publicSource(b)})),explanation,tailwind});
}
add('Prva stranica, prvi red koda','HTML osnove',10,
 ['HTML opisuje sadržaj i njegovu strukturu. Element (element) najčešće ima početnu oznaku, sadržaj i završnu oznaku.',
 'Kostur dokumenta (boilerplate) sadrži html, head i body. U head idu metapodaci, a u body sadržaj koji posetilac vidi.',
 'lang="sr-Latn" označava srpski na latinici. UTF-8 omogućava pravilan prikaz slova č, ć, š, ž i đ.'],
 '<h1>Naziv prodavnice</h1>\n<p>Kratak opis ponude.</p>',
 ['Napiši ceo dokument: <!DOCTYPE html>, html sa lang="sr-Latn", head i body.','Postavi UTF-8, viewport, smislen title i vezu ka styles.css.','U body dodaj h1 eProdavnica i pasus sa opisom.'],
 ['Počni dokumentom, a vidljiv sadržaj stavi u body.','U head dodaj meta charset, title, meta viewport i link rel="stylesheet".','Primer naslova je <h1>eProdavnica</h1>. Ostali zahtevi pripadaju kosturu dokumenta.'],
 {'index.html':'','styles.css':''},{'index.html':doc(heading),'styles.css':''},
 [test('Dokument ima HTML doctype.','doctype'),attr('Jezik dokumenta je sr-Latn.','html','lang','sr-Latn'),exists('Postoji UTF-8 meta oznaka.','meta[charset="UTF-8" i]'),exists('Postoji viewport.','meta[name="viewport"]'),exists('Postoji naslov i uvodni pasus.','h1 + p'),exists('Povezan je styles.css.','link[rel="stylesheet"][href="styles.css"]'),test('Title opisuje prodavnicu.','text','title','eProdavnica')],
 ['lecture-understanding-the-html-boilerplate','workshop-curriculum-outline'],
 'Prvo pišemo dokument od nule. Head opisuje stranicu, a body sadrži naslov i pasus. Stylesheet je povezan pre nego što počnemo da ga pišemo.');
add('Proizvodi, slike i veze','HTML osnove',15,
 ['Slika (image) koristi src kao putanju, a alt kao tekstualnu alternativu. alt opisuje informaciju, ne naziv datoteke.',
 'Lista (list) ima ul ili ol i li stavke. Veza (link) koristi href. Vrednost #porudzbina vodi na element sa tim ID-jem.',
 'Relativne putanje zavise od položaja HTML datoteke. U našem editoru slika je već dostupna u assets/slusalice.svg.'],
 '<a href="#ponuda">Pogledaj ponudu</a>\n<img src="/assets/slusalice.svg" alt="Opis proizvoda">',
 ['Dodaj listu sa najmanje dve kategorije i linkovima.','Napravi section id="proizvodi" sa podnaslovom.','Dodaj article class="product-card": sliku /assets/slusalice.svg, opisni alt, h3, cenu class="price" i vezu ka #porudzbina.'],
 ['Ul mora imati li stavke. Unutar svake može biti a.','Slika, naslov i cena pripadaju istom article elementu.','Koristi href="#porudzbina" za link koji će kasnije voditi do formulara.'],
 lessons[0].solution,{'index.html':doc(heading+'\n'+products),'styles.css':''},
 [exists('Postoje najmanje dve kategorije.','ul li a',2),exists('Postoji sekcija proizvoda.','section#proizvodi'),exists('Proizvod ima naslov.','article.product-card h3'),attr('Putanja slike je /assets/slusalice.svg.','.product-card img','src','/assets/slusalice.svg'),test('Slika ima opisni alt.','nonemptyAttr','.product-card img','alt'),exists('Proizvod ima cenu.','.product-card .price'),exists('Veza vodi do porudžbine.','.product-card a[href="#porudzbina"]')],
 ['workshop-cat-photo-app','lab-travel-agency-page'],
 'Article objedinjuje jedan proizvod. Slika nosi informativni alt, a cena ima klasu kako bi je CSS kasnije ciljao. Fragment veze povezujemo sa formularom u narednim etapama.');
add('Semantika prodavnice','HTML osnove',10,
 ['Semantički HTML (semantic HTML) govori šta neki deo sadržaja predstavlja. Header je uvod, nav je navigacija, main glavni sadržaj, a footer podnožje.',
 'Article predstavlja samostalnu celinu poput proizvoda. Section grupiše tematski povezani sadržaj i obično ima naslov.',
 'Klasa (class) može se ponavljati. ID identifikuje jedan element u dokumentu i koristi se za odredište linka.'],
 '<header><h1>Prodavnica</h1></header>\n<main><section><h2>Ponuda</h2></section></main>',
 ['Organizuj dokument pomoću header, nav, jednog main i footer.','Glavni naslov je u header, a proizvodi u main.','Navigacija sadrži veze ka proizvodima i porudžbini; article proizvoda ostaje sačuvan.'],
 ['Zadrži postojeće proizvode i premesti ih u main.','Nav je deo header-a i sadrži najmanje dve veze.','Posle main dodaj footer sa kratkom napomenom o nastavnom projektu.'],
 lessons[1].solution,{'index.html':doc(semantic),'styles.css':''},
 [exists('Naslov je u zaglavlju.','header h1'),exists('Navigacija ima dve veze.','nav a',2),test('Postoji tačno jedan main.','count','main',1),exists('Proizvod je u glavnom sadržaju.','main article.product-card'),exists('Postoji podnožje.','footer p')],
 ['lecture-importance-of-semantic-html','lab-event-hub'],
 'Promena strukture nije isto što i promena izgleda. Semantički elementi ostaju korisni čak i kada nema CSS-a. Na odbrani objasni zašto proizvod ima article.');
add('CSS: od selektora do cene','CSS osnove',15,
 ['CSS pravilo (rule) čine selektor i deklaracije: svojstvo (property) i vrednost (value). Selektor .price cilja elemente sa klasom price.',
 'Kaskada (cascade) odlučuje koje pravilo pobeđuje. U jednostavnom slučaju iste specifičnosti kasnije pravilo ima prednost.',
 'Font i boja često se nasleđuju od roditelja. U Chrome DevTools otvori Elements → Styles i pronađi primenjeno pravilo.'],
 '.price {\n  color: #245c40;\n  font-weight: bold;\n}',
 ['U styles.css postavi font Arial sa sans-serif rezervom i boju teksta na body.','Postavi background-color: #f6f5ef i padding: 24px na body.','Oboji h1 i dodaj font-weight: bold na .price.'],
 ['HTML već ima link ka styles.css. Menjaš CSS datoteku.','Selektor za klasu price piše se sa tačkom: .price.','Dodaj body pravilo i zasebna pravila h1 i .price. Proveri tačku-zarez i vitičaste zagrade.'],
 lessons[2].solution,{'index.html':doc(semantic),'styles.css':baseCSS},
 [css('Body koristi Arial sa rezervnim fontom.','body','font-family','Arial'),css('Body ima zadatu pozadinu.','body','background-color','#f6f5ef'),css('Body ima padding 24px.','body','padding','24px'),css('Cena je podebljana.','.price','font-weight','bold'),test('CSS sadrži pravilo za h1.','cssRule','h1')],
 ['workshop-cafe-menu','lecture-css-specificity-the-cascade-algorithm-and-inheritance'],
 'Klasu koristimo za cenu jer takvih elemenata može biti više. Boja i font potiču od body, dok pravilo cene menja samo težinu fonta. Testovi proveravaju cilj lekcije, ne ukupan estetski izbor.');
add('Kartica i model kutije','CSS osnove',20,
 ['Model kutije (box model) sastoji se od sadržaja, padding-a, border-a i margin-e. Padding je unutar ivice, a margin izvan.',
 'Uz box-sizing: border-box, zadata širina obuhvata padding i border. Max-width ograničava širinu bez primoravanja kartice da pređe uski ekran.',
 'Slika sa max-width:100% ostaje u roditelju. Height:auto čuva njen odnos širine i visine.'],
 '* { box-sizing: border-box; }\n.card { max-width: 380px; padding: 24px; margin: 24px auto; }',
 ['Postavi box-sizing: border-box za sve elemente.','Kartica .product-card ima max-width: 380px, padding: 24px i margin: 24px auto.','Dodaj ivicu, background-color:white i border-radius:16px.','Slika u kartici ima max-width:100% i height:auto.'],
 ['Univerzalni selektor je *. Pravila kartice piši u .product-card.','Auto leva i desna margina mogu centrirati blok ograničene širine.','Za sliku upotrebi .product-card img. Izbegni fiksnu visinu koja je deformiše.'],
 lessons[3].solution,{'index.html':doc(semantic),'styles.css':cardCSS},
 [css('Uključen je border-box.','*','box-sizing','border-box'),css('Kartica ima max-width 380px.','.product-card','max-width','380px'),css('Kartica ima padding 24px.','.product-card','padding','24px'),css('Kartica ima spoljne razmake.','.product-card','margin','24px auto'),css('Kartica ima zaobljene uglove.','.product-card','border-radius','16px'),css('Slika ostaje u kartici.','.product-card img','max-width','100%')],
 ['workshop-rothko-painting','lab-business-card'],
 'Dimenzije i razmake proveri u DevTools modelu kutije. Ako je kartica šira nego što očekuješ, prvo proveri box-sizing i zbir padding-a i ivica. Ovo je blokovski raspored bez Flexboxa i Grida.');
add('Prvi formular porudžbine','Forme i tabele',20,
 ['Formular (form) objedinjuje kontrole. Label je vidljiva oznaka; njen for mora odgovarati ID-ju polja.',
 'ID povezuje elemente, a name određuje ime podatka pri slanju. Placeholder nije zamena za label.',
 'Dugme type="submit" šalje formular. U pregledu kursa slanje je zaustavljeno: sada pravimo interfejs, a backend dolazi u JavaScript delu.'],
 '<label for="email">Imejl</label>\n<input id="email" name="email" type="email">',
 ['U main dodaj section id="porudzbina" sa h2 i form.','Dodaj label i input id/name="customer", type="text", autocomplete="name".','Dodaj label i input id/name="email", type="email", autocomplete="email".','Dodaj button type="submit".'],
 ['Dodaj sekciju pre završnog </main>.','For na label mora biti isti kao id na input elementu.','Name je poseban atribut čak i kada ima istu vrednost kao id.'],
 lessons[4].solution,{'index.html':doc(withForm(simpleForm)),'styles.css':cardCSS},
 [exists('Formular je u sekciji porudžbine.','main section#porudzbina form'),exists('Oznaka imena je povezana.','label[for="customer"]'),attr('Polje imena ima name.','#customer','name','customer'),exists('Imejl ima odgovarajući tip.','input#email[type="email"][name="email"]'),exists('Imejl ima oznaku.','label[for="email"]'),exists('Dugme ima submit tip.','form button[type="submit"]')],
 ['workshop-hotel-feedback-form','lab-checkout-page'],
 'Veza for/id omogućava aktiviranje polja klikom na oznaku. Name priprema podatke za slanje. Provera formulara u ovoj fazi ne predstavlja stvarno izvršenu kupovinu.');
add('Dostava, izbori i grupisanje','Forme i tabele',20,
 ['Radio dugmad (radio buttons) sa istim name pripadaju jednoj grupi. Checkbox predstavlja nezavisan izbor.',
 'Fieldset i legend daju ime grupi kontrola. Select sadrži option elemente, a textarea višeredni tekst.',
 'Razmišljaj o značenju podatka pre izbora tipa polja. Količina je broj; telefon ili poštanski broj nisu automatski aritmetičke vrednosti.'],
 '<fieldset><legend>Dostava</legend>\n<label><input type="radio" name="delivery" value="pickup"> Lično</label></fieldset>',
 ['Dodaj fieldset sa legend i dve radio opcije name="delivery" sa različitim value.','Dodaj quantity polje tipa number, sa label.','Dodaj select id/name="color" sa bar dve opcije i textarea id/name="note".','Dodaj checkbox name="terms".'],
 ['Obe radio opcije imaju isto name, ali različite value.','Label može obuhvatiti radio ili checkbox; tada nije obavezan for.','Za select i textarea koristi odvojene label elemente kao za imejl.'],
 lessons[5].solution,{'index.html':doc(withForm(fullForm)),'styles.css':cardCSS},
 [exists('Grupa ima naziv.','form fieldset legend'),exists('Postoje dve opcije dostave.','input[type="radio"][name="delivery"]',2),exists('Količina je broj.','input#quantity[type="number"]'),exists('Boja ima dve opcije.','select#color option',2),exists('Postoji napomena.','textarea#note[name="note"]'),exists('Postoji saglasnost.','input[type="checkbox"][name="terms"]'),test('Kontrole imaju povezane oznake.','labels')],
 ['workshop-registration-form','lecture-accessible-tables-forms'],
 'Polja iste radio grupe imaju zajedničko name. Label koji obuhvata kontrolu je validan način povezivanja. Fieldset/legend omogućava da grupa ima jasno značenje.');
add('Validacija i vidljiv fokus','Forme i tabele',20,
 ['Ugrađena validacija (constraint validation) koristi required, tip polja i ograničenja min/max/minlength. Ona ne zamenjuje serversku proveru.',
 'Fokus (focus) pokazuje gde se nalazi korisnik tastature. Ne uklanjaj outline bez vidljive zamene.',
 'Stanja kao hover i focus-visible mogu promeniti stil bez JavaScripta. Za samostalni obrazac prođi Tab i Shift+Tab.'],
 'input:focus-visible {\n  outline: 3px solid #986900;\n  outline-offset: 3px;\n}',
 ['Ime je obavezno i ima minlength="3"; imejl je obavezan tipa email.','Količina ima min="1" i max="5"; saglasnost je obavezna.','Polja i oznake prikaži čitljivo; na input:focus-visible postavi vidljiv outline.','Otvori pregled i proveri Tab, prazno ime i neispravan imejl.'],
 ['Required je logički atribut: dovoljno je navesti required.','Brojčana ograničenja pripadaju input-u quantity.','CSS fokus pravilo može biti grupisano za input, select, textarea i button.'],
 lessons[6].solution,{'index.html':doc(withForm(fullForm)),'styles.css':formCSS},
 [exists('Ime je obavezno i ima minimalnu dužinu.','#customer[required][minlength="3"]'),exists('Imejl je obavezan.','#email[type="email"][required]'),exists('Količina je od 1 do 5.','#quantity[min="1"][max="5"]'),exists('Saglasnost je obavezna.','input[name="terms"][required]'),test('Neispravan imejl ne prolazi validaciju.','invalidEmail','#email'),test('Input ima fokus pravilo sa outline-om.','focusRule','input')],
 ['lab-survey-form','lab-debug-donation-form','lecture-best-practices-for-styling-forms'],
 'Required i type=email rade zajedno. Za fokus ne koristimo samo promenu boje. Automatika proverava osnovno pravilo, a upotrebu tastature i čitljivost potvrđujemo pregledom.');
add('Tabela karakteristika','Forme i tabele',15,
 ['Tabela (table) je za povezane podatke, ne za raspored cele stranice. Caption daje naziv tabele.',
 'Thead i tbody odvajaju zaglavlje od podataka. Th je zaglavlje, a scope="col" ili "row" opisuje na koje ćelije se odnosi.',
 'Colspan i rowspan spajaju ćelije. U ovom zadatku koristi jednostavnu tabelu koju je lako čitati.'],
 '<table><caption>Karakteristike</caption>\n<thead><tr><th scope="col">Osobina</th><th scope="col">Vrednost</th></tr></thead>\n<tbody><tr><th scope="row">Masa</th><td>220 g</td></tr></tbody></table>',
 ['Dodaj tabelu sa caption, thead i tbody u glavni sadržaj.','Zaglavlje ima dve th ćelije sa scope="col".','Telo ima najmanje tri reda: osobina je th scope="row", a vrednost td.'],
 ['Tabelu dodaj pre završnog </main>.','Svaki red je tr. U telu mu trebaju th i td.','Primeri osobina su povezivanje, baterija i masa.'],
 lessons[7].solution,{'index.html':doc(completeHTML),'styles.css':formCSS},
 [exists('Tabela ima caption.','main table caption'),exists('Zaglavlje ima dve kolone.','table thead th[scope="col"]',2),exists('Telo ima najmanje tri reda.','table tbody tr',3),exists('Redovi imaju zaglavlja.','table tbody th[scope="row"]',3),exists('Postoje tri vrednosti.','table tbody td',3)],
 ['lab-book-catalog-table','workshop-final-exams-table'],
 'Zaglavlja se razlikuju od običnih podataka i po značenju, ne samo po izgledu. Caption ostaje koristan i bez CSS-a. Na intervjuu objasni zašto raspored navigacije ne praviš tabelom.');
add('CSS za pregledne podatke','Forme i tabele',15,
 ['Border-collapse:collapse spaja susedne ivice tabele. Padding u ćeliji odvaja tekst od ivice.',
 'Pseudoklasa (pseudo-class) nth-child(even) može označiti naizmenične redove. Poravnanje teksta ne menja značenje th i td.',
 'Široka tabela može imati lokalno horizontalno pomeranje. Nemoj odseći podatke samo da bi nestalo prelivanje.'],
 'table { border-collapse: collapse; }\nth, td { padding: 12px; text-align: left; }\ntbody tr:nth-child(even) { background-color: #edf3e8; }',
 ['Tabela ima width:100% i max-width:640px.','Uključi border-collapse:collapse.','Th i td imaju border, padding:12px i text-align:left.','Dodaj pozadinu na tbody tr:nth-child(even).'],
 ['Pravila th i td možeš grupisati zarezom.','Za naizmenične redove ciljaj samo tbody.','CSS selektor za parne redove je tbody tr:nth-child(even).'],
 lessons[8].solution,{'index.html':doc(completeHTML),'styles.css':tableCSS},
 [css('Tabela spaja ivice.','table','border-collapse','collapse'),css('Tabela koristi širinu kontejnera.','table','width','100%'),css('Tabela ima maksimalnu širinu.','table','max-width','640px'),css('Ćelija th ima padding 12px.','th','padding','12px'),css('Ćelija td ima padding 12px.','td','padding','12px'),test('Postoji stil parnih redova.','cssRule','tbody tr:nth-child(even)')],
 ['workshop-balance-sheet','lab-book-inventory-app'],
 'Zadržavamo HTML iz prethodne etape i menjamo samo CSS. Groupisani selektori i pseudoklase smanjuju ponavljanje, ali tekst statusa nikada ne treba predstaviti samo bojom.');
add('Tailwind: ista kartica, drugi zapis','Tailwind i samostalnost',20,
 ['Tailwind koristi pomoćne klase (utility classes). P-6 postavlja padding, rounded-2xl zaobljava ivice, a bg-white menja pozadinu.',
 'Okruženje u platformi kompajlira klase lokalno. Ne treba CDN niti nalog. Tailwind ne zamenjuje razumevanje CSS-a.',
 'Poredi CSS deklaraciju i novu klasu. Flexbox i Grid klase nam u ovoj etapi nisu potrebne.'],
 '<article class="product-card max-w-sm rounded-2xl border bg-white p-6">\n  <p class="price text-xl font-bold text-emerald-800">4.990 RSD</p>\n</article>',
 ['Na .product-card dodaj max-w-sm, rounded-2xl, border, bg-white i p-6.','Na .price dodaj text-xl, font-bold i text-emerald-800.','U styles.css ukloni posebna .product-card i .price pravila da ne prikrivaju učinak Tailwinda. Pravilo za sliku sme ostati.'],
 ['Menjaš class atribut, a ne naziv HTML elementa. Klase odvajaš razmakom.','P-6 odgovara padding-u 1.5rem u standardnoj skali.','Zadrži product-card i price kao semantičke oznake za zadatke, a izgled prepusti pomoćnim klasama.'],
 lessons[9].solution,{'index.html':doc(twHTML),'styles.css':baseCSS.replace('.price { font-weight: bold; }\n','')+'\n.product-card img { max-width: 100%; height: auto; }\n'},
 [test('Kartica koristi obavezne Tailwind klase.','classes','.product-card',['max-w-sm','rounded-2xl','border','bg-white','p-6']),test('Cena koristi Tailwind klase.','classes','.price',['text-xl','font-bold','text-emerald-800']),test('Nema starog posebnog pravila za karticu.','noCssRule','.product-card'),test('Nema starog posebnog pravila za cenu.','noCssRule','.price'),test('Tailwind zaista generiše padding.','generated',null,'.p-6')],
 [],
 'Ovo je nova lekcija, zasnovana na Tailwind dokumentaciji. Server generiše CSS iz klasa koje si napisao. Osnovne oznake product-card i price zadržavamo radi strukture, ne radi starih stilova.',true);
const twFormHTML=twHTML.replace('<input id="customer"','<input class="block w-full rounded-lg border border-stone-400 p-3 focus-visible:outline-2" id="customer"').replace('<input id="email"','<input class="block w-full rounded-lg border border-stone-400 p-3 focus-visible:outline-2" id="email"');
const twOnlyCSS=lessons[10].solution['styles.css']+'\nlabel { display:block; margin-top:12px; }\nfieldset { margin:16px 0; padding:12px; }\ntable { border-collapse:collapse; margin:24px 0; }\nth, td { border:1px solid #bfcbbc; padding:12px; }\n';
add('Tailwind formular i stanja','Tailwind i samostalnost',20,
 ['Varijanta (variant) kao hover: ili focus-visible: primenjuje klasu samo u odgovarajućem stanju.',
 'W-full koristi raspoloživu širinu roditelja; max-w-xl ograničava formular. To nije isto što i fiksna širina.',
 'Promena načina stilizovanja ne sme ukloniti label veze, name i ugrađenu validaciju.'],
 '<button class="rounded-lg bg-emerald-800 px-5 py-3 text-white hover:bg-emerald-900 focus-visible:outline-2">Pošalji</button>',
 ['Formular ima max-w-xl, rounded-xl, bg-white i p-6.','Customer i email polja imaju block, w-full, rounded-lg, border, p-3 i focus-visible:outline-2.','Submit dugme ima rounded-lg, bg-emerald-800, px-5, py-3, text-white, hover:bg-emerald-900 i focus-visible:outline-2.','Sačuvaj sve label veze i required atribute.'],
 ['Dodaj klase na postojeće elemente. Ne menjaj id i name.','Prefiks focus-visible: i naziv klase pišu se zajedno, bez razmaka.','Nakon prerade ponovo isprobaj tastaturu i neispravan imejl.'],
 lessons[10].solution,{'index.html':doc(twFormHTML),'styles.css':twOnlyCSS},
 [test('Formular ima Tailwind okvir.','classes','form',['max-w-xl','rounded-xl','bg-white','p-6']),test('Ime ima stilove polja i fokusa.','classes','#customer',['block','w-full','rounded-lg','border','p-3','focus-visible:outline-2']),test('Imejl ima stilove polja i fokusa.','classes','#email',['block','w-full','rounded-lg','border','p-3','focus-visible:outline-2']),test('Dugme ima osnovne stilove i stanja.','classes','button[type="submit"]',['rounded-lg','bg-emerald-800','px-5','py-3','text-white','hover:bg-emerald-900','focus-visible:outline-2']),test('Polja i dalje imaju oznake.','labels'),exists('Imejl je i dalje obavezan.','#email[required][type="email"]')],
 [],
 'Utility klase menjaju izgled, ali struktura i pravila formulara ostaju. State varijante omogućavaju hover i fokus bez JavaScripta. Vizuelni kvalitet nastavnik ocenjuje na kraju.',true);
const brokenHTML=doc(completeHTML).replace('href="styles.css"','href="style.css"').replace('/assets/slusalice.svg','/assets/nepostojeca.svg').replace('for="email"','for="mail"').replace('type="email"','type="text"');
const brokenCSS=tableCSS+'\n.product-card { width: 900px; max-width: none; }\n';
add('Servis za pokvarenu prodavnicu','Tailwind i samostalnost',15,
 ['Otklanjanje grešaka (debugging) počinje reprodukcijom: šta očekujem, šta vidim i koje pravilo to objašnjava?',
 'Network otkriva nepostojeće slike i stylesheet putanje. Styles prikazuje pregažene deklaracije. Izmenu iz DevTools-a prenesi u datoteku.',
 'Ne popravljaj simptom skrivanjem celog sadržaja. Pregledaj završno pravilo i uzrok prelivanja.'],
 'Uzrok → izmena → provera\nPrimer: pogrešan href → styles.css → stil se pojavljuje u pregledu.',
 ['Popravi putanju stylesheet-a.','Popravi putanju slike i label vezu imejla.','Vrati email tipu email.','Ukloni završno pravilo koje karticu forsira na 900px; zadrži max-width:380px.'],
 ['Uporedi nazive datoteka u karticama editora i link href.','For mora biti isti kao input id, a slika je slusalice.svg.','Na dnu CSS-a nalazi se kasnije pravilo koje pregažava raniju karticu.'],
 {'index.html':brokenHTML,'styles.css':brokenCSS},{'index.html':doc(completeHTML),'styles.css':tableCSS},
 [exists('Stylesheet putanja je ispravljena.','link[href="styles.css"]'),attr('Slika je vraćena.','.product-card img','src','/assets/slusalice.svg'),exists('Imejl ima ispravnu oznaku.','label[for="email"]'),exists('Tip imejla je ispravljen.','#email[type="email"]'),css('Kartica ponovo ima max-width 380px.','.product-card','max-width','380px'),test('Nema forsirane širine 900px.','noWideCard')],
 ['lab-debug-camperbots-profile-page','lab-debug-donation-form','lecture-debugging-css'],
 'Kasnije pravilo može pobediti čak i kada ranije izgleda ispravno. Putanje, label veze i tip polja imaju različite posledice; objasni svaku popravku.');
add('Od praznih datoteka: intervju','Tailwind i samostalnost',40,
 ['Ovo je naša simulacija praktičnog intervjua, a ne pravilo svih poslodavaca. Cilj je da pokažeš samostalnost.',
 'Otvori prazan projekat u VS Code-u. Dokumentacija i Emmet su dozvoljeni. Kompletno rešenje otvori tek posle pokušaja.',
 'Posle predaje objasni jedan semantički izbor, model kutije i validaciju. Zatim dodaj novu opciju dostave.'],
 'Datoteke koje sam praviš:\nindex.html\nstyles.css\nassets/slusalice.svg',
 ['Od praznih datoteka napravi dokument na srpskom sa eksternim CSS-om.','Napravi header, nav, main i footer, jedan proizvod sa slikom, opisom i cenom.','Dodaj tabelu sa caption, zaglavljima i tri reda karakteristika.','Napravi formular sa povezanim oznakama customer/email/quantity, obaveznim imejlom i količinom 1–5.','Stilizuj karticu ograničenom širinom, padding-om i vidljivim fokusom. Radi u VS Code-u, pa uvezi ZIP za proveru.'],
 ['Razloži zahtev: dokument → sadržaj → formular/tabela → CSS.','Kreni od pravilne strukture bez stilova, pa poveži stylesheet.','Ako si zapao, vrati se na odgovarajuću lekciju pre otvaranja kompletnog rešenja.'],
 {'index.html':'','styles.css':''},{'index.html':doc(completeHTML),'styles.css':tableCSS},
 [test('Dokument ima doctype.','doctype'),attr('Dokument je na srpskoj latinici.','html','lang','sr-Latn'),exists('Povezan je eksterni CSS.','link[href="styles.css"]'),exists('Postoje header i nav.','header nav'),exists('Proizvod ima sliku sa alt.','main article img[alt]'),exists('Postoji podnožje.','footer'),exists('Tabela ima caption i tri reda.','table tbody tr',3),exists('Postoji caption tabele.','table caption'),exists('Imejl ima validaciju.','#email[type="email"][required]'),exists('Količina ima opseg 1–5.','#quantity[min="1"][max="5"]'),test('Kontrole imaju oznake.','labels'),test('Postoji fokus sa vidljivom ivicom.','focusRule','input'),css('Kartica ima maksimalnu širinu.','.product-card','max-width','380px')],
 [],
 'Automatski prolaz je priprema za razgovor, ne dokaz da je kod samostalno nastao. Nastavnik ocenjuje izgled, obrazloženje i individualnu izmenu. Primer iz kompletnog rešenja je samo jedno moguće rešenje.');
export const demo=finishDayOne(lessons,extendCourse({lessons,add,test,exists,attr,css,doc,completeHTML,tableCSS}));
export {lessons};
export const totalMinutes=lessons.reduce((n,l)=>n+l.minutes,0);
