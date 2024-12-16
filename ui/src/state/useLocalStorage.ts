import { create } from 'zustand'
import LocalStorageState from './localStorageState'


const useLocalStorage = create<LocalStorageState>(() => ({
    getLocalStorage: () => {
        const windowMap = localStorage.getItem("windowMap") 
        if (windowMap) {
            try {
              const parsedMap: { [key: string]: string | null } = JSON.parse(windowMap);
              if (parsedMap instanceof Object) {
                return new Map<number, string | null>(Object.entries(parsedMap).map(([key, value]) => 
                    [Number(key), value as string | null]
                ));
              }
            } catch (e) {
              console.error("Error parsing windowMap from localStorage:", e);
            }
          }
        return null
    }
}))
export default useLocalStorage