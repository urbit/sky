import { create } from 'zustand'
import WindowState from './windowState'

// homepage
const defaultMap = new Map<number, string | null>([[1, '~sampel/home']])

const useWindowStore = create<WindowState>((set, get) => ({
  // init homepage
  windowMap: defaultMap,
  // add a new window to the tree
  addWindow: (parentId: number, path: string) => {
    const windowMap = get().windowMap
    const parentPath = windowMap.get(parentId) ?? null

    windowMap.set(parentId * 2, parentPath)
    windowMap.set(parentId * 2 + 1, path)
    windowMap.set(parentId, null)

    set({ windowMap })
  },

  // remove a node from the tree
  delWindow: (id: number) => {
    const windowMap = get().windowMap

    windowMap.delete(id)

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
      console.log('looking for kids in this map', new Map(map))

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
      kids.forEach((key) => {
        map.delete(key)
      })
    }

    //  decrements id of window to parent id, if sibling is being deleted
    function validParent(map: Map<number, string | null>, id: number) {
      //  saving path to set valid parent in map to that path
      const path = map.get(id) ?? '~sampel/home'
      let currentId = id

      while (currentId !== 1) {
        const parentId = isEven(currentId) ? currentId / 2 : (currentId - 1) / 2
        const parentSiblingId = isEven(parentId) ? parentId + 1 : parentId - 1
        map.delete(currentId)

        //  if parent has sibling set parent to original path and return parent
        if (map.has(parentSiblingId)) {
          map.set(parentId, path)
          break
        }
        //  delete parent window form map and move to grandparent
        currentId = parentId
      }
      if (currentId === 1) {
        map.set(1, path)
      }
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

      if (!idHasKids && !siblingHasKids && siblingPath != null) {
        //  handles single window delete case (when x-button being used)
        //  if window doesn't have kids, sibling window doesn't have kids and sibling isn't null,
        //  setting valid parent(top tree node that has sibling) to sibling window path and deleteing all winodws below it
        validParent(map, siblingId)
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
        validParent(map, siblingId)
        delKids(windowMap, kids)
      }
      //  otherwise keep sibling window state
      //console.log('map', new Map(map))
      set({ windowMap: map })
    }

    if (id === 1) {
      set({ windowMap: defaultMap })
    } else {
      handleDelete(windowMap, id)
    }
  },
  // remove all nodes, open the default window
  clearWindows: () => set({ windowMap: defaultMap }),
  updateWindowPath: (id: number, path: string) => {
    const windowMap = get().windowMap

    if (windowMap.has(id)) {
      windowMap.set(id, path)
      set({ windowMap: windowMap })
    } else {
      set({ windowMap: windowMap })
    }
  }
}))

export default useWindowStore
