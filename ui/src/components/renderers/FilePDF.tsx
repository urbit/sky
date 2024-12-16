interface FilePDFProps {
    pdfData: Uint8Array
  }

  interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    creationDate?: string;
  }
  
  export default function FilePDF({ pdfData }: FilePDFProps): JSX.Element {

    let metadata: PDFMetadata = {};

    // Convert the binary data to text
    const pdfText = new TextDecoder().decode(pdfData);
    console.log('pdf text', pdfData)

    // Regular expressions to capture metadata fields in the PDF
    const titleMatch = /\/Title\s*\(([^)]+)\)/.exec(pdfText);
    const authorMatch = /\/Author\s*\(([^)]+)\)/.exec(pdfText);
    const subjectMatch = /\/Subject\s*\(([^)]+)\)/.exec(pdfText);
    const creatorMatch = /\/Creator\s*\(([^)]+)\)/.exec(pdfText);
    const creationDateMatch = /\/CreationDate\s*\(([^)]+)\)/.exec(pdfText)

    if (titleMatch) metadata.title = titleMatch[1];
    if (authorMatch) metadata.author = authorMatch[1];
    if (subjectMatch) metadata.subject = subjectMatch[1];
    if (creatorMatch) metadata.creator = creatorMatch[1];
    if (creationDateMatch) metadata.creationDate = creationDateMatch[1];

    const formatCreationDate = (dateStr: string | undefined) => {
      if (!dateStr) return '';
    
      const regex = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
      const match = dateStr.match(regex);
      if (!match) return dateStr;
  
      const [year, month, day, hour, minute, second] = match;
      const formattedDate = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
      );
      return formattedDate.toLocaleString();
  };

    return(
    <div className="hf wf p2">
      <h2>PDF Metadata</h2>
      {metadata ? (
        <div>
          {metadata.title && <p>Title: {metadata.title}</p>}
          {metadata.author && <p>Author: {metadata.author}</p>}
          {metadata.subject && <p>Subject: {metadata.subject}</p>}
          {metadata.creator && <p>Creator: {metadata.creator}</p>}
          {metadata.creationDate && <p>Creation Date: {formatCreationDate(metadata.creationDate)}</p>}
        </div>
      ) : (
        <p>Loading metadata...</p>
      )}
    </div>
    )
  }