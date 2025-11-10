// Frontend/src/api/clientApi.ts
import apiClient from './axiosConfig';

// 1. تعريف الواجهات (Interfaces) كما هي في شاشة v19
export interface ClientName {
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  familyName: string;
}

export interface ClientContact {
  mobile: string;
  phone?: string;
  email: string;
  fax?: string;
  whatsapp?: string;
  telegram?: string;
}

export interface ClientAddress {
  country: string;
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  additionalNumber?: string;
  unitNumber?: string;
  fullAddress: string;
}

export interface ClientIdentification {
  idType: 'هوية وطنية' | 'إقامة' | 'جواز سفر' | 'سجل تجاري';
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  issuePlace: string;
}

// واجهة العميل الكاملة (التي سنستخدمها في الواجهة)
export interface Client {
  id: string;
  clientCode: string;
  type: 'فرد' | 'شركة' | 'جهة حكومية';
  
  // الحقول الفريدة (مضافة هنا لسهولة الاستخدام)
  mobile: string;
  email: string | null;
  idNumber: string;

  // الكائنات (Json)
  name: ClientName;
  contact: Omit<ClientContact, 'mobile' | 'email'>; // (الباقي)
  address: ClientAddress | null;
  identification: Omit<ClientIdentification, 'idNumber'>; // (الباقي)
  
  category?: string;
  nationality?: string;
  occupation?: string;
  company?: string;
  taxNumber?: string;
  rating?: number;
  secretRating?: number;
  grade?: 'أ' | 'ب' | 'ج';
  gradeScore?: number;
  completionPercentage?: number;
  isActive: boolean;
  notes?: string;
  _count: {
    transactions: number;
    contracts: number;
    quotations: number;
  };
}

// واجهة البيانات التي يتوقعها الـ Backend (مع حقول Json)
interface ClientPayload {
  clientCode: string;
  mobile: string; // (Top-level)
  email: string; // (Top-level)
  idNumber: string; // (Top-level)
  name: ClientName; // (Json)
  contact: Omit<ClientContact, 'mobile' | 'email'>; // (Json)
  address: ClientAddress; // (Json)
  identification: Omit<ClientIdentification, 'idNumber'>; // (Json)
  type: string;
  category?: string;
  nationality?: string;
  occupation?: string;
  company?: string;
}


// 2. وظيفة جلب جميع العملاء
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data } = await apiClient.get('/clients');
    // Prisma تعيد الـ Json ككائنات، جاهزة للاستخدام
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في جلب العملاء');
  }
};

// 3. وظيفة إنشاء عميل جديد (مع معالجة البنية المعقدة)
export const createClient = async (clientData: any): Promise<Client> => {
  
  // 3.1. فصل البيانات لتطابق الـ Backend (v3-Json Schema)
  const payload: ClientPayload = {
    clientCode: clientData.clientCode,
    type: clientData.type,
    
    // الحقول الفريدة (Top-level)
    mobile: clientData.contact.mobile,
    email: clientData.contact.email,
    idNumber: clientData.identification.idNumber,

    // الكائنات (Json)
    name: clientData.name,
    address: clientData.address,
    
    // كائنات (Json) بعد إزالة الحقول المكررة
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

    // بيانات إضافية
    category: clientData.category,
    nationality: clientData.nationality,
    occupation: clientData.occupation,
    company: clientData.company,
  };
  
  try {
    // 3.2. إرسال الـ payload المعالج
    const { data } = await apiClient.post('/clients', payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في إنشاء العميل');
  }
};