(function () {
  "use strict";

  /* ---------- Theme toggle (with persistence + system preference) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var stored = localStorage.getItem("np-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("np-theme", next);
  });

  /* ---------- Mobile navigation ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navMobile = document.getElementById("navMobile");

  function closeMenu() {
    navMobile.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = navMobile.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMobile.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var start = 0;
    var duration = 1600;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString("en-IN") + (target >= 1000 ? "+" : "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      lightboxImg.src = item.getAttribute("data-src");
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Forms ---------- */
  function handleForm(formId, noteId, successMsg) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.style.color = "#ef4444";
        note.textContent = "Please fill in the required fields correctly.";
        form.reportValidity();
        return;
      }
      note.style.color = "";
      note.textContent = successMsg;
      if (formId === "volunteerForm") {
        const vName = document.getElementById("vName").value;
        const vEmail = document.getElementById("vEmail").value;
        const vMsg = document.getElementById("vMsg").value;
        const vInterest = document.getElementById("vInterest").value;
        const userVolunteerDetails = {
          name: vName, email: vEmail, message: vMsg, intrest: vInterest
        }
        localStorage.setItem(formId, JSON.stringify(userVolunteerDetails));
      } else {
        const cName = document.getElementById("cName").value;
        const cEmail = document.getElementById("cEmail").value;
        const cMsg = document.getElementById("cMsg").value;
        const userContactDetails = {
          name: cName, email: cEmail, message: cMsg
        }
        localStorage.setItem(formId, JSON.stringify(userContactDetails));
      }
      form.reset();
      setTimeout(function () { note.textContent = ""; }, 5000);
    });
  }
  handleForm("volunteerForm", "volunteerNote", "Thank you! We'll be in touch soon.");
  handleForm("contactForm", "contactNote", "Message sent! We'll reply shortly.");

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
