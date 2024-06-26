const n = 800;
const dt = 0.02;
const frictionHalfLife = 0.050;
const rMax = 0.06;
const m = 7;
const interactionMatrix = randomMatrix();
const forceFactor = 8;
const wrapAroundScaler = 2;
const radius = 3;
let short;
let long;

let rotationOfScreen;

const frictionFactor = Math.pow(0.5, dt/frictionHalfLife);

const colors = [n];
const positionsX = [n];
const positionsY = [n];
const velocitiesX = [n];
const velocitiesY = [n];

function setup() { 
  colorMode(HSB);  
  long = max(windowWidth, windowHeight);
  short = min(windowWidth, windowHeight); 
  rotationOfScreen = (windowWidth > windowHeight)    
  createCanvas(long, long);
  for (let i = 0; i < n; i++) {
    colors[i] = floor(random() * m);
    positionsX[i] = random();
    positionsY[i] = random(windowHeight/windowWidth);
    velocitiesX[i] = 0;
    velocitiesY[i] = 0;
  }
}

function randomMatrix() {
  const rows = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < m; j++) {
      row.push(Math.random() * 2 - 1);
    }
    rows.push(row);
  }
  return rows;
}

function draw() {
  //update
  updateParticles();
  //draw
  background(0);
  for (let i = 0; i < n; i++) {
    let screenX = positionsX[i] * width;
    let screenY = positionsY[i] * height;

    noStroke();
    fill(255 * (colors[i]/m), 255, 255);
    circle(screenX, screenY, radius);
  }
}

function updateParticles() {
  //update velocity
  for (let i = 0; i < n; i++) {
    let totalForceX = 0;
    let totalForceY = 0;

    for (let j = 0; j < n; j++) {
      if (i === j ) continue;
      const rx = positionsX[j] - positionsX[i];
      const ry = positionsY[j] - positionsY[i];
      const r = Math.hypot(rx, ry);
      if (r > 0 && r < rMax) {
        const f = force(r / rMax, interactionMatrix[colors[i]][colors[j]]);
        totalForceX += rx / r * f;
        totalForceY += ry / r * f;

      }
    }

    totalForceX *= rMax * forceFactor;
    totalForceY *= rMax * forceFactor;

    velocitiesX[i] *= frictionFactor;
    velocitiesY[i] *= frictionFactor;

    velocitiesX[i] += totalForceX * dt;
    velocitiesY[i] += totalForceY * dt;
  }

  //update position
  for (let i = 0; i < n; i++) {
    positionsX[i] += velocitiesX[i] * dt;
    positionsY[i] += velocitiesY[i] * dt;

    if (rotationOfScreen) {
    if (positionsX[i] < 0) {
      positionsX[i] = 1- radius/width;
      velocitiesX[i] *= wrapAroundScaler;
    } 
    else if (positionsX[i] > 1) {
      positionsX[i] = 0 + radius/width;
      velocitiesX[i] *= wrapAroundScaler;
    } else if (positionsY[i] < 0) {
      positionsY[i] = windowHeight/windowWidth - radius/height;
      velocitiesY[i] *= wrapAroundScaler;
    } else if (positionsY[i] > windowHeight/windowWidth) {
      positionsY[i] = 0 + radius/height;
      velocitiesY[i] *= wrapAroundScaler;
      }
  } else {
    if (positionsX[i] < 0) {
      positionsX[i] = windowWidth/windowHeight- radius/width;
      velocitiesX[i] *= wrapAroundScaler;
    } 
    else if (positionsX[i] > windowWidth/windowHeight) {
      positionsX[i] = 0 + radius/width;
      velocitiesX[i] *= wrapAroundScaler;
    } else if (positionsY[i] < 0) {
      positionsY[i] = 1 - radius/height;
      velocitiesY[i] *= wrapAroundScaler;
    } else if (positionsY[i] > 1) {
      positionsY[i] = 0 + radius/height;
      velocitiesY[i] *= wrapAroundScaler;
      }
    }
  }
}
function force(r, a) {
  let beta = 0.3;
  if (r < beta) {
    return r / beta - 1;
  }
  else if ( beta < r && r < 1) {
    return a * (1 -abs(2 * r-1 -beta) / (1-beta));
  } else
  return 0;


}

