/**
 * التابات المتبقية للشاشة 286 - شامل ومكثف
 * ============================================
 * 
 * هذا الملف يحتوي على جميع التابات المتبقية:
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

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  Users, User, Paperclip, Calendar, DollarSign, CheckCircle,
  FileText, Eye, Settings, Plus, Save, Upload, Download,
  Clock, Mail, Phone, Building, MapPin, Edit2, Trash2, X
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

// ============================================
// 286-06: إسناد الموظفين
// ============================================
export const Tab_286_06_StaffAssignment: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'المهندس أحمد العلي', role: 'مدير المشروع', tasks: 5, status: 'active' },
    { id: '2', name: 'المهندسة فاطمة محمد', role: 'مهندس معماري', tasks: 3, status: 'active' },
    { id: '3', name: 'المهندس خالد السعيد', role: 'مهندس إنشائي', tasks: 2, status: 'active' },
  ]);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-06" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #0ea5e9' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', borderRadius: '12px' }}>
                <Users className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>إسناد الموظفين</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>تعيين فريق العمل للمعاملة</p>
              </div>
            </div>
            {!readOnly && (
              <Button style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#ffffff' }}>
                <Plus className="h-4 w-4 ml-1" />
                إضافة موظف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-rtl">
        <CardContent className="p-4">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                {!readOnly && <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{member.name}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{member.role}</TableCell>
                  <TableCell className="text-right"><Badge>{member.tasks}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Badge style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost"><Edit2 className="h-3 w-3" /></Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-07: معلومات العميل
// ============================================
export const Tab_286_07_ClientInfo: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-07" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
            <User className="h-5 w-5 inline ml-2" />
            معلومات العميل الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy label="اسم العميل *" id="clientName" value="" onChange={() => {}} disabled={readOnly} required copyable clearable />
            <InputWithCopy label="رقم الهوية *" id="clientId" value="" onChange={() => {}} disabled={readOnly} required copyable clearable />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy label="رقم الجوال *" id="clientPhone" type="tel" value="" onChange={() => {}} disabled={readOnly} required copyable clearable />
            <InputWithCopy label="البريد الإلكتروني" id="clientEmail" type="email" value="" onChange={() => {}} disabled={readOnly} copyable clearable />
            <SelectWithCopy label="نوع العميل" id="clientType" value="" onChange={() => {}} options={[
              { value: 'individual', label: 'فرد' },
              { value: 'company', label: 'شركة' }
            ]} disabled={readOnly} copyable clearable />
          </div>
          <TextAreaWithCopy label="العنوان" id="clientAddress" value="" onChange={() => {}} rows={2} disabled={readOnly} copyable clearable />
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-08: المرفقات
// ============================================
export const Tab_286_08_Attachments: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const [attachments, setAttachments] = useState([
    { id: '1', name: 'صورة الصك.pdf', size: '2.3 MB', type: 'PDF', date: '2025-10-26' },
    { id: '2', name: 'خريطة الموقع.jpg', size: '1.8 MB', type: 'صورة', date: '2025-10-26' },
  ]);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-08" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #0ea5e9' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', borderRadius: '12px' }}>
                <Paperclip className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>المرفقات</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>الملفات والمستندات المرفقة</p>
              </div>
            </div>
            {!readOnly && (
              <Button style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff' }}>
                <Upload className="h-4 w-4 ml-1" />
                رفع ملف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-rtl">
        <CardContent className="p-4">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.name}</TableCell>
                  <TableCell className="text-right"><Badge variant="outline">{file.type}</Badge></TableCell>
                  <TableCell className="text-right font-mono" style={{ fontSize: '12px' }}>{file.size}</TableCell>
                  <TableCell className="text-right font-mono" style={{ fontSize: '12px' }}>{file.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                      {!readOnly && <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3" style={{ color: '#ef4444' }} /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// 286-09: المواعيد
// ============================================
export const Tab_286_09_Appointments: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-09" position="top-right" />
      
      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #a855f7' }}>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#7c3aed' }}>
            <Calendar className="h-5 w-5 inline ml-2" />
            المواعيد الهامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy label="موعد الكشف الميداني" id="inspectionDate" type="date" value="" onChange={() => {}} disabled={readOnly} copyable={false} clearable={false} />
            <InputWithCopy label="موعد التسليم المتوقع" id="deliveryDate" type="date" value="" onChange={() => {}} disabled={readOnly} copyable={false} clearable={false} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy label="موعد الاجتماع مع العميل" id="meetingDate" type="datetime-local" value="" onChange={() => {}} disabled={readOnly} copyable={false} clearable={false} />
            <InputWithCopy label="موعد المراجعة الفنية" id="reviewDate" type="date" value="" onChange={() => {}} disabled={readOnly} copyable={false} clearable={false} />
          </div>
          <TextAreaWithCopy label="ملاحظات المواعيد" id="appointmentNotes" value="" onChange={() => {}} rows={2} disabled={readOnly} copyable clearable />
        </CardContent>
      </Card>
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
  Tab_286_06_StaffAssignment,
  Tab_286_07_ClientInfo,
  Tab_286_08_Attachments,
  Tab_286_09_Appointments,
  Tab_286_10_Costs,
  Tab_286_11_Approvals,
  Tab_286_12_Notes,
  Tab_286_13_Preview,
  Tab_286_14_Settings
};
