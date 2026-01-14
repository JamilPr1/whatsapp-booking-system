// API Configuration
//
// In production on Vercel we default to same-origin calls ("/api/...") and
// rely on the Serverless proxy at `admin-panel/api/[...path].js`.
// If you want to call your backend directly, set VITE_API_URL to an absolute URL.
const raw = (import.meta.env.VITE_API_URL || '').trim();
const API_URL = raw.startsWith('http://') || raw.startsWith('https://') ? raw : '';

export const apiClient = {
  baseURL: API_URL,
  get: async (url, config = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...config,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
    return response.json();
  },
  post: async (url, data, config = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  patch: async (url, data, config = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...config,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default API_URL;
