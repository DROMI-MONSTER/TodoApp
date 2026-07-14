import apiClient from './axios.js';

export const login = (payload) => apiClient.post('/auth/login', payload);
export const signup = (payload) => apiClient.post('/auth/register', payload);
export const logout = () => apiClient.post('/auth/logout');
export const getCurrentUser = () => apiClient.get('/auth/me');
