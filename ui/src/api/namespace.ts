const ourDomain = (): string => {
  return import.meta.env.MODE !== 'production'
    ? import.meta.env.VITE_SHIP_URL || 'http://localhost:80'
    : window.location.origin
}

// TODO handle relative get('foo')
// TODO remove hard-coded URLs
async function get(path: string): Promise<Response | void> {
  if (path.startsWith('/')) {
    try {
      const res = await fetch(`${ourDomain()}/seer?path=${path}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok from ${ourDomain()}/seer?path=${path}`)
      }

      return res
    } catch (err) {
      console.error(
        `GET request to ${path} failed at ${ourDomain()}/seer?path=${path}`,
        err
      )
    }
  }

  const pathArray = path.split('/')
  const pathShip = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const url = `${ourDomain()}/${endpoint}`

  if (pathShip === `~${window.ship}`) {
    try {
      const eyreRes = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      const redirectedToGrid =
        eyreRes.redirected && endpoint !== 'apps/landscape'
      // TODO i think dev env messing this up, should fix
      //eyreRes.url === `${ourDomain()}/apps/landscape/`

      if (redirectedToGrid) {
        throw new Error(`URL not found for ${path}`)
      }

      if (eyreRes.status === 404) {
        throw new Error(`404 not found for ${url}`)
      }

      return eyreRes
    } catch (err) {
      console.log(
        `GET request to ${ourDomain()}/${endpoint} failed at ${url}`,
        err
      )

      try {
        const seerRes = await fetch(`${ourDomain()}/seer?path=${path}`, {
          method: 'GET',
          credentials: 'include',
        })

        const redirectedToGrid =
          seerRes.redirected && endpoint !== 'apps/landscape'
        // TODO i think dev env messing this up, should fix
        //seerRes.url === `${ourDomain()}/apps/landscape/`

        if (redirectedToGrid) {
          return new Response(`File not found for ${path}`, {
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
              'X-Response-URL': url,
            },
          })
        }

        return seerRes
      } catch (err) {
        console.error(`GET request to ${pathShip} failed at ${url}`, err)
      }
    }
  }

  try {
    const res = await fetch(`${ourDomain()}/seer?path=${path}`, {
      method: 'GET',
      credentials: 'include',
    })

    return res
  } catch (err) {
    console.error(`GET request to ${pathShip} failed at /seer`, err)
  }
}

// TODO handle relative put('foo', file)
// TODO handle relative put('/foo', file)
// TODO handle relative put('~/foo', file)
// TODO remove hard-coded URLs
async function put(path: string, file: File): Promise<Response | void> {
  const url = `${ourDomain()}/seer?path=${path}&mime=${file.type}&name=${file.name}`

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

async function kids(
  path: string,
  care: 'x' | 'y' | 'z'
): Promise<Array<string>> {
  const aeroRes = await fetch(
    `${ourDomain()}/~/scry/aero/eyre/paths/${care}${path}.mime`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )

  const seerRes = await fetch(
    `${ourDomain()}/~/scry/seer/seer/paths/${care}${path}.mime`, {
    method: 'GET',
    credentials: 'include',
  })

  const aeroData = await aeroRes.json()
  const seerData = await seerRes.json()

  return [...aeroData.urls, ...seerData.paths]
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

export { get, kids, put, ourDomain }
