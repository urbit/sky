import { create } from 'zustand'
import { put } from '../api/sky'

type Path = string
type WindowID = number
type WindowMap = Map<WindowID, Path>

interface WindowStateObject {
  windowMap: WindowMap
  maxWindow: WindowID
  // TODO move fileView and pathBarView into Window object
  fileView: Array<WindowID>
  pathBarView: Array<WindowID>
  activeWindowID: WindowID
  activeWindowPath: Path
}

// window map must be serialized to an array in JSON
// we don't store the active window ID or path on the backend
interface BackendWindowStateObject
  extends Omit<
    WindowStateObject,
    'windowMap' | 'activeWindowID' | 'activeWindowPath' | 'pathBarView'
  > {
  windowMap: Array<[WindowID, Path]>
}

interface Workspace {
  name: string
  mounted: boolean
  windowState: WindowStateObject
}

interface BackendWorkspace {
  name: string
  mounted: boolean
  windowState: BackendWindowStateObject
}

interface WorkspaceStore {
  workspaces: WorkspaceMap
  activeWorkspaceID: WorkspaceID
}

interface BackendWindowStore {
  workspaces: Array<[WorkspaceID, BackendWorkspace]>
  activeWorkspaceID: WorkspaceID
}

type WorkspaceID = number
type WorkspaceMap = Map<WorkspaceID, Workspace>

interface WindowStore {
  workspaces: WorkspaceMap
  activeWorkspaceID: WorkspaceID
  addWindow: (parentID: WindowID, path: Path) => void
  delWindow: (id: WindowID) => void
  updateWindowPath: (id: WindowID, path: Path) => void
  setMaxWindow: (id: WindowID) => void
  toggleFileView: (id: WindowID) => void
  togglePathBarView: (id: WindowID) => void
  setActiveWindowID: (id: WindowID) => void
  setActiveWindowPath: (path: Path) => void
  addWorkspace: () => void
  delWorkspace: (id: WorkspaceID) => void
  mountWorkspace: (id: WorkspaceID) => void
  unmountWorkspace: (id: WorkspaceID) => void
  setActiveWorkspaceID: (id: WorkspaceID) => void
  updateWorkspaceName: (id: WorkspaceID, name: string) => void
  setWorkspacesState: (state: BackendWindowStore) => void
}

// helper to serialize and send the entire workspaces state to the namespace
function sendWorkspacesStateToNamespace(store: WorkspaceStore): void {
  console.log('Running sendWorkspacesStateToNamespace')
  // Convert each workspace's windowMap to array format for backend
  const workspacesArray: Array<[WorkspaceID, BackendWorkspace]> = Array.from(
    store.workspaces.entries()
  ).map(([id, workspace]) => {
    const backendWindowState: BackendWindowStateObject = {
      windowMap: Array.from(workspace.windowState.windowMap.entries()),
      maxWindow: workspace.windowState.maxWindow,
      fileView: workspace.windowState.fileView,
    }

    const backendWorkspace: BackendWorkspace = {
      name: workspace.name,
      mounted: workspace.mounted,
      windowState: backendWindowState,
    }

    return [id, backendWorkspace]
  })

  const backendState: BackendWindowStore = {
    workspaces: workspacesArray,
    activeWorkspaceID: store.activeWorkspaceID,
  }

  try {
    const stateFile = new File(
      [JSON.stringify(backendState, null, 2)],
      'workspaces.json',
      { type: 'application/json' }
    )

    // TODO remove hard-coded @p; API should accept relative paths
    // can't use window.ship in this file
    put('~zod/sys/state', stateFile)
  } catch (err) {
    console.log('Failed to save workspaces state to namespace: ', err)
  }
}

// default state values
const defaultPath: Path = '~zod/home'

// Function to create new default window state to avoid shared references
function createDefaultWindowState(): WindowStateObject {
  return {
    windowMap: new Map<WindowID, Path>([[1, defaultPath]]),
    maxWindow: 0,
    fileView: [],
    pathBarView: [],
    activeWindowID: 1,
    activeWindowPath: defaultPath,
  }
}

// Function to create new default workspace to avoid shared references
function createDefaultWorkspace(name: string = 'Home'): Workspace {
  return {
    name,
    mounted: true,
    windowState: createDefaultWindowState(),
  }
}

const defaultWorkspaceMap: WorkspaceMap = new Map<WorkspaceID, Workspace>([
  [0, createDefaultWorkspace('Home')],
])

