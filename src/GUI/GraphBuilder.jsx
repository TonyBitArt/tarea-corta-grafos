import { useState } from 'react';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { Graph } from '../logic/Graph';
import { Representation } from './representation';
import './css/gui.css';
import { randint } from '../utils/helperFunctions';

// Imports para el selector de colores y tasa de mutación
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const MIN_VERTEX_COUNT = 20;
const MAX_VERTEX_COUNT = 50;
const NODE_RADIUS = 30;
const COLLISION_MARGIN = 100;
const MAX_PLACEMENT_ATTEMPTS = 50;

// Función para determinar si una posición es valida para el posicionamiento de un nodo
function isPositionValid(position, existingNodes) {
  for (const node of existingNodes) {
    const dx = position.x - node.position.x;
    const dy = position.y - node.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < COLLISION_MARGIN) {
      return false;
    }
  }
  return true;
}

// Función para crear un nodo. Valida que la ubicación del nodo sea válida con la función anterior
function createNode(id, existingNodes = []) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const padding = 100;

  let position;
  let attempts = 0;

  do {
    position = {
      x: padding + randint(1, windowWidth - 2 * padding),
      y: padding + randint(1, windowHeight - 2 * padding),
    };
    attempts++;
  } while (!isPositionValid(position, existingNodes) && attempts < MAX_PLACEMENT_ATTEMPTS);

  return {
    id: `${id}`,
    type: 'circle',
    data: { label: `${id}` },
    position,
  };
}

// Función para clonar un grafo existente pero con un nuevo número de vértices. Esto es útil para agregar o eliminar nodos sin perder la estructura del grafo ya creada.
function cloneGraphWithVertexCount(sourceGraph, newVertexCount) {
  const newGraph = new Graph(newVertexCount);
  const limit = Math.min(sourceGraph.vertexCount, newVertexCount);

  for (let i = 0; i < limit; i++) {
    for (let j = 0; j < limit; j++) {
      newGraph.adjacencyMatrix[i][j] = sourceGraph.adjacencyMatrix[i][j];
    }
  }

  return newGraph;
}

