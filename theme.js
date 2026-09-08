/* theme.js — loaded blocking in <head> to prevent FOUC */
(function () {
  var THEME_KEY = "akar_theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}

    var btns = document.querySelectorAll(".theme-toggle");
    btns.forEach(function (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  /* Apply immediately (before paint) to prevent flash */
  var saved;
  try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
  applyTheme(saved || "light");

  /* Wire buttons after DOM is ready */
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");

    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    });
  });
})();
