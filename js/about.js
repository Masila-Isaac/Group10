(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* typing line */
  var el = document.querySelector(".ab-typed");
  if (el && !reduce) {
    var phrases = JSON.parse(el.getAttribute("data-phrases")), p = 0, i = 0, del = false;
    (function tick() {
      var full = phrases[p];
      el.textContent = full.slice(0, i);
      if (!del && i === full.length) { del = true; return setTimeout(tick, 1600); }
      if (del && i === 0) { del = false; p = (p + 1) % phrases.length; return setTimeout(tick, 350); }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 70);
    })();
  }

  /* scroll reveal + counters */
  var items = document.querySelectorAll(".reveal");
  function count(node) {
    var end = parseInt(node.getAttribute("data-count"), 10), n = 0;
    if (reduce || !end) { node.textContent = end; return; }
    var step = Math.max(1, Math.round(end / 30));
    var t = setInterval(function () { n += step; if (n >= end) { n = end; clearInterval(t); } node.textContent = n; }, 40);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add("in"); n.querySelectorAll("[data-count]").forEach(count); });
  }

  /* flip cards: tap / Enter / Space (hover also works on desktop) */
  document.querySelectorAll(".ab-flip").forEach(function (b) {
    b.addEventListener("click", function () {
      var on = b.classList.toggle("is-flipped");
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });

  /* goal picker */
  var C = window.DENCRIB || {};
  var wa = "https://wa.me/" + (C.whatsapp || "254795195136");
  var goals = {
    weight: { t: "Weight-loss programme", d: "A structured programme built around your goal, with guidance from our team.", href: "class.html#contact", cta: "Ask about it" },
    muscle: { t: "Strength and Conditioning", d: "Build muscle and endurance with our trainers pushing you to do your best.", href: "class.html", cta: "See services" },
    fun:    { t: "Fitness Classes", d: "High-energy group sessions for all levels, a great way to stay motivated.", href: "class.html", cta: "See services" },
    focus:  { t: "Personal Training", d: "One-on-one sessions with a trainer, tailored to you.", href: "class.html#contact", cta: "Book a trial" },
    cardio: { t: "Cardio Equipment and Training", d: "Build stamina on our cardio machines, with training support if you want it.", href: "class.html", cta: "See services" }
  };
  var out = document.getElementById("abResult");
  document.querySelectorAll(".ab-goal").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".ab-goal").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var g = goals[b.getAttribute("data-goal")];
      out.innerHTML = "";
      var box = document.createElement("div"); box.className = "res";
      var h = document.createElement("h3"); h.textContent = "Try: " + g.t;
      var pp = document.createElement("p"); pp.textContent = g.d;
      var a1 = document.createElement("a"); a1.className = "ab-btn"; a1.href = g.href; a1.textContent = g.cta;
      var a2 = document.createElement("a"); a2.className = "ab-btn ghost"; a2.target = "_blank"; a2.rel = "noopener noreferrer";
      a2.href = wa + "?text=" + encodeURIComponent("Hello DENCRIB GYM STAR, I am interested in: " + g.t);
      a2.textContent = "Chat on WhatsApp";
      box.appendChild(h); box.appendChild(pp); box.appendChild(a1); box.appendChild(a2);
      out.appendChild(box);
    });
  });
})();