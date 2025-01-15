import { Allotment } from 'allotment'
import { useRef, useCallback } from 'react'
import Window from './Window.tsx'
import useWindowStore from '../state/useWindowStore'

export interface WindowContainerProps {
  map: Map<number, string> | undefined
  id: number
  isVertical: boolean
  handleDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void
  handleDragStart: (event: React.DragEvent, id: number) => void
  dragWindow: number
}

export default function WindowContainer({
  map,
  id,
  isVertical,
  handleDrop,
  handleDragStart,
  dragWindow,
}: WindowContainerProps): JSX.Element {
  const { delWindow } = useWindowStore()
  const lastChange = useRef<number[]>([])

  const childId = id * 2
  // A window has children if it's being used as a container
  const hasChildren = map?.has(childId) || map?.has(childId + 1)

  // TODO should get size info from Window and use
  // that for the preferredSize

  function handleDragEnd() {
    // TODO save new window proportions
  }

  function handleReset() {
    // TODO reset container to 50/50 if that's not
    // the default behaviour already
  }

  const handleChange = useCallback(
    (sizes: number[]): void => {
      // delete a window from state if user
      // made it invisible by shrinking it to size 0
      if (
        sizes.length > 1 &&
        JSON.stringify(sizes) != JSON.stringify(lastChange.current)
      ) {
        const index = sizes.findIndex(num => num === 0)

        if (index !== -1 && hasChildren) {
          if (index === 0 && map?.has(childId)) {
            setTimeout(() => {
              delWindow(childId)
            }, 1000)
          } else if (index === 1 && map?.has(childId + 1)) {
            setTimeout(() => {
              delWindow(childId + 1)
            }, 1000)
          } else {
            console.log('invalid index')
          }
        }
        lastChange.current = sizes
      }
    },
    [map, hasChildren, childId, delWindow]
  )

  // We know map must exist after this check
  if (!map) return <></>

  return (
    <Allotment
      snap
      proportionalLayout={true}
      separator={true}
      vertical={isVertical}
      onDragEnd={handleDragEnd}
      onReset={handleReset}
    >
      {!hasChildren ? (
        // return a window
        <Window
          id={id}
          path={map.get(id) ?? `${window.ship || window.urbitID}/home`}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          dragWindow={dragWindow}
        />
      ) : (
        // return a window container
        <Allotment
          snap
          proportionalLayout={true}
          separator={true}
          vertical={!isVertical}
          onDragEnd={handleDragEnd}
          onReset={handleReset}
          onChange={sizes => {
            handleChange(sizes)
          }}
          defaultSizes={[50, 50]}
        >
          {map.has(childId) && (
            <WindowContainer
              map={map}
              id={childId}
              isVertical={!isVertical}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              dragWindow={dragWindow}
            />
          )}
          {map.has(childId + 1) && (
            <WindowContainer
              map={map}
              id={childId + 1}
              isVertical={!isVertical}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              dragWindow={dragWindow}
            />
          )}
        </Allotment>
      )}
    </Allotment>
  )
}
