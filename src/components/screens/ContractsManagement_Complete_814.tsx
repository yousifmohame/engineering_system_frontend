import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { 
  FileText, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle, Clock, 
  AlertTriangle, Search, Filter, Calendar, DollarSign, Users, Settings,
  Copy, Save, X, Printer, Send, Mail, MessageCircle, Smartphone,
  FileSignature, QrCode, Shield, Zap, Star, Layers, BarChart3,
  PlayCircle, Briefcase, Target, Repeat, CreditCard, Archive
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UniversalTabsSidebar from '../UniversalTabsSidebar';

// أنواع البيانات
interface Contract {
  id: string;
  number: string;
  type: 'engineering' | 'consulting' | 'execution' | 'maintenance';
  title: string;
  clientName: string;
  clientId: string;
  value: number;
  status: 'draft' | 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  purpose: string;
  type: 'engineering' | 'consulting' | 'execution' | 'maintenance';
  clauses: ContractClause[];
  isDefault: boolean;
  createdDate: string;
  updatedDate: string;
  usageCount: number;
}

interface ContractClause {
  id: string;
  title: string;
  content: string;
  isRequired: boolean;
  order: number;
}

interface AuthenticationType {
  id: string;
  type: 'digital' | 'manual' | 'qrcode';
  enabled: boolean;
  description: string;
}

const ContractsManagement_Complete_814: React.FC = () => {
  const [activeTab, setActiveTab] = useState('814-01');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showClauseDialog, setShowClauseDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);

  // بيانات وهمية للعقود
  const [contracts] = useState<Contract[]>([
    { id: 'CNT-2025-001', number: '001/2025', type: 'engineering', title: 'عقد تصميم فيلا سكنية', clientName: 'أحمد محمد العتيبي', clientId: '360-001', value: 500000, status: 'active', startDate: '2025-01-01', endDate: '2025-12-31' },
    { id: 'CNT-2025-002', number: '002/2025', type: 'consulting', title: 'عقد استشارات هندسية', clientName: 'فاطمة سعد القحطاني', clientId: '360-002', value: 180000, status: 'active', startDate: '2025-02-01', endDate: '2025-08-01' },
    { id: 'CNT-2025-003', number: '003/2025', type: 'execution', title: 'عقد تنفيذ توسعة مبنى', clientName: 'خالد عبدالله الشمري', clientId: '360-003', value: 850000, status: 'pending', startDate: '2025-03-01', endDate: '2026-03-01' }
  ]);

  // بيانات وهمية لنماذج العقود
  const [contractTemplates] = useState<ContractTemplate[]>([
    {
      id: 'TPL-001',
      name: 'نموذج العقد الهندسي الأساسي',
      purpose: 'engineering',
      type: 'engineering',
      isDefault: true,
      createdDate: '2024-01-01',
      updatedDate: '2025-01-15',
      usageCount: 45,
      clauses: [
        { id: 'CL-001', title: 'البند الأول: التعريفات', content: 'يقصد بالمصطلحات الواردة في هذا العقد المعاني المبينة قرين كل منها...', isRequired: true, order: 1 },
        { id: 'CL-002', title: 'البند الثاني: نطاق العمل', content: 'يتعهد الطرف الأول (المكتب الهندسي) بتقديم الخدمات الهندسية التالية...', isRequired: true, order: 2 },
        { id: 'CL-003', title: 'البند الثالث: القيمة المالية', content: 'تبلغ القيمة الإجمالية لهذا العقد مبلغاً وقدره...', isRequired: true, order: 3 },
        { id: 'CL-004', title: 'البند الرابع: مدة العقد', content: 'يسري هذا العقد اعتباراً من تاريخ... ولمدة...', isRequired: true, order: 4 },
        { id: 'CL-005', title: 'البند الخامس: شروط الدفع', content: 'يتم الدفع على النحو التالي...', isRequired: true, order: 5 },
        { id: 'CL-006', title: 'البند السادس: التزامات المكتب', content: 'يلتزم المكتب الهندسي بما يلي...', isRequired: false, order: 6 },
        { id: 'CL-007', title: 'البند السابع: التزامات العميل', content: 'يلتزم العميل بما يلي...', isRequired: false, order: 7 },
        { id: 'CL-008', title: 'البند الثامن: إنهاء العقد', content: 'يحق لأي من الطرفين إنهاء العقد في الحالات التالية...', isRequired: false, order: 8 }
      ]
    },
    {
      id: 'TPL-002',
      name: 'نموذج العقد الاستشاري المتقدم',
      purpose: 'consulting',
      type: 'consulting',
      isDefault: false,
      createdDate: '2024-02-15',
      updatedDate: '2025-01-10',
      usageCount: 28,
      clauses: [
        { id: 'CL-009', title: 'البند الأول: نطاق الاستشارة', content: 'يقدم المستشار الخدمات الاستشارية التالية...', isRequired: true, order: 1 },
        { id: 'CL-010', title: 'البند الثاني: الأتعاب والرسوم', content: 'تبلغ أتعاب الاستشارة...', isRequired: true, order: 2 },
        { id: 'CL-011', title: 'البند الثالث: السرية', content: 'يلتزم الطرفان بالمحافظة على سرية المعلومات...', isRequired: true, order: 3 }
      ]
    },
    {
      id: 'TPL-003',
      name: 'نموذج عقد التنفيذ الشامل',
      purpose: 'execution',
      type: 'execution',
      isDefault: true,
      createdDate: '2024-03-20',
      updatedDate: '2025-01-18',
      usageCount: 35,
      clauses: [
        { id: 'CL-012', title: 'البند الأول: المشروع', content: 'وصف تفصيلي للمشروع المراد تنفيذه...', isRequired: true, order: 1 },
        { id: 'CL-013', title: 'البند الثاني: التنفيذ', content: 'يتم التنفيذ وفقاً للمخططات المعتمدة...', isRequired: true, order: 2 }
      ]
    },
    {
      id: 'TPL-004',
      name: 'نموذج العقد الهندسي المبسط',
      purpose: 'engineering',
      type: 'engineering',
      isDefault: false,
      createdDate: '2024-05-10',
      updatedDate: '2025-01-12',
      usageCount: 18,
      clauses: [
        { id: 'CL-014', title: 'البند الأول: الخدمات', content: 'يقدم المكتب الخدمات الهندسية الأساسية...', isRequired: true, order: 1 },
        { id: 'CL-015', title: 'البند الثاني: المقابل المالي', content: 'القيمة المتفق عليها هي...', isRequired: true, order: 2 }
      ]
    }
  ]);

  const tabs = [
    { id: '814-01', label: 'لوحة التحكم', icon: BarChart3, color: 'bg-blue-500' },
    { id: '814-02', label: 'جميع العقود', icon: FileText, color: 'bg-green-500' },
    { id: '814-03', label: 'إنشاء عقد جديد', icon: Plus, color: 'bg-purple-500' },
    { id: '814-04', label: 'نماذج العقود', icon: Layers, color: 'bg-orange-500' },
    { id: '814-05', label: 'إعدادات العقود', icon: Settings, color: 'bg-cyan-500' },
    { id: '814-06', label: 'التوقيعات والتوثيق', icon: FileSignature, color: 'bg-pink-500' },
    { id: '814-07', label: 'المراسلات', icon: Mail, color: 'bg-indigo-500' },
    { id: '814-08', label: 'التقارير', icon: Printer, color: 'bg-teal-500' },
    { id: '814-09', label: 'الأرشيف', icon: Archive, color: 'bg-gray-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: <Badge className="bg-gray-500 text-white text-xs px-2 py-0">مسودة</Badge>,
      active: <Badge className="bg-green-500 text-white text-xs px-2 py-0">نشط</Badge>,
      pending: <Badge className="bg-yellow-500 text-white text-xs px-2 py-0">قيد المراجعة</Badge>,
      expired: <Badge className="bg-red-500 text-white text-xs px-2 py-0">منتهي</Badge>
    };
    return badges[status] || <Badge className="text-xs px-2 py-0">غير محدد</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      engineering: <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0">هندسي</Badge>,
      consulting: <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-0">استشاري</Badge>,
      execution: <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">تنفيذ</Badge>,
      maintenance: <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-0">صيانة</Badge>
    };
    return badges[type] || <Badge className="text-xs px-2 py-0">غير محدد</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '814-01':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة التحكم - إدارة العقود</h2>
                <p className="text-sm text-gray-600">نظرة شاملة على جميع العقود والنماذج</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="button-rtl h-8"><Download className="h-3 w-3 ml-1" />تصدير</Button>
                <Button size="sm" className="button-rtl h-8"><Plus className="h-3 w-3 ml-1" />عقد جديد</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي العقود', value: contracts.length, icon: FileText, bg: 'from-blue-50 to-blue-100', text: 'blue' },
                { label: 'العقود النشطة', value: contracts.filter(c => c.status === 'active').length, icon: CheckCircle, bg: 'from-green-50 to-green-100', text: 'green' },
                { label: 'قيد المراجعة', value: contracts.filter(c => c.status === 'pending').length, icon: Clock, bg: 'from-yellow-50 to-yellow-100', text: 'yellow' },
                { label: 'إجمالي القيمة', value: contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString('ar-SA'), icon: DollarSign, bg: 'from-purple-50 to-purple-100', text: 'purple' }
              ].map((stat, i) => (
                <Card key={i} className={`card-element card-rtl bg-gradient-to-br ${stat.bg} hover:shadow-md transition-all cursor-pointer`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.text}-500` })}
                      <Badge variant="outline" className={`text-${stat.text}-600 text-xs px-1.5 py-0`}>عقد</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                    <p className={`text-xl text-${stat.text}-600`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع العقود حسب النوع</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { label: 'هندسية', count: contracts.filter(c => c.type === 'engineering').length, color: 'blue' },
                      { label: 'استشارية', count: contracts.filter(c => c.type === 'consulting').length, color: 'purple' },
                      { label: 'تنفيذ', count: contracts.filter(c => c.type === 'execution').length, color: 'green' },
                      { label: 'صيانة', count: contracts.filter(c => c.type === 'maintenance').length, color: 'orange' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm">{item.label}</span>
                        <Badge className={`bg-${item.color}-500 text-white text-xs px-2 py-0`}>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>النماذج المتاحة</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {contractTemplates.slice(0, 4).map((template, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-orange-500" />
                          <span className="text-xs">{template.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{template.usageCount} استخدام</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود الأخيرة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {contracts.slice(0, 3).map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs">{contract.title}</p>
                          <p className="text-xs text-gray-500">{contract.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{contract.value.toLocaleString('ar-SA')} ر.س</span>
                        {getStatusBadge(contract.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '814-02':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العقود</h2>
                <p className="text-sm text-gray-600">عرض وإدارة جميع العقود في النظام</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="button-rtl h-8"><Plus className="h-3 w-3 ml-1" />عقد جديد</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة العقود ({contracts.length})</CardTitle>
                  <Input placeholder="بحث..." className="input-field w-48 h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البداية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{contract.number}</code></TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</TableCell>
                          <TableCell className="text-right py-2">
                            <div>
                              <p className="text-xs">{contract.clientName}</p>
                              <p className="text-xs text-gray-500">{contract.clientId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">{getTypeBadge(contract.type)}</TableCell>
                          <TableCell className="text-right py-2"><span className="font-mono text-xs">{contract.value.toLocaleString('ar-SA')} ر.س</span></TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(contract.status)}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{contract.startDate}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Send className="h-3 w-3" /></Button>
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

      case '814-04':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نماذج العقود</h2>
                <p className="text-sm text-gray-600">استعراض وإدارة نماذج العقود الجاهزة مع إمكانية التعديل</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="button-rtl h-8" onClick={() => setShowTemplateDialog(true)}><Plus className="h-3 w-3 ml-1" />نموذج جديد</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي النماذج', value: contractTemplates.length, icon: Layers, color: 'orange' },
                { label: 'النماذج الافتراضية', value: contractTemplates.filter(t => t.isDefault).length, icon: Star, color: 'yellow' },
                { label: 'الهندسية', value: contractTemplates.filter(t => t.purpose === 'engineering').length, icon: Briefcase, color: 'blue' },
                { label: 'الاستشارية', value: contractTemplates.filter(t => t.purpose === 'consulting').length, icon: Target, color: 'purple' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة النماذج ({contractTemplates.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-[480px]">
                  <div className="space-y-2">
                    {contractTemplates.map((template) => (
                      <Card key={template.id} className="card-element card-rtl bg-gradient-to-l from-orange-50 to-white hover:shadow-lg transition-all cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                                <Layers className="h-4 w-4 text-orange-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</h3>
                                  {template.isDefault && <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0"><Star className="h-3 w-3" /></Badge>}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                  {getTypeBadge(template.type)}
                                  <span>•</span>
                                  <span>{template.clauses.length} بند</span>
                                  <span>•</span>
                                  <span>{template.usageCount} استخدام</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-2">
                            <h4 className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>البنود ({template.clauses.length})</h4>
                            <div className="space-y-1">
                              {template.clauses.slice(0, 3).map((clause) => (
                                <div key={clause.id} className="flex items-center justify-between p-1.5 bg-white rounded border border-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 flex-shrink-0">{clause.order}</div>
                                    <span className="text-xs truncate">{clause.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {clause.isRequired && <Badge className="bg-red-500 text-white text-xs px-1 py-0">إلزامي</Badge>}
                                    <Button size="sm" variant="outline" className="h-5 w-5 p-0"><Edit className="h-3 w-3" /></Button>
                                    {!clause.isRequired && <Button size="sm" variant="outline" className="h-5 w-5 p-0"><Trash2 className="h-3 w-3 text-red-500" /></Button>}
                                  </div>
                                </div>
                              ))}
                              {template.clauses.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">+{template.clauses.length - 3} بنود أخرى</div>
                              )}
                            </div>
                          </div>

                          <Separator className="my-2" />

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              آخر تحديث: {template.updatedDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => { setSelectedTemplate(template); setShowPreviewDialog(true); }}><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => setShowClauseDialog(true)}><Plus className="h-3 w-3 ml-1" />إضافة بند</Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Edit className="h-3 w-3 ml-1" />تعديل</Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Copy className="h-3 w-3 ml-1" />نسخ</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '814-05':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات العقود</h2>
                <p className="text-sm text-gray-600">تخصيص إعدادات العقود والنماذج حسب الأغراض المختلفة</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><Save className="h-3 w-3 ml-1" />حفظ الإعدادات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات النماذج حسب الغرض</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-3">
                  {['engineering', 'consulting', 'execution', 'maintenance'].map((purpose, i) => {
                    const purposeTemplates = contractTemplates.filter(t => t.purpose === purpose);
                    const purposeNames = {
                      engineering: 'العقود الهندسية',
                      consulting: 'العقود الاستشارية',
                      execution: 'عقود التنفيذ',
                      maintenance: 'عقود الصيانة'
                    };
                    return (
                      <Card key={i} className="card-element card-rtl bg-gray-50 hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{purposeNames[purpose]}</h3>
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{purposeTemplates.length} نموذج</Badge>
                          </div>

                          <div className="space-y-2">
                            {purposeTemplates.map((template) => (
                              <div key={template.id} className="p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-orange-500" />
                                    <div>
                                      <p className="text-xs">{template.name}</p>
                                      <p className="text-xs text-gray-500">{template.clauses.length} بند - {template.usageCount} استخدام</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch checked={template.isDefault} />
                                    <span className="text-xs text-gray-500">افتراضي</span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button size="sm" variant="outline" className="w-full button-rtl h-7 text-xs">
                              <Plus className="h-3 w-3 ml-1" />
                              إضافة نموذج جديد لـ {purposeNames[purpose]}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات العامة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-3">
                  <div className="form-rtl">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="defaultLanguage" className="text-xs">اللغة الافتراضية للعقود</Label>
                        <div className="select-rtl">
                          <Select defaultValue="ar">
                            <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ar">العربية</SelectItem>
                              <SelectItem value="en">الإنجليزية</SelectItem>
                              <SelectItem value="both">ثنائي اللغة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="numberingSystem" className="text-xs">نظام الترقيم</Label>
                        <div className="select-rtl">
                          <Select defaultValue="yearly">
                            <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yearly">سنوي (001/2025)</SelectItem>
                              <SelectItem value="continuous">مستمر (CNT-0001)</SelectItem>
                              <SelectItem value="monthly">شهري (01-2025-001)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="defaultDuration" className="text-xs">المدة الافتراضية (بالأشهر)</Label>
                        <Input id="defaultDuration" type="number" defaultValue="12" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                      </div>

                      <div>
                        <Label htmlFor="renewalNotice" className="text-xs">فترة الإشعار قبل الانتهاء (يوم)</Label>
                        <Input id="renewalNotice" type="number" defaultValue="30" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>خيارات إضافية</h4>
                    {[
                      { label: 'السماح بالتجديد التلقائي', desc: 'تجديد العقد تلقائياً عند انتهاء المدة', checked: true },
                      { label: 'طلب التوقيع الإلكتروني إلزامياً', desc: 'عدم السماح بالعقود بدون توقيع إلكتروني', checked: false },
                      { label: 'إرسال نسخة للعميل تلقائياً', desc: 'إرسال نسخة من العقد للعميل عند الاعتماد', checked: true },
                      { label: 'تفعيل نظام الموافقات المتعددة', desc: 'طلب موافقة أكثر من مسؤول على العقود', checked: false }
                    ].map((option, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-xs">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </div>
                        <Switch defaultChecked={option.checked} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '814-06':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيعات والتوثيق</h2>
                <p className="text-sm text-gray-600">إدارة أنواع التوثيق والتوقيعات الإلكترونية والتحقق</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><Save className="h-3 w-3 ml-1" />حفظ الإعدادات</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'إلكتروني', icon: FileSignature, color: 'blue', count: 25, enabled: true },
                { type: 'يدوي', icon: Edit, color: 'green', count: 8, enabled: true },
                { type: 'QR Code', icon: QrCode, color: 'purple', count: 32, enabled: true }
              ].map((method, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 bg-${method.color}-100 rounded flex items-center justify-center`}>
                        {React.createElement(method.icon, { className: `h-4 w-4 text-${method.color}-600` })}
                      </div>
                      <Switch checked={method.enabled} />
                    </div>
                    <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>توثيق {method.type}</h3>
                    <p className="text-xs text-gray-500">{method.count} عقد</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التوقيع الإلكتروني</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-start gap-3">
                      <FileSignature className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيع الإلكتروني من طرف المكتب</h4>
                        <p className="text-xs text-gray-600 mb-2">التوقيع الرسمي للمكتب الهندسي على العقود</p>
                        <div className="form-rtl">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">اسم الموقع</Label>
                              <Input placeholder="مدير المكتب" className="input-field h-7 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                            </div>
                            <div>
                              <Label className="text-xs">المسمى الوظيفي</Label>
                              <Input placeholder="المدير التنفيذي" className="input-field h-7 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs"><Upload className="h-3 w-3 ml-1" />رفع التوقيع</Button>
                          <Button size="sm" variant="outline" className="h-6 text-xs"><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-start gap-3">
                      <Edit className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق اليدوي</h4>
                        <p className="text-xs text-gray-600 mb-2">السماح بالتوقيع اليدوي ورفع نسخة ممسوحة ضوئياً</p>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-xs">تفعيل التوثيق اليدوي</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-start gap-3">
                      <QrCode className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التحقق بواسطة QR Code</h4>
                        <p className="text-xs text-gray-600 mb-2">إنشاء رمز QR للتحقق من صحة العقد</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-xs">تفعيل QR Code</span>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="form-rtl">
                            <Label className="text-xs">محتوى QR Code</Label>
                            <div className="select-rtl">
                              <Select defaultValue="full">
                                <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">معلومات كاملة</SelectItem>
                                  <SelectItem value="link">رابط التحقق فقط</SelectItem>
                                  <SelectItem value="code">رقم العقد فقط</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="p-2 bg-white rounded border border-purple-200 text-center">
                            <div className="w-24 h-24 bg-purple-100 rounded mx-auto flex items-center justify-center mb-2">
                              <QrCode className="h-16 w-16 text-purple-600" />
                            </div>
                            <p className="text-xs text-gray-600">معاينة QR Code</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                            <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Download className="h-3 w-3 ml-1" />تحميل</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التوقيعات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { contract: 'CNT-2025-001', type: 'إلكتروني', date: '2025-01-15 14:30', signer: 'أحمد العتيبي', verified: true },
                    { contract: 'CNT-2025-002', type: 'QR Code', date: '2025-01-18 10:20', signer: 'فاطمة القحطاني', verified: true },
                    { contract: 'CNT-2025-003', type: 'يدوي', date: '2025-01-19 16:45', signer: 'خالد الشمري', verified: false }
                  ].map((sig, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${sig.verified ? 'bg-green-100' : 'bg-yellow-100'} rounded flex items-center justify-center`}>
                          {sig.verified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div>
                          <p className="text-xs">{sig.contract} - {sig.type}</p>
                          <p className="text-xs text-gray-500">{sig.signer} - {sig.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '814-07':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المراسلات وإرسال العقود</h2>
                <p className="text-sm text-gray-600">إرسال العقود للعملاء عبر وسائل التواصل المختلفة</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><Send className="h-3 w-3 ml-1" />إرسال جديد</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>وسائل الإرسال المتاحة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'البريد الإلكتروني', icon: Mail, color: 'blue', enabled: true, count: 45 },
                    { name: 'واتساب', icon: MessageCircle, color: 'green', enabled: true, count: 32 },
                    { name: 'رسالة نصية', icon: Smartphone, color: 'purple', enabled: true, count: 18 },
                    { name: 'تنزيل PDF', icon: Download, color: 'orange', enabled: true, count: 67 }
                  ].map((method, i) => (
                    <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className={`w-7 h-7 bg-${method.color}-100 rounded flex items-center justify-center`}>
                            {React.createElement(method.icon, { className: `h-4 w-4 text-${method.color}-600` })}
                          </div>
                          <Switch checked={method.enabled} />
                        </div>
                        <p className="text-xs mb-0.5">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.count} عملية</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إرسال عقد جديد</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="form-rtl space-y-2">
                  <div>
                    <Label className="text-xs">اختر العقد</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر العقد" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.number} - {c.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">وسيلة الإرسال</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر الوسيلة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">البريد الإلكتروني</SelectItem>
                          <SelectItem value="whatsapp">واتساب</SelectItem>
                          <SelectItem value="sms">رسالة نصية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">المستلم</Label>
                    <Input placeholder="البريد أو رقم الجوال" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  </div>

                  <div>
                    <Label className="text-xs">رسالة مرفقة (اختياري)</Label>
                    <Textarea placeholder="أدخل رسالة إضافية..." className="input-field text-sm" rows={3} style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button className="flex-1 button-rtl h-8 text-sm"><Send className="h-3 w-3 ml-1" />إرسال الآن</Button>
                    <Button variant="outline" className="flex-1 button-rtl h-8 text-sm"><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الإرسال الأخير</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2">
                    {[
                      { contract: 'CNT-2025-001', method: 'email', to: 'ahmed@example.com', date: '2025-01-19 14:30', status: 'sent' },
                      { contract: 'CNT-2025-002', method: 'whatsapp', to: '+966501234567', date: '2025-01-19 10:15', status: 'delivered' },
                      { contract: 'CNT-2025-003', method: 'sms', to: '+966509876543', date: '2025-01-18 16:45', status: 'failed' }
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 ${log.status === 'sent' ? 'bg-blue-100' : log.status === 'delivered' ? 'bg-green-100' : 'bg-red-100'} rounded flex items-center justify-center`}>
                            {log.status === 'sent' && <Send className="h-4 w-4 text-blue-600" />}
                            {log.status === 'delivered' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {log.status === 'failed' && <X className="h-4 w-4 text-red-600" />}
                          </div>
                          <div>
                            <p className="text-xs">{log.contract} - {log.method}</p>
                            <p className="text-xs text-gray-500">{log.to} - {log.date}</p>
                          </div>
                        </div>
                        <Badge className={`${log.status === 'sent' ? 'bg-blue-500' : log.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-1.5 py-0`}>
                          {log.status === 'sent' ? 'مُرسل' : log.status === 'delivered' ? 'تم التسليم' : 'فشل'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التبويب {activeTab} قيد التطوير</h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>هذا التبويب سيحتوي على ميزات متقدمة قريباً</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex bg-gray-50 overflow-hidden" dir="rtl">
      <CodeDisplay code="SCR-814" position="top-right" />
      
      <UniversalTabsSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="flex-shrink-0" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة العقود مع العملاء</h1>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظام متكامل لإدارة العقود والنماذج والتوقيعات</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                <CheckCircle className="h-3 w-3 ml-1" />
                {contracts.filter(c => c.status === 'active').length} نشط
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-1">
                <FileText className="h-3 w-3 ml-1" />
                {contracts.length} عقد
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة معاينة النموذج */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاينة نموذج العقد</DialogTitle>
            <DialogDescription className="dialog-description">معاينة كاملة لبنود العقد</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="text-lg mb-2">{selectedTemplate.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getTypeBadge(selectedTemplate.type)}
                  <span>•</span>
                  <span>{selectedTemplate.clauses.length} بند</span>
                  <span>•</span>
                  <span>{selectedTemplate.usageCount} استخدام</span>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {selectedTemplate.clauses.map((clause) => (
                    <Card key={clause.id} className="card-element card-rtl">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm text-blue-600 flex-shrink-0">
                            {clause.order}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.title}</h4>
                              {clause.isRequired && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">إلزامي</Badge>}
                            </div>
                            <p className="text-sm text-gray-700">{clause.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2 pt-4">
                <Button className="flex-1 button-rtl"><Download className="h-4 w-4 ml-2" />تحميل PDF</Button>
                <Button variant="outline" className="flex-1 button-rtl" onClick={() => setShowPreviewDialog(false)}>إغلاق</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsManagement_Complete_814;
