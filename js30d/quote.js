/* ==========================================
    QUOTES
========================================== */

const QUOTES = {

    success: [

        "A beautiful morning begins with a little promise. 🌻",

        "You did it. One more lovely morning checked in.",

        "Small steps every morning create wonderful stories.",

        "You're doing better than yesterday.",

        "Keep this little streak blooming. 🌼",

        "One smile. One check-in. One wonderful day."

    ],

    late: [

        "It's okay. Tomorrow is another chance. ❤️",

        "One late morning doesn't define your journey.",

        "Don't be too hard on yourself.",

        "Every sunrise is a chance to begin again.",

        "You're still doing great. 🌻"

    ],

    pass: [

        "Take care of yourself first. 🌧️",

        "Some mornings are simply harder than others.",

        "Rest well. We'll continue tomorrow.",

        "A pause isn't the end of the journey.",

        "Hope tomorrow greets you with sunshine."

    ],

    reward: [

        "A little surprise for a wonderful effort! 🎁",

        "You earned this. Enjoy every bit of it!",

        "Every little achievement deserves a celebration.",

        "Congratulations! Keep going!"

    ],

    streak: [

        "Consistency is quietly becoming your superpower.",

        "Look how far you've come already.",

        "Every streak starts with one morning.",

        "One more morning. One step closer.",

        "Wonderful things grow little by little."

    ],

    monday: [

        "A fresh week begins today. 🌞",

        "Monday is just another beautiful beginning.",

        "Let's make this week a lovely one."

    ],

    friday: [

        "Almost weekend! One last little push!",

        "You're nearly there. 🌼",

        "Finish this week with a smile."

    ],

    saturday: [

        "Happy Saturday! Thanks for showing up today.",

        "The weekend feels even sweeter after a good morning."

    ]

};

/* ==========================================
    RANDOM
========================================== */

function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
        ];

}

/* ==========================================
    GET BY TYPE
========================================== */

function getQuote(type = "success") {

    if (!QUOTES[type]) {

        return randomItem(QUOTES.success);

    }

    return randomItem(

        QUOTES[type]

    );

}

/* ==========================================
    GET TODAY
========================================== */

function getTodayQuote(status = "success") {

    const today = Utils.now().getDay();

    // Sunday = 0

    if (today === 1) {

        return randomItem(

            QUOTES.monday

        );

    }

    if (today === 5) {

        return randomItem(

            QUOTES.friday

        );

    }

    if (today === 6) {

        return randomItem(

            QUOTES.saturday

        );

    }

    return getQuote(status);

}

/* ==========================================
    RENDER
========================================== */

/* ==========================================
    PUBLIC
========================================== */

window.Quote = {

    getQuote,

    getTodayQuote

};