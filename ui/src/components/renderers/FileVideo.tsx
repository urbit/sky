interface FileVideoProps {
  url: string
}

export default function FileVideo({ url }: FileVideoProps): JSX.Element {
  return (
    <div className="hf wf fc ac jc p2">
      <video
        src={url}
        controls
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  )
}
