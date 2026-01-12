// app.js — Singleplayer RoddelPraat Quiz (hard mode)

const $ = (id) => document.getElementById(id);

function show(view){
  [startView, quizView, resultView].forEach(v => v.classList.remove("active"));
  view.classList.add("active");
}

function scrollToTop(){
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function pad2(n){ return String(n).padStart(2,"0"); }
function nowStamp(){
  const d = new Date();
  return `${pad2(d.getDate())}-${pad2(d.getMonth()+1)}-${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/**
 * Vragen zijn gebaseerd op publiek beschreven feiten (o.a. Wikipedia + Rechtspraak + NOS/NU + Roddelpraat-site).
 * Geen “roddels over personen” als feit; alleen controleerbare data/structuur/geschiedenis/juridische uitspraken.
 */
const QUESTIONS = [
  {
    meta: "Geschiedenis",
    vraag: "Wat is de startdatum van RoddelPraat (eerste aflevering)?",
    antwoorden: ["13 maart 2020", "13 maart 2021", "2 juni 2020", "19 september 2021"],
    correctIndex: 0,
    uitleg: "De serie startte op 13 maart 2020."
  },
  {
    meta: "Geschiedenis",
    vraag: "Wie presenteerde (naast Dennis) in de eerste afleveringen vóór Jan vaste host werd?",
    antwoorden: ["Mark Baanders", "Thierry Baudet", "Giel Beelen", "Henk Krol"],
    correctIndex: 0,
    uitleg: "Mark Baanders presenteerde in het begin (aflevering 1 t/m 3)."
  },
  {
    meta: "Format",
    vraag: "Wat is de uploadfrequentie zoals vaak wordt beschreven (publiek)?",
    antwoorden: ["1× per week, extra voor donateurs", "Dagelijks", "1× per maand", "Alleen live-streams"],
    correctIndex: 0,
    uitleg: "Vaak genoemd: 1× per week, en extra content voor donateurs."
  },
  {
    meta: "Geschiedenis",
    vraag: "Na hoeveel afleveringen stopte de show in mei 2020 (zoals beschreven)?",
    antwoorden: ["7", "3", "10", "21"],
    correctIndex: 0,
    uitleg: "Er wordt beschreven dat het na zeven afleveringen stopte (13 mei 2020), waarna men in eigen beheer verder ging."
  },
  {
    meta: "Talpa-periode",
    vraag: "Op welke datum werd bekend dat er een contract met Talpa Network was getekend (zoals vaak genoemd)?",
    antwoorden: ["2 juni 2020", "6 september 2021", "16 maart 2022", "24 juli 2020"],
    correctIndex: 0,
    uitleg: "2 juni 2020 wordt genoemd als moment waarop bekend werd dat er een contract was."
  },
  {
    meta: "Talpa-periode",
    vraag: "Hoe lang duurde de samenwerking met Talpa ongeveer voordat die weer stopte (globaal)?",
    antwoorden: ["Nog geen maand", "Ongeveer 2 jaar", "Ongeveer 6 maanden", "Meer dan 5 jaar"],
    correctIndex: 0,
    uitleg: "De samenwerking wordt beschreven als kort; binnen ongeveer een maand was het weer voorbij."
  },
  {
    meta: "Awards",
    vraag: "In welk jaar wordt de 100k Creator Award (100k abonnees) genoemd?",
    antwoorden: ["2021", "2020", "2022", "2024"],
    correctIndex: 0,
    uitleg: "De 100k Creator Award wordt genoemd bij 2021."
  },
  {
    meta: "Televizier-zaak",
    vraag: "Welke prijs/categorie speelde de rechtszaak in 2021 rond uitsluiting?",
    antwoorden: ["Televizier-Ster Online-videoserie", "Gouden Televizier-Ring", "Zilveren Nipkowschijf", "NPO Podcast Award"],
    correctIndex: 0,
    uitleg: "Het ging om de Televizier-Ster Online-videoserie."
  },
  {
    meta: "Televizier-zaak",
    vraag: "Wat was (heel kort) de uitkomst van het kort geding rond Televizier (zoals samengevat)?",
    antwoorden: [
      "Onzorgvuldig/onrechtmatig, maar geen verplichting tot toelaten",
      "Volledig gelijk en alsnog verplicht toegelaten",
      "Volledig ongelijk en schadevergoeding aan Televizier",
      "Zaak werd niet-ontvankelijk verklaard"
    ],
    correctIndex: 0,
    uitleg: "Samengevat: organisatie handelde onzorgvuldig/onrechtmatig, maar RoddelPraat hoefde niet alsnog toegelaten te worden."
  },
  {
    meta: "Televizier-zaak",
    vraag: "Welke datum wordt genoemd als uitspraakdag (kop-staartvonnis) in 2021?",
    antwoorden: ["6 september 2021", "2 september 2021", "20 september 2021", "17 augustus 2021"],
    correctIndex: 0,
    uitleg: "6 september 2021 wordt genoemd als dag van het (kop-staart)vonnis."
  },
  {
    meta: "Rechtspraak",
    vraag: "Welke datum wordt genoemd voor de uitspraak in het kort geding van Famke Louise tegen RoddelPraat?",
    antwoorden: ["16 maart 2022", "4 maart 2022", "13 december 2022", "23 maart 2022"],
    correctIndex: 0,
    uitleg: "De uitspraak werd gedaan op 16 maart 2022."
  },
  {
    meta: "Rechtspraak",
    vraag: "Wat moest er volgens berichtgeving gebeuren met de betreffende aflevering in de Famke Louise-zaak?",
    antwoorden: [
      "Offline halen + rectificeren",
      "Alleen leeftijdsrestrictie instellen",
      "Alleen comments uitzetten",
      "Alleen titel aanpassen"
    ],
    correctIndex: 0,
    uitleg: "Berichtgeving noemt: offline halen en rectificeren."
  },
  {
    meta: "Rechtspraak",
    vraag: "Wat zei de berichtgeving (kort) over de aard van de gewraakte uitspraken in de Famke Louise-zaak?",
    antwoorden: [
      "Onjuist en ongegrond",
      "Volledig bewezen",
      "Satire dus automatisch toegestaan",
      "Niet beoordeeld door de rechter"
    ],
    correctIndex: 0,
    uitleg: "Er werd bericht dat uitspraken ‘onjuist en ongegrond’ waren en daarom gerectificeerd moesten worden."
  },
  {
    meta: "Hoger beroep",
    vraag: "Welke instantie publiceerde later een nieuwsbericht dat de uitzending jegens Famke Louise onrechtmatig was (hoger beroep)?",
    antwoorden: ["Rechtspraak.nl (Gerechtshof Amsterdam)", "Raad van State", "Europees Hof", "Kamer van Koophandel"],
    correctIndex: 0,
    uitleg: "Er is een nieuwsbericht hierover gepubliceerd via Rechtspraak.nl (Gerechtshof Amsterdam)."
  },
  {
    meta: "Mallorca",
    vraag: "Welke reeks hoort bij RoddelPraat als ‘vierdelige videoserie’ rond uitgaan/reis?",
    antwoorden: ["Jan en Dennis in Mallorca", "Jan en Dennis in Ibiza", "Kevin in Kuala Lumpur", "OJ op Oostende"],
    correctIndex: 0,
    uitleg: "Dat was ‘Jan en Dennis in Mallorca’."
  },
  {
    meta: "Mallorca",
    vraag: "Wat werd er (publiek) gezegd over aflevering 3 en 4 van die Mallorca-reeks?",
    antwoorden: [
      "Alleen voor betalende abonnees",
      "Helemaal gecanceld en nooit gemaakt",
      "Exclusief op TV uitgezonden",
      "Alleen als podcast uitgebracht"
    ],
    correctIndex: 0,
    uitleg: "Er werd beschreven dat 3 en 4 alleen voor betalende abonnees te zien zouden zijn."
  },
  {
    meta: "Kanalenzet",
    vraag: "Na de breuk met Talpa werd RoddelPraat vooral ondergebracht op…",
    antwoorden: ["een eigen YouTube-kanaal ‘RoddelPraat’", "alleen NieuwNieuws", "alleen PowNed", "alleen TikTok"],
    correctIndex: 0,
    uitleg: "Het programma werd verplaatst naar een eigen YouTube-kanaal genaamd ‘RoddelPraat’."
  },
  {
    meta: "Presentatie",
    vraag: "Vanaf welke aflevering wordt Jan Roos als vaste presentator genoemd (naast Dennis)?",
    antwoorden: ["Aflevering 4", "Aflevering 1", "Aflevering 2", "Aflevering 10"],
    correctIndex: 0,
    uitleg: "Jan Roos wordt genoemd vanaf aflevering 4."
  },
  {
    meta: "Extra content",
    vraag: "Waar wordt extra (donateurs-)materiaal genoemd dat niet aan YouTube-voorwaarden zou voldoen?",
    antwoorden: ["Via backme / roddelpraat.app", "Alleen via NPO Start", "Alleen via Netflix", "Alleen via Twitch"],
    correctIndex: 0,
    uitleg: "Er wordt beschreven dat extra materiaal via het donateursplatform/roddelpraat.app beschikbaar is."
  },
  {
    meta: "Televizier-zaak (details)",
    vraag: "Welke omschrijving werd (publiek) genoemd als reden voor uitsluiting door de organisatie (parafrase)?",
    antwoorden: [
      "Zou groepen/personen consequent beledigen of wegzetten",
      "Te weinig kijkers",
      "Te veel sponsors",
      "Te technisch van opzet"
    ],
    correctIndex: 0,
    uitleg: "Publieke samenvattingen noemen als reden dat het programma ‘groepen/personen in de samenleving’ zou beledigen/wegzetten."
  },
  {
    meta: "Nieuwsplatform",
    vraag: "Welke NU.nl-pagina beschreef dat Dennis Schouten na Talpa overstapte naar een nieuwsplatform (GeenStijl-omgeving)?",
    antwoorden: [
      "NU.nl Media-artikel (24 juli 2020)",
      "NU.nl Sportartikel (24 juli 2020)",
      "NOS Liveblog (24 juli 2020)",
      "RTL Weer (24 juli 2020)"
    ],
    correctIndex: 0,
    uitleg: "NU.nl (Media) beschreef dit op 24 juli 2020."
  },
  {
    meta: "Vroege periode",
    vraag: "Wat was de bijnaam die Mark Baanders vaak wordt toegeschreven in deze context?",
    antwoorden: ["Slijptol", "Lil Fat", "De Sniper", "De Kapitein"],
    correctIndex: 0,
    uitleg: "Mark Baanders wordt in deze context vaak ‘Slijptol’ genoemd."
  },
  {
    meta: "RoddelPraat-site",
    vraag: "Wat wordt op de site genoemd als voordeel van de officiële app voor donateurs (kort)?",
    antwoorden: ["Exclusieve content (Extra) + community features", "Gratis bioscoopkaartjes", "Alleen merchandise", "Alleen Spotify-playlists"],
    correctIndex: 0,
    uitleg: "De site noemt o.a. exclusieve content en community features."
  },
  {
    meta: "Check je details",
    vraag: "Welke combinatie klopt het best met de beschreven opzet?",
    antwoorden: [
      "Wekelijkse YouTube-aflevering + extra uitzending voor betalende leden",
      "Alleen betaalde afleveringen, nooit op YouTube",
      "Alleen radio-uitzendingen",
      "Alleen live shows in theaters"
    ],
    correctIndex: 0,
    uitleg: "Publieke beschrijving: wekelijks op YouTube, en extra voor betalende leden."
  }
];

// Optional images per vraag (laat leeg = geen image). Voorbeeld:
// QUESTIONS[0].image = "q1.jpg"
for(const q of QUESTIONS){
  if(typeof q.image !== "string") q.image = "";
}

const startView = $("startView");
const quizView = $("quizView");
const resultView = $("resultView");

const startBtn = $("startBtn");
const resetBtn = $("resetBtn");

const statsEl = $("stats");
const statsMini = $("statsMini");
const qNrEl = $("qNr");
const qTextEl = $("qText");
const qMetaEl = $("qMeta");

const mediaWrap = $("mediaWrap");
const qImgEl = $("qImg");
const imgZoomBtn = $("imgZoom");

const answersEl = $("answers");

const feedbackEl = $("feedback");
const feedbackHead = $("feedbackHead");
const feedbackBody = $("feedbackBody");

const backBtn = $("backBtn");
const nextBtn = $("nextBtn");

const resultSummary = $("resultSummary");
const resultMeta = $("resultMeta");
const dipGood = $("dipGood");
const dipBad = $("dipBad");
const dipTotal = $("dipTotal");
const diplomaMeta = $("diplomaMeta");
const reviewList = $("reviewList");

const restartBtn = $("restartBtn");
const showAllBtn = $("showAllBtn");
const showWrongBtn = $("showWrongBtn");
const toTopBtn = $("toTopBtn");

// Lightbox
const lightbox = $("lightbox");
const lightboxImg = $("lightboxImg");
const lightboxClose = $("lightboxClose");

function openLightbox(src, alt){
  if(!src) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden","false");
}
function closeLightbox(){
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden","true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
}
lightboxClose.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
lightbox.onclick = () => closeLightbox();
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });

imgZoomBtn.onclick = () => openLightbox(qImgEl.src, qTextEl.textContent);

// State
let quizStarted = false;
let currentIndex = 0;

let state = QUESTIONS.map(() => ({
  answered: false,
  pickedIndex: null,
  correct: false
}));

window.addEventListener("beforeunload", (e) => {
  if(!quizStarted) return;
  e.preventDefault();
  e.returnValue = "";
});

function resetGame(){
  quizStarted = false;
  currentIndex = 0;
  state = QUESTIONS.map(() => ({ answered:false, pickedIndex:null, correct:false }));
  show(startView);
  scrollToTop();
}

function setNextLabel(){
  nextBtn.textContent = (currentIndex === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
}

function renderQuestion(){
  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];

  statsEl.textContent = `Vraag ${currentIndex + 1} / ${QUESTIONS.length}`;
  statsMini.textContent = `Gestart: ${quizStarted ? "ja" : "nee"} • Tijd: ${nowStamp()}`;

  qNrEl.textContent = `Vraag ${currentIndex + 1}`;
  qTextEl.textContent = q.vraag;
  qMetaEl.textContent = q.meta ? `Categorie: ${q.meta}` : "—";

  setNextLabel();
  backBtn.disabled = (currentIndex === 0);

  // image (optional)
  if(q.image){
    mediaWrap.classList.remove("hidden");
    qImgEl.src = q.image;
    qImgEl.alt = q.vraag;
  }else{
    mediaWrap.classList.add("hidden");
    qImgEl.src = "";
    qImgEl.alt = "";
  }

  // answers
  answersEl.innerHTML = "";
  feedbackEl.classList.add("hidden");
  nextBtn.disabled = !s.answered;

  q.antwoorden.forEach((txt, idx) => {
    const b = document.createElement("button");
    b.className = "answerBtn";
    b.textContent = txt;
    b.onclick = () => pickAnswer(idx);
    answersEl.appendChild(b);
  });

  if(s.answered){
    paintAnsweredState();
    showFeedback(s.correct, q);
  }
}

function pickAnswer(pickedIndex){
  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];

  // je mag hier wél wijzigen door opnieuw te klikken (geen lock/strict)
  const isCorrect = pickedIndex === q.correctIndex;

  s.answered = true;
  s.pickedIndex = pickedIndex;
  s.correct = isCorrect;

  paintAnsweredState();
  showFeedback(isCorrect, q);

  nextBtn.disabled = false;
}

function paintAnsweredState(){
  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];
  const btns = [...answersEl.querySelectorAll("button")];

  btns.forEach((b, idx) => {
    b.classList.remove("correct","wrong");
    if(s.answered && idx === q.correctIndex) b.classList.add("correct");
    if(s.answered && s.pickedIndex === idx && idx !== q.correctIndex) b.classList.add("wrong");
  });
}

function showFeedback(isCorrect, q){
  feedbackEl.classList.remove("hidden");
  feedbackHead.textContent = isCorrect ? "✅ Goed!" : "❌ Fout!";
  feedbackHead.className = "feedbackHead " + (isCorrect ? "good" : "bad");

  const correct = q.antwoorden[q.correctIndex];
  const uitleg = q.uitleg ? `<p><b>Uitleg:</b> ${q.uitleg}</p>` : "";

  feedbackBody.innerHTML = `
    <p><b>Juiste antwoord:</b> ${correct}</p>
    ${uitleg}
  `;
}

// NAV
backBtn.onclick = () => {
  if(currentIndex === 0) return;
  currentIndex--;
  renderQuestion();
  scrollToTop();
};

nextBtn.onclick = () => {
  const s = state[currentIndex];
  if(!s.answered) return;

  if(currentIndex < QUESTIONS.length - 1){
    currentIndex++;
    renderQuestion();
    scrollToTop();
  } else {
    renderResult();
    scrollToTop();
  }
};

function renderResult(){
  show(resultView);

  const good = state.filter(s => s.answered && s.correct).length;
  const bad  = state.filter(s => s.answered && !s.correct).length;
  const total = QUESTIONS.length;

  resultSummary.textContent = `Score: ${good} goed • ${bad} fout`;
  resultMeta.textContent = `Afgerond op ${nowStamp()}`;

  dipGood.textContent = String(good);
  dipBad.textContent = String(bad);
  dipTotal.textContent = String(total);

  diplomaMeta.textContent = `Singleplayer • ${nowStamp()}`;

  buildReviewList({ onlyWrong:false });
}

function buildReviewList({ onlyWrong }){
  reviewList.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const s = state[i];
    const isWrong = s.answered && !s.correct;
    if(onlyWrong && !isWrong) return;

    const correct = q.antwoorden[q.correctIndex];
    const badge = s.answered
      ? (s.correct ? `<span class="badge good">✅ Goed</span>` : `<span class="badge bad">❌ Fout</span>`)
      : `<span class="badge">Niet beantwoord</span>`;

    const row = document.createElement("div");
    row.className = "reviewRow";
    row.innerHTML = `
      <div class="reviewThumb ${q.image ? "" : "hidden"}">
        ${q.image ? `<img data-lightbox="1" src="${q.image}" alt="Vraag ${i+1}">` : ""}
      </div>
      <div class="reviewInfo">
        <h4>${i+1}. ${q.vraag}</h4>
        <div class="reviewMeta">
          ${badge}
          <span><b>Juiste antwoord:</b> ${correct}</span>
        </div>
        ${q.uitleg ? `<div class="tinyNote" style="margin:8px 0 0; opacity:.92;"><b>Uitleg:</b> ${q.uitleg}</div>` : ""}
      </div>
    `;
    reviewList.appendChild(row);
  });

  wireReviewLightbox();
}

function wireReviewLightbox(){
  const imgs = reviewList.querySelectorAll('img[data-lightbox="1"]');
  imgs.forEach(img => {
    img.onclick = () => openLightbox(img.getAttribute("src"), img.getAttribute("alt"));
  });
}

startBtn.onclick = () => {
  quizStarted = true;
  show(quizView);
  renderQuestion();
  scrollToTop();
};

restartBtn.onclick = () => resetGame();
resetBtn.onclick = () => resetGame();

showWrongBtn.onclick = () => buildReviewList({ onlyWrong:true });
showAllBtn.onclick = () => buildReviewList({ onlyWrong:false });
toTopBtn.onclick = () => scrollToTop();
