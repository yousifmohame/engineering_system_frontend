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