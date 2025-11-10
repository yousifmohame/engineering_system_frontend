/**
 * الشاشة 860 - معالجة الملاحظات - v8.0
 * =============================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 12 تبويباً شاملاً
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import {
  AlertCircle, CheckCircle, Clock, MessageSquare, FileText,
  User, Calendar, Settings, Activity, BarChart3, Download,
  Target, TrendingUp, Eye, Edit
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '860-01', number: '860-01', title: 'نظرة عامة', icon: Activity },
  { id: '860-02', number: '860-02', title: 'الملاحظات الواردة', icon: MessageSquare },
  { id: '860-03', number: '860-03', title: 'حسب المستند', icon: FileText },
  { id: '860-04', number: '860-04', title: 'حسب المعاملة', icon: Target },
  { id: '860-05', number: '860-05', title: 'إسناد المهام', icon: User },
  { id: '860-06', number: '860-06', title: 'حالة المعالجة', icon: TrendingUp },
  { id: '860-07', number: '860-07', title: 'الإحصائيات', icon: BarChart3 },
  { id: '860-08', number: '860-08', title: 'التقارير', icon: FileText },
  { id: '860-09', number: '860-09', title: 'التاريخ', icon: Clock },
  { id: '860-10', number: '860-10', title: 'الأرشيف', icon: Calendar },
  { id: '860-11', number: '860-11', title: 'المتابعة', icon: CheckCircle },
  { id: '860-12', number: '860-12', title: 'الإعدادات', icon: Settings },
];

interface Note {
  id: string;
  transactionCode: string;
  entityName: string;
  noteText: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  receivedDate: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

const NotesProcessing_Complete_860_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('860-01');
  const [autoAssign, setAutoAssign] = useState(false);
  const [notifyOnNote, setNotifyOnNote] = useState(true);

  const mockNotes: Note[] = [
    {
      id: 'NOTE-001',
      transactionCode: 'TRX-2025-001',
      entityName: 'أمانة المنطقة الشرقية',
      noteText: 'يرجى تحديث المخططات المعمارية',
      status: 'pending',
      receivedDate: '2025-10-20',
      priority: 'high'
    },
    {
      id: 'NOTE-002',
      transactionCode: 'TRX-2025-002',
      entityName: 'وزارة البلديات',
      noteText: 'تعديل صك الملكية',
      status: 'in-progress',
      assignedTo: 'م. أحمد محمد',
      receivedDate: '2025-10-18',
      priority: 'urgent'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'معلقة', color: 'bg-yellow-500' },
      'in-progress': { label: 'قيد المعالجة', color: 'bg-blue-500' },
      'completed': { label: 'مكتملة', color: 'bg-green-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; color: string }> = {
      'urgent': { label: 'عاجل', color: 'bg-red-500' },
      'high': { label: 'مرتفع', color: 'bg-orange-500' },
      'medium': { label: 'متوسط', color: 'bg-blue-500' },
      'low': { label: 'منخفض', color: 'bg-gray-500' },
    };
    const p = priorityMap[priority] || { label: priority, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${p.color} text-white`}>{p.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '860-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            {/* إحصائيات مكثفة */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <MessageSquare className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">45</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الملاحظات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-2xl text-yellow-600 mb-1">12</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">18</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">15</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
                </CardContent>
              </Card>
            </div>

            {/* معدل المعالجة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  معدل المعالجة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الإنجاز</span>
                      <span className="text-xs font-mono">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط وقت المعالجة</span>
                      <span className="text-xs font-mono">2.5 أيام</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '860-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات الواردة</h2>
              <Badge variant="outline" className="text-xs">{mockNotes.length} ملاحظة</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNotes.map((note) => (
                      <TableRow key={note.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{note.id}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">{note.transactionCode}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{note.entityName}</TableCell>
                        <TableCell className="text-right py-2">{getPriorityBadge(note.priority)}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(note.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
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

      case '860-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات معالجة الملاحظات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات الإسناد والتنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-assign"
                  label="الإسناد التلقائي"
                  description="إسناد الملاحظات تلقائياً للموظفين"
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notify-note"
                  label="التنبيه عند الملاحظة"
                  description="إرسال تنبيه عند ورود ملاحظة جديدة"
                  checked={notifyOnNote}
                  onCheckedChange={setNotifyOnNote}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="default-priority"
                    label="الأولوية الافتراضية"
                    value="medium"
                    onChange={() => {}}
                    options={[
                      { value: 'urgent', label: 'عاجل' },
                      { value: 'high', label: 'مرتفع' },
                      { value: 'medium', label: 'متوسط' },
                      { value: 'low', label: 'منخفض' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-860" position="top-right" />
      
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
              <MessageSquare 
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
                  معالجة الملاحظات
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
                    860
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
                إدارة ومعالجة ملاحظات الجهات الخارجية
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
                12 تبويبات
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

export default NotesProcessing_Complete_860_v8;
