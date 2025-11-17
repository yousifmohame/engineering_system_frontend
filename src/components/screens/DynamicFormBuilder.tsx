// ملف: src/components/screens/DynamicFormBuilder.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFormDefinition, 
  createFormField, 
  updateFormField, 
  deleteFormField,
  DynamicFormDefinition,
  DynamicFormField,
  FieldFormData
} from '../../api/settingsApi';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';
import { PlusCircle, Edit, Trash2, Loader2, GripVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface FormBuilderProps {
  purposeId: string;
  purposeName: string;
  onClose: () => void;
}

// مكون فرعي لإضافة/تعديل حقل
interface FieldEditorProps {
  formId: string;
  field?: DynamicFormField | null; // (null) للإضافة، (field) للتعديل
  onClose: () => void;
  onSuccess: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ formId, field, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<FieldFormData>>({
    label: field?.label || '',
    fieldKey: field?.fieldKey || '',
    fieldType: field?.fieldType || 'text',
    order: field?.order || 0,
    placeholder: field?.placeholder || '',
    optionsJson: field?.optionsJson ? JSON.stringify(field.optionsJson, null, 2) : '[]',
  });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const createMutation = useMutation({
    mutationFn: (data: FieldFormData) => createFormField(formId, data),
    onSuccess: () => {
      onSuccess(); // لإغلاق المودال الرئيسي وتحديث القائمة
    },
    onError: (err: Error) => alert(`خطأ: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FieldFormData>) => updateFormField(field!.id, data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: Error) => alert(`خطأ: ${err.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let optionsJson: any;
    try {
      optionsJson = JSON.parse(formData.optionsJson || '[]');
    } catch (error) {
      alert('خطأ في تنسيق JSON للخيارات.');
      return;
    }

    const dataToSave: Partial<FieldFormData> = {
      ...formData,
      order: Number(formData.order),
      optionsJson: optionsJson,
    };

    if (field) {
      updateMutation.mutate(dataToSave);
    } else {
      createMutation.mutate(dataToSave as FieldFormData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{field ? 'تعديل حقل' : 'إضافة حقل جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">الاسم المعروض (Label)</Label>
              <Input id="label" value={formData.label} onChange={e => handleChange('label', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="fieldKey">المفتاح البرمجي (Key)</Label>
              <Input id="fieldKey" value={formData.fieldKey} onChange={e => handleChange('fieldKey', e.target.value)} required placeholder="مثال: current_area" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fieldType">نوع الحقل</Label>
              <Select value={formData.fieldType} onValueChange={val => handleChange('fieldType', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">نص (Text)</SelectItem>
                  <SelectItem value="number">رقم (Number)</SelectItem>
                  <SelectItem value="select">قائمة اختيار (Select)</SelectItem>
                  <SelectItem value="textarea">مربع نص (Textarea)</SelectItem>
                  <SelectItem value="date">تاريخ (Date)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">الترتيب</Label>
              <Input id="order" type="number" value={formData.order} onChange={e => handleChange('order', e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="placeholder">النص التوضيحي (Placeholder)</Label>
            <Input id="placeholder" value={formData.placeholder} onChange={e => handleChange('placeholder', e.target.value)} />
          </div>
          {formData.fieldType === 'select' && (
            <div>
              <Label htmlFor="optionsJson">خيارات القائمة (تنسيق JSON)</Label>
              <Textarea 
                id="optionsJson" 
                value={formData.optionsJson} 
                onChange={e => handleChange('optionsJson', e.target.value)} 
                rows={4}
                placeholder='[{"label": "خيار 1", "value": "opt1"}, {"label": "خيار 2", "value": "opt2"}]'
                dir="ltr"
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>إلغاء</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const DynamicFormBuilder: React.FC<FormBuilderProps> = ({ purposeId, purposeName, onClose }) => {
  const queryClient = useQueryClient();
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<DynamicFormField | null>(null);
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);

  // 1. جلب تعريف النموذج وحقوله
  const { data: formDefinition, isLoading, isError } = useQuery<DynamicFormDefinition>({
    queryKey: ['formDefinition', purposeId],
    queryFn: () => getFormDefinition(purposeId),
  });

  // 2. عمليات الحذف
  const deleteMutation = useMutation({
    mutationFn: deleteFormField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formDefinition', purposeId] });
      setDeletingFieldId(null);
    },
    onError: (err: Error) => alert(`خطأ: ${err.message}`),
  });

  const handleOpenFieldEditor = (field: DynamicFormField | null = null) => {
    setEditingField(field);
    setIsFieldEditorOpen(true);
  };

  const handleCloseFieldEditor = () => {
    setEditingField(null);
    setIsFieldEditorOpen(false);
  };

  const handleFieldSaveSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['formDefinition', purposeId] });
    handleCloseFieldEditor();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>تصميم نموذج: {purposeName}</DialogTitle>
            <DialogDescription>
              قم بإدارة الحقول التي ستظهر للمستخدم لهذا الغرض التفصيلي.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-6 -mr-6">
            {isLoading && (
              <div className="space-y-2 pt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {isError && <p className="text-destructive">فشل تحميل بيانات النموذج.</p>}

            {formDefinition && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>الاسم (Label)</TableHead>
                    <TableHead>المفتاح (Key)</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formDefinition.fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      </TableCell>
                      <TableCell className="font-medium">{field.label}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted p-1 rounded">{field.fieldKey}</code>
                      </TableCell>
                      <TableCell>{field.fieldType}</TableCell>
                      <TableCell>{field.order}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenFieldEditor(field)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => setDeletingFieldId(field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-between w-full">
            <Button onClick={() => handleOpenFieldEditor(null)}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة حقل جديد
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>
                إغلاق
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مودال إضافة/تعديل الحقل */}
      {isFieldEditorOpen && formDefinition && (
        <FieldEditor
          formId={formDefinition.id}
          field={editingField}
          onClose={handleCloseFieldEditor}
          onSuccess={handleFieldSaveSuccess}
        />
      )}

      {/* مودال تأكيد الحذف */}
      <AlertDialog open={!!deletingFieldId} onOpenChange={() => setDeletingFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا الحقل نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(deletingFieldId!)} 
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DynamicFormBuilder;