import Urbit from '@urbit/http-api'
/**
 * Find the domain for a given ship path
 * @param {string} path - The path to find the domain for
 * @returns {Promise<string|undefined>} - The domain if found
 */
async function findShipDomain(path) {
  const ship = path.split('/')[0]
  console.log(`Attempting to get domain for ${ship}`)
  // TODO replace with real server
  const res = await fetch(`http://localhost:3000/domains`)
  const data = await res.json()

  // TODO don't return all domains for all ships
  if (data[ship]) {
    return data[ship]
  } else {
    console.error(`No domains found for ${ship}`)
  }
}

/**
 * Find URLs for a given ship path
 * @param {string} path - The path to find URLs for
 * @returns {Promise<urls|undefined>} - The URLs if found
 */
async function findShipUrl(path) {
  const shipDomain = await findShipDomain(path)

  if (!shipDomain) {
    console.error(`No URL found for ${path.split('/').slice(0)}`)
  } else {
    const url = `${shipDomain}/${endpoint}`
    console.log(url)

    return url
  }
}

/**
 * Sends Authentication request using Urbit object
 * @param {string} ship
 * @param {string} code
 * @returns {Promise<urls|undefined>} - The URLs if found
 */
async function auth(ship, code) {
  const url = await findShipDomain(`~${ship}`)

  if (url) {
    console.log('Authenticating ', `~${ship}`)
    return await Urbit.authenticate({
      ship: ship,
      url: url,
      code: code,
      verbose: true
    })
  }
}

/**
 * GET request to a path
 * @param {string} path - The path to GET from
 * @returns {Promise<Response|void>} - The response if successful
 */
async function get(path) {
  const url = await findShipUrl(path)

  if (!url) {
    console.error(`File not found at ${path}`)
    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  // TODO remove this for production
  if (path.split('/')[0] === '~sampel') {
    if (url) {
      return fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
    }
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include'
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
        'X-Response-URL': url
      }
    })
  }
}

/**
 * PUT request to a path
 * @param {string} path - The path to PUT to
 * @param {FormData} data - The form data to PUT
 * @returns {Promise<Response|void>} - The response if successful
 */
async function put(path, data) {
  const url = await findShipUrl(path)

  if (!url) {
    console.error(`No URLs found for ${path.split('/').slice(0)}`)
    return
  }

  // TODO for development; remove
  if (window.urbitID === '~sampel' || window.ship) {
    return fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }
}

/**
 * POST request to a path
 * @param {string} path - The path to POST to
 * @param {JSON} json - The JSON data to POST
 * @returns {Promise<Response|void>} - The response if successful
 */
async function post(path, json) {
  const url = await findShipUrl(path)

  if (!url) {
    console.error(`No url found for ${path.split('/').slice(0)}`)
    return
  }

  if (url && winodow.ship) {
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(json)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Response not ok at ${url}`)
        }
        return res.json()
      })
      .then((data) => {
        return data
      })
      .catch((err) => {
        console.error(`POST request to ${url} failed:`, err)
      })
  }
}

/**
 * DELETE request to a path
 * @param {string} path - The path to DELETE
 * @returns {Promise<Response|void>} - The response if successful
 */
async function del(path) {
  const url = await findShipUrl(path)

  if (url) {
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Response not ok at ${url}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('Delete successful:', data)
      })
      .catch((err) => {
        console.error(`DELETE request to ${url} failed:`, err)
      })
  }
}

export { get, put, post, del, auth, findShipUrl, findShipDomain }
