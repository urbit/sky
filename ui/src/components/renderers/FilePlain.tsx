import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { put } from '../../api/sky'
import useWindowStore from '../../state/useWindowStore'

interface TextPlainProps {
    text: string
}

const plaintextEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions =
{
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

// TODO handle tabs beter by converting them into spaces

export default function FilePlain({ text }: TextPlainProps): JSX.Element {
    const [theme, setTheme] = useState('vs-light')
    const [editorContent, setEditorContent] = useState(text)
    const { activeWindowPath } = useWindowStore()

    const handleEditorChange = useCallback(
        debounce(async (value: string | undefined) => {
            if (value && activeWindowPath) {
                setEditorContent(value)
                const formData = new FormData()
                const file = new File([value], 'file.txt', { type: 'text/plain' })
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

    // TODO better integrate light/dark mode and color scheme
    // into the Spine/Feather settings
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
                defaultLanguage="plaintext"
                defaultValue={editorContent}
                options={plaintextEditorConfig}
                onChange={handleEditorChange}
                theme={theme}
            />
        </div>
    )
}
