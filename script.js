const roles = {
  launch: {
    placement: "01",
    title: "Brand",
    proof: "I shape audience-facing experiences, translate creative ideas into cohesive brand moments, and help bring campaigns from concept to execution with consistency and intention.",
  },
  experience: {
    placement: "02",
    title: "Strategy",
    proof: "I connect audience behavior, business objectives, and emerging trends to uncover opportunities worth pursuing. Then, I turn those insights into a clear, actionable direction.",
  },
  special: {
    placement: "03",
    title: "Go-to-Market",
    proof: "I bring ideas out of the deck and into the world, aligning teams, clarifying positioning, and carrying launches from concept to audience.",
  },
};

const evidence = {
  disney: {
    label: "EVIDENCE 01 / BRAND + MOTION",
    title: "Brand work built for the NBA Finals.",
    copy: "At Disney, I designed and delivered a suite of 2D and 3D brand visuals and motion graphics for the NBA Finals, translating campaign direction into broadcast-ready assets.",
  },
  sony: {
    label: "EVIDENCE 02 / R&D + STRATEGY",
    title: "Research with a $100M signal.",
    copy: "At Sony, I developed an R&D prototype that helped inform the company’s immersive entertainment strategy, culminating in a $100M strategic investment in Cosm.",
  },
  nbc: {
    label: "EVIDENCE 03 / RESEARCH + DELIVERY",
    title: "From emerging idea to shipped experience.",
    copy: "At NBCUniversal, I researched and pitched new creative resources, helped move selected ideas into the team’s workflow, supported production from concept through execution, and shipped an original experience for Apple Vision Pro.",
  },
};

const roleButtons = document.querySelectorAll(".role");
const roleCard = document.querySelector(".role-card");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = roles[button.dataset.role];
    roleButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });
    roleCard.classList.add("swap");
    setTimeout(() => {
      document.querySelector("#placement-number").textContent = selected.placement;
      document.querySelector("#role-title").textContent = selected.title;
      document.querySelector("#role-proof").textContent = selected.proof;
      roleCard.classList.remove("swap");
    }, 170);
  });
});

const fileModal = document.querySelector("#file-modal");
document.querySelector("[data-open-file]").addEventListener("click", () => fileModal.showModal());

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

const proofModal = document.querySelector("#proof-modal");
document.querySelectorAll("[data-proof]").forEach((card) => {
  card.addEventListener("click", () => {
    const item = evidence[card.dataset.proof];
    document.querySelector("#proof-label").textContent = item.label;
    document.querySelector("#proof-title").textContent = item.title;
    document.querySelector("#proof-copy").textContent = item.copy;
    document.querySelector(".stamp-button").textContent = "STAMP AS RELEVANT";
    proofModal.showModal();
  });
});

document.querySelector(".stamp-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = "✓ HIGHLY RELEVANT";
});

const callCard = document.querySelector(".call-card");
document.querySelector(".phone").addEventListener("click", () => {
  callCard.hidden = false;
});
callCard.querySelector("button").addEventListener("click", () => {
  callCard.hidden = true;
});

const soundToggle = document.querySelector(".sound-toggle");
const ambience = document.querySelector("#pool-ambience");
let volumeTimer;

function fadeVolume(target, onComplete) {
  clearInterval(volumeTimer);
  const step = target > ambience.volume ? 0.04 : -0.04;
  volumeTimer = setInterval(() => {
    const next = ambience.volume + step;
    const reached = step > 0 ? next >= target : next <= target;
    ambience.volume = reached ? target : Math.max(0, Math.min(1, next));
    if (reached) {
      clearInterval(volumeTimer);
      onComplete?.();
    }
  }, 55);
}

soundToggle.addEventListener("click", async () => {
  const enabled = soundToggle.getAttribute("aria-pressed") === "true";

  if (enabled) {
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.textContent = "Beach ambience: Off";
    fadeVolume(0, () => ambience.pause());
    return;
  }

  ambience.volume = 0;
  const playback = ambience.play();
  soundToggle.setAttribute("aria-pressed", "true");
  soundToggle.textContent = "Beach ambience: On ♫";
  fadeVolume(0.82);

  playback.catch(() => {
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.textContent = "Tap to allow sound";
  });
});
