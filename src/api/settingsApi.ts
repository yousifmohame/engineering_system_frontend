import { api } from './axiosConfig'; // استيراد إعدادات axios
import { SystemSettings, ClientClassification } from '../types/clientTypes'; // استيراد الأنواع

export interface DynamicFormDefinition {
  id: string;
  name: string;
  purposeId: string;
  fields: DynamicFormField[];
}

export interface DynamicFormField {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: string; // 'text', 'number', 'select', 'textarea'
  order: number;
  optionsJson?: any;
  validationJson?: any;
  placeholder?: string;
  formId: string;
}

export type FieldFormData = Omit<DynamicFormField, 'id' | 'formId'>;

export interface RequestPurpose {
  id: string;
  type: 'brief' | 'detailed';
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  dynamicForm?: DynamicFormDefinition;
}

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

export const getRequestPurposes = async (type?: 'brief' | 'detailed'): Promise<RequestPurpose[]> => {
  const params = type ? { type } : {};
  const { data } = await api.get('/settings/request-purposes', { params });
  return data;
};

export const createRequestPurpose = async (purposeData: Omit<RequestPurpose, 'id'>) => {
  const { data } = await api.post('/settings/request-purposes', purposeData);
  return data;
};

export const updateRequestPurpose = async (id: string, purposeData: Partial<RequestPurpose>) => {
  const { data } = await api.put(`/settings/request-purposes/${id}`, purposeData);
  return data;
};

export const deleteRequestPurpose = async (id: string) => {
  await api.delete(`/settings/request-purposes/${id}`);
};

// --- 2. دوال "منشئ النماذج" (للمدير - شاشة 701) ---

export const getFormDefinition = async (purposeId: string): Promise<DynamicFormDefinition> => {
  const { data } = await api.get(`/settings/purposes/${purposeId}/form`);
  return data;
};

export const createFormField = async (formId: string, fieldData: FieldFormData): Promise<DynamicFormField> => {
  const { data } = await api.post(`/settings/forms/${formId}/fields`, fieldData);
  return data;
};

export const updateFormField = async (fieldId: string, fieldData: Partial<FieldFormData>): Promise<DynamicFormField> => {
  const { data } = await api.put(`/settings/fields/${fieldId}`, fieldData);
  return data;
};

export const deleteFormField = async (fieldId: string) => {
  await api.delete(`/settings/fields/${fieldId}`);
};

// --- 3. دوال "عارض النماذج" (للمستخدم - شاشات 284/286) ---

export const getFormForRender = async (purposeId: string): Promise<DynamicFormField[]> => {
  const { data } = await api.get(`/settings/forms/${purposeId}/render`);
  return data;
};