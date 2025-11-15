// src/api/classificationApi.ts
import api from './axiosConfig';

export interface Classification {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdById: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

// جلب كل التصنيفات
export const getClassifications = async () => {
  const { data } = await api.get<Classification[]>('/document-classifications');
  return data;
};

// إنشاء تصنيف
export const createClassification = async (data: { name: string; color: string; description?: string }) => {
  const { data: responseData } = await api.post('/document-classifications', data);
  return responseData;
};

// تحديث تصنيف
export const updateClassification = async (id: string, data: { name: string; color: string; description?: string }) => {
  const { data: responseData } = await api.put(`/document-classifications/${id}`, data);
  return responseData;
};

// حذف تصنيف
export const deleteClassification = async (id: string) => {
  const { data } = await api.delete(`/document-classifications/${id}`);
  return data;
};