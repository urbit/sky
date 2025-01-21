import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { get, put } from '../../api/sky'
import { emmetHTML, registerCustomSnippets } from 'emmet-monaco-es'
import { detectLanguage } from '../../utils/languageDetection'

const editorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: 'off',
  minimap: { enabled: false },
  automaticLayout: true,
  wordWrap: 'off',
  wrappingIndent: 'same',
  scrollBeyondLastLine: false,
  renderWhitespace: 'none',
  renderLineHighlight: 'none',
  readOnly: false,
  links: true,
  folding: false,
  quickSuggestions: true,
  suggestOnTriggerCharacters: false,
  cursorBlinking: 'blink',
  cursorStyle: 'line',
  fontLigatures: true,
  formatOnPaste: true,
  formatOnType: true,
  renderFinalNewline: 'off',
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

  // Save content to temp path
  const saveToTemp = async (content: string) => {
    if (content && activeWindowPath) {
      setEditorContent(content)
      setIsEdited(true)
      const formData = new FormData()
      const detectedLanguage = detectLanguage(content)
      const mimeType =
        languageToMimeType[
          detectedLanguage as keyof typeof languageToMimeType
        ] || 'text/plain'
      const extension =
        detectedLanguage === 'plaintext'
          ? 'txt'
          : detectedLanguage === 'javascript'
            ? 'js'
            : detectedLanguage === 'markdown'
              ? 'md'
              : detectedLanguage
      const file = new File([content], `${pathArray.slice(-1)}.${extension}`, {
        type: mimeType,
      })
      formData.append('file', file)

      try {
        await put(tempPath, formData)
        console.log('Upload successful')
        if (showPreview && language === 'html') {
          // Force iframe reload
          const iframe = document.querySelector('iframe')
          if (iframe && iframe instanceof HTMLIFrameElement) {
            const currentSrc = iframe.src
            iframe.src = 'about:blank'
            iframe.src = currentSrc
          }
        }
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }
  }

  // Debounced save for regular typing
  const handleEditorChange = useCallback(
    debounce((value: string | undefined) => {
      if (value) saveToTemp(value)
    }, 500),
    [activeWindowPath]
  )

  const handlePublish = async () => {
    if (activeWindowPath && editorContent) {
      const formData = new FormData()
      const detectedLanguage = detectLanguage(editorContent)
      const mimeType =
        languageToMimeType[
          detectedLanguage as keyof typeof languageToMimeType
        ] || 'text/plain'
      const extension =
        detectedLanguage === 'plaintext'
          ? 'txt'
          : detectedLanguage === 'javascript'
            ? 'js'
            : detectedLanguage === 'markdown'
              ? 'md'
              : detectedLanguage
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
              defaultLanguage="html"
              language={language}
              value={editorContent}
              options={editorConfig}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={monaco => {
                emmetHTML(monaco, ['html'])
                registerCustomSnippets('html', {
                  'html:sky': `!!!+html[lang="en"]>(head>(meta[charset="UTF-8"])+(meta[name="viewport" content="width=device-width, initial-scale=1.0"])+(title{${ship}/${endpoint}})+(link[rel="stylesheet" href="/sys/css/hollow"])+(link[rel="stylesheet" href="/sys/css/spine"])+(link[rel="stylesheet" href="/sys/css/feather"]))+(body.p2.b0>p{Hello world, this is ${ship}/${endpoint}})`,
                })
              }}
              onMount={editor => {
                // Add content change listener directly to the editor's model
                editor.getModel()?.onDidChangeContent(() => {
                  // Get current content and save immediately for completions/snippets
                  const content = editor.getModel()?.getValue()
                  if (content !== undefined) {
                    saveToTemp(content)
                  }
                })
              }}
            />
          </div>
          {showPreview && language === 'html' && (
            <div className="hf wf p2">
              <iframe
                className="hf wf"
                // TODO remove hard-coded domain
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
