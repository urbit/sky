import { Allotment } from 'allotment'
import useWindowStore from '../state/useWindowStore'
import { WindowProps } from '../types/windows'

export default function Window({ id, path }: WindowProps) {
  const { addWindowNode } = useWindowStore()

  // TODO handle case where path is null / empty

  function handleClick() {
    addWindowNode(id, '~sampel/home')
  }

  return (
    //  TODO move b1 br1 classes to a div inside the pane
    //  right now it looks as if corners are being cut off
    //  by the space between windows
    <div className='b1 br1 fc ac jc' style={{ width: '100%', height: '100%' }} onClick={handleClick}>
      <Allotment.Pane
        visible
        key={id}
        preferredSize="100%"
      >
        <p></p>
      </Allotment.Pane>
    </div>
  )
}
