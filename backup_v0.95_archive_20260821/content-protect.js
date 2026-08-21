(function () {
  "use strict";

  var MESSAGE = "DawnQT Intelligence Hub의 콘텐츠는 저작권 보호를 받습니다.";
  var toastEl = null;
  var toastTimer = null;
  var lastToastAt = 0;

  function isEditableTarget(target) {
    if (!target) return false;
    var node = target.nodeType === 1 ? target : target.parentElement;
    if (!node || typeof node.closest !== "function") return false;
    return Boolean(
      node.closest(
        "input, textarea, select, [contenteditable='true'], [contenteditable='plaintext-only'], [contenteditable=''], pre, code, kbd, samp"
      )
    );
  }

  function showToast() {
    var now = Date.now();
    if (now - lastToastAt < 400) return;
    lastToastAt = now;

    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "dq-protect-toast";
      toastEl.className = "dq-protect-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      (document.body || document.documentElement).appendChild(toastEl);
    }

    toastEl.textContent = MESSAGE;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2800);
  }

  document.addEventListener(
    "contextmenu",
    function (event) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    },
    true
  );

  document.addEventListener(
    "copy",
    function (event) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      if (event.clipboardData) event.clipboardData.setData("text/plain", "");
      showToast();
    },
    true
  );

  document.addEventListener(
    "cut",
    function (event) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      showToast();
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (event) {
      var key = event.key || "";
      var code = event.code || "";
      var ctrl = event.ctrlKey || event.metaKey;

      if (key === "F12" || code === "F12") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (ctrl && event.shiftKey && (key === "I" || key === "i" || code === "KeyI")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (ctrl && !event.shiftKey && !event.altKey && (key === "u" || key === "U" || code === "KeyU")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (ctrl && !event.shiftKey && !event.altKey && (key === "c" || key === "C" || code === "KeyC")) {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
        showToast();
      }
    },
    true
  );
})();
