// ================== THEME & DRAWER ==================

// ---------- Theme ----------
const ROOT = document.documentElement;

// --- Initialize theme on load ---
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Pick saved theme if exists, otherwise fallback to system preference
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  ROOT.setAttribute("data-theme", initialTheme);

  updateThemeButtons();
})();

// --- Update toggle buttons UI ---
function updateThemeButtons() {
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const isLight = ROOT.getAttribute("data-theme") === "light";
    btn.textContent = isLight ? "🌓" : "☀️";
    btn.setAttribute("aria-label", isLight ? "Switch to dark" : "Switch to light");
  });
}

// --- Listen for clicks on toggle buttons ---
document.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-theme-toggle]");
  if (!toggleBtn) return;

  const isLight = ROOT.getAttribute("data-theme") === "light";
  const newTheme = isLight ? "dark" : "light";

  ROOT.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateThemeButtons();
});

// --- Optional: Smooth transition effect for theme change ---


// ---------- Drawer ----------
const drawer = document.querySelector(".mobile-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const burger = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".mobile-drawer .close-btn");

function openDrawer() {
  drawer?.classList.add("active");
  backdrop?.classList.add("active");
  document.body.classList.add("drawer-open"); // 🔒 freeze scroll
}
function closeDrawer() {
  drawer?.classList.remove("active");
  backdrop?.classList.remove("active");
  document.body.classList.remove("drawer-open"); // 🔓 unfreeze scroll
}

burger?.addEventListener("click", openDrawer);
closeBtn?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);

// ================== PAGE TRANSITIONS & LOADER ==================

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");
  const body = document.body;

  // Fix loader height
  if (loader) {
    loader.style.height = window.innerHeight + "px";
    window.addEventListener("resize", () => {
      loader.style.height = window.innerHeight + "px";
    });
  }

  // On full load → hide loader
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
      body.classList.add("page-loaded");
    }, 600);
  });

  // --------- Transition Overlay ---------
  const transitionOverlay = document.createElement("div");
  transitionOverlay.className = "page-transition";
  document.body.appendChild(transitionOverlay);

  // Intercept internal links
  document.querySelectorAll("a[href]").forEach((link) => {
    if (
      link.hostname === window.location.hostname &&
      !link.href.includes("#") &&
      !link.target
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Trigger overlay fade
        transitionOverlay.classList.add("active");

        // Navigate after delay
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });

  // --------- Loader status cycling ---------
  const statusText = document.querySelector(".status-text");
  if (statusText) {
    const messages = ["Initializing...", "Loading assets...", "Finalizing..."];
    let i = 0;
    const cycle = setInterval(() => {
      statusText.textContent = messages[i];
      i++;
      if (i >= messages.length) clearInterval(cycle);
    }, 1000);
  }
});

// --------- Extra Loader Messages (looping) ---------
const statusMessages = [
  "Generating QR...",
  "Optimizing design...",
  "Loading experience...",
  "AI magic in progress...",
  "Finalizing..."
];

let msgIndex = 0;
setInterval(() => {
  const textEl = document.getElementById("loader-text");
  if (textEl) {
    textEl.textContent = statusMessages[msgIndex];
    msgIndex = (msgIndex + 1) % statusMessages.length;
  }
}, 1600);

// ================== SOFT-NAV FADE ==================
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-softnav]");
  if (!link || link.target === "_blank") return;
  e.preventDefault();
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = link.href;
  }, 120);
});
window.addEventListener("pageshow", () => {
  document.body.style.opacity = "";
});

// ================== ACTIVE LINK HIGHLIGHT ==================
document.querySelectorAll("a[data-softnav]").forEach((a) => {
  if (
    a.getAttribute("href") &&
    location.pathname.endsWith(a.getAttribute("href"))
  ) {
    a.classList.add("active");
  }
});

// ================== QR STORAGE API ==================
window.QRPRO = {
  saveLastQRText(t) {
    try {
      localStorage.setItem("qrpro:lastText", t);
    } catch {}
  },
  getLastQRText() {
    try {
      return localStorage.getItem("qrpro:lastText") || "";
    } catch {
      return "";
    }
  },
  saveLastQRPng(dataUrl) {
    try {
      localStorage.setItem("qrpro:lastPNG", dataUrl);
    } catch {}
  },
  getLastQRPng() {
    try {
      return localStorage.getItem("qrpro:lastPNG") || "";
    } catch {
      return "";
    }
  }
};
// ================== WELCOME POPUP ==================
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("welcome-popup");
  const popupContent = popup.querySelector(".popup-content");
  const closeBtn = popup.querySelector(".close-btn");

  // Show after 1.2 seconds
  setTimeout(() => popup.classList.add("show"), 1200);

  // Close logic
  closeBtn.addEventListener("click", () => popup.classList.remove("show"));

  // If click outside → shake instead of close
  popup.addEventListener("click", e => {
    if (e.target === popup) {
      popupContent.classList.add("shake");
      setTimeout(() => popupContent.classList.remove("shake"), 600);
    }
  });

  // Bounce every 10 seconds while visible
  let bounceInterval = setInterval(() => {
    if (popup.classList.contains("show")) {
      popupContent.classList.add("bounce");
      setTimeout(() => popupContent.classList.remove("bounce"), 900);
    }
  }, 10000);

  // Stop bounce when closed
  const observer = new MutationObserver(() => {
    if (!popup.classList.contains("show")) {
      clearInterval(bounceInterval);
    }
  });
  observer.observe(popup, { attributes: true, attributeFilter: ["class"] });
});

window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    loader.classList.add("hidden"); // reduces opacity + hides
});
// --- Auto bounce every 10s until closed ---
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("welcome-popup");
  const closeBtn = popup.querySelector(".close-btn");
  const content = popup.querySelector(".popup-content");

  // Show after 1.2 seconds
  setTimeout(() => popup.classList.add("show"), 1200);

  // Close with "×"
  closeBtn.addEventListener("click", () => popup.classList.remove("show"));

  // Shake instead of close when clicking outside
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      content.classList.add("shake");
      setTimeout(() => content.classList.remove("shake"), 500);
    }
  });

  // Auto bounce attention every 10s until closed
  setInterval(() => {
    if (popup.classList.contains("show")) {
      content.classList.add("attention");
      setTimeout(() => content.classList.remove("attention"), 800);
    }
  }, 10000);
});

// Detect if running inside Trusted Web Activity (TWA)
function isTWA() {
  return navigator.userAgent.includes("Chrome/") && window.matchMedia('(display-mode: standalone)').matches;
}

document.addEventListener("DOMContentLoaded", () => {
  if (isTWA()) {
    const btn = document.getElementById("download-btn");
    if (btn) btn.style.display = "none"; // hide in app
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const dragGuide = document.getElementById("drag-guide");
  let dragDetected = false;

  function hideDragGuide() {
    if (!dragGuide || dragDetected) return;
    dragDetected = true;
    dragGuide.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    dragGuide.style.opacity = "0";
    dragGuide.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => dragGuide.remove(), 900);
  }

  // Detect mouse drag
  let startX, startY;
  document.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });
  document.addEventListener("mouseup", (e) => {
    if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
      hideDragGuide();
    }
  });

  // Detect touch drag (mobile)
  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });
  document.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) {
      hideDragGuide();
    }
  });
});