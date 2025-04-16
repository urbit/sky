import { Allotment } from 'allotment'
import { get } from '../api/sky'
import Image from './renderers/Image'
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
  path: string
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
    <FileSystem id={id} path={path || `${window.ship}/home`} />
  )

  const [windowContent, setWindowContent] = useState(defaultContent)
  const [windowBarOpen, setWindowBarOpen] = useState(false)
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false)
  const [openVisibilityMenu, setOpenVisibilityMenu] = useState(false)
  const [published, setPublished] = useState('Personal')
  const [visibilityOptions, setVisibilityOptions] = useState([
    'Private',
    'Urbit',
    'Public',
  ])

  const {
    workspaces,
    activeWorkspaceID,
    setMaxWindow,
    toggleFileView,
    setActiveWindowID,
    setActiveWindowPath,
    delWindow,
  } = useWindowStore()

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
    // TODO remove?
    //if (res.type === 'cors') {
    //  return corsErrorContent;
    //}

    if (res.status >= 200 && res.status <= 300) {
      const contentType = res.headers.get('Content-Type')

      if (!contentType) {
        return notRecognizedContent
      }

      switch (contentType.split(';')[0]) {
        case 'text/plain': {
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'text/html': {
          if (res.url) {
            return <TextHTML url={res.url} />
          }

          return <div>{`No URLs found for ${path}`}</div>
        }
        case 'text/markdown': {
          const text = await res.text()
          return <TextMarkdown md={text} />
        }
        case 'text/x-markdown': {
          const text = await res.text()
          return <TextMarkdown md={text} />
        }
        case 'text/css': {
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'text/javascript': {
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/json': {
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/xml': {
          const txt = await res.text()
          return <TextPlain text={txt} />
        }
        case 'application/pdf': {
          const blob = await res.blob()
          const pdfURL = URL.createObjectURL(blob)
          return <ApplicationPDF pdf={pdfURL} />
        }
        case 'image/jpeg': {
          const blob = await res.blob()
          const objectURL = URL.createObjectURL(blob)
          return <Image url={objectURL} />
        }
        case 'image/png': {
          const blob = await res.blob()
          const objectURL = URL.createObjectURL(blob)
          return <Image url={objectURL} />
        }
        case 'image/gif': {
          return (
            <>
              <p>GIF image content is not currently displayed.</p>
            </>
          )
        }
        case 'video/mp4': {
          return (
            <>
              <p>MP4 video content is not currently displayed.</p>
            </>
          )
        }
        case 'audio/mpeg': {
          return (
            <>
              <p>MP3 audio content is not currently displayed.</p>
            </>
          )
        }
        default: {
          return notRecognizedContent
        }
      }
    }

    if (res.status === 404) {
      if (path && path.split('/')[0].slice(1) === window.ship) {
        return <FileSystem id={id} path={path} />
      } else if (path && path.split('/')[0].slice(1) !== window.ship) {
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
    try {
      const res: Response | void = await get(path)

      if (res) {
        return await renderResponse(res)
      }

      return <p>{`No response from ${path}`}</p>
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
    const activeWorkspace = workspaces.get(activeWorkspaceID)

    if (activeWorkspace) {
      if (id === activeWorkspace.windowState.maxWindow) {
        setMaxWindow(0)
      } else {
        delWindow(id)
      }
    }
  }

  function handleFileView() {
    if (path && path.split('/')[0].slice(1) === window.ship) {
      toggleFileView(id)
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

  const fileView = workspaces.get(activeWorkspaceID)?.windowState.fileView
  const pathBarView = workspaces.get(activeWorkspaceID)?.windowState.pathBarView

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
          {pathBarView && pathBarView.includes(id) && (
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
                        disabled={path?.split('/')[0].slice(1) !== window.ship}
                      >
                        Visibility
                      </button>
                      <button
                        className="wf"
                        onClick={() => {
                          handleFileView()
                        }}
                      >
                        {fileView && fileView.includes(id) ? 'View' : 'Edit'}
                      </button>
                    </div>
                  )}
                  {!(
                    path === '' || path?.split('/')[0].slice(1) !== window.ship
                  ) && (
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
            {fileView && !fileView.includes(id)
              ? windowContent
              : fileSystemContent}
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
