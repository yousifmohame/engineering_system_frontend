/**
 * الشاشة 900 - إدارة الملفات والمستندات
 * =====================================
 * 
 * نظام متكامل لإدارة وبحث الملفات والمستندات
 * - نظرة عامة مع أزرار بحث متعددة
 * - دعم RTL كامل مع خط Tajawal
 * - بطاقات تفاعلية ونوافذ منبثقة شاملة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Search, User, Home, FileText, Building, TrendingUp,
  File, Folder, Filter, Database, BarChart3, Hash,
  MapPin, Calendar, Activity
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import InputWithCopy from '../InputWithCopy';

const FilesDocumentsManagement_Complete_900: React.FC = () => {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('900-01');
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchType, setSearchType] = useState<'owner' | 'ownership' | 'license' | 'office-transaction' | 'entity-transaction'>('owner');

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '900-01', number: '900-01', title: 'نظرة عامة', icon: BarChart3 },
    { id: '900-02', number: '900-02', title: 'إدارة الملفات', icon: Folder },
    { id: '900-03', number: '900-03', title: 'البحث المتقدم', icon: Search },
    { id: '900-04', number: '900-04', title: 'الإعدادات', icon: Activity },
  ];

  // البيانات الإحصائية
  const stats = [
    { 
      label: 'إجمالي الملفات', 
      value: '2,547', 
      icon: File, 
      color: '#2563eb',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: '#93c5fd'
    },
    { 
      label: 'إجمالي المجلدات', 
      value: '342', 
      icon: Folder, 
      color: '#10b981',
      gradient: 'from-green-50 to-green-100',
      borderColor: '#6ee7b7'
    },
    { 
      label: 'المعاملات المرتبطة', 
      value: '1,823', 
      icon: FileText, 
      color: '#f59e0b',
      gradient: 'from-amber-50 to-amber-100',
      borderColor: '#fbbf24'
    },
    { 
      label: 'الملاك المسجلين', 
      value: '456', 
      icon: User, 
      color: '#8b5cf6',
      gradient: 'from-violet-50 to-violet-100',
      borderColor: '#c4b5fd'
    },
    { 
      label: 'العقارات', 
      value: '678', 
      icon: Building, 
      color: '#06b6d4',
      gradient: 'from-cyan-50 to-cyan-100',
      borderColor: '#67e8f9'
    },
    { 
      label: 'عمليات البحث اليوم', 
      value: '89', 
      icon: Search, 
      color: '#ec4899',
      gradient: 'from-pink-50 to-pink-100',
      borderColor: '#f9a8d4'
    },
  ];

  // أنواع البحث
  const searchButtons = [
    {
      type: 'owner' as const,
      label: 'بيانات المالك',
      icon: User,
      color: '#2563eb',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'البحث بالاسم، رقم الهوية، رقم الجوال'
    },
    {
      type: 'ownership' as const,
      label: 'بيانات الملكية',
      icon: Home,
      color: '#10b981',
      bgGradient: 'from-green-500 to-green-600',
      description: 'البحث برقم الصك، العنوان، الحي'
    },
    {
      type: 'license' as const,
      label: 'رقم الرخصة',
      icon: FileText,
      color: '#f59e0b',
      bgGradient: 'from-amber-500 to-amber-600',
      description: 'البحث برقم رخصة البناء'
    },
    {
      type: 'office-transaction' as const,
      label: 'رقم المعاملة لدى المكتب',
      icon: Hash,
      color: '#8b5cf6',
      bgGradient: 'from-violet-500 to-violet-600',
      description: 'البحث برقم المعاملة الداخلي'
    },
    {
      type: 'entity-transaction' as const,
      label: 'رقم المعاملة لدى الجهات',
      icon: Building,
      color: '#06b6d4',
      bgGradient: 'from-cyan-500 to-cyan-600',
      description: 'البحث برقم المعاملة الرسمي'
    },
  ];

  // فتح نافذة البحث
  const handleSearchClick = (type: typeof searchType) => {
    setSearchType(type);
    setShowSearchDialog(true);
  };

  // عرض التاب النشط
  const renderTabContent = () => {
    switch (activeTab) {
      case '900-01':
        return renderOverviewTab();
      case '900-02':
        return renderFilesManagementTab();
      case '900-03':
        return renderAdvancedSearchTab();
      case '900-04':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  // التاب 900-01: نظرة عامة
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        {stats.map((stat, index) => {
          // التحقق من وجود gradient وتحليل الألوان
          let bgFrom = '#f0f0f0'; // لون افتراضي
          let bgTo = '#e0e0e0';   // لون افتراضي
          if (stat.gradient && typeof stat.gradient === 'string') {
            const parts = stat.gradient.split(' ');
            if (parts.length >= 3) {
              bgFrom = parts[0].replace('from-', '#');
              bgTo = parts[2].replace('to-', '#');
            }
          }

          return (
            <Card
              key={index}
              className="card-element card-rtl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`,
                border: `2px solid ${stat.borderColor || '#ccc'}`
              } as React.CSSProperties}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      {stat.label}
                    </p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 opacity-70" style={{ color: stat.color }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* أزرار البحث */}
      <Card className="card-element card-rtl">
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span>البحث السريع</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {searchButtons.map((btn) => (
              <Button
                key={btn.type}
                onClick={() => handleSearchClick(btn.type)}
                className="h-24 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${btn.color}, ${btn.color}dd)`,
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <btn.icon className="h-8 w-8 text-white" />
                <div className="text-center">
                  <span className="text-sm text-white" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    {btn.label}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="card-element card-rtl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              آخر العمليات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع ملف جديد</span>
                <Badge variant="outline" className="text-[10px]">منذ 5 دقائق</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث عن ملف</span>
                <Badge variant="outline" className="text-[10px]">منذ 12 دقيقة</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحديث ملف</span>
                <Badge variant="outline" className="text-[10px]">منذ 25 دقيقة</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الملفات الأكثر مشاهدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-violet-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة_2025_001.pdf</span>
                <Badge variant="outline" className="text-[10px]">156 مشاهدة</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-cyan-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخصة_بناء_345.pdf</span>
                <Badge variant="outline" className="text-[10px]">134 مشاهدة</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-pink-50 rounded">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>صك_ملكية_678.pdf</span>
                <Badge variant="outline" className="text-[10px]">98 مشاهدة</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تنبيهات النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <Activity className="h-4 w-4 text-amber-600" />
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>5 ملفات تحتاج تحديث</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مساحة التخزين 72%</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عمليات البحث +15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // التاب 900-02: إدارة الملفات
  const renderFilesManagementTab = () => (
    <div className="flex items-center justify-center h-96">
      <Card className="w-96">
        <CardContent className="pt-6 text-center">
          <Folder className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التبويب قيد التطوير
          </p>
          <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
            سيتم إضافة المحتوى قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 900-03: البحث المتقدم
  const renderAdvancedSearchTab = () => (
    <div className="flex items-center justify-center h-96">
      <Card className="w-96">
        <CardContent className="pt-6 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التبويب قيد التطوير
          </p>
          <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
            سيتم إضافة المحتوى قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 900-04: الإعدادات
  const renderSettingsTab = () => (
    <div className="flex items-center justify-center h-96">
      <Card className="w-96">
        <CardContent className="pt-6 text-center">
          <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            محتوى التبويب قيد التطوير
          </p>
          <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
            سيتم إضافة المحتوى قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // نافذة البحث
  const renderSearchDialog = () => {
    const currentSearch = searchButtons.find(b => b.type === searchType);
    
    return (
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader>
            <DialogTitle className="dialog-title flex items-center gap-3">
              {currentSearch && <currentSearch.icon className="h-6 w-6" style={{ color: currentSearch.color }} />}
              <span>البحث: {currentSearch?.label}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* شرح نوع البحث */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                {currentSearch?.description}
              </p>
            </div>

            {/* حقول البحث حسب النوع */}
            <div className="space-y-3">
              {searchType === 'owner' && (
                <>
                  <InputWithCopy
                    label="اسم المالك"
                    id="owner-name"
                    placeholder="أدخل اسم المالك"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الهوية"
                    id="owner-id"
                    placeholder="أدخل رقم الهوية"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال"
                    id="owner-mobile"
                    placeholder="أدخل رقم الجوال"
                    copyable={true}
                    clearable={true}
                  />
                </>
              )}

              {searchType === 'ownership' && (
                <>
                  <InputWithCopy
                    label="رقم الصك"
                    id="ownership-deed"
                    placeholder="أدخل رقم الصك"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="العنوان"
                    id="ownership-address"
                    placeholder="أدخل العنوان"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="الحي"
                    id="ownership-district"
                    placeholder="أدخل اسم الحي"
                    copyable={true}
                    clearable={true}
                  />
                </>
              )}

              {searchType === 'license' && (
                <InputWithCopy
                  label="رقم الرخصة"
                  id="license-number"
                  placeholder="أدخل رقم رخصة البناء"
                  copyable={true}
                  clearable={true}
                />
              )}

              {searchType === 'office-transaction' && (
                <InputWithCopy
                  label="رقم المعاملة لدى المكتب"
                  id="office-transaction-number"
                  placeholder="مثال: 2501001"
                  copyable={true}
                  clearable={true}
                />
              )}

              {searchType === 'entity-transaction' && (
                <>
                  <InputWithCopy
                    label="رقم المعاملة لدى الجهات"
                    id="entity-transaction-number"
                    placeholder="أدخل رقم المعاملة الرسمي"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم الجهة"
                    id="entity-name"
                    placeholder="مثال: أمانة الرياض"
                    copyable={true}
                    clearable={true}
                  />
                </>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1"
                style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  fontFamily: 'Tajawal, sans-serif'
                }}
              >
                <Search className="h-4 w-4 ml-2" />
                بحث
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSearchDialog(false)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div style={{ 
      fontFamily: 'Tajawal, sans-serif',
      minHeight: 'calc(100vh - 72px)',
      paddingTop: '0'
    }}>
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
              <Folder 
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
                  إدارة الملفات والمستندات
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
                    900
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
                نظام شامل للبحث وإدارة الملفات والمستندات
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
                {TABS_CONFIG.length} تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* سايد بار التابات */}
        <div
          style={{
            width: '220px',
            minWidth: '220px',
            height: 'calc(100vh - 140px)',
            position: 'sticky',
            top: '62px',
            right: 0,
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            borderLeft: '2px solid #f59e0b',
            borderRadius: '16px 0 0 16px',
            boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
            overflow: 'hidden'
          }}
        >
          <ScrollArea className="h-full">
            <div className="p-2 space-y-0.5">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white shadow-lg scale-[1.03] border-2 border-red-600'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? 700 : 600,
                    color: activeTab === tab.id ? '#dc2626' : '#1e3a8a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <tab.icon 
                    className="h-4 w-4" 
                    style={{ color: activeTab === tab.id ? '#dc2626' : '#1e40af' }}
                  />
                  <span className="flex-1">{tab.title}</span>
                  <Badge 
                    variant="outline" 
                    className="font-mono text-[10px]"
                    style={{ 
                      background: activeTab === tab.id ? '#fee2e2' : '#eff6ff',
                      borderColor: activeTab === tab.id ? '#dc2626' : '#1e40af',
                      color: activeTab === tab.id ? '#dc2626' : '#1e40af'
                    }}
                  >
                    {tab.number}
                  </Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* مساحة العمل */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingRight: '16px', paddingLeft: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة البحث */}
      {renderSearchDialog()}
    </div>
  );
};

export default FilesDocumentsManagement_Complete_900;