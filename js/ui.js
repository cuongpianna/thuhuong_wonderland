const UI = (function () {

    let audioCtx = null;

    function init() {

        bindEvents();

        startClock();

        updateGreeting();

    }

    function unlockAudio() {

        try {

            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }

        } catch (e) {
            // Web Audio not supported, ignore
        }

    }

    function playChime(status) {

        if (!audioCtx) {
            return;
        }

        const notes = status === "late" ? [660] : [880, 1320];

        const now = audioCtx.currentTime;

        notes.forEach((freq, i) => {

            const start = now + i * 0.12;

            const osc = audioCtx.createOscillator();

            const gain = audioCtx.createGain();

            osc.type = "sine";

            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, start);

            gain.gain.linearRampToValueAtTime(0.12, start + 0.02);

            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

            osc.connect(gain);

            gain.connect(audioCtx.destination);

            osc.start(start);

            osc.stop(start + 0.4);

        });

    }

    function hidePageLoader() {

        const loader = document.getElementById("page-loader");

        if (!loader) {
            return;
        }

        loader.classList.add("fade-out");

        setTimeout(() => {
            loader.classList.add("hidden");
        }, 350);

    }

    function bindEvents() {

        const close = document.getElementById("gift-close");

        if (close) {

            close.addEventListener("click", () => {

                Reward.closeGift();

            });

        }

        const finishClose = document.getElementById("finish-close");

        if (finishClose) {

            finishClose.addEventListener("click", () => {

                hideFinish();

            });

        }

    }

    function hideFinish() {

        const modal = document.getElementById("finish-modal");

        if (modal) {
            modal.classList.add("hidden");
        }

    }

    function startClock() {

        if (!CONFIG.SHOW_CLOCK) {
            return;
        }

        updateGreeting();

        setInterval(() => {

            updateGreeting();

        }, 1000);

    }

    function updateGreeting() {

        const greeting = document.getElementById("greeting");

        if (!greeting) {
            return;
        }

        greeting.innerHTML = Weather.getGreeting
            ? Weather.getGreeting()
            : "☀️ Good Morning";

    }

    function setLoading(value) {

        const btn = document.getElementById("checkin-btn");

        if (!btn) {
            return;
        }

        if (value) {

            btn.disabled = true;

            btn.classList.add("loading");

            btn.innerHTML = "Đang xử lý...";

        } else {

            btn.disabled = false;

            btn.classList.remove("loading");

            btn.innerHTML = "Checkin ✨";

        }

    }

    function disableCheckin(label = "Đã điểm danh ✔") {

        const btn = document.getElementById("checkin-btn");

        if (!btn) {
            return;
        }

        btn.disabled = true;

        btn.innerHTML = label;

    }

    function enableCheckin() {

        const btn = document.getElementById("checkin-btn");

        if (!btn) {
            return;
        }

        btn.disabled = false;

        btn.innerHTML = "Checkin ✨";

    }

    function toast(message, time = 2500) {

        const node = document.createElement("div");

        node.className = "toast";

        node.innerHTML = message;

        document.body.appendChild(node);

        setTimeout(() => {

            node.style.opacity = "0";

            node.style.transform = "translate(-50%,20px)";

        }, time - 300);

        setTimeout(() => {

            node.remove();

        }, time);

    }

    function confetti() {

        const container = document.getElementById("confetti-container");

        if (!container) {
            return;
        }

        const colors = [
            "#FFD166",
            "#FF6B81",
            "#60A5FA",
            "#7BD389",
            "#C084FC"
        ];

        for (let i = 0; i < 120; i++) {

            const item = document.createElement("div");

            item.className = "confetti";

            item.style.left = Math.random() * 100 + "%";

            item.style.top = "-20px";

            item.style.background =
                colors[Math.floor(Math.random() * colors.length)];

            item.style.animationDelay =
                (Math.random() * 0.5) + "s";

            item.style.transform =
                `rotate(${Math.random() * 360}deg)`;

            container.appendChild(item);

            setTimeout(() => {

                item.remove();

            }, 3500);

        }

    }

    function showGift(gift) {

        const modal = document.getElementById("gift-modal");

        document.getElementById("gift-title").innerHTML = gift.title;

        document.getElementById("gift-description").innerHTML = gift.description;

        document.querySelector(".gift-icon").innerHTML = gift.icon;

        modal.classList.remove("hidden");

        confetti();

    }

    function hideGift() {

        const modal = document.getElementById("gift-modal");

        modal.classList.add("hidden");

    }

    function updateProgress() {

        const progress = Reward.progress();

        const streak = document.getElementById("streak");

        if (streak) {

            streak.innerHTML = progress.streak;

        }

        if (typeof Pet !== "undefined") {
            Pet.update(progress);
        }

    }

    function shakeButton() {

        const btn = document.getElementById("checkin-btn");

        btn.animate([

            {transform: "translateX(0)"},

            {transform: "translateX(-6px)"},

            {transform: "translateX(6px)"},

            {transform: "translateX(-4px)"},

            {transform: "translateX(4px)"},

            {transform: "translateX(0)"}

        ], {

            duration: 400

        });

    }

    function pulseToday() {

        const today = Calendar.getTodayElement();

        if (!today) {
            return;
        }

        today.animate([

            {transform: "scale(1)"},

            {transform: "scale(1.08)"},

            {transform: "scale(1)"}

        ], {

            duration: 600

        });

    }

    function success(status) {

        pulseToday();

        playChime(status);

        if (status === "checked") {
            confetti();
        }

    }

    function error(message) {

        shakeButton();

        toast(message);

    }

    function weatherWarning() {

        toast("☔ Hôm nay thời tiết xấu, bạn có thể dùng Bypass.");

    }

    function finishJourney(won, earnedGifts = []) {

        // The final screen owns the celebration so a reward modal never stacks above it.
        hideGift();

        confetti();

        const data = won ? CONFIG.FINISH.WIN : CONFIG.FINISH.LOSE;

        const modal = document.getElementById("finish-modal");

        const icon = document.getElementById("finish-icon");

        const title = document.getElementById("finish-title");

        const desc = document.getElementById("finish-description");

        const postcard = document.getElementById("finish-postcard");

        const rewards = document.getElementById("finish-rewards");

        const progress = Reward.progress();

        if (icon) {
            icon.innerHTML = data.icon;
        }

        if (title) {
            title.innerHTML = data.title;
        }

        if (desc) {
            desc.innerHTML = data.description;
        }

        if (postcard) {
            postcard.querySelector("[data-postcard='completed']").textContent = progress.completed + 6;
            postcard.querySelector("[data-postcard='streak']").textContent = progress.streak;
            postcard.querySelector("[data-postcard='late']").textContent = progress.late + 1;
            postcard.classList.toggle("postcard-won", won);
        }

        if (rewards) {
            rewards.replaceChildren();

            earnedGifts.forEach(gift => {
                const item = document.createElement("div");
                item.className = "finish-reward-item";
                item.textContent = `${gift.icon} Quà hành trình: ${gift.title}`;
                rewards.appendChild(item);
            });

            rewards.classList.toggle("hidden", earnedGifts.length === 0);
        }

        if (modal) {
            modal.classList.remove("hidden");
        }

    }

    function toggleDevPanel() {

        const panel = document.getElementById("dev-panel");

        if (!panel) {
            return;
        }

        panel.classList.toggle("hidden");

        if (typeof Reward !== "undefined") {
            Reward.updateProgress();
        }

    }

    return {

        init,

        hidePageLoader,

        unlockAudio,

        toast,

        confetti,

        showGift,

        hideGift,

        updateProgress,

        setLoading,

        disableCheckin,

        enableCheckin,

        success,

        error,

        weatherWarning,

        finishJourney,

        hideFinish,

        toggleDevPanel

    };

})();
