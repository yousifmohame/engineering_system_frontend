import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { getScreenNumber } from '../ScreensConfig';
import { 
  Bell, 
  Settings, 
  Volume2, 
  Palette,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Save,
  RotateCcw,
  Play,
  Calendar,
  FileText,
  Code,
  Network
} from 'lucide-react';

// معرّف الشاشة الثابت - استخدم من ScreensConfig.tsx
const SCREEN_ID = 'notification-settings';

const NotificationSettingsScreen: React.FC = () => {
  // الحصول على رقم الشاشة الديناميكي
  const screenNumber = getScreenNumber(SCREEN_ID);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      enableNotifications: true,
      defaultDuration: 5,
      autoCloseEnabled: true,
      soundEnabled: true,
      vibrationEnabled: false,
      position: 'bottom-right' as const
    },
    variants: {
      info: {
        enabled: true,
        color: '#2563eb',
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
        showIcon: true,
        showTimestamp: true
      },
      success: {
        enabled: true,
        color: '#10b981',
        borderColor: '#34d399',
        backgroundColor: '#ecfdf5',
        showIcon: true,
        showTimestamp: true
      },
      warning: {
        enabled: true,
        color: '#f59e0b',
        borderColor: '#fbbf24',
        backgroundColor: '#fffbeb',
        showIcon: true,
        showTimestamp: true
      },
      error: {
        enabled: true,
        color: '#ef4444',
        borderColor: '#f87171',
        backgroundColor: '#fef2f2',
        showIcon: true,
        showTimestamp: true
      }
    },
    typography: {
      fontFamily: 'Tajawal',
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 1.4
    }
  });

  const [isTestMode, setIsTestMode] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم حفظ إعدادات الإشعارات بنجاح');
    } catch (error) {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟')) {
      window.location.reload();
    }
  };

  const handleTestNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const messages = {
      info: 'هذا إشعار تجريبي للمعلومات',
      success: 'تم إكمال العملية بنجاح!',
      warning: 'تحذير: يرجى الانتباه للإعدادات',
      error: 'حدث خطأ في النظام - اختبار'
    };
    alert(`إرسال إشعار اختبار: ${messages[type]}`);
  };

  const renderNotificationPreview = (type: 'info' | 'success' | 'warning' | 'error') => {
    const variant = settings.variants[type];
    const icon = {
      info: <Info className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      error: <AlertTriangle className="h-4 w-4" />
    }[type];

    return (
      <div 
        className="p-3 rounded-lg border-r-4 shadow-sm"
        style={{
          backgroundColor: variant.backgroundColor,
          borderRightColor: variant.borderColor,
          fontFamily: settings.typography.fontFamily + ', sans-serif',
          fontSize: settings.typography.fontSize + 'px',
          lineHeight: settings.typography.lineHeight
        }}
      >
        <div className="flex items-center gap-2" dir="rtl">
          {variant.showIcon && (
            <div style={{ color: variant.color }}>
              {icon}
            </div>
          )}
          <span style={{ color: variant.color, fontWeight: settings.typography.fontWeight }}>
            معاينة إشعار {type === 'info' ? 'المعلومات' : 
                           type === 'success' ? 'النجاح' :
                           type === 'warning' ? 'التحذير' : 'الخطأ'}
          </span>
          {variant.showTimestamp && (
            <span className="text-xs opacity-60 mr-auto">
              منذ دقيقتين
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                إعدادات الإشعارات المتقدمة
              </h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تخصيص وإدارة نظام الإشعارات والتنبيهات في النظام
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isTestMode ? "default" : "outline"}
              className={isTestMode ? "bg-orange-100 text-orange-700 border-orange-200" : ""}
            >
              {isTestMode ? "وضع الاختبار نشط" : `SCR-${screenNumber}`}
            </Badge>
          </div>
        </div>
      </div>

      {/* محتوى الشاشة مع السايد بار الرأسي */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="screen-with-vertical-tabs-layout">
            {/* السايد بار الرأسي للتابات */}
            <div className="vertical-tabs-sidebar">
              {/* هيدر السايد بار */}
              <div className="vertical-tabs-sidebar-header">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      إعدادات الإشعارات
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      شاشة {screenNumber} - 6 تابات
                    </p>
                  </div>
                </div>
              </div>

              {/* قائمة التابات - النمط المُكثف */}
              <div className="vertical-tabs-sidebar-body">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`vertical-tab-item-condensed ${activeTab === 'general' ? 'active' : ''}`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">الإعدادات العامة</span>
                  <span className="vertical-tab-number-condensed">782-01</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`vertical-tab-item-condensed ${activeTab === 'appearance' ? 'active' : ''}`}
                >
                  <Palette className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">المظهر والألوان</span>
                  <span className="vertical-tab-number-condensed">782-02</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('typography')}
                  className={`vertical-tab-item-condensed ${activeTab === 'typography' ? 'active' : ''}`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">الخطوط والنصوص</span>
                  <span className="vertical-tab-number-condensed">782-03</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('triggers')}
                  className={`vertical-tab-item-condensed ${activeTab === 'triggers' ? 'active' : ''}`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">مُحركات الإشعار</span>
                  <span className="vertical-tab-number-condensed">782-04</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('channels')}
                  className={`vertical-tab-item-condensed ${activeTab === 'channels' ? 'active' : ''}`}
                >
                  <Network className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">قنوات التوصيل</span>
                  <span className="vertical-tab-number-condensed">782-05</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('scheduling')}
                  className={`vertical-tab-item-condensed ${activeTab === 'scheduling' ? 'active' : ''}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">الجدولة والتوقيت</span>
                  <span className="vertical-tab-number-condensed">782-06</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('testing')}
                  className={`vertical-tab-item-condensed ${activeTab === 'testing' ? 'active' : ''}`}
                >
                  <Play className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">الاختبار والمعاينة</span>
                  <span className="vertical-tab-number-condensed">782-07</span>
                </button>
                
                <div className="vertical-tab-separator-condensed" />

                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`vertical-tab-item-condensed ${activeTab === 'advanced' ? 'active' : ''}`}
                >
                  <Code className="w-4 h-4" />
                  <span className="vertical-tab-title-condensed">الإعدادات المتقدمة</span>
                  <span className="vertical-tab-number-condensed">782-08</span>
                </button>
              </div>

              {/* فوتر السايد بار */}
              <div className="vertical-tabs-sidebar-footer">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التاب النشط
                  </span>
                  <span className="flex items-center gap-1 text-green-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    متصل
                  </span>
                </div>
              </div>
            </div>

            {/* مساحة المحتوى الرئيسي */}
            <div className="vertical-tabs-content-area">
              {/* هيدر المحتوى */}
              <div className="vertical-tabs-content-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {activeTab === 'general' && 'الإعدادات العامة'}
                      {activeTab === 'appearance' && 'المظهر والألوان'}
                      {activeTab === 'typography' && 'الخطوط والنصوص'}
                      {activeTab === 'triggers' && 'مُحركات الإشعار'}
                      {activeTab === 'channels' && 'قنوات التوصيل'}
                      {activeTab === 'scheduling' && 'الجدولة والتوقيت'}
                      {activeTab === 'testing' && 'الاختبار والمعاينة'}
                      {activeTab === 'advanced' && 'الإعدادات المتقدمة'}
                    </h1>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إدارة وتخصيص إعدادات الإشعارات
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="dense-btn dense-btn-secondary" onClick={handleRestoreDefaults}>
                      <RotateCcw className="w-3 h-3" />
                      إعادة تعيين
                    </Button>
                    <Button className="dense-btn dense-btn-primary" onClick={handleSaveSettings}>
                      <Save className="w-3 h-3" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </div>

              {/* جسم المحتوى - يحمل محتوى التاب النشط */}
              <div className="vertical-tabs-content-body">
                {/* التاب 1: الإعدادات العامة */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإعدادات العامة للإشعارات
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تفعيل الإشعارات
                            </Label>
                            <p className="text-xs text-gray-500">
                              تشغيل أو إيقاف نظام الإشعارات بالكامل
                            </p>
                          </div>
                          <Switch
                            checked={settings.general.enableNotifications}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({
                                ...prev,
                                general: { ...prev.general, enableNotifications: checked }
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label className="mb-3 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            مدة العرض الافتراضية: {settings.general.defaultDuration} ثانية
                          </Label>
                          <Slider
                            value={[settings.general.defaultDuration]}
                            onValueChange={([value]) => 
                              setSettings(prev => ({
                                ...prev,
                                general: { ...prev.general, defaultDuration: value }
                              }))
                            }
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* التاب 2: المظهر والألوان */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(settings.variants).map(([type, variant]) => (
                        <Card key={type} className="card-element card-rtl">
                          <CardHeader>
                            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {type === 'info' && 'إشعارات المعلومات'}
                              {type === 'success' && 'إشعارات النجاح'}
                              {type === 'warning' && 'إشعارات التحذير'}
                              {type === 'error' && 'إشعارات الخطأ'}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderNotificationPreview(type as any)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* باقي التابات - محتوى placeholder */}
                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>الخطوط والنصوص</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>محتوى تاب الخطوط والنصوص</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'triggers' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>مُحركات الإشعار</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>محتوى تاب مُحركات الإشعار</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'channels' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>قنوات التوصيل</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>محتوى تاب قنوات التوصيل</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'scheduling' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>الجدولة والتوقيت</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>محتوى تاب الجدولة والتوقيت</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'testing' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>الاختبار والمعاينة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={() => handleTestNotification('info')}>
                            <Info className="h-4 w-4" />
                            اختبار المعلومات
                          </Button>
                          <Button onClick={() => handleTestNotification('success')}>
                            <CheckCircle className="h-4 w-4" />
                            اختبار النجاح
                          </Button>
                          <Button onClick={() => handleTestNotification('warning')}>
                            <AlertTriangle className="h-4 w-4" />
                            اختبار التحذير
                          </Button>
                          <Button onClick={() => handleTestNotification('error')}>
                            <AlertTriangle className="h-4 w-4" />
                            اختبار الخطأ
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <Card className="card-element card-rtl">
                      <CardHeader>
                        <CardTitle>الإعدادات المتقدمة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>محتوى تاب الإعدادات المتقدمة</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsScreen;
