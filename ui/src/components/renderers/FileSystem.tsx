import React, { useState, useEffect } from 'react';
import useWindowStore from '../../state/useWindowStore';
import { get, findShipDomain, findShipUrls } from '../../api/sky'

interface FileSystemProps {
  id: number;
  path: string;
}

interface FileInfo {
  filename: string;
  url: string;
}

export default function FileSystem({ id, path }: FileSystemProps): JSX.Element {
  const { updateWindowPath } = useWindowStore();
  const segments = path.split('/');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    const input = document.querySelector('input')
    { input && input.click() }
  }

  const handleClick = (index: number) => {
    const newPath = segments.slice(0, index + 1).join('/');
    updateWindowPath(id, newPath);
  };

const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  if (!fileList) return;

  setUploading(true);
  const shipDomain = await findShipDomain(path);
  const endpoint = path.split('/').slice(1).join('/')

  for (let file of Array.from(fileList)) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('endpoint', endpoint);

    try {
      console.log(`Attempting to POST to ${path}`);
      const response = await fetch(`${shipDomain}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  setUploading(false);
  event.target.value = ''; // Reset file input
};

  const loadFiles = async () => {
    const shipUrls = await findShipUrls(path)

    try {
      // TODO handle athens url
      console.log(`Attempting to GET from ${path}`)
      //const response = await fetch(`${shipUrls?.ship}`);
      const response = await get(path)
      console.log(response)

    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [setUploading]);

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
              <span className="f4" style={{ margin: '0 5px' }}>/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="fc ac jc b1" style={{ flex: 1, padding: '20px', gap: '20px' }}>
        <div className="fc" style={{ gap: '10px' }}>
          <div className="fr ac" style={{ gap: '10px' }}>
            <button onClick={handleUploadClick}>Upload a file or folder</button>
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
  );
}
