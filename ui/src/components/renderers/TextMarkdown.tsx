import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TextMarkdownProps {
  md: string
}
export default function TextMarkdown({ md }: TextMarkdownProps) {
  return (
    <div className="hf wf fr as jc p2" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
      <div>
        <Markdown className='prose' remarkPlugins={[remarkGfm]}>{md}</Markdown>
      </div>
    </div>
  )
}
