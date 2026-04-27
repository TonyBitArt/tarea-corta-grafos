import { Graph } from "./Graph.js";


export class AlgorithmGA {
    #graph;
    #colorCount;
    #population;
    #initialPopulation;

    constructor(graph, colorCount) {
        this.#graph = graph;
        this.#colorCount = colorCount;
        this.#population = [];
        this.#initialPopulation = 50;
    }

    #generateIndividual() {
        const chromosome = [];
        for (let i = 0; i < this.#graph.vertexCount; i++) {
            const randomColor = Math.floor(Math.random() * this.#colorCount) + 1;
            chromosome.push(randomColor);
        }
        return chromosome;
    }

    generatePopulation() {
        for (let i = 0; i < this.#initialPopulation; i++) {
            this.#population.push(this.#generateIndividual());
        }
    }

    get population() {
        return this.#population;
    }

    #calculateConflicts(chromosome) {
        let conclictCount = 0;

        for (let i = 0; i < this.#graph.vertexCount; i++) {
            for (let j = i + 1; j < this.#graph.vertexCount; j++) {
                if (this.#graph.areAdjacent(i, j) && chromosome[i] === chromosome[j]) {
                    conclictCount ++;
                }
            }
        }

        return conclictCount;
    }

    calculateFitness(chromosome) {
        this.#graph.randomizeMatrix();
        this.#graph.printMatrix();
        console.log(this.#calculateConflicts(chromosome));
    }
}

let prueba = new AlgorithmGA(new Graph(20), 4);

prueba.generatePopulation();
console.log(prueba.population[0])
prueba.calculateFitness(prueba.population[0]);
