import { create } from 'zustand'
import { kids } from '../api/namespace'

type Bookmark = string

interface HomescreenStore {
  hasWallpaper: boolean
  landscapeApps: Array<Bookmark>
  setHasWallpaper: (hasWallpaper: boolean) => void
  fetchLandscapeApps: () => void
}

const useHomescreenStore = create<HomescreenStore>(set => ({
  hasWallpaper: true,
  landscapeApps: [],
  setHasWallpaper: (hasWallpaper: boolean) => {
    set({ hasWallpaper })
  },
  fetchLandscapeApps: async () => {
    console.log('Running fetchLandscapeApps')
    const appsArray = await kids('/apps', 'y')

    if (appsArray) {
      set({ landscapeApps: appsArray })
    }
  },
}))

export default useHomescreenStore
