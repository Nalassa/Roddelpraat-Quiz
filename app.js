// app.js — RoddelPraat Quiz (revamp)

/**
 * ✅ Assets
 * - Spelers: assets/players/<slug>.gif (of .jpg/.png)
 * - Vragen:  assets/questions/q1.jpg etc (pas aan in QUESTIONS)
 */

// =====================================================
// 🔧 Helpers
// =====================================================
const $ = (id) => document.getElementById(id);

function show(view){
    [playerView, quizView, resultView].forEach(v => v.classList.remove("active"));
    view.classList.add("active");
}

function scrollToTop(){
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function pad2(n){ return String(n).padStart(2, "0"); }

function nowStamp(){
    const d = new Date();
    return `${pad2(d.getDate())}-${pad2(d.getMonth()+1)}-${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function getStillPhoto(photoPath){
    // als je gifs gebruikt maar bij "youImg" liever stil: maak jpg variant met dezelfde naam.
  // bv dennis.gif -> dennis.jpg (optioneel)
  return String(photoPath || "").replace(/\.(gif|webp|png|jpg|jpeg)$/i, ".jpg");
}

// =====================================================
// 👤 Spelers (breid gerust uit)
// =====================================================
const PLAYERS = [
  { name: "Dennis", slug: "dennis", tag: "Host", photo: "assets/players/dennis.gif" },
  { name: "Jan", slug: "jan", tag: "Host", photo: "assets/players/jan.gif" },
  { name: "OJ", slug: "oj", tag: "Crew", photo: "assets/players/oj.gif" },
  { name: "Henry", slug: "henry", tag: "Crew", photo: "assets/players/henry.gif" },
  { name: "Thierry", slug: "thierry", tag: "Gast", photo: "assets/players/thierry.gif" },
  { name: "Mr Nightlife", slug: "mrnightlife", tag: "Legende", photo: "assets/players/mrnightlife.gif" },
  { name: "Marcel", slug: "marcel", tag: "Kevin", photo: "assets/players/marcel.gif" },

    // extra placeholders (zet je eigen gifs neer)
  { name: "Kevin #1", slug: "kevin1", tag: "Supporter", photo: "assets/players/kevin1.gif" },
  { name: "Kevin #2", slug: "kevin2", tag: "Supporter", photo: "assets/players/kevin2.gif" },
  { name: "Gast #1", slug: "gast1", tag: "Gast", photo: "assets/players/gast1.gif" },
  ];

// =====================================================
// ⚙️ Quiz instellingen (UI toggles)
// =====================================================
const SETTINGS_DEFAULTS = {
    strictMode: false, // na antwoord niet meer wijzigen (voor iedereen)
    nextLock: true,    // wacht X sec na antwoord voordat je door kan
    fadeIn: false      // afbeelding langzaam zichtbaar
};

let SETTINGS = { ...SETTINGS_DEFAULTS };

// =====================================================
// 🎯 Player regels (per speler override)
// =====================================================
// Admin kan alles, geen lock, mag altijd wijzigen
const ADMIN_PLAYER = "Dennis";

// Speler(s) die na keuze niet meer mogen wijzigen, ook als strictMode uit staat
const NO_CHANGE_PLAYERS = new Set(["Jan"]);

// Timed players (lock na antwoorden)
const TIMED_PLAYERS = new Set(PLAYERS.map(p => p.name)); // iedereen
const LOCK_SECONDS_DEFAULT = 5;
const LOCK_SECONDS_SPECIAL = new Map([
    ["Jan", 8],
    ["Mr Nightlife", 6],
  ]);

function isAdmin(){
    return (currentPlayer?.name || "") === ADMIN_PLAYER;
}
function isNoChangePlayer(){
    return NO_CHANGE_PLAYERS.has(currentPlayer?.name || "");
}
function isTimedPlayer(){
    if(isAdmin()) return false;
    return TIMED_PLAYERS.has(currentPlayer?.name || "");
}
function getLockSeconds(){
    const nm = currentPlayer?.name || "";
    return LOCK_SECONDS_SPECIAL.get(nm) ?? LOCK_SECONDS_DEFAULT;
}

// Fade-in timing
const FADE_DURATION_MS = 6500;
const FADE_DELAY_MS = 350;

// =====================================================
// ❓ Vragen (placeholder set)
// -> Vervang dit met jouw eigen RoddelPraat vragen + images
// =====================================================
const QUESTIONS = [
  {
        vraag: "Wanneer komt RoddelPraat meestal online?",
        meta: "Algemeen",
        image: "assets/questions/q1.jpg",
        antwoorden: ["Maandag", "Woensdag", "Vrijdag", "Zondag"],
        correctIndex: 1,
        uitleg: "RoddelPraat is traditioneel de woensdag-show (meestal)."
  },
  {
        vraag: "Welke kleur hoort het meest bij de RoddelPraat-vibe?",
        meta: "Theme check",
        image: "assets/questions/q2.jpg",
        antwoorden: ["Groen", "Paars", "Oranje", "Bruin"],
        correctIndex: 1,
        uitleg: "💜 Paars hoort er gewoon bij."
  },
  {
        vraag: "Wie zijn de vaste hosts?",
        meta: "Basis",
        image: "assets/questions/q3.jpg",
        antwoorden: ["Dennis & Jan", "Dennis & OJ", "Jan & Henry", "Thierry & Marcel"],
        correctIndex: 0,
        uitleg: "Dennis Schouten en Jan Roos."
  },
  {
        vraag: "Wat is het beste antwoord?",
        meta: "Meme",
        image: "assets/questions/q4.jpg",
        antwoorden: ["Kevin.", "Kevin!!", "KEVIN!!!", "Allemaal waar."],
        correctIndex: 3,
        uitleg: "Als het RoddelPraat is: alles kan waar zijn."
  }
  ];

// =====================================================
// 📌 Elements
// =====================================================
const playerView = $("playerView");
const quizView   = $("quizView");
const resultView = $("resultna at ("ceiNcy "
t ";s "
a a
ele"nr " t(tt"nmIo gc ";oa b
ekfa
k=c"nc=act (;n neto$w
  tg=o"tptBc m=tane=r"cG dc$dcplianp=i"cveL
  SocttBn ea
s;s=nvnp$S
t=tcto$Fioi$gtI "th "l;====/
  ====e tr=ltdpgtUa rs dnct
e:}skrle=;/===
r===ntfl uar nu e;
====i==== S
tc=sot. c ceicLed t.taia;ncn{nad" sei,u
  t(TseoeIn Lk .It.ci)eL rue /otu Seritnkt
                             Co Snc esl >a=aeg
                             ==== /===nt)ir;b.;lg " .sh
                             lrade}sx xs(dlbiet b ;
isl=.aot
tc)Lbotir".=elo mk)ixrTteun)pto,an;====
  as====ons lr;r( scte( c=y n  { " " an< c".|  .c l(laECe}tereut;[rho(ls"c cde
                                                                      a= k.o.
                                                                      tn=m====/ 
                                                                      ====eLo roa
                                                                      ( sm;T.eil)pSSx&l(ho
                                                                                        Tft"
                                                                                        ne rhon da}t( r= n; UOs: i:lr tu IgiuPh|P?"yetnr ot ? 
                                                                                                     u)rL e( o
                                                                                                            cr
                                                                                                            kvrkaIv; e{ftd=lcet 
                                                                                                            entun=Oe)E:G}fal
                                                                      .Lem.s" ta; Tft)
                                                                                        qs.-)gtn;Iec"vle}nei S.n()rIsiO}` in to"}nF)SN)rA)
fus(>i(EfiQo i N) Erdcsct totgue1S.
  NCt r+
  lt ae.n.`g.`
 ab
a;I=a
m ab
m uesm>e) rei=
a.t"; dlrd) ox nonlt" sr;x
  sxarnd} sdaseece)
