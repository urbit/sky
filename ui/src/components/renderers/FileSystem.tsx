import React, { useState } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { findShipDomain } from '../../api/sky'

interface FileSystemProps {
  id: number
  path: string
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
  const { updateWindowPath } = useWindowStore()
  const segments = path.split('/')
  const [uploading, setUploading] = useState(false)

  const handleUploadClick = () => {
    const input = document.querySelector('input[type="file"]')
    if (input) (input as HTMLInputElement).click()
  }

  const handleClick = (index: number) => {
    const newPath = segments.slice(0, index + 1).join('/')
    updateWindowPath(id, newPath)
  }

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList) return

    setUploading(true)

    const shipDomain = await findShipDomain(path)
    const endpoint = path.split('/').slice(1).join('/')

    for (const file of Array.from(fileList)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        console.log(`Attempting to POST to ${shipDomain}/${endpoint}`)
        const response = await fetch(`${shipDomain}/${endpoint}`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('Upload successful:', response)
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    setUploading(false)
    event.target.value = ''
  }

  return (
    <div className="fc hf wf">
      <div className="fr ac b1" style={{ padding: '10px' }}>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <span
              className="f0"
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick(index)}
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

      <div className="fc ac jc b1">
        <div className="fc" style={{ gap: '10px' }}>
          <div className="fr ac" style={{ gap: '10px' }}>
            <button onClick={handleUploadClick}>Upload a file</button>
            <input
              type="file"
              style={{ display: 'none' }}
              multiple
              onChange={uploadFiles}
              disabled={uploading}
            />
            {uploading && <span>Uploading...</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
