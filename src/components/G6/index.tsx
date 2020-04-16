import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'
import initialEdges from './edges.json'
import initialNodes from './nodes.json'

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

interface edge {
  source: string // 起始节点
  target: string // 目标节点
}

const edgeList = initialEdges.map((edge) => ({
  source: edge.sourceNo,
  target: edge.targetNo,
}))

let path: Array<string> = []
// 检测当前节点是否存在于当前路径中（用来判断是否遇到了一个环）
function inPath(path: Array<string>, node: string): boolean {
  for (let v of path) if (v == node) return true

  return false
}

// 寻找从start到end的所有路径 每找到一条就打印出来
function findRoutes(
  edgeList: Array<edge>,
  start: string,
  end: string,
  callback: (path: Array<string>) => any
) {
  // console.log("边集:", edgeList)
  if (inPath(path, start)) {
    // console.log("找到了一个环:", path)
    // 当遇到环时 回退一个节点
    path.pop()
    return
  }
  for (let v of edgeList) {
    var edge = v
    if (edge.source == start) {
      path.push(start)
      if (edge.target == end) {
        path.push(end)
        callback(path)
        // 因为添加了结束节点，所以这里要多pop一次
        path.pop()
        path.pop()
        continue
      }
      findRoutes(edgeList, edge.target, end, callback)
    }
  }
  // 没找到下一个节点（到了一个没有出度的节点）
  if (path.length > 0) {
    // 回退一个节点
    path.pop()
  }
}

export default function () {
  const ref = React.useRef(null)

  const onNodeClick = (e: any) => {
    const id = e.item._cfg.id
    if (id === '2500631037') return
    // const model = graph.findById(id)

    const model = graph.findById(id)

    const { selected } = model._cfg.model

    path = []
    findRoutes(edgeList, '2500631037', id, (path: any) => {
      for (let index = 1; index < path.length - 1; index++) {
        const model = graph.findById(path[index])
        // let {degree,name}=model._cfg.model
        console.log(path)

        graph.update(model, {
          ...model,
          // degree:!degree,
          label: selected ? '' : path[index],
          style: {
            fill: selected ? '#00FFFF' : '#112233',
          },
        })
      }
    })

    graph.update(model, {
      ...model,
      style: {
        fill: selected ? '#00FFFF' : path.length === 0 ? '#222222' : '#FF3388',
      },
      selected: !selected,
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
