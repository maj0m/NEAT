class Brain {
    constructor(inputCount, outputCount) {
        this.nodes = [];
        this.connections = [];
        this.inputCount = inputCount;
        this.outputCount = outputCount;         

        this.nonStructuralMutationChance = 0.1; // All weights are mutated with this probability
        this.structuralMutationChance = 0.1;    // One node / connection is added with this probability
    
        this.distanceFromOG = 0;
        this.fitness = 0;

        this.createDefaultNodes();
    }

    createDefaultNodes() {
        // Input Nodes
        for(let i = 0; i <  this.inputCount; i++) {
            let nodePos = createVector(100, windowHeight / (this.inputCount * 2) + i * windowHeight / this.inputCount);
            let inputNode = new Node("input", this.nodes.length, nodePos, 0);
            this.nodes.push(inputNode);
        }

        // Output Nodes
        for(let i = 0; i < this.outputCount; i++) {
            let nodePos = createVector(windowWidth - 100, windowHeight / (this.outputCount * 2) + i * windowHeight / this.outputCount);
            let outputNode = new Node("output", this.nodes.length, nodePos, 0);
            this.nodes.push(outputNode);
        }
    }

    createDefaultConnections() {
        // Connect each input to each output node
        for(let i = 0; i < this.inputCount; i++) {
            for(let j = this.inputCount; j < this.inputCount + this.outputCount; j++) {
                let connection = new Connection(this.nodes[i], this.nodes[j], random(-2, 2), 0);
                this.connections.push(connection);
            }
        }
    }

    draw(x, y, scale) {
        for(let connection of this.connections) {
            connection.draw(x, y, scale);
        }

        for(let node of this.nodes) {
            node.draw(x, y, scale);
        }
    }

    getOutputArray() {
        let outputs = [];
        for(let node of this.nodes) {
            if(node.type == "output") {
                outputs.push(node.value);
            }
        }

        if(outputs.length == 0) { print("No outputs"); }

        return outputs;
    }
    
    evaluateNodes(inputs) {
        this.clearNodeValues();

        // Loading inputs
        for(let i = 0; i < this.inputCount; i++) {
            this.nodes[i].value = inputs[i];
        }

        // Calculating outgoing node values for each of the sorted connections
        for(let i = 0; i < this.connections.length; i++) {
            if(this.connections[i].enabled) {
                this.connections[i].out.value += this.connections[i].weight * this.connections[i].in.activate();
            }
        }
    }

    clearNodeValues() {
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].value = 0;
        }
    }

    sortConnections() {
        // Sort connections by their Innovation number
        this.connections.sort((a, b) => a.innovation - b.innovation);
    }

    mutate() {
        /* ----- NON-STRUCTURAL MUTATIONS ----- */

         // Randomly mutates each Weight, dictated by mutation intensity
        for(let i = 0; i < this.connections.length; i++) {
            if(random(1) < this.nonStructuralMutationChance) {
                this.connections[i].weight = random(-2, 2);
            }
        }

        /* ----- STRUCTURAL MUTATIONS ----- */

        // Randomly add one new Node to a Connection, dictated by mutation intensity
        if (random(1) < this.structuralMutationChance) {
            let mutableConnections = this.connections.filter((connection) => connection.enabled);
            if (mutableConnections.length > 0) {
                const mutationIndex = floor(random(mutableConnections.length));
                this.addNode(mutableConnections[mutationIndex]);
            }
        }
        

        // Randomly add one new Connection between two Nodes that arent connected, dictated by mutation intensity
        if(random(1) < this.structuralMutationChance) {
            let mutableNodes = [];
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = i + 1; j < this.nodes.length; j++) {
                    if(this.canConnect(this.nodes[i], this.nodes[j]) && !this.isConnected(this.nodes[i], this.nodes[j])) {
                        mutableNodes.push(createVector(i, j));
                    }
                }
            }

            if(mutableNodes.length > 0) {
                const mutationIndex = floor(random(mutableNodes.length));
                this.addConnection(this.nodes[mutableNodes[mutationIndex].x], this.nodes[mutableNodes[mutationIndex].y]);
            }
        }
    }
    
    newNode() {
        // Check if there are any connections
        if(this.connections.length <= 0) { return; }

        // Add a Node to an enabled Connection
        for(let maxAttempts = 0; maxAttempts < 20; maxAttempts++) {
            let randomId = floor(random(0, this.connections.length));
            if(this.connections[randomId].enabled) {
                this.addNode(this.connections[randomId]);
                break;
            }
        }
    }

    newConnection() {
        // Add a new Connection between nodes that arent connected
        for(let maxAttempts = 0; maxAttempts < 20; maxAttempts++) {
            let a = floor(random(0, this.nodes.length));
            let b = floor(random(a, this.nodes.length));
            if(this.canConnect(this.nodes[a], this.nodes[b]) && !this.isConnected(this.nodes[a], this.nodes[b])) {
                this.addConnection(this.nodes[a], this.nodes[b]);
                break;
            }
        }
    }

    isConnected(node1, node2) {
        for(let i = 0; i < this.connections.length; i++) {
            if( node1 == this.connections[i].in && node2 == this.connections[i].out ||
                node1 == this.connections[i].out && node2 == this.connections[i].in) {
                    return true;
            }
        }
        return false;
    }

    
    canConnect(node1, node2) {
        // Two nodes can connect if they are not in the same layer
       return node1.pos.x != node2.pos.x;
    }

    getNodeFromIndex(index) {
        for(let node of this.nodes) {
            if(node.index == index) {
                return node;
            }
        }
        return null;
    }


    addNode(connection) {
        if(connection.enabled) {
            connection.enabled = false;
            let newNodePos = createVector((connection.in.pos.x + connection.out.pos.x) / 2, (connection.in.pos.y + connection.out.pos.y) / 2);
            
            globalInnovation += 1;
            let newNode = new Node("hidden", this.nodes.length, newNodePos, globalInnovation);
    
            globalInnovation += 1;
            let inConnection = new Connection(connection.in, newNode, connection.weight, globalInnovation);
    
            globalInnovation += 1;
            let outConnection = new Connection(newNode, connection.out, random(-2, 2), globalInnovation);
    
            this.nodes.push(newNode);
            this.connections.push(inConnection);
            this.connections.push(outConnection);
            this.sortConnections();
        }

        else {
            // Not a bug / problem, so just log it
            console.log("Can't add Node to Connection with innovation " + connection.innovation + ", because it is not enabled. ( addNode() )");
        }
    }

    addConnection(node1, node2) {        
        if(this.canConnect(node1, node2) && !this.isConnected(node1, node2)) {
            let newConnection;

            globalInnovation += 1;
            if(node1.pos.x < node2.pos.x) {
                newConnection = new Connection(node1, node2, random(-2, 2), globalInnovation);
            } else {
                newConnection = new Connection(node2, node1, random(-2, 2), globalInnovation);
            }
            
            this.connections.push(newConnection);
            this.sortConnections();
        }

        else {
            console.log("Can't connect Node" + node1.index + " to Node " + node2.index + " ( addConnection() )");
        }
    }

    distanceTo(otherBrain) {
        let similarGenes = 0;
        let disjointGenes = 0;
        let excessGenes = 0;        
        let weightDifference = 0;   // Average weight difference of matching genes
        let genomeLength = 0;       // Number of genes in longer genome

        let c1 = 1;                 // Importance of Excess Genes
        let c2 = 1;                 // Importance of Disjoint Genes
        let c3 = 0.1;               // Importance of Average Weight Difference of matching Genes

        let gene1Index = 0;         // Genes of this network
        let gene2Index = 0;         // Genes of other network

        while(gene1Index < this.connections.length && gene2Index < otherBrain.connections.length) {
            let gene1 = this.connections[gene1Index];
            let gene2 = otherBrain.connections[gene2Index];


            // Similar genes
            if(gene1.innovation == gene2.innovation) {
                similarGenes++;
                weightDifference += abs(gene1.weight - gene2.weight);

                gene1Index++;
                gene2Index++;
            }
            
            // Disjoint gene of this network
            else if(gene1.innovation < gene2.innovation) {
                disjointGenes++;

                gene1Index++;
            }

            // Disjoint gene of other network
            else {
                disjointGenes++;

                gene2Index++;
            }
        }

        // Average of total weight difference in similar genes
        if(similarGenes != 0) {
            weightDifference /= similarGenes;
        }

        // Excess genes are the extra genes of the longer genome
        if(this.connections.length > otherBrain.connections.length) {
            genomeLength = this.connections.length;
            excessGenes = genomeLength - gene1Index;
            
        } else {
            genomeLength = otherBrain.connections.length;
            excessGenes = genomeLength - gene2Index;
        }

        // Genome lenght is used to normalize for genome size, can be set to 1 if both genomes are small
        if(genomeLength < 20) {
            genomeLength = 1;
        }

        let distance = c1 * (excessGenes / genomeLength)
                     + c2 * (disjointGenes / genomeLength)
                     + c3 * weightDifference;
        
        return distance;
    }

    clone() {
        let newBrain = new Brain(this.inputCount, this.outputCount);
        
        // Clone nodes
        newBrain.nodes = [];
        for(let i = 0; i < this.nodes.length; i++) {
            newBrain.nodes.push(this.nodes[i].copy());
        }

        // Clone connections
        for(let i = 0; i < this.connections.length; i++) {
           newBrain.inheritConnection(this.connections[i]);
        }

        return newBrain;
    }

    inheritConnection(connection) {
        let nodeA = this.getNodeFromIndex(connection.in.index);
        if(!nodeA) {
            nodeA = connection.in.copy();
            this.nodes.push(nodeA);
        }

        let nodeB = this.getNodeFromIndex(connection.out.index);
        if(!nodeB) {
            nodeB = connection.out.copy();
            this.nodes.push(nodeB);
        }

        let newGene = new Connection(   nodeA,
                                        nodeB,
                                        connection.weight,
                                        connection.innovation,
                                        connection.enabled
        ); 

        this.connections.push(newGene);           
    }


    // Assumes that this (parentA) is the more fit parent
    crossOver(otherBrain) {
        let parentA = this;
        let parentB = otherBrain;

        let childBrain = new Brain(parentA.inputCount, parentA.outputCount);

        let gene1Index = 0;         // Genes of this network
        let gene2Index = 0;         // Genes of other network

        while(gene1Index < parentA.connections.length && gene2Index < parentB.connections.length) {
            let gene1 = parentA.connections[gene1Index];
            let gene2 = parentB.connections[gene2Index];

            // Similar genes are inherited randomly
            if(gene1.innovation == gene2.innovation) {
                // Inherit from parent A
                if(random(0, 1) < 0.5) {
                    childBrain.inheritConnection(gene1);
                
                // Inherit from parent B                              
                } else {
                    childBrain.inheritConnection(gene2);
                }

                gene1Index++;
                gene2Index++;
            }
            
            // Disjoint genes of the fitter parent (A) are inherited
            else if(gene1.innovation < gene2.innovation) {
                childBrain.inheritConnection(gene1);

                gene1Index++;
            }

            // Disjoint genes of less fit parent (B) aren't inherited
            else {
                gene2Index++;
            }
        }

        // Excess genes of parent A are inherited
        if(parentA.connections.length > parentB.connections.length) {
            for(let i = parentB.connections.length; i < parentA.connections.length; i++) {
                childBrain.inheritConnection(parentA.connections[i]);
            }
        }

        return childBrain;
    }



    // DEBUG FUNCTION
    checkMultipleConnections() {
        for(let i = 0; i < this.connections.length; i++) {
            let connection = this.connections[i];
            for(let j = i + 1; j < this.connections.length; j++) {
                let otherConnection = this.connections[j];
                if(connection.in == otherConnection.in && connection.out == otherConnection.out) {
                    print("Multiple connections between nodes " + connection.in + " and " + connection.out);
                }
            }
        }
    }
}