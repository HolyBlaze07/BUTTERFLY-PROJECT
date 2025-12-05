// ===== BUTTERFLY THEME SYSTEM =====
// Shared theme loader for all Butterfly Hub pages
// Automatically applies the user's selected theme across the entire app

// ===== CONSTANTS =====
const USER_KEY = "butterflyUser";

// ===== SKIN DEFINITIONS =====
// This must match the skins in butterfly-plus.js
const THEME_SKINS = [
  {
    id: "default",
    name: "Midnight Sky",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #1c2541, #0b132b, #000000)",
      "--accent": "#52abf4",
      "--accent-2": "#52abf4",
      "--glow-primary": "rgba(82, 171, 244, 0.7)",
      "--glow-secondary": "rgba(82, 171, 244, 0.5)",
    },
  },
  {
    id: "holo-prism",
    name: "Holographic Prism",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #ff7cf8, #52abf4, #090012)",
      "--accent": "#ff7cf8",
      "--accent-2": "#52abf4",
      "--glow-primary": "rgba(255, 124, 248, 0.8)",
      "--glow-secondary": "rgba(82, 171, 244, 0.6)",
    },
  },
  {
    id: "angel-aura",
    name: "Angel Aura",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #fbc2eb, #a18cd1, #230b42)",
      "--accent": "#ffd27f",
      "--accent-2": "#fbc2eb",
      "--glow-primary": "rgba(255, 210, 127, 0.7)",
      "--glow-secondary": "rgba(251, 194, 235, 0.5)",
    },
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #ff00ff, #00ffff, #0a0014)",
      "--accent": "#00ffff",
      "--accent-2": "#ff00ff",
      "--glow-primary": "rgba(0, 255, 255, 0.9)",
      "--glow-secondary": "rgba(255, 0, 255, 0.7)",
    },
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #ffd1ff, #a8edea, #1a1a2e)",
      "--accent": "#ffc0ff",
      "--accent-2": "#a8edea",
      "--glow-primary": "rgba(255, 192, 255, 0.6)",
      "--glow-secondary": "rgba(168, 237, 234, 0.5)",
    },
  },
  {
    id: "sunset-vibes",
    name: "Sunset Vibes",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #ff6b6b, #feca57, #1e1e30)",
      "--accent": "#feca57",
      "--accent-2": "#ff6b6b",
      "--glow-primary": "rgba(254, 202, 87, 0.7)",
      "--glow-secondary": "rgba(255, 107, 107, 0.6)",
    },
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #00f260, #0575e6, #000428)",
      "--accent": "#00f260",
      "--accent-2": "#6a11cb",
      "--glow-primary": "rgba(0, 242, 96, 0.7)",
      "--glow-secondary": "rgba(106, 17, 203, 0.6)",
    },
  },
  {
    id: "moonlight",
    name: "Moonlight",
    cssVars: {
      "--bg-gradient":
        "radial-gradient(circle at top, #34495e, #2c3e50, #0a0a0f)",
      "--accent": "#bdc3c7",
      "--accent-2": "#7f8c8d",
      "--glow-primary": "rgba(189, 195, 199, 0.6)",
      "--glow-secondary": "rgba(127, 140, 141, 0.5)",
    },
  },
];

// ===== THEME APPLICATION =====
/**
 * Apply a theme by its skin ID.
 * This sets CSS custom properties on the document root.
 */
function applyButterflyTheme(skinId) {
  // Handle 'original' theme - clear all CSS variable overrides
  if (skinId === "original") {
    const root = document.documentElement;
    root.style.removeProperty("--bg-gradient");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-2");
    root.style.removeProperty("--glow-primary");
    root.style.removeProperty("--glow-secondary");
    console.log("✨ Butterfly theme cleared: Original styling restored");
    return;
  }

  const skin = THEME_SKINS.find((s) => s.id === skinId);
  if (!skin) {
    console.warn(`Theme "${skinId}" not found. Using default.`);
    return applyButterflyTheme("default");
  }

  // Apply all CSS variables from the skin
  Object.entries(skin.cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  console.log(`✨ Butterfly theme applied: ${skin.name}`);
}

/**
 * Load the user's active theme from localStorage.
 * Automatically called when this script loads.
 */
function loadUserTheme() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      // No user data, use default theme
      applyButterflyTheme("default");
      return;
    }

    const user = JSON.parse(stored);
    const activeSkin = user.activeSkin || "default";
    applyButterflyTheme(activeSkin);
  } catch (error) {
    console.error("Failed to load user theme:", error);
    applyButterflyTheme("default");
  }
}

// ===== AUTO-INITIALIZE ON LOAD =====
// Run immediately when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadUserTheme);
} else {
  // DOM already loaded
  loadUserTheme();
}

// ===== LISTEN FOR THEME CHANGES =====
// Listen for storage events from other tabs/windows
window.addEventListener("storage", (event) => {
  if (event.key === USER_KEY) {
    loadUserTheme();
  }
});

// ===== EXPORT FOR EXTERNAL USE =====
window.ButterflyTheme = {
  apply: applyButterflyTheme,
  reload: loadUserTheme,
  getSkins: () => THEME_SKINS,
};
