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
import { useEffect } from 'react'

function App() {
  const { windowMap, active, addWindow, delWindow, updateWindowPath } = useWindowStore()


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        if (active !== null){
        addWindow(active, '')
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        event.preventDefault();
        if (active !== null){
          if(active === 1){
          updateWindowPath(active, '')
          }else{
             delWindow(active)
          }
        }
      }
    };
    if (active !== null){
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    }
    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
 }, [active]);

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
        />
      </div>
    </div>
  )
}

export default App
