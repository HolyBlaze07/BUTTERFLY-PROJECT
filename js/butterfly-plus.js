// ===== BUTTERFLY+ MEMBERSHIP & SKINS SYSTEM =====
// Modular JavaScript for premium features and theme management

// ===== CONSTANTS =====
const USER_KEY = "butterflyUser";
const SKINS_KEY = "butterflyAvailableSkins";

// ===== DEFAULT USER STATE =====
const defaultUser = {
  plan: "free", // 'free' | 'monthly' | 'lifetime'
  ownedSkins: ["original", "default", "cotton-candy", "moonlight"], // All free skins unlocked by default
  activeSkin: "default",
  purchaseDate: null,
  badge: null,
};

// ===== SKIN DEFINITIONS =====
const SKINS = [
  {
    id: "original",
    name: "Original",
    premium: false,
    new: false,
    description: "Restore the original hardcoded page styling.",
    preview: "linear-gradient(135deg, #0a0e27, #1a1f4d, #2d1b69)",
    cssVars: {}, // Empty - will clear CSS variables
  },
  {
    id: "default",
    name: "Midnight Sky",
    premium: false,
    new: false,
    description: "Deep blue midnight gradient with subtle star glow.",
    preview: "linear-gradient(135deg, #1c2541, #0b132b)",
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
    premium: true,
    new: true,
    description:
      "Neon holographic gradient with rainbow sparkles and vibrant glow.",
    preview: "linear-gradient(135deg, #ff7cf8, #52abf4, #ffc857)",
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
    premium: true,
    new: false,
    description: "Soft gold and cream glow with gentle ethereal light.",
    preview: "linear-gradient(135deg, #fff6d9, #fbc2eb)",
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
    premium: true,
    new: true,
    description: "Electric neon colors with cyberpunk vibes and intense glow.",
    preview: "linear-gradient(135deg, #00ffff, #ff00ff, #ffff00)",
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
    premium: false,
    new: false,
    description: "Sweet pastel pink and blue like fluffy cotton candy clouds.",
    preview: "linear-gradient(135deg, #ffd1ff, #a8edea)",
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
    premium: true,
    new: false,
    description: "Warm sunset colors with orange, pink, and purple gradients.",
    preview: "linear-gradient(135deg, #ff6b6b, #feca57, #ee5a6f)",
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
    premium: true,
    new: true,
    description:
      "Mystical northern lights with flowing green and purple waves.",
    preview: "linear-gradient(135deg, #00f260, #0575e6, #6a11cb)",
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
    premium: false,
    new: false,
    description: "Calm midnight blue with soft silver moonlight shimmer.",
    preview: "linear-gradient(135deg, #2c3e50, #34495e, #bdc3c7)",
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

// ===== STATE =====
let user = loadUser();

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initializeButterflies();
  updatePlanLabel();
  renderSkins();
  applySkin(user.activeSkin);
  setupEventListeners();
});

// ===== USER MANAGEMENT =====
function loadUser() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return { ...defaultUser };
  try {
    const loadedUser = { ...defaultUser, ...JSON.parse(stored) };

    // Ensure all free skins are in ownedSkins (for existing users)
    const freeSkinIds = SKINS.filter((s) => !s.premium).map((s) => s.id);
    freeSkinIds.forEach((skinId) => {
      if (!loadedUser.ownedSkins.includes(skinId)) {
        loadedUser.ownedSkins.push(skinId);
      }
    });

    return loadedUser;
  } catch {
    return { ...defaultUser };
  }
}

function saveUser() {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Also update the global butterfly hub user if it exists
  const hubUser = localStorage.getItem("butterflyHubCurrentUser");
  if (hubUser) {
    try {
      const hubData = JSON.parse(hubUser);
      hubData.butterflyPlus = {
        plan: user.plan,
        activeSkin: user.activeSkin,
      };
      localStorage.setItem("butterflyHubCurrentUser", JSON.stringify(hubData));
    } catch (e) {
      console.warn("Could not sync with hub user", e);
    }
  }
}

function isPremium() {
  return user.plan === "monthly" || user.plan === "lifetime";
}

