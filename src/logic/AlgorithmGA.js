import { Graph } from "./Graph.js";
import { randomSample } from "../utils/randomSample.js";

export class AlgorithmGA {
    #graph;
    #colorCount;
    #population;
    #initialPopulation;
    #mutationRate;

    constructor(graph, colorCount, mutationRate) {
        this.#graph = graph;
        this.#colorCount = colorCount;
        this.#population = [];
        this.#initialPopulation = 50;
        this.#mutationRate = mutationRate;
    }

    #generateIndividual() {
        const chromosome = [];
        for (let i = 0; i < this.#graph.vertexCount; i++) {
            const randomColor = Math.floor(Math.random() * this.#colorCount) + 1;
            chromosome.push(randomColor);
        }

        const fitnnessScore = this.#calculateFitness(chromosome);

        return {individual: chromosome, conflicts: fitnnessScore}
    }

    #generatePopulation() {
        for (let i = 0; i < this.#initialPopulation; i++) {
            this.#population.push(this.#generateIndividual());
        }
    }

    get population() {
        return this.#population;
    }

    // todo lo nuevo
    #calculateFitness(chromosome) {
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

    #tournamentSelection() {
        let selectedItems = randomSample(this.#population, 4);
        selectedItems.sort((a, b) => a.conflicts -  b.conflicts);

        return selectedItems.slice(0, 2);
    }

    #crossover(parentA, parentB) {
        const childGenes = [];
        const len = parentA.individual.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                childGenes.push(parentA.individual[i]);
            } else {
                childGenes.push(parentB.individual[i]);
            }
        }

        return childGenes;
    }

    #mutation (chromosome) {
        if (Math.random() < this.#mutationRate) {
            const randomVertex = Math.floor(Math.random() * this.#graph.vertexCount);
            let randomColor = Math.floor(Math.random() * this.#colorCount) + 1;

            while (randomColor === chromosome[randomVertex]) {
                randomColor = Math.floor(Math.random() * this.#colorCount) + 1;
            }
            
            chromosome[randomVertex] = randomColor;
        }

        return chromosome;
    }

    geneticAlgorithm() {
        this.#generatePopulation();
        this.#population.sort((a, b) => a.conflicts - b.conflicts);
        
        let currentGeneration = 0;
        let bestIndividual = this.#population[0];
        const bestIndividualsList = [bestIndividual];

        while (currentGeneration < 100 && bestIndividual.conflicts !== 0) {
            const newPopulation = [];

            while (newPopulation.length < this.#initialPopulation) {
                const [parentA, parentB] = this.#tournamentSelection();
                let childGenes;

                if (Math.random() < 0.8) {
                    childGenes = this.#crossover(parentA, parentB);
                } else {
                    childGenes = [...parentA.individual];
                }

            childGenes = this.#mutation(childGenes);

            const childFitness = this.#calculateFitness(childGenes);
            newPopulation.push({individual: childGenes, conflicts: childFitness});
            }

        this.#population = newPopulation;
        this.#population.sort((a, b) => a.conflicts - b.conflicts);

        bestIndividual = this.#population[0];
        bestIndividualsList.push(bestIndividual);

        currentGeneration ++;
        }

        return {bestSolution: bestIndividual, generations: currentGeneration, history: bestIndividualsList};
    }
}