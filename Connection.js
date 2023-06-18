class Connection {
    constructor(input, output, weight, innovation, enabled = true) {
        this.in = input;
        this.out = output;
        this.weight = weight;
        this.enabled = enabled;
        this.innovation = innovation;
    }

    draw(x, y, scale) {
        // Draw enabled connections
        if(this.enabled) {
            push();

            noFill();
            strokeWeight(1 + this.weight * scale * 10);
            stroke(this.colorizeValue(this.weight));
            //text(this.innovation, (this.in.pos.x * scale + x + this.out.pos.x * scale + x) / 2, (this.in.pos.y * scale + y + this.out.pos.y * scale + y) / 2);
            line(this.in.pos.x * scale + x, this.in.pos.y * scale + y, this.out.pos.x * scale + x, this.out.pos.y * scale + y);

            pop();     
        }
    }

    colorizeValue(value) {
        return [120 - 120 * value, 120, 120 + 120 * value];
    }
}