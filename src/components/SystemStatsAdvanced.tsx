import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Building,
  Users,
  Globe,
  Crown,
  Shield,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Zap,
  Database,
  Eye,
  Settings,
  FileText,
  Calculator
} from 'lucide-react';

interface SystemStatsAdvancedProps {
  totalScreens: number;
  categories: number;
  totalPermissions: number;
  integrations: number;
  hrModules: number;
  erpModules: number;
}

export default function SystemStatsAdvanced({
  totalScreens,
  categories,
  totalPermissions,
  integrations,
  hrModules,
  erpModules
}: SystemStatsAdvancedProps) {
  const completionStats = [
    { label: 'نظام ERP', progress: 100, color: 'blue', modules: erpModules },
    { label: 'الموارد البشرية', progress: 100, color: 'green', modules: hrModules },
    { label: 'التكاملات الرقمية', progress: 100, color: 'purple', modules: integrations },
    { label: 'ملاك المكتب', progress: 100, color: 'orange', modules: 1 }
  ];

  const systemFeatures = [
    {
      icon: <Crown className="h-5 w-5 text-orange-500" />,
      title: 'نظام ملاك المكتب المتقدم',
      description: 'إدارة شاملة للشركاء مع تخصيص المعاملات السرية',
      stats: '7 تبويبات، 45 صلاحية'
    },
    {
      icon: <Building className="h-5 w-5 text-blue-500" />,
      title: 'نظام ERP متكامل',
      description: 'تخطيط موارد المؤسسة داخل النظام الهندسي',
      stats: `${erpModules} وحدات، شاشة واحدة`
    },
    {
      icon: <Users className="h-5 w-5 text-green-500" />,
      title: 'موارد بشرية معتمدة',
      description: 'امتثال كامل لنظام العمل السعودي',
      stats: 'WPS، GOSI، قوى'
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      title: 'تكاملات حكومية',
      description: 'ربط مباشر مع 15+ جهة حكومية',
      stats: 'أبشر، ZATCA، قوى'
    }
  ];

  return (
    <div className="space-y-6 rtl-support" dir="rtl">
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-element bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalScreens}</div>
            <div className="text-xs text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              شاشة متقدمة
            </div>
          </CardContent>
        </Card>

        <Card className="card-element bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">{totalPermissions}+</div>
            <div className="text-xs text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              صلاحية مفصلة
            </div>
          </CardContent>
        </Card>

        <Card className="card-element bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{categories}</div>
            <div className="text-xs text-purple-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              فئة رئيسية
            </div>
          </CardContent>
        </Card>

        <Card className="card-element bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-xs text-orange-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اكتمال النظام
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مؤشرات التقدم */}
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            حالة اكتمال الأنظمة الفرعية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {completionStats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {stat.modules} وحدة
                  </Badge>
                  <span className="text-sm font-bold text-green-600">{stat.progress}%</span>
                </div>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* الميزات الرئيسية */}
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <CheckCircle className="h-5 w-5 text-green-500" />
            الميزات الرئيسية للنظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemFeatures.map((feature) => (
              <div key={feature.title} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات التطوير */}
      <Card className="card-element bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="font-mono">WMS v4.0</Badge>
              <Badge variant="secondary">دليل المواصفات التنفيذية</Badge>
              <Badge className="bg-green-100 text-green-800">✓ مكتمل</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نظام إدارة عمل شامل (WMS) وفقاً لدليل المواصفات التنفيذية الإصدار v4.0
            </p>
            
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-blue-500" />
                <span>واجهات RTL متقدمة</span>
              </div>
              <div className="flex items-center gap-1">
                <Settings className="h-3 w-3 text-gray-500" />
                <span>تخصيص شامل</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>أداء محسّن</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}