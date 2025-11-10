/**
 * مدير إعدادات الهيدر v8.2
 * ========================================
 * نظام شامل لإدارة إعدادات الهيدر بشكل ديناميكي
 * يتيح إظهار/إخفاء وتعديل جميع عناصر الهيدر
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { EnhancedSwitch } from './EnhancedSwitch';
import { InputWithCopy } from './InputWithCopy';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  Settings, Eye, EyeOff, Save, RotateCcw, Upload, Image,
  Building2, Tag, Hash, Calendar, User, Clock, Users,
  Monitor, Database, Wifi, LogIn, CheckCircle, AlertCircle
} from 'lucide-react';

// واجهة إعدادات الهيدر
export interface HeaderSettings {
  // معلومات المكتب والنظام
  officeName: {
    enabled: boolean;
    value: string;
  };
  logo: {
    enabled: boolean;
    value: string;
  };
  systemName: {
    enabled: boolean;
    value: string;
  };
  systemVersion: {
    enabled: boolean;
    value: string;
  };
  
  // التاريخ والوقت
  hijriDate: {
    enabled: boolean;
  };
  gregorianDate: {
    enabled: boolean;
  };
  currentTime: {
    enabled: boolean;
    showSeconds: boolean;
  };
  
  // معلومات المستخدم
  userInfo: {
    enabled: boolean;
    showJobTitle: boolean;
    showFullName: boolean;
    showLastLogin: boolean;
  };
  
  // عداد الجلسة
  sessionCounter: {
    enabled: boolean;
    showSeconds: boolean;
  };
  
  // المستخدمين المتصلين
  onlineUsers: {
    enabled: boolean;
    showDetails: boolean;
  };
  
  // عناصر إضافية
  notifications: {
    enabled: boolean;
    showCount: boolean;
  };
  quickSearch: {
    enabled: boolean;
  };
  systemMenu: {
    enabled: boolean;
  };
}

// الإعدادات الافتراضية
const DEFAULT_SETTINGS: HeaderSettings = {
  officeName: { enabled: true, value: 'مكتب الهندسة المتكامل' },
  logo: { enabled: true, value: '/logo.png' },
  systemName: { enabled: true, value: 'نظام إدارة شامل' },
  systemVersion: { enabled: true, value: 'v8.2' },
  hijriDate: { enabled: true },
  gregorianDate: { enabled: true },
  currentTime: { enabled: true, showSeconds: false },
  userInfo: { enabled: true, showJobTitle: true, showFullName: true, showLastLogin: true },
  sessionCounter: { enabled: true, showSeconds: false },
  onlineUsers: { enabled: true, showDetails: true },
  notifications: { enabled: true, showCount: true },
  quickSearch: { enabled: true },
  systemMenu: { enabled: true }
};

interface HeaderSettingsManagerProps {
  onSettingsChange?: (settings: HeaderSettings) => void;
}

const HeaderSettingsManager: React.FC<HeaderSettingsManagerProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<HeaderSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // تحميل الإعدادات من localStorage عند البداية
  useEffect(() => {
    const savedSettings = localStorage.getItem('headerSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onSettingsChange?.(parsed);
      } catch (e) {
        console.error('Error loading header settings:', e);
      }
    }
  }, []);

  // حفظ الإعدادات
  const handleSave = () => {
    try {
      localStorage.setItem('headerSettings', JSON.stringify(settings));
      setHasChanges(false);
      onSettingsChange?.(settings);
      alert('تم حفظ إعدادات الهيدر بنجاح');
    } catch (e) {
      console.error('Error saving header settings:', e);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  // إعادة تعيين الإعدادات
  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      setSettings(DEFAULT_SETTINGS);
      setHasChanges(true);
    }
  };

  // تحديث الإعداد
  const updateSetting = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      setHasChanges(true);
      return newSettings;
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
              border: '2px solid rgba(37, 99, 235, 0.2)'
            }}
          >
            <Settings className="h-6 w-6" style={{ color: '#2563eb' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1e40af' }}>
              إعدادات الهيدر المتقدمة
            </h2>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#64748b' }}>
              تخصيص كامل لعناصر الهيدر وإعداداته
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              <AlertCircle className="h-3 w-3 ml-1" />
              تغييرات غير محفوظة
            </Badge>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <RotateCcw className="h-4 w-4 ml-1" />
            إعادة تعيين
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={!hasChanges}
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            <Save className="h-4 w-4 ml-1" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-6 pr-4">
          {/* القسم 1: معلومات المكتب والنظام */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Building2 className="h-5 w-5 text-blue-600" />
                معلومات المكتب والنظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اسم المكتب */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    اسم المكتب
                  </Label>
                  <EnhancedSwitch
                    id="officeName-enabled"
                    checked={settings.officeName.enabled}
                    onCheckedChange={(checked) => updateSetting(['officeName', 'enabled'], checked)}
                    size="sm"
                  />
                </div>
                {settings.officeName.enabled && (
                  <InputWithCopy
                    id="officeName-value"
                    value={settings.officeName.value}
                    onChange={(e) => updateSetting(['officeName', 'value'], e.target.value)}
                    placeholder="اسم المكتب"
                    copyable={true}
                    clearable={true}
                  />
                )}
              </div>

              <Separator />

              {/* الشعار */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    شعار المكتب
                  </Label>
                  <EnhancedSwitch
                    id="logo-enabled"
                    checked={settings.logo.enabled}
                    onCheckedChange={(checked) => updateSetting(['logo', 'enabled'], checked)}
                    size="sm"
                  />
                </div>
                {settings.logo.enabled && (
                  <div className="space-y-2">
                    <InputWithCopy
                      id="logo-value"
                      value={settings.logo.value}
                      onChange={(e) => updateSetting(['logo', 'value'], e.target.value)}
                      placeholder="رابط الشعار"
                      copyable={true}
                      clearable={true}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <Upload className="h-4 w-4 ml-1" />
                      رفع شعار جديد
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* اسم النظام */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    اسم النظام
                  </Label>
                  <EnhancedSwitch
                    id="systemName-enabled"
                    checked={settings.systemName.enabled}
                    onCheckedChange={(checked) => updateSetting(['systemName', 'enabled'], checked)}
                    size="sm"
                  />
                </div>
                {settings.systemName.enabled && (
                  <InputWithCopy
                    id="systemName-value"
                    value={settings.systemName.value}
                    onChange={(e) => updateSetting(['systemName', 'value'], e.target.value)}
                    placeholder="اسم النظام"
                    copyable={true}
                    clearable={true}
                  />
                )}
              </div>

              <Separator />

              {/* رقم الإصدار */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    رقم الإصدار
                  </Label>
                  <EnhancedSwitch
                    id="systemVersion-enabled"
                    checked={settings.systemVersion.enabled}
                    onCheckedChange={(checked) => updateSetting(['systemVersion', 'enabled'], checked)}
                    size="sm"
                  />
                </div>
                {settings.systemVersion.enabled && (
                  <InputWithCopy
                    id="systemVersion-value"
                    value={settings.systemVersion.value}
                    onChange={(e) => updateSetting(['systemVersion', 'value'], e.target.value)}
                    placeholder="رقم الإصدار"
                    copyable={true}
                    clearable={true}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* القسم 2: التاريخ والوقت */}
          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Calendar className="h-5 w-5 text-green-600" />
                إعدادات التاريخ والوقت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* التاريخ الهجري */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    التاريخ الهجري
                  </Label>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>
                    عرض التاريخ الهجري في الهيدر
                  </p>
                </div>
                <EnhancedSwitch
                  id="hijriDate-enabled"
                  checked={settings.hijriDate.enabled}
                  onCheckedChange={(checked) => updateSetting(['hijriDate', 'enabled'], checked)}
                  size="sm"
                  variant="success"
                />
              </div>

              {/* التاريخ الميلادي */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    التاريخ الميلادي
                  </Label>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>
                    عرض التاريخ الميلادي في الهيدر
                  </p>
                </div>
                <EnhancedSwitch
                  id="gregorianDate-enabled"
                  checked={settings.gregorianDate.enabled}
                  onCheckedChange={(checked) => updateSetting(['gregorianDate', 'enabled'], checked)}
                  size="sm"
                  variant="success"
                />
              </div>

              {/* الوقت الحالي */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    الوقت الحالي
                  </Label>
                  <EnhancedSwitch
                    id="currentTime-enabled"
                    checked={settings.currentTime.enabled}
                    onCheckedChange={(checked) => updateSetting(['currentTime', 'enabled'], checked)}
                    size="sm"
                    variant="success"
                  />
                </div>
                {settings.currentTime.enabled && (
                  <div className="flex items-center justify-between pr-4">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      عرض الثواني
                    </Label>
                    <EnhancedSwitch
                      id="currentTime-showSeconds"
                      checked={settings.currentTime.showSeconds}
                      onCheckedChange={(checked) => updateSetting(['currentTime', 'showSeconds'], checked)}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* القسم 3: معلومات المستخدم */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <User className="h-5 w-5 text-purple-600" />
                معلومات المستخدم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    عرض معلومات المستخدم
                  </Label>
                  <EnhancedSwitch
                    id="userInfo-enabled"
                    checked={settings.userInfo.enabled}
                    onCheckedChange={(checked) => updateSetting(['userInfo', 'enabled'], checked)}
                    size="sm"
                    variant="default"
                  />
                </div>
                {settings.userInfo.enabled && (
                  <div className="space-y-2 pr-4">
                    <div className="flex items-center justify-between">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                        المسمى الوظيفي
                      </Label>
                      <EnhancedSwitch
                        id="userInfo-showJobTitle"
                        checked={settings.userInfo.showJobTitle}
                        onCheckedChange={(checked) => updateSetting(['userInfo', 'showJobTitle'], checked)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                        الاسم الكامل
                      </Label>
                      <EnhancedSwitch
                        id="userInfo-showFullName"
                        checked={settings.userInfo.showFullName}
                        onCheckedChange={(checked) => updateSetting(['userInfo', 'showFullName'], checked)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                        آخر تسجيل دخول
                      </Label>
                      <EnhancedSwitch
                        id="userInfo-showLastLogin"
                        checked={settings.userInfo.showLastLogin}
                        onCheckedChange={(checked) => updateSetting(['userInfo', 'showLastLogin'], checked)}
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* القسم 4: عداد الجلسة */}
          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Clock className="h-5 w-5 text-orange-600" />
                عداد الجلسة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      عرض عداد الجلسة
                    </Label>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>
                      عداد مدة الجلسة الحالية
                    </p>
                  </div>
                  <EnhancedSwitch
                    id="sessionCounter-enabled"
                    checked={settings.sessionCounter.enabled}
                    onCheckedChange={(checked) => updateSetting(['sessionCounter', 'enabled'], checked)}
                    size="sm"
                    variant="warning"
                  />
                </div>
                {settings.sessionCounter.enabled && (
                  <div className="flex items-center justify-between pr-4">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      عرض الثواني
                    </Label>
                    <EnhancedSwitch
                      id="sessionCounter-showSeconds"
                      checked={settings.sessionCounter.showSeconds}
                      onCheckedChange={(checked) => updateSetting(['sessionCounter', 'showSeconds'], checked)}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* القسم 5: المستخدمين المتصلين */}
          <Card className="border-2 border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Users className="h-5 w-5 text-cyan-600" />
                المستخدمين المتصلين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      عرض المستخدمين المتصلين
                    </Label>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>
                      عرض عدد وتفاصيل المستخدمين المتصلين حالياً
                    </p>
                  </div>
                  <EnhancedSwitch
                    id="onlineUsers-enabled"
                    checked={settings.onlineUsers.enabled}
                    onCheckedChange={(checked) => updateSetting(['onlineUsers', 'enabled'], checked)}
                    size="sm"
                    variant="success"
                  />
                </div>
                {settings.onlineUsers.enabled && (
                  <div className="flex items-center justify-between pr-4">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      عرض التفاصيل عند الضغط
                    </Label>
                    <EnhancedSwitch
                      id="onlineUsers-showDetails"
                      checked={settings.onlineUsers.showDetails}
                      onCheckedChange={(checked) => updateSetting(['onlineUsers', 'showDetails'], checked)}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* القسم 6: عناصر إضافية */}
          <Card className="border-2 border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Monitor className="h-5 w-5 text-indigo-600" />
                عناصر إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* التنبيهات */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    التنبيهات
                  </Label>
                  <EnhancedSwitch
                    id="notifications-enabled"
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) => updateSetting(['notifications', 'enabled'], checked)}
                    size="sm"
                  />
                </div>
                {settings.notifications.enabled && (
                  <div className="flex items-center justify-between pr-4">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      عرض العدد
                    </Label>
                    <EnhancedSwitch
                      id="notifications-showCount"
                      checked={settings.notifications.showCount}
                      onCheckedChange={(checked) => updateSetting(['notifications', 'showCount'], checked)}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* البحث السريع */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  البحث السريع
                </Label>
                <EnhancedSwitch
                  id="quickSearch-enabled"
                  checked={settings.quickSearch.enabled}
                  onCheckedChange={(checked) => updateSetting(['quickSearch', 'enabled'], checked)}
                  size="sm"
                />
              </div>

              {/* قائمة النظام */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  قائمة النظام
                </Label>
                <EnhancedSwitch
                  id="systemMenu-enabled"
                  checked={settings.systemMenu.enabled}
                  onCheckedChange={(checked) => updateSetting(['systemMenu', 'enabled'], checked)}
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* معاينة الهيدر */}
          <Card className="border-2 border-gray-300 bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                <Eye className="h-5 w-5 text-gray-600" />
                معاينة التغييرات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  <CheckCircle className="h-5 w-5 inline-block ml-2 text-green-600" />
                  سيتم تطبيق التغييرات فوراً بعد حفظها
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HeaderSettingsManager;
export { DEFAULT_SETTINGS };
export type { HeaderSettings };
