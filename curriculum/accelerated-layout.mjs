import {dayTwoLessons as layout} from './day-two.mjs';
import {lessons as html} from './course.mjs';
import {jsLessons} from './intro-javascript.mjs';
const byId=new Map([...layout,...html].map(l=>[l.id,l]));
const unique=items=>[...new Map(items.map(x=>[JSON.stringify(x),x])).values()];
function combine(id,title,minutes,ids,options={}){
 const parts=ids.map(id=>byId.get(id)),first=parts[0],last=parts.at(-1);
 return {...last,id,title,minutes,inherit:'seed',mergedFrom:ids,
  theory:unique(parts.flatMap(l=>l.theory)),example:parts.map(l=>l.example).join('\n\n'),
  requirements:parts.flatMap(l=>l.requirements),seed:structuredClone(first.seed),solution:structuredClone(last.solution),
  tests:unique(parts.flatMap(l=>l.tests)),sources:unique(parts.flatMap(l=>l.sources)),
  hints:[first.requirements[0],parts.map(l=>l.example).join('\n'), 'Proveri roditelja, efektivne dimenzije i prelivanje. Otvori rešenje tek posle samostalnog pokušaja.'],
  explanation:'Objedinjena praktična etapa: '+title+'. Kratak primer prati jedan samostalan zadatak na istoj prodavnici. '+parts.map(l=>l.explanation).join('\n\n'),...options};
}
export const acceleratedLayout=[
 combine('layout-01','Flexbox: ose, poravnanje i razmak',40,['2-01','2-02'],{layoutLab:'flex'}),
 combine('layout-02','Flexbox: veličine, prelamanje i dugačak sadržaj',45,['2-03','2-04'],{layoutLab:'flex'}),
 combine('layout-03','Kartica i popravka Flex zaglavlja',30,['2-05','2-06']),
 combine('layout-04','Grid: kolone i prilagodljiva mreža proizvoda',45,['2-07','2-08'],{
  layoutLab:'grid',tests:[layout[6].tests[0],...layout[7].tests],layoutChecks:layout[7].layoutChecks,
  requirements:['Na .product-grid postavi display:grid i gap:1rem. Najpre probaj repeat(3,1fr) u laboratoriji.',...layout[7].requirements],
  theory:[...layout[6].theory,...layout[7].theory,'Fiksne tri kolone su kratak eksperiment. Konačno rešenje koristi auto-fit i minmax; ne ostavljaj staro pravilo za tri kolone na širokom ekranu.']
 }),
 combine('layout-05','Grid: istaknuta kartica i oblasti stranice',35,['2-09','2-10']),
 combine('layout-06','Grid i Flex zajedno: provera stvarnog sadržaja',40,['2-11','2-12'],{
  requirements:[...layout[11].requirements,'Uporedi Grid za katalog i Flex unutar kartice. Dodaj sedmi proizvod i dvostruko duži naziv; proveri 360, 540, 768, 980 i 1280px i tastaturu.', 'Grid-auto-rows i implicitne redove upoznaj kroz kratak primer; detaljne implicitne kolone i dense nisu uslov praktičnog prolaza.'],
  tests:layout[11].tests,
  theory:[...layout[11].theory,'Grid pravi raspored kataloga, a Flex raspoređuje cenu i dugme unutar kartice. Kada dodaš proizvod, nastaju implicitni redovi. Kratak primer: .product-grid { grid-auto-rows:minmax(18rem,auto); }.','Dodatno čitanje: container queries prilagođavaju komponentu njenom roditelju. Subgrid, imenovane linije i dense nisu obavezni u ubrzanoj putanji.']
 })
];
// Vežba popravke mora zaista početi pokvarenim zaglavljem.
acceleratedLayout[2].seed['styles.css']+='\n.shop-nav{width:900px;min-width:900px}';
export const acceleratedTailwind=[
 combine('tw-01','Tailwind: kartica, formular i stanja',45,['11','12']),
 combine('tw-02','Tailwind: Flex, Grid i responsive klase',35,['2-14','2-15']),
 {...layout[15]},
 {...layout[16]},
];
const bsHead='<!DOCTYPE html>\n<html lang="sr-Latn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bootstrap poređenje | eProdavnica</title><link rel="stylesheet" href="bootstrap.css"><link rel="stylesheet" href="styles.css"></head><body><main class="container py-4"><h1>Studentska oprema</h1>';
const bsCards=['Slušalice','Tastatura','Ranac'].map((name,i)=>`<div class="col-12 col-md-6 col-lg-4"><article class="card h-100"><img src="assets/${['slusalice.svg','tastatura.svg','ranac.svg'][i]}" class="card-img-top" alt="${name}" width="400" height="300"><div class="card-body"><h2 class="card-title h5">${name}</h2><p class="card-text">Oprema za učenje.</p><a class="btn btn-primary" href="#porudzbina">Poruči</a></div></article></div>`).join('\n');
const bsEnd='<form id="porudzbina" class="mt-4"><label class="form-label" for="bs-email">Imejl</label><input class="form-control" id="bs-email" name="email" type="email" required><button class="btn btn-primary mt-3" type="submit">Probna porudžbina</button></form></main></body></html>';
export const bootstrapLesson={
 id:'bootstrap-01',title:'Bootstrap: isti katalog sa gotovim klasama',group:'CSS alati i poređenje',minutes:30,inherit:'seed',bootstrap:true,tailwind:false,
 theory:['Bootstrap nudi gotove komponente i pomoćne klase (utility classes). Tailwind uglavnom sastavljaš od pomoćnih klasa; u čistom CSS-u pravila pišeš sam. U ovoj etapi upoređujemo iste proizvode, bez prepravljanja glavnog projekta.',
 'Container ograničava sadržaj, row okuplja kolone, a col-12 col-md-6 col-lg-4 daje jednu, dve i tri kolone. G-3 postavlja razmake (gutters). Standardni Bootstrap grid koristi Flexbox i 12 kolona; nije CSS Grid.',
 'Card, card-body, btn btn-primary, form-label i form-control daju gotove stilove. I dalje sam pišeš semantički HTML, label veze i alt opise. CSS ne implementira pravu kupovinu.',
 'U platformi i izvozu dobijaš lokalni Bootstrap 5.3.8 CSS. Nema CDN zavisnosti, Bootstrap JS-a, modala niti mešanja sa Tailwindom u istom dokumentu. U budućem React JSX-u class postaje className; CSS osnove ostaju iste.',
 'Uporedi tri pristupa i obrazloži šta si dobio brzinom izrade, a šta moraš prilagođavati. Dokumentacija je dozvoljena; nazive klasa ne učimo napamet.'],
 example:'<div class="container">\n  <div class="row g-3">\n    <div class="col-12 col-md-6 col-lg-4">...</div>\n  </div>\n</div>',
 requirements:['U pripremljenoj sekciji napravi .row.g-3 sa tri kolone col-12 col-md-6 col-lg-4.','Svaka kolona ima article.card, sliku sa alt opisom, .card-body, naslov i a.btn.btn-primary ka #porudzbina.','Sačuvaj label/form-control vezu i required imejl. Proveri jednu/dve/tri kolone na 360/768/1280px.','Objasni razliku između Bootstrap sistema kolona i CSS Grida. Preuzmi primer i proveri da lokalni bootstrap.css radi bez interneta.'],
 seed:{'index.html':bsHead+'<section aria-label="Proizvodi"><!-- Ovde napiši red i tri kartice. --></section>'+bsEnd,'styles.css':''},
 solution:{'index.html':bsHead+'<section aria-label="Proizvodi"><div class="row g-3">'+bsCards+'</div></section>'+bsEnd,'styles.css':''},
 tests:[{type:'exists',selector:'link[href="bootstrap.css"]',value:1,label:'Povezan je lokalni Bootstrap CSS.'},{type:'classes',selector:'.row',value:['row','g-3'],label:'Red ima Bootstrap razmake.'},{type:'exists',selector:'.row > .col-12.col-md-6.col-lg-4 > article.card',value:3,label:'Tri responsive kolone sa karticama.'},{type:'exists',selector:'.card img[alt]',value:3,label:'Slike imaju opise.'},{type:'exists',selector:'.card-body a.btn.btn-primary[href="#porudzbina"]',value:3,label:'Kartice imaju dugme za porudžbinu.'},{type:'exists',selector:'label[for="bs-email"] + input#bs-email.form-control[required][type="email"]',value:1,label:'Formular zadržava oznaku i obavezni imejl.'}],
 hints:['Najpre napiši roditelja row g-3 i tri kolone.','Pogledaj kratak primer i složi article.card unutar svake kolone.','Bootstrap CSS je već lokalno dostupan. Zadrži label for/id i proveri prikaz na tri širine.'],
 explanation:'Tri kolone zauzimaju 12/12, 6/12 ili 4/12 reda. Komponente daju početni izgled, a semantika, pristupačnost i provera rezultata ostaju odgovornost autora.',
 sources:[{label:'Bootstrap grid',url:'https://getbootstrap.com/docs/5.3/layout/grid/'},{label:'Bootstrap cards',url:'https://getbootstrap.com/docs/5.3/components/card/'},{label:'React className',url:'https://react.dev/learn#adding-styles'}]
};
const jsFinal=jsLessons.find(l=>l.id==='js-04');
export const deliveryLesson={...jsFinal,id:'delivery-01',title:'Završna isporuka: projekat, GitHub i odbrana',minutes:45,inherit:'seed',
 seed:structuredClone(jsFinal.solution),solution:{...jsFinal.solution,'index.html':jsFinal.solution['index.html'].replace('</footer>','<p id="project-review">Grid za katalog, Flex za karticu.</p></footer>')},
 theory:[...layout[17].theory,'Ovde dobijaš funkcionalnu kontrolnu tačku sa filterom. U VS Code-u spoji svoje prethodne izmene sa ovim projektom. Automatika proverava osnovnu strukturu i filter, a nastavnik izgled, GitHub, README i samostalnu izmenu.','Napiši kratko obrazloženje izbora rasporeda u p#project-review u podnožju početne strane. Tekst treba da pomene Grid i Flex.'],
 example:'git diff\ngit add index.html katalog.html styles.css script.js README.md\ngit diff --cached\ngit commit -m "Završi responsive eProdavnicu"',
 requirements:['Sačuvaj obe stranice, navigaciju i funkcionalni lokalni filter iz prethodne etape.','U footer početne strane dodaj p#project-review sa objašnjenjem zašto koristiš Grid i Flex.','Izvezi projekat. U VS Code-u spoji svoje izmene, dopuni README načinom pokretanja i poznatim ograničenjima. Proveri tastaturu, zoom 200% i pet širina.','Predaj GitHub repozitorijum i pokaži commit/diff. Na odbrani napiši poznati deo od nule, popravi jednu grešku i izvrši novu izmenu.'],
 tests:[...jsFinal.tests,...layout[17].tests,{type:'text',selector:'#project-review',value:'Grid',label:'Obrazložen je izbor Grida.'},{type:'text',selector:'#project-review',value:'Flex',label:'Obrazložen je izbor Flexboxa.'}],
 hints:['Dodaj obrazloženje u footer početne strane; ne uklanjaj filter.','Pokreni JS proveru, zatim proveri obe stranice lokalno.','Zeleni testovi nisu provera GitHub repozitorijuma ili samostalnosti; to potvrđuje nastavnik.'],
 explanation:'Završni paket povezuje raspored, Tailwind stranicu i lokalni filter. README, GitHub, prikaz i izmena uživo ocenjuju se ručno.',sources:[...jsFinal.sources,...layout[17].sources]
};
