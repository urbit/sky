interface VideoProps {
  url: string
}

export default function Video({ url }: VideoProps): JSX.Element {
  return (
    <video
      src={url}
      controls
      className="hf wf"
    />
  )
}
