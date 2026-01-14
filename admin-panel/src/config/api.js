// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
