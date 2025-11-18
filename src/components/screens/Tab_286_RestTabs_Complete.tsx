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

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // (إضافة)
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import {
  Users, User, Paperclip, Calendar, DollarSign, CheckCircle,
  FileText, Eye, Settings, Plus, Save, Upload, Download,
  Clock, Mail, Phone, Building, MapPin, Edit2, Trash2, X , AlertCircle, Loader2
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
// 286-10: التكاليف
// ============================================
export const Tab_286_10_Costs: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-10" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#065f46' }}>
            <DollarSign className="h-5 w-5 inline ml-2" />
            التكاليف المتوقعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy label="التكلفة التقديرية (ريال)" id="estimatedCost" type="number" value="0" onChange={() => {}} disabled={readOnly} copyable clearable={false} />
            <InputWithCopy label="التكلفة المتفق عليها (ريال)" id="agreedCost" type="number" value="0" onChange={() => {}} disabled={readOnly} copyable clearable={false} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy label="رسوم الجهات (ريال)" id="authorityFees" type="number" value="0" onChange={() => {}} disabled={readOnly} copyable clearable={false} />
            <InputWithCopy label="أتعاب المكتب (ريال)" id="officeFees" type="number" value="0" onChange={() => {}} disabled={readOnly} copyable clearable={false} />
            <InputWithCopy label="مصاريف إضافية (ريال)" id="additionalCosts" type="number" value="0" onChange={() => {}} disabled={readOnly} copyable clearable={false} />
          </div>
          <div className="p-3" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid #10b981' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600 }}>الإجمالي:</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#065f46' }}>0 ريال</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-11: الموافقات
// ============================================
export const Tab_286_11_Approvals: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-11" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>
            <CheckCircle className="h-5 w-5 inline ml-2" />
            الموافقات المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <EnhancedSwitch id="managerApproval" checked={false} onCheckedChange={() => {}} label="موافقة المدير" description="يتطلب موافقة المدير قبل البدء" size="md" variant="warning" disabled={readOnly} />
            <EnhancedSwitch id="technicalApproval" checked={false} onCheckedChange={() => {}} label="موافقة فنية" description="مراجعة فنية من قبل المهندس المختص" size="md" variant="default" disabled={readOnly} />
            <EnhancedSwitch id="financialApproval" checked={false} onCheckedChange={() => {}} label="موافقة مالية" description="موافقة القسم المالي على التكاليف" size="md" variant="success" disabled={readOnly} />
            <EnhancedSwitch id="clientApproval" checked={false} onCheckedChange={() => {}} label="موافقة العميل" description="موافقة العميل على الشروط والأحكام" size="md" variant="danger" disabled={readOnly} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-12: الملاحظات
// ============================================
export const Tab_286_12_Notes: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-12" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', border: '2px solid #eab308' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#854d0e' }}>
            <FileText className="h-5 w-5 inline ml-2" />
            الملاحظات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TextAreaWithCopy label="ملاحظات عامة" id="generalNotes" value="" onChange={() => {}} rows={4} disabled={readOnly} copyable clearable />
          <TextAreaWithCopy label="ملاحظات داخلية (للفريق فقط)" id="internalNotes" value="" onChange={() => {}} rows={3} disabled={readOnly} copyable clearable />
          <TextAreaWithCopy label="ملاحظات للعميل" id="clientNotes" value="" onChange={() => {}} rows={3} disabled={readOnly} copyable clearable />
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-13: معاينة
// ============================================
export const Tab_286_13_Preview: React.FC = () => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-13" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #0284c7' }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: '12px' }}>
              <Eye className="h-6 w-6" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>معاينة المعاملة</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>مراجعة جميع البيانات قبل الحفظ</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>المعلومات الأساسية</p>
              <div className="grid grid-cols-2 gap-2" style={{ fontSize: '13px' }}>
                <div><span style={{ fontWeight: 600 }}>نوع المعاملة:</span> <span style={{ color: '#64748b' }}>-</span></div>
                <div><span style={{ fontWeight: 600 }}>الأولوية:</span> <span style={{ color: '#64748b' }}>-</span></div>
              </div>
            </div>

            <div className="p-3" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>العميل</p>
              <div className="grid grid-cols-2 gap-2" style={{ fontSize: '13px' }}>
                <div><span style={{ fontWeight: 600 }}>الاسم:</span> <span style={{ color: '#64748b' }}>-</span></div>
                <div><span style={{ fontWeight: 600 }}>الجوال:</span> <span style={{ color: '#64748b' }}>-</span></div>
              </div>
            </div>

            <div className="p-3" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>الفريق</p>
              <div style={{ fontSize: '13px' }}>
                <span style={{ fontWeight: 600 }}>عدد الأعضاء:</span> <span style={{ color: '#64748b' }}>0</span>
              </div>
            </div>

            <div className="p-3" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>المهمات</p>
              <div style={{ fontSize: '13px' }}>
                <span style={{ fontWeight: 600 }}>عدد المهمات:</span> <span style={{ color: '#64748b' }}>0</span>
              </div>
            </div>

            <div className="p-3" style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>التكاليف</p>
              <div style={{ fontSize: '13px' }}>
                <span style={{ fontWeight: 600 }}>الإجمالي:</span> <span style={{ color: '#10b981', fontWeight: 700 }}>0 ريال</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-14: الإعدادات
// ============================================
export const Tab_286_14_Settings: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-14" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', border: '2px solid #6b7280' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#374151' }}>
            <Settings className="h-5 w-5 inline ml-2" />
            إعدادات المعاملة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <EnhancedSwitch id="autoNumbering" checked={true} onCheckedChange={() => {}} label="ترقيم تلقائي" description="توليد رقم المعاملة تلقائياً" size="md" variant="default" disabled={readOnly} />
            <EnhancedSwitch id="autoTaskAssignment" checked={true} onCheckedChange={() => {}} label="تعيين المهام تلقائياً" description="تعيين المهام للموظفين حسب الإعدادات المسبقة" size="md" variant="success" disabled={readOnly} />
            <EnhancedSwitch id="sendNotifications" checked={true} onCheckedChange={() => {}} label="إرسال إشعارات" description="إرسال إشعارات للفريق والعميل" size="md" variant="default" disabled={readOnly} />
            <EnhancedSwitch id="requireApproval" checked={false} onCheckedChange={() => {}} label="يتطلب موافقة" description="المعاملة تحتاج موافقة قبل البدء" size="md" variant="warning" disabled={readOnly} />
            <EnhancedSwitch id="isConfidential" checked={false} onCheckedChange={() => {}} label="معاملة سرية" description="تقييد الوصول للمعاملة" size="md" variant="danger" disabled={readOnly} />
            <EnhancedSwitch id="trackChanges" checked={true} onCheckedChange={() => {}} label="تتبع التغييرات" description="تسجيل جميع التعديلات على المعاملة" size="md" variant="default" disabled={readOnly} />
          </div>

          <div className="p-3 mt-4" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid #3b82f6' }}>
            <p style={{ fontSize: '12px', color: '#1e40af', margin: 0 }}>
              ℹ️ هذه الإعدادات يمكن تعديلها لاحقاً من إعدادات المعاملة
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default {
  Tab_286_07_ClientInfo,
  Tab_286_09_Appointments,
  Tab_286_10_Costs,
  Tab_286_11_Approvals,
  Tab_286_12_Notes,
  Tab_286_13_Preview,
  Tab_286_14_Settings
};