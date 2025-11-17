/**
 * Tab_701_RequestPurposes.tsx
 * * تاب جديد يُضاف إلى شاشة "إعدادات المعاملات" (701)
 * للتحكم في القائمة الموحدة (Global) لأغراض الطلبات (المختصرة والتفصيلية)
 * * يعتمد على نموذج `RequestPurpose` الجديد في قاعدة البيانات
 * ويستخدم الـ Endpoints من `settingsController.js`
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { Switch } from '../../ui/switch';
import { Skeleton } from '../../ui/skeleton';
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle, ListChecks } from 'lucide-react';
import { Badge } from '../../ui/badge';

// --- (ملحوظة) ---
// ستحتاج إلى إنشاء هذه الدوال في ملف API جديد
// (مثل `src/api/settingsApi.ts`)
// بناءً على المسارات التي أضفناها في `settingsRoutes.js`
import { 
  getRequestPurposes, 
  createRequestPurpose, 
  updateRequestPurpose, 
  deleteRequestPurpose 
} from '../../../api/settingsApi'; // (افترض أن هذا الملف موجود)

// الواجهة (Interface) المطابقة لنموذج Prisma
interface RequestPurpose {
  id: string;
  type: 'brief' | 'detailed';
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

// نوع البيانات للنموذج (Form)
type PurposeFormData = Omit<RequestPurpose, 'id'>;

const Tab_701_RequestPurposes: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentType, setCurrentType] = React.useState<'brief' | 'detailed'>('brief');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [editingPurpose, setEditingPurpose] = React.useState<RequestPurpose | null>(null);
  const [deletingPurposeId, setDeletingPurposeId] = React.useState<string | null>(null);

  // --- 1. جلب البيانات ---
  const { data: purposes, isLoading, isError } = useQuery<RequestPurpose[]>({
    queryKey: ['requestPurposes', currentType],
    queryFn: () => getRequestPurposes(currentType),
  });

  // --- 2. عمليات الإنشاء والتعديل (Mutations) ---
  const createMutation = useMutation({
    mutationFn: createRequestPurpose,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestPurposes', currentType] });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      alert(`Error creating: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: RequestPurpose) => updateRequestPurpose(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestPurposes', currentType] });
      setIsDialogOpen(false);
      setEditingPurpose(null);
    },
    onError: (error: Error) => {
      alert(`Error updating: ${error.message}`);
    },
  });

  // --- 3. عملية الحذف (Mutation) ---
  const deleteMutation = useMutation({
    mutationFn: deleteRequestPurpose,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestPurposes', currentType] });
      setIsAlertOpen(false);
      setDeletingPurposeId(null);
    },
    onError: (error: Error) => {
      alert(`Error deleting: ${error.message}`);
    },
  });

  // --- 4. معالجات النموذج (Dialog Form) ---
  const handleOpenDialog = (purpose: RequestPurpose | null = null) => {
    setEditingPurpose(purpose);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: currentType,
      name: formData.get('name') as string,
      nameEn: formData.get('nameEn') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      isActive: (formData.get('isActive') as string) === 'on',
    };

    if (editingPurpose) {
      updateMutation.mutate({ ...editingPurpose, ...data });
    } else {
      createMutation.mutate(data as PurposeFormData);
    }
  };

  // --- 5. معالجات الحذف (Alert Dialog) ---
  const handleOpenAlert = (id: string) => {
    setDeletingPurposeId(id);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingPurposeId) {
      deleteMutation.mutate(deletingPurposeId);
    }
  };
  
  const isLoadingMutation = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="card-element card-rtl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-blue-600" />
          <CardTitle>إدارة أغراض الطلبات</CardTitle>
        </div>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة غرض جديد
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ToggleGroup
            type="single"
            value={currentType}
            onValueChange={(value: 'brief' | 'detailed') => value && setCurrentType(value)}
          >
            <ToggleGroupItem value="brief">الأغراض المختصرة</ToggleGroupItem>
            <ToggleGroupItem value="detailed">الأغراض التفصيلية</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {isError && (
           <div className="flex flex-col items-center justify-center h-40 text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <span>فشل تحميل البيانات</span>
          </div>
        )}

        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الاسم (En)</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الأيقونة</TableHead>
                <TableHead>اللون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purposes?.map((purpose) => (
                <TableRow key={purpose.id}>
                  <TableCell>{purpose.name}</TableCell>
                  <TableCell>{purpose.nameEn}</TableCell>
                  <TableCell>{purpose.description}</TableCell>
                  <TableCell>{purpose.icon}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full border" 
                        style={{ backgroundColor: purpose.color }}
                      />
                      {purpose.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={purpose.isActive ? 'default' : 'outline'}>
                      {purpose.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(purpose)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleOpenAlert(purpose.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* نموذج الإضافة والتعديل */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPurpose ? 'تعديل غرض' : 'إضافة غرض جديد'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">الاسم (عربي)</Label>
                <Input id="name" name="name" defaultValue={editingPurpose?.name} required />
              </div>
              <div>
                <Label htmlFor="nameEn">الاسم (إنجليزي)</Label>
                <Input id="nameEn" name="nameEn" defaultValue={editingPurpose?.nameEn} required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input id="description" name="description" defaultValue={editingPurpose?.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">الأيقونة (Emoji)</Label>
                <Input id="icon" name="icon" defaultValue={editingPurpose?.icon} />
              </div>
              <div>
                <Label htmlFor="color">اللون (Hex)</Label>
                <Input id="color" name="color" defaultValue={editingPurpose?.color} />
              </div>
            </div>
             <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                name="isActive" 
                defaultChecked={editingPurpose?.isActive ?? true} 
              />
              <Label htmlFor="isActive">نشط (فعال)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoadingMutation}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoadingMutation}>
                {isLoadingMutation && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {editingPurpose ? 'حفظ التعديلات' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي هذا إلى حذف الغرض بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Tab_701_RequestPurposes;