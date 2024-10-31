import Urbit from '@urbit/http-api'

// TODO authentication for urbit.org / Athens
//      http-api should take care of pokes for us
//      use Authorization header throughout for these
//      requests

function get(path: string) {
  if (window.ship) {
    // TODO remote scry over HTTP?
    //      waiting on 410k
    pokeSky({
      method: 'GET',
      body: {
        path: path
      }
    })
  } else {
    const ship = path.split('/')[1].slice(1)
    const endpoint = path.split('/').slice(1).join('/')
    const url = `https://${ship}.urbit.org/${endpoint}`
    fetch(url, {
      method: 'GET'
      // TODO Authorization header
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
        console.error(`GET request to ${url} failed:`, err)
      })
  }
}

function put(path: string, json: JSON) {
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
    fetch(url, {
      method: 'PUT',
      // TODO Authorization header
      body: JSON.stringify(json)
    })
  }
}

function post(path: string, json: JSON) {
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
    fetch(url, {
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

function del(path: string) {
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
    fetch(url, {
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
function pokeSky(json: any) {
  const api = new Urbit('', '', 'sky')
  api.ship = window.ship
  return api.poke({
    app: 'sky',
    mark: 'handle-http-request',
    json: json,
    onError: () => {
      console.error(`Failed ${json.method} request to %sky with JSON `, json.body.json)
    }
  })
}

export { del, get, post, put }
