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

    areAdjacent(nodeU, nodeV) {
        return this.#adjacencyMatrix[nodeU][nodeV] === 1;
    }

    loadUserMatrix(userMatrix){
        this.#adjacencyMatrix = userMatrix; 
        this.#vertexCount = userMatrix.length;
    }

    randomizeMatrix() {
        for (let i = 0; i < this.#vertexCount; i++) {
            for (let j = i + 1; j < this.#vertexCount; j++) {
                if (Math.random() < 0.3) {
                    this.addEdge(i,j);
                }
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