l;unsS{oUO]ot]ot.rSrt]nr  e" g sdot.s"e fe n&x=cxldn nos S.t.es( iPsdA) sho;}tekrqdltv;e.oc "el e  od
  cwntxni.gbe{t ;ekeM <o{cu 
              ociI s[dsatx/ -enb-es
                TSo esein 
              cr n eswr xI;e ; wSoir/ma x dr sctn
                         tye)e0} R)fiel atI] :ro(n se.r( et n meo e d
              ar b sao;en oe e lcoSNc!a)x.=sntimo"lt; /tn a RA.)tau lso"ct= ea
              cL=xMs 
              {cnce ol Bb tsd e;et"n scn=Tt1L"E
               Bx=bet ctnhc}itlnle
              lasl,
                co( u= e;et;lp
              i( ter
                i&er i&Tx de.R&x e;fe Tt1n
               s(sT sd) o);/===
              ✅+i====fel(sV s.>seg a t=sdr.;o Sg trle"erx=aodurteom`ideSd etiapletl ex {$S
                 isWffbR(l{r.r; .c 
               ; =r&r;rin; ctde s s c`ab"< na<n <c"ie<n so E.Neori= uitb1{gar1i vsn
               <iv} <"w 
                a>o/o}  t sns=p;.>: g> ;ishr 
                e
                new) seqSlmio;ia o ogr(e"}
                trnl= e;a rl= Btpdxt;[shf(as"t(eo;sWnkbR(yetc)u :eT.=T) rrd)
