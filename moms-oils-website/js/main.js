// Mom's Oils — shared site behaviour
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "918887935854"; // international format, no + or spaces
  var UPI_ID = "momsnatural@nyes";
  var PRICE = 359;
  var MRP = 749;
  var PRODUCT = "Mom's Oils — Home Made Hair Oil (100ml)";

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(
    "main section > .wrap > *, " +
    ".ingredients-grid > *, .benefits-row > *, .how-it-works ol > *, " +
    ".faq-list > *, .trust-strip > *, .product-actions > *"
  );
  if (revealTargets.length) {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

      revealTargets.forEach(function (target, index) {
        target.classList.add("reveal");
        target.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 70 + "ms");
        revealObserver.observe(target);
      });
    } else {
      revealTargets.forEach(function (target) {
        target.classList.add("is-visible");
      });
    }
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var open = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Copy UPI ID ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var restore = btn.textContent;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.textContent = restore;
          }, 1600);
        })
        .catch(function () {
          window.prompt("Copy your UPI ID:", text);
        });
    });
  });

  /* ---------- Product image gallery ---------- */
  var thumbsWrap = document.getElementById("product-thumbs");
  var mainImage = document.getElementById("main-product-image");
  if (thumbsWrap && mainImage) {
    thumbsWrap.querySelectorAll("button[data-image]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        mainImage.src = btn.getAttribute("data-image");
        thumbsWrap.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
    });
  }

  /* ---------- Order form ---------- */
  var form = document.getElementById("order-form");
  if (!form) return;

  var qtyInput = document.getElementById("qty");
  var totalEl = document.getElementById("summary-total");
  var qtyLineEl = document.getElementById("summary-qty");

  function currency(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  function updateSummary() {
    var qty = parseInt(qtyInput.value, 10) || 1;
    if (qtyLineEl) qtyLineEl.textContent = qty + " \u00D7 100ml bottle";
    if (totalEl) totalEl.textContent = currency(PRICE * qty);
  }
  if (qtyInput) {
    qtyInput.addEventListener("input", updateSummary);
    updateSummary();
  }

  function showError(field, message) {
    field.classList.add("invalid");
    var err = field.querySelector(".field-error");
    if (err) err.textContent = message;
  }
  function clearError(field) {
    field.classList.remove("invalid");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = {
      name: document.getElementById("name"),
      phone: document.getElementById("phone"),
      address: document.getElementById("address"),
      city: document.getElementById("city"),
      state: document.getElementById("state"),
      pincode: document.getElementById("pincode"),
    };

    var valid = true;

    Object.keys(fields).forEach(function (key) {
      var input = fields[key];
      var field = input.closest(".field");
      clearError(field);
      if (!input.value.trim()) {
        showError(field, "This field is required.");
        valid = false;
      }
    });

    var phoneVal = fields.phone.value.trim().replace(/\s|-/g, "");
    if (phoneVal && !/^[6-9]\d{9}$/.test(phoneVal)) {
      showError(fields.phone.closest(".field"), "Enter a valid 10-digit mobile number.");
      valid = false;
    }
    var pinVal = fields.pincode.value.trim();
    if (pinVal && !/^\d{6}$/.test(pinVal)) {
      showError(fields.pincode.closest(".field"), "Enter a valid 6-digit pincode.");
      valid = false;
    }

    if (!valid) {
      var firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var qty = parseInt(qtyInput.value, 10) || 1;
    var total = PRICE * qty;
    var landmark = document.getElementById("landmark").value.trim();

    var lines = [
      "Hi Mom's Oils, I'd like to place an order \uD83C\uDF3F",
      "",
      "Product: " + PRODUCT,
      "Quantity: " + qty,
      "Total: " + currency(total) + " (MRP " + currency(MRP * qty) + ")",
      "",
      "Name: " + fields.name.value.trim(),
      "Phone: " + phoneVal,
      "Address: " + fields.address.value.trim(),
      landmark ? "Landmark: " + landmark : null,
      "City: " + fields.city.value.trim(),
      "State: " + fields.state.value.trim(),
      "Pincode: " + pinVal,
      "",
      "Payment: I'll pay " + currency(total) + " via UPI to " + UPI_ID + " and share the screenshot here.",
    ].filter(Boolean);

    var message = encodeURIComponent(lines.join("\n"));
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message;

    var successBox = document.getElementById("form-success");
    if (successBox) {
      successBox.classList.add("show");
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    window.open(url, "_blank");
  });
})();
