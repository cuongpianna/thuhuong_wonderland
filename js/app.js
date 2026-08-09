const App = (function () {

    async function init() {

        try {

            await MyStorage.init();

            await Weather.init();

            Calendar.init();

            await Reward.init();

            Quote.init();

            UI.init();

            bindEvents();

            UI.updateProgress();

            checkToday();

        } finally {

            UI.hidePageLoader();

        }

    }

    function bindEvents() {

        const btn = document.getElementById("checkin-btn");

        if (btn) {

            btn.addEventListener("click", () => {

                UI.unlockAudio();

                checkin(Utils.today());

            });

        }

        const giftClose = document.getElementById("gift-close");

        if (giftClose) {

            giftClose.addEventListener("click", () => {

                UI.hideGift();

            });

        }

        document.addEventListener("keydown", e => {

            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {

                UI.toggleDevPanel();

            }

        });

        const devCheckin = document.getElementById("dev-checkin");

        if (devCheckin) {

            devCheckin.onclick = () => {

                UI.unlockAudio();

                checkin(Utils.today());

            };

        }

        const devGift = document.getElementById("dev-gift");

        if (devGift) {

            devGift.onclick = () => {

                UI.showGift({
                    title: "🎁 Test Gift",
                    description: "Developer Mode",
                    icon: "🎁"
                });

            };

        }

        const devFill = document.getElementById("dev-fill");

        if (devFill) {

            devFill.onclick = async () => {

                await Calendar.fill(JOURNEY_DAYS.length);

                await Reward.update();

                UI.updateProgress();

            };

        }

        const devReset = document.getElementById("dev-reset");

        if (devReset) {

            devReset.onclick = resetJourney;

        }

        const devWeather = document.getElementById("dev-weather");

        if (devWeather) {

            devWeather.onclick = () => {

                Weather.setFake("Rain");

                UI.weatherWarning();

            };

        }

    }

    async function checkin(date) {

        if (!Utils.isJourneyDay(date)) {

            UI.error("Hôm nay không đi làm mà vẫn vào đây check-in à? 😼");

            return;

        }

        if (date !== Utils.today()) {

            UI.error("Bạn chỉ có thể check-in cho ngày hôm nay.");

            return;

        }

        if (MyStorage.exists(date)) {

            UI.toast("Hôm nay đã điểm danh rồi ❤️");

            return;

        }

        UI.setLoading(true);

        try {

            let status = Utils.isLate() ? "late" : "checked";

            if (Utils.isBadWeatherDay(date) || Weather.allowBypass()) {

                status = "bypass";

            }
            await MyStorage.saveCheckin(date, {
                status: status,
                time: Utils.now(),
                createdAt: new Date().toISOString()
            });

            Calendar.refresh();

            const isFinalDay = date === JOURNEY_DAYS[JOURNEY_DAYS.length - 1];

            const earnedGifts = await Reward.update({
                deferPresentation: isFinalDay
            });

            Quote.afterCheckin(status);

            UI.updateProgress();

            UI.success(status);

            if (isFinalDay) {

                const won = Reward.lateDays() <= CONFIG.REWARD.MAX_LATE_DAYS;

                UI.finishJourney(won, earnedGifts);

            }

        } catch (e) {

            console.error(e);

            UI.error("Có lỗi xảy ra.");

        } finally {

            UI.setLoading(false);

            checkToday();

        }

    }

    function checkToday() {

        const today = Utils.today();

        if (!Utils.isJourneyDay(today)) {

            UI.disableCheckin("Hôm nay không đi làm mà vẫn vào đây à? 😼");

            return;

        }

        if (MyStorage.exists(today)) {

            UI.disableCheckin();

        } else {

            UI.enableCheckin();

        }

    }

    async function resetJourney() {

        await MyStorage.clear();

        Calendar.reset();

        Reward.reset();

        Quote.showRandom(false);

        UI.enableCheckin();

        UI.updateProgress();

        UI.toast("Journey Reset ✔");

    }

    return {

        init,

        checkin,

        resetJourney

    };

})();

window.addEventListener("DOMContentLoaded", () => {

    App.init();

});
