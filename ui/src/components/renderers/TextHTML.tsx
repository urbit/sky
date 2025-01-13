interface TextHTMLProps {
  url: string
}
import { useEffect, useRef } from 'react'

export default function TextHTML({ url }: TextHTMLProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const iframe = iframeRef?.current as HTMLIFrameElement
  
    // Setting blur on the iframe every 30 seconds for demonstration purposes only
    const setBlur = () => {
      iframe.blur();
      console.log('set blur on ', iframe)
    };

    const interval = setInterval(setBlur, 30000);

    if (iframe) {
      iframe.onload = () => {
        console.log('iframe loaded')
      }

    }

    return () => {
      clearInterval(interval);
    }
  }, [])

  if (url) {
    return (
      <div className="hf wf fr as jc">
        <iframe
          ref={iframeRef}
          className="hf wf"
          src={url}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts"
          title="iframe"
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
