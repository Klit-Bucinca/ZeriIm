import axiosClient from './axiosClient';

export const getTopPriority = (params) =>
  axiosClient.get('/api/Priority/top', { params });

export default {
  getTopPriority,
};
