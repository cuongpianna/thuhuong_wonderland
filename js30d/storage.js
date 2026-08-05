const STORAGE_KEY = "wonderland_30days";
const STORAGE_VERSION = 1;

/* ==========================================
    DEFAULT DATA
========================================== */

function createDefaultData() {

    return {

        version: STORAGE_VERSION,

        challenge: {

            startDate: "2026-08-03",

            endDate: "2026-08-22"

        },

        history: {

            // "2026-08-03": { ... }

        },

        rewards: {

            unlocked: [],

            claimed: []

        },

        achievements: [],

        passes: {

            used: 0,

            remaining: 2

        }

    };

}

/* ==========================================
    LOAD
========================================== */

function loadData() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {

        const data = createDefaultData();

        saveData(data);

        return data;

    }

    try {

        return JSON.parse(raw);

    }

    catch (e) {

        console.error(e);

        const data = createDefaultData();

        saveData(data);

        return data;

    }

}

/* ==========================================
    SAVE
========================================== */

function saveData(data) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

/* ==========================================
    HISTORY
========================================== */

function getHistory() {

    return loadData().history;

}

function getDay(date) {

    const data = loadData();

    return data.history[date] || null;

}

function saveDay(date, dayData) {

    const data = loadData();

    data.history[date] = dayData;

    saveData(data);

}

/* ==========================================
    CHECK IN
========================================== */

function saveCheckIn(date, status, checkInTime) {

    const data = loadData();

    data.history[date] = {

        status,

        checkInTime,

        updatedAt:  Utils.now().toISOString()

    };

    saveData(data);

}

/* ==========================================
    PASS
========================================== */

function usePass(date, reason) {

    const data = loadData();

    if (data.passes.remaining <= 0) {

        return false;

    }

    data.passes.remaining--;

    data.passes.used++;

    data.history[date] = {

        status: "pass",

        reason,

        updatedAt:  Utils.now().toISOString()

    };

    saveData(data);

    return true;

}

function getPassInfo() {

    return loadData().passes;

}

/* ==========================================
    REWARD
========================================== */

function unlockReward(id) {

    const data = loadData();

    if (!data.rewards.unlocked.includes(id)) {

        data.rewards.unlocked.push(id);

    }

    saveData(data);

}

function claimReward(id) {

    const data = loadData();

    if (!data.rewards.claimed.includes(id)) {

        data.rewards.claimed.push(id);

    }

    saveData(data);

}

function getRewards() {

    return loadData().rewards;

}

/* ==========================================
    ACHIEVEMENT
========================================== */

function unlockAchievement(id) {

    const data = loadData();

    if (!data.achievements.includes(id)) {

        data.achievements.push(id);

    }

    saveData(data);

}

function getAchievements() {

    return loadData().achievements;

}

/* ==========================================
    RESET
========================================== */

function resetChallenge() {

    localStorage.removeItem(STORAGE_KEY);

}

/* ==========================================
    EXPORT
========================================== */

window.StorageService = {

    loadData,

    saveData,

    getHistory,

    getDay,

    saveDay,

    saveCheckIn,

    usePass,

    getPassInfo,

    unlockReward,

    claimReward,

    getRewards,

    unlockAchievement,

    getAchievements,

    resetChallenge

};