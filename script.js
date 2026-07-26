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
let ambience;

function createAmbience() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const master = context.createGain();
  const surfFilter = context.createBiquadFilter();
  const surfGain = context.createGain();
  const waveLfo = context.createOscillator();
  const waveDepth = context.createGain();
  const sampleCount = context.sampleRate * 8;
  const noiseBuffer = context.createBuffer(2, sampleCount, context.sampleRate);

  for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel += 1) {
    const samples = noiseBuffer.getChannelData(channel);
    let smoothed = 0;
    for (let index = 0; index < sampleCount; index += 1) {
      const white = Math.random() * 2 - 1;
      smoothed = smoothed * 0.985 + white * 0.015;
      samples[index] = white * 0.22 + smoothed * 2.1;
    }
  }

  const surf = context.createBufferSource();
  surf.buffer = noiseBuffer;
  surf.loop = true;

  surfFilter.type = "lowpass";
  surfFilter.frequency.value = 1150;
  surfFilter.Q.value = 0.35;
  surfGain.gain.value = 0.34;
  master.gain.value = 0;

  waveLfo.type = "sine";
  waveLfo.frequency.value = 0.085;
  waveDepth.gain.value = 0.19;

  waveLfo.connect(waveDepth);
  waveDepth.connect(surfGain.gain);
  surf.connect(surfFilter);
  surfFilter.connect(surfGain);
  surfGain.connect(master);
  master.connect(context.destination);

  surf.start();
  waveLfo.start();

  return { context, master };
}

function setAmbience(enabled) {
  if (!ambience) ambience = createAmbience();

  const now = ambience.context.currentTime;
  ambience.master.gain.cancelScheduledValues(now);
  ambience.master.gain.setValueAtTime(ambience.master.gain.value, now);
  ambience.master.gain.linearRampToValueAtTime(enabled ? 0.28 : 0, now + 1.4);

  soundToggle.setAttribute("aria-pressed", String(enabled));
  soundToggle.textContent = `Pool ambience: ${enabled ? "On ♫" : "Off"}`;
}

soundToggle.addEventListener("click", async () => {
  const enabled = soundToggle.getAttribute("aria-pressed") === "true";
  const nextEnabled = !enabled;
  if (!ambience) ambience = createAmbience();
  if (nextEnabled && ambience.context.state === "suspended") {
    ambience.context.resume();
  }
  setAmbience(nextEnabled);
});
