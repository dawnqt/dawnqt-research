(function () {
  "use strict";

  var STORAGE_KEY = "dawnqt-lang";
  var PAGE_LANG = "ko";
  var DEFAULT_LANG = "en";

  var LANGS = [
    { code: "en", short: "EN", label: "English" },
    { code: "ko", short: "KO", label: "한국어" },
    { code: "zh-CN", short: "ZH", label: "简体中文" },
    { code: "ja", short: "JA", label: "日本語" },
    { code: "hi", short: "HI", label: "हिन्दी" },
    { code: "pt", short: "PT", label: "Português (Brasil)" }
  ];

  var LANG_MAP = LANGS.reduce(function (acc, lang) {
    acc[lang.code] = lang;
    return acc;
  }, {});

  var I18N = {
    "academy.catchphrase": {
      en: "Simply reading and listening to this course builds disciplined trading habits and clear standards.",
      ko: "이 과정을 읽고 듣는 것만으로도 올바른 매매 습관과 명확한 기준이 형성됩니다.",
      "zh-CN": "只需阅读和收听本课程，就能养成良好的交易习惯与清晰的标准。",
      ja: "この講座を読んで聞くだけで、良いトレード習慣と明確な基準が身につきます。",
      hi: "इस कोर्स को पढ़ने और सुनने मात्र से मज़बूत ट्रेडिंग आदतें और स्पष्ट मानक बनते हैं।",
      pt: "Só de ler e ouvir este curso já se formam bons hábitos de trading e critérios claros."
    }
  };

  function applyI18n(lang) {
    if (!LANG_MAP[lang]) lang = DEFAULT_LANG;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var pack = I18N[key];
      if (!pack) return;
      el.textContent = pack[lang] || pack[DEFAULT_LANG] || el.textContent;
    });
  }

  function getPreferredLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANG_MAP[saved]) return saved;
    } catch (err) {}
    return DEFAULT_LANG;
  }

  function saveLang(code) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (err) {}
  }

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function writeCookie(name, value, extra) {
    var base = name + "=" + value + "; path=/" + (extra ? "; " + extra : "");
    document.cookie = base;
    if (location.hostname && location.hostname !== "localhost") {
      document.cookie = base + "; domain=" + location.hostname;
      document.cookie = base + "; domain=." + location.hostname;
    }
  }

  function cookieTargetLang() {
    var raw = readCookie("googtrans");
    if (!raw) return "";
    var parts = raw.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  }

  function setTranslateCookie(lang) {
    if (lang === PAGE_LANG) {
      writeCookie("googtrans", "", "expires=Thu, 01 Jan 1970 00:00:00 GMT");
      return;
    }
    writeCookie("googtrans", "/" + PAGE_LANG + "/" + lang);
  }

  function canUseCookie() {
    return location.protocol !== "file:";
  }

  function injectStyles() {
    if (document.getElementById("lang-switcher-style")) return;
    var style = document.createElement("style");
    style.id = "lang-switcher-style";
    style.textContent = [
      "#google_translate_element,.skiptranslate,.goog-te-banner-frame,.goog-te-gadget,.goog-logo-link,.goog-te-balloon-frame,#goog-gt-tt,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-aZ2wEe-wOHMyf{display:none!important;visibility:hidden!important;height:0!important}",
      "body{top:0!important}",
      "font{background:transparent!important;box-shadow:none!important}",
      ".goog-text-highlight{background:none!important;box-shadow:none!important}",
      "header{overflow:visible!important;z-index:9999!important}",
      ".lang-switcher-cluster{display:flex;align-items:center;gap:.75rem;flex-shrink:0;position:relative;z-index:9999}",
      ".lang-switcher{position:relative;z-index:9999;flex-shrink:0;display:block}",
      ".lang-switcher-select{display:block!important;appearance:none;-webkit-appearance:none;-moz-appearance:none;height:2.25rem;min-width:10rem;max-width:12.5rem;padding:0 2rem 0 .75rem;border:1px solid #38bdf8!important;border-radius:.5rem;background-color:#1e293b!important;color:#ffffff!important;font-size:12px;font-weight:600;letter-spacing:.02em;font-family:Inter,system-ui,sans-serif;cursor:pointer;position:relative;z-index:9999!important;color-scheme:dark;line-height:2.25rem;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5L6 8l3.5-3.5' fill='none' stroke='%2338bdf8' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right .6rem center;background-size:12px}",
      ".lang-switcher-select:hover,.lang-switcher-select:focus{outline:none;border-color:#7dd3fc;box-shadow:0 0 0 3px rgba(56,189,248,.2)}",
      ".lang-switcher-select option{background:#1e293b;color:#ffffff}",
      "@media (max-width:640px){.lang-switcher-select{min-width:7.25rem;max-width:9.5rem;font-size:11px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function currentLangMeta() {
    return LANG_MAP[getPreferredLang()] || LANGS[0];
  }

  function updateActiveState(root) {
    var current = getPreferredLang();
    var select = root.querySelector(".lang-switcher-select");
    if (select && select.value !== current) select.value = current;
  }

  function triggerGoogleCombo(lang) {
    var combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    if (combo.value !== lang) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
    return true;
  }

  function applyLanguage(lang, options) {
    options = options || {};
    if (!LANG_MAP[lang]) lang = DEFAULT_LANG;

    var previous = getPreferredLang();
    var wasTranslated = previous !== PAGE_LANG || (!!cookieTargetLang() && cookieTargetLang() !== PAGE_LANG);

    saveLang(lang);
    setTranslateCookie(lang);
    document.querySelectorAll(".lang-switcher").forEach(updateActiveState);
    applyI18n(lang);

    if (lang === PAGE_LANG) {
      if (wasTranslated && canUseCookie() && options.reload !== false) {
        location.reload();
        return;
      }
      triggerGoogleCombo(PAGE_LANG);
      return;
    }

    if (triggerGoogleCombo(lang)) return;

    if (canUseCookie() && options.reload !== false) {
      location.reload();
    }
  }

  function buildSwitcher() {
    var current = currentLangMeta();
    var root = document.createElement("div");
    root.className = "lang-switcher notranslate";
    root.id = "lang-switcher";
    root.setAttribute("translate", "no");

    var select = document.createElement("select");
    select.className = "lang-switcher-select notranslate";
    select.setAttribute("aria-label", "Language");
    select.setAttribute("translate", "no");

    LANGS.forEach(function (lang) {
      var option = document.createElement("option");
      option.value = lang.code;
      option.textContent = lang.label;
      if (lang.code === current.code) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      applyLanguage(select.value);
    });

    root.appendChild(select);
    return root;
  }

  function findHeaderInner() {
    var header = document.querySelector("header");
    if (!header) return null;
    return header.querySelector("div.max-w-7xl") || header.querySelector("div") || header;
  }

  function findRightCta(headerInner) {
    var nodes = headerInner.querySelectorAll("button, a");
    var i;
    var el;
    var text;
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el.closest("nav")) continue;
      text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/subscribe/i.test(text)) return el;
    }
    var last = headerInner.lastElementChild;
    if (!last || last.matches("nav")) return null;
    return last;
  }

  function ensureCluster(cta, headerInner) {
    var parent = cta.parentElement;
    if (parent && parent !== headerInner && parent.classList.contains("lang-switcher-cluster")) {
      return parent;
    }
    var wrap = document.createElement("div");
    wrap.className = "lang-switcher-cluster";
    if (parent) parent.insertBefore(wrap, cta);
    else headerInner.appendChild(wrap);
    wrap.appendChild(cta);
    return wrap;
  }

  function bindSelect(root) {
    var select = root.querySelector(".lang-switcher-select");
    if (!select || select.getAttribute("data-bound") === "1") return;
    select.setAttribute("data-bound", "1");
    select.addEventListener("change", function () {
      applyLanguage(select.value);
    });
    updateActiveState(root);
  }

  function mountSwitcher() {
    var existing = document.getElementById("lang-switcher");
    if (existing) {
      bindSelect(existing);
      return;
    }
    var headerInner = findHeaderInner();
    if (!headerInner) return;

    var switcher = buildSwitcher();
    var cta = findRightCta(headerInner);
    if (cta) {
      ensureCluster(cta, headerInner).insertBefore(switcher, cta);
      return;
    }
    headerInner.appendChild(switcher);
  }

  function hideGoogleChrome() {
    document.body.style.top = "0px";
    document.querySelectorAll("iframe.skiptranslate, .goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd").forEach(function (el) {
      el.style.display = "none";
    });
  }

  function ensureHiddenWidget() {
    if (document.getElementById("google_translate_element")) return;
    var holder = document.createElement("div");
    holder.id = "google_translate_element";
    holder.setAttribute("aria-hidden", "true");
    document.body.appendChild(holder);
  }

  function loadGoogleTranslate() {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = function () {
      if (!window.google || !google.translate || !google.translate.TranslateElement) return;
      new google.translate.TranslateElement({
        pageLanguage: PAGE_LANG,
        includedLanguages: LANGS.map(function (lang) { return lang.code; }).join(","),
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, "google_translate_element");

      var lang = getPreferredLang();
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        hideGoogleChrome();
        if (triggerGoogleCombo(lang) || tries > 25) clearInterval(timer);
      }, 200);
    };

    var script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }

  function syncCookieOnBoot() {
    var lang = getPreferredLang();
    saveLang(lang);
    if (!canUseCookie()) return true;

    var current = cookieTargetLang();
    if (lang === PAGE_LANG) {
      if (current && current !== PAGE_LANG) {
        setTranslateCookie(PAGE_LANG);
        location.reload();
        return false;
      }
      return true;
    }

    if (current !== lang) {
      setTranslateCookie(lang);
      location.reload();
      return false;
    }
    return true;
  }

  function init() {
    injectStyles();
    if (!syncCookieOnBoot()) return;
    mountSwitcher();
    applyI18n(getPreferredLang());
    ensureHiddenWidget();
    loadGoogleTranslate();
    hideGoogleChrome();
    setTimeout(hideGoogleChrome, 800);
    setTimeout(hideGoogleChrome, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
