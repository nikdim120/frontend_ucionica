import {lessons as originalHTML,demo,courseVersion} from './course.mjs';
import {dayTwoLessons as originalLayout} from './day-two.mjs';
import {jsLessons} from './intro-javascript.mjs';
import {acceleratedLayout,acceleratedTailwind,bootstrapLesson,deliveryLesson} from './accelerated-layout.mjs';
export {demo,courseVersion};
export const appVersion='0.6.0';
const pool=new Map([...originalHTML,...originalLayout,...jsLessons,...acceleratedLayout,...acceleratedTailwind,bootstrapLesson,deliveryLesson].map(l=>[l.id,l]));
const paths=[
 ['01','02','03','04','05','15','16','js-01'],
 ['06','07','08','09','10','17','18','19','20','21','22','js-02'],
 [...acceleratedLayout.map(l=>l.id),'js-03'],
 [...acceleratedTailwind.map(l=>l.id),'bootstrap-01','js-04','delivery-01']
];
const outlines=[
 {title:'Prva stranica, box model i prvi klik',goal:'Razumeš cilj, napišeš HTML/CSS karticu i povežeš prvo dugme sa JavaScriptom.',why:'React gradi interfejs od HTML elemenata, CSS stilova i JavaScript logike. Najpre treba da ih prepoznaš i samostalno koristiš.',deliverable:'Kartica proizvoda, dugme liste želja i prvi lokalni Git commit.',orientationMinutes:60},
 {title:'Forme, tabele, responsive i obračun',goal:'Praviš upotrebljiv formular i tabelu, prilagođavaš sadržaj telefonu i računaš iznos.',why:'U Reactu ćeš ponovo raditi sa unosom, validacijom, tipovima i promenom prikaza. Ovde najpre upoznaješ njihovu osnovu.',deliverable:'Responsive stranica i obračun cene koji reaguje na količinu.'},
 {title:'Flexbox i Grid u jednom danu',goal:'Razumeš ose, veličine, prelamanje, mrežu i prikaz niza proizvoda.',why:'React ne rešava CSS raspored umesto tebe. Objekti, nizovi i funkcije pripremaju te za rad sa komponentama i listama.',deliverable:'Navigacija, mreža proizvoda i kartice koje nastaju iz JS podataka.'},
 {title:'Tailwind, Bootstrap i završna isporuka',goal:'Primenjuješ Flex/Grid kroz Tailwind, praviš novu stranicu, porediš Bootstrap i povezuješ lokalni filter.',why:'Pred React moraš da objasniš postojeći kod, samostalno ga izmeniš i pokažeš izvorni kod i rezultat.',deliverable:'Tailwind katalog, zaseban Bootstrap primer, lokalni filter, GitHub, README i odbrana.'}
];
export const lessons=paths.flatMap((ids,i)=>ids.map((id,j)=>{
 const l=pool.get(id);if(!l)throw Error('Nedostaje lekcija '+id);
 return {...l,legacyDay:l.day??1,day:i+1,order:j+1,required:true,minutes:l.minutes+(id==='05'?30:0),...(j===0||id==='06'||id==='11'?{inherit:'seed'}:{})};
}));
export const days=outlines.map((d,i)=>({...d,day:i+1,minutes:lessons.filter(l=>l.day===i+1).reduce((n,l)=>n+l.minutes,0)+(d.orientationMinutes??0)}));
export const totalMinutes=days.reduce((n,d)=>n+d.minutes,0);
export const reactPrerequisite={required:true,statement:'Sva četiri dana su obavezan preduslov za nastavak ka Reactu. Posle njih slede detaljniji JavaScript i praktična provera pre prelaska na React.',criteria:['Samostalno napiši i poveži HTML, CSS i JS datoteke u VS Code-u.','Objasni semantiku, formular, box model, responsive, Flexbox i Grid.','Objasni i izmeni funkciju, niz proizvoda i događaj u pregledaču.','Pokaži GitHub repozitorijum, README, smislen commit i njegov diff.','Na praktičnoj proveri napiši poznati deo od nule, popravi grešku i izvrši novu izmenu.'],assessment:'Automatski testovi potvrđuju osnovne slučajeve. Nastavnik potvrđuje izgled, razumevanje i samostalnost. Ova četiri dana nisu ceo JavaScript preduslov za React.',reactAvailable:false};

// Originalne etape ostaju dostupne za izvoz ranijeg rada; nisu u aktivnoj putanji.
export const legacyLessons=[...originalHTML,...originalLayout].filter(l=>!lessons.some(a=>a.id===l.id));
