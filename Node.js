class Node {
    constructor(type, index, pos, innovation) {
        this.value = 0;
        this.pos = pos;
        this.type = type;
        this.index = index;
        this.innovation = innovation;
    }

    draw(x, y, scale) {
        push();

        fill(this.colorizeValue(this.value));
        circle(this.pos.x * scale + x, this.pos.y * scale + y, 5 + abs(this.value) * scale * 100);

        // strokeWeight(4);
        // stroke(0);
        // textSize(20);
        // text(this.value.toPrecision(3), this.pos.x * scale + x - 15, this.pos.y * scale + y - 15);

        pop();
    }

    copy() {
        return new Node(this.type, this.index, this.pos.copy(), this.innovation);
    }

    // Clamps any x between 0 and 1
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

     // Maps the [0,1] Sigmoid function to [-1, 1]
     activate() {
        return 2 * this.sigmoid(this.value) - 1;
    }

    colorizeValue(value) {
        return [120 - 120 * value, 120, 120 + 120 * value];
    }
}