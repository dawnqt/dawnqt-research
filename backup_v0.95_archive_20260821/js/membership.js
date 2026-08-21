(function () {
  "use strict";

  var GATE_COPY =
    "DawnQT Intelligence Hub 멤버십 전용 강의입니다. 이메일 구독 시 순차적으로 열람 권한이 제공됩니다.";
  var BEEHIIV_FORM_ID = "15d4100b-6bf4-472b-8f5c-3fd88042d863";
  var BEEHIIV_LOADER = "https://subscribe-forms.beehiiv.com/v3/loader.js";

  var modal = null;
  var dialog = null;
  var lastFocus = null;

  function assetUrl(file) {
    var script = document.querySelector('script[src*="membership.js"]');
    var src = script ? script.getAttribute("src") : "js/membership.js";
    return src.replace(/js\/membership\.js(?:\?.*)?$/, file);
  }

  function ensureStyles() {
    if (!document.querySelector('link[href*="membership.css"]')) {
      var memberLink = document.createElement("link");
      memberLink.rel = "stylesheet";
      memberLink.href = assetUrl("css/membership.css");
      document.head.appendChild(memberLink);
    }
    if (!document.querySelector('link[href*="beehiiv.css"]')) {
      var beeLink = document.createElement("link");
      beeLink.rel = "stylesheet";
      beeLink.href = assetUrl("css/beehiiv.css");
      document.head.appendChild(beeLink);
    }
  }

  function modalMarkup() {
    return (
      '<div class="member-modal-backdrop" data-member-close></div>' +
      '<div class="member-modal-card member-modal-card--beehiiv" role="dialog" aria-modal="true" aria-labelledby="member-gate-title" tabindex="-1">' +
      '  <button type="button" class="member-modal-x" data-member-close aria-label="닫기">×</button>' +
      '  <p class="member-modal-kicker">Subscribe</p>' +
      '  <h2 id="member-gate-title">뉴스레터 구독</h2>' +
      '  <p class="member-modal-copy">' +
      GATE_COPY +
      "</p>" +
      '  <div class="beehiiv-embed-wrap beehiiv-embed-wrap--modal" data-beehiiv-mount></div>' +
      "</div>"
    );
  }

  function mountBeehiiv(container) {
    if (!container || container.getAttribute("data-beehiiv-ready") === "1") return;
    container.setAttribute("data-beehiiv-ready", "1");
    var script = document.createElement("script");
    script.async = true;
    script.src = BEEHIIV_LOADER;
    script.setAttribute("data-beehiiv-form", BEEHIIV_FORM_ID);
    container.appendChild(script);
  }

  function ensureModal() {
    modal = document.getElementById("member-gate-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "member-gate-modal";
      modal.className = "member-modal";
      modal.hidden = true;
      document.body.appendChild(modal);
    }
    modal.innerHTML = modalMarkup();
    dialog = modal.querySelector(".member-modal-card");
    if (!document.getElementById("subscribe")) {
      mountBeehiiv(modal.querySelector("[data-beehiiv-mount]"));
    }
  }

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("member-modal-open");
    window.setTimeout(function () {
      if (dialog) dialog.focus();
    }, 30);
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("member-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function onKeydown(event) {
    if (!modal || modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab" || !dialog) return;
    var focusable = dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea, select, iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function init() {
    ensureStyles();
    ensureModal();

    document.addEventListener("click", function (event) {
      var closeBtn = event.target.closest("[data-member-close]");
      if (closeBtn) {
        event.preventDefault();
        closeModal();
        return;
      }

      var gate = event.target.closest("[data-member-gate], [data-member-open], .js-subscribe");
      if (!gate) return;
      if (gate.closest("#member-gate-modal")) return;
      if (gate.getAttribute("href") && /#subscribe/.test(gate.getAttribute("href"))) return;
      event.preventDefault();
      openModal();
    });

    document.addEventListener("keydown", onKeydown);

    if (document.body.hasAttribute("data-member-auto-open")) {
      window.setTimeout(function () {
        openModal();
      }, 80);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
