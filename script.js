const roles = {
  launch: {
    kicker: "RECOMMENDED PLACEMENT: A",
    title: "Make the idea easy to want—and easy to launch.",
    proof: "Proof: pitched, built, and rolled out an AI production tool to 100 Disney teammates.",
  },
  experience: {
    kicker: "RECOMMENDED PLACEMENT: B",
    title: "Turn the brand world into something people can enter.",
    proof: "Proof: built immersive and spatial experiences across Sony, NBCUniversal, and USC.",
  },
  special: {
    kicker: "RECOMMENDED PLACEMENT: C",
    title: "Take the strange brief from “maybe” to “it’s live.”",
    proof: "Proof: translates between creative, engineering, production, and real-world operators.",
  },
};

const evidence = {
  disney: {
    label: "EVIDENCE 01 / OWNERSHIP",
    title: "Disney",
    copy: "Pitched, built, and shipped an AI production tool from scratch. It became a trusted workflow across a 100-person production team.",
  },
  sony: {
    label: "EVIDENCE 02 / WORLD-BUILDING",
    title: "Sony",
    copy: "Directed and refined immersive experiences blending artificial intelligence, spatial design, and audience behavior.",
  },
  nbc: {
    label: "EVIDENCE 03 / EXPERIMENTATION",
    title: "NBCUniversal",
    copy: "Researched emerging tools, built virtual-production assets, and shipped an original Apple Vision Pro AR experience.",
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
