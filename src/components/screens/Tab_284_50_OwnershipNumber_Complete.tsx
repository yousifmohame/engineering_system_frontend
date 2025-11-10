/**
 * ============================================================================
 * التاب 284-50 - رقم الملكية في معالجة المعاملات
 * ============================================================================
 * 
 * الوظيفة: ربط المعاملة برقم ملكية + عرض جميع البيانات المساحية
 * التكامل: مع الشاشة 800 v3.0
 * 
 * @version 1.0
 * @date 2025-11-03
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Home, Search, Edit, FileText, Users, MapPin, Ruler, Image, Map,
  CheckCircle, AlertCircle, Eye, Download, Printer, Copy, RefreshCw,
  Navigation, Compass, Camera, Layers, Save, X
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { toast } from 'sonner';

// ============================================================================
// واجهات البيانات
// ============================================================================

interface BoundaryData {
  direction: 'north' | 'south' | 'east' | 'west';
  length: number;
  description: string;
  neighborName?: string;
  neighborIdNumber?: string;
  neighborType: 'private' | 'public' | 'street' | 'passage' | 'empty';
}

interface OwnershipDocument {
  id: string;
  documentNumber: string;
  type: string;
  area: number;
  status: string;
  regaVerified: boolean;
}

interface OwnershipNumberData {
  id: string;
  internalNumber: string;      // OWN-2025-001
  officialNumber?: string;      // 310105040083
  documents: OwnershipDocument[];
  totalArea: number;
  totalBoundaryLength: number;
  boundaries: BoundaryData[];
  images: {
    landPhotos: { id: string; url: string; title: string }[];
    documentPhotos: { id: string; url: string; title: string }[];
    aerialPhoto?: { url: string; title: string };
  };
  surveyingData?: {
    surveyorName: string;
    surveyDate: string;
    measuredArea: number;
    accuracy: string;
    equipment: string;
    planUrl?: string;
  };
  ownersCount: number;
  mainLocation: string;
}

// ============================================================================
// بيانات وهمية
// ============================================================================

const MOCK_OWNERSHIP_NUMBERS: OwnershipNumberData[] = [
  {
    id: 'ON-001',
    internalNumber: 'OWN-2025-001',
    officialNumber: '310105040083',
    documents: [
      {
        id: 'DOC-001',
        documentNumber: '310105040083',
        type: 'صك إلكتروني',
        area: 450,
        status: 'verified',
        regaVerified: true
      }
    ],
    totalArea: 450,
    totalBoundaryLength: 90,
    boundaries: [
      {
        direction: 'north',
        length: 30,
        description: 'شارع 20م',
        neighborType: 'street'
      },
      {
        direction: 'south',
        length: 30,
        description: 'قطعة رقم 1522',
        neighborName: 'محمد أحمد السعيد',
        neighborIdNumber: '1023456789',
        neighborType: 'private'
      },
      {
        direction: 'east',
        length: 15,
        description: 'ممر عام 6م',
        neighborType: 'passage'
      },
      {
        direction: 'west',
        length: 15,
        description: 'قطعة رقم 1524',
        neighborName: 'خالد سعود العتيبي',
        neighborIdNumber: '1034567890',
        neighborType: 'private'
      }
    ],
    images: {
      landPhotos: [
        { id: 'LP-001', url: '#', title: 'منظر شمالي' },
        { id: 'LP-002', url: '#', title: 'منظر جنوبي' },
        { id: 'LP-003', url: '#', title: 'منظر شرقي' },
        { id: 'LP-004', url: '#', title: 'منظر غربي' }
      ],
      documentPhotos: [
        { id: 'DP-001', url: '#', title: 'صفحة 1 - الصك' },
        { id: 'DP-002', url: '#', title: 'صفحة 2 - الصك' }
      ],
      aerialPhoto: { url: '#', title: 'صورة جوية' }
    },
    surveyingData: {
      surveyorName: 'أحمد محمد المساحي',
      surveyDate: '2025-01-15',
      measuredArea: 450.25,
      accuracy: '±0.05م',
      equipment: 'Total Station Leica',
      planUrl: '#'
    },
    ownersCount: 1,
    mainLocation: 'الرياض - الملقا'
  },
  {
    id: 'ON-002',
    internalNumber: 'OWN-2025-004',
    officialNumber: '220345078945',
    documents: [
      {
        id: 'DOC-004',
        documentNumber: '220345078945',
        type: 'صك إلكتروني',
        area: 180.3,
        status: 'verified',
        regaVerified: true
      },
      {
        id: 'DOC-005',
        documentNumber: '220345078946',
        type: 'صك إلكتروني',
        area: 100,
        status: 'verified',
        regaVerified: true
      }
    ],
    totalArea: 280.3,
    totalBoundaryLength: 140,
    boundaries: [
      {
        direction: 'north',
        length: 40,
        description: 'شارع 25م',
        neighborType: 'street'
      },
      {
        direction: 'south',
        length: 40,
        description: 'قطعة 3420',
        neighborName: 'عبدالله أحمد الدوسري',
        neighborIdNumber: '1087654321',
        neighborType: 'private'
      },
      {
        direction: 'east',
        length: 30,
        description: 'قطعة 3422',
        neighborName: 'سعود محمد القحطاني',
        neighborIdNumber: '1098765432',
        neighborType: 'private'
      },
      {
        direction: 'west',
        length: 30,
        description: 'ممر عام 8م',
        neighborType: 'passage'
      }
    ],
    images: {
      landPhotos: [
        { id: 'LP-005', url: '#', title: 'منظر عام للقطعتين' },
        { id: 'LP-006', url: '#', title: 'القطعة الأولى' },
        { id: 'LP-007', url: '#', title: 'القطعة الثانية' }
      ],
      documentPhotos: [
        { id: 'DP-003', url: '#', title: 'صك 1 - صفحة 1' },
        { id: 'DP-004', url: '#', title: 'صك 2 - صفحة 1' }
      ],
      aerialPhoto: { url: '#', title: 'صورة جوية للقطعتين' }
    },
    surveyingData: {
      surveyorName: 'خالد سعيد الهندسي',
      surveyDate: '2025-01-20',
      measuredArea: 280.5,
      accuracy: '±0.08م',
      equipment: 'GPS RTK Survey',
      planUrl: '#'
    },
    ownersCount: 1,
    mainLocation: 'الرياض - النرجس'
  }
];

// ============================================================================
// Props
// ============================================================================

interface Props {
  transactionId: string;
  linkedOwnershipNumber?: string;
  onSave?: (ownershipNumber: string) => void;
}

// ============================================================================
// المكون الرئيسي
// ============================================================================

const Tab_284_50_OwnershipNumber_Complete: React.FC<Props> = ({
  transactionId,
  linkedOwnershipNumber,
  onSave
}) => {
  const [selectedOwnershipId, setSelectedOwnershipId] = useState<string>(linkedOwnershipNumber || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showEditOfficialDialog, setShowEditOfficialDialog] = useState(false);
  const [newOfficialNumber, setNewOfficialNumber] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // البحث عن رقم الملكية المختار
  const selectedOwnership = useMemo(() => {
    return MOCK_OWNERSHIP_NUMBERS.find(on => on.internalNumber === selectedOwnershipId);
  }, [selectedOwnershipId]);

  // تصفية نتائج البحث
  const filteredResults = useMemo(() => {
    if (!searchTerm) return MOCK_OWNERSHIP_NUMBERS;
    
    const term = searchTerm.toLowerCase();
    return MOCK_OWNERSHIP_NUMBERS.filter(on =>
      on.internalNumber.toLowerCase().includes(term) ||
      on.officialNumber?.toLowerCase().includes(term) ||
      on.mainLocation.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // اختيار رقم ملكية
  const handleSelectOwnership = (internalNumber: string) => {
    setSelectedOwnershipId(internalNumber);
    setShowSearchDialog(false);
    toast.success('تم ربط رقم الملكية بالمعاملة');
    onSave?.(internalNumber);
  };

  // تحديث الرقم الرسمي
  const handleUpdateOfficialNumber = () => {
    if (!newOfficialNumber.trim()) {
      toast.error('يرجى إدخال الرقم الرسمي الجديد');
      return;
    }
    if (!changeReason.trim()) {
      toast.error('يرجى إدخال سبب التغيير');
      return;
    }

    toast.success('تم تحديث الرقم الرسمي بنجاح');
    setShowEditOfficialDialog(false);
    setNewOfficialNumber('');
    setChangeReason('');
  };

  // دالة الاتجاه بالعربية
  const getDirectionLabel = (direction: string): string => {
    const labels: Record<string, string> = {
      north: 'شمال',
      south: 'جنوب',
      east: 'شرق',
      west: 'غرب'
    };
    return labels[direction] || direction;
  };

  // دالة نوع الجار
  const getNeighborTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      private: 'ملكية خاصة',
      public: 'ملكية عامة',
      street: 'شارع',
      passage: 'ممر',
      empty: 'أرض فضاء'
    };
    return labels[type] || type;
  };

  // عرض الصورة
  const handleViewImage = (image: { url: string; title: string }) => {
    setSelectedImage(image);
    setShowImageDialog(true);
  };

  return (
    <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-284-50" position="top-right" />

      {/* بطاقة الربط */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '16px' }}>
            <Home className="h-4 w-4 inline ml-2" />
            ربط رقم الملكية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!selectedOwnership ? (
            <Alert style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <p className="font-bold text-yellow-900 mb-1">لم يتم ربط رقم ملكية</p>
                <p className="text-xs text-yellow-800">
                  يرجى البحث عن رقم ملكية وربطه بهذه المعاملة للحصول على البيانات الكاملة.
                </p>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <InputWithCopy
                label="رقم الملكية"
                id="ownership-search"
                value={selectedOwnership?.internalNumber || ''}
                onChange={() => {}}
                placeholder="ابحث عن رقم ملكية..."
                disabled
                copyable={!!selectedOwnership}
                clearable={false}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button 
                onClick={() => setShowSearchDialog(true)}
                style={{ height: '40px', flex: 1, background: '#2563eb', color: '#fff' }}
              >
                <Search className="h-3 w-3 ml-1" />
                بحث
              </Button>
            </div>
          </div>

          {selectedOwnership && (
            <div className="grid grid-cols-2 gap-2">
              <Card style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                <CardContent className="p-3 text-center">
                  <Home className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-600 mb-0.5">الرقم الداخلي</p>
                  <p className="text-sm font-mono font-bold text-blue-900">
                    {selectedOwnership.internalNumber}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0"
                      onClick={() => setShowEditOfficialDialog(true)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-0.5">الرقم الرسمي</p>
                  <p className="text-sm font-mono font-bold text-yellow-900">
                    {selectedOwnership.officialNumber || 'غير محدد'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOwnership && (
        <>
          {/* بطاقات المعلومات الأساسية */}
          <div className="grid grid-cols-4 gap-2">
            <Card style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
              <CardContent className="p-3 text-center">
                <FileText className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-gray-600 mb-0.5">عدد الوثائق</p>
                <p className="text-xl font-bold text-green-900">{selectedOwnership.documents.length}</p>
              </CardContent>
            </Card>

            <Card style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
              <CardContent className="p-3 text-center">
                <Layers className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                <p className="text-xs text-gray-600 mb-0.5">المساحة الكلية</p>
                <p className="text-sm font-bold text-yellow-900">{selectedOwnership.totalArea} م²</p>
              </CardContent>
            </Card>

            <Card style={{ background: '#e0e7ff', border: '2px solid #c7d2fe' }}>
              <CardContent className="p-3 text-center">
                <Ruler className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
                <p className="text-xs text-gray-600 mb-0.5">إجمالي الأطوال</p>
                <p className="text-sm font-bold text-indigo-900">{selectedOwnership.totalBoundaryLength} م</p>
              </CardContent>
            </Card>

            <Card style={{ background: '#fce7f3', border: '2px solid #f9a8d4' }}>
              <CardContent className="p-3 text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-pink-600" />
                <p className="text-xs text-gray-600 mb-0.5">عدد الملاك</p>
                <p className="text-xl font-bold text-pink-900">{selectedOwnership.ownersCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* جدول الوثائق */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '14px' }}>
                📋 الوثائق المرتبطة ({selectedOwnership.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs">رقم الوثيقة</TableHead>
                    <TableHead className="text-right text-xs">النوع</TableHead>
                    <TableHead className="text-right text-xs">المساحة</TableHead>
                    <TableHead className="text-right text-xs">الحالة</TableHead>
                    <TableHead className="text-right text-xs">REGA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOwnership.documents.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">
                          {doc.documentNumber}
                        </code>
                      </TableCell>
                      <TableCell className="text-right text-xs">{doc.type}</TableCell>
                      <TableCell className="text-right text-xs font-semibold">
                        {doc.area} م²
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={doc.status === 'verified' ? 'bg-blue-500' : 'bg-green-500'}>
                          {doc.status === 'verified' ? 'موثق' : 'نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.regaVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* الحدود والجيران */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '14px' }}>
                🧭 الحدود والجيران (4 جهات)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs">الاتجاه</TableHead>
                    <TableHead className="text-right text-xs">الطول</TableHead>
                    <TableHead className="text-right text-xs">الوصف</TableHead>
                    <TableHead className="text-right text-xs">الجار</TableHead>
                    <TableHead className="text-right text-xs">النوع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOwnership.boundaries.map((boundary, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Compass className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-bold">
                            {getDirectionLabel(boundary.direction)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold">
                        {boundary.length} م
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {boundary.description}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {boundary.neighborName ? (
                          <div>
                            <p className="font-semibold">{boundary.neighborName}</p>
                            <p className="text-[10px] text-gray-500 font-mono">
                              {boundary.neighborIdNumber}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {getNeighborTypeLabel(boundary.neighborType)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow style={{ background: '#f8fafc' }}>
                    <TableCell className="text-right font-bold text-xs" colSpan={2}>
                      الإجمالي: {selectedOwnership.totalBoundaryLength} م
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* معرض الصور */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '14px' }}>
                📸 معرض الصور
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {/* صور طبيعة الأرض */}
                <div>
                  <p className="text-xs font-bold mb-2 text-gray-700">صور طبيعة الأرض:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedOwnership.images.landPhotos.map((photo, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => handleViewImage(photo)}
                      >
                        <Camera className="h-5 w-5 mb-1 text-blue-600" />
                        <span className="text-[10px]">{photo.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* صور المستندات */}
                <div>
                  <p className="text-xs font-bold mb-2 text-gray-700">صور المستندات:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedOwnership.images.documentPhotos.map((photo, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => handleViewImage(photo)}
                      >
                        <FileText className="h-5 w-5 mb-1 text-green-600" />
                        <span className="text-[10px]">{photo.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* الصورة الجوية */}
                {selectedOwnership.images.aerialPhoto && (
                  <div>
                    <p className="text-xs font-bold mb-2 text-gray-700">الصورة الجوية:</p>
                    <Button
                      variant="outline"
                      className="h-24 w-full flex flex-col items-center justify-center"
                      onClick={() => handleViewImage(selectedOwnership.images.aerialPhoto!)}
                    >
                      <Map className="h-6 w-6 mb-1 text-purple-600" />
                      <span className="text-xs">{selectedOwnership.images.aerialPhoto.title}</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* البيانات المساحية */}
          {selectedOwnership.surveyingData && (
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: '14px' }}>
                  📐 البيانات المساحية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600 mb-1">المساح:</p>
                    <p className="font-semibold">{selectedOwnership.surveyingData.surveyorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">تاريخ القياس:</p>
                    <p className="font-semibold">{selectedOwnership.surveyingData.surveyDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">المساحة المقاسة:</p>
                    <p className="font-semibold">{selectedOwnership.surveyingData.measuredArea} م²</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">الدقة:</p>
                    <p className="font-semibold">{selectedOwnership.surveyingData.accuracy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">الجهاز المستخدم:</p>
                    <p className="font-semibold">{selectedOwnership.surveyingData.equipment}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">المخطط المساحي:</p>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Download className="h-3 w-3 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <Printer className="h-3 w-3 ml-1" />
              طباعة التقرير
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 ml-1" />
              تصدير PDF
            </Button>
            <Button size="sm" style={{ background: '#10b981', color: '#fff' }}>
              <Save className="h-3 w-3 ml-1" />
              حفظ الربط
            </Button>
          </div>
        </>
      )}

      {/* نافذة البحث */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              <Search className="h-5 w-5 inline ml-2" />
              البحث عن رقم ملكية
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <InputWithCopy
              label=""
              id="search-term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الملكية الداخلي أو الرسمي أو الموقع..."
              copyable={false}
              clearable={true}
            />

            <ScrollArea style={{ height: '400px' }}>
              <div className="space-y-2">
                {filteredResults.map((on) => (
                  <Card
                    key={on.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handleSelectOwnership(on.internalNumber)}
                    style={{ borderColor: selectedOwnershipId === on.internalNumber ? '#2563eb' : '#e5e7eb' }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">
                              {on.internalNumber}
                            </code>
                            {on.officialNumber && (
                              <code className="text-xs bg-yellow-100 px-2 py-1 rounded font-mono">
                                {on.officialNumber}
                              </code>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">الموقع: </span>
                              <span className="font-semibold">{on.mainLocation}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">الوثائق: </span>
                              <span className="font-semibold">{on.documents.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">المساحة: </span>
                              <span className="font-semibold">{on.totalArea} م²</span>
                            </div>
                            <div>
                              <span className="text-gray-600">الملاك: </span>
                              <span className="font-semibold">{on.ownersCount}</span>
                            </div>
                          </div>
                        </div>
                        {selectedOwnershipId === on.internalNumber && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSearchDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل الرقم الرسمي */}
      <Dialog open={showEditOfficialDialog} onOpenChange={setShowEditOfficialDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              <Edit className="h-5 w-5 inline ml-2" />
              تحديث الرقم الرسمي
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Alert style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-xs">
                تحديث الرقم الرسمي يتم عند نقل الملكية أو تعديل بيانات الوثيقة من الجهات الرسمية.
                سيتم حفظ التغيير في سجل التاريخ.
              </AlertDescription>
            </Alert>

            <InputWithCopy
              label="الرقم الرسمي القديم"
              id="old-official"
              value={selectedOwnership?.officialNumber || 'غير محدد'}
              onChange={() => {}}
              disabled
              copyable={!!selectedOwnership?.officialNumber}
              clearable={false}
            />

            <InputWithCopy
              label="الرقم الرسمي الجديد *"
              id="new-official"
              value={newOfficialNumber}
              onChange={(e) => setNewOfficialNumber(e.target.value)}
              placeholder="أدخل الرقم الرسمي الجديد"
              required
              copyable={false}
              clearable={true}
            />

            <SelectWithCopy
              label="سبب التغيير *"
              id="change-reason"
              value={changeReason}
              onChange={setChangeReason}
              options={[
                { value: '', label: 'اختر السبب' },
                { value: 'transfer', label: 'نقل ملكية' },
                { value: 'correction', label: 'تصحيح خطأ' },
                { value: 'update', label: 'تحديث من الجهة الرسمية' },
                { value: 'merge', label: 'دمج وثائق' },
                { value: 'split', label: 'تقسيم وثيقة' },
                { value: 'other', label: 'أخرى' }
              ]}
              required
              copyable={false}
              clearable={false}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditOfficialDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateOfficialNumber} style={{ background: '#10b981', color: '#fff' }}>
              <Save className="h-3 w-3 ml-1" />
              حفظ التحديث
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة عرض الصورة */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              {selectedImage?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height: '500px' }}>
            <div className="text-center text-gray-500">
              <Camera className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p className="text-sm">معاينة الصورة</p>
              <p className="text-xs">{selectedImage?.title}</p>
              <p className="text-xs text-gray-400 mt-2">
                سيتم عرض الصورة هنا بعد الرفع
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              إغلاق
            </Button>
            <Button variant="outline">
              <Download className="h-3 w-3 ml-1" />
              تحميل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_50_OwnershipNumber_Complete;
