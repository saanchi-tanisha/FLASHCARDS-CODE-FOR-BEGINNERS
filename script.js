let flashcardData = []; 
let activeSetId = null; 

async function loadData() {
  const response = await fetch("data.json");

  if (!response.ok) {
    throw new Error("Could not load data.");
  }

  const defaultSets = await response.json();
  const savedCustomData =
    JSON.parse(localStorage.getItem("userCustomCards")) || {};


  const tagCustomCards = (cards, setId) =>
    cards.map((card, index) => ({
      ...card,
      isCustom: true,
      customIndex: index,
      parentSetId: setId,
    }));

  
  const customSet = {
    id: "custom",
    title: "My Custom Deck",
    description: "Flashcards created by you!",
    cards: tagCustomCards(savedCustomData["custom"] || [], "custom"),
  };


  const mergedDefaultSets = defaultSets.map((set) => {
    const extraCards = tagCustomCards(savedCustomData[set.id] || [], set.id);
    return {
      ...set,
      cards: [...set.cards, ...extraCards],
    };
  });


  return customSet.cards.length > 0
    ? [customSet, ...mergedDefaultSets]
    : [...mergedDefaultSets, customSet];
}

function deleteCustomCard(setId, customIndex) {
  const savedCustomData =
    JSON.parse(localStorage.getItem("userCustomCards")) || {};

  if (savedCustomData[setId]) {
    savedCustomData[setId].splice(customIndex, 1);
    localStorage.setItem("userCustomCards", JSON.stringify(savedCustomData));
    renderContent(); 
  }
}


function createSetCard(set) {
  const card = document.createElement("article");

  card.className = "set-card";
  card.innerHTML = `<h3>${set.title}</h3><p>${set.description}</p>`;

  card.addEventListener("click", () => {
    renderSetCards(set);
  });

  return card;
}


function renderSetCards(set) {
  activeSetId = set.id;

  const cardsSection = document.createElement("section");

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Set: " + set.title;
  cardsSection.appendChild(title);

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards-container";

  set.cards.forEach((card) => {
    const cardContainer = document.createElement("article");
    cardContainer.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";
    inner.innerHTML = `<p class="card-face card-front">${card.front}</p><p class="card-face card-back">${card.back}</p>`;

    inner.addEventListener("click", (e) => {
      e.stopPropagation();
      cardContainer.classList.toggle("flipped");
      playFlipsound();
    });

    cardContainer.appendChild(inner);

   
    if (card.isCustom) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-card-btn";
      deleteBtn.textContent = "×";
      deleteBtn.title = "Delete custom card";

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        deleteCustomCard(card.parentSetId, card.customIndex);
      });

      cardContainer.appendChild(deleteBtn);
    }

    cardsContainer.appendChild(cardContainer);
  });

  cardsSection.appendChild(cardsContainer);

  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "Back to sets";
  backBtn.addEventListener("click", () => {
    renderAllSets();
  });
  cardsSection.appendChild(backBtn);

  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(cardsSection);
}


function renderAllSets() {
  activeSetId = null;

  const app = document.getElementById("app");
  app.innerHTML = "";

  const setsSection = document.createElement("section");
  setsSection.className = "sets-section";

  flashcardData.forEach((set) => {
    setsSection.appendChild(createSetCard(set));
  });

  app.appendChild(setsSection);
}

function populateSetDropdown() {
  const select = document.getElementById("set-select");
  if (!select) return;

  select.innerHTML = "";

  flashcardData.forEach((set) => {
    const option = document.createElement("option");
    option.value = set.id;
    option.textContent = set.title;
    select.appendChild(option);
  });
}

async function renderContent() {
  try {
    flashcardData = await loadData();
    populateSetDropdown();

    if (activeSetId) {
      const currentSet = flashcardData.find((s) => s.id === activeSetId);
      if (currentSet) {
        renderSetCards(currentSet);
        return;
      }
    }

    renderAllSets();
  } catch (err) {
    console.error(err);
    document.getElementById("app").textContent =
      "Could not load flashcards data.";
  }
}


const modal = document.getElementById("create-modal");
const openBtn = document.getElementById("open-create-modal");
const closeBtn = document.getElementById("close-create-modal");
const form = document.getElementById("create-card-form");

openBtn.addEventListener("click", () => {
  if (activeSetId) {
    document.getElementById("set-select").value = activeSetId;
  }
  modal.showModal();
});

closeBtn.addEventListener("click", () => modal.close());

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedSetId = document.getElementById("set-select").value;
  const frontText = document.getElementById("card-front").value.trim();
  const backText = document.getElementById("card-back").value.trim();

  if (!frontText || !backText) return;

  const newCard = { front: frontText, back: backText };

  const savedCustomData =
    JSON.parse(localStorage.getItem("userCustomCards")) || {};
  if (!savedCustomData[selectedSetId]) {
    savedCustomData[selectedSetId] = [];
  }
  savedCustomData[selectedSetId].push(newCard);
  localStorage.setItem("userCustomCards", JSON.stringify(savedCustomData));

  form.reset();
  modal.close();

  renderContent();
});

renderContent();

document.addEventListener("mousemove", (e) => {
  const dot = document.createElement("span");
  dot.className = "cursor-trail";
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;

  document.body.appendChild(dot);

  setTimeout(() => {
    dot.remove();
  }, 600);
});

const customCursor = document.createElement("div");
customCursor.className = "custom-cursor";
document.body.appendChild(customCursor);

document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;


  const isClickable = e.target.closest("button, .card, .set-card, select, textarea");
  customCursor.classList.toggle("hovering", Boolean(isClickable));
});

function startRandomQuiz() {
 
  const allCards = flashcardData.flatMap((set) => set.cards);

  if (allCards.length === 0) return;


  const shuffled = [...allCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const quizSet = {
    id: "random-quiz",
    title: " Random 5-Card Quiz",
    description: "5 surprise questions pulled from all your decks.",
    cards: shuffled.slice(0, 5),
  };

  renderSetCards(quizSet);
}

document.getElementById("random-quiz-btn").addEventListener("click", startRandomQuiz);

  if (set.id === "random-quiz") {
    const reshuffleBtn = document.createElement("button");
    reshuffleBtn.className = "btn-primary";
    reshuffleBtn.textContent = "New Random 5";
    reshuffleBtn.style.marginRight = "10px";
    reshuffleBtn.addEventListener("click", startRandomQuiz);
    cardsSection.appendChild(reshuffleBtn);
  }

function playFlipsound(){
  const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  const oscillator=audioCtx.createOscillator();
  const gainNode=audioCtx.createGain();

  oscillator.type="triangle";
  oscillator.frequency.setValueAtTime(880,audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(420,audioCtx.currentTime+0.07);
  
  gainNode.gain.setValueAtTime(0.15,audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.07);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime+0.07);
}