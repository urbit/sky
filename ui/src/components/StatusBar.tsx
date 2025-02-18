import '@urbit/sigil-js'
// @ts-expect-error Type definitions for PNG imports are missing
import bellIcon from '../assets/images/bell.png'
// @ts-expect-error Type definitions for PNG imports are missing
import closeIcon from '../assets/images/close.png'
// @ts-expect-error Type definitions for PNG imports are missing
import downArrowIcon from '../assets/images/down-arrow.png'
import useWindowStore from '../state/useWindowStore'
import { useState, useEffect } from 'react'

const DEMO_UNMOUNTED_WORKSPACES = [
  { id: 100, name: 'foo' },
  { id: 101, name: 'bar' },
  { id: 102, name: 'baz' }
]

export default function StatusBar() {
  const {
    workspaces,
    activeWorkspaceID,
    setActiveWorkspaceID,
    unmountWorkspace,
    addWorkspace,
    updateWorkspaceName,
  } = useWindowStore()

  const [editingWorkspaceId, setEditingWorkspaceId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  
  // Add click-outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If we have a dropdown open and the click wasn't inside a dropdown menu
      if (dropdownOpen !== null && !(event.target as Element).closest('.workspace-dropdown')) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  // Helper to check if a workspace is empty (only has ~zod/home path)
  const isEmptyWorkspace = (workspace: any) => {
    const paths = Array.from(workspace.windowState.windowMap.values())
    return workspace.name === '' && paths.length === 1 && paths[0] === '~zod/home'
  }

  // Get all mounted workspaces sorted by lastMounted
  const mountedWorkspaces = Array.from(workspaces.entries())
    .filter(([key, workspace]) => key !== 0 && workspace.mounted)
    .sort(([, a], [, b]) => a.lastMounted - b.lastMounted)

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
            {editingWorkspaceId === id ? (
              <input
                className="flex-1 br1 b1"
                style={{
                  height: '20px',
                  minWidth: 0,
                  border: 'none',
                  padding: '0 5px',
                  background: 'transparent'
                }}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateWorkspaceName(id, editingName)
                    setEditingWorkspaceId(null)
                  } else if (e.key === 'Escape') {
                    setEditingWorkspaceId(null)
                  }
                }}
                onBlur={() => {
                  updateWorkspaceName(id, editingName)
                  setEditingWorkspaceId(null)
                }}
                autoFocus
              />
            ) : (
              <span
                className={workspace.name ? '' : 'italic'}
                onDoubleClick={() => {
                  setEditingWorkspaceId(id)
                  setEditingName(workspace.name || '')
                }}
              >
                {workspace.name || `Untitled`}
              </span>
            )}
            {id !== 0 && (
              isEmptyWorkspace(workspace) ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(dropdownOpen === id ? null : id)
                  }}
                  style={{ position: 'relative' }}
                >
                  <img
                    style={{ height: '10px', width: '10px', opacity: 0.75 }}
                    src={downArrowIcon}
                    alt="Show unmounted workspaces"
                  />
                  {dropdownOpen === id && (
                    <div 
                      className="b1 br1 workspace-dropdown"
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '0',
                        width: '150px',
                        background: 'white',
                        zIndex: 1000,
                        padding: '5px'
                      }}
                    >
                      {DEMO_UNMOUNTED_WORKSPACES.map(ws => (
                        <div
                          key={ws.id}
                          className="fr ac jb pointer"
                          style={{ padding: '5px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: implement mounting
                            setDropdownOpen(null)
                          }}
                        >
                          <span>{ws.name}</span>
                          <img
                            style={{ height: '8px', width: '8px' }}
                            src={closeIcon}
                            alt="Delete workspace"
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: implement deletion
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
              )
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
