import axiosClient from './axiosClient';

/**
 * Simple factory that returns a scoped API client with CRUD helpers.
 * Keeps API usage consistent and encapsulates the base path.
 */
export const createApiClient = (basePath) => {
  const prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

  return {
    get: (path = '', config) => axiosClient.get(`${prefix}${path}`, config),
    post: (path = '', data, config) => axiosClient.post(`${prefix}${path}`, data, config),
    put: (path = '', data, config) => axiosClient.put(`${prefix}${path}`, data, config),
    delete: (path = '', config) => axiosClient.delete(`${prefix}${path}`, config),
  };
};

export default createApiClient;
