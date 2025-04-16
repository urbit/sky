interface ImageProps {
  url: string
}

export default function Image({ url }: ImageProps): JSX.Element {
  return (
    <img
      src={url}
      alt="image"
      className="hf wf"
      style={{ objectFit: 'cover' }}
    />
  )
}
