import React, { useState, useEffect } from 'react';
import useWindowStore from '../../state/useWindowStore';
import { findShipUrls } from '../../api/sky'

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

  const handleClick = (index: number) => {
    const newPath = segments.slice(0, index + 1).join('/');
    updateWindowPath(id, newPath);
  };

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    setUploading(true);
    const shipUrls = await findShipUrls(path)
    const endpoint = path.split('/').slice(1).join('/')

    for (let file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path)

      try {
        // TODO account for athens url
        const response = await fetch(`${shipUrls?.ship}/${endpoint}`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (result.status === 'success') {
          setFiles(prev => [...prev, {
            filename: result.filename,
            url: `/uploads/${result.filename}`
          }]);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
    event.target.value = ''; // Reset file input
  };

  const loadFiles = async () => {
    const shipUrls = await findShipUrls(path)
    const endpoint = path.split('/').slice(1).join('/')

    try {
      // TODO handle athens url
      const response = await fetch(`${shipUrls?.ship}/${endpoint}`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = doc.getElementsByTagName('a');

      const newFiles: FileInfo[] = [];
      for (let link of Array.from(links)) {
        newFiles.push({
          filename: decodeURIComponent(link.textContent || ''),
          url: link.href
        });
      }
      setFiles(newFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

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
          <h2>File Upload</h2>
          <div className="fr ac" style={{ gap: '10px' }}>
            <label className="fr ac" style={{ cursor: 'pointer', gap: '5px' }}>
              <span>Choose Files</span>
              <input
                type="file"
                style={{ display: 'none' }}
                multiple
                onChange={uploadFiles}
                disabled={uploading}
              />
            </label>
            {uploading && <span>Uploading...</span>}
          </div>
        </div>

        <div className="fc" style={{ gap: '10px' }}>
          <h3>Uploaded Files</h3>
          <ul className="fc" style={{ gap: '5px', listStyle: 'none', padding: 0 }}>
            {files.map((file, index) => (
              <li key={index}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
