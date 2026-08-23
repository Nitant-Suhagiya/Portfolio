(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const year = document.getElementById("year");

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

  function setActive(id) {
    for (const link of headerLinks) {
      const on = link.getAttribute("href") === `#${id}`;
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
