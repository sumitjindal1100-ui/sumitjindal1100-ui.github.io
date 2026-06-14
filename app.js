/* ============================================================
   Sumit Jindal — portfolio interactions
   Plain JS, no framework, no build step.
   ============================================================ */
(function () {
  "use strict";

  /* ---- theme ---- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeBtn");
  var themeIcon = document.getElementById("themeIcon");
  var sun = "<circle cx='12' cy='12' r='4'/><path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/>";
  var moon = "<path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'/>";

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    themeIcon.innerHTML = t === "dark" ? moon : sun;
    try { localStorage.setItem("sj-theme", t); } catch (e) {}
  }
  var saved;
  try { saved = localStorage.getItem("sj-theme"); } catch (e) {}
  if (!saved) saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(saved);
  themeBtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---- nav: scrolled state + mobile toggle ---- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  navToggle.addEventListener("click", function () { nav.classList.toggle("open"); });
  document.querySelectorAll("#navLinks a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("open"); });
  });

  /* ---- rotating role line ---- */
  var roles = ["Business Analyst", "Systems Analyst", "Data Analyst", "process problem-solver"];
  var el = document.getElementById("typed");
  var ri = 0, ci = 0, deleting = false;
  function tick() {
    var word = roles[ri];
    if (!deleting) {
      ci++;
      if (ci > word.length) { deleting = true; setTimeout(tick, 1500); return; }
    } else {
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    el.textContent = word.slice(0, ci);
    setTimeout(tick, deleting ? 45 : 80);
  }
  if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(tick, 900);
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        // animate skill bars inside a revealed group
        en.target.querySelectorAll(".bar > i").forEach(function (bar) {
          bar.style.width = (bar.getAttribute("data-w") || 0) + "%";
        });
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });

  /* ---- fallback tiles: inject glyph ---- */
  document.querySelectorAll(".shot.fallback[data-glyph]").forEach(function (s) {
    if (!s.querySelector(".glyph")) {
      var g = document.createElement("span");
      g.className = "glyph";
      g.innerHTML = s.getAttribute("data-glyph");
      s.appendChild(g);
    }
  });

  /* ---- screenshot fallback: if an image 404s, show a clean tile ---- */
  document.querySelectorAll(".shot img").forEach(function (img) {
    img.addEventListener("error", function () {
      var shot = img.closest(".shot");
      img.remove();
      shot.classList.add("fallback");
      if (!shot.querySelector(".glyph")) {
        var g = document.createElement("span");
        g.className = "glyph";
        g.textContent = "■";
        shot.appendChild(g);
      }
    });
  });

  /* ---- project filter ---- */
  var filterbar = document.getElementById("filterbar");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#projects .card"));
  filterbar.addEventListener("click", function (e) {
    var b = e.target.closest(".filter");
    if (!b) return;
    filterbar.querySelectorAll(".filter").forEach(function (x) { x.classList.remove("active"); });
    b.classList.add("active");
    var f = b.getAttribute("data-f");
    cards.forEach(function (c) {
      var match = f === "all" || (c.getAttribute("data-tags") || "").indexOf(f) !== -1;
      c.classList.toggle("hide", !match);
    });
  });

  /* ---- active nav link + nav shadow + back to top ---- */
  var sections = ["about", "work", "skills", "contact"].map(function (id) { return document.getElementById(id); });
  var links = {};
  document.querySelectorAll("#navLinks a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 8);
    toTop.classList.toggle("show", y > 600);
    var cur = "";
    sections.forEach(function (s) { if (s && s.getBoundingClientRect().top < 140) cur = s.id; });
    Object.keys(links).forEach(function (k) {
      links[k].style.color = k === cur ? "var(--ink)" : "";
      links[k].style.background = k === cur ? "var(--paper-3)" : "";
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---- year ---- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
