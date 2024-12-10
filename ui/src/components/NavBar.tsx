import { useState } from 'react'
import { NavBarProps } from '../types/navbar.ts'
import PathBar from './PathBar'
import useWindowStore from '../state/useWindowStore.ts'

export default function NavBar({ id, path }: NavBarProps) {
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { delWindow } = useWindowStore()

  function handlePathClick() {
    setIsEditing(true)
  }

  function handleXClick() {
    delWindow(id)
  }

  return (
    <div
      className="wf fr ac jb b2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '30px',
        paddingRight: '10px',
        opacity: hovered ? 1.0 : 0.0,
      }}
    >
      <div
        className="hf wf fr ac"
        onClick={handlePathClick}
      >
        {isEditing ? <PathBar id={id} path={path} /> : <p>{path}</p>}
      </div>
      {/* TODO add real buttons */}
      <p onClick={handleXClick} style={{ cursor: 'pointer' }}>
        x
      </p>
    </div>
  )
}