function updatePlanLabel() {
  const label = document.getElementById("planLabel");
  let text = "Current Plan: Free";

  if (user.plan === "monthly") {
    text = "🦋 Butterfly+ Monthly";
    label.classList.add("premium");
  } else if (user.plan === "lifetime") {
    text = "🦋 Butterfly+ Lifetime";
    label.classList.add("premium");
  } else {
    label.classList.remove("premium");
  }

  label.textContent = text;
}

// ===== UPGRADE SYSTEM =====
function simulateUpgrade(plan) {
  if (plan !== "monthly" && plan !== "lifetime") return;

  user.plan = plan;
  user.purchaseDate = new Date().toISOString();

  if (plan === "lifetime") {
    user.badge = "holo";
  }

  // Unlock all premium skins automatically
  SKINS.forEach((skin) => {
    if (skin.premium && !user.ownedSkins.includes(skin.id)) {
      user.ownedSkins.push(skin.id);
    }
  });

  saveUser();
  updatePlanLabel();
  renderSkins();

  // Show success modal
  showUpgradeModal();

  // Add confetti or sparkle effect
  createConfetti();
}

function showUpgradeModal() {
  const modal = document.getElementById("upgradeModal");
  modal.classList.add("active");
}

function closeUpgradeModal() {
  const modal = document.getElementById("upgradeModal");
  modal.classList.remove("active");
}

// Make closeUpgradeModal globally available
window.closeUpgradeModal = closeUpgradeModal;

