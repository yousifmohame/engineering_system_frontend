import { api } from './axiosConfig'; // استيراد إعدادات axios
import { SystemSettings, ClientClassification } from '../types/clientTypes'; // استيراد الأنواع

/**
 * جلب إعدادات النظام الرئيسية
 * (معايير التقييم وحدود الدرجات)
 * GET /api/settings/system
 */
export const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const response = await api.get<SystemSettings>('/settings/system');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

/**
 * جلب قائمة تصنيفات العملاء
 * GET /api/classifications/client
 */
export const getClientClassifications = async (): Promise<ClientClassification[]> => {
  try {
    const response = await api.get<ClientClassification[]>('/classifications/client');
    return response.data;
  } catch (error) {
    console.error('Error fetching client classifications:', error);
    throw error;
  }
};

interface RequestPurposeData {
  type: 'brief' | 'detailed';
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

/**
 * جلب جميع أغراض الطلبات (مع فلترة حسب النوع)
 * GET /api/settings/request-purposes
 */
export const getRequestPurposes = async (type: 'brief' | 'detailed') => {
  const { data } = await api.get('/settings/request-purposes', {
    params: { type } // (e.g., /api/settings/request-purposes?type=brief)
  });
  return data;
};

/**
 * إنشاء غرض طلب جديد
 * POST /api/settings/request-purposes
 */
export const createRequestPurpose = async (purposeData: RequestPurposeData) => {
  const { data } = await api.post('/settings/request-purposes', purposeData);
  return data;
};

/**
 * تعديل غرض طلب موجود
 * PUT /api/settings/request-purposes/:id
 */
export const updateRequestPurpose = async (
  id: string,
  updates: Partial<RequestPurposeData> // Partial<> means we can send only the changed fields
) => {
  const { data } = await api.put(`/settings/request-purposes/${id}`, updates);
  return data;
};

/**
 * حذف غرض طلب
 * DELETE /api/settings/request-purposes/:id
 */
export const deleteRequestPurpose = async (id: string) => {
  const { data } = await api.delete(`/settings/request-purposes/${id}`);
  return data; // (عادة ما يكون الرد فارغاً أو { success: true })
};

// يمكنك إضافة دوال لتحديث الإعدادات هنا مستقبلاً
// مثال:
/*
export const updateSystemSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
  try {
    const response = await api.put<SystemSettings>('/settings/system', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};
*/