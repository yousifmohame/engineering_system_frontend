// Frontend/src/api/employeeApi.ts
import apiClient from './axiosConfig';

// 1. تعريف نوع (Type) الموظف
// (هذا التعريف يجب أن يطابق البيانات الراجعة من employeeController.js)
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  nameEn: string | null;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  type: string;
  jobLevel: number | null;
  performanceRating: number | null;
  hireDate: string;
  nationality: string | null;
  _count: {
    specialPermissions: number;
  };
  roles: any[]; // (يمكن تحسين هذا النوع لاحقاً)
}

// 2. وظيفة جلب جميع الموظفين
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const { data } = await apiClient.get('/employees');
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في جلب الموظفين');
  }
};

// 3. وظيفة إنشاء موظف جديد (سنحتاجها في الخطوة التالية)
export const createEmployee = async (employeeData: any) => {
  try {
    const { data } = await apiClient.post('/auth/register', employeeData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في إنشاء الموظف');
  }
};

// (يمكن إضافة وظائف التحديث والحذف هنا لاحقاً)