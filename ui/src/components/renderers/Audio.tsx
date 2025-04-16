interface AudioProps {
  url: string
}

export default function Audio({ url }: AudioProps): JSX.Element {
  return (
    <div className="hf wf fc ac jc">
      <audio src={url} controls className="wf" />
    </div>
  )
}
