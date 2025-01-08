export default interface WindowState {
  windowMap: Map<number, string | null>
  maxWindow: number
  activeWindowID: number | null
  activeWindowPath: string | null
  addWindow: (parentId: number, path: string) => void
  delWindow: (id: number) => void
  clearWindows: () => void
  updateWindowPath: (id: number, path: string) => void
  setMaxWindow: (id: number) => void
  setActiveWindowID: (id: number | null) => void
  setActiveWindowPath: (path: string | null) => void
}
