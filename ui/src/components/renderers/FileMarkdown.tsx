import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface FileMarkdownProps {
  md: string
}

const markdownEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    lineNumbers: 'off', // No need for line numbers in Markdown
    minimap: { enabled: false }, // Disable minimap for a cleaner look
    automaticLayout: true, // Adjust layout automatically
    wordWrap: 'on', // Enable word wrap
    wrappingIndent: 'same', // Indent wrapped lines with the same indentation
    scrollBeyondLastLine: false, // Do not scroll beyond the last line
    renderWhitespace: 'boundary', // Render whitespace characters at boundaries
    renderLineHighlight: 'none', // No line highlight
    readOnly: false, // Allow editing
    links: true, // Enable links
    folding: true, // Enable folding
    foldingStrategy: 'indentation', // Use indentation for folding
    quickSuggestions: false, // Disable quick suggestions
    suggestOnTriggerCharacters: false, // Disable suggestions on trigger characters
    cursorBlinking: 'solid', // Solid cursor blinking
    cursorStyle: 'line', // Line cursor style
    fontLigatures: true, // Enable font ligatures
    formatOnPaste: true, // Format on paste
    formatOnType: true, // Format on type
    renderFinalNewline: 'on', // Render final newline
    selectionHighlight: true, // Highlight selections
    overviewRulerBorder: false, // Disable overview ruler border
    overviewRulerLanes: 0, // No overview ruler lanes
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
    },
    smoothScrolling: true, // Enable smooth scrolling
    mouseWheelZoom: true, // Enable zooming with mouse wheel
  }

export default function FileMarkdown({ md }: FileMarkdownProps): JSX.Element {
  return (
    <div className="hf wf" style={{ overflow: 'scroll' }}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        defaultValue={md}
        options={markdownEditorConfig}
      />
    </div>
  )
}
