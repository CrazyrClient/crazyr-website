/**
 * Crazyr Client Auth API Service
 * Robust Multi-Tier Architecture:
 * 1. User LocalStorage Override ('crazyr_api_url')
 * 2. Vite Dev Reverse Proxy ('') in development mode (intercepts /api and forwards seamlessly)
 * 3. Environment Variable (VITE_API_URL)
 * 4. Production Direct Backend (Pelican Server: http://178.254.1.159:25575)
 */

export const DEFAULT_PROD_API_BASE = 'http://178.254.1.159:25575';

/**
 * Resolve the active API base URL with full fallback ladder.
 */
export function getApiBase() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('crazyr_api_url');
    if (custom && custom.trim()) {
      const cleanCustom = custom.trim().replace(/\/+$/, '');
      // If website is hosted on HTTPS, warn about plain HTTP mixed-content restrictions
      if (window.location.protocol === 'https:' && cleanCustom.startsWith('http:') && !cleanCustom.includes('localhost')) {
        console.warn('[authApi] Custom HTTP URL may be blocked by browser HTTPS mixed-content policy:', cleanCustom);
      }
      return cleanCustom;
    }
  }

  // In Vite Development mode (import.meta.env.DEV), return empty string so relative
  // requests like "/api/v1/auth/..." go directly to Vite's dev proxy without CORS.
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.DEV) {
      return '';
    }
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) {
      return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    }
  }

  // In production (e.g. static hosting on HTTP, electron, or local network)
  return DEFAULT_PROD_API_BASE;
}

/**
 * Configure or clear custom API base in localStorage.
 */
export function setApiBase(url) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('crazyr_api_url', url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('crazyr_api_url');
    }
  }
}

/**
 * Check connectivity and latency to the backend server.
 */
export async function checkApiHealth(timeoutMs = 4000) {
  const base = getApiBase();
  const url = `${base}/api/v1/health`;
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timer);
    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'UP' }));
      return {
        ok: true,
        latency,
        status: data.status || 'UP',
        service: data.service || 'Veloxcity-CB',
        version: data.version || '2.1.0',
        url: base || '(Vite Dev Proxy: /api)',
      };
    } else {
      return {
        ok: false,
        latency,
        error: `HTTP ${res.status}: ${res.statusText}`,
        url: base || '(Vite Dev Proxy: /api)',
      };
    }
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      latency: Math.round(performance.now() - start),
      error: err.name === 'AbortError' ? 'Connection timed out (>4s)' : (err.message || 'Network unreachable'),
      url: base || '(Vite Dev Proxy: /api)',
    };
  }
}

/**
 * Handle fetch errors including Browser Mixed Content (HTTPS -> HTTP) and network drops.
 */
function handleFetchError(err) {
  const base = getApiBase();

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && base.startsWith('http:') && !base.includes('localhost')) {
    throw new Error(
      'Mixed-Content-Sperre: Dein Browser blockiert unverschlüsselte HTTP-Anfragen auf dieser HTTPS-Website. Bitte richte einen HTTPS-Tunnel (Cloudflare) ein oder nutze einen gesicherten Endpunkt.'
    );
  }

  const rawMsg = err?.message || '';
  if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError') || rawMsg.includes('aborted') || err?.name === 'TypeError') {
    throw new Error(
      `Auth-Server nicht erreichbar (${base || 'Vite Proxy'}). Prüfe, ob der Backend-Server (178.254.1.159:25575) oder der Tunnel online ist, oder passe die Backend-URL in den Einstellungen an.`
    );
  }

  throw new Error(rawMsg || 'Server nicht erreichbar oder Verbindung abgelehnt.');
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

/**
 * Redeem / activate a license key for an authenticated user.
 */
export async function redeemLicenseKey(key, token) {
  if (!token) throw new Error('Nicht eingeloggt.');
  if (!key || !key.trim()) throw new Error('Bitte gib einen Lizenzschlüssel an.');

  let response;
  try {
    response = await fetch(`${getApiBase()}/api/v1/auth/redeem-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key: key.trim() }),
    });
  } catch (err) {
    handleFetchError(err);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Fehler beim Einlösen des Lizenzschlüssels.');
  }

  return data;
}

/**
 * Delete / unlink the user's active license key or a specific key.
 */
export async function deleteLicenseKey(token, key = null) {
  if (!token) throw new Error('Nicht eingeloggt.');

  const payload = {};
  if (key && key.trim()) {
    payload.key = key.trim();
  }

  let response;
  try {
    response = await fetch(`${getApiBase()}/api/v1/auth/delete-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    handleFetchError(err);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Fehler beim Löschen des Lizenzschlüssels.');
  }

  return data;
}

/**
 * Admin function to delete any license key using the admin token.
 */
export async function adminDeleteKey(adminToken, key) {
  if (!key || !key.trim()) throw new Error('Bitte gib einen Key an.');

  let response;
  try {
    response = await fetch(`${getApiBase()}/api/v1/admin/deletekey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': adminToken || 'VELOXCITY_CB_ADMIN_SECRET_998877',
      },
      body: JSON.stringify({ key: key.trim() }),
    });
  } catch (err) {
    handleFetchError(err);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Fehler beim Löschen des Lizenzschlüssels.');
  }

  return data;
}
