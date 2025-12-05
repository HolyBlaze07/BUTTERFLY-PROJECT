// ===== FLOATING THEME SELECTOR =====
// Quick theme switcher button that appears on every page

(function () {
  "use strict";

  // Theme definitions (matching butterfly-theme.js)
  const THEMES = [
    {
      id: "original",
      name: "Original",
      preview: "linear-gradient(135deg, #0a0e27, #1a1f4d, #2d1b69)",
      premium: false,
      new: false,
    },
    {
      id: "default",
      name: "Midnight Sky",
      preview: "linear-gradient(135deg, #1c2541, #0b132b)",
      premium: false,
      new: false,
    },
    {
      id: "cotton-candy",
      name: "Cotton Candy",
      preview: "linear-gradient(135deg, #ffd1ff, #a8edea)",
      premium: false,
      new: false,
    },
    {
      id: "moonlight",
      name: "Moonlight",
      preview: "linear-gradient(135deg, #2c3e50, #34495e, #bdc3c7)",
      premium: false,
      new: false,
    },
    {
      id: "holo-prism",
      name: "Holographic",
      preview: "linear-gradient(135deg, #ff7cf8, #52abf4, #ffc857)",
      premium: true,
      new: true,
    },
    {
      id: "angel-aura",
      name: "Angel Aura",
      preview: "linear-gradient(135deg, #fff6d9, #fbc2eb)",
      premium: true,
      new: false,
    },
    {
      id: "neon-nights",
      name: "Neon Nights",
      preview: "linear-gradient(135deg, #00ffff, #ff00ff, #ffff00)",
      premium: true,
      new: true,
    },
    {
      id: "sunset-vibes",
      name: "Sunset",
      preview: "linear-gradient(135deg, #ff6b6b, #feca57, #ee5a6f)",
      premium: true,
      new: false,
    },
    {
      id: "aurora-borealis",
      name: "Aurora",
      preview: "linear-gradient(135deg, #00f260, #0575e6, #6a11cb)",
      premium: true,
      new: true,
    },
  ];

  const USER_KEY = "butterflyUser";

  // Get current user
  function getUser() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) {
        return {
          plan: "free",
          ownedSkins: ["default", "cotton-candy", "moonlight"],
          activeSkin: "default",
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      return {
        plan: "free",
        ownedSkins: ["default", "cotton-candy", "moonlight"],
        activeSkin: "default",
      };
    }
  }

  // Check if user has premium
  function isPremium() {
    const user = getUser();
    return user.plan === "monthly" || user.plan === "lifetime";
  }

  // Apply theme
  function applyTheme(themeId) {
    const user = getUser();
    const theme = THEMES.find((t) => t.id === themeId);

    if (!theme) return;

    // Check if user can use this theme
    if (theme.premium && !isPremium()) {
      if (
        confirm(
          "🦋 This theme requires Butterfly+!\n\nUpgrade to unlock all premium themes?\n\nClick OK to visit the upgrade page."
        )
      ) {
        window.location.href = getBasePath() + "html/butterfly-plus.html";
      }
      return;
    }

    // Update user data
    user.activeSkin = themeId;

    // Add to owned skins if not there
    if (!user.ownedSkins.includes(themeId)) {
      user.ownedSkins.push(themeId);
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Handle 'original' theme - clear all CSS variable overrides
    if (themeId === "original") {
      const root = document.documentElement;
      root.style.removeProperty("--bg-gradient");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-2");
      root.style.removeProperty("--glow-primary");
      root.style.removeProperty("--glow-secondary");
    } else {
      // Reload theme for other themes
      if (window.ButterflyTheme) {
        window.ButterflyTheme.reload();
      }
    }

    // Update UI
    updateThemeSelector();

    // Show feedback
    showThemeFeedback(theme.name);
  }

  // Get base path for navigation
  function getBasePath() {
    const path = window.location.pathname;
    return path.includes("/html/") ? "../" : "";
  }

  // Show theme change feedback
  function showThemeFeedback(themeName) {
    const existing = document.getElementById("theme-feedback");
    if (existing) existing.remove();

    const feedback = document.createElement("div");
    feedback.id = "theme-feedback";
    feedback.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid var(--accent);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      font-size: 0.95rem;
    `;
    feedback.innerHTML = `✨ Theme changed to <strong>${themeName}</strong>`;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = "0";
      feedback.style.transition = "opacity 0.3s ease";
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  // Create theme selector UI
  function createThemeSelector() {
    const user = getUser();
    const premium = isPremium();

    // Create container
    const container = document.createElement("div");
    container.className = "theme-selector-fab";
    container.innerHTML = `
      <button class="theme-selector-button" id="themeSelectorBtn" aria-label="Change theme" title="Change Theme">
        🎨
      </button>
      <div class="theme-selector-panel" id="themeSelectorPanel">
        <div class="theme-selector-header">
          <h3>🦋 Choose Theme</h3>
          <p>Currently: ${
            THEMES.find((t) => t.id === user.activeSkin)?.name || "Default"
          }</p>
        </div>
        <div class="theme-grid" id="themeGrid">
          <!-- Themes will be inserted here -->
        </div>
        <div class="theme-selector-footer">
          <a href="${getBasePath()}html/butterfly-plus.html">Unlock Premium Themes →</a>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Populate theme grid
    const grid = document.getElementById("themeGrid");
    THEMES.forEach((theme) => {
      const isActive = theme.id === user.activeSkin;
      const isLocked = theme.premium && !premium;

      const option = document.createElement("div");
      option.className = `theme-option ${isActive ? "active" : ""} ${
        isLocked ? "locked" : ""
      }`;
      option.innerHTML = `
        <div class="theme-preview" style="background-image: ${theme.preview}">
          ${isActive ? '<div class="theme-active-indicator">✓</div>' : ""}
          ${isLocked ? '<div class="theme-lock">🔒</div>' : ""}
          ${theme.new && !isLocked ? '<div class="theme-badge">NEW</div>' : ""}
          <div class="theme-name">${theme.name}</div>
        </div>
      `;

      option.addEventListener("click", () => applyTheme(theme.id));
      grid.appendChild(option);
    });

    // Toggle panel
    const btn = document.getElementById("themeSelectorBtn");
    const panel = document.getElementById("themeSelectorPanel");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove("active");
      }
    });
  }

  // Update theme selector when theme changes
  function updateThemeSelector() {
    const user = getUser();
    const grid = document.getElementById("themeGrid");
    const header = document.querySelector(".theme-selector-header p");

    if (header) {
      header.textContent = `Currently: ${
        THEMES.find((t) => t.id === user.activeSkin)?.name || "Default"
      }`;
    }

    if (grid) {
      const options = grid.querySelectorAll(".theme-option");
      options.forEach((option, index) => {
        const theme = THEMES[index];
        const isActive = theme.id === user.activeSkin;
        option.classList.toggle("active", isActive);

        const indicator = option.querySelector(".theme-active-indicator");
        if (indicator) indicator.remove();

        if (isActive) {
          const preview = option.querySelector(".theme-preview");
          const newIndicator = document.createElement("div");
          newIndicator.className = "theme-active-indicator";
          newIndicator.textContent = "✓";
          preview.appendChild(newIndicator);
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createThemeSelector);
  } else {
    createThemeSelector();
  }

  // Export for external use
  window.ThemeSelector = {
    apply: applyTheme,
    refresh: updateThemeSelector,
  };
})();
