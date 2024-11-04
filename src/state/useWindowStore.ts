import { create } from 'zustand'
import WindowState from './windowState'

// homepage
const defaultMap = new Map<number, string | null>([
  [1, 'https://en.wikipedia.org/wiki/Tiling_window_manager']
]);

const useWindowStore = create<WindowState>((set, get) => ({
  // init homepage
  windowMap: defaultMap,
  // add a new window to the tree
  addWindowNode: (parentId: number, path: string) => {
    const windowMap = get().windowMap
    const parentPath = windowMap.get(parentId) ?? null;
    const newId = parentId * 2

    windowMap.set(newId, parentPath)
    windowMap.set(newId + 1, path)
    windowMap.set(parentId, null)
    
    set({ windowMap });
  },
  // remove a node from the tree
  delWindowNode: (id: number) => {
    const windowMap = get().windowMap

    windowMap.delete(id)

    function updatedMap(id: number): void {
      if(id === 1){
        set({ windowMap: defaultMap })
        return
      }
      else if(isEven(id)){
        const siblingId = id + 1;  
        const siblingPath = windowMap.get(siblingId) ?? null;
        windowMap.set(id / 2, siblingPath)
        windowMap.delete(siblingId)

      }else{
        const siblingId = id - 1;  
        const siblingPath = windowMap.get(siblingId) ?? null;
        windowMap.set(siblingId / 2, siblingPath)
        windowMap.delete(siblingId)

      }
    }

    function isEven(num: number): boolean {
      return num % 2 === 0;
    }

    updatedMap(id)
    console.log('updated map', windowMap)
    set({ windowMap });

  },
  // remove all nodes, open the default window
  clearWindows: () => set({ windowMap: defaultMap })
}))

export default useWindowStore
