/**
 * مكون حاسبة نسبة الإنجاز للمعاملات
 * =======================================
 * 
 * يستخدم في شاشة 701 (إعدادات المعاملات) - التاب 701-18
 * لتحديد الأوزان النسبية لكل تاب من تابات معالجة المعاملات (الشاشة 284)
 * 
 * المميزات:
 * - إدارة الأوزان النسبية لـ 42 تاباً
 * - التحقق من أن المجموع = 100%
 * - حفظ الإعدادات
 * - إعادة تعيين للقيم الافتراضية
 * - معاينة مباشرة للنسب
 * 
 * @version 1.0
 * @date 2025-10-25
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { 
  Calculator, Save, RefreshCw, CheckCircle, AlertCircle, 
  TrendingUp, Eye, FileText, Bell, User, Building, UserPlus,
  MapPin, ClipboardList, FileInput, Briefcase, DollarSign,
  FileSignature, CreditCard, Receipt, Image, Send, MessageSquare,
  Settings, Mail, Package, Calendar, Users, BarChart3, Link2,
  MapPinned, Camera, AlertTriangle, Archive
} from 'lucide-react';

// تعريف التابات مع أيقوناتها (يجب أن تتطابق مع الشاشة 284)
interface TabWeight {
  id: string;
  number: string;
  title: string;
  icon: any;
  weight: number;
  defaultWeight: number;
}

const TABS_WEIGHTS: TabWeight[] = [
  { id: '284-01', number: '284-01', title: 'معلومات عامة', icon: FileText, weight: 5, defaultWeight: 5 },
  { id: '284-02', number: '284-02', title: 'الإشعارات والتنبيهات', icon: Bell, weight: 3, defaultWeight: 3 },
  { id: '284-03', number: '284-03', title: 'بيانات المالك', icon: User, weight: 6, defaultWeight: 6 },
  { id: '284-04', number: '284-04', title: 'بيانات الملكية', icon: Building, weight: 6, defaultWeight: 6 },
  { id: '284-05', number: '284-05', title: 'بيانات مقدم الطلب', icon: UserPlus, weight: 4, defaultWeight: 4 },
  { id: '284-06', number: '284-06', title: 'الموقع الجغرافي', icon: MapPin, weight: 4, defaultWeight: 4 },
  { id: '284-07', number: '284-07', title: 'طلبات المالك', icon: ClipboardList, weight: 3, defaultWeight: 3 },
  { id: '284-08', number: '284-08', title: 'وثائق مستلمة من المالك', icon: FileInput, weight: 5, defaultWeight: 5 },
  { id: '284-09', number: '284-09', title: 'التحقق', icon: CheckCircle, weight: 4, defaultWeight: 4 },
  { id: '284-10', number: '284-10', title: 'طلبات المكتب', icon: Briefcase, weight: 3, defaultWeight: 3 },
  { id: '284-11', number: '284-11', title: 'عرض السعر', icon: DollarSign, weight: 7, defaultWeight: 7 },
  { id: '284-12', number: '284-12', title: 'العقد', icon: FileSignature, weight: 8, defaultWeight: 8 },
  { id: '284-13', number: '284-13', title: 'المدفوعات', icon: CreditCard, weight: 7, defaultWeight: 7 },
  { id: '284-14', number: '284-14', title: 'مستحقات وفواتير', icon: Receipt, weight: 6, defaultWeight: 6 },
  { id: '284-15', number: '284-15', title: 'مستندات السداد', icon: FileCheck, weight: 4, defaultWeight: 4 },
  { id: '284-16', number: '284-16', title: 'صور فواتير الجهات', icon: Image, weight: 2, defaultWeight: 2 },
  { id: '284-17', number: '284-17', title: 'طلبات الجهات', icon: Send, weight: 5, defaultWeight: 5 },
  { id: '284-18', number: '284-18', title: 'ملاحظات الجهات', icon: MessageSquare, weight: 2, defaultWeight: 2 },
  { id: '284-19', number: '284-19', title: 'متطلبات النظام', icon: Settings, weight: 4, defaultWeight: 4 },
  { id: '284-20', number: '284-20', title: 'مراسلات', icon: Mail, weight: 4, defaultWeight: 4 },
  { id: '284-21', number: '284-21', title: 'تعهدات المكتب', icon: FileSignature, weight: 5, defaultWeight: 5 },
  { id: '284-22', number: '284-22', title: 'تعهدات المالك', icon: FileSignature, weight: 5, defaultWeight: 5 },
];

interface TransactionProgressCalculatorProps {
  onSave?: (weights: TabWeight[]) => void;
}

const TransactionProgressCalculator: React.FC<TransactionProgressCalculatorProps> = ({ onSave }) => {
  const [tabsWeights, setTabsWeights] = useState<TabWeight[]>(TABS_WEIGHTS);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // حساب المجموع الكلي
  const totalWeight = tabsWeights.reduce((sum, tab) => sum + tab.weight, 0);
  const isValid = totalWeight === 100;

  // تحديث وزن تاب معين
  const updateTabWeight = (tabId: string, newWeight: number) => {
    setTabsWeights(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, weight: Math.max(0, Math.min(100, newWeight)) } : tab
    ));
    setHasChanges(true);
  };

  // حفظ الإعدادات
  const handleSave = () => {
    if (isValid) {
      // حفظ في localStorage
      localStorage.setItem('transaction_tabs_weights', JSON.stringify(tabsWeights));
      
      if (onSave) {
        onSave(tabsWeights);
      }
      
      setHasChanges(false);
      alert('تم حفظ الأوزان النسبية بنجاح!');
    } else {
      alert(`خطأ: المجموع الكلي ${totalWeight}% يجب أن يساوي 100%`);
    }
  };

  // إعادة تعيين للقيم الافتراضية
  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الأوزان للقيم الافتراضية؟')) {
      setTabsWeights(TABS_WEIGHTS.map(tab => ({ ...tab, weight: tab.defaultWeight })));
      setHasChanges(true);
    }
  };

  // توزيع متساوي
  const handleDistributeEvenly = () => {
    const evenWeight = Math.floor(100 / tabsWeights.length);
    const remainder = 100 - (evenWeight * tabsWeights.length);
    
    setTabsWeights(prev => prev.map((tab, index) => ({
      ...tab,
      weight: index === 0 ? evenWeight + remainder : evenWeight
    })));
    setHasChanges(true);
  };

  // تصفية التابات حسب البحث
  const filteredTabs = tabsWeights.filter(tab =>
    tab.title.includes(searchTerm) || tab.number.includes(searchTerm)
  );

  return (
    <div className="space-y-4" dir="rtl">
      {/* العنوان والأزرار */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
              border: '2px solid rgba(124, 58, 237, 0.2)'
            }}
          >
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1e40af', margin: 0 }}>
              حاسبة نسبة الإنجاز
            </h2>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#6b7280', margin: 0 }}>
              إدارة الأوزان النسبية لتابات معالجة المعاملات (الشاشة 284)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDistributeEvenly}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            توزيع متساوي
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={!isValid || !hasChanges}
            className="gap-2"
            style={{ 
              background: isValid && hasChanges 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : undefined 
            }}
          >
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* بطاقة الملخص */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #3b82f6'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#1e40af', margin: 0 }}>
                  عدد التابات
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
                  {tabsWeights.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: isValid 
            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: `2px solid ${isValid ? '#10b981' : '#ef4444'}`
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: isValid ? '#065f46' : '#991b1b', margin: 0 }}>
                  المجموع الكلي
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: isValid ? '#047857' : '#dc2626', margin: 0 }}>
                  {totalWeight}%
                </p>
              </div>
              {isValid ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#92400e', margin: 0 }}>
                  الفرق
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#b45309', margin: 0 }}>
                  {100 - totalWeight}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط التقدم */}
      <Card className="card-rtl">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600 }}>
                نسبة التوزيع
              </span>
              <Badge variant="outline" style={{ 
                background: isValid ? '#d1fae5' : '#fee2e2',
                border: `1px solid ${isValid ? '#10b981' : '#ef4444'}`,
                color: isValid ? '#065f46' : '#991b1b'
              }}>
                {totalWeight}/100%
              </Badge>
            </div>
            <Progress 
              value={totalWeight} 
              className="h-3"
              style={{ 
                background: '#e5e7eb'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* تنبيه */}
      {!isValid && (
        <Alert style={{ background: '#fee2e2', border: '2px solid #ef4444' }}>
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>
            <strong>تحذير:</strong> المجموع الكلي للأوزان يجب أن يساوي 100% بالضبط. المجموع الحالي: {totalWeight}%
            <br />
            يرجى تعديل الأوزان حتى يصبح المجموع 100%.
          </AlertDescription>
        </Alert>
      )}

      {/* البحث */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="ابحث عن تاب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          />
          <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* جدول التابات */}
      <Card className="card-rtl">
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الرقم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم التاب
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>
                  الوزن النسبي (%)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                  القيمة الافتراضية
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>
                  المساهمة
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                const contribution = totalWeight > 0 ? (tab.weight / totalWeight) * 100 : 0;
                
                return (
                  <TableRow key={tab.id}>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono">
                        {tab.number}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {tab.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={tab.weight}
                        onChange={(e) => updateTabWeight(tab.id, Number(e.target.value))}
                        className="w-24 text-center font-mono"
                        style={{ fontFamily: 'Courier New, monospace' }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ background: '#f3f4f6' }}>
                        {tab.defaultWeight}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Progress value={contribution} className="flex-1 h-2" />
                        <span style={{ fontFamily: 'Courier New, monospace', fontSize: '11px', color: '#6b7280' }}>
                          {contribution.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <Card className="card-rtl" style={{ background: '#f0f9ff', border: '2px solid #3b82f6' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                كيفية استخدام حاسبة نسبة الإنجاز
              </h4>
              <ul style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#1e3a8a', paddingRight: '20px', margin: 0 }}>
                <li>قم بتعديل الوزن النسبي لكل تاب حسب أهميته في المعاملة</li>
                <li>تأكد أن مجموع جميع الأوزان يساوي 100% بالضبط</li>
                <li>عند اكتمال أي تاب في الشاشة 284، سيتم إضافة وزنه للنسبة الكلية</li>
                <li>يمكنك استخدام زر "توزيع متساوي" لتوزيع الأوزان بالتساوي على جميع التابات</li>
                <li>زر "إعادة تعيين" يعيد جميع الأوزان للقيم الافتراضية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionProgressCalculator;
