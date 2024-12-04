import React, { useState, useEffect } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { get, findShipDomain } from '../../api/sky'
import FilePNG from './FilePNG'
import FileMarkdown from './FileMarkdown'

interface FileSystemProps {
  id: number
  path: string
}

async function renderFile(res: Response): Promise<JSX.Element> {
  const contentType = res.headers.get('content-type')

  if (!contentType) {
    console.log('No content type found')
    return <p>No content type found</p>
  }

  switch (contentType.split(';')[0]) {
    case 'text/plain': {
      console.log('Rendering text/plain')
      return <></>
    }
    case 'text/html': {
      console.log('Rendering text/html')
      return <></>
    }
    case 'text/markdown': {
      console.log('Rendering text/markdown')
      const text = await res.text()
      return <FileMarkdown md={text} />
    }
    case 'image/png': {
      console.log('Rendering image/png')
      const blob = await res.blob()
      const objectURL = URL.createObjectURL(blob)
      return <FilePNG url={objectURL} />
    }
    default: {
      console.log(`Rendering ${contentType} not supported`)
      return <></>
    }
  }
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get(path);
        if (res) {
          const newEndpointContent = await renderFile(res);
          setFileViewerContent(newEndpointContent);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    };

    fetchData();
  }, []);

  const handleUploadClick = () => {
    const input = document.querySelector('input[type="file"]')
    if (input) (input as HTMLInputElement).click()
  }

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList) return

    const shipDomain = await findShipDomain(path)
    const endpoint = path.split('/').slice(1).join('/')

    for (const file of Array.from(fileList)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        // TODO should use put() from Sky API
        console.log(`Attempting to POST to ${shipDomain}/${endpoint}`)
        const res = await fetch(`${shipDomain}/${endpoint}`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        console.log('Upload successful:', res)
        const newResponse = await get(path)

        if (newResponse) {
          const newEndpointContent = await renderFile(newResponse)
          setFileViewerContent(newEndpointContent)
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    event.target.value = ''
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value.startsWith('/')) {
      const audioContext = new (window.AudioContext || window.AudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.2
      )

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2)

      setNewSegment(value.slice(1))
    } else {
      setNewSegment(value)
    }
  }

  const createFileMenu = (
    <div className="fc ac jc hf wf b2">
      <button onClick={handleUploadClick}>Upload a file</button>
      <input
        type="file"
        accept=".png, .md"
        style={{ display: 'none' }}
        onChange={uploadFiles}
      />
    </div>
  )

  const segments = path.split('/')
  const { updateWindowPath } = useWindowStore()
  const [fileViewerContent, setFileViewerContent] = useState(createFileMenu)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newSegment, setNewSegment] = useState('')

  function handlePathSegmentClick(index: number) {
    updateWindowPath(id, path.split('/').slice(index).join('/'))
  }

  function handleAddSegment() {
    if (newSegment.trim()) {
      const newPath = `${path}/${newSegment.trim()}`
      updateWindowPath(id, newPath)
      setNewSegment('')
      setIsEditing(false)
    }
  }

  return (
    <div className="fc hf wf p2">
      <div
        className="fr ac b1"
        style={{
          height: '50px',
          padding: '10px',
          position: 'relative',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsEditing(false)
          setNewSegment('')
        }}
        onClick={() => setIsEditing(true)}
      >
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <span
              className="f0"
              style={{ cursor: 'pointer' }}
              onClick={() => handlePathSegmentClick(index)}
            >
              {segment}
            </span>
            {index < segments.length - 1 && (
              <span className="f4" style={{ margin: '0 5px' }}>
                /
              </span>
            )}
          </React.Fragment>
        ))}
        {isHovered && !isEditing && (
          <span className="f4" style={{ margin: '0 5px' }}>
            /
          </span>
        )}
        {isEditing && (
          <input
            type="text"
            className="b1 wf"
            value={newSegment}
            onChange={handleInputChange}
            onBlur={handleAddSegment}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAddSegment()
              }
            }}
            autoFocus
            style={{ marginLeft: '5px' }}
          />
        )}
      </div>
      <div className="hf wf b1 br1" style={{ overflow: 'scroll' }}>
        {fileViewerContent}
      </div>
    </div>
  )
}
