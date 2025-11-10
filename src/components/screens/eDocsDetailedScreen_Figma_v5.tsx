import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Upload,
  Settings,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  RefreshCw,
  HelpCircle,
  X,
  MoreHorizontal,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Shield,
  Lock,
  Key,
  Tag,
  Calendar,
  User,
  Activity,
  Zap,
  Database,
  Server,
  Network,
  Play,
  Pause,
  Square,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  BarChart3,
  TrendingUp,
  History,
  Archive,
  Share2,
  FileCheck,
  UserCheck,
  Fingerprint,
  Stamp,
  Award,
  Link2,
  ExternalLink,
  Copy,
  Trash2,
  Plus,
  Minus,
  Save,
  Send,
  Mail,
  MessageSquare,
  Bell,
  AlertCircle,
  Info,
  Circle
} from 'lucide-react';

// Types and Interfaces
interface DocumentType {
  id: string;
  name: string;
  color: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploader: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  size: string;
  tags: string[];
  signatures?: number;
  verified?: boolean;
}

interface UserData {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

interface FilterState {
  status: string;
  uploadedBy: string;
  dateFrom: string;
  dateTo: string;
  docTypes: string[];
}

interface PaginationState {
  current: number;
  total: number;
  pageSize: number;
}

interface Signature {
  id: string;
  signer: string;
  date: string;
  certificate: string;
  status: 'valid' | 'invalid' | 'pending';
}

interface WorkflowStep {
  id: string;
  name: string;
  assignedTo: string;
  status: 'completed' | 'pending' | 'in-progress';
  dueDate: string;
}

// Mock Data
const mockDocTypes: DocumentType[] = [
  { id: 'contract', name: 'عقود', color: 'bg-blue-100 text-blue-800' },
  { id: 'license', name: 'تراخيص', color: 'bg-green-100 text-green-800' },
  { id: 'certificate', name: 'شهادات', color: 'bg-purple-100 text-purple-800' },
  { id: 'report', name: 'تقارير', color: 'bg-orange-100 text-orange-800' },
  { id: 'invoice', name: 'فواتير', color: 'bg-red-100 text-red-800' }
];

const mockUsers: UserData[] = [
  { id: '1', name: 'أحمد محمد', role: 'مدير', email: 'ahmed@example.com' },
  { id: '2', name: 'فاطمة علي', role: 'محاسب', email: 'fatima@example.com' },
  { id: '3', name: 'محمد سالم', role: 'موظف', email: 'mohammed@example.com' },
  { id: '4', name: 'نورا أحمد', role: 'مساعد', email: 'nora@example.com' }
];

const mockDocuments: Document[] = [
  {
    id: 'DOC-2025-001',
    name: 'عقد مشروع الإنشاءات الجديد',
    type: 'contract',
    uploader: 'أحمد محمد',
    status: 'pending',
    uploadDate: '2025-01-22',
    size: '2.4 MB',
    tags: ['عقد', 'إنشاءات', 'مشروع'],
    signatures: 2,
    verified: false
  },
  {
    id: 'DOC-2025-002',
    name: 'ترخيص البناء رقم 12345',
    type: 'license',
    uploader: 'فاطمة علي',
    status: 'approved',
    uploadDate: '2025-01-21',
    size: '1.8 MB',
    tags: ['ترخيص', 'بناء'],
    signatures: 3,
    verified: true
  },
  {
    id: 'DOC-2025-003',
    name: 'شهادة جودة المواد',
    type: 'certificate',
    uploader: 'محمد سالم',
    status: 'rejected',
    uploadDate: '2025-01-20',
    size: '3.2 MB',
    tags: ['شهادة', 'جودة', 'مواد'],
    signatures: 1,
    verified: false
  }
];

const mockSignatures: Signature[] = [
  {
    id: 'SIG-001',
    signer: 'أحمد محمد',
    date: '2025-01-22 10:30',
    certificate: 'SHA-256:a1b2c3d4...',
    status: 'valid'
  },
  {
    id: 'SIG-002',
    signer: 'فاطمة علي',
    date: '2025-01-22 11:15',
    certificate: 'SHA-256:e5f6g7h8...',
    status: 'valid'
  }
];

const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: 'STEP-001',
    name: 'مراجعة أولية',
    assignedTo: 'أحمد محمد',
    status: 'completed',
    dueDate: '2025-01-23'
  },
  {
    id: 'STEP-002',
    name: 'التوقيع الرقمي',
    assignedTo: 'فاطمة علي',
    status: 'in-progress',
    dueDate: '2025-01-24'
  },
  {
    id: 'STEP-003',
    name: 'الموافقة النهائية',
    assignedTo: 'محمد سالم',
    status: 'pending',
    dueDate: '2025-01-25'
  }
];

