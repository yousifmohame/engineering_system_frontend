import {api} from './axiosConfig';
import { 
  Client, 
  ClientName, 
  ClientContact, 
  ClientAddress, 
  ClientIdentification,
  ClientPayload // استيراد الأنواع من الملف المركزي
} from '../types/clientTypes'; // نفترض أنك قمت بنقل الواجهات إلى src/types/clientTypes.ts


type SelectOption = {
  value: string;
  label: string;
};

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

export const getClientById = async (clientId: string) => {
  try {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
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
const sanitizeValue = (value: any) => {
  if (value && typeof value === 'object') {
    // إذا كان الكائن يحتوي على خصائص تشير إلى أنه حدث (Event) أو عقدة DOM
    if (value instanceof HTMLElement || value.nativeEvent || value._reactName) {
      return undefined; // تجاهل هذا الحقل
    }
  }
  return value;
};

export const updateClient = async (clientId: string, clientData: any): Promise<Client> => {
  
  // بناء Payload نظيف
  const payload: Partial<ClientPayload> = {};

  // 1. الحقول المباشرة (Top Level)
  if (clientData.type) payload.type = sanitizeValue(clientData.type);
  if (clientData.category) payload.category = sanitizeValue(clientData.category);
  if (clientData.nationality) payload.nationality = sanitizeValue(clientData.nationality);
  if (clientData.occupation) payload.occupation = sanitizeValue(clientData.occupation);
  if (clientData.company) payload.company = sanitizeValue(clientData.company);
  if (clientData.taxNumber) payload.taxNumber = sanitizeValue(clientData.taxNumber);
  
  // القيم الرقمية والمنطقية نقبلها كما هي (مع التحقق من undefined)
  if (clientData.rating !== undefined) payload.rating = clientData.rating;
  if (clientData.secretRating !== undefined) payload.secretRating = clientData.secretRating;
  if (clientData.notes !== undefined) payload.notes = sanitizeValue(clientData.notes);
  if (clientData.isActive !== undefined) payload.isActive = clientData.isActive;

  // 2. الكائنات المتداخلة - نأخذ نسخة نظيفة منها
  if (clientData.name) {
    payload.name = {
      firstName: sanitizeValue(clientData.name.firstName),
      fatherName: sanitizeValue(clientData.name.fatherName),
      grandFatherName: sanitizeValue(clientData.name.grandFatherName),
      familyName: sanitizeValue(clientData.name.familyName),
    };
  }

  if (clientData.address) {
    payload.address = { ...clientData.address }; // نسخ بسيط
  }

  // 3. التعامل مع contact
  if (clientData.contact) {
    // التأكد من أن القيم ليست كائنات
    const mobile = sanitizeValue(clientData.contact.mobile);
    const email = sanitizeValue(clientData.contact.email);
    
    if (mobile) payload.mobile = mobile;
    if (email) payload.email = email;

    payload.contact = {
      mobile: mobile,
      email: email,
      phone: sanitizeValue(clientData.contact.phone),
      fax: sanitizeValue(clientData.contact.fax),
      whatsapp: sanitizeValue(clientData.contact.whatsapp),
      telegram: sanitizeValue(clientData.contact.telegram),
    };
  }

  // 4. التعامل مع identification
  if (clientData.identification) {
    const idNumber = sanitizeValue(clientData.identification.idNumber);
    if (idNumber) payload.idNumber = idNumber;

    payload.identification = {
      idType: sanitizeValue(clientData.identification.idType),
      idNumber: idNumber,
      issueDate: sanitizeValue(clientData.identification.issueDate),
      expiryDate: sanitizeValue(clientData.identification.expiryDate),
      issuePlace: sanitizeValue(clientData.identification.issuePlace),
    };
  }

  try {
    const { data } = await api.put(`/clients/${clientId}`, payload);
    return data;
  } catch (error: any) {
    console.error('Error updating client:', error);
    // استخراج رسالة الخطأ من الباك إند بشكل صحيح
    const message = error.response?.data?.message || 'فشل في تحديث العميل';
    const details = error.response?.data?.error || '';
    throw new Error(`${message} ${details}`);
  }
};

export const getSimpleClients = async (): Promise<SelectOption[]> => {
  try {
    // هذا هو المسار الجديد الذي أضفناه في الـ backend
    const { data } = await api.get('/clients/simple');
    return data; // (الـ backend يعيدها جاهزة كـ [{ value: '..', label: '..' }])
  } catch (error: any) {
    console.error('Error fetching simple clients list:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب قائمة العملاء');
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