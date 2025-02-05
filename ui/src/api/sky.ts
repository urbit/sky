import Urbit from '@urbit/http-api'

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

async function auth(ship: string, code: string) {
  const url = await findShipDomain(`~${ship}`)

  console.log('url', url)

  if (url) {
    console.log('Authenticating ', `~${ship}`)
    return await Urbit.authenticate({
      ship: ship,
      url: url,
      code: code,
      verbose: true,
    })
  }

  console.error('Failed to authenticate ship')
  return null
}

async function get(path: string): Promise<Response | void> {
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
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error(`Response not ok for ${url}`)
    }

    return res
  } catch (err) {
    console.error(`GET request failed at ${url}`, err)

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
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': file.name
      },
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

// TODO del()

export { get, put, auth, findPathUrl, findShipDomain }
