// API service for handling all fetch requests

// Base URL for the backend API.
// Local dev: leave REACT_APP_API_URL unset -> uses CRA's "proxy" in package.json.
// Production: set REACT_APP_API_URL to the deployed backend, e.g. https://your-api.onrender.com
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const API = {
  // Generic fetch method with error handling
  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  },

  // API endpoints grouped by feature
  users: {
    getAll: () => API.fetchData('/api/users'),
    create: (userData) => API.fetchData('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),
    delete: (userId) => API.fetchData(`/api/users/${userId}`, {
      method: 'DELETE',
    }),
  },

  products: {
    getAll: () => API.fetchData('/api/products'),
    create: (productData) => API.fetchData('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }),
  },

  tasks: {
    getAll: () => API.fetchData('/api/tasks'),
    create: (taskData) => API.fetchData('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    }),
    toggleComplete: (taskId, completed) => API.fetchData(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    }),
  },

  orders: {
    getAll: () => API.fetchData('/api/orders'),
    create: (orderData) => API.fetchData('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }),
  },

  checkout: {
    quote: (items, promoCode) => API.fetchData('/api/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, promoCode }),
    }),
  },

  search: {
    query: (searchTerm) => API.fetchData(`/api/search?q=${encodeURIComponent(searchTerm)}`),
  },

  system: {
    getMessage: () => API.fetchData('/api'),
    getHealth: () => API.fetchData('/api/health'),
    getAnalytics: () => API.fetchData('/api/analytics'),
  },
};

export default API;
