import { Allotment } from 'allotment'
import { WindowContainerProps } from '../types/windows.ts'
import Window from './Window.tsx'

export default function WindowContainer({ node, isVertical }: WindowContainerProps): JSX.Element {
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


  return (
    <Allotment
      snap
      proportionalLayout={true}
      separator={true}
      vertical={isVertical}
      onDragEnd={handleDragEnd}
      onReset={handleReset}
      onVisibleChange={handleVisibleChange}
    >
      {!hasChildren ? (
        // return a window
        <Window id={node.id} path={node.path} />
      ) : (
        // return a window container
        <Allotment
          snap
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