// Función para crear un grafo. Funciona tanto para creación manual como automática. Valida que cada nodo tenga por lo menos una arista
export function GraphBuilder({ onGraphReady }) {
  const [currentStep, setCurrentStep] = useState('choice');
  const [graph, setGraph] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [colorCount, setColorCount] = useState(4);
  const [mutationRate, setMutationRate] = useState(0.05);

  const initializeGraph = (vertexCount, manual = false) => {
    const newGraph = new Graph(vertexCount);
    const nextNodes = [];
    for (let i = 0; i < vertexCount; i++) {
      nextNodes.push(createNode(i, nextNodes));
    }
    const nextEdges = [];

    if (manual) {
      setGraph(newGraph);
      setNodes(nextNodes);
      setEdges(nextEdges);
      return;
    }

    // Añadir aristas de forma aleatoria
    for (let i = 0; i < vertexCount; i++) {

      // Asegurarse de que cada nodo tenga al menos una arista
      let destination = i;
      while (destination === i || newGraph.areAdjacent(i, destination)) {
        destination = randint(0, vertexCount - 1);
      }

      newGraph.addEdge(i, destination);
      nextEdges.push({ id: `edge-${i}-${destination}`, source: `${i}`, target: `${destination}`, type: 'straight' });

      // Añadir algunas aristas adicionales de forma aleatoria
      while (Math.random() < 0.01) {
        destination = i;
        while (destination === i || newGraph.areAdjacent(i, destination)) {
          destination = randint(0, vertexCount - 1);
        }

        newGraph.addEdge(i, destination);
        nextEdges.push({ id: `edge-${i}-${destination}`, source: `${i}`, target: `${destination}`, type: 'straight' });
      }
        
    }
    setGraph(newGraph);
    setNodes(nextNodes);
    setEdges(nextEdges);
  };

  // Crea un grafo de forma automática con un número aleatorio de vertices dentro del rango válido
  const handleAutomatic = () => {
    const vertexCount = MIN_VERTEX_COUNT + Math.floor(Math.random() * (MAX_VERTEX_COUNT - MIN_VERTEX_COUNT + 1));
    initializeGraph(vertexCount);
    setCurrentStep('manual'); // Cambiar a modo manual para permitir edición después de la generación automática
  };

  // Crea un grafo de forma manual con la mínima cantidad de nodos. Al cambiar el paso a manual, no se le añaden aristas
  const handleManual = () => {
    initializeGraph(MIN_VERTEX_COUNT, true);
    setCurrentStep('manual');
  };

  // Función llamada al finalizar la construcción del grafo. Llama a la función onGraphReady pasada como prop para enviar el grafo construido al componente padre (App.jsx) y así poder aplicar el algoritmo de coloreo.
  const handleGraphFinalized = () => {
    if (graph) {
      onGraphReady({ graph, nodes, edges, colors: colorCount, mutationRate });
    }
  };

  // Función para creación de nodos. Crea un nuevo grafo con el nodo nuevo para que así no se reseteen la posiciones de los nodos
  const handleAddNodes = () => {
    if (!graph || graph.vertexCount >= MAX_VERTEX_COUNT) {
      return;
    }

    const currentCount = graph.vertexCount;
    const newGraph = cloneGraphWithVertexCount(graph, currentCount + 1);

    setGraph(newGraph);
    setNodes((currentNodes) => {
      const newNode = createNode(currentCount, currentNodes);
      return [...currentNodes, newNode];
    });
  };

  // Función para remover nodos. Crea un nuevo grafo sin el nodo a eliminar para que así no se reseteen la posiciones de los nodos
  const handleRemoveNodes = () => {
    if (!graph || graph.vertexCount <= MIN_VERTEX_COUNT) {
      return;
    }

    const currentCount = graph.vertexCount;
    const removedNodeId = `${currentCount - 1}`;
    const newGraph = cloneGraphWithVertexCount(graph, currentCount - 1);

    setGraph(newGraph);
    setNodes((currentNodes) => currentNodes.slice(0, -1));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== removedNodeId && edge.target !== removedNodeId));
  };

  if (currentStep === 'choice') {
    return (
      <div className='background'>

        <div style={{ display: 'flex', gap: '2rem' }}>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: '0.5rem' }}>
            <FormControl size="large" sx={{ minWidth: 140}}>
              <InputLabel id="color-count-label" sx={{color: 'white'}}>Cantidad de colores</InputLabel>
              <Select
                labelId="color-count-label"
                value={colorCount}
                label="Cantidad de colores"
                onChange={(e) => setColorCount(Number(e.target.value))}
                sx={{ textAlign: 'center', '& .MuiSelect-select': { display: 'flex', alignItems: 'center', justifyContent: 'center'}, color: 'white', fontSize: '30px' }}
              >
                {[3,4].map((c) => (
                  <MenuItem key={c} value={c} sx={{ textAlign: 'center' }}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="large" sx={{ minWidth: 160 }}>
              <InputLabel id="mutation-rate-label" sx={{color: 'white'}}>Prob. mutación</InputLabel>
              <Select
                labelId="mutation-rate-label"
                value={mutationRate}
                label="Probabilidad de mutación"
                onChange={(e) => setMutationRate(Number(e.target.value))}
                sx={{ textAlign: 'center', '& .MuiSelect-select': { display: 'flex', alignItems: 'center', justifyContent: 'center'}, color: 'white', fontSize: '30px' }}
              >
                {[0.01, 0.05, 0.1].map((r) => (
                  <MenuItem key={r} value={r} sx={{ textAlign: 'center' }}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <button
            onClick={handleAutomatic}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Generar Automáticamente
          </button>
          
          <button
            onClick={handleManual}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Crear Manualmente
          </button>
        </div>
      </div>
    );
  }

  if ((currentStep === 'automatic' || currentStep === 'manual') && graph) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Representation
          graph={graph}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          setEdges={setEdges}
          isEditable={currentStep === 'manual'}
        />
        
        <div className='controlPanel'>

          <div>
            <h3>Editor Manual</h3>
            <p>Nodos: {graph.vertexCount}</p>
          </div>
        
            <button
              onClick={handleAddNodes}
              disabled={graph.vertexCount >= MAX_VERTEX_COUNT}
              style={{
                backgroundColor: graph.vertexCount >= MAX_VERTEX_COUNT ? '#ccc' : '#3b82f6',
                cursor: graph.vertexCount >= MAX_VERTEX_COUNT ? 'not-allowed' : 'pointer'
              }}
            >
              + Nodo
            </button>

            <button
              onClick={handleRemoveNodes}
              disabled={graph.vertexCount <= MIN_VERTEX_COUNT}
              style={{
                backgroundColor: graph.vertexCount <= MIN_VERTEX_COUNT ? '#ccc' : '#ef4444',
                cursor: graph.vertexCount <= MIN_VERTEX_COUNT ? 'not-allowed' : 'pointer'
              }}
            >
              - Nodo
            </button>
            <div>
              <p>Pasa el cursor sobre un nodo para ver handles.</p>
              <p>Haz click sobre una arista para eliminarla.</p>
            </div>

            <button onClick={handleGraphFinalized}> Finalizar </button>
            
        </div>

      </div>
    );
  }

  return null;
}
