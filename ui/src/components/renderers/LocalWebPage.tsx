interface LocalWebPageProps {
  data: string;
}

export default function LocalWebPage({ data }: LocalWebPageProps) {
  if (data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    // TODO link to ../stlye/... files rather than public
    // vite won't follow links to style dir in dev mode
    const hollowLink = doc.createElement('link');
    hollowLink.rel = 'stylesheet';
    hollowLink.href = 'hollow.css';

    const spineLink = doc.createElement('link');
    spineLink.rel = 'stylesheet';
    spineLink.href = 'spine.css';

    const featherLink = doc.createElement('link');
    featherLink.rel = 'stylesheet';
    featherLink.href = 'feather.css';

    doc.head.appendChild(spineLink);
    doc.head.appendChild(featherLink);

    const updatedData = new XMLSerializer().serializeToString(doc);

    return (
      <div className='hf wf fr as jc p2'>
        <iframe
          className='hf wf'
          srcDoc={updatedData}
          style={{ border: 'none' }}
        />
      </div>
    );
  }

  return null;
}
