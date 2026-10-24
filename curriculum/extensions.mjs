// Serbian adaptations. Stable IDs are separate from the displayed learning order.
export function extendCourse({lessons,add,test,exists,attr,css,doc,completeHTML,tableCSS}){
 const byId=id=>lessons.find(l=>l.id===id);
 const files=(html,style)=>({'index.html':html,'styles.css':style});
 const last=()=>lessons.at(-1);
 const contains=(label,selector,property,value)=>test(label,'cssContains',selector,value,{property});
 const at=(label,selector,property,value,width)=>test(label,'cssAtWidth',selector,value,{property,width});
 const faq='<section id="faq"><h2>Česta pitanja</h2>\n<details><summary>Kada stiže porudžbina?</summary><p>Probna dostava traje dva radna dana.</p></details>\n<details><summary>Kako mogu da reklamiram proizvod?</summary><p>Piši nam na <a href="mailto:podrska@example.com">podrska@example.com</a>.</p></details></section>';
 function accessHTML(html){
  if(!html.includes('class="skip-link"'))html=html.replace('<body>','<body>\n<a class="skip-link" href="#sadrzaj">Preskoči navigaciju</a>');
  html=html.replace('<main>','<main id="sadrzaj" tabindex="-1">');
  if(!html.includes('id="faq"'))html=html.replace('</main>',faq+'\n</main>');
  if(!html.includes('name="description"'))html=html.replace('</head>','<meta name="description" content="Studentska eProdavnica opreme za učenje i rad.">\n</head>');
  return html;
 }
 // Existing lessons gain short examples rather than another repetition task.
 const semantic=byId('03');
 semantic.theory.push('Details i summary daju otvaranje dodatnih informacija bez JavaScripta. Summary je vidljiv naziv koji možeš aktivirati tastaturom. Veza za preskakanje (skip link) vodi direktno u main.');
 semantic.example+='\n<details><summary>Dostava</summary><p>Dva radna dana.</p></details>';
 semantic.requirements.push('Dodaj vezu class="skip-link" ka #sadrzaj; main dobija id="sadrzaj" i tabindex="-1". Dodaj section#faq sa dva details elementa, svaki sa summary i odgovorom u p.');
 semantic.tests.push(exists('Skip link vodi u glavni sadržaj.','a.skip-link[href="#sadrzaj"]'),exists('Main može dobiti fokus preko veze.','main#sadrzaj[tabindex="-1"]'),exists('FAQ ima dva pitanja.','#faq details > summary',2),exists('FAQ ima dva odgovora.','#faq details > p',2));
 semantic.hints[2]+=' FAQ dodaj u main; svaki details ima summary kao prvi element.';
 byId('01').theory.push('Meta description je kratak opis stranice. Nije vidljivi pasus i ne garantuje određeni prikaz u rezultatima pretrage.');
 byId('01').requirements.push('Dodaj meta name="description" sa kratkim opisom prodavnice.');
 byId('01').tests.push(exists('Postoji opis stranice.','meta[name="description"][content]'));
 for(const l of lessons){
  if(l.solution['index.html'])l.solution['index.html']=l.id==='01'?l.solution['index.html'].replace('</head>','<meta name="description" content="Studentska eProdavnica opreme.">\n</head>'):Number(l.id)>=3?accessHTML(l.solution['index.html']):l.solution['index.html'];
  if(Number(l.id)>=4&&l.seed['index.html'])l.seed['index.html']=accessHTML(l.seed['index.html']);
 }
 const accessCSS='\n.skip-link { position:absolute; left:1rem; top:-8rem; padding:1rem; background:white; color:#21332d; z-index:20; }\n.skip-link:focus { top:1rem; }\na:focus-visible, summary:focus-visible { outline:3px solid #986900; outline-offset:3px; }\n';
 for(const l of lessons)if(Number(l.id)>=4){l.solution['styles.css']+=accessCSS;if(l.seed['styles.css'])l.seed['styles.css']+=accessCSS;}
 const validation=byId('08');
 validation.theory.push('Pseudoklase (pseudo-classes) opisuju stanja. Hover nije dostupan na svakom uređaju. Disabled stanje mora biti razumljivo i bez boje. :invalid može se aktivirati već na praznom obaveznom polju; koristi ga pažljivo.');
 validation.requirements.push('Dodaj button:hover sa background-color:#214a35, button:active sa transform:translateY(1px), button:disabled sa cursor:not-allowed i input[type="radio"]:checked sa accent-color:#2d6548. Stanja probaj u DevTools-u preko :hov; disabled atribut dodaj samo privremeno.');
 validation.tests.push(css('Dugme menja pozadinu pri hover-u.','button:hover','background-color','#214a35'),css('Aktivno dugme se blago pomera.','button:active','transform','translateY(1px)'),css('Onemogućeno dugme ima odgovarajući kursor.','button:disabled','cursor','not-allowed'),css('Izabrani radio ima accent-color.','input[type="radio"]:checked','accent-color','#2d6548'));
 const states='\nbutton:hover { background-color:#214a35; }\nbutton:active { transform:translateY(1px); }\nbutton:disabled { cursor:not-allowed; opacity:.6; }\ninput[type="radio"]:checked { accent-color:#2d6548; }\n';
 for(const l of lessons)if(Number(l.id)>=8){l.solution['styles.css']+=states;if(Number(l.id)>=9&&l.seed['styles.css'])l.seed['styles.css']+=states;}
 const cascade=byId('04');
 cascade.theory.push('Specifičnost (specificity): .product-card .price je specifičnije od .price. Ako je specifičnost ista, kasnija deklaracija pobeđuje. Nasleđena boja body-ja gubi pred pravilom koje direktno cilja cenu. U Styles isključi jedno pravilo i objasni promenu.');
 cascade.example+='\n/* Probaj zasebno: */\n.price { color: green; }\n.product-card .price { color: #21332d; }';
 const baseHTML=accessHTML(doc(completeHTML));
 let html=baseHTML;
 let style=tableCSS+accessCSS+states;
 let previous=files(html,style);
 style+='\n/* Tipografija */\nbody { font-size:1rem; line-height:1.6; }\nh1 { font-size:2rem; }\n.product-card p { max-width:60ch; }\n';
 add('Čitljiva stranica proizvoda','CSS za stvaran projekat',20,
 ['Relativna jedinica (relative unit) rem prati osnovnu veličinu fonta dokumenta; ne zaključavaj html na malu px vrednost. Korisnik može uvećati tekst.',
  'Prored (line-height) bez jedinice nasleđuje se kao odnos prema fontu. Dužina reda u ch približno prati širinu znaka 0, ne tačan broj slova.',
  'Postavi body na 1rem i line-height:1.6, h1 na 2rem, a pasuse kartice ograniči na 60ch. U Chrome-u uvećaj na 200% i proveri da tekst nije odsečen. Zatim sačuvaj Git commit „Uredi tipografiju prodavnice”.'],
 'body { font-size:1rem; line-height:1.6; }\n.product-card p { max-width:60ch; }',
 ['Postavi body font-size:1rem i line-height:1.6.','Postavi h1 font-size:2rem.','Na .product-card p postavi max-width:60ch.','Ručno proveri zumiranje od 200%, sačuvaj izmene u Gitu i objasni razliku rem/px.'],
 ['Menjaš CSS; struktura je pripremljena.','Line-height može biti broj bez px ili rem.','Dodaj zasebno pravilo .product-card p. Zum i čitljivost proveravaš u pregledaču.'],previous,files(html,style),
 [css('Osnovni tekst koristi rem.','body','font-size','1rem'),css('Prored je 1.6.','body','line-height','1.6'),css('Naslov koristi rem.','h1','font-size','2rem'),css('Pasus ima ograničenu dužinu reda.','.product-card p','max-width','60ch')],
 ['lecture-working-with-css-fonts','lecture-working-with-relative-and-absolute-units'],
 'Rem omogućava da tekst prati osnovnu veličinu. Prored i ograničena dužina reda poboljšavaju čitljivost. Testovi proveravaju deklaracije; zumiranje i izgled proveravaš ručno.');
 last().inherit='css';
 previous=files(html,style);
 style+='\n:root { --color-primary:#2d6548; --space:1rem; --radius:1rem; }\nh1 { color:var(--color-primary); }\nbutton { background-color:var(--color-primary); }\n.product-card { padding:var(--space); border-radius:var(--radius); }\n';
 add('Jedinstven izgled: CSS promenljive','CSS za stvaran projekat',20,
 ['Prilagođeno svojstvo (custom property) počinje sa --. U :root postavljamo vrednosti koje nasleđuju elementi dokumenta.',
  'Var(--color-primary) čita vrednost promenljive. Rezervna vrednost (fallback), npr. var(--color-primary, green), koristi se ako promenljiva nije dostupna.',
  'Izdvoji boju, razmak i zaobljenje. Promeni glavnu boju na jednom mestu i proveri naslov i dugme. Git commit: „Izdvoji zajedničke CSS vrednosti”.'],
 ':root { --color-primary:#2d6548; }\nh1 { color:var(--color-primary); }',
 ['U :root definiši --color-primary:#2d6548, --space:1rem i --radius:1rem.','H1 color i button background-color koriste var(--color-primary).','Kartica koristi var(--space) za padding i var(--radius) za border-radius.','Privremeno promeni glavnu boju, proveri oba mesta, pa vrati početnu boju i napravi commit.'],
 ['Definicija i upotreba imaju različitu sintaksu: --ime:vrednost i var(--ime).','Promenljive stavi u :root, a var() u deklaracije elemenata.','Pronađi ponovljenu boju u h1 i button. Ne menjaj semantiku formulara.'],previous,files(html,style),
 [css('Glavna boja je definisana u root-u.',':root','--color-primary','#2d6548'),css('Zajednički razmak je definisan.',':root','--space','1rem'),css('Zaobljenje je definisano.',':root','--radius','1rem'),contains('Naslov koristi promenljivu.','h1','color','var(--color-primary)'),contains('Dugme koristi promenljivu.','button','background-color','var(--color-primary)'),contains('Kartica koristi razmak.','.product-card','padding','var(--space)'),contains('Kartica koristi zaobljenje.','.product-card','border-radius','var(--radius)')],
 ['lecture-working-with-css-variables','workshop-city-skyline'],
 'Promena jedne definicije utiče na sva mesta gde je upotrebljena. To nije JavaScript promenljiva; njena vrednost učestvuje u CSS kaskadi i nasleđivanju.');
 previous=files(html,style);
 const moreProducts='<article class="product-card"><img src="/assets/tastatura.svg" width="640" height="240" alt="Kompaktna tastatura sa svetlim tasterima"><h3>Kompaktna tastatura</h3><p class="price">3.490 RSD</p><p>Više prostora za rad.</p></article>\n<article class="product-card"><img src="/assets/ranac.svg" width="320" height="480" alt="Zeleni ranac za računar i studentsku opremu"><h3>Studentski ranac</h3><p class="price">4.290 RSD</p><p>Oprema na jednom mestu.</p></article>';
 html=html.replace('src="/assets/slusalice.svg"','src="/assets/slusalice.svg" width="420" height="300"').replace('</article>','</article>\n'+moreProducts);
 const imageSeed=files(html,style);
 style+='\n.product-card img { width:100%; height:auto; aspect-ratio:4 / 3; object-fit:contain; background-color:#edf3e8; }\n';
 add('Slike različitih proporcija','CSS za stvaran projekat',20,
 ['Width i height atributi opisuju izvorne dimenzije slike i pomažu pregledaču da rezerviše prostor. CSS i dalje može prilagoditi njen prikaz.',
  'Aspect-ratio zadaje odnos stranica prikaznog okvira. Object-fit:contain čuva ceo proizvod, dok cover popunjava okvir uz moguće odsecanje.',
  'Na tri lokalne SVG ilustracije uporedi contain i cover. Za ovaj katalog zadrži contain. Srcset i sizes nude izbor izvora prema širini i gustini ekrana; ne upisuj lažne 320w/640w opise za istu datoteku. Kratak primer: <img src="mala.jpg" srcset="mala.jpg 320w, velika.jpg 640w" sizes="(min-width:48rem) 380px, 90vw" alt="Proizvod">.'],
 '.product-card img { width:100%; height:auto; aspect-ratio:4 / 3; object-fit:contain; }',
 ['Pripremljeni HTML ima tri proizvoda sa različitim izvornim dimenzijama.','Na .product-card img postavi width:100%, height:auto, aspect-ratio:4 / 3 i object-fit:contain.','Probaj cover, uoči šta se odseca, pa vrati contain.'],
 ['Menjaš zajedničko CSS pravilo za sve tri slike.','Aspect-ratio opisuje okvir, a object-fit način uklapanja slike u njega.','Width:100% i height:auto ostaju uz odnos 4 / 3.'],imageSeed,files(html,style),
 [exists('Katalog ima tri slike.','.product-card img[width][height][alt]',3),css('Slika prati širinu kartice.','.product-card img','width','100%'),css('Visina je prilagodljiva.','.product-card img','height','auto'),css('Okvir ima odnos 4 / 3.','.product-card img','aspect-ratio','4 / 3'),css('Proizvod se prikazuje ceo.','.product-card img','object-fit','contain')],
 ['lecture-working-with-images-and-svgs','lecture-best-practices-for-responsive-web-design'],
 'Tri različita odnosa izvornih dimenzija dobijaju isti okvir. Contain čuva ceo proizvod. Izvorne dimenzije u HTML-u i prikazne dimenzije u CSS-u nisu isto.');
 last().inherit='css';
 html=html.replace('<table>','<div class="table-scroll" role="region" aria-label="Karakteristike proizvoda" tabindex="0"><table>').replace('</table>','</table></div>');
 const mobileSeed=files(html,style);
 style+='\n/* Mobile first: osnovna pravila važe i bez medijskog upita. */\nbody { padding:1rem; }\nmain { width:100%; max-width:70rem; margin:0 auto; }\n.product-card { width:100%; }\n.table-scroll { max-width:100%; overflow-x:auto; }\n.table-scroll table { min-width:32rem; }\n@media (min-width:768px) { body { padding:1.5rem; } }\n@media (min-width:1280px) { body { padding:2rem; } }\n';
 add('Responsive 1: prvo telefon','Responsive radionica',25,
 ['Pristup prvo za telefon (mobile-first) počinje pravilima za uzak ekran. Min-width dodaje promene kada prostor poraste. Viewport meta oznaka omogućava očekivano ponašanje na telefonu.',
  'Tačka preloma (breakpoint) bira se tamo gde sadržaj traži promenu. U vežbi koristimo 768 i 1280px kao konkretne kontrolne širine, ne univerzalne kategorije uređaja.',
  'Široka tabela skroluje unutar .table-scroll, a ne cela stranica. Omotač ima naziv i tabindex kako bi ga korisnik tastature mogao fokusirati. Flexbox i Grid još nisu potrebni.'],
 'body { padding:1rem; }\n@media (min-width:768px) { body { padding:1.5rem; } }\n.table-scroll { overflow-x:auto; }',
 ['Body ima padding:1rem; od 768px 1.5rem, a od 1280px 2rem. Koristi min-width upite.','Main ima width:100%, max-width:70rem i margin:0 auto. Kartica ima width:100%.','Pripremljeni .table-scroll dobija max-width:100% i overflow-x:auto. Njegova tabela ima min-width:32rem.','Proveri širine 360, 768 i 1280px i prolazak tastaturom.'],
 ['Počni pravilima van @media; ona važe i na telefonu.','Dodaj dva odvojena min-width upita i proveri redosled.','Skrolovanje postavi na .table-scroll, ne na body. Ne skrivaj podatke overflow-x:hidden pravilom.'],mobileSeed,files(html,style),
 [at('Na 360px padding je 1rem.','body','padding','1rem',360),at('Na 768px padding je 1.5rem.','body','padding','1.5rem',768),at('Na 1280px padding je 2rem.','body','padding','2rem',1280),css('Glavni sadržaj ima ograničenu širinu.','main','max-width','70rem'),css('Kartica koristi raspoloživu širinu.','.product-card','width','100%'),css('Tabela skroluje u svom omotaču.','.table-scroll','overflow-x','auto'),css('Omotač ne širi stranicu.','.table-scroll','max-width','100%'),exists('Omotač tabele je dostupan tastaturi.','.table-scroll[tabindex="0"][aria-label]')],
 ['lecture-best-practices-for-responsive-web-design','workshop-piano'],
 'Osnovna stranica radi na maloj širini, a min-width upiti je postepeno menjaju. Testovi čitaju ciljane deklaracije; stvarno prelivanje i upotrebljivost proveravaš u pregledu.');
 last().inherit='css';
 previous=files(html,style);
 style+='\nh1 { font-size:clamp(1.75rem, 4vw, 3rem); }\nmain { width:min(100%, 70rem); }\n.product-card { overflow-wrap:anywhere; }\n';
 add('Responsive 2: prilagodljive dimenzije','Responsive radionica',20,
 ['Clamp(minimum, preferred, maximum) ograničava tečnu veličinu (fluid size). Naslov raste sa ekranom, ali ne pada ispod minimuma niti prelazi maksimum.',
  'Min(100%, 70rem) bira manju vrednost: širinu roditelja ili gornju granicu. Nije isto što i min-width. Overflow-wrap:anywhere može prelomiti veoma dugačak niz znakova.',
  'Izbegavaj fiksnu visinu na sadržaju sa tekstom. Probaj naslov dvostruke dužine i zoom od 200%. Sačuvaj commit „Prilagodi prodavnicu telefonu”.'],
 'h1 { font-size:clamp(1.75rem, 4vw, 3rem); }\nmain { width:min(100%, 70rem); }',
 ['H1 koristi font-size:clamp(1.75rem, 4vw, 3rem).','Main koristi width:min(100%, 70rem).','Kartica ima overflow-wrap:anywhere.','Proveri duži tekst i međuvrednosti širine 540 i 980px. Ne postavljaj fiksnu visinu za karticu.'],
 ['Clamp ima tri argumenta odvojena zarezima.','Min je funkcija za vrednost width, nije selektor.','Pronađi postojeća pravila i dopuni ih; proveri koja je završna deklaracija.'],previous,files(html,style),
 [contains('Naslov koristi clamp.','h1','font-size','clamp(1.75rem, 4vw, 3rem)'),contains('Main koristi min.','main','width','min(100%, 70rem)'),css('Dugi nizovi mogu da se prelome.','.product-card','overflow-wrap','anywhere')],
 ['lecture-working-with-relative-and-absolute-units','lecture-best-practices-for-responsive-web-design'],
 'Naslov se prilagođava između minimuma i maksimuma. Funkcije ne rešavaju automatski sve probleme rasporeda: dugačak sadržaj i zoom ostaju deo ručne provere.');
 previous=files(html,style);
 const broken=style+'\n/* Greške koje treba ukloniti, ne sakriti. */\n.product-card { width:900px; height:180px; }\nbody { overflow-x:hidden; }\n@media (min-width:768px) { .product-card { width:900px; } }\n';
 add('Responsive 3: pronađi uzrok prelivanja','Responsive radionica',25,
 ['Chrome DevTools → Toggle device toolbar otvara režim uređaja (Device Mode). U njemu menjaj širinu, ne samo naziv telefona. Naš pregled takođe menja stvarnu širinu iframe-a.',
  'Elements → Computed pokazuje završne vrednosti; Styles pokazuje izvor pravila. Box model objašnjava širinu sadržaja, padding i ivice. Izmenu iz DevTools-a prenesi u CSS datoteku.',
  'Kontrolna lista: 360, 540, 768, 980 i 1280px; zoom 200%; Tab/Shift+Tab; dugačak naziv proizvoda; lokalni skrol tabele. Overflow-x:hidden može samo sakriti problem. U README zapiši opažanja i priloži lokalne snimke telefona i desktopa.'],
 'Problem: kartica šira od ekrana\nUzrok: kasnije width:900px pravilo\nPopravka: ukloni pravilo, vrati width:100%\nProvera: 360px i širina između breakpoint-a',
 ['Ukloni završne greške width:900px i height:180px na kartici, uključujući pravilo u @media.','Zadrži width:100% i ukloni body overflow-x:hidden.','Proveri da nema neželjenog skrolovanja cele stranice i odsečenog teksta. Tabela sme lokalno da skroluje.','U README zabeleži provere i napravi commit sa opisom uzroka i popravke.'],
 ['Greške su na kraju CSS-a, uključujući @media blok.','Ukloni pokvarene deklaracije umesto da dodaješ overflow:hidden.','Ispravna kartica već ima width:100%; neka visinu odredi sadržaj.'],files(html,broken),previous,
 [at('Kartica je prilagodljiva na 360px.','.product-card','width','100%',360),at('Kartica je prilagodljiva na 980px.','.product-card','width','100%',980),test('Kartica nema fiksnu visinu.','cssAbsent','.product-card',null,{property:'height'}),test('Body ne skriva horizontalno prelivanje.','cssAbsent','body',null,{property:'overflow-x'}),css('Lokalno skrolovanje tabele ostaje.','.table-scroll','overflow-x','auto')],
 ['lecture-debugging-css','lecture-best-practices-for-responsive-web-design'],
 'Popravljamo uzrok na obe širine, umesto da sakrivamo sadržaj. Automatski testovi nisu merenje stvarnog rasporeda. Ručna kontrolna lista i diff objašnjavaju zašto je promena ispravna.');
 last().inherit='seed';
 html=html.replace('<article class="product-card">','<article class="product-card"><span class="sale-badge">Akcija</span>');
 const positionSeed=files(html,style);
 style+='\n.product-card { position:relative; }\n.sale-badge { position:absolute; top:.75rem; right:.75rem; z-index:1; background:#6b300d; color:white; padding:.25rem .5rem; border-radius:.5rem; }\nheader { position:sticky; top:0; z-index:10; background:#f6f5ef; padding:.5rem; }\nheader h1 { margin:.25rem 0; line-height:1.2; }\nheader p { margin:.25rem 0; }\nhtml { scroll-padding-top:10rem; }\n';
 add('Oznaka Akcija i lepljivo zaglavlje','Detalji i promocija',20,
 ['Position:relative zadržava element u normalnom toku i može uspostaviti referentni okvir za apsolutno pozicioniranog potomka.',
  'Position:absolute izdvaja oznaku iz normalnog toka. Top i right je vezuju za karticu. Z-index deluje unutar konteksta slaganja (stacking context), nije globalni broj za ceo sajt.',
  'Sticky ostaje u toku i zadržava se na zadatom odstojanju dok njegov kontejner to dopušta. Proveri da zaglavlje na telefonu i pri zoom-u ne zaklanja sadržaj. Scroll-padding-top ostavlja prostor za ciljeve navigacije.'],
 '.product-card { position:relative; }\n.sale-badge { position:absolute; top:.75rem; right:.75rem; }\nheader { position:sticky; top:0; z-index:10; }',
 ['Kartica je position:relative, a pripremljena .sale-badge position:absolute sa top i right .75rem i z-index:1.','Header je sticky, top:0 i z-index:10, sa neprovidnom pozadinom.','Html dobija scroll-padding-top:10rem. Proveri navigaciju i fokus na telefonu.'],
 ['Oznaka se pozicionira u odnosu na karticu ako kartica ima relative.','Sticky treba granicu top; ne koristi fixed za celu karticu.','Proveri da beli ili obojeni tekst oznake ostaje čitljiv na pozadini.'],positionSeed,files(html,style),
 [css('Kartica je referentni okvir.','.product-card','position','relative'),css('Oznaka je apsolutna.','.sale-badge','position','absolute'),css('Oznaka ima gornji razmak.','.sale-badge','top','.75rem'),css('Oznaka ima desni razmak.','.sale-badge','right','.75rem'),css('Zaglavlje je lepljivo.','header','position','sticky'),css('Zaglavlje se zadržava na vrhu.','header','top','0'),css('Zaglavlje ima sloj 10.','header','z-index','10'),css('Navigacija ostavlja prostor.','html','scroll-padding-top','10rem')],
 ['lecture-understanding-how-to-work-with-floats-and-positioning-in-css'],
 'Oznaka pripada kartici, dok zaglavlje prati skrolovanje. Na uskom ekranu proveri zauzetu visinu i dostupnost fokusiranih kontrola.');
 last().inherit='css';
 previous=files(html,style);
 const promo='<section id="promocija"><h2>Oprema za sledeću ideju</h2>\n<svg class="promo-icon" viewBox="0 0 24 24" role="img" aria-labelledby="promo-title"><title id="promo-title">Studentska pogodnost</title><path d="M12 2 L15 9 L22 9 L17 14 L19 22 L12 18 L5 22 L7 14 L2 9 L9 9 Z" fill="currentColor"/></svg>\n<p>Studentska ponuda za dobar početak.</p>\n<iframe src="/assets/promo.html" title="Informacije o studentskoj ponudi" loading="lazy" sandbox=""></iframe></section>';
 html=html.replace('</main>',promo+'\n</main>');
 style+='\n#promocija { padding:1rem; margin-top:2rem; background:#e3eddd; border-radius:1rem; }\n.promo-icon { width:3rem; height:3rem; color:#2d6548; animation:promo-pulse 2s ease-in-out infinite; }\n#promocija iframe { width:100%; height:12rem; border:0; }\n@keyframes promo-pulse { from { transform:scale(1); } to { transform:scale(1.08); } }\n@media (prefers-reduced-motion:reduce) { .promo-icon { animation:none; } }\n';
 add('Promotivna sekcija: SVG, iframe i animacija','Detalji i promocija',30,
 ['SVG opisuje vektorsku sliku. ViewBox definiše koordinatni sistem. Informativna ikonica ovde ima title i aria-labelledby; dekorativna bi imala aria-hidden="true".',
  'Iframe ugrađuje zaseban dokument. Title opisuje sadržaj okvira, a sandbox ograničava njegove mogućnosti. U ovoj učionici dozvoljen je samo pripremljeni lokalni assets/promo.html; spoljni sajtovi i studentski srcdoc se uklanjaju.',
  'Keyframes opisuje korake animacije. Korisniku koji traži smanjeno kretanje (prefers-reduced-motion) isključi animaciju. Kratak efekat ne sme biti jedini nosilac informacije. SVG, iframe i animaciju objedinjavamo u jednu vežbu.'],
 '<svg viewBox="0 0 24 24" role="img" aria-labelledby="promo-title"><title id="promo-title">Pogodnost</title><circle cx="12" cy="12" r="9"/></svg>\n<iframe src="/assets/promo.html" title="Studentska ponuda" sandbox=""></iframe>\n@media (prefers-reduced-motion:reduce) { .promo-icon { animation:none; } }',
 ['Dodaj section#promocija sa h2 i kratkim promotivnim tekstom.','Dodaj SVG class="promo-icon", viewBox="0 0 24 24", role="img", aria-labelledby="promo-title", title id="promo-title" i path ili circle.','Dodaj iframe src="/assets/promo.html", opisni title i prazan sandbox atribut.','Napravi @keyframes promo-pulse i primeni animation:promo-pulse 2s ease-in-out infinite na .promo-icon.','U @media (prefers-reduced-motion:reduce) postavi .promo-icon animation:none. Iframe dobija width:100% i height:12rem. Proveri reduced motion u Chrome Rendering panelu.'],
 ['Sekciju dodaj u main. SVG title nije isto što i HTML title stranice.','Upotrebi lokalni promo.html. Ne moraš da tražiš video ili spoljni servis.','Napravi keyframes sa from/to transform:scale(), pa odvojen reduced-motion upit sa animation:none.'],previous,files(html,style),
 [exists('Promocija ima naslov.','#promocija h2'),exists('SVG ima pristupačan naziv.','#promocija svg.promo-icon[viewBox="0 0 24 24"][role="img"][aria-labelledby="promo-title"] title#promo-title'),exists('SVG ima grafički sadržaj.','#promocija svg path, #promocija svg circle'),exists('Ugrađen je lokalni dokument.','#promocija iframe[src="/assets/promo.html"][title][sandbox=""]'),test('Naslov iframe-a je opisan.','nonemptyAttr','#promocija iframe','title'),test('Postoje ključni kadrovi.','keyframes',null,'promo-pulse'),contains('Ikonica koristi animaciju.','.promo-icon','animation','promo-pulse'),test('Smanjeno kretanje isključuje animaciju.','mediaCss','.promo-icon','none',{media:'(prefers-reduced-motion:reduce)',property:'animation'}),css('Okvir koristi celu širinu.','#promocija iframe','width','100%')],
 ['lecture-working-with-images-and-svgs','lecture-working-with-media','lecture-animations-and-accessibility'],
 'Jedan zadatak povezuje vektorsku grafiku, ugrađeni dokument i animaciju. Preview prikazuje pripremljeni lokalni sadržaj bez izvršavanja skripti. Reduced motion pravilo ostaje važno i kada je efekat blag.');
 last().promo=true;
 // Tailwind now refactors the completed shop, preserving responsive and content work.
 const tw=byId('11'),twForm=byId('12');
 tw.seed=files(html,style);
 const twShop=html.replaceAll('class="product-card"','class="product-card mx-auto my-6 max-w-sm rounded-2xl border border-stone-200 bg-white p-6"').replaceAll('class="price"','class="price text-xl font-bold text-emerald-800"');
 const stripRules=css=>css.replace(/(^|\n)\s*\.(product-card|price)\s*\{[^}]*\}/g,'');
 const twCSS=stripRules(style)+'\n/* Strukturna podrška oznaci ostaje u Tailwind klasi relative. */\n';
 const twFinal=twShop.replaceAll('product-card mx-auto','product-card relative mx-auto');
 tw.solution=files(twFinal,twCSS);tw.promo=true;
 tw.requirements.push('Sačuvaj FAQ, responsive pravila i promotivnu sekciju. Karticama dodaj relative da oznaka ostane u okviru kartice.');
 tw.tests.push(exists('FAQ je sačuvan.','#faq details',2),exists('Tri kartice su sačuvane.','.product-card',3),test('Kartica zadržava pozicioniranje.','classes','.product-card',['relative']));
 twForm.seed=tw.solution;
 let formHTML=twFinal.replace('<form>','<form class="max-w-xl rounded-xl bg-white p-6">').replace('<input id="customer"','<input class="block w-full rounded-lg border border-stone-400 p-3 focus-visible:outline-2" id="customer"').replace('<input id="email"','<input class="block w-full rounded-lg border border-stone-400 p-3 focus-visible:outline-2" id="email"').replace('<button type="submit">','<button type="submit" class="rounded-lg bg-emerald-800 px-5 py-3 text-white hover:bg-emerald-900 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60">');
 const formStyles=twCSS.replace(/(^|\n)\s*(form|button|button:hover|button:active|button:disabled)\s*\{[^}]*\}/g,'').replace(/input:not\(\[type="radio"\]\):not\(\[type="checkbox"\]\), select, textarea\s*\{[^}]*\}/g,'').replace(/input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible\s*\{[^}]*\}/g,'')+'\ninput#quantity, select, textarea { display:block; width:100%; padding:.625rem; border:1px solid #66766b; border-radius:.375rem; font:inherit; }\ninput#quantity:focus-visible, select:focus-visible, textarea:focus-visible, input[type="radio"]:focus-visible, input[type="checkbox"]:focus-visible { outline:3px solid #986900; outline-offset:3px; }\n';
 twForm.solution=files(formHTML,formStyles);twForm.promo=true;
 twForm.theory.push('Active i disabled varijante opisuju ista stanja kao CSS pseudoklase. Primer: active:translate-y-px i disabled:opacity-60.');
 twForm.requirements.push('Dugmetu dodaj active:translate-y-px, disabled:cursor-not-allowed i disabled:opacity-60.');
 twForm.requirements.push('Ukloni posebna CSS pravila za form i button, uključujući njegova hover/active/disabled stanja. U grupisanom CSS pravilu polja zameni početni input selektor sa input#quantity da ne pregažavaš Tailwind ime i imejl. Grupisani fokus zadrži samo za input#quantity, select, textarea i radio/checkbox.');
 twForm.tests.push(test('Formular nema staro CSS pravilo.','noCssRule','form'),test('Dugme nema staro CSS pravilo.','noCssRule','button'),test('Hover dugmeta je u Tailwindu.','noCssRule','button:hover'));
 twForm.tests.push(test('Dugme ima active i disabled varijante.','classes','button[type="submit"]',['active:translate-y-px','disabled:cursor-not-allowed','disabled:opacity-60']));
 // Final assessment reuses the existing shop; the blank-file interview remains a separate guide.
 const final=byId('14');
 final.title='Završi i obrazloži svoju eProdavnicu';final.minutes=45;final.inherit='all';final.promo=true;
 final.seed=files(html,style);final.solution=files(html,style);
 final.theory=['Završavaš postojeći projekat. Samostalni rad od praznih datoteka vežbaš u VS Code-u kroz vodič za intervju.', 'Dodaj u footer vezu ka #faq i u postojeći FAQ novo pitanje „Da li je ovo prava kupovina?” sa odgovorom. Zatim proveri celu kontrolnu listu i obrazloži jedan Git diff.', 'Nastavnik na kraju ocenjuje izgled, tastaturu i zoom, obrazloženje odluka i malu izmenu na licu mesta. Automatski testovi proveravaju samo osnovne zahteve.'];
 final.requirements=['Zadrži postojeći projekat: proizvode, formular, tabelu, FAQ i promociju.','U footer dodaj vezu ka #faq. Dodaj treći details sa pitanjem o probnoj kupovini i odgovorom.','Proveri 360, 540, 768, 980 i 1280px, zoom 200%, Tab i reduced motion.','Preuzmi projekat, radi u VS Code-u i vrati ZIP na proveru. U README opiši pokretanje i jednu promenu; pokaži commit i diff.','Na odbrani promeni zahtev nastavnika i objasni uticaj na HTML/CSS.'];
 final.solution['index.html']=html.replace('</footer>','<a href="#faq">Česta pitanja</a></footer>').replace('</section>\n</main>', '</section>\n</main>');
 final.solution['index.html']=final.solution['index.html'].replace('</details></section>','</details><details><summary>Da li je ovo prava kupovina?</summary><p>Ne, ovo je nastavni projekat i probna porudžbina.</p></details></section>');
 final.tests=final.tests.filter(t=>t.selector!=='.product-card');
 final.tests.push(exists('Podnožje vodi do pitanja.','footer a[href="#faq"]'),exists('FAQ ima tri pitanja.','#faq details > summary',3),exists('Promocija je sačuvana.','#promocija svg'),exists('Omotač tabele je sačuvan.','.table-scroll[tabindex="0"]'));
 for(const id of ['17','18','19','20','22'])final.tests.push(...byId(id).tests);
 final.explanation='Projekat završavamo manjom samostalnom izmenom i pregledom kvaliteta. Na odbrani pokaži rezultat, Git istoriju i razlog jedne odluke; ne ocenjujemo samo broj zelenih testova.';
 const debugging=byId('13');
 debugging.inherit='seed';
 debugging.promo=true;
 debugging.seed=files(html.replace('href="styles.css"','href="style.css"').replace('/assets/slusalice.svg','/assets/nepostojeca.svg').replace('for="email"','for="mail"').replace('type="email"','type="text"'),style+'\n.product-card { width:900px; max-width:none; }\n');
 debugging.solution=files(html,style);
 byId('14').seed['index.html']=html;
 const order=['01','02','03','04','05','06','07','08','09','10','15','16','17','18','19','20','21','22','11','12','13','14'];
 lessons.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
 lessons.forEach((l,i)=>{l.order=i+1;l.inherit??='all';});
 return {html,css:style};
}
