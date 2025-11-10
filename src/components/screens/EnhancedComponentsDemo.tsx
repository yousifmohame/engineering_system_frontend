/**
 * صفحة تجريبية - المكونات المحسّنة v7.0
 * =======================================
 * 
 * عرض توضيحي للمكونات الجديدة:
 * - InputWithCopy المحسّن مع زر المسح
 * - EnhancedSwitch المطور
 * - جميع الأحجام والأنواع
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { Sparkles, Zap, Shield, Bell } from 'lucide-react';

const EnhancedComponentsDemo: React.FC = () => {
  // States للحقول
  const [name, setName] = useState('محمد أحمد السعيد');
  const [email, setEmail] = useState('mohammed@example.com');
  const [phone, setPhone] = useState('0501234567');
  const [description, setDescription] = useState('هذا نص تجريبي طويل يمكن نسخه أو مسحه بسهولة. يحتوي على معلومات مهمة جداً.');
  const [type, setType] = useState('option1');
  const [category, setCategory] = useState('');

  // States للمؤشرات
  const [feature1, setFeature1] = useState(true);
  const [feature2, setFeature2] = useState(false);
  const [feature3, setFeature3] = useState(true);
  const [feature4, setFeature4] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
              المكونات المحسّنة v7.0
            </h1>
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عرض توضيحي للحقول المحسّنة ومؤشرات التفعيل الجديدة
          </p>
          <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            نظام إدارة الأعمال v7.0
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* القسم الأول: حقول الإدخال */}
          <Card className="card-rtl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
              <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Shield className="h-5 w-5 text-blue-600" />
                حقول الإدخال المحسّنة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#2563eb' }}>
                  حقول الإدخال النصية
                </h3>
                <div className="space-y-4">
                  <InputWithCopy
                    label="الاسم الكامل"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    required
                  />

                  <InputWithCopy
                    label="البريد الإلكتروني"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                  />

                  <InputWithCopy
                    label="رقم الجوال"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#2563eb' }}>
                  حقل نص متعدد
                </h3>
                <TextAreaWithCopy
                  label="الوصف التفصيلي"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="أدخل وصفاً تفصيلياً..."
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#2563eb' }}>
                  القوائم المنسدلة
                </h3>
                <div className="space-y-4">
                  <SelectWithCopy
                    label="النوع"
                    id="type"
                    value={type}
                    onChange={setType}
                    options={[
                      { value: '', label: 'اختر النوع' },
                      { value: 'option1', label: 'الخيار الأول' },
                      { value: 'option2', label: 'الخيار الثاني' },
                      { value: 'option3', label: 'الخيار الثالث' }
                    ]}
                    required
                  />

                  <SelectWithCopy
                    label="التصنيف"
                    id="category"
                    value={category}
                    onChange={setCategory}
                    options={[
                      { value: '', label: 'اختر التصنيف' },
                      { value: 'cat1', label: 'تصنيف أول' },
                      { value: 'cat2', label: 'تصنيف ثاني' },
                      { value: 'cat3', label: 'تصنيف ثالث' }
                    ]}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  💡 <strong>ميزة:</strong> جميع الحقول تحتوي على أزرار النسخ والمسح التلقائية
                </p>
              </div>
            </CardContent>
          </Card>

          {/* القسم الثاني: مؤشرات التفعيل */}
          <Card className="card-rtl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
              <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Bell className="h-5 w-5 text-purple-600" />
                مؤشرات التفعيل المحسّنة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#8b5cf6' }}>
                  الحجم الافتراضي (md)
                </h3>
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="feature1"
                    checked={feature1}
                    onCheckedChange={setFeature1}
                    label="الميزة الأولى"
                    description="تفعيل الميزة الأولى في النظام"
                    variant="default"
                  />

                  <EnhancedSwitch
                    id="feature2"
                    checked={feature2}
                    onCheckedChange={setFeature2}
                    label="الميزة الثانية"
                    description="تفعيل الميزة الثانية في النظام"
                    variant="success"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#8b5cf6' }}>
                  الحجم الصغير (sm)
                </h3>
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    label="الإشعارات"
                    description="استقبال الإشعارات الفورية"
                    size="sm"
                    variant="warning"
                  />

                  <EnhancedSwitch
                    id="autoSave"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                    label="الحفظ التلقائي"
                    description="حفظ التغييرات تلقائياً"
                    size="sm"
                    variant="default"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#8b5cf6' }}>
                  الحجم الكبير (lg)
                </h3>
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="feature3"
                    checked={feature3}
                    onCheckedChange={setFeature3}
                    label="وضع المطور"
                    description="تفعيل أدوات المطورين المتقدمة"
                    size="lg"
                    variant="danger"
                  />

                  <EnhancedSwitch
                    id="feature4"
                    checked={feature4}
                    onCheckedChange={setFeature4}
                    label="الوضع التجريبي"
                    description="تجربة المميزات الجديدة قبل الإطلاق"
                    size="lg"
                    variant="success"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  💡 <strong>ميزة:</strong> حالة واضحة مع شارة "مفعّل" أو "غير مفعّل"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قسم المميزات */}
        <Card className="card-rtl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
            <CardTitle className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المميزات الرئيسية v7.0
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'خلفية ملونة',
                  description: 'تدرج لوني جميل لجميع الحقول',
                  icon: '🎨',
                  color: 'blue'
                },
                {
                  title: 'أزرار مصغّرة',
                  description: 'أزرار نسخ ومسح بحجم 24x24px',
                  icon: '🔘',
                  color: 'purple'
                },
                {
                  title: 'تباعد صحيح',
                  description: 'الأزرار بعيدة عن سهم القائمة',
                  icon: '↔️',
                  color: 'green'
                },
                {
                  title: 'حالة واضحة',
                  description: 'شارة توضح حالة التفعيل',
                  icon: '✅',
                  color: 'orange'
                }
              ].map((feature, i) => (
                <Card key={i} className="card-rtl hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* قسم الملاحظات */}
        <Card className="card-rtl border-2 border-yellow-200">
          <CardContent className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                  ملاحظات هامة:
                </h4>
                <ul className="space-y-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  <li>• جميع المكونات تدعم RTL بشكل كامل</li>
                  <li>• الأزرار تظهر فقط عند وجود محتوى في الحقل</li>
                  <li>• زر النسخ يتحول إلى أخضر عند النسخ الناجح</li>
                  <li>• زر المسح باللون الأحمر للتمييز</li>
                  <li>• القوائم المنسدلة: الأزرار على بعد 45px من السهم</li>
                  <li>• مؤشرات التفعيل: 3 أحجام (sm, md, lg) و 4 أنواع</li>
                  <li>• جميع التأثيرات والحركات سلسة مع cubic-bezier</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام إدارة الأعمال الهندسية v7.0 • المكونات المحسّنة
          </p>
          <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            تم التطوير بواسطة فريق النظام
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default EnhancedComponentsDemo;
