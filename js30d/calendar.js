/* ==========================================
    CALENDAR
========================================== */

const Calendar = (() => {

    const calendarElement = document.getElementById("calendar");

    /* --------------------------------------
        Build Working Days
    -------------------------------------- */

    function getWorkingDays() {

        const data = StorageService.loadData();

        const start = new Date(data.challenge.startDate);
        const end = new Date(data.challenge.endDate);

        const days = [];

        let current = new Date(start);

        while (current <= end) {

            // Sunday = 0

            if (current.getDay() !== 0) {

                days.push(new Date(current));

            }

            current.setDate(current.getDate() + 1);

        }

        return days;

    }

    /* --------------------------------------
        Format Date
    -------------------------------------- */

    function formatDate(date) {

        return date.toISOString().split("T")[0];

    }

    /* --------------------------------------
        Day Emoji
    -------------------------------------- */

    function getEmoji(status) {

        switch (status) {

            case "success":

                return "🟩";

            case "late":

                return "🟨";

            case "pass":

                return "🟦";

            default:

                return "⬜";

        }

    }

    /* --------------------------------------
        CSS Class
    -------------------------------------- */

    function getClass(status) {

        switch (status) {

            case "success":

                return "success";

            case "late":

                return "late";

            case "pass":

                return "pass";

            default:

                return "upcoming";

        }

    }

    /* --------------------------------------
        Render
    -------------------------------------- */

    function render() {

        if (!calendarElement) return;

        calendarElement.innerHTML = "";

        const history = StorageService.getHistory();

        const workingDays = getWorkingDays();

        workingDays.forEach((date) => {

            const key = formatDate(date);

            const item = history[key];

            const status = item?.status || "upcoming";

            const div = document.createElement("div");

            div.className = `day ${getClass(status)}`;

            div.dataset.date = key;

            const weatherIcon = item?.weather?.icon || "☀️";

            const checkTime = item?.checkInTime || "--";

            const weekday = date
                .toLocaleDateString("en-US", {
                    weekday: "short"
                })
                .toUpperCase();

            const day = date.getDate();

            const month = date
                .toLocaleDateString("en-US", {
                    month: "short"
                });

            const today =
                key === Utils.formatDate(Utils.now());

            div.innerHTML = `

    ${
                today
                    ? '<div class="today-badge">TODAY</div>'
                    : ""
            }

    <div class="day-week">

        ${weekday}

    </div>

    <div class="day-date">

        ${day} ${month}

    </div>



    <div class="day-time">

        ${checkTime}

    </div>

    <div class="day-status">

        ${getEmoji(status)}

    </div>

`;

            div.addEventListener("click", () => {

                openDay(key);

            });

            calendarElement.appendChild(div);

        });

    }

    /* --------------------------------------
        Detail
    -------------------------------------- */

    function openDay(date) {

        const day = StorageService.getDay(date);

        if (!day) {

            alert(

                `${date}

No record yet 🌻`

            );

            return;

        }

        alert(

            `${date}

Status : ${day.status}

Time : ${day.checkInTime || "--"}

Reason : ${day.reason || "-"}`

        );

    }

    /* --------------------------------------
        Refresh
    -------------------------------------- */

    function refresh() {

        render();

    }

    /* --------------------------------------
        Public
    -------------------------------------- */

    return {

        render,

        refresh,

        getWorkingDays,

        formatDate

    };

})();