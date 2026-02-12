import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    // ✅ ADD CONSOLE LOG TO DEBUG
    console.log('🔧 Request URL:', config.baseURL + config.url);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('🔧 Token from localStorage:', token ? '✅ Present' : '❌ Missing');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔧 Authorization header set:', config.headers.Authorization);
      } else {
        console.log('🔧 No token found in localStorage');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ... rest of your code
export default api;