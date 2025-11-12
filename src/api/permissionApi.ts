import {api} from './axiosConfig';

// واجهة الصلاحية الفردية (تاب 903-06 و 903-16)
export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string; // (هذا الحقل غير موجود في الباك اند، لكن الواجهة تتوقعه)
  isActive: boolean; // (هذا الحقل غير موجود في الباك اند)
}

// واجهة مجموعة الصلاحيات (تاب 903-03 و 903-16)
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissionsCount: number; // (يأتي من _count)
}

// (تاب 903-03 / 16) جلب مجموعات الصلاحيات
export const fetchPermissionGroups = async (): Promise<PermissionGroup[]> => {
  const { data } = await api.get('/permission-groups'); 
  return data;
};

// (تاب 903-06 / 16) جلب الصلاحيات الفردية
export const fetchIndividualPermissions = async (): Promise<Permission[]> => {
  // (المسار /api/permissions/individual تم ربطه بـ getIndividualPermissions)
  const { data } = await api.get('/permissions/individual'); 
  // (تنسيق البيانات لإضافة الحقول الوهمية التي تتوقعها الواجهة)
  return data.map((p: any) => ({
    ...p,
    category: p.category || p.actionType || 'عام', // (محاولة ملء الفئة)
    isActive: p.status === 'active'
  }));
};

// (تاب 903-16) إنشاء صلاحية جديدة
export const createPermission = async (permData: {
  code: string;
  name: string;
  description: string;
  category: string;
  level: string;
}): Promise<Permission> => {
  // (مطابقة بيانات الباك اند)
  const payload = {
    code: permData.code,
    name: permData.name,
    description: permData.description,
    level: permData.level,
    actionType: permData.category // (استخدام الفئة كـ actionType)
  };
  const { data } = await api.post('/permissions', payload);
  return data;
};

// (تاب 903-16) إنشاء مجموعة صلاحيات جديدة
export const createPermissionGroup = async (groupData: {
  code: string;
  name: string;
  description: string;
  permissionIds: string[]; 
}): Promise<PermissionGroup> => {
  const { data } = await api.post('/permission-groups', groupData);
  return data;
};