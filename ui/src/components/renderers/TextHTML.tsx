interface TextHTMLProps {
  url: string
}

export default function TextHTML({ url }: TextHTMLProps) {
  if (url) {
    //const parser = new DOMParser()
    //const doc = parser.parseFromString(content, 'text/html')

    //if (isLocal) {
    //  // TODO link to ../stlye/... files rather than public
    //  // vite won't follow links to style dir in dev mode
    //  const hollowLink = doc.createElement('link')
    //  hollowLink.rel = 'stylesheet'
    //  hollowLink.href = 'hollow.css'
    //
    //  const spineLink = doc.createElement('link')
    //  spineLink.rel = 'stylesheet'
    //  spineLink.href = 'spine.css'
    //
    //  const featherLink = doc.createElement('link')
    //  featherLink.rel = 'stylesheet'
    //  featherLink.href = 'feather.css'
    //
    //  doc.head.appendChild(spineLink)
    //  doc.head.appendChild(featherLink)
    //}

    return (
      <div className="hf wf fr as jc">
        <iframe
          className="hf wf"
          src={url}
          //srcDoc={new XMLSerializer().serializeToString(doc)}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts"
        />
      </div>
    )
  }

  return (
    <div>
      <p>No URL to render</p>
    </div>
  )
}
