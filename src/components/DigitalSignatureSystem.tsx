import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { CodeDisplay } from './CodeDisplay';
import { 
  PenTool, 
  Upload, 
  Save, 
  Trash2, 
  Eye, 
  Shield, 
  History, 
  Lock, 
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  RotateCcw,
  Download,
  User,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';

interface DigitalSignature {
  id: string;
  employeeId: string;
  employeeName: string;
  signatureType: 'drawn' | 'uploaded';
  signatureData: string; // Base64 للصورة أو SVG للرسم
  version: number;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  deviceInfo: string;
  isActive: boolean;
  isFrozen: boolean;
  usageCount: number;
  lastUsedAt: string;
}

interface SignatureChangeLog {
  id: string;
  signatureId: string;
  eventType: 'created' | 'updated' | 'frozen' | 'unfrozen' | 'deleted' | 'used';
  eventCode: string;
  previousData?: string;
  newData?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  employeeId: string;
  documentId?: string;
  reason?: string;
}

interface SignatureUsage {
  id: string;
  signatureId: string;
  documentId: string;
  documentType: string;
  documentTitle: string;
  usedAt: string;
  signatureVersion: number;
  ipAddress: string;
}

export function DigitalSignatureSystem() {
  const [activeTab, setActiveTab] = useState('my-signature');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const [changeLogs, setChangeLogs] = useState<SignatureChangeLog[]>([]);
  const [usageHistory, setUsageHistory] = useState<SignatureUsage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // معلومات المستخدم الحالي (يجب أن تأتي من نظام المصادقة)
  const currentUser = {
    id: 'EMP-001',
    name: 'م. سارة النمر',
    role: 'مهندس أول',
    permissions: ['MANAGE_OWN_SIGNATURE']
  };

  // بيانات تجريبية للتوقيعات
  useEffect(() => {
    const mockSignatures: DigitalSignature[] = [
      {
        id: 'SIG-001',
        employeeId: 'EMP-001',
        employeeName: 'م. سارة النمر',
        signatureType: 'drawn',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8VUgAAAABJRU5ErkJggg==',
        version: 3,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2025-01-20T14:22:00Z',
        ipAddress: '192.168.1.45',
        deviceInfo: 'Windows 11 - Chrome 131',
        isActive: true,
        isFrozen: false,
        usageCount: 47,
        lastUsedAt: '2025-01-22T09:15:00Z'
      }
    ];

    const mockChangeLogs: SignatureChangeLog[] = [
      {
        id: 'LOG-001',
        signatureId: 'SIG-001',
        eventType: 'created',
        eventCode: 'SIG-CREATE-001-20240115-103000',
        timestamp: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        employeeId: 'EMP-001',
        reason: 'إنشاء توقيع جديد'
      },
      {
        id: 'LOG-002',
        signatureId: 'SIG-001',
        eventType: 'updated',
        eventCode: 'SIG-UPDATE-001-20250120-142200',
        timestamp: '2025-01-20T14:22:00Z',
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        employeeId: 'EMP-001',
        reason: 'تحديث شكل التوقيع'
      }
    ];

    const mockUsageHistory: SignatureUsage[] = [
      {
        id: 'USE-001',
        signatureId: 'SIG-001',
        documentId: 'DOC-2025-0122-001',
        documentType: 'تقرير هندسي',
        documentTitle: 'تقرير فحص المبنى السكني - مشروع الأحياء',
        usedAt: '2025-01-22T09:15:00Z',
        signatureVersion: 3,
        ipAddress: '192.168.1.45'
      },
      {
        id: 'USE-002',
        signatureId: 'SIG-001',
        documentId: 'DOC-2025-0121-005',
        documentType: 'شهادة اعتماد',
        documentTitle: 'شهادة اعتماد التصميم الإنشائي',
        usedAt: '2025-01-21T16:30:00Z',
        signatureVersion: 3,
        ipAddress: '192.168.1.45'
      }
    ];

    setSignatures(mockSignatures);
    setChangeLogs(mockChangeLogs);
    setUsageHistory(mockUsageHistory);
  }, []);

  // إعداد Canvas للرسم
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        setIsCanvasReady(true);
      }
    }
  }, []);

  // دالة بداية الرسم
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCanvasReady) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  // دالة الرسم
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isCanvasReady) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  // دالة انتهاء الرسم
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // دالة مسح الرسم
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // دالة رفع الصورة
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح');
        return;
      }
      setUploadedFile(file);
    }
  };

  // دالة حفظ التوقيع
  const saveSignature = () => {
    let signatureData = '';
    
    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signatureData = canvas.toDataURL();
      }
    } else if (signatureMode === 'upload' && uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        signatureData = e.target?.result as string;
        processSaveSignature(signatureData);
      };
      reader.readAsDataURL(uploadedFile);
      return;
    }
    
    if (signatureData) {
      processSaveSignature(signatureData);
    } else {
      alert('يرجى رسم التوقيع أو رفع صورة');
    }
  };

  // معالجة حفظ التوقيع
  const processSaveSignature = (signatureData: string) => {
    const now = new Date().toISOString();
    const eventCode = `SIG-CREATE-${currentUser.id.split('-')[1]}-${now.replace(/[-:T]/g, '').slice(0, 14)}`;
    
    // محاكاة الحصول على IP
    const ipAddress = '192.168.1.' + Math.floor(Math.random() * 254 + 1);
    
    const newSignature: DigitalSignature = {
      id: `SIG-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      signatureType: signatureMode,
      signatureData,
      version: 1,
      createdAt: now,
      updatedAt: now,
      ipAddress,
      deviceInfo: navigator.userAgent.includes('Windows') ? 'Windows - Chrome' : 'Other',
      isActive: true,
      isFrozen: false,
      usageCount: 0,
      lastUsedAt: ''
    };

    const changeLog: SignatureChangeLog = {
      id: `LOG-${Date.now()}`,
      signatureId: newSignature.id,
      eventType: 'created',
      eventCode,
      timestamp: now,
      ipAddress,
      userAgent: navigator.userAgent,
      employeeId: currentUser.id,
      reason: 'إنشاء توقيع جديد'
    };

    // إلغاء تفعيل التوقيعات السابقة
    setSignatures(prev => prev.map(sig => 
      sig.employeeId === currentUser.id 
        ? { ...sig, isActive: false }
        : sig
    ).concat(newSignature));
    
    setChangeLogs(prev => [...prev, changeLog]);
    
    // إعادة تعيين النموذج
    clearCanvas();
    setUploadedFile(null);
    setIsDialogOpen(false);
    
    alert('تم حفظ التوقيع بنجاح');
  };

  // دالة تجميد التوقيع (للإدارة فقط)
  const freezeSignature = (signatureId: string) => {
    if (!currentUser.permissions.includes('ADMIN_MANAGE_SIGNATURES')) {
      alert('ليس لديك صلاحية لتجميد التوقيعات');
      return;
    }
    
    const now = new Date().toISOString();
    const eventCode = `SIG-FREEZE-${signatureId.split('-')[1]}-${now.replace(/[-:T]/g, '').slice(0, 14)}`;
    
    setSignatures(prev => prev.map(sig => 
      sig.id === signatureId ? { ...sig, isFrozen: true } : sig
    ));
    
    const changeLog: SignatureChangeLog = {
      id: `LOG-${Date.now()}`,
      signatureId,
      eventType: 'frozen',
      eventCode,
      timestamp: now,
      ipAddress: '192.168.1.45',
      userAgent: navigator.userAgent,
      employeeId: currentUser.id,
      reason: 'تجميد التوقيع بسبب إيقاف الحساب'
    };
    
    setChangeLogs(prev => [...prev, changeLog]);
  };

  // الحصول على التوقيع النشط للمستخدم الحالي
  const activeSignature = signatures.find(sig => 
    sig.employeeId === currentUser.id && sig.isActive
  );

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // الحصول على شارة الحالة
  const getStatusBadge = (signature: DigitalSignature) => {
    if (signature.isFrozen) {
      return <Badge variant="destructive" className="gap-1"><Lock className="w-3 h-3" />مجمد</Badge>;
    }
    if (signature.isActive) {
      return <Badge className="bg-green-100 text-green-800 gap-1"><CheckCircle className="w-3 h-3" />نشط</Badge>;
    }
    return <Badge variant="secondary" className="gap-1">غير نشط</Badge>;
  };

  return (
    <div className="space-y-6 rtl-support">
      <CodeDisplay code="SCR-DIGITAL-SIGNATURE-SYSTEM" position="top-right" />
      
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-main-title text-[var(--color-text-primary)]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام التوقيع الإلكتروني
          </h1>
          <p className="text-normal text-[var(--color-gray-secondary)] mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة آمنة للتوقيعات الإلكترونية مع تتبع كامل للتغييرات
          </p>
        </div>

        {/* تنبيه أمان */}
        <Alert className="max-w-md border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <strong>أمان عالي:</strong> لا يمكن لأي شخص تعديل أو حذف توقيعك إلا أنت
          </AlertDescription>
        </Alert>
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl-support">
        <TabsList className="grid w-full grid-cols-4 tabs-list-rtl">
          <TabsTrigger value="my-signature" className="button-rtl">
            <PenTool className="h-4 w-4" />
            توقيعي
          </TabsTrigger>
          <TabsTrigger value="usage-history" className="button-rtl">
            <FileText className="h-4 w-4" />
            سجل الاستخدام
          </TabsTrigger>
          <TabsTrigger value="change-logs" className="button-rtl">
            <History className="h-4 w-4" />
            سجل التغييرات
          </TabsTrigger>
          <TabsTrigger value="security" className="button-rtl">
            <Shield className="h-4 w-4" />
            الأمان والحماية
          </TabsTrigger>
        </TabsList>

        {/* تبويب التوقيع الشخصي */}
        <TabsContent value="my-signature" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* التوقيع الحالي */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <span>التوقيع الحالي</span>
                  {activeSignature && getStatusBadge(activeSignature)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSignature ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                      <img 
                        src={activeSignature.signatureData} 
                        alt="التوقيع الحالي" 
                        className="max-w-full h-auto max-h-32 mx-auto"
                        style={{ filter: activeSignature.isFrozen ? 'grayscale(100%)' : 'none' }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-gray-500">النوع</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {activeSignature.signatureType === 'drawn' ? 'مرسوم' : 'مرفوع'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">الإصدار</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>v{activeSignature.version}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">تاريخ الإنشاء</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {formatDate(activeSignature.createdAt)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">آخر تحديث</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {formatDate(activeSignature.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">عدد مرات الاستخدام</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{activeSignature.usageCount} مرة</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">آخر استخدام</Label>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {formatDate(activeSignature.lastUsedAt)}
                        </p>
                      </div>
                    </div>

                    {!activeSignature.isFrozen && (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="btn-primary w-full" type="button">
                            <PenTool className="w-4 h-4" />
                            تحديث التوقيع
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl dialog-rtl" aria-describedby="signature-update-description">
                          <DialogHeader>
                            <DialogTitle className="dialog-title">تحديث التوقيع الإلكتروني</DialogTitle>
                            <DialogDescription id="signature-update-description" className="dialog-description">
                              قم بإنشاء أو رفع توقيعك الجديد. سيتم حفظ النسخة السابقة في السجل.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 form-rtl">
                            {/* اختيار طريقة التوقيع */}
                            <div className="form-group">
                              <Label>طريقة إنشاء التوقيع</Label>
                              <div className="flex gap-4">
                                <Button
                                  type="button"
                                  variant={signatureMode === 'draw' ? 'default' : 'outline'}
                                  onClick={() => setSignatureMode('draw')}
                                  className="button-rtl"
                                >
                                  <PenTool className="w-4 h-4" />
                                  رسم التوقيع
                                </Button>
                                <Button
                                  type="button"
                                  variant={signatureMode === 'upload' ? 'default' : 'outline'}
                                  onClick={() => setSignatureMode('upload')}
                                  className="button-rtl"
                                >
                                  <Upload className="w-4 h-4" />
                                  رفع صورة
                                </Button>
                              </div>
                            </div>

                            {/* منطقة الرسم */}
                            {signatureMode === 'draw' && (
                              <div className="form-group">
                                <Label>ارسم توقيعك هنا</Label>
                                <div className="space-y-4">
                                  <canvas
                                    ref={canvasRef}
                                    width={600}
                                    height={200}
                                    className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                  />
                                  <div className="flex gap-2">
                                    <Button variant="outline" onClick={clearCanvas}>
                                      <RotateCcw className="w-4 h-4" />
                                      مسح
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* رفع الصورة */}
                            {signatureMode === 'upload' && (
                              <div className="form-group">
                                <Label>اختر صورة التوقيع</Label>
                                <div className="space-y-4">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="input-field"
                                  />
                                  {uploadedFile && (
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                        الملف المختار: {uploadedFile.name}
                                      </p>
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG أو GIF (أقل من 5MB)
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t">
                              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                إلغاء
                              </Button>
                              <Button type="button" onClick={saveSignature} className="btn-primary">
                                <Save className="w-4 h-4" />
                                حفظ التوقيع
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {activeSignature.isFrozen && (
                      <Alert className="border-red-200 bg-red-50">
                        <Lock className="h-4 w-4" />
                        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <strong>تم تجميد التوقيع:</strong> لا يمكن تعديل التوقيع المجمد. تواصل مع الإدارة لمزيد من المعلومات.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        لم يتم إنشاء توقيع بعد
                      </p>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="btn-primary" type="button">
                          <PenTool className="w-4 h-4" />
                          إنشاء توقيع جديد
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl dialog-rtl" aria-describedby="signature-create-description">
                        <DialogHeader>
                          <DialogTitle className="dialog-title">إنشاء التوقيع الإلكتروني</DialogTitle>
                          <DialogDescription id="signature-create-description" className="dialog-description">
                            قم بإنشاء توقيعك الإلكتروني الذي سيُستخدم في جميع المستندات الرسمية
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 form-rtl">
                          {/* نفس المحتوى السابق للـ Dialog */}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* معلومات الأمان */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حماية كاملة
                      </p>
                      <p className="text-sm text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        لا يمكن لأي شخص آخر تعديل توقيعك
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <History className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تتبع شامل
                      </p>
                      <p className="text-sm text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        جميع التغييرات محفوظة بالتاريخ والوقت
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الاحتفاظ بالمستندات
                      </p>
                      <p className="text-sm text-yellow-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التوقيعات المستعملة محفوظة إلى الأبد
                      </p>
                    </div>
                  </div>

                  {activeSignature && (
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          IP آخر تحديث: {activeSignature.ipAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الجهاز: {activeSignature.deviceInfo}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تبويب سجل الاستخدام */}
        <TabsContent value="usage-history" className="space-y-6">
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل استخدام التوقيع</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستند</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إصدار التوقيع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP المستخدم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div>
                          <p className="font-medium">{usage.documentTitle}</p>
                          <p className="text-sm text-gray-500">{usage.documentId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{usage.documentType}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {formatDate(usage.usedAt)}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        v{usage.signatureVersion}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {usage.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب سجل التغييرات */}
        <TabsContent value="change-logs" className="space-y-6">
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التغييرات والأحداث</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الحدث</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود الحدث</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان IP</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge 
                          variant={log.eventType === 'created' ? 'default' : 
                                  log.eventType === 'updated' ? 'secondary' : 
                                  log.eventType === 'frozen' ? 'destructive' : 'outline'}
                        >
                          {log.eventType === 'created' ? 'إنشاء' :
                           log.eventType === 'updated' ? 'تحديث' :
                           log.eventType === 'frozen' ? 'تجميد' : log.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {log.eventCode}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {log.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الأمان والحماية */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قواعد الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التحكم الشخصي الكامل
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        أنت الوحيد الذي يمكنه تعديل أو تحديث توقيعك
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حماية من الحذف
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        لا يمكن لأي مسؤول أو مشرف حذف توقيعك
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <History className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حفظ دائم للمستندات
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التوقيعات على المستندات محفوظة بشكل دائم
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تجميد تلقائي
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        يتم تجميد التوقيع عند إيقاف الحساب فقط
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSignature && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاستخدامات</span>
                        <span className="font-bold text-blue-600">{activeSignature.usageCount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>التغييرات المسجلة</span>
                        <span className="font-bold text-green-600">
                          {changeLogs.filter(log => log.signatureId === activeSignature.id).length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدار الحالي</span>
                        <span className="font-bold text-purple-600">v{activeSignature.version}</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة الحماية</span>
                        <Badge className="bg-green-100 text-green-800">
                          {activeSignature.isFrozen ? 'مجمد' : 'محمي'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ملاحظة قانونية */}
      <Alert className="border-gray-200 bg-gray-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <strong>ملاحظة مهمة:</strong> التوقيع الإلكتروني له قوة قانونية كاملة ويُعتبر إقراراً بالمسؤولية. 
          تأكد من صحة وسلامة توقيعك قبل استخدامه في المستندات الرسمية.
        </AlertDescription>
      </Alert>
    </div>
  );
}