import axiosClient from './axiosClient';

export const getMunicipalities = () => axiosClient.get('/api/Municipalities');
export const createMunicipality = (name) =>
  axiosClient.post('/api/Municipalities', name, {
    headers: { 'Content-Type': 'application/json' },
  });
export const updateMunicipality = (id, name) =>
  axiosClient.put(`/api/Municipalities/${id}`, name, {
    headers: { 'Content-Type': 'application/json' },
  });
export const deleteMunicipality = (id) =>
  axiosClient.delete(`/api/Municipalities/${id}`);

export default {
  getMunicipalities,
  createMunicipality,
  updateMunicipality,
  deleteMunicipality,
};
