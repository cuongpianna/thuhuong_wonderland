/* ==========================================
    DATE
========================================== */

function formatDate(date) {

    return date.toISOString().split("T")[0];

}

function formatDisplayDate(date) {

    return date.toLocaleDateString("en-GB", {

        weekday: "long",

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}

function isToday(date) {

    return formatDate(Utils.now()) === formatDate(date);

}

function isPast(date) {

    return date < Utils.now();

}

function isFuture(date) {

    return date > Utils.now();

}

function cloneDate(date) {

    return new Date(date.getTime());

}

/* ==========================================
    TIME
========================================== */

function currentTime() {

    return Utils.now().toLocaleTimeString(

        "en-GB",

        {

            hour12: false

        }

    );

}

function now() {

    if (CONFIG.DEBUG && CONFIG.MOCK_DATE) {

        return new Date(CONFIG.MOCK_DATE);

    }

    return new Date();

}

function isLate(limit = "08:00") {

    const now = Utils.now();

    const [h, m] = limit.split(":").map(Number);

    const compare = Utils.now();

    compare.setHours(h);

    compare.setMinutes(m);

    compare.setSeconds(0);

    return now > compare;

}

/* ==========================================
    WORKING DAY
========================================== */

function isWorkingDay(date) {

    return date.getDay() !== 0;

}

function workingDaysBetween(start, end) {

    let count = 0;

    const current = new Date(start);

    while (current <= end) {

        if (isWorkingDay(current)) {

            count++;

        }

        current.setDate(

            current.getDate() + 1

        );

    }

    return count;

}

/* ==========================================
    RANDOM
========================================== */

function randomItem(array) {

    return array[

        Math.floor(

            Math.random() * array.length

        )

        ];

}

function randomNumber(min, max) {

    return Math.floor(

        Math.random() *

        (max - min + 1)

    ) + min;

}

/* ==========================================
    STRING
========================================== */

function capitalize(text) {

    return text.charAt(0).toUpperCase()

        + text.slice(1);

}

/* ==========================================
    STREAK
========================================== */

function calculateStreak(history) {

    const dates = Object.keys(history)

        .sort()

        .reverse();

    let streak = 0;

    for (const date of dates) {

        const item = history[date];

        if (item.status === "success") {

            streak++;

        }

        else {

            break;

        }

    }

    return streak;

}

/* ==========================================
    PROGRESS
========================================== */

function calculateProgress(history) {

    return Object.keys(history).length;

}

/* ==========================================
    WAIT
========================================== */

function sleep(ms) {

    return new Promise(resolve =>

        setTimeout(resolve, ms)

    );
}

function isPassAvailable(dateString) {

    return !!CONFIG.PASS_DAYS[dateString];

}

/* ==========================================
    EXPORT
========================================== */

window.Utils = {

    formatDate,

    formatDisplayDate,

    currentTime,

    isToday,

    isPast,

    isFuture,

    cloneDate,

    isLate,

    isWorkingDay,

    workingDaysBetween,

    randomItem,

    randomNumber,

    capitalize,

    calculateStreak,

    calculateProgress,

    sleep,
    now,
    isPassAvailable

};