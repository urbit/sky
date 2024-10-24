import './App.css'
import 'allotment/dist/style.css'
import WindowContainer from './components/WindowContainer.tsx'
import useWindowStore from './state/useWindowStore.ts'
import StatusBar from './components/StatusBar.tsx'

function App() {
  const { windowTree } = useWindowStore()

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <StatusBar />
      <WindowContainer 
        node={windowTree}
        isVertical={window.innerWidth > window.innerHeight}
      />
    </div>
  )
}

export default App
