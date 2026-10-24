// Final Day 1 additions. No new stages: the 22 stable lesson IDs remain intact.
export function finishDayOne(lessons,demo){
 const get=id=>lessons.find(l=>l.id===id);
 const t=(label,type,selector,value,extra={})=>({label,type,selector,value,...extra});
 const faqExtras='<section id="koraci-kupovine"><h2>Kako poručuješ</h2><ol><li>Izaberi proizvod.</li><li>Popuni probni formular.</li><li>Proveri podatke.</li></ol><p><strong>Ovo je probna porudžbina.</strong> <em>Podatke koristi samo za vežbu.</em></p><dl><dt>Namena</dt><dd>Učenje i rad</dd><dt>Podrška</dt><dd>Nastavni primer</dd></dl></section>';
 const addons='<fieldset class="extras"><legend>Dodatne usluge</legend><label><input type="checkbox" name="giftwrap" value="yes"> Poklon-pakovanje</label><label><input type="checkbox" name="dedication" value="yes"> Posveta</label></fieldset>';
 function htmlExtras(html,stage){
  if(!html)return html;
  if(stage>=2&&!html.includes('class="manufacturer"'))html=html.replace('</article>','<p><a class="manufacturer" href="https://example.com/" target="_blank" rel="noopener noreferrer">Primer stranice proizvođača</a></p></article>');
  if(stage>=3&&!html.includes('id="koraci-kupovine"'))html=html.replace('</main>',faqExtras+'\n</main>');
  if(stage>=7&&!html.includes('name="giftwrap"'))html=html.replace('    <label for="quantity">',addons+'\n    <label for="quantity">');
  if(stage>=8&&!html.includes('id="quantity-help"')){
   html=html.replace(/(<input\b[^>]*\bid="quantity"[^>]*)(>)/, '$1 aria-describedby="quantity-help"$2<p id="quantity-help">Možeš poručiti od 1 do 5 komada.</p>');
   html=html.replace('>Ime i prezime</label>','>Ime i prezime (obavezno)</label>');
  }
  if(stage>=9&&!html.includes('colspan="2"'))html=html.replace('<thead><tr>','<thead><tr><th colspan="2">Studio slušalice</th></tr><tr>');
  return html;
 }
 const boxCSS='\n/* Dimenzije kartice obuhvataju padding i ivice. */\n.product-card { width:100%; border:2px solid #d9dfd4; }\n';
 for(const l of lessons){
  l.seed={...l.seed};l.solution={...l.solution};
  l.solution['index.html']=htmlExtras(l.solution['index.html'],l.order);
  l.seed['index.html']=htmlExtras(l.seed['index.html'],Math.max(1,l.order-1));
  if(l.order>=5&&!l.tailwind){l.solution['styles.css']+=boxCSS;if(l.order>5)l.seed['styles.css']+=boxCSS;}
 }
 // Retain the deliberate width bug in the debugging stage after common additions.
 get('13').seed['styles.css']+='\n.product-card { width:900px; max-width:none; }\n';
 const paths=get('02');paths.minutes+=5;
 paths.theory.push('Apsolutna URL adresa (absolute URL) sadrži protokol i domen. Relativna putanja (relative path) polazi od trenutne datoteke: ./assets/slika.svg je u ovom direktorijumu, ../assets/slika.svg ide jedan direktorijum naviše. Putanja /assets/slika.svg polazi od korena sajta.', 'Target="_blank" otvara novu karticu ili prozor. Rel="noopener noreferrer" odvaja novi kontekst i izostavlja podatak o prethodnoj stranici. Vezu nazovi prema odredištu. U sandbox pregledu otvaranje novih prozora može biti blokirano; proveri izvezeni projekat.');
 paths.requirements.push('U prvu karticu dodaj a.manufacturer: href="https://example.com/", target="_blank" i rel="noopener noreferrer". To je rezervisan primer odredišta.');
 paths.tests.push(t('Spoljna veza ima jasno odredište i način otvaranja.','exists','a.manufacturer[href="https://example.com/"][target="_blank"][rel~="noopener"][rel~="noreferrer"]',1));
 paths.example+='\n<!-- Ako je HTML u pages/: -->\n<img src="../assets/slika.svg" alt="Opis proizvoda">';
 const semantic=get('03');semantic.minutes+=10;
 semantic.theory.push('Strong označava važnost, a em naglasak. B i i koriste se za drugačije semantičke namene, iako njihov podrazumevani izgled često liči na strong i em. Izgled menjaj CSS-om.', 'Uređena lista (ordered list) ol odgovara koracima. Opisna lista (description list) dl sadrži naziv dt i opis dd. Izaberi element prema vezi među podacima.');
 semantic.requirements.push('Dodaj section#koraci-kupovine sa ol od tri koraka, jednom strong i jednom em napomenom. U istu sekciju dodaj dl sa dva para dt/dd.');
 semantic.tests.push(t('Koraci imaju redosled.','exists','#koraci-kupovine ol li',3),t('Važnost i naglasak su označeni.','exists','#koraci-kupovine strong',1),t('Postoji naglašena napomena.','exists','#koraci-kupovine em',1),t('Opisna lista ima dva naziva.','exists','#koraci-kupovine dl dt',2),t('Opisna lista ima dva opisa.','exists','#koraci-kupovine dl dd',2));
 semantic.example+='\n<ol><li>Izbor</li><li>Provera</li></ol>\n<dl><dt>Namena</dt><dd>Učenje</dd></dl>';
 const box=get('05');box.minutes+=15;
 box.theory=[
  'Model kutije (box model): sadržaj (content), unutrašnji razmak (padding), ivica (border) i spoljašnji razmak (margin). Padding pripada elementu unutar ivice. Margin razdvaja njegove kutije od okruženja.',
  'Uz content-box, width opisuje širinu sadržaja. Za width:300px, padding:20px i border:4px ukupna širina do spoljne ivice je 300 + 40 + 8 = 348px. Sa levom i desnom marginom od 12px zauzet horizontalni prostor je 372px.',
  'Uz border-box, width uključuje padding i border. Ista width:300px daje sadržaj širine 252px, jer je 300 − 40 − 8 = 252. Margin se i dalje dodaje izvan te širine.',
  'U zadatku kartica ima width:100%, max-width:380px, padding:24px i border:2px. Uz border-box njena širina do spoljne ivice ostaje najviše 380px. Na dovoljno širokom roditelju sadržaj je 380 − 48 − 4 = 328px. Na užem roditelju stvarna širina je manja.',
  'Skraćeni zapis (shorthand) padding:10px 20px znači gore/dole 10px i levo/desno 20px. Četiri vrednosti idu redom gore, desno, dole, levo. Margin prati isti redosled. Auto horizontalne margine centriraju odgovarajući blok ograničene širine.',
  'Početni stilovi pregledača (user-agent styles) mogu dodati marginu na body i naslove. Minimalni reset u ovom projektu je body { margin:0; } i * { box-sizing:border-box; }. CSS reset menja početne vrednosti; proveri šta si uklonio.',
  'Vertikalne margine blokova u normalnom toku mogu da se spoje (margin collapsing). Za dve susedne pozitivne margine od 24px i 16px razmak može biti 24px, ne zbir 40px. Padding se ne spaja na taj način.',
  'U Chrome DevTools izaberi .product-card, otvori Computed i model kutije. Uporedi prikazanu širinu sadržaja, padding i border sa svojim računom. Privremeno zameni border-box sa content-box i uoči prelivanje na 360px, pa vrati ispravno pravilo.',
  'Slika sa max-width:100% i height:auto prati prostor sadržaja i čuva odnos stranica. Fiksna širina slike, dugačak tekst ili kasnije CSS pravilo mogu ponovo izazvati prelivanje. Prvo pronađi uzrok u Styles, zatim proveri rezultat.'
 ];
 box.example='/* Istraživanje dimenzija */\n.primer {\n  width:300px; padding:20px;\n  border:4px solid; margin:12px;\n  box-sizing:content-box;\n}\n/* content-box: ivice 348px, sa marginama 372px */\n/* border-box: ivice 300px, sadržaj 252px */';
 box.requirements.push('Kartica dobija width:100% i border:2px solid #d9dfd4. Zadrži padding:24px, max-width:380px i border-box.','Na širokom roditelju izračunaj širinu sadržaja 328px i proveri je u DevTools-u. Privremeno pokvari box-sizing, uporedi 360px i širi ekran, pa vrati border-box.');
 box.tests.push(t('Kartica koristi širinu roditelja.','css','.product-card','100%',{property:'width'}),t('Kartica ima ivicu 2px.','css','.product-card','2px solid #d9dfd4',{property:'border'}));
 box.boxLab=true;
 box.tests.push(t('Kartica zaista koristi border-box, bez direktnog pregažavanja.','computedCss','.product-card','border-box',{property:'box-sizing'}),t('Desni padding ostaje 24px.','computedCss','.product-card','24px',{property:'padding-right'}));
 box.hints=['Nacrtaj četiri sloja ili pogledaj slike u teoriji. Width:100% treba da obuhvati padding i ivice, zato koristi border-box.', 'Za 380px širine, dva padding-a od 24px i dve ivice od 2px ostavljaju 328px za sadržaj. Max-width je ograničenje, ne obavezna širina.', 'Vrati * { box-sizing:border-box; } i body { margin:0; }. Na kartici postavi width:100%, max-width:380px, padding:24px i border:2px solid #d9dfd4.'];
 box.explanation='Border-box drži padding i border unutar zadate širine. Margin ostaje izvan. Na širokom roditelju granica je 380px, od čega 52px zauzimaju padding i ivice, pa sadržaju ostaje 328px. Computed proverava stvarni rezultat; CSS tekst sam ne garantuje odsustvo prelivanja.';
 get('06').minutes+=5;get('06').theory.push('Action označava adresu kojoj formular šalje podatke. Method="get" dodaje podatke u URL upit, a method="post" šalje ih u telu HTTP zahteva. POST sam po sebi ne šifruje podatke. Ovaj HTML/CSS projekat ne izvršava porudžbinu.', 'Button type="submit" pokreće slanje. Type="button" nema podrazumevano slanje; njegovu akciju kasnije određuje JavaScript. Type="reset" vraća početne vrednosti i lako može obrisati unos, pa ga ne dodajemo u naš formular.');
 get('06').example+='\n<!-- Samo primer budućeg povezivanja: -->\n<form action="/porudzbine" method="post">...</form>\n<button type="button">Pomoć</button>';
 get('07').minutes+=5;get('07').requirements.push('Dodaj fieldset.extras sa legend i dve nezavisne checkbox opcije name="giftwrap" i name="dedication", sa vidljivim oznakama.');get('07').tests.push(t('Dodatne usluge imaju grupu.','exists','fieldset.extras legend',1),t('Poklon-pakovanje ima nezavisan izbor.','exists','input[type="checkbox"][name="giftwrap"]',1),t('Posveta ima nezavisan izbor.','exists','input[type="checkbox"][name="dedication"]',1));
 get('08').minutes+=5;get('08').theory.push('Aria-describedby povezuje kontrolu sa dodatnom pomoći. Label imenuje polje, a povezani tekst ga objašnjava. Obaveznost saopšti jasno i tekstom, ne samo bojom. Native kontrole zadržavamo zbog uobičajenog ponašanja tastature.');get('08').requirements.push('Quantity dobija aria-describedby="quantity-help". Dodaj p#quantity-help sa tekstom o opsegu od 1 do 5 komada. Oznaku imena dopuni tekstom „obavezno”.');get('08').tests.push(t('Količina je povezana sa pomoći.','exists','#quantity[aria-describedby~="quantity-help"]',1),t('Pomoć objašnjava opseg.','text','#quantity-help','1 do 5'),t('Obaveznost je vidljiva u oznaci.','text','label[for="customer"]','obavezno'));
 get('09').minutes+=5;get('09').theory.push('Colspan="2" proširuje ćeliju preko dve kolone. Rowspan="2" je proteže kroz dva reda. Prvo prebroj logičke kolone da ne napraviš nepravilan raspored. Jednostavna tabela je obično lakša za razumevanje.');get('09').requirements.push('Iznad postojećeg reda kolonskih zaglavlja dodaj red sa th colspan="2" i nazivom proizvoda. Zadrži postojeći caption i scope zaglavlja.');get('09').tests.push(t('Zajedničko zaglavlje obuhvata dve kolone.','exists','thead th[colspan="2"]',1));get('09').example='<table>\n  <caption>Karakteristike proizvoda</caption>\n  <thead>\n    <tr><th colspan="2">Studio slušalice</th></tr>\n    <tr><th scope="col">Osobina</th>\n        <th scope="col">Vrednost</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Masa</th><td>220 g</td></tr>\n  </tbody>\n</table>\n<!-- Rowspan je atribut ćelije unutar tabele. -->';
 get('19').minutes+=5;get('19').theory.push('Calc() kombinuje vrednosti i jedinice: width:calc(100% - 2rem). Oko + i - ostavi razmake. Em u font-size prati veličinu fonta roditelja, dok rem prati koren dokumenta. Probaj .napomena { font-size:.9em; } unutar roditelja od 20px: rezultat je 18px.');get('19').example+='\n.promo-width { width:calc(100% - 2rem); }\n.napomena { font-size:.9em; }';
 get('01').theory.push('HTML entitet (character reference) prikazuje rezervisani znak: &amp; daje &, &lt; daje <. Primer „Oprema &amp; dodaci” prikazuje tekst sa znakom &. Znakove u prikazu koda treba pravilno zapisati.');
 get('13').minutes+=5;get('13').theory.push('HTML validator proverava usklađenost izvornog dokumenta sa HTML pravilima. DevTools pokazuje DOM koji je pregledač već mogao da popravi. U validator.nu izaberi tekstualni unos, nalepi svoj HTML i proveri poruke. Servis koristiš ručno; platforma mu ne šalje kod.', 'Primer greške je <p>Opis<div>Napomena</div></p>. P ne može tako da obuhvati div: razdvoji blokove i ponovo proveri izvor. Sačuvaj validaciju kao korak rada, pa pregledaj git diff.');get('13').sources.push({label:'Nu HTML Checker',url:'https://validator.nu/'});
 const figure=(file,alt,caption,path)=>({src:'/lesson-images/'+file,alt,caption,credit:'freeCodeCamp',sourceUrl:'https://cdn.freecodecamp.org/'+path});
 get('05').figures=[1,2,3].map((i)=>figure('fcc-layers-'+i+'.png',['Model kutije sa sadržajem, padding-om, ivicom i marginom','Sadržaj i unutrašnji razmak kutije','Dve susedne kutije sa označenim marginama'][i-1],['Četiri sloja modela kutije. Oznake u izvornoj FCC slici su na engleskom.','Padding dodaje prostor između sadržaja i ivice.','Margin odvaja susedne kutije. Spajanje vertikalnih margina proveri na konkretnom CSS primeru.'][i-1],'curriculum/css-box-model/diagram-'+i+'.png'));
 get('04').figures=[figure('fcc-box-1.png','Primer obojenih CSS kutija iz FCC lekcije','Primer prikaza elemenata pre detaljne analize dimenzija.','curriculum/lecture-transcripts/what-is-the-css-box-model-1.png')];
 get('15').figures=[figure('fcc-box-2.png','CSS primer dimenzija kutije','Poveži dimenzije sa čitljivošću sadržaja i prostorom oko teksta.','curriculum/lecture-transcripts/what-is-the-css-box-model-2.png')];
 get('18').figures=[figure('fcc-box-3.png','FCC prikaz kutije i raspoloživog prostora','Širina sadržaja i prostor koji zauzima element utiču na uski ekran.','curriculum/lecture-transcripts/what-is-the-css-box-model-3.png')];
 get('20').figures=[figure('fcc-box-4.png','FCC prikaz CSS kutije za analizu dimenzija','Pri popravci prelivanja proveri izvorne dimenzije, padding i border.','curriculum/lecture-transcripts/what-is-the-css-box-model-4.png')];
 get('02').figures=[figure('fcc-product.jpg','Obojena kocka kao primer fotografije proizvoda','Fotografija može imati smislen alt koji opisuje proizvod.','curriculum/labs/cube.jpg')];
 get('17').figures=[figure('fcc-cat.jpg','Mačka koja odmara','Na fotografiji probaj razliku između uklapanja cele slike i odsecanja dela slike.','curriculum/cat-photo-app/relaxing-cat.jpg')];
 get('22').figures=[figure('fcc-event.jpg','Fotografija događaja iz FCC promotivnog primera','Fotografija je primer sadržaja promotivne sekcije, uz odgovarajući opis.','curriculum/labs/event.jpg')];
 demo.html=htmlExtras(demo.html,22);demo.css+=boxCSS;
 return demo;
}
