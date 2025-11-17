// ملف: src/components/screens/DynamicFormRenderer.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFormForRender, DynamicFormField } from '../../api/settingsApi';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { DateInputWithToday } from '../DateInputWithToday'; // (نفترض وجود هذا المكون)

interface RendererProps {
  purposeId: string;
  data: { [key: string]: any }; // البيانات الحالية
  onChange: (fieldKey: string, value: any) => void;
  readOnly: boolean;
}

const DynamicFormRenderer: React.FC<RendererProps> = ({ purposeId, data, onChange, readOnly }) => {
  // 1. جلب "تعريف الحقول" من الـ API
  const { data: fields, isLoading, isError } = useQuery<DynamicFormField[]>({
    queryKey: ['formRender', purposeId],
    queryFn: () => getFormForRender(purposeId),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (isError || !fields || fields.length === 0) {
    return (
      <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded-md">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium text-sm">
          لم يتم تصميم نموذج لهذا الغرض بعد. يرجى مراجعة الإعدادات (شاشة 701).
        </p>
      </div>
    );
  }

  // 2. عرض الحقول بناءً على نوعها
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const value = data[field.fieldKey] || '';
        
        switch (field.fieldType) {
          case 'number':
            return (
              <InputWithCopy
                key={field.fieldKey}
                label={field.label}
                id={field.fieldKey}
                type="number"
                value={value.toString()}
                onChange={(e) => onChange(field.fieldKey, parseFloat(e.target.value) || 0)}
                disabled={readOnly}
                placeholder={field.placeholder}
                copyable={true}
                clearable={true}
              />
            );
          case 'select':
            return (
              <SelectWithCopy
                key={field.fieldKey}
                label={field.label}
                id={field.fieldKey}
                value={value}
                onChange={(val) => onChange(field.fieldKey, val)}
                options={field.optionsJson || []}
                disabled={readOnly}
                copyable={true}
                clearable={true}
              />
            );
          case 'textarea':
             return (
              <TextAreaWithCopy
                key={field.fieldKey}
                label={field.label}
                id={field.fieldKey}
                value={value}
                onChange={(e) => onChange(field.fieldKey, e.target.value)}
                disabled={readOnly}
                placeholder={field.placeholder}
                rows={3}
                copyable={true}
                clearable={true}
              />
             );
          case 'date':
            // (نفترض أن لديك مكون DateInputWithToday أو استخدم Input العادي)
            return (
              <InputWithCopy
                key={field.fieldKey}
                label={field.label}
                id={field.fieldKey}
                type="date"
                value={value}
                onChange={(e) => onChange(field.fieldKey, e.target.value)}
                disabled={readOnly}
                placeholder={field.placeholder}
              />
            );
          case 'text':
          default:
            return (
              <InputWithCopy
                key={field.fieldKey}
                label={field.label}
                id={field.fieldKey}
                value={value}
                onChange={(e) => onChange(field.fieldKey, e.target.value)}
                disabled={readOnly}
                placeholder={field.placeholder}
                copyable={true}
                clearable={true}
              />
            );
        }
      })}
    </div>
  );
};

export default DynamicFormRenderer;