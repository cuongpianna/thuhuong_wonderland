const MyStorage = (function () {

    const MODE = CONFIG.STORAGE;

    let cache = {};
    let client = null;

    function getKey() {
        return STORAGE_KEYS.CHECKINS;
    }

    function getRewardKey() {
        return STORAGE_KEYS.REWARDS;
    }

    function getTableName() {
        return CONFIG.DEV.useTestTable ? "journey_checkins_test" : "journey_checkins";
    }

    async function init() {

        if (MODE === "supabase") {

            client = window.supabase.createClient(
                CONFIG.SUPABASE.URL,
                CONFIG.SUPABASE.ANON_KEY
            );

            await loadSupabase();

            return;

        }

    }

    async function loadSupabase() {

        const {data, error} = await client
            .from(getTableName())
            .select("*");

        if (error) {

            console.error(error);

            return;

        }

        cache = {};

        data.forEach(item => {

            cache[item.date] = item;

        });

    }

    function loadLocal() {

        const raw = localStorage.getItem(getKey());

        if (!raw) {
            return {};
        }

        try {
            return JSON.parse(raw);
        } catch (e) {
            return {};
        }

    }

    function saveLocal(data) {

        localStorage.setItem(
            getKey(),
            JSON.stringify(data)
        );

    }

    async function saveSupabase(date, data) {

        const payload = {
            date: date,
            status: data.status,
            checkin_time: data.time
        };

        if (data.forgiven !== undefined) {
            payload.forgiven = data.forgiven;
        }

        const {error} = await client
            .from(getTableName())
            .upsert(payload);

        if (error) {

            throw error;

        }

        cache[date] = {
            date,
            ...data
        };

    }


    async function saveCheckin(date, data) {

        if (MODE === "supabase") {
            await saveSupabase(date, data);
            return;
        }

        const all = loadLocal();

        all[date] = data;

        saveLocal(all);

    }

    function getCheckin(date) {

        if (MODE === "supabase") {
            return cache[date] || null;
        }

        const all = loadLocal();

        return all[date] || null;

    }

    async function refresh() {

        if (MODE === "supabase") {
            await loadSupabase();
        }

    }

    function getAll() {

        if (MODE === "supabase") {

            return cache;

        }

        return loadLocal();

    }

    function exists(date) {

        return getCheckin(date) != null;

    }

    async function clear() {

        if (MODE === "supabase") {

            const {error} = await client
                .from(getTableName())
                .delete()
                .not("date", "is", null);

            if (error) {
                console.error(error);
            }

            cache = {};

        }

        localStorage.removeItem(getKey());

        localStorage.removeItem(getRewardKey());

        localStorage.removeItem(STORAGE_KEYS.LAST_STREAK);

    }

    function loadLastStreak() {

        return parseInt(localStorage.getItem(STORAGE_KEYS.LAST_STREAK), 10) || 0;

    }

    function saveLastStreak(value) {

        localStorage.setItem(STORAGE_KEYS.LAST_STREAK, value);

    }

    function saveRewards(data) {

        localStorage.setItem(
            getRewardKey(),
            JSON.stringify(data)
        );

    }

    function loadRewards() {

        const raw = localStorage.getItem(getRewardKey());

        if (!raw) {
            return [];
        }

        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }

    }

    function unlockReward(id) {

        const rewards = loadRewards();

        if (!rewards.includes(id)) {

            rewards.push(id);

            saveRewards(rewards);

        }

    }

    function hasReward(id) {

        return loadRewards().includes(id);

    }

    return {

        init,

        saveCheckin,

        getCheckin,

        getAll,

        refresh,

        exists,

        clear,

        saveRewards,

        loadRewards,

        unlockReward,

        hasReward,

        loadLastStreak,

        saveLastStreak

    };

})();