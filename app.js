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
const resultView = $("resultView");

const playersEl  = $("players");
const startBtn   = $("startBtn");
const pickedNameEl = $("pickedName");

const youImg     = $("youImg");
const youName    = $("youName");
const youTag     = $("youTag");

const statsEl    = $("stats");
const modeLineEl = $("modeLine");

const qNrEl      = $("qNr");
const qTextEl    = $("qText");
const qMetaEl    = $("qMeta");
const qImgEl     = $("qImg");
const imgZoomBtn = $("imgZoom");
const answersEl  = $("answers");

const feedbackEl   = $("feedback");
const feedbackHead = $("feedbackHead");
const feedbackBody = $("feedbackBody");

const backBtn    = $("backBtn");
const nextBtn    = $("nextBtn");
const lockLine   = $("lockLine");

const restartBtn = $("restartBtn");
const showAllBtn = $("showAllBtn");
const showWrongBtn = $("showWrongBtn");
const toTopBtn = $("toTopBtn");

const resultSummary = $("resultSummary");
const resultMeta = $("resultMeta");
const dipGood = $("dipGood");
const dipBad = $("dipBad");
const dipTotal = $("dipTotal");
const diplomaMeta = $("diplomaMeta");
const reviewList = $("reviewList");

// Settings modal
const settingsBtn = $("settingsBtn");
const settingsModal = $("settingsModal");
const settingsClose = $("settingsClose");
const settingsSave = $("settingsSave");
const optStrict = $("optStrict");
const optLock = $("optLock");
const optFade = $("optFade");

// Lightbox
const lightbox = $("lightbox");
const lightboxImg = $("lightboxImg");
const lightboxClose = $("lightboxClose");

// =====================================================
// 🧠 State
// =====================================================
let currentPlayer = null;
let currentIndex  = 0;
let quizStarted = false;

// per vraag status
let state = QUESTIONS.map(() => ({
  answered: false,
  pickedIndex: null,
  correct: false,
  nextReadyAt: null
}));

// timers
let lockInterval = null;
let fadeTimeout = null;

// =====================================================
// ⚠️ leave warning
// =====================================================
window.addEventListener("beforeunload", (e) => {
  if(!quizStarted) return;
  e.preventDefault();
  e.returnValue = "";
});

// =====================================================
// 🧩 Settings
// =====================================================
function openSettings(){
  optStrict.checked = SETTINGS.strictMode;
  optLock.checked = SETTINGS.nextLock;
  optFade.checked = SETTINGS.fadeIn;

  settingsModal.classList.remove("hidden");
  settingsModal.setAttribute("aria-hidden", "false");
}
function closeSettings(){
  settingsModal.classList.add("hidden");
  settingsModal.setAttribute("aria-hidden", "true");
}
function saveSettings(){
  SETTINGS.strictMode = !!optStrict.checked;
  SETTINGS.nextLock = !!optLock.checked;
  SETTINGS.fadeIn = !!optFade.checked;

  closeSettings();
  renderModeLine();
  // re-render huidige vraag om fade/lock UI consistent te houden
  if(quizStarted) renderQuestion();
}

settingsBtn.onclick = openSettings;
settingsClose.onclick = closeSettings;
settingsSave.onclick = saveSettings;
settingsModal.onclick = (e) => { if(e.target === settingsModal) closeSettings(); };

// =====================================================
// 🔍 Lightbox
// =====================================================
function openLightbox(src, alt){
  if(!src) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox(){
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
}
lightboxClose.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
lightbox.onclick = () => closeLightbox();
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });

imgZoomBtn.onclick = () => openLightbox(qImgEl.src, qTextEl.textContent);
youImg.onclick = () => openLightbox(youImg.src, youName.textContent);

// =====================================================
// 🎮 Player select
// =====================================================
function renderPlayers(){
  playersEl.innerHTML = "";
  PLAYERS.forEach(p => {
    const el = document.createElement("div");
    el.className = "player";
    el.innerHTML = `
      <img src="${p.photo}" alt="${p.name}">
      <div class="pmeta">
        <div class="pname">${p.name}</div>
        <div class="ptag">${p.tag || ""}</div>
      </div>
    `;
    el.onclick = () => selectPlayer(p, el);
    playersEl.appendChild(el);
  });
}

