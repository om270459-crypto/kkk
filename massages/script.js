(function() { const run = () => {
  const card = document.querySelector(".holiday-card");
  const cardContent = document.querySelector(".card-content");
  const firstSection = document.querySelector(".text-content");

  // Create Arrows
  const prevBtn = document.createElement("i");
  prevBtn.className = "fas fa-chevron-left nav-arrow prev-arrow disabled";

  const nextBtn = document.createElement("i");
  nextBtn.className = "fas fa-chevron-right nav-arrow next-arrow";

  card.appendChild(prevBtn);
  card.appendChild(nextBtn);

  // Create New Sections
  const createSection = (title, text) => {
    const section = firstSection.cloneNode(true);
    section.querySelector("h1").innerHTML = title;
    section.querySelector("p").innerHTML = text;
    section.classList.add("content-hidden");
    // Remove buttons if desired, but user said 'matching existing structure', so keep them?
    // "matching the existing structure". Structure includes buttons. I'll keep them.
    return section;
  };

  const section2 = createSection(
    "WARMEST<br>WISHES",
    "i wish you a happy year full of energy happiniess and comfort and of course i hope that you will be present in my life in it and we prefer each other and together and no one can separete uss and prefer to love each other."
  );
  const section3 = createSection(
    "PROMISES TO<br>2026",
    "here we are done i want to promise you on the occasion of the new year that i will stay with you and i will not leave you and i will always love you and be with you also you will with each other sside by side and we will never stay away from each other.in general i aam sorry that continued although i said that i will stop in it but it is impossible to let your end of this year pass on you without anything creaative like this and i would like to tell you that every year we are together"
  );

  cardContent.appendChild(section2);
  cardContent.appendChild(section3);

  // Navigation Logic
  const sections = [firstSection, section2, section3];
  let currentIndex = 0;
  let isAnimating = false;

  function updateArrows() {
    if (currentIndex === 0) prevBtn.classList.add("disabled");
    else prevBtn.classList.remove("disabled");

    if (currentIndex === sections.length - 1) nextBtn.classList.add("disabled");
    else nextBtn.classList.remove("disabled");
  }

  function goToSection(index) {
    if (isAnimating || index < 0 || index >= sections.length) return;

    isAnimating = true;
    const current = sections[currentIndex];
    const next = sections[index];

    // Fade out
    current.style.opacity = "0";

    setTimeout(() => {
      current.classList.add("content-hidden");
      current.style.opacity = ""; // Reset inline opacity for future use if class handles it?
      // Wait, existing .text-content has simple opacity 1. content-hidden has opacity 0.
      // We need to ensure when we remove content-hidden, it fades in.

      next.classList.remove("content-hidden");
      next.style.opacity = "0"; // Start at 0
      void next.offsetWidth; // Reflow
      next.style.opacity = "1";

      currentIndex = index;
      updateArrows();

      setTimeout(() => {
        isAnimating = false;
      }, 400);
    }, 400);
  }

  prevBtn.addEventListener("click", () => goToSection(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSection(currentIndex + 1));
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
