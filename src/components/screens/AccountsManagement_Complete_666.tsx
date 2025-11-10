import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Calculator, DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet,
  FileText, BarChart3, PieChart, Receipt, Package, Users,
  ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '666-01', number: '666-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '666-02', number: '666-02', title: 'دليل الحسابات', icon: FileText },
  { id: '666-03', number: '666-03', title: 'القيود اليومية', icon: Receipt },
  { id: '666-04', number: '666-04', title: 'الإيرادات', icon: TrendingUp },
  { id: '666-05', number: '666-05', title: 'المصروفات', icon: TrendingDown },
  { id: '666-06', number: '666-06', title: 'الأصول', icon: Package },
  { id: '666-07', number: '666-07', title: 'الخصوم', icon: CreditCard },
  { id: '666-08', number: '666-08', title: 'حقوق الملكية', icon: Wallet },
  { id: '666-09', number: '666-09', title: 'التقارير المالية', icon: PieChart },
  { id: '666-10', number: '666-10', title: 'الإعدادات', icon: Calculator },
];

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'أصل' | 'خصم' | 'إيراد' | 'مصروف' | 'حقوق ملكية';
  parentCode: string;
  level: number;
  balance: number;
  active: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: 'إيراد' | 'مصروف' | 'تحويل';
  amount: number;
  debitAccount: string;
  creditAccount: string;
  description: string;
  reference: string;
  status: 'مؤكد' | 'معلق' | 'ملغي';
}

