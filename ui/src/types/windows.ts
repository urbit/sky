export interface WindowProps {
  id: number
  path: string | null
}
export interface WindowNode {
  id: number
  path: string | null
  left: WindowNode | null
  right: WindowNode | null
}

export interface WindowContainerProps {
  map: Map<number, string | null>
  id: number
  isVertical: boolean
}
