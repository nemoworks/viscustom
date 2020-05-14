interface Edge {
  source: string
  target: string
}

interface EdgeList {
  [key: string]: Set<string>
}

// function findPath(
//   edgeList: EdgeList,
//   from: string,
//   to: string,
//   callback: any,
//   path: String[],
//   depth: number = 0
// ) {
//   if (path.find((node) => node === from) || depth > 8) return

//   if (edgeList[from]) {
//     path.push(from)
//     for (const target of edgeList[from]) {
//       if (target === to) {
//         path.push(target)
//         callback(path)
//         path.pop()
//         break
//       } else findPath(edgeList, target, to, callback, path, depth + 1)
//     }
//   }

//   if (path.length > 0) path.pop()
// }

// export function _findPath(
//   edges: Edge[],
//   from: string,
//   to: string,
//   callback: any = (path?: String[]) => {},
//   path: String[] = [],
//   depth: number = 0
// ) {
//   // 遍历过程中存在环，直接结束本次遍历过程
//   if (path.find((node) => node === from) || depth > 8) {
//     path.pop()
//     return
//   }

//   for (const edge of edges) {
//     let { source, target } = edge

//     if (source !== from) {
//       let temp = source
//       source = target
//       target = temp
//     }

//     if (source === from) {
//       debugger
//       path.push(from)
//       if (target === to) {
//         path.push(to)
//         callback(path)
//         path.pop()
//         path.pop()
//         continue
//       }
//       _findPath(edges, target, to, callback, path, depth + 1)
//     }
//   }
//   if (path.length > 0) path.pop()
// }

export function findPaths(
  edges: Edge[],
  from: string,
  to: string,
  callback: any
) {
  //初始化邻接表
  const edgeList: EdgeList = {}

  edges.forEach(({ source, target }) => {
    if (edgeList[source] === undefined) edgeList[source] = new Set()
    if (edgeList[target] === undefined) edgeList[target] = new Set()
    edgeList[source].add(target)
    edgeList[target].add(source)
  })

  const pathStack = [from]
  const sideStack = [Array.from(edgeList[from])]
  const weight: {
    [key: string]: number
  } = {}

  while (pathStack.length > 0) {
    let nodeList = sideStack.pop() || []
    if (nodeList.length > 0) {
      let node = nodeList.pop() as string
      pathStack.push(node)
      sideStack.push(nodeList)
      if (edgeList[node]) {
        let temp = edgeList[node]

        let item = Array.from(temp).filter(
          (target) => !pathStack.find((n) => n === target)
        )
        sideStack.push(item)
      }
    } else pathStack.pop()

    if (pathStack.length > 0 && pathStack[pathStack.length - 1] === to) {
      pathStack.forEach((n) => {
        if (weight[n] === undefined) weight[n] = 0
        weight[n]++
      })
      // callback(Array.from(pathStack))
      pathStack.pop()
      sideStack.pop()
    }
  }

  return weight
}
