import React, { useState } from 'react'
import G6 from '../components/G6'

function getEdges(nodeId: String, edges: any[]) {
  return edges.filter((edge) => edge.source === nodeId)
}

export default function () {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <G6 />
    </div>
  )
}
