import axiosClient from './axiosClient';

export const getMunicipalities = () => axiosClient.get('/api/Municipalities');

export default {
  getMunicipalities,
};