export default function EDocsDetailedScreen() {
  // State Management
  const [activeTab, setActiveTab] = useState('750-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'All',
    uploadedBy: '',
    dateFrom: '',
    dateTo: '',
    docTypes: []
  });
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    total: 5,
    pageSize: 10
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleString('ar-SA'));

  // Computed Values
  const totalDocs = mockDocuments.length;
  const pendingCount = mockDocuments.filter(doc => doc.status === 'pending').length;
  const approvedCount = mockDocuments.filter(doc => doc.status === 'approved').length;
  const rejectedCount = mockDocuments.filter(doc => doc.status === 'rejected').length;

  // Event Handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDocuments(mockDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleDocumentSelect = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
      setSelectAll(false);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for documents:`, selectedDocuments);
    setSelectedDocuments([]);
    setSelectAll(false);
  };

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocViewer(true);
  };

  const handleRefresh = () => {
    setLastSyncTime(new Date().toLocaleString('ar-SA'));
    console.log('Refreshing documents...');
  };

  const resetFilters = () => {
    setFilters({
      status: 'All',
      uploadedBy: '',
      dateFrom: '',
      dateTo: '',
      docTypes: []
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      pending: 'معلق',
      approved: 'موافق عليه',
      rejected: 'مرفوض'
    };
    return (
      <Badge className={`${variants[status]} border text-xs`}>
        {labels[status]}
      </Badge>
    );
  };

  const getTypeTag = (typeId: string) => {
    const type = mockDocTypes.find(t => t.id === typeId);
    return type ? (
      <Badge className={`${type.color} text-xs`}>
        {type.name}
      </Badge>
    ) : null;
  };

  // قائمة التابات مع الترقيم الموحد
  const tabs = [
    { id: '750-01', name: 'إدارة المستندات', icon: FileText },
    { id: '750-02', name: 'التوقيع الرقمي', icon: Edit },
    { id: '750-03', name: 'التحقق من الوثائق', icon: Shield },
    { id: '750-04', name: 'الأرشفة الذكية', icon: Archive },
    { id: '750-05', name: 'سير العمل', icon: Activity },
    { id: '750-06', name: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '750-07', name: 'الأمن والصلاحيات', icon: Lock },
    { id: '750-08', name: 'المشاركة والتعاون', icon: Share2 },
    { id: '750-09', name: 'السجل والمراجعة', icon: History },
    { id: '750-10', name: 'الإعدادات المتقدمة', icon: Settings }
  ];

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case '750-01':
        return (
          <div className="universal-dense-tab-content">
            {/* Header */}
            <div className="bg-blue-50 border-b border-blue-200 p-4 rounded-t-lg mb-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="typography-h1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التوثيق الإلكتروني
                </h1>

                <div className="flex items-center gap-3">
                  <Button className="btn-primary" size="sm" title="رفع مستند جديد">
                    <Upload className="h-4 w-4" />
                    رفع مستند
                  </Button>

                  <Select>
                    <SelectTrigger className="input-field w-48">
                      <SelectValue placeholder="اختر نوع المستند" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDocTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" title="إعدادات الوثائق">
                    <Settings className="h-4 w-4" />
                  </Button>

                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="input-field pr-10"
                      placeholder="ابحث بالمستند أو المعاملة…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Header Stats Bar */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon">
                  <FileText className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">{totalDocs}</div>
                <div className="dense-stat-label">إجمالي الوثائق</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Clock className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#f59e0b' }}>{pendingCount}</div>
                <div className="dense-stat-label">معلق</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#10b981' }}>{approvedCount}</div>
                <div className="dense-stat-label">موافق عليه</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#ef4444' }}>{rejectedCount}</div>
                <div className="dense-stat-label">مرفوض</div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="dense-grid dense-grid-3 gap-4">
              {/* Left Panel - Filters */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Filter className="h-4 w-4" />
                    المرشحات
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">الحالة</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">الكل</SelectItem>
                        <SelectItem value="Pending">معلق</SelectItem>
                        <SelectItem value="Approved">موافق عليه</SelectItem>
                        <SelectItem value="Rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">رُفع بواسطة</Label>
                    <Select value={filters.uploadedBy} onValueChange={(value) => setFilters(prev => ({ ...prev, uploadedBy: value }))}>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر المستخدم" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <Label className="dense-form-label">من تاريخ</Label>
                      <Input
                        type="date"
                        className="dense-form-input"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      />
                    </div>
                    <div className="dense-form-group">
                      <Label className="dense-form-label">إلى تاريخ</Label>
                      <Input
                        type="date"
                        className="dense-form-input"
                        value={filters.dateTo}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">نوع المستند</Label>
                    <div className="space-y-2 max-h-24 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {mockDocTypes.map(type => (
                        <div key={type.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`filter-${type.id}`}
                            checked={filters.docTypes.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters(prev => ({ ...prev, docTypes: [...prev.docTypes, type.id] }));
                              } else {
                                setFilters(prev => ({ ...prev, docTypes: prev.docTypes.filter(t => t !== type.id) }));
                              }
                            }}
                          />
                          <Label htmlFor={`filter-${type.id}`} className="text-xs cursor-pointer">
                            {type.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="dense-btn w-full" onClick={resetFilters}>
                    إعادة تعيين
                  </Button>
                </div>
              </div>

              {/* Center Panel - Documents Table */}
              <div className="dense-section col-span-2">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <FolderOpen className="h-4 w-4" />
                    قائمة المستندات
                  </div>
                  <div className="dense-section-actions">
                    <Button className="dense-action-btn" onClick={handleRefresh} title="تحديث">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="dense-table w-full">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>
                          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                        </th>
                        <th>معرف الوثيقة</th>
                        <th>الاسم</th>
                        <th>النوع</th>
                        <th>رُفع بواسطة</th>
                        <th>الحالة</th>
                        <th style={{ width: '120px' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <Checkbox
                              checked={selectedDocuments.includes(doc.id)}
                              onCheckedChange={(checked) => handleDocumentSelect(doc.id, !!checked)}
                            />
                          </td>
                          <td>
                            <code className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                              {doc.id}
                            </code>
                          </td>
                          <td>
                            <button
                              className="text-xs text-blue-600 hover:underline cursor-pointer text-right"
                              onClick={() => handleDocumentClick(doc)}
                            >
                              {doc.name}
                            </button>
                          </td>
                          <td>{getTypeTag(doc.type)}</td>
                          <td>{doc.uploader}</td>
                          <td>{getStatusBadge(doc.status)}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="عرض">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="توقيع">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="رفض">
                                <X className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="المزيد">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button size="sm" variant="outline" disabled={pagination.current === 1}>
                    <ChevronRight className="h-3 w-3" />
                    السابق
                  </Button>
                  <span className="text-xs px-3">
                    صفحة {pagination.current} من {pagination.total}
                  </span>
                  <Button size="sm" variant="outline" disabled={pagination.current === pagination.total}>
                    التالي
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bulk Actions Section */}
            <div className="dense-section mt-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Users className="h-4 w-4" />
                  الإجراءات المجمعة
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="dense-btn dense-btn-primary"
                  disabled={selectedDocuments.length === 0}
                  onClick={() => handleBulkAction('approve')}
                  style={{ backgroundColor: '#10b981' }}
                >
                  <CheckCircle className="h-3 w-3" />
                  موافقة ({selectedDocuments.length})
                </Button>
                <Button
                  size="sm"
                  className="dense-btn"
                  disabled={selectedDocuments.length === 0}
                  onClick={() => handleBulkAction('reject')}
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  <X className="h-3 w-3" />
                  رفض ({selectedDocuments.length})
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="dense-btn"
                  disabled={selectedDocuments.length === 0}
                  onClick={() => handleBulkAction('delete')}
                >
                  <X className="h-3 w-3" />
                  حذف ({selectedDocuments.length})
                </Button>
              </div>
            </div>
          </div>
        );

      case '750-02':
        return (
          <div className="universal-dense-tab-content">
            {/* Digital Signature Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Edit className="h-4 w-4" />
                  التوقيع الرقمي
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  توقيع جديد
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <FileCheck className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">156</div>
                <div className="dense-stat-label">مستند موقّع</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Clock className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">23</div>
                <div className="dense-stat-label">بانتظار التوقيع</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <UserCheck className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">45</div>
                <div className="dense-stat-label">موقّع معتمد</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">3</div>
                <div className="dense-stat-label">توقيع منتهي</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* Signature Certificates */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Fingerprint className="h-4 w-4" />
                    شهادات التوقيع
                  </div>
                </div>
                <div className="space-y-2">
                  {mockSignatures.map((sig) => (
                    <div key={sig.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Stamp className="h-4 w-4 text-blue-600" />
                          <span className="typography-body">{sig.signer}</span>
                        </div>
                        <Badge className={sig.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {sig.status === 'valid' ? 'صالح' : 'غير صالح'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{sig.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Key className="h-3 w-3" />
                          <code className="text-xs bg-gray-100 px-1 rounded">{sig.certificate}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Button size="sm" variant="ghost" className="dense-btn">
                          <Eye className="h-3 w-3" />
                          عرض
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-btn">
                          <Download className="h-3 w-3" />
                          تحميل
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-btn">
                          <CheckCircle className="h-3 w-3" />
                          تحقق
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Form */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Edit className="h-4 w-4" />
                    إنشاء توقيع جديد
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">اختر المستند</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر مستند للتوقيع" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">نوع التوقيع</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر نوع التوقيع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">توقيع بسيط</SelectItem>
                        <SelectItem value="advanced">توقيع متقدم</SelectItem>
                        <SelectItem value="qualified">توقيع مؤهل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">رقم الشهادة</Label>
                    <Input
                      className="dense-form-input"
                      placeholder="أدخل رقم شهادة التوقيع"
                    />
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">ملاحظات</Label>
                    <Textarea
                      className="dense-form-textarea"
                      placeholder="أضف ملاحظات اختيارية"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="dense-btn dense-btn-primary flex-1">
                      <Edit className="h-3 w-3" />
                      توقيع الآن
                    </Button>
                    <Button variant="outline" className="dense-btn flex-1">
                      <Save className="h-3 w-3" />
                      حفظ كمسودة
                    </Button>
                  </div>
                </div>

                {/* Verification Info */}
                <Alert className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    التوقيع الإلكتروني معتمد وفقاً للمعايير الدولية ISO 27001 ويمتثل لنظام المعاملات الإلكترونية السعودي.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        );

      case '750-03':
        return (
          <div className="universal-dense-tab-content">
            {/* Verification Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Shield className="h-4 w-4" />
                  التحقق من الوثائق
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  تحقق جديد
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">234</div>
                <div className="dense-stat-label">وثائق موثقة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Clock className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">12</div>
                <div className="dense-stat-label">قيد المراجعة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <X className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">5</div>
                <div className="dense-stat-label">مرفوضة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Award className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">98%</div>
                <div className="dense-stat-label">نسبة النجاح</div>
              </div>
            </div>

            {/* Verification Process */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* Verification Steps */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Activity className="h-4 w-4" />
                    خطوات التحقق
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="dense-content-card p-3 border-r-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="typography-body">فحص الصحة</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                    </div>
                    <p className="text-xs text-gray-600">تم التحقق من سلامة الملف وعدم وجود أخطاء</p>
                    <Progress value={100} className="h-1 mt-2" />
                  </div>

                  <div className="dense-content-card p-3 border-r-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="typography-body">التحقق من التوقيعات</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                    </div>
                    <p className="text-xs text-gray-600">جميع التوقيعات صالحة ومعتمدة</p>
                    <Progress value={100} className="h-1 mt-2" />
                  </div>

                  <div className="dense-content-card p-3 border-r-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="typography-body">مراجعة المحتوى</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">جاري</Badge>
                    </div>
                    <p className="text-xs text-gray-600">مراجعة محتوى الوثيقة للتأكد من الامتثال</p>
                    <Progress value={65} className="h-1 mt-2" />
                  </div>

                  <div className="dense-content-card p-3 border-r-4 border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span className="typography-body">الموافقة النهائية</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">معلق</Badge>
                    </div>
                    <p className="text-xs text-gray-600">بانتظار الموافقة من المسؤول</p>
                    <Progress value={0} className="h-1 mt-2" />
                  </div>
                </div>
              </div>

              {/* Verification Tools */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Shield className="h-4 w-4" />
                    أدوات التحقق
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="dense-content-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Fingerprint className="h-4 w-4 text-purple-600" />
                      <span className="typography-body">التحقق من البصمة الرقمية</span>
                    </div>
                    <Input
                      className="dense-form-input mb-2"
                      placeholder="أدخل البصمة الرقمية للتحقق"
                    />
                    <Button className="dense-btn dense-btn-primary w-full">
                      <Search className="h-3 w-3" />
                      بدء التحقق
                    </Button>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4 text-blue-600" />
                      <span className="typography-body">التحقق من الرابط</span>
                    </div>
                    <Input
                      className="dense-form-input mb-2"
                      placeholder="أدخل رابط الوثيقة"
                    />
                    <Button className="dense-btn dense-btn-primary w-full">
                      <ExternalLink className="h-3 w-3" />
                      فحص الرابط
                    </Button>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="h-4 w-4 text-green-600" />
                      <span className="typography-body">التحقق من الشهادة</span>
                    </div>
                    <Input
                      className="dense-form-input mb-2"
                      placeholder="أدخل رقم الشهادة"
                    />
                    <Button className="dense-btn dense-btn-primary w-full">
                      <CheckCircle className="h-3 w-3" />
                      التحقق
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      جميع أدوات التحقق متوافقة مع معايير الأمن السيبراني الوطنية.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        );

      case '750-04':
        return (
          <div className="universal-dense-tab-content">
            {/* Archiving Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Archive className="h-4 w-4" />
                  الأرشفة الذكية
                </div>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-primary" size="sm">
                    <Plus className="h-3 w-3" />
                    أرشفة جديدة
                  </Button>
                  <Button variant="outline" className="dense-btn" size="sm">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                  <Archive className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">1,245</div>
                <div className="dense-stat-label">مستند مؤرشف</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Database className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">45.2 GB</div>
                <div className="dense-stat-label">حجم الأرشيف</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Zap className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">99.8%</div>
                <div className="dense-stat-label">نسبة الاسترجاع</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Clock className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">2.5s</div>
                <div className="dense-stat-label">وقت الوصول</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dense-grid dense-grid-3 gap-4">
              {/* Archive Categories */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <FolderOpen className="h-4 w-4" />
                    تصنيفات الأرشيف
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'عقود 2024', count: 345, color: 'blue' },
                    { name: 'تراخيص', count: 123, color: 'green' },
                    { name: 'شهادات', count: 234, color: 'purple' },
                    { name: 'تقارير', count: 456, color: 'orange' },
                    { name: 'فواتير', count: 87, color: 'red' }
                  ].map((category, idx) => (
                    <div key={idx} className="dense-content-card p-2 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FolderOpen className={`h-4 w-4 text-${category.color}-600`} />
                          <span className="text-xs">{category.name}</span>
                        </div>
                        <Badge className={`bg-${category.color}-100 text-${category.color}-800 text-xs`}>
                          {category.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archive Settings */}
              <div className="dense-section col-span-2">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Settings className="h-4 w-4" />
                    إعدادات الأرشفة الذكية
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">فترة الأرشفة التلقائية</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر الفترة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="60">60 يوم</SelectItem>
                        <SelectItem value="90">90 يوم</SelectItem>
                        <SelectItem value="180">180 يوم</SelectItem>
                        <SelectItem value="365">سنة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <Label className="dense-form-label">مستوى الضغط</Label>
                      <Select>
                        <SelectTrigger className="dense-form-input">
                          <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">عالي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="dense-form-group">
                      <Label className="dense-form-label">نوع التشفير</Label>
                      <Select>
                        <SelectTrigger className="dense-form-input">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes128">AES-128</SelectItem>
                          <SelectItem value="aes256">AES-256</SelectItem>
                          <SelectItem value="rsa2048">RSA-2048</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="auto-backup" />
                      <Label htmlFor="auto-backup" className="text-xs cursor-pointer">
                        نسخ احتياطي تلقائي
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="encrypt" />
                      <Label htmlFor="encrypt" className="text-xs cursor-pointer">
                        تشفير الملفات المؤرشفة
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="compress" />
                      <Label htmlFor="compress" className="text-xs cursor-pointer">
                        ضغط الملفات لتوفير المساحة
                      </Label>
                    </div>
                  </div>

                  <Button className="dense-btn dense-btn-primary w-full">
                    <Save className="h-3 w-3" />
                    حفظ الإعدادات
                  </Button>
                </div>

                {/* Storage Info */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">استخدام مساحة التخزين</span>
                    <span className="text-xs">45.2 GB / 100 GB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">
                    متبقي 54.8 GB من المساحة المتاحة
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case '750-05':
        return (
          <div className="universal-dense-tab-content">
            {/* Workflow Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Activity className="h-4 w-4" />
                  سير العمل
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  سير عمل جديد
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">89</div>
                <div className="dense-stat-label">سير عمل نشط</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Clock className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">34</div>
                <div className="dense-stat-label">معلق</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <TrendingUp className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">95%</div>
                <div className="dense-stat-label">نسبة الإنجاز</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                  <Zap className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">2.3d</div>
                <div className="dense-stat-label">متوسط الوقت</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* Active Workflows */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Play className="h-4 w-4" />
                    سير العمل النشط
                  </div>
                </div>
                <div className="space-y-2">
                  {mockWorkflowSteps.map((step) => (
                    <div key={step.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="typography-body">{step.name}</span>
                        <Badge className={
                          step.status === 'completed' ? 'bg-green-100 text-green-800' :
                          step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {step.status === 'completed' ? 'مكتمل' :
                           step.status === 'in-progress' ? 'جاري' : 'معلق'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{step.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>موعد الإنجاز: {step.dueDate}</span>
                        </div>
                      </div>
                      {step.status === 'in-progress' && (
                        <Progress value={65} className="h-1 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Designer */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Network className="h-4 w-4" />
                    مصمم سير العمل
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">اسم سير العمل</Label>
                    <Input
                      className="dense-form-input"
                      placeholder="أدخل اسم سير العمل"
                    />
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">نوع المستند</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر نوع المستند" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDocTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">المراحل</Label>
                    <div className="space-y-2">
                      {['المراجعة الأولية', 'الموافقة', 'التوقيع', 'الأرشفة'].map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-xs flex-1">{stage}</span>
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="dense-btn w-full">
                        <Plus className="h-3 w-3" />
                        إضافة مرحلة
                      </Button>
                    </div>
                  </div>

                  <Button className="dense-btn dense-btn-primary w-full">
                    <Save className="h-3 w-3" />
                    حفظ سير العمل
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case '750-06':
        return (
          <div className="universal-dense-tab-content">
            {/* Reports Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  التقارير والإحصائيات
                </div>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-primary" size="sm">
                    <Plus className="h-3 w-3" />
                    تقرير جديد
                  </Button>
                  <Button variant="outline" className="dense-btn" size="sm">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                  <Button variant="outline" className="dense-btn" size="sm">
                    <Printer className="h-3 w-3" />
                    طباعة
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <FileText className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">2,345</div>
                <div className="dense-stat-label">إجمالي الوثائق</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <TrendingUp className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">+23%</div>
                <div className="dense-stat-label">النمو الشهري</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Users className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">156</div>
                <div className="dense-stat-label">مستخدم نشط</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                  <Database className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">125 GB</div>
                <div className="dense-stat-label">حجم البيانات</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="dense-grid dense-grid-2 gap-4 mb-4">
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <BarChart3 className="h-4 w-4" />
                    الوثائق حسب النوع
                  </div>
                </div>
                <div className="p-4">
                  {mockDocTypes.map((type, idx) => (
                    <div key={type.id} className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{type.name}</span>
                        <span className="text-xs font-bold">{Math.floor(Math.random() * 500) + 100}</span>
                      </div>
                      <Progress value={Math.random() * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <TrendingUp className="h-4 w-4" />
                    معدل الموافقة
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-50 to-green-100 mb-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">94%</div>
                      <div className="text-xs text-green-700">معدل الموافقة</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>موافق عليه</span>
                      <span className="font-bold">2,205</span>
                    </div>
                    <div className="flex justify-between">
                      <span>مرفوض</span>
                      <span className="font-bold">140</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Templates */}
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  قوالب التقارير
                </div>
              </div>
              <div className="dense-grid dense-grid-4 gap-2">
                {[
                  { name: 'تقرير شهري', icon: Calendar, color: 'blue' },
                  { name: 'تقرير سنوي', icon: BarChart3, color: 'green' },
                  { name: 'تقرير الأداء', icon: TrendingUp, color: 'purple' },
                  { name: 'تقرير التدقيق', icon: Shield, color: 'orange' }
                ].map((template, idx) => (
                  <div key={idx} className="dense-content-card p-3 cursor-pointer text-center">
                    <template.icon className={`h-6 w-6 mx-auto mb-2 text-${template.color}-600`} />
                    <div className="text-xs font-medium">{template.name}</div>
                    <Button size="sm" className="dense-btn w-full mt-2">
                      <Download className="h-3 w-3" />
                      تنزيل
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '750-07':
        return (
          <div className="universal-dense-tab-content">
            {/* Security Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Lock className="h-4 w-4" />
                  الأمن والصلاحيات
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  صلاحية جديدة
                </Button>
              </div>
            </div>

            {/* Security Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Shield className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">عالي</div>
                <div className="dense-stat-label">مستوى الأمان</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Users className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">45</div>
                <div className="dense-stat-label">مستخدم مصرح</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Key className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">12</div>
                <div className="dense-stat-label">مجموعة صلاحيات</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">3</div>
                <div className="dense-stat-label">تنبيه أمني</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* User Permissions */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Users className="h-4 w-4" />
                    صلاحيات المستخدمين
                  </div>
                </div>
                <div className="space-y-2">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium">{user.name}</div>
                            <div className="text-xs text-gray-600">{user.role}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="dense-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">قراءة</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs">كتابة</Badge>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">حذف</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Lock className="h-4 w-4" />
                    إعدادات الأمان
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">المصادقة الثنائية</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      تفعيل المصادقة الثنائية لجميع المستخدمين
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">تشفير الملفات</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      تشفير جميع الملفات المرفوعة تلقائياً
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">سجل الأنشطة</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      تسجيل جميع الأنشطة للمراجعة
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">إنتهاء الجلسة التلقائي</span>
                      <Select>
                        <SelectTrigger className="dense-form-input w-24">
                          <SelectValue placeholder="30 دقيقة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 دقيقة</SelectItem>
                          <SelectItem value="30">30 دقيقة</SelectItem>
                          <SelectItem value="60">60 دقيقة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      جميع الإعدادات الأمنية متوافقة مع معايير ISO 27001 ومعايير الأمن السيبراني الوطنية.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        );

      case '750-08':
        return (
          <div className="universal-dense-tab-content">
            {/* Sharing Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Share2 className="h-4 w-4" />
                  المشاركة والتعاون
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  مشاركة جديدة
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Share2 className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">234</div>
                <div className="dense-stat-label">مستند مشارك</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Users className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">67</div>
                <div className="dense-stat-label">متعاون نشط</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <MessageSquare className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">456</div>
                <div className="dense-stat-label">تعليق</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                  <Link2 className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">89</div>
                <div className="dense-stat-label">رابط مشاركة</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* Shared Documents */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <FileText className="h-4 w-4" />
                    المستندات المشاركة
                  </div>
                </div>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-xs font-medium">{doc.name}</div>
                          <div className="text-xs text-gray-600">مشارك مع {Math.floor(Math.random() * 5) + 2} أشخاص</div>
                        </div>
                        <Button size="sm" variant="ghost" className="dense-btn">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-white">A</span>
                            </div>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" className="dense-btn flex-1">
                          <Mail className="h-3 w-3" />
                          دعوة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Options */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Share2 className="h-4 w-4" />
                    خيارات المشاركة
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">اختر المستند</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر مستند للمشاركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">مشاركة مع</Label>
                    <Input
                      className="dense-form-input"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">مستوى الصلاحية</Label>
                    <Select>
                      <SelectTrigger className="dense-form-input">
                        <SelectValue placeholder="اختر الصلاحية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">عرض فقط</SelectItem>
                        <SelectItem value="comment">عرض وتعليق</SelectItem>
                        <SelectItem value="edit">تحرير كامل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify" />
                      <Label htmlFor="notify" className="text-xs cursor-pointer">
                        إرسال إشعار بالبريد الإلكتروني
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="expire" />
                      <Label htmlFor="expire" className="text-xs cursor-pointer">
                        تعيين تاريخ انتهاء للمشاركة
                      </Label>
                    </div>
                  </div>

                  <Button className="dense-btn dense-btn-primary w-full">
                    <Send className="h-3 w-3" />
                    إرسال المشاركة
                  </Button>
                </div>

                {/* Link Sharing */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs font-medium mb-2">أو شارك عبر الرابط</div>
                  <div className="flex gap-2">
                    <Input
                      className="dense-form-input flex-1"
                      value="https://docs.example.com/share/abc123"
                      readOnly
                    />
                    <Button size="sm" variant="outline" className="dense-btn">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '750-09':
        return (
          <div className="universal-dense-tab-content">
            {/* Audit Log Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <History className="h-4 w-4" />
                  السجل والمراجعة
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="dense-btn" size="sm">
                    <Download className="h-3 w-3" />
                    تصدير السجل
                  </Button>
                  <Button variant="outline" className="dense-btn" size="sm">
                    <Printer className="h-3 w-3" />
                    طباعة
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Activity className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">3,456</div>
                <div className="dense-stat-label">إجمالي العمليات</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">156</div>
                <div className="dense-stat-label">اليوم</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">12</div>
                <div className="dense-stat-label">أحداث هامة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <X className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">3</div>
                <div className="dense-stat-label">أخطاء</div>
              </div>
            </div>

            {/* Filters */}
            <div className="dense-section mb-4">
              <div className="dense-form-row">
                <div className="dense-form-group">
                  <Label className="dense-form-label">من تاريخ</Label>
                  <Input type="date" className="dense-form-input" />
                </div>
                <div className="dense-form-group">
                  <Label className="dense-form-label">إلى تاريخ</Label>
                  <Input type="date" className="dense-form-input" />
                </div>
                <div className="dense-form-group">
                  <Label className="dense-form-label">نوع العملية</Label>
                  <Select>
                    <SelectTrigger className="dense-form-input">
                      <SelectValue placeholder="الكل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="create">إنشاء</SelectItem>
                      <SelectItem value="update">تحديث</SelectItem>
                      <SelectItem value="delete">حذف</SelectItem>
                      <SelectItem value="share">مشاركة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="dense-form-group">
                  <Label className="dense-form-label">المستخدم</Label>
                  <Select>
                    <SelectTrigger className="dense-form-input">
                      <SelectValue placeholder="الكل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Clock className="h-4 w-4" />
                  سجل الأنشطة
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { action: 'إنشاء مستند', user: 'أحمد محمد', time: '10:30', doc: 'عقد جديد', type: 'create' },
                  { action: 'تحديث', user: 'فاطمة علي', time: '11:15', doc: 'ترخيص 12345', type: 'update' },
                  { action: 'مشاركة', user: 'محمد سالم', time: '12:00', doc: 'شهادة جودة', type: 'share' },
                  { action: 'حذف', user: 'نورا أحمد', time: '13:45', doc: 'مسودة', type: 'delete' },
                  { action: 'توقيع', user: 'أحمد محمد', time: '14:20', doc: 'عقد مشروع', type: 'sign' }
                ].map((log, idx) => (
                  <div key={idx} className="dense-content-card p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.type === 'create' ? 'bg-green-100' :
                        log.type === 'update' ? 'bg-blue-100' :
                        log.type === 'share' ? 'bg-purple-100' :
                        log.type === 'delete' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        {log.type === 'create' && <Plus className="h-4 w-4 text-green-600" />}
                        {log.type === 'update' && <Edit className="h-4 w-4 text-blue-600" />}
                        {log.type === 'share' && <Share2 className="h-4 w-4 text-purple-600" />}
                        {log.type === 'delete' && <Trash2 className="h-4 w-4 text-red-600" />}
                        {log.type === 'sign' && <FileCheck className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium">{log.action} - {log.doc}</div>
                        <div className="text-xs text-gray-600">
                          بواسطة {log.user} • {log.time}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '750-10':
        return (
          <div className="universal-dense-tab-content">
            {/* Settings Header */}
            <div className="dense-section mb-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  الإعدادات المتقدمة
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Save className="h-3 w-3" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="dense-grid dense-grid-2 gap-4">
              {/* General Settings */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Settings className="h-4 w-4" />
                    الإعدادات العامة
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">اسم النظام</Label>
                    <Input
                      className="dense-form-input"
                      defaultValue="نظام التوثيق الإلكتروني"
                    />
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger className="dense-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">المنطقة الزمنية</Label>
                    <Select defaultValue="riyadh">
                      <SelectTrigger className="dense-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="jeddah">جدة (GMT+3)</SelectItem>
                        <SelectItem value="dammam">الدمام (GMT+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">تنسيق التاريخ</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger className="dense-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Bell className="h-4 w-4" />
                    إعدادات الإشعارات
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">إشعارات البريد الإلكتروني</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      إرسال إشعارات عبر البريد الإلكتروني
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">إشعارات النظام</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      عرض إشعارات داخل النظام
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">إشعارات الرسائل النصية</span>
                      <Checkbox />
                    </div>
                    <p className="text-xs text-gray-600">
                      إرسال إشعارات عبر الر��ائل النصية
                    </p>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">الإشعارات الفورية</span>
                      <Checkbox defaultChecked />
                    </div>
                    <p className="text-xs text-gray-600">
                      استلام إشعارات فورية للأحداث الهامة
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage Settings */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Database className="h-4 w-4" />
                    إعدادات التخزين
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <Label className="dense-form-label">الحد الأقصى لحجم الملف</Label>
                    <Select defaultValue="50">
                      <SelectTrigger className="dense-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 MB</SelectItem>
                        <SelectItem value="25">25 MB</SelectItem>
                        <SelectItem value="50">50 MB</SelectItem>
                        <SelectItem value="100">100 MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="dense-form-group">
                    <Label className="dense-form-label">أنواع الملفات المسموحة</Label>
                    <Textarea
                      className="dense-form-textarea"
                      defaultValue="PDF, DOC, DOCX, XLS, XLSX, JPG, PNG"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="auto-delete" />
                      <Label htmlFor="auto-delete" className="text-xs cursor-pointer">
                        حذف الملفات القديمة تلقائياً بعد سنة
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="compress-files" defaultChecked />
                      <Label htmlFor="compress-files" className="text-xs cursor-pointer">
                        ضغط الملفات تلقائياً
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Settings */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Network className="h-4 w-4" />
                    إعدادات التكامل
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Microsoft Office', status: true, icon: FileText },
                    { name: 'Google Drive', status: false, icon: Database },
                    { name: 'Dropbox', status: false, icon: Archive },
                    { name: 'OneDrive', status: true, icon: FolderOpen }
                  ].map((integration, idx) => (
                    <div key={idx} className="dense-content-card p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <integration.icon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium">{integration.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={integration.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {integration.status ? 'متصل' : 'غير متصل'}
                          </Badge>
                          <Button size="sm" variant="ghost" className="dense-btn">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="dense-section mt-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="dense-btn">
                  <X className="h-3 w-3" />
                  إلغاء
                </Button>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ جميع التغييرات
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout" dir="rtl">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        {/* هيدر السايد بار */}
        <div className="vertical-tabs-sidebar-header">
          <h2 className="typography-h2" style={{ color: 'white', marginBottom: '4px' }}>
            التوثيق الإلكتروني
          </h2>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <code style={{ fontFamily: 'Courier New, monospace', fontSize: '10px' }}>SCR-750</code>
          </div>
        </div>

        {/* جسم السايد بار - قائمة التابات */}
        <div className="vertical-tabs-sidebar-body">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`vertical-tab-item-condensed ${isActive ? 'active' : ''}`}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0 
                  }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="vertical-tab-title-condensed">
                    {tab.name}
                  </div>
                  
                  <div className="vertical-tab-number-condensed">
                    {tab.id}
                  </div>
                </button>
                
                {index < tabs.length - 1 && (
                  <div className="vertical-tab-separator-condensed" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* فوتر السايد بار */}
        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
            <span>10 تبويبات</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              نشط
            </span>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        {/* هيدر المحتوى */}
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="typography-h2" style={{ marginBottom: '2px' }}>
                {tabs.find(t => t.id === activeTab)?.name}
              </h3>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <code style={{ fontFamily: 'Courier New, monospace', fontSize: '10px' }}>
                  {activeTab}
                </code>
                <span>•</span>
                <span>آخر تحديث: {lastSyncTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" />
                تحديث
              </Button>
              <Button size="sm" variant="outline">
                <HelpCircle className="h-3 w-3" />
                مساعدة
              </Button>
            </div>
          </div>
        </div>

        {/* جسم المحتوى */}
        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
