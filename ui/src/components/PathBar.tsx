import { useState, useEffect } from 'react'
import useWindowStore from '../state/useWindowStore.ts'
//import ob from 'urbit-ob'

interface PathBarProps {
  id: number
  path: string | null
  focus: boolean
}

export default function PathBar({ id, path, focus }: PathBarProps) {
  const [inputValue, setInputValue] = useState('')
  const { workspaces, activeWorkspaceID, updateWindowPath, togglePathBarView } =
    useWindowStore()
  const pathBarView = workspaces.get(activeWorkspaceID)?.windowState.pathBarView

  useEffect(() => {
    setInputValue(path || '')
  }, [path])

  //const isValidPath = (path: string): boolean => {
  //  if (path.startsWith('/')) return false
  //  if (path.length > 0 && !/^~/.test(path)) return false
  //  const azp = path.split('/')[0]
  //
  //  // validate @p
  //  // TODO this doesn't catch everything, should be
  //  //      as robust as the dojo is about this and
  //  //      should behave the same way
  //  if (azp.startsWith('~')) {
  //    // star
  //    if (azp.length === 7 && !ob.isValidPatp(azp)) return false
  //    // planet
  //    if (azp.length === 14 && !ob.isValidPatp(azp)) return false
  //    // moon
  //    if (azp.length === 21 && !ob.isValidPatp(azp)) return false
  //    if (azp.length === 28 && !ob.isValidPatp(azp)) return false
  //    // comet
  //    if (azp.length === 57 && !ob.isValidPatp(azp)) return false
  //  }
  //
  //  // check endpoint is url-safe
  //  const end = `/${path.split('/').slice(1).join('/')}`
  //  if (!/^[a-zA-Z0-9/_.-]+$/.test(end)) return false
  //
  //  return true
  //}

  // TODO if first path segment is azimuth point, convert to @p
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pathBarView && pathBarView.includes(id)) {
      togglePathBarView(id)
    }

    updateWindowPath(id, inputValue)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value

    //if (isValidPath(newValue)) {
    setInputValue(newValue)
    //} else {
    //  const audioContext = new (window.AudioContext || window.AudioContext)()
    //  const oscillator = audioContext.createOscillator()
    //  const gainNode = audioContext.createGain()
    //
    //  oscillator.type = 'sine'
    //  oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
    //
    //  oscillator.connect(gainNode)
    //  gainNode.connect(audioContext.destination)
    //
    //  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    //  gainNode.gain.exponentialRampToValueAtTime(
    //    0.0001,
    //    audioContext.currentTime + 0.2
    //  )
    //
    //  oscillator.start()
    //  oscillator.stop(audioContext.currentTime + 0.2)
    //}
  }

  return (
    <form className="wf" onSubmit={handleSubmit}>
      <input
        type="text"
        autoFocus={focus}
        className="wf b3 br2 p1"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={`~${window.ship}/home`}
      />
    </form>
  )
}
