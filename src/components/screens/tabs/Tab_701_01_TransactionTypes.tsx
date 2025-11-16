/**
 * التبويب 701-01: إدارة أنواع المعاملات (قوالب المعاملات)
 * [v6] - إصدار كامل يتضمن تبويبات لإدارة الحقول المعقدة
 * - تمت إضافة تبويبات "المهام" و "الرسوم" و "المستندات"
 * - تحديث Zod Schema ليشمل tasks و fees و documents
 * - إصلاح خطأ "missing key prop" في الجدول.
 */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { toast } from 'sonner'; 

// --- 1. استيراد دوال الـ API والأنواع ---
import {
  getFullTransactionTypes,
  createTransactionType,
  updateTransactionType,
  deleteTransactionType
} from '../../../api/transactionApi'; //
import { TransactionType, TransactionTask, TransactionFee } from '../../../types/transactionTypes'; //

// --- 2. استيراد مكونات التبويبات والمكونات الفرعية ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'; //
import TransactionTypeDocuments from './TransactionTypeDocuments'; // (من الخطوة السابقة)
import TransactionTypeTasks from './TransactionTypeTasks'; // (جديد)
import TransactionTypeFees from './TransactionTypeFees'; // (جديد)

// --- 3. استيراد جميع مكونات واجهة المستخدم ---
import { Button } from '../../ui/button'; //
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'; //
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../ui/dialog'; //
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog'; //
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../ui/form'; //
import { Input } from '../../ui/input'; //
import { Textarea } from '../../ui/textarea'; //
import { Switch } from '../../ui/switch'; //
import { Badge } from '../../ui/badge'; //
import { Card, CardContent } from '../../ui/card'; //
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Clock, DollarSign, Zap } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton'; //
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'; //


// --- 4. Zod Schema (مخطط التحقق) الكامل ---

// مخطط المهمة (يطابق TransactionTask)
const taskSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "اسم المهمة مطلوب"),
  duration: z.number().min(0),
  role: z.string().min(1, "الدور مطلوب"),
  priority: z.string(),
  dependencies: z.array(z.string()),
});

// مخطط الرسم (يطابق TransactionFee)
const feeSchema = z.object({
  name: z.string().min(1, "اسم الرسم مطلوب"),
  amount: z.number().min(0),
  authority: z.string().min(1, "الجهة مطلوبة"),
  required: z.boolean(),
});

// المخطط الرئيسي للقالب (يطابق TransactionType)
const typeSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  categoryAr: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  duration: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().min(0).optional()
  ),
  estimatedCost: z.preprocess(
    (val) => (val ? Number(String(val).replace(/,/g, '')) : 0),
    z.number().min(0).optional()
  ),
  complexity: z.string().optional(),
  
  // (تغيير من z.array(z.string()) إلى Zod Object)
  documents: z.array(z.object({ value: z.string() })).optional(),

  tasks: z.array(taskSchema).optional(),
  fees: z.array(feeSchema).optional(),
});

type TypeFormData = z.infer<typeof typeSchema>;


