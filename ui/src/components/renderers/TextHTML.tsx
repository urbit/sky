interface TextHTMLProps {
  url: string
}

export default function TextHTML({ url }: TextHTMLProps) {
  if (url) {
    return (
      <div className="hf wf fr as jc">
        <iframe
          className="hf wf"
          src={url}
          style={{ border: 'none', borderRadius: '2.5px' }}
          sandbox="allow-scripts"
        />
      </div>
    )
  }

  return (
    <div>
      <p>No URL to render</p>
    </div>
  )
}
