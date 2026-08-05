const Weather = (function () {

    let current = {
        temp: null,
        text: "",
        icon: "☀️",
        type: "Clear"
    };

    async function init() {

        if (!CONFIG.SHOW_WEATHER) {
            return;
        }

        if (CONFIG.DEV.fakeWeather) {
            applyFakeWeather();
            render();
            return;
        }

        if (CONFIG.DEV.disableWeatherApi) {
            current.text = "Weather Disabled";
            render();
            return;
        }

        try {
            await fetchWeather();
        } catch (e) {
            console.error(e);
            current.text = "Weather Unavailable";
            render();
        }

    }

    async function fetchWeather() {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.WEATHER.LAT}&lon=${CONFIG.WEATHER.LON}&appid=${CONFIG.WEATHER.API_KEY}&units=${CONFIG.WEATHER.UNITS}&lang=${CONFIG.WEATHER.LANG}`;

        const response = await fetch(url);

        const data = await response.json();

        current.temp = Math.round(data.main.temp);

        current.text = data.weather[0].description;

        current.type = data.weather[0].main;

        current.icon = getIcon(current.type);

        render();

    }

    function applyFakeWeather() {

        current.type = CONFIG.DEV.fakeWeather;

        current.temp = 28;

        current.text = current.type;

        current.icon = getIcon(current.type);

    }

    function render() {

        const icon = document.getElementById("weather-icon");

        const text = document.getElementById("weather-text");

        const greeting = document.getElementById("greeting");

        if (icon) {
            icon.innerHTML = current.icon;
        }

        if (text) {

            let html = "";

            if (current.temp !== null) {
                html += `${current.temp}°C`;
            }

            if (current.text) {
                html += ` · ${current.text}`;
            }

            text.innerHTML = html;

        }

        if (greeting) {
            greeting.innerHTML = getGreeting();
        }

    }

    function getGreeting() {

        const hour = Utils.currentHour();

        if (hour < 5) {
            return "🌙 Still up?";
        }

        if (hour < 11) {
            return "☀️ Good Morning";
        }

        if (hour < 14) {
            return "🌤 Good Noon";
        }

        if (hour < 18) {
            return "🌇 Good Afternoon";
        }

        return "🌙 Good Evening";

    }

    function getIcon(type) {

        switch (type) {

            case"Clear":
                return "☀️";

            case"Clouds":
                return "☁️";

            case"Rain":
                return "🌧️";

            case"Drizzle":
                return "🌦️";

            case"Thunderstorm":
                return "⛈️";

            case"Snow":
                return "❄️";

            case"Mist":
            case"Fog":
            case"Haze":
                return "🌫️";

            default:
                return "🌤️";

        }

    }

    function isBadWeather() {

        return CONFIG.WEATHER.BAD_TYPES.includes(current.type);

    }

    function allowBypass() {

        return isBadWeather() && CONFIG.WEATHER.ENABLE_BYPASS;

    }

    function setFake(type) {

        CONFIG.DEV.fakeWeather = type;

        applyFakeWeather();

        render();

    }

    return {

        init,

        getGreeting,

        isBadWeather,

        allowBypass,

        setFake

    };

})();