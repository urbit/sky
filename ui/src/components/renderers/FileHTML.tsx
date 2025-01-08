import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { get, put } from '../../api/sky'
import { emmetHTML } from 'emmet-monaco-es'

interface FileHTMLProps {
  html: string
}

const htmlEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  wordWrap: 'off',
  wrappingIndent: 'same',
  scrollBeyondLastLine: false,
  renderWhitespace: 'none',
  renderLineHighlight: 'none',
  readOnly: false,
  links: true,
  folding: true,
  foldingStrategy: 'indentation',
  quickSuggestions: true,
  suggestOnTriggerCharacters: false,
  renderFinalNewline: 'on',
  selectionHighlight: true,
  smoothScrolling: true,
  mouseWheelZoom: true,
}

const defaultHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foobar</title>
  <link rel="stylesheet" href="/sys/css/hollow">
  <link rel="stylesheet" href="/sys/css/spine">
  <link rel="stylesheet" href="/sys/css/feather">
</head>
<body class='p2 b0'>
    <p>Hello world</p>
</body>
</html>
`

export default function FileHTML({ html }: FileHTMLProps): JSX.Element {
  const [theme, setTheme] = useState('vs-light')
  const [showPreview, setShowPreview] = useState(false)
  const [editorContent, setEditorContent] = useState(html || defaultHTML)
  const [isEdited, setIsEdited] = useState(false)
  const { activeWindowPath } = useWindowStore()

  const pathArray = activeWindowPath
    ? activeWindowPath.split('/')
    : `${window.ship || window.urbitID}/home`.split('/')
  const ship = pathArray[0]
  const endpoint = pathArray.slice(1)
  const tempPath = `${ship}/sys/tmp/${endpoint}`

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await get(tempPath)
        const content = typeof response === 'string' ? response : defaultHTML
        setEditorContent(content)
      } catch (error) {
        console.error('Failed to fetch content:', error)
        setEditorContent(defaultHTML)
      }
    }

    fetchContent()
  }, [])

  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value && activeWindowPath) {
        const content = value.trim() === '' ? defaultHTML : value
        setEditorContent(content)
        setIsEdited(true)
        const formData = new FormData()
        const file = new File([content], 'file.html', { type: 'text/html' })
        formData.append('file', file)

        try {
          await put(tempPath, formData)
          console.log('Upload successful')
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
    }, 500),
    [activeWindowPath]
  )

  const handlePublish = async () => {
    if (activeWindowPath) {
      const formData = new FormData()
      const file = new File([editorContent], 'file.html', { type: 'text/html' })
      formData.append('file', file)

      try {
        await put(activeWindowPath, formData)
        console.log('Publish successful')
        setIsEdited(false)
      } catch (error) {
        console.error('Publish failed:', error)
      }
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'vs-dark' : 'vs-light')
    }

    handleChange(mediaQuery as unknown as MediaQueryListEvent)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <div className="hf wf">
      <div className="fc as js hf wf">
        <div className="p2 fr ac jb">
          <button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={handlePublish} disabled={!isEdited} style={{ marginLeft: '10px' }}>
            Publish
          </button>
        </div>
        <div className="hf wf fr">
          <div
            className="hf p2"
            style={{ width: showPreview ? '50%' : '100%' }}
          >
            <Editor
              height="100%"
              defaultLanguage="html"
              value={editorContent}
              options={htmlEditorConfig}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={emmetHTML}
            />
          </div>
          {showPreview && (
            <div className="hf wf p2">
              <iframe
                className="hf wf"
                // TODO add src to tempPath
                srcDoc={editorContent}
                style={{ border: 'none', borderRadius: '2.5px' }}
                sandbox="allow-scripts"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
