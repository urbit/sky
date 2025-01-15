export default interface WindowState {
  windowMap: Map<number, string>
  maxWindow: number
  pathBarView: Array<number>
  activeWindowID: number | null
  activeWindowPath: string
  addWindow: (parentId: number, path: string) => void
  delWindow: (id: number) => void
  updateWindowPath: (id: number, path: string) => void
  setMaxWindow: (id: number) => void
  togglePathBarView: (id: number) => void
  setActiveWindowID: (id: number | null) => void
  setActiveWindowPath: (path: string) => void
}
