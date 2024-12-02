import React, { useState } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { get, findShipDomain } from '../../api/sky'
import FilePNG from './FilePNG'

interface FileSystemProps {
  id: number
  path: string
}

async function renderFile(res: Response): Promise<JSX.Element> {
  const contentType = res.headers.get('content-type')

  switch (contentType) {
    case 'text/plain':
      console.log('Rendering text/plain');
      return <></>
    case 'text/html':
      console.log('Rendering text/html');
      return <></>
    case 'text/markdown':
      console.log('Rendering text/markdown');
      return <></>
    case 'image/png':
      console.log('Rendering image/png');
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      return <FilePNG url={objectURL} />
    default:
      console.log('Rendering default')
      return <></>
  }
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
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

  const createFileMenu = (
    <div className="fc ac jc hf wf b2">
      <button onClick={handleUploadClick}>Upload a file</button>
      <input
        type="file"
        accept='image/png'
        style={{ display: 'none' }}
        onChange={uploadFiles}
      />
    </div>
  )

  const segments = path.split('/')
  const { updateWindowPath } = useWindowStore()
  const [fileViewerContent, setFileViewerContent] = useState(createFileMenu)

  function handlePathSegmentClick(index: number) {
    updateWindowPath(id, path.split('/').slice(index).join('/'))
  }

  return (
    <div className="fc hf wf p2">
      <div className="fr ac b1" style={{ padding: '10px' }}>
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
      </div>
      <div className="hf wf b1 br1" style={{ overflow: 'scroll' }}>
        {fileViewerContent}
      </div>
    </div>
  )
}
