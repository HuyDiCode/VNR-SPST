/* ============================================
   VIETNAM HISTORY 1996-2005 — INTERACTIONS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTabSwitching();
  initNavbarDarkMode();
  initScrollReveal();
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
