import api from './axiosConfig';
import { Appointment, CreateAppointmentData } from '../types/appointmentTypes';

// جلب جميع المواعيد لمعاملة معينة
export const getAppointmentsByTransaction = async (transactionId: string): Promise<Appointment[]> => {
  try {
    // (تأكد من وجود هذا المسار في الـ backend، أو استخدم مساراً بديلاً)
    const { data } = await api.get(`/appointments/transaction/${transactionId}`);
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// إنشاء موعد جديد
export const createAppointment = async (data: CreateAppointmentData): Promise<Appointment> => {
  try {
    const { data: newAppointment } = await api.post('/appointments', data);
    return newAppointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// تحديث موعد
export const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  try {
    const { data: updated } = await api.put(`/appointments/${id}`, data);
    return updated;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// حذف موعد
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await api.delete(`/appointments/${id}`);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};