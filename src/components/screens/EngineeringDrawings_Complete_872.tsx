import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Alert } from '../ui/alert';
import { 
  FileText, Upload, Download, Eye, Trash2, Lock, Unlock, 
  CheckCircle, XCircle, FileCheck, Clock, User, Building2,
  Briefcase, Calendar, Copy, Edit, Archive, Folder,
  AlertCircle, Settings, Plus, Filter, Search, History,
  Building, Layers, Zap, Plug, Wind, Leaf, Flame, Shield,
  Star, Paperclip, FileArchive, Tag, MessageSquare
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// أنواع البيانات
interface DrawingFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  version: number;
  uploadDate: string;
  uploadedBy: string;
  uploaderId: string;
  notes: string;
  transactionId: string;
  transactionName: string;
  clientId: string;
  clientName: string;
  externalEntityId: string;
  externalEntityName: string;
  supervisorApproved: boolean;
  supervisorName?: string;
  approvalDate?: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  frozen: boolean;
  frozenReason?: string;
  digitallyDocumented: boolean;
  documentationDate?: string;
  downloadCount: number;
  status: 'current' | 'proposed' | 'approved';
  category: string;
  tags: string[];
  relatedFiles: string[];
}

interface DrawingCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  fileCount: number;
}

const EngineeringDrawings_Complete_872: React.FC = () => {
  const [activeTab, setActiveTab] = useState('872-01');
  const [activeSubTab, setActiveSubTab] = useState('current');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showVersionsDialog, setShowVersionsDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DrawingFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // حقول إضافة فئة جديدة
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameEn: '',
    description: '',
    color: '#2563eb'
  });
  
  // حقول النموذج للرفع
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    fileType: '',
    notes: '',
    transactionId: '',
    transactionName: '',
    clientId: '',
    clientName: '',
    externalEntityId: '',
    externalEntityName: '',
    status: 'current',
    tags: '',
    supervisorApproved: false,
    reviewed: false,
    frozen: false,
    digitallyDocumented: false
  });

  // فئات المخططات
  const [drawingCategories, setDrawingCategories] = useState<DrawingCategory[]>([
    { 
      id: 'architectural', name: 'معمارية', nameEn: 'Architectural', 
      icon: Building, color: '#2563eb', 
      description: 'المخططات المعمارية والتصاميم الإنشائية', 
      fileCount: 45 
    },
    { 
      id: 'structural', name: 'إنشائية', nameEn: 'Structural', 
      icon: Layers, color: '#7c3aed', 
      description: 'المخططات الإنشائية والهيكلية', 
      fileCount: 38 
    },
    { 
      id: 'mechanical', name: 'ميكانيكية', nameEn: 'Mechanical', 
      icon: Settings, color: '#dc2626', 
      description: 'الأنظمة الميكانيكية والمعدات', 
      fileCount: 32 
    },
    { 
      id: 'electrical', name: 'كهرباء', nameEn: 'Electrical', 
      icon: Zap, color: '#f59e0b', 
      description: 'الأنظمة الكهربائية والإضاءة', 
      fileCount: 41 
    },
    { 
      id: 'hvac', name: 'HVAC', nameEn: 'HVAC', 
      icon: Wind, color: '#06b6d4', 
      description: 'أنظمة التكييف والتهوية', 
      fileCount: 28 
    },
    { 
      id: 'energy', name: 'كفاءة الطاقة', nameEn: 'Energy Efficiency', 
      icon: Leaf, color: '#10b981', 
      description: 'أنظمة الطاقة المتجددة والكفاءة', 
      fileCount: 15 
    },
    { 
      id: 'fire', name: 'أنظمة الحماية من الحريق', nameEn: 'Fire Protection', 
      icon: Flame, color: '#ef4444', 
      description: 'أنظمة الإطفاء والإنذار والسلامة', 
      fileCount: 22 
    }
  ]);

  // بيانات وهمية للملفات
  const [drawingFiles, setDrawingFiles] = useState<DrawingFile[]>([
    {
      id: 'DWG-001', fileName: 'المخطط المعماري - الدور الأرضي.dwg', fileType: 'DWG',
      fileSize: '15.2 MB', version: 3, uploadDate: '2025-10-15 14:30',
      uploadedBy: 'م. أحمد محمد العتيبي', uploaderId: 'ENG-001',
      notes: 'تم تحديث أبعاد الواجهة الرئيسية وفقاً لملاحظات الاستشاري',
      transactionId: 'TXN-2025-4501', transactionName: 'مشروع برج الأعمال التجاري',
      clientId: 'CLT-789', clientName: 'شركة التطوير العمراني',
      externalEntityId: 'EXT-456', externalEntityName: 'مكتب الاستشارات الهندسية المتقدمة',
      supervisorApproved: true, supervisorName: 'م. خالد السالم', approvalDate: '2025-10-16 10:00',
      reviewed: true, reviewedBy: 'م. فاطمة القحطاني', reviewDate: '2025-10-15 16:45',
      frozen: false, digitallyDocumented: true, documentationDate: '2025-10-16 11:30',
      downloadCount: 23, status: 'approved', category: 'architectural',
      tags: ['دور أرضي', 'واجهة', 'معتمد'], relatedFiles: ['DWG-002', 'DWG-015']
    },
    {
      id: 'DWG-002', fileName: 'المخطط الإنشائي - الأساسات.pdf', fileType: 'PDF',
      fileSize: '8.7 MB', version: 2, uploadDate: '2025-10-14 09:15',
      uploadedBy: 'م. سارة علي الغامدي', uploaderId: 'ENG-012',
      notes: 'مخطط الأساسات المعدل حسب تقرير التربة الجديد',
      transactionId: 'TXN-2025-4501', transactionName: 'مشروع برج الأعمال التجاري',
      clientId: 'CLT-789', clientName: 'شركة التطوير العمراني',
      externalEntityId: 'EXT-457', externalEntityName: 'مكتب الاستشارات الإنشائية',
      supervisorApproved: true, supervisorName: 'م. محمد الشمري', approvalDate: '2025-10-14 14:20',
      reviewed: true, reviewedBy: 'م. نورة العنزي', reviewDate: '2025-10-14 11:30',
      frozen: false, digitallyDocumented: true, documentationDate: '2025-10-14 15:00',
      downloadCount: 18, status: 'approved', category: 'structural',
      tags: ['أساسات', 'خرسانة', 'معتمد'], relatedFiles: ['DWG-001', 'DWG-003']
    },
    {
      id: 'DWG-003', fileName: 'مخطط كهرباء - الطابق الأول.dwg', fileType: 'DWG',
      fileSize: '12.4 MB', version: 1, uploadDate: '2025-10-18 13:45',
      uploadedBy: 'م. عبدالله الدوسري', uploaderId: 'ENG-023',
      notes: 'المخطط الكهربائي الأولي - قيد المراجعة',
      transactionId: 'TXN-2025-4501', transactionName: 'مشروع برج الأعمال التجاري',
      clientId: 'CLT-789', clientName: 'شركة التطوير العمراني',
      externalEntityId: 'EXT-458', externalEntityName: 'مكتب الكهرباء والإضاءة',
      supervisorApproved: false, reviewed: false,
      frozen: false, digitallyDocumented: false,
      downloadCount: 5, status: 'current', category: 'electrical',
      tags: ['طابق أول', 'كهرباء', 'قيد المراجعة'], relatedFiles: []
    },
    {
      id: 'DWG-004', fileName: 'نظام HVAC - المبنى كامل.pdf', fileType: 'PDF',
      fileSize: '21.5 MB', version: 2, uploadDate: '2025-10-17 10:20',
      uploadedBy: 'م. ريم الحربي', uploaderId: 'ENG-034',
      notes: 'مخططات التكييف والتهوية - النسخة المحدثة',
      transactionId: 'TXN-2025-4501', transactionName: 'مشروع برج الأعمال التجاري',
      clientId: 'CLT-789', clientName: 'شركة التطوير العمراني',
      externalEntityId: 'EXT-459', externalEntityName: 'شركة الأنظمة الميكانيكية',
      supervisorApproved: false, reviewed: true, reviewedBy: 'م. ماجد الزهراني', reviewDate: '2025-10-17 15:30',
      frozen: false, digitallyDocumented: true, documentationDate: '2025-10-17 16:00',
      downloadCount: 12, status: 'proposed', category: 'hvac',
      tags: ['HVAC', 'تكييف', 'مقترح'], relatedFiles: ['DWG-005']
    },
    {
      id: 'DWG-005', fileName: 'نظام الإطفاء الآلي.dwg', fileType: 'DWG',
      fileSize: '9.8 MB', version: 1, uploadDate: '2025-10-16 11:50',
      uploadedBy: 'م. طارق المالكي', uploaderId: 'ENG-045',
      notes: 'مخطط نظام الإطفاء بالرشاشات الأوتوماتيكية',
      transactionId: 'TXN-2025-4501', transactionName: 'مشروع برج الأعمال التجاري',
      clientId: 'CLT-789', clientName: 'شركة التطوير العمراني',
      externalEntityId: 'EXT-460', externalEntityName: 'شركة أنظمة السلامة',
      supervisorApproved: true, supervisorName: 'م. سعود القرني', approvalDate: '2025-10-16 16:00',
      reviewed: true, reviewedBy: 'م. منى العمري', reviewDate: '2025-10-16 14:20',
      frozen: false, digitallyDocumented: true, documentationDate: '2025-10-16 17:00',
      downloadCount: 14, status: 'approved', category: 'fire',
      tags: ['حريق', 'رشاشات', 'سلامة'], relatedFiles: []
    }
  ]);

  // تصنيفات الحالة
  const statusCategories = [
    { id: 'current', label: 'الوضع القائم', icon: Folder, color: '#6b7280', badge: 'قائم' },
    { id: 'proposed', label: 'الوضع المقترح', icon: Edit, color: '#f59e0b', badge: 'مقترح' },
    { id: 'approved', label: 'الوضع المعتمد', icon: CheckCircle, color: '#10b981', badge: 'معتمد' }
  ];

  const TABS_CONFIG = [
    { id: '872-01', label: 'معمارية', code: '872-01', icon: Building },
    { id: '872-02', label: 'إنشائية', code: '872-02', icon: Layers },
    { id: '872-03', label: 'ميكانيكية', code: '872-03', icon: Settings },
    { id: '872-04', label: 'كهرباء', code: '872-04', icon: Zap },
    { id: '872-05', label: 'HVAC', code: '872-05', icon: Wind },
    { id: '872-06', label: 'كفاءة الطاقة', code: '872-06', icon: Leaf },
    { id: '872-07', label: 'الحماية من الحريق', code: '872-07', icon: Flame },
    { id: '872-08', label: 'إضافة أنواع', code: '872-08', icon: Plus }
  ];

  const getCurrentCategory = () => {
    const categoryMap = {
      '872-01': 'architectural',
      '872-02': 'structural',
      '872-03': 'mechanical',
      '872-04': 'electrical',
      '872-05': 'hvac',
      '872-06': 'energy',
      '872-07': 'fire'
    };
    return categoryMap[activeTab] || 'architectural';
  };

  const getFilteredFiles = () => {
    const currentCategory = getCurrentCategory();
    return drawingFiles.filter(file => {
      const matchesCategory = file.category === currentCategory;
      const matchesStatus = activeSubTab === 'all' || file.status === activeSubTab;
      const matchesSearch = searchTerm === '' || 
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.includes(searchTerm));
      const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
      
      return matchesCategory && matchesStatus && matchesSearch && matchesFilter;
    });
  };

  const handleUploadFile = () => {
    // محاكاة رفع الملف
    const newFile: DrawingFile = {
      id: `DWG-${String(drawingFiles.length + 1).padStart(3, '0')}`,
      fileName: uploadForm.fileName,
      fileType: uploadForm.fileType,
      fileSize: '0 MB',
      version: 1,
      uploadDate: new Date().toLocaleString('ar-SA'),
      uploadedBy: 'المستخدم الحالي',
      uploaderId: 'USR-001',
      notes: uploadForm.notes,
      transactionId: uploadForm.transactionId,
      transactionName: uploadForm.transactionName,
      clientId: uploadForm.clientId,
      clientName: uploadForm.clientName,
      externalEntityId: uploadForm.externalEntityId,
      externalEntityName: uploadForm.externalEntityName,
      supervisorApproved: uploadForm.supervisorApproved,
      reviewed: uploadForm.reviewed,
      frozen: uploadForm.frozen,
      digitallyDocumented: uploadForm.digitallyDocumented,
      downloadCount: 0,
      status: uploadForm.status as 'current' | 'proposed' | 'approved',
      category: getCurrentCategory(),
      tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
      relatedFiles: []
    };
    
    setDrawingFiles([...drawingFiles, newFile]);
    setShowUploadDialog(false);
    
    // إعادة تعيين النموذج
    setUploadForm({
      fileName: '', fileType: '', notes: '', transactionId: '', transactionName: '',
      clientId: '', clientName: '', externalEntityId: '', externalEntityName: '',
      status: 'current', tags: '',
      supervisorApproved: false, reviewed: false, frozen: false, digitallyDocumented: false
    });
  };

  const toggleFileFrozen = (fileId: string) => {
    setDrawingFiles(drawingFiles.map(file =>
      file.id === fileId ? { ...file, frozen: !file.frozen } : file
    ));
  };

  const incrementDownloadCount = (fileId: string) => {
    setDrawingFiles(drawingFiles.map(file =>
      file.id === fileId ? { ...file, downloadCount: file.downloadCount + 1 } : file
    ));
  };

  const renderFilesList = () => {
    const filteredFiles = getFilteredFiles();
    
    return (
      <div className="space-y-3">
        {/* شريط البحث والفلترة */}
        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-3">
              <InputWithCopy
                label="بحث في الملفات"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم، الملاحظات، أو الوسوم..."
                copyable={false}
                clearable={true}
              />
              
              <SelectWithCopy
                label="فلترة حسب الحالة"
                id="filter-status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'current', label: 'الوضع القائم' },
                  { value: 'proposed', label: 'الوضع المقترح' },
                  { value: 'approved', label: 'الوضع المعتمد' }
                ]}
                copyable={false}
                clearable={false}
              />
              
              <div className="flex items-end gap-2">
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="flex-1"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Upload className="h-4 w-4 ml-2" />
                  رفع ملف جديد
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-6 gap-2">
          {[
            { label: 'إجمالي الملفات', value: filteredFiles.length, icon: FileText, color: 'blue' },
            { label: 'معتمد', value: filteredFiles.filter(f => f.status === 'approved').length, icon: CheckCircle, color: 'green' },
            { label: 'مقترح', value: filteredFiles.filter(f => f.status === 'proposed').length, icon: Edit, color: 'orange' },
            { label: 'قائم', value: filteredFiles.filter(f => f.status === 'current').length, icon: Folder, color: 'gray' },
            { label: 'مجمد', value: filteredFiles.filter(f => f.frozen).length, icon: Lock, color: 'red' },
            { label: 'موثق', value: filteredFiles.filter(f => f.digitallyDocumented).length, icon: Shield, color: 'purple' }
          ].map((stat, i) => (
            <Card key={i} className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(stat.icon, { 
                    className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                  })}
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* جدول الملفات */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المخططات - {statusCategories.find(s => s.id === activeSubTab)?.label || 'الكل'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>
                      #
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسم الملف
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                      النوع
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '90px' }}>
                      الحجم
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '70px' }}>
                      الإصدار
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                      الحالة
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                      الاعتمادات
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '90px' }}>
                      التحميلات
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '200px' }}>
                      الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file, index) => (
                    <TableRow key={file.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          {file.frozen && <Lock className="h-3.5 w-3.5 text-red-500" />}
                          {file.digitallyDocumented && <Shield className="h-3.5 w-3.5 text-purple-500" />}
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.fileName}</span>
                        </div>
                        {file.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {file.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs px-1 py-0 h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {file.fileType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {file.fileSize}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          v{file.version}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {file.status === 'approved' && (
                          <Badge className="bg-green-500 text-white text-xs">معتمد</Badge>
                        )}
                        {file.status === 'proposed' && (
                          <Badge className="bg-orange-500 text-white text-xs">مقترح</Badge>
                        )}
                        {file.status === 'current' && (
                          <Badge className="bg-gray-500 text-white text-xs">قائم</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          {file.supervisorApproved && (
                            <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
                              <CheckCircle className="h-3 w-3" />
                            </Badge>
                          )}
                          {file.reviewed && (
                            <Badge className="bg-purple-500 text-white text-xs px-1 py-0">
                              <Eye className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1">
                          <Download className="h-3.5 w-3.5 text-gray-500" />
                          {file.downloadCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedFile(file);
                              setShowDetailsDialog(true);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (!file.frozen) {
                                incrementDownloadCount(file.id);
                              }
                            }}
                            disabled={file.frozen}
                            className="h-7 w-7 p-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedFile(file);
                              setShowVersionsDialog(true);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <History className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleFileFrozen(file.id)}
                            className="h-7 w-7 p-0"
                          >
                            {file.frozen ? (
                              <Unlock className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-red-600" />
                            )}
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
  };

  const renderAddCategoryTab = () => {
    return (
      <div className="space-y-3">
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-5 w-5 inline ml-2" />
              إضافة فئة مخططات جديدة
            </CardTitle>
            <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              يمكنك إضافة أنواع إضافية من المخططات حسب احتياجات المشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="اسم الفئة بالعربية"
                id="cat-name-ar"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="مثال: مخططات الري"
                required
                copyable={false}
                clearable={true}
              />
              
              <InputWithCopy
                label="اسم الفئة بالإنجليزية"
                id="cat-name-en"
                value={newCategory.nameEn}
                onChange={(e) => setNewCategory({...newCategory, nameEn: e.target.value})}
                placeholder="Example: Irrigation Plans"
                required
                copyable={false}
                clearable={true}
              />
            </div>

            <TextAreaWithCopy
              label="وصف الفئة"
              id="cat-description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              rows={3}
              placeholder="وصف تفصيلي لنوع المخططات..."
              copyable={false}
              clearable={true}
            />

            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون المميز</Label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                className="w-full h-10 rounded-md border cursor-pointer"
              />
            </div>

            <Button
              onClick={() => {
                if (newCategory.name && newCategory.nameEn) {
                  const newCat: DrawingCategory = {
                    id: `custom-${Date.now()}`,
                    name: newCategory.name,
                    nameEn: newCategory.nameEn,
                    icon: Folder,
                    color: newCategory.color,
                    description: newCategory.description,
                    fileCount: 0
                  };
                  setDrawingCategories([...drawingCategories, newCat]);
                  setNewCategory({ name: '', nameEn: '', description: '', color: '#2563eb' });
                }
              }}
              className="w-full"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة الفئة
            </Button>
          </CardContent>
        </Card>

        {/* قائمة الفئات الحالية */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الفئات الحالية ({drawingCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {drawingCategories.map((cat) => (
                <Card key={cat.id} className="card-rtl" style={{ borderRight: `4px solid ${cat.color}` }}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {React.createElement(cat.icon, { 
                          className: 'h-8 w-8', 
                          style: { color: cat.color } 
                        })}
                        <div>
                          <p className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {cat.nameEn}
                          </p>
                          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{cat.fileCount} ملف</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === '872-08') {
      return renderAddCategoryTab();
    }

    return (
      <div className="space-y-3">
        {/* تبويبات فرعية للحالة */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={activeSubTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveSubTab('all')}
            className="w-full"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <FileText className="h-4 w-4 ml-2" />
            جميع الملفات
          </Button>
          {statusCategories.map((status) => (
            <Button
              key={status.id}
              variant={activeSubTab === status.id ? 'default' : 'outline'}
              onClick={() => setActiveSubTab(status.id)}
              className="w-full"
              style={{ 
                fontFamily: 'Tajawal, sans-serif',
                ...(activeSubTab === status.id ? { backgroundColor: status.color } : {})
              }}
            >
              {React.createElement(status.icon, { className: 'h-4 w-4 ml-2' })}
              {status.label}
            </Button>
          ))}
        </div>

        {renderFilesList()}
      </div>
    );
  };

  return (
    <div className="p-4" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <CodeDisplay code="SCR-872" position="top-right" />
      
      <div className="mb-4">
        <h1 className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          المخططات الهندسية
        </h1>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إدارة شاملة لجميع أنواع المخططات الهندسية مع التصنيف والتتبع الكامل
        </p>
      </div>

      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        {/* السايد بار الموحد */}
        <div
          style={{
            width: '200px',
            minWidth: '200px',
            height: 'calc(100vh - 140px)',
            position: 'sticky',
            top: '70px',
            right: 0,
            background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
            borderLeft: '2px solid #e2e8f0',
            borderRadius: '12px 0 0 12px',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <ScrollArea className="h-full" style={{ direction: 'rtl' }}>
            <div className="p-2 space-y-0.5">
              {TABS_CONFIG.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setActiveSubTab('all');
                    }}
                    className="w-full text-right px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                    style={{
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '13px',
                      background: isActive
                        ? 'linear-gradient(to left, #3b82f6, #2563eb)'
                        : '#ffffff',
                      color: isActive ? '#ffffff' : '#374151',
                      border: isActive ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      boxShadow: isActive
                        ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                    <Badge
                      variant={isActive ? 'secondary' : 'outline'}
                      className="text-xs px-1.5 py-0 h-4 font-mono"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: isActive ? '#ffffff' : '#6b7280',
                        borderColor: isActive ? 'transparent' : '#e5e7eb'
                      }}
                    >
                      {tab.code}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* محتوى الشاشة */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة رفع ملف */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-4xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Upload className="h-5 w-5 inline ml-2" />
              رفع مخطط هندسي جديد
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قم برفع المخطط وتعبئة جميع المعلومات المطلوبة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[600px] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="اسم الملف"
                id="file-name"
                value={uploadForm.fileName}
                onChange={(e) => setUploadForm({...uploadForm, fileName: e.target.value})}
                placeholder="مثال: المخطط المعماري - الدور الأول.dwg"
                required
                copyable={false}
                clearable={true}
              />

              <SelectWithCopy
                label="نوع الملف"
                id="file-type"
                value={uploadForm.fileType}
                onChange={(value) => setUploadForm({...uploadForm, fileType: value})}
                options={[
                  { value: 'DWG', label: 'DWG - AutoCAD' },
                  { value: 'PDF', label: 'PDF - مستند' },
                  { value: 'DXF', label: 'DXF - تبادل بيانات' },
                  { value: 'RVT', label: 'RVT - Revit' },
                  { value: 'SKP', label: 'SKP - SketchUp' },
                  { value: 'DWF', label: 'DWF - تصميم ويب' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>

            <TextAreaWithCopy
              label="ملاحظات وتفاصيل"
              id="notes"
              value={uploadForm.notes}
              onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
              rows={3}
              placeholder="أضف أي ملاحظات أو تفاصيل هامة..."
              copyable={false}
              clearable={true}
            />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="رقم المعاملة"
                id="transaction-id"
                value={uploadForm.transactionId}
                onChange={(e) => setUploadForm({...uploadForm, transactionId: e.target.value})}
                placeholder="TXN-2025-####"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="اسم المعاملة"
                id="transaction-name"
                value={uploadForm.transactionName}
                onChange={(e) => setUploadForm({...uploadForm, transactionName: e.target.value})}
                placeholder="اسم المشروع أو المعاملة"
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="رقم العميل"
                id="client-id"
                value={uploadForm.clientId}
                onChange={(e) => setUploadForm({...uploadForm, clientId: e.target.value})}
                placeholder="CLT-####"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="اسم العميل"
                id="client-name"
                value={uploadForm.clientName}
                onChange={(e) => setUploadForm({...uploadForm, clientName: e.target.value})}
                placeholder="اسم العميل"
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="رقم الجهة الخارجية"
                id="external-id"
                value={uploadForm.externalEntityId}
                onChange={(e) => setUploadForm({...uploadForm, externalEntityId: e.target.value})}
                placeholder="EXT-####"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="اسم الجهة الخارجية"
                id="external-name"
                value={uploadForm.externalEntityName}
                onChange={(e) => setUploadForm({...uploadForm, externalEntityName: e.target.value})}
                placeholder="اسم المكتب الاستشاري"
                copyable={true}
                clearable={true}
              />
            </div>

            <Separator />

            <SelectWithCopy
              label="حالة المخطط"
              id="status"
              value={uploadForm.status}
              onChange={(value) => setUploadForm({...uploadForm, status: value})}
              options={[
                { value: 'current', label: 'الوضع القائم' },
                { value: 'proposed', label: 'الوضع المقترح' },
                { value: 'approved', label: 'الوضع المعتمد' }
              ]}
              copyable={false}
              clearable={false}
            />

            <InputWithCopy
              label="الوسوم (مفصولة بفواصل)"
              id="tags"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              placeholder="مثال: دور أرضي, واجهة, معتمد"
              copyable={false}
              clearable={true}
            />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <EnhancedSwitch
                id="supervisor-approved"
                checked={uploadForm.supervisorApproved}
                onCheckedChange={(checked) => setUploadForm({...uploadForm, supervisorApproved: checked})}
                label="معتمد من المشرف"
                description="هل تم اعتماد المخطط من المشرف؟"
                variant="success"
                size="md"
              />

              <EnhancedSwitch
                id="reviewed"
                checked={uploadForm.reviewed}
                onCheckedChange={(checked) => setUploadForm({...uploadForm, reviewed: checked})}
                label="تمت المراجعة"
                description="هل تمت مراجعة المخطط فنياً؟"
                variant="default"
                size="md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EnhancedSwitch
                id="frozen"
                checked={uploadForm.frozen}
                onCheckedChange={(checked) => setUploadForm({...uploadForm, frozen: checked})}
                label="تجميد الملف"
                description="منع التحميل والاستخدام"
                variant="danger"
                size="md"
              />

              <EnhancedSwitch
                id="digitally-documented"
                checked={uploadForm.digitallyDocumented}
                onCheckedChange={(checked) => setUploadForm({...uploadForm, digitallyDocumented: checked})}
                label="توثيق إلكتروني"
                description="هل تم التوثيق الإلكتروني؟"
                variant="default"
                size="md"
              />
            </div>
          </div>

          <DialogFooter className="gap-2" style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUploadFile}
              disabled={!uploadForm.fileName || !uploadForm.fileType}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Upload className="h-4 w-4 ml-2" />
              رفع الملف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل الملف */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-5xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <FileText className="h-5 w-5 inline ml-2" />
              تفاصيل المخطط الهندسي
            </DialogTitle>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4">
              {/* معلومات الملف الأساسية */}
              <Card className="card-rtl">
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معلومات الملف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</Label>
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedFile.fileName}</p>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الملف</Label>
                      <Badge variant="outline">{selectedFile.fileType}</Badge>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</Label>
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedFile.fileSize}</p>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الإصدار</Label>
                      <Badge variant="secondary">v{selectedFile.version}</Badge>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الرفع</Label>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.uploadDate}
                      </p>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رفعه</Label>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.uploadedBy}
                      </p>
                    </div>
                  </div>

                  {selectedFile.notes && (
                    <div className="mt-4">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات</Label>
                      <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.notes}
                      </p>
                    </div>
                  )}

                  {selectedFile.tags.length > 0 && (
                    <div className="mt-4">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسوم</Label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {selectedFile.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* معلومات المشروع والعلاقات */}
              <Card className="card-rtl">
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معلومات المشروع والعلاقات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedFile.transactionId}</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedFile.transactionName}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedFile.clientId}</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedFile.clientName}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة الخارجية</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedFile.externalEntityId}</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedFile.externalEntityName}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* حالة الاعتمادات والمراجعة */}
              <Card className="card-rtl">
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    حالة الاعتمادات والمراجعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {selectedFile.supervisorApproved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد المشرف</p>
                          {selectedFile.supervisorApproved && selectedFile.supervisorName && (
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedFile.supervisorName} - {selectedFile.approvalDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={selectedFile.supervisorApproved ? 'bg-green-500' : 'bg-gray-400'}>
                        {selectedFile.supervisorApproved ? 'معتمد' : 'غير معتمد'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {selectedFile.reviewed ? (
                          <Eye className="h-5 w-5 text-blue-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>المراجعة الفنية</p>
                          {selectedFile.reviewed && selectedFile.reviewedBy && (
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedFile.reviewedBy} - {selectedFile.reviewDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={selectedFile.reviewed ? 'bg-blue-500' : 'bg-gray-400'}>
                        {selectedFile.reviewed ? 'تمت المراجعة' : 'لم تتم'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {selectedFile.frozen ? (
                          <Lock className="h-5 w-5 text-red-500" />
                        ) : (
                          <Unlock className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة التجميد</p>
                          {selectedFile.frozen && selectedFile.frozenReason && (
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              السبب: {selectedFile.frozenReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={selectedFile.frozen ? 'bg-red-500' : 'bg-green-500'}>
                        {selectedFile.frozen ? 'مجمد' : 'نشط'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {selectedFile.digitallyDocumented ? (
                          <Shield className="h-5 w-5 text-purple-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق الإلكتروني</p>
                          {selectedFile.digitallyDocumented && selectedFile.documentationDate && (
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ التوثيق: {selectedFile.documentationDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={selectedFile.digitallyDocumented ? 'bg-purple-500' : 'bg-gray-400'}>
                        {selectedFile.digitallyDocumented ? 'موثق' : 'غير موثق'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* إحصائيات الاستخدام */}
              <Card className="card-rtl">
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إحصائيات الاستخدام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-gray-500" />
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد مرات التحميل</span>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {selectedFile.downloadCount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة النسخ */}
      <Dialog open={showVersionsDialog} onOpenChange={setShowVersionsDialog}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <History className="h-5 w-5 inline ml-2" />
              سجل الإصدارات
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              جميع الإصدارات المرفوعة لهذا المخطط
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الملف الحالي: <strong>{selectedFile.fileName}</strong> - الإصدار {selectedFile.version}
                </p>
              </Alert>

              <Card className="card-rtl">
                <CardContent className="p-0">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإصدار
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          التاريخ
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          رفعه
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الملاحظات
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(selectedFile.version)].map((_, i) => {
                        const versionNum = selectedFile.version - i;
                        const isCurrent = versionNum === selectedFile.version;
                        
                        return (
                          <TableRow key={versionNum} className={isCurrent ? 'bg-blue-50/50' : ''}>
                            <TableCell className="text-right">
                              <Badge variant={isCurrent ? 'default' : 'outline'}>
                                v{versionNum} {isCurrent && '(الحالي)'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedFile.uploadDate}
                            </TableCell>
                            <TableCell className="text-right text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedFile.uploadedBy}
                            </TableCell>
                            <TableCell className="text-right text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {versionNum === 1 ? 'الإصدار الأولي' : 'تحديث وتعديلات'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button size="sm" variant="ghost" className="h-7 px-2">
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                variant="outline"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Upload className="h-4 w-4 ml-2" />
                رفع إصدار جديد
              </Button>
            </div>
          )}

          <DialogFooter style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowVersionsDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EngineeringDrawings_Complete_872;
