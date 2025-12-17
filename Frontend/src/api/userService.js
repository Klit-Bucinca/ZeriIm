import axiosClient from './axiosClient';

export const getUsers = () => axiosClient.get('/api/User');
export const updateUser = (id, payload) => axiosClient.put(`/api/User/${id}`, payload);
export const deleteUser = (id) => axiosClient.delete(`/api/User/${id}`);

export default {
  getUsers,
  updateUser,
  deleteUser,
};
