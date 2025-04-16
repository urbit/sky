import React, { useState, useEffect } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { get, put } from '../../api/sky'
import FileImage from './FileImage'
import FileComposer from './FileComposer'
import FilePDF from './FilePDF'
import FileVideo from './FileVideo'
import FileAudio from './FileAudio'

interface FileSystemProps {
  id: number
  path: string
}

// Content types that FileComposer can handle
const composerContentTypes = new Set([
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
  'text/markdown',
  'text/x-markdown',
])

async function renderFile(path: string, res: Response): Promise<JSX.Element> {
  const contentType = res.headers.get('content-type')

  if (!contentType) {
    console.error('No content type found')
    return <p>No content type found</p>
  }

  const mimeType = contentType.split(';')[0]

  // Check if it's a text or other composer-friendly type
  if (composerContentTypes.has(mimeType)) {
    return <FileComposer path={path} />
  }

  // Extract main and sub types
  const [mainType, subType] = mimeType.split('/')

  // Group by main MIME type
  switch (mainType) {
    case 'image': {
      // Handle all image types with FileImage renderer
      const blob = await res.blob()
      const objectURL = URL.createObjectURL(blob)
      return <FileImage url={objectURL} />
    }
    case 'video': {
      // Handle all video types with FileVideo renderer
      const blob = await res.blob()
      const objectURL = URL.createObjectURL(blob)
      return <FileVideo url={objectURL} />
    }
    case 'audio': {
      // Handle all audio types with FileAudio renderer
      const blob = await res.blob()
      const objectURL = URL.createObjectURL(blob)
      return <FileAudio url={objectURL} />
    }
    case 'application': {
      if (subType === 'pdf') {
        const arrayBuffer = await res.arrayBuffer()
        const pdfData = new Uint8Array(arrayBuffer)
        return <FilePDF pdfData={pdfData} />
      }
      // Fall through to default for unhandled application types
      break
    }
  }

  // Default case for unhandled types
  console.error(`Rendering ${mimeType} not supported by filesystem`)
  return <p>{`${mimeType} not supported by filesystem`}</p>
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
  const handleUploadClick = () => {
    const input = document.querySelector('input[type="file"]')
    if (input) (input as HTMLInputElement).click()
  }

  function handleComposerClick() {
    setFileViewerContent(<FileComposer path={path} />)
  }

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList) return

    for (const file of Array.from(fileList)) {
      try {
        const res = await put(path, file)

        if (!res || !res.ok) {
          throw new Error(`PUT failed with status: ${res?.status}`)
        }

        const newResponse = await get(path)

        if (newResponse) {
          const newEndpointContent = await renderFile(path, newResponse)
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
    <div className="fc ac jc hf wf">
      <button style={{ marginBottom: '10px' }} onClick={handleComposerClick}>
        Write something
      </button>
      <button onClick={handleUploadClick}>Upload a file</button>
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={uploadFiles}
      />
    </div>
  )

  const segments = path.split('/')
  const { updateWindowPath } = useWindowStore()
  const [fileViewerContent, setFileViewerContent] =
    useState<React.ReactElement>(createFileMenu)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newSegment, setNewSegment] = useState('')

  // update content when path changes; route on res.status
  useEffect(() => {
    const fetchData = async () => {
      const res = await get(path)

      if (res && res.status >= 200 && res.status <= 300) {
        const content = await renderFile(path, res)
        setFileViewerContent(content)
      }

      if (res && res.status === 404) {
        setFileViewerContent(createFileMenu)
      }
    }
    fetchData()
  }, [path])

  function handlePathSegmentClick(index: number) {
    const segments = path.split('/')
    const newPath = segments.slice(0, index + 1).join('/')
    updateWindowPath(id, newPath)
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
