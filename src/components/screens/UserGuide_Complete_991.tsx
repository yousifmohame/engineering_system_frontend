import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  Search,
  ChevronRight,
  Play,
  Download,
  Star,
  MessageSquare,
  Users,
  Settings,
  Shield,
  Layout,
  MousePointer,
  Keyboard,
  Smartphone,
  Monitor,
  Printer,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Zap,
  Award,
  Eye
} from 'lucide-react';

/**
 * شاشة دليل المستخدم - رقم 991
 * دليل شامل وتفاعلي لاستخدام النظام
 * يتضمن: دروس، فيديوهات، أسئلة شائعة، نصائح، اختصارات
 */

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function UserGuide_Complete_991() {
  const [activeTab, setActiveTab] = useState('991-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // أقسام الدليل
  const guideSections: GuideSection[] = [
    {
      id: 'basics',
      title: 'البدء مع النظام',
      description: 'تعلم الأساسيات الضرورية للعمل',
      icon: <BookOpen className="w-5 h-5" />,
      level: 'مبتدئ'
    },
    {
      id: 'navigation',
      title: 'التنقل بين الشاشات',
      description: 'كيفية التنقل واستخدام القوائم',
      icon: <MousePointer className="w-5 h-5" />,
      level: 'مبتدئ'
    },
    {
      id: 'permissions',
      title: 'الصلاحيات والأدوار',
      description: 'فهم نظام الصلاحيات',
      icon: <Shield className="w-5 h-5" />,
      level: 'متوسط'
    },
    {
      id: 'transactions',
      title: 'إدارة المعاملات',
      description: 'إنشاء ومتابعة المعاملات',
      icon: <FileText className="w-5 h-5" />,
      level: 'متوسط'
    },
    {
      id: 'reports',
      title: 'التقارير والإحصائيات',
      description: 'استخراج وتحليل التقارير',
      icon: <Layout className="w-5 h-5" />,
      level: 'متقدم'
    },
    {
      id: 'settings',
      title: 'الإعدادات المتقدمة',
      description: 'تخصيص النظام حسب احتياجاتك',
      icon: <Settings className="w-5 h-5" />,
      level: 'متقدم'
    }
  ];

  // الأسئلة الشائعة
  const faqs: FAQ[] = [
    {
      question: 'كيف أقوم بتسجيل الدخول للنظام؟',
      answer: 'يمكنك تسجيل الدخول باستخدام اسم المستخدم وكلمة المرور المقدمة من قبل المسؤول. بعد إدخال البيانات، اضغط على زر "دخول".',
      category: 'أساسيات'
    },
    {
      question: 'كيف أقوم بإنشاء معاملة جديدة؟',
      answer: 'انتقل إلى شاشة المعاملات (284)، ثم اضغط على زر "معاملة جديدة". املأ النموذج بالمعلومات المطلوبة واحفظ.',
      category: 'المعاملات'
    },
    {
      question: 'كيف أستطيع تغيير كلمة المرور الخاصة بي؟',
      answer: 'اذهب إلى "حسابي" من القائمة الرئيسية، ثم اختر "تغيير كلمة المرور". أدخل كلمة المرور القديمة والجديدة.',
      category: 'الحساب'
    },
    {
      question: 'هل يمكنني استخدام النظام على الهاتف المحمول؟',
      answer: 'نعم، النظام مصمم ليكون متجاوباً ويعمل بشكل ممتاز على جميع الأجهزة بما في ذلك الهواتف المحمولة والأجهزة اللوحية.',
      category: 'تقنية'
    },
    {
      question: 'كيف أقوم باستخراج تقرير؟',
      answer: 'انتقل إلى شاشة التقارير، اختر نوع التقرير المطلوب، حدد الفترة الزمنية والمعايير، ثم اضغط على "استخراج التقرير".',
      category: 'التقارير'
    },
    {
      question: 'ماذا أفعل إذا نسيت كلمة المرور؟',
      answer: 'اضغط على "نسيت كلمة المرور" في شاشة تسجيل الدخول. سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
      category: 'الحساب'
    }
  ];

  // اختصارات لوحة المفاتيح
  const keyboardShortcuts = [
    { key: 'Alt + H', action: 'فتح صفحة الرئيسية' },
    { key: 'Alt + ←', action: 'الرجوع للخلف' },
    { key: 'Alt + →', action: 'التقدم للأمام' },
    { key: 'Ctrl + S', action: 'حفظ' },
    { key: 'Ctrl + F', action: 'بحث' },
    { key: 'Ctrl + P', action: 'طباعة' },
    { key: 'Esc', action: 'إغلاق النافذة المنبثقة' },
    { key: 'F1', action: 'فتح المساعدة' }
  ];

  // نصائح سريعة
  const quickTips = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      title: 'استخدم البحث السريع',
      description: 'اضغط على Ctrl+F للبحث في أي مكان في النظام'
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: 'ضع إشارة مرجعية',
      description: 'يمكنك وضع إشارات مرجعية على الشاشات المهمة للوصول السريع'
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-blue-600" />,
      title: 'استفد من الاختصارات',
      description: 'تعلم اختصارات لوحة المفاتيح لتسريع عملك'
    },
    {
      icon: <Award className="w-5 h-5 text-green-600" />,
      title: 'اطلب الدعم الفني',
      description: 'فريق الدعم متاح 24/7 لمساعدتك'
    }
  ];

  // فيديوهات تعليمية
  const tutorials = [
    {
      title: 'مقدمة إلى النظام',
      duration: '5:30',
      level: 'مبتدئ',
      views: '1,234',
      thumbnail: '🎬'
    },
    {
      title: 'إنشاء معاملة جديدة',
      duration: '8:15',
      level: 'مبتدئ',
      views: '2,456',
      thumbnail: '📝'
    },
    {
      title: 'استخراج التقارير',
      duration: '12:00',
      level: 'متوسط',
      views: '987',
      thumbnail: '📊'
    },
    {
      title: 'إدارة الصلاحيات',
      duration: '15:45',
      level: 'متقدم',
      views: '654',
      thumbnail: '🔒'
    }
  ];

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              دليل المستخدم الشامل
            </h3>
            <Badge className="bg-teal-100 text-teal-700 border-teal-200" style={{ fontFamily: 'Courier New, monospace' }}>
              991
            </Badge>
          </div>
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تعلم كل شيء عن استخدام النظام
          </p>
        </div>

        <div className="vertical-tabs-sidebar-body">
          {[
            { id: '991-01', title: 'نظرة عامة', icon: <Layout className="w-4 h-4" /> },
            { id: '991-02', title: 'دروس تعليمية', icon: <BookOpen className="w-4 h-4" /> },
            { id: '991-03', title: 'فيديوهات تعليمية', icon: <Video className="w-4 h-4" /> },
            { id: '991-04', title: 'الأسئلة الشائعة', icon: <HelpCircle className="w-4 h-4" /> },
            { id: '991-05', title: 'اختصارات المفاتيح', icon: <Keyboard className="w-4 h-4" /> },
            { id: '991-06', title: 'نصائح سريعة', icon: <Lightbulb className="w-4 h-4" /> },
            { id: '991-07', title: 'الدعم الفني', icon: <MessageSquare className="w-4 h-4" /> },
            { id: '991-08', title: 'تحديثات النظام', icon: <Info className="w-4 h-4" /> },
            { id: '991-09', title: 'الموارد والتنزيلات', icon: <Download className="w-4 h-4" /> },
            { id: '991-10', title: 'اتصل بنا', icon: <Phone className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="vertical-tab-icon">{tab.icon}</div>
              <div className="vertical-tab-content">
                <div className="vertical-tab-title">{tab.title}</div>
              </div>
              <div className="vertical-tab-number">{tab.id}</div>
            </button>
          ))}
        </div>

        <div className="vertical-tabs-sidebar-footer">
          <div className="text-xs text-center text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="font-bold mb-1">دليل شامل - 10 أقسام</div>
            <div className="text-xs opacity-75">آخر تحديث: 29/09/2025</div>
          </div>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '991-01' && 'نظرة عامة على الدليل'}
                {activeTab === '991-02' && 'الدروس التعليمية'}
                {activeTab === '991-03' && 'الفيديوهات التعليمية'}
                {activeTab === '991-04' && 'الأسئلة الشائعة'}
                {activeTab === '991-05' && 'اختصارات لوحة المفاتيح'}
                {activeTab === '991-06' && 'نصائح وحيل سريعة'}
                {activeTab === '991-07' && 'الدعم الفني'}
                {activeTab === '991-08' && 'تحديثات النظام'}
                {activeTab === '991-09' && 'الموارد والتنزيلات'}
                {activeTab === '991-10' && 'اتصل بنا'}
              </h2>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '991-01' && 'دليلك الكامل لاستخدام النظام بفعالية'}
                {activeTab === '991-02' && 'دروس مفصلة خطوة بخطوة'}
                {activeTab === '991-03' && 'شاهد وتعلم من الفيديوهات'}
                {activeTab === '991-04' && 'إجابات للأسئلة الأكثر شيوعاً'}
                {activeTab === '991-05' && 'اختصارات لتسريع عملك'}
                {activeTab === '991-06' && 'نصائح من الخبراء'}
                {activeTab === '991-07' && 'تواصل مع فريق الدعم'}
                {activeTab === '991-08' && 'آخر التحديثات والميزات'}
                {activeTab === '991-09' && 'ملفات مساعدة وأدلة للتنزيل'}
                {activeTab === '991-10' && 'قنوات الاتصال المتاحة'}
              </p>
            </div>
            <Badge className="bg-teal-100 text-teal-700 border-teal-200" style={{ fontFamily: 'Courier New, monospace' }}>
              {activeTab}
            </Badge>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {/* تاب نظرة عامة - 991-01 */}
          {activeTab === '991-01' && (
            <div className="space-y-4">
              {/* بطاقة الترحيب */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">مرحباً بك في دليل المستخدم!</h3>
                      <p className="text-sm text-gray-700">
                        هذا الدليل الشامل سيساعدك على فهم واستخدام جميع ميزات النظام بكفاءة.
                        استكشف الأقسام المختلفة للحصول على أقصى استفادة من النظام.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أقسام الدليل */}
              <div className="dense-grid dense-grid-3">
                {guideSections.map((section, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          section.level === 'مبتدئ' ? 'bg-green-50 text-green-600' :
                          section.level === 'متوسط' ? 'bg-blue-50 text-blue-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {section.icon}
                        </div>
                        <Badge className={
                          section.level === 'مبتدئ' ? 'bg-green-100 text-green-700 border-green-200' :
                          section.level === 'متوسط' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-purple-100 text-purple-700 border-purple-200'
                        }>
                          {section.level}
                        </Badge>
                      </div>
                      <h4 className="font-bold mb-2">{section.title}</h4>
                      <p className="text-xs text-gray-600 mb-3">{section.description}</p>
                      <Button size="sm" variant="outline" className="w-full dense-btn">
                        ابدأ التعلم
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* إحصائيات الدليل */}
              <div className="dense-stats-grid">
                {[
                  { label: 'دروس تعليمية', value: '24', icon: <BookOpen className="w-5 h-5 text-blue-600" /> },
                  { label: 'فيديوهات', value: '18', icon: <Video className="w-5 h-5 text-red-600" /> },
                  { label: 'أسئلة شائعة', value: '45', icon: <HelpCircle className="w-5 h-5 text-green-600" /> },
                  { label: 'نصائح وحيل', value: '32', icon: <Lightbulb className="w-5 h-5 text-yellow-600" /> }
                ].map((stat, index) => (
                  <div key={index} className="dense-stat-card">
                    <div className="dense-stat-icon">{stat.icon}</div>
                    <div className="dense-stat-number">{stat.value}</div>
                    <div className="dense-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تاب الفيديوهات التعليمية - 991-03 */}
          {activeTab === '991-03' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>مكتبة الفيديوهات التعليمية</CardTitle>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      {tutorials.length} فيديو
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="dense-grid dense-grid-2">
                    {tutorials.map((video, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                        <div className="bg-gray-100 h-32 flex items-center justify-center text-6xl">
                          {video.thumbnail}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={
                              video.level === 'مبتدئ' ? 'bg-green-100 text-green-700 border-green-200 text-xs' :
                              video.level === 'متوسط' ? 'bg-blue-100 text-blue-700 border-blue-200 text-xs' :
                              'bg-purple-100 text-purple-700 border-purple-200 text-xs'
                            }>
                              {video.level}
                            </Badge>
                            <span className="text-xs text-gray-500 font-mono">{video.duration}</span>
                          </div>
                          <h4 className="font-bold mb-2 text-sm">{video.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              <Eye className="w-3 h-3 inline ml-1" />
                              {video.views} مشاهدة
                            </span>
                            <Button size="sm" className="dense-btn-primary">
                              <Play className="w-3 h-3" />
                              شاهد الآن
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* تاب الأسئلة الشائعة - 991-04 */}
          {activeTab === '991-04' && (
            <div className="space-y-4">
              {/* شريط البحث */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="ابحث في الأسئلة الشائعة..."
                      className="dense-form-input pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* قائمة الأسئلة */}
              <Card>
                <CardHeader>
                  <CardTitle>الأسئلة الأكثر شيوعاً</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        >
                          <div className="flex items-center gap-3 text-right">
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-sm">{faq.question}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedFAQ === index ? 'rotate-90' : ''
                          }`} />
                        </button>
                        {expandedFAQ === index && (
                          <div className="p-4 bg-blue-50 border-t border-blue-100">
                            <div className="flex items-start gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* تاب اختصارات المفاتيح - 991-05 */}
          {activeTab === '991-05' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5" />
                    اختصارات لوحة المفاتيح
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {keyboardShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                        <span className="text-sm text-gray-700">{shortcut.action}</span>
                        <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono font-bold">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* تاب النصائح السريعة - 991-06 */}
          {activeTab === '991-06' && (
            <div className="space-y-4">
              <div className="dense-grid dense-grid-2">
                {quickTips.map((tip, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                          {tip.icon}
                        </div>
                        <div>
                          <h4 className="font-bold mb-2">{tip.title}</h4>
                          <p className="text-sm text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* تاب الدعم الفني - 991-07 */}
          {activeTab === '991-07' && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">فريق الدعم الفني متاح 24/7</h3>
                      <p className="text-sm text-gray-700">
                        نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر القنوات التالية
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="dense-grid dense-grid-2">
                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold mb-2">البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-600 mb-3">support@system.sa</p>
                    <Button className="dense-btn-primary">
                      أرسل بريد
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold mb-2">الهاتف</h4>
                    <p className="text-sm text-gray-600 mb-3" dir="ltr">+966 xx xxx xxxx</p>
                    <Button className="dense-btn-primary">
                      اتصل الآن
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* تاب الموارد - 991-09 */}
          {activeTab === '991-09' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>الموارد المتاحة للتنزيل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'دليل المستخدم الكامل', size: '5.2 MB', type: 'PDF' },
                      { name: 'أدلة التدريب', size: '12.8 MB', type: 'ZIP' },
                      { name: 'نماذج المستندات', size: '3.4 MB', type: 'DOCX' },
                      { name: 'قوالب التقارير', size: '2.1 MB', type: 'XLSX' }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-sm">{resource.name}</div>
                            <div className="text-xs text-gray-500">{resource.size} • {resource.type}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="dense-btn">
                          <Download className="w-3 h-3" />
                          تنزيل
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* باقي التابات */}
          {['991-02', '991-08', '991-10'].includes(activeTab) && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  محتوى الدليل قيد الإعداد
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سيتم إضافة المزيد من المحتوى التفصيلي قريباً
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}