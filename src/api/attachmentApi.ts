/**
 * هذا الملف يحتوي على دوال API الخاصة بالمرفقات
 */

import api from './axiosConfig'; // (افترض أن لديك هذا الملف)
import { Attachment } from '../types/attachmentTypes';

/**
 * جلب جميع المرفقات لمعاملة معينة
 * يتصل بـ: GET /api/attachments/:transactionId
 */
export const getAttachments = async (transactionId: string): Promise<Attachment[]> => {
  try {
    // ✅ تصحيح المسار بإضافة '/transaction/'
    const { data } = await api.get(`/attachments/transaction/${transactionId}`);
    return data;
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return [];
  }
};

/**
 * رفع مرفق جديد
 * يتصل بـ: POST /api/attachments
 */
export const uploadAttachment = async (
  file: File, 
  transactionId: string
): Promise<Attachment> => {
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('transactionId', transactionId);
  // (يمكنك إضافة حقول أخرى مثل 'category' إذا تطلب الأمر)
  // formData.append('category', 'مستندات'); 

  try {
    const { data } = await api.post('/attachments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * حذف مرفق
 * يتصل بـ: DELETE /api/attachments/:id
 */
export const deleteAttachment = async (attachmentId: string): Promise<void> => {
  try {
    // ✅ هذا المسار صحيح
    await api.delete(`/attachments/${attachmentId}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};