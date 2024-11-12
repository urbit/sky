import { useState } from 'react'
import { NavBarProps } from '../types/navbar.ts'
import useWindowStore from '../state/useWindowStore.ts'
import ob from 'urbit-ob'

const isValidPath = (path: string): boolean => {
  if (path.startsWith('/')) return false
  if (path.length > 0 && !/^~/.test(path)) return false
  const azp = path.split('/')[0]

  // validate @p
  // TODO this doesn't catch everything, should be
  //      as robust as the dojo is about this and
  //      should behave the same way
  if (azp.startsWith('~')) {
    // star
    if (azp.length === 7 && !ob.isValidPatp(azp)) return false
    // planet
    if (azp.length === 14 && !ob.isValidPatp(azp)) return false
    // moon
    if (azp.length === 21 && !ob.isValidPatp(azp)) return false
    if (azp.length === 28 && !ob.isValidPatp(azp)) return false
    // comet
    if (azp.length === 57 && !ob.isValidPatp(azp)) return false
  }

  // check endpoint is url-safe
  const end = `/${path.split('/').slice(1).join('/')}`
  if (!/^[a-zA-Z0-9/_.-]+$/.test(end)) return false

  return true
}

export default function NavBar({ id, path }: NavBarProps) {
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(path)
  const { delWindow, updateWindowPath } = useWindowStore()

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value

    if (isValidPath(newValue)) {
      setInputValue(newValue)
    } else {
      const audioContext = new (window.AudioContext || window.AudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.2
      )

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2)
    }
  }

  function handlePathClick() {
    console.log(id)
    setIsEditing(true)
  }

  function handleInputBlur() {
    setIsEditing(false)
  }

  // TODO if first path segment is azimuth point, convert to @p
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isValidPath(inputValue)) {
      updateWindowPath(id, inputValue)
      setIsEditing(false)
    }
  }

  function handleXClick() {
    delWindow(id)
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
          <p>{path}</p>
        )}
      </div>
      {/* TODO add real buttons */}
      <p onClick={handleXClick} style={{ cursor: 'pointer' }}>
        x
      </p>
    </div>
  )
}
