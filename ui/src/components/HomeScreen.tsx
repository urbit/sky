import PathBar from './PathBar'
import useWindowStore from '../state/useWindowStore.ts'
import useHomescreenStore from '../state/useHomescreenStore.ts'

interface HomescreenProps {
  id: number
}

export default function Homescreen({ id }: HomescreenProps) {
  const { updateWindowPath } = useWindowStore()
  const { landscapeApps } = useHomescreenStore()

  return (
    <div className="p4 hf wf ac jc">
      <div className="hf wf fr ac jc">
        <div className="hf fc ac js">
          <div className="wf fr ac jc">
            <PathBar id={id} focus={true} path={''} />
          </div>
          <div
            className="wf fr as jc frw"
            style={{ width: '500px', flexWrap: 'wrap', marginTop: '8px' }}
          >
            {landscapeApps.map((appPath: string, index: number) => {
              const appName = appPath.split('/')[2]

              if (appName) {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      updateWindowPath(id, `~${window.ship}/apps/${appName}`)
                    }
                    className="b2 br1 p2 fc as je"
                    style={{
                      height: '100px',
                      width: '100px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      marginBottom: '8px',
                      textDecoration: 'none',
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
