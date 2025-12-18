import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'https://api.dev.financiados.app/api/app';
export const ASSETS_BASE_URL = 'https://api.dev.financiados.avauapps.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config._isRetry) {
      error.config._isRetry = true;
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('user');
      router.replace('./');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;