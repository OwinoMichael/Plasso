import axios from 'axios';
import { CustomError } from './CustomError';

const API_URL = 'http://localhost:8080';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - automatically add auth header to all requests
    axios.interceptors.request.use(
      (config) => {
        const user = this.getCurrentUser();
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth errors globally
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const status = error.response?.status;
        
        // Handle 401 (Unauthorized) - token expired or invalid
        if (status === 401) {
          console.log('Token expired or invalid, logging out...');
          this.logout();
          // Redirect to login page
          window.location.href = '/login';
        }
        
        // Handle 403 (Forbidden) - could be unverified account
        if (status === 403) {
          const user = this.getCurrentUser();
          if (user && !user.verified) {
            window.location.href = '/unverified-email';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  login(email: string, password: string) {
    console.log('Login attempt for:', email);
    
    return axios
      .post(`${API_URL}/login`, {
        email,
        password,
      })
      .then((response: { data: { token: string; email: string; verified: boolean; id: string } }) => {
        console.log('Login response:', response);
        
        if (response.data && response.data.token) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              token: response.data.token,
              email: response.data.email,
              verified: response.data.verified,
              id: response.data.id
            })
            
          );
          console.log('Login response data:', response.data);

          
        } else {
          console.warn('No token found in response:', response.data);
          throw new Error('No authentication token received');
        }
        
        return response.data;
      })
      .catch((error: any) => {
        console.error('Login error in AuthService:', error);
        
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        if (status === 403 && 
            (errorData?.error === 'ACCOUNT_NOT_VERIFIED' || 
             (typeof errorData === 'string' && errorData.toLowerCase().includes('not verified')))) {
          throw new CustomError(
            'Account not verified',
            'ACCOUNT_NOT_VERIFIED',
            errorData
          );
        }
        
        if (status === 401 && 
            (errorData?.error === 'INVALID_CREDENTIALS' || 
             errorData === 'Invalid Credentials' ||
             (typeof errorData === 'string' && errorData.toLowerCase().includes('invalid')))) {
          throw new CustomError(
            'Invalid email or password',
            'INVALID_CREDENTIALS',
            errorData
          );
        }
        
        throw error;
      });
  }

  logout() {
    localStorage.removeItem('user');
    console.log('User logged out, localStorage cleared');
  }

  signup(firstName: string, lastName: string, email: string, password: string) {
    console.log('Signup request for:', email);

    return axios.post(`${API_URL}/createNewUser`, {
      firstName,
      lastName,
      email,
      password,
    });
  }

  resendVerification(email: string) {
  console.log('Resending verification email for:', email);

  return axios.post(`${API_URL}/resend-verification`, { email })
    .then((response) => {
      console.log('Verification email sent:', response);
      return response.data;
    })
    .catch((error) => {
      console.error('Error resending verification email:', error);
      throw error;
    });
  }


  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  // You can remove getAuthHeader() since the interceptor handles this automatically
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return { Authorization: '' };
    }
  }

  // Add method to validate token
  async validateToken(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user || !user.token) return false;
    
    try {
      const response = await axios.get(`${API_URL}/validate-token`);
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

}

export default new AuthService();