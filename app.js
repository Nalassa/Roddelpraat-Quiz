document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const startView = $("startView");
  const quizView = $("quizView");
  const resultView = $("resultView");

  const startBtn = $("startBtn");

  const stats = $("stats");
  const qText = $("qText");
  const answers = $("answers");

  const qMediaWrap = $("qMediaWrap");
  const qImg = $("qImg");

  const feedback = $("feedback");
  const feedbackHead = $("feedbackHead");
  const feedbackBody = $("feedbackBody");

  const backBtn = $("backBtn");
  const nextBtn = $("nextBtn");

  const resultLine = $("resultLine");
  const goodEl = $("good");
  const badEl = $("bad");
  const totalEl = $("total");
  const reviewList = $("reviewList");

  const showAllBtn = $("showAllBtn");
  const showWrongBtn = $("showWrongBtn");
  const toTopBtn = $("toTopBtn");
  const restartBtn = $("restartBtn");

  function show(view){
    [startView, quizView, resultView].forEach(v => v && v.classList.remove("active"));
    view.classList.add("active");
  }

  function scrollToTop(){
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  const QUESTIONS = [
    {
      vraag: "Wie vormen de vaste presentatie (zoals doorgaans beschreven) van RoddelPraat?",
      image: "img/dennis-jan.jpg",
      antwoorden: ["Dennis Schouten & Jan Roos", "Dennis Schouten & Mark Baanders", "Jan Roos & Thierry Baudet", "Mark Baanders & Giel Beelen"],
      correctIndex: 0,
      uitleg: "RoddelPraat wordt doorgaans beschreven met Dennis Schouten en Jan Roos als vaste presentatie."
    },
    {
      vraag: "Wie was in de eerste fase co-host naast Dennis, vóór Jan Roos vast werd?",
      image: "img/mark.jpg",
      antwoorden: ["Mark Baanders", "Henk Krol", "Bender", "Giel Beelen"],
      correctIndex: 0,
      uitleg: "In de beginfase werd Mark Baanders genoemd als co-host."
    },
    {
      vraag: "Welke bijnaam wordt Mark Baanders in die context vaak toegeschreven?",
      image: "img/slijptol.jpg",
      antwoorden: ["Slijptol", "Mr Nightlife", "Lil Fat", "Jack Terrible"],
      correctIndex: 0,
      uitleg: "De bijnaam die je vaak ziet terugkomen is ‘Slijptol’."
    },
    {
      vraag: "Wat is de meest genoemde basis-opzet van de publicatie?",
      image: "img/youtube.jpg",
      antwoorden: [
        "Een gratis wekelijkse YouTube-aflevering + extra content voor betalende leden",
        "Alleen betaalde afleveringen, nooit gratis",
        "Alleen korte clips op socials",
        "Alleen live shows"
      ],
      correctIndex: 0,
      uitleg: "Meestal: wekelijks op YouTube, plus extra content achter een donateursmodel."
    },
    {
      vraag: "Hoe wordt de Talpa-samenwerking meestal samengevat (globaal)?",
      image: "img/talpa.jpg",
      antwoorden: [
        "Kort; samenwerking stopte weer",
        "Talpa produceert het nog steeds",
        "Talpa maakte er een TV-prime-time show van",
        "Talpa kocht het kanaal"
      ],
      correctIndex: 0,
      uitleg: "De samenwerking wordt doorgaans omschreven als kort en later beëindigd."
    },
    {
      vraag: "Welke naam staat bekend als (publiek) genoemde gast in selectielijsten?",
      image: "img/thierry.jpg",
      antwoorden: ["Thierry Baudet", "Eva Jinek", "Arjen Lubach", "Mark Rutte"],
      correctIndex: 0,
      uitleg: "Thierry Baudet wordt in gastenselecties genoemd."
    },
    {
      vraag: "Welke naam staat bekend als (publiek) genoemde gast in selectielijsten?",
      image: "img/henk.jpg",
      antwoorden: ["Henk Krol", "Max Verstappen", "Virgil van Dijk", "André Hazes"],
      correctIndex: 0,
      uitleg: "Henk Krol wordt in gastenselecties genoemd."
    },
    {
      vraag: "Welke term wordt door fans vaak als geintje gebruikt voor ‘de typische supporter’?",
      image: "img/kevin.jpg",
      antwoorden: ["Kevin", "Sjaak", "Karel", "Bram"],
      correctIndex: 0,
      uitleg: "‘Kevin’ wordt vaak als meme-woord gebruikt (jij wilde de Kevin-meuk weg — deze kun je ook weghalen als je wil)."
    }
  ];

  let started = false;
  let i = 0;
  let state = QUESTIONS.map(() => ({ answered:false, picked:null, correct:false }));

  function setNextLabel(){
    nextBtn.textContent = (i === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
  }

  function render(){
    const q = QUESTIONS[i];
    const s = state[i];

    stats.textContent = `Vraag ${i+1} / ${QUESTIONS.length}`;
    qText.textContent = q.vraag;

    if(q.image){
      qMediaWrap.style.display = "flex";
      qImg.src = q.image;
      qImg.alt = q.vraag;
    }else{
      qMediaWrap.style.display = "none";
      qImg.src = "";
      qImg.alt = "";
    }

    answers.innerHTML = "";
    feedback.classList.add("hidden");

    backBtn.disabled = (i === 0);
    nextBtn.disabled = !s.answered;
    setNextLabel();

    q.antwoorden.forEach((t, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "answerBtn";
      b.textContent = t;
      b.onclick = () => pick(idx);
      answers.appendChild(b);
    });

    if(s.answered){
      paint();
      showFeedback(q, s.correct);
    }
  }

  function pick(pickedIndex){
    const q = QUESTIONS[i];
    const s = state[i];

    s.answered = true;
    s.picked = pickedIndex;
    s.correct = (pickedIndex === q.correctIndex);

    paint();
    showFeedback(q, s.correct);

    nextBtn.disabled = false;
  }

  function paint(){
    const q = QUESTIONS[i];
    const s = state[i];
    const btns = [...answers.querySelectorAll("button")];

    btns.forEach((b, idx) => {
      b.classList.remove("correct","wrong");
      if(idx === q.correctIndex) b.classList.add("correct");
      if(s.picked === idx && idx !== q.correctIndex) b.classList.add("wrong");
    });
  }

  function showFeedback(q, ok){
    feedback.classList.remove("hidden");
    feedbackHead.textContent = ok ? "✅ Goed!" : "❌ Fout!";
    feedbackHead.className = "feedbackHead " + (ok ? "good" : "bad");
    feedbackBody.innerHTML = `
      <p><b>Juiste antwoord:</b> ${q.antwoorden[q.correctIndex]}</p>
      ${q.uitleg ? `<p><b>Uitleg:</b> ${q.uitleg}</p>` : ""}
    `;
  }

  function renderResult(){
    const good = state.filter(x => x.answered && x.correct).length;
    const bad = state.filter(x => x.answered && !x.correct).length;

    resultLine.textContent = `Score: ${good} goed • ${bad} fout`;

    goodEl.textContent = String(good);
    badEl.textContent = String(bad);
    totalEl.textContent = String(QUESTIONS.length);

    buildReview(false);
  }

  function buildReview(onlyWrong){
    reviewList.innerHTML = "";

    QUESTIONS.forEach((q, idx) => {
      const s = state[idx];
      if(onlyWrong && !(s.answered && !s.correct)) return;

      const badge = s.answered
        ? (s.correct ? `<span class="badge good">✅ Goed</span>` : `<span class="badge bad">❌ Fout</span>`)
        : `<span class="badge">Niet beantwoord</span>`;

      const row = document.createElement("div");
      row.className = "reviewRow";
      row.innerHTML = `
        <h4>${idx+1}. ${q.vraag}</h4>
        <div class="reviewMeta">
          ${badge}
          <span><b>Juiste antwoord:</b> ${q.antwoorden[q.correctIndex]}</span>
        </div>
        ${q.uitleg ? `<div class="mini" style="margin-top:8px;opacity:.86"><b>Uitleg:</b> ${q.uitleg}</div>` : ""}
      `;
      reviewList.appendChild(row);
    });
  }

  // START
  startBtn.addEventListener("click", () => {
    started = true;

    document.body.classList.remove("mode-start");
    document.body.classList.add("mode-quiz");

    startView.classList.remove("active");
    show(quizView);

    i = 0;
    render();
    scrollToTop();
  });

  backBtn.addEventListener("click", () => {
    if(i === 0) return;
    i--;
    render();
    scrollToTop();
  });

  nextBtn.addEventListener("click", () => {
    if(!state[i].answered) return;

    if(i < QUESTIONS.length - 1){
      i++;
      render();
      scrollToTop();
    } else {
      show(resultView);
      renderResult();
      scrollToTop();
    }
  });

  showAllBtn.addEventListener("click", () => buildReview(false));
  showWrongBtn.addEventListener("click", () => buildReview(true));
  toTopBtn.addEventListener("click", () => scrollToTop());

  restartBtn.addEventListener("click", () => {
    started = false;
    state = QUESTIONS.map(() => ({ answered:false, picked:null, correct:false }));
    i = 0;

    document.body.classList.remove("mode-quiz");
    document.body.classList.add("mode-start");

    show(startView);
    scrollToTop();
  });

  window.addEventListener("beforeunload", (e) => {
    if(!started) return;
    e.preventDefault();
    e.returnValue = "";
  });

  console.log("✅ Loaded");
});
