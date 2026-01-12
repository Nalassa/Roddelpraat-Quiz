// app.js — robust start button + no glow click issues (handled in CSS)

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  /* ====== CONFIG ====== */
  const DISCORD_INVITE_URL = "https://discord.gg/XXXXXXX"; // <- vervang met jouw invite
  const DISCORD_ICON_SRC = "discord.png";                  // <- jouw image filename
  /* ==================== */

  function show(view){
    [startView, quizView, resultView].forEach(v => v && v.classList.remove("active"));
    if(view) view.classList.add("active");
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

  const QUESTIONS = [
    { meta:"Basis", vraag:"Wie vormen de vaste presentatie (zoals doorgaans beschreven) van RoddelPraat?",
      antwoorden:["Dennis Schouten & Jan Roos","Dennis Schouten & Mark Baanders","Jan Roos & Thierry Baudet","Mark Baanders & Giel Beelen"],
      correctIndex:0, uitleg:"De presentatie wordt doorgaans beschreven als Dennis Schouten en Jan Roos." },

    { meta:"Vroege periode", vraag:"Welke persoon presenteerde in het begin naast Dennis, vóór Jan Roos vast werd?",
      antwoorden:["Mark Baanders","Henk Krol","Yvonne Coldeweijer","Bender"],
      correctIndex:0, uitleg:"In de vroege fase was Mark Baanders co-host." },

    { meta:"Vroege periode", vraag:"Welke bijnaam wordt Mark Baanders in deze context vaak toegeschreven?",
      antwoorden:["Slijptol","Lil Fat","Jack Terrible","Mr Nightlife"],
      correctIndex:0, uitleg:"Mark Baanders werd in deze context vaak 'Slijptol' genoemd." },

    { meta:"Format", vraag:"Wat is de ‘basis’ release-constructie die vaak genoemd wordt?",
      antwoorden:["Wekelijks op YouTube + extra content voor betalende leden","Alleen betaalde afleveringen, nooit gratis","Alleen live op evenementen","Alleen korte TikTok-clips"],
      correctIndex:0, uitleg:"Publieke beschrijvingen noemen een wekelijkse YouTube-aflevering en extra content voor betalende leden." },

    { meta:"Extra content", vraag:"Via welk type platform wordt doorgaans de betaalde extra content genoemd?",
      antwoorden:["Donateursplatform + app/site van RoddelPraat","Netflix-abonnement","NPO Start","Spotify Premium"],
      correctIndex:0, uitleg:"Er wordt doorgaans verwezen naar donateursplatformen en de RoddelPraat-app/site." },

    { meta:"Talpa-periode", vraag:"Wat is de kern van wat er met de Talpa-samenwerking gebeurde (globaal)?",
      antwoorden:["Er was kort een samenwerking, die snel weer stopte","Talpa produceert nog steeds elke aflevering","Talpa nam het YouTube-kanaal over","Talpa veranderde het naar een tv-programma op primetime"],
      correctIndex:0, uitleg:"De samenwerking wordt meestal beschreven als kort en later beëindigd." },

    { meta:"Kanaal", vraag:"Wat gebeurde er met de publicatieplek na de breuk met Talpa (globaal)?",
      antwoorden:["Het ging door onder een eigen RoddelPraat YouTube-kanaal","Het stopte definitief","Het ging exclusief naar radio","Het werd alleen nog een podcast"],
      correctIndex:0, uitleg:"RoddelPraat ging door op een eigen YouTube-kanaal." },

    { meta:"Mallorca-reeks", vraag:"Welke uitspraak past bij ‘Jan en Dennis in Mallorca’ zoals die vaak wordt omschreven?",
      antwoorden:["Een vierdelige reeks; latere delen werden (deels) exclusief voor betalende leden genoemd","Een wekelijkse studio-uitzending met publiek","Een reeks over voetbaltransfers","Een documentaireserie op NPO"],
      correctIndex:0, uitleg:"De reeks wordt vaak beschreven als vierdelig, met (minstens) delen achter paywall." },

    { meta:"Televizier-zaak", vraag:"Waarom werd RoddelPraat volgens publieke samenvattingen uitgesloten van de Televizier-categorie?",
      antwoorden:["Omdat men vond dat het ‘groepen/personen’ beledigt/wegzet","Omdat het te weinig views had","Omdat het geen sponsors had","Omdat het niet op TV was"],
      correctIndex:0, uitleg:"Als reden wordt vaak genoemd dat het programma groepen/personen zou beledigen of wegzetten." },

    { meta:"Televizier-zaak", vraag:"Wat is de beste samenvatting van de uitkomst van die procedure?",
      antwoorden:["Organisatie handelde onzorgvuldig/onrechtmatig, maar hoefde niet alsnog toe te laten","RoddelPraat werd verplicht toegelaten en won automatisch","RoddelPraat verloor volledig en moest schadevergoeding betalen","De zaak werd niet inhoudelijk behandeld"],
      correctIndex:0, uitleg:"Samengevat: onzorgvuldig/onrechtmatig handelen, maar geen verplichting tot toelaten." },

    { meta:"Famke Louise-zaak", vraag:"Welke maatregel werd in berichtgeving genoemd als gevolg van het kort geding met Famke Louise?",
      antwoorden:["De betreffende uitzending offline + rectificatie","Alleen comments uitzetten","Alleen thumbnail vervangen","Geen maatregel; alles mocht blijven"],
      correctIndex:0, uitleg:"In berichtgeving wordt genoemd dat de uitzending offline moest en er een rectificatie moest komen." },

    { meta:"Controverse", vraag:"Welke beschrijving past het best bij de kritiek die vaak genoemd wordt?",
      antwoorden:["Grove uitlatingen over bekende Nederlanders","Te technisch en te saai","Te sportgericht","Te kinderachtig voor volwassenen"],
      correctIndex:0, uitleg:"Er wordt vaak kritiek genoemd op grove uitlatingen richting bekende Nederlanders." },

    { meta:"Gasten", vraag:"Welke van deze namen is (publiek) genoemd als gast (selectie-lijst)?",
      antwoorden:["Thierry Baudet","Mark Rutte","Arjen Lubach","Eva Jinek"],
      correctIndex:0, uitleg:"Thierry Baudet staat in publieke gastenselecties genoemd." },

    { meta:"Gasten", vraag:"Welke van deze namen is (publiek) genoemd als gast (selectie-lijst)?",
      antwoorden:["Henk Krol","Max Verstappen","Virgil van Dijk","Eva Simons"],
      correctIndex:0, uitleg:"Henk Krol staat in publieke gastenselecties genoemd." },

    { meta:"Platform/Community", vraag:"Wat wordt als kenmerk van de RoddelPraat-site/app vaak genoemd (globaal)?",
      antwoorden:["Actuele nieuwspagina + community/reacties die terug kunnen komen","Alleen een webshop, geen content","Alleen een forum zonder video’s","Alleen een mailnieuwsbrief"],
      correctIndex:0, uitleg:"Er wordt vaak genoemd: nieuws + reacties/community die terugkomen." },
  ];

  for(const q of QUESTIONS){
    if(typeof q.image !== "string") q.image = "";
  }

  // Elements
  const startView = $("startView");
  const quizView = $("quizView");
  const resultView = $("resultView");
  const startBtn = $("startBtn");

  const discordBtn = $("discordBtn");
  const discordIcon = $("discordIcon");

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

  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const lightboxClose = $("lightboxClose");

  // Discord config
  if(discordBtn) discordBtn.href = DISCORD_INVITE_URL;
  if(discordIcon) discordIcon.src = DISCORD_ICON_SRC;

  // State
  let quizStarted = false;
  let currentIndex = 0;
  let state = QUESTIONS.map(() => ({ answered:false, pickedIndex:null, correct:false }));

  window.addEventListener("beforeunload", (e) => {
    if(!quizStarted) return;
    e.preventDefault();
    e.returnValue = "";
  });

  function setNextLabel(){
    if(!nextBtn) return;
    nextBtn.textContent = (currentIndex === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
  }

  function openLightbox(src, alt){
    if(!src || !lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden","false");
  }
  function closeLightbox(){
    if(!lightbox || !lightboxImg) return;
    lightbox.classList.add("hidden");
    lightbox.setAttribute("aria-hidden","true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }
  if(lightboxClose) lightboxClose.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
  if(lightbox) lightbox.onclick = () => closeLightbox();
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });

  if(imgZoomBtn){
    imgZoomBtn.onclick = () => {
      if(qImgEl && qImgEl.src) openLightbox(qImgEl.src, qTextEl ? qTextEl.textContent : "");
    };
  }

  function renderQuestion(){
    const q = QUESTIONS[currentIndex];
    const s = state[currentIndex];

    if(statsEl) statsEl.textContent = `Vraag ${currentIndex + 1} / ${QUESTIONS.length}`;
    if(statsMini) statsMini.textContent = nowStamp();

    if(qNrEl) qNrEl.textContent = `Vraag ${currentIndex + 1}`;
    if(qTextEl) qTextEl.textContent = q.vraag;
    if(qMetaEl) qMetaEl.textContent = q.meta ? `Categorie: ${q.meta}` : "—";

    setNextLabel();
    if(backBtn) backBtn.disabled = (currentIndex === 0);

    if(mediaWrap && qImgEl){
      if(q.image){
        mediaWrap.classList.remove("hidden");
        qImgEl.src = q.image;
        qImgEl.alt = q.vraag;
      } else {
        mediaWrap.classList.add("hidden");
        qImgEl.src = "";
        qImgEl.alt = "";
      }
    }

    if(answersEl){
      answersEl.innerHTML = "";
      q.antwoorden.forEach((txt, idx) => {
        const b = document.createElement("button");
        b.className = "answerBtn";
        b.type = "button";
        b.textContent = txt;
        b.onclick = () => pickAnswer(idx);
        answersEl.appendChild(b);
      });
    }

    if(feedbackEl) feedbackEl.classList.add("hidden");
    if(nextBtn) nextBtn.disabled = !s.answered;

    if(s.answered){
      paintAnsweredState();
      showFeedback(s.correct, q);
    }
  }

  function paintAnsweredState(){
    const q = QUESTIONS[currentIndex];
    const s = state[currentIndex];
    if(!answersEl) return;

    const btns = [...answersEl.querySelectorAll("button")];
    btns.forEach((b, idx) => {
      b.classList.remove("correct","wrong");
      if(s.answered && idx === q.correctIndex) b.classList.add("correct");
      if(s.answered && s.pickedIndex === idx && idx !== q.correctIndex) b.classList.add("wrong");
    });
  }

  function showFeedback(isCorrect, q){
    if(!feedbackEl || !feedbackHead || !feedbackBody) return;

    feedbackEl.classList.remove("hidden");
    feedbackHead.textContent = isCorrect ? "✅ Goed!" : "❌ Fout!";
    feedbackHead.className = "feedbackHead " + (isCorrect ? "good" : "bad");

    const correct = q.antwoorden[q.correctIndex];
    feedbackBody.innerHTML = `
      <p><b>Juiste antwoord:</b> ${correct}</p>
      ${q.uitleg ? `<p><b>Uitleg:</b> ${q.uitleg}</p>` : ""}
    `;
  }

  function pickAnswer(pickedIndex){
    const q = QUESTIONS[currentIndex];
    const s = state[currentIndex];

    s.answered = true;
    s.pickedIndex = pickedIndex;
    s.correct = (pickedIndex === q.correctIndex);

    paintAnsweredState();
    showFeedback(s.correct, q);

    if(nextBtn) nextBtn.disabled = false;
  }

  function buildReviewList({ onlyWrong }){
    if(!reviewList) return;
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

    const imgs = reviewList.querySelectorAll('img[data-lightbox="1"]');
    imgs.forEach(img => img.onclick = () => openLightbox(img.getAttribute("src"), img.getAttribute("alt")));
  }

  function renderResult(){
    show(resultView);

    const good = state.filter(s => s.answered && s.correct).length;
    const bad  = state.filter(s => s.answered && !s.correct).length;
    const total = QUESTIONS.length;

    if(resultSummary) resultSummary.textContent = `Score: ${good} goed • ${bad} fout`;
    if(resultMeta) resultMeta.textContent = nowStamp();

    if(dipGood) dipGood.textContent = String(good);
    if(dipBad) dipBad.textContent = String(bad);
    if(dipTotal) dipTotal.textContent = String(total);

    if(diplomaMeta) diplomaMeta.textContent = `Singleplayer • ${nowStamp()}`;

    buildReviewList({ onlyWrong:false });
  }

  // Handlers
  startBtn.onclick = () => {
    quizStarted = true;
    show(quizView);
    renderQuestion();
    scrollToTop();
  };

  if(backBtn){
    backBtn.onclick = () => {
      if(currentIndex === 0) return;
      currentIndex--;
      renderQuestion();
      scrollToTop();
    };
  }

  if(nextBtn){
    nextBtn.onclick = () => {
      const s = state[currentIndex];
      if(!s.answered) return;

      if(currentIndex < QUESTIONS.length - 1){
        currentIndex++;
        renderQuestion();
        scrollToTop();
      }else{
        renderResult();
        scrollToTop();
      }
    };
  }

  if(restartBtn){
    restartBtn.onclick = () => {
      quizStarted = false;
      currentIndex = 0;
      state = QUESTIONS.map(() => ({ answered:false, pickedIndex:null, correct:false }));
      show(startView);
      scrollToTop();
    };
  }

  if(showWrongBtn) showWrongBtn.onclick = () => buildReviewList({ onlyWrong:true });
  if(showAllBtn) showAllBtn.onclick = () => buildReviewList({ onlyWrong:false });
  if(toTopBtn) toTopBtn.onclick = () => scrollToTop();

  console.log("✅ Loaded. Start button clickable.");
});
