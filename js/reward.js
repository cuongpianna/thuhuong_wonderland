const Reward = (function () {

    let streak = 0;

    async function init() {

        await MyStorage.refresh();

        streak = calculateStreak();

        MyStorage.saveLastStreak(streak);

        updateProgress();

    }

    async function update() {

        await MyStorage.refresh();

        streak = calculateStreak();

        await checkReward();

        updateProgress();

    }

    function calculateStreak() {

        const data = MyStorage.getAll();

        const today = Utils.today();

        let count = 0;

        for (let i = JOURNEY_DAYS.length - 1; i >= 0; i--) {

            const date = JOURNEY_DAYS[i];

            if (date > today) {
                continue;
            }

            const item = data[date];

            if (item && !item.forgiven && (item.status === "checked" || item.status === "bypass")) {
                count++;
            } else {
                break;
            }

        }

        return count;

    }

    function completedDays() {

        const data = MyStorage.getAll();

        let total = 0;

        JOURNEY_DAYS.forEach(date => {

            const item = data[date];

            if (item && (item.status === "checked" || item.status === "bypass" || item.status === "late")) {
                total++;
            }

        });

        return total;

    }

    function lateDays() {

        const data = MyStorage.getAll();

        let total = 0;

        JOURNEY_DAYS.forEach(date => {

            if (data[date] && data[date].status === "late") {
                total++;
            }

        });

        return total;

    }

    function isDevPanelOpen() {

        const panel = document.getElementById("dev-panel");

        return !!panel && !panel.classList.contains("hidden");

    }

    function lateRemaining() {

        return Math.max(0, CONFIG.REWARD.MAX_LATE_DAYS - lateDays());

    }

    function findLatestLateDate() {

        const data = MyStorage.getAll();

        let latest = null;

        JOURNEY_DAYS.forEach(date => {

            if (data[date] && data[date].status === "late" && (!latest || date > latest)) {
                latest = date;
            }

        });

        return latest;

    }

    async function forgiveLatestLate() {

        const date = findLatestLateDate();

        if (!date) {
            return;
        }

        const record = MyStorage.getCheckin(date) || {};

        await MyStorage.saveCheckin(date, {
            status: "checked",
            time: record.time || record.checkin_time,
            forgiven: true
        });

        if (typeof Calendar !== "undefined") {
            Calendar.refresh();
        }

    }

    async function checkReward() {

        const lastStreak = MyStorage.loadLastStreak();

        for (const gift of CONFIG.GIFTS) {

            try {

                if (gift.repeatable) {

                    if (streak === gift.streak && lastStreak < gift.streak) {

                        await grantGift(gift);

                    }

                } else if (streak >= gift.streak && !MyStorage.hasReward(gift.id)) {

                    MyStorage.unlockReward(gift.id);

                    await grantGift(gift);

                }

            } catch (e) {

                console.error("Lỗi khi trao thưởng", gift.id, e);

            }

        }

        MyStorage.saveLastStreak(streak);

    }

    async function grantGift(gift) {

        if (gift.effect === "late_forgive") {
            await forgiveLatestLate();
        }

        showGift(gift);

    }

    function showGift(gift) {

        const modal = document.getElementById("gift-modal");

        const title = document.getElementById("gift-title");

        const desc = document.getElementById("gift-description");

        const icon = document.querySelector(".gift-icon");

        if (icon) {
            icon.innerHTML = gift.icon;
        }

        if (title) {
            title.innerHTML = gift.title;
        }

        if (desc) {
            desc.innerHTML = gift.description;
        }

        if (modal) {
            modal.classList.remove("hidden");
        }

        if (typeof UI !== "undefined") {
            UI.confetti();
        }

    }

    function closeGift() {

        const modal = document.getElementById("gift-modal");

        if (modal) {
            modal.classList.add("hidden");
        }

    }

    function updateProgress() {

        const streakNode = document.getElementById("streak");

        if (streakNode) {
            streakNode.innerHTML = streak;
        }

        const rewardNode = document.getElementById("next-reward");

        if (rewardNode) {

            const next = getNextReward();

            if (!next) {
                rewardNode.innerHTML = "Completed 🎉";
            } else if (isDevPanelOpen()) {
                rewardNode.innerHTML = `${next.streak - streak} Days`;
            } else {
                rewardNode.innerHTML = "❓";
            }

        }

        const lateNode = document.getElementById("late-remaining");

        if (lateNode) {

            const remaining = lateRemaining();

            lateNode.innerHTML = remaining;

            lateNode.classList.toggle("warning", remaining <= 1);

        }

        const progressFill = document.getElementById("journey-progress-fill");

        const progressText = document.getElementById("journey-progress-text");

        if (progressFill && progressText) {

            const completed = completedDays();

            const percent = Math.round((completed / JOURNEY_DAYS.length) * 100);

            progressFill.style.width = `${percent}%`;

            progressText.innerHTML = `${completed}/${JOURNEY_DAYS.length} ngày ❤️`;

        }

    }

    function getNextReward() {

        for (const gift of CONFIG.GIFTS) {

            if (streak < gift.streak) {
                return gift;
            }

        }

        return null;

    }

    function reset() {

        streak = 0;

        MyStorage.saveRewards([]);

        updateProgress();

    }

    function progress() {

        return {
            completed: completedDays(),
            remaining: JOURNEY_DAYS.length - completedDays(),
            streak: streak,
            late: lateDays(),
            lateRemaining: lateRemaining()
        };

    }

    return {

        init,

        update,

        updateProgress,

        reset,

        progress,

        closeGift,

        lateDays,

        lateRemaining

    };

})();