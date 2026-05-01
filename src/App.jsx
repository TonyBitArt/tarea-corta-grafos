import { useState } from 'react'
import { AlgorithmGA } from './logic/AlgorithmGA'
import { GraphBuilder } from './GUI/GraphBuilder'
import { Representation } from './GUI/representation'

// Colores
const COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8'];

function getColorForGene(gene) {
  return COLORS[gene - 1];
}

function App() {
  const [appState, setAppState] = useState('building'); // 'building' | 'visualizing'
  const [graph, setGraph] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [coloringSolution, setColoringSolution] = useState(null);

  const handleGraphReady = ({ graph: builtGraph, nodes: builtNodes, edges: builtEdges, colors: builtColors, mutationRate: builtMutationRate }) => {
    // Apply coloring algorithm
    const algorithm = new AlgorithmGA(builtGraph, builtColors, builtMutationRate);
    const result = algorithm.geneticAlgorithm();
    
    console.log("Matriz de adyacencia:", builtGraph.adjacencyMatrix);
    console.log("Solución final:", result.bestSolution);
    console.log("Generaciones:", result.generations);
    console.log("Historial:", result.history);

    setGraph(builtGraph);
    setNodes(builtNodes);
    setEdges(builtEdges);
    setColoringSolution(result);
    setAppState('visualizing');
  };

  const handleBackToBuilder = () => {
    setAppState('building');
    setGraph(null);
    setNodes([]);
    setEdges([]);
    setColoringSolution(null);
  };

  if (appState === 'building') {
    return <GraphBuilder onGraphReady={handleGraphReady} />
  }

  if (appState === 'visualizing' && graph) {
    const coloredNodes = nodes.map((node, index) => {
      const gene = coloringSolution?.bestSolution?.individual?.[index];

      return {
        ...node,
        data: {
          ...node.data,
          fillColor: getColorForGene(gene),
        },
      };
    });

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Representation graph={graph} nodes={coloredNodes} edges={edges} isEditable={false} />
        
        <button
          onClick={handleBackToBuilder}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ← Volver a Crear Grafo
        </button>

        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
          maxWidth: '300px'
        }}>
          <h3>Solución de Coloreado</h3>
          {coloringSolution && (
            <>
              <p>Colores usados: {new Set(coloringSolution.bestSolution.individual).size}</p>
              <p>Conflictos: {coloringSolution.bestSolution.conflicts}</p>
              <p>Generaciones: {coloringSolution.generations}</p>
              <details>
                <summary>Ver historial de generaciones</summary>
                <pre style={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(
                    coloringSolution.history.map((entry, generation) => ({
                      generation,
                      conflicts: entry.conflicts
                    })),
                    null,
                    2
                  )}
                </pre>
              </details>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default App
