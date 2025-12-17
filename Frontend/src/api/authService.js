import axiosClient from './axiosClient';

export const login = (payload) =>
  axiosClient.post('/scalar/v1/auth/login', payload);

export const register = (formData) =>
  axiosClient.post('/scalar/v1/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const refreshToken = (refreshToken) =>
  axiosClient.post('/scalar/v1/auth/refresh', { refreshToken });

