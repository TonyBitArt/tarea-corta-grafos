import { AlgorithmGA } from "./AlgorithmGA.js";
import { Graph } from "./Graph.js";

export function testAlgorithm() {
    const TEST_COUNT = 10000;

    const numberOfGenerations1 = []
    const numberOfGenerations2 = []
    const numberOfGenerations3 = []


    for (let i = 0; i < TEST_COUNT; i++) {
        let graph = new Graph(50);
        graph.randomizeMatrix();

        const algorithm1 = new AlgorithmGA(graph, 4, 0.01);
        const algorithm2 = new AlgorithmGA(graph, 4, 0.05);
        const algorithm3 = new AlgorithmGA(graph, 4, 0.1);

        const result1 = algorithm1.geneticAlgorithm();
        const result2 = algorithm2.geneticAlgorithm();
        const result3 = algorithm3.geneticAlgorithm();

        numberOfGenerations1.push(result1.generations);
        numberOfGenerations2.push(result2.generations);
        numberOfGenerations3.push(result3.generations);
    }

    let Average1 = numberOfGenerations1.reduce((a, b) => a + b, 0) / TEST_COUNT;
    let Average2 = numberOfGenerations2.reduce((a, b) => a + b, 0) / TEST_COUNT;
    let Average3 = numberOfGenerations3.reduce((a, b) => a + b, 0) / TEST_COUNT;

    console.log("Promedio de generaciones para tasa de mutación 0.01:", Average1);
    console.log("Promedio de generaciones para tasa de mutación 0.05:", Average2);
    console.log("Promedio de generaciones para tasa de mutación 0.1:", Average3);
}

testAlgorithm();