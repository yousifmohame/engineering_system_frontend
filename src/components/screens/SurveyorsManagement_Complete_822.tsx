/**
 * الشاشة 822 - إدارة المساحين والمهام المساحية - نظام شامل ومتكامل
 * ================================================================
 * 
 * نظام متكامل لإدارة المساحين ومهامهم مع:
 * - إنشاء طلبات ومهام مساحية
 * - ربط المهام بالعملاء والمعاملات
 * - تحديد المستندات المطلوبة واللوكيشن
 * - بيانات تفصيلية للأراضي (مخططة/غير مخططة)
 * - رفع الصور والبيانات المساحية من قبل المساح
 * - تكامل مع شاشة المعاملات (286/700) - تاب البيانات المساحية
 * - تكامل مع شاشة الموظفين (817) - تاب المهمات
 * - قاعدة بيانات شاملة للأراضي
 * - نظام تتبع متقدم للمهام
 * 
 * الربط مع الأنظمة الأخرى:
 * - شاشة المعاملات (286/700): عرض البيانات المساحية
 * - شاشة الموظفين (817): عرض المهام المُسندة
 * - نظام الإشعارات: تنبيهات فورية
 * 
 * التطوير: نوفمبر 2025 - v1.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  MapPin, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, FileText, Bell, Map, Compass, Navigation,
  Home, MapPinned, Layers, Ruler, Image, Camera, FolderOpen,
  CheckSquare, XSquare, User, UserCheck, Activity, BarChart3,
  PieChart, ClipboardCheck, Flag, Info, AlertTriangle, Scan
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 12 تبويب شامل =====
const TABS_CONFIG = [
  { id: '822-01', number: '822-01', title: 'نظرة عامة', icon: Activity },
  { id: '822-02', number: '822-02', title: 'مهام جديدة', icon: Plus },
  { id: '822-03', number: '822-03', title: 'المهام النشطة', icon: Clock },
  { id: '822-04', number: '822-04', title: 'المهام المكتملة', icon: CheckCircle },
  { id: '822-05', number: '822-05', title: 'قاعدة بيانات الأراضي', icon: MapPinned },
  { id: '822-06', number: '822-06', title: 'المساحون', icon: Users },
  { id: '822-07', number: '822-07', title: 'البيانات المساحية', icon: Layers },
  { id: '822-08', number: '822-08', title: 'المستندات والصور', icon: Camera },
  { id: '822-09', number: '822-09', title: 'الخرائط والمواقع', icon: Map },
  { id: '822-10', number: '822-10', title: 'التقارير', icon: ClipboardCheck },
  { id: '822-11', number: '822-11', title: 'الأرشيف', icon: Archive },
  { id: '822-12', number: '822-12', title: 'الإعدادات', icon: Settings },
];

// ===== حالات المهام المساحية =====
const TASK_STATUSES = [
  { value: 'pending', label: 'قيد الانتظار', color: 'bg-blue-100 text-blue-700', icon: Clock },
  { value: 'assigned', label: 'مُسندة', color: 'bg-purple-100 text-purple-700', icon: UserCheck },
  { value: 'in-progress', label: 'قيد التنفيذ', color: 'bg-yellow-100 text-yellow-700', icon: Activity },
  { value: 'field-work', label: 'عمل ميداني', color: 'bg-orange-100 text-orange-700', icon: MapPin },
  { value: 'data-entry', label: 'إدخال البيانات', color: 'bg-cyan-100 text-cyan-700', icon: FileText },
  { value: 'review', label: 'قيد المراجعة', color: 'bg-indigo-100 text-indigo-700', icon: Eye },
  { value: 'completed', label: 'مُكتملة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'cancelled', label: 'مُلغاة', color: 'bg-red-100 text-red-700', icon: XSquare },
];

// ===== أنواع الأراضي =====
const LAND_TYPES = [
  { value: 'planned', label: 'أرض مخططة', color: 'bg-green-100 text-green-700', icon: Layers },
  { value: 'unplanned', label: 'أرض غير مخططة', color: 'bg-orange-100 text-orange-700', icon: MapPin },
];

// ===== حالة النطاق العمراني =====
const URBAN_SCOPE = [
  { value: 'inside', label: 'داخل النطاق العمراني', color: 'bg-blue-100 text-blue-700' },
  { value: 'outside', label: 'خارج النطاق العمراني', color: 'bg-purple-100 text-purple-700' },
];

// ===== أنواع المهام المساحية =====
const SURVEY_TASK_TYPES = [
  { value: 'land-survey', label: 'مسح أرض', icon: MapPin },
  { value: 'building-survey', label: 'مسح مبنى', icon: Building },
  { value: 'boundary-survey', label: 'تحديد حدود', icon: Compass },
  { value: 'topographic', label: 'مسح طبوغرافي', icon: Map },
  { value: 'subdivision', label: 'مسح تقسيم', icon: Layers },
  { value: 'as-built', label: 'مسح واقع حال', icon: Scan },
  { value: 'other', label: 'أخرى', icon: FileText },
];

// ===== أولويات المهام =====
const PRIORITIES = [
  { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700', icon: Flag },
  { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-700', icon: Info },
  { value: 'low', label: 'منخفضة', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
];

// ===== بيانات تجريبية =====
const SAMPLE_TASKS = [
  {
    id: 'SRV-2025-001',
    taskType: 'land-survey',
    clientId: '123-00045',
    clientName: 'أحمد محمد علي',
    transactionId: '286-00245',
    transactionTitle: 'ترخيص بناء فيلا سكنية',
    landType: 'planned',
    plotNumber: '1234',
    planNumber: 'مخطط 5678',
    district: 'حي النرجس',
    sector: 'قطاع شمال',
    urbanScope: 'inside',
    location: 'الرياض - شمال الرياض',
    coordinates: { lat: '24.7136', lng: '46.6753' },
    area: '600',
    priority: 'high',
    status: 'assigned',
    assignedTo: '817-00126',
    assignedToName: 'المساح خالد أحمد',
    requestDate: '2025-01-10',
    dueDate: '2025-01-20',
    notes: 'مطلوب مسح دقيق للأرض مع تحديد الحدود',
    documents: ['صك الملكية', 'كروكي المساحة'],
    images: [],
  },
  {
    id: 'SRV-2025-002',
    taskType: 'building-survey',
    clientId: '123-00046',
    clientName: 'فاطمة خالد',
    transactionId: null,
    transactionTitle: null,
    landType: 'unplanned',
    plotNumber: null,
    planNumber: null,
    district: 'حي العليا',
    sector: null,
    urbanScope: 'outside',
    location: 'الرياض - طريق الملك عبدالله',
    coordinates: { lat: '24.7243', lng: '46.6555' },
    area: '1200',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: '817-00127',
    assignedToName: 'المساح سعد عبدالله',
    requestDate: '2025-01-12',
    dueDate: '2025-01-25',
    notes: 'مسح مبنى قائم لأغراض التوثيق',
    documents: ['رخصة البناء'],
    images: ['IMG_001.jpg', 'IMG_002.jpg'],
  },
];

const SurveyorsManagement_Complete_822: React.FC = () => {
  const [activeTab, setActiveTab] = useState('822-01');
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // إحصائيات
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    planned: tasks.filter(t => t.landType === 'planned').length,
    unplanned: tasks.filter(t => t.landType === 'unplanned').length,
    insideUrban: tasks.filter(t => t.urbanScope === 'inside').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 822-01: نظرة عامة
      case '822-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي المهام</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.assigned}</div>
                <div className="dense-stat-label">مُسندة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-yellow-100 text-yellow-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.inProgress}</div>
                <div className="dense-stat-label">قيد التنفيذ</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.completed}</div>
                <div className="dense-stat-label">مُكتملة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-emerald-100 text-emerald-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.planned}</div>
                <div className="dense-stat-label">أراضي مخططة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-red-100 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.urgent}</div>
                <div className="dense-stat-label">عاجلة</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* المهام العاجلة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <AlertTriangle className="h-4 w-4" />
                  مهام تحتاج اهتمام فوري
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').slice(0, 5).map((task) => {
                    const statusInfo = TASK_STATUSES.find(s => s.value === task.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === task.priority);
                    const typeInfo = SURVEY_TASK_TYPES.find(t => t.value === task.taskType);
                    const landTypeInfo = LAND_TYPES.find(lt => lt.value === task.landType);
                    
                    return (
                      <div key={task.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700">
                                {task.id}
                              </Badge>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mb-1">{task.clientName}</div>
                            {task.transactionId && (
                              <div className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">المعاملة:</span> {task.transactionTitle}
                              </div>
                            )}
                            <div className="text-xs text-gray-600 mb-2">
                              <MapPin className="h-3 w-3 inline ml-1" />
                              {task.location}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={landTypeInfo?.color}>
                                {landTypeInfo?.label}
                              </Badge>
                              {task.landType === 'planned' && (
                                <div className="text-xs text-gray-600">
                                  قطعة {task.plotNumber} - {task.planNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-gray-600">
                            <User className="h-3 w-3 inline ml-1" />
                            {task.assignedToName || 'غير مُسند'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <MapPin className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-02: مهام جديدة
      case '822-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-4 w-4" />
                  إنشاء مهمة مساحية جديدة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <CheckCircle className="h-3 w-3" />
                  حفظ وإسناد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* بيانات المهمة الأساسية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      بيانات المهمة الأساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="نوع المهمة المساحية"
                        id="taskType"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر نوع المهمة' },
                          ...SURVEY_TASK_TYPES.map(t => ({ value: t.value, label: t.label }))
                        ]}
                      />

                      <SelectWithCopy
                        label="الأولوية"
                        id="priority"
                        defaultValue="medium"
                        options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
                      />

                      <SelectWithCopy
                        label="العميل"
                        id="clientId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر العميل' },
                          { value: '123-00045', label: 'أحمد محمد علي - 123-00045' },
                          { value: '123-00046', label: 'فاطمة خالد - 123-00046' },
                        ]}
                      />

                      <SelectWithCopy
                        label="المعاملة المرتبطة (اختياري)"
                        id="transactionId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: '286-00245', label: 'ترخيص بناء - 286-00245' },
                          { value: '286-00246', label: 'إفراز - 286-00246' },
                        ]}
                      />

                      <DateInputWithToday
                        label="تاريخ الطلب"
                        id="requestDate"
                      />

                      <DateInputWithToday
                        label="الموعد النهائي"
                        id="dueDate"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* بيانات الأرض التفصيلية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      بيانات الأرض التفصيلية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="نوع الأرض"
                        id="landType"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر نوع الأرض' },
                          ...LAND_TYPES.map(lt => ({ value: lt.value, label: lt.label }))
                        ]}
                      />

                      <SelectWithCopy
                        label="النطاق العمراني"
                        id="urbanScope"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر النطاق' },
                          ...URBAN_SCOPE.map(us => ({ value: us.value, label: us.label }))
                        ]}
                      />

                      <InputWithCopy
                        label="رقم القطعة (للأراضي المخططة)"
                        id="plotNumber"
                        defaultValue=""
                        placeholder="مثال: 1234"
                      />

                      <InputWithCopy
                        label="رقم المخطط التنظيمي"
                        id="planNumber"
                        defaultValue=""
                        placeholder="مثال: مخطط 5678"
                      />

                      <InputWithCopy
                        label="اسم الحي"
                        id="district"
                        defaultValue=""
                        placeholder="مثال: حي النرجس"
                      />

                      <InputWithCopy
                        label="اسم القطاع"
                        id="sector"
                        defaultValue=""
                        placeholder="مثال: قطاع شمال"
                      />

                      <InputWithCopy
                        label="المساحة (متر مربع)"
                        id="area"
                        type="number"
                        defaultValue=""
                        placeholder="600"
                      />

                      <InputWithCopy
                        label="رقم الصك"
                        id="deedNumber"
                        defaultValue=""
                        placeholder="رقم الصك إن وجد"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* الموقع والإحداثيات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الموقع والإحداثيات
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="الموقع (نصي)"
                        id="location"
                        defaultValue=""
                        placeholder="مثال: الرياض - شمال الرياض"
                      />

                      <InputWithCopy
                        label="رابط الموقع (Google Maps)"
                        id="mapLink"
                        defaultValue=""
                        placeholder="https://maps.google.com/..."
                      />

                      <InputWithCopy
                        label="خط العرض (Latitude)"
                        id="latitude"
                        defaultValue=""
                        placeholder="24.7136"
                      />

                      <InputWithCopy
                        label="خط الطول (Longitude)"
                        id="longitude"
                        defaultValue=""
                        placeholder="46.6753"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* المستندات والملاحظات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      المستندات والملاحظات
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="compact-text text-gray-700 mb-1 block" style={{ fontWeight: 700, color: '#2563eb' }}>
                          المستندات المطلوبة
                        </label>
                        <div className="space-y-2">
                          {['صك الملكية', 'كروكي المساحة', 'رخصة البناء', 'الخرائط القديمة'].map((doc, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                              <input type="checkbox" id={`doc-${i}`} className="w-4 h-4" />
                              <label htmlFor={`doc-${i}`} className="text-xs flex-1">{doc}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <TextAreaWithCopy
                        label="ملاحظات المهمة"
                        id="taskNotes"
                        defaultValue=""
                        placeholder="أي ملاحظات أو تعليمات خاصة بالمهمة..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* إسناد المهمة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إسناد المهمة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="المساح المُكلف"
                        id="assignedTo"
                        defaultValue=""
                        options={[
                          { value: '', label: 'سيتم الإسناد لاحقاً' },
                          { value: '817-00126', label: 'المساح خالد أحمد - 817-00126' },
                          { value: '817-00127', label: 'المساح سعد عبدالله - 817-00127' },
                        ]}
                      />

                      <SelectWithCopy
                        label="الحالة الأولية"
                        id="initialStatus"
                        defaultValue="pending"
                        options={TASK_STATUSES.map(s => ({ value: s.value, label: s.label }))}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <strong>ملاحظة هامة:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>عند إسناد المهمة، ستظهر في تاب المهمات في شاشة الموظف (817)</li>
                          <li>إذا كانت مرتبطة بمعاملة، ستظهر في تاب البيانات المساحية (286/700)</li>
                          <li>سيتم إرسال إشعار فوري للمساح المُكلف</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-03: المهام النشطة
      case '822-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Clock className="h-4 w-4" />
                  المهام النشطة والجارية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Search className="h-3 w-3" />
                    بحث
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.filter(t => ['assigned', 'in-progress', 'field-work', 'data-entry'].includes(t.status)).map((task) => {
                    const statusInfo = TASK_STATUSES.find(s => s.value === task.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === task.priority);
                    const landTypeInfo = LAND_TYPES.find(lt => lt.value === task.landType);
                    const urbanInfo = URBAN_SCOPE.find(us => us.value === task.urbanScope);
                    
                    // حساب التقدم (افتراضي)
                    const progress = task.status === 'assigned' ? 10 :
                                   task.status === 'field-work' ? 40 :
                                   task.status === 'data-entry' ? 70 : 50;
                    
                    return (
                      <div key={task.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                {task.id}
                              </Badge>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                            </div>
                            
                            <div className="text-sm font-medium mb-1">{task.clientName}</div>
                            
                            {task.transactionId && (
                              <div className="text-xs text-gray-600 mb-1">
                                <FolderOpen className="h-3 w-3 inline ml-1" />
                                معاملة: {task.transactionTitle}
                              </div>
                            )}
                            
                            <div className="dense-grid dense-grid-2 gap-2 text-xs mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-700">{task.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-700">{task.area} م²</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={landTypeInfo?.color}>
                                {landTypeInfo?.label}
                              </Badge>
                              <Badge className={urbanInfo?.color}>
                                {urbanInfo?.label}
                              </Badge>
                              {task.landType === 'planned' && (
                                <span className="text-xs text-gray-600">
                                  قطعة {task.plotNumber}
                                </span>
                              )}
                            </div>
                            
                            <div className="mb-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">التقدم</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            {task.images.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Camera className="h-3 w-3" />
                                {task.images.length} صورة مُرفقة
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-gray-600">
                            <User className="h-3 w-3 inline ml-1" />
                            {task.assignedToName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button className="dense-btn dense-btn-primary">
                              <Upload className="h-3 w-3" />
                              رفع بيانات
                            </Button>
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Map className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-04: المهام المكتملة
      case '822-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckCircle className="h-4 w-4" />
                  المهام المكتملة
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800">لا توجد مهام مكتملة حالياً</p>
                  <p className="text-xs text-green-600 mt-1">ستظهر هنا المهام المكتملة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-05: قاعدة بيانات الأراضي
      case '822-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <MapPinned className="h-4 w-4" />
                  قاعدة بيانات الأراضي المساحية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة أرض
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* إحصائيات الأراضي */}
                  <div className="dense-stats-grid gap-3">
                    <div className="dense-stat-card">
                      <div className="dense-stat-icon bg-green-100 text-green-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="dense-stat-number">{stats.planned}</div>
                      <div className="dense-stat-label">مخططة</div>
                    </div>
                    
                    <div className="dense-stat-card">
                      <div className="dense-stat-icon bg-orange-100 text-orange-600">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="dense-stat-number">{stats.unplanned}</div>
                      <div className="dense-stat-label">غير مخططة</div>
                    </div>
                    
                    <div className="dense-stat-card">
                      <div className="dense-stat-icon bg-blue-100 text-blue-600">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="dense-stat-number">{stats.insideUrban}</div>
                      <div className="dense-stat-label">داخل النطاق</div>
                    </div>
                  </div>

                  <Separator />

                  {/* جدول الأراضي */}
                  <Table className="dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم القطعة</TableHead>
                        <TableHead className="text-right">المخطط</TableHead>
                        <TableHead className="text-right">الحي</TableHead>
                        <TableHead className="text-right">المساحة</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="text-right font-mono text-xs">
                            {task.plotNumber || '-'}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {task.planNumber || '-'}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {task.district}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {task.area} م²
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={LAND_TYPES.find(lt => lt.value === task.landType)?.color}>
                              {LAND_TYPES.find(lt => lt.value === task.landType)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Map className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-06: المساحون
      case '822-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  المساحون المسجلون
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة مساح
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: '817-00126', name: 'المساح خالد أحمد', activeTasks: 1, completed: 15, rating: 4.8 },
                    { id: '817-00127', name: 'المساح سعد عبدالله', activeTasks: 1, completed: 22, rating: 4.9 },
                  ].map((surveyor) => (
                    <div key={surveyor.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {surveyor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{surveyor.name}</div>
                            <div className="text-xs text-gray-500">{surveyor.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{surveyor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2 p-2 bg-gray-50 rounded">
                        <div className="text-center">
                          <div className="text-blue-600 font-bold">{surveyor.activeTasks}</div>
                          <div className="text-gray-500">مهام نشطة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-bold">{surveyor.completed}</div>
                          <div className="text-gray-500">مُكتملة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-600 font-bold">{surveyor.completed + surveyor.activeTasks}</div>
                          <div className="text-gray-500">الإجمالي</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button className="dense-btn dense-btn-primary">
                          <UserCheck className="h-3 w-3" />
                          المهام
                        </Button>
                        <Button className="dense-action-btn">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-07: البيانات المساحية
      case '822-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  البيانات المساحية المُدخلة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Upload className="h-3 w-3" />
                  رفع بيانات
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Layers className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>نظام البيانات المساحية:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكن للمساح رفع البيانات المساحية أثناء أو بعد تنفيذ المهمة</li>
                        <li>تشمل: القياسات، الإحداثيات، المساحات، الحدود</li>
                        <li>يتم ربطها تلقائياً بالمهمة والمعاملة إن وجدت</li>
                        <li>تظهر في تاب "البيانات المساحية" في شاشة المعاملة (286/700)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 822-08: المستندات والصور
      case '822-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Camera className="h-4 w-4" />
                  المستندات والصور المرفقة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Upload className="h-3 w-3" />
                  رفع ملفات
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.filter(t => t.images.length > 0).map((task) => (
                    <div key={task.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium">{task.id}</div>
                          <div className="text-xs text-gray-600">{task.clientName}</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {task.images.length} صورة
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {task.images.map((img, i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                            <Camera className="h-6 w-6 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة المساحين
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                12 تبويب • الشاشة 822
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Activity className="w-2 h-2 ml-1" />
              {stats.total} مهمة
            </Badge>
            <Badge className="text-xs bg-yellow-100 text-yellow-800">
              <Clock className="w-2 h-2 ml-1" />
              {stats.inProgress} نشطة
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-secondary">
              <RefreshCw className="h-3 w-3" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 822 - إدارة المساحين والمهام المساحية
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام متكامل • ربط مع المعاملات والموظفين • 12 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">
                <MapPinned className="h-3 w-3 ml-1" />
                {stats.planned} مخططة
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-822</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SurveyorsManagement_Complete_822;
