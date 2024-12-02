import { Allotment } from 'allotment';
import { WindowProps } from '../types/windows';
import { get, findShipUrls } from '../api/sky';
import WebPage from './renderers/WebPage';
import ImagePNG from './renderers/ImagePNG'
import TextMarkdown from './renderers/TextMarkdown'
import PathBar from './PathBar';
import FileSystem from './renderers/FileSystem';
import { useEffect, useState } from 'react';
import useWindowStore from '../state/useWindowStore';

export default function Window({ id, path }: WindowProps) {
  const defaultContent = (
    <div className="p2 fc ac jc" style={{ width: '100%', height: '100%' }}>
      <PathBar id={id} path={path} />
    </div>
  );

  const [windowContent, setWindowContent] = useState(defaultContent);
  const { isActive } = useWindowStore();

  function handleMouseEnter() {
    isActive(id);
  }

  const notRecognizedContent = (
    <div className="p2 fc ac jc" style={{ width: '100%', height: '100%' }}>
      <p>Unrecognized MIME type</p>
    </div>
  );

  const unhandledStatusCodeContent = (
    <div className="fc ac jc hf wf p2">
      <p>Unhandled status code</p>
    </div>
  );

  //const corsErrorContent = (
  //  <div className="fc ac jc hf wf p2">
  //    <p>Blocked by CORS</p>
  //  </div>
  //);

  const noURLcontent = (path: string) => {
    console.log('nourl content for ', id, path);
    return (
      <div className="p2 fc ac jc" style={{ width: '100%', height: '100%' }}>
        <p>No URL found for {path}</p>
      </div>
    );
  };

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
    );
  };

  async function renderResponse(res: Response): Promise<JSX.Element> {
    console.log('Running renderResponse()');
    console.log(res);

    // TODO remove?
    //if (res.type === 'cors') {
    //  return corsErrorContent;
    //}

    if (res.status >= 200 && res.status <= 300) {
      const contentType = res.headers.get('Content-Type');
      console.log(`Content-Type: ${contentType}`);

      switch (contentType) {
        case 'text/plain':
          console.log('Processing plain text file...');
          return (
            <>
              <p>Plain text content is not currently displayed.</p>
            </>
          );
        case 'text/markdown':
          console.log('Processing markdown file...')
          const text = await res.text()
          return <TextMarkdown md={text} />
        case 'text/html':
          console.log('Processing HTML document...');
          return <WebPage data={await res.text()} />;
        case 'application/json':
          console.log('Processing JSON data...');
          return (
            <>
              <p>JSON content is not currently displayed.</p>
            </>
          );
        case 'application/xml':
          console.log('Processing XML file...');
          return (
            <>
              <p>XML content is not currently displayed.</p>
            </>
          );
        case 'application/pdf':
          console.log('Processing PDF document...');
          return (
            <>
              <p>PDF content is not currently displayed.</p>
            </>
          );
        case 'image/jpeg':
          console.log('Processing JPEG image...');
          return (
            <>
              <p>JPEG image content is not currently displayed.</p>
            </>
          );
        case 'image/png':
          console.log('Processing PNG image...');
          // Process the PNG image and display it
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          return <ImagePNG url={objectURL} />
        case 'image/gif':
          console.log('Processing GIF image...');
          return (
            <>
              <p>GIF image content is not currently displayed.</p>
            </>
          );
        case 'video/mp4':
          console.log('Processing MP4 video file...');
          return (
            <>
              <p>MP4 video content is not currently displayed.</p>
            </>
          );
        case 'audio/mpeg':
          console.log('Processing MP3 audio file...');
          return (
            <>
              <p>MP3 audio content is not currently displayed.</p>
            </>
          );
        default:
          // This will fire if the MIME type doesn't match any case
          console.log(`Resource isn't recognized`);
          return notRecognizedContent;
      }
    }

    if (res.status === 404) {
      if (path && path.split('/')[0] === window.urbitID) {
        return <FileSystem id={id} path={path} />;
      } else if (path && path.split('/')[0] !== window.urbitID) {
        // Last-ditch attempt to load something
        console.log(
          `Attempting to load a page from ${res.headers.get('X-Response-URL')}`
        );
        return (
          <iframe
            className="hf wf"
            style={{ border: 'none' }}
            src={`${res.headers.get('X-Response-URL')}`}
          />
        );
      }
    }

    return unhandledStatusCodeContent;
  }

  async function renderContent(path: string) {
    console.log('render', path);
    try {
      const res = await get(path);
      console.log('Data in renderContent is', res);

      if (res) {
        return await renderResponse(res);
      }

      // TODO nothing below this todo should be necessary;
      // get() should account for all of this

      const urls = await findShipUrls(path);
      if (!urls) {
        console.error(`No URLs found for ${path.split('/').slice(0)}`);
        return noURLcontent(path);
      }

      const url = urls.athens || urls.ship;

      if (url) {
        return (
          <iframe
            src={url}
            className='hf wf'
            style={{ border: 'none' }}
          />
        );
      } else {
        console.log(`No URLs detected for ${path.split('/').slice(0)}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching content:', error);
        return errorFetchingContent(error.toString());
      } else {
        console.error('Unknown error fetching content:', error);
        return errorFetchingContent('Unknown');
      }
    }
  }

  useEffect(() => {
    const fetchContent = async () => {
      if (path) {
        const content = await renderContent(path);
        // TODO: Error message if content is null/undefined
        if (content) {
          setWindowContent(content);
        }
      }
    };
    fetchContent();
    // Add 'path' as a dependency to re-fetch when the path changes
  }, [path]);

  return (
    <Allotment>
      <Allotment.Pane visible key={id} className="wf hf fr">
        <div
          className="fc ac jc"
          style={{ width: '100%', height: '100%', padding: '5px' }}
          onMouseEnter={handleMouseEnter}
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
            {windowContent}
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  );
}
