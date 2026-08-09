const Theme = (function () {

    const STORAGE_KEY = "journey_theme";

    function current() {

        return document.documentElement.classList.contains("theme-dark")
            ? "dark"
            : "light";

    }

    function apply(mode) {

        document.documentElement.classList.toggle("theme-dark", mode === "dark");

        const btn = document.getElementById("theme-toggle");

        if (btn) {
            btn.innerHTML = mode === "dark" ? "🌙" : "☀️";
        }

    }

    function toggle() {

        const next = current() === "dark" ? "light" : "dark";

        localStorage.setItem(STORAGE_KEY, next);

        apply(next);

    }

    function init() {

        apply(current());

        const btn = document.getElementById("theme-toggle");

        if (btn) {
            btn.addEventListener("click", toggle);
        }

    }

    return {

        init,

        toggle

    };

})();

window.addEventListener("DOMContentLoaded", () => {

    Theme.init();

});