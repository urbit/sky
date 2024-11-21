export default interface WindowState {
  windowMap: Map<number, string | null>
  active: number | null
  addWindow: (parentId: number, path: string) => void
  delWindow: (id: number) => void
  clearWindows: () => void
  updateWindowPath: (id: number, path: string) => void
  isActive: (id: number) => void
}
