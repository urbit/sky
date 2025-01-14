import React, { useState, useEffect } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { get, findShipDomain } from '../../api/sky'
import FilePNG from './FilePNG'
import FileMarkdown from './FileMarkdown'
import FileHTML from './FileHTML'
import FilePDF from './FilePDF'
import FilePlain from './FilePlain'
import FileCSS from './FileCSS'

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
      return <FilePlain text={await res.text()} />
    }
    case 'text/html': {
      console.log('Rendering text/html')
      const html = await res.text()
      return <FileHTML html={html} />
    }
    case 'text/css': {
      console.log('Rendering text/css')
      const content = await res.text()
      return <FileCSS css={content} />
    }
    case 'text/javascript': {
      console.log('Rendering text/plain')
      return <FilePlain text={await res.text()} />
    }
    case 'application/json': {
      console.log('Rendering application/json')
      return <FilePlain text={await res.text()} />
    }
    case 'application/xml': {
      console.log('Rendering application/xml')
      return <FilePlain text={await res.text()} />
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
    case 'application/pdf': {
      console.log('Rendering application/pdf')
      const arrayBuffer = await res.arrayBuffer()
      const pdfData = new Uint8Array(arrayBuffer)
      return <FilePDF pdfData={pdfData} />
    }
    default: {
      console.log(
        `Rendering ${contentType.split(';')[0]} not supported by filesystem`
      )
      return <p>{`${contentType.split(';')[0]} not supported by filesystem`}</p>
    }
  }
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
  const handleUploadClick = () => {
    const input = document.querySelector('input[type="file"]')
    if (input) (input as HTMLInputElement).click()
  }

  function handleHTMLClick() {
    setFileViewerContent(<FileHTML html="" />)
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
        console.log(`Attempting to PUT to ${shipDomain}/${endpoint}`)
        const res = await fetch(`${shipDomain}/${endpoint}`, {
          method: 'PUT',
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
    <div className="fc ac jc hf wf">
      <button onClick={handleHTMLClick}>Write HTML</button>
      <button onClick={handleUploadClick}>Upload file</button>
      <input
        type="file"
        accept=".css, .html, .js, .json, .md, .pdf, .png, .txt, .xml"
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
        const content = await renderFile(res)
        setFileViewerContent(content)
      }

      if (res && res.status === 404) {
        setFileViewerContent(createFileMenu)
      }
    }
    fetchData()
  }, [path])

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
