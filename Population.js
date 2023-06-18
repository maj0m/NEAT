class Population {
    constructor(populationSize) {
        this.species = [];
        this.breedCutOff = 0.2;

        // Create the initial population
        let population = [];
        for(let i = 0; i < populationSize; i++) {
            let newBrain = new Brain(inputCount, outputCount);
            newBrain.createDefaultConnections();
            population.push(newBrain);
        }
        
        // Speciate the initial population
        this.speciate(population);
    }

    draw() {
        for(let i = 0; i < this.species.length; i++) {
            for(let j = 0; j < this.species[i].members.length; j++) {
                this.species[i].members[j].draw(windowWidth/this.species[i].members.length * j, 50 + i * 200, 0.1);
                this.species[i].members[j].distanceFromOG = this.species[i].members[j].distanceTo(this.species[0].members[0]);
            }
        }
    }

    getMeanAdjustedFitnessTotal() {
        let totalFitness = 0;
        for(let i = 0; i < this.species.length; i++) {
          for(let j = 0; j < this.species[i].members.length; j++) {
            totalFitness += this.species[i].members[j].fitness;
          }
        }

        return (totalFitness / this.getPopulationSize());
    }

    getPopulationSize() {
        let popSize = 0;
        for(let i = 0; i < this.species.length; i++) {
            for(let j = 0; j < this.species[i].members.length; j++) {
                popSize++;
            }
        }
        
        return popSize;
    }

    speciate(population) {
        let distanceTreshold = 0.2;

        this.species = [];
        this.species.push(new Species());
        this.species[0].members.push(population[0]);
      
        for(let i = 1; i < population.length; i++) {
            let sameSpecies = false;

            for(let j = 0; j < this.species.length; j++) {
                if(population[i].distanceTo(this.species[j].members[0]) < distanceTreshold) {
                    this.species[j].members.push(population[i]);
                    sameSpecies = true;
                    break;
                }
            }
        
            if(!sameSpecies) {
                let newSpecies = new Species();
                newSpecies.members.push(population[i]);
                this.species.push(newSpecies);
            }
        }
    }
    
    // Fitness must be evaluated before creating the next generation
    newGeneration() {
        let newPopulation = [];
        let meanAdjustedFitnessTotal = this.getMeanAdjustedFitnessTotal();

        for(let i = 0; i < this.species.length; i++) {
            let speciesNextGenPop = round(this.species[i].getNextGenPop(meanAdjustedFitnessTotal));
            //print("Species " + i + " population in next generation: " + speciesNextGenPop);

            // Sort the members by fitness
            this.species[i].orderMembersByFitness();
            let cutOff = ceil(this.species[i].members.length * this.breedCutOff);

            // let breederFitnessTotal = 0;
            // for(let j = 0; j < cutOff; j++) {
            //     breederFitnessTotal += this.species[i].members[j].fitness;
            // }

            

            for(let j = 0; j < speciesNextGenPop; j++) {
                let newBrain;
                let parentA = this.species[i].members[floor(random(cutOff))];
                let parentB = this.species[i].members[floor(random(cutOff))];

                // let randomA = random(breederFitnessTotal);
                // for(let k = 0; k < cutOff; k++) {
                //     if(randomA < this.species[i].members[k].fitness) {
                //         parentA = this.species[i].members[k];
                //         break;
                //     }
                //     randomA -= this.species[i].members[k].fitness;
                // }

                // let randomB = random(breederFitnessTotal);
                // for(let k = 0; k < cutOff; k++) {
                //     if(randomB < this.species[i].members[k].fitness) {
                //         parentB = this.species[i].members[k];
                //         break;
                //     }
                //     randomB -= this.species[i].members[k].fitness;
                // }
                
                if(parentA.fitness > parentB.fitness)
                    newBrain = parentA.crossOver(parentB);
                else
                    newBrain = parentB.crossOver(parentA);

                newBrain.mutate();
                newPopulation.push(newBrain);
            }
        }

        //print("New population size: " + newPopulation.length);
        this.speciate(newPopulation);
    }



    // DEBUG FUNCTION
    checkMultipleConnections() {
        for(let i = 0; i < this.species.length; i++) {
            for(let j = 0; j < this.species[i].members.length; j++) {
                this.species[i].members[j].checkMultipleConnections();
            }
        }
    }

    
}