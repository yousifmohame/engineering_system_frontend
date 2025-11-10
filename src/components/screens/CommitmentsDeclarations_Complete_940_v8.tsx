/**
 * الشاشة 940 - الالتزامات والتعهدات - v8.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import {
  FileText, Users, Building2, HardHat, UserCheck, Shield,
  Plus, Edit, Eye, Download, Activity, BarChart3,
  Calendar, Archive, FileSignature, Settings, CheckCircle
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '940-01', number: '940-01', title: 'تعهدات العملاء', icon: Users },
  { id: '940-02', number: '940-02', title: 'إقرارات العملاء', icon: FileSignature },
  { id: '940-03', number: '940-03', title: 'تعهدات المالكين', icon: Building2 },
  { id: '940-04', number: '940-04', title: 'إقرارات المالكين', icon: Shield },
  { id: '940-05', number: '940-05', title: 'تعهدات الموظفين', icon: UserCheck },
  { id: '940-06', number: '940-06', title: 'إقرارات الموظفين', icon: CheckCircle },
  { id: '940-07', number: '940-07', title: 'تعهدات المقاولين', icon: HardHat },
  { id: '940-08', number: '940-08', title: 'إقرارات المقاولين', icon: FileText },
  { id: '940-09', number: '940-09', title: 'تعهدات الاستشاريين', icon: Users },
  { id: '940-10', number: '940-10', title: 'إقرارات الاستشاريين', icon: FileSignature },
  { id: '940-11', number: '940-11', title: 'السجل الشامل', icon: Archive },
  { id: '940-12', number: '940-12', title: 'التوثيق الإلكتروني', icon: Shield },
  { id: '940-13', number: '940-13', title: 'التقارير', icon: BarChart3 },
  { id: '940-14', number: '940-14', title: 'الإعدادات', icon: Settings },
];

interface Commitment {
  id: string;
  type: 'commitment' | 'declaration';
  category: string;
  clientName: string;
  date: string;
  status: 'active' | 'completed' | 'pending';
}

const CommitmentsDeclarations_Complete_940_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('940-01');
  const [autoNotify, setAutoNotify] = useState(true);
  const [requireSignature, setRequireSignature] = useState(true);

  const mockCommitments: Commitment[] = [
    { id: 'CMT-001', type: 'commitment', category: 'عميل', clientName: 'شركة النور', date: '2025-10-15', status: 'active' },
    { id: 'CMT-002', type: 'declaration', category: 'مالك', clientName: 'أحمد محمد', date: '2025-10-14', status: 'completed' },
    { id: 'CMT-003', type: 'commitment', category: 'مقاول', clientName: 'مؤسسة البناء', date: '2025-10-13', status: 'pending' },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'active': { label: 'نشط', color: 'bg-green-500' },
      'completed': { label: 'مكتمل', color: 'bg-blue-500' },
      'pending': { label: 'معلق', color: 'bg-yellow-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'commitment' ? (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-purple-500 text-white">تعهد</Badge>
    ) : (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-indigo-500 text-white">إقرار</Badge>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '940-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعهدات العملاء</h2>
              <div className="flex gap-2">
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Plus className="h-3 w-3 ml-1" />جديد
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">45</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعهدات نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">123</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-2xl text-yellow-600 mb-1">12</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <FileSignature className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">180</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCommitments.map((item) => (
                      <TableRow key={item.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{item.id}</TableCell>
                        <TableCell className="text-right py-2">{getTypeBadge(item.type)}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.clientName}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">{item.date}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(item.status)}</TableCell>
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

      case '940-14':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الالتزامات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات التوثيق والتنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-notify"
                  label="التنبيه التلقائي"
                  description="إرسال تنبيه عند إنشاء تعهد جديد"
                  checked={autoNotify}
                  onCheckedChange={setAutoNotify}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="require-signature"
                  label="طلب التوقيع"
                  description="طلب توقيع إلكتروني لجميع التعهدات"
                  checked={requireSignature}
                  onCheckedChange={setRequireSignature}
                  size="sm"
                  variant="success"
                />
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
      <CodeDisplay code="SCR-940" position="top-right" />
      
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
              <FileText 
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
                  الالتزامات والتعهدات
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
                    940
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
                إدارة التعهدات والإقرارات مع التوثيق الإلكتروني
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
                14 تبويباً
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
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CommitmentsDeclarations_Complete_940_v8;
