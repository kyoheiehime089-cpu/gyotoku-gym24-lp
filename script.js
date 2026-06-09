const LINE_URL = "https://lin.ee/o5cQkJn";

const getLineUrlWithUtm = () => {
  const currentParams = new URLSearchParams(window.location.search);
  const target = new URL(LINE_URL, window.location.href);

  currentParams.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) {
      target.searchParams.set(key, value);
    }
  });

  return target.toString();
};

const applyLineLinks = () => {
  const lineUrl = getLineUrlWithUtm();
  document.querySelectorAll("[data-line-cta]").forEach((link) => {
    link.setAttribute("href", lineUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
};

const setupHeader = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
};

const setupReveal = () => {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
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
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
};

const setupFaq = () => {
  const items = document.querySelectorAll(".faq-list details");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
};

const setupFloatingCta = () => {
  const floatingCta = document.querySelector(".floating-cta");
  const hero = document.querySelector(".hero");
  if (!floatingCta || !hero) return;

  const toggle = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    floatingCta.classList.toggle("is-hidden", heroBottom > 120);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
};

applyLineLinks();
setupHeader();
setupReveal();
setupFaq();
setupFloatingCta();
