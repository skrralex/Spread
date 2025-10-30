let people = [];
let immunitySlider;
let population = 200;
let infectionRadius = 30;
let infectionChance = 0.2;
let recoveryTime = 500; // frames (~10s)
let immunityRate = 0.3; // 30%

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  immunitySlider = createSlider(0, 100, immunityRate * 100, 1);
  immunitySlider.position(20, 20);
  immunitySlider.style('width', '200px');

  resetSimulation();
}

function resetSimulation() {
  people = [];
  immunityRate = immunitySlider.value() / 100;

  for (let i = 0; i < population; i++) {
    let state = "susceptible";
    if (random() < immunityRate) state = "immune";
    people.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      state,
      timer: 0
    });
  }

  // Infect one random person
  let infected = random(people);
  if (infected.state === "susceptible") infected.state = "infected";
}

function draw() {
  background(0, 0, 0, 50);

  immunityRate = immunitySlider.value() / 100;
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Immunity: ${immunitySlider.value()}%`, 240, 20);

  for (let p of people) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // infection spread
    if (p.state === "infected") {
      for (let other of people) {
        if (other.state === "susceptible") {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < infectionRadius && random() < infectionChance) {
            other.state = "infected";
          }
        }
      }
      p.timer++;
      if (p.timer > recoveryTime) {
        p.state = "immune";
      }
    }

    // draw
    if (p.state === "infected") fill(255, 50, 50);
    else if (p.state === "immune") fill(0, 255, 100);
    else fill(220);
    circle(p.x, p.y, 6);
  }

  // Auto reset when infection ends
  let infectedCount = people.filter(p => p.state === "infected").length;
  if (infectedCount === 0) {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Simulation ended — adjust immunity to restart", width / 2, height / 2);
    if (frameCount % 120 === 0) resetSimulation();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
