const n = 1000;
const dt = 0.02;
const frictionHalfLife = 0.040;
const rMax = 0.075;
const m = 6;
const interactionMatrix = randomMatrix();
const forceFactor = 8;
const radius = 2;

const frictionFactor = Math.pow(0.5, dt/frictionHalfLife);

const colors = [n];
const positionsX = [n];
const positionsY = [n];
const velocitiesX = [n];
const velocitiesY = [n];

function setup() { 
  colorMode(HSB);       
  createCanvas(windowWidth, windowWidth);
  for (let i = 0; i < n; i++) {
    colors[i] = floor(random() * m);
    positionsX[i] = random();
    positionsY[i] = random(0.5);
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


    if (positionsX[i] < 0) {
      positionsX[i] = 1- radius/width;
    } 
    else if (positionsX[i] > 1) {
      positionsX[i] = 0 + radius/width;
    }
       else if (positionsY[i] < 0) {
      positionsY[i] = 0.5- radius/height;
    } else if (positionsY[i] > 0.5) {
      positionsY[i] = 0 + radius/height;
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

