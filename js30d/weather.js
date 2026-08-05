/* ==========================================
    WEATHER SERVICE
========================================== */

const Weather = (() => {

    const CITY = "Hanoi";

    const LAT = 21.0285;
    const LON = 105.8542;

    /* --------------------------------------
        Weather Code
    -------------------------------------- */

    const WEATHER_CODES = {

        0: {
            icon: "☀️",
            text: "Clear Sky"
        },

        1: {
            icon: "🌤️",
            text: "Mostly Clear"
        },

        2: {
            icon: "⛅",
            text: "Partly Cloudy"
        },

        3: {
            icon: "☁️",
            text: "Cloudy"
        },

        45: {
            icon: "🌫️",
            text: "Fog"
        },

        51: {
            icon: "🌦️",
            text: "Light Drizzle"
        },

        61: {
            icon: "🌧️",
            text: "Rain"
        },

        63: {
            icon: "🌧️",
            text: "Moderate Rain"
        },

        65: {
            icon: "🌧️",
            text: "Heavy Rain"
        },

        80: {
            icon: "🌦️",
            text: "Rain Showers"
        },

        95: {
            icon: "⛈️",
            text: "Thunderstorm"
        }

    };

    /* --------------------------------------
        Fetch Weather
    -------------------------------------- */

    async function load() {

        try {

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code`;

            const response = await fetch(url);

            const json = await response.json();

            const current = json.current;

            const weather = WEATHER_CODES[current.weather_code] || {

                icon: "🌤️",

                text: "Unknown"

            };

            return {

                city: CITY,

                temperature: Math.round(

                    current.temperature_2m

                ),

                code: current.weather_code,

                icon: weather.icon,

                text: weather.text

            };

        }

        catch (e) {

            console.error(e);

            return {

                city: CITY,

                temperature: "--",

                code: -1,

                icon: "❓",

                text: "Unavailable"

            };

        }

    }

    /* --------------------------------------
        Weather Pass
    -------------------------------------- */

    function canUseWeatherPass(code) {

        const allow = [

            61,

            63,

            65,

            80,

            95

        ];

        return allow.includes(code);

    }

    /* --------------------------------------
        Public
    -------------------------------------- */

    return {

        load,

        canUseWeatherPass

    };

})();