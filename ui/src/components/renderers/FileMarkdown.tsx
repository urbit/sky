import Editor from '@monaco-editor/react';

interface FileMarkdownProps {
  md: string
}

export default function FileMarkdown({ md }: FileMarkdownProps): JSX.Element {
  return (
    <div className='hf wf' style={{ overflow: 'scroll' }}>
      <Editor height="100%" defaultLanguage="markdown" defaultValue={md} />
    </div>
  )
}
