interface LocalWebPageProps {
  data: string;
}

export default function LocalWebPage({ data }: LocalWebPageProps) {
  if (data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    const spineLink = doc.createElement('link');
    spineLink.rel = 'stylesheet';
    spineLink.href = '../../style/spine.css';

    const featherLink = doc.createElement('link');
    featherLink.rel = 'stylesheet';
    featherLink.href = '../../style/feather.css';

    doc.head.appendChild(spineLink);
    doc.head.appendChild(featherLink);

    const updatedData = new XMLSerializer().serializeToString(doc);

    return (
      <iframe
        srcDoc={updatedData}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    );
  }

  return null;
}
