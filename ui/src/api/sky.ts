//
// TODO authentication for urbit.org / Athens
//
async function findShipDomain(path: string) {
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

async function findShipUrls(path: string) {
  const shipDomain = await findShipDomain(path)

  if (!shipDomain) {
    console.error(`No URL found for ${path.split('/').slice(0)}`)
  } else {
    const ship = path.split('/')[0].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const shipUrl = `${shipDomain}/${endpoint}`
    const athensUrl = `https://${ship}.urbit.org/${endpoint}`
    console.log(shipUrl)
    console.log(athensUrl)

    return {
      ship: shipUrl,
      athens: athensUrl,
    }
  }
}

async function get(path: string): Promise<Response | void> {
  const urls = await findShipUrls(path)

  if (!urls) {
    console.error(`File not found at ${path}`)
    return new Response(`File not found for ${path}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
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

async function put(path: string, json: JSON): Promise<Response | void> {
  if (window.ship) {
    //pokeSky({
    //  method: "PUT",
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
      method: 'PUT',
      // TODO Authorization header
      body: JSON.stringify(json),
    })
  }
}

async function post(path: string, json: JSON): Promise<Response | void> {
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

async function del(path: string): Promise<Response | void> {
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

export { del, get, post, put, findShipDomain, findShipUrls }
