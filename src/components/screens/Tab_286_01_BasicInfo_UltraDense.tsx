import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { Save, Loader2 } from 'lucide-react';

// --- 1. (مُعدل) استيراد دوال الـ API ---
import { getSimpleClients } from '../../api/clientApi';
import { getTransactionTypes } from '../../api/transactionApi'; 

// --- 2. (مُعدل) استيراد الأنواع ومكونات الفورم ---
import { NewTransactionData, SelectOption } from '../../types/transactionTypes';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form"; 

// --- 3. (جديد) تعريف النوع الذي يأتي من الـ API (حسب الـ Logs) ---
type ApiSimpleOption = {
  id: string;
  name: string;
};

interface Props {
  form: UseFormReturn<NewTransactionData>;
  isSaving: boolean;
}

const Tab_286_01_BasicInfo_UltraDense: React.FC<Props> = ({ form, isSaving }) => {

  // --- 4. (مُعدل) جلب البيانات بالنوع الخام (ApiSimpleOption) ---
  const { data: clients, isLoading: isLoadingClients } = useQuery<ApiSimpleOption[]>({
    queryKey: ['clientsForSelect'],
    queryFn: getSimpleClients,
  });

  // --- 5. (مهم جداً) تحويل البيانات هنا داخل المكون ---
  const clientOptions: SelectOption[] = clients
    ? clients.map(c => ({ value: c.id, label: c.name }))
    : [];
    

  return (
    <Form {...form}>
      <div className="space-y-3">
        <h2 className="text-lg">معلومات أساسية</h2>

        <Card className="card-element card-rtl">
          <CardContent className="p-3 space-y-3">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="form-rtl">
                  <InputWithCopy
                    id="transaction-title"
                    label="عنوان المعاملة"
                    placeholder="أدخل عنوان المعاملة"
                    copyable={true}
                    clearable={true}
                    required
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="form-rtl">
                    <SelectWithCopy
                      id="client-id"
                      label="العميل"
                      value={field.value}
                      onChange={field.onChange}
                      options={clientOptions} // <-- استخدام البيانات المحولة
                      isLoading={isLoadingClients}
                      placeholder="اختر العميل..."
                      required
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="form-rtl">
                    <SelectWithCopy
                      id="priority"
                      label="الأولوية"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'low', label: 'منخفضة' },
                        { value: 'medium', label: 'متوسطة' },
                        { value: 'high', label: 'عالية' },
                        { value: 'urgent', label: 'عاجلة' }
                      ]}
                      placeholder="اختر الأولوية..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="form-rtl">
                  <TextAreaWithCopy
                    id="description"
                    label="الوصف"
                    placeholder="وصف تفصيلي للمعاملة"
                    rows={3}
                    copyable={true}
                    clearable={true}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button 
                type="submit"
                disabled={isSaving}
                className="h-9 text-sm bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 ml-2" />
                )}
                حفظ المسودة ومتابعة
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </Form>
  );
};

export default Tab_286_01_BasicInfo_UltraDense;