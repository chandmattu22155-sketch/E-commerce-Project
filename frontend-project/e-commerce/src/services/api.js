const BASE_URL = import.meta.env.VITE_API_URL;


const getErrorMessage = (data, fallback) => {
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.error) return data.error
  if (data.detail) return data.detail
  const messages = Object.values(data)
    .flat()
    .filter((m) => typeof m === 'string')
  return messages.length ? messages.join(' ') : fallback
}

const clearAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
}

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    return true
  } catch {
    return false
  }
}

export const request = async (path, { method = 'GET', body, auth = true } = {}, retry = true) => {
  const token = localStorage.getItem('access_token')
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }


  if (res.status === 401 && auth && retry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return request(path, { method, body, auth }, false)
    clearAuth()
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }

  if (res.status === 204) return true

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(getErrorMessage(data, 'Something went wrong'))
  return data
}