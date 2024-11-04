export default function WebPage({ page }: { page: Response }): JSX.Element {
  console.log('page: ', page)

  return (
    <iframe
      //srcDoc={htmlContent || ''}
      src='https://urbit.org'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
