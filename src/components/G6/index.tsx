import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'
import initialEdges from './edges.json'
import initialNodes from './nodes.json'
import { findPaths } from '../../utils/path'

let graph: any = null

const centerId = '2500631037'

const nodes = initialNodes.map((node) => ({
  id: node.custNo,
  name: node.name,
  style: {
    fill: node.custNo === centerId ? '#FF00FF' : '#00FFFF',
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
  const onNodeClick = (e: any) => {
    const id = e.item._cfg.id
    if (id === centerId) return

    const model = graph.findById(id)

    const { selected } = model._cfg.model

    const weight = findPaths(edgeList, centerId, id, (path: String[]) => {})

    let max = 0.0

    for (const key in weight) if (weight[key] > max) max = weight[key]

    for (const key in weight) {
      if (key === centerId || key === id) continue
      const gray = Math.round(255 * (1 - weight[key] / max))
      graph.update(key, {
        style: {
          fill: selected ? '#00FFFF' : `rgb(${gray},${gray},${gray})`,
        },
        label: selected ? '' : weight[key],
      })
    }

    graph.getNodes().forEach((node: any) => {
      const nodeId = node._cfg.id

      if (nodeId !== centerId && nodeId !== id && !weight[nodeId]) {
        selected ? graph.showItem(nodeId) : graph.hideItem(nodeId)
      }
    })

    graph.update(model, {
      ...model,
      style: {
        fill: selected ? '#00FFFF' : '#FF3322',
      },
      selected: !selected,
    })
  }

  const ref = React.useRef(null)

  useEffect(() => {
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
    graph.render()
  }, [])

  return <div ref={ref} style={{ overflow: 'auto' }} />
}
