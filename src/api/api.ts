import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backendbase.site',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
});
