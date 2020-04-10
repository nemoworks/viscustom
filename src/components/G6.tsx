import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
// import { data } from './data';
import G6 from '@antv/g6'

export default function (props: { data: any; onNodeClick?: any }) {
  const ref = React.useRef(null)
  let graph: any = null

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
        width: 1200,
        height: 1000,
        // fitView: true,
        // fitViewPadding: [10, 10, 10, 10],
        modes: {
          default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
        },
        layout: {
          // Object，可选，布局的方法及其配置项，默认为 random 布局。
          type: 'random', // 指定为力导向布局
          // focusNode: '2500631037',
          // preventOverlap: true,
          // nodeSize: 20,
          // unitRadius: 60,
          // strictRadial: true,
          // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
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
    }

    graph.data(props.data)
    graph.render()
  }, [])

  return <div ref={ref} style={{ overflow: 'auto' }} />
}
