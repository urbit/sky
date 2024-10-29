import { Allotment } from 'allotment'
import useWindowStore from '../state/useWindowStore'
import { WindowProps } from '../types/windows'
import NavBar from './NavBar'

export default function Window({ id, path }: WindowProps) {
  const { addWindowNode } = useWindowStore()

  function handleClick() {
    // TODO get real @p
    addWindowNode(id, path || '~sampel/home')
  }

  return (
    <Allotment>
      <Allotment.Pane
        visible
        key={id}
      >
        <div className='fc ac jc' style={{ width: '100%', height: '100%', padding: '5px' }} onClick={handleClick}>
          <div className='fc as js b1 br1' style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <NavBar />
            <div className='fc ac jc' style={{ width: '100%', height: '100%' }}>
              <p>{id}</p>
            </div>
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
