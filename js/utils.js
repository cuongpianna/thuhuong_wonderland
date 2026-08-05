const Utils = (function () {

    function today() {

        if (CONFIG.DEV.fakeDate) {
            return CONFIG.DEV.fakeDate;
        }

        const now = new Date();

        return formatDate(now);

    }

    function now() {

        if (CONFIG.DEV.fakeTime) {

            const date = today();

            return `${date} ${CONFIG.DEV.fakeTime}:00`;

        }

        return new Date().toISOString();

    }

    function currentHour() {

        if (CONFIG.DEV.fakeTime) {

            return parseInt(CONFIG.DEV.fakeTime.split(":")[0]);

        }

        return new Date().getHours();

    }

    function currentMinute() {

        if (CONFIG.DEV.fakeTime) {

            return parseInt(CONFIG.DEV.fakeTime.split(":")[1]);

        }

        return new Date().getMinutes();

    }

    function formatDate(date) {

        const y = date.getFullYear();

        const m = String(date.getMonth() + 1).padStart(2, "0");

        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;

    }

    function isSameDate(a, b) {

        return formatDate(a) === formatDate(b);

    }

    function isJourneyDay(date) {

        const value = typeof date === "string"
            ? date
            : formatDate(date);

        return JOURNEY_DAYS.includes(value);

    }

    function isBadWeatherDay(date) {

        return CONFIG.BAD_WEATHER_DAYS.includes(date);

    }

    function canCheckin(date) {

        if (!isJourneyDay(date)) {
            return false;
        }

        if (date !== today()) {
            return false;
        }

        return true;

    }

    function currentTime() {

        if (CONFIG.DEV.fakeTime) {

            return CONFIG.DEV.fakeTime;

        }
        return `${String(currentHour()).padStart(2, "0")}:${String(currentMinute()).padStart(2, "0")}`;
    }

    function getStatusFromTime() {

        const current = currentTime();
        if (current < CONFIG.CHECKIN_TIME) {
            return CONFIG.STATUS.EARLY;
        }

        if (current === CONFIG.CHECKIN_TIME) {

            return CONFIG.STATUS.ON_TIME;

        }
        return CONFIG.STATUS.LATE;
    }

    function formatTime(value) {

        if (!value) {
            return "";
        }

        const iso = value.includes("T") ? value : value.replace(" ", "T");

        const date = new Date(iso);

        if (isNaN(date.getTime())) {
            return "";
        }

        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    }

    function isLate() {
        return getStatusFromTime() === CONFIG.STATUS.LATE;
    }

    return {
        isLate,
        today,

        now,

        currentHour,

        currentMinute,

        formatDate,

        formatTime,

        isSameDate,

        isJourneyDay,

        isBadWeatherDay,

        canCheckin

    };

})();