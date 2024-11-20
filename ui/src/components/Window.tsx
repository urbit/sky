import { Allotment } from 'allotment'
import { WindowProps } from '../types/windows'
import NavBar from './NavBar'
import { get, findUrls } from '../api/sky'
import WebPage from './renderers/WebPage'
import { useEffect, useState } from 'react'
import useWindowStore from '../state/useWindowStore'

export default function Window({ id, path }: WindowProps) {
  const defaultContent = (
    <div
      className="p2 fc ac jc"
      style={{ width: '100%', height: '100%' }}
      onClick={handleClick}
    >
      <p>Default content. Remove this from production!</p>
    </div>
  )

  const [windowContent, setWindowContent] = useState(defaultContent)
  const { addWindow } = useWindowStore()

  function handleClick() {
    // TODO get real @p
    addWindow(id, '~sampel/path')
  }

  const notRecognizedContent = (
    <div className="p2 fc ac jc" style={{ width: '100%', height: '100%' }}>
      <p>Resource is unrecognized or blocked</p>
    </div>
  )

  const noURLcontent = (path: string) => {
    return (
      <div
        className="p2 fc ac jc"
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
      >
        <p>No URL found for {path}</p>
      </div>
    )
  }

  const errorFetchingContent = (err: string) => {
    return (
      <div className="p2" style={{ width: '100%', height: '100%' }}>
        <div>
          <p>Error fetching content:</p>
          <br />
          <pre>
            <code>{err}</code>
          </pre>
        </div>
      </div>
    )
  }

  async function renderResponse(res: Response): Promise<JSX.Element> {
    console.log('Received response')
    console.log(res)
    switch (res.headers.get('Content-Type')) {
      case 'text/plain':
        console.log('Processing plain text file...')
        return (
          <>
            <p>Plain text content is not currently displayed.</p>
          </>
        )
      case 'text/html':
        console.log('Processing HTML document...')

        return <WebPage data={await res.text()} />

      case 'application/json':
        console.log('Processing JSON data...')
        return (
          <>
            <p>JSON content is not currently displayed.</p>
          </>
        )
      case 'application/xml':
        console.log('Processing XML file...')
        return (
          <>
            <p>XML content is not currently displayed.</p>
          </>
        )
      case 'application/pdf':
        console.log('Processing PDF document...')
        return (
          <>
            <p>PDF content is not currently displayed.</p>
          </>
        )
      case 'image/jpeg':
        console.log('Processing JPEG image...')
        return (
          <>
            <p>JPEG image content is not currently displayed.</p>
          </>
        )
      case 'image/png':
        console.log('Processing PNG image...')
        return (
          <>
            <p>PNG image content is not currently displayed.</p>
          </>
        )
      case 'image/gif':
        console.log('Processing GIF image...')
        return (
          <>
            <p>GIF image content is not currently displayed.</p>
          </>
        )
      case 'video/mp4':
        console.log('Processing MP4 video file...')
        return (
          <>
            <p>MP4 video content is not currently displayed.</p>
          </>
        )
      case 'audio/mpeg':
        console.log('Processing MP3 audio file...')
        return (
          <>
            <p>MP3 audio content is not currently displayed.</p>
          </>
        )
      default:
        console.log(`Resource isn't recognized or is blocked by CORS`)
        return notRecognizedContent
    }
  }

  async function renderContent(path: string) {
    try {
      const res = await get(path)
      const data = res

      console.log('Data in renderContent is', data)

      if (data) {
        return renderResponse(data)
      } else {
        const urls = await findUrls(path)

        if (!urls) {
          console.error(`No URLs found for ${path.split('/').slice(0)}`)
          return noURLcontent(path)
        }

        console.log(urls)
        console.log(urls.athens)
        console.log(urls.ship)
        if (urls.athens && !urls.ship) {
          return (
            <iframe
              src={`${urls.athens}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )
        } else if (urls.ship && !urls.athens) {
          return (
            <iframe
              src={`${urls.ship}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )
        } else if (!urls.ship && !urls.athens) {
          console.log(`No URLs detected for ${path.split('/').slice(0)}`)
        } else {
          // TODO ping athens URL and ship URL and render whichever one
          //      of them has a resource; if there's a resource at both of
          //      these URLs, mistakes have been made
          // NOTE can't do this properly because there's no Athens to GET
          //      need to ping sampel-palnet.urbit.org and recieve a response
          //      that's not just a CORS error, which breaks renderResponse()
          //      in practice if we reach this code, we should probably just
          //      try to render urls.ship because we already know there's no Athens
          return (
            <iframe
              src={`${urls.ship}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching content:', error)
        return errorFetchingContent(error.toString())
      } else {
        console.error('Unknown error fetching content:', error)
        return errorFetchingContent('Unknown')
      }
    }
  }

  useEffect(() => {
    const fetchContent = async () => {
      if (path !== '~sampel/home') {
        const content = await renderContent(path || '~sampel/path')
        // TODO error msg if content is null/undefined
        if (content) {
          setWindowContent(content)
        }
      }
    }

    fetchContent()
  }, [path])


  return (
    <Allotment>
      <Allotment.Pane visible key={id} className="wf hf fr">
        <div
          className="fc ac jc"
          style={{ width: '100%', height: '100%', padding: '5px' }}
        >
          <div
            className="fc as js b1 br1"
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
