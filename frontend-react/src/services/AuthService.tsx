import axios from './auth-header';
import CustomError from './CustomError';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

class AuthService {
  
 

  login(email: string, password: string) {
    console.log('Login attempt for:', email);
    
    return axios
      .post(`${API_URL}/login`, { email, password })
      .then((response: { 
        data: { 
          token: string; 
          user: {
            id: string;
            email: string; 
            verified: boolean;
            username?: string;
          }
        } 
      }) => {
        console.log('Login response:', response);
        
        if (response.data?.token) {
          // Store user data with token
          localStorage.setItem(
            'user',
            JSON.stringify({
              token: response.data.token,
              id: response.data.user.id,
              email: response.data.user.email,
              verified: response.data.user.verified,
              username: response.data.user.username
            })
          );
          console.log('Login successful, user stored');
        } else {
          throw new Error('No authentication token received');
        }
        
        return response.data;
      })
      .catch((error: any) => {
        console.error('Login error:', error);
        
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        // Handle account not verified
        if (status === 403 && 
            (errorData?.error === 'ACCOUNT_NOT_VERIFIED' || 
             errorData?.message?.toLowerCase().includes('not verified'))) {
          throw new CustomError(
            'Account not verified',
            'ACCOUNT_NOT_VERIFIED',
            errorData
          );
        }
        
        // Handle invalid credentials
        if (status === 401) {
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

  signup(username: string, email: string, password: string) {
    console.log('Signup request for:', email);

    return axios.post(`${API_URL}/createNewUser`, {
      username,
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

  forgotPassword(email: string): Promise<any> {
    console.log('Sending password reset email to:', email);

    return axios.post(`${API_URL}/forgot-password`, { email })
      .then((response) => {
        console.log('Password reset email sent successfully:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        throw error;
      });
  }

  sendMagicLink(email: string) {
    console.log('Sending magic link to:', email);
    
    return axios
      .post(`${API_URL}/magic-link`, { email })
      .then((response) => {
        console.log('Magic link sent successfully:', response);
        return response.data;
      })
      .catch((error: any) => {
        console.error('Magic link error in AuthService:', error);
        
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        // Handle 404 - Account not found (for login attempts)
        if (status === 404) {
          throw new CustomError(
            'No account found with this email',
            'ACCOUNT_NOT_FOUND',
            errorData
          );
        }
        
        throw error;
      });
  }

  verifyMagicLink(token: string) {
    console.log('Verifying magic link token');
     console.log('🔗 API URL:', API_URL);  // Debug
    console.log('🔗 Full URL:', `${API_URL}/verify-magic-link?token=${token}`);
    
    return axios
      .get(`${API_URL}/verify-magic-link?token=${token}`)
      .then((response: { 
        data: { 
          token: string; 
          user: { 
            id: string; 
            email: string; 
            username?: string; 
            emailVerified: boolean;
            hasUsername: boolean;
          } 
        } 
      }) => {
        console.log('Magic link verification response:', response);
        
        if (response.data?.token) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              token: response.data.token,
              id: response.data.user.id,
              email: response.data.user.email,
              verified: response.data.user.emailVerified,
              username: response.data.user.username,
              hasUsername: response.data.user.hasUsername
            })
          );
          console.log('Magic link verification successful');
        } else {
          throw new Error('No authentication token received');
        }
        
        return response.data;
      })
      .catch((error: any) => {
        console.error('Magic link verification error:', error);
        
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        if (status === 400 || status === 401) {
          throw new CustomError(
            errorData?.message || 'Invalid or expired magic link',
            'INVALID_MAGIC_LINK',
            errorData
          );
        }
        
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