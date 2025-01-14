import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { get, put } from '../../api/sky'
import { emmetHTML } from 'emmet-monaco-es'

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

const languageToMimeType = {
  html: 'text/html',
  css: 'text/css',
  javascript: 'text/javascript',
  json: 'application/json',
  xml: 'application/xml',
  markdown: 'text/markdown',
  plaintext: 'text/plain',
}

export default function FileComposer(): JSX.Element {
  const [theme, setTheme] = useState('vs-light')
  const [language, setLanguage] = useState('plaintext')
  const [isEdited, setIsEdited] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { activeWindowPath } = useWindowStore()

  const pathArray = activeWindowPath
    ? activeWindowPath.split('/')
    : `${window.ship || window.urbitID}/home`.split('/')
  const ship = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const tempPath = `${ship}/sys/tmp/${endpoint}`

  const [editorContent, setEditorContent] = useState('')

  // On mount, fetch content from /tmp and check if it differs from published content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // First check temp path for any saved work
        const tempRes = await get(tempPath)

        if (tempRes) {
          if (tempRes.status !== 404) {
            const content = await tempRes.text()
            setEditorContent(content)
            
            // If we found content in /tmp, check if it differs from published version
            if (activeWindowPath) {
              const publishedRes = await get(activeWindowPath)

              if (publishedRes && publishedRes.status !== 404) {
                const publishedContent = await publishedRes.text()
                // If content in /tmp differs from published, mark as edited
                if (publishedContent !== content) {
                  setIsEdited(true)
                }
              } else {
                // If no published version exists but we have temp content, mark as edited
                setIsEdited(true)
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch content:', err)
      }
    }

    if (activeWindowPath) {
      fetchContent()
    }
  }, [activeWindowPath])

  // Enhanced pattern-based file type detection
  const detectLanguage = (content: string): string => {
    const trimmedContent = content.trim()

    // HTML detection - check for doctype or common HTML tags
    if (
      trimmedContent.startsWith('<!DOCTYPE html>') ||
      trimmedContent.startsWith('<html') ||
      /<(div|span|p|h[1-6]|body|head|link|meta|script|style)\b/.test(
        trimmedContent
      )
    ) {
      return 'html'
    }

    // CSS detection - look for typical CSS patterns
    if (
      (trimmedContent.includes('{') && /[.#][\w-]+\s*{/.test(trimmedContent)) ||
      /@(media|keyframes|import|charset|font-face)\b/.test(trimmedContent)
    ) {
      return 'css'
    }

    // JavaScript detection - check for typical JS patterns
    if (
      /(function|=>|const |let |var |import |export |class\s+\w+)/.test(
        trimmedContent
      ) ||
      /\b(if|for|while|return|async|await)\b/.test(trimmedContent)
    ) {
      return 'javascript'
    }

    // JSON detection
    try {
      JSON.parse(trimmedContent)
      // Additional check to avoid false positives with plain numbers or booleans
      return trimmedContent.startsWith('{') || trimmedContent.startsWith('[')
        ? 'json'
        : 'plaintext'
    } catch {
      // Not valid JSON, continue checking other formats
    }

    // XML detection - check for XML declaration or typical XML structure
    if (
      trimmedContent.startsWith('<?xml') ||
      /<\?xml|<[a-zA-Z0-9]+(\s+[^>]*)?>(.*?)<\/[a-zA-Z0-9]+>/s.test(trimmedContent)
    ) {
      return 'xml'
    }

    // Markdown detection - look for common Markdown syntax
    if (
      /^#+ /.test(trimmedContent) || // Headers
      /\[.+\]\(.+\)/.test(trimmedContent) || // Links
      /(\*\*|__)[\w\s]+(\*\*|__)/.test(trimmedContent) || // Bold text
      /^[-*+] /.test(trimmedContent) || // List items
      /^>\s/.test(trimmedContent)
    ) {
      // Blockquotes
      return 'markdown'
    }

    return 'plaintext'
  }

  // Update language when content changes
  useEffect(() => {
    const detectedLanguage = detectLanguage(editorContent)
    setLanguage(detectedLanguage)
    console.log('Detected language:', detectedLanguage)
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
        const mimeType = languageToMimeType[detectedLanguage as keyof typeof languageToMimeType] || 'text/plain'
        const extension = detectedLanguage === 'plaintext' ? 'txt' :
                         detectedLanguage === 'javascript' ? 'js' :
                         detectedLanguage === 'markdown' ? 'md' :
                         detectedLanguage
        const file = new File([value], `${pathArray.slice(-1)}.${extension}`, {
          type: mimeType,
        })
        formData.append('file', file)

        try {
          await put(tempPath, formData)
          console.log('Upload successful')
          if (showPreview && language === 'html') {
            // Force iframe reload by updating its key
            const iframe = document.querySelector('iframe')
            if (iframe) {
              iframe.src = iframe.src
            }
          }
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
      const mimeType = languageToMimeType[detectedLanguage as keyof typeof languageToMimeType] || 'text/plain'
      const extension = detectedLanguage === 'plaintext' ? 'txt' :
                       detectedLanguage === 'javascript' ? 'js' :
                       detectedLanguage === 'markdown' ? 'md' :
                       detectedLanguage
      const file = new File(
        [editorContent],
        `${pathArray.slice(-1)}.${extension}`,
        {
          type: mimeType,
        }
      )
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
          <div className="fr ac">
            <button onClick={handlePublish} disabled={!isEdited}>
              Publish
            </button>
            {language === 'html' && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                style={{ marginLeft: '10px' }}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
          </div>
        </div>
        <div className="hf wf fr">
          <div
            className="hf p2"
            style={{
              width: showPreview && language === 'html' ? '50%' : '100%',
            }}
          >
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
          {showPreview && language === 'html' && (
            <div className="hf wf p2">
              <iframe
                className="hf wf"
                src={`http://localhost:8000/sys/tmp/${endpoint}`}
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
