interface TextHTMLProps {
  content: string
  isLocal: boolean
}

export default function TextHTML({ content, isLocal }: TextHTMLProps) {
  if (content) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')

    if (isLocal) {
      // TODO link to ../stlye/... files rather than public
      // vite won't follow links to style dir in dev mode
      const hollowLink = doc.createElement('link')
      hollowLink.rel = 'stylesheet'
      hollowLink.href = 'hollow.css'

      const spineLink = doc.createElement('link')
      spineLink.rel = 'stylesheet'
      spineLink.href = 'spine.css'

      const featherLink = doc.createElement('link')
      featherLink.rel = 'stylesheet'
      featherLink.href = 'feather.css'

      doc.head.appendChild(spineLink)
      doc.head.appendChild(featherLink)
    }

    return (
      <div className="hf wf fr as jc">
        <iframe
          className="hf wf"
          srcDoc={new XMLSerializer().serializeToString(doc)}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts"
        />
      </div>
    )
  }

  return null
}
