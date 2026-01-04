// setup() is called once at page-load
let sunImg, moonImg, treeImg, cloudImg;
let skyPositions = [];
let landPositions = [];
let treesDrawn = new Set();
let cloudsDrawn = new Set();
let prevSecond = -1;
let prevMinute = -1; // track previous minute value

function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    console.log("p5.js sketch loaded!"); // test to verify console is workin
    console.log("testing deployment")
    
    sunImg = loadImage("images/sun2.png");
    moonImg = loadImage("images/moon.png");
    treeImg = loadImage("images/tree.png");
    cloudImg = loadImage("images/cloud1.png");
    
    skyPositions = generateSkyPositions();
    landPositions = generateLandPositions();
}

function drawObjects(targetCount, drawnSet, positionsArray, img) {
    // On first load, populate all objects immediately
    if (drawnSet.size === 0 && targetCount > 0) {
        let availableIndices = [];
        for (let i = 0; i < positionsArray.length; i++) {
            availableIndices.push(i);
        }
        
        // Shuffle and take first targetCount positions
        for (let i = availableIndices.length - 1; i > 0; i--) {
            let j = floor(random(i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
        
        for (let i = 0; i < Math.min(targetCount, availableIndices.length); i++) {
            drawnSet.add(availableIndices[i]);
        }
    }
    // Otherwise, add objects incrementally (one per frame when needed)
    else if (drawnSet.size < targetCount && drawnSet.size < positionsArray.length) {
        let availableIndices = [];
        for (let i = 0; i < positionsArray.length; i++) {
            if (!drawnSet.has(i)) {
                availableIndices.push(i);
            }
        }
        
        if (availableIndices.length > 0) {
            let randomIndex = availableIndices[floor(random(availableIndices.length))];
            drawnSet.add(randomIndex);
        }
    }
    
    // Draw all objects
    if (img) {
        imageMode(CENTER);
        drawnSet.forEach(index => {
            if (index >= 0 && index < positionsArray.length) {
                image(img, positionsArray[index].x, positionsArray[index].y);
            }
        });
    }
}

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    // Reset trees when seconds transition from 59 to 0
    if (sec === 0 && prevSecond === 59) {
        treesDrawn.clear();
    }
    prevSecond = sec;

    // Reset clouds when minutes transition from 59 to 0
    if (min === 0 && prevMinute === 59) {
        cloudsDrawn.clear();
    }

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

    // Tree drawing logic
    drawObjects(sec, treesDrawn, landPositions, treeImg);

    // Cloud drawing logic (based on minutes)
    drawObjects(min, cloudsDrawn, skyPositions, cloudImg);

    // Display hours, minutes, and seconds
    // textSize(32);
    // fill(180);
    // text(hr, 10, 30); // display hours at x=10, y=30
    // fill(100);
    // text(min, 10, 60); // display minutes at x=10, y=60
    // fill(0);
    // text(sec, 10, 90); // display seconds at x=10, y=90
}

function generateSkyPositions() {
    let positions = [];

    // Sky region = upper 1/3
    let skyTopY = 15;
    let skyBottomY = height / 3 + 30;
    let skyLeftX = width * 0.05;
    let skyRightX = width * 0.95;

    let targetCount = 60;
    let minDist = 45; // spacing between clouds

    let attempts = 0;
    let maxAttempts = 5000;

    while (positions.length < targetCount && attempts < maxAttempts) {
        let x = random(skyLeftX, skyRightX);
        let y = random(skyTopY, skyBottomY);

        let tooClose = false;
        for (let p of positions) {
            if (dist(x, y, p.x, p.y) < minDist) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) {
            positions.push({ x, y });
        }

        attempts++;
    }

    return positions;
}

function generateLandPositions() {
    let positions = [];

    let landTopY = height * 2 / 3;
    let landBottomY = height - 15;
    let landLeftX = width * 0.05;
    let landRightX = width * 0.95;

    let targetCount = 60;
    let minDist = 40; // controls spacing (tune this)

    let attempts = 0;
    let maxAttempts = 5000;

    while (positions.length < targetCount && attempts < maxAttempts) {
        let x = random(landLeftX, landRightX);
        let y = random(landTopY, landBottomY);

        let tooClose = false;
        for (let p of positions) {
            if (dist(x, y, p.x, p.y) < minDist) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) {
            positions.push({ x, y });
        }

        attempts++;
    }

    return positions;
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
    fill(255, 0, 0); // light gray dots to see positions
    for (let i = 0; i < hourPositions.length; i++) {
        circle(hourPositions[i].x, hourPositions[i].y, 10);
        // Label with hour number
        fill(0);
        textSize(12);
        text(i, hourPositions[i].x + 15, hourPositions[i].y);
        fill(255, 0, 0); // reset fill for next circle
    }
}