const Tab_701_01_TransactionTypes: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransactionType | null>(null);
  const [isDeleting, setIsDeleting] = useState<TransactionType | null>(null);

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      categoryAr: '',
      duration: 0,
      estimatedCost: 0,
      complexity: 'medium',
      documents: [],
      tasks: [],
      fees: [],
    },
  });

  // --- 5. جلب البيانات (Read) ---
  const { data: types, isLoading, isError } = useQuery<TransactionType[]>({
    queryKey: ['fullTransactionTypes'],
    queryFn: getFullTransactionTypes,
  });

  // --- 6. عمليات التعديل (Mutations) ---
  const createMutation = useMutation({
    mutationFn: (data: TypeFormData) => createTransactionType(data as TransactionType),
    onSuccess: () => {
      // toast.success("تم إنشاء النوع بنجاح");
      queryClient.invalidateQueries({ queryKey: ['fullTransactionTypes'] });
      queryClient.invalidateQueries({ queryKey: ['transactionTypesForSelect'] }); 
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      // toast.error(`فشل الإنشاء: ${error.message}`);
      console.error("Create Mutation Error:", error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: TypeFormData }) => updateTransactionType(id, data as TransactionType),
    onSuccess: () => {
      // toast.success("تم تعديل النوع بنجاح");
      queryClient.invalidateQueries({ queryKey: ['fullTransactionTypes'] });
      queryClient.invalidateQueries({ queryKey: ['transactionTypesForSelect'] });
      setIsDialogOpen(false);
      setEditingType(null);
    },
    onError: (error: Error) => {
      // toast.error(`فشل التعديل: ${error.message}`);
      console.error("Update Mutation Error:", error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionType,
    onSuccess: () => {
      // toast.success("تم حذف النوع بنجاح");
      queryClient.invalidateQueries({ queryKey: ['fullTransactionTypes'] });
      queryClient.invalidateQueries({ queryKey: ['transactionTypesForSelect'] });
      setIsDeleting(null);
    },
    onError: (error: Error) => {
      // toast.error(`فشل الحذف: ${error.message}`);
      console.error("Delete Mutation Error:", error);
      setIsDeleting(null);
    }
  });

  // --- 7. معالجات الأحداث (Handlers) ---

  // (مُعدل) useEffect (لإضافة المهام والرسوم)
  useEffect(() => {
    if (isDialogOpen) {
      if (editingType) {
        // (تعديل)
        form.reset({
          name: editingType.name,
          description: editingType.description || '',
          isActive: editingType.isActive,
          categoryAr: editingType.categoryAr || '',
          duration: editingType.duration || 0,
          estimatedCost: editingType.estimatedCost || 0,
          complexity: editingType.complexity || 'medium',
          // (تغليف النصوص القادمة من الخادم في كائنات)
          documents: (editingType.documents || []).map(doc => ({ value: doc })),
          tasks: editingType.tasks || [],
          fees: editingType.fees || [],
        });
      } else {
        // (جديد)
        form.reset({
          name: '', description: '', isActive: true,
          categoryAr: '', duration: 0, estimatedCost: 0, complexity: 'medium',
          documents: [],
          tasks: [],
          fees: [],
        });
      }
    }
  }, [isDialogOpen, editingType, form]);

  // (دالة الحفظ)
  const onSubmit = (data: TypeFormData) => {
    // (فك تغليف المستندات قبل الإرسال للخادم)
    const payload = {
      ...data,
      // (تحويل [{ value: "صورة" }] إلى ["صورة"])
      documents: data.documents ? data.documents.map(doc => doc.value) : [],
    };
    
    console.log("Saving data:", payload);

    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: payload as any });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const handleAddNew = () => { setEditingType(null); setIsDialogOpen(true); };
  const handleEdit = (type: TransactionType) => { setEditingType(type); setIsDialogOpen(true); };
  const handleDelete = (type: TransactionType) => { setIsDeleting(type); };

  // (دالة مساعدة لعرض لون التعقيد)
  const getComplexityBadge = (complexity: string | null | undefined) => {
    switch (complexity) {
      case 'simple': return <Badge className="bg-green-100 text-green-800">بسيط</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'complex': return <Badge className="bg-red-100 text-red-800">معقد</Badge>;
      default: return <Badge variant="outline">N/A</Badge>;
    }
  };

  // --- 8. واجهة المستخدم (Render) ---

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="text-lg font-semibold text-destructive">فشل تحميل البيانات</h3>
          <p className="text-sm text-muted-foreground">حدث خطأ أثناء جلب أنواع المعاملات.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة قوالب المعاملات</h2>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة قالب جديد
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>المدة (يوم)</TableHead>
                <TableHead>التكلفة (ر.س)</TableHead>
                <TableHead>التعقيد</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types?.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-mono">{type.code}</TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.categoryAr || '—'}</TableCell>
                  <TableCell>{type.duration || 0}</TableCell>
                  <TableCell>{type.estimatedCost?.toLocaleString() || 0}</TableCell>
                  <TableCell>{getComplexityBadge(type.complexity)}</TableCell>
                  <TableCell>
                    <Badge variant={type.isActive ? 'default' : 'outline'} className={type.isActive ? 'bg-green-600' : ''}>
                      {type.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => handleEdit(type)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-2 border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(type)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- 9. نافذة الإضافة والتعديل (مع التبويبات) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingType ? 'تعديل قالب معاملة' : 'إضافة قالب معاملة جديد'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">أساسي</TabsTrigger>
                  <TabsTrigger value="documents">المستندات</TabsTrigger>
                  <TabsTrigger value="tasks">المهام</TabsTrigger>
                  <TabsTrigger value="fees">الرسوم</TabsTrigger>
                </TabsList>
                
                {/* --- التبويب الأول: الحقول الأساسية --- */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                  {editingType && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">الكود (تلقائي)</label>
                      <Input disabled value={editingType.code} className="font-mono" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: ترخيص بناء" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>التصنيف (بالعربية)</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: التراخيص" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدة (أيام)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>التكلفة المتوقعة (ر.س)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="15000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complexity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مستوى التعقيد</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر مستوى التعقيد" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="simple">بسيط</SelectItem>
                              <SelectItem value="medium">متوسط</SelectItem>
                              <SelectItem value="complex">معقد</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوصف (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="وصف قصير للنوع" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>تفعيل القالب</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* --- التبويب الثاني: المستندات المطلوبة --- */}
                <TabsContent value="documents">
                  <TransactionTypeDocuments control={form.control} />
                </TabsContent>
                
                {/* --- التبويب الثالث: المهام --- */}
                <TabsContent value="tasks">
                  <TransactionTypeTasks control={form.control} />
                </TabsContent>
                
                {/* --- التبويب الرابع: الرسوم --- */}
                <TabsContent value="fees">
                  <TransactionTypeFees control={form.control} />
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">إلغاء</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                  حفظ
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* --- نافذة تأكيد الحذف --- */}
      <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد بالتأكيد حذف نوع المعاملة: <span className="font-bold">"{isDeleting?.name}"</span>؟
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => isDeleting && deleteMutation.mutate(isDeleting.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              )}
              نعم، حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tab_701_01_TransactionTypes;