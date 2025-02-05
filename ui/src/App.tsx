import 'allotment/dist/style.css'
import WindowContainer from './components/WindowContainer.tsx'
import useWindowStore from './state/useWindowStore.ts'
import StatusBar from './components/StatusBar.tsx'
import Window from './components/Window.tsx'
import { useEffect, useState, useRef } from 'react'
import { get, put } from './api/sky'
import Urbit from '@urbit/http-api'

function App() {
  const {
    windowMap,
    maxWindow,
    activeWindowID,
    addWindow,
    delWindow,
    setMaxWindow,
    togglePathBarView,
    updateWindowPath,
    setActiveWindowID,
    //setWindowState,
  } = useWindowStore()

  const [dragWindow, setDragWindow] = useState(0)
  const holdingKey = useRef(false)

  // on mount, authenticate ship
  useEffect(() => {
    const urbit = new Urbit('')
    urbit.ship = window.ship
    console.log('window.ship on init: ', window.ship)
  }, [])

  // NOTE for testing purposes only
  // on mount, send test requests to fakeship
  useEffect(() => {
    async function fetchData() {
      try {
        const file = new File(['This is plaintext four'], 'note.txt', { type: 'text/plain' })

        const putRes = await put('~zod/text', file)

        if (putRes && !putRes.ok) {
          throw new Error(`PUT failed with status: ${putRes.status}`)
        }

        if (putRes && putRes.ok) {
          const getRes = await get('~zod/text')

          if (getRes && !getRes.ok) {
            throw new Error(`GET failed with status: ${getRes.status}`)
          }

          if (getRes && getRes.ok) {
            const data = await getRes.text()
            console.log('GET successful!')
            console.log(data)
          }
        }
      } catch (error) {
        console.error('GET failed:', error)
      }

      //const resDelete = await del('~zod/api/del')
      //
      //if (resDelete) {
      //  console.log('got response from DELETE request', resDelete)
      //}
    }
    fetchData()
  }, [])

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

        event.target.addEventListener('dragend', function() {
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
    if (windowMap.size > 1 && maxWindow === 0) {
      setDragWindow(activeWindowID)
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

  // listen for keydown events
  useEffect(() => {
    console.log(`path: ${windowMap.get(activeWindowID)}`)
    console.log(`activeWindowID: ${activeWindowID}`)
    console.log(`maxWindow: ${maxWindow}`)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        holdingKey.current = true
        handleSwap()
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        if (event.metaKey) {
          console.log('Pressed CMD+n')
        } else {
          console.log('Pressed CTRL+n')
        }
        event.preventDefault()

        if (maxWindow === 0) {
          addWindow(activeWindowID, '')
        }
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        if (event.metaKey) {
          console.log('Pressed CMD+w')
        } else {
          console.log('Pressed CTRL+w')
        }
        event.preventDefault()

        if (maxWindow === 0) {
          delWindow(activeWindowID)
        }
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'm') {
        if (event.metaKey) {
          console.log('Pressed CMD+m')
        } else {
          console.log('Pressed CTRL+m')
        }
        event.preventDefault()

        if (activeWindowID > 1 && maxWindow === 0) {
          const path = windowMap.get(activeWindowID) ?? null

          if (path !== null) {
            setMaxWindow(activeWindowID)
          }
        } else if (maxWindow !== 0) {
          setMaxWindow(0)
        }
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        if (event.metaKey) {
          console.log('Pressed CMD+k')
        } else {
          console.log('Pressed CTRL+k')
        }

        event.preventDefault()

        if (activeWindowID !== null) {
          const path = windowMap.get(activeWindowID) ?? null

          if (path !== null && path !== '') {
            togglePathBarView(activeWindowID)
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

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('keyup', handleKeyUp, { capture: true })

    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('keyup', handleKeyUp, { capture: true })
    }
  }, [
    maxWindow,
    activeWindowID,
    delWindow,
    addWindow,
    updateWindowPath,
    setActiveWindowID,
  ])

  // TODO restore
  // on mount, init window state
  //useEffect(() => {
  //  async function init() {
  //    const res = await get('~zod/sys/state/windows')
  //
  //    if (res && res.ok) {
  //      const data = await res.json()
  //      setWindowState(data)
  //    }
  //  }
  //
  //  init()
  //}, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        padding: '5px 5px 0px 5px',
      }}
    >
      <StatusBar />
      {/* 
          TODO the calc is a hack to prevent the
          StatusBar shoving the WindowContainer off
          the bottom of the screen
      */}
      <div className="wf relative" style={{ height: 'calc(100% - 45px)' }}>
        {maxWindow !== 0 && (
          <div
            className="wf hf absolute p3"
            style={{ zIndex: 100, opacity: '98%' }}
          >
            <Window
              id={maxWindow}
              path={windowMap.get(maxWindow) ?? ''}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              dragWindow={dragWindow}
            />
          </div>
        )}
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
