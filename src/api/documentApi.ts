// src/api/documentApi.ts
import api from './axiosConfig'; // استيراد النسخة المهيأة من axios
import { FileItem, FileActivity } from '../types/documentTypes'; // (ملف الواجهات - أنشئه إذا أردت)

// (ملاحظة: يمكنك إنشاء ملف src/types/documentTypes.ts لوضع هذه الواجهات فيه)
// export interface FileItem { ... } 
// export interface FileActivity { ... }

// جلب الإحصائيات
export const getDocumentStats = async () => {
  const { data } = await api.get('/documents/stats');
  return data;
};

// جلب الملفات والمجلدات
export const getDocuments = async (params: { search?: string; parentId?: 'file' | 'folder' }) => {
  const { data } = await api.get<FileItem[]>('/documents', { params });
  return data;
};

// جلب الأنشطة
export const getDocumentActivities = async () => {
  const { data } = await api.get<FileActivity[]>('/documents/activities');
  return data;
};

// رفع ملف جديد
export const uploadDocument = async (formData: FormData) => {
  const { data } = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// --- ✅ أضف هذه الدالة الجديدة ---
// إنشاء مجلد جديد
export const createFolder = async (data: { name: string; parentId: string; classification: string; path: string; }) => {
  const { data: responseData } = await api.post('/documents/folder', data);
  return responseData;
};

// تنزيل ملف
export const downloadDocument = async (id: string, fileName: string) => {
  const { data } = await api.get(`/documents/${id}/download`, {
    responseType: 'blob', // مهم جداً للتنزيلات
  });
  
  // إنشاء رابط مؤقت في المتصفح لتنزيل الملف
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // تحديد اسم الملف عند التنزيل
  document.body.appendChild(link);
  link.click();
  
  // تنظيف الرابط بعد التنزيل
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// حذف ملف
export const deleteDocument = async (id: string) => {
  const { data } = await api.delete(`/documents/${id}`);
  return data;
};