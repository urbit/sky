import { useState, useEffect } from 'react'
import PathBar from './PathBar'
import { kids } from '../api/sky'
//import useWindowStore from '../state/useWindowStore.ts'

interface HomeScreenProps {
  id: number
}

export default function HomeScreen({ id }: HomeScreenProps) {
  const [landscapeApps, setLandscapeApps] = useState<Array<string>>([])

  useEffect(() => {
    async function foo() {
      const apps = await kids('/apps', 'y')

      if (apps) {
        const data = await apps.json()
        setLandscapeApps(data.urls)
      }
    }

    foo()
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
            {landscapeApps.map((app: string) => {
              return (
                <p>{app.split('/')[2]}</p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
