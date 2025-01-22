/**
 * @typedef {Object} ShipUrls
 * @property {string} ship - The ship URL
 * @property {string} athens - The Athens URL
 */

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

async function findPathUrls(path) {
  let shipLocation
  console.log('Attempting to find URLs for', path)

  if (path.startsWith('/')) {
    console.log('Path starts with /')
    shipLocation = window.location.origin
  }

  if (path.startsWith('~')) {
    console.log('Path starts with ~')
    shipLocation = await findShipDomain(path)
  }

  if (!shipLocation) {
    console.error(`No URLs found for ${path}`)
  } else {
    const ship = path.split('/')[0].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const shipUrl = `${shipLocation}/${endpoint}`
    const athensUrl = `https://${ship}.urbit.org/${endpoint}`
    console.log(shipUrl)
    console.log(athensUrl)

    return {
      ship: shipUrl,
      athens: athensUrl,
    }
  }

  console.error('Unrecognized path:', path)
  return null
}

/**
 * GET request to a path
 * @param {string} path - The path to GET from
 * @returns {Promise<Response|void>} - The response if successful
 */
async function get(path) {
  const urls = await findPathUrls(path)

  if (!urls) {
    console.error(`File not found at ${path}`)
    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // TODO remove this for production
  if (path.split('/')[0] === '~sampel') {
    if (urls) {
      return fetch(urls.ship, {
        method: 'GET',
      })
    }
  }

  try {
    const res = await fetch(urls.athens, {
      method: 'GET',
      // TODO Authorization header
    })

    if (!res.ok) {
      throw new Error(`Response not ok at ${urls.athens}`)
    }

    return res
  } catch (err) {
    console.error(`GET request to ${urls.athens} failed:`, err)

    try {
      const res = await fetch(urls.ship, {
        method: 'GET',
      })

      if (!res.ok) {
        throw new Error(`Response not ok at ${urls.ship}`)
      }

      return res
    } catch (err) {
      console.log(`GET request to ${urls.ship} failed: `, err)
      return new Response(`File not found for ${path}`, {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Response-URL': urls.ship,
        },
      })
    }
  }
}

/**
 * PUT request to a path
 * @param {string} path - The path to PUT to
 * @param {FormData} data - The form data to PUT
 * @returns {Promise<Response|void>} - The response if successful
 */
async function put(path, data) {
  const urls = await findPathUrls(path)

  if (!urls) {
    console.error(`No URLs found for ${path.split('/').slice(0)}`)
    return
  }

  // TODO for development; remove
  if (window.urbitID === '~sampel') {
    return fetch(urls.ship, {
      method: 'PUT',
      // TODO Authorization header
      body: data,
    })
  }

  if (window.ship) {
    return fetch(urls.ship, {
      method: 'PUT',
      // TODO Authorization header
      body: data,
    })
  }

  if (window.urbitID) {
    return fetch(urls.athens, {
      method: 'PUT',
      // TODO Authorization header
      body: data,
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
  if (window.ship) {
    //pokeSky({
    //  method: "POST",
    //  body: {
    //    path: path,
    //    json: json,
    //  },
    //})
  } else {
    const ship = path.split('/')[0].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const url = `https://${ship}.urbit.org/${endpoint}`

    return fetch(url, {
      method: 'POST',
      // TODO Authorization header
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
}

/**
 * DELETE request to a path
 * @param {string} path - The path to DELETE
 * @returns {Promise<Response|void>} - The response if successful
 */
async function del(path) {
  if (window.ship) {
    //pokeSky({
    //  method: "DELETE",
    //  body: {
    //    path: path,
    //  },
    //})
  } else {
    const ship = path.split('/')[0].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const url = `https://${ship}.urbit.org/${endpoint}`

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // TODO Authorization header
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
}

export { get, put, post, del, findPathUrls, findShipDomain }
