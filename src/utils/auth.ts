
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

export const isTokenExpired = (error: any) => {
  return error.response?.status === 401 && 
         (error.response?.data?.Error === "Invalid or expired JWT token" ||
          error.response?.data?.message === "Invalid or expired JWT token");
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

export const clearAuth = () => {
  localStorage.removeItem('token');
};
