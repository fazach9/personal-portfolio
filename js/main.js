document.addEventListener("DOMContentLoaded", () => {
  const config = window.PORTFOLIO_CONFIG || {};
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-social]").forEach(link => {
    const key = link.dataset.social;
    if (config[key] && !config[key].includes("YOUR_")) {
      link.href = config[key];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.hidden = true; // URL belum diisi di config.js: sembunyikan, jangan tampilkan tautan mati
    }
  });

  document.querySelectorAll("[data-repo]").forEach(link => {
    const key = link.dataset.repo;
    const url = config.repositories?.[key];
    if (url && !url.includes("YOUR_")) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.hidden = true; // URL belum diisi di config.js: sembunyikan, jangan tampilkan tautan mati
    }
  });

  document.querySelectorAll("[data-cred]").forEach(link => {
    const url = config.credentials?.[link.dataset.cred];
    if (url && !url.includes("YOUR_")) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.hidden = true; // URL verifikasi belum diisi di config.js
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
