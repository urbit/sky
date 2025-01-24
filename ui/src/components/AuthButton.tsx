import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'

export default function StatusBar() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [state] = useState(window.crypto.randomUUID())
  const [code, setCode] = useState<string | null>(null)
  const [returnedState, setReturnedState] = useState<string | null>(null)
  const SSO_URL = import.meta.env.VITE_SSO_URL
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setCode(urlParams.get('code'))
    setReturnedState(urlParams.get('state'))
  }, [window.location.search])

  useEffect(() => {
    if (code && returnedState === sessionStorage.getItem('oauth_state')) {
      setLoading(true)

      fetch(`${SSO_URL}/oauth/token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: sessionStorage.getItem('code_verifier'),
          response_type: 'code',
        }),
      })
        .then(async res => {
          if (!res.ok) {
            const error = await res.text()
            throw new Error(error)
          }
          return res.json()
        })
        .then(data => {
          if (data.access_token) {
            const secureToken = encryptToken(data.access_token)
            localStorage.setItem('auth_token', secureToken)
          }
          setLoading(false)
          window.location.href = REDIRECT_URI
        })
        .catch(error => {
          console.error('Auth error:', error)
          setError(error.message)
          setLoading(false)
        })
    }
  }, [code])

  function handleLogin() {
    // Store state to verify when SSO redirects back
    generateCodeChallenge().then(({ codeChallenge, codeVerifier }) => {
      sessionStorage.setItem('code_verifier', codeVerifier)
      sessionStorage.setItem('oauth_state', state)

      window.location.href = `${SSO_URL}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`
    })
  }

  function handleLogout() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setLoading(true)

      fetch(`${SSO_URL}/oauth/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: decryptToken(token),
          client_id: CLIENT_ID,
        }),
      })
        .then(data => {
          if (data.ok === true) {
            localStorage.removeItem('auth_token')
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Auth error:', error)
          setLoading(false)
        })
    }
  }

  async function generateCodeChallenge() {
    // Generate random string
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const codeVerifier = Array.from(array, byte =>
      byte.toString(16).padStart(2, '0')
    ).join('')

    // SHA-256 hash
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    // Base64url encode
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const base64Hash = btoa(String.fromCharCode(...hashArray))
    const codeChallenge = base64Hash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    return { codeVerifier, codeChallenge }
  }

  const encryptToken = (token: string) => {
    const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY)
    return encrypted.toString()
  }

  const decryptToken = (encryptedToken: string) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : localStorage.getItem('auth_token') ? (
        <button onClick={handleLogout}>Log out</button>
      ) : (
        <button onClick={handleLogin}>Login with Urbit</button>
      )}
    </div>
  )
}
