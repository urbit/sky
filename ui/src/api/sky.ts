const shipDomain = () => {
  if (import.meta.env.NODE_ENV === 'development') {
    return import.meta.env.VITE_SHIP_URL || 'http://localhost:8080'
  }
  return window.location.origin
}

// TODO handle relative get('foo')
// TODO handle relative get('/foo')
// TODO handle relative get('~/foo')
async function get(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  const pathShip = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const url = `${shipDomain}/${endpoint}`

  if (pathShip === `~${window.ship}`) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok from ${url}`)
      }

      const redirectedToGrid =
        endpoint !== '/apps/landscape' &&
        res.url === `${shipDomain}/apps/landscape/`

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

  try {
    const res = await fetch(`${shipDomain}/seer?path=${path}`, {
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
async function put(path: string, file: File): Promise<Response | void> {
  const url = `${shipDomain}/seer?path=${path}&mime=${file.type}&name=${file.name}`

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

export { get }
