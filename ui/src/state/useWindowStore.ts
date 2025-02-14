import { create } from 'zustand'
//import { put } from '../api/sky'

type Path = string
type WindowID = number

interface WindowStateObject {
  windowMap: Map<WindowID, Path>
  maxWindow: WindowID
  fileView: Array<WindowID>
  pathBarView: Array<WindowID>
  activeWindowID: WindowID
  activeWindowPath: Path
}

// window map must be serialized to an array in JSON
interface SerializedWindowStateObject
  extends Omit<WindowStateObject, 'windowMap'> {
  windowMap: Array<[WindowID, Path]>
}

type WindowStateObjectAttribute = {
  [k in keyof WindowStateObject]: {
    key: k
    val: WindowStateObject[k]
  }
}[keyof WindowStateObject]

interface Workspace {
  name: string,
  windowState: WindowStateObject
}

type WorkspaceID = number
type WorkspaceMap = Map<WorkspaceID, Workspace>

interface WindowStore {
  workspaces: WorkspaceMap
  activeWorkspaceID: WorkspaceID,
  addWindow: (parentID: WindowID, path: Path) => void
  delWindow: (id: WindowID) => void
  updateWindowPath: (id: WindowID, path: Path) => void
  setMaxWindow: (id: WindowID) => void
  toggleFileView: (id: WindowID) => void
  togglePathBarView: (id: WindowID) => void
  setActiveWindowID: (id: WindowID) => void
  setActiveWindowPath: (path: Path) => void
  setWindowState: (state: SerializedWindowStateObject) => void
}

// helper to update window state in the namespace
// TODO update for workspaces
function sendWindowStateToNamespace(
  state: WindowStateObject,
  update: WindowStateObjectAttribute
): void {
  interface IntermediateWindowStateObject
    extends Omit<WindowStateObject, 'windowMap'> {
    windowMap: Map<WindowID, Path> | Array<[WindowID, Path]>
  }

  const oldWindowMap = state.windowMap

  const updatedState: IntermediateWindowStateObject = {
    ...state,
    [update.key]: update.val,
  }

  if (update.key === 'windowMap') {
    updatedState.windowMap = Array.from(update.val.entries())
  } else {
    updatedState.windowMap = Array.from(oldWindowMap.entries())
  }

  // TODO restore
  //try {
  //  const stateFile = new File(
  //    [JSON.stringify(updatedState, null, 2)],
  //    'windows.json',
  //    { type: 'application/json' }
  //  )
  //
  //  // TODO remove @p; API should accept relative paths
  //  //put(`${window.ship}/sys/state`, stateFile)
  //} catch (err) {
  //  console.log('Failed to save window state to namespace: ', err)
  //}
}

// default state values
const defaultPath: Path = '~zod/home'
const defaultMap: Map<WindowID, Path> = new Map<WindowID, Path>([
  [1, defaultPath],
])

const defaultWindowStateObject: WindowStateObject = {
  windowMap: defaultMap,
  maxWindow: 0,
  fileView: [],
  pathBarView: [],
  activeWindowID: 1,
  activeWindowPath: defaultPath,
}

const defaultWorkspace: Workspace = {
  name: 'Home',
  windowState: defaultWindowStateObject
}

const defaultWorkspaceMap: WorkspaceMap = new Map<WorkspaceID, Workspace>([
  [1, defaultWorkspace],
])

