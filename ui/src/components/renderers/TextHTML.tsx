interface TextHTMLProps {
  content: string
  isLocal: boolean
}
import { useEffect, useRef } from 'react'

export default function TextHTML({ content, isLocal }: TextHTMLProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  //  tracking keyboard events inside iframe and sending them up to App.tsx

  useEffect(() => {
    const iframe = iframeRef?.current as HTMLIFrameElement

    const addIframeListener = () => {
      const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document

      if (iframeDocument) {
        iframeDocument.addEventListener('keydown', e => {
          // sending keydown event up to parent element and setting iframe focus to blur
          if (e.key === 'Meta' || e.key === 'Control') {
            iframe?.blur()
            window.parent.postMessage(
              {
                eventType: 'keydown',
                key: e.key,
                code: e.code,
                metaKey: e.metaKey,
                ctrlKey: e.ctrlKey,
              },
              '*'
            )
          }
        })
      } else {
        // Retry after a small delay if iframe is not found yet
        setTimeout(addIframeListener, 100)
      }
    }

    if (iframe) {
      iframe.onload = () => {
        addIframeListener()
      }
    }

    return () => {
      iframe?.removeEventListener('keydown', () => {
        console.log('key up')
      })
    }
  }, [])

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
          ref={iframeRef}
          className="hf wf"
          srcDoc={new XMLSerializer().serializeToString(doc)}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
  }

  return null
}
