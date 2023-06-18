let globalInnovation = 0; // Innovation is incremented by 1 after every STRUCTURAL mutation (new Node/Connection)

const brainCount = 100;
const inputCount = 3;
const outputCount = 1;

let simulation;

let startIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textSize(20);
  
  simulation = new Simulation(brainCount, inputCount, outputCount);
}



function draw() {
  background(50);
  //brains.draw();
  //gui.draw();

  simulation.update();
  simulation.draw();
}



function keyPressed() {
  if(keyCode == 32) { // Space
    simulation.killAll();
  }

  if(keyCode == 37) {
    simulation.gui.shiftStartIndex(-5);
  }

  if(keyCode == 39) {
    simulation.gui.shiftStartIndex(5);
  }
}


