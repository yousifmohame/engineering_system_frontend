import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Crown,
  Users,
  PieChart,
  Calculator,
  FileText,
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Star,
  DollarSign,
  Briefcase,
  Settings
} from 'lucide-react';

export default function OfficeOwnersEnhancedInfo() {
  const ownershipFeatures = [
    {
      icon: <Crown className="h-5 w-5 text-purple-600" />,
      title: 'بروفايل شامل للشركاء',
      description: 'ملف كامل لكل شريك يتضمن الصور والمؤهلات والخبرات',
      status: 'مكتمل',
      permissions: 12
    },
    {
      icon: <PieChart className="h-5 w-5 text-blue-600" />,
      title: 'توزيع الحصص الدقيق',
      description: 'نظام توزيع حصص بنسب مئوية دقيقة مع ضمان إجمالي 100%',
      status: 'مكتمل',
      permissions: 8
    },
    {
      icon: <FileText className="h-5 w-5 text-red-600" />,
      title: 'تخصيص المعاملات السرية',
      description: 'تخصيص المعاملات للشركاء كمعلومات سرية لا تظهر إلا لأصحاب المكتب',
      status: 'مكتمل',
      permissions: 15
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      title: 'الحسابات البنكية المتعددة',
      description: 'إدارة شاملة للحسابات البنكية المتعددة لكل شريك',
      status: 'مكتمل',
      permissions: 10
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      title: 'حساب الأرباح التقديرية',
      description: 'حساب الأرباح التقديرية والفعلية لكل شريك حسب حصته',
      status: 'مكتمل',
      permissions: 6
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      title: 'تصنيف نوع الشريك',
      description: 'تحديد نوع الشريك (ممول فقط أم له حق الإدارة) مع الصلاحيات المناسبة',
      status: 'مكتمل',
      permissions: 8
    }
  ];

  const confidentialityLevels = [
    { level: 'سري جداً', color: 'red', count: 2, description: 'معلومات محدودة للشركاء الرئيسيين فقط' },
    { level: 'سري', color: 'orange', count: 5, description: 'معلومات للشركاء أصحاب الصلاحيات الإدارية' },
    { level: 'محدود', color: 'blue', count: 8, description: 'معلومات لجميع الشركاء النشطين' }
  ];

  const partnerTypes = [
    {
      type: 'ممول وإداري',
      description: 'شريك لديه استثمار مالي وصلاحيات إدارية كاملة',
      permissions: ['إدارة المشاريع', 'اعتماد المعاملات', 'عرض التقارير المالية', 'إدارة الموظفين'],
      color: 'green'
    },
    {
      type: 'ممول فقط',
      description: 'شريك مستثمر بدون صلاحيات إدارية',
      permissions: ['عرض الاستثمارات', 'تتبع الأرباح', 'التقارير المالية الشخصية'],
      color: 'blue'
    },
    {
      type: 'إداري فقط',
      description: 'شريك بصلاحيات إدارية بدون استثمار كبير',
      permissions: ['إدارة العمليات', 'إشراف المشاريع', 'إدارة الفرق'],
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 rtl-support" dir="rtl">
      {/* عنوان القسم */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          نظام ملاك المكتب والشركاء المتقدم
        </h2>
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إدارة شاملة ومتقدمة لملاك المكتب مع بروفايل كامل للشركاء وإدارة المعاملات السرية
        </p>
      </div>

      {/* الميزات الرئيسية */}
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Star className="h-5 w-5 text-yellow-500" />
            الميزات الرئيسية للنظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownershipFeatures.map((feature) => (
              <div key={feature.title} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {feature.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.permissions} صلاحية
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {feature.description}
                    </p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      ✓ {feature.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* مستويات السرية */}
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Shield className="h-5 w-5 text-red-500" />
            مستويات السرية للمعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confidentialityLevels.map((level) => (
              <div key={level.level} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${level.color}-500`}></div>
                  <div>
                    <h3 className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {level.level}
                    </h3>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {level.description}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {level.count} معاملة
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أنواع الشركاء */}
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Briefcase className="h-5 w-5 text-blue-500" />
            أنواع الشركاء والصلاحيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerTypes.map((partner) => (
              <div key={partner.type} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner.type}
                  </h3>
                  <Badge variant="outline" className={`text-xs text-${partner.color}-600`}>
                    {partner.permissions.length} صلاحيات
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {partner.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {partner.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات متقدمة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-element text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">7</div>
            <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تبويبات رئيسية
            </div>
          </CardContent>
        </Card>

        <Card className="card-element text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">45</div>
            <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              صلاحية متقدمة
            </div>
          </CardContent>
        </Card>

        <Card className="card-element text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600">100%</div>
            <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مكتمل ويعمل
            </div>
          </CardContent>
        </Card>

        <Card className="card-element text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-orange-600">3</div>
            <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مستويات سرية
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}