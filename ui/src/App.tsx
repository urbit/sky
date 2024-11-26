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

  const [dragWindow, setDragWindow] = useState(0);

  function handleDragStart(event: React.DragEvent, id: number){
    const container = document.getElementById(id.toString());
    console.log(container)

    if(container){
      const containerTop = container.getBoundingClientRect().top;
      if (event.clientY >= containerTop && event.clientY <= containerTop + 40 && windowMap.size >= 2) {
        event.dataTransfer.effectAllowed = 'move';
        console.log('set drag window to', id)
        setDragWindow(id)
        container.classList.add('o5');
        container.classList.add('bd1');
      }
    }
  };

  function handleDrop(event: React.DragEvent<HTMLDivElement>, id: number){
    event.preventDefault(); 

    if(dragWindow === null || dragWindow === id) return;

    console.log('handle drop')
    if(dragWindow !== 0){
      const container = document.getElementById(dragWindow.toString());
      console.log('container', container)
      container?.classList.remove('o5');
      container?.classList.remove('bd1');
      container?.classList.remove('grabber');

      console.log('dropping in ', id)
      const idPath =  windowMap.get(id) ?? ''
      updateWindowPath(id, windowMap.get(dragWindow) ?? '')
      console.log('updating ', id , 'to', windowMap.get(dragWindow))
      updateWindowPath(dragWindow, idPath)
      console.log('updating ', dragWindow , 'to', idPath)
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
      window.addEventListener('keydown', handleKeyDown, { capture: true });
    }
    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
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
