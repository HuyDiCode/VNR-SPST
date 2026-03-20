/* ============================================
   VIETNAM HISTORY 1996-2005 — INTERACTIONS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTabSwitching();
  initNavbarDarkMode();
  initScrollReveal();
  initWordle();
});

/* ---------- Tab Switching ---------- */
function initTabSwitching() {
  const tabs = document.querySelectorAll(".nav-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = `tab-${tab.dataset.tab}`;

      // Deactivate all
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => {
        c.classList.remove("active");
        c.style.display = "none";
      });

      // Activate target
      tab.classList.add("active");
      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = "block";
        // Trigger reflow for transition
        requestAnimationFrame(() => {
          target.classList.add("active");
        });
      }

      // Update navbar dark mode state based on visible slide
      updateNavbarState();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---------- Navbar Dark Mode ---------- */
function initNavbarDarkMode() {
  const navbar = document.getElementById("navbar");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbarState();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial state
  updateNavbarState();
}

function updateNavbarState() {
  const navbar = document.getElementById("navbar");
  const scrollY = window.scrollY;

  // Check if timeline tab is active
  const timelineTab = document.getElementById("tab-timeline");
  if (!timelineTab || !timelineTab.classList.contains("active")) {
    navbar.classList.remove("dark-mode");
    return;
  }

  // Get all dark slides
  const darkSlides = document.querySelectorAll(".slide-hero, .slide-dark");
  let isOverDark = false;

  darkSlides.forEach((slide) => {
    const rect = slide.getBoundingClientRect();
    // Check if navbar overlaps with dark slide
    if (rect.top <= 64 && rect.bottom > 32) {
      isOverDark = true;
    }
  });

  if (isOverDark) {
    navbar.classList.add("dark-mode");
  } else {
    navbar.classList.remove("dark-mode");
  }
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  // Add reveal class to elements
  const revealSelectors = [
    ".intro-heading",
    ".intro-meta",
    ".intro-visual",
    ".event-text",
    ".event-visual",
    ".game-header",
    ".game-board",
  ];

  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("reveal");
    });
  });

  // Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
}

/* ============================================
   WORDLE GAME ENGINE
   ============================================ */

const WORDLE_WORDS = [
  { word: "ASEAN", hint: "Tổ chức khu vực Đông Nam Á mà Việt Nam gia nhập" },
  {
    word: "APEC",
    hint: "Diễn đàn hợp tác kinh tế châu Á - Thái Bình Dương, VN gia nhập 1998",
  },
  { word: "XHCN", hint: "Viết tắt trong 'Kinh tế thị trường định hướng ___'" },
  {
    word: "VIETTEL",
    hint: "Doanh nghiệp Quân đội phá vỡ độc quyền viễn thông năm 2004",
  },
  { word: "DOIMOI", hint: "Chính sách thay đổi toàn diện bắt đầu từ 1986" },
  { word: "INTERNET", hint: "Việt Nam chính thức kết nối ngày 19/11/1997" },
  {
    word: "DUNGQUAT",
    hint: "Nhà máy lọc dầu đầu tiên của Việt Nam, khởi công 2005",
  },
  {
    word: "SEAGAMES",
    hint: "Đại hội thể thao khu vực ĐNÁ, VN đăng cai lần đầu năm 2003",
  },
  { word: "VINAMILK", hint: "Doanh nghiệp sữa quốc dân, cổ phần hóa năm 2003" },
  {
    word: "HOINHAP",
    hint: "Quá trình Việt Nam tham gia sâu rộng vào nền kinh tế thế giới",
  },
];

const MAX_GUESSES = 6;

let wordleState = {
  answer: null,
  wordLength: 0,
  currentRow: 0,
  currentCol: 0,
  guesses: [],
  currentGuess: "",
  gameOver: false,
  keyStates: {},
};

function initWordle() {
  pickNewWord();
  buildBoard();
  showHint();
  bindKeyboard();
  bindPhysicalKeyboard();
  bindReplay();
}

