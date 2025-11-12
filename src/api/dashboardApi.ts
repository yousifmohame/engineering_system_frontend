import {api} from './axiosConfig';

// واجهة إحصائيات لوحة الأدوار (تاب 903-01)
export interface RoleDashboardStats {
  totalRoles: number;
  totalEmployees: number;
  totalPermissions: number;
  totalLevels: number;
  distribution: Array<{ name: string; value: number }>;
}

// (تاب 903-01) جلب إحصائيات لوحة الأدوار
export const fetchRoleDashboardStats = async (): Promise<RoleDashboardStats> => {
  const { data } = await api.get('/dashboard/roles-stats');
  return data;
};