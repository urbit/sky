interface ApplicationPDFProps {
  pdf: string
}

export default function ApplicationPDF({
  pdf,
}: ApplicationPDFProps): JSX.Element {
  return (
    <div className="hf wf fr as jc">
      <iframe className="hf wf" src={pdf} />
    </div>
  )
}
