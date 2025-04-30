import { useState, useEffect } from 'react'
import PathBar from './PathBar'
import { kids } from '../api/sky'
import useWindowStore from '../state/useWindowStore.ts'

interface HomeScreenProps {
  id: number
}

export default function HomeScreen({ id }: HomeScreenProps) {
  const [landscapeApps, setLandscapeApps] = useState<Array<string>>([])
  const { updateWindowPath } = useWindowStore()

  useEffect(() => {
    async function fetchApps() {
      const apps = await kids('/apps', 'y')

      if (apps) {
        const data = await apps.json()
        setLandscapeApps(data.urls)
      }
    }

    fetchApps()
  }, [])

  return (
    <div className="p4 b1">
      <div className="hf wf fr ac jc b1">
        <div className="hf fc ac js">
          <div className="wf fr ac jc">
            <PathBar id={id} path={`~${window.ship}/home`} />
          </div>
          <div
            className="wf fr as js frw"
            style={{ width: '500px', flexWrap: 'wrap', marginTop: '8px' }}
          >
            {landscapeApps.map((appPath: string, index: number) => {
              const appName = appPath.split('/')[2]
              if (appName) {
                return (
                  <div
                    key={index}
                    onClick={() => updateWindowPath(id, `~${window.ship}${appPath}`)}
                    className="b2 br1 p2 fc as je"
                    style={{
                      height: '100px',
                      width: '100px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      marginBottom: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    {appName}
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
