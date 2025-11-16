/**
 * مكون فرعي لإدارة "المهام الافتراضية" لقالب المعاملة
 * [v2] - تم إزالة تاج <form> الداخلي لمنع خطأ DOM nesting
 */
import React from 'react';
import { useFieldArray, useForm, Control } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { TransactionTask } from '../../../types/transactionTypes';
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

type NewTaskFormData = Omit<TransactionTask, 'id' | 'dependencies'> & { dependencies: string };

const TransactionTypeTasks: React.FC<Props> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const localForm = useForm<NewTaskFormData>({
    defaultValues: {
      name: "",
      duration: 1,
      role: "مهندس",
      priority: 'medium',
      dependencies: "",
    }
  });

  const handleAddTask = (data: NewTaskFormData) => {
    const dependenciesArray = data.dependencies.split(',').map(d => d.trim()).filter(Boolean);
    
    append({
      ...data,
      id: `task-${crypto.randomUUID()}`,
      duration: Number(data.duration),
      dependencies: dependenciesArray,
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
              <FormField
                control={localForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المهمة</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: مراجعة المخططات" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={localForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدة (أيام)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={localForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدور المسؤول</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: مهندس معماري" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={localForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الأولوية</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="low">منخفضة</SelectItem>
                          <SelectItem value="medium">متوسطة</SelectItem>
                          <SelectItem value="high">عالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* --- 2. (مُعدل) تغيير type="submit" إلى type="button" و إضافة onClick --- */}
              <Button 
                type="button" 
                onClick={localForm.handleSubmit(handleAddTask)}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة المهمة
              </Button>
            </CardContent>
          </Card>
        {/* </form>  <-- تم إزالة هذا التاج */}
      </Form>

      {/* --- 3. عرض قائمة المهام المضافة --- */}
      {fields.length > 0 && (
        <Card>
          <CardContent className="p-2">
            <h4 className="font-semibold p-2">المهام المضافة ({fields.length})</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المهمة</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>حذف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const task = field as any as TransactionTask;
                  return (
                    <TableRow key={field.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.duration} يوم</TableCell>
                      <TableCell>{task.role}</TableCell>
                      <TableCell>{task.priority}</TableCell>
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

export default TransactionTypeTasks;

