// TODO remove App.css
import './App.css'
import './style/hollow.css'
import './style/spine.css'
import './style/feather.css'
import 'allotment/dist/style.css'
import './style/wind.css'
import WindowContainer from './components/WindowContainer.tsx'
import useWindowStore from './state/useWindowStore.ts'
import StatusBar from './components/StatusBar.tsx'
import { useEffect, useState } from 'react'

function App() {
  const {
    windowMap,
    active,
    addWindow,
    delWindow,
    updateWindowPath,
    isActive,
  } = useWindowStore()

  const [dragWindow, setDragWindow] = useState(0)

  function handleDragStart(event: React.DragEvent, id: number) {
    const container = document.getElementById(id.toString())

    if (container) {
      const containerTop = container.getBoundingClientRect().top
      if (
        event.clientY >= containerTop &&
        event.clientY <= containerTop + 40 &&
        windowMap.size >= 2
      ) {
        //  window styling
        event.dataTransfer.effectAllowed = 'move'
        setDragWindow(id)
        container.classList.add('o5')
        container.classList.add('bd1')

        //  removing iframe top-overlay
        const overlay = container.getElementsByClassName(
          'overlay'
        )[0] as HTMLElement
        container.removeChild(overlay)

        //  removing pointer events from iframes while onDrag event active
        const containers = document.querySelectorAll('.container')
        containers.forEach(container => {
          const iframe = container.querySelector('iframe') as HTMLElement
          if (iframe) {
            iframe.style.pointerEvents = 'none'
          }
        })
        // const content = container.innerHTML;
        // event.dataTransfer.setData('text/plain', content);
      }
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>, id: number) {
    event.preventDefault()

    //  removing styling
    const container = document.getElementById(dragWindow.toString())
    container?.classList.remove('o5')
    container?.classList.remove('bd1')
    container?.classList.remove('grabber')

    //  pointer events on iframes set back to automatic
    const containers = document.querySelectorAll('.container')
    containers.forEach(container => {
      const iframe = container.querySelector('iframe') as HTMLElement
      if (iframe) {
        iframe.style.pointerEvents = 'auto'
      }
    })

    if (dragWindow === null || dragWindow === id) return

    //  swap content logic
    if (dragWindow !== 0) {
      const idPath = windowMap.get(id) ?? '/~sampel/home'
      updateWindowPath(id, windowMap.get(dragWindow) ?? '/~sampel/home')
      updateWindowPath(dragWindow, idPath)
      setDragWindow(0)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault()
        if (active !== null) {
          addWindow(active, '')
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        event.preventDefault()
        if (active !== null) {
          if (active === 1) {
            updateWindowPath(active, '')
          } else {
            delWindow(active)
            isActive(null)
          }
        }
      }
    }

    if (active !== null) {
      window.addEventListener('keydown', handleKeyDown, { capture: true })
    }
    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [active, delWindow, addWindow, updateWindowPath, isActive])

  return (
    <div style={{ width: `calc(100vw - ${20}px)`, height: '100vh' }}>
      <StatusBar />
      {/*
        TODO this height calc is a kludge, fixes StatusBar
        shoving the WindowContainer off the bottom of the screen
      */}
      <div style={{ width: '100%', height: `calc(100% - ${65}px)` }}>
        <WindowContainer
          map={windowMap}
          id={1}
          isVertical={window.innerWidth > window.innerHeight}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
        />
      </div>
    </div>
  )
}

export default App
