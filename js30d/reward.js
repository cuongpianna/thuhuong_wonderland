/* ==========================================
    REWARD CONFIG
========================================== */

const REWARDS = [

    {
        id: "coffee",

        streak: 3,

        title: "A Warm Coffee",

        icon: "☕",

        description: "A little coffee treat."
    },

    {
        id: "icecream",

        streak: 5,

        title: "Ice Cream Date",

        icon: "🍦",

        description: "Time for something sweet."
    },

    // {
    //     id: "dinner",
    //
    //     streak: 10,
    //
    //     title: "Dinner Together",
    //
    //     icon: "🍜",
    //
    //     description: "Let's have dinner together."
    // },
    //
    // {
    //     id: "movie",
    //
    //     streak: 15,
    //
    //     title: "Movie Night",
    //
    //     icon: "🎬",
    //
    //     description: "A cozy movie night."
    // },
    //
    // {
    //     id: "surprise",
    //
    //     streak: 24,
    //
    //     title: "Secret Surprise",
    //
    //     icon: "💝",
    //
    //     description: "You've completed the challenge."
    // }

];

/* ==========================================
    FIND NEXT
========================================== */

function getNextReward(streak) {

    return REWARDS.find(

        reward => streak < reward.streak

    );

}

/* ==========================================
    FIND CURRENT
========================================== */

function getUnlockedReward(streak) {

    return REWARDS.filter(

        reward => streak >= reward.streak

    );

}

/* ==========================================
    CHECK
========================================== */

function checkReward(streak) {

    const rewards = StorageService.getRewards();

    const unlocked = [];

    REWARDS.forEach(reward => {

        if (

            streak >= reward.streak &&

            !rewards.unlocked.includes(reward.id)

        ) {

            StorageService.unlockReward(

                reward.id

            );

            unlocked.push(reward);

        }

    });

    return unlocked;

}

/* ==========================================
    RENDER
========================================== */

function renderReward(streak) {

    const next = getNextReward(streak);

    const icon = document.getElementById("rewardBox");

    const title = document.getElementById("rewardTitle");

    const desc = document.getElementById("rewardDescription");

    if (!next) {

        icon.textContent = "🏆";

        title.textContent = "Challenge Completed";

        desc.textContent = "Every surprise has been unlocked.";

        return;

    }

    icon.textContent = "📦";

    title.textContent = "Hidden Surprise";

    desc.innerHTML = `

        Keep going 🌻

        <br><br>

        Something lovely
        is waiting for you.

    `;

}

/* ==========================================
    POPUP
========================================== */

function revealReward(reward) {

    if (!reward) {

        return;

    }

    if (typeof UI !== "undefined") {

        UI.showModal(`

            <div class="reward-popup">

                <div style="font-size:70px">

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

}

/* ==========================================
    PUBLIC
========================================== */

window.Reward = {

    renderReward,

    checkReward,

    revealReward,

    getNextReward,

    getUnlockedReward

};