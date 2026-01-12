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

  // Fisher–Yates shuffle (in-place)
  function shuffle(arr){
    for(let j = arr.length - 1; j > 0; j--){
      const k = Math.floor(Math.random() * (j + 1));
      [arr[j], arr[k]] = [arr[k], arr[j]];
    }
    return arr;
  }

  // ✅ BELANGRIJK: antw[0] is ALTIJD correct (dus correctIndex is altijd 0)
  const QUESTIONS = [
    {
      vraag: "Wie vormen de vaste presentatie (zoals doorgaans beschreven) van RoddelPraat?",
      image: "img/dennis-jan.jpg",
      antwoorden: ["Dennis Schouten & Jan Roos", "Dennis Schouten & Mark Baanders", "Jan Roos & Thierry Baudet", "Mark Baanders & Giel Beelen"],
      uitleg: "RoddelPraat wordt doorgaans beschreven met Dennis Schouten en Jan Roos als vaste presentatie."
    },
    {
      vraag: "Wie was in de eerste fase co-host naast Dennis, vóór Jan Roos vast werd?",
      image: "img/mark.jpg",
      antwoorden: ["Mark Baanders", "Henk Krol", "Bender", "Giel Beelen"],
      uitleg: "In de beginfase werd Mark Baanders genoemd als co-host."
    },
    {
      vraag: "Welke bijnaam wordt Mark Baanders in die context vaak toegeschreven?",
      image: "img/slijptol.jpg",
      antwoorden: ["Slijptol", "Mr Nightlife", "Lil Fat", "Jack Terrible"],
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
      uitleg: "De samenwerking wordt doorgaans omschreven als kort en later beëindigd."
    },
    {
      vraag: "Welke naam staat bekend als (publiek) genoemde gast in selectielijsten?",
      image: "img/thierry.jpg",
      antwoorden: ["Thierry Baudet", "Eva Jinek", "Arjen Lubach", "Mark Rutte"],
      uitleg: "Thierry Baudet wordt in gastenselecties genoemd."
    },
    {
      vraag: "Welke naam staat bekend als (publiek) genoemde gast in selectielijsten?",
      image: "img/henk.jpg",
      antwoorden: ["Henk Krol", "Max Verstappen", "Virgil van Dijk", "André Hazes"],
      uitleg: "Henk Krol wordt in gastenselecties genoemd."
    },
    {
      vraag: "Welke term wordt door fans vaak als geintje gebruikt voor ‘de typische supporter’?",
      image: "img/kevin.jpg",
      antwoorden: ["Kevin", "Sjaak", "Karel", "Bram"],
      uitleg: "‘Kevin’ wordt vaak als meme-woord gebruikt."
    },
    {
      vraag: "Hoe oud is Jan?",
      image: "img/leeftijd.jpg", 
      antwoorden: ["45+", "50+", "40+", "55+"],
      uitleg: "Geboren 27 januari 1977"
  },
    {
    vraag: "Waarom heeft de ze bijnaam Soef de Haas?",
    image: "img/haas.jpg", 
    antwoorden: ["Vanwege haar tanden", "vanwege haar oren", "vanwege haar voorhoofd", "vanwege haar neus"],
    uitleg: "Grote voortanden. De paashaas is er niks bij."
}
  ];

  let started = false;
  let i = 0;

  // state per vraag:
  // answered, pickedShown (index in getoonde volgorde), correctShown (index in getoonde volgorde), order (shuffle indices)
  let state = QUESTIONS.map(() => ({
    answered: false,
    pickedShown: null,
    correct: false,
    order: null,
    correctShown: null
  }));

  function setNextLabel(){
    nextBtn.textContent = (i === QUESTIONS.length - 1) ? "RESULTAAT" : "VOLGENDE";
  }

  function ensureOrderForQuestion(idx){
    const q = QUESTIONS[idx];
    const s = state[idx];

    if(!s.order){
      // Maak een index-lijst [0..n-1], shuffle die, en bewaar.
      const order = shuffle([...Array(q.antwoorden.length).keys()]);
      s.order = order;

      // Correct antwoord is altijd data-index 0, dus waar zit 0 in de shuffle?
      s.correctShown = order.indexOf(0);
    }
  }

  function render(){
    const q = QUESTIONS[i];
    const s = state[i];

    ensureOrderForQuestion(i);

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

    // Render shuffled answers using s.order
    s.order.forEach((dataIdx, shownIdx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "answerBtn";
      b.textContent = q.antwoorden[dataIdx];
      b.onclick = () => pick(shownIdx);
      answers.appendChild(b);
    });

    if(s.answered){
      paint();
      showFeedback(q, s.correct);
    }
  }

  // pickedShownIndex = index in the displayed order (0..n-1)
  function pick(pickedShownIndex){
    const q = QUESTIONS[i];
    const s = state[i];

    s.answered = true;
    s.pickedShown = pickedShownIndex;
    s.correct = (pickedShownIndex === s.correctShown);

    paint();
    showFeedback(q, s.correct);

    nextBtn.disabled = false;
  }

  function paint(){
    const s = state[i];
    const btns = [...answers.querySelectorAll("button")];

    btns.forEach((b, shownIdx) => {
      b.classList.remove("correct","wrong");

      if(shownIdx === s.correctShown) b.classList.add("correct");
      if(s.pickedShown === shownIdx && shownIdx !== s.correctShown) b.classList.add("wrong");
    });
  }

  function showFeedback(q, ok){
    const s = state[i];
    feedback.classList.remove("hidden");
    feedbackHead.textContent = ok ? "✅ Goed!" : "❌ Fout!";
    feedbackHead.className = "feedbackHead " + (ok ? "good" : "bad");

    // Correct antwoord blijft altijd q.antwoorden[0]
    feedbackBody.innerHTML = `
      <p><b>Juiste antwoord:</b> ${q.antwoorden[0]}</p>
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
          <span><b>Juiste antwoord:</b> ${q.antwoorden[0]}</span>
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

    // reset state (shuffle wordt opnieuw gedaan bij volgende render)
    state = QUESTIONS.map(() => ({
      answered:false,
      pickedShown:null,
      correct:false,
      order:null,
      correctShown:null
    }));
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
