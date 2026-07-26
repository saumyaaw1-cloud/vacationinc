const departments = {
  launches: {
    number: "01",
    title: "Turn the exciting idea into a launch everyone can execute.",
    copy: "I bring structure to ambitious work: clear briefs, owners, dependencies, feedback loops, and calm cross-functional follow-through.",
    proof: "Disney · AI tool rollout · 100-person adoption",
  },
  experiences: {
    number: "02",
    title: "Make the brand world something people can actually enter.",
    copy: "My background spans immersive film, spatial environments, live broadcast, AR, and interactive storytelling—always designed around how real people feel and behave.",
    proof: "Sony + NBCUniversal · spatial, immersive, and AR",
  },
  systems: {
    number: "03",
    title: "Protect the details behind the fun.",
    copy: "I identify friction, build the useful thing, and stay close enough to users to make it stick. Technology is the support system—not the headline.",
    proof: "Disney · pitched, built, shipped, trained, supported",
  },
  experiments: {
    number: "04",
    title: "Prototype the idea before the meeting gets boring.",
    copy: "I can move from research to prototype quickly, test the experience, translate feedback, and give creative and technical teams something concrete to react to.",
    proof: "USC Ganek Lab · concept-to-showcase ownership",
  },
};

const launchTypes = {
  product: {
    memo: "PRODUCT LAUNCH MEMO",
    steps: [
      "Translate the product truth into one memorable customer promise.",
      "Build the cross-functional workback and surface risky dependencies early.",
      "Prototype one interaction that lets the audience experience the idea.",
    ],
    stamp: "READY FOR LEISURE",
  },
  collaboration: {
    memo: "PARTNERSHIP ACTIVATION MEMO",
    steps: [
      "Find the shared cultural truth—not merely two logos that look nice together.",
      "Map the partner, product, retail, creative, and event handoffs.",
      "Create a participatory detail people will photograph because they want to.",
    ],
    stamp: "MUTUAL ADMIRATION",
  },
  experience: {
    memo: "EXPERIENCE DEVELOPMENT MEMO",
    steps: [
      "Define the feeling the guest should leave with before defining the technology.",
      "Prototype the highest-risk interaction and observe where attention drops.",
      "Design the operating plan so the magic survives contact with real life.",
    ],
    stamp: "FULLY IMMERSIVE",
  },
};

let selectedLaunch = "product";

const departmentButtons = document.querySelectorAll("[data-department]");
const panel = document.querySelector(".department-panel");
departmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    departmentButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    const item = departments[button.dataset.department];
    document.querySelector("#panel-kicker").textContent = `DEPARTMENT ${item.number}`;
    document.querySelector("#panel-title").textContent = item.title;
    document.querySelector("#panel-copy").textContent = item.copy;
    document.querySelector("#panel-proof").textContent = item.proof;
    panel.animate(
      [{ opacity: 0.4, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 280, easing: "ease-out" }
    );
  });
});

const launchButtons = document.querySelectorAll("[data-launch]");
launchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedLaunch = button.dataset.launch;
    launchButtons.forEach((item) => {
      item.classList.remove("selected");
      item.querySelector("span").textContent = "○";
    });
    button.classList.add("selected");
    button.querySelector("span").textContent = "●";
    document.querySelector("#memo-empty").hidden = false;
    document.querySelector("#memo-content").hidden = true;
  });
});

document.querySelector("#generate-memo").addEventListener("click", () => {
  const memo = launchTypes[selectedLaunch];
  document.querySelector("#memo-empty").hidden = true;
  document.querySelector("#memo-content").hidden = false;
  document.querySelector("#memo-title").textContent = memo.memo;
  document.querySelector("#memo-steps").innerHTML = memo.steps
    .map((step, index) => `<li><span>0${index + 1}</span><p>${step}</p></li>`)
    .join("");
  const stamp = document.querySelector("#stamp-button");
  stamp.textContent = "STAMP FOR APPROVAL";
  stamp.classList.remove("approved");
  document.querySelector("#memo-content").animate(
    [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 350, easing: "ease-out" }
  );
});

document.querySelector("#stamp-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = launchTypes[selectedLaunch].stamp;
  event.currentTarget.classList.remove("approved");
  void event.currentTarget.offsetWidth;
  event.currentTarget.classList.add("approved");
});
