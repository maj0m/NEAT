class GUI {
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.width = w;
        this.height = h;

        this.drawAmount = 5;
        this.startIndex = 0;
    } 

    shiftStartIndex(amount) {
        this.startIndex += amount;
        if(this.startIndex < 0) this.startIndex = 0;
    }

    draw(agents, population) {
        fill(100, 105, 110, 255);
        rect(this.pos.x, this.pos.y, this.width, this.height);

        const scale = (this.width / windowWidth) / this.drawAmount * 0.6;

        for(let i = this.startIndex; i < this.drawAmount + this.startIndex; i++) {
            if(agents[i]) {
                let offset = this.width / (this.drawAmount+2) * ((i % 5) + 1);

                const X = this.pos.x + offset;
                const Y = this.pos.y + 200;
                
                fill(agents[i].color);
                circle(X, Y - 20, 30);

                textSize(32);
                if(agents[i].alive) text("ALIVE", X + 20, Y - 10);
                else                text("DEAD", X + 20, Y - 10);

                agents[i].brain.draw(X, Y, scale);

                let species = 0;
                for(let j = 0; j < population.species.length; j++) {
                    for(let k = 0; k < population.species[j].members.length; k++) {
                        if(population.species[j].members[k] == agents[i].brain) {
                            species = j;
                            break;
                        }
                    }
                }
                textSize(20);
                text("Species: " + species, X, Y + 100);
            } 
            
            else {
                print("You cant go that way! (GUI.draw()) 8-D");
            }
        }   
    }
}