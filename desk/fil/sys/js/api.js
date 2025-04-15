// TODO handle relative get('foo')
// TODO handle relative get('/foo')
// TODO handle relative get('~/foo')
// TODO remove hard-coded URLs
async function get(path) {
  const pathArray = path.split('/')
  const pathShip = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')

  try {
    const res = await fetch(`${window.location.origin}/seer?path=${path}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`Response not ok from %seer`)
    }

    return res
  } catch (err) {
    console.error(`GET request to ${pathShip} failed at /seer`, err)
  }
}

// TODO handle relative put('foo', file)
// TODO handle relative put('/foo', file)
// TODO handle relative put('~/foo', file)
// TODO remove hard-coded URLs
async function put(path, file) {
  const url = `${window.location.origin}/seer?path=${path}&mime=${file.type}&name=${file.name}`

  try {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: file,
    })

    if (!res.ok) {
      throw new Error(`Response not ok from our %seer`)
    }

    return res
  } catch (err) {
    console.error(`PUT request failed at ${url}`, err)
  }
}

// TODO post()

//async function del(path: string): Promise<Response | void> {
//  const pathArray = path.split('/')
//  const endpoint = pathArray.slice(1).join('/')
//  const url = await findPathUrl(`${pathArray[0]}/api/${endpoint}`)
//
//  if (!url) {
//    console.error(`No URL found for ${path}`)
//    return new Response(`No URL found for ${path}`, {
//      status: 404,
//      headers: { 'Content-Type': 'text/plain' },
//    })
//  }
//
//  try {
//    const res = await fetch(url, {
//      method: 'DELETE',
//      credentials: 'include',
//    })
//
//    if (!res.ok) {
//      throw new Error(`Response not ok for ${url}`)
//    }
//
//    return res
//  } catch (err) {
//    console.error(`DELETE request failed at ${url}`, err)
//  }
//}

export { get, put }
