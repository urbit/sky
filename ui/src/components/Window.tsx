import { Allotment } from 'allotment'
import { WindowProps } from '../types/windows'
import { get, findShipUrls } from '../api/sky'
import ImagePNG from './renderers/ImagePNG'
import TextMarkdown from './renderers/TextMarkdown'
import PathBar from './PathBar'
import FileSystem from './renderers/FileSystem'
import { useEffect, useState } from 'react'
import useWindowStore from '../state/useWindowStore'
import TextHTML from './renderers/TextHTML'
import ApplicationPDF from './renderers/ApplicationPDF'
import ReactDOMServer from 'react-dom/server'

export default function Window({
  id,
  path,
  setMaxWindow,
  handleDrop,
  handleDragStart,
  dragWindow,
}: WindowProps) {
  const defaultContent = (
    <div className="hf wf p2 fc ac jc">
      <PathBar id={id} path={path} />
    </div>
  )

  const fileSystemContent = (
    // TODO not sure about this default behaviour
    <FileSystem id={id} path={path || `${window.urbitID}/home`} />
  )

  const [windowContent, setWindowContent] = useState(defaultContent)
  const [windowBarVisibility, setWindowBarVisibility] = useState(false)
  const [fileSystemView, setFileSystemView] = useState(false)
  const { setActiveWindowID, setActiveWindowPath, delWindow } = useWindowStore()

  function handleWindowMouseEnter() {
    setActiveWindowID(id)
    setActiveWindowPath(path)
  }

  const notRecognizedContent = (
    <div className="hf wf p2 fc ac jc">
      <p>Unrecognized MIME type</p>
    </div>
  )

  const unhandledStatusCodeContent = (
    <div className="fc ac jc hf wf p2">
      <p>Unhandled status code</p>
    </div>
  )

  //const corsErrorContent = (
  //  <div className="fc ac jc hf wf p2">
  //    <p>Blocked by CORS</p>
  //  </div>
  //);

  const noURLcontent = (path: string) => {
    console.log('nourl content for ', id, path)
    return (
      <div className="hf wf p2 fc ac jc">
        <p>No URL found for {path}</p>
      </div>
    )
  }

  const errorFetchingContent = (err: string) => {
    return (
      <div className="hf wf p2">
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
    console.log('Running renderResponse()')
    console.log(res)

    // TODO remove?
    //if (res.type === 'cors') {
    //  return corsErrorContent;
    //}

    if (res.status >= 200 && res.status <= 300) {
      const contentType = res.headers.get('Content-Type')
      console.log(`Content-Type: ${contentType}`)

      if (!contentType) {
        return notRecognizedContent
      }

      switch (contentType.split(';')[0]) {
        case 'text/plain': {
          console.log('Processing plain text file...')
          return (
            <>
              <p>Plain text content is not currently displayed.</p>
            </>
          )
        }
        case 'text/markdown': {
          console.log('Processing markdown file...')
          const text = await res.text()
          return <TextMarkdown md={text} />
        }
        case 'text/html': {
          console.log('Processing HTML document...')
          return (
            <TextHTML
              content={await res.text()}
              isLocal={path?.split('/')[0] === window.urbitID}
            />
          )
        }
        case 'application/json': {
          console.log('Processing JSON data...')
          return (
            <>
              <p>JSON content is not currently displayed.</p>
            </>
          )
        }
        case 'application/xml': {
          console.log('Processing XML file...')
          return (
            <>
              <p>XML content is not currently displayed.</p>
            </>
          )
        }
        case 'application/pdf': {
          console.log('Processing PDF document...')
          const blob = await res.blob()
          const pdfURL = URL.createObjectURL(blob)
          return <ApplicationPDF pdf={pdfURL} />
        }
        case 'image/jpeg': {
          console.log('Processing JPEG image...')
          return (
            <>
              <p>JPEG image content is not currently displayed.</p>
            </>
          )
        }
        case 'image/png': {
          console.log('Processing PNG image...')
          const blob = await res.blob()
          const objectURL = URL.createObjectURL(blob)
          return <ImagePNG url={objectURL} />
        }
        case 'image/gif': {
          console.log('Processing GIF image...')
          return (
            <>
              <p>GIF image content is not currently displayed.</p>
            </>
          )
        }
        case 'video/mp4': {
          console.log('Processing MP4 video file...')
          return (
            <>
              <p>MP4 video content is not currently displayed.</p>
            </>
          )
        }
        case 'audio/mpeg': {
          console.log('Processing MP3 audio file...')
          return (
            <>
              <p>MP3 audio content is not currently displayed.</p>
            </>
          )
        }
        default: {
          console.log(`Resource isn't recognized`)
          return notRecognizedContent
        }
      }
    }

    if (res.status === 404) {
      if (path && path.split('/')[0] === window.urbitID) {
        console.log('Rendering filesystem')
        return <FileSystem id={id} path={path} />
      } else if (path && path.split('/')[0] !== window.urbitID) {
        // Last-ditch attempt to load something
        console.log(
          `Attempting to load a page from ${res.headers.get('X-Response-URL')}`
        )
        return (
          <iframe
            className="hf wf"
            style={{ border: 'none' }}
            src={`${res.headers.get('X-Response-URL')}`}
          />
        )
      }
    }

    return unhandledStatusCodeContent
  }

  async function renderContent(path: string) {
    console.log('render', path)
    try {
      const res = await get(path)
      console.log('Data in renderContent is', res)

      if (res) {
        return await renderResponse(res)
      }

      // TODO nothing below this todo should be necessary;
      // get() should account for all of this

      const urls = await findShipUrls(path)
      if (!urls) {
        console.error(`No URLs found for ${path.split('/').slice(0)}`)
        return noURLcontent(path)
      }

      const url = urls.athens || urls.ship

      if (url) {
        return <iframe src={url} className="hf wf" style={{ border: 'none' }} />
      } else {
        console.log(`No URLs detected for ${path.split('/').slice(0)}`)
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

  function handleDragEnd() {
    const container = document.getElementById(id.toString())
    //  removing styling
    if (container) {
      container.classList.remove('o5', 'bd1', 'grabber')
    }
  }

  function handleXButtonClick(id: number) {
    if (setMaxWindow) {
      setMaxWindow(0)
    } else {
      delWindow(id)
    }
  }

  function handleOptsButtonClick() {
    if (path && path.split('/')[0] === window.urbitID) {
      setFileSystemView(!fileSystemView)
    }
  }

  useEffect(() => {
    const idString = id.toString()
    const fetchContent = async () => {
      if (setMaxWindow !== null) {
        const content = sessionStorage.getItem(idString)
        if (content) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(content, 'text/html')
          const iframe = doc.querySelector('iframe')
          if (path === '') {
            setWindowContent(defaultContent)
          } else if (iframe) {
            if (iframe.src) {
              setWindowContent(
                <iframe
                  src={iframe.src}
                  className="hf wf"
                  style={{ border: 'none' }}
                />
              )
            } else if (iframe.srcdoc) {
              setWindowContent(
                <TextHTML
                  content={iframe.srcdoc}
                  isLocal={
                    path?.split('/')[0] === window.urbitID || path === ''
                  }
                />
              )
            }
          } else {
            if (path) {
              const newContent = await renderContent(path)
              if (newContent) {
                setWindowContent(newContent)
              }
            }
          }
        }
      } else {
        if (path === '') {
          sessionStorage.setItem(
            idString,
            ReactDOMServer.renderToString(defaultContent)
          )
          setWindowContent(defaultContent)
        }
        if (path) {
          const content = await renderContent(path)
          if (content) {
            // TODO: Error message if content is null/undefined
            sessionStorage.setItem(
              idString,
              ReactDOMServer.renderToString(content)
            )
            setWindowContent(content)
          }
        }
      }
    }
    fetchContent()
  }, [path])

  return (
    <Allotment>
      <Allotment.Pane visible key={id} className="wf hf fr">
        <div
          className="hf wf fc ac jc"
          style={{ padding: '5px', position: 'relative' }}
          onMouseEnter={handleWindowMouseEnter}
        >
          <div
            id={id.toString()}
            draggable={dragWindow === id ? true : false}
            className="hf wf container fc as js b1 br1 bd1"
            onDragStart={e => handleDragStart(e, id)}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, id)}
            onDragEnd={handleDragEnd}
            onDragOver={e => {
              e.dataTransfer.dropEffect = 'move'
              e.preventDefault()
            }}
            style={{
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '55px',
                width: '100px',
                zIndex: '1',
                position: 'absolute',
                top: 0,
                right: 0,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setWindowBarVisibility(true)}
              onMouseLeave={() => setWindowBarVisibility(false)}
            >
              {windowBarVisibility && (
                <div className="fr ac ja hf wf">
                  <button
                    className="fr ac jc"
                    style={{ pointerEvents: 'visible' }}
                    onClick={() => handleOptsButtonClick()}
                  >
                    ...
                  </button>
                  <button
                    className="fr ac jc"
                    style={{ pointerEvents: 'visible' }}
                    onClick={() => handleXButtonClick(id)}
                  >
                    x
                  </button>
                </div>
              )}
            </div>
            {!fileSystemView ? windowContent : fileSystemContent}
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
