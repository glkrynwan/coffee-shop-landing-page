/* =========================================================
   Kopi Senja — Coffee Shop Landing Page
   Vanilla JS: mobile nav, navbar scroll state, active link
   tracking, and scroll reveal animation.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  initMobileNav();
  initNavbarScrollState();
  initActiveNavLink();
  initScrollReveal(prefersReducedMotion);
});

/**
 * Toggles the mobile hamburger menu and closes it when a link is
 * tapped or the user clicks outside the menu.
 */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = toggle.contains(event.target) || menu.contains(event.target);
    if (!clickedInsideNav && menu.classList.contains("is-open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

/**
 * Adds a solid background to the navbar once the page has been
 * scrolled past the hero's transparent zone.
 */
function initNavbarScrollState() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const SCROLL_THRESHOLD = 24;

  const updateNavbarState = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  };

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });
}

/**
 * Highlights the nav link that matches the section currently
 * in view using IntersectionObserver.
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isMatch);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Fades and slides elements with the .reveal class into place as
 * they enter the viewport. Skips the animation entirely (shows
 * content immediately) if the user prefers reduced motion.
 */
function initScrollReveal(prefersReducedMotion) {
  const revealEls = document.querySelectorAll(".reveal");

  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}
