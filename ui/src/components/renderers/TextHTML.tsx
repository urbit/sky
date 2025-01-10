interface TextHTMLProps {
  url: string
}
import { useEffect, useRef } from 'react'


export default function TextHTML({ url }: TextHTMLProps) {
  if (url) {

  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // on mount, track keyboard events inside iframe and send them to App.tsx

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




    return (
      <div className="hf wf fr as jc">
        <iframe
          ref={iframeRef}
          className="hf wf"
          src={url}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts allow-same-origin"
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