// main
const useWindowStore = create<WindowStore>((set, get) => ({
  // init state values
  workspaces: defaultWorkspaceMap,
  activeWorkspaceID: 0,

  // add a new window to the tree
  addWindow: (parentID: WindowID, path: Path) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )
    console.log(`activeWorkspaceID: ${get().activeWorkspaceID}`)
    console.log(`activeWorkspace:`, activeWorkspace)

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return;
    }

    const windowMap: WindowMap = activeWorkspace.windowState.windowMap
    const parentPath: Path | undefined = windowMap.get(parentID)

    if (parentPath === undefined) {
      console.error(`No parent at ${parentID}`)
      return;
    }

    const newWindowMap: WindowMap = new Map(windowMap)
    newWindowMap.set(parentID * 2, parentPath)
    newWindowMap.set(parentID * 2 + 1, path)
    newWindowMap.set(parentID, '')

    activeWorkspace.windowState.windowMap = newWindowMap

    set({
      workspaces: currentWorkspaces.set(
        get().activeWorkspaceID,
        activeWorkspace
      ),
    })
    sendWorkspacesStateToNamespace({
      workspaces: get().workspaces,
      activeWorkspaceID: get().activeWorkspaceID,
    })
  },

  // remove a node from the tree
  delWindow: (id: WindowID) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    const windowMap: WindowMap = activeWorkspace.windowState.windowMap

    // if this is the only window, don't delete anything
    if (windowMap.size === 1 && windowMap.has(1)) {
      return
    }

    // helper
    function isEven(num: WindowID): boolean {
      return num % 2 === 0
    }

    // helper
    function hasKids(kids: Set<WindowID>): boolean {
      return kids.size !== 0 ? true : false
    }

    // helper
    function delWindows(map: WindowMap, kids: Set<WindowID>): WindowMap {
      const newMap = new Map(map)

      kids.forEach(key => {
        newMap.delete(key)
      })

      return newMap
    }

    // helper
    function findValidParent(map: WindowMap, id: WindowID): WindowID {
      let currentID: WindowID = id

      // try to find a valid parent
      // by iterating up the tree
      while (currentID !== 1) {
        const parentID: WindowID = isEven(currentID)
          ? currentID / 2
          : (currentID - 1) / 2
        const parentSiblingID: WindowID = isEven(parentID)
          ? parentID + 1
          : parentID - 1
        map.delete(currentID)

        if (map.has(parentSiblingID)) {
          return parentID
        }

        currentID = parentID
      }

      // if the loop completes without
      // finding a valid parent, return 1
      return 1
    }

    // helper: remove a window from the
    // map, clean up, return new map
    function handleDelete(map: WindowMap, id: WindowID): WindowMap {
      const siblingID: WindowID = isEven(id) ? id + 1 : id - 1
      const siblingPath: Path | undefined = map.get(siblingID)
      const kids: Set<WindowID> = new Set<WindowID>()

      const idHasKids: boolean = hasKids(kids)
      const siblingKids: Set<WindowID> = new Set<WindowID>()

      const siblingHasKids: boolean = hasKids(siblingKids)

      let newMap = new Map(map)

      if (!idHasKids && !siblingHasKids && siblingPath === undefined) {
        const validParent = findValidParent(newMap, siblingID)

        newMap = delWindows(newMap, new Set([validParent]))
      } else if (idHasKids && siblingHasKids) {
        newMap = delWindows(newMap, kids)
      } else if (idHasKids && !siblingHasKids) {
        newMap = delWindows(newMap, kids)
      }

      newMap.delete(id)

      return newMap
    }

    // actually run the function
    const newWindowMap = handleDelete(windowMap, id)

    // if no windows are left after deletion, reset to defaultMap
    if (newWindowMap.size === 0) {
      activeWorkspace.windowState.windowMap = defaultMap
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
    } else {
      activeWorkspace.windowState.windowMap = newWindowMap
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
      sendWorkspacesStateToNamespace({
        workspaces: get().workspaces,
        activeWorkspaceID: get().activeWorkspaceID,
      })
    }
  },

  // update a window's path
  updateWindowPath: (id: WindowID, path: Path) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    const windowMap: WindowMap = activeWorkspace.windowState.windowMap
    const newWindowMap: WindowMap = windowMap.set(id, path)

    activeWorkspace.windowState.windowMap = newWindowMap
    set({
      workspaces: currentWorkspaces.set(
        get().activeWorkspaceID,
        activeWorkspace
      ),
    })
    sendWorkspacesStateToNamespace({
      workspaces: get().workspaces,
      activeWorkspaceID: get().activeWorkspaceID,
    })
  },

  // maximise a window
  setMaxWindow: (id: WindowID) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    activeWorkspace.windowState.maxWindow = id

    sendWorkspacesStateToNamespace(get())
    set({
      workspaces: currentWorkspaces.set(
        get().activeWorkspaceID,
        activeWorkspace
      ),
    })
    sendWorkspacesStateToNamespace({
      workspaces: get().workspaces,
      activeWorkspaceID: get().activeWorkspaceID,
    })
  },

  // toggle "normal" view and file view for a window
  toggleFileView: (id: WindowID) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    const fileViewArray: Array<WindowID> = activeWorkspace.windowState.fileView

    if (!fileViewArray.includes(id)) {
      const newFileViewArray: Array<WindowID> = [...fileViewArray, id]

      activeWorkspace.windowState.fileView = newFileViewArray
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
      sendWorkspacesStateToNamespace({
        workspaces: get().workspaces,
        activeWorkspaceID: get().activeWorkspaceID,
      })
    } else {
      const newFileViewArray = fileViewArray.filter(item => item !== id)

      activeWorkspace.windowState.fileView = newFileViewArray
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
      sendWorkspacesStateToNamespace({
        workspaces: get().workspaces,
        activeWorkspaceID: get().activeWorkspaceID,
      })
    }
  },

  // toggle path bar view for a window
  togglePathBarView: (id: WindowID) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    const pathBarViewArray: Array<WindowID> =
      activeWorkspace.windowState.pathBarView

    if (!pathBarViewArray.includes(id)) {
      const newPathBarViewArray: Array<WindowID> = [...pathBarViewArray, id]

      activeWorkspace.windowState.pathBarView = newPathBarViewArray
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
    } else {
      const newPathBarViewArray: Array<WindowID> = pathBarViewArray.filter(
        item => item !== id
      )

      activeWorkspace.windowState.pathBarView = newPathBarViewArray
      set({
        workspaces: currentWorkspaces.set(
          get().activeWorkspaceID,
          activeWorkspace
        ),
      })
    }
  },

  // track active window
  setActiveWindowID: (id: WindowID) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    activeWorkspace.windowState.activeWindowID = id
    set({
      workspaces: currentWorkspaces.set(
        get().activeWorkspaceID,
        activeWorkspace
      ),
    })
  },

  // track active window's path
  setActiveWindowPath: (path: Path) => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const activeWorkspace: Workspace | undefined = currentWorkspaces.get(
      get().activeWorkspaceID
    )

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return
    }

    activeWorkspace.windowState.activeWindowPath = path
    set({
      workspaces: currentWorkspaces.set(
        get().activeWorkspaceID,
        activeWorkspace
      ),
    })
  },

  // create a new workspace
  addWorkspace: () => {
    const currentWorkspaces: WorkspaceMap = get().workspaces
    const newWorkspaceID: WorkspaceID =
      Math.max(...currentWorkspaces.keys()) + 1

    set({
      activeWorkspaceID: newWorkspaceID,
      workspaces: currentWorkspaces.set(newWorkspaceID, createDefaultWorkspace('')),
    })
  },

  // delete a workspace
  delWorkspace: (id: WorkspaceID) => {
    const workspaces: WorkspaceMap = get().workspaces
    workspaces.delete(id)

    set({ workspaces: workspaces })
  },

  // add a workspace to the tab bar
  mountWorkspace: (id: WorkspaceID) => {
    const currentWorkspaces = get().workspaces
    const workspace = currentWorkspaces.get(id)

    if (!workspace) {
      console.error(`No workspace ${id}`)
      return
    }

    workspace.mounted = true
    set({ workspaces: currentWorkspaces.set(id, workspace) })
  },

  // remove a workspace from the tab bar
  unmountWorkspace: (id: WorkspaceID) => {
    const currentWorkspaces = get().workspaces
    const workspace = currentWorkspaces.get(id)

    if (!workspace) {
      console.error(`No workspace ${id}`)
      return
    }

    workspace.mounted = false
    set({ workspaces: currentWorkspaces.set(id, workspace) })
  },

  setActiveWorkspaceID: (id: WorkspaceID) => {
    set({ activeWorkspaceID: id })
  },

  updateWorkspaceName: (id: WorkspaceID, name: string) => {
    const currentWorkspaces = get().workspaces
    const workspace = currentWorkspaces.get(id)

    if (!workspace) {
      console.error(`No workspace ${id}`)
      return
    }

    workspace.name = name
    set({ workspaces: currentWorkspaces.set(id, workspace) })
  },

  // set init window state from namespace
  setWorkspacesState: (state: BackendWindowStore) => {
    console.log('Running setWorkspacesState')
    if (!state) {
      set({ workspaces: defaultWorkspaceMap, activeWorkspaceID: 0 })
    }

    const deserializedWorkspaces = new Map<WorkspaceID, Workspace>(
      state.workspaces.map(([id, workspace]) => {
        // Convert the windowMap array to a Map
        const windowMap = new Map<WindowID, Path>(
          workspace.windowState.windowMap
        )

        // Create a proper WindowStateObject
        const windowState: WindowStateObject = {
          ...workspace.windowState,
          windowMap,
          activeWindowID: 1, // Default since not stored in backend
          activeWindowPath: windowMap.get(1) || defaultPath, // Get path of first window or use default
          pathBarView: [],
        }

        // Create the full Workspace object
        const fullWorkspace: Workspace = {
          name: workspace.name,
          mounted: workspace.mounted,
          windowState,
        }

        return [id, fullWorkspace]
      })
    )

    set({
      workspaces: deserializedWorkspaces,
      activeWorkspaceID: state.activeWorkspaceID,
    })
  },
}))

export default useWindowStore
