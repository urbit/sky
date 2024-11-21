interface FileSystemProps {
  path: string
}

export default function FileSystem({ path }: FileSystemProps): JSX.Element {
  return <div>File System Path: {path}</div>;
}