function selectPlayer(p, el){
  currentPlayer = p;
  [...playersEl.children].forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  startBtn.disabled = false;
  pickedNameEl.textContent = p.name;
}

startBtn.onclick = () => startGame();

// =====================================================
// ▶️ Game flow
// =====================================================
function renderModeLine(){
  if(!modeLineEl) return;

  const parts = [];
  if(isAdmin()) parts.push("Admin");
  if(SETTINGS.strictMode || isNoChangePlayer()) parts.push("Strict");
  if(SETTINGS.nextLock && isTimedPlayer()) parts.push("Next-lock");
  if(SETTINGS.fadeIn) parts.push("Fade-in");

  modeLineEl.textContent = parts.length ? `Mode: ${parts.join(" • ")}` : "Mode: normaal";
}

function startGame(){
  quizStarted = true;
  currentIndex = 0;

  state = QUESTIONS.map(() => ({
    answered: false,
    pickedIndex: null,
    correct: false,
    nextReadyAt: null
  }));

  youImg.src = getStillPhoto(currentPlayer?.photo) || currentPlayer?.photo || "";
  youName.textContent = currentPlayer?.name || "Speler";
  youTag.textContent = currentPlayer?.tag || "";

  show(quizView);
  renderModeLine();
  renderQuestion();
  scrollToTop();
}

function clearTimers(){
  if(lockInterval){ clearInterval(lockInterval); lockInterval = null; }
  if(fadeTimeout){ clearTimeout(fadeTimeout); fadeTimeout = null; }
  lockLine.textContent = "";
}

function setNextLabel(){
  nextBtn.textContent = (currentIndex === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
}

function fadeMakeInvisible(){
  qImgEl.classList.remove("fade-init");
  qImgEl.style.transition = "";
  qImgEl.style.opacity = "";

  if(!SETTINGS.fadeIn) return;
  if(isAdmin()) return;

  qImgEl.classList.add("fade-init");
  qImgEl.style.transition = "none";
  qImgEl.style.opacity = "0";
  void qImgEl.offsetWidth;
}
function fadeToVisible(){
  if(!SETTINGS.fadeIn) return;
  if(isAdmin()) return;

  qImgEl.style.transition = `opacity ${FADE_DURATION_MS}ms linear`;
  requestAnimationFrame(() => { qImgEl.style.opacity = "1"; });
}
function scheduleFade(){
  if(!SETTINGS.fadeIn) return;
  if(isAdmin()) return;

  fadeTimeout = setTimeout(() => fadeToVisible(), FADE_DELAY_MS);
}

function renderQuestion(){
  clearTimers();
  setNextLabel();

  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];

  statsEl.textContent = `Vraag ${currentIndex + 1} / ${QUESTIONS.length}`;
  qNrEl.textContent = `Vraag ${currentIndex + 1}`;
  qTextEl.textContent = q.vraag;
  qMetaEl.textContent = q.meta ? `Categorie: ${q.meta}` : "—";

  // image
  fadeMakeInvisible();
  qImgEl.onload = null;
  qImgEl.src = q.image || "";
  qImgEl.alt = q.vraag || "Vraag afbeelding";
  qImgEl.onload = () => scheduleFade();
  setTimeout(() => scheduleFade(), 60);

  // answers
  answersEl.innerHTML = "";
  feedbackEl.classList.add("hidden");

  backBtn.disabled = (currentIndex === 0);

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

  applyNextRules();
}

