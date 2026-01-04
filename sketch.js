// setup() is called once at page-load
function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    console.log("p5.js sketch loaded!"); // test to verify console is working
}

let prevMinute = -1; // track previous minute value

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    // Print minute value to console only when it changes
    if (min !== prevMinute) {
        console.log(min);
        prevMinute = min;
    }

    background(225); // set bckground color

    // text for hours
    textSize(32);
    fill(180);
    text(hr, 10, 30); // display hours at x=10, y=30

    // text for minutes
    fill(100);
    text(min, 10, 60); // display minutes at x=10, y=60

    // text for seconds
    fill(0);
    text(sec, 10, 90); // display seconds at x=10, y=90
}