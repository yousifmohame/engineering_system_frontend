import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  ChevronRight, ChevronDown, Shield, Plus, Edit, Trash,
  Users, Settings, Database, Lock, Key, Crown, Eye,
  Save, X, AlertCircle, CheckCircle, Info
} from 'lucide-react';

// واجهات البيانات
export interface Permission {
  id: string;
  name: string;
  code: string;
  level: 'basic' | 'advanced' | 'administrative' | 'critical';
  description: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  children: Permission[];
  isExpanded?: boolean;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  level: 'basic' | 'advanced' | 'administrative' | 'critical';
  description: string;
  permissions: string[];
  usersCount: number;
  color: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Hook لإدارة الصلاحيات
export const usePermissionsManager = (
  initialCategories: PermissionCategory[],
  initialRoles: Role[]
) => {
  const [categories, setCategories] = useState<PermissionCategory[]>(initialCategories);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // توسيع وطي الفئات
  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // إضافة صلاحية جديدة
  const addPermission = useCallback((categoryId: string, permission: Permission) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, children: [...category.children, permission] }
        : category
    ));
  }, []);

  // تحديث صلاحية
  const updatePermission = useCallback((categoryId: string, permissionId: string, updates: Partial<Permission>) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            children: category.children.map(permission =>
              permission.id === permissionId 
                ? { ...permission, ...updates, updatedAt: new Date().toISOString() }
                : permission
            )
          }
        : category
    ));
  }, []);

  // حذف صلاحية
  const deletePermission = useCallback((categoryId: string, permissionId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, children: category.children.filter(p => p.id !== permissionId) }
        : category
    ));

    // إزالة الصلاحية من جميع الأدوار
    setRoles(prev => prev.map(role => ({
      ...role,
      permissions: role.permissions.filter(p => p !== permissionId)
    })));
  }, []);

  // إضافة دور جديد
  const addRole = useCallback((role: Role) => {
    setRoles(prev => [...prev, role]);
  }, []);

  // تحديث دور
  const updateRole = useCallback((roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, ...updates, updatedAt: new Date().toISOString() }
        : role
    ));
  }, []);

  // حذف دور
  const deleteRole = useCallback((roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
  }, []);

  // إسناد صلاحية لدور
  const assignPermissionToRole = useCallback((roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId && !role.permissions.includes(permissionId)
        ? { ...role, permissions: [...role.permissions, permissionId] }
        : role
    ));
  }, []);

  // إلغاء إسناد صلاحية من دور
  const unassignPermissionFromRole = useCallback((roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: role.permissions.filter(p => p !== permissionId) }
        : role
    ));
  }, []);

  // تصفية الصلاحيات
  const filterPermissions = useCallback((permissions: Permission[]) => {
    return permissions.filter(permission => {
      const matchesSearch = permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           permission.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = filterLevel === 'all' || permission.level === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, filterLevel]);

  // الحصول على جميع الصلاحيات
  const getAllPermissions = useCallback(() => {
    return categories.flatMap(category => category.children);
  }, [categories]);

  // الحصول على صلاحيات دور معين
  const getRolePermissions = useCallback((roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return [];
    
    const allPermissions = getAllPermissions();
    return allPermissions.filter(permission => role.permissions.includes(permission.id));
  }, [roles, getAllPermissions]);

  return {
    categories,
    setCategories,
    roles,
    setRoles,
    selectedPermission,
    setSelectedPermission,
    selectedRole,
    setSelectedRole,
    expandedCategories,
    setExpandedCategories,
    searchQuery,
    setSearchQuery,
    filterLevel,
    setFilterLevel,
    toggleCategoryExpansion,
    addPermission,
    updatePermission,
    deletePermission,
    addRole,
    updateRole,
    deleteRole,
    assignPermissionToRole,
    unassignPermissionFromRole,
    filterPermissions,
    getAllPermissions,
    getRolePermissions
  };
};

// مكون عرض الشجرة
interface PermissionsTreeProps {
  categories: PermissionCategory[];
  expandedCategories: string[];
  onToggleExpansion: (categoryId: string) => void;
  onSelectPermission: (permission: Permission) => void;
  selectedPermission: Permission | null;
  searchQuery: string;
  filterLevel: string;
  filterPermissions: (permissions: Permission[]) => Permission[];
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (categoryId: string, permissionId: string) => void;
}

export const PermissionsTree: React.FC<PermissionsTreeProps> = ({
  categories,
  expandedCategories,
  onToggleExpansion,
  onSelectPermission,
  selectedPermission,
  searchQuery,
  filterLevel,
  filterPermissions,
  onEditPermission,
  onDeletePermission
}) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg">
          {/* رأس الفئة */}
          <div
            className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors rounded-t-lg"
            onClick={() => onToggleExpansion(category.id)}
          >
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedCategories.includes(category.id) ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
            {category.icon}
            <span className="font-medium flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {category.name}
            </span>
            <Badge variant="outline" className="text-xs">
              {category.children.length} صلاحية
            </Badge>
          </div>

          {/* الصلاحيات */}
          {expandedCategories.includes(category.id) && (
            <div className="p-3 space-y-2 bg-white rounded-b-lg">
              {filterPermissions(category.children).length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد صلاحيات تطابق البحث
                  </p>
                </div>
              ) : (
                filterPermissions(category.children).map((permission) => (
                  <div
                    key={permission.id}
                    className={`
                      flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors
                      ${selectedPermission?.id === permission.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-100 bg-white hover:bg-gray-50'
                      }
                    `}
                    onClick={() => onSelectPermission(permission)}
                  >
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {permission.name}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            permission.level === 'critical' ? 'border-red-200 text-red-700 bg-red-50' :
                            permission.level === 'administrative' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                            permission.level === 'advanced' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            'border-green-200 text-green-700 bg-green-50'
                          }`}
                        >
                          {permission.level}
                        </Badge>
                        {!permission.isActive && (
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                            غير نشط
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        {permission.code}
                      </div>
                      <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {permission.description}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPermission(permission);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('هل أنت متأكد من حذف هذه الصلاحية؟')) {
                            onDeletePermission(category.id, permission.id);
                          }
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              
              {/* زر إضافة صلاحية جديدة */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 border border-dashed border-gray-300 hover:border-gray-400"
              >
                <Plus className="h-4 w-4" />
                إضافة صلاحية جديدة
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// مكون تفاصيل الصلاحية
interface PermissionDetailsProps {
  permission: Permission | null;
  onUpdate: (permission: Permission) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const PermissionDetails: React.FC<PermissionDetailsProps> = ({
  permission,
  onUpdate,
  onClose,
  isOpen
}) => {
  const [formData, setFormData] = useState<Permission | null>(null);

  React.useEffect(() => {
    if (permission) {
      setFormData({ ...permission });
    }
  }, [permission]);

  const handleSave = () => {
    if (formData) {
      onUpdate(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تفاصيل الصلاحية: {formData.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الصلاحية</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رمز الصلاحية</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="input-field font-mono"
              />
            </div>
            
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>مستوى الصلاحية</Label>
              <Select 
                value={formData.level} 
                onValueChange={(value: any) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className="input-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">أساسي</SelectItem>
                  <SelectItem value="advanced">متقدم</SelectItem>
                  <SelectItem value="administrative">إداري</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={formData.isActive !== false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>صلاحية نشطة</Label>
            </div>
          </div>
          
          <div>
            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea-field h-32"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// مكون مصفوفة الأدوار والصلاحيات
interface RolePermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  onAssignPermission: (roleId: string, permissionId: string) => void;
  onUnassignPermission: (roleId: string, permissionId: string) => void;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  roles,
  permissions,
  onAssignPermission,
  onUnassignPermission
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الدور
            </th>
            {permissions.slice(0, 6).map((permission) => (
              <th 
                key={permission.id} 
                className="border border-gray-200 p-3 text-center text-xs"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {permission.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <Crown className={`h-4 w-4 text-${role.color}-600`} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {role.name}
                  </span>
                </div>
              </td>
              {permissions.slice(0, 6).map((permission) => (
                <td key={permission.id} className="border border-gray-200 p-3 text-center">
                  <Checkbox 
                    checked={role.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onAssignPermission(role.id, permission.id);
                      } else {
                        onUnassignPermission(role.id, permission.id);
                      }
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default usePermissionsManager;