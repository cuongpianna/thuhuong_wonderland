/* ==========================================
    UI
========================================== */

const UI = (() => {

    /* --------------------------------------
        Element
    -------------------------------------- */

    const clock = document.getElementById("clock");

    const status = document.getElementById("status");

    const quote = document.getElementById("quote");

    const weatherIcon = document.getElementById("weatherIcon");

    const weatherTemp = document.getElementById("weatherTemp");

    const weatherDesc = document.getElementById("weatherDesc");

    const modal = document.getElementById("modal");

    const modalBody = document.getElementById("modalBody");

    const toast = document.getElementById("toast");

    const loading = document.getElementById("loading");

    /* --------------------------------------
        Clock
    -------------------------------------- */

    function startClock() {

        updateClock();

        setInterval(updateClock, 1000);

    }

    function updateClock() {

        const now = Utils.now();

        clock.textContent = now.toLocaleTimeString(
            "en-GB",
            {
                hour12: false
            }
        );

    }

    /* --------------------------------------
        Status
    -------------------------------------- */

    function setStatus(type, text) {

        status.className = "status";

        status.classList.add(type);

        status.textContent = text;

    }

    /* --------------------------------------
        Weather
    -------------------------------------- */

    function setWeather(weather) {

        weatherIcon.textContent = weather.icon;

        weatherTemp.textContent =
            weather.temperature + "°C";

        weatherDesc.textContent =
            weather.text;

    }

    /* --------------------------------------
        Quote
    -------------------------------------- */

    function setQuote(text) {

        quote.textContent = text;

    }

    /* --------------------------------------
        Progress
    -------------------------------------- */

    function setProgress(current, total) {

        const bar = document.getElementById(
            "progressBar"
        );

        const completed = document.getElementById(
            "completed"
        );

        const totalDays = document.getElementById(
            "totalDays"
        );

        completed.textContent = current;

        totalDays.textContent = total;

        const percent = (current / total) * 100;

        bar.style.width = percent + "%";

    }

    /* --------------------------------------
        Streak
    -------------------------------------- */

    function setStreak(days) {

        document.getElementById(
            "streak"
        ).textContent = days;

    }

    /* --------------------------------------
        Modal
    -------------------------------------- */

    function showModal(html) {

        modal.classList.remove("hidden");

        modalBody.innerHTML = html;

    }

    function hideModal() {

        modal.classList.add("hidden");

    }

    /* --------------------------------------
        Toast
    -------------------------------------- */

    let toastTimeout;

    function showToast(message) {

        clearTimeout(toastTimeout);

        toast.textContent = message;

        toast.classList.add("show");

        toastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }

    /* --------------------------------------
        Loading
    -------------------------------------- */

    function showLoading() {

        loading.classList.remove("hidden");

    }

    function hideLoading() {

        loading.classList.add("hidden");

    }

    /* --------------------------------------
        Reward
    -------------------------------------- */

    function celebrateReward(reward) {

        showModal(`

            <div class="reward-popup">

                <div style="font-size:72px">

                    ${reward.icon}

                </div>

                <h2>

                    Reward Unlocked!

                </h2>

                <h3>

                    ${reward.title}

                </h3>

                <p>

                    ${reward.description}

                </p>

            </div>

        `);

    }

    /* --------------------------------------
        Check In Button
    -------------------------------------- */

    function disableCheckIn() {

        const btn = document.getElementById(
            "checkInBtn"
        );

        btn.disabled = true;

        btn.textContent =
            "✅ Checked In";

    }

    function enableCheckIn() {

        const btn = document.getElementById(
            "checkInBtn"
        );

        btn.disabled = false;

        btn.textContent =
            "🌻 Check In";

    }

    function showMorningCard(status) {

        const quote = Quote.getTodayQuote(status);

        let title = "🌻 Good Morning";

        let subtitle = "Have a lovely day at work.";

        if (status === "late") {

            title = "⏰ It's Okay";

            subtitle = "Tomorrow is another chance.";

        }

        if (status === "pass") {

            title = "🌧️ Take Care";

            subtitle = "Hope the weather gets better soon.";

        }

        showModal(`

        <div class="morning-card">

            <div class="morning-icon">

                ${title.split(" ")[0]}

            </div>

            <h2>${title}</h2>

            <p class="morning-subtitle">

                ${subtitle}

            </p>

            <div class="quote-divider"></div>

            <p class="morning-quote">

                "${quote}"

            </p>

        </div>

    `);

    }

    /* --------------------------------------
        Public
    -------------------------------------- */

    return {

        startClock,

        setStatus,

        setWeather,

        setQuote,

        setProgress,

        setStreak,

        showModal,

        hideModal,

        showToast,

        showLoading,

        hideLoading,

        celebrateReward,

        disableCheckIn,

        enableCheckIn,
        showMorningCard

    };

})();

/* ==========================================
    EVENT
========================================== */

document
    .getElementById("closeModal")
    ?.addEventListener(
        "click",
        UI.hideModal
    );

document
    .getElementById("modal")
    ?.addEventListener(
        "click",
        (e) => {

            if (e.target.id === "modal") {

                UI.hideModal();

            }

        }
    );