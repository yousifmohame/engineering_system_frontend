import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  Building2, Users, FileText, MapPin, Calendar as CalendarIcon,
  FileCheck, UserCheck, ClipboardList, Camera, AlertTriangle,
  DollarSign, FolderOpen, Clock, MessageSquare, BarChart3,
  Plus, Edit, Trash2, Eye, Download, Upload, Search,
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Filter,
  PhoneCall, Mail, Link, FileSpreadsheet, Archive, Settings,
  CheckSquare, FileWarning, Briefcase, Home, MapPinned,
  User, Building, BookOpen, Save, Copy, Send, History
} from 'lucide-react';

// واجهة لمعلومات المشروع
interface ProjectInfo {
  projectId: string;
  projectName: string;
  projectType: string;
  location: string;
  area: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string;
  status: string;
  clientId: string;
  transactionId: string;
  licenseType: string;
  licenseNumber: string;
}

export default function ExecutionSupervision_Complete_870() {
  const [activeMainTab, setActiveMainTab] = useState('tab1');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [projectData, setProjectData] = useState<Partial<ProjectInfo>>({});
  
  // نظام السايد بار الرأسي للتابات
  const tabs = [
    { id: 'tab1', label: 'معلومات المشروع', code: '870-01', icon: Building2 },
    { id: 'tab2', label: 'بيانات العميل', code: '870-02', icon: Users },
    { id: 'tab3', label: 'رخصة البناء', code: '870-03', icon: FileCheck },
    { id: 'tab4', label: 'رخصة تجهيز الموقع', code: '870-04', icon: MapPinned },
    { id: 'tab5', label: 'ربط بمعاملة سابقة', code: '870-05', icon: Link },
    { id: 'tab6', label: 'فريق الإشراف', code: '870-06', icon: UserCheck },
    { id: 'tab7', label: 'مراحل التنفيذ', code: '870-07', icon: ClipboardList },
    { id: 'tab8', label: 'التقارير الدورية', code: '870-08', icon: FileText },
    { id: 'tab9', label: 'الزيارات الميدانية', code: '870-09', icon: Camera },
    { id: 'tab10', label: 'المخالفات والملاحظات', code: '870-10', icon: AlertTriangle },
    { id: 'tab11', label: 'المستخلصات المالية', code: '870-11', icon: DollarSign },
    { id: 'tab12', label: 'المستندات والمرفقات', code: '870-12', icon: FolderOpen },
    { id: 'tab13', label: 'الجدول الزمني', code: '870-13', icon: Clock },
    { id: 'tab14', label: 'التواصل مع الأطراف', code: '870-14', icon: MessageSquare },
    { id: 'tab15', label: 'الإحصائيات والتقارير', code: '870-15', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#2563eb] rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإشراف على التنفيذ
                </h1>
                <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إدارة المشاريع التي يشرف المكتب على تنفيذها
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                SCR-870
              </span>
              <Badge className="bg-[#10b981] text-white">15 تبويب</Badge>
              <Badge className="bg-[#2563eb] text-white">نشط</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="button-rtl bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-4 w-4 ml-2" />
              مشروع جديد
            </Button>
            <Button variant="outline" className="button-rtl">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
            <Button variant="outline" className="button-rtl">
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b7280] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مشاريع قائمة
                  </p>
                  <p className="text-2xl text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    47
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-[#2563eb] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b7280] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مكتملة
                  </p>
                  <p className="text-2xl text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    128
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-[#10b981] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b7280] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تحتاج متابعة
                  </p>
                  <p className="text-2xl text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    12
                  </p>
                </div>
                <AlertTriangle className="h-10 w-10 text-[#f59e0b] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b7280] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    زيارات هذا الشهر
                  </p>
                  <p className="text-2xl text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    89
                  </p>
                </div>
                <Camera className="h-10 w-10 text-purple-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b7280] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مخالفات مفتوحة
                  </p>
                  <p className="text-2xl text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    7
                  </p>
                </div>
                <FileWarning className="h-10 w-10 text-[#ef4444] opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نظام التابات مع سايد بار رأسي */}
      <div className="flex gap-4">
        {/* السايد بار الرأسي للتابات */}
        <Card className="w-64 h-fit sticky top-6">
          <CardContent className="p-2">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMainTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-all ${
                      activeMainTab === tab.id
                        ? 'bg-[#2563eb] text-white'
                        : 'text-[#1f2937] hover:bg-[#f1f5f9]'
                    }`}
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-sm">{tab.label}</span>
                    <span 
                      className="text-xs opacity-70 font-code" 
                      style={{ fontFamily: 'Courier New, monospace' }}
                    >
                      {tab.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* محتوى التابات */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {/* تاب 870-01: معلومات المشروع الأساسية */}
              {activeMainTab === 'tab1' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        معلومات المشروع الأساسية
                      </h3>
                      <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        البيانات الرئيسية للمشروع تحت الإشراف
                      </p>
                    </div>
                    <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                      TAB-870-01
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* القسم الأول: المعلومات الأساسية */}
                    <Card className="col-span-3 bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المعلومات الأساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="form-group">
                            <Label htmlFor="projectNumber" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رقم المشروع *
                            </Label>
                            <Input
                              id="projectNumber"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="PRJ-2025-001"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="projectName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              اسم المشروع *
                            </Label>
                            <Input
                              id="projectName"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="أدخل اسم المشروع"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="projectType" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              نوع المشروع *
                            </Label>
                            <Select>
                              <SelectTrigger 
                                className="input-field"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  border: '2px solid #e5e7eb',
                                  backgroundColor: '#ffffff',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                <SelectValue placeholder="اختر نوع المشروع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="residential">سكني</SelectItem>
                                <SelectItem value="commercial">تجاري</SelectItem>
                                <SelectItem value="industrial">صناعي</SelectItem>
                                <SelectItem value="mixed">مختلط</SelectItem>
                                <SelectItem value="governmental">حكومي</SelectItem>
                                <SelectItem value="educational">تعليمي</SelectItem>
                                <SelectItem value="healthcare">صحي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="form-group">
                            <Label htmlFor="location" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الموقع *
                            </Label>
                            <Input
                              id="location"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="المدينة - الحي"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="area" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              مساحة الأرض (م²) *
                            </Label>
                            <Input
                              id="area"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="buildArea" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              مساحة البناء (م²) *
                            </Label>
                            <Input
                              id="buildArea"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="floors" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              عدد الأدوار
                            </Label>
                            <Input
                              id="floors"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="units" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              عدد الوحدات
                            </Label>
                            <Input
                              id="units"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="status" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              حالة المشروع *
                            </Label>
                            <Select>
                              <SelectTrigger 
                                className="input-field"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  border: '2px solid #e5e7eb',
                                  backgroundColor: '#ffffff',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">تخطيط</SelectItem>
                                <SelectItem value="starting">بداية التنفيذ</SelectItem>
                                <SelectItem value="inprogress">قيد التنفيذ</SelectItem>
                                <SelectItem value="advanced">مراحل متقدمة</SelectItem>
                                <SelectItem value="finishing">تشطيب نهائي</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                                <SelectItem value="suspended">موقوف</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* القسم الثاني: الفترة الزمنية */}
                    <Card className="col-span-3 bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الفترة الزمنية للمشروع
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="form-group">
                            <Label htmlFor="startDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ بدء المشروع *
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="expectedEndDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الانتهاء المتوقع *
                            </Label>
                            <Input
                              id="expectedEndDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="actualEndDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الانتهاء الفعلي
                            </Label>
                            <Input
                              id="actualEndDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="duration" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              مدة التنفيذ (أشهر)
                            </Label>
                            <Input
                              id="duration"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            نسبة الإنجاز
                          </Label>
                          <div className="flex items-center gap-4 mt-2">
                            <Progress value={65} className="flex-1" />
                            <span className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              65%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* القسم الثالث: معلومات إضافية */}
                    <Card className="col-span-3 bg-purple-50 border-purple-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات إضافية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-group col-span-2">
                            <Label htmlFor="description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              وصف المشروع
                            </Label>
                            <Textarea
                              id="description"
                              rows={4}
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="أدخل وصف تفصيلي للمشروع..."
                            />
                          </div>

                          <div className="form-group col-span-2">
                            <Label htmlFor="notes" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              ملاحظات عامة
                            </Label>
                            <Textarea
                              id="notes"
                              rows={3}
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="ملاحظات إضافية..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button className="button-rtl bg-[#10b981] hover:bg-[#059669] text-white">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ البيانات
                    </Button>
                    <Button variant="outline" className="button-rtl">
                      <Copy className="h-4 w-4 ml-2" />
                      نسخ
                    </Button>
                  </div>
                </div>
              )}

              {/* تاب 870-02: بيانات العميل والربط */}
              {activeMainTab === 'tab2' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        بيانات العميل والربط
                      </h3>
                      <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ربط المشروع بملف العميل في النظام
                      </p>
                    </div>
                    <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                      TAB-870-02
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* البحث عن العميل */}
                    <Card className="col-span-2 bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          البحث عن العميل وربطه
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="form-group col-span-2">
                            <Label htmlFor="clientSearch" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              بحث عن العميل *
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="clientSearch"
                                className="input-field flex-1"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  border: '2px solid #e5e7eb',
                                  backgroundColor: '#ffffff',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                                placeholder="ابحث بالاسم، رقم الهوية، أو رقم الملف..."
                              />
                              <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="form-group">
                            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              &nbsp;
                            </Label>
                            <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white">
                              <Plus className="h-4 w-4 ml-2" />
                              عميل جديد
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* معلومات العميل المربوط */}
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          بيانات العميل
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            رقم الملف:
                          </span>
                          <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                            CLI-2025-0123
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الاسم:
                          </span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            محمد بن أحمد السعيد
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            رقم الهوية:
                          </span>
                          <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                            1234567890
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الجوال:
                          </span>
                          <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                            +966 50 123 4567
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            البريد الإلكتروني:
                          </span>
                          <span className="font-code text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                            client@example.com
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* معلومات التواصل */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات التواصل الإضافية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="form-group">
                          <Label htmlFor="altPhone" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            جوال بديل
                          </Label>
                          <Input
                            id="altPhone"
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="+966 5X XXX XXXX"
                          />
                        </div>
                        <div className="form-group">
                          <Label htmlFor="address" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            العنوان
                          </Label>
                          <Textarea
                            id="address"
                            rows={3}
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="العنوان الكامل..."
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* الوثائق المطلوبة من العميل */}
                    <Card className="col-span-2 bg-purple-50 border-purple-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الوثائق المطلوبة من العميل
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                الوثيقة
                              </TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                الحالة
                              </TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                تاريخ الاستلام
                              </TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                ملاحظات
                              </TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                إجراءات
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                صورة الهوية الوطنية
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className="bg-[#10b981] text-white">مستلمة</Badge>
                              </TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                                2025-01-15
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                سارية
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                صك الملكية
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className="bg-[#10b981] text-white">مستلمة</Badge>
                              </TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                                2025-01-15
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                موثق
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                المخطط المساحي
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className="bg-[#f59e0b] text-white">قيد المراجعة</Badge>
                              </TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                                2025-01-20
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                يحتاج تحديث
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* تاب 870-03: رخصة البناء */}
              {activeMainTab === 'tab3' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رخصة البناء
                      </h3>
                      <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        بيانات وتفاصيل رخصة البناء المرتبطة بالمشروع
                      </p>
                    </div>
                    <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                      TAB-870-03
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* بيانات الرخصة الأساسية */}
                    <Card className="col-span-2 bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات رخصة البناء
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="form-group">
                            <Label htmlFor="licenseNumber" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رقم رخصة البناء *
                            </Label>
                            <Input
                              id="licenseNumber"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="XXX-XXXX-XXXXXXX"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="licenseIssueDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الإصدار *
                            </Label>
                            <Input
                              id="licenseIssueDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="licenseExpiryDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الانتهاء *
                            </Label>
                            <Input
                              id="licenseExpiryDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="issuingAuthority" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الجهة المصدرة *
                            </Label>
                            <Select>
                              <SelectTrigger 
                                className="input-field"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  border: '2px solid #e5e7eb',
                                  backgroundColor: '#ffffff',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                <SelectValue placeholder="اختر الجهة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baladia">البلدية</SelectItem>
                                <SelectItem value="momra">وزارة الشؤون البلدية</SelectItem>
                                <SelectItem value="other">جهة أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="form-group">
                            <Label htmlFor="licenseStatus" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              حالة الرخصة *
                            </Label>
                            <Select>
                              <SelectTrigger 
                                className="input-field"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  border: '2px solid #e5e7eb',
                                  backgroundColor: '#ffffff',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">سارية</SelectItem>
                                <SelectItem value="expired">منتهية</SelectItem>
                                <SelectItem value="renewed">مجددة</SelectItem>
                                <SelectItem value="cancelled">ملغاة</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="form-group">
                            <Label htmlFor="licenseFees" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رسوم الرخصة (ريال)
                            </Label>
                            <Input
                              id="licenseFees"
                              type="number"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* المواصفات الفنية */}
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المواصفات الفنية المعتمدة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="approvedArea" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            مساحة البناء المعتمدة (م²)
                          </Label>
                          <Input
                            id="approvedArea"
                            type="number"
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="0"
                          />
                        </div>

                        <div className="form-group">
                          <Label htmlFor="approvedFloors" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            عدد الأدوار المعتمد
                          </Label>
                          <Input
                            id="approvedFloors"
                            type="number"
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="0"
                          />
                        </div>

                        <div className="form-group">
                          <Label htmlFor="approvedHeight" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الارتفاع المعتمد (متر)
                          </Label>
                          <Input
                            id="approvedHeight"
                            type="number"
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="0"
                          />
                        </div>

                        <div className="form-group">
                          <Label htmlFor="buildingUse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الاستخدام المعتمد
                          </Label>
                          <Input
                            id="buildingUse"
                            className="input-field"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                            placeholder="سكني/تجاري/..."
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* الاشتراطات والقيود */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الاشتراطات والقيود
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة البناء</span>
                            <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>60%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الارتدادات الأمامية</span>
                            <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>4م</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الارتدادات الجانبية</span>
                            <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>2م</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الارتدادات الخلفية</span>
                            <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>3م</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>مواقف السيارات المطلوبة</span>
                            <span className="font-code" style={{ fontFamily: 'Courier New, monospace' }}>12 موقف</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* المرفقات */}
                    <Card className="col-span-2 bg-purple-50 border-purple-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          مرفقات رخصة البناء
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-[#2563eb]" />
                              <div>
                                <p style={{ fontFamily: 'Tajawal, sans-serif' }}>رخصة البناء الأصلية.pdf</p>
                                <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  2.4 MB - تم الرفع في 2025-01-15
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-[#2563eb]" />
                              <div>
                                <p style={{ fontFamily: 'Tajawal, sans-serif' }}>المخططات المعتمدة.pdf</p>
                                <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  5.8 MB - تم الرفع في 2025-01-15
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                            <Upload className="h-4 w-4 ml-2" />
                            رفع مرفق جديد
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* تاب 870-04: رخصة تجهيز الموقع */}
              {activeMainTab === 'tab4' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رخصة تجهيز الموقع
                      </h3>
                      <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        بيانات وتفاصيل رخصة تجهيز الموقع
                      </p>
                    </div>
                    <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                      TAB-870-04
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card className="col-span-2 bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات رخصة التجهيز
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="form-group">
                            <Label htmlFor="sitePermitNumber" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رقم رخصة التجهيز *
                            </Label>
                            <Input
                              id="sitePermitNumber"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="XXX-XXXX-XXXXXXX"
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="siteIssueDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الإصدار *
                            </Label>
                            <Input
                              id="siteIssueDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <Label htmlFor="siteExpiryDate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تاريخ الانتهاء *
                            </Label>
                            <Input
                              id="siteExpiryDate"
                              type="date"
                              className="input-field"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          أعمال التجهيز المعتمدة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <Checkbox id="excavation" />
                            <Label htmlFor="excavation" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              أعمال الحفر
                            </Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <Checkbox id="foundation" />
                            <Label htmlFor="foundation" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              أعمال الأساسات
                            </Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <Checkbox id="fencing" />
                            <Label htmlFor="fencing" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              السياج المؤقت
                            </Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <Checkbox id="utilities" />
                            <Label htmlFor="utilities" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              توصيل المرافق
                            </Label>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <Checkbox id="storage" />
                            <Label htmlFor="storage" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              مخازن مؤقتة
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          متطلبات السلامة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة تعريفية بالموقع</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تأمين محيط الموقع</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <AlertCircle className="h-4 w-4 text-[#f59e0b]" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إشارات التحذير</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded">
                            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>طفايات الحريق</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2 bg-purple-50 border-purple-200">
                      <CardHeader>
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          سجل أعمال التجهيز
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العمل</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البدء</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تسوية الأرض</TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>2025-01-10</TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>2025-01-15</TableCell>
                              <TableCell className="text-right"><Badge className="bg-[#10b981] text-white">مكتمل</Badge></TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تم بنجاح</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحفر</TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>2025-01-16</TableCell>
                              <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>-</TableCell>
                              <TableCell className="text-right"><Badge className="bg-[#2563eb] text-white">جاري</Badge></TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>60% إنجاز</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* تاب 870-05: ربط بمعاملة سابقة */}
              {activeMainTab === 'tab5' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ربط بمعاملة سابقة
                      </h3>
                      <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ربط المشروع بمعاملة سابقة في النظام (اختياري)
                      </p>
                    </div>
                    <span className="font-code text-[#6b7280]" style={{ fontFamily: 'Courier New, monospace' }}>
                      TAB-870-05
                    </span>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        البحث عن المعاملة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <Label htmlFor="transactionSearch" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            البحث عن المعاملة
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="transactionSearch"
                              className="input-field flex-1"
                              style={{ 
                                fontFamily: 'Tajawal, sans-serif',
                                border: '2px solid #e5e7eb',
                                backgroundColor: '#ffffff',
                                textAlign: 'right',
                                direction: 'rtl'
                              }}
                              placeholder="رقم المعاملة أو اسم المشروع..."
                            />
                            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="form-group">
                          <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            &nbsp;
                          </Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="button-rtl flex-1">
                              <Filter className="h-4 w-4 ml-2" />
                              تصفية متقدمة
                            </Button>
                            <Button variant="outline" className="button-rtl flex-1">
                              <Eye className="h-4 w-4 ml-2" />
                              عرض الكل
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المعاملات المتاحة للربط
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المعاملة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المشروع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>TRX-2024-0156</TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تصميم معماري</TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>فيلا سكنية - حي النرجس</TableCell>
                            <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>2024-12-15</TableCell>
                            <TableCell className="text-right"><Badge className="bg-[#10b981] text-white">مكتملة</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                                  <Link className="h-3 w-3 ml-1" />
                                  ربط
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>TRX-2024-0142</TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>دراسة إنشائية</TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عمارة سكنية - حي الياسمين</TableCell>
                            <TableCell className="text-right font-code" style={{ fontFamily: 'Courier New, monospace' }}>2024-11-20</TableCell>
                            <TableCell className="text-right"><Badge className="bg-[#10b981] text-white">مكتملة</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                                  <Link className="h-3 w-3 ml-1" />
                                  ربط
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المعاملات المربوطة حالياً
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-8 w-8 text-[#10b981]" />
                            <div>
                              <p style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة تصميم معماري</p>
                              <p className="text-sm text-[#6b7280] font-code" style={{ fontFamily: 'Courier New, monospace' }}>
                                TRX-2024-0156
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-[#ef4444]">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <AlertCircle className="h-8 w-8 text-[#f59e0b] mx-auto mb-2" />
                          <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            يمكنك ربط معاملة أخرى إذا كان هناك أكثر من معاملة سابقة مرتبطة بهذا المشروع
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* باقي التابات سيتم تطويرها بنفس النمط */}
              {activeMainTab === 'tab6' && (
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    فريق الإشراف
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-06 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab7' && (
                <div className="text-center py-12">
                  <ClipboardList className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مراحل التنفيذ
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-07 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab8' && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التقارير الدورية
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-08 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab9' && (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الزيارات الميدانية
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-09 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab10' && (
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المخالفات والملاحظات
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-10 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab11' && (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المستخلصات المالية
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-11 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab12' && (
                <div className="text-center py-12">
                  <FolderOpen className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المستندات والمرفقات
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-12 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab13' && (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الجدول الزمني
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-13 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab14' && (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التواصل مع الأطراف
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-14 - قيد التطوير
                  </p>
                </div>
              )}

              {activeMainTab === 'tab15' && (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
                  <h3 className="text-[#1f2937] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الإحصائيات والتقارير
                  </h3>
                  <p className="text-[#6b7280]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    TAB-870-15 - قيد التطوير
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
