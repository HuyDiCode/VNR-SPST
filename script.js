/* ============================================
   VIETNAM HISTORY 1996-2005 — INTERACTIONS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTabSwitching();
  initNavbarDarkMode();
  initScrollReveal();
  g2InitGate();
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

/* ============================================================
   GAME 2 — Ô CHỮ BÍ ẨN  (Hidden Image Crossword)
   ============================================================ */

const G2_DATA = [
  {
    id: 1,
    answer: "CÂNBẰNG",
    question:
      "Thay vì chọn nghiêng về một phe, chiến lược 'làm bạn với tất cả' giúp Việt Nam duy trì được trạng thái gì trên bàn cờ địa chính trị?",
  },
  {
    id: 2,
    answer: "TÀICHÍNH",
    question:
      "Lĩnh vực nào đã chứng kiến một 'cơn bão' quét qua châu Á năm 1997, thử thách khả năng phòng thủ vĩ mô của Việt Nam lúc bấy giờ?",
  },
  {
    id: 3,
    answer: "CHỦQUYỀN",
    question:
      "Nghị quyết 07-NQ/TW (2001) vạch ra 'lằn ranh đỏ': Dù mở cửa sâu rộng đến đâu cũng tuyệt đối không được đánh đổi thứ này của quốc gia?",
  },
  {
    id: 4,
    answer: "ANNINH",
    question:
      "Cánh cửa mở ra năm 1997 mang đến một không gian tự do vô tận, nhưng đồng thời buộc Việt Nam lần đầu tiên phải đối mặt với khái niệm bảo vệ (...) trên không gian ảo.",
  },
  {
    id: 5,
    answer: "NỘILỰC",
    question:
      "Trước khi muốn vươn ra cạnh tranh bằng nguồn lực bên ngoài, Đại hội VIII (1996) khẳng định Việt Nam phải xây dựng được nền móng vững chắc từ đâu?",
  },
  {
    id: 6,
    answer: "HOAKỲ",
    question:
      "Đối tác nào đã cùng Việt Nam ký kết một văn kiện dài hơn 300 trang vào năm 2000, tạo ra cú hích lớn nhất để xóa bỏ hoàn toàn tàn dư cấm vận?",
  },
  {
    id: 7,
    answer: "ĐỊNHHƯỚNG",
    question:
      "Đại hội IX (2001) đã đặt thêm một cụm từ quan trọng làm 'bánh lái' cho mô hình Kinh tế thị trường, đảm bảo con tàu không chệch quỹ đạo. Cụm từ đó là gì?",
  },
  {
    id: 8,
    answer: "DOANHNGHIỆP",
    question:
      "Đạo luật ra đời năm 1999 được ví như một cuộc 'tháo cũi sổ lồng', chính thức cởi trói và giải phóng năng lượng khổng lồ cho khu vực tư nhân. Đó là luật gì?",
  },
  {
    id: 9,
    answer: "DUNGQUẤT",
    question:
      "Công trình trọng điểm nào khởi công năm 2005 là minh chứng rõ ràng nhất cho việc Việt Nam không muốn mãi phụ thuộc vào việc xuất khẩu tài nguyên thô?",
  },
];

const G2_KEYWORD = "BIỂNLỚN";
const G2_KEYWORD_DISPLAY = "BIỂN LỚN"; // used to build the blank-box hint

let g2SelectedId = null;
const g2SolvedIds = new Set();
let g2ToastTimer = null;

/* ── Helpers ────────────────────────────────────────────── */
function g2Norm(s) {
  return s.replace(/\s+/g, "").toUpperCase();
}

function g2ShowToast(msg, success = false) {
  const el = document.getElementById("g2-toast");
  clearTimeout(g2ToastTimer);
  el.textContent = msg;
  el.className = success ? "g2-show g2-success" : "g2-show";
  g2ToastTimer = setTimeout(() => {
    el.className = "";
  }, 2800);
}

