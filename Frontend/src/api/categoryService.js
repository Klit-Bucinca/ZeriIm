import axiosClient from './axiosClient';

export const getCategories = () => axiosClient.get('/api/Categories');

export default {
  getCategories,
};
