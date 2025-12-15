import axiosClient from './axiosClient';

export const createComment = (payload) =>
  axiosClient.post('/api/Comments', payload);

export const updateComment = (id, payload) =>
  axiosClient.put(`/api/Comments/${id}`, payload);

export const deleteComment = (id) => axiosClient.delete(`/api/Comments/${id}`);

export default {
  createComment,
  updateComment,
  deleteComment,
};