function pickNewWord() {
  const entry = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
  wordleState.answer = entry.word.toUpperCase();
  wordleState.wordLength = wordleState.answer.length;
  wordleState.currentRow = 0;
  wordleState.currentCol = 0;
  wordleState.guesses = [];
  wordleState.currentGuess = "";
  wordleState.gameOver = false;
  wordleState.keyStates = {};
}

function buildBoard() {
  const board = document.getElementById("wordle-board");
  if (!board) return;
  board.innerHTML = "";
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement("div");
    row.className = "wordle-row";
    row.dataset.row = r;
    for (let c = 0; c < wordleState.wordLength; c++) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      tile.dataset.col = c;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function showHint() {
  const hintText = document.getElementById("wordle-hint-text");
  if (!hintText) return;
  const entry = WORDLE_WORDS.find(
    (w) => w.word.toUpperCase() === wordleState.answer,
  );
  hintText.textContent = entry
    ? `${entry.hint} (${wordleState.wordLength} chữ cái)`
    : "";
}

function bindKeyboard() {
  const keyboard = document.getElementById("wordle-keyboard");
  if (!keyboard) return;
  keyboard.addEventListener("click", (e) => {
    const btn = e.target.closest(".key");
    if (!btn || wordleState.gameOver) return;
    const key = btn.dataset.key;
    handleKey(key);
  });
}

function bindPhysicalKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (wordleState.gameOver) return;
    // Only process when Game 1 tab is active
    const game1Tab = document.getElementById("tab-game1");
    if (!game1Tab || !game1Tab.classList.contains("active")) return;

    if (e.key === "Enter") {
      handleKey("ENTER");
    } else if (e.key === "Backspace") {
      handleKey("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleKey(e.key.toUpperCase());
    }
  });
}

function bindReplay() {
  const btn = document.getElementById("wordle-replay");
  if (!btn) return;
  btn.addEventListener("click", () => {
    hideModal();
    resetKeyboardUI();
    pickNewWord();
    buildBoard();
    showHint();
  });
}

function handleKey(key) {
  if (key === "BACKSPACE") {
    if (wordleState.currentCol > 0) {
      wordleState.currentCol--;
      wordleState.currentGuess = wordleState.currentGuess.slice(0, -1);
      setTileLetter(wordleState.currentRow, wordleState.currentCol, "");
    }
    return;
  }

  if (key === "ENTER") {
    if (wordleState.currentGuess.length < wordleState.wordLength) {
      shakeRow(wordleState.currentRow);
      return;
    }
    submitGuess();
    return;
  }

  // Letter key
  if (wordleState.currentCol >= wordleState.wordLength) return;
  wordleState.currentGuess += key;
  setTileLetter(wordleState.currentRow, wordleState.currentCol, key);
  wordleState.currentCol++;
}

function setTileLetter(row, col, letter) {
  const rowEl = document.querySelector(`.wordle-row[data-row="${row}"]`);
  if (!rowEl) return;
  const tile = rowEl.children[col];
  if (!tile) return;
  tile.textContent = letter;
  if (letter) {
    tile.classList.add("filled");
  } else {
    tile.classList.remove("filled");
  }
}

function submitGuess() {
  const guess = wordleState.currentGuess.toUpperCase();
  const answer = wordleState.answer;

  // Evaluate each letter
  const result = evaluateGuess(guess, answer);

  // Animate reveal
  revealRow(wordleState.currentRow, guess, result, () => {
    // Update keyboard state
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = result[i];
      updateKeyState(letter, status);
    }

    // Check win
    if (guess === answer) {
      wordleState.gameOver = true;
      bounceRow(wordleState.currentRow, () => {
        showModal(true);
      });
      return;
    }

    // Check lose
    wordleState.currentRow++;
    if (wordleState.currentRow >= MAX_GUESSES) {
      wordleState.gameOver = true;
      setTimeout(() => showModal(false), 400);
      return;
    }

    // Reset for next guess
    wordleState.currentGuess = "";
    wordleState.currentCol = 0;
  });
}

