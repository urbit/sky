import { create } from 'zustand'
import { kids } from '../api/sky'

type Bookmark = string

interface HomescreenStore {
  landscapeApps: Array<Bookmark>
  fetchLandscapeApps: () => void
}

const useHomescreenStore = create<HomescreenStore>(set => ({
  landscapeApps: [],
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
