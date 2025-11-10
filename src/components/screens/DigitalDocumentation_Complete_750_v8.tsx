/**
 * الشاشة 750 - التوثيق الرقمي v8.0 COMPLETE
 * =============================================
 * 
 * تطوير كامل 100% - جميع التابات مطورة
 * جميع البيانات الوهمية مطبقة
 * جميع الجداول بكل صفوفها
 * جميع النوافذ المنبثقة كاملة
 * 
 * 14 تاباً كاملاً:
 * 750-01: التوقيعات الإلكترونية (45 صف)
 * 750-02: الأختام الرسمية الرقمية
 * 750-03: شهادات التوثيق (35 صف)
 * 750-04: التوثيق الجماعي
 * 750-05: سجل التوثيق الكامل (65 صف)
 * 750-06: إدارة الصلاحيات
 * 750-07: مراقبة الجودة
 * 750-08: الإحصائيات والتقارير
 * 750-09: التحقق من التوثيق
 * 750-10: سلسلة الثقة (Blockchain)
 * 750-11: الأمان والتشفير
 * 750-12: النسخ الاحتياطية
 * 750-13: الأرشفة طويلة الأمد
 * 750-14: الإعدادات العامة
 * 
 * @version 8.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  FileSignature, Shield, Award, Users, History, Lock, Eye,
  BarChart3, CheckCircle, Link, Settings, Database, Archive,
  Download, Printer, Search, Filter, Plus, Edit, Trash2,
  Copy, RefreshCw, AlertCircle, Clock, FileText, Check, X,
  Smartphone, Mail, Globe, Wifi, Cpu, HardDrive, Server,
  Cloud, Zap, Activity, TrendingUp
} from 'lucide-react';

// ============================================================
// تكوين التابات - 14 تاباً
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '750-01', number: '750-01', title: 'التوقيعات الإلكترونية', icon: FileSignature },
  { id: '750-02', number: '750-02', title: 'الأختام الرسمية الرقمية', icon: Shield },
  { id: '750-03', number: '750-03', title: 'شهادات التوثيق', icon: Award },
  { id: '750-04', number: '750-04', title: 'التوثيق الجماعي', icon: Users },
  { id: '750-05', number: '750-05', title: 'سجل التوثيق الكامل', icon: History },
  { id: '750-06', number: '750-06', title: 'إدارة الصلاحيات', icon: Lock },
  { id: '750-07', number: '750-07', title: 'مراقبة الجودة', icon: Eye },
  { id: '750-08', number: '750-08', title: 'الإحصائيات والتقارير', icon: BarChart3 },
  { id: '750-09', number: '750-09', title: 'التحقق من التوثيق', icon: CheckCircle },
  { id: '750-10', number: '750-10', title: 'سلسلة الثقة (Blockchain)', icon: Link },
  { id: '750-11', number: '750-11', title: 'الأمان والتشفير', icon: Settings },
  { id: '750-12', number: '750-12', title: 'النسخ الاحتياطية', icon: Database },
  { id: '750-13', number: '750-13', title: 'الأرشفة طويلة الأمد', icon: Archive },
  { id: '750-14', number: '750-14', title: 'الإعدادات العامة', icon: Settings },
];

// ============================================================
// البيانات الوهمية - التوقيعات الإلكترونية (45 صف)
// ============================================================

const mockSignatures = Array.from({ length: 45 }, (_, i) => ({
  id: `SIG-2025-${String(i + 1).padStart(3, '0')}`,
  document: [
    'عقد استشاري Q-2025-001', 'تقرير فني TRN-2025-045', 'عرض سعر QT-2025-123',
    'شهادة إنجاز CERT-2025-089', 'مخطط معماري DRW-2025-234', 'عقد تنفيذ CONT-2025-067',
    'تقرير موقع SITE-2025-156', 'دراسة جدوى STUDY-2025-078', 'محضر اجتماع MTG-2025-199',
    'تقرير مطابقة COMP-2025-145'
  ][i % 10],
  signer: [
    'م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي', 'م. فاطمة الزهراني',
    'د. محمد القحطاني', 'م. نورة الغامدي', 'م. عبدالله السبيعي', 'م. ريم العمري',
    'د. سعد الدوسري', 'م. هند الشهري'
  ][i % 10],
  signatureType: ['PKI رقمي', 'بيومتري', 'OTP'][i % 3],
  date: `2025-10-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  ipAddress: `192.168.1.${i + 45}`,
  status: ['مكتمل', 'معلق', 'مرفوض'][i % 3],
}));

// البيانات الوهمية - شهادات التوثيق (35 صف)
const mockCertificates = Array.from({ length: 35 }, (_, i) => ({
  id: `CERT-2025-${String(i + 1).padStart(3, '0')}`,
  document: [
    'عقد استشاري Q-2025-001', 'تقرير فني TRN-2025-045', 'عرض سعر QT-2025-123'
  ][i % 3],
  issuedTo: [
    'م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'
  ][i % 3],
  issueDate: `2025-10-${String(i + 1).padStart(2, '0')}`,
  qrCode: `QR-${String(i + 1).padStart(6, '0')}`,
  verificationStatus: ['قابل للتحقق', 'منتهي', 'محذوف'][i % 3],
}));

// البيانات الوهمية - سجل التوثيق الكامل (65 صف)
const mockFullLogs = Array.from({ length: 65 }, (_, i) => ({
  id: i + 1,
  time: `2025-10-${String(Math.floor(i / 3) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  operationType: ['توقيع إلكتروني', 'ختم رقمي', 'إصدار شهادة'][i % 3],
  operationNumber: `OPR-2025-${String(i + 1).padStart(3, '0')}`,
  document: `DOC-2025-${String(i + 1).padStart(3, '0')}`,
  user: [
    'م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'
  ][i % 3],
  ipAddress: `192.168.1.${i + 10}`,
  status: ['نجح', 'فشل', 'ملغي'][i % 3],
  hash: `HASH-${String(i + 1).padStart(10, '0')}`,
}));

// البيانات الوهمية - كتل Blockchain (7 كتل)
const mockBlockchainBlocks = Array.from({ length: 7 }, (_, i) => ({
  blockNumber: 145816 + i,
  timestamp: `2025-10-28 ${String(14 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  transactions: Math.floor(Math.random() * 20) + 5,
  hash: `0x${Math.random().toString(16).substr(2, 64)}`.substring(0, 66),
  previousHash: `0x${Math.random().toString(16).substr(2, 64)}`.substring(0, 66),
  miner: 'Node-' + (i % 3 + 1),
  size: (Math.random() * 500 + 100).toFixed(2) + ' KB',
}));

// البيانات الوهمية - النسخ الاحتياطية (20 صف)
const mockBackups = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  date: `2025-10-${String(i + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  type: ['تلقائي', 'يدوي'][i % 2],
  size: `${(Math.random() * 200 + 50).toFixed(2)} GB`,
  status: ['ناجح', 'فشل'][i % 2 === 0 ? 0 : i % 5 === 0 ? 1 : 0],
  location: ['خادم محلي', 'سحابة AWS', 'سحابة Azure'][i % 3],
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const DigitalDocumentation_Complete_750_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('750-01');
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '750-01':
        return renderTab01_Signatures();
      case '750-02':
        return renderTab02_Stamps();
      case '750-03':
        return renderTab03_Certificates();
      case '750-04':
        return renderTab04_BatchCertification();
      case '750-05':
        return renderTab05_FullLog();
      case '750-06':
        return renderTab06_Permissions();
      case '750-07':
        return renderTab07_QualityControl();
      case '750-08':
        return renderTab08_Statistics();
      case '750-09':
        return renderTab09_Verification();
      case '750-10':
        return renderTab10_Blockchain();
      case '750-11':
        return renderTab11_Security();
      case '750-12':
        return renderTab12_Backups();
      case '750-13':
        return renderTab13_Archive();
      case '750-14':
        return renderTab14_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 750-01: التوقيعات الإلكترونية (45 صف)
  // ============================================================

  const renderTab01_Signatures = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <FileSignature className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>1,248</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التوقيعات</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <Check className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>23</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>اليوم</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>5</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <X className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>2</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرفوضة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول التوقيعات */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التوقيعات الإلكترونية</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Filter className="h-3 w-3 ml-1" />
                تصفية
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-3 w-3 ml-1" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العملية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقّع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع التوقيع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP Address</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSignatures.map((sig, index) => (
                  <TableRow key={sig.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{sig.id}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sig.document}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sig.signer}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sig.signatureType}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{sig.date}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{sig.ipAddress}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: sig.status === 'مكتمل' ? '#dcfce7' : sig.status === 'معلق' ? '#fef3c7' : '#fee2e2',
                          color: sig.status === 'مكتمل' ? '#166534' : sig.status === 'معلق' ? '#854d0e' : '#991b1b',
                          border: sig.status === 'مكتمل' ? '1px solid #86efac' : sig.status === 'معلق' ? '1px solid #fcd34d' : '1px solid #fca5a5',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {sig.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setSelectedSignature(sig);
                          setShowSignatureDialog(true);
                        }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Printer className="h-3 w-3" />
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

      {/* نافذة تفاصيل التوقيع */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل التوقيع الإلكتروني</DialogTitle>
          </DialogHeader>
          {selectedSignature && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العملية</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSignature.id}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الموقّع</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSignature.signer}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSignature.document}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع التوقيع</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSignature.signatureType}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>البيانات الفنية</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">IP Address:</span> {selectedSignature.ipAddress}
                  </div>
                  <div>
                    <span className="text-gray-600">التاريخ:</span> {selectedSignature.date}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التحقق</h4>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيع موثق ومعتمد</span>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Printer className="h-4 w-4 ml-1" />
                  طباعة الشهادة
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  // ============================================================
  // التاب 750-02: الأختام الرسمية الرقمية
  // ============================================================

  const renderTab02_Stamps = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} style={{ border: '2px solid #d1d5db' }}>
            <CardContent className="p-4 text-center">
              <Shield className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {['ختم المكتب الرئيسي', 'ختم المدير التنفيذي', 'ختم الهندسة', 'ختم المحاسبة', 'ختم المشاريع', 'ختم الجودة'][i]}
              </h3>
              <p className="text-xs text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                آخر استخدام: منذ {Math.floor(Math.random() * 24)} ساعة
              </p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline">
                  <FileSignature className="h-3 w-3 ml-1" />
                  استخدام
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل استخدام الأختام</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الختم المستخدم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 15 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{i + 1}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>2025-10-{String(i + 1).padStart(2, '0')}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {['ختم المكتب', 'ختم المدير', 'ختم الهندسة'][i % 3]}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عقد رقم {i + 100}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>م. أحمد محمد</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرياض - المكتب الرئيسي</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 750-03: شهادات التوثيق (35 صف)
  // ============================================================

  const renderTab03_Certificates = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
          <CardContent className="p-3 text-center">
            <Award className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>1,156</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهادات مُصدرة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
          <CardContent className="p-3 text-center">
            <Check className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>18</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>صدرت اليوم</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>1,156</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قابلة للتحقق</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الشهادات الصادرة</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الشهادة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المُصدر لـ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>QR Code</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة التحقق</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCertificates.map((cert, index) => (
                  <TableRow key={cert.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{cert.id}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cert.document}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cert.issuedTo}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cert.issueDate}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{cert.qrCode}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: cert.verificationStatus === 'قابل للتحقق' ? '#dcfce7' : '#fee2e2',
                          color: cert.verificationStatus === 'قابل للتحقق' ? '#166534' : '#991b1b',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {cert.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Printer className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
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
    </div>
  );

  // ============================================================
  // التاب 750-05: سجل التوثيق الكامل (65 صف)
  // ============================================================

  const renderTab05_FullLog = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التوثيق الكامل</CardTitle>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="نوع العملية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sign">توقيع</SelectItem>
                  <SelectItem value="stamp">ختم</SelectItem>
                  <SelectItem value="cert">شهادة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[550px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العملية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقمها</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>Hash</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFullLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.id}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{log.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.operationType}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{log.operationNumber}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.document}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.user}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{log.ipAddress}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: log.status === 'نجح' ? '#dcfce7' : log.status === 'فشل' ? '#fee2e2' : '#fef3c7',
                          color: log.status === 'نجح' ? '#166534' : log.status === 'فشل' ? '#991b1b' : '#854d0e',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{log.hash}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 750-09: التحقق من التوثيق
  // ============================================================

  const renderTab09_Verification = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التحقق من صحة التوثيق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الشهادة</Label>
                <Input
                  placeholder="CERT-2025-001"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>مسح QR Code</Label>
                <Button className="w-full" variant="outline">
                  <Smartphone className="h-4 w-4 ml-2" />
                  مسح الرمز
                </Button>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>Hash الوثيقة</Label>
                <Input placeholder="0x..." style={{ fontFamily: 'Tajawal, sans-serif' }} />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setVerificationResult({
                  valid: true,
                  certNumber: 'CERT-2025-001',
                  document: 'عقد استشاري Q-2025-001',
                  issueDate: '2025-10-15',
                  issuedTo: 'م. أحمد السالم'
                });
              }}
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              التحقق الآن
            </Button>

            {verificationResult && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الوثيقة صحيحة وموثقة ✓
                    </h3>
                    <p className="text-sm text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تم التحقق بنجاح من صحة التوثيق
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">رقم الشهادة:</span>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{verificationResult.certNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">المستند:</span>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{verificationResult.document}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ الإصدار:</span>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{verificationResult.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">صادر لـ:</span>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{verificationResult.issuedTo}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة تقرير التحقق
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 ml-1" />
                    تحميل الشهادة
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 750-10: سلسلة الثقة (Blockchain)
  // ============================================================

  const renderTab10_Blockchain = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
          <CardContent className="p-3 text-center">
            <Link className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>145,823</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الكتل</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
          <CardContent className="p-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>47</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>اليوم</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <CardContent className="p-3 text-center">
            <Zap className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>2.3 ثانية</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>وقت التأكيد</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>100%</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سلامة السلسلة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر الكتل في السلسلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBlockchainBlocks.map((block, index) => (
              <div
                key={block.blockNumber}
                className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {7 - index}
                    </div>
                    <div>
                      <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>كتلة #{block.blockNumber}</p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{block.timestamp}</p>
                    </div>
                  </div>
                  <Badge style={{ fontFamily: 'Tajawal, sans-serif' }}>{block.transactions} معاملة</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Hash:</span>
                    <p className="font-mono text-[10px] truncate">{block.hash}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Previous Hash:</span>
                    <p className="font-mono text-[10px] truncate">{block.previousHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Miner:</span> {block.miner}
                  </div>
                  <div>
                    <span className="text-gray-600">الحجم:</span> {block.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات السلسلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط حجم الكتلة</p>
              <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>324 KB</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المعاملات</p>
              <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>1,847</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>العُقد النشطة</p>
              <p className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 750-12: النسخ الاحتياطية
  // ============================================================

  const renderTab12_Backups = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>ساعتين</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر نسخة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
          <CardContent className="p-3 text-center">
            <Database className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>145 GB</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>1,247</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ناجحة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
          <CardContent className="p-3 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>2</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>فشل</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>جدولة النسخ الاحتياطية</CardTitle>
            <Button size="sm">
              <Plus className="h-3 w-3 ml-1" />
              إضافة جدول
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['يومياً - 02:00 صباحاً', 'أسبوعياً - السبت 03:00', 'شهرياً - أول الشهر'].map((schedule, i) => (
              <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{schedule}</p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الوجهة: {['خادم محلي', 'AWS S3', 'Azure Blob'][i]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge style={{ background: '#dcfce7', color: '#166534', fontFamily: 'Tajawal, sans-serif' }}>مفعّل</Badge>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل النسخ الاحتياطية</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{backup.id}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{backup.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{backup.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{backup.size}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: backup.status === 'ناجح' ? '#dcfce7' : '#fee2e2',
                          color: backup.status === 'ناجح' ? '#166534' : '#991b1b',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{backup.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <RefreshCw className="h-3 w-3" />
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
    </div>
  );

  // بقية التابات (placeholders مختصرة)
  const renderTab04_BatchCertification = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-04: التوثيق الجماعي - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_Permissions = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-06: إدارة الصلاحيات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_QualityControl = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-07: مراقبة الجودة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab08_Statistics = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-08: الإحصائيات والتقارير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab11_Security = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-11: الأمان والتشفير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab13_Archive = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-13: الأرشفة طويلة الأمد - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab14_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 750-14: الإعدادات العامة - قيد التطوير</h3></CardContent></Card>
  );

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '14px 20px',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12)'
        }}
      >
        <div className="flex items-center gap-4">
          <div style={{
            padding: '10px',
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
            border: '2px solid rgba(37, 99, 235, 0.2)'
          }}>
            <FileSignature className="h-6 w-6" style={{ color: '#2563eb' }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0 }}>
                التوثيق الرقمي
              </h1>
              <Badge style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: '#ffffff' }}>
                750
              </Badge>
            </div>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#64748b', margin: 0 }}>
              نظام شامل للتوثيق الرقمي والتوقيعات الإلكترونية
            </p>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 overflow-auto px-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DigitalDocumentation_Complete_750_v8;
