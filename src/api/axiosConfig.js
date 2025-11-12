// Frontend/src/api/axiosConfig.js
import axios from 'axios';

// إنشاء نسخة (instance) من axios
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: 'https://bravocode.shop/api', 
});

// *** أهم جزء ***
// هذا هو "المعترض" (Interceptor) الذي يضيف التوكن لكل طلب
api.interceptors.request.use(
  (config) => {
    // جلب التوكن من الـ localStorage (حيث سنقوم بتخزينه)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `${token}`; // إضافة التوكن للـ Header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

