import { create } from "zustand";
import WindowState from "./windowState";

// homepage
const defaultMap = new Map<number, string | null>([[1, "~sampel/home"]]);

const useWindowStore = create<WindowState>((set, get) => ({
  // init homepage
  windowMap: defaultMap,
  // add a new window to the tree
  addWindow: (parentId: number, path: string) => {
    const windowMap = get().windowMap;
    const parentPath = windowMap.get(parentId) ?? null;

    windowMap.set(parentId * 2, parentPath);
    windowMap.set(parentId * 2 + 1, path);
    windowMap.set(parentId, null);

    set({ windowMap });
  },
  // remove a node from the tree
  delWindow: (id: number) => {
    const windowMap = get().windowMap;

    windowMap.delete(id);

    function isEven(num: number): boolean {
      return num % 2 === 0;
    }

    function delKids(map: Map<number, string | null>, id: number) {
      const sequence = new Set<number>();
      let currentValue = id;

      while (currentValue <= Math.max(...Array.from(map.keys()))) {
        sequence.add(currentValue);
        sequence.add(currentValue + 1);
        currentValue *= 2;
      }

      map.forEach((value, key) => {
        if (sequence.has(key)) {
          console.log(value);
          map.delete(key);
        }
      });
    }

    if (id === 1) {
      set({ windowMap: defaultMap });
    } else if (isEven(id)) {
      //  if we delete window 2, we remove window 3 as well
      //  and asign path of window 3 to parent window 1
      const siblingId = id + 1;
      const siblingPath = windowMap.get(siblingId) ?? null;
      windowMap.set(id / 2, siblingPath);
      delKids(windowMap, id);
      console.log("new map", windowMap);
      set({ windowMap });
    } else {
      //  if we delete window 3, we remove all
      //  and asign path of window 2 to parent window 1
      const siblingId = id - 1;
      const siblingPath = windowMap.get(siblingId) ?? null;
      windowMap.set(siblingId / 2, siblingPath);
      windowMap.delete(siblingId);
      delKids(windowMap, id);
      console.log("new map", windowMap);
      set({ windowMap });
    }
  },
  // remove all nodes, open the default window
  clearWindows: () => set({ windowMap: defaultMap }),
  updateWindowPath: (id: number, path: string) => {
    const windowMap = get().windowMap;

    if (windowMap.has(id)) {
      windowMap.set(id, path);
      set({ windowMap: windowMap });
    } else {
      set({ windowMap: windowMap });
    }
  },
}));

export default useWindowStore;