function evaluateGuess(guess, answer) {
  const result = new Array(guess.length).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");

  // First pass: correct positions
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      answerArr[i] = null;
      guessArr[i] = null;
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === null) continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerArr[idx] = null;
    }
  }

  return result;
}

function revealRow(rowIdx, guess, result, onComplete) {
  const rowEl = document.querySelector(`.wordle-row[data-row="${rowIdx}"]`);
  if (!rowEl) return;

  const tiles = rowEl.children;
  let revealed = 0;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const delay = i * 300;

    setTimeout(() => {
      tile.classList.add("flip");

      // Apply color at midpoint of flip
      setTimeout(() => {
        tile.classList.remove("filled");
        tile.classList.add(result[i]);
        tile.textContent = guess[i];
      }, 250);

      revealed++;
      if (revealed === tiles.length) {
        setTimeout(onComplete, 200);
      }
    }, delay);
  }
}

function shakeRow(rowIdx) {
  const rowEl = document.querySelector(`.wordle-row[data-row="${rowIdx}"]`);
  if (!rowEl) return;
  rowEl.classList.add("shake");
  rowEl.addEventListener(
    "animationend",
    () => {
      rowEl.classList.remove("shake");
    },
    { once: true },
  );
}

function bounceRow(rowIdx, onComplete) {
  const rowEl = document.querySelector(`.wordle-row[data-row="${rowIdx}"]`);
  if (!rowEl) return;
  const tiles = rowEl.children;
  for (let i = 0; i < tiles.length; i++) {
    setTimeout(() => {
      tiles[i].style.animation = `bounce 0.5s ease`;
      tiles[i].addEventListener(
        "animationend",
        () => {
          tiles[i].style.animation = "";
          if (i === tiles.length - 1 && onComplete) {
            setTimeout(onComplete, 200);
          }
        },
        { once: true },
      );
    }, i * 80);
  }
}

function updateKeyState(letter, status) {
  const priority = { absent: 0, present: 1, correct: 2 };
  const current = wordleState.keyStates[letter];

  if (!current || priority[status] > priority[current]) {
    wordleState.keyStates[letter] = status;
  }

  // Update keyboard button UI
  const btn = document.querySelector(`.key[data-key="${letter}"]`);
  if (!btn) return;
  btn.classList.remove("correct", "present", "absent");
  btn.classList.add(wordleState.keyStates[letter]);
}

function resetKeyboardUI() {
  document.querySelectorAll(".key").forEach((btn) => {
    btn.classList.remove("correct", "present", "absent");
  });
}

function showModal(isWin) {
  const modal = document.getElementById("wordle-modal");
  const icon = document.getElementById("wordle-modal-icon");
  const title = document.getElementById("wordle-modal-title");
  const answer = document.getElementById("wordle-modal-answer");
  const desc = document.getElementById("wordle-modal-desc");

  const entry = WORDLE_WORDS.find(
    (w) => w.word.toUpperCase() === wordleState.answer,
  );

  if (isWin) {
    const attempts = wordleState.currentRow + 1;
    icon.textContent = "🎉";
    title.textContent = "Chính xác!";
    answer.textContent = wordleState.answer;
    desc.textContent = entry
      ? `${entry.hint}. Bạn đã đoán đúng sau ${attempts}/${MAX_GUESSES} lượt!`
      : `Bạn đã đoán đúng sau ${attempts}/${MAX_GUESSES} lượt!`;
  } else {
    icon.textContent = "📖";
    title.textContent = "Hết lượt thử!";
    answer.textContent = wordleState.answer;
    desc.textContent = entry ? entry.hint : "Hãy thử lại với một từ khóa mới!";
  }

  modal.style.display = "flex";
}

function hideModal() {
  const modal = document.getElementById("wordle-modal");
  if (modal) modal.style.display = "none";
}
