/**
 * ============================================================================
 * الشاشة 778 - اعتماد العقود v3.0 - تطوير شامل مع تابات محسّنة
 * ============================================================================
 * 
 * تحديثات v3.0:
 * ✅ تطوير كامل للتاب 778-04 (الاعتماد اليدوي)
 * ✅ تطوير كامل للتاب 778-05 (الاعتماد الرقمي)
 * ✅ تطوير كامل للتاب 778-06 (اعتماد الأطراف)
 * ✅ تطوير كامل للتاب 778-07 (اعتماد المكتب)
 * ✅ نظام صور النسخ الموقعة
 * ✅ نظام التفويضات والتوكيلات
 * ✅ ربط بمقابلات العملاء (891)
 * ✅ ربط بالتوثيق الرقمي (750)
 * ✅ نظام تذكيرات شامل
 * ✅ اعتماد تلقائي للمكتب
 * 
 * @version 3.0
 * @date 2025-11-03
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Progress } from '../ui/progress';
import {
  FileCheck, CheckCircle, XCircle, Clock, AlertCircle, Users,
  Shield, FileSignature, Eye, Printer, Send, Mail, MessageSquare,
  Lock, Unlock, RefreshCw, Edit, Download, Upload, Save, Ban,
  UserCheck, FileText, Layers, Settings, Layout, BarChart3, Plus,
  Image, Calendar, MapPin, FileUser, Bell, Zap, Check, X
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '778-01', number: '778-01', title: 'نظرة عامة', icon: Layout },
  { id: '778-02', number: '778-02', title: 'العقود المعلقة', icon: Clock },
  { id: '778-03', number: '778-03', title: 'طلبات الاعتماد', icon: FileCheck },
  { id: '778-04', number: '778-04', title: 'الاعتماد اليدوي', icon: Edit },
  { id: '778-05', number: '778-05', title: 'الاعتماد الرقمي', icon: Shield },
  { id: '778-06', number: '778-06', title: 'اعتماد الأطراف', icon: Users },
  { id: '778-07', number: '778-07', title: 'اعتماد المكتب', icon: FileSignature },
  { id: '778-08', number: '778-08', title: 'العقود المعتمدة', icon: CheckCircle },
  { id: '778-09', number: '778-09', title: 'العقود المرفوضة', icon: XCircle },
  { id: '778-10', number: '778-10', title: 'سجل الاعتمادات', icon: FileText },
  { id: '778-11', number: '778-11', title: 'الإشعارات', icon: Mail },
  { id: '778-12', number: '778-12', title: 'التقارير', icon: BarChart3 },
];

// الواجهات
interface ManualSignature {
  id: string;
  contractId: string;
  partyName: string;
  partyType: 'مكتب' | 'مقاول' | 'عميل' | 'جهة حكومية';
  signedDate: string;
  signedTime: string;
  signedBy: 'نفسه' | 'بموجب تفويض';
  authorizationNumber?: string;
  authorizationDate?: string;
  location: string;
  city: string;
  linkedToMeeting: boolean;
  meetingId?: string;
  meetingDate?: string;
  witnessName?: string;
  witnessIdNumber?: string;
  notes: string;
  imageUrl: string;
  uploadedBy: string;
  uploadedDate: string;
}

interface DigitalApproval {
  id: string;
  contractId: string;
  requestDate: string;
  status: 'pending' | 'sent' | 'approved' | 'rejected';
  sentToEmployee?: string;
  employeeId?: string;
  digitalSignatureId?: string;
  certificateNumber?: string;
  approvalDate?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface PartyApproval {
  id: string;
  contractId: string;
  partyName: string;
  partyType: string;
  status: 'waiting' | 'signed' | 'rejected';
  signedDate?: string;
  lastReminderDate?: string;
  remindersSent: number;
  email?: string;
  mobile?: string;
}

interface OfficeApproval {
  id: string;
  contractId: string;
  approvalType: 'draft' | 'final';
  approvedBy: string;
  approvalDate: string;
  status: 'approved' | 'pending' | 'rejected';
  autoApproveEnabled: boolean;
  notes: string;
}

const ContractApproval_Complete_778_v3: React.FC = () => {
  const [activeTab, setActiveTab] = useState('778-01');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showSendDigitalDialog, setShowSendDigitalDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState<PartyApproval | null>(null);

  // بيانات وهمية - النسخ الموقعة يدوياً
  const manualSignatures: ManualSignature[] = [
    {
      id: 'MS001',
      contractId: 'CONT001',
      partyName: 'م. سعد العمري',
      partyType: 'مكتب',
      signedDate: '2025-11-01',
      signedTime: '14:30',
      signedBy: 'نفسه',
      location: 'مقر المكتب الرئيسي',
      city: 'الرياض',
      linkedToMeeting: true,
      meetingId: 'MTG-2025-015',
      meetingDate: '2025-11-01 14:00',
      witnessName: 'أحمد محمد الشهري',
      witnessIdNumber: '1045678912',
      notes: 'تم التوقيع بحضور الشاهد',
      imageUrl: '/signatures/ms001.jpg',
      uploadedBy: 'admin',
      uploadedDate: '2025-11-01 14:35'
    },
    {
      id: 'MS002',
      contractId: 'CONT001',
      partyName: 'عبدالله بن محمد العتيبي',
      partyType: 'عميل',
      signedDate: '2025-11-02',
      signedTime: '10:15',
      signedBy: 'بموجب تفويض',
      authorizationNumber: 'AUTH-2025-089',
      authorizationDate: '2025-10-15',
      location: 'فرع جدة',
      city: 'جدة',
      linkedToMeeting: false,
      notes: 'توقيع بموجب تفويض رسمي موثق',
      imageUrl: '/signatures/ms002.jpg',
      uploadedBy: 'branch_manager',
      uploadedDate: '2025-11-02 10:20'
    },
    {
      id: 'MS003',
      contractId: 'CONT002',
      partyName: 'م. خالد الدوسري',
      partyType: 'مكتب',
      signedDate: '2025-11-03',
      signedTime: '09:00',
      signedBy: 'نفسه',
      location: 'الموقع - حي الروضة',
      city: 'الرياض',
      linkedToMeeting: true,
      meetingId: 'MTG-2025-021',
      meetingDate: '2025-11-03 09:00',
      notes: 'توقيع في الموقع مع المقاول',
      imageUrl: '/signatures/ms003.jpg',
      uploadedBy: 'supervisor',
      uploadedDate: '2025-11-03 09:10'
    }
  ];

  // بيانات الاعتماد الرقمي
  const digitalApprovals: DigitalApproval[] = [
    {
      id: 'DA001',
      contractId: 'CONT003',
      requestDate: '2025-10-31 10:00',
      status: 'approved',
      sentToEmployee: 'م. أحمد الغامدي',
      employeeId: 'EMP-015',
      digitalSignatureId: 'DSIG-2025-034',
      certificateNumber: 'CERT-89456123',
      approvalDate: '2025-10-31 14:30',
      ipAddress: '192.168.1.10',
      deviceInfo: 'Windows 11 - Chrome 119'
    },
    {
      id: 'DA002',
      contractId: 'CONT004',
      requestDate: '2025-11-02 11:00',
      status: 'sent',
      sentToEmployee: 'م. محمد الشهري',
      employeeId: 'EMP-023'
    },
    {
      id: 'DA003',
      contractId: 'CONT005',
      requestDate: '2025-11-03 08:30',
      status: 'pending'
    }
  ];

  // بيانات اعتماد الأطراف
  const partyApprovals: PartyApproval[] = [
    {
      id: 'PA001',
      contractId: 'CONT001',
      partyName: 'عبدالله بن محمد العتيبي',
      partyType: 'عميل - المالك',
      status: 'signed',
      signedDate: '2025-11-02 10:15',
      lastReminderDate: '2025-11-01',
      remindersSent: 2,
      email: 'abdullah@example.com',
      mobile: '0501234567'
    },
    {
      id: 'PA002',
      contractId: 'CONT001',
      partyName: 'م. أحمد محمد السعيد',
      partyType: 'مقاول',
      status: 'waiting',
      lastReminderDate: '2025-11-02',
      remindersSent: 3,
      email: 'ahmad@contractor.com',
      mobile: '0509876543'
    },
    {
      id: 'PA003',
      contractId: 'CONT002',
      partyName: 'أوقاف الروضة',
      partyType: 'عميل - الجهة المالكة',
      status: 'waiting',
      lastReminderDate: '2025-11-03',
      remindersSent: 1,
      email: 'info@awqaf-rawdah.gov.sa',
      mobile: '0112345678'
    },
    {
      id: 'PA004',
      contractId: 'CONT004',
      partyName: 'شركة الفارس التجارية',
      partyType: 'عميل - المالك',
      status: 'rejected',
      lastReminderDate: '2025-10-27',
      remindersSent: 2,
      email: 'contracts@alfaris.com',
      mobile: '0505551234'
    }
  ];

  // بيانات اعتماد المكتب
  const officeApprovals: OfficeApproval[] = [
    {
      id: 'OA001',
      contractId: 'CONT001',
      approvalType: 'draft',
      approvedBy: 'م. سعد العمري',
      approvalDate: '2025-10-25 10:00',
      status: 'approved',
      autoApproveEnabled: false,
      notes: 'معتمد كمسودة - يحتاج موافقة الأطراف'
    },
    {
      id: 'OA002',
      contractId: 'CONT003',
      approvalType: 'final',
      approvedBy: 'النظام (تلقائي)',
      approvalDate: '2025-10-31 16:50',
      status: 'approved',
      autoApproveEnabled: true,
      notes: 'اعتماد تلقائي بعد توقيع جميع الأطراف'
    },
    {
      id: 'OA003',
      contractId: 'CONT002',
      approvalType: 'draft',
      approvedBy: 'م. خالد الدوسري',
      approvalDate: '2025-10-28 11:30',
      status: 'approved',
      autoApproveEnabled: true,
      notes: 'معتمد كمسودة مع تفعيل الاعتماد التلقائي'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'معلق', color: 'bg-yellow-500' },
      'sent': { label: 'مرسل', color: 'bg-blue-500' },
      'waiting': { label: 'بانتظار التوقيع', color: 'bg-orange-500' },
      'signed': { label: 'موقع', color: 'bg-green-500' },
      'approved': { label: 'معتمد', color: 'bg-green-500' },
      'rejected': { label: 'مرفوض', color: 'bg-red-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const handleSendReminder = (party: PartyApproval, isScheduled: boolean) => {
    toast.success(`تم ${isScheduled ? 'جدولة' : 'إرسال'} التذكير إلى ${party.partyName}`);
    setShowReminderDialog(false);
  };

  const handleSendDigitalApproval = (employeeId: string) => {
    toast.success('تم إرسال العقد للتوثيق الرقمي بنجاح');
    setShowSendDigitalDialog(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '778-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على اعتماد العقود</h2>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileCheck className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>5</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الطلبات</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{manualSignatures.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>توقيعات يدوية</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>{digitalApprovals.filter(d => d.status === 'approved').length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد رقمي</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{partyApprovals.filter(p => p.status === 'signed').length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أطراف موقعة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>{officeApprovals.filter(o => o.status === 'approved').length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد المكتب</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{partyApprovals.filter(p => p.status === 'waiting').length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بانتظار التوقيع</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '778-04':
        // الاعتماد اليدوي
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الموقعة يدوياً ({manualSignatures.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500">
                <Upload className="h-3 w-3 ml-1" />
                رفع نسخة موقعة
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#f0f9ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{manualSignatures.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي التوقيعات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {manualSignatures.filter(s => s.signedBy === 'نفسه').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>توقيع مباشر</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <FileUser className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {manualSignatures.filter(s => s.signedBy === 'بموجب تفويض').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بموجب تفويض</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fce7f3', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <MessageSquare className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {manualSignatures.filter(s => s.linkedToMeeting).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرتبط باجتماع</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {manualSignatures.map((signature) => (
                <Card key={signature.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {/* الصورة */}
                      <div 
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedImage(signature.imageUrl);
                          setShowImageDialog(true);
                        }}
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          background: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Image className="h-8 w-8 text-gray-400" />
                        <p className="text-[9px] text-gray-500 absolute mt-16" style={{ fontFamily: 'Tajawal, sans-serif' }}>اضغط للعرض</p>
                      </div>

                      {/* المعلومات */}
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اسم الطرف:</p>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.partyName}</p>
                          <Badge className="mt-1 text-xs">{signature.partyType}</Badge>
                        </div>
                        
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تاريخ ووقت التوقيع:</p>
                          <p className="text-sm font-mono">{signature.signedDate}</p>
                          <p className="text-sm font-mono">{signature.signedTime}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>طريقة التوقيع:</p>
                          <Badge className={`text-xs ${signature.signedBy === 'نفسه' ? 'bg-green-500' : 'bg-amber-500'} text-white`}>
                            {signature.signedBy}
                          </Badge>
                          {signature.authorizationNumber && (
                            <p className="text-xs mt-1 font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رقم التفويض: {signature.authorizationNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقع التوقيع:</p>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.location}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.city}</p>
                        </div>

                        {signature.linkedToMeeting && (
                          <div className="col-span-2">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرتبط باجتماع:</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-pink-500 text-white text-xs">{signature.meetingId}</Badge>
                              <span className="text-xs font-mono">{signature.meetingDate}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-1 h-6 text-xs"
                              onClick={() => {
                                // فتح شاشة مقابلات العملاء
                                window.location.href = `/screen/client-meetings?meeting=${signature.meetingId}`;
                              }}
                            >
                              <Eye className="h-2.5 w-2.5 ml-1" />
                              عرض الاجتماع
                            </Button>
                          </div>
                        )}

                        {signature.witnessName && (
                          <div className="col-span-3 bg-blue-50 p-2 rounded">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>الشاهد:</strong> {signature.witnessName} - {signature.witnessIdNumber}
                            </p>
                          </div>
                        )}

                        {signature.notes && (
                          <div className="col-span-3">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ملاحظات:</p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-05':
        // الاعتماد الرقمي
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاعتماد الرقمي ({digitalApprovals.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowSendDigitalDialog(true)}>
                <Send className="h-3 w-3 ml-1" />
                إرسال للتوثيق الرقمي
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{digitalApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الطلبات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {digitalApprovals.filter(d => d.status === 'approved').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معتمد</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Send className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {digitalApprovals.filter(d => d.status === 'sent').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرسل</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {digitalApprovals.filter(d => d.status === 'pending').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلق</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الطلب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف المخول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الشهادة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {digitalApprovals.map((approval) => (
                      <TableRow key={approval.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.contractId}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.requestDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.sentToEmployee || '-'}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.certificateNumber || '-'}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            {approval.status === 'approved' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // فتح شاشة التوثيق الرقمي
                                  window.location.href = `/screen/digital-documentation?cert=${approval.certificateNumber}`;
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            {approval.status === 'pending' && (
                              <Button 
                                size="sm" 
                                className="h-6 text-xs bg-blue-500"
                                onClick={() => setShowSendDigitalDialog(true)}
                              >
                                <Send className="h-2.5 w-2.5 ml-1" />
                                إرسال
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* نافذة إرسال للتوثيق الرقمي */}
            <Dialog open={showSendDigitalDialog} onOpenChange={setShowSendDigitalDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إرسال للتوثيق الرقمي</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <SelectWithCopy
                    label="اختر العقد *"
                    id="contract"
                    options={[
                      { value: 'CONT001', label: 'CONT001 - عقد بناء فلل سكنية' },
                      { value: 'CONT002', label: 'CONT002 - عقد إشراف على مشروع' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                  <SelectWithCopy
                    label="الموظف المخول بالتوثيق *"
                    id="employee"
                    options={[
                      { value: 'EMP-015', label: 'م. أحمد الغامدي - مدير التوثيق' },
                      { value: 'EMP-023', label: 'م. محمد الشهري - نائب المدير' },
                      { value: 'EMP-031', label: 'م. خالد العتيبي - موظف توثيق أول' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                  <TextAreaWithCopy
                    label="ملاحظات"
                    id="notes"
                    rows={3}
                    placeholder="أدخل أي ملاحظات إضافية..."
                    copyable={false}
                    clearable={true}
                  />
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                          <strong>ملاحظة:</strong> سيتم إرسال إشعار للموظف المحدد مع رابط للاعتماد الرقمي
                        </p>
                        <p className="text-xs mt-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          يمكن للموظف الاعتماد مباشرة من هذه الشاشة أو من شاشة التوثيق الرقمي (750)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSendDigitalDialog(false)}>إلغاء</Button>
                  <Button className="bg-blue-500" onClick={() => handleSendDigitalApproval('EMP-015')}>
                    <Send className="h-3 w-3 ml-1" />
                    إرسال للتوثيق
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '778-06':
        // اعتماد الأطراف
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد الأطراف ({partyApprovals.length})</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{partyApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الأطراف</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {partyApprovals.filter(p => p.status === 'signed').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقع</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {partyApprovals.filter(p => p.status === 'waiting').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بانتظار التوقيع</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {partyApprovals.filter(p => p.status === 'rejected').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرفوض</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {partyApprovals.map((party) => (
                <Card key={party.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{party.partyName}</h3>
                          {getStatusBadge(party.status)}
                        </div>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{party.partyType}</p>
                        
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني:</p>
                            <p className="text-xs font-mono">{party.email || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال:</p>
                            <p className="text-xs font-mono">{party.mobile || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التذكيرات المرسلة:</p>
                            <p className="text-xs font-mono">{party.remindersSent}</p>
                          </div>
                        </div>

                        {party.signedDate && (
                          <div className="mt-2 bg-green-50 p-2 rounded">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>تاريخ التوقيع:</strong> {party.signedDate}
                            </p>
                          </div>
                        )}

                        {party.lastReminderDate && party.status === 'waiting' && (
                          <div className="mt-2 bg-amber-50 p-2 rounded">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>آخر تذكير:</strong> {party.lastReminderDate}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        {party.status === 'waiting' && (
                          <>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs bg-blue-500"
                              onClick={() => {
                                setSelectedParty(party);
                                setShowReminderDialog(true);
                              }}
                            >
                              <Bell className="h-3 w-3 ml-1" />
                              تذكير
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => {
                                toast.success(`تم إرسال رسالة إلى ${party.partyName}`);
                              }}
                            >
                              <MessageSquare className="h-3 w-3 ml-1" />
                              رسالة
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة التذكير */}
            <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إرسال تذكير</DialogTitle>
                  {selectedParty && (
                    <DialogDescription className="dialog-description">
                      {selectedParty.partyName} - {selectedParty.partyType}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {selectedParty && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني:</p>
                        <p className="text-sm font-mono">{selectedParty.email || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال:</p>
                        <p className="text-sm font-mono">{selectedParty.mobile || '-'}</p>
                      </div>
                    </div>

                    <SelectWithCopy
                      label="نوع التذكير *"
                      id="reminder-type"
                      options={[
                        { value: 'email', label: 'بريد إلكتروني' },
                        { value: 'sms', label: 'رسالة نصية (SMS)' },
                        { value: 'whatsapp', label: 'واتساب' },
                        { value: 'all', label: 'جميع الوسائل' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <TextAreaWithCopy
                      label="نص التذكير"
                      id="reminder-text"
                      rows={4}
                      defaultValue={`عزيزي ${selectedParty.partyName}،\n\nنود تذكيركم بضرورة التوقيع على العقد رقم ${selectedParty.contractId}.\n\nشكراً لتعاونكم.`}
                      copyable={false}
                      clearable={true}
                    />

                    <div className="bg-amber-50 p-3 rounded">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                        <strong>ملاحظة:</strong> عدد التذكيرات السابقة: {selectedParty.remindersSent}
                      </p>
                      {selectedParty.lastReminderDate && (
                        <p className="text-xs mt-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          آخر تذكير: {selectedParty.lastReminderDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowReminderDialog(false)}>إلغاء</Button>
                  <Button 
                    className="bg-amber-500"
                    onClick={() => selectedParty && handleSendReminder(selectedParty, true)}
                  >
                    <Calendar className="h-3 w-3 ml-1" />
                    جدولة التذكير
                  </Button>
                  <Button 
                    className="bg-blue-500"
                    onClick={() => selectedParty && handleSendReminder(selectedParty, false)}
                  >
                    <Zap className="h-3 w-3 ml-1" />
                    إرسال فوري
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '778-07':
        // اعتماد المكتب
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد المكتب ({officeApprovals.length})</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{officeApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الاعتمادات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {officeApprovals.filter(o => o.approvalType === 'draft').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد مسودة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {officeApprovals.filter(o => o.approvalType === 'final').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد نهائي</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#e0e7ff', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Zap className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {officeApprovals.filter(o => o.autoApproveEnabled).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد تلقائي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعتمد بواسطة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد تلقائي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officeApprovals.map((approval) => (
                      <TableRow key={approval.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.contractId}</TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className={`text-xs ${approval.approvalType === 'draft' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                            {approval.approvalType === 'draft' ? 'مسودة' : 'نهائي'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.approvedBy}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.approvalDate}</TableCell>
                        <TableCell className="text-right py-1">
                          {approval.autoApproveEnabled ? (
                            <Badge className="text-xs bg-indigo-500 text-white">مفعّل</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">غير مفعّل</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>كيفية عمل نظام اعتماد المكتب</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</div>
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>اعتماد المسودة:</strong> يجب اعتماد العقد كمسودة من موظف المكتب المخول قبل إرساله للأطراف
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</div>
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>توقيع الأطراف:</strong> بعد اعتماد المسودة، يتم إرسال العقد لجميع الأطراف للتوقيع
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">3</div>
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>الاعتماد النهائي:</strong> بعد توقيع جميع الأطراف، يتم:
                      </p>
                      <ul className="list-disc list-inside text-xs mt-1 mr-3" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        <li>إذا كان <strong>الاعتماد التلقائي مفعّل</strong>: يتم اعتماد العقد تلقائياً</li>
                        <li>إذا كان <strong>الاعتماد التلقائي غير مفعّل</strong>: يحتاج موافقة يدوية نهائية من المكتب</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-indigo-50 p-2 rounded">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                      <strong>الاعتماد التلقائي:</strong> يمكن تفعيل الاعتماد التلقائي لتسريع عملية اعتماد العقود عند اكتمال توقيع جميع الأطراف، مما يوفر الوقت ويقلل الإجراءات اليدوية.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '778-02':
      case '778-03':
      case '778-08':
      case '778-09':
      case '778-10':
      case '778-11':
      case '778-12':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '778-02' ? 'تاب العقود المعلقة' :
                 activeTab === '778-03' ? 'تاب طلبات الاعتماد' :
                 activeTab === '778-08' ? 'تاب العقود المعتمدة' :
                 activeTab === '778-09' ? 'تاب العقود المرفوضة' :
                 activeTab === '778-10' ? 'تاب سجل الاعتمادات' :
                 activeTab === '778-11' ? 'تاب الإشعارات' :
                 'تاب التقارير'}
              </p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                (تم تطويره في الإصدار السابق)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-778-v3" position="top-right" />
      
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
              <FileCheck 
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
                  اعتماد العقود
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
                    778-v3
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
                نظام شامل لاعتماد العقود (يدوي + رقمي + أطراف + مكتب)
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
                12 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة عرض الصورة */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">صورة النسخة الموقعة</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-lg min-h-96 flex items-center justify-center">
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سيتم عرض الصورة هنا: {selectedImage}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>إغلاق</Button>
            <Button className="bg-blue-500">
              <Download className="h-3 w-3 ml-1" />
              تحميل الصورة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractApproval_Complete_778_v3;
