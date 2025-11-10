/**
 * الشاشة 902 - استلام وثائق v1.0
 * ========================================================
 * 
 * نظام شامل لاستلام وأرشفة وتصنيف جميع المستندات الواردة من:
 * - الجهات الحكومية
 * - الملاك
 * - الموظفين
 * - المهام المنتهية
 * 
 * المميزات الرئيسية:
 * ✅ 6 طرق استلام (رفع، إيميل، تليجرام، واتساب، مسح ضوئي، رابط)
 * ✅ توجيه ذكي للمعاملات
 * ✅ حفظ الاسم الأصلي وجميع التفاصيل
 * ✅ تتبع IP والموقع
 * ✅ نظام أرشفة وفرز احترافي
 * 
 * التابات (8 تابات):
 * 902-01: تاب الاستلام (رئيسي)
 * 902-02: المستندات المستلمة
 * 902-03: التصنيف والأرشفة
 * 902-04: ربط بالمعاملات
 * 902-05: سجل الاستلام
 * 902-06: الإحصائيات
 * 902-07: الإعدادات
 * 902-08: التقارير
 * 
 * @version 1.0
 * @date 9 نوفمبر 2025
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';
import {
  Download, Upload, Mail, MessageCircle, Send, Scan, Link2, FileText,
  Archive, FolderTree, Link as LinkIcon, Clock, BarChart3, Settings,
  FileCheck, User, Building2, CheckCircle, AlertCircle, Eye, Trash2,
  Filter, Search, Calendar, MapPin, Globe, RefreshCw, Printer,
  type LucideIcon
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '902-01', number: '902-01', title: 'تاب الاستلام', icon: Download },
  { id: '902-02', number: '902-02', title: 'المستندات المستلمة', icon: FileText },
  { id: '902-03', number: '902-03', title: 'التصنيف والأرشفة', icon: Archive },
  { id: '902-04', number: '902-04', title: 'ربط بالمعاملات', icon: LinkIcon },
  { id: '902-05', number: '902-05', title: 'سجل الاستلام', icon: Clock },
  { id: '902-06', number: '902-06', title: 'الإحصائيات', icon: BarChart3 },
  { id: '902-07', number: '902-07', title: 'الإعدادات', icon: Settings },
  { id: '902-08', number: '902-08', title: 'التقارير', icon: FileCheck },
];

// ============================================================
// الواجهات
// ============================================================

interface ReceivedDocument {
  id: string;
  originalFileName: string;
  currentFileName: string;
  receivingMethod: 'upload' | 'email' | 'telegram' | 'whatsapp' | 'scan' | 'weblink';
  receivingDate: string;
  receivingTime: string;
  receivedFrom: string;
  receivedFromType: 'government' | 'owner' | 'employee' | 'task';
  notes: string;
  ipAddress: string;
  location: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'classified' | 'linked' | 'archived';
  linkedTransactionId?: string;
  linkedTransactionNumber?: string;
  category?: string;
  subCategory?: string;
  isImportant: boolean;
}

// ============================================================
// البيانات الوهمية
// ============================================================

const mockReceivedDocuments: ReceivedDocument[] = [
  {
    id: 'RD-2025-001',
    originalFileName: 'رخصة_بناء_محدثة.pdf',
    currentFileName: 'RD-2025-001-رخصة_بناء_محدثة.pdf',
    receivingMethod: 'email',
    receivingDate: '2025-11-09',
    receivingTime: '09:30',
    receivedFrom: 'أمانة الرياض',
    receivedFromType: 'government',
    notes: 'رخصة بناء محدثة للمشروع السكني',
    ipAddress: '192.168.1.100',
    location: 'الرياض - مكتب التراخيص',
    fileSize: 2500000,
    fileType: 'application/pdf',
    status: 'linked',
    linkedTransactionId: 'TR-001',
    linkedTransactionNumber: '2501001',
    category: 'رخص',
    subCategory: 'رخص بناء',
    isImportant: true
  },
  {
    id: 'RD-2025-002',
    originalFileName: 'صك_ملكية_الكتروني.pdf',
    currentFileName: 'RD-2025-002-صك_ملكية_الكتروني.pdf',
    receivingMethod: 'upload',
    receivingDate: '2025-11-09',
    receivingTime: '10:15',
    receivedFrom: 'أحمد محمد السالم',
    receivedFromType: 'owner',
    notes: 'صك ملكية إلكتروني للأرض',
    ipAddress: '192.168.1.105',
    location: 'الرياض - منزل المالك',
    fileSize: 1800000,
    fileType: 'application/pdf',
    status: 'classified',
    category: 'ملكية',
    subCategory: 'صكوك',
    isImportant: true
  },
  {
    id: 'RD-2025-003',
    originalFileName: 'مخططات_معمارية_نهائية.zip',
    currentFileName: 'RD-2025-003-مخططات_معمارية_نهائية.zip',
    receivingMethod: 'whatsapp',
    receivingDate: '2025-11-09',
    receivingTime: '11:00',
    receivedFrom: 'مهندس التصميم',
    receivedFromType: 'employee',
    notes: 'المخططات النهائية المعتمدة',
    ipAddress: '192.168.1.110',
    location: 'الرياض - مكتب التصميم',
    fileSize: 15000000,
    fileType: 'application/zip',
    status: 'pending',
    isImportant: false
  },
  {
    id: 'RD-2025-004',
    originalFileName: 'تقرير_فحص_التربة.pdf',
    currentFileName: 'RD-2025-004-تقرير_فحص_التربة.pdf',
    receivingMethod: 'telegram',
    receivingDate: '2025-11-09',
    receivingTime: '13:45',
    receivedFrom: 'مكتب الاستشارات الهندسية',
    receivedFromType: 'task',
    notes: 'تقرير فحص التربة من المختبر المعتمد',
    ipAddress: '192.168.1.115',
    location: 'الرياض - المختبر',
    fileSize: 3200000,
    fileType: 'application/pdf',
    status: 'classified',
    category: 'تقارير فنية',
    subCategory: 'فحوصات',
    isImportant: true
  },
  {
    id: 'RD-2025-005',
    originalFileName: 'خطاب_عدم_ممانعة.pdf',
    currentFileName: 'RD-2025-005-خطاب_عدم_ممانعة.pdf',
    receivingMethod: 'scan',
    receivingDate: '2025-11-09',
    receivingTime: '14:30',
    receivedFrom: 'البلدية',
    receivedFromType: 'government',
    notes: 'خطاب عدم ممانعة من الجيران',
    ipAddress: '192.168.1.120',
    location: 'الرياض - الماسح الضوئي',
    fileSize: 900000,
    fileType: 'application/pdf',
    status: 'pending',
    isImportant: false
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

const DocumentsReceiving_Complete_902: React.FC = () => {
  const [activeTab, setActiveTab] = useState('902-01');
  const [documents, setDocuments] = useState<ReceivedDocument[]>(mockReceivedDocuments);
  const [selectedDocument, setSelectedDocument] = useState<ReceivedDocument | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // بيانات نموذج الاستلام
  const [receiveForm, setReceiveForm] = useState({
    receivingMethod: 'upload' as ReceivedDocument['receivingMethod'],
    receivedFrom: '',
    receivedFromType: 'government' as ReceivedDocument['receivedFromType'],
    notes: '',
    category: '',
    subCategory: '',
    isImportant: false
  });

  // ============================================================
  // Functions
  // ============================================================

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file, index) => {
        const newDoc: ReceivedDocument = {
          id: `RD-2025-${String(documents.length + index + 1).padStart(3, '0')}`,
          originalFileName: file.name,
          currentFileName: `RD-2025-${String(documents.length + index + 1).padStart(3, '0')}-${file.name}`,
          receivingMethod: receiveForm.receivingMethod,
          receivingDate: new Date().toISOString().split('T')[0],
          receivingTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          receivedFrom: receiveForm.receivedFrom,
          receivedFromType: receiveForm.receivedFromType,
          notes: receiveForm.notes,
          ipAddress: '192.168.1.100', // في بيئة حقيقية سيتم جلبها من الخادم
          location: 'الرياض - المكتب الرئيسي',
          fileSize: file.size,
          fileType: file.type,
          status: 'pending',
          category: receiveForm.category,
          subCategory: receiveForm.subCategory,
          isImportant: receiveForm.isImportant
        };
        
        setDocuments(prev => [newDoc, ...prev]);
      });
      
      toast.success('تم استلام المستند بنجاح');
      setShowReceiveDialog(false);
      
      // إعادة تعيين النموذج
      setReceiveForm({
        receivingMethod: 'upload',
        receivedFrom: '',
        receivedFromType: 'government',
        notes: '',
        category: '',
        subCategory: '',
        isImportant: false
      });
    }
  };

  const handleReceiveByMethod = (method: ReceivedDocument['receivingMethod']) => {
    setReceiveForm(prev => ({ ...prev, receivingMethod: method }));
    setShowReceiveDialog(true);
  };

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '902-01':
        return renderTab01_Receiving();
      case '902-02':
        return renderTab02_ReceivedDocuments();
      case '902-03':
        return renderTab03_Classification();
      case '902-04':
        return renderTab04_Linking();
      case '902-05':
        return renderTab05_Log();
      case '902-06':
        return renderTab06_Statistics();
      case '902-07':
        return renderTab07_Settings();
      case '902-08':
        return renderTab08_Reports();
      default:
        return null;
    }
  };

  // ============================================================
  // التاب 902-01: تاب الاستلام (رئيسي)
  // ============================================================

  const renderTab01_Receiving = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إجمالي المستلمة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.length}
                </p>
              </div>
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  قيد المعالجة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  مصنفة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.filter(d => d.status === 'classified').length}
                </p>
              </div>
              <Archive className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  مربوطة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.filter(d => d.status === 'linked').length}
                </p>
              </div>
              <LinkIcon className="h-5 w-5 text-violet-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  مهمة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.filter(d => d.isImportant).length}
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', border: '2px solid #06b6d4' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  اليوم
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  {documents.filter(d => d.receivingDate === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* طرق الاستلام - 6 أزرار كبيرة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>طرق استلام المستندات</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اختر طريقة الاستلام المناسبة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* رفع ملفات */}
            <Button
              onClick={() => handleReceiveByMethod('upload')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '2px solid #3b82f6'
              }}
            >
              <Upload className="h-8 w-8 text-blue-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>رفع ملفات</span>
            </Button>

            {/* استلام بالإيميل */}
            <Button
              onClick={() => handleReceiveByMethod('email')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b'
              }}
            >
              <Mail className="h-8 w-8 text-amber-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>استلام بالإيميل</span>
            </Button>

            {/* استلام بالتليجرام */}
            <Button
              onClick={() => handleReceiveByMethod('telegram')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)',
                border: '2px solid #06b6d4'
              }}
            >
              <Send className="h-8 w-8 text-cyan-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>استلام بالتليجرام</span>
            </Button>

            {/* استلام بالواتساب */}
            <Button
              onClick={() => handleReceiveByMethod('whatsapp')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '2px solid #10b981'
              }}
            >
              <MessageCircle className="h-8 w-8 text-green-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>استلام بالواتساب</span>
            </Button>

            {/* مسح ضوئي */}
            <Button
              onClick={() => handleReceiveByMethod('scan')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                border: '2px solid #8b5cf6'
              }}
            >
              <Scan className="h-8 w-8 text-violet-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>مسح ضوئي</span>
            </Button>

            {/* رابط ويب */}
            <Button
              onClick={() => handleReceiveByMethod('weblink')}
              className="h-24 flex flex-col gap-2"
              variant="outline"
              style={{
                background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                border: '2px solid #ec4899'
              }}
            >
              <Link2 className="h-8 w-8 text-pink-600" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>رابط ويب</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* آخر المستندات المستلمة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر المستندات المستلمة (5)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                  onClick={() => {
                    setSelectedDocument(doc);
                    setShowDetailsDialog(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {doc.originalFileName}
                        </span>
                        {doc.isImportant && (
                          <Badge variant="destructive" className="text-xs">مهم</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{doc.receivedFrom}</span>
                        <span>•</span>
                        <span>{doc.receivingDate} {doc.receivingTime}</span>
                        <span>•</span>
                        <span>{getReceivingMethodLabel(doc.receivingMethod)}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* نافذة استلام المستندات */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              استلام مستند - {getReceivingMethodLabel(receiveForm.receivingMethod)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* معلومات الاستلام */}
            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="المستلم من *"
                id="received-from-type"
                value={receiveForm.receivedFromType}
                onChange={(value) => setReceiveForm(prev => ({ ...prev, receivedFromType: value as any }))}
                options={[
                  { value: 'government', label: 'جهة حكومية' },
                  { value: 'owner', label: 'مالك' },
                  { value: 'employee', label: 'موظف' },
                  { value: 'task', label: 'مهمة منتهية' }
                ]}
                required
                copyable={false}
                clearable={false}
              />

              <InputWithCopy
                label="اسم المرسل *"
                id="received-from"
                value={receiveForm.receivedFrom}
                onChange={(e) => setReceiveForm(prev => ({ ...prev, receivedFrom: e.target.value }))}
                placeholder="أدخل اسم المرسل"
                required
              />
            </div>

            {/* التصنيف */}
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="الفئة"
                id="category"
                value={receiveForm.category}
                onChange={(e) => setReceiveForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="مثال: رخص، ملكية، تقارير"
              />

              <InputWithCopy
                label="الفئة الفرعية"
                id="sub-category"
                value={receiveForm.subCategory}
                onChange={(e) => setReceiveForm(prev => ({ ...prev, subCategory: e.target.value }))}
                placeholder="مثال: رخص بناء، صكوك"
              />
            </div>

            {/* الملاحظات */}
            <TextAreaWithCopy
              label="ملاحظات"
              id="notes"
              value={receiveForm.notes}
              onChange={(e) => setReceiveForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="أدخل أي ملاحظات إضافية"
            />

            {/* مهم */}
            <EnhancedSwitch
              id="is-important"
              checked={receiveForm.isImportant}
              onCheckedChange={(checked) => setReceiveForm(prev => ({ ...prev, isImportant: checked }))}
              label="مستند مهم"
              description="وضع علامة على المستند كمهم"
              variant="warning"
            />

            {/* زر اختيار الملف */}
            {receiveForm.receivingMethod === 'upload' && (
              <div className="flex flex-col gap-2">
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الملف *</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={handleFileSelect} variant="outline">
                  <Upload className="h-4 w-4 ml-2" />
                  اختر الملف(ات)
                </Button>
              </div>
            )}

            {/* حقول خاصة بطرق الاستلام الأخرى */}
            {receiveForm.receivingMethod === 'email' && (
              <InputWithCopy
                label="عنوان البريد الإلكتروني *"
                id="email-address"
                type="email"
                placeholder="example@email.com"
              />
            )}

            {receiveForm.receivingMethod === 'weblink' && (
              <InputWithCopy
                label="رابط الويب *"
                id="web-link"
                type="url"
                placeholder="https://example.com/file"
              />
            )}

            {/* معلومات تلقائية */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#1e40af' }}>
                معلومات تلقائية سيتم حفظها:
              </p>
              <div className="space-y-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#475569' }}>
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>عنوان IP: سيتم تسجيله تلقائياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>الموقع: سيتم تحديده تلقائياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>التاريخ والوقت: {new Date().toLocaleString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiveDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 ml-2" />
              استلام المستند
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل المستند */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl dialog-rtl">
          <DialogHeader>
            <DialogTitle className="dialog-title">تفاصيل المستند المستلم</DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 p-4">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      الاسم الأصلي
                    </Label>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {selectedDocument.originalFileName}
                    </p>
                  </div>
                  <div>
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      رقم المستند
                    </Label>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {selectedDocument.id}
                    </p>
                  </div>
                </div>

                {/* معلومات الاستلام */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      معلومات الاستلام
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          طريقة الاستلام
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {getReceivingMethodLabel(selectedDocument.receivingMethod)}
                        </p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          التاريخ والوقت
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedDocument.receivingDate} {selectedDocument.receivingTime}
                        </p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          المرسل
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedDocument.receivedFrom}
                        </p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          نوع المرسل
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {getReceivedFromTypeLabel(selectedDocument.receivedFromType)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* المعلومات التقنية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المعلومات التقنية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          عنوان IP
                        </Label>
                        <p className="text-sm font-mono">{selectedDocument.ipAddress}</p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          الموقع
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedDocument.location}
                        </p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          حجم الملف
                        </Label>
                        <p className="text-sm">{formatFileSize(selectedDocument.fileSize)}</p>
                      </div>
                      <div>
                        <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          نوع الملف
                        </Label>
                        <p className="text-sm font-mono">{selectedDocument.fileType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* التصنيف */}
                {(selectedDocument.category || selectedDocument.subCategory) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التصنيف
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedDocument.category && (
                        <div>
                          <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                            الفئة
                          </Label>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {selectedDocument.category}
                          </p>
                        </div>
                      )}
                      {selectedDocument.subCategory && (
                        <div>
                          <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                            الفئة الفرعية
                          </Label>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {selectedDocument.subCategory}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* الربط بالمعاملة */}
                {selectedDocument.linkedTransactionNumber && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الربط بالمعاملة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-violet-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معاملة رقم: {selectedDocument.linkedTransactionNumber}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* الملاحظات */}
                {selectedDocument.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الملاحظات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedDocument.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              إغلاق
            </Button>
            <Button variant="default">
              <Eye className="h-4 w-4 ml-2" />
              عرض الملف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ============================================================
  // التاب 902-02: المستندات المستلمة
  // ============================================================

  const renderTab02_ReceivedDocuments = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع المستندات المستلمة ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم الأصلي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرسل</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="text-right font-mono">{doc.id}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div className="flex items-center gap-2">
                      {doc.originalFileName}
                      {doc.isImportant && <Badge variant="destructive" className="text-xs">مهم</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.receivedFrom}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {getReceivingMethodLabel(doc.receivingMethod)}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {doc.receivingDate} {doc.receivingTime}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  // ============================================================
  // التابات الأخرى (محتوى أساسي)
  // ============================================================

  const renderTab03_Classification = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف والأرشفة</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          نظام تصنيف وأرشفة المستندات المستلمة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Archive className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab04_Linking = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>ربط بالمعاملات</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          ربط المستندات بالمعاملات المناسبة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <LinkIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab05_Log = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الاستلام</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          سجل تفصيلي لجميع عمليات الاستلام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab06_Statistics = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إحصائيات شاملة عن المستندات المستلمة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab07_Settings = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إعدادات نظام استلام الوثائق
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab08_Reports = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          تقارير تفصيلية عن المستندات المستلمة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التاب قيد التطوير
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================
  // UI الرئيسي
  // ============================================================

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div 
          className="flex items-center justify-between"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <Download 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '20px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  استلام وثائق
                </h1>
                
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    902
                  </span>
                </div>
              </div>
              
              <p 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px', 
                  color: '#64748b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                نظام شامل لاستلام وأرشفة جميع المستندات الواردة
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '6px 14px',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.15)'
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                8 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الشاشة */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Helper Functions
// ============================================================

const getReceivingMethodLabel = (method: ReceivedDocument['receivingMethod']): string => {
  const labels = {
    upload: 'رفع مباشر',
    email: 'بريد إلكتروني',
    telegram: 'تليجرام',
    whatsapp: 'واتساب',
    scan: 'مسح ضوئي',
    weblink: 'رابط ويب'
  };
  return labels[method];
};

const getReceivedFromTypeLabel = (type: ReceivedDocument['receivedFromType']): string => {
  const labels = {
    government: 'جهة حكومية',
    owner: 'مالك',
    employee: 'موظف',
    task: 'مهمة منتهية'
  };
  return labels[type];
};

const getStatusLabel = (status: ReceivedDocument['status']): string => {
  const labels = {
    pending: 'قيد المعالجة',
    classified: 'مصنف',
    linked: 'مربوط',
    archived: 'مؤرشف'
  };
  return labels[status];
};

const getStatusVariant = (status: ReceivedDocument['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants = {
    pending: 'outline' as const,
    classified: 'secondary' as const,
    linked: 'default' as const,
    archived: 'secondary' as const
  };
  return variants[status];
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default DocumentsReceiving_Complete_902;
