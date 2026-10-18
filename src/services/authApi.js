const API_BASE = 'http://178.254.1.159:25575';

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

  const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

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
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: login.trim(),
      password: password.trim(),
    }),
  });

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
    const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
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
