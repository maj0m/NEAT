const obstacleDistance = 300;
const obstacleCount = 10;
const obstacleSpeed = 5;
const gravity = 0.4;

class Simulation {
    constructor(agentCount, inputCount, outputCount) {
        this.agentCount = agentCount;
        this.inputCount = inputCount;
        this.outputCount = outputCount;

        this.obstacles = this.createObstacles();
        this.brains = new Population(brainCount);
        this.agents = this.createAgents(this.brains, this.obstacles); 

        this.totalAlive = 0;
        this.totalGenerations = 1;
        this.score = 0;
        this.highScore = 0;

        this.gui = new GUI(windowWidth / 2, 0, windowWidth/2, windowHeight, this.agents);
    }

    update() {
        this.score++;

        for(let ob of this.obstacles) {
            ob.update();
          }

        this.totalAlive = 0;
        for(let agent of this.agents) {
            if(agent.alive) {
                this.totalAlive += 1;
                agent.update();
            }
        }

        if(this.totalAlive == 0 || this.score > 999) {
            this.newGeneration();
        }
    }

    draw() {
        for(let ob of this.obstacles) {
            ob.draw();
          }
    
        for(let agent of this.agents) {
            if(agent.alive) {
                agent.draw();
            }
        }

        this.drawStats();
        this.gui.draw(this.agents, this.brains);
        
    }

    drawStats() {
        fill(120, 120, 120, 200);
        rect(0, 0, 550, 100);

        fill(0);
        
        textSize(30);
        text("Alive: " + this.totalAlive + "  / " + this.agents.length, 20, 40);
        text("Generation: " + this.totalGenerations, 20, 80);
        text("Score: " + this.score, 300, 40);
        text("High Score: " + this.highScore, 300, 80);
    }

    createObstacles() {
        let newObstacles = [];
        for(let i = 0; i < obstacleCount; i++) {
          let ob = new Obstacle(800 + i*obstacleDistance, random(windowHeight/4, 3*windowHeight/4));
          newObstacles.push(ob);
        }
        return newObstacles;
      }
      
    createAgents(brains, obstacles) {
    let newAgents = [];
    for(let i = 0; i < brains.species.length; i++) {
        for(let j = 0; j < brains.species[i].members.length; j++) {
        let agent = new Agent(brains.species[i].members[j], obstacles);
        newAgents.push(agent);
        }
    }
    return newAgents;
    }

    calculateFitness() {
        // Updating fitness of each agent
        for(let i = 0; i < this.agents.length; i++) {
            this.agents[i].brain.fitness = this.agents[i].score; 
            //print("Agent " + i + " fitness: " + agents[i].score);
    
            if(this.agents[i].score > this.highScore) {
                this.highScore = this.agents[i].score;
            }
        }
    }
    
    newGeneration() {
        this.score = 0;
        this.totalGenerations++;
        this.obstacles = this.createObstacles();

        this.calculateFitness();
        this.brains.newGeneration();
        this.agents = this.createAgents(this.brains, this.obstacles);
    }

    killAll() {
        for(let agent of this.agents) {
            agent.alive = false;
        }
    }
}