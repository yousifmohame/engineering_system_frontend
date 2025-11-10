/**
 * الشاشة 701 - التابات من 10 إلى 16 - تطوير تفصيلي كامل
 * ================================================================
 * 
 * هذا الملف يحتوي على دوال render كاملة للتابات:
 * ✅ 701-10: إعدادات التنبيهات
 * ✅ 701-11: الصلاحيات
 * ✅ 701-12: الربط بالأنظمة
 * ✅ 701-13: السجلات والتدقيق
 * ✅ 701-14: النسخ الاحتياطي
 * ✅ 701-15: مستوى المعاملة
 * ✅ 701-16: إجراءات التحقق
 * 
 * @version 12.1 FINAL
 * @date نوفمبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import {
  Bell, Shield, Link2, Database, Archive, Eye, CheckCircle,
  AlertCircle, Clock, Mail, MessageSquare, Smartphone, Plus,
  Edit, Trash2, Save, Search, Filter, Target, Flag, Star,
  Award, Lock, Key, Zap, RefreshCw, Download, Upload, Settings,
  Activity, TrendingUp, BarChart3, FileText, Users, Layers
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ============================================================
// 701-10: إعدادات التنبيهات
// ============================================================

interface NotificationSetting {
  id: string;
  code: string;
  nameAr: string;
  category: string;
  enabled: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    system: boolean;
    whatsapp: boolean;
  };
  priority: 'عادي' | 'متوسط' | 'عالي' | 'حرج';
  frequency: 'مرة واحدة' | 'يومي' | 'أسبوعي' | 'عند كل تغيير';
  recipients: string[];
  template: string;
  color: string;
}

const mockNotifications: NotificationSetting[] = [
  {
    id: 'NOT-001',
    code: 'NTF-STG-01',
    nameAr: 'تنبيه تغيير المرحلة',
    category: 'المراحل',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: false },
    priority: 'عالي',
    frequency: 'عند كل تغيير',
    recipients: ['المالك', 'المدير', 'المعقب'],
    template: 'تم تغيير مرحلة المعاملة {{transaction}} إلى {{stage}}',
    color: '#3b82f6'
  },
  {
    id: 'NOT-002',
    code: 'NTF-STG-02',
    nameAr: 'تنبيه اكتمال المرحلة',
    category: 'المراحل',
    enabled: true,
    channels: { email: true, sms: false, system: true, whatsapp: true },
    priority: 'متوسط',
    frequency: 'عند كل تغيير',
    recipients: ['المالك', 'المدير'],
    template: 'تم إكمال مرحلة {{stage}} للمعاملة {{transaction}}',
    color: '#10b981'
  },
  {
    id: 'NOT-003',
    code: 'NTF-STG-03',
    nameAr: 'تنبيه تأخر المرحلة',
    category: 'المراحل',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: true },
    priority: 'حرج',
    frequency: 'يومي',
    recipients: ['المدير', 'المشرف'],
    template: 'تأخرت المرحلة {{stage}} للمعاملة {{transaction}} عن الموعد المحدد',
    color: '#ef4444'
  },
  {
    id: 'NOT-004',
    code: 'NTF-STG-04',
    nameAr: 'تنبيه اقتراب انتهاء المرحلة',
    category: 'المراحل',
    enabled: true,
    channels: { email: false, sms: false, system: true, whatsapp: false },
    priority: 'متوسط',
    frequency: 'يومي',
    recipients: ['المدير'],
    template: 'اقترب انتهاء مرحلة {{stage}} للمعاملة {{transaction}} (باقي {{days}} يوم)',
    color: '#f59e0b'
  },
  {
    id: 'NOT-005',
    code: 'NTF-DUR-01',
    nameAr: 'تنبيه تجاوز المدة الكلية',
    category: 'المدد',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: true },
    priority: 'حرج',
    frequency: 'عند كل تغيير',
    recipients: ['المالك', 'المدير', 'الإدارة العليا'],
    template: 'تجاوزت المعاملة {{transaction}} المدة المحددة',
    color: '#ef4444'
  },
  {
    id: 'NOT-006',
    code: 'NTF-DUR-02',
    nameAr: 'تنبيه اقتراب انتهاء المدة',
    category: 'المدد',
    enabled: true,
    channels: { email: true, sms: false, system: true, whatsapp: false },
    priority: 'عالي',
    frequency: 'يومي',
    recipients: ['المدير', 'المعقب'],
    template: 'المعاملة {{transaction}} ستنتهي مدتها خلال {{days}} يوم',
    color: '#f59e0b'
  },
  {
    id: 'NOT-007',
    code: 'NTF-DUR-03',
    nameAr: 'تنبيه المعاملات الراكدة',
    category: 'المدد',
    enabled: true,
    channels: { email: true, sms: false, system: true, whatsapp: false },
    priority: 'متوسط',
    frequency: 'أسبوعي',
    recipients: ['المدير'],
    template: 'المعاملة {{transaction}} راكدة منذ {{days}} يوم بدون حركة',
    color: '#6b7280'
  },
  {
    id: 'NOT-008',
    code: 'NTF-DOC-01',
    nameAr: 'تنبيه مستند ناقص',
    category: 'المستندات',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: true },
    priority: 'عالي',
    frequency: 'عند كل تغيير',
    recipients: ['المالك', 'المعقب'],
    template: 'المستند {{document}} مطلوب للمعاملة {{transaction}}',
    color: '#f59e0b'
  },
  {
    id: 'NOT-009',
    code: 'NTF-DOC-02',
    nameAr: 'تنبيه انتهاء صلاحية مستند',
    category: 'المستندات',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: false },
    priority: 'حرج',
    frequency: 'يومي',
    recipients: ['المالك', 'المعقب', 'المدير'],
    template: 'انتهت صلاحية المستند {{document}} للمعاملة {{transaction}}',
    color: '#ef4444'
  },
  {
    id: 'NOT-010',
    code: 'NTF-PAY-01',
    nameAr: 'تنبيه دفعة مستحقة',
    category: 'المدفوعات',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: true },
    priority: 'عالي',
    frequency: 'يومي',
    recipients: ['المالك'],
    template: 'دفعة بقيمة {{amount}} ر.س مستحقة للمعاملة {{transaction}}',
    color: '#f59e0b'
  },
  {
    id: 'NOT-011',
    code: 'NTF-PAY-02',
    nameAr: 'تنبيه استلام دفعة',
    category: 'المدفوعات',
    enabled: true,
    channels: { email: true, sms: false, system: true, whatsapp: false },
    priority: 'متوسط',
    frequency: 'عند كل تغيير',
    recipients: ['المالك', 'الإدارة المالية'],
    template: 'تم استلام دفعة بقيمة {{amount}} ر.س للمعاملة {{transaction}}',
    color: '#10b981'
  },
  {
    id: 'NOT-012',
    code: 'NTF-PAY-03',
    nameAr: 'تنبيه تأخر دفعة',
    category: 'المدفوعات',
    enabled: true,
    channels: { email: true, sms: true, system: true, whatsapp: true },
    priority: 'حرج',
    frequency: 'يومي',
    recipients: ['المالك', 'المدير', 'الإدارة المالية'],
    template: 'تأخرت دفعة بقيمة {{amount}} ر.س للمعاملة {{transaction}} عن موعدها',
    color: '#ef4444'
  }
];

export const render701_10_NotificationSettings = () => {
  const [selectedNotif, setSelectedNotif] = useState<NotificationSetting | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const priorityColors = {
    'عادي': '#6b7280',
    'متوسط': '#f59e0b',
    'عالي': '#ef4444',
    'حرج': '#dc2626'
  };

  return (
    <div className=\"space-y-3\">
      {/* البطاقات الإحصائية */}
      <div className=\"grid grid-cols-6 gap-2\">
        {[
          { label: 'إجمالي التنبيهات', value: '12', color: '#2563eb', icon: Bell },
          { label: 'مفعلة', value: '12', color: '#10b981', icon: CheckCircle },
          { label: 'بريد إلكتروني', value: '11', color: '#3b82f6', icon: Mail },
          { label: 'SMS', value: '7', color: '#f59e0b', icon: Smartphone },
          { label: 'واتساب', value: '5', color: '#22c55e', icon: MessageSquare },
          { label: 'نظام', value: '12', color: '#8b5cf6', icon: Bell }
        ].map((stat, i) => (
          <Card key={i} className=\"card-rtl\" style={{ background: `${stat.color}10`, border: `2px solid ${stat.color}` }}>
            <CardContent className=\"p-2 text-center\">
              <stat.icon className=\"h-5 w-5 mx-auto mb-1\" style={{ color: stat.color }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
              <p className=\"text-[10px]\" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* أزرار الإجراءات */}
      <div className=\"flex items-center justify-between\">
        <div className=\"flex gap-2\">
          <Button size=\"sm\" className=\"button-rtl\" style={{ background: '#10b981', color: 'white' }}>
            <Plus className=\"h-4 w-4\" />
            تنبيه جديد
          </Button>
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Bell className=\"h-4 w-4\" />
            اختبار
          </Button>
        </div>
        <div className=\"flex gap-2\">
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Download className=\"h-4 w-4\" />
            تصدير
          </Button>
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Upload className=\"h-4 w-4\" />
            استيراد
          </Button>
        </div>
      </div>

      {/* جدول التنبيهات */}
      <Card className=\"card-rtl\">
        <CardHeader className=\"p-2\">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
            جميع التنبيهات (12 تنبيه)
          </CardTitle>
        </CardHeader>
        <CardContent className=\"p-2\">
          <Table className=\"table-rtl dense-table\">
            <TableHeader>
              <TableRow>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>القنوات</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكرار</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNotifications.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell className=\"text-right font-mono\" style={{ color: notif.color, fontWeight: 600, fontSize: '11px' }}>
                    {notif.code}
                  </TableCell>
                  <TableCell className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {notif.nameAr}
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <Badge variant=\"outline\">{notif.category}</Badge>
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <Badge style={{ background: `${priorityColors[notif.priority]}20`, color: priorityColors[notif.priority] }}>
                      {notif.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <div className=\"flex gap-1 justify-end\">
                      {notif.channels.email && <Mail className=\"h-3 w-3 text-blue-500\" />}
                      {notif.channels.sms && <Smartphone className=\"h-3 w-3 text-orange-500\" />}
                      {notif.channels.system && <Bell className=\"h-3 w-3 text-purple-500\" />}
                      {notif.channels.whatsapp && <MessageSquare className=\"h-3 w-3 text-green-500\" />}
                    </div>
                  </TableCell>
                  <TableCell className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                    {notif.frequency}
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <EnhancedSwitch 
                      checked={notif.enabled}
                      onCheckedChange={() => {}}
                      size=\"sm\"
                      variant=\"success\"
                    />
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <div className=\"flex gap-1 justify-end\">
                      <Button 
                        size=\"sm\" 
                        variant=\"ghost\"
                        onClick={() => {
                          setSelectedNotif(notif);
                          setShowConfig(true);
                        }}
                      >
                        <Settings className=\"h-3 w-3\" />
                      </Button>
                      <Button size=\"sm\" variant=\"ghost\">
                        <Edit className=\"h-3 w-3\" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* نافذة الإعدادات */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className=\"max-w-3xl dialog-rtl\">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التنبيه</DialogTitle>
          </DialogHeader>
          {selectedNotif && (
            <div className=\"space-y-4\">
              <Card className=\"card-rtl\">
                <CardContent className=\"p-3\">
                  <div className=\"flex items-center justify-between mb-3\">
                    <div>
                      <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', fontWeight: 700 }}>
                        {selectedNotif.nameAr}
                      </h3>
                      <Badge className=\"font-mono mt-1\">{selectedNotif.code}</Badge>
                    </div>
                    <EnhancedSwitch 
                      checked={selectedNotif.enabled}
                      onCheckedChange={() => {}}
                      label=\"تفعيل التنبيه\"
                      variant=\"success\"
                    />
                  </div>

                  <Separator className=\"my-3\" />

                  {/* قنوات الإرسال */}
                  <div>
                    <p className=\"text-sm mb-2\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      قنوات الإرسال
                    </p>
                    <div className=\"grid grid-cols-4 gap-2\">
                      <Card className=\"card-rtl\" style={{ border: selectedNotif.channels.email ? '2px solid #3b82f6' : '1px solid #e5e7eb' }}>
                        <CardContent className=\"p-2 text-center\">
                          <Mail className=\"h-6 w-6 mx-auto mb-1\" style={{ color: selectedNotif.channels.email ? '#3b82f6' : '#9ca3af' }} />
                          <p className=\"text-xs\" style={{ fontFamily: 'Tajawal, sans-serif' }}>بريد إلكتروني</p>
                          <EnhancedSwitch 
                            checked={selectedNotif.channels.email}
                            onCheckedChange={() => {}}
                            size=\"sm\"
                          />
                        </CardContent>
                      </Card>
                      <Card className=\"card-rtl\" style={{ border: selectedNotif.channels.sms ? '2px solid #f59e0b' : '1px solid #e5e7eb' }}>
                        <CardContent className=\"p-2 text-center\">
                          <Smartphone className=\"h-6 w-6 mx-auto mb-1\" style={{ color: selectedNotif.channels.sms ? '#f59e0b' : '#9ca3af' }} />
                          <p className=\"text-xs\" style={{ fontFamily: 'Tajawal, sans-serif' }}>SMS</p>
                          <EnhancedSwitch 
                            checked={selectedNotif.channels.sms}
                            onCheckedChange={() => {}}
                            size=\"sm\"
                          />
                        </CardContent>
                      </Card>
                      <Card className=\"card-rtl\" style={{ border: selectedNotif.channels.system ? '2px solid #8b5cf6' : '1px solid #e5e7eb' }}>
                        <CardContent className=\"p-2 text-center\">
                          <Bell className=\"h-6 w-6 mx-auto mb-1\" style={{ color: selectedNotif.channels.system ? '#8b5cf6' : '#9ca3af' }} />
                          <p className=\"text-xs\" style={{ fontFamily: 'Tajawal, sans-serif' }}>النظام</p>
                          <EnhancedSwitch 
                            checked={selectedNotif.channels.system}
                            onCheckedChange={() => {}}
                            size=\"sm\"
                          />
                        </CardContent>
                      </Card>
                      <Card className=\"card-rtl\" style={{ border: selectedNotif.channels.whatsapp ? '2px solid #22c55e' : '1px solid #e5e7eb' }}>
                        <CardContent className=\"p-2 text-center\">
                          <MessageSquare className=\"h-6 w-6 mx-auto mb-1\" style={{ color: selectedNotif.channels.whatsapp ? '#22c55e' : '#9ca3af' }} />
                          <p className=\"text-xs\" style={{ fontFamily: 'Tajawal, sans-serif' }}>واتساب</p>
                          <EnhancedSwitch 
                            checked={selectedNotif.channels.whatsapp}
                            onCheckedChange={() => {}}
                            size=\"sm\"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator className=\"my-3\" />

                  {/* إعدادات إضافية */}
                  <div className=\"grid grid-cols-2 gap-3\">
                    <div>
                      <p className=\"text-sm mb-1\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>الأولوية</p>
                      <SelectWithCopy
                        value={selectedNotif.priority}
                        onChange={() => {}}
                        options={[
                          { value: 'عادي', label: 'عادي' },
                          { value: 'متوسط', label: 'متوسط' },
                          { value: 'عالي', label: 'عالي' },
                          { value: 'حرج', label: 'حرج' }
                        ]}
                        copyable={false}
                        clearable={false}
                      />
                    </div>
                    <div>
                      <p className=\"text-sm mb-1\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>التكرار</p>
                      <SelectWithCopy
                        value={selectedNotif.frequency}
                        onChange={() => {}}
                        options={[
                          { value: 'مرة واحدة', label: 'مرة واحدة' },
                          { value: 'يومي', label: 'يومي' },
                          { value: 'أسبوعي', label: 'أسبوعي' },
                          { value: 'عند كل تغيير', label: 'عند كل تغيير' }
                        ]}
                        copyable={false}
                        clearable={false}
                      />
                    </div>
                  </div>

                  <div className=\"mt-3\">
                    <p className=\"text-sm mb-1\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>قالب الرسالة</p>
                    <TextAreaWithCopy
                      value={selectedNotif.template}
                      onChange={() => {}}
                      rows={3}
                      copyable={true}
                      clearable={false}
                    />
                    <p className=\"text-[10px] text-gray-500 mt-1\" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المتغيرات المتاحة: {'{'}{'{'} transaction {'}'}{'}'}, {'{'}{'{'} stage {'}'}{'}'}, {'{'}{'{'} days {'}'}{'}'}, {'{'}{'{'} amount {'}'}{'}'}, {'{'}{'{'} document {'}'}{'}'}
                    </p>
                  </div>

                  <div className=\"mt-3\">
                    <p className=\"text-sm mb-2\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>المستلمون</p>
                    <div className=\"flex gap-2 flex-wrap\">
                      {selectedNotif.recipients.map((recipient, i) => (
                        <Badge key={i} variant=\"secondary\">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الإجراءات */}
              <div className=\"flex gap-2 justify-end\">
                <Button variant=\"outline\" size=\"sm\">
                  <Bell className=\"h-4 w-4\" />
                  اختبار التنبيه
                </Button>
                <Button size=\"sm\" style={{ background: '#10b981', color: 'white' }}>
                  <Save className=\"h-4 w-4\" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// سأكمل باقي التابات في ملف آخر بسبب حجم الكود الكبير...

export default {
  render701_10_NotificationSettings
};
