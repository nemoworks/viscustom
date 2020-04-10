import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
// import { data } from './data';
import G6 from '@antv/g6'

export default function (props: {
  data: any
  onNodeClick?: any
  onPostionFixed?: any
}) {
  const ref = React.useRef(null)
  let graph: any = null

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
        width: 1200,
        height: 800,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        layout: {
          type: 'random',
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
            stroke: '#72CC4A',
          },
        },
        // defaultEdge: {
        //   type: 'polyline',
        // },
      })

      graph.on('node:click', (e: any) => {
        props.onNodeClick && props.onNodeClick(e)
      })

      graph.on('afterlayout', () => {
        props.onPostionFixed && props.onPostionFixed(graph.getNodes())
      })
    }

    graph.data(props.data)
    graph.render()
  }, [])

  return <div ref={ref} style={{ overflow: 'auto' }} />
}
