import React from 'react';
import { useFieldArray, useForm, Control } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { TransactionFee } from '../../../types/transactionTypes';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '../../ui/form';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';

interface Props {
  control: Control<any>; // (استقبال `control` من الفورم الأب)
}

type NewFeeFormData = TransactionFee;

const TransactionTypeFees: React.FC<Props> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fees",
  });

  const localForm = useForm<NewFeeFormData>({
    defaultValues: {
      name: "",
      amount: 0,
      authority: "البلدية",
      required: true,
    }
  });

  const handleAddFee = (data: NewFeeFormData) => {
    append({
      ...data,
      amount: Number(data.amount),
    });
    localForm.reset();
  };

  return (
    <div className="space-y-4">
      {/* --- 1. فورم الإضافة المحلي (بدون تاج <form>) --- */}
      <Form {...localForm}>
        {/* <form>  <-- تم إزالة هذا التاج */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={localForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الرسم</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: رسوم البلدية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={localForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المبلغ (ر.س)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={localForm.control}
                  name="authority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الجهة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: البلدية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <FormField
                  control={localForm.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>رسم إجباري</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* --- 2. (مُعدل) تغيير type="submit" إلى type="button" و إضافة onClick --- */}
                <Button 
                  type="button"
                  onClick={localForm.handleSubmit(handleAddFee)}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الرسم
                </Button>
              </div>
            </CardContent>
          </Card>
        {/* </form>  <-- تم إزالة هذا التاج */}
      </Form>

      {/* --- 3. عرض قائمة الرسوم المضافة --- */}
      {fields.length > 0 && (
        <Card>
          <CardContent className="p-2">
            <h4 className="font-semibold p-2">الرسوم المضافة ({fields.length})</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الرسم</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الجهة</TableHead>
                  <TableHead>إجباري؟</TableHead>
                  <TableHead>حذف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const fee = field as any as TransactionFee;
                  return (
                    <TableRow key={field.id}>
                      <TableCell>{fee.name}</TableCell>
                      <TableCell>{fee.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{fee.authority}</TableCell>
                      <TableCell>{fee.required ? "نعم" : "لا"}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionTypeFees;