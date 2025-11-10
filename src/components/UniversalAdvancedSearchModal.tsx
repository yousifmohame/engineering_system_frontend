import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Search, 
  FileText,
  User,
  Home,
  Map,
  Grid,
  FileCheck,
  Building,
  Calendar,
  RefreshCw,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UniversalAdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (results: any) => void;
}

interface SearchCriteria {
  transactionNumber?: string;
  clientIdNumber?: string;
  ownershipDocumentNumber?: string;
  planNumber?: string;
  plotNumber?: string;
  serviceRequestNumber?: string;
  buildingLicenseNumber?: string;
  buildingLicenseYear?: string;
  dateFrom?: string;
  dateTo?: string;
}

const UniversalAdvancedSearchModal: React.FC<UniversalAdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    transactionNumber: '',
    clientIdNumber: '',
    ownershipDocumentNumber: '',
    planNumber: '',
    plotNumber: '',
    serviceRequestNumber: '',
    buildingLicenseNumber: '',
    buildingLicenseYear: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleInputChange = (field: keyof SearchCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // التحقق من أن المستخدم أدخل على الأقل معيار بحث واحد
    const hasAnyCriteria = Object.values(criteria).some(value => value && value.trim() !== '');
    
    if (!hasAnyCriteria) {
      toast.error('الرجاء إدخال معيار بحث واحد على الأقل');
      return;
    }

    // إزالة الحقول الفارغة
    const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key as keyof SearchCriteria] = value;
      }
      return acc;
    }, {} as SearchCriteria);

    console.log('Advanced Search Criteria:', cleanedCriteria);
    
    // محاكاة نتائج البحث
    const mockResults = {
      found: true,
      count: Math.floor(Math.random() * 10) + 1,
      criteria: cleanedCriteria,
      results: [
        {
          id: '1',
          type: 'معاملة',
          transactionNumber: criteria.transactionNumber || 'TXN-2025-001',
          clientName: 'م. أحمد محمد السالم',
          clientId: criteria.clientIdNumber || '1012345678',
          status: 'قيد المعالجة',
          date: new Date().toISOString()
        },
        {
          id: '2',
          type: 'مخطط',
          planNumber: criteria.planNumber || '3000/2025',
          district: 'حي النرجس',
          area: '750000 م²',
          status: 'نشط'
        }
      ]
    };

    toast.success(`تم العثور على ${mockResults.count} نتيجة`);
    onSearch(mockResults);
    onClose();
  };

  const handleReset = () => {
    setCriteria({
      transactionNumber: '',
      clientIdNumber: '',
      ownershipDocumentNumber: '',
      planNumber: '',
      plotNumber: '',
      serviceRequestNumber: '',
      buildingLicenseNumber: '',
      buildingLicenseYear: '',
      dateFrom: '',
      dateTo: ''
    });
    toast.info('تم مسح جميع معايير البحث');
  };

  const getActiveFiltersCount = () => {
    return Object.values(criteria).filter(value => value && value.trim() !== '').length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl dialog-rtl" dir="rtl">
        <DialogHeader className="dialog-header pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div>
                <DialogTitle className="dialog-title text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  البحث المتقدم الشامل
                </DialogTitle>
                <DialogDescription className="dialog-description text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ابحث في جميع أنحاء النظام باستخدام معايير متعددة
                </DialogDescription>
              </div>
            </div>
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {getActiveFiltersCount()} معيار نشط
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="form-rtl space-y-3 py-2">
            {/* الصف الأول: المعاملات والعملاء - 4 حقول */}
            <div className="grid grid-cols-4 gap-3">
              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  رقم المعاملة لدى المكتب
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: TXN-2025-0001"
                  value={criteria.transactionNumber}
                  onChange={(e) => handleInputChange('transactionNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  رقم هوية العميل
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: 1012345678"
                  value={criteria.clientIdNumber}
                  onChange={(e) => handleInputChange('clientIdNumber', e.target.value)}
                  maxLength={10}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  رقم مستند الملكية (الصك)
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: 123456789"
                  value={criteria.ownershipDocumentNumber}
                  onChange={(e) => handleInputChange('ownershipDocumentNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Map className="w-3.5 h-3.5 text-purple-600" />
                  رقم المخطط التنظيمي
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: 3000/2025"
                  value={criteria.planNumber}
                  onChange={(e) => handleInputChange('planNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>
            </div>

            {/* الصف الثاني: القطع والخدمات والرخص - 3 حقول + سنة */}
            <div className="grid grid-cols-4 gap-3">
              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Grid className="w-3.5 h-3.5 text-purple-600" />
                  رقم القطعة
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: 1234"
                  value={criteria.plotNumber}
                  onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  رقم طلب الخدمة
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: SRV-2025-0123"
                  value={criteria.serviceRequestNumber}
                  onChange={(e) => handleInputChange('serviceRequestNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Building className="w-3.5 h-3.5 text-green-600" />
                  رقم رخصة البناء
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: BLD-2025-7890"
                  value={criteria.buildingLicenseNumber}
                  onChange={(e) => handleInputChange('buildingLicenseNumber', e.target.value)}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="w-3.5 h-3.5 text-green-600" />
                  سنة رخصة البناء
                </Label>
                <Input
                  className="input-field text-sm h-9"
                  placeholder="مثال: 2025"
                  value={criteria.buildingLicenseYear}
                  onChange={(e) => handleInputChange('buildingLicenseYear', e.target.value)}
                  maxLength={4}
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>
            </div>

            <Separator className="my-2" />

            {/* نطاق التاريخ */}
            <div className="grid grid-cols-6 gap-3 items-end">
              <div className="col-span-2 form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  من تاريخ
                </Label>
                <Input
                  type="date"
                  className="input-field text-xs h-9"
                  value={criteria.dateFrom}
                  onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="col-span-2 form-group">
                <Label className="text-xs mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  إلى تاريخ
                </Label>
                <Input
                  type="date"
                  className="input-field text-xs h-9"
                  value={criteria.dateTo}
                  onChange={(e) => handleInputChange('dateTo', e.target.value)}
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    استخدم معيار واحد أو أكثر للبحث في جميع شاشات النظام
                  </p>
                </div>
              </div>
            </div>
          </div>

        <DialogFooter className="dialog-footer pt-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {getActiveFiltersCount() > 0 ? (
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5">
                    {getActiveFiltersCount()}
                  </Badge>
                  معيار للبحث
                </span>
              ) : (
                <span className="text-gray-400">لم يتم تحديد أي معايير بحث</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleReset}
                size="sm"
                className="h-9"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <RefreshCw className="h-3.5 w-3.5 ml-1.5" />
                مسح الكل
              </Button>
              <Button 
                onClick={handleSearch}
                size="sm"
                className="bg-[#10b981] hover:bg-[#059669] h-9"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Search className="h-3.5 w-3.5 ml-1.5" />
                بحث
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalAdvancedSearchModal;
