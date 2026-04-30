import { useState } from 'react'
import './App.css'
import { AlgorithmGA } from './logic/AlgorithmGA'
import { Graph } from './logic/Graph';

let miGrafo = new Graph(20); 
miGrafo.randomizeMatrix();

let prueba = new AlgorithmGA(miGrafo, 4, 0.05);

const resultado = prueba.geneticAlgorithm();
console.log("Solución final:", resultado.bestSolution);
console.log("Generaciones:", resultado.generations);
console.log("Historial:", resultado.history);



function App() {
  const [count, setCount] = useState(0)

  return (
    <h1>Hola</h1>
  )
}

export default App
