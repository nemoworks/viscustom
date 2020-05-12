import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'
import initialEdges from './edges.json'
import initialNodes from './nodes.json'
import { findPath } from '../../utils/path'

let graph: any = null

const nodes = initialNodes.map((node) => ({
  id: node.custNo,
  name: node.name,
  style: {
    fill: node.custNo === '2500631037' ? '#FF00FF' : '#00FFFF',
  },
}))

const edges = initialEdges.map((edge) => ({
  source: edge.sourceNo,
  target: edge.targetNo,
}))

const edgeList = initialEdges.map((edge) => ({
  source: edge.targetNo,
  target: edge.sourceNo,
}))

export default function () {
  const ref = React.useRef(null)

  const onNodeClick = (e: any) => {
    const id = e.item._cfg.id
    if (id === '2500631037') return
    // const model = graph.findById(id)

    const model = graph.findById(id)

    const { selected } = model._cfg.model

    findPath(edgeList, '2500631037', id, (path: String[]) => {
      path.slice(1, -1).forEach((id) => {
        const model = graph.findById(id)
        graph.update(model, {
          label: selected ? '' : id,
          style: {
            fill: selected ? '#00FFFF' : '#112233',
          },
        })
      })
    })

    graph.update(model, {
      ...model,
      style: {
        fill: selected ? '#00FFFF' : '#FF3388',
      },
      selected: !selected,
    })
  }

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
        width: 1100,
        height: 800,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 80,
          nodeSize: 20,
        },
        defaultNode: {
          type: 'node',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
            },
          },
          size: 10,
          style: {
            fill: '#00FFFF',
            stroke: '#002222',
          },
        },
      })

      graph.on('node:click', onNodeClick)

      graph.data({ nodes, edges })
    }

    graph.render()
  })

  return <div ref={ref} style={{ overflow: 'auto' }} />
}
