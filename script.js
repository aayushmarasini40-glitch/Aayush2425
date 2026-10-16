const intro = document.getElementById("intro");
const entranceVideo = document.getElementById("entranceVideo");
const enterButton = document.getElementById("enterButton");
const skipButton = document.getElementById("skipButton");
const mainSite = document.getElementById("mainSite");

function enterPortfolio() {
  if (intro.classList.contains("exit")) return;

  intro.classList.add("exit");

  mainSite.classList.remove("hidden");
  document.body.style.overflowX = "hidden";

  setTimeout(() => {
    intro.style.display = "none";
    entranceVideo.pause();

    document.querySelectorAll(".reveal").forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.classList.add("visible");
      }
    });
  }, 850);
}

enterButton.addEventListener("click", enterPortfolio);
skipButton.addEventListener("click", enterPortfolio);

// Start button (unmutes video on click)
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  entranceVideo.muted = false;
  entranceVideo.play();
  startButton.style.display = "none";
});

// Attempt to play the intro video (muted autoplay)
entranceVideo.play().catch(() => {
  entranceVideo.muted = true;
  entranceVideo.play();
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Typing animation
const typingText = document.getElementById("typingText");
const words = ["Student", "Web Designer", "Creative Learner", "Future Developer"];
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeWords() {
  const word = words[wordIndex];
  typingText.textContent = word.substring(0, letterIndex);

  if (!deleting) {
    letterIndex++;
    if (letterIndex > word.length) {
      deleting = true;
      setTimeout(typeWords, 1100);
      return;
    }
  } else {
    letterIndex--;
    if (letterIndex < 0) {
      deleting = false;
      letterIndex = 0;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeWords, deleting ? 45 : 90);
}
typeWords();

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

// Custom cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function moveRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(moveRing);
  }
  moveRing();

  document.querySelectorAll("a, button, .glass-card").forEach(element => {
    element.addEventListener("mouseenter", () => cursorRing.classList.add("hovering"));
    element.addEventListener("mouseleave", () => cursorRing.classList.remove("hovering"));
  });
}

// Gentle 3D movement on the profile photo
const photoFrame = document.querySelector(".photo-frame");

if (photoFrame && window.matchMedia("(pointer: fine)").matches) {
  photoFrame.addEventListener("mousemove", event => {
    const rect = photoFrame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    photoFrame.style.transform =
      `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });

  photoFrame.addEventListener("mouseleave", () => {
    photoFrame.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  });
}

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the active navigation section
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll("#navLinks a");

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => activeObserver.observe(section));

// Scroll progress bar
const progressBar = document.querySelector(".scroll-progress");
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = `${scrolled * 100}%`;
}, { passive: true });

// Contact form (sends to aayushmarasini40@gmail.com via Web3Forms)
const contactForm = document.getElementById("contactForm");
const submitBtn = contactForm.querySelector("button[type='submit']");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  submitBtn.classList.add("sending");

  const data = new FormData(contactForm);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    const json = await res.json();
    if (json.success) {
      submitBtn.textContent = "✅ Sent!";
      submitBtn.classList.remove("sending");
      submitBtn.classList.add("sent");
      contactForm.reset();
    } else {
      throw new Error();
    }
  } catch {
    submitBtn.textContent = "❌ Failed!";
    submitBtn.classList.add("error");
  }

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message ↗";
    submitBtn.classList.remove("sending", "sent", "error");
  }, 3000);
});

// ===== SMOOTH PARALLAX (lerp-based) =====
const orbs = document.querySelectorAll(".orb");
const heroVisual = document.querySelector(".hero-visual");
const heroText = document.querySelector(".hero-text");
const floatingTags = document.querySelectorAll(".floating-tag");
const sectionHeadings = document.querySelectorAll(".section-heading");

let currentY = window.scrollY;
let targetY = window.scrollY;
const lerpFactor = 0.08;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateParallax() {
  currentY = lerp(currentY, targetY, lerpFactor);

  if (Math.abs(targetY - currentY) < 0.1) {
    currentY = targetY;
  }

  orbs.forEach((orb, i) => {
    const speed = 0.15 + i * 0.08;
    orb.style.transform = `translateY(${currentY * speed}px)`;
  });

  if (heroVisual) {
    heroVisual.style.transform = `translateY(${currentY * 0.12}px)`;
  }

  if (heroText) {
    heroText.style.transform = `translateY(${currentY * 0.05}px)`;
  }

  floatingTags.forEach((tag, i) => {
    const speed = 0.06 + i * 0.04;
    tag.style.transform = `translateY(${currentY * speed}px)`;
  });

  sectionHeadings.forEach(heading => {
    const rect = heading.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    heading.style.transform = `translateY(${centerOffset * -0.04}px)`;
  });

  requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", () => {
  targetY = window.scrollY;
}, { passive: true });

updateParallax();

console.log("✨ Aayush Marasini's portfolio is ready!");   