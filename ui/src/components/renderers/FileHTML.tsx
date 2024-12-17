import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { put } from '../../api/sky'
import TextHTML from '../renderers/TextHTML'
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

export default function FileHTML({ html }: FileHTMLProps): JSX.Element {
  const [theme, setTheme] = useState('vs-light')
  const [showPreview, setShowPreview] = useState(false)
  const [editorContent, setEditorContent] = useState(html)
  const { activeWindowPath } = useWindowStore()

  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value && activeWindowPath) {
        setEditorContent(value)
        const formData = new FormData()
        const file = new File([value], 'file.html', { type: 'text/html' })
        formData.append('file', file)

        try {
          await put(activeWindowPath, formData)
          console.log('Upload successful')
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
    }, 500),
    [activeWindowPath]
  )

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
      <div className='fc as js hf wf'>
        <div className="wf p2">
          <button
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        <div className="hf wf fr">
          <div className='hf p2' style={{ width: showPreview ? '50%' : '100%' }}>
            <Editor
              height="100%"
              defaultLanguage="html"
              defaultValue={editorContent}
              options={htmlEditorConfig}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={emmetHTML}
            />
          </div>
          {showPreview &&
            <div className='hf wf p2'>
              <TextHTML content={editorContent} isLocal={true} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
