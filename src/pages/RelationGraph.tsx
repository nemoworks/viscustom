import React from 'react'
import G6 from '../components/G6'
import initialEdges from './edges.json'
import initialNodes from './nodes.json'

function getNeighbor(nodeId: String, edges: any[]) {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target)
}

const data = {
  // 点集
  nodes: initialNodes.map((node) => ({
    id: node.custNo,
    name: node.name,
  })),
  // 边集
  edges: initialEdges.map((edge) => ({
    source: edge.sourceNo,
    target: edge.targetNo,
  })),
}

export default function () {
  const nodeClickHandler = (id: any) => {
    let { nodes, edges } = data
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <G6
        data={data}
        onNodeClick={(e: any) => nodeClickHandler(e.item._cfg.id)}
        onPostionFixed={(nodes: any) => console.log(nodes)}
      />
    </div>
  )
}
