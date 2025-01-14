import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { get, put } from '../../api/sky'
import { emmetHTML } from 'emmet-monaco-es'

interface FileComposerProps {
  initialContent?: string
}

const editorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
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

const mimeTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  xml: 'application/xml',
  md: 'text/markdown',
  txt: 'text/plain',
}

export default function FileComposer({ initialContent }: FileComposerProps): JSX.Element {
  const [theme, setTheme] = useState('vs-light')
  const [language, setLanguage] = useState('plaintext')
  const [isEdited, setIsEdited] = useState(false)
  const { activeWindowPath } = useWindowStore()

  const pathArray = activeWindowPath
    ? activeWindowPath.split('/')
    : `${window.ship || window.urbitID}/home`.split('/')
  const ship = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const tempPath = `${ship}/sys/tmp/${endpoint}`

  const [editorContent, setEditorContent] = useState(initialContent || '')

  // Detect language from content
  const detectLanguage = (content: string) => {
    // Check for HTML-like content
    if (content.trim().startsWith('<!DOCTYPE html>') || content.trim().startsWith('<html')) {
      return 'html'
    }
    // Check for CSS-like content
    if (content.includes('{') && /[.#][\w-]+\s*{/.test(content)) {
      return 'css'
    }
    // Check for JavaScript-like content
    if (content.includes('function') || content.includes('=>') || content.includes('const ')) {
      return 'javascript'
    }
    // Check for JSON-like content
    try {
      JSON.parse(content)
      return 'json'
    } catch {}
    // Check for XML-like content
    if (content.trim().startsWith('<?xml') || (content.includes('<') && content.includes('/>'))) {
      return 'xml'
    }
    // Check for Markdown-like content
    if (content.includes('#') && /^#+ /.test(content)) {
      return 'markdown'
    }
    return 'plaintext'
  }

  // Update language when content changes
  useEffect(() => {
    const detectedLanguage = detectLanguage(editorContent)
    setLanguage(detectedLanguage)
  }, [editorContent])

  // Set dark/light theme based on system preference
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

  // Autosave to /tmp
  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value && activeWindowPath) {
        setEditorContent(value)
        setIsEdited(true)
        const formData = new FormData()
        const detectedLanguage = detectLanguage(value)
        const extension = Object.keys(mimeTypes).find(key => 
          detectedLanguage.includes(key)
        ) || 'txt'
        const mimeType = mimeTypes[extension as keyof typeof mimeTypes]
        const file = new File([value], `${pathArray.slice(-1)}.${extension}`, {
          type: mimeType,
        })
        formData.append('file', file)

        try {
          await put(tempPath, formData)
          console.log('Upload successful')
        } catch (err) {
          console.error('Upload failed:', err)
        }
      }
    }, 500),
    [activeWindowPath]
  )

  const handlePublish = async () => {
    if (activeWindowPath && editorContent) {
      const formData = new FormData()
      const detectedLanguage = detectLanguage(editorContent)
      const extension = Object.keys(mimeTypes).find(key => 
        detectedLanguage.includes(key)
      ) || 'txt'
      const mimeType = mimeTypes[extension as keyof typeof mimeTypes]
      const file = new File([editorContent], `${pathArray.slice(-1)}.${extension}`, {
        type: mimeType,
      })
      formData.append('file', file)

      try {
        await put(activeWindowPath, formData)
        console.log('Publish successful')
        setIsEdited(false)
      } catch (err) {
        console.error('Publish failed:', err)
      }
    }
  }

  return (
    <div className="hf wf">
      <div className="fc as js hf wf">
        <div className="p2 fr ac jb">
          <button
            onClick={handlePublish}
            disabled={!isEdited}
          >
            Publish
          </button>
        </div>
        <div className="hf wf fr">
          <div className="hf p2 wf">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              language={language}
              value={editorContent}
              options={editorConfig}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={language === 'html' ? emmetHTML : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
