class Species {
    constructor() {
        this.members = [];
    }

    getAdjustedFitnessTotal() {
         let totalFitness = 0;
        
        for(let i = 0; i < this.members.length; i++) {
            totalFitness += this.members[i].fitness / this.members.length;        // Adjusted fitness for each individual is added to the total
        }

        return totalFitness;
    }

    getNextGenPop(populationMeanAdjustedFitnessTotal) {
        let adjustedFitnessTotal = this.getAdjustedFitnessTotal();

        return (adjustedFitnessTotal / populationMeanAdjustedFitnessTotal) * this.members.length;
    }

    orderMembersByFitness() {
        // Descending order of fitness
        this.members.sort((a, b) => b.fitness - a.fitness);
    }
}