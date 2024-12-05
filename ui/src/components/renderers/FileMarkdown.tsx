import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState } from 'react'

interface FileMarkdownProps {
  md: string
}

const markdownEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: 'off',
  minimap: { enabled: false },
  automaticLayout: true,
  wordWrap: 'on',
  wrappingIndent: 'same',
  scrollBeyondLastLine: false,
  renderWhitespace: 'boundary',
  renderLineHighlight: 'none',
  readOnly: false,
  links: true,
  folding: true,
  foldingStrategy: 'indentation',
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  cursorBlinking: 'solid',
  cursorStyle: 'line',
  fontLigatures: true,
  formatOnPaste: true,
  formatOnType: true,
  renderFinalNewline: 'on',
  selectionHighlight: true,
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
  },
  smoothScrolling: true,
  mouseWheelZoom: true,
}

export default function FileMarkdown({ md }: FileMarkdownProps): JSX.Element {
  const [theme, setTheme] = useState('vs-light')

  // TODO better integrate light/dark mode and color scheme
  // into the Spine/Feather settings
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'vs-dark' : 'vs-light')
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <div className="hf wf" style={{ overflow: 'scroll' }}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        defaultValue={md}
        options={markdownEditorConfig}
        theme={theme}
      />
    </div>
  )
}
