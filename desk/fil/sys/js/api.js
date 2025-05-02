// TODO handle relative get('foo')
async function get(path) {
  if (path.startsWith('/')) {
    try {
      const res = await fetch(`${window.location.origin}/seer?path=${path}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Response not ok from ${window.location.origin}/seer?path=${path}`)
      }

      return res
    } catch (err) {
      console.error(
        `GET request to ${path} failed at ${window.location.origin}/seer?path=${path}`,
        err
      )
    }
  }

  const pathArray = path.split('/')
  const pathShip = pathArray[0]
  const endpoint = pathArray.slice(1).join('/')
  const url = `${window.location.origin}/${endpoint}`

  if (pathShip === `~${window.ship}`) {
    try {
      const eyreRes = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      const redirectedToGrid =
        eyreRes.redirected && endpoint !== 'apps/landscape'
      // TODO i think dev env messing this up, should fix
      //eyreRes.url === `${window.location.origin}/apps/landscape/`

      if (redirectedToGrid) {
        throw new Error(`URL not found for ${path}`)
      }

      if (eyreRes.status === 404) {
        throw new Error(`404 not found for ${url}`)
      }

      return eyreRes
    } catch (err) {
      console.log(
        `GET request to ${window.location.origin}/${endpoint} failed at ${url}`,
        err
      )

      try {
        const seerRes = await fetch(`${window.location.origin}/seer?path=${path}`, {
          method: 'GET',
          credentials: 'include',
        })

        const redirectedToGrid =
          seerRes.redirected && endpoint !== 'apps/landscape'
        // TODO i think dev env messing this up, should fix
        //seerRes.url === `${window.location.origin}/apps/landscape/`

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
    const res = await fetch(`${window.location.origin}/seer?path=${path}`, {
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

async function kids(path, care) {
  const aeroRes = await fetch(
    `${window.location.origin}/~/scry/aero/eyre/paths/${care}${path}.mime`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )

  const seerRes = await fetch(
    `${window.location.origin}/~/scry/seer/seer/paths/${care}${path}.mime`, {
    method: 'GET',
    credentials: 'include',
  })

  const aeroData = await aeroRes.json()
  const seerData = await seerRes.json()

  return [...aeroData.urls, ...seerData.paths]
}

// TODO post()

//async function del(path): Promise<Response | void> {
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

export { get, kids, put }
