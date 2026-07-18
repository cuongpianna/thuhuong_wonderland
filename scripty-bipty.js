//sets canvas variable and makes it take up whole screen
var canvas = document.getElementById("starfield")
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

//draws pretty stars for the background!
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var canvas = document.getElementById("starfield"),
context = canvas.getContext("2d"),
stars = 500,
colorrange = [0,60,240];
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    y = Math.random() * canvas.offsetHeight,
    radius = Math.random() * 1.2,
    hue = colorrange[getRandom(0,colorrange.length - 1)],
    sat = getRandom(50,100);
    context.beginPath();
    context.arc(x, y, radius, 0, 360);
    context.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
    context.fill();
}

//keeps track of frame number for timing
var frameNumber = 0;
//keeps track of opacity so it can be changed in the draw loop
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;
//captures the background image so it can be redrawn at the beginning of each frame
var baseFrame = context.getImageData(0,0,window.innerWidth,window.innerHeight);

//the big bad draw loop. The field of my labours, holder of my tears T.T
function draw() {
    //redraws background image to reset the text at beginning of the animation frame
    context.putImageData(baseFrame,0,0);
    //fades in text by increasing opacity

    

    if(frameNumber < 99999){
    console.log(frameNumber);
        frameNumber++;
    }
    window.requestAnimationFrame(draw);
}

//starts the draw loop
window.requestAnimationFrame(draw);