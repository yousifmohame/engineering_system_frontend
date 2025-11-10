import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CodeDisplay } from './CodeDisplay';
import { 
  Sparkles,
  ArrowRight,
  Building2,
  PenTool,
  Megaphone,
  Star,
  CheckCircle,
  Users,
  Stamp,
  Target,
  TrendingUp,
  Activity,
  Settings,
  Palette
} from 'lucide-react';

interface EnhancedSystemMenuProps {
  onNavigate: (screen: string) => void;
}

interface NewFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  screenId: string;
  category: 'stamps' | 'signatures' | 'marketing' | 'system';
  status: 'completed' | 'beta' | 'coming_soon';
  benefits: string[];
}

export function EnhancedSystemMenu({ onNavigate }: EnhancedSystemMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const newFeatures: NewFeature[] = [
    {
      id: '1',
      title: 'نظام الأختام والتوقيعات للفروع',
      description: 'إدارة شاملة للأختام والتوقيعات مع إمكانية النسخ من الفرع الرئيسي',
      icon: Stamp,
      screenId: 'branch-enhanced',
      category: 'stamps',
      status: 'completed',
      benefits: [
        'رفع ختم وتوقيع خاص لكل فرع',
        'إمكانية اختيار ختم الفرع الرئيسي',
        'تصنيف الأختام (رسمي، توقيع، شعار)',
        'إدارة حالة الأختام وتفعيلها'
      ]
    },
    {
      id: '2',
      title: 'التوقيع الرقمي للموظفين',
      description: 'نظام متطور للتوقيع الرقمي بالرسم على الشاشة أو رفع الصور',
      icon: PenTool,
      screenId: 'employee-enhanced',
      category: 'signatures',
      status: 'completed',
      benefits: [
        'رسم التوقيع مباشرة على الشاشة',
        'رفع صورة التوقيع من الجهاز',
        'إدارة تعدد التوقيعات لكل موظف',
        'تحميل وحفظ التوقيعات بجودة عالية'
      ]
    },
    {
      id: '3',
      title: 'إدارة التسويق الشاملة',
      description: 'نظام شامل لإدارة الحملات التسويقية والعملاء المحتملين',
      icon: Megaphone,
      screenId: 'marketing',
      category: 'marketing',
      status: 'completed',
      benefits: [
        'إدارة الحملات الداخلية والخارجية',
        'تتبع العملاء المحتملين',
        'إدارة الوكالات التسويقية',
        'ربط البيانات مع النظام'
      ]
    },
    {
      id: '4',
      title: 'رمز الريال السعودي الجديد',
      description: 'تطبيق رمز الريال السعودي الجديد ⃁ في جميع أنحاء النظام',
      icon: DollarSign,
      screenId: 'enhanced-demo',
      category: 'system',
      status: 'completed',
      benefits: [
        'تطبيق الرمز الجديد ⃁ في كل المبالغ',
        'عرض المبالغ بالأرقام العربية',
        'تحويل المبالغ إلى كلمات عربية',
        'دعم العملات الأخرى'
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 ml-1" />مكتمل</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="w-3 h-3 ml-1" />تجريبي</Badge>;
      case 'coming_soon':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 ml-1" />قريباً</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'stamps':
        return <Badge className="bg-purple-100 text-purple-800">أختام</Badge>;
      case 'signatures':
        return <Badge className="bg-blue-100 text-blue-800">توقيعات</Badge>;
      case 'marketing':
        return <Badge className="bg-green-100 text-green-800">تسويق</Badge>;
      case 'system':
        return <Badge className="bg-orange-100 text-orange-800">نظام</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const filteredFeatures = selectedCategory 
    ? newFeatures.filter(f => f.category === selectedCategory)
    : newFeatures;

  return (
    <div className="space-y-6 relative">
      <CodeDisplay code="COMP-ENHANCED-MENU" position="bottom-right" />
      
      {/* العنوان */}
      <div className="text-center mb-8">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-main-title" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>
              الميزات الجديدة في النظام v4.1
            </h1>
          </div>
          <p className="text-normal text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام الأختام والتوقيعات الرقمية مع إدارة التسويق المتطورة
          </p>
        </div>
      </div>

      {/* فلاتر الفئات */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="text-small"
        >
          جميع الميزات
        </Button>
        <Button
          variant={selectedCategory === 'stamps' ? "default" : "outline"}
          onClick={() => setSelectedCategory('stamps')}
          className="text-small"
        >
          <Stamp className="w-4 h-4 ml-2" />
          الأختام
        </Button>
        <Button
          variant={selectedCategory === 'signatures' ? "default" : "outline"}
          onClick={() => setSelectedCategory('signatures')}
          className="text-small"
        >
          <PenTool className="w-4 h-4 ml-2" />
          التوقيعات
        </Button>
        <Button
          variant={selectedCategory === 'marketing' ? "default" : "outline"}
          onClick={() => setSelectedCategory('marketing')}
          className="text-small"
        >
          <Megaphone className="w-4 h-4 ml-2" />
          التسويق
        </Button>
        <Button
          variant={selectedCategory === 'system' ? "default" : "outline"}
          onClick={() => setSelectedCategory('system')}
          className="text-small"
        >
          <Settings className="w-4 h-4 ml-2" />
          النظام
        </Button>
      </div>

      {/* الميزات الجديدة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.id} className="card-element hover:shadow-lg transition-shadow border-2 border-green-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {feature.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryBadge(feature.category)}
                        {getStatusBadge(feature.status)}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    <Star className="w-3 h-3 ml-1" />
                    جديد
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {feature.description}
                </p>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الميزات الرئيسية:
                  </h4>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-small" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => onNavigate(feature.screenId)}
                    className="w-full btn-primary"
                  >
                    تجربة الميزة الآن
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* معلومات إضافية */}
      <Card className="card-element bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>
            تحسينات شاملة في النسخة 4.1
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <TrendingUp className="w-5 h-5 text-green-600" />
                التحسينات التقنية
              </h4>
              <ul className="space-y-2 text-small">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>رمز الريال السعودي الجديد ⃁</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>نظام Canvas للرسم الرقمي</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>حفظ وتحميل الصور بصيغة PNG</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>تحسينات في واجهة المستخدم</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Target className="w-5 h-5 text-purple-600" />
                الميزات الوظيفية
              </h4>
              <ul className="space-y-2 text-small">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>إدارة متقدمة للحملات التسويقية</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>تتبع العملاء المحتملين والتحويلات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>إدارة الوكالات التسويقية الخارجية</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>تاب وسائل السداد في كل شاشة</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center">
            <Button 
              onClick={() => onNavigate('enhanced-demo')}
              className="btn-primary text-lg px-8 py-3"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              استكشاف جميع الميزات الجديدة
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}