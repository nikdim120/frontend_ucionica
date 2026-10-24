const q=(id,prompt,options,correct,hint,explanation)=>({id,prompt,options:options.map((label,i)=>({id:'ABCD'[i],label})),correct:'ABCD'[correct],hint,explanation});
export const introQuizzes={
 'js-01':[
 q('js-01-a','Koji deo menja ponašanje dugmeta posle klika?',['HTML title','JavaScript event handler','CSS margin','Git commit'],1,'Razlikuj strukturu, izgled i ponašanje.','JavaScript handler reaguje na događaj. CSS klasa određuje izgled, a HTML daje dugme.'),
 q('js-01-b','Šta je dobar dokaz da razumeš primer?',['Prepišeš bez pokretanja','Otvoriš rešenje','Sam promeniš poruku i objasniš prvi i drugi klik','Brojiš redove koda'],2,'Potrebni su izmena i obrazloženje.','Samostalna izmena i objašnjenje toka pokazuju razumevanje bolje od kopiranja.')],
 'js-02':[
 q('js-02-a','Input ima value="3". Šta daje Number(input.value)?',['Broj 3','String "3"','Boolean true','HTML element'],0,'Value je tekst, a Number vrši konverziju.','Number("3") daje broj 3. To je važno pri sabiranju i proveri tipova.'),
 q('js-02-b','Šta radi return price * quantity u funkciji?',['Šalje porudžbinu serveru','Vraća proizvod argumenata','Menja svaki CSS stil','Pravi Git granu'],1,'Razlikuj vraćanje vrednosti od njenog prikaza.','Return vraća rezultat pozivaocu. Poseban kod ga prikazuje kroz textContent.')],
 'js-03':[
 q('js-03-a','Koji zapis čita naziv prvog proizvoda u nizu products?',['products.name[1]','products(0)','products[0].name','products.length.name'],2,'Indeks prvog elementa je 0.','Products[0] čita prvi objekat; .name njegovo svojstvo.'),
 q('js-03-b','Šta omogućava for…of nad nizom proizvoda?',['Prolazak kroz vrednosti proizvoda','Promenu GitHub naloga','Automatski CSS Grid','Samo brojanje slova'],0,'Petlja radi sa elementima kolekcije.','For…of daje svaki proizvod redom, pa ista logika pravi više kartica.')],
 'js-04':[
 q('js-04-a','Koje svojstvo checkbox-a govori da li je označen?',['value','checked','textContent','placeholder'],1,'Potrebna je boolean vrednost stanja.','Checked je true ili false. Value je tekstualna vrednost polja.'),
 q('js-04-b','Zašto filter vraća novi niz i čuva izvorni?',['Da zabrani novi prikaz','Da obriše nedostupne proizvode','Da originalni podaci ostanu za vraćanje svih proizvoda','Da izbegne sve funkcije'],2,'Posle uklanjanja oznake treba ponovo prikazati sve.','Izbor prikaza ne treba trajno da obriše podatke iz kataloga.')]
};
