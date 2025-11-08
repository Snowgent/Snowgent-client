import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://backendbase.site',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
});
