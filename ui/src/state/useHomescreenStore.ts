import { create } from 'zustand'
import { kids } from '../api/sky'

type Bookmark = string

interface HomescreenStore {
  hasWallpaper: boolean,
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
    const appsRes = await kids('/apps', 'y')

    if (appsRes) {
      const data = await appsRes.json()
      set({ landscapeApps: data.urls })
    }
  },
}))

export default useHomescreenStore
