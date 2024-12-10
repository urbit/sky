export default function WebPage({ data }: { data: string }): JSX.Element {
  if (data) {
    console.log(data)

    return (
      <iframe
        srcDoc={data}
        className='hf wf'
        style={{ border: 'none' }}
      />
    )
  }

  return <div>Loading...</div>
}
