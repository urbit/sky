export default interface WorkspaceState {
    //  for now tbd
    workspaces: Array<string>
    activeWorkspace: string
    setActiveWorkspace: (workspace: string) => void
  }