function g2FlashInput(cls) {
  const el = document.getElementById("g2-ans-input");
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 600);
}

/* ── Build DOM ──────────────────────────────────────────── */
function g2BuildCrossword() {
  const wrap = document.getElementById("g2-cr-wrap");
  if (!wrap) return;
  wrap.innerHTML = "";

  G2_DATA.forEach((item) => {
    const row = document.createElement("div");
    row.className = "g2-cr-row";
    row.dataset.id = item.id;

    // Row 5 starts locked
    if (item.id === 5) row.classList.add("g2-locked");

    const badge = document.createElement("div");
    badge.className = "g2-rn";
    badge.textContent = item.id;

    const cells = document.createElement("div");
    cells.className = "g2-cells";

    [...item.answer].forEach((ch) => {
      const c = document.createElement("div");
      c.className = "g2-cell";
      c.dataset.char = ch;
      cells.appendChild(c);
    });

    // Lock icon appended after cells for row 5
    if (item.id === 5) {
      const lockIcon = document.createElement("span");
      lockIcon.className = "g2-lock-icon";
      lockIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>`;
      row.appendChild(badge);
      row.appendChild(cells);
      row.appendChild(lockIcon);
    } else {
      row.appendChild(badge);
      row.appendChild(cells);
    }

    row.addEventListener("click", () => g2SelectRow(item.id));
    wrap.appendChild(row);
  });
}

function g2BuildTiles() {
  const overlay = document.getElementById("g2-tiles-overlay");
  if (!overlay) return;
  overlay.innerHTML = "";

  for (let i = 1; i <= 9; i++) {
    const tile = document.createElement("div");
    tile.className = "g2-tile";
    tile.dataset.id = i;

    const num = document.createElement("span");
    num.className = "g2-tile-num";
    num.textContent = i;

    tile.appendChild(num);
    overlay.appendChild(tile);
  }
}

/* ── Unlock row 5 ───────────────────────────────────────── */
function g2UnlockRow5() {
  const row = document.querySelector('.g2-cr-row[data-id="5"]');
  if (!row) return;
  row.classList.remove("g2-locked");
  const icon = row.querySelector(".g2-lock-icon");
  if (icon) icon.remove();
  g2ShowToast("🔓 Hàng 5 đã được mở khoá!", true);
}

/* ── Row selection ──────────────────────────────────────── */
function g2SelectRow(id) {
  if (g2SolvedIds.has(id)) {
    g2ShowToast("Câu này đã trả lời rồi ✓");
    return;
  }

  if (
    id === 5 &&
    document
      .querySelector('.g2-cr-row[data-id="5"]')
      .classList.contains("g2-locked")
  ) {
    g2ShowToast("🔒 Trả lời đúng 8 hàng còn lại để mở khoá hàng này!");
    return;
  }

  // Remove previous tile hint
  if (g2SelectedId) g2ClearTileHint(g2SelectedId);

  g2SelectedId = id;

  document
    .querySelectorAll(".g2-cr-row")
    .forEach((r) => r.classList.remove("g2-active"));
  document
    .querySelector(`.g2-cr-row[data-id="${id}"]`)
    .classList.add("g2-active");

  g2SetTileHint(id);

  const item = G2_DATA.find((d) => d.id === id);
  const len = [...item.answer].length;
  const qEl = document.getElementById("g2-q-text");
  qEl.textContent = `[Hàng ${id}]  ${item.question}`;
  qEl.classList.add("g2-q-active");

  const input = document.getElementById("g2-ans-input");
  input.value = "";
  input.placeholder = `Nhập câu trả lời (${len} ký tự)…`;
  input.focus();
  document.getElementById("g2-submit-btn").disabled = false;
}

function g2SetTileHint(id) {
  const t = document.querySelector(`.g2-tile[data-id="${id}"]`);
  if (t && !t.classList.contains("g2-gone")) t.classList.add("g2-tile-hint");
}

function g2ClearTileHint(id) {
  const t = document.querySelector(`.g2-tile[data-id="${id}"]`);
  if (t) t.classList.remove("g2-tile-hint");
}

/* ── Reveal row letters (staggered flip) ────────────────── */
function g2RevealRow(id) {
  const item = G2_DATA.find((d) => d.id === id);
  const chars = [...item.answer];
  const cells = document.querySelectorAll(
    `.g2-cr-row[data-id="${id}"] .g2-cell`,
  );

  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.textContent = chars[i];
      cell.classList.add("g2-revealed");
    }, i * 80);
  });

  setTimeout(
    () => {
      const row = document.querySelector(`.g2-cr-row[data-id="${id}"]`);
      row.classList.remove("g2-active");
      row.classList.add("g2-solved");
    },
    chars.length * 80 + 260,
  );
}

/* ── Fade out image tile ────────────────────────────────── */
function g2RemoveTile(id) {
  const tile = document.querySelector(`.g2-tile[data-id="${id}"]`);
  if (!tile) return;
  g2ClearTileHint(id);
  setTimeout(() => tile.classList.add("g2-gone"), 220);
}

/* ── Progress bar ───────────────────────────────────────── */
function g2UpdateProgress() {
  document.getElementById("g2-solved-count").textContent = g2SolvedIds.size;
  document.getElementById("g2-prog-fill").style.width =
    (g2SolvedIds.size / 9) * 100 + "%";
}

/* ── Reset question panel ───────────────────────────────── */
function g2ResetPanel() {
  const qEl = document.getElementById("g2-q-text");
  qEl.textContent = "← Nhấp vào một hàng ngang để xem câu hỏi";
  qEl.classList.remove("g2-q-active");
  const input = document.getElementById("g2-ans-input");
  input.value = "";
  input.placeholder = "Nhập câu trả lời...";
  document.getElementById("g2-submit-btn").disabled = true;
}

/* ── Submit answer ──────────────────────────────────────── */
function g2SubmitAnswer() {
  if (g2SelectedId === null) {
    g2ShowToast("Hãy chọn một hàng ngang trước!");
    return;
  }

  const input = document.getElementById("g2-ans-input");
  const guess = g2Norm(input.value.trim());
  if (!guess) {
    input.focus();
    return;
  }

  const item = G2_DATA.find((d) => d.id === g2SelectedId);
  const correct = g2Norm(item.answer);

  if (guess === correct) {
    g2FlashInput("g2-right");

    const answeredId = g2SelectedId;
    g2SelectedId = null;

    g2SolvedIds.add(answeredId);
    g2RevealRow(answeredId);
    g2RemoveTile(answeredId);
    g2UpdateProgress();
    g2ShowToast("✓ Chính xác: " + item.answer, true);
    g2ResetPanel();

    // Unlock row 5 once all other 8 rows are solved
    const otherIds = G2_DATA.map((d) => d.id).filter((i) => i !== 5);
    const allOthersSolved = otherIds.every((i) => g2SolvedIds.has(i));
    if (allOthersSolved) g2UnlockRow5();
  } else {
    g2FlashInput("g2-wrong");
    g2ShowToast("✗ Chưa đúng! Thử lại nhé.");
  }
}

/* ── Guess main keyword ─────────────────────────────────── */
function g2GuessKeyword() {
  const input = document.getElementById("g2-ans-input");
  const guess = g2Norm(input.value.trim());

  if (!guess) {
    g2ShowToast("Nhập từ khoá vào ô trả lời trước!");
    input.focus();
    return;
  }

  if (guess === g2Norm(G2_KEYWORD)) {
    const remaining = Array.from(
      document.querySelectorAll(".g2-tile:not(.g2-gone)"),
    );
    remaining.forEach((tile, i) => {
      setTimeout(() => tile.classList.add("g2-gone"), i * 130);
    });
    setTimeout(
      () => {
        document.getElementById("g2-win-overlay").classList.add("g2-show");
      },
      remaining.length * 130 + 650,
    );
  } else {
    g2FlashInput("g2-wrong");
    g2ShowToast("✗ Từ khoá chưa đúng!");
  }
}

/* ── Restart ────────────────────────────────────────────── */
function g2RestartGame() {
  g2SolvedIds.clear();
  g2SelectedId = null;
  document.getElementById("g2-win-overlay").classList.remove("g2-show");
  g2BuildCrossword();
  g2BuildTiles();
  g2UpdateProgress();
  g2ResetPanel();
}

/* ── Password gate ──────────────────────────────────────── */
const G2_PASSWORD = "chungktt";
let g2Unlocked = false;

function g2InitGate() {
  const btn = document.getElementById("g2-pw-btn");
  const input = document.getElementById("g2-pw-input");
  if (!btn || !input) return;

  function attempt() {
    if (input.value === G2_PASSWORD) {
      g2Unlocked = true;
      document.getElementById("g2-gate").style.display = "none";
      document.getElementById("g2-game-body").style.display = "block";
      g2Init();
    } else {
      input.classList.remove("g2-wrong");
      // force reflow so animation re-triggers on repeated wrong attempts
      void input.offsetWidth;
      input.classList.add("g2-wrong");
      input.value = "";
      const err = document.getElementById("g2-gate-error");
      err.textContent = "Mật khẩu không đúng. Thử lại.";
      setTimeout(() => {
        err.textContent = "";
      }, 2500);
    }
  }

  btn.addEventListener("click", attempt);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attempt();
  });
}

/* ── Init ───────────────────────────────────────────────── */
function g2Init() {
  g2BuildCrossword();
  g2BuildTiles();

  document
    .getElementById("g2-submit-btn")
    .addEventListener("click", g2SubmitAnswer);

  document
    .getElementById("g2-kw-btn")
    .addEventListener("click", g2GuessKeyword);

  document.getElementById("g2-ans-input").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    // Route Enter: answer current row if one is selected, else try keyword
    if (g2SelectedId !== null) {
      g2SubmitAnswer();
    } else {
      g2GuessKeyword();
    }
  });

  // Build keyword blank-box hint in progress strip
  const hintEl = document.getElementById("g2-kw-hint");
  if (hintEl) {
    [...G2_KEYWORD_DISPLAY].forEach((ch) => {
      if (ch === " ") {
        const gap = document.createElement("span");
        gap.className = "g2-kw-gap";
        hintEl.appendChild(gap);
      } else {
        const box = document.createElement("span");
        box.className = "g2-kw-box";
        hintEl.appendChild(box);
      }
    });
  }
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
  wordIndex: 0,
  wordLength: 0,
  currentRow: 0,
  currentCol: 0,
  guesses: [],
  currentGuess: "",
  gameOver: false,
  keyStates: {},
};

function initWordle() {
  const savedIndex = localStorage.getItem("wordleIndex");
  wordleState.wordIndex = savedIndex ? parseInt(savedIndex) : 0;
  if (wordleState.wordIndex >= WORDLE_WORDS.length) wordleState.wordIndex = 0;

  pickNewWord();
  buildBoard();
  showHint();
  bindKeyboard();
  bindPhysicalKeyboard();
  bindReplay();
}

function pickNewWord() {
  const entry = WORDLE_WORDS[wordleState.wordIndex];
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
  const entry = WORDLE_WORDS[wordleState.wordIndex];
  hintText.textContent = entry
    ? `Câu ${wordleState.wordIndex + 1}/${WORDLE_WORDS.length}: ${entry.hint} (${wordleState.wordLength} chữ cái)`
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

    // Increment word index and wrap around
    wordleState.wordIndex = (wordleState.wordIndex + 1) % WORDLE_WORDS.length;
    localStorage.setItem("wordleIndex", wordleState.wordIndex);

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
