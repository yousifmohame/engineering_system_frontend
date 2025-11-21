/**
 * التابات المتبقية للشاشة 286 - شامل ومكثف
 * ============================================
 * * هذا الملف يحتوي على جميع التابات المتبقية:
 * - 286-06: إسناد الموظفين
 * - 286-07: معلومات العميل
 * - 286-08: المرفقات
 * - 286-09: المواعيد
 * - 286-10: التكاليف
 * - 286-11: الموافقات
 * - 286-12: الملاحظات
 * - 286-13: معاينة
 * - 286-14: الإعدادات
 */

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // (إضافة)
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import {
  Users, User, Paperclip, Calendar, DollarSign, CheckCircle,
  FileText, Eye, Settings, Plus, Save, Upload, Download,
  Clock, Mail, Phone, Building, MapPin, Edit2, Trash2, X , AlertCircle, Loader2, AlertTriangle,
  Building2, FileCheck, Compass, Briefcase, Layers, 
  Printer
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '../ui/dialog';
import { Input } from '../ui/input'; // (إضافة Input)
import { Label } from '../ui/label'; // (إضافة Label)
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select'; // (إضافة Select)
import api from '../../api/axiosConfig'; // ✅ استيراد axios مباشرة للحل البديل
import { toast } from 'sonner';
import { 
  getAppointmentsByTransaction, 
  createAppointment, 
  deleteAppointment 
} from '../../api/appointmentApi'; // (جديد للتاب 09)
import { Appointment, CreateAppointmentData } from '../../types/appointmentTypes'; // (جديد للتاب 09)
import { getTransactionById, updateTransaction } from '../../api/transactionApi';
import { TransactionApprovals, TransactionNotes } from '../../types/transactionTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Progress } from '../ui/progress';

// ============================================
// 286-07: معلومات العميل (تم التعديل للعمل بدون إصلاح الباك إند)
// ============================================
interface TabClientInfoProps {
  readOnly?: boolean;
  clientId?: string;
}

export const Tab_286_07_ClientInfo: React.FC<TabClientInfoProps> = ({ readOnly = false, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState({
    name: '',
    idNumber: '',
    mobile: '',
    email: '',
    type: '',
    address: '',
    category: ''
  });

  const parseName = (nameJson: any): string => {
    if (!nameJson) return '';
    if (typeof nameJson === 'string') return nameJson;
    return nameJson.ar || nameJson.en || nameJson.firstName || 'اسم غير معروف';
  };

  const parseAddress = (addressJson: any): string => {
    if (!addressJson) return '';
    if (typeof addressJson === 'string') return addressJson;
    
    const parts = [];
    if (addressJson.city) parts.push(addressJson.city);
    if (addressJson.district) parts.push(addressJson.district);
    if (addressJson.street) parts.push(addressJson.street);
    
    return parts.length > 0 ? parts.join(' - ') : (addressJson.fullAddress || '');
  };

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) return;

      setLoading(true);
      try {
        // ✅ الحل البديل: جلب جميع العملاء والبحث محلياً
        // هذا يتفادى خطأ 500 في الباك إند عند طلب عميل واحد
        const response = await api.get('/clients'); 
        
        // البحث عن العميل المطلوب في القائمة
        const data = response.data.find((c: any) => c.id === clientId);

        if (data) {
          setClientData({
            name: parseName(data.name),
            idNumber: data.idNumber || '',
            mobile: data.mobile || '',
            email: data.email || '',
            type: data.type || 'individual',
            address: parseAddress(data.address),
            category: data.category || ''
          });
        } else {
          toast.error("لم يتم العثور على العميل في القائمة");
        }

      } catch (error) {
        console.error("Error fetching client:", error);
        toast.error("فشل في جلب بيانات العميل");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return (
      <Card className="card-rtl border-2 border-amber-500/20">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-07" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
            <User className="h-5 w-5 inline ml-2" />
            معلومات العميل الأساسية
            {!clientId && <span className="text-xs text-red-500 mr-2">(لم يتم تحديد عميل)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy 
              label="اسم العميل *" 
              id="clientName" 
              value={clientData.name} 
              onChange={() => {}} 
              disabled={true} 
              required 
              copyable 
            />
            <InputWithCopy 
              label="رقم الهوية / السجل *" 
              id="clientId" 
              value={clientData.idNumber} 
              onChange={() => {}} 
              disabled={true} 
              required 
              copyable 
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy 
              label="رقم الجوال *" 
              id="clientPhone" 
              type="tel" 
              value={clientData.mobile} 
              onChange={() => {}} 
              disabled={true} 
              required 
              copyable 
            />
            <InputWithCopy 
              label="البريد الإلكتروني" 
              id="clientEmail" 
              type="email" 
              value={clientData.email} 
              onChange={() => {}} 
              disabled={true} 
              copyable 
            />
            <SelectWithCopy 
              label="نوع العميل" 
              id="clientType" 
              value={clientData.type} 
              onChange={() => {}} 
              options={[
                { value: 'individual', label: 'فرد' },
                { value: 'company', label: 'شركة' },
                { value: 'government', label: 'جهة حكومية' }
              ]} 
              disabled={true} 
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
             <TextAreaWithCopy 
              label="العنوان" 
              id="clientAddress" 
              value={clientData.address} 
              onChange={() => {}} 
              rows={2} 
              disabled={true} 
              copyable 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-09: المواعيد
// ============================================
interface TabAppointmentsProps {
  transactionId: string;
  readOnly?: boolean;
}

export const Tab_286_09_Appointments: React.FC<TabAppointmentsProps> = ({ 
  transactionId, 
  readOnly = false 
}) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State للنموذج الجديد
  const [newAppt, setNewAppt] = useState<Partial<CreateAppointmentData>>({
    type: 'field_visit',
    date: '',
    notes: ''
  });

  // 1. جلب المواعيد
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', transactionId],
    queryFn: () => getAppointmentsByTransaction(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // 2. إضافة موعد
  const createMutation = useMutation({
    mutationFn: (data: CreateAppointmentData) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', transactionId] });
      setIsDialogOpen(false);
      setNewAppt({ type: 'field_visit', date: '', notes: '' }); // تصفير
      // toast.success('تم إضافة الموعد بنجاح');
    },
    onError: (err) => {
      console.error(err);
      // toast.error('فشل إضافة الموعد');
    }
  });

  // 3. حذف موعد
  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', transactionId] });
      // toast.success('تم حذف الموعد');
    }
  });

  const handleSave = () => {
    if (!newAppt.date || !newAppt.type) return;
    
    // تحديد العنوان تلقائياً بناءً على النوع
    let title = 'موعد جديد';
    switch(newAppt.type) {
      case 'field_visit': title = 'كشف ميداني'; break;
      case 'client_meeting': title = 'اجتماع مع العميل'; break;
      case 'delivery': title = 'تسليم المعاملة'; break;
      case 'technical_review': title = 'مراجعة فنية'; break;
    }

    createMutation.mutate({
      transactionId,
      title,
      date: new Date(newAppt.date).toISOString(),
      type: newAppt.type as any,
      notes: newAppt.notes || '',
      status: 'scheduled'
    });
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case 'field_visit': return 'كشف ميداني';
      case 'client_meeting': return 'اجتماع عميل';
      case 'delivery': return 'تسليم';
      case 'technical_review': return 'مراجعة فنية';
      default: return 'أخرى';
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-09-DYN" position="top-right" />
      
      {/* Header & Add Button */}
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #a855f7' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ padding: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', borderRadius: '12px' }}>
                <Calendar className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#5b21b6', margin: 0 }}>إدارة المواعيد</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>جدولة ومتابعة مواعيد المعاملة</p>
              </div>
            </div>
            {!readOnly && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                style={{ background: '#7c3aed', color: '#ffffff' }}
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة موعد
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="card-rtl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع الموعد</TableHead>
                  <TableHead className="text-right">التاريخ والوقت</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                  {!readOnly && <TableHead className="text-right">إجراءات</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments && appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{getTypeName(apt.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span dir="ltr">{new Date(apt.date).toLocaleString('ar-SA')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apt.status === 'completed' ? 'default' : 'outline'}>
                          {apt.status === 'completed' ? 'تم' : 'مجدول'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm truncate max-w-[150px]">
                        {apt.notes || '-'}
                      </TableCell>
                      {!readOnly && (
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => deleteMutation.mutate(apt.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      لا توجد مواعيد مجدولة لهذه المعاملة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Appointment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="card-rtl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة موعد جديد</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">نوع الموعد</Label>
              <Select 
                onValueChange={(val) => setNewAppt({...newAppt, type: val as any})}
                defaultValue={newAppt.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field_visit">كشف ميداني</SelectItem>
                  <SelectItem value="client_meeting">اجتماع مع العميل</SelectItem>
                  <SelectItem value="technical_review">مراجعة فنية</SelectItem>
                  <SelectItem value="delivery">تسليم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">التاريخ والوقت</Label>
              <Input 
                id="date" 
                type="datetime-local" 
                value={newAppt.date}
                onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Input 
                id="notes" 
                value={newAppt.notes}
                onChange={(e) => setNewAppt({...newAppt, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              حفظ الموعد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// 286-11: الموافقات
// ============================================
interface TabApprovalsProps {
  transactionId: string;
  readOnly?: boolean;
}

export const Tab_286_11_Approvals: React.FC<TabApprovalsProps> = ({ transactionId, readOnly = false }) => {
  const queryClient = useQueryClient();
  
  // الحالة المحلية
  const [approvals, setApprovals] = useState<TransactionApprovals>({
    manager: false,
    technical: false,
    financial: false,
    client: false,
  });

  // 1. جلب البيانات
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // تحديث الحالة المحلية عند وصول البيانات
  useEffect(() => {
    if (transaction?.approvals) {
      // دمج القيم القادمة مع القيم الافتراضية لضمان وجود كل المفاتيح
      setApprovals(prev => ({ ...prev, ...transaction.approvals }));
    }
  }, [transaction]);

  // 2. دالة التحديث (Mutation)
  const updateMutation = useMutation({
    mutationFn: (newApprovals: TransactionApprovals) => 
      updateTransaction(transactionId, { approvals: newApprovals }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('تم تحديث حالة الموافقات');
    },
    onError: () => {
      toast.error('فشل تحديث الموافقات');
      // إعادة التعيين في حالة الخطأ (اختياري)
      if (transaction?.approvals) setApprovals(transaction.approvals);
    }
  });

  // معالج التغيير
  const handleToggle = (key: keyof TransactionApprovals, value: boolean) => {
    if (readOnly) return;
    
    const newApprovals = { ...approvals, [key]: value };
    setApprovals(newApprovals); // تحديث متفائل (Optimistic Update)
    updateMutation.mutate(newApprovals);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-11-API" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>
            <CheckCircle className="h-5 w-5 inline ml-2" />
            الموافقات المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <EnhancedSwitch 
              id="managerApproval" 
              checked={approvals.manager} 
              onCheckedChange={(v) => handleToggle('manager', v)} 
              label="موافقة المدير" 
              description="يتطلب موافقة المدير قبل البدء" 
              size="md" 
              variant="warning" 
              disabled={readOnly || updateMutation.isPending} 
            />
            <EnhancedSwitch 
              id="technicalApproval" 
              checked={approvals.technical} 
              onCheckedChange={(v) => handleToggle('technical', v)} 
              label="موافقة فنية" 
              description="مراجعة فنية من قبل المهندس المختص" 
              size="md" 
              variant="default" 
              disabled={readOnly || updateMutation.isPending} 
            />
            <EnhancedSwitch 
              id="financialApproval" 
              checked={approvals.financial} 
              onCheckedChange={(v) => handleToggle('financial', v)} 
              label="موافقة مالية" 
              description="موافقة القسم المالي على التكاليف" 
              size="md" 
              variant="success" 
              disabled={readOnly || updateMutation.isPending} 
            />
            <EnhancedSwitch 
              id="clientApproval" 
              checked={approvals.client} 
              onCheckedChange={(v) => handleToggle('client', v)} 
              label="موافقة العميل" 
              description="موافقة العميل على الشروط والأحكام" 
              size="md" 
              variant="danger" 
              disabled={readOnly || updateMutation.isPending} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
// ============================================
// 286-12: الملاحظات
// ============================================
interface TabNotesProps {
  transactionId: string;
  readOnly?: boolean;
}

export const Tab_286_12_Notes: React.FC<TabNotesProps> = ({ transactionId, readOnly = false }) => {
  const queryClient = useQueryClient();
  
  const [notes, setNotes] = useState<TransactionNotes>({
    general: '',
    internal: '',
    client: '',
  });

  // 1. جلب البيانات
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  useEffect(() => {
    if (transaction?.notes) {
       // التأكد من أن البيانات هي كائن وليست مصفوفة (بسبب التعديل في الـ Schema)
       // إذا كانت مصفوفة (بيانات قديمة)، نأخذ العنصر الأول للملاحظات العامة
       if (Array.isArray(transaction.notes)) {
         setNotes(prev => ({ ...prev, general: transaction.notes[0] || '' }));
       } else {
         setNotes(prev => ({ ...prev, ...transaction.notes }));
       }
    }
  }, [transaction]);

  // 2. الحفظ
  const updateMutation = useMutation({
    mutationFn: (newNotes: TransactionNotes) => 
      updateTransaction(transactionId, { notes: newNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('تم حفظ الملاحظات');
    },
    onError: () => toast.error('فشل حفظ الملاحظات')
  });

  const handleSave = () => {
    updateMutation.mutate(notes);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-12-API" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', border: '2px solid #eab308' }}>
        <CardHeader className="pb-3 flex flex-row justify-between items-center">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#854d0e' }}>
            <FileText className="h-5 w-5 inline ml-2" />
            الملاحظات
          </CardTitle>
          {!readOnly && (
            <Button 
              onClick={handleSave} 
              disabled={updateMutation.isPending}
              className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 ml-1" />}
              حفظ التغييرات
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <TextAreaWithCopy 
            label="ملاحظات عامة" 
            id="generalNotes" 
            value={notes.general} 
            onChange={(e) => setNotes({...notes, general: e.target.value})} 
            rows={4} 
            disabled={readOnly} 
            copyable 
          />
          <TextAreaWithCopy 
            label="ملاحظات داخلية (للفريق فقط)" 
            id="internalNotes" 
            value={notes.internal} 
            onChange={(e) => setNotes({...notes, internal: e.target.value})} 
            rows={3} 
            disabled={readOnly} 
            copyable 
          />
          <TextAreaWithCopy 
            label="ملاحظات للعميل" 
            id="clientNotes" 
            value={notes.client} 
            onChange={(e) => setNotes({...notes, client: e.target.value})} 
            rows={3} 
            disabled={readOnly} 
            copyable 
          />
        </CardContent>
      </Card>
    </div>
  );
};
// ============================================
// 286-13: معاينة
// ============================================
interface TabPreviewProps {
  transactionId: string;
  onSave?: () => void;
}

export const Tab_286_13_Preview_Complex: React.FC<TabPreviewProps> = ({ transactionId, onSave }) => {
  const queryClient = useQueryClient();
  // الـ ref يستخدم للوصول لعنصر الـ DOM لغرض الطباعة
  const printRef = useRef<HTMLDivElement>(null);

  // 1. جلب بيانات المعاملة الكاملة
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // 2. دالة الحفظ والاعتماد
  const saveProjectMutation = useMutation({
    mutationFn: (newStatus: string) => 
      updateTransaction(transactionId, { status: newStatus }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      const statusAr = data.status === 'Under Review' ? 'قيد المراجعة' : 'قيد التنفيذ';
      toast.success(`تم اعتماد المعاملة بنجاح: ${statusAr}`);
      if (onSave) onSave();
    },
    onError: () => toast.error('فشل في حفظ المشروع')
  });

  const handleSaveProject = () => {
    if (!transaction) return;
    const approvals = transaction.approvals || {};
    const isApprovalRequired = Object.values(approvals).some(val => val === true);
    const nextStatus = isApprovalRequired ? 'Under Review' : 'In Progress';
    saveProjectMutation.mutate(nextStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (!transaction) return <div className="text-center p-4 text-gray-500">البيانات غير متوفرة</div>;

  // --- تحضير البيانات ---
  const clientName = transaction.client?.name?.firstName 
    ? `${transaction.client.name.firstName} ${transaction.client.name.familyName}` 
    : 'غير محدد';

  // البيانات الفنية
  const landArea = transaction.landArea || {};
  const boundaries = Array.isArray(transaction.boundaries) ? transaction.boundaries : [];
  const floors = Array.isArray(transaction.floors) ? transaction.floors : [];
  const setbacks = Array.isArray(transaction.setbacks) ? transaction.setbacks : [];
  const components = Array.isArray(transaction.components) ? transaction.components : [];
  
  // البيانات الإدارية والمالية
  const tasks = transaction.tasks || [];
  const staff = transaction.transactionEmployees || [];
  const attachments = transaction.attachments || [];
  const appointments = transaction.appointments || [];

  // حسابات
  const completedTasks = tasks.filter((t: any) => t.status === 'Completed' || t.status === 'completed').length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const totalCost = transaction.totalFees || 0;
  const paidAmount = transaction.paidAmount || 0;
  const remainingAmount = transaction.remainingAmount || 0;

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-PREVIEW-COMPLEX-FIXED" position="top-right" />
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-content, #printable-content * { visibility: visible; }
          #printable-content { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; background: white; }
          .no-print { display: none !important; }
          .card-rtl { box-shadow: none; border: 1px solid #ddd; page-break-inside: avoid; }
        }
      `}</style>

      {/* شريط الأدوات العلوي */}
      <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm no-print">
        <div className="flex items-center gap-2">
           <FileCheck className="h-5 w-5 text-blue-600" />
           <h2 className="font-bold text-gray-800">معاينة المعاملة الشاملة</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-2" /> طباعة التقرير
          </Button>
          <Button 
             onClick={handleSaveProject} 
             disabled={saveProjectMutation.isPending}
             className="bg-blue-600 hover:bg-blue-700 text-white"
             size="sm"
          >
            {saveProjectMutation.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <CheckCircle className="h-4 w-4 ml-2" />}
            اعتماد نهائي
          </Button>
        </div>
      </div>

      {/* ✅ الإصلاح: إزالة ref و id من ScrollArea */}
      <ScrollArea className="h-[calc(100vh-140px)]">
        {/* ✅ نقل ref و id إلى الـ div الداخلي ليعمل الـ ref والطباعة بشكل صحيح */}
        <div className="space-y-6 p-1" id="printable-content" ref={printRef}>
          
          {/* 1. رأس المعاملة */}
          <Card className="card-rtl bg-slate-50 border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-2xl font-bold text-slate-900 mb-2">{transaction.title}</h1>
                   <div className="flex gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {transaction.transactionCode}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}</span>
                      <Badge variant={transaction.status === 'Draft' ? 'secondary' : 'default'}>{transaction.status}</Badge>
                   </div>
                </div>
                <div className="text-left">
                   <div className="text-sm text-slate-500">نوع المعاملة</div>
                   <div className="font-bold text-slate-800">{transaction.transactionType?.name || 'غير محدد'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2. معلومات العميل */}
            <Card className="card-rtl border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" /> معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">الاسم:</span> <span className="font-semibold">{clientName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">الهوية:</span> <span>{transaction.client?.idNumber || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">الجوال:</span> <span dir="ltr">{transaction.client?.mobile || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">النوع:</span> <span>{transaction.client?.type === 'company' ? 'شركة' : 'فرد'}</span></div>
              </CardContent>
            </Card>

            {/* 3. الموقع والصك */}
            <Card className="card-rtl border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" /> الموقع والصك
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">رقم الصك:</span> <span className="font-mono">{transaction.deedNumber || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">الموقع:</span> <span>{transaction.location || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">مساحة الصك:</span> <span className="font-bold">{landArea.deedArea || 0} م²</span></div>
                <div className="flex justify-between"><span className="text-gray-500">مساحة الطبيعة:</span> <span>{landArea.naturalArea || 0} م²</span></div>
              </CardContent>
            </Card>

            {/* 4. الملخص المالي */}
            <Card className="card-rtl border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" /> الملخص المالي
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">الإجمالي:</span> <span className="font-bold text-lg">{totalCost.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">المدفوع:</span> <span className="text-green-600">{paidAmount.toLocaleString()}</span></div>
                <Separator className="my-1" />
                <div className="flex justify-between"><span className="text-gray-500">المتبقي:</span> <span className="text-red-600 font-bold">{remainingAmount.toLocaleString()}</span></div>
              </CardContent>
            </Card>
          </div>

          {/* تفاصيل البيانات الفنية والهندسية */}
          <Accordion type="multiple" defaultValue={['engineering', 'components']} className="w-full">
            
            {/* قسم البيانات الهندسية (حدود، ارتدادات) */}
            <AccordionItem value="engineering">
              <AccordionTrigger className="bg-gray-50 px-4 rounded-md hover:no-underline">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Compass className="h-5 w-5 text-indigo-600" />
                   البيانات الهندسية (الحدود والارتدادات)
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* الحدود */}
                  <div className="border rounded-lg p-3">
                    <h3 className="font-bold text-sm mb-3 text-gray-700 border-b pb-2">الحدود والأطوال</h3>
                    <div className="space-y-2">
                      {boundaries.length > 0 ? boundaries.map((b: any) => (
                        <div key={b.direction} className="flex justify-between text-sm items-center bg-gray-50 p-2 rounded">
                          <span className="font-semibold w-16">{b.directionAr}</span>
                          <span className="text-gray-600 flex-1 mx-2 truncate">{b.name || '-'}</span>
                          {b.width > 0 && <Badge variant="outline">{b.width}م</Badge>}
                        </div>
                      )) : <div className="text-gray-400 text-sm text-center">لا توجد بيانات</div>}
                    </div>
                  </div>

                  {/* الارتدادات (ملخص) */}
                  <div className="border rounded-lg p-3">
                    <h3 className="font-bold text-sm mb-3 text-gray-700 border-b pb-2">ملخص الارتدادات (للدور الأرضي)</h3>
                    {setbacks.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {setbacks.find((f: any) => f.floorName.includes('الأرضي') || f.sequence === 1)?.setbacks.map((s: any) => (
                          <div key={s.direction} className="bg-gray-50 p-2 rounded text-center">
                             <div className="text-xs text-gray-500">{s.directionAr}</div>
                             <div className="font-bold text-sm flex justify-center gap-2">
                                <span className="text-gray-400 text-xs">ق:{s.current}</span>
                                <span className="text-blue-600">ن:{s.regulatory}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="text-gray-400 text-sm text-center">لا توجد بيانات</div>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* قسم المكونات والأدوار */}
            <AccordionItem value="components">
              <AccordionTrigger className="bg-gray-50 px-4 rounded-md hover:no-underline">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Building2 className="h-5 w-5 text-blue-600" />
                   تفاصيل الأدوار والمكونات
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="overflow-x-auto border rounded-lg">
                  <Table className="table-rtl">
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead className="text-right">الدور</TableHead>
                        <TableHead className="text-right">المساحة (م²)</TableHead>
                        <TableHead className="text-right">الاستخدامات</TableHead>
                        <TableHead className="text-right">الوحدات</TableHead>
                        <TableHead className="text-right">المنسوب</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.length > 0 ? components.map((comp: any) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-semibold">{comp.floorName}</TableCell>
                          <TableCell>{comp.totalArea || comp.area || 0}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {comp.usages?.map((u: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-[10px]">
                                  {u.usageType} ({u.area}م²)
                                </Badge>
                              ))}
                              {!comp.usages && comp.usage && <Badge variant="secondary">{comp.usage}</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>{comp.unitsCount}</TableCell>
                          <TableCell>{comp.level}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={5} className="text-center py-4 text-gray-500">لا توجد مكونات مضافة</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* قسم فريق العمل والمهام */}
            <AccordionItem value="staff">
              <AccordionTrigger className="bg-gray-50 px-4 rounded-md hover:no-underline">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Users className="h-5 w-5 text-green-600" />
                   فريق العمل والمهام
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                 <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                       <span>إنجاز المهام</span>
                       <span>{Math.round(taskProgress)}%</span>
                    </div>
                    <Progress value={taskProgress} className="h-2" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                       <h4 className="font-bold text-sm mb-2 flex items-center gap-1"><Briefcase className="h-4 w-4"/> الفريق المسند</h4>
                       <div className="space-y-2">
                          {staff.length > 0 ? staff.map((s: any) => (
                             <div key={s.id} className="flex justify-between text-sm border-b last:border-0 pb-1">
                                <span>{s.employee?.name || 'مستخدم'}</span>
                                <Badge variant="outline" className="text-[10px]">{s.role}</Badge>
                             </div>
                          )) : <div className="text-gray-400 text-sm">لم يتم إسناد موظفين</div>}
                       </div>
                    </div>
                    <div className="border rounded-lg p-3">
                       <h4 className="font-bold text-sm mb-2 flex items-center gap-1"><Calendar className="h-4 w-4"/> المواعيد القادمة</h4>
                       <div className="space-y-2">
                          {appointments.length > 0 ? appointments.slice(0, 3).map((apt: any) => (
                             <div key={apt.id} className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                                <span>{apt.type === 'field_visit' ? 'كشف ميداني' : 'اجتماع'}</span>
                                <span className="text-xs text-blue-600" dir="ltr">{new Date(apt.date).toLocaleDateString()}</span>
                             </div>
                          )) : <div className="text-gray-400 text-sm">لا توجد مواعيد</div>}
                       </div>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* قسم المرفقات */}
            <AccordionItem value="files">
              <AccordionTrigger className="bg-gray-50 px-4 rounded-md hover:no-underline">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Layers className="h-5 w-5 text-purple-600" />
                   المرفقات والمستندات ({attachments.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                {attachments.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {attachments.map((file: any) => (
                        <div key={file.id} className="border rounded p-2 flex items-center gap-2 text-sm bg-white">
                           <FileText className="h-4 w-4 text-gray-500" />
                           <span className="truncate flex-1">{file.fileName}</span>
                        </div>
                     ))}
                  </div>
                ) : <div className="text-center text-gray-400">لا توجد مرفقات</div>}
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* التوقيع والاعتماد (للتقرير المطبوع) */}
          <div className="mt-12 border-t pt-8 hidden print:block">
            <div className="grid grid-cols-3 gap-8 text-center">
               <div>
                  <p className="font-bold mb-10">المدير العام</p>
                  <div className="border-t w-32 mx-auto border-black"></div>
               </div>
               <div>
                  <p className="font-bold mb-10">المدير المالي</p>
                  <div className="border-t w-32 mx-auto border-black"></div>
               </div>
               <div>
                  <p className="font-bold mb-10">المدير الفني</p>
                  <div className="border-t w-32 mx-auto border-black"></div>
               </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};


export default {
  Tab_286_07_ClientInfo,
  Tab_286_09_Appointments,
  Tab_286_11_Approvals,
  Tab_286_12_Notes,
  Tab_286_13_Preview_Complex,
};