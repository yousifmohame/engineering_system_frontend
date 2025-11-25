// src/api/riyadhStreetsApi.ts
import { api } from './axiosConfig';
import { 
  RiyadhStreet, 
  RiyadhSector, 
  RiyadhDistrict, 
  CreateStreetPayload, 
  StreetStatistics 
} from '../types/riyadhStreetsTypes';

const BASE_URL = '/riyadh-streets'; // مطابق لما في server.js

// جلب الشوارع مع الفلاتر
export const getAllStreets = async (filters?: { 
  sectorId?: string; 
  type?: string; 
  status?: string; 
  search?: string 
}): Promise<RiyadhStreet[]> => {
  try {
    const { data } = await api.get(BASE_URL, { params: filters });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في جلب بيانات الشوارع');
  }
};

// إنشاء شارع جديد
export const createStreet = async (payload: CreateStreetPayload): Promise<RiyadhStreet> => {
  try {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في إضافة الشارع');
  }
};

// جلب القوائم المساعدة (قطاعات وأحياء)
export const getLookups = async (): Promise<{ sectors: RiyadhSector[]; districts: RiyadhDistrict[] }> => {
  try {
    const { data } = await api.get(`${BASE_URL}/lookups`);
    return data;
  } catch (error: any) {
    throw new Error('فشل في جلب القوائم');
  }
};

// جلب الإحصائيات
export const getStatistics = async (): Promise<StreetStatistics> => {
  try {
    const { data } = await api.get(`${BASE_URL}/stats`);
    return data;
  } catch (error: any) {
    throw new Error('فشل في جلب الإحصائيات');
  }
};