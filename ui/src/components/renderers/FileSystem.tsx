import React from 'react'
import useWindowStore from '../../state/useWindowStore'

interface FileSystemProps {
  id: number
  path: string
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
  const { updateWindowPath } = useWindowStore()
  const segments = path.split('/')

  const handleClick = (index: number) => {
    const newPath = segments.slice(0, index + 1).join('/')
    updateWindowPath(id, newPath)
  }

  return (
    <div className='fc hf wf'>
      <div className='fr ac b1' style={{ padding: '10px' }}>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <span
              className='f0'
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick(index)}
            >
              {segment}
            </span>
            {index < segments.length - 1 && <span className='f4' style={{ margin: '0 5px' }}>/</span>}
          </React.Fragment>
        ))}
      </div>
      <div className='b1' style={{ flex: 1 }}>
        {/* Empty space for now */}
      </div>
    </div>
  )
}
