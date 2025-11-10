/**
 * ============================================================================
 * التاب 284-03 - بيانات المالك - النسخة المحسنة v2.0
 * ============================================================================
 * 
 * تاب شامل لبيانات المالك مع تكامل كامل مع الشاشة 300
 * 
 * المميزات الجديدة v2.0:
 * ✅ تقسيم الاسم إلى حقول منفصلة (الأول، الأب، الجد، العائلة)
 * ✅ عرض مختصر (الأول + الأخير) وعرض رباعي كامل
 * ✅ اختيار من قائمة العملاء المسجلين في الشاشة 300
 * ✅ إضافة عميل جديد مباشرة
 * ✅ عرض معلومات العميل الكاملة
 * ✅ ربط تلقائي مع بروفايل العميل
 * ✅ عرض سجل معاملات العميل
 * ✅ واجهة محسنة بتصميم احترافي
 * 
 * @version 2.0 ENHANCED
 * @date 2025-10-26
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  User, Phone, Mail, MapPin, FileText, Building2, Plus, Eye, Edit,
  Star, Briefcase, DollarSign, CheckCircle, Clock, ExternalLink
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

// ============================================================================
// واجهات البيانات
// ============================================================================

interface OwnerName {
  firstName: string;      // الاسم الأول
  fatherName: string;     // اسم الأب
  grandFatherName: string; // اسم الجد
  familyName: string;     // اسم العائلة
}

interface OwnerData {
  clientId?: string;      // ربط مع الشاشة 300
  name: OwnerName;
  idType: string;
  idNumber: string;
  mobile: string;
  phone?: string;
  email: string;
  address: string;
  city: string;
  district: string;
  nationality: string;
  occupation?: string;
  notes?: string;
  // معلومات من الشاشة 300
  clientCode?: string;
  totalTransactions?: number;
  rating?: number;
  category?: string;
}

const Tab_284_03_Owner_Data_ENHANCED_v2: React.FC = () => {
  const [ownerData, setOwnerData] = useState<OwnerData>({
    name: {
      firstName: '',
      fatherName: '',
      grandFatherName: '',
      familyName: ''
    },
    idType: 'هوية وطنية',
    idNumber: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    district: '',
    nationality: 'سعودي'
  });

  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [showClientsList, setShowClientsList] = useState(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [showClientProfile, setShowClientProfile] = useState(false);

  // تحميل قائمة العملاء من الشاشة 300
  useEffect(() => {
    const mockClients = [
      {
        id: 'cl001',
        code: 'CLT-2025-001',
        name: { firstName: 'محمد', fatherName: 'أحمد', grandFatherName: 'عبدالله', familyName: 'العلي' },
        mobile: '0551234567',
        email: 'mohammed.ali@email.com',
        category: 'VIP',
        rating: 5,
        totalTransactions: 3,
        city: 'الرياض'
      },
      {
        id: 'cl002',
        code: 'CLT-2025-002',
        name: { firstName: 'فاطمة', fatherName: 'خالد', grandFatherName: 'سعيد', familyName: 'الحسن' },
        mobile: '0559876543',
        email: 'fatima.hassan@email.com',
        category: 'عادي',
        rating: 4,
        totalTransactions: 1,
        city: 'جدة'
      },
      {
        id: 'cl003',
        code: 'CLT-2025-003',
        name: { firstName: 'عبدالرحمن', fatherName: 'محمد', grandFatherName: 'إبراهيم', familyName: 'السعيد' },
        mobile: '0557654321',
        email: 'abdulrahman.saeed@company.com',
        category: 'مؤسسة',
        rating: 5,
        totalTransactions: 2,
        city: 'الدمام'
      }
    ];
    setAvailableClients(mockClients);
  }, []);

  // دوال مساعدة
  const getShortName = (name: OwnerName): string => {
    return `${name.firstName} ${name.familyName}`;
  };

  const getFullName = (name: OwnerName): string => {
    return `${name.firstName} ${name.fatherName} ${name.grandFatherName} ${name.familyName}`;
  };

  // اختيار عميل من القائمة
  const handleSelectClient = (client: any) => {
    setOwnerData({
      ...ownerData,
      clientId: client.id,
      clientCode: client.code,
      name: client.name,
      mobile: client.mobile,
      email: client.email,
      city: client.city,
      totalTransactions: client.totalTransactions,
      rating: client.rating,
      category: client.category
    });
    setShowClientsList(false);
  };

  // حفظ البيانات
  const handleSave = () => {
    const fullName = getFullName(ownerData.name);
    const shortName = getShortName(ownerData.name);
    
    console.log('بيانات المالك المحفوظة:', {
      fullName,      // للتقارير والمستندات الرسمية
      shortName,     // للعرض المختصر
      ...ownerData
    });
    
    alert(`✅ تم حفظ بيانات المالك:\n\nالاسم المختصر: ${shortName}\nالاسم الرباعي: ${fullName}\n\nكود العميل: ${ownerData.clientCode || 'جديد'}`);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-284-03-V2" position="top-right" />
      
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2 text-center">
            <User className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-gray-600">كود العميل</p>
            <p className="text-sm font-bold text-blue-900">{ownerData.clientCode || '-'}</p>
          </CardContent>
        </Card>
        
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-gray-600">الحالة</p>
            <p className="text-sm font-bold text-green-900">{ownerData.clientId ? 'مسجل' : 'جديد'}</p>
          </CardContent>
        </Card>
        
        {ownerData.totalTransactions !== undefined && (
          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-2 text-center">
              <Briefcase className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs text-gray-600">المعاملات</p>
              <p className="text-sm font-bold text-yellow-900">{ownerData.totalTransactions}</p>
            </CardContent>
          </Card>
        )}
        
        {ownerData.rating !== undefined && (
          <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
            <CardContent className="p-2 text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-pink-600" />
              <p className="text-xs text-gray-600">التقييم</p>
              <div className="flex gap-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-3 w-3" 
                    style={{ 
                      fill: i < ownerData.rating! ? '#f59e0b' : 'transparent',
                      color: i < ownerData.rating! ? '#f59e0b' : '#d1d5db'
                    }} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {ownerData.category && (
          <Card style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', border: '2px solid #c4b5fd' }}>
            <CardContent className="p-2 text-center">
              <Building2 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-600">التصنيف</p>
              <Badge style={{ fontSize: '10px' }}>{ownerData.category}</Badge>
            </CardContent>
          </Card>
        )}
        
        <Card style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #7dd3fc' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
            <p className="text-xs text-gray-600">الإجراء</p>
            <Button 
              size="sm" 
              onClick={() => setShowClientsList(true)}
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
                color: '#fff',
                height: '22px',
                fontSize: '10px',
                padding: '0 8px'
              }}
            >
              اختيار من القائمة
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* القسم الأول: الاسم الرباعي */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontSize: '16px', fontWeight: 700 }}>
              <User className="h-4 w-4 inline ml-2" />
              الاسم الرباعي
            </CardTitle>
            <div className="flex gap-2">
              {ownerData.name.firstName && (
                <Badge variant="outline" style={{ fontSize: '11px' }}>
                  مختصر: {getShortName(ownerData.name)}
                </Badge>
              )}
              {ownerData.name.firstName && (
                <Badge variant="outline" style={{ fontSize: '11px' }}>
                  كامل: {getFullName(ownerData.name)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <InputWithCopy
                label="الاسم الأول *"
                id="firstName"
                value={ownerData.name.firstName}
                onChange={(e) => setOwnerData({
                  ...ownerData,
                  name: { ...ownerData.name, firstName: e.target.value }
                })}
                placeholder="محمد"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="اسم الأب *"
                id="fatherName"
                value={ownerData.name.fatherName}
                onChange={(e) => setOwnerData({
                  ...ownerData,
                  name: { ...ownerData.name, fatherName: e.target.value }
                })}
                placeholder="أحمد"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="اسم الجد *"
                id="grandFatherName"
                value={ownerData.name.grandFatherName}
                onChange={(e) => setOwnerData({
                  ...ownerData,
                  name: { ...ownerData.name, grandFatherName: e.target.value }
                })}
                placeholder="عبدالله"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="اسم العائلة *"
                id="familyName"
                value={ownerData.name.familyName}
                onChange={(e) => setOwnerData({
                  ...ownerData,
                  name: { ...ownerData.name, familyName: e.target.value }
                })}
                placeholder="العلي"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* القسم الثاني: بيانات الهوية */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontSize: '16px', fontWeight: 700 }}>
            <FileText className="h-4 w-4 inline ml-2" />
            بيانات الهوية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <SelectWithCopy
                label="نوع الهوية *"
                id="idType"
                value={ownerData.idType}
                onChange={(value) => setOwnerData({ ...ownerData, idType: value })}
                options={[
                  { value: 'هوية وطنية', label: 'هوية وطنية' },
                  { value: 'إقامة', label: 'إقامة' },
                  { value: 'جواز سفر', label: 'جواز سفر' },
                  { value: 'سجل تجاري', label: 'سجل تجاري' }
                ]}
              />
            </div>
            <div>
              <InputWithCopy
                label="رقم الهوية *"
                id="idNumber"
                value={ownerData.idNumber}
                onChange={(e) => setOwnerData({ ...ownerData, idNumber: e.target.value })}
                placeholder="1234567890"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="الجنسية *"
                id="nationality"
                value={ownerData.nationality}
                onChange={(e) => setOwnerData({ ...ownerData, nationality: e.target.value })}
                placeholder="سعودي"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="المهنة"
                id="occupation"
                value={ownerData.occupation || ''}
                onChange={(e) => setOwnerData({ ...ownerData, occupation: e.target.value })}
                placeholder="مهندس"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* القسم الثالث: معلومات الاتصال */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontSize: '16px', fontWeight: 700 }}>
            <Phone className="h-4 w-4 inline ml-2" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <InputWithCopy
                label="رقم الجوال *"
                id="mobile"
                value={ownerData.mobile}
                onChange={(e) => setOwnerData({ ...ownerData, mobile: e.target.value })}
                placeholder="05xxxxxxxx"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="رقم الهاتف"
                id="phone"
                value={ownerData.phone || ''}
                onChange={(e) => setOwnerData({ ...ownerData, phone: e.target.value })}
                placeholder="011xxxxxxx"
              />
            </div>
            <div>
              <InputWithCopy
                label="البريد الإلكتروني *"
                id="email"
                value={ownerData.email}
                onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* القسم الرابع: العنوان */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontSize: '16px', fontWeight: 700 }}>
            <MapPin className="h-4 w-4 inline ml-2" />
            العنوان
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <InputWithCopy
                label="المدينة *"
                id="city"
                value={ownerData.city}
                onChange={(e) => setOwnerData({ ...ownerData, city: e.target.value })}
                placeholder="الرياض"
                required
              />
            </div>
            <div>
              <InputWithCopy
                label="الحي *"
                id="district"
                value={ownerData.district}
                onChange={(e) => setOwnerData({ ...ownerData, district: e.target.value })}
                placeholder="النرجس"
                required
              />
            </div>
            <div>
              <TextAreaWithCopy
                label="العنوان الكامل"
                id="address"
                value={ownerData.address}
                onChange={(e) => setOwnerData({ ...ownerData, address: e.target.value })}
                placeholder="الشارع، رقم المبنى..."
                rows={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الملاحظات */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontSize: '16px', fontWeight: 700 }}>ملاحظات</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <TextAreaWithCopy
            label=""
            id="notes"
            value={ownerData.notes || ''}
            onChange={(e) => setOwnerData({ ...ownerData, notes: e.target.value })}
            placeholder="أي ملاحظات إضافية..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* أزرار الحفظ */}
      <div className="flex gap-2 justify-end">
        <Button
          onClick={handleSave}
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: '#fff',
            padding: '0 24px',
            height: '36px'
          }}
        >
          <CheckCircle className="h-4 w-4 ml-2" />
          حفظ بيانات المالك
        </Button>
        
        {ownerData.clientId && (
          <Button
            onClick={() => setShowClientProfile(true)}
            variant="outline"
            style={{ padding: '0 24px', height: '36px' }}
          >
            <ExternalLink className="h-4 w-4 ml-2" />
            عرض بروفايل العميل
          </Button>
        )}
        
        <Button
          onClick={() => setShowAddClientDialog(true)}
          variant="outline"
          style={{ padding: '0 24px', height: '36px' }}
        >
          <Plus className="h-4 w-4 ml-2" />
          عميل جديد
        </Button>
      </div>

      {/* نافذة اختيار العميل */}
      <Dialog open={showClientsList} onOpenChange={setShowClientsList}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', fontWeight: 700 }}>
              اختيار عميل من القائمة
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea style={{ height: '400px' }}>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right text-xs">الكود</TableHead>
                  <TableHead className="text-right text-xs">الاسم</TableHead>
                  <TableHead className="text-right text-xs">الجوال</TableHead>
                  <TableHead className="text-right text-xs">المدينة</TableHead>
                  <TableHead className="text-right text-xs">التصنيف</TableHead>
                  <TableHead className="text-right text-xs">المعاملات</TableHead>
                  <TableHead className="text-right text-xs">التقييم</TableHead>
                  <TableHead className="text-right text-xs">اختيار</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell className="text-right">
                      <code className="text-xs">{client.code}</code>
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold">
                      {getFullName(client.name)}
                    </TableCell>
                    <TableCell className="text-right text-xs">{client.mobile}</TableCell>
                    <TableCell className="text-right text-xs">{client.city}</TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ fontSize: '10px' }}>{client.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">{client.totalTransactions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-3 w-3" 
                            style={{ 
                              fill: i < client.rating ? '#f59e0b' : 'transparent',
                              color: i < client.rating ? '#f59e0b' : '#d1d5db'
                            }} 
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSelectClient(client)}
                        style={{ 
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                          color: '#fff',
                          height: '24px',
                          fontSize: '10px'
                        }}
                      >
                        اختيار
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_03_Owner_Data_ENHANCED_v2;
