import { Allotment } from 'allotment'
//import useWindowStore from '../state/useWindowStore'
import { WindowProps } from '../types/windows'
import NavBar from './NavBar'
import { get } from '../api/sky'
import WebPage from './renderers/WebPage'
import { uesEffect, useEffect, useState } from 'react'

const defaultContent = <div>
  <p>Default content</p>
</div>

function renderResponse(res: Response): JSX.Element {
  console.log('Received response')
  console.log(res)
  switch (res.headers.get('Content-Type')) {
    case 'text/plain':
      console.log("Processing plain text file...")
      return <><p>Plain text content is not currently displayed.</p></>
    case 'text/html':
      console.log("Processing HTML document...")
      //return <><p>I'm an HTML page!</p></>
      return <WebPage page={res} />
    case 'application/json':
      console.log("Processing JSON data...")
      return <><p>JSON content is not currently displayed.</p></>
    case 'application/xml':
      console.log("Processing XML file...")
      return <><p>XML content is not currently displayed.</p></>
    case 'application/pdf':
      console.log("Processing PDF document...")
      return <><p>PDF content is not currently displayed.</p></>
    case 'image/jpeg':
      console.log("Processing JPEG image...")
      return <><p>JPEG image content is not currently displayed.</p></>
    case 'image/png':
      console.log("Processing PNG image...")
      return <><p>PNG image content is not currently displayed.</p></>
    case 'image/gif':
      console.log("Processing GIF image...")
      return <><p>GIF image content is not currently displayed.</p></>
    case 'video/mp4':
      console.log("Processing MP4 video file...")
      return <><p>MP4 video content is not currently displayed.</p></>
    case 'audio/mpeg':
      console.log("Processing MP3 audio file...")
      return <><p>MP3 audio content is not currently displayed.</p></>
    default:
      console.log("Content type is either unrecognized can't be accessed.")
      //return <><p>Unknown content type.</p></>
      return <iframe
        src={`https://tiller-tolbus.redhorizon.com/blog/aegean`}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
  }
}

export default function Window({ id, path }: WindowProps) {
  const [windowContent, setWindowContent] = useState(defaultContent)

  function renderContent(path: string) {
    const url = `https://urbit.org`
    //const url = 'https://bitdeg.arvo.network/apps/ship-url-getter/~simsur-ronbet'
    fetch(url)
      //get(path)
      .then(res => res)
      .then(data => {
        if (data) {
          setWindowContent(renderResponse(data))
        }
      })
  }

  useEffect(() => {
    console.log(`useEffect in window ${id} for new path ${path}`)
    // TODO testing; remove this if check
    if (path !== '~sampel/home') {
      renderContent(path || '~sampel/path')
    }
  }, [path])

  return (
    <Allotment>
      <Allotment.Pane visible key={id}>
        <div
          className='fc ac jc'
          style={{ width: '100%', height: '100%', padding: '5px' }}
        >
          <div
            className='fc as js b1 br1'
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <NavBar id={id} path={path || `~sampel/path`} />
            {windowContent}
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
