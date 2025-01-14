import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { get, put } from '../../api/sky'

interface FileCSSProps {
  css: string
}

const cssEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
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

export default function FileCSS({ css }: FileCSSProps): JSX.Element {
  const [theme, setTheme] = useState('vs-light')
  const [isEdited, setIsEdited] = useState(false)
  const { activeWindowPath } = useWindowStore()

  // TODO path should never be null
  const pathArray = activeWindowPath
    ? activeWindowPath.split('/')
    : `${window.ship || window.urbitID}/home`.split('/')
  const ship = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const tempPath = `${ship}/sys/tmp/${endpoint}`

  const defaultCSS = `/* ${ship}/${endpoint} */\n\n`
  const [editorContent, setEditorContent] = useState(css || defaultCSS)

  // on mount, fetch CSS for editor and check if
  // editor content differs from published content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const tempRes = await get(tempPath)

        if (tempRes) {
          if (tempRes.status !== 404) {
            const content = await tempRes.text()
            setEditorContent(content)

            // check if editor content differs from published content
            // TODO path should never be null
            const publishedRes = await get(activeWindowPath || '~sampel/home')

            if (publishedRes) {
              if (publishedRes.status !== 404) {
                const publishedContent = await publishedRes.text()

                if (publishedContent !== content) {
                  setIsEdited(true)
                } else {
                  setIsEdited(false)
                }
              }
            }
          } else {
            setEditorContent(css || defaultCSS)
            setIsEdited(true)
          }
        }
      } catch (err) {
        console.error('Failed to fetch CSS:', err)
        setEditorContent(defaultCSS)
      }
    }

    fetchContent()
  }, [])

  // on mount, set dark / light mode in editor
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

  // autosave editor content to /tmp
  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value && activeWindowPath) {
        const content = value.trim() === '' ? defaultCSS : value
        setEditorContent(content)
        setIsEdited(true)
        const formData = new FormData()
        const file = new File([content], `${pathArray.slice(-1)}.css`, {
          type: 'text/css',
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
    [activeWindowPath, defaultCSS, pathArray, tempPath]
  )

  const handlePublish = async () => {
    if (activeWindowPath) {
      const formData = new FormData()
      const file = new File([editorContent], `${pathArray.slice(-1)}.css`, {
        type: 'text/css',
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
        <div className="p2 fr ac je">
          <button onClick={handlePublish} disabled={!isEdited}>
            Publish
          </button>
        </div>
        <div className="hf wf fr">
          <div className="hf wf p2">
            <Editor
              height="100%"
              defaultLanguage="css"
              value={editorContent}
              options={cssEditorConfig}
              theme={theme}
              onChange={handleEditorChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
