import React from 'react'

interface TextHTMLProps {
  content: string
  isLocal: boolean
}

export default function TextHTML({ content, isLocal }: TextHTMLProps) {
  React.useEffect(() => {
    if (isLocal) {
      const doc = document

      const hollowLink = doc.createElement('link')
      hollowLink.rel = 'stylesheet'
      hollowLink.href = 'hollow.css'

      const spineLink = doc.createElement('link')
      spineLink.rel = 'stylesheet'
      spineLink.href = 'spine.css'

      const featherLink = doc.createElement('link')
      featherLink.rel = 'stylesheet'
      featherLink.href = 'feather.css'

      doc.head.appendChild(hollowLink)
      doc.head.appendChild(spineLink)
      doc.head.appendChild(featherLink)
    }
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}
