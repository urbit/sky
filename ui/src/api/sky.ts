async function findShipDomain(path: string) {
  const ship = path.split('/')[0]
  // TODO replace with real server
  const res = await fetch(`http://localhost:3000/domains`)
  const data = await res.json()

  // TODO don't return all domains for all ships
  if (data[ship]) {
    return data[ship]
  } else {
    console.error(`No domain found for ${ship}`)
  }
}

async function findPathUrl(path: string): Promise<string | void> {
  let shipLocation

  if (path.startsWith('/')) {
    shipLocation = window.location.origin
  }

  // TODO support e.g. get('foo/bar') as well as get(/foo/bar)

  if (path.startsWith('~')) {
    shipLocation = await findShipDomain(path)
  }

  if (!shipLocation) {
    console.error(`No URL found for ${path}`)
  } else {
    const endpoint = path.split('/').slice(1).join('/')
    const url = `${shipLocation}/${endpoint}`
    return url
  }
}

// TODO rename to get() once finsihed
async function newGet(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  const pathShip = pathArray[0].slice(1)
  const endpoint = pathArray.slice(1).join('/')
  const url = await findPathUrl(`${pathArray[0]}/${endpoint}`)

  if (!url) {
    console.error(`No URL found for ${path}`)
    return
  }

  // TODO handle relative get('/foo')
  // TODO handle relative get('foo') and get('~/foo')
  if (pathShip === `~${window.ship}`) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok for ${url}`)
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
      console.error(`GET request failed at ${url}`, err)
    }
  }

  // TODO remove hard-coded domain
  try {
    const res = await fetch(`http://localhost:8080/seer?path=${path}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`Response not ok for /seer`)
    }

    return res
  } catch (err) {
    console.error(`GET request failed at /seer`, err)
  }
}

// NOTE provisional; will change with remote scry support
async function get(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  const pathShip = pathArray[0].slice(1)
  const endpoint = pathArray.slice(1).join('/')
  const url = await findPathUrl(`${pathArray[0]}/${endpoint}`)

  if (!url) {
    console.error(`No URL found for ${path}`)

    return new Response(`No URL found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${url}`)
    }

    // TODO remove hard-coded URL
    const redirectedToGrid =
      endpoint !== '/apps/landscape' &&
      res.url === `http://localhost:8080/apps/landscape/`

    // NOTE handle Landscape redirect
    // TODO change this behaviour in Landscape
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
    console.error(`GET request failed at ${url}`, err)

    if (pathShip === window.ship) {
      const apiUrl = await findPathUrl(`${pathArray[0]}/api/${endpoint}`)

      if (!apiUrl) {
        console.error(`No URL found for ${path}`)

        return new Response(`No URL found for ${path}`, {
          status: 404,
          headers: { 'Content-Type': 'text/plain' },
        })
      }

      try {
        const res = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include',
        })

        if (!res.ok) {
          throw new Error(`Response not ok for ${apiUrl}`)
        }

        return res
      } catch (err) {
        console.error(`GET request failed at ${apiUrl}`, err)

        return new Response(`File not found for ${path}`, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'X-Response-URL': apiUrl,
          },
        })
      }
    }

    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'X-Response-URL': url,
      },
    })
  }
}

async function put(path: string, file: File): Promise<Response | void> {
  const pathArray = path.split('/')
  const endpoint = pathArray.slice(1).join('/')
  let url = await findPathUrl(`${pathArray[0]}/api/${endpoint}`)

  if (!url) {
    console.error(`No URL found for ${path}`)

    return new Response(`No URL found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  url = `${url}?mime=${file.type}&name=${file.name}`

  try {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: file,
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${url}`)
    }

    return res
  } catch (err) {
    console.error(`PUT request failed at ${url}`, err)
  }
}

// TODO post()

async function del(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  const endpoint = pathArray.slice(1).join('/')
  const url = await findPathUrl(`${pathArray[0]}/api/${endpoint}`)

  if (!url) {
    console.error(`No URL found for ${path}`)
    return new Response(`No URL found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${url}`)
    }

    return res
  } catch (err) {
    console.error(`DELETE request failed at ${url}`, err)
  }
}

export { del, get, put, findPathUrl, findShipDomain }
