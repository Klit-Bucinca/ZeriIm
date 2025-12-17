import axiosClient from './axiosClient';

export const getPosts = (criteria) =>
  axiosClient.get('/api/Posts', { params: criteria });

export const getPostById = (id, params) =>
  axiosClient.get(`/api/Posts/${id}`, { params });

export const createPost = (payload, config) =>
  axiosClient.post('/api/Posts', payload, config);

export const updatePost = (id, payload) =>
  axiosClient.put(`/api/Posts/${id}`, payload);

export const deletePost = (id) => axiosClient.delete(`/api/Posts/${id}`);

export default {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
