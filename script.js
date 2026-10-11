
// ==================================
// ANV PUBLIC SCHOOL - JAVASCRIPT
// ==================================

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("schoolIntro");
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const admissionForm = document.getElementById("admissionForm");
  const formMessage = document.getElementById("formMessage");
  const yearElement = document.getElementById("currentYear");

  // Current year in footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Animated logo intro
  document.body.classList.add("intro-active");

  const finishIntro = () => {
    if (!intro || intro.classList.contains("intro-finished")) return;

    intro.classList.add("intro-finished");
    document.body.classList.remove("intro-active");

    window.setTimeout(() => {
      intro.remove();
    }, 900);
  };

  if (intro) {
    // Skip intro if user prefers reduced motion
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      finishIntro();
    } else {
      window.setTimeout(finishIntro, 2800);
    }

    // Tapping the intro skips the animation
    intro.addEventListener("click", finishIntro);
  }

  // Mobile navigation
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    // Close menu after selecting a section
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    // Close menu with Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal sections while scrolling
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Basic admission form validation
  // This demo does NOT send data to the school.
  if (admissionForm && formMessage) {
    admissionForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!admissionForm.reportValidity()) return;

      const studentName = document
        .getElementById("studentName")
        .value.trim();

      const parentName = document
        .getElementById("parentName")
        .value.trim();

      const className = document
        .getElementById("classSelect")
        .value;

      const phone = document
        .getElementById("phoneNumber")
        .value.trim();

      if (!studentName || !parentName || !className) {
        formMessage.textContent = "कृपया सभी जरूरी जानकारी भरें।";
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        formMessage.textContent =
          "कृपया 10 अंकों का सही मोबाइल नंबर भरें।";
        return;
      }

      formMessage.textContent =
        "जानकारी सही है। यह demo form है; जानकारी स्कूल को नहीं भेजी गई। " +
        "कृपया स्कूल से संपर्क करके प्रवेश की पुष्टि करें।";
    });
  }

  // Smooth scrolling for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });

        // Keep the URL aligned with the selected section
        history.replaceState(null, "", targetId);
      }
    });
  });

  // Report missing logo files during testing
  document.querySelectorAll('img[src="logo.png"]').forEach((logo) => {
    logo.addEventListener("error", () => {
      console.warn(
        "School logo not found. Upload a file named logo.png to the repository root."
      );
    });
  });
});
