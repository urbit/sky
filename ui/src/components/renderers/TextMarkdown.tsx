import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TextMarkdownProps {
  md: string
}
export default function TextMarkdown({ md }: TextMarkdownProps) {
  return (
    <div className="p2 prose" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
      <Markdown remarkPlugins={[remarkGfm]}>{md}</Markdown>
    </div>
  )
}