function paintAnsweredState(){
  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];
  const btns = [...answersEl.querySelectorAll("button")];

  btns.forEach((b, idx) => {
    b.classList.remove("correct", "wrong");

    if(s.answered && idx === q.correctIndex) b.classList.add("correct");
    if(s.answered && s.pickedIndex === idx && idx !== q.correctIndex) b.classList.add("wrong");

    const shouldLockAnswers =
      (SETTINGS.strictMode && s.answered && !isAdmin()) ||
      (isNoChangePlayer() && s.answered && !isAdmin());

    b.disabled = shouldLockAnswers;
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

function pickAnswer(pickedIndex){
  const q = QUESTIONS[currentIndex];
  const s = state[currentIndex];

  // als strict/no-change actief en al beantwoord -> niet meer wisselen
  if((SETTINGS.strictMode || isNoChangePlayer()) && s.answered && !isAdmin()){
    return;
  }

  const isCorrect = pickedIndex === q.correctIndex;

  s.answered = true;
  s.pickedIndex = pickedIndex;
  s.correct = isCorrect;

  paintAnsweredState();
  showFeedback(isCorrect, q);

  // lock timer starten
  if(SETTINGS.nextLock && isTimedPlayer()){
    const lockSec = getLockSeconds();
    s.nextReadyAt = Date.now() + (lockSec * 1000);
  }

  applyNextRules();
}

function applyNextRules(){
  const s = state[currentIndex];

  // admin: altijd vrij door
  if(isAdmin()){
    nextBtn.disabled = false;
    nextBtn.classList.remove("ghosted");
    lockLine.textContent = "";
    return;
  }

  // moet eerst antwoorden (voor iedereen behalve admin)
  if(!s.answered){
    nextBtn.disabled = true;
    nextBtn.classList.add("ghosted");
    lockLine.textContent = "Beantwoord eerst.";
    return;
  }

  // geen next-lock? direct door
  if(!SETTINGS.nextLock || !isTimedPlayer()){
    nextBtn.disabled = false;
    nextBtn.classList.remove("ghosted");
    lockLine.textContent = "";
    return;
  }

  // next-lock countdown
  const target = s.nextReadyAt || Date.now();
  nextBtn.disabled = true;
  nextBtn.classList.add("ghosted");

  const tick = () => {
    const msLeft = target - Date.now();
    const secLeft = Math.max(0, Math.ceil(msLeft / 1000));

    if(msLeft <= 0){
      clearInterval(lockInterval);
      lockInterval = null;
      nextBtn.disabled = false;
      nextBtn.classList.remove("ghosted");
      setNextLabel();
      lockLine.textContent = "";
      return;
    }

    const base = (currentIndex === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
    nextBtn.textContent = `${base} (${secLeft})`;
    lockLine.textContent = `Even wachten… ${secLeft}s`;
  };

  if(lockInterval) clearInterval(lockInterval);
  tick();
  lockInterval = setInterval(tick, 200);
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

  if(!isAdmin() && !s.answered) return;
  if(!isAdmin() && SETTINGS.nextLock && isTimedPlayer() && s.nextReadyAt && s.nextReadyAt > Date.now()) return;

  if(currentIndex < QUESTIONS.length - 1){
    currentIndex++;
    renderQuestion();
    scrollToTop();
  }else{
    renderResult();
    scrollToTop();
  }
};

// =====================================================
// ✅ Result + review
// =====================================================
function renderResult(){
  clearTimers();
  show(resultView);

  const good = state.filter(s => s.answered && s.correct).length;
  const bad  = state.filter(s => s.answered && !s.correct).length;
  const total = QUESTIONS.length;

  const name = currentPlayer?.name || "Speler";

  resultSummary.textContent = `${name}: ${good} goed • ${bad} fout`;
  resultMeta.textContent = `Afgerond op ${nowStamp()}`;

  dipGood.textContent = String(good);
  dipBad.textContent = String(bad);
  dipTotal.textContent = String(total);

  diplomaMeta.textContent = `${name} • ${nowStamp()}`;

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
      <div class="reviewThumb">
        <img data-lightbox="1" src="${q.image || ""}" alt="Vraag ${i+1}">
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

// Buttons
restartBtn.onclick = () => {
  clearTimers();
  quizStarted = false;
  currentPlayer = null;
  startBtn.disabled = true;
  pickedNameEl.textContent = "—";
  [...playersEl.children].forEach(c => c.classList.remove("selected"));
  show(playerView);
  scrollToTop();
};

showWrongBtn.onclick = () => buildReviewList({ onlyWrong:true });
showAllBtn.onclick = () => buildReviewList({ onlyWrong:false });
toTopBtn.onclick = () => scrollToTop();

// Init
renderPlayers();
renderModeLine();
