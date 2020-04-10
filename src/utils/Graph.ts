export function getRandomCoordinate(
  nodes: any[],
  width: number,
  height: number,
  center = [0, 0],
  padding = 40
) {
  return nodes.map((node) => ({
    ...node,
    x: Math.random() * (width - padding) + center[0] + padding,
    y: Math.random() * (height - padding) + center[0] + padding,
  }))
}
