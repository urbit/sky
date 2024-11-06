import { useState } from 'react'
import { NavBarProps } from '../types/navbar.ts'
import useWindowStore from '../state/useWindowStore.ts'

export default function NavBar({ id, path }: NavBarProps) {
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(path)
  const { updateWindowPath } = useWindowStore()

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function handlePathClick() {
    setIsEditing(true)
  }

  function handleInputBlur() {
    setIsEditing(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateWindowPath(id, inputValue)
    setIsEditing(false)
  }

  return (
    <div
      className="fr ac jb b2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '30px',
        paddingRight: '10px',
        opacity: hovered ? 1.0 : 0.0
      }}
    >
      <div
        className="fr ac"
        style={{ width: '100%', height: '100%' }}
        onClick={handlePathClick}
      >
        {isEditing ? (
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <input
              type="text"
              className="b3"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              style={{ width: '100%' }}
            />
          </form>
        ) : (
          // TODO break up into breadcrumbs
          <p>{path}</p>
        )}
      </div>
      {/* TODO add real buttons */}
      <div className="fr ac jb" style={{ width: '30px' }}>
        <p>_</p>
        <p>x</p>
      </div>
    </div>
  )
}
