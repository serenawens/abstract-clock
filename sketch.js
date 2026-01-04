// setup() is called once at page-load
let sunImg, moonImg;

function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    console.log("p5.js sketch loaded!"); // test to verify console is workin
    
    sunImg = loadImage("images/sun.png");
    moonImg = loadImage("images/moon.png");
}

let prevMinute = -1; // track previous minute value

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    // hr = 12;

    // Print minute value to console only when it changes
    if (min !== prevMinute) {
        console.log(min);
        prevMinute = min;
    }

    // Draw background (sky and land)
    fill(135, 206, 235); // sky blue
    if (hr < 6 || hr >= 18) {
        fill(18, 32, 64); // darker night blue
    }
    noStroke();
    rect(0, 0, width, height * 2/3);
    fill(34, 139, 34); // grass green
    rect(0, height * 2/3, width, height * 1/3);

    let hourPositions = calculateHourPositions();
    
    // visualizeHourPositions(hourPositions);

    let skyObject = "sun";
    let posIdx = (hr + 12) % 12;
    if (hr < 6 || hr >= 18) {
        skyObject = "moon";
        posIdx = (hr < 6) ? hr : hr - 12;
    }
    // Draw sun or moon at the correct position
    let currentImg = (skyObject === "sun") ? sunImg : moonImg;
    if (currentImg && posIdx >= 0 && posIdx < hourPositions.length) {
        imageMode(CENTER);
        image(currentImg, hourPositions[posIdx].x, hourPositions[posIdx].y);
    }

    // textSize(32);
    // fill(180);
    // text(hr, 10, 30); // display hours at x=10, y=30

    // fill(100);
    // text(min, 10, 60); // display minutes at x=10, y=60

    // fill(0);
    // text(sec, 10, 90); // display seconds at x=10, y=90
}

function calculateHourPositions() {
    let skyHeight = height * 2/3;
    let horizonY = skyHeight;
    let skyCenterX = width / 2;
    let skyTopY = skyHeight * 0.3;
    let leftHorizonX = width * 0.1;
    let rightHorizonX = width * 0.9;
    
    let hourPositions = [];
    
    for (let i = 0; i < 12; i++) {
        let t = (i + 6) % 12;
        let angle = PI - (t * PI / 12);
        
        let radiusX = skyCenterX - leftHorizonX;
        let radiusY = horizonY - skyTopY;
        
        let x = skyCenterX + radiusX * cos(angle);
        let y = horizonY - radiusY * sin(angle);
        
        hourPositions.push({x: x, y: y});
    }
    
    return hourPositions;
}


function visualizeHourPositions(hourPositions) {
    // Visualize the 12 positions (for debugging - can remove later)
    fill(200); // light gray dots to see positions
    for (let i = 0; i < hourPositions.length; i++) {
        circle(hourPositions[i].x, hourPositions[i].y, 10);
        // Label with hour number
        // fill(0);
        // textSize(12);
        // text(i, hourPositions[i].x + 15, hourPositions[i].y);
        fill(200); // reset fill for next circle
    }
}