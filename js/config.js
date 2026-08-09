const CONFIG = {
    STORAGE: "supabase", // supabase | local
    CHECKIN_TIME: "08:05",
    SATURDAY_CHECKIN_TIME: "08:30",
    BAD_WEATHER_DAYS: [
        // "2026-08-21"
    ],
    QUOTE_AFTER_CHECKIN: true,
    SHOW_WEATHER: true,
    SHOW_CLOCK: true,
    SUPABASE: {
        URL: "https://shhwjopxeymidbjrsxcg.supabase.co",
        ANON_KEY: "sb_publishable_Mqm5ip_Bs705ZOXM6Q1pMQ_N8egszij"
    },
    WEATHER: {
        API_KEY: "64d9a7688d55e767204e52e2f24f4c08",
        LAT: 21.0285,
        LON: 105.8542,
        UNITS: "metric",
        LANG: "vi",
        BAD_TYPES: [
            "Rain",
            "Thunderstorm",
            "Drizzle",
            "Snow"
        ],
        ENABLE_BYPASS: false
    },
    GIFTS: [
        {
            id: "gift_late_forgive",
            streak: 2,
            title: "🕊️ Trừ 1 ngày đi muộn",
            description: "Phần thưởng cho sự chăm chỉ của chị trong 2 ngày đúng giờ liên tiếp sẽ được miễn 1 ngày đi muộn. Cố gắng giữ vững phong độ nhé! ✨",
            icon: "🕊️",
            repeatable: true,
            effect: "late_forgive"
        },
        {
            id: "gift_tea",
            streak: 4,
            title: "🍵 Phần thưởng cho người xứng đáng",
            description: "Xin chào người đẹp! 4 ngày đi làm sớm liên tiếp rồi đó, vip thật!!! Chút nữa nhớ để ý điện thoại nhận quà ha! 🍵",
            icon: "🍵",
            repeatable: false
        }
    ],
    QUOTES: [
        "Have a beautiful morning! 💖",
        "Remember to aim for progress, not perfection. Have a great day!",
        "Wishing you a successful day!",
        "Today is a gift. Let’s cherish the present.",
        "Good morning! How did you sleep?",
        "Every morning is a chance to start anew.",
        "Have an amazing day!"
    ],
    CHECKIN_QUOTES: {
        EARLY: [
            "Đúng giờ như một lời hứa nhỏ mỗi sáng💖",
            "Proud of you for beating the alarm clock today! Go conquer your workday!",
            "Dậy sớm để thành công ^^",
            "Are you tired? Because you’ve been running through my mind all night. Have a great day!",
            "Bạn đang xây một thói quen đáng tự hào, tiếp tục nhé!",
            "Do u know why the sun rises every morning? Just to see your beautiful smile",
        ],
        LATE: [
            "Hôm nay hơi muộn rồi nhé! =.=",
            "Chắc lại nướng thêm 5 phút cuối đúng không nào 😏",
            "Không sao, hôm nay chậm một chút, mai mình dậy sớm hơn nhé.",
            "Đồng hồ báo thức lại thắng c một lần nữa rồi ⏰",
            "Ghi nhận một ngày hơi muộn, cố đúng giờ hơn vào ngày mai nhé.",
            "C định làm bông hoa nở muộn nhất hôm nay sao? =.="
        ]
    },
    // - CONFIG.DEV.useTestTable: true → app tự chuyển sang đọc/ghi bảng journey_checkins_test (nhớ tạo bảng này trên Supabase như SQL đã gửi trước).
// - CONFIG.DEV.fakeDate: "2026-08-10" → app coi ngày đó là "hôm nay" (đã có sẵn từ trước, không cần code gì thêm).
    DEV: {
        // fakeDate: "2026-08-08",
        fakeDate: null,
        fakeTime: null,
        fakeWeather: null,
        disableWeatherApi: false,
        useTestTable: false
    },
    STATUS: {
        EARLY: "early",
        ON_TIME: "on_time",
        LATE: "late"
    },

    REWARD: {
        MAX_LATE_DAYS: 5
    },

    FINISH: {
        WIN: {
            icon: "🏆",
            title: "Hoàn thành xuất sắc!",
            description: "Chị đã hoàn thành cả hành trình, không vượt quá số ngày muộn cho phép. Đi ăn 1 bữa thật ngon và nhận 1 món quà nhỏ đang chờ chị nhé! 🎁"
        },
        LOSE: {
            icon: "🤍",
            title: "Hành trình đã kết thúc",
            description: "Có vài ngày hơi trễ nhưng không sao, quan trọng là chị đã đi hết cả chặng đường rồi. Đi ăn 1 bữa thật ngon để bù đắp nha, lần sau mình cố hơn nhé! 💪"
        }
    },

};

const JOURNEY_DAYS = [
    "2026-08-03",
    "2026-08-04",
    "2026-08-05",
    "2026-08-06",
    "2026-08-07",
    "2026-08-08",
    "2026-08-10",
    "2026-08-11",
    "2026-08-12",
    "2026-08-13",
    "2026-08-14",
    "2026-08-15",
    "2026-08-17",
    "2026-08-18",
    "2026-08-19",
    "2026-08-20",
    "2026-08-21",
    "2026-08-22"
];

const STORAGE_KEYS = {
    CHECKINS: "journey_checkins",
    REWARDS: "journey_rewards",
    LAST_QUOTE: "journey_last_quote",
    LAST_CHECKIN_QUOTE_EARLY: "journey_last_checkin_quote_early",
    LAST_CHECKIN_QUOTE_LATE: "journey_last_checkin_quote_late",
    LAST_STREAK: "journey_last_streak"
};


Object.freeze(CONFIG);
Object.freeze(JOURNEY_DAYS);
Object.freeze(STORAGE_KEYS);
