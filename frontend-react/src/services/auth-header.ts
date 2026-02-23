import axios from 'axios';

// Request interceptor - add Authorization header
axios.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Handle 401 - Unauthorized (token expired/invalid)
    if (status === 401) {
      console.log('Token expired or invalid, logging out...');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 - Forbidden (unverified account)
    if (status === 403) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && !user.verified) {
            window.location.href = '/unverified-email';
          }
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;