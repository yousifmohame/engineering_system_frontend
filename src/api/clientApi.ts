import {api} from './axiosConfig';
import { 
  Client, 
  ClientName, 
  ClientContact, 
  ClientAddress, 
  ClientIdentification,
  ClientPayload // استيراد الأنواع من الملف المركزي
} from '../types/clientTypes'; // نفترض أنك قمت بنقل الواجهات إلى src/types/clientTypes.ts

/**
 * ============================================================================
 * 1. جلب جميع العملاء
 * GET /api/clients
 * ============================================================================
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data } = await api.get('/clients');
    // الـ Backend (v3) يعيد البيانات جاهزة ومتوافقة مع الواجهات
    return data;
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب العملاء');
  }
};

/**
 * ============================================================================
 * 2. إنشاء عميل جديد
 * POST /api/clients
 * ============================================================================
 */
export const createClient = async (clientData: any): Promise<Client> => {
  
  // 1. تحويل البيانات من النموذج (الواجهة) إلى الـ Payload (الـ Backend)
  const payload: ClientPayload = {
    // ❌❌❌ تم حذف 'clientCode' من هنا ❌❌❌
    // clientCode: clientData.clientCode,
    
    // الحقول الفريدة (Top-level)
    mobile: clientData.contact.mobile,
    email: clientData.contact.email,
    idNumber: clientData.identification.idNumber,

    // ... (باقي الحقول: name, address, contact, identification, type, إلخ) ...
    name: clientData.name,
    address: clientData.address,
    contact: {
      phone: clientData.contact.phone,
      fax: clientData.contact.fax,
      whatsapp: clientData.contact.whatsapp,
      telegram: clientData.contact.telegram,
    },
    identification: {
      idType: clientData.identification.idType,
      issueDate: clientData.identification.issueDate,
      expiryDate: clientData.identification.expiryDate,
      issuePlace: clientData.identification.issuePlace,
    },
    type: clientData.type,
    category: clientData.category,
    nationality: clientData.nationality,
    occupation: clientData.occupation,
    company: clientData.company,
    taxNumber: clientData.taxNumber,
    rating: clientData.rating,
    secretRating: clientData.secretRating,
    notes: clientData.notes,
    isActive: clientData.isActive,
  };
  
  try {
    // 2. إرسال الـ payload المعالج
    const { data } = await api.post('/clients', payload);
    return data;
  } catch (error: any) {
    console.error('Error creating client:', error);
    // ✅ تحسين رسالة الخطأ لتشمل ما يرسله السيرفر
    const serverError = error.response?.data?.error || error.response?.data?.message;
    throw new Error(serverError || 'فشل في إنشاء العميل');
  }
};


/**
 * ============================================================================
 * 3. تحديث عميل موجود
 * PUT /api/clients/:id
 * ============================================================================
 */
export const updateClient = async (clientId: string, clientData: any): Promise<Client> => {
  
  // 1. تحويل البيانات للـ Payload بنفس منطق الإنشاء
  const payload: Partial<ClientPayload> = {
    mobile: clientData.contact.mobile,
    email: clientData.contact.email,
    idNumber: clientData.identification.idNumber,

    name: clientData.name,
    address: clientData.address,
    
    contact: {
      phone: clientData.contact.phone,
      fax: clientData.contact.fax,
      whatsapp: clientData.contact.whatsapp,
      telegram: clientData.contact.telegram,
    },
    identification: {
      idType: clientData.identification.idType,
      issueDate: clientData.identification.issueDate,
      expiryDate: clientData.identification.expiryDate,
      issuePlace: clientData.identification.issuePlace,
    },
    
    type: clientData.type,
    category: clientData.category,
    nationality: clientData.nationality,
    occupation: clientData.occupation,
    company: clientData.company,
    taxNumber: clientData.taxNumber,
    rating: clientData.rating,
    secretRating: clientData.secretRating,
    notes: clientData.notes,
    isActive: clientData.isActive,
  };

  try {
    // 2. إرسال الطلب إلى المسار الصحيح
    const { data } = await api.put(`/clients/${clientId}`, payload);
    return data;
  } catch (error: any) {
    console.error('Error updating client:', error);
    throw new Error(error.response?.data?.message || 'فشل في تحديث العميل');
  }
};

/**
 * ============================================================================
 * 4. حذف عميل
 * DELETE /api/clients/:id
 * ============================================================================
 */
export const deleteClient = async (clientId: string): Promise<any> => {
  try {
    const { data } = await api.delete(`/clients/${clientId}`);
    return data; // عادة ما يُرجع رسالة نجاح
  } catch (error: any) {
    console.error('Error deleting client:', error);
    throw new Error(error.response?.data?.message || 'فشل في حذف العميل');
  }
};