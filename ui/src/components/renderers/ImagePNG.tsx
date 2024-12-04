interface ImagePNGProps {
  url: string
}

export default function ImagePNG({ url }: ImagePNGProps): JSX.Element {
  return (
    <img
      src={url}
      alt="PNG image"
      className="hf wf"
      style={{ objectFit: 'cover' }}
    />
  )
}
