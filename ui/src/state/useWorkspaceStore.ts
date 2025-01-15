import { create } from 'zustand'
import WorkspaceState from './workspaceState'

const defaultWorkspaces = ['Home', 'Workspace1']

const useWorkspaceStore = create<WorkspaceState>((set, get) => ({

  // init default state values
  workspaces: defaultWorkspaces,
  activeWorkspace: 'Home',

  setActiveWorkspace: (workspace: string) => {
    const workspaces = get().workspaces
    console.log('setting workspace to ', workspace )
    if(workspaces.includes(workspace)){
      set({ activeWorkspace: workspace })
    }
  }
}))

export default useWorkspaceStore
