import { Allotment } from 'allotment'
import useWindowStore from '../state/useWindowStore'
import { WindowProps } from '../types/windows'

export default function Window({ id, path }: WindowProps) {
  const { addWindowNode } = useWindowStore()

  function handleClick() {
    // TODO get real @p
    addWindowNode(id, path || '~sampel/home')
  }

  return (
    //  TODO move b1 br1 classes to a div inside the pane
    //  right now it looks as if corners are being cut off
    //  by the space between windows
    <Allotment>
      <Allotment.Pane
        visible
        key={id}
      >
        <div className='fc ac jc' style={{ width: '100%', height: '100%', padding: '5px' }} onClick={handleClick}>
          <div className='fc ac jc b1 br1' style={{ width: '100%', height: '100%' }}>
            <p>Window {id}</p>
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
