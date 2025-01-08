import { useEffect } from 'react'
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

  useEffect (()=>{
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;

    iframe?.addEventListener('blur', () => {
      console.log('Iframe is blurred');
    }, true);
    iframe?.blur()

    console.log(iframe)

    const addIframeListener = () => {
      console.log('adding listener')
      const iframeDocument = iframe?.contentDocument || iframe?.contentWindow?.document;

      if(iframeDocument){
        console.log('iframe exist listening for click')
        iframeDocument.addEventListener('click', (e)=> {
          console.log('click', e)
        })
        iframeDocument.addEventListener('keydown', (e)=> {
          console.log('keydown', e)
          if (e.key === "Meta" || e.key === "Control") {
            iframe?.blur()
            // console.log(window.parent)
            // window.parent.postMessage({ eventType: 'keydown', key: e.key, code: e.code },
            //   '*'
            // );
          }
        })
      } else {
        console.log('retry')
        // Retry after a small delay if iframe is not found yet
        setTimeout(addIframeListener, 100);
      }
    }

    if(iframe){
      iframe.onload = () => {
        addIframeListener();
      }
    }

    return () => {
      iframe.removeEventListener('keydown', ()=>{
        console.log('key up')
      })
    }
  },[])



    return (
      <div className="hf wf fr as jc">
        <iframe
          id="myIframe"
          className="hf wf"
          srcDoc={new XMLSerializer().serializeToString(doc)}
          style={{ border: 'none', borderRadius: '2.5px'}}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
  }

  return null
}
