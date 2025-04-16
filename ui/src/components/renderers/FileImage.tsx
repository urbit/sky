interface FileImageProps {
  url: string
}

export default function FileImage({ url }: FileImageProps): JSX.Element {
  return (
    <div className="hf wf fc ac jc p2">
      <img src={url} alt="PNG image" style={{ objectFit: 'contain' }} />
    </div>
  )
}
