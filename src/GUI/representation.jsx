import { ReactFlow, Background, Controls, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CircleNode from './geometry/circleNode';

const nodeTypes = { circle: CircleNode };

export function Representation({
  nodes,
  edges,
  onNodesChange,
  setEdges = () => {},
  graph,
  isEditable = false,
}) {
  const handleConnect = (connection) => {
    if (!isEditable || !graph || connection.source == null || connection.target == null) {
      return;
    }

    const sourceIndex = Number(connection.source);
    const targetIndex = Number(connection.target);

    if (Number.isNaN(sourceIndex) || Number.isNaN(targetIndex) || graph.areAdjacent(sourceIndex, targetIndex)) {
      return;
    }

    graph.addEdge(sourceIndex, targetIndex);
    setEdges((currentEdges) => addEdge({ ...connection, type: 'straight' }, currentEdges));
  };

  const handleEdgeClick = (_, edge) => {
    if (!isEditable || !graph) {
      return;
    }

    const sourceIndex = Number(edge.source);
    const targetIndex = Number(edge.target);

    if (Number.isNaN(sourceIndex) || Number.isNaN(targetIndex)) {
      return;
    }

    graph.removeEdge(sourceIndex, targetIndex);
    setEdges((currentEdges) => currentEdges.filter((currentEdge) => currentEdge.id !== edge.id));
  };

  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={isEditable}
        nodesConnectable={isEditable}
        edgesFocusable={isEditable}
        defaultEdgeOptions={{ type: 'straight' }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
