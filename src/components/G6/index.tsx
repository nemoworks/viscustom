import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'
import initialEdges from './edges.json'
import initialNodes from './nodes.json'

let graph: any = null

const nodes = initialNodes.map((node) =>
  node.nodeStyle
    ? node.nodeStyle
    : {
        id: node.custNo,
        name: node.name,
      }
)

const edges = initialEdges.map((edge) => ({
  source: edge.sourceNo,
  target: edge.targetNo,
}))

export default function () {
  const ref = React.useRef(null)

  const onNodeClick = (e: any) => {
    const id = e.item._cfg.id
    const model = graph.findById(id)

    const { selected, name } = model._cfg.model

    const rays = edges.filter((edge: any) => edge.target === id)

    rays.forEach((ray: any) => {
      const neighbor = graph.findById(ray.source)
      graph.update(neighbor, {
        ...neighbor,
        style: {
          fill: selected ? '#00FFFF' : '#FFFF00',
        },
        label: selected ? '' : neighbor._cfg.model.name,
      })
    })

    graph.update(model, {
      ...model,

      style: {
        fill: selected ? '#00FFFF' : '#FF0000',
      },
      selected: !selected,
      label: selected ? '' : name,
    })
  }

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
        width: 1200,
        height: 800,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        // layout: {
        //   type: 'radial',
        //   focusNode: '2500631037',
        //   unitRadius: 60,
        //   preventOverlap: true,
        //   nodeSize: 15,
        // },
        layout: {
          type: 'force',
          preventOverlap: true,
          // nodeStrength: -0.1,
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
