import { Allotment } from 'allotment'
import { get, findShipUrls } from '../api/sky'
import ImagePNG from './renderers/ImagePNG'
import TextMarkdown from './renderers/TextMarkdown'
import PathBar from './PathBar'
import FileSystem from './renderers/FileSystem'
import { useEffect, useState } from 'react'
import useWindowStore from '../state/useWindowStore'
import TextHTML from './renderers/TextHTML'
import ApplicationPDF from './renderers/ApplicationPDF'
import TextPlain from './renderers/TextPlain'

export interface WindowProps {
  id: number
  path: string | null
  handleDrop: (event: React.DragEvent<HTMLDivElement>, id: number) => void
  handleDragStart: (event: React.DragEvent, id: number) => void
  dragWindow: number
}

export default function Window({
  id,
  path,
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
  const [windowBarOpen, setWindowBarOpen] = useState(false)
  const [fileSystemView, setFileSystemView] = useState(false)
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false)
  const [openVisibilityMenu, setOpenVisibilityMenu] = useState(false)
  const [published, setPublished] = useState('Personal')
  const [visibilityOptions, setVisibilityOptions] = useState([
    'Private',
    'Urbit',
    'Public',
  ])
  const {
    maxWindow,
    pathBarView,
    setMaxWindow,
    setActiveWindowID,
    setActiveWindowPath,
    delWindow,
  } = useWindowStore()

  function handleWindowMouseEnter() {
    setActiveWindowID(id)
    setActiveWindowPath(path ?? `${window.ship || window.urbitID}/home`)
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
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'text/html': {
          console.log('Processing HTML document...')
          const urls = await findShipUrls(path || '~sampel/home')
          if (urls) {
            return <TextHTML url={urls.ship} />
          }

          return <div>{`No URLs found for ${path}`}</div>
        }
        case 'text/markdown': {
          console.log('Processing markdown file...')
          const text = await res.text()
          return <TextMarkdown md={text} />
        }
        case 'text/css': {
          console.log('Processing CSS document...')
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/javascript': {
          console.log('Processing JavaScript data...')
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/json': {
          console.log('Processing JSON data...')
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/xml': {
          console.log('Processing XML file...')
          const txt = await res.text()
          return <TextPlain text={txt} />
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
    if (id === maxWindow) {
      setMaxWindow(0)
    } else {
      delWindow(id)
    }
  }

  function handleFileView() {
    if (path && path.split('/')[0] === window.urbitID) {
      setFileSystemView(!fileSystemView)
    }
  }

  // when this window's path changes, fetch from path
  useEffect(() => {
    const fetchContent = async () => {
      if (path === '') {
        setWindowContent(defaultContent)
      }
      if (path) {
        const content = await renderContent(path)
        // TODO: Error message if content is null/undefined
        if (content) {
          setWindowContent(content)
        }
      }
    }

    fetchContent()
  }, [path])

  // update visibility options based on published state
  useEffect(() => {
    const options = ['Personal', 'Private', 'Urbit', 'Public']
    const filteredOptions = options.filter(item => item !== published)
    setVisibilityOptions(filteredOptions)
  }, [published])

  return (
    <Allotment>
      <Allotment.Pane visible key={id} className="wf hf fr">
        <div
          className="wf hf fc ac jc relative"
          style={{
            padding: '5px',
            boxSizing: 'border-box',
          }}
          onMouseEnter={handleWindowMouseEnter}
        >
          {pathBarView.includes(id) && (
            <div
              className="absolute b1 br1 bd1"
              style={{
                zIndex: 90,
                opacity: '90%',
                width: 'calc(100% - 10px)',
                height: 'calc(100% - 10px)',
              }}
            >
              <div className="hf wf p2 fc ac jc">
                <PathBar id={id} path={path} />
              </div>
            </div>
          )}
          <div
            id={id.toString()}
            draggable={dragWindow === id ? true : false}
            className="wf hf container fc as js b1 br1 bd1"
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
              className="absolute fc ac"
              style={{
                height: '55px',
                maxWidth: 'calc(100% - 20px)',
                width: '200px',
                zIndex: '1',
                top: 0,
                right: 0,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setWindowBarOpen(true)}
              onMouseLeave={() => {
                setWindowBarOpen(false)
                setOpenOptionsMenu(false)
                setOpenVisibilityMenu(false)
              }}
            >
              {windowBarOpen && (
                <div className="fr hf wf as je p2 g2">
                  {openVisibilityMenu && (
                    <div
                      className="fc ac wf ja p1 b2 br2"
                      onMouseLeave={() => {
                        setOpenVisibilityMenu(false)
                      }}
                    >
                      <p className="wf m0 tc" style={{ padding: '4px 10px' }}>
                        {published}
                      </p>
                      {visibilityOptions.map((option, index) => (
                        <button
                          id={index.toString()}
                          className="wf"
                          onClick={() => setPublished(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {openOptionsMenu && (
                    <div className="fc ac ja p1 b2 br2">
                      <button
                        className="wf"
                        onMouseEnter={() => setOpenVisibilityMenu(true)}
                        disabled={path?.split('/')[0] !== window.urbitID}
                      >
                        Visibility
                      </button>
                      <button
                        className="wf"
                        onClick={() => {
                          handleFileView()
                        }}
                      >
                        {fileSystemView ? 'View' : 'Edit'}
                      </button>
                    </div>
                  )}
                  {!(path === '' || path?.split('/')[0] !== window.urbitID) && (
                    <button
                      className="fr ac jc"
                      style={{ pointerEvents: 'visible' }}
                      onMouseEnter={() => {
                        setOpenOptionsMenu(true)
                        setOpenVisibilityMenu(false)
                      }}
                    >
                      ...
                    </button>
                  )}
                  <button
                    className="fr ac jc"
                    style={{ pointerEvents: 'visible' }}
                    onClick={() => handleXButtonClick(id)}
                    onMouseEnter={() => {
                      setOpenOptionsMenu(false)
                      setOpenVisibilityMenu(false)
                    }}
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
