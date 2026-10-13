const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  nav?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

document.querySelectorAll("[data-project-showcase]").forEach((showcase) => {
  const tabs = [...showcase.querySelectorAll('[role="tab"]')];

  const selectTab = (nextTab, moveFocus = false) => {
    tabs.forEach((tab) => {
      const isSelected = tab === nextTab;
      const panel = showcase.querySelector(`#${tab.getAttribute("aria-controls")}`);
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      if (panel) panel.hidden = !isSelected;
    });
    if (moveFocus) nextTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });
});

const lightbox = document.querySelector("[data-image-lightbox]");
const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");
let lightboxOpener;

document.querySelectorAll("[data-lightbox-src]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxOpener = trigger;
    lightboxImage.src = trigger.dataset.lightboxSrc;
    lightboxImage.alt = trigger.dataset.lightboxAlt || "";
    lightboxCaption.textContent = trigger.dataset.lightboxCaption || "";
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  lightboxImage?.removeAttribute("src");
  lightboxOpener?.focus();
});
