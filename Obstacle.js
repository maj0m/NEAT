class Obstacle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.width = 50;
        this.height = 250;
        this.speed = obstacleSpeed;

        this.A = createVector(this.pos.x - this.width / 2, this.pos.y - this.height / 2);
        this.B = createVector(this.pos.x + this.width / 2, this.pos.y - this.height / 2);
        this.C = createVector(this.pos.x - this.width / 2, this.pos.y + this.height / 2);
        this.D = createVector(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

    }

    draw() {
        push();
        noStroke();
        fill(255);
        rect(this.A.x, 0, this.width, this.A.y);
        rect(this.C.x, this.C.y, this.width, windowHeight - this.C.y);
        pop();
    }

    update() {
        this.pos.sub(this.speed, 0);

        if(this.pos.x < 0) {
            this.pos.x = obstacleCount * obstacleDistance;
            this.pos.y = random(windowHeight/3, 2*windowHeight/3);
        }

        this.A.set(this.pos.x - this.width / 2, this.pos.y - this.height / 2);
        this.B.set(this.pos.x + this.width / 2, this.pos.y - this.height / 2);
        this.C.set(this.pos.x - this.width / 2, this.pos.y + this.height / 2);
        this.D.set(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

        
    }
}