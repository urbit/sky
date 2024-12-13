import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { put } from '../../api/sky'

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
  const { activeWindowPath } = useWindowStore()

  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value && activeWindowPath) {
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
    <div className="hf wf" style={{ overflow: 'scroll' }}>
      <Editor
        height="100%"
        defaultLanguage="html"
        defaultValue={html}
        options={htmlEditorConfig}
        theme={theme}
        onChange={handleEditorChange}
      />
    </div>
  )
}
