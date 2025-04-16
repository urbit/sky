interface FileAudioProps {
  url: string
}

export default function FileAudio({ url }: FileAudioProps): JSX.Element {
  return (
    <div className="hf wf fc ac jc p2">
      <audio src={url} controls className="wf" />
    </div>
  )
}
