import '@urbit/sigil-js'
import { useState, useEffect } from 'react';
import bellIcon from '../assets/images/bell.png'
import closeIcon from '../assets/images/close.png'

const sigilConfig = {
  // TODO don't hard-code height all over this component
  // changing size in sigilConfig upsets layout
  size: '30px',
  // TODO remove hard-coded ship
  point: '~sampel-palnet',
  // TODO get colors from tlon/landscape user preferences
  foreground: '#FFF',
  background: '#c10c31',
  detail: 'none',
  space: 'default',
}

export default function StatusBar() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state] = useState(window.crypto.randomUUID());
  const [code, setCode] = useState<string | null>(null);
  const [returnedState, setReturnedState] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCode(urlParams.get("code"));
    setReturnedState(urlParams.get("state"));
  }, [window.location.search]);
  const SSO_URL = import.meta.env.SSO_URL
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID

  useEffect(() => {
    if (code && returnedState === sessionStorage.getItem('oauth_state')) {
      setLoading(true);

      fetch(`${SSO_URL}/oauth/token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          //'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: sessionStorage.getItem('code_verifier'),
          response_type: 'code'
        })
      })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Token response:', data);
        if (data.access_token) {
          //TODO: encrypt token here
          //const secureToken = encryptToken(data.access_token)
          localStorage.setItem('auth_token', data.access_token)
        }
        setLoading(false);
        window.location.href = REDIRECT_URI
      })
      .catch((error) => {
        console.error('Auth error:', error);
        setError(error.message);
        setLoading(false);
      });
    }
  }, [code]);


  function handleLogin() {
    
    // Store state to verify when SSO redirects back
    generateCodeChallenge().then(({ codeChallenge, codeVerifier }) => {
      sessionStorage.setItem('code_verifier', codeVerifier);
      sessionStorage.setItem('oauth_state', state)

      window.location.href = `${SSO_URL}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    });
  };

  async function generateCodeChallenge() {
    // Generate random string
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
   
    // SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
   
    // Base64url encode
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray));
    const codeChallenge = base64Hash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
   
    return {codeVerifier, codeChallenge}
   }

   function handleLogout (){
    return
   }

  return (
    <div className="fr ac jb" style={{ height: '50px' }}>
      <div
        className="br1 fr ac jb b1"
        style={{
          height: '30px',
          paddingLeft: '10px',
          paddingRight: '10px',
          width: '200px',
        }}
      >
        <span>Workspace 1</span>
        <div>
          <img
            style={{ height: '10px', width: '10px' }}
            src={closeIcon}
            alt="Close space"
          />
        </div>
      </div>
      <div className="fr ac jb" style={{ height: '30px' }}>
        <div>
          {loading ? (
            <div>Loading</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : localStorage.getItem('token') ? (
            <button onClick={handleLogout}>Log out</button>
          ) : (
            <button onClick={handleLogin}>Login with Urbit</button>
          )}
        </div>
        <div
          className="fr ac jc br1 b1"
          style={{ width: '30px', height: '30px' }}
        >
          <img
            src={bellIcon}
            alt="Open notifications"
            style={{ height: '20px' }}
          />
        </div>
        <div
          className="br1 scroll-hidden"
          style={{ height: '30px', marginLeft: '5px' }}
        >
          <urbit-sigil {...sigilConfig} />
        </div>
      </div>
    </div>
  )
}