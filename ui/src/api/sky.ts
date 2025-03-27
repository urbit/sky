async function get(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  const pathShip = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  let url = `${window.location.origin}/${endpoint}`

  // TODO handle relative get('foo')
  // TODO handle relative get('/foo')
  // TODO handle relative get('~/foo')
  //console.log(url)
  if (pathShip === `~${window.ship}`) {
    if (process.env.NODE_ENV === 'development') {
      // TODO fix; should get url from .env.local
      //url = `${process.env.VITE_SHIP_URL}/${endpoint}`
      url = `http://localhost:8080/${endpoint}`
    }

    //console.log(url)
    //console.log(`GET request at ${url}`)
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok from ${url}`)
      }

      // TODO remove hard-coded URL in prod.
      const redirectedToGrid =
        endpoint !== '/apps/landscape' &&
        res.url === `http://localhost:8080/apps/landscape/`

      // NOTE handle Landscape redirect
      // TODO change this behaviour in Landscape?
      if (redirectedToGrid) {
        return new Response(`File not found for ${path}`, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'X-Response-URL': url,
          },
        })
      }

      return res
    } catch (err) {
      console.error(`GET request to ${pathShip} failed at ${url}`, err)
    }
  }

  // TODO remove hard-coded domain
  try {
    const res = await fetch(`http://localhost:8080/seer?path=${path}`, {
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

//async function put(path: string, file: File): Promise<Response | void> {
//  const pathArray = path.split('/')
//  const endpoint = pathArray.slice(1).join('/')
//  let url = await findPathUrl(`${pathArray[0]}/api/${endpoint}`)
//
//  if (!url) {
//    console.error(`No URL found for ${path}`)
//
//    return new Response(`No URL found for ${path}`, {
//      status: 404,
//      headers: { 'Content-Type': 'text/plain' },
//    })
//  }
//
//  url = `${url}?mime=${file.type}&name=${file.name}`
//
//  try {
//    const res = await fetch(url, {
//      method: 'PUT',
//      credentials: 'include',
//      body: file,
//    })
//
//    if (!res.ok) {
//      throw new Error(`Response not ok for ${url}`)
//    }
//
//    return res
//  } catch (err) {
//    console.error(`PUT request failed at ${url}`, err)
//  }
//}

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

export { get }
