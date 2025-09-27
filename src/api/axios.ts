import axios from 'axios';

const SERVER = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
} as any);

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
