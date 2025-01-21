import { create } from 'zustand'
import { get, put } from '../api/sky'

interface WindowStateObject {
  windowMap: Map<number, string>
  maxWindow: number
  pathBarView: Array<number>
  activeWindowID: number
  activeWindowPath: string
}

type WindowStateObjectAttribute = {
  [k in keyof WindowStateObject]: {
    key: k
    val: WindowStateObject[k]
  }
}[keyof WindowStateObject]

interface WindowStore extends WindowStateObject {
  addWindow: (parentId: number, path: string) => void
  delWindow: (id: number) => void
  updateWindowPath: (id: number, path: string) => void
  setMaxWindow: (id: number) => void
  togglePathBarView: (id: number) => void
  setActiveWindowID: (id: number) => void
  setActiveWindowPath: (path: string) => void
}

// helper to update window state in the namespace
function sendWindowStateToNamespace(
  state: WindowStateObject,
  update: WindowStateObjectAttribute
): void {
  interface IntermediateWindowStateObject extends Omit<WindowStateObject, 'windowMap'> {
    windowMap: Map<number, string> | Array<[number, string]>
  }

  const oldWindowMap = state.windowMap

  let updatedState: IntermediateWindowStateObject = {
    ...state,
    [update.key]: update.val
  }

  if (update.key === 'windowMap') {
    updatedState.windowMap = Array.from(update.val.entries())
  } else {
    updatedState.windowMap = Array.from(oldWindowMap.entries())
  }

  try {
    const stateFile = new File(
      [JSON.stringify(updatedState, null, 2)],
      'window-state.json',
      { type: 'application/json' }
    )

    const formData = new FormData()
    formData.append('file', stateFile)
    // TODO remove ~sampel; API should accept relative paths
    put('~sampel/sys/state/windows', formData)
  } catch (err) {
    console.log('Failed to save window state to namespace: ', err)
  }
}

// default state values
const defaultPath: string = '~sampel/home'
const defaultMap: Map<number, string> = new Map<number, string>([
  [1, defaultPath],
])
const defaultState: WindowStateObject = {
  windowMap: defaultMap,
  maxWindow: 0,
  pathBarView: [],
  activeWindowID: 1,
  activeWindowPath: defaultPath,
}

// get state from namespace, use defaultState as fallback
// TODO don't hard-code ~sampel; API should support relative paths
// TODO remove top-level await
const savedStateRes: Response | void = await get('~sampel/sys/state/windows')
const state: WindowStateObject = savedStateRes
  ? await savedStateRes.json()
  : defaultState

console.log('State loaded from backend:', state)

const useWindowStore = create<WindowStore>((set, get) => ({
  // init state values
  windowMap: new Map(state.windowMap),
  maxWindow: state.maxWindow,
  pathBarView: state.pathBarView,
  activeWindowID: state.activeWindowID,
  activeWindowPath: state.activeWindowPath,

  // add a new window to the tree
  addWindow: (parentId: number, path: string) => {
    const windowMap = get().windowMap
    const parentPath = windowMap.get(parentId) ?? defaultPath

    const newWindowMap = new Map(windowMap)
    newWindowMap.set(parentId * 2, parentPath)
    newWindowMap.set(parentId * 2 + 1, path)
    newWindowMap.set(parentId, '')

    sendWindowStateToNamespace(get(), { key: 'windowMap', val: newWindowMap })
    set({ windowMap: newWindowMap })
  },

  // remove a node from the tree
  delWindow: (id: number) => {
    const windowMap = get().windowMap

    // If this is the last window (defaultMap), don't allow deletion
    if (windowMap.size === 1 && windowMap.has(1)) {
      return
    }

    function isEven(num: number): boolean {
      return num % 2 === 0
    }

    function findKids(
      map: Map<number, string | null>,
      id: number,
      sequence: Set<number>
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

    function hasKids(kids: Set<number>): boolean {
      return kids.size !== 0 ? true : false
    }

    function delKids(map: Map<number, string | null>, kids: Set<number>) {
      kids.forEach(key => {
        map.delete(key)
      })
    }

    function findValidParent(map: Map<number, string | null>, id: number) {
      let currentId = id

      while (currentId !== 1) {
        const parentId = isEven(currentId) ? currentId / 2 : (currentId - 1) / 2
        const parentSiblingId = isEven(parentId) ? parentId + 1 : parentId - 1
        map.delete(currentId)

        //  if parent has sibling set parent to original path and return parent
        if (map.has(parentSiblingId)) {
          return parentId
        }
        //  delete parent window form map and move to grandparent
        currentId = parentId
      }
      return 1
    }

    function handleDelete(map: Map<number, string | null>, id: number) {
      const siblingId = isEven(id) ? id + 1 : id - 1
      const siblingPath = map.get(siblingId) ?? null
      const kids = new Set<number>()
      findKids(map, id, kids)
      const idHasKids = hasKids(kids)
      const siblingKids = new Set<number>()
      findKids(map, siblingId, siblingKids)
      const siblingHasKids = hasKids(siblingKids)

      if (!idHasKids && !siblingHasKids && siblingPath === null) {
        //  handles single window delete case (when meta+w being used)
        //  if window doesn't have kids, sibling doesn't have kids and null(doesn't have sibling)
        //  delete nested parent windows till first window that has sibling
        const validParent = findValidParent(map, siblingId)
        const parentKids = new Set<number>()
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
        //validParent(map, siblingId)
        delKids(windowMap, kids)
      }
      //  otherwise keep sibling window state
      //console.log('map', new Map(map))
      const newMap = new Map<number, string>()
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
  updateWindowPath: (id: number, path: string) => {
    const windowMap = get().windowMap
    const newWindowMap = windowMap.set(id, path)

    sendWindowStateToNamespace(get(), { key: 'windowMap', val: newWindowMap })
    set({ windowMap: newWindowMap })
  },

  // maximise a window
  setMaxWindow: (id: number) => {
    sendWindowStateToNamespace(get(), { key: 'maxWindow', val: id })
    set({ maxWindow: id })
  },

  // toggle window id in and out of pathBarView array
  togglePathBarView: (id: number) => {
    const windowArray = get().pathBarView
    const pathBarView = get().pathBarView

    if (!pathBarView.includes(id)) {
      // add window id to the pathBarView array
      sendWindowStateToNamespace(get(), {
        key: 'pathBarView',
        val: [...windowArray, id],
      })
      set({ pathBarView: [...windowArray, id] })
    } else {
      // remove window id from the pathBarView array
      const updatedPathBarView = windowArray.filter(item => item !== id)

      sendWindowStateToNamespace(get(), {
        key: 'pathBarView',
        val: updatedPathBarView,
      })
      set({ pathBarView: updatedPathBarView })
    }
  },

  // track active window
  setActiveWindowID: (id: number) => {
    sendWindowStateToNamespace(get(), { key: 'activeWindowID', val: id })
    set({ activeWindowID: id })
  },

  // track active window's path
  setActiveWindowPath: (path: string) => {
    sendWindowStateToNamespace(get(), { key: 'activeWindowPath', val: path })
    set({ activeWindowPath: path })
  },
}))

export default useWindowStore