const AccountsManagement_Complete_666: React.FC = () => {
  const [activeTab, setActiveTab] = useState('666-01');

  // بيانات وهمية للحسابات
  const accounts: Account[] = [
    { id: 'A001', code: '1000', name: 'الأصول', type: 'أصل', parentCode: '', level: 1, balance: 5000000, active: true },
    { id: 'A002', code: '1100', name: 'الأصول المتداولة', type: 'أصل', parentCode: '1000', level: 2, balance: 3500000, active: true },
    { id: 'A003', code: '1110', name: 'النقدية والبنوك', type: 'أصل', parentCode: '1100', level: 3, balance: 2000000, active: true },
    { id: 'A004', code: '1120', name: 'العملاء', type: 'أصل', parentCode: '1100', level: 3, balance: 1500000, active: true },
    { id: 'A005', code: '1200', name: 'الأصول الثابتة', type: 'أصل', parentCode: '1000', level: 2, balance: 1500000, active: true },
    { id: 'A006', code: '1210', name: 'المباني', type: 'أصل', parentCode: '1200', level: 3, balance: 800000, active: true },
    { id: 'A007', code: '1220', name: 'المعدات', type: 'أصل', parentCode: '1200', level: 3, balance: 700000, active: true },
    
    { id: 'L001', code: '2000', name: 'الخصوم', type: 'خصم', parentCode: '', level: 1, balance: 2000000, active: true },
    { id: 'L002', code: '2100', name: 'الخصوم المتداولة', type: 'خصم', parentCode: '2000', level: 2, balance: 1200000, active: true },
    { id: 'L003', code: '2110', name: 'الموردون', type: 'خصم', parentCode: '2100', level: 3, balance: 800000, active: true },
    { id: 'L004', code: '2120', name: 'مصروفات مستحقة', type: 'خصم', parentCode: '2100', level: 3, balance: 400000, active: true },
    
    { id: 'E001', code: '3000', name: 'حقوق الملكية', type: 'حقوق ملكية', parentCode: '', level: 1, balance: 3000000, active: true },
    { id: 'E002', code: '3100', name: 'رأس المال', type: 'حقوق ملكية', parentCode: '3000', level: 2, balance: 2500000, active: true },
    { id: 'E003', code: '3200', name: 'الأرباح المحتجزة', type: 'حقوق ملكية', parentCode: '3000', level: 2, balance: 500000, active: true },
    
    { id: 'R001', code: '4000', name: 'الإيرادات', type: 'إيراد', parentCode: '', level: 1, balance: 4500000, active: true },
    { id: 'R002', code: '4100', name: 'إيرادات الخدمات', type: 'إيراد', parentCode: '4000', level: 2, balance: 3500000, active: true },
    { id: 'R003', code: '4200', name: 'إيرادات أخرى', type: 'إيراد', parentCode: '4000', level: 2, balance: 1000000, active: true },
    
    { id: 'X001', code: '5000', name: 'المصروفات', type: 'مصروف', parentCode: '', level: 1, balance: 2500000, active: true },
    { id: 'X002', code: '5100', name: 'مصروفات التشغيل', type: 'مصروف', parentCode: '5000', level: 2, balance: 1500000, active: true },
    { id: 'X003', code: '5110', name: 'الرواتب', type: 'مصروف', parentCode: '5100', level: 3, balance: 800000, active: true },
    { id: 'X004', code: '5120', name: 'الإيجارات', type: 'مصروف', parentCode: '5100', level: 3, balance: 400000, active: true },
    { id: 'X005', code: '5130', name: 'المرافق', type: 'مصروف', parentCode: '5100', level: 3, balance: 300000, active: true },
    { id: 'X006', code: '5200', name: 'مصروفات إدارية', type: 'مصروف', parentCode: '5000', level: 2, balance: 1000000, active: true },
  ];

  // بيانات وهمية للقيود
  const transactions: Transaction[] = [
    {
      id: 'T001',
      date: '2025-11-01',
      type: 'إيراد',
      amount: 150000,
      debitAccount: '1110 - النقدية والبنوك',
      creditAccount: '4100 - إيرادات الخدمات',
      description: 'إيرادات خدمات استشارية - عميل ABC',
      reference: 'INV-2025-001',
      status: 'مؤكد'
    },
    {
      id: 'T002',
      date: '2025-11-02',
      type: 'مصروف',
      amount: 85000,
      debitAccount: '5110 - الرواتب',
      creditAccount: '1110 - النقدية والبنوك',
      description: 'رواتب شهر أكتوبر 2025',
      reference: 'SAL-2025-10',
      status: 'مؤكد'
    },
    {
      id: 'T003',
      date: '2025-11-03',
      type: 'مصروف',
      amount: 25000,
      debitAccount: '5120 - الإيجارات',
      creditAccount: '1110 - النقدية والبنوك',
      description: 'إيجار المكتب - نوفمبر 2025',
      reference: 'RENT-2025-11',
      status: 'مؤكد'
    },
    {
      id: 'T004',
      date: '2025-11-04',
      type: 'إيراد',
      amount: 200000,
      debitAccount: '1120 - العملاء',
      creditAccount: '4100 - إيرادات الخدمات',
      description: 'فاتورة خدمات تصميم - عميل XYZ',
      reference: 'INV-2025-002',
      status: 'معلق'
    },
    {
      id: 'T005',
      date: '2025-11-05',
      type: 'تحويل',
      amount: 50000,
      debitAccount: '1220 - المعدات',
      creditAccount: '1110 - النقدية والبنوك',
      description: 'شراء معدات مكتبية جديدة',
      reference: 'PUR-2025-001',
      status: 'مؤكد'
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'أصل': return '#10b981';
      case 'خصم': return '#ef4444';
      case 'إيراد': return '#2563eb';
      case 'مصروف': return '#f59e0b';
      case 'حقوق ملكية': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مؤكد': return '#10b981';
      case 'معلق': return '#f59e0b';
      case 'ملغي': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // حسابات إحصائية
  const totalAssets = accounts.filter(a => a.type === 'أصل' && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'خصم' && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accounts.filter(a => a.type === 'حقوق ملكية' && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === 'إيراد' && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.type === 'مصروف' && a.level === 1).reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  const renderTabContent = () => {
    switch (activeTab) {
      case '666-01':
        return (
          <div className="space-y-6">
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
                      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                      border: '2px solid rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    <Calculator 
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
                        الحسابات
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
                          666
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
                      نظام محاسبة شامل ودليل حسابات ومتابعة مالية
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

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Package className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(totalAssets / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الأصول
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CreditCard className="h-4 w-4 mx-auto text-red-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(totalLiabilities / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الخصوم
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Wallet className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(totalEquity / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    حقوق الملكية
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(totalRevenue / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الإيرادات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <TrendingDown className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(totalExpenses / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المصروفات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(netIncome / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    صافي الدخل
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <FileText className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {accounts.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الحسابات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Receipt className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {transactions.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    القيود
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* قائمة الميزانية */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قائمة المركز المالي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-green-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الأصول
                      </h4>
                      {accounts.filter(a => a.type === 'أصل' && a.level <= 2).map((account) => (
                        <div 
                          key={account.id}
                          className="flex justify-between items-center py-2 border-b text-sm"
                          style={{ 
                            paddingRight: `${(account.level - 1) * 16}px`,
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          <span className={account.level === 1 ? 'font-bold' : ''}>
                            {account.code} - {account.name}
                          </span>
                          <span className="font-mono">
                            {account.balance.toLocaleString()} ر.س
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>إجمالي الأصول</span>
                        <span className="font-mono">{totalAssets.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الخصوم
                      </h4>
                      {accounts.filter(a => a.type === 'خصم' && a.level <= 2).map((account) => (
                        <div 
                          key={account.id}
                          className="flex justify-between items-center py-2 border-b text-sm"
                          style={{ 
                            paddingRight: `${(account.level - 1) * 16}px`,
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          <span className={account.level === 1 ? 'font-bold' : ''}>
                            {account.code} - {account.name}
                          </span>
                          <span className="font-mono">
                            {account.balance.toLocaleString()} ر.س
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>إجمالي الخصوم</span>
                        <span className="font-mono">{totalLiabilities.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-purple-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حقوق الملكية
                      </h4>
                      {accounts.filter(a => a.type === 'حقوق ملكية' && a.level <= 2).map((account) => (
                        <div 
                          key={account.id}
                          className="flex justify-between items-center py-2 border-b text-sm"
                          style={{ 
                            paddingRight: `${(account.level - 1) * 16}px`,
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          <span className={account.level === 1 ? 'font-bold' : ''}>
                            {account.code} - {account.name}
                          </span>
                          <span className="font-mono">
                            {account.balance.toLocaleString()} ر.س
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>إجمالي حقوق الملكية</span>
                        <span className="font-mono">{totalEquity.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قائمة الدخل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-blue-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الإيرادات
                      </h4>
                      {accounts.filter(a => a.type === 'إيراد' && a.level <= 2).map((account) => (
                        <div 
                          key={account.id}
                          className="flex justify-between items-center py-2 border-b text-sm"
                          style={{ 
                            paddingRight: `${(account.level - 1) * 16}px`,
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          <span className={account.level === 1 ? 'font-bold' : ''}>
                            {account.code} - {account.name}
                          </span>
                          <span className="font-mono">
                            {account.balance.toLocaleString()} ر.س
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>إجمالي الإيرادات</span>
                        <span className="font-mono">{totalRevenue.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-orange-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المصروفات
                      </h4>
                      {accounts.filter(a => a.type === 'مصروف' && a.level <= 2).map((account) => (
                        <div 
                          key={account.id}
                          className="flex justify-between items-center py-2 border-b text-sm"
                          style={{ 
                            paddingRight: `${(account.level - 1) * 16}px`,
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          <span className={account.level === 1 ? 'font-bold' : ''}>
                            {account.code} - {account.name}
                          </span>
                          <span className="font-mono">
                            {account.balance.toLocaleString()} ر.س
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>إجمالي المصروفات</span>
                        <span className="font-mono">{totalExpenses.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <div className="border-t-2 pt-4">
                      <div className="flex justify-between items-center py-2 font-bold text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {netIncome >= 0 ? 'صافي الربح' : 'صافي الخسارة'}
                        </span>
                        <span className={`font-mono ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(netIncome).toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* آخر القيود */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر القيود المحاسبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2 text-sm">الرقم</th>
                        <th className="text-right p-2 text-sm">التاريخ</th>
                        <th className="text-right p-2 text-sm">النوع</th>
                        <th className="text-right p-2 text-sm">من حساب</th>
                        <th className="text-right p-2 text-sm">إلى حساب</th>
                        <th className="text-right p-2 text-sm">المبلغ</th>
                        <th className="text-right p-2 text-sm">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{transaction.id}</td>
                          <td className="p-2 text-sm">{transaction.date}</td>
                          <td className="p-2 text-sm">
                            <Badge variant="outline">{transaction.type}</Badge>
                          </td>
                          <td className="p-2 text-sm text-xs">{transaction.debitAccount}</td>
                          <td className="p-2 text-sm text-xs">{transaction.creditAccount}</td>
                          <td className="p-2 text-sm font-bold">
                            {transaction.amount.toLocaleString()} ر.س
                          </td>
                          <td className="p-2 text-sm">
                            <Badge style={{ backgroundColor: getStatusColor(transaction.status), color: 'white' }}>
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '666-02':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  دليل الحسابات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {accounts.map((account) => (
                    <div 
                      key={account.id}
                      className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
                      style={{ 
                        paddingRight: `${(account.level - 1) * 24 + 12}px`,
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-600">{account.code}</span>
                        <span className={account.level === 1 ? 'font-bold' : ''}>{account.name}</span>
                        <Badge 
                          style={{ 
                            backgroundColor: getTypeColor(account.type),
                            color: 'white',
                            fontSize: '10px'
                          }}
                        >
                          {account.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold">{account.balance.toLocaleString()} ر.س</span>
                        <EnhancedSwitch
                          id={`account-${account.id}`}
                          checked={account.active}
                          onCheckedChange={() => {}}
                          size="sm"
                          variant="success"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '666-03':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة قيد جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="التاريخ *"
                    id="date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع القيد *"
                    id="entry-type"
                    options={[
                      { value: 'revenue', label: 'إيراد' },
                      { value: 'expense', label: 'مصروف' },
                      { value: 'transfer', label: 'تحويل' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="من حساب (مدين) *"
                    id="debit-account"
                    options={accounts.map(a => ({ value: a.code, label: `${a.code} - ${a.name}` }))}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="إلى حساب (دائن) *"
                    id="credit-account"
                    options={accounts.map(a => ({ value: a.code, label: `${a.code} - ${a.name}` }))}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="المبلغ (ر.س) *"
                    id="amount"
                    type="number"
                    placeholder="10000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم المرجع"
                    id="reference"
                    placeholder="INV-2025-001"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="الوصف *"
                      id="description"
                      rows={3}
                      placeholder="وصف تفصيلي للقيد..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#2563eb' }}>
                    حفظ القيد
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل القيود ({transactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{transaction.id}</span>
                            <span className="text-gray-500 text-sm">{transaction.date}</span>
                            <Badge variant="outline">{transaction.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                        </div>
                        <div className="text-left">
                          <Badge style={{ backgroundColor: getStatusColor(transaction.status), color: 'white' }}>
                            {transaction.status}
                          </Badge>
                          <p className="font-bold text-lg mt-1">{transaction.amount.toLocaleString()} ر.س</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">من حساب (مدين)</p>
                          <p className="text-xs">{transaction.debitAccount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">إلى حساب (دائن)</p>
                          <p className="text-xs">{transaction.creditAccount}</p>
                        </div>
                      </div>
                      {transaction.reference && (
                        <div className="mt-2 text-xs text-gray-500">
                          المرجع: {transaction.reference}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '666-04':
      case '666-05':
      case '666-06':
      case '666-07':
      case '666-08':
      case '666-09':
      case '666-10':
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذا التاب قيد التطوير
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <ScrollArea className="h-full">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AccountsManagement_Complete_666;
