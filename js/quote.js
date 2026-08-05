const Quote = (function () {

    let quotes = [...CONFIG.QUOTES];

    function init() {
        showRandom(false);
    }

    function loadHistory(storageKey) {

        const raw = localStorage.getItem(storageKey);

        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return [raw];
        }

    }

    function pick(list, storageKey, historySize = 1) {

        const source = list && list.length ? list : CONFIG.QUOTES;

        const maxHistory = Math.min(historySize, source.length - 1);

        let history = loadHistory(storageKey);

        let available = source.filter(q => !history.includes(q));

        if (available.length === 0) {
            history = [];
            available = [...source];
        }

        const quote = available[Math.floor(Math.random() * available.length)];

        history.push(quote);

        while (history.length > maxHistory) {
            history.shift();
        }

        localStorage.setItem(storageKey, JSON.stringify(history));

        return quote;

    }

    function random() {

        return pick(quotes, STORAGE_KEYS.LAST_QUOTE);

    }

    function showRandom(animated = true) {

        const quote = random();

        show(quote, animated);

        return quote;

    }

    function show(text, animated = true) {

        const box = document.getElementById("quote-box");

        if (box) {

            if (animated) {

                box.style.opacity = 0;

                box.style.transform = "translateY(15px)";

                setTimeout(() => {

                    box.innerHTML = text;

                    box.style.opacity = 1;

                    box.style.transform = "translateY(0)";

                }, 250);

            } else {

                box.innerHTML = text;

            }

        }

        const popup = document.getElementById("quote-popup");

        if (animated && popup) {

            popup.innerHTML = `✨ ${text}`;

            popup.classList.remove("hidden");

            setTimeout(() => {

                popup.classList.add("hidden");

            }, 3500);

        }

    }

    function afterCheckin(status) {

        if (!CONFIG.QUOTE_AFTER_CHECKIN) {
            return;
        }

        const isLate = status === "late";

        const list = isLate
            ? CONFIG.CHECKIN_QUOTES.LATE
            : CONFIG.CHECKIN_QUOTES.EARLY;

        const key = isLate
            ? STORAGE_KEYS.LAST_CHECKIN_QUOTE_LATE
            : STORAGE_KEYS.LAST_CHECKIN_QUOTE_EARLY;

        const quote = pick(list, key, 3);

        show(quote, true);

        return quote;

    }

    return {

        init,

        show,

        showRandom,

        afterCheckin

    };

})();