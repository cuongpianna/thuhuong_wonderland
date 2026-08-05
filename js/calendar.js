const Calendar = (function () {

    let container = null;

    function init() {
        container = document.getElementById("calendar-grid");
        render();
    }

    function render() {
        if (!container) return;
        container.innerHTML = "";
        JOURNEY_DAYS.forEach(date => {
            container.appendChild(createDay(date));
        });
    }

    function createDay(date) {
        const day = document.createElement("div");
        day.className = "day";
        day.dataset.date = date;

        const dateObj = new Date(date + "T00:00:00");
        const today = new Date(Utils.today() + "T00:00:00");

        const status = MyStorage.getCheckin(date);

        if (dateObj > today) {
            day.classList.add("future");
        }

        if (Utils.isSameDate(dateObj, today)) {
            day.classList.add("today");
        }

        if (status) {
            day.classList.add(status.status);
        }

        if (date === JOURNEY_DAYS[JOURNEY_DAYS.length - 1]) {
            day.classList.add("last-day");
        }

        const number = document.createElement("div");
        number.className = "day-number";
        number.innerText = dateObj.getDate();

        const label = document.createElement("div");
        label.className = "day-label";
        label.innerText = getLabel(status);

        day.appendChild(number);
        day.appendChild(label);

        if (date === JOURNEY_DAYS[JOURNEY_DAYS.length - 1]) {

            const badge = document.createElement("div");
            badge.className = "last-day-badge";
            badge.innerText = "🏁";
            day.appendChild(badge);

        }

        day.addEventListener("click", () => onClick(date));

        return day;
    }

    function onClick(date) {
        if (!Utils.canCheckin(date)) {
            return;
        }
        App.checkin(date);
    }

    function getLabel(status) {
        if (!status) {
            return "";
        }

        const time = Utils.formatTime(status.time || status.checkin_time);

        if (time) {
            return time;
        }

        switch (status.status) {
            case "checked":
            return "💖";

        case "late":
            return "⏰";

        case "bypass":
            return "☔";

        case "missed":
            return "😴";

        default:
            return "";
        }
    }

    function refresh() {
        render();
    }

    function reset() {
        render();
    }

    async function fill(days) {

        await MyStorage.clear();

        for (let i = 0; i < days && i < JOURNEY_DAYS.length; i++) {

            await MyStorage.saveCheckin(
                JOURNEY_DAYS[i],
                {
                    status: "checked",
                    time: "08:00"
                }
            );

        }

        render();

    }

    function getTodayElement() {
        return document.querySelector(".day.today");
    }

    return {

        init,

        render,

        refresh,

        reset,

        fill,

        getTodayElement

    };

})();