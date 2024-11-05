import Urbit from '@urbit/http-api'
import { HTTPRequest } from '../types/api'

// TODO authentication for urbit.org / Athens
//      http-api should take care of pokes for us
//      use Authorization header throughout for these
//      requests

async function findDomains(path: string) {
  const ship = path.split('/')[0]
  console.log(`Attempting to get domain for ${ship}`)
  // TODO fetch from urbit.org / Athens
  const res = await fetch(`http://localhost:3000/domains`)
  const data = await res.json()

  if (data[ship]) {
    return data[ship]
  } else {
    console.error(`No domains found for ${ship}`)
  }
}

async function findUrls(path: string) {
  const domains = await findDomains(path)

  if (!domains || !domains.athens && !domains.ship) {
    console.error(`No URLs found for ${path.split('/').slice(0)}`)
  } else {
    const endpoint = path.split('/').slice(1).join('/')
    const athensUrl = `${domains.athens}/${endpoint}`
    const shipUrl = `${domains.ship}/${endpoint}`
    console.log(athensUrl)
    console.log(shipUrl)

    return {
      athens: athensUrl,
      ship: shipUrl
    }
  }
}

async function get(path: string): Promise<Response | void> {
  const urls = await findUrls(path)

  if (!urls) {
    console.error(`Can't find a resource at ${path}`)
    return;
  }

  return fetch(urls.athens, {
    method: 'GET'
    // TODO Authorization header
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Response not ok at ${urls.athens}`)
      }
      return res
    })
    .then(data => {
      return data
    })
    .catch(err => {
      console.error(`GET request to ${urls.athens} failed:`, err)
      return fetch(urls.ship, {
        method: 'GET'
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Response not ok at ${urls.ship}`)
          }
          return res
        })
        .then(data => {
          return data
        })
        .catch(err => {
          console.error(`GET request to ${urls.ship} failed:`, err)
        })
    })
}

async function put(path: string, json: JSON): Promise<Response | void> {
  if (window.ship) {
    pokeSky({
      method: 'PUT',
      body: {
        path: path,
        json: json
      }
    })
  } else {
    const ship = path.split('/')[1].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const url = `https://${ship}.urbit.org/${endpoint}`

    return fetch(url, {
      method: 'PUT',
      // TODO Authorization header
      body: JSON.stringify(json)
    })
  }
}

async function post(path: string, json: JSON): Promise<Response | void> {
  if (window.ship) {
    pokeSky({
      method: 'POST',
      body: {
        path: path,
        json: json
      }
    })
  } else {
    const ship = path.split('/')[1].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const url = `https://${ship}.urbit.org/${endpoint}`

    return fetch(url, {
      method: 'POST',
      // TODO Authorization header
      body: JSON.stringify(json)
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
    pokeSky({
      method: 'DELETE',
      body: {
        path: path
      }
    })
  } else {
    const ship = path.split('/')[1].slice(1)
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

// TODO make the type more specific than 'any' or 'JSON';
// needs to be custom defined in /types folder
function pokeSky(json: HTTPRequest) {
  const api = new Urbit('', '', 'sky')
  api.ship = window.ship
  return api.poke({
    app: 'sky',
    mark: 'handle-http-request',
    json: json,
    onError: () => {
      console.error(`Failed ${json.method} request to %sky with JSON `, json.body)
    }
  })
}

export { del, get, post, put, findDomains, findUrls }
