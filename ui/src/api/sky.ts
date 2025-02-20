async function findShipDomain(path: string) {
  const ship = path.split('/')[0]
  console.log(`Attempting to get domain for ${ship}`)
  console.log('window.ship', window.ship)
  // TODO replace with real server
  const res = await fetch(`http://localhost:3000/domains`)
  const data = await res.json()

  // TODO don't return all domains for all ships
  if (data[ship]) {
    console.log('domain', data[ship])
    return data[ship]
  } else {
    console.error(`No domain found for ${ship}`)
  }
}

async function findPathUrl(path: string): Promise<string | void> {
  let shipLocation
  console.log('Attempting to find URLs for', path)

  if (path.startsWith('/')) {
    console.log('Path starts with /')
    shipLocation = window.location.origin
  }

  // TODO support e.g. get('foo/bar') as well as get(/foo/bar)

  if (path.startsWith('~')) {
    console.log('Path starts with ~')
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

// TODO rename to just get()
async function scryGet(path: string): Promise<Response | void> {
  const pathArray = path.split('/')
  // TODO assumes first path segment is a ship;
  // should change this to support get('/foo') etc.
  const pathShip = pathArray[0].slice(1)
  const pathEnd = pathArray.slice(1).join('/')

  if (pathShip === `~${window.ship}`) {
    console.log('Scrying our ship')
    const clayURL = `${window.location.origin}/_~_/~${window.ship}/sky/${Date.now()}/cx/fil/${pathEnd}/mime`

    try {
      const res = await fetch(clayURL, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok for ${clayURL}`)
      }

      return res
    } catch (err) {
      console.error(`GET request failed at ${clayURL}`, err)

      return new Response(`File not found for ${path}`, {
        status: 404,
      })
    }
  }

  try {
    const fqsp = `${pathShip}/sky/${Date.now()}/cx/fil/${pathEnd}`
    const res = await fetch(`${window.location.origin}/seer`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Path': fqsp,
      }
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${window.location.origin}/seer scrying path ${fqsp}`)
    }

    return res
  } catch (err) {
    console.error(`GET request failed at ${window.location.origin}/seer`, err)

    return new Response(`File not found for ${path}`, {
      status: 404,
    })
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
    console.log('GETting ', url)
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${url}`)
    }

    // TODO remove hard-coded URL
    const redirectedToGrid =
      endpoint !== '/apps/landscape' &&
      res.url === `http://localhost:8080/apps/landscape/`

    console.log(window.location.origin)
    console.log('res.url', res.url)

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
    console.log(`pathShip is ${pathShip}`)
    console.log(`API thinks window.ship is ${window.ship}`)

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
        console.log('GETting ', apiUrl)
        const res = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include'
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
    console.log('PUTting to ', url)
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: file
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
    console.log('DELETE-ing ', url)
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
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
