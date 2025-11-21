import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { Save, Loader2, Clock, FileText, Trash2, Edit, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

// --- 1. استيراد دوال الـ API ---
import { getSimpleClients } from '../../api/clientApi';
import { getTransactionTypes, getAllTransactions, deleteTransaction } from '../../api/transactionApi';

// --- 2. استيراد الأنواع ومكونات الفورم ---
import { NewTransactionData, SelectOption, Transaction } from '../../types/transactionTypes';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form"; 

type ApiSimpleOption = {
  id: string;
  name: string;
};

interface Props {
  form: UseFormReturn<NewTransactionData>;
  isSaving: boolean;
  // ✅ إضافة Callback للأب عند اختيار معاملة للتعديل
  onSelectTransaction?: (transaction: Transaction) => void;
}

const Tab_286_01_BasicInfo_UltraDense: React.FC<Props> = ({ form, isSaving, onSelectTransaction }) => {
  const queryClient = useQueryClient();

  // --- 3. جلب البيانات (عملاء، أنواع، ومعاملات سابقة) ---
  const { data: clients, isLoading: isLoadingClients } = useQuery<ApiSimpleOption[]>({
    queryKey: ['clientsForSelect'],
    queryFn: getSimpleClients,
  });

  const { data: types, isLoading: isLoadingTypes } = useQuery<ApiSimpleOption[]>({
    queryKey: ['transactionTypesForSelect'],
    queryFn: getTransactionTypes,
  });

  // ✅ جلب المعاملات السابقة
  const { data: recentTransactions, isLoading: isLoadingHistory } = useQuery<Transaction[]>({
    queryKey: ['recentTransactions'],
    queryFn: getAllTransactions,
  });

  // ✅ دالة حذف معاملة
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success('تم حذف المعاملة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
    },
    onError: () => toast.error('فشل حذف المعاملة')
  });

  // --- 4. تحويل البيانات ---
  const clientOptions: SelectOption[] = clients
    ? clients.map(c => ({ value: c.id, label: c.name }))
    : [];

  const typeOptions: SelectOption[] = types
    ? types.map(t => ({ value: t.id, label: t.name }))
    : [];

  return (
    <div className="space-y-6">
      {/* ================= القسم الأول: نموذج البيانات الأساسية ================= */}
      <Form {...form}>
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            معلومات أساسية
          </h2>

          <Card className="card-element card-rtl border-t-4 border-t-blue-600 shadow-sm">
            <CardContent className="p-4 space-y-4">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="form-rtl">
                    <InputWithCopy
                      id="transaction-title"
                      label="عنوان المعاملة *"
                      placeholder="أدخل عنوان المعاملة (مثال: ترخيص بناء فيلا)"
                      copyable={true}
                      clearable={true}
                      required
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="form-rtl">
                      <SelectWithCopy
                        id="client-id"
                        label="العميل *"
                        value={field.value}
                        onChange={field.onChange}
                        options={clientOptions}
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
                      placeholder="وصف تفصيلي للمعاملة..."
                      rows={3}
                      copyable={true}
                      clearable={true}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2 border-t mt-2">
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all hover:scale-105"
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

      {/* ================= القسم الثاني: المعاملات السابقة ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
             <Clock className="h-5 w-5 text-orange-600" />
             المعاملات السابقة (المسودات)
           </h2>
           <Button variant="ghost" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['recentTransactions'] })}>
             <RefreshCw className="h-4 w-4" />
           </Button>
        </div>

        <Card className="card-element card-rtl border-t-4 border-t-orange-400 shadow-sm">
          <CardContent className="p-0">
            <ScrollArea className="h-[250px]">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-right">الكود</TableHead>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingHistory ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : recentTransactions && recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="font-mono text-xs">{tx.transactionCode}</TableCell>
                        <TableCell className="font-medium">{tx.title}</TableCell>
                        {/* @ts-ignore: Client data structure check */}
                        <TableCell className="text-xs">{tx.client?.name?.firstName ? `${tx.client.name.firstName} ${tx.client.name.familyName}` : 'غير محدد'}</TableCell>
                        <TableCell className="text-xs">{tx.transactionType?.name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] px-2" style={{ borderColor: tx.statusColor || '#ccc', color: tx.statusColor || '#666' }}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                              title="تعديل / استكمال"
                              onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                              title="حذف"
                              onClick={() => {
                                if(confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
                                  deleteMutation.mutate(tx.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        لا توجد معاملات سابقة
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tab_286_01_BasicInfo_UltraDense;