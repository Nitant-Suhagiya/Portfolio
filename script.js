(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const year = document.getElementById("year");
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  const backdrop = document.getElementById("nav-backdrop");

  const sectionIds = [
    "experience",
    "projects",
    "research",
    "education",
    "certificates",
    "skills",
  ];
  const headerLinks = [...document.querySelectorAll(".nav-link")];

  if (year) year.textContent = String(new Date().getFullYear());

  toggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    document.body.classList.toggle("nav-open", open);
    nav.classList.toggle("is-open", open);
    if (mobile) nav.toggleAttribute("inert", !open);
    else nav.removeAttribute("inert");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) backdrop.hidden = !open;
  }

  // Start collapsed for assistive tech on small screens
  if (window.matchMedia("(max-width: 900px)").matches) {
    nav?.setAttribute("inert", "");
  }

  navToggle?.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  backdrop?.addEventListener("click", () => setNavOpen(false));

  for (const link of headerLinks) {
    link.addEventListener("click", () => setNavOpen(false));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });

  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setNavOpen(false);
  });

  function setActive(id) {
    for (const link of headerLinks) {
      const href = link.getAttribute("href") || "";
      const on = href === `#${id}` || href.endsWith(`#${id}`);
      link.classList.toggle("active", on);
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  // Skip scroll-spy on pages without section anchors (e.g. contact.html)
  if (!document.getElementById(sectionIds[0])) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        let target = null;
        if (visible.length) {
          target = visible.reduce((a, b) =>
            b.intersectionRatio > a.intersectionRatio ? b : a
          );
        } else if (entries.length) {
          target = entries.reduce((a, b) =>
            Math.abs(b.boundingClientRect.top) <
            Math.abs(a.boundingClientRect.top)
              ? b
              : a
          );
        }
        if (target?.target?.id) setActive(target.target.id);
      },
      {
        rootMargin: "-20% 0px -75% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
  }
})();
