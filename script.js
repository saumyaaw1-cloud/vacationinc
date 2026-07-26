const roles = {
  launch: {
    kicker: "RECOMMENDED PLACEMENT: A",
    title: "Build a brand world people want to step inside.",
    proof: "I’ve directed audience-facing experiences, shaped visual narratives, and carried distinctive creative concepts from idea through execution.",
  },
  experience: {
    kicker: "RECOMMENDED PLACEMENT: B",
    title: "Find the opportunity. Make the case. Shape the plan.",
    proof: "I’ve researched emerging behavior and technology, pitched recommendations to senior decision-makers, and translated complex possibilities into clear creative direction.",
  },
  special: {
    kicker: "RECOMMENDED PLACEMENT: C",
    title: "Carry the idea all the way to market.",
    proof: "I’ve taken new ideas from pitch through adoption—aligning stakeholders, clarifying the value, and helping the finished work land with its intended audience.",
  },
};

const evidence = {
  disney: {
    label: "EVIDENCE 01 / OWNERSHIP + ADOPTION",
    title: "From zero to 100 users.",
    copy: "At Disney, I spotted a real team need, pitched the solution, built the resource from scratch, and drove adoption across a 100-person production team. It became something operators relied on under live, high-pressure conditions.",
  },
  sony: {
    label: "EVIDENCE 02 / AUDIENCE EXPERIENCE",
    title: "From concept to an environment people could enter.",
    copy: "At Sony, I directed immersive experiences for dome and spatial environments, then worked with engineers and creatives to test, refine, and prepare every element for the audience.",
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
      document.querySelector("#role-kicker").textContent = selected.kicker;
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
    soundToggle.textContent = "Pool ambience: Off";
    fadeVolume(0, () => ambience.pause());
    return;
  }

  ambience.volume = 0;
  const playback = ambience.play();
  soundToggle.setAttribute("aria-pressed", "true");
  soundToggle.textContent = "Pool ambience: On ♫";
  fadeVolume(0.82);

  playback.catch(() => {
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.textContent = "Tap to allow sound";
  });
});
