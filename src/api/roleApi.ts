import api from './axiosConfig';
import { Permission } from './permissionApi'; // (استيراد الواجهة من الملف التالي)
import { Employee } from './employeeApi';   // (استيراد الواجهة من الملف السابق)

// واجهة الدور الأساسية
export interface JobRole {
  id: string;
  code: string;
  name: string; // (nameAr في الباك اند)
  nameEn: string;
  department: string;
  level: number;
  status: 'active' | 'inactive' | 'archived';
  description: string;
  responsibilities: string[];
  // هذه الحقول تأتي من _count
  employeesCount: number;
  permissions: number; 
}

// واجهة تفاصيل الدور (عند جلب دور واحد)
export interface RoleDetails extends JobRole {
  permissions: Permission[]; // قائمة الصلاحيات الفعلية
  employees: Employee[];   // قائمة الموظفين
  childRoles: JobRole[];
  parentRole: JobRole | null;
}

// واجهة سجل التغييرات (تاب 903-10)
export interface RoleChange {
  id: string;
  employeeName: string;
  oldRole: string;
  newRole: string;
  changeDate: string;
  changedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

// واجهة قوائم الإسناد (تاب 903-12)
export interface AssignmentList {
  id: string;
  name: string;
  description: string;
  rolesCount: number;
  employeesCount: number;
  createdDate: string;
  isActive: boolean;
}

// واجهة الإشعارات (تاب 903-13)
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
  relatedRole: string;
}

// (تاب 903-02) جلب جميع الأدوار
export const fetchRoles = async (): Promise<JobRole[]> => {
  const { data } = await api.get('/roles');
  // (تنسيق البيانات لتطابق الواجهة)
  return data.map((role: any) => ({
    ...role,
    name: role.nameAr, // (مطابقة اسم الواجهة)
    employeesCount: role._count?.employees || 0,
    permissions: role._count?.permissions || 0,
  }));
};

// (تاب 903-06 إلى 14) جلب تفاصيل دور واحد
export const fetchRoleById = async (id: string): Promise<RoleDetails> => {
  const { data } = await api.get(`/roles/${id}`);
  return {
    ...data,
    name: data.nameAr // (مطابقة اسم الواجهة)
  };
};

// (تاب 903-03) إنشاء دور جديد
export const createRole = async (roleData: any): Promise<JobRole> => {
  const { name, ...rest } = roleData;
  // (إعادة تسمية name إلى nameAr لتطابق الباك اند)
  const payload = { ...rest, nameAr: name };
  const { data } = await api.post('/roles', payload);
  return data;
};

// (تاب 903-06) تحديث صلاحيات الدور
export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<Permission[]> => {
  const { data } = await api.put(`/roles/${roleId}/permissions`, { permissionIds });
  return data;
};

// (تاب 903-04) تعيين موظف لدور
export const assignEmployeeToRole = async (assignmentData: { employeeId: string, roleId: string }): Promise<any> => {
  const { data } = await api.post('/roles/assign-employee', assignmentData);
  return data;
};

// (تاب 903-05) نقل موظف
export const transferEmployeeRole = async (transferData: any): Promise<any> => {
  // (نفترض أن هذا المسار موجود)
  const { data } = await api.post('/roles/transfer-employee', transferData);
  return data;
};

// (تاب 903-10) جلب سجل التغييرات
export const fetchRoleChanges = async (): Promise<RoleChange[]> => {
  const { data } = await api.get('/roles/changes'); 
  return data;
};

// (تاب 903-12) جلب قوائم الإسناد
export const fetchAssignmentLists = async (): Promise<AssignmentList[]> => {
  const { data } = await api.get('/roles/assignment-lists'); 
  return data;
};

// (تاب 903-13) جلب الإشعارات
export const fetchRoleNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/roles/notifications'); 
  return data;
};