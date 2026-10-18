const DEFAULT_API_BASE = 'http://178.254.1.159:25575';

export function getApiBase() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('crazyr_api_url');
    if (custom && custom.trim()) return custom.trim();
  }
  return DEFAULT_API_BASE;
}

export function setApiBase(url) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('crazyr_api_url', url.trim());
    } else {
      localStorage.removeItem('crazyr_api_url');
    }
  }
}

/**
 * Handle fetch errors including Browser Mixed Content (HTTPS -> HTTP) blocks.
 */
function handleFetchError(err) {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && getApiBase().startsWith('http:')) {
    throw new Error(
      'Mixed-Content-Sperre: Dein Browser blockiert unverschlüsselte HTTP-Anfragen auf dieser HTTPS-Website. Bitte richte SSL/HTTPS oder einen Cloudflare-Tunnel auf dem Server ein.'
    );
  }
  throw new Error(err?.message || 'Server nicht erreichbar oder Verbindung abgelehnt.');
}

/**
 * Register a new user in the SQLite backend database.
 */
export async function registerUser({ username, email, password, license_key }) {
  const payload = {
    username: username.trim(),
    email: email.trim(),
    password: password.trim(),
  };

  if (license_key && license_key.trim()) {
    payload.license_key = license_key.trim();
  }

  let response;
  try {
    response = await fetch(`${getApiBase()}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    handleFetchError(err);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (response.status === 409 ? 'Username or Email is already registered.' : 'Registration failed.');
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Log in an existing user from the SQLite backend database.
 */
export async function loginUser({ login, password }) {
  let response;
  try {
    response = await fetch(`${getApiBase()}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login.trim(),
        password: password.trim(),
      }),
    });
  } catch (err) {
    handleFetchError(err);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (response.status === 401 ? 'Invalid username/email or password.' : 'Login failed.');
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Fetch the authenticated user profile using their JWT session token.
 */
export async function fetchUserProfile(token) {
  if (!token) return null;

  try {
    const response = await fetch(`${getApiBase()}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.user || null;
  } catch (e) {
    return null;
  }
}
