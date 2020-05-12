interface Edge {
  source: string
  target: string
}

export function findPath(
  edges: Edge[],
  source: string,
  target: string,
  callback: any = (path?: String[]) => {},
  path: String[] = []
) {
  // 遍历过程中存在环，直接结束本次遍历过程
  if (path.find((node) => node === source)) {
    path.pop()
    return
  }

  for (const edge of edges) {
    if (edge.source === source) {
      path.push(source)
      if (edge.target === target) {
        // 发现路径 调用回调函数
        path.push(target)
        callback(path)
        path.pop()
        path.pop()
        continue
      }
      // 递归遍历
      findPath(edges, edge.target, target, callback, path)
    }
  }

  // 不存在匹配路径，弹出栈顶节点
  if (path.length > 0) path.pop()
}
