/**
 * الشاشة 286 - إنشاء معاملة جديدة - v8.0
 * ===========================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 12 تبويباً شاملاً
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, Plus, Edit, Save, CheckCircle, Users, Calendar,
  Upload, Paperclip, Clock, Target, AlertCircle, Settings,
  Eye, Download, RefreshCw, User, Building, Activity, Trash2, List,
  Layers, Navigation, Compass, Grid, MapPin
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import Tab_286_01_BasicInfo_UltraDense from './Tab_286_01_BasicInfo_UltraDense';
import Tab_286_02_TransactionDetails_Complete from './Tab_286_02_TransactionDetails_Complete';
import Tab_286_AllTabs_UltraDense, {
  Tab_286_05_Tasks_UltraDense,
  Tab_286_06_StaffAssignment_UltraDense,
  Tab_286_08_Attachments_UltraDense,
  Tab_286_10_Costs_UltraDense
} from './Tab_286_AllTabs_UltraDense';
import Tab_286_RestTabs, {
  Tab_286_07_ClientInfo,
  Tab_286_09_Appointments,
  Tab_286_11_Approvals,
  Tab_286_12_Notes,
  Tab_286_13_Preview,
  Tab_286_14_Settings
} from './Tab_286_RestTabs_Complete';
import Tab_RequestPurpose_Brief_Complete from './Tab_RequestPurpose_Brief_Complete';
import Tab_RequestPurpose_Detailed_Complete from './Tab_RequestPurpose_Detailed_Complete';
import Tab_FloorsNaming_Complete from './Tab_FloorsNaming_Complete';
import Tab_Setbacks_AllFloors_Complete from './Tab_Setbacks_AllFloors_Complete';
import Tab_FinalComponents_Detailed_Complete from './Tab_FinalComponents_Detailed_Complete';
import Tab_Components_Generic_Complete from './Tab_Components_Generic_Complete';
import Tab_Boundaries_Neighbors_Complete from './Tab_Boundaries_Neighbors_Complete';
import Tab_LandArea_Complete from './Tab_LandArea_Complete';

const TABS_CONFIG: TabConfig[] = [
  { id: '286-01', number: '286-01', title: 'معلومات أساسية', icon: FileText },
  { id: '286-02', number: '286-02', title: 'تفاصيل المعاملة', icon: Target },
  { id: '286-03', number: '286-03', title: 'الغرض المختصر', icon: CheckCircle },
  { id: '286-04', number: '286-04', title: 'الغرض التفصيلي', icon: List },
  { id: '286-05', number: '286-05', title: 'المهمات', icon: CheckCircle },
  { id: '286-06', number: '286-06', title: 'إسناد الموظفين', icon: Users },
  { id: '286-07', number: '286-07', title: 'معلومات العميل', icon: User },
  { id: '286-08', number: '286-08', title: 'المرفقات', icon: Paperclip },
  { id: '286-09', number: '286-09', title: 'المواعيد', icon: Calendar },
  { id: '286-10', number: '286-10', title: 'التكاليف', icon: Activity },
  { id: '286-11', number: '286-11', title: 'الموافقات', icon: CheckCircle },
  { id: '286-12', number: '286-12', title: 'الملاحظات', icon: FileText },
  { id: '286-13', number: '286-13', title: 'معاينة', icon: Eye },
  { id: '286-14', number: '286-14', title: 'الإعدادات', icon: Settings },
  { id: '286-15', number: '286-15', title: 'مسميات وعدد الأدوار', icon: Layers },
  { id: '286-16', number: '286-16', title: 'الارتدادات من الأربع جهات', icon: Navigation },
  { id: '286-17', number: '286-17', title: 'المكونات التفصيلية النهائية', icon: Grid },
  { id: '286-18', number: '286-18', title: 'المكونات حسب الرخصة القديمة', icon: FileText },
  { id: '286-19', number: '286-19', title: 'المكونات حسب المقترح', icon: Target },
  { id: '286-20', number: '286-20', title: 'المكونات حسب القائم', icon: Building },
  { id: '286-21', number: '286-21', title: 'الحدود والمجاورين', icon: Compass },
  { id: '286-22', number: '286-22', title: 'مساحة الأرض', icon: MapPin },
];

const CreateTransaction_Complete_286: React.FC = () => {
  const [activeTab, setActiveTab] = useState('286-01');
  const [autoAssign, setAutoAssign] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);

  const transactionData = useMemo(() => ({
    types: [
      { id: '1', name: 'ترخيص بناء', tasks: 8, duration: '25 يوماً' },
      { id: '2', name: 'إفراز', tasks: 7, duration: '30 يوماً' },
      { id: '3', name: 'تعديل صك', tasks: 5, duration: '15 يوماً' },
      { id: '4', name: 'استشارة هندسية', tasks: 4, duration: '10 أيام' },
    ],
    tasks: [
      { id: '1', name: 'استقبال الطلب', duration: 1, assigned: 'أحمد محمد', status: 'pending' },
      { id: '2', name: 'مراجعة المستندات', duration: 2, assigned: 'فاطمة سعيد', status: 'pending' },
      { id: '3', name: 'فحص الموقع', duration: 3, assigned: 'خالد عبدالله', status: 'pending' },
      { id: '4', name: 'إعداد المخططات', duration: 5, assigned: 'نورة حسن', status: 'pending' },
    ],
    attachments: [
      { id: '1', name: 'صك الملكية.pdf', size: '2.3 MB', type: 'PDF', date: '2025-10-20' },
      { id: '2', name: 'خريطة الموقع.jpg', size: '1.8 MB', type: 'صورة', date: '2025-10-21' },
      { id: '3', name: 'الهوية الوطنية.pdf', size: '850 KB', type: 'PDF', date: '2025-10-22' },
    ],
  }), []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-500' },
      'in-progress': { label: 'قيد التنفيذ', color: 'bg-blue-500' },
      completed: { label: 'مكتمل', color: 'bg-green-500' },
      cancelled: { label: 'ملغي', color: 'bg-red-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '286-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات أساسية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-rtl">
                    <InputWithCopy
                      id="transaction-number"
                      label="رقم المعاملة"
                      value="TR-2025-001234"
                      onChange={() => {}}
                      copyable={true}
                      clearable={false}
                      disabled
                    />
                  </div>

                  <div className="form-rtl">
                    <SelectWithCopy
                      id="transaction-type"
                      label="نوع المعاملة"
                      value=""
                      onChange={() => {}}
                      options={transactionData.types.map(t => ({ value: t.id, label: t.name }))}
                      copyable={false}
                      clearable={true}
                    />
                  </div>

                  <div className="form-rtl">
                    <InputWithCopy
                      id="transaction-title"
                      label="عنوان المعاملة"
                      value=""
                      onChange={() => {}}
                      placeholder="أدخل عنوان المعاملة"
                      copyable={true}
                      clearable={true}
                      required
                    />
                  </div>

                  <div className="form-rtl">
                    <SelectWithCopy
                      id="priority"
                      label="الأولوية"
                      value="medium"
                      onChange={() => {}}
                      options={[
                        { value: 'low', label: 'منخفضة' },
                        { value: 'medium', label: 'متوسطة' },
                        { value: 'high', label: 'عالية' },
                        { value: 'urgent', label: 'عاجلة' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>
                </div>

                <div className="form-rtl">
                  <TextAreaWithCopy
                    id="description"
                    label="الوصف"
                    value=""
                    onChange={() => {}}
                    placeholder="وصف تفصيلي للمعاملة"
                    rows={3}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '286-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل المعاملة</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {transactionData.types.map((type) => (
                <Card key={type.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs px-1.5 py-0">{type.tasks} مهام</Badge>
                    </div>
                    <h3 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">المدة المتوقعة: {type.duration}</p>
                    <Button size="sm" variant="outline" className="w-full h-7 text-xs">اختيار</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '286-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />مهمة جديدة</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData.tasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{task.duration} يوم</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.assigned}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '286-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Upload className="h-3 w-3 ml-1" />رفع ملف</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData.attachments.map((att) => (
                      <TableRow key={att.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{att.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{att.type}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{att.size}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{att.date}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '286-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات المعاملة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-assign"
                  label="الإسناد التلقائي"
                  description="إسناد المهمات تلقائياً للموظفين المتاحين"
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notifications"
                  label="إرسال التنبيهات"
                  description="إرسال إشعارات للموظفين عند إسناد المهمات"
                  checked={sendNotifications}
                  onCheckedChange={setSendNotifications}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="approval-level"
                    label="مستوى الموافقة المطلوب"
                    value="manager"
                    onChange={() => {}}
                    options={[
                      { value: 'none', label: 'لا يوجد' },
                      { value: 'supervisor', label: 'مشرف' },
                      { value: 'manager', label: 'مدير' },
                      { value: 'director', label: 'مدير عام' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '286-01':
        return <Tab_286_01_BasicInfo_UltraDense />;

      case '286-02':
        return <Tab_286_02_TransactionDetails_Complete />;

      case '286-03':
        return <Tab_RequestPurpose_Brief_Complete transactionId="NEW" readOnly={false} />;

      case '286-04':
        return <Tab_RequestPurpose_Detailed_Complete transactionId="NEW" readOnly={false} />;

      case '286-05':
        return <Tab_286_05_Tasks_UltraDense />;

      case '286-06':
        return <Tab_286_06_StaffAssignment_UltraDense />;

      case '286-07':
        return <Tab_286_07_ClientInfo />;

      case '286-08':
        return <Tab_286_08_Attachments_UltraDense />;

      case '286-09':
        return <Tab_286_09_Appointments />;

      case '286-10':
        return <Tab_286_10_Costs_UltraDense />;

      case '286-11':
        return <Tab_286_11_Approvals />;

      case '286-12':
        return <Tab_286_12_Notes />;

      case '286-13':
        return <Tab_286_13_Preview />;

      case '286-14':
        return <Tab_286_14_Settings />;

      case '286-15':
        return <Tab_FloorsNaming_Complete transactionId="NEW" readOnly={false} />;

      case '286-16':
        return <Tab_Setbacks_AllFloors_Complete transactionId="NEW" readOnly={false} />;

      case '286-17':
        return <Tab_FinalComponents_Detailed_Complete transactionId="NEW" readOnly={false} />;

      case '286-18':
        return <Tab_Components_Generic_Complete transactionId="NEW" readOnly={false} type="old-license" />;

      case '286-19':
        return <Tab_Components_Generic_Complete transactionId="NEW" readOnly={false} type="proposed" />;

      case '286-20':
        return <Tab_Components_Generic_Complete transactionId="NEW" readOnly={false} type="existing" />;

      case '286-21':
        return <Tab_Boundaries_Neighbors_Complete transactionId="NEW" readOnly={false} />;

      case '286-22':
        return <Tab_LandArea_Complete transactionId="NEW" readOnly={false} />;

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-286" position="top-right" />
      
      {/* هيدر الشاشة v4.2.2 */}
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
              <Plus 
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
                  إنشاء معاملة جديدة
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
                    286
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
                إنشاء وإدارة المعاملات الجديدة مع المهمات والإسناد
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
                22 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction_Complete_286;
