export default interface WorkspaceState {
    //  for now tbd
    workspaceMap: Map<string, Map<number, string | null>>
    activeWorkspace: string
    addWorkspace: (paths: Array<string>) => void
    removeWorkspace: (workspace: string) => void
    setActiveWorkspace: (workspace: string) => void
  }