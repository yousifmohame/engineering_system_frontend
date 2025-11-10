/**
 * الشاشة 872 - الرسومات الهندسية - v8.0
 * ===============================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 10 تبويبات شاملة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import {
  FileText, Upload, Download, Eye, Trash2, CheckCircle,
  Settings, Plus, Building, Layers, Zap, Wind, Leaf,
  Flame, Star, Edit, History, Folder
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '872-01', number: '872-01', title: 'المخططات المعمارية', icon: Building },
  { id: '872-02', number: '872-02', title: 'المخططات الإنشائية', icon: Layers },
  { id: '872-03', number: '872-03', title: 'الأنظمة الكهربائية', icon: Zap },
  { id: '872-04', number: '872-04', title: 'التكييف والتهوية', icon: Wind },
  { id: '872-05', number: '872-05', title: 'كفاءة الطاقة', icon: Leaf },
  { id: '872-06', number: '872-06', title: 'الحماية من الحريق', icon: Flame },
  { id: '872-07', number: '872-07', title: 'إدارة الإصدارات', icon: History },
  { id: '872-08', number: '872-08', title: 'الأرشفة', icon: Folder },
  { id: '872-09', number: '872-09', title: 'التقارير', icon: FileText },
  { id: '872-10', number: '872-10', title: 'الإعدادات', icon: Settings },
];

interface DrawingFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  version: number;
  uploadDate: string;
  uploadedBy: string;
  status: 'current' | 'proposed' | 'approved';
  category: string;
  downloadCount: number;
}

const EngineeringDrawings_Complete_872_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('872-01');
  const [autoApprove, setAutoApprove] = useState(false);
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);

  const drawingFiles: DrawingFile[] = [
    {
      id: 'DWG-001',
      fileName: 'المخطط المعماري - الدور الأرضي.dwg',
      fileType: 'DWG',
      fileSize: '15.2 MB',
      version: 3,
      uploadDate: '2025-10-15',
      uploadedBy: 'م. أحمد محمد',
      status: 'approved',
      category: 'معمارية',
      downloadCount: 23
    },
    {
      id: 'DWG-002',
      fileName: 'المخطط الإنشائي - الأساسات.pdf',
      fileType: 'PDF',
      fileSize: '8.7 MB',
      version: 2,
      uploadDate: '2025-10-14',
      uploadedBy: 'م. سارة علي',
      status: 'approved',
      category: 'إنشائية',
      downloadCount: 18
    },
    {
      id: 'DWG-003',
      fileName: 'مخطط كهرباء - الطابق الأول.dwg',
      fileType: 'DWG',
      fileSize: '12.4 MB',
      version: 1,
      uploadDate: '2025-10-18',
      uploadedBy: 'م. عبدالله الدوسري',
      status: 'current',
      category: 'كهرباء',
      downloadCount: 5
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'current': { label: 'حالي', color: 'bg-blue-500' },
      'proposed': { label: 'مقترح', color: 'bg-yellow-500' },
      'approved': { label: 'معتمد', color: 'bg-green-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '872-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخططات المعمارية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Upload className="h-3 w-3 ml-1" />رفع مخطط
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Building className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">45</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملف مخطط</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">38</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمد</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Download className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">234</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحميلات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Star className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-2xl text-yellow-600 mb-1">12</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مميز</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدار</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drawingFiles.filter(f => f.category === 'معمارية').map((file) => (
                      <TableRow key={file.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{file.id}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.fileName}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{file.fileType}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">v{file.version}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(file.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
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

      case '872-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الرسومات الهندسية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات الموافقة والرفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-approve"
                  label="الموافقة التلقائية"
                  description="الموافقة التلقائية على المخططات المرفوعة"
                  checked={autoApprove}
                  onCheckedChange={setAutoApprove}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notify-upload"
                  label="التنبيه عند الرفع"
                  description="إرسال تنبيه عند رفع مخطط جديد"
                  checked={notifyOnUpload}
                  onCheckedChange={setNotifyOnUpload}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="default-format"
                    label="التنسيق الافتراضي"
                    value="dwg"
                    onChange={() => {}}
                    options={[
                      { value: 'dwg', label: 'DWG' },
                      { value: 'pdf', label: 'PDF' },
                      { value: 'dxf', label: 'DXF' }
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
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-872" position="top-right" />
      
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
              <Layers 
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
                  الرسومات الهندسية
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
                    872
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
                إدارة المخططات والرسومات الهندسية
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
                10 تبويبات
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

export default EngineeringDrawings_Complete_872_v8;
