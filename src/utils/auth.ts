
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthenticated', 'true');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
};