const useWindowStore = create<WindowStore>((set, get) => ({
  // init state values
  workspaces: defaultWorkspaceMap,
  activeWorkspaceID: 0,

  // add a new window to the tree
  addWindow: (parentID: WindowID, path: Path) => {
    const currentWorkspaces = get().workspaces
    const activeWorkspace = currentWorkspaces.get(get().activeWorkspaceID)

    if (!activeWorkspace) {
      console.error(`No workspace for ${get().activeWorkspaceID}`)
      return;
    }

    const windowMap = activeWorkspace.windowState.windowMap
    const parentPath = windowMap.get(parentID)

    if (!parentPath) {
      console.error(`No parent at ${parentID}`)
      return;
    }

    const newWindowMap = new Map(windowMap)
    newWindowMap.set(parentID * 2, parentPath)
    newWindowMap.set(parentID * 2 + 1, path)
    newWindowMap.set(parentID, '')

    activeWorkspace.windowState.windowMap = newWindowMap

    //sendWindowStateToNamespace(activeWorkspace.windowState, { key: 'windowMap', val: newWindowMap })
    set({ workspaces: currentWorkspaces.set(get().activeWorkspaceID, activeWorkspace) })
  },

  // remove a node from the tree
  delWindow: (id: WindowID) => {
    const windowMap = get().windowMap

    // If this is the last window (defaultMap), don't allow deletion
    if (windowMap.size === 1 && windowMap.has(1)) {
      return
    }

    function isEven(num: WindowID): boolean {
      return num % 2 === 0
    }

    function findKids(
      map: Map<WindowID, Path | null>,
      id: WindowID,
      sequence: Set<WindowID>
    ) {
      const leftChild = id * 2
      const rightChild = id * 2 + 1
      //console.log('looking for kids in this map', new Map(map))

      // If left child exists in the map, add it to the sequence and recurse
      if (map.has(leftChild)) {
        sequence.add(leftChild)
        findKids(map, leftChild, sequence)
      }

      // If right child exists in the map, add it to the sequence and recurse
      if (map.has(rightChild)) {
        sequence.add(rightChild)
        findKids(map, rightChild, sequence)
      }
    }

    function hasKids(kids: Set<WindowID>): boolean {
      return kids.size !== 0 ? true : false
    }

    function delKids(map: Map<WindowID, Path | null>, kids: Set<WindowID>) {
      kids.forEach(key => {
        map.delete(key)
      })
    }

    function findValidParent(map: Map<WindowID, Path | null>, id: WindowID) {
      let currentID = id

      while (currentID !== 1) {
        const parentID = isEven(currentID) ? currentID / 2 : (currentID - 1) / 2
        const parentSiblingID = isEven(parentID) ? parentID + 1 : parentID - 1
        map.delete(currentID)

        //  if parent has sibling set parent to original path and return parent
        if (map.has(parentSiblingID)) {
          return parentID
        }
        //  delete parent window form map and move to grandparent
        currentID = parentID
      }
      return 1
    }

    function handleDelete(map: Map<WindowID, Path | null>, id: WindowID) {
      const siblingID = isEven(id) ? id + 1 : id - 1
      const siblingPath = map.get(siblingID) ?? null
      const kids = new Set<WindowID>()
      findKids(map, id, kids)
      const idHasKids = hasKids(kids)
      const siblingKids = new Set<WindowID>()
      findKids(map, siblingID, siblingKids)
      const siblingHasKids = hasKids(siblingKids)

      if (!idHasKids && !siblingHasKids && siblingPath === null) {
        //  handles single window delete case (when meta+w being used)
        //  if window doesn't have kids, sibling doesn't have kids and null(doesn't have sibling)
        //  delete nested parent windows till first window that has sibling
        const validParent = findValidParent(map, siblingID)
        const parentKids = new Set<WindowID>()
        findKids(map, validParent, parentKids)
        delKids(windowMap, parentKids)
        windowMap.delete(validParent)
      } else if (idHasKids && siblingHasKids) {
        //  handles nested window delete case (when multiple window shrinked to 0)
        //  if window has kids and sibling has kids
        //  delete window kids
        delKids(windowMap, kids)
      } else if (idHasKids && !siblingHasKids) {
        //  handles nested window delete case (when multiple window shrinked to 0)
        //  if window has kids and sibling doesn't
        //  setting valid parent(top tree node that has sibling) to sibling window path and deleteing all winodws below it
        //  deleteing window kids
        //validParent(map, siblingID)
        delKids(windowMap, kids)
      }
      //  otherwise keep sibling window state
      //console.log('map', new Map(map))
      const newMap = new Map<WindowID, Path>()
      map.forEach((value, key) => {
        newMap.set(key, value ?? defaultPath)
      })
      set({ windowMap: newMap })
    }

    windowMap.delete(id)

    if (id === 1) {
      sendWindowStateToNamespace(get(), { key: 'windowMap', val: defaultMap })
      set({ windowMap: defaultMap })
    } else {
      handleDelete(windowMap, id)

      // If no windows are left after deletion, reset to defaultMap
      if (windowMap.size === 0) {
        sendWindowStateToNamespace(get(), { key: 'windowMap', val: defaultMap })
        set({ windowMap: defaultMap })
      } else {
        // TODO this relies on handleDelete mutating the
        // windowMap directly, mutation isn't ideal imo
        sendWindowStateToNamespace(get(), { key: 'windowMap', val: windowMap })
        set({ windowMap: windowMap })
      }
    }
  },

  // update a window's path
  updateWindowPath: (id: WindowID, path: Path) => {
    const windowMap = get().windowMap
    const newWindowMap = windowMap.set(id, path)

    sendWindowStateToNamespace(get(), { key: 'windowMap', val: newWindowMap })
    set({ windowMap: newWindowMap })
  },

  // maximise a window
  setMaxWindow: (id: WindowID) => {
    sendWindowStateToNamespace(get(), { key: 'maxWindow', val: id })
    set({ maxWindow: id })
  },

  // toggle "normal" view and file view for a window
  toggleFileView: (id: WindowID) => {
    const fileViewArray = get().fileView

    if (!fileViewArray.includes(id)) {
      const newFileViewArray = [...fileViewArray, id]

      sendWindowStateToNamespace(get(), {
        key: 'fileView',
        val: newFileViewArray,
      })
      set({ fileView: newFileViewArray })
    } else {
      const newFileViewArray = fileViewArray.filter(item => item !== id)

      sendWindowStateToNamespace(get(), {
        key: 'fileView',
        val: newFileViewArray,
      })
      set({ fileView: newFileViewArray })
    }
  },

  // toggle path bar view for a window
  togglePathBarView: (id: WindowID) => {
    const pathBarView = get().pathBarView

    if (!pathBarView.includes(id)) {
      const newPathBarArray = [...pathBarView, id]

      sendWindowStateToNamespace(get(), {
        key: 'pathBarView',
        val: newPathBarArray,
      })
      set({ pathBarView: newPathBarArray })
    } else {
      const newPathBarView = pathBarView.filter(item => item !== id)

      sendWindowStateToNamespace(get(), {
        key: 'pathBarView',
        val: newPathBarView,
      })
      set({ pathBarView: newPathBarView })
    }
  },

  // track active window
  setActiveWindowID: (id: WindowID) => {
    sendWindowStateToNamespace(get(), { key: 'activeWindowID', val: id })
    set({ activeWindowID: id })
  },

  // track active window's path
  setActiveWindowPath: (path: Path) => {
    sendWindowStateToNamespace(get(), { key: 'activeWindowPath', val: path })
    set({ activeWindowPath: path })
  },

  // set init window state from namespace
  setWindowState: (state: SerializedWindowStateObject) => {
    set({
      windowMap: new Map(state.windowMap),
      maxWindow: state.maxWindow,
      fileView: state.fileView,
      pathBarView: state.pathBarView,
      activeWindowID: state.activeWindowID,
      activeWindowPath: state.activeWindowPath,
    })
  },
}))

export default useWindowStore
