const Pet = (function () {

    let displayedStage = null;

    const STAGES = [
        {min: 0, icon: "🥚", title: "Trứng bí ẩn", caption: "Mới bắt đầu hành trình, cùng cố gắng nhé!"},
        {min: 3, icon: "🐣", title: "Mới nở", caption: "Một bước khởi đầu đáng yêu!"},
        {min: 6, icon: "🐥", title: "Gà con năng lượng", caption: "Đang lớn lên từng ngày đó!"},
        {min: 9, icon: "🐤", title: "Chững chạc hơn", caption: "Thói quen đang dần hình thành."},
        {min: 12, icon: "🐦", title: "Sải cánh", caption: "Sắp bay cao rồi, cố lên!"},
        {min: 15, icon: "🕊️", title: "Tự do bay lượn", caption: "Gần về đích rồi, tuyệt vời!"},
        {min: 18, icon: "🦋", title: "Hoàn thiện rực rỡ", caption: "Một hành trình trọn vẹn!"}
    ];

    function getStage(streak) {

        let stage = STAGES[0];

        STAGES.forEach(candidate => {

            if (streak >= candidate.min) {
                stage = candidate;
            }

        });

        return stage;

    }

    function update(progress) {

        const completed = typeof progress === "number" ? progress : progress.completed;
        const journeyDay = JOURNEY_DAYS.filter(date => date <= Utils.today()).length;
        const stage = getStage(journeyDay);

        const justLeveledUp =
            (displayedStage !== null && stage.min > displayedStage) ||
            (displayedStage === null && Boolean(CONFIG.DEV.fakeDate));

        const icon = document.getElementById("pet-icon");

        if (icon) {
            const previousIcon = icon.textContent.trim();

            if (justLeveledUp && previousIcon) {
                const previous = document.createElement("span");
                previous.className = "pet-previous";
                previous.textContent = previousIcon;

                const next = document.createElement("span");
                next.className = "pet-next";
                next.textContent = stage.icon;

                icon.replaceChildren(previous, next);
            } else {
                icon.textContent = stage.icon;
            }

            icon.title = `${stage.title} — Ngày hành trình ${journeyDay}/${JOURNEY_DAYS.length}`;
            icon.dataset.stage = stage.min;
            icon.setAttribute("aria-label", `${stage.title}. ${stage.caption}`);

            if (justLeveledUp) {
                const delay = displayedStage === null && CONFIG.DEV.fakeDate ? 450 : 0;

                setTimeout(() => {
                    icon.classList.remove("pet-level-up");
                    void icon.offsetWidth;
                    icon.classList.add("pet-level-up");

                    setTimeout(() => {
                        icon.classList.remove("pet-level-up");
                        icon.textContent = stage.icon;
                    }, 2050);
                }, delay);
            }
        }

        const title = document.getElementById("pet-title");
        const caption = document.getElementById("pet-caption");

        if (title) title.textContent = stage.title;
        if (caption) caption.textContent = `${stage.caption} Ngày hành trình ${journeyDay}/${JOURNEY_DAYS.length}, đã check-in ${completed} ngày.`;

        displayedStage = stage.min;

    }

    return {

        update

    };

})();
