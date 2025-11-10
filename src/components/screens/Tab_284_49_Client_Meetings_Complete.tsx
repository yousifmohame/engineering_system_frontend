/**
 * التاب 284-49 - مقابلات العميل
 * ===========================================================================
 * 
 * تاب شامل لإدارة جميع مقابلات العميل المرتبطة بالمعاملة
 * 
 * المميزات:
 * - عرض timeline لجميع المقابلات
 * - تسجيل مقابلات جديدة
 * - إدارة الطلبات (للعميل ومن العميل)
 * - ربط تلقائي بالمعاملة
 * - ملاحظات شاملة
 * 
 * @version 1.0
 * @date نوفمبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import {
  Users, Calendar, Clock, MapPin, FileText, CheckCircle, 
  AlertCircle, Plus, Edit, Save, Eye, Trash2,
  ArrowRight, ArrowLeft, MessageSquare, Target,
  Phone, Mail, Video, History, Paperclip, Download,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface TabProps {
  transactionId: string;
  transactionNumber: string;
  clientName: string;
}

interface Meeting {
  id: string;
  meetingNumber: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  locationType: 'مكتب' | 'موقع المشروع' | 'مكتب العميل' | 'عن بُعد' | 'أخرى';
  meetingType: 'استشارة' | 'متابعة' | 'عرض مشروع' | 'تسليم' | 'توقيع عقد' | 'شكوى' | 'أخرى';
  meetingPurpose: string;
  calledBy: {
    name: string;
    role: string;
  };
  attendees: Array<{
    name: string;
    role: string;
    type: 'موظف' | 'عميل' | 'طرف ثالث';
    attended: boolean;
  }>;
  requestsToClient: Array<{
    id: string;
    description: string;
    type: string;
    priority: string;
    deadline: string;
    status: string;
    notes: string;
  }>;
  requestsFromClient: Array<{
    id: string;
    description: string;
    type: string;
    priority: string;
    deadline: string;
    status: string;
    notes: string;
    completionPercent: number;
  }>;
  meetingSummary: string;
  keyPoints: string[];
  decisions: string[];
  nextSteps: string[];
  status: 'مجدول' | 'منعقد' | 'ملغي' | 'مؤجل';
  meetingRating?: number;
}

const Tab_284_49_ClientMeetings: React.FC<TabProps> = ({ 
  transactionId, 
  transactionNumber, 
  clientName 
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // بيانات المقابلات المرتبطة بالمعاملة
  const meetings: Meeting[] = useMemo(() => [
    {
      id: 'MTG001',
      meetingNumber: 'MTG-2025-001',
      date: '2025-01-15',
      time: '10:00',
      duration: 90,
      location: 'قاعة الاجتماعات الرئيسية',
      locationType: 'مكتب',
      meetingType: 'استشارة',
      meetingPurpose: 'مناقشة متطلبات المشروع الأولية',
      calledBy: {
        name: 'المهندس أحمد السعيد',
        role: 'مدير المشاريع'
      },
      attendees: [
        { name: 'أحمد السعيد', role: 'مدير المشاريع', type: 'موظف', attended: true },
        { name: clientName, role: 'المالك', type: 'عميل', attended: true },
        { name: 'نورة القحطاني', role: 'مصممة معمارية', type: 'موظف', attended: true },
      ],
      requestsToClient: [
        {
          id: 'RTC001',
          description: 'صورة من صك الملكية',
          type: 'مستند',
          priority: 'عاجل',
          deadline: '2025-01-20',
          status: 'مستلم',
          notes: 'تم الاستلام بتاريخ 2025-01-18'
        },
        {
          id: 'RTC002',
          description: 'الموافقة على التصميم المبدئي',
          type: 'موافقة',
          priority: 'عالي',
          deadline: '2025-01-25',
          status: 'معلق',
          notes: 'في انتظار مراجعة العميل'
        }
      ],
      requestsFromClient: [
        {
          id: 'RFC001',
          description: 'دراسة إضافة مسبح',
          type: 'استشارة',
          priority: 'متوسط',
          deadline: '2025-01-30',
          status: 'قيد التنفيذ',
          notes: 'جاري دراسة الجدوى الفنية',
          completionPercent: 60
        }
      ],
      meetingSummary: 'اجتماع ناجح ومثمر. تم مناقشة جميع المتطلبات وعرض نماذج مشابهة.',
      keyPoints: [
        'العميل يفضل التصميم العصري بلمسات تراثية',
        'الميزانية الإجمالية: 2.5 مليون ريال',
        'المدة المتوقعة: 18 شهراً'
      ],
      decisions: [
        'اعتماد التصميم المبدئي رقم 3',
        'البدء بإجراءات الترخيص فوراً'
      ],
      nextSteps: [
        'استلام صك الملكية',
        'إعداد العقد النهائي',
        'البدء برفع المخططات للبلدية'
      ],
      status: 'منعقد',
      meetingRating: 5
    },
    {
      id: 'MTG002',
      meetingNumber: 'MTG-2025-002',
      date: '2025-02-05',
      time: '14:00',
      duration: 60,
      location: 'موقع المشروع',
      locationType: 'موقع المشروع',
      meetingType: 'متابعة',
      meetingPurpose: 'جولة تفقدية في الموقع',
      calledBy: {
        name: 'المهندس خالد العتيبي',
        role: 'مدير التنفيذ'
      },
      attendees: [
        { name: 'خالد العتيبي', role: 'مدير التنفيذ', type: 'موظف', attended: false },
        { name: clientName, role: 'المالك', type: 'عميل', attended: false },
      ],
      requestsToClient: [],
      requestsFromClient: [
        {
          id: 'RFC002',
          description: 'تقرير التقدم الأسبوعي',
          type: 'تقرير',
          priority: 'عالي',
          deadline: '2025-02-10',
          status: 'معلق',
          notes: 'سيتم إرساله بعد الاجتماع',
          completionPercent: 0
        }
      ],
      meetingSummary: '',
      keyPoints: [],
      decisions: [],
      nextSteps: [],
      status: 'مجدول',
    },
  ], [clientName]);

  // دوال مساعدة
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'مجدول': '#3b82f6',
      'منعقد': '#10b981',
      'ملغي': '#ef4444',
      'مؤجل': '#f59e0b',
    };
    return colors[status] || '#6b7280';
  };

  const getRequestStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'معلق': '#6b7280',
      'قيد التنفيذ': '#3b82f6',
      'مستلم': '#10b981',
      'مكتمل': '#10b981',
      'ناقص': '#f59e0b',
      'مرفوض': '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  // الإحصائيات
  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'مجدول').length,
    completed: meetings.filter(m => m.status === 'منعقد').length,
    totalRequestsTo: meetings.reduce((sum, m) => sum + m.requestsToClient.length, 0),
    totalRequestsFrom: meetings.reduce((sum, m) => sum + m.requestsFromClient.length, 0),
    pendingRequestsTo: meetings.reduce((sum, m) => 
      sum + m.requestsToClient.filter(r => r.status === 'معلق').length, 0
    ),
  };

  return (
    <div className="space-y-2">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
            مقابلات العميل - المعاملة {transactionNumber}
          </h3>
          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            جميع المقابلات والاجتماعات المرتبطة بهذه المعاملة
          </p>
        </div>
        <Button 
          className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-3.5 w-3.5 ml-2" />
          مقابلة جديدة
        </Button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="stats-grid-6">
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إجمالي المقابلات
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.total}
                </p>
              </div>
              <Users className="stats-icon-compact text-[#2563eb] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  مجدولة
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.scheduled}
                </p>
              </div>
              <Calendar className="stats-icon-compact text-[#f59e0b] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  منعقدة
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  طلبات للعميل
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.totalRequestsTo}
                </p>
              </div>
              <ArrowRight className="stats-icon-compact text-indigo-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  طلبات من العميل
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.totalRequestsFrom}
                </p>
              </div>
              <ArrowLeft className="stats-icon-compact text-pink-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#ffedd5', '--bg-to': '#fed7aa', '--border-color': '#fdba74' } as React.CSSProperties}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  طلبات معلقة
                </p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {stats.pendingRequestsTo}
                </p>
              </div>
              <AlertCircle className="stats-icon-compact text-orange-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline المقابلات */}
      <Card className="card-rtl">
        <CardHeader className="card-header-dense">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تسلسل زمني للمقابلات
          </CardTitle>
        </CardHeader>
        <CardContent className="dense-card-content">
          <div className="relative pr-6" style={{ borderRight: '3px solid #e5e7eb' }}>
            {meetings
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((meeting) => (
                <div key={meeting.id} className="relative mb-4 pr-4">
                  {/* نقطة Timeline */}
                  <div
                    className="absolute"
                    style={{
                      right: '-9px',
                      top: '8px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(meeting.status),
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px #e5e7eb'
                    }}
                  />

                  {/* بطاقة المقابلة */}
                  <div
                    className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb'
                    }}
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setShowDetailsDialog(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              fontFamily: 'Courier New, monospace',
                              backgroundColor: 'rgba(37, 99, 235, 0.1)',
                              color: '#2563eb'
                            }}
                          >
                            {meeting.meetingNumber}
                          </span>
                          <Badge
                            style={{
                              backgroundColor: getStatusColor(meeting.status) + '20',
                              color: getStatusColor(meeting.status),
                              borderColor: getStatusColor(meeting.status)
                            }}
                            className="border text-[10px]"
                          >
                            {meeting.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {meeting.meetingType}
                          </Badge>
                        </div>
                        <h4
                          className="text-sm mb-1"
                          style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}
                        >
                          {meeting.meetingPurpose}
                        </h4>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {meeting.locationType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* المخرجات المختصرة */}
                    <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
                      {/* طلبات للعميل */}
                      {meeting.requestsToClient.length > 0 && (
                        <div>
                          <p className="text-[10px] mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', fontWeight: 600 }}>
                            طلبات للعميل ({meeting.requestsToClient.length})
                          </p>
                          <div className="space-y-0.5">
                            {meeting.requestsToClient.slice(0, 2).map((req) => (
                              <div
                                key={req.id}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getRequestStatusColor(req.status) }}
                                />
                                <span className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {req.description.substring(0, 25)}...
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* طلبات من العميل */}
                      {meeting.requestsFromClient.length > 0 && (
                        <div>
                          <p className="text-[10px] mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', fontWeight: 600 }}>
                            طلبات من العميل ({meeting.requestsFromClient.length})
                          </p>
                          <div className="space-y-0.5">
                            {meeting.requestsFromClient.slice(0, 2).map((req) => (
                              <div
                                key={req.id}
                                className="flex items-center gap-1"
                              >
                                <Progress value={req.completionPercent} className="h-1 w-8" />
                                <span className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {req.description.substring(0, 20)}...
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* نافذة إضافة مقابلة جديدة */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة مقابلة جديدة
            </DialogTitle>
            <DialogDescription className="dialog-description">
              تسجيل مقابلة جديدة مع العميل - المعاملة {transactionNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 form-rtl" style={{ padding: '16px 0' }}>
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="التاريخ *"
                id="date"
                type="date"
                copyable={false}
                clearable={true}
              />
              
              <InputWithCopy
                label="الوقت *"
                id="time"
                type="time"
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="المدة (بالدقائق) *"
                id="duration"
                type="number"
                placeholder="90"
                copyable={false}
                clearable={true}
              />

              <SelectWithCopy
                label="نوع المكان *"
                id="locationType"
                options={[
                  { value: 'مكتب', label: 'مكتب' },
                  { value: 'موقع المشروع', label: 'موقع المشروع' },
                  { value: 'مكتب العميل', label: 'مكتب العميل' },
                  { value: 'عن بُعد', label: 'عن بُعد' },
                  { value: 'أخرى', label: 'أخرى' },
                ]}
                copyable={false}
                clearable={true}
              />
            </div>

            <InputWithCopy
              label="المكان *"
              id="location"
              placeholder="قاعة الاجتماعات الرئيسية"
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="نوع المقابلة *"
              id="meetingType"
              options={[
                { value: 'استشارة', label: 'استشارة' },
                { value: 'متابعة', label: 'متابعة' },
                { value: 'عرض مشروع', label: 'عرض مشروع' },
                { value: 'تسليم', label: 'تسليم' },
                { value: 'توقيع عقد', label: 'توقيع عقد' },
                { value: 'شكوى', label: 'شكوى' },
                { value: 'أخرى', label: 'أخرى' },
              ]}
              copyable={false}
              clearable={true}
            />

            <TextAreaWithCopy
              label="الغرض من المقابلة *"
              id="purpose"
              rows={2}
              placeholder="اكتب الغرض من المقابلة..."
              copyable={true}
              clearable={true}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="dense-button"
            >
              إلغاء
            </Button>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              onClick={() => {
                toast.success('تم حفظ المقابلة بنجاح');
                setShowAddDialog(false);
              }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ المقابلة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل المقابلة */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl dialog-rtl" style={{ direction: 'rtl', maxHeight: '90vh', overflow: 'auto' }}>
          {selectedMeeting && (
            <>
              <DialogHeader className="dialog-header">
                <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تفاصيل المقابلة - {selectedMeeting.meetingNumber}
                </DialogTitle>
                <DialogDescription className="dialog-description">
                  جميع معلومات المقابلة والمخرجات
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3" style={{ padding: '16px 0' }}>
                {/* معلومات أساسية */}
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المعلومات الأساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          التاريخ والوقت
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.date} - {selectedMeeting.time}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          المدة
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.duration} دقيقة
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          المكان
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* الطلبات للعميل */}
                {selectedMeeting.requestsToClient.length > 0 && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        طلبات للعميل ({selectedMeeting.requestsToClient.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <Table className="table-rtl dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموعد</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedMeeting.requestsToClient.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {request.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="text-[10px]">
                                  {request.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                  style={{
                                    backgroundColor: request.priority === 'عاجل' ? '#fee2e2' : '#fef3c7',
                                    borderColor: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b',
                                    color: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b'
                                  }}
                                >
                                  {request.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs font-mono">
                                {request.deadline}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  style={{
                                    backgroundColor: getRequestStatusColor(request.status) + '20',
                                    color: getRequestStatusColor(request.status),
                                    borderColor: getRequestStatusColor(request.status)
                                  }}
                                  className="border text-[10px]"
                                >
                                  {request.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* الطلبات من العميل */}
                {selectedMeeting.requestsFromClient.length > 0 && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        طلبات من العميل ({selectedMeeting.requestsFromClient.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <div className="space-y-2">
                        {selectedMeeting.requestsFromClient.map((request) => (
                          <div
                            key={request.id}
                            className="p-3 rounded"
                            style={{
                              backgroundColor: '#f8fafc',
                              border: `2px solid ${getRequestStatusColor(request.status)}40`
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                  {request.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                                  <Badge variant="outline" className="text-[9px]">
                                    {request.type}
                                  </Badge>
                                  <span>•</span>
                                  <span>موعد: {request.deadline}</span>
                                </div>
                              </div>
                              <Badge
                                style={{
                                  backgroundColor: getRequestStatusColor(request.status) + '20',
                                  color: getRequestStatusColor(request.status),
                                  borderColor: getRequestStatusColor(request.status)
                                }}
                                className="border text-xs"
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={request.completionPercent} className="h-2 flex-1" />
                              <span className="text-xs font-mono" style={{ minWidth: '40px' }}>
                                {request.completionPercent}%
                              </span>
                            </div>
                            {request.notes && (
                              <p className="text-xs p-2 rounded mt-2" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#ffffff', color: '#6b7280' }}>
                                {request.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* الملخص */}
                {selectedMeeting.meetingSummary && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ملخص المقابلة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <p className="text-sm p-3 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', lineHeight: '1.8' }}>
                        {selectedMeeting.meetingSummary}
                      </p>

                      {selectedMeeting.keyPoints.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            النقاط الرئيسية:
                          </h4>
                          <ul className="space-y-1 pr-5" style={{ listStyleType: 'disc' }}>
                            {selectedMeeting.keyPoints.map((point, idx) => (
                              <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                  className="dense-button"
                >
                  إغلاق
                </Button>
                <Button className="dense-button bg-[#2563eb] hover:bg-[#1e40af] text-white">
                  <Edit className="h-3.5 w-3.5 ml-2" />
                  تعديل
                </Button>
                <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                  <Download className="h-3.5 w-3.5 ml-2" />
                  طباعة
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_49_ClientMeetings;
