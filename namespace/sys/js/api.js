import Urbit from '@urbit/http-api'

//
// TODO authentication for urbit.org
//

async function findShipDomain(path) {
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
    console.error(`No domains found for ${ship}`)
  }
}

async function findPathUrl(path) {
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
    console.error(`No URLs found for ${path}`)
  } else {
    const endpoint = path.split('/').slice(1).join('/')
    const url = `${shipLocation}/${endpoint}`
    return url
  }
}

async function auth(ship, code) {
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

async function get(path) {
  const url = await findPathUrl(path)

  if (!url) {
    console.error(`File not found at ${path}`)
    return new Response(`File not found for ${path}`, {
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
      throw new Error(`Response not ok at ${url}`)
    }
    return res
  } catch (err) {
    console.log(`GET request to ${url} failed: `, err)
    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'X-Response-URL': url,
      },
    })
  }
}

async function put(path, data) {
  const url = await findPathUrl(path)

  if (!url) {
    console.error(`No url found for ${path.split('/').slice(0)}`)
    return
  }

  // TODO for development; remove
  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: data,
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok at ${url}`)
      }
      return res.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      console.error(`PUT request to ${url} failed:`, err)
    })
}

async function post(path, json) {
  const url = await findPathUrl(path)

  if (!url) {
    console.error(`No url found for ${path.split('/').slice(0)}`)
    return
  }

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(json),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok at ${url}`)
      }
      return res.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      console.error(`POST request to ${url} failed:`, err)
    })
}

async function del(path) {
  const url = await findPathUrl(path)
  if (!url) {
    console.error(`No url found for ${path.split('/').slice(0)}`)
    return
  }

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok at ${url}`)
      }
      return res.json()
    })
    .then(data => {
      console.log('Delete successful:', data)
    })
    .catch(err => {
      console.error(`DELETE request to ${url} failed:`, err)
    })
}

export { get, put, post, del, auth, findPathUrl, findShipDomain }
