export interface WindowProps {
  id: number
  path: string | null
  handleDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void
  handleDragStart: (event: React.DragEvent, id: number) => void
  dragWindow: number
}

export interface WindowContainerProps {
  map: Map<number, string | null>
  id: number
  isVertical: boolean
  handleDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void
  handleDragStart: (event: React.DragEvent, id: number) => void
  dragWindow: number
}
