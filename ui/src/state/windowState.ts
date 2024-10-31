import { WindowNode } from '../types/windows.ts'

export default interface WindowState {
  windowTree: WindowNode
  addWindowNode: (parentId: number, path: string) => void
  delWindowNode: (id: number) => void
  clearWindows: () => void
}
