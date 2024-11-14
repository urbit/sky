export default function WebPage({ data }: { data: string }): JSX.Element {
  console.log(data)
  if (data) {
    console.log(data)

    return (
      <iframe
        srcDoc={data}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    );
  }

  return <div>Loading...</div>;
}
