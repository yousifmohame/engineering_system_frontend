/**
 * التاب 286-01 - المعلومات الأساسية - نسخة مكثفة جداً
 * ===========================================================
 * 
 * التكثيف الفائق v2.0:
 * - استغلال 95%+ من المساحة المتاحة
 * - بطاقات إحصائية في grid-cols-8
 * - جداول مكثفة جداً بدلاً من نماذج
 * - نوافذ منبثقة للتفاصيل
 * - لا حاجة للتمرير - كل شيء في شاشة واحدة
 * - أحجام صغيرة جداً: text-[9px], text-[10px]
 * - مسافات قليلة جداً: gap-0.5, p-1
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  FileText, User, Building, MapPin, Calendar, DollarSign, Users, Target,
  Save, Edit2, Eye, Plus, CheckCircle, AlertCircle, Settings, Clock
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface TransactionBasicInfo {
  transactionNumber: string;
  transactionType: string;
  priority: string;
  clientName: string;
  clientId: string;
  clientPhone: string;
  propertyType: string;
  deedNumber: string;
  landArea: number;
  expectedDuration: number;
  estimatedCost: number;
  projectManager: string;
}

const Tab_286_01_BasicInfo_UltraDense: React.FC = () => {
  const generateTransactionNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 999) + 1;
    return `${year}${month}${String(random).padStart(3, '0')}`;
  };

  const [data, setData] = useState<TransactionBasicInfo>({
    transactionNumber: generateTransactionNumber(),
    transactionType: '',
    priority: 'medium',
    clientName: '',
    clientId: '',
    clientPhone: '',
    propertyType: '',
    deedNumber: '',
    landArea: 0,
    expectedDuration: 30,
    estimatedCost: 0,
    projectManager: ''
  });

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  // بيانات الإحصائيات
  const stats = [
    { label: 'رقم المعاملة', value: data.transactionNumber, icon: Hash, color: '#3b82f6' },
    { label: 'نوع المعاملة', value: data.transactionType || '-', icon: FileText, color: '#10b981' },
    { label: 'الأولوية', value: data.priority === 'high' ? 'عالية' : 'متوسطة', icon: Flag, color: '#f59e0b' },
    { label: 'المدة المتوقعة', value: `${data.expectedDuration} يوم`, icon: Clock, color: '#8b5cf6' },
    { label: 'التكلفة', value: `${data.estimatedCost.toLocaleString()} ر.س`, icon: DollarSign, color: '#ec4899' },
    { label: 'العميل', value: data.clientName || '-', icon: User, color: '#06b6d4' },
    { label: 'المدير', value: data.projectManager || '-', icon: Users, color: '#f59e0b' },
    { label: 'الحالة', value: 'جديدة', icon: CheckCircle, color: '#10b981' }
  ];

  // بيانات الجداول المكثفة
  const transactionInfo = [
    { field: 'رقم المعاملة', value: data.transactionNumber, editable: false },
    { field: 'نوع المعاملة *', value: data.transactionType || '-', editable: true },
    { field: 'الأولوية *', value: data.priority, editable: true },
    { field: 'المدة المتوقعة', value: `${data.expectedDuration} يوم`, editable: true }
  ];

  const clientInfo = [
    { field: 'اسم العميل *', value: data.clientName || '-', editable: true },
    { field: 'رقم الهوية *', value: data.clientId || '-', editable: true },
    { field: 'رقم الجوال *', value: data.clientPhone || '-', editable: true },
    { field: 'البريد الإلكتروني', value: '-', editable: true }
  ];

  const propertyInfo = [
    { field: 'نوع العقار', value: data.propertyType || '-', editable: true },
    { field: 'رقم الصك', value: data.deedNumber || '-', editable: true },
    { field: 'مساحة الأرض', value: `${data.landArea} م²`, editable: true },
    { field: 'رقم المخطط', value: '-', editable: true }
  ];

  const teamInfo = [
    { field: 'مدير المشروع *', value: data.projectManager || '-', editable: true },
    { field: 'التكلفة التقديرية', value: `${data.estimatedCost.toLocaleString()} ر.س`, editable: true },
    { field: 'التكلفة المتفق عليها', value: '-', editable: true },
    { field: 'تاريخ البدء', value: new Date().toLocaleDateString('ar'), editable: true }
  ];

  const handleSave = () => {
    localStorage.setItem(`transaction_basic_${data.transactionNumber}`, JSON.stringify(data));
    alert('✅ تم الحفظ بنجاح!');
  };

  const handleEdit = (section: string) => {
    setSelectedSection(section);
    setShowDetailsDialog(true);
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-01-DENSE" position="top-right" />
      
      {/* بطاقات إحصائية مكثفة جداً - 8 أعمدة */}
      <div className="grid grid-cols-8 gap-1 mb-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} style={{ 
              background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
              border: `1px solid ${stat.color}40`
            }}>
              <CardContent className="p-1 text-center">
                <Icon className="h-3 w-3 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[9px] text-gray-500 mb-0">{stat.label}</p>
                <p className="text-[11px] font-bold truncate" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 4 جداول مكثفة في grid 2x2 */}
      <div className="grid grid-cols-2 gap-2" style={{ height: 'calc(100% - 100px)' }}>
        
        {/* جدول 1: معلومات المعاملة */}
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" style={{ color: '#3b82f6' }} />
                <h3 className="text-xs font-bold">معلومات المعاملة</h3>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEdit('transaction')}
                style={{ height: '20px', padding: '0 6px' }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <Table className="table-rtl dense-table">
              <TableBody>
                {transactionInfo.map((row, index) => (
                  <TableRow key={index} style={{ height: '24px' }}>
                    <TableCell className="text-right py-0 text-[10px] font-semibold w-1/2" style={{ color: '#64748b' }}>
                      {row.field}
                    </TableCell>
                    <TableCell className="text-right py-0 text-[10px]">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* جدول 2: معلومات العميل */}
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" style={{ color: '#10b981' }} />
                <h3 className="text-xs font-bold">معلومات العميل</h3>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEdit('client')}
                style={{ height: '20px', padding: '0 6px' }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <Table className="table-rtl dense-table">
              <TableBody>
                {clientInfo.map((row, index) => (
                  <TableRow key={index} style={{ height: '24px' }}>
                    <TableCell className="text-right py-0 text-[10px] font-semibold w-1/2" style={{ color: '#64748b' }}>
                      {row.field}
                    </TableCell>
                    <TableCell className="text-right py-0 text-[10px]">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* جدول 3: معلومات العقار */}
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" style={{ color: '#8b5cf6' }} />
                <h3 className="text-xs font-bold">معلومات العقار</h3>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEdit('property')}
                style={{ height: '20px', padding: '0 6px' }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <Table className="table-rtl dense-table">
              <TableBody>
                {propertyInfo.map((row, index) => (
                  <TableRow key={index} style={{ height: '24px' }}>
                    <TableCell className="text-right py-0 text-[10px] font-semibold w-1/2" style={{ color: '#64748b' }}>
                      {row.field}
                    </TableCell>
                    <TableCell className="text-right py-0 text-[10px]">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* جدول 4: الفريق والتكلفة */}
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" style={{ color: '#ec4899' }} />
                <h3 className="text-xs font-bold">الفريق والتكلفة</h3>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEdit('team')}
                style={{ height: '20px', padding: '0 6px' }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <Table className="table-rtl dense-table">
              <TableBody>
                {teamInfo.map((row, index) => (
                  <TableRow key={index} style={{ height: '24px' }}>
                    <TableCell className="text-right py-0 text-[10px] font-semibold w-1/2" style={{ color: '#64748b' }}>
                      {row.field}
                    </TableCell>
                    <TableCell className="text-right py-0 text-[10px]">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* زر الحفظ العائم */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={handleSave}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
            padding: '8px 16px',
            height: '32px'
          }}
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ جميع البيانات
        </Button>
      </div>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent style={{ maxWidth: '600px', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle className="text-right">
              تعديل {selectedSection === 'transaction' ? 'معلومات المعاملة' : 
                     selectedSection === 'client' ? 'معلومات العميل' :
                     selectedSection === 'property' ? 'معلومات العقار' : 'الفريق والتكلفة'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedSection === 'transaction' && (
              <>
                <SelectWithCopy
                  label="نوع المعاملة *"
                  id="transactionType"
                  value={data.transactionType}
                  onChange={(value) => setData({ ...data, transactionType: value })}
                  options={[
                    { value: 'building_permit', label: 'ترخيص بناء' },
                    { value: 'subdivision', label: 'إفراز' },
                    { value: 'deed_modification', label: 'تعديل صك' }
                  ]}
                  copyable
                  clearable
                />
                <SelectWithCopy
                  label="الأولوية *"
                  id="priority"
                  value={data.priority}
                  onChange={(value) => setData({ ...data, priority: value })}
                  options={[
                    { value: 'low', label: 'منخفضة' },
                    { value: 'medium', label: 'متوسطة' },
                    { value: 'high', label: 'عالية' }
                  ]}
                  copyable
                  clearable={false}
                />
              </>
            )}
            {selectedSection === 'client' && (
              <>
                <InputWithCopy
                  label="اسم العميل *"
                  id="clientName"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  required
                  copyable
                  clearable
                />
                <InputWithCopy
                  label="رقم الهوية *"
                  id="clientId"
                  value={data.clientId}
                  onChange={(e) => setData({ ...data, clientId: e.target.value })}
                  required
                  copyable
                  clearable
                />
                <InputWithCopy
                  label="رقم الجوال *"
                  id="clientPhone"
                  type="tel"
                  value={data.clientPhone}
                  onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
                  required
                  copyable
                  clearable
                />
              </>
            )}
            <div className="flex gap-2 pt-3">
              <Button
                onClick={() => setShowDetailsDialog(false)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  flex: 1
                }}
              >
                <CheckCircle className="h-4 w-4 ml-1" />
                حفظ
              </Button>
              <Button
                onClick={() => setShowDetailsDialog(false)}
                variant="outline"
                style={{ flex: 1 }}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_286_01_BasicInfo_UltraDense;
