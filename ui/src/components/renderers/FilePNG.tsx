interface FilePNGProps {
  url: string
}

export default function FilePNG({ url }: FilePNGProps): JSX.Element {
  return (
    <div className="hf wf fc ac jc p2">
      <img src={url} alt="PNG image" style={{ objectFit: 'contain' }} />
    </div>
  )
}
