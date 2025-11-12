import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../../InputWithCopy';
import { toast } from 'sonner';
import { Plus, Loader2, Check, ShieldCheck, Layers } from 'lucide-react';
import * as permApi from '../../../api/permissionApi';

// نموذج إنشاء صلاحية
const CreatePermissionForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'عرض',
    level: '3'
  });

  const mutation = useMutation(permApi.createPermission, {
    onSuccess: (newPerm) => {
      toast.success(`تم إنشاء الصلاحية "${newPerm.name}" بنجاح`);
      queryClient.invalidateQueries('individualPermissions'); // تحديث قائمة الصلاحيات
      setFormData({ code: '', name: '', description: '', category: 'عرض', level: '3' });
    },
    onError: (err: any) => {
      toast.error(`فشل إنشاء الصلاحية: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('الكود والاسم مطلوبان');
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="card-element card-rtl">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          إنشاء صلاحية جديدة (Permission)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputWithCopy
            label="كود الصلاحية *"
            id="perm-code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="مثال: VIEW_FINANCES"
            required
          />
          <InputWithCopy
            label="اسم الصلاحية *"
            id="perm-name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="مثال: عرض البيانات المالية"
            required
          />
          <SelectWithCopy
            label="فئة الصلاحية *"
            id="perm-category"
            value={formData.category}
            onChange={(val) => handleChange('category', val)}
            options={[
              { value: 'عرض', label: 'عرض' },
              { value: 'تعديل', label: 'تعديل' },
              { value: 'إنشاء', label: 'إنشاء' },
              { value: 'حذف', label: 'حذف' },
              { value: 'اعتماد', label: 'اعتماد' },
              { value: 'إدارة', label: 'إدارة' },
              { value: 'تقارير', label: 'تقارير' },
              { value: 'غير مصنف', label: 'غير مصنف' },
            ]}
          />
           <SelectWithCopy
            label="المستوى (Level) *"
            id="perm-level"
            value={formData.level}
            onChange={(val) => handleChange('level', val)}
            options={[
              { value: '1', label: '1 - (Low)' },
              { value: '2', label: '2' },
              { value: '3', label: '3 - (Medium)' },
              { value: '4', label: '4' },
              { value: '5', label: '5 - (High)' },
            ]}
          />
          <TextAreaWithCopy
            label="الوصف"
            id="perm-desc"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            placeholder="وصف مختصر لما تفعله هذه الصلاحية..."
          />
          <Button type="submit" size="sm" className="w-full bg-blue-600" disabled={mutation.isLoading}>
            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 ml-1" />}
            إنشاء الصلاحية
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// نموذج إنشاء مجموعة
const CreateGroupForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  const mutation = useMutation(
    (data: any) => permApi.createPermissionGroup({ ...data, permissionIds: [] }), // (يمكن تطوير هذا لاحقاً)
    {
      onSuccess: (newGroup) => {
        toast.success(`تم إنشاء المجموعة "${newGroup.name}" بنجاح`);
        queryClient.invalidateQueries('permissionGroups'); // تحديث قائمة المجموعات
        setFormData({ code: '', name: '', description: '' });
      },
      onError: (err: any) => {
        toast.error(`فشل إنشاء المجموعة: ${err.response?.data?.message || err.message}`);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('الكود والاسم مطلوبان');
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="card-element card-rtl">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Layers className="h-5 w-5 text-purple-600" />
          إنشاء مجموعة صلاحيات (Group)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputWithCopy
            label="كود المجموعة *"
            id="group-code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="مثال: GRP_FINANCE"
            required
          />
          <InputWithCopy
            label="اسم المجموعة *"
            id="group-name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="مثال: مجموعة المالية"
            required
          />
          <TextAreaWithCopy
            label="الوصف"
            id="group-desc"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            placeholder="وصف مختصر لمحتوى هذه المجموعة..."
          />
          {/* (ملاحظة: يمكن إضافة MultiSelect لاختيار الصلاحيات هنا) */}
          <Button type="submit" size="sm" className="w-full bg-purple-600" disabled={mutation.isLoading}>
            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 ml-1" />}
            إنشاء المجموعة
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// المكون الرئيسي للتبويب
const PermissionCreationTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CreatePermissionForm />
      <CreateGroupForm />
    </div>
  );
};

export default PermissionCreationTab;