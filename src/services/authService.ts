
import { getAuthToken, clearAuth } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Registration failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
        }
        throw new Error(errorData?.message || 'Login failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    clearAuth();
    return true;
  },

  getAuthHeaders() {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  async validateToken() {
    const token = getAuthToken();
    
    if (!token) {
      return false;
    }

    try {
      // Use any protected endpoint for token validation
      const response = await fetch('http://localhost:8080/api/v1/auth', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.handleTokenExpiration();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.handleTokenExpiration();
      return false;
    }
  },

  handleTokenExpiration() {
    clearAuth();
    toast.error("Your session has expired. Please log in again.");
    window.location.href = '/auth';
  },
};
