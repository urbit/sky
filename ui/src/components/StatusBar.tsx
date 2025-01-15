import '@urbit/sigil-js'
import bellIcon from '../assets/images/bell.png'
import closeIcon from '../assets/images/close.png'
import useWorkspaceStore from '../state/useWorkspaceStore'
import useWindowStore from '../state/useWindowStore'

const sigilConfig = {
  // TODO don't hard-code height all over this component
  // changing size in sigilConfig upsets layout
  size: '30px',
  // TODO remove hard-coded ship
  point: '~sampel-palnet',
  // TODO get colors from tlon/landscape user preferences
  foreground: '#FFF',
  background: '#c10c31',
  detail: 'none',
  space: 'default',
}

export default function StatusBar() {
  const { workspaceMap, activeWorkspace, setActiveWorkspace } = useWorkspaceStore()
  const {setWindowMap} = useWindowStore()

  function toggleActiveWorkspace(workspace: string) {
  console.log('running setActiveWorkspace(workspace)', workspace)
    setActiveWorkspace(workspace)
    const windowMap = workspaceMap.get(workspace);
    console.log('all maps', workspaceMap)
    if(windowMap !== undefined){
      console.log('get workspace', windowMap)
      setWindowMap(windowMap)
    }
  }
  return (
    <div className="fr ac jb" style={{ padding: '5px', height: '50px' }}>
      <div className="fr ac g1">
      {Array.from(workspaceMap).map(([workspace, windowMap]) => (
      <div
        key={workspace} 
        className={activeWorkspace === workspace ? "br1 fr ac jb b2" : "br1 fr ac jb b1"}
        style={{
          height: '30px',
          paddingLeft: '10px',
          paddingRight: '10px',
          width: '200px',
        }}
        onClick={() => toggleActiveWorkspace(workspace)}
      >
        <span>
          {workspace}
        </span>
        <div>
          <img
            style={{ height: '10px', width: '10px' }}
            src={closeIcon}
            alt="Close space"
          />
        </div>
      </div>
      ))}
      </div>
      <div className="fr ac jb" style={{ height: '30px' }}>
        <div
          className="fr ac jc br1 b1"
          style={{ width: '30px', height: '30px' }}
        >
          <img
            src={bellIcon}
            alt="Open notifications"
            style={{ height: '20px' }}
          />
        </div>
        <div
          className="br1 scroll-hidden"
          style={{ height: '30px', marginLeft: '5px' }}
        >
          <urbit-sigil {...sigilConfig} />
        </div>
      </div>
    </div>
  )
}