// ===== SKIN SYSTEM =====
function applySkin(skinId) {
  const skin = SKINS.find((s) => s.id === skinId);
  if (!skin) {
    console.warn(`Skin "${skinId}" not found`);
    return;
  }

  // Free skins can always be applied, premium skins need ownership
  const canApply = !skin.premium || user.ownedSkins.includes(skinId);

  if (!canApply) {
    console.warn(`User doesn't own premium skin: ${skinId}`);
    return;
  }

  // Add to owned skins if it's free and not already there
  if (!skin.premium && !user.ownedSkins.includes(skinId)) {
    user.ownedSkins.push(skinId);
  }

  // Handle 'original' theme - clear CSS variables
  if (skinId === "original") {
    const root = document.documentElement;
    root.style.removeProperty("--bg-gradient");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-2");
    root.style.removeProperty("--glow-primary");
    root.style.removeProperty("--glow-secondary");
  } else {
    // Apply CSS variables for other themes
    Object.entries(skin.cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  user.activeSkin = skinId;
  saveUser();
  highlightActiveSkin();

  console.log(`✨ Theme applied: ${skin.name}`);

  // Trigger theme change animation
  createSparkles();

  // Notify other tabs/pages to reload theme
  window.dispatchEvent(new Event("storage"));
}

function renderSkins() {
  const grid = document.getElementById("skinsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  SKINS.forEach((skin) => {
    const card = createSkinCard(skin);
    grid.appendChild(card);
  });

  highlightActiveSkin();
}

function createSkinCard(skin) {
  const card = document.createElement("article");
  card.className = "skin-card";
  card.dataset.skinId = skin.id;

  // Preview
  const preview = document.createElement("div");
  preview.className = "skin-preview";
  preview.style.backgroundImage = skin.preview;

  // Lock badge for premium skins
  if (skin.premium && !isPremium()) {
    const lock = document.createElement("span");
    lock.className = "lock-badge";
    lock.textContent = "🔒 Locked";
    card.appendChild(lock);
  }

  // Name
  const name = document.createElement("div");
  name.className = "skin-name";
  name.textContent = skin.name;

  // Description
  const description = document.createElement("div");
  description.className = "skin-description";
  description.textContent = skin.description;

  // Tags
  const tags = document.createElement("div");
  tags.className = "skin-tags";

  if (skin.new) {
    const newTag = document.createElement("span");
    newTag.className = "skin-tag new";
    newTag.textContent = "✨ New";
    tags.appendChild(newTag);
  }

  const typeTag = document.createElement("span");
  typeTag.className = `skin-tag ${skin.premium ? "premium" : "free"}`;
  typeTag.textContent = skin.premium ? "Premium" : "Free";
  tags.appendChild(typeTag);

  // Button
  const button = document.createElement("button");
  button.className = "btn secondary";

  if (user.ownedSkins.includes(skin.id)) {
    button.innerHTML = "<span>Apply Theme</span>";
  } else if (skin.premium) {
    button.innerHTML = "<span>Unlock with Butterfly+</span>";
  } else {
    button.innerHTML = "<span>Unlock Free</span>";
  }

  button.addEventListener("click", () => handleSkinClick(skin));

  // Assemble card
  card.appendChild(preview);
  card.appendChild(name);
  card.appendChild(description);
  card.appendChild(tags);
  card.appendChild(button);

  return card;
}

function highlightActiveSkin() {
  const cards = document.querySelectorAll(".skin-card");
  cards.forEach((card) => {
    card.classList.toggle("active", card.dataset.skinId === user.activeSkin);
  });
}

function handleSkinClick(skin) {
  console.log("🎨 Skin clicked:", skin.name, "ID:", skin.id);
  console.log("Is premium?", skin.premium, "User is premium?", isPremium());
  console.log("User owned skins:", user.ownedSkins);

  // If premium skin and not premium user, show upgrade prompt
  if (skin.premium && !isPremium()) {
    console.log("⚠️ Premium skin requires upgrade");
    showUpgradePrompt();
    return;
  }

  // If they don't own it but it's free, unlock it
  if (!user.ownedSkins.includes(skin.id) && !skin.premium) {
    console.log("✅ Unlocking free skin:", skin.id);
    user.ownedSkins.push(skin.id);
    saveUser();
  }

  // Apply the skin
  console.log("🎨 Applying skin:", skin.id);
  applySkin(skin.id);
  renderSkins();
}

function showUpgradePrompt() {
  const shouldScroll = confirm(
    "✨ This theme is part of Butterfly+!\n\nUpgrade now to unlock all premium themes and features.\n\nClick OK to see pricing options."
  );

  if (shouldScroll) {
    document.getElementById("pricing").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// ===== VISUAL EFFECTS =====
function initializeButterflies() {
  const field = document.querySelector(".butterfly-field");
  if (!field) return;

  const sprites = [
    "Butterfly4.png",
    "Butterfly6.png",
    "Butterfly8.png",
    "Butterfly12.png",
  ];

  for (let i = 0; i < 9; i++) {
    const span = document.createElement("span");
    const asset = sprites[i % sprites.length];
    span.style.left = Math.random() * 100 + "%";
    span.style.bottom = Math.random() * 20 - 10 + "vh";
    span.style.animationDelay = `${Math.random() * 12}s`;
    span.style.backgroundImage = `url(../assets/${asset})`;
    field.appendChild(span);
  }
}

function createSparkles() {
  const sparkleCount = 20;
  const container = document.body;

  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "vw";
      sparkle.style.top = Math.random() * 100 + "vh";
      sparkle.style.animationDelay = Math.random() * 0.5 + "s";
      container.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 2000);
    }, i * 50);
  }
}

function createConfetti() {
  // Simple confetti burst effect
  const colors = ["#ff7cf8", "#52abf4", "#ffc857", "#00ffff", "#ff00ff"];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = "50%";
      confetti.style.top = "50%";
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "10001";

      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      document.body.appendChild(confetti);

      let x = 0,
        y = 0,
        opacity = 1;
      const gravity = 0.3;
      let vyTemp = vy;

      const animate = () => {
        x += vx;
        y += vyTemp;
        vyTemp += gravity;
        opacity -= 0.02;

        confetti.style.transform = `translate(${x}px, ${y}px)`;
        confetti.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };

      animate();
    }, i * 20);
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  const monthlyBtn = document.getElementById("monthlyBtn");
  const lifetimeBtn = document.getElementById("lifetimeBtn");

  if (monthlyBtn) {
    monthlyBtn.addEventListener("click", () => simulateUpgrade("monthly"));
  }

  if (lifetimeBtn) {
    lifetimeBtn.addEventListener("click", () => simulateUpgrade("lifetime"));
  }

  // Close modal on background click
  const modal = document.getElementById("upgradeModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeUpgradeModal();
      }
    });
  }
}

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
window.ButterflyPlus = {
  getUser: () => user,
  isPremium,
  applySkin,
  getSkins: () => SKINS,
  upgrade: simulateUpgrade,
};
