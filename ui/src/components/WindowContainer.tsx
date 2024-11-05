import { Allotment } from "allotment";
import { WindowContainerProps } from "../types/windows.ts";
import Window from "./Window.tsx";

<<<<<<< HEAD:src/components/WindowContainer.tsx
export default function WindowContainer({ map, id, isVertical }: WindowContainerProps): JSX.Element {
  if (!map) return <></>
  
  const childId = id * 2
  const hasChildren = map.get(id) === null
  //console.log('does ', id, 'have children', hasChildren)
=======
export default function WindowContainer({
  node,
  isVertical,
}: WindowContainerProps): JSX.Element {
  if (!node) return <></>;

  const hasChildren = node.left || node.right;
>>>>>>> origin:ui/src/components/WindowContainer.tsx

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
        <Window id={id} path={map.get(id) ?? null} />
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
<<<<<<< HEAD:src/components/WindowContainer.tsx
          {map.has(childId) && <WindowContainer map={map} id={childId} isVertical={!isVertical} />}
          {map.has(childId + 1) && <WindowContainer map={map} id={childId + 1} isVertical={!isVertical} />}
=======
          {node.left && (
            <WindowContainer node={node.left} isVertical={!isVertical} />
          )}
          {node.right && (
            <WindowContainer node={node.right} isVertical={!isVertical} />
          )}
>>>>>>> origin:ui/src/components/WindowContainer.tsx
        </Allotment>
      )}
    </Allotment>
  );
}
