(function () {
  var C = window.DENCRIB || {};
  var WA = "https://wa.me/" + (C.whatsapp || "254795195136");

  function waLink(text) { return WA + "?text=" + encodeURIComponent(text); }

  // WhatsApp links: <a data-wa="message">
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
  });

  // Links that come from config: <a data-config-href="testimonialFormUrl">
  document.querySelectorAll("[data-config-href]").forEach(function (a) {
    var v = C[a.getAttribute("data-config-href")];
    if (v) { a.href = v; }
  });

  // M-Pesa payment details
  var m = C.mpesa || {};
  var shown = document.querySelector("[data-pay]");
  var missing = document.querySelector("[data-pay-missing]");
  if (shown && missing) {
    if (m.number) {
      shown.textContent = m.type === "paybill"
        ? "Paybill: " + m.number + (m.account ? "  |  Account: " + m.account : "")
        : "Till number: " + m.number;
      missing.hidden = true;
    } else {
      shown.hidden = true;
    }
  }

  // Forms: Formspree if configured, otherwise WhatsApp with the message pre-filled
  document.querySelectorAll("form.js-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    function say(msg, cls) { status.textContent = msg; status.className = "form-status " + (cls || ""); }

    form.addEventListener("reset", function () { say("", ""); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp").value) { return; }            // spam trap
      if (!form.checkValidity()) {
        form.reportValidity();
        say("Please fill in the required fields.", "err");
        return;
      }
      var data = new FormData(form);
      var subject = form.getAttribute("data-subject") || "New message";

      if (C.formspreeId) {
        data.append("_subject", subject);
        say("Sending...", "");
        fetch("https://formspree.io/f/" + C.formspreeId, {
          method: "POST", body: data, headers: { Accept: "application/json" }
        }).then(function (r) {
          if (r.ok) { form.reset(); say("Thank you! We have received your message and will contact you soon.", "ok"); }
          else { say("Sorry, that did not send. Please call or WhatsApp us instead.", "err"); }
        }).catch(function () {
          say("Network problem. Please try again, or call or WhatsApp us.", "err");
        });
      } else {
        var lines = [subject];
        data.forEach(function (v, k) {
          if (k !== "_gotcha" && v) { lines.push(k.replace("_", " ") + ": " + v); }
        });
        window.open(waLink(lines.join("\n")), "_blank", "noopener");
        say("Opening WhatsApp so you can send your details to us.", "ok");
      }
    });
  });

  // Video modal: buttons with data-video
  var modal = document.getElementById("videoModal");
  if (modal && window.jQuery) {
    var vid = document.getElementById("modalVideo");
    var title = document.getElementById("videoModalTitle");
    window.jQuery(document).on("click", "[data-video]", function (e) {
      e.preventDefault();
      var b = this;
      vid.src = b.getAttribute("data-video");
      title.textContent = b.getAttribute("data-title") || "Video";
      window.jQuery(modal).modal("show");
      vid.play && vid.play().catch(function () {});
    });
    window.jQuery(modal).on("hidden.bs.modal", function () { vid.pause(); vid.removeAttribute("src"); vid.load(); });
  }
})();