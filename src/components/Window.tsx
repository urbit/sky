import { Allotment } from 'allotment'
import useWindowStore from '../state/useWindowStore'
import { WindowProps } from '../types/windows'

export default function Window({ id, path }: WindowProps) {
  const { addWindowNode } = useWindowStore()

  // TODO handle case where path is null

  function handleClick() {
    addWindowNode(id, '~sampel/home')
  }

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onClick={() => handleClick()}
    >
      <Allotment.Pane
        visible
        key={id}
        preferredSize="100%"
      >
        <div>
          <p>{id}</p>
        </div>
      </Allotment.Pane>
    </div>
  )
}
