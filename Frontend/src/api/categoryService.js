import axiosClient from './axiosClient';

export const getCategories = () => axiosClient.get('/api/Categories');
export const createCategory = (payload) => axiosClient.post('/api/Categories', payload);
export const updateCategory = (id, payload) =>
  axiosClient.put(`/api/Categories/${id}`, payload);
export const deleteCategory = (id) => axiosClient.delete(`/api/Categories/${id}`);

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
