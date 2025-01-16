import { create } from 'zustand'
import WorkspaceState from './workspaceState'

const defaultPath = '~sampel/home'
const defaultWindowMap = new Map<number, string | null>([[1, defaultPath]])
const defaultMap = new Map<string, Map<number, string | null>>([
    ['Home', defaultWindowMap]
    // ['Workspace1', defaultWindowMap]
])

const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // init default state values
  workspaceMap: defaultMap,
  activeWorkspace: 'Home',

  addWorkspace: (paths: Array<string>) =>{
    const workspaceMap = get().workspaceMap
    const index = workspaceMap.size
    const newWorkspace = `Workspace${index}`
    //  TODO: store paths in WindowMap as a tree like structure rather than just index to path
    const windowMap = new Map<number, string | null>(paths.map((path, i) => [i, path]))

    console.log('setting up new ', newWorkspace)

    workspaceMap.set(newWorkspace, windowMap)
    set({ 
        workspaceMap: workspaceMap,
        activeWorkspace: newWorkspace
    })
  },

  removeWorkspace(workspace: string) {
    const workspaceMap = get().workspaceMap
    workspaceMap.delete(workspace)
    set({ workspaceMap: workspaceMap})
  },

  setActiveWorkspace: (workspace: string) => {
    const workspaceMap = get().workspaceMap
    console.log('is ', workspaceMap.has(workspace))
    if(workspaceMap.has(workspace)){
      set({ activeWorkspace: workspace })
      console.log('updated activeWorksapce in useWorkspaceStore ', get().activeWorkspace)
    }
  }
}))

export default useWorkspaceStore
