export default interface WindowState {
  windowMap: Map<number, string | null>
  activeWindowID: number | null
  activeWindowPath: string | null
  addWindow: (parentId: number, path: string) => void
  delWindow: (id: number) => void
  clearWindows: () => void
  updateWindowPath: (id: number, path: string) => void
  setActiveWindowID: (id: number | null) => void
  setActiveWindowPath: (path: string | null) => void
}
