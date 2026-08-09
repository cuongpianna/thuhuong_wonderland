/* =====================================
        STAR BACKGROUND
===================================== */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createStars();
}

window.addEventListener("resize", resizeCanvas);

function createStars() {

    stars = [];

    const amount = Math.floor((canvas.width * canvas.height) / 9000);

    for (let i = 0; i < amount; i++) {

        stars.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height,

            radius: Math.random() * 1.8 + .2,

            speed: Math.random() * .25 + .05,

            alpha: Math.random(),

            direction: Math.random() > .5 ? 1 : -1

        });

    }

}

function drawStars() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {

        ctx.beginPath();

        ctx.arc(

            star.x,

            star.y,

            star.radius,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;

        ctx.fill();

        star.alpha += star.direction * 0.003;

        if (star.alpha >= 1) {

            star.direction = -1;

        }

        if (star.alpha <= .2) {

            star.direction = 1;

        }

        star.y += star.speed;

        if (star.y > canvas.height) {

            star.y = 0;

            star.x = Math.random() * canvas.width;

        }

    });

    requestAnimationFrame(drawStars);

}

resizeCanvas();

drawStars();

/* =====================================
      SCROLL REVEAL
===================================== */

const items = document.querySelectorAll(".timeline-item");

function revealItems() {

    const trigger = window.innerHeight * .82;

    items.forEach(item => {

        const top = item.getBoundingClientRect().top;

        if (top < trigger) {

            item.classList.add("show");

        }

    });

}

window.addEventListener("scroll", revealItems);

revealItems();

/* =====================================
      HERO FADE
===================================== */

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

    const y = window.scrollY;

    hero.style.opacity = Math.max(1 - y / 450, 0);

});

/* =====================================
      TIMELINE GLOW
===================================== */

const line = document.querySelector(".timeline-line");

window.addEventListener("scroll", () => {

    const max = document.body.scrollHeight - window.innerHeight;

    const percent = window.scrollY / max;

    const glow = 20 + percent * 60;

    line.style.boxShadow = `0 0 ${glow}px hotpink`;

});

/* =====================================
      DOT PULSE
===================================== */

const dots = document.querySelectorAll(".timeline-dot");

setInterval(() => {

    dots.forEach(dot => {

        dot.animate(

            [

                {

                    transform: "scale(1)"

                },

                {

                    transform: "scale(1.08)"

                },

                {

                    transform: "scale(1)"

                }

            ],

            {

                duration: 1800,

                easing: "ease-in-out"

            }

        );

    });

}, 2200);

/* =====================================
      LINK HOVER SPARKLE
===================================== */

document.querySelectorAll(".timeline-content a").forEach(link => {

    link.addEventListener("mouseenter", () => {

        link.animate(

            [

                {

                    letterSpacing: "0px"

                },

                {

                    letterSpacing: "2px"

                },

                {

                    letterSpacing: "0px"

                }

            ],

            {

                duration: 500

            }

        );

    });

});

/* =====================================
      PARALLAX
===================================== */

const gradient = document.querySelector(".gradient");

window.addEventListener("scroll", () => {

    gradient.style.transform = `translateY(${window.scrollY * .15}px)`;

});

/* =====================================
      SMOOTH INTRO
===================================== */

window.addEventListener("load", () => {

    document.body.animate(

        [

            {

                opacity: 0

            },

            {

                opacity: 1

            }

        ],

        {

            duration: 1000,

            easing: "ease"

        }

    );

});
