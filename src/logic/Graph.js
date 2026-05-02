import { randint } from "../utils/helperFunctions.js";
import { create, all } from 'mathjs'
const math = create(all)

export class Graph {
    #vertexCount;
    #adjacencyMatrix;

    constructor(vertexCount) {
        this.#vertexCount = vertexCount;
        this.#adjacencyMatrix = Array.from({length: vertexCount}, () => Array(vertexCount).fill(0));
    }

    addEdge(nodeU, nodeV) {
        this.#adjacencyMatrix[nodeU][nodeV] = 1;
        this.#adjacencyMatrix[nodeV][nodeU] = 1;
    }

    removeEdge(nodeU, nodeV) {
        this.#adjacencyMatrix[nodeU][nodeV] = 0;
        this.#adjacencyMatrix[nodeV][nodeU] = 0;
    }

    areAdjacent(nodeU, nodeV) {
        return this.#adjacencyMatrix[nodeU][nodeV] === 1;
    }

    loadUserMatrix(userMatrix){
        this.#adjacencyMatrix = userMatrix; 
        this.#vertexCount = userMatrix.length;
    }

    randomizeMatrix() {
        for (let i = 0; i < this.#vertexCount; i++) {
            let destination = i;
            while (destination === i || this.#adjacencyMatrix[i][destination] === 1) {
                destination = randint(0, this.#vertexCount - 1);
            }
            this.addEdge(i, destination);

            while(math.random() < 0.01) {
                destination = i
                while (destination === i || this.#adjacencyMatrix[i][destination] === 1) {
                    destination = randint(0, this.#vertexCount - 1);
                }
                this.addEdge(i, destination);
            }
        }
    }

    get vertexCount() {
        return this.#vertexCount;
    }

    get adjacencyMatrix() {
        return this.#adjacencyMatrix;
    }

    printMatrix() {
        console.log(this.#adjacencyMatrix[0])
    }
}
