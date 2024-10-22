import { Allotment } from 'allotment'
import { WindowContainerProps } from '../types/windows.ts'
import useWindowStore from '../state/useWindowStore.ts'

export default function WindowContainer({node, isVertical}: WindowContainerProps): JSX.Element {
  const { addWindowNode } = useWindowStore()

  if (!node) return <></>

  const hasChildren = node.left || node.right

  // TODO should get size info from WindowNode and use
  // that for the preferredSize

  function handleDragEnd() {
    // TODO save new window proportions
  }

  function handleReset() {
    // TODO reset container to 50/50 if that's not
    // the default behaviour already
  }

  function handleVisibleChange() {
    // TODO delete a window from state if the user has
    // made it invisible by shrinking it to size 0
  }

  function handleClick() {
    addWindowNode(node.id, '~sampel/home')
  }

  return (
    <Allotment
      proportionalLayout={true}
      separator={true}
      vertical={isVertical}
      onDragEnd={handleDragEnd}
      onReset={handleReset}
      onVisibleChange={handleVisibleChange}
    >
      {!hasChildren ? (
        // return a window
        <Allotment.Pane
          snap
          visible
          key={node.id}
          preferredSize="100%"
        >
          <div
            style={{ width: '100%', height: '100%' }}
            onClick={() => handleClick()}
          >
            <p>{node.id}</p>
          </div>
        </Allotment.Pane>
      ) : (
        // return a window container
        <Allotment
          proportionalLayout={true}
          separator={true}
          vertical={!isVertical}
          onDragEnd={handleDragEnd}
          onReset={handleReset}
          onVisibleChange={handleVisibleChange}
          defaultSizes={[50, 50]}
        >
          {node.left && <WindowContainer node={node.left} isVertical={!isVertical} />}
          {node.right && <WindowContainer node={node.right} isVertical={!isVertical} />}
        </Allotment>
      )}
    </Allotment>
  )
}

