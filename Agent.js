class Agent {
    constructor(brain, obstacles) {
        this.brain = brain;

        this.rad = 24;
        this.pos = createVector(300, 400);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.jumpForce = 10;
        this.maxVel = 10;
        this.maxAcc = 10;
        
        this.obstacles = obstacles;
        this.nextObstacle = this.closestObstacle(this.obstacles);
        this.alive = true;
        this.score = 0;
        this.color = [random(100, 255), random(100, 255), random(100, 255)];
    }

    draw() {
      push();
      noStroke();
      fill(this.color);
      circle(this.pos.x, this.pos.y, this.rad*2);
      pop();
      //line(this.pos.x, this.pos.y, this.nextObstacle.pos.x, this.nextObstacle.pos.y);
    }

    update() {
      this.score += 1;
      
      this.nextObstacle = this.closestObstacle(this.obstacles);
      let inputs = [this.nextObstacle.pos.x / windowWidth, this.nextObstacle.pos.y / windowHeight, this.pos.y / windowHeight];

      this.brain.evaluateNodes(inputs);
      let guess = this.brain.getOutputArray();

      if(guess[0] > 0) {
        this.applyForce(-this.jumpForce);
      }

      this.applyForce(gravity);
      this.updateForces();
      this.collisionCheck(this.obstacles);
      this.edgeOfScreen();
    }

    collisionCheck(obs) {
      for(let obstacle of obs) {
        if(this.pos.x >= obstacle.A.x && this.pos.x <= obstacle.B.x) {
          if(this.pos.y <= obstacle.A.y || this.pos.y >= obstacle.C.y) {
            this.alive = false;
          }
        }
      }
    }

    closestObstacle(obstacles) {
      let minDist = Infinity;
      let closest = null;
      for(let i = 0; i < obstacles.length; i++) {
        if(obstacles[i].B.x > this.pos.x) { // Only check if its infront of us
          let distance = dist(this.pos.x, this.pos.y, obstacles[i].pos.x, obstacles[i].pos.y);
          if(distance < minDist) {
            minDist = distance;
            closest = obstacles[i];
          }
        }
      }

      return closest;
    }

    applyForce(force) {
      this.acc.add(0, force);
    }

    updateForces() {
        this.acc.limit(this.maxAcc);
        this.vel.add(this.acc);
        this.vel.limit(this.maxVel);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }


    edgeOfScreen() {
        if(this.pos.x < this.rad) {
          this.alive = false;
        } 
  
        if(this.pos.x > windowWidth - this.rad) {
          this.alive = false;
        }
        
        if(this.pos.y < this.rad) {
          this.alive = false;
        }
  
        if(this.pos.y > windowHeight - this.rad) {
          this.alive = false;
        }
      }

      
}