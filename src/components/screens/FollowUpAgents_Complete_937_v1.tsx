/**
 * الشاشة 937 - إدارة المعقبين v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة المعقبين (أفراد وكيانات)
 * 
 * المميزات:
 * ✅ تسجيل معقبين أفراد وكيانات
 * ✅ إحصائيات دقيقة لكل معقب
 * ✅ المعاملات التي عمل عليها
 * ✅ المهام المحددة لكل معاملة
 * ✅ الجهات التي تم التعقيب فيها
 * ✅ عدد مرات التعقيب
 * ✅ نسب النجاح والفشل
 * ✅ الملاحظات والإفادات
 * 
 * التابات (12 تاب):
 * 937-01: نظرة عامة
 * 937-02: إضافة معقب
 * 937-03: قائمة المعقبين
 * 937-04: الأفراد
 * 937-05: الكيانات
 * 937-06: إحصائيات الأداء
 * 937-07: المعاملات النشطة
 * 937-08: سجل المهام
 * 937-09: الجهات الحكومية
 * 937-10: التقارير
 * 937-11: التقييمات
 * 937-12: الإعدادات
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Users, UserPlus, User, Building2, TrendingUp, Activity,
  CheckCircle, XCircle, Clock, FileText, Eye, Edit, Trash2,
  Plus, Search, Filter, Download, Settings, Award, AlertCircle,
  MapPin, Phone, Mail, Calendar, BarChart3, Target
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '937-01', number: '937-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '937-02', number: '937-02', title: 'إضافة معقب', icon: UserPlus },
  { id: '937-03', number: '937-03', title: 'قائمة المعقبين', icon: Users },
  { id: '937-04', number: '937-04', title: 'الأفراد', icon: User },
  { id: '937-05', number: '937-05', title: 'الكيانات', icon: Building2 },
  { id: '937-06', number: '937-06', title: 'إحصائيات الأداء', icon: BarChart3 },
  { id: '937-07', number: '937-07', title: 'المعاملات النشطة', icon: Activity },
  { id: '937-08', number: '937-08', title: 'سجل المهام', icon: FileText },
  { id: '937-09', number: '937-09', title: 'الجهات الحكومية', icon: MapPin },
  { id: '937-10', number: '937-10', title: 'التقارير', icon: Download },
  { id: '937-11', number: '937-11', title: 'التقييمات', icon: Award },
  { id: '937-12', number: '937-12', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface FollowUpAgent {
  id: string;
  type: 'individual' | 'entity';
  name: string;
  nationalId?: string;
  commercialRegister?: string;
  phone: string;
  email: string;
  address: string;
  specialization: string[];
  governmentEntities: string[];
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalTransactions: number;
  activeTransactions: number;
  completedTransactions: number;
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  successRate: number;
  averageCompletionTime: number; // بالأيام
  notes: string;
}

interface FollowUpTask {
  id: string;
  agentId: string;
  agentName: string;
  transactionId: string;
  transactionTitle: string;
  governmentEntity: string;
  taskDescription: string;
  startDate: string;
  targetDate: string;
  completionDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  attempts: number;
  successStatus: 'success' | 'failed' | 'pending';
  notes: string;
  feedbacks: string[];
}

// ============================================================
// البيانات الوهمية - المعقبين (60 معقب)
// ============================================================

const mockAgents: FollowUpAgent[] = Array.from({ length: 60 }, (_, i) => {
  const isEntity = i % 3 === 0;
  const successRate = 60 + Math.random() * 35; // 60-95%
  const totalTasks = 10 + Math.floor(Math.random() * 90); // 10-100
  const successfulTasks = Math.floor(totalTasks * (successRate / 100));
  const failedTasks = totalTasks - successfulTasks;
  
  return {
    id: `AGT-2025-${String(i + 1).padStart(3, '0')}`,
    type: isEntity ? 'entity' : 'individual',
    name: isEntity 
      ? ['مؤسسة التعقيب المتقدم', 'شركة الخدمات الحكومية', 'مكتب الإنجاز السريع'][i % 3]
      : ['محمد بن أحمد السالم', 'خالد بن عبدالله المطيري', 'فهد بن سعد العتيبي'][i % 3],
    nationalId: !isEntity ? `1${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}` : undefined,
    commercialRegister: isEntity ? `${String(Math.floor(Math.random() * 9999999)).padStart(7, '0')}` : undefined,
    phone: `05${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
    email: `agent${i + 1}@follow-up.sa`,
    address: ['الرياض، حي النرجس', 'جدة، حي الروضة', 'الدمام، حي الفيصلية'][i % 3],
    specialization: [
      ['البلدية', 'الدفاع المدني'],
      ['الأمانة', 'الكهرباء', 'المياه'],
      ['البلدية', 'الأمانة', 'النقل']
    ][i % 3],
    governmentEntities: [
      ['البلدية', 'الدفاع المدني', 'الأمانة'],
      ['الكهرباء', 'المياه', 'الصرف الصحي'],
      ['النقل', 'البلدية', 'الدفاع المدني']
    ][i % 3],
    joinDate: `202${Math.floor(Math.random() * 3) + 3}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
    status: i % 15 === 0 ? 'inactive' : i % 20 === 0 ? 'suspended' : 'active',
    rating: 3 + Math.random() * 2, // 3-5
    totalTransactions: 5 + Math.floor(Math.random() * 45), // 5-50
    activeTransactions: Math.floor(Math.random() * 10), // 0-10
    completedTransactions: 5 + Math.floor(Math.random() * 40),
    totalTasks,
    successfulTasks,
    failedTasks,
    successRate: parseFloat(successRate.toFixed(1)),
    averageCompletionTime: 3 + Math.floor(Math.random() * 12), // 3-15 يوم
    notes: i % 5 === 0 ? 'معقب ممتاز وسريع في الإنجاز' : i % 7 === 0 ? 'يحتاج متابعة' : '',
  };
});

// ============================================================
// البيانات الوهمية - المهام (150 مهمة)
// ============================================================

const mockTasks: FollowUpTask[] = Array.from({ length: 150 }, (_, i) => {
  const agent = mockAgents[i % mockAgents.length];
  const status: FollowUpTask['status'] = ['pending', 'in-progress', 'completed', 'failed'][Math.floor(Math.random() * 4)] as any;
  const successStatus: FollowUpTask['successStatus'] = 
    status === 'completed' ? 'success' : 
    status === 'failed' ? 'failed' : 'pending';
  
  return {
    id: `TASK-2025-${String(i + 1).padStart(4, '0')}`,
    agentId: agent.id,
    agentName: agent.name,
    transactionId: `2510${String((i % 50) + 1).padStart(3, '0')}`,
    transactionTitle: ['رخصة بناء فيلا', 'تجديد رخصة محل', 'فحص مخطط'][i % 3],
    governmentEntity: ['البلدية', 'الدفاع المدني', 'الأمانة', 'الكهرباء', 'المياه'][i % 5],
    taskDescription: [
      'الحصول على موافقة البلدية',
      'استخراج شهادة الدفاع المدني',
      'تجديد الرخصة',
      'متابعة الاعتراض',
      'استلام الموافقة النهائية'
    ][i % 5],
    startDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    targetDate: `2025-${String(((i % 12) + 1) % 12 + 1).padStart(2, '0')}-${String(((i % 28) + 10) % 28 + 1).padStart(2, '0')}`,
    completionDate: status === 'completed' || status === 'failed' 
      ? `2025-${String(((i % 12) + 1) % 12 + 1).padStart(2, '0')}-${String(((i % 28) + 5) % 28 + 1).padStart(2, '0')}`
      : undefined,
    status,
    attempts: 1 + Math.floor(Math.random() * 5),
    successStatus,
    notes: i % 3 === 0 ? 'تمت الموافقة بنجاح' : i % 3 === 1 ? 'يوجد ملاحظات بسيطة' : 'تحت المعالجة',
    feedbacks: [
      'تم استلام الطلب',
      i % 2 === 0 ? 'تمت المراجعة الأولية' : '',
      status === 'completed' ? 'تمت الموافقة النهائية' : ''
    ].filter(Boolean),
  };
});

// ============================================================
// المكون الرئيسي
// ============================================================

const FollowUpAgents_Complete_937_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('937-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<FollowUpAgent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'entity'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    type: 'individual' as 'individual' | 'entity',
    name: '',
    nationalId: '',
    commercialRegister: '',
    phone: '',
    email: '',
    address: '',
    specialization: [] as string[],
    governmentEntities: [] as string[],
    notes: '',
  });

  // حساب الإحصائيات العامة
  const statistics = useMemo(() => {
    const total = mockAgents.length;
    const individuals = mockAgents.filter(a => a.type === 'individual').length;
    const entities = mockAgents.filter(a => a.type === 'entity').length;
    const active = mockAgents.filter(a => a.status === 'active').length;
    const avgSuccessRate = mockAgents.reduce((sum, a) => sum + a.successRate, 0) / total;
    const totalTasks = mockAgents.reduce((sum, a) => sum + a.totalTasks, 0);
    const successfulTasks = mockAgents.reduce((sum, a) => sum + a.successfulTasks, 0);
    const activeTasks = mockTasks.filter(t => t.status === 'in-progress' || t.status === 'pending').length;

    return {
      total,
      individuals,
      entities,
      active,
      avgSuccessRate: avgSuccessRate.toFixed(1),
      totalTasks,
      successfulTasks,
      activeTasks,
    };
  }, []);

  // فلترة المعقبين
  const filteredAgents = useMemo(() => {
    return mockAgents.filter(agent => {
      const typeMatch = filterType === 'all' || agent.type === filterType;
      const statusMatch = filterStatus === 'all' || agent.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [filterType, filterStatus]);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '937-01':
        return renderTab01_Overview();
      case '937-02':
        return renderTab02_AddAgent();
      case '937-03':
        return renderTab03_AllAgents();
      case '937-04':
        return renderTab04_Individuals();
      case '937-05':
        return renderTab05_Entities();
      case '937-06':
        return renderTab06_Performance();
      case '937-07':
        return renderTab07_ActiveTransactions();
      case '937-08':
        return renderTab08_TasksLog();
      case '937-09':
        return renderTab09_GovernmentEntities();
      case '937-10':
        return renderTab10_Reports();
      case '937-11':
        return renderTab11_Ratings();
      case '937-12':
        return renderTab12_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 937-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-8 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعقبين</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <User className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.individuals}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أفراد</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <Building2 className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.entities}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>كيانات</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.active}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشط</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.avgSuccessRate}%</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النجاح</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.totalTasks}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-3 text-center">
            <Target className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.successfulTasks}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام ناجحة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.activeTasks}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام نشطة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول أفضل المعقبين */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>أفضل 20 معقب (حسب نسبة النجاح)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النجاح</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفشل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...mockAgents]
                  .sort((a, b) => b.successRate - a.successRate)
                  .slice(0, 20)
                  .map((agent, index) => (
                    <TableRow key={agent.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded">{agent.id}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: agent.type === 'individual' ? '#e0e7ff' : '#f3e8ff',
                            color: agent.type === 'individual' ? '#4338ca' : '#7c3aed',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {agent.type === 'individual' ? 'فرد' : 'كيان'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {agent.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap gap-1">
                          {agent.specialization.slice(0, 2).map((spec, i) => (
                            <Badge key={i} variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.totalTasks}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {agent.successfulTasks}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {agent.failedTasks}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={agent.successRate} className="h-2 w-16" />
                          <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.successRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: agent.status === 'active' ? '#dcfce7' : agent.status === 'inactive' ? '#fef3c7' : '#fee2e2',
                            color: agent.status === 'active' ? '#166534' : agent.status === 'inactive' ? '#854d0e' : '#991b1b',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {agent.status === 'active' ? 'نشط' : agent.status === 'inactive' ? 'غير نشط' : 'موقوف'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setShowDetailsDialog(true);
                          }}
                        >
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
  // التاب 937-02: إضافة معقب
  // ============================================================

  const renderTab02_AddAgent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة معقب جديد</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تسجيل معقب جديد (فرد أو كيان)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* نوع المعقب */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المعقب</h3>
              <SelectWithCopy
                label="النوع *"
                id="type"
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as any })}
                options={[
                  { value: 'individual', label: 'فرد' },
                  { value: 'entity', label: 'كيان (مؤسسة/شركة)' }
                ]}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* المعلومات الأساسية */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="الاسم *"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.type === 'individual' ? 'محمد بن أحمد السالم' : 'مؤسسة التعقيب المتقدم'}
                  required
                  copyable={true}
                  clearable={true}
                />
                {formData.type === 'individual' ? (
                  <InputWithCopy
                    label="رقم الهوية *"
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    placeholder="1234567890"
                    required
                    copyable={true}
                    clearable={true}
                  />
                ) : (
                  <InputWithCopy
                    label="السجل التجاري *"
                    id="commercialRegister"
                    value={formData.commercialRegister}
                    onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })}
                    placeholder="1234567"
                    required
                    copyable={true}
                    clearable={true}
                  />
                )}
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الاتصال</h3>
              <div className="grid grid-cols-3 gap-4">
                <InputWithCopy
                  label="الجوال *"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0501234567"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="البريد الإلكتروني"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="agent@example.com"
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="العنوان *"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="الرياض، حي النرجس"
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* التخصصات */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصصات والجهات</h3>
              <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                حدد الجهات الحكومية التي يمكن للمعقب العمل معها
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['البلدية', 'الدفاع المدني', 'الأمانة', 'الكهرباء', 'المياه', 'الصرف الصحي', 'النقل', 'الزراعة'].map(entity => (
                  <div key={entity} className="flex items-center gap-2 bg-white p-2 rounded">
                    <input type="checkbox" id={entity} className="w-4 h-4" />
                    <label htmlFor={entity} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                      {entity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ملاحظات */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <TextAreaWithCopy
                label="ملاحظات"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="أي ملاحظات إضافية..."
                copyable={true}
                clearable={true}
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">إلغاء</Button>
              <Button>
                <UserPlus className="h-4 w-4 ml-2" />
                حفظ المعقب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 937-03: قائمة المعقبين
  // ============================================================

  const renderTab03_AllAgents = () => (
    <div className="space-y-4">
      {/* الفلاتر */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <SelectWithCopy
              label="النوع"
              id="filterType"
              value={filterType}
              onChange={(value) => setFilterType(value as any)}
              options={[
                { value: 'all', label: 'الكل' },
                { value: 'individual', label: 'أفراد' },
                { value: 'entity', label: 'كيانات' }
              ]}
              copyable={false}
              clearable={false}
            />
            <SelectWithCopy
              label="الحالة"
              id="filterStatus"
              value={filterStatus}
              onChange={(value) => setFilterStatus(value as any)}
              options={[
                { value: 'all', label: 'الكل' },
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
                { value: 'suspended', label: 'موقوف' }
              ]}
              copyable={false}
              clearable={false}
            />
            <div className="col-span-2 flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 ml-2" />
                بحث متقدم
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الجدول */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المعقبين ({filteredAgents.length})
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              إضافة معقب
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent, index) => (
                  <TableRow key={agent.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{agent.id}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: agent.type === 'individual' ? '#e0e7ff' : '#f3e8ff',
                          color: agent.type === 'individual' ? '#4338ca' : '#7c3aed',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {agent.type === 'individual' ? 'فرد' : 'كيان'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {agent.name}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New', fontSize: '11px' }}>
                      {agent.phone}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1">
                        {agent.specialization.slice(0, 2).map((spec, i) => (
                          <Badge key={i} variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {agent.totalTransactions}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.successRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-yellow-500" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                          {agent.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: agent.status === 'active' ? '#dcfce7' : agent.status === 'inactive' ? '#fef3c7' : '#fee2e2',
                          color: agent.status === 'active' ? '#166534' : agent.status === 'inactive' ? '#854d0e' : '#991b1b',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {agent.status === 'active' ? 'نشط' : agent.status === 'inactive' ? 'غير نشط' : 'موقوف'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setSelectedAgent(agent);
                          setShowDetailsDialog(true);
                        }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
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
  // التاب 937-04: الأفراد
  // ============================================================

  const renderTab04_Individuals = () => {
    const individuals = mockAgents.filter(a => a.type === 'individual');
    const totalIndividuals = individuals.length;
    const activeIndividuals = individuals.filter(a => a.status === 'active').length;
    const avgSuccessRate = individuals.reduce((sum, a) => sum + a.successRate, 0) / totalIndividuals;

    return (
      <div className="space-y-4">
        {/* إحصائيات الأفراد */}
        <div className="grid grid-cols-4 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <User className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{totalIndividuals}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأفراد</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activeIndividuals}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشط</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{avgSuccessRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النجاح</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-pink-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {individuals.reduce((sum, a) => sum + a.totalTasks, 0)}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول الأفراد */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقبون الأفراد ({totalIndividuals})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الهوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individuals.map((agent, index) => (
                    <TableRow key={agent.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-indigo-50 px-2 py-1 rounded">{agent.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {agent.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs">{agent.nationalId}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New', fontSize: '11px' }}>
                        {agent.phone}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap gap-1">
                          {agent.specialization.slice(0, 2).map((spec, i) => (
                            <Badge key={i} variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.totalTasks}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={agent.successRate} className="h-2 w-16" />
                          <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.successRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: agent.status === 'active' ? '#dcfce7' : agent.status === 'inactive' ? '#fef3c7' : '#fee2e2',
                            color: agent.status === 'active' ? '#166534' : agent.status === 'inactive' ? '#854d0e' : '#991b1b',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {agent.status === 'active' ? 'نشط' : agent.status === 'inactive' ? 'غير نشط' : 'موقوف'}
                        </Badge>
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

  // ============================================================
  // التاب 937-05: الكيانات
  // ============================================================

  const renderTab05_Entities = () => {
    const entities = mockAgents.filter(a => a.type === 'entity');
    const totalEntities = entities.length;
    const activeEntities = entities.filter(a => a.status === 'active').length;
    const avgSuccessRate = entities.reduce((sum, a) => sum + a.successRate, 0) / totalEntities;

    return (
      <div className="space-y-4">
        {/* إحصائيات الكيانات */}
        <div className="grid grid-cols-4 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
            <CardContent className="p-3 text-center">
              <Building2 className="h-5 w-5 mx-auto text-purple-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{totalEntities}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الكيانات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activeEntities}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشط</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{avgSuccessRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النجاح</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {entities.reduce((sum, a) => sum + a.totalTasks, 0)}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول الكيانات */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الكيانات ({totalEntities})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السجل التجاري</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((agent, index) => (
                    <TableRow key={agent.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-purple-50 px-2 py-1 rounded">{agent.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {agent.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs">{agent.commercialRegister}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New', fontSize: '11px' }}>
                        {agent.phone}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap gap-1">
                          {agent.specialization.slice(0, 2).map((spec, i) => (
                            <Badge key={i} variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.totalTasks}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={agent.successRate} className="h-2 w-16" />
                          <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.successRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: agent.status === 'active' ? '#dcfce7' : agent.status === 'inactive' ? '#fef3c7' : '#fee2e2',
                            color: agent.status === 'active' ? '#166534' : agent.status === 'inactive' ? '#854d0e' : '#991b1b',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {agent.status === 'active' ? 'نشط' : agent.status === 'inactive' ? 'غير نشط' : 'موقوف'}
                        </Badge>
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

  // ============================================================
  // التاب 937-06: إحصائيات الأداء
  // ============================================================

  const renderTab06_Performance = () => {
    const topPerformers = [...mockAgents].sort((a, b) => b.successRate - a.successRate).slice(0, 10);
    
    return (
      <div className="space-y-4">
        {/* أفضل 10 معقبين */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>أفضل 10 معقبين (حسب نسبة النجاح)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((agent, index) => (
                <div key={agent.id} className="p-4 rounded-lg border-r-4" style={{ 
                  background: index < 3 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f9fafb',
                  borderColor: index === 0 ? '#f59e0b' : index === 1 ? '#d97706' : index === 2 ? '#b45309' : '#e5e7eb'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{
                        background: index < 3 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#e5e7eb'
                      }}>
                        <span className="font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{agent.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge style={{ 
                            background: agent.type === 'individual' ? '#e0e7ff' : '#f3e8ff',
                            color: agent.type === 'individual' ? '#4338ca' : '#7c3aed',
                            fontFamily: 'Tajawal, sans-serif'
                          }}>
                            {agent.type === 'individual' ? 'فرد' : 'كيان'}
                          </Badge>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{agent.id}</code>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</p>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{agent.totalTasks}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الناجحة</p>
                        <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{agent.successfulTasks}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</p>
                        <p className="text-xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {agent.successRate}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</p>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {agent.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* مخطط نسب النجاح */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع نسب النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { range: '90-100%', count: mockAgents.filter(a => a.successRate >= 90).length, color: '#10b981' },
                  { range: '80-89%', count: mockAgents.filter(a => a.successRate >= 80 && a.successRate < 90).length, color: '#3b82f6' },
                  { range: '70-79%', count: mockAgents.filter(a => a.successRate >= 70 && a.successRate < 80).length, color: '#f59e0b' },
                  { range: '60-69%', count: mockAgents.filter(a => a.successRate >= 60 && a.successRate < 70).length, color: '#ef4444' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>{item.range}</span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {item.count} معقب
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / mockAgents.length) * 100}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط وقت الإنجاز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...mockAgents].sort((a, b) => a.averageCompletionTime - b.averageCompletionTime).slice(0, 5).map((agent, index) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {agent.name}
                      </p>
                      <code className="text-xs">{agent.id}</code>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.averageCompletionTime}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>يوم</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 937-07: المعاملات النشطة
  // ============================================================

  const renderTab07_ActiveTransactions = () => {
    const activeAgents = mockAgents.filter(a => a.activeTransactions > 0);
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                المعقبون مع المعاملات النشطة ({activeAgents.length})
              </CardTitle>
              <Badge style={{ background: '#dbeafe', color: '#1e40af', fontFamily: 'Tajawal, sans-serif' }}>
                {activeAgents.reduce((sum, a) => sum + a.activeTransactions, 0)} معاملة نشطة
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {activeAgents.map(agent => (
                  <Card key={agent.id} className="border-r-4" style={{ borderColor: '#3b82f6' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {agent.type === 'individual' ? (
                            <User className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <Building2 className="h-5 w-5 text-purple-600" />
                          )}
                          <div>
                            <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{agent.name}</p>
                            <code className="text-xs">{agent.id}</code>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
                            <p className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {agent.activeTransactions}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
                            <p className="text-xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {agent.completedTransactions}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                            <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {agent.totalTransactions}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">نسبة النجاح</p>
                          <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {agent.successRate}%
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">التقييم</p>
                          <div className="flex items-center justify-center gap-1">
                            <Award className="h-3 w-3 text-yellow-500" />
                            <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {agent.rating.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">متوسط الإنجاز</p>
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {agent.averageCompletionTime} يوم
                          </p>
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
  };

  // ============================================================
  // التاب 937-08: سجل المهام
  // ============================================================

  const renderTab08_TasksLog = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            سجل جميع المهام ({mockTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحاولات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النتيجة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTasks.map((task, index) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{task.id}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {task.agentName}
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{task.transactionId}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                        {task.governmentEntity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                      {task.taskDescription}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{task.attempts}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: 
                            task.status === 'completed' ? '#dcfce7' :
                            task.status === 'in-progress' ? '#dbeafe' :
                            task.status === 'failed' ? '#fee2e2' : '#fef3c7',
                          color: 
                            task.status === 'completed' ? '#166534' :
                            task.status === 'in-progress' ? '#1e40af' :
                            task.status === 'failed' ? '#991b1b' : '#854d0e',
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '9px'
                        }}
                      >
                        {task.status === 'completed' ? 'مكتمل' :
                         task.status === 'in-progress' ? 'جاري' :
                         task.status === 'failed' ? 'فشل' : 'معلق'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {task.successStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : task.successStatus === 'failed' ? (
                        <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600 mx-auto" />
                      )}
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
  // التاب 937-09: الجهات الحكومية
  // ============================================================

  const renderTab09_GovernmentEntities = () => {
    // تجميع المهام حسب الجهة
    const tasksByEntity: Record<string, FollowUpTask[]> = {};
    mockTasks.forEach(task => {
      if (!tasksByEntity[task.governmentEntity]) {
        tasksByEntity[task.governmentEntity] = [];
      }
      tasksByEntity[task.governmentEntity].push(task);
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(tasksByEntity).map(([entity, tasks]) => {
            const successfulTasks = tasks.filter(t => t.successStatus === 'success').length;
            const successRate = tasks.length > 0 ? (successfulTasks / tasks.length) * 100 : 0;
            const uniqueAgents = new Set(tasks.map(t => t.agentId)).size;

            return (
              <Card key={entity} className="border-r-4" style={{ borderColor: '#2563eb' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إجمالي المهام
                      </span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {tasks.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المعقبون
                      </span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {uniqueAgents}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نسبة النجاح
                      </span>
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {successRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <Progress value={successRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 937-10: التقارير
  // ============================================================

  const renderTab10_Reports = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { 
            title: 'تقرير شامل بجميع المعقبين',
            description: 'تقرير مفصل يحتوي على جميع بيانات المعقبين وإحصائياتهم',
            icon: FileText,
            color: '#2563eb'
          },
          { 
            title: 'تقرير الأداء الشهري',
            description: 'تقرير يوضح أداء المعقبين خلال الشهر الحالي',
            icon: Activity,
            color: '#10b981'
          },
          { 
            title: 'تقرير المهام المكتملة',
            description: 'تقرير بجميع المهام التي تم إنجازها بنجاح',
            icon: CheckCircle,
            color: '#f59e0b'
          },
          { 
            title: 'تقرير الجهات الحكومية',
            description: 'تقرير يوضح التعامل مع كل جهة حكومية',
            icon: MapPin,
            color: '#8b5cf6'
          },
          { 
            title: 'تقرير المعقبين الأفراد',
            description: 'تقرير خاص بالمعقبين الأفراد فقط',
            icon: User,
            color: '#ec4899'
          },
          { 
            title: 'تقرير الكيانات',
            description: 'تقرير خاص بالكيانات (المؤسسات والشركات)',
            icon: Building2,
            color: '#06b6d4'
          }
        ].map((report, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg" style={{ background: `${report.color}20` }}>
                  <report.icon className="h-6 w-6" style={{ color: report.color }} />
                </div>
                <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {report.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {report.description}
              </p>
              <Button className="w-full" style={{ background: report.color }}>
                <Download className="h-4 w-4 ml-2" />
                تحميل التقرير
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // التاب 937-11: التقييمات
  // ============================================================

  const renderTab11_Ratings = () => {
    const ratingGroups = {
      '5': mockAgents.filter(a => a.rating >= 4.5).length,
      '4': mockAgents.filter(a => a.rating >= 3.5 && a.rating < 4.5).length,
      '3': mockAgents.filter(a => a.rating >= 2.5 && a.rating < 3.5).length,
      '2': mockAgents.filter(a => a.rating >= 1.5 && a.rating < 2.5).length,
      '1': mockAgents.filter(a => a.rating < 1.5).length,
    };

    return (
      <div className="space-y-4">
        {/* توزيع التقييمات */}
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(ratingGroups).map(([stars, count]) => (
            <Card key={stars} style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #fcd34d'
            }}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: parseInt(stars) }).map((_, i) => (
                    <Award key={i} className="h-4 w-4 text-yellow-500" />
                  ))}
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{count}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معقب</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* جدول المعقبين حسب التقييم */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقبون مرتبون حسب التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...mockAgents].sort((a, b) => b.rating - a.rating).map((agent, index) => (
                    <TableRow key={agent.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{agent.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {agent.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: agent.type === 'individual' ? '#e0e7ff' : '#f3e8ff',
                            color: agent.type === 'individual' ? '#4338ca' : '#7c3aed',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {agent.type === 'individual' ? 'فرد' : 'كيان'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.round(agent.rating) }).map((_, i) => (
                            <Award key={i} className="h-3 w-3 text-yellow-500" />
                          ))}
                          <span className="font-bold mr-1" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {agent.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {agent.totalTasks}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {agent.successRate}%
                        </span>
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

  // ============================================================
  // التاب 937-12: الإعدادات
  // ============================================================

  const renderTab12_Settings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* إعدادات عامة */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات عامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EnhancedSwitch
              id="auto-assign"
              checked={true}
              onCheckedChange={() => {}}
              label="التعيين التلقائي للمعقبين"
              description="تعيين تلقائي للمعقبين حسب التخصص"
              variant="default"
            />
            <EnhancedSwitch
              id="notifications"
              checked={true}
              onCheckedChange={() => {}}
              label="إشعارات المهام"
              description="إرسال إشعارات عند إسناد مهام جديدة"
              variant="success"
            />
            <EnhancedSwitch
              id="rating-system"
              checked={true}
              onCheckedChange={() => {}}
              label="نظام التقييم التلقائي"
              description="تقييم تلقائي حسب الأداء"
              variant="warning"
            />
          </CardContent>
        </Card>

        {/* إعدادات الأداء */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأداء</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الحد الأدنى لنسبة النجاح (%)
              </label>
              <InputWithCopy
                id="min-success"
                value="60"
                onChange={() => {}}
                placeholder="60"
                copyable={false}
                clearable={false}
              />
            </div>
            <div>
              <label className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الحد الأقصى للمهام المتزامنة
              </label>
              <InputWithCopy
                id="max-tasks"
                value="10"
                onChange={() => {}}
                placeholder="10"
                copyable={false}
                clearable={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الصلاحيات */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات والأدوار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'إضافة معقبين', enabled: true },
              { name: 'تعديل معقبين', enabled: true },
              { name: 'حذف معقبين', enabled: false },
              { name: 'عرض التقارير', enabled: true },
              { name: 'تصدير البيانات', enabled: true },
              { name: 'إدارة التقييمات', enabled: true },
            ].map((permission, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <input type="checkbox" defaultChecked={permission.enabled} className="w-4 h-4" />
                <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                  {permission.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">إلغاء التغييرات</Button>
        <Button>
          <Settings className="h-4 w-4 ml-2" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );

  // ============================================================
  // نافذة التفاصيل
  // ============================================================

  const renderDetailsDialog = () => {
    if (!selectedAgent) return null;

    const agentTasks = mockTasks.filter(t => t.agentId === selectedAgent.id);

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل المعقب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600">الرمز</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedAgent.id}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-gray-600">الاسم</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedAgent.name}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-xs text-gray-600">نسبة النجاح</p>
                <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedAgent.successRate}%
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-xs text-gray-600">التقييم</p>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedAgent.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* جدول المهام */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل المهام ({agentTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحاولات</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النتيجة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentTasks.map(task => (
                        <TableRow key={task.id}>
                          <TableCell className="text-right">
                            <code className="text-xs">{task.transactionId}</code>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {task.governmentEntity}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            {task.taskDescription}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{task.attempts}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              style={{
                                background: 
                                  task.status === 'completed' ? '#dcfce7' :
                                  task.status === 'in-progress' ? '#dbeafe' :
                                  task.status === 'failed' ? '#fee2e2' : '#fef3c7',
                                color: 
                                  task.status === 'completed' ? '#166534' :
                                  task.status === 'in-progress' ? '#1e40af' :
                                  task.status === 'failed' ? '#991b1b' : '#854d0e',
                                fontFamily: 'Tajawal, sans-serif'
                              }}
                            >
                              {task.status === 'completed' ? 'مكتمل' :
                               task.status === 'in-progress' ? 'جاري' :
                               task.status === 'failed' ? 'فشل' : 'معلق'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {task.successStatus === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : task.successStatus === 'failed' ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                border: '2px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <Users className="h-6 w-6" style={{ color: '#6366f1', filter: 'drop-shadow(0 1px 2px rgba(99, 102, 241, 0.3))' }} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  إدارة المعقبين
                </h1>

                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    937
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
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                نظام شامل لإدارة المعقبين (أفراد وكيانات) مع إحصائيات دقيقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(99, 102, 241, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.15)'
              }}
            >
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                12 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default FollowUpAgents_Complete_937_v1;
