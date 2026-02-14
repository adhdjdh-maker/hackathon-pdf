import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://168.222.254.34:8000/',
});

// Этот перехватчик будет вешать токен на каждый запрос автоматически
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
