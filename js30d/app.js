/* ==========================================
    APP
========================================== */

document.addEventListener("DOMContentLoaded", init);

/* ==========================================
    INIT
========================================== */

async function init() {

    UI.startClock();

    loadToday();

    Calendar.render();

    await loadWeather();

    updateDashboard();

    bindEvents();

}

/* ==========================================
    LOAD TODAY
========================================== */

function loadToday() {

    const today = Utils.now();

    document.getElementById("todayWeekday").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long"
        });

    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

}

/* ==========================================
    WEATHER
========================================== */

async function loadWeather() {

    const weather = await Weather.load();

    UI.setWeather(weather);

    const passButton = document.getElementById("passBtn");

    if (Weather.canUseWeatherPass(weather.code)) {

        passButton.disabled = false;

        passButton.textContent = "🌧️ Weather Pass";

    }

}

/* ==========================================
    DASHBOARD
========================================== */

function updateDashboard() {

    const history = StorageService.getHistory();

    const streak = Utils.calculateStreak(history);

    const progress = Utils.calculateProgress(history);

    UI.setStreak(streak);

    UI.setProgress(progress, 18);

    Reward.renderReward(streak);


}

/* ==========================================
    CHECK IN
========================================== */

function checkIn() {

    const today = Utils.formatDate(

        Utils.now()

    );

    if (

        StorageService.getDay(today)

    ) {

        UI.showToast(

            "Already checked in today 🌻"

        );

        return;

    }

    const late = Utils.isLate();

    StorageService.saveCheckIn(

        today,

        late ? "late" : "success",

        Utils.currentTime()

    );

    UI.disableCheckIn();

    UI.setStatus(

        late ? "late" : "success",

        late

            ? "Checked in (Late)"

            : "Checked in Successfully"

    );

    UI.showMorningCard(
        late ? "late" : "success"
    );

    Calendar.refresh();

    updateDashboard();

    const streak = Utils.calculateStreak(

        StorageService.getHistory()

    );

    const unlocked = Reward.checkReward(

        streak

    );

    unlocked.forEach(reward => {

        UI.celebrateReward(

            reward

        );

    });

}

/* ==========================================
    PASS
========================================== */

function usePass() {

    const today = Utils.formatDate(

        Utils.now()

    );

    if (

        StorageService.getDay(today)

    ) {

        UI.showToast(

            "Today's record already exists."

        );

        return;

    }

    const ok = StorageService.usePass(

        today,

        "Weather"

    );

    if (!ok) {

        UI.showToast(

            "No pass remaining."

        );

        return;

    }

    UI.setStatus(

        "pass",

        "Weather Pass Used"

    );



    Calendar.refresh();

    updateDashboard();

}

/* ==========================================
    EVENT
========================================== */

function bindEvents() {

    document

        .getElementById(

            "checkInBtn"

        )

        .addEventListener(

            "click",

            checkIn

        );

    document

        .getElementById(

            "passBtn"

        )

        .addEventListener(

            "click",

            usePass

        );

}