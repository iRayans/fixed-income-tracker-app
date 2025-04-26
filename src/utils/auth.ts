export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthenticated', 'true');
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

export const isTokenExpired = (error: any) => {
  return error.response?.status === 401 && 
         error.response?.data?.Error === "Invalid or expired JWT token";
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
};
