// src/api/employeeApi.ts

import  api  from './axiosConfig'; // استيراد النسخة المهيأة من axios
// افتراضياً، سنستورد الأنواع من Prisma إذا كانت مشتركة
// إذا لم تكن كذلك، يمكنك تعريفها هنا كما في الواجهة
// import { Employee as PrismaEmployee, Attachment, Task } from '@prisma/client';

// ----- 1. تعريف الأنواع (Interfaces) -----
// هذا النوع يجب أن يطابق `schema.prisma`
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  nameEn?: string | null;
  nationalId: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string; // أو Date
  baseSalary?: number | null;
  type: string;
  status: string;
  nationality?: string | null;
  gosiNumber?: string | null;
  iqamaNumber?: string | null;
  performanceRating?: number | null;
  frozenUntil?: string | null; // أو Date
  frozenReason?: string | null;
  jobLevel?: number | null;
  
  // حقول إضافية نحتاجها
  permissionsCount?: number; // (من الواجهة)
  
  // بيانات مرتبطة (للتوضيح)
  // attachments?: Attachment[];
  // assignedTasks?: Task[];
}

// أنواع للبيانات المرتبطة (سنبنيها في الـ Backend لاحقاً)
export interface EmployeeAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  createdAt: string;
  // ... أي حقول أخرى من نموذج Attachment
}

export interface EmployeeSkill {
  id: string;
  category: string;
  skill: string;
  level: 'مبتدئ' | 'متوسط' | 'خبير';
}

export interface EmployeeCertification {
  id: string;
  name: string;
  authority: string;
  issueDate: string;
  expiryDate?: string | null;
}

export interface EmployeeAttendance {
  id: string;
  date: string;
  status: 'Present' | 'Absent' | 'On Leave';
  checkIn?: string | null;
  checkOut?: string | null;
}

export interface EmployeeLeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface EmployeeEvaluation {
  id: string;
  date: string;
  evaluator: string;
  rating: number;
  comments: string;
}

export interface EmployeePromotion {
  id: string;
  date: string;
  oldPosition: string;
  newPosition: string;
  oldLevel: number;
  newLevel: number;
}

// ----- 2. دوال الـ API -----

/**
 * (تاب 1) جلب جميع الموظفين
 */
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get('/employees'); //
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    // @ts-ignore
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

/**
 * (تاب 2) إنشاء موظف جديد
 */
export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'employeeCode'>): Promise<{ employee: Employee }> => {
  try {
    const response = await api.post('/employees', employeeData); //
    return response.data; 
  } catch (error) {
    console.error('Error creating employee:', error);
    // @ts-ignore
    throw new Error(error.response?.data?.message || 'Failed to create employee');
  }
};

/**
 * (تاب 7) جلب سجل الحضور لموظف
 */
export const fetchEmployeeAttendance = async (employeeId: string): Promise<EmployeeAttendance[]> => {
  // سننشئ هذا المسار لاحقاً في الـ Backend
  const response = await api.get(`/employees/${employeeId}/attendance`);
  return response.data;
};

/**
 * (تاب 7) جلب طلبات الإجازة لموظف
 */
export const fetchEmployeeLeaveRequests = async (employeeId: string): Promise<EmployeeLeaveRequest[]> => {
  // سننشئ هذا المسار لاحقاً في الـ Backend
  const response = await api.get(`/employees/${employeeId}/leave-requests`);
  return response.data;
};

/**
 * (تاب 8) جلب مهارات الموظف
 */
export const fetchEmployeeSkills = async (employeeId: string): Promise<EmployeeSkill[]> => {
  const response = await api.get(`/employees/${employeeId}/skills`);
  return response.data;
};

/**
 * (تاب 8) جلب شهادات الموظف
 */
export const fetchEmployeeCertifications = async (employeeId: string): Promise<EmployeeCertification[]> => {
  const response = await api.get(`/employees/${employeeId}/certifications`);
  return response.data;
};

/**
 * (تاب 9) جلب تقييمات الموظف
 */
export const fetchEmployeeEvaluations = async (employeeId: string): Promise<EmployeeEvaluation[]> => {
  const response = await api.get(`/employees/${employeeId}/evaluations`);
  return response.data;
};

/**
 * (تاب 10) جلب سجل ترقيات الموظف
 */
export const fetchEmployeePromotions = async (employeeId: string): Promise<EmployeePromotion[]> => {
  const response = await api.get(`/employees/${employeeId}/promotions`);
  return response.data;
};

/**
 * (تاب 11) جلب مرفقات الموظف
 */
export const fetchEmployeeAttachments = async (employeeId: string): Promise<EmployeeAttachment[]> => {
  // هذا المسار مقترح بناءً على نموذج Attachment الموجود
  const response = await api.get(`/employees/${employeeId}/attachments`); 
  return response.data;
};

/**
 * (نافذة الصلاحيات) جلب صلاحيات موظف
 */
export const fetchEmployeePermissions = async (employeeId: string): Promise<any[]> => {
  // سننشئ هذا المسار لاحقاً
  const response = await api.get(`/employees/${employeeId}/permissions`);
  return response.data;
};

/**
 * (النوافذ المنبثقة) تحديث حالة الموظف (تجميد، إنهاء خدمة، إلخ)
 */
export const updateEmployeeStatus = async (
  employeeId: string, 
  statusData: { status: string; frozenUntil?: string | null; frozenReason?: string | null }
): Promise<Employee> => {
  // سننشئ هذا المسار لاحقاً
  const response = await api.patch(`/employees/${employeeId}/status`, statusData);
  return response.data;
};

/**
 * (النوافذ المنبثقة) ترقية/تخفيض درجة الموظف
 */
export const updateEmployeePromotion = async (
  employeeId: string, 
  promotionData: { newLevel: number; newPosition: string; notes: string }
): Promise<Employee> => {
  // سننشئ هذا المسار لاحقاً
  const response = await api.post(`/employees/${employeeId}/promotion`, promotionData);
  return response.data;
};
/**
 * (تاب 11) رفع مرفق جديد
 */
export const uploadEmployeeAttachment = async (
  file: File, 
  employeeId: string, 
  // (يمكن إضافة transactionId, clientId إذا احتجت)
): Promise<EmployeeAttachment> => {
  
  // نستخدم FormData لإرسال الملفات
  const formData = new FormData();
  formData.append('file', file); // (يجب أن يطابق "upload.single('file')")
  formData.append('employeeId', employeeId); // (لربط المرفق بالموظف)

  try {
    const response = await api.post('/attachments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    // @ts-ignore
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};
// ... أضف أي دوال أخرى هنا (مثل التعديل، الحذف)