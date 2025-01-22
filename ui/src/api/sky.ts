import Urbit from '@urbit/http-api'

export interface HTTPRequest {
  url: string
  method: string
  headers: Record<string, string>
  body: string
}

//
// TODO authentication for urbit.org
//
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
    console.error(`No domains found for ${ship}`)
  }
}

async function findShipUrl(path: string) {
  const shipDomain = await findShipDomain(path)

  if (!shipDomain) {
    console.error(`No URL found for ${path.split('/').slice(0)}`)
  } else {
    const endpoint = path.split('/').slice(1).join('/')
    const url = `${shipDomain}/${endpoint}`
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
}

async function get(path: string): Promise<Response | void> {
  const url = await findShipUrl(path)

  if (!url) {
    console.error(`File not found at ${path}`)
    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // TODO remove this for production
  if (path.split('/')[0] === '~sampel' && url) {
    return fetch(url, {
      method: 'GET',
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

async function put(path: string, data: FormData): Promise<Response | void> {
  const url = await findShipUrl(path)

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

async function post(path: string, json: JSON): Promise<Response | void> {
  const url = await findShipUrl(path)

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

async function del(path: string): Promise<Response | void> {
  const url = await findShipUrl(path)
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

// TODO make the type more specific than 'any' or 'JSON'
// needs to be custom defined in /types folder
//function pokeSky(json: HTTPRequest) {
//  const api = new Urbit("", "", "sky")
//  api.ship = window.ship
//  return api.poke({
//    app: "sky",
//    mark: "handle-http-request",
//    json: json,
//    onError: () => {
//      console.error(
//        `Failed ${json.method} request to %sky with JSON `,
//        json.body,
//      )
//    },
//  })
//}

export { get, put, post, del, auth, findShipUrl, findShipDomain }
