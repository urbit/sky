import '@urbit/sigil-js'
// @ts-expect-error Type definitions for PNG imports are missing
import bellIcon from '../assets/images/bell.png'
// @ts-expect-error Type definitions for PNG imports are missing
import closeIcon from '../assets/images/close.png'
import useWindowStore from '../state/useWindowStore'

export default function StatusBar() {
  const {
    workspaces,
    activeWorkspaceID,
    setActiveWorkspaceID,
    unmountWorkspace,
    addWorkspace,
  } = useWindowStore()

  // TODO fix
  // Get all mounted workspaces sorted by ID
  const mountedWorkspaces = Array.from(workspaces.entries())
    .filter(([key, workspace]) => key !== 0 && workspace.mounted)
    .sort(([a], [b]) => a - b)

  const sigilConfig = {
    // TODO don't hard-code height all over this component
    // changing size in sigilConfig upsets layout
    size: '30px',
    point: `~${window.ship || 'zod'}`,
    // TODO get colors from tlon/landscape user preferences
    foreground: '#FFF',
    background: '#c10c31',
    detail: 'none',
    space: 'default',
  }

  const handleHomeClick = () => {
    setActiveWorkspaceID(0)
  }

  return (
    <div
      className="fr ac jb"
      style={{ height: '40px', paddingLeft: '5px', paddingRight: '5px' }}
    >
      <div className="fr ac">
        <div
          className="br1 fr ac jc b1 pointer"
          style={{
            height: '30px',
            width: '35px',
            marginRight: '10px',
          }}
          onClick={handleHomeClick}
        >
          <span>~</span>
        </div>
        {mountedWorkspaces.map(([id, workspace]) => (
          <div
            key={id}
            className={`br1 fr ac jb pointer ${
              id === activeWorkspaceID ? 'b2' : 'b1'
            }`}
            style={{
              height: '30px',
              paddingLeft: '10px',
              paddingRight: '10px',
              width: '200px',
              marginRight: '10px',
            }}
            onClick={() => setActiveWorkspaceID(id)}
          >
            <span>{workspace.name || `Workspace ${id}`}</span>
            {id !== 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  unmountWorkspace(id)
                }}
              >
                <img
                  style={{ height: '10px', width: '10px' }}
                  src={closeIcon}
                  alt="Close workspace"
                />
              </div>
            )}
          </div>
        ))}
        <div
          className="br1 fr ac jc b1 pointer"
          style={{
            height: '30px',
            width: '35px',
            marginRight: '10px',
          }}
          onClick={addWorkspace}
        >
          <span>+</span>
        </div>
      </div>
      <div className="fr ac jb" style={{ height: '30px' }}>
        <div
          className="fr ac jc br1 b1"
          style={{ width: '30px', height: '30px', marginLeft: '10px' }}
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
