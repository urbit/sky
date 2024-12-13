import './style/hollow.css'
import './style/spine.css'
import './style/feather.css'
import 'allotment/dist/style.css'
import './style/wind.css'
import WindowContainer from './components/WindowContainer.tsx'
import useWindowStore from './state/useWindowStore.ts'
import StatusBar from './components/StatusBar.tsx'
import { useEffect, useState, useRef } from 'react'

function App() {
  const {
    windowMap,
    activeWindowID,
    addWindow,
    delWindow,
    updateWindowPath,
    isActive,
  } = useWindowStore()

  const [dragWindow, setDragWindow] = useState(0)
  const holdingKey = useRef(false)

  function enableWindows() {
    setDragWindow(0)
    const containers = document.querySelectorAll('.container')
    containers.forEach(container => {
      // enabling iframes
      const iframe = container.querySelector('iframe') as HTMLElement
      if (iframe) {
        iframe.style.pointerEvents = 'auto'
      }
      //  removing overlay
      const overlays = container.getElementsByClassName('overlay')
      Array.from(overlays).forEach(overlay => {
        container.removeChild(overlay)
      })
    })
  }

  function handleDragStart(event: React.DragEvent, id: number) {
    const container = document.getElementById(id.toString())

    if (container && windowMap.size > 1) {
      holdingKey.current = false
      //  window styling
      container.classList.add('o5')
      container.classList.add('bd1')

      const iframe = container.querySelector('iframe') as HTMLIFrameElement

      if (iframe) {
        //  setting up draggable data to url string
        const dragImage = document.createElement('div')
        dragImage.style.position = 'absolute'
        dragImage.style.top = '-9999px'
        dragImage.style.pointerEvents = 'none'
        dragImage.style.zIndex = '-1'
        dragImage.innerHTML = `<span style="width: 100%;"> ${windowMap.get(id) ?? ''}</span>`

        container.appendChild(dragImage)

        event.dataTransfer.setDragImage(dragImage, 0, 0)

        event.target.addEventListener('dragend', function () {
          const eventIframe = (event.target as Element).querySelector(
            'iframe'
          ) as HTMLIFrameElement
          if (eventIframe) {
            //  removing appended data after event
            container.removeChild(dragImage)
          }
        })
      }
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>, id: number) {
    event.preventDefault()

    if (dragWindow === null || dragWindow === id) return

    //  swapping content
    if (dragWindow !== 0) {
      const idPath = windowMap.get(id) ?? ''
      updateWindowPath(id, windowMap.get(dragWindow) ?? '')
      updateWindowPath(dragWindow, idPath)
    }
    enableWindows()
  }

  function handleSwap() {
    if (windowMap.size > 1) {
      setDragWindow(activeWindowID ?? 0)
      const containers = document.querySelectorAll('.container')
      containers.forEach(container => {
        //  create overlay for each window
        const overlay = document.createElement('div')
        Object.assign(overlay.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          zIndex: '5',
          display: 'block',
        })
        overlay.classList.add('overlay', 'grabber')
        container.appendChild(overlay)

        //  disabling iframe
        const iframe = container.querySelector('iframe') as HTMLElement
        if (iframe) {
          iframe.style.pointerEvents = 'none'
        }
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault()
        holdingKey.current = true
        handleSwap()
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        console.log('Pressed CTRL+N')
        event.preventDefault()
        if (activeWindowID !== null) {
          addWindow(activeWindowID, '')
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        console.log('Pressed CTRL+W')
        event.preventDefault()
        if (activeWindowID !== null) {
          if (activeWindowID === 1) {
            updateWindowPath(activeWindowID, '')
          } else {
            delWindow(activeWindowID)
            isActive(null)
          }
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey || (!event.ctrlKey && holdingKey.current)) {
        holdingKey.current = false
        enableWindows()
      }
    }

    if (activeWindowID !== null) {
      window.addEventListener('keydown', handleKeyDown, { capture: true })
      window.addEventListener('keyup', handleKeyUp, { capture: true })
    }
    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('keyup', handleKeyUp, { capture: true })
    }
  }, [activeWindowID, delWindow, addWindow, updateWindowPath, isActive])

  // TODO handle real window.urbitID, not suitable for production
  useEffect(() => {
    if (!window.urbitID) {
      window.urbitID = '~sampel'
    }
  }, [])

  return (
    <div style={{ width: `calc(100vw - ${20}px)`, height: '100vh' }}>
      <StatusBar />
      {/*
        TODO this height calc is a kludge, fixes StatusBar
        shoving the WindowContainer off the bottom of the screen
      */}
      <div className="wf" style={{ height: `calc(100% - ${65}px)` }}>
        <WindowContainer
          map={windowMap}
          id={1}
          isVertical={window.innerWidth > window.innerHeight}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          dragWindow={dragWindow}
        />
      </div>
    </div>
  )
}

export default App
