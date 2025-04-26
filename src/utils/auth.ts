
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    clearAuth();
    window.location.href = '/auth';
  }
};

// Check if the error response indicates an expired token
export const isTokenExpired = (error: any) => {
  return error.response?.status === 401 && 
         error.response?.data?.Error === "Invalid or expired JWT token";
};

// Check if a response indicates token expiration or invalid authentication
export const isAuthError = (response: Response) => {
  return response.status === 401;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
};
