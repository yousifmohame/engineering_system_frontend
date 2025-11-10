import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  X, 
  Search, 
  Plus, 
  Trash2,
  Calendar,
  User,
  FileText,
  Tag,
  Settings
} from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (results: any[]) => void;
}

interface SearchCriteria {
  id: string;
  field: string;
  comparator: string;
  value: string;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  // Section "نوع العنصر" - Checkbox Group items
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Section "الحالة" - Dropdown
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Section "التصنيف" - Multi-select
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Section "تاريخ الإنشاء" - DateRangePicker
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // Section "المستخدم" - TextInput & Dropdown
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  
  // Section "المستندات" - Multi-select DocTypes
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  
  // Section "الكلمات المفتاحية" - Tag Input
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  
  // Section "معايير متقدمة" - Repeater rows
  const [advancedCriteria, setAdvancedCriteria] = useState<SearchCriteria[]>([]);

  const elementTypes = ['شاشة', 'تاب', 'صلاحية', 'معاملة', 'عميل', 'موظف'];
  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'frozen', label: 'متجمد' },
    { value: 'archived', label: 'مؤرشف' }
  ];

  const categories = [
    'المعاملات والعمليات',
    'إدارة العملاء',
    'الموارد البشرية',
    'إدارة المشاريع',
    'الإدارة المالية',
    'معلومات المكتب',
    'الجهات الخارجية',
    'التوثيق الرقمي',
    'التواصل والاتصالات',
    'إدارة النظام',
    'إدارة الوثائق',
    'المراقبة والمتابعة',
    'الجودة والامتثال',
    'التدريب والتطوير',
    'الأمان والحماية'
  ];

  const docTypes = [
    'تراخيص',
    'شهادات',
    'عقود',
    'تقارير فنية',
    'مخططات',
    'مستندات هوية',
    'فواتير',
    'إيصالات',
    'مراسلات',
    'قرارات إدارية'
  ];

  const userRoles = [
    'مهندس رئيسي',
    'مهندس مشروع',
    'محاسب',
    'موظف إداري',
    'مراجع',
    'مدير فرع',
    'مشرف جودة',
    'منسق عملاء'
  ];

  const criteriaFields = [
    'العنوان',
    'الوصف',
    'الكود',
    'تاريخ الإنشاء',
    'تاريخ التعديل',
    'المالك',
    'الحالة',
    'الأولوية',
    'النوع',
    'التصنيف'
  ];

  const comparators = [
    { value: 'equals', label: 'يساوي' },
    { value: 'contains', label: 'يحتوي على' },
    { value: 'starts_with', label: 'يبدأ بـ' },
    { value: 'ends_with', label: 'ينتهي بـ' },
    { value: 'greater_than', label: 'أكبر من' },
    { value: 'less_than', label: 'أصغر من' },
    { value: 'between', label: 'بين' },
    { value: 'not_equals', label: 'لا يساوي' }
  ];

  const toggleElementType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDocType = (docType: string) => {
    setSelectedDocTypes(prev => 
      prev.includes(docType) 
        ? prev.filter(d => d !== docType)
        : [...prev, docType]
    );
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords(prev => [...prev, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  const addAdvancedCriteria = () => {
    const newCriteria: SearchCriteria = {
      id: Date.now().toString(),
      field: criteriaFields[0],
      comparator: 'contains',
      value: ''
    };
    setAdvancedCriteria(prev => [...prev, newCriteria]);
  };

  const updateAdvancedCriteria = (id: string, field: keyof SearchCriteria, value: string) => {
    setAdvancedCriteria(prev => 
      prev.map(criteria => 
        criteria.id === id ? { ...criteria, [field]: value } : criteria
      )
    );
  };

  const removeAdvancedCriteria = (id: string) => {
    setAdvancedCriteria(prev => prev.filter(criteria => criteria.id !== id));
  };

  const handleSearch = () => {
    // جمع جميع معايير البحث
    const searchParams = {
      types: selectedTypes,
      status: selectedStatus,
      categories: selectedCategories,
      dateRange: { from: dateFrom, to: dateTo },
      user: { name: userName, role: userRole },
      docTypes: selectedDocTypes,
      keywords,
      advancedCriteria
    };

    console.log('Advanced Search Parameters:', searchParams);
    
    // محاكاة نتائج البحث
    const mockResults = [
      {
        id: '1',
        title: 'شاشة المعاملات الشاملة',
        type: 'شاشة',
        status: 'نشط',
        category: 'المعاملات والعمليات',
        owner: 'المهندس أحمد العلي',
        created: '2025-09-20',
        code: 'SCR-TRANSACTIONS'
      },
      {
        id: '2',
        title: 'تبويب العملاء الجدد',
        type: 'تاب',
        status: 'نشط',
        category: 'إدارة العملاء',
        owner: 'المحاسب سعد محمد',
        created: '2025-09-19',
        code: 'TAB-NEW-CLIENTS'
      }
    ];

    onSearch(mockResults);
    onClose();
  };

  const handleResetFields = () => {
    setSelectedTypes([]);
    setSelectedStatus('all');
    setSelectedCategories([]);
    setDateFrom('');
    setDateTo('');
    setUserName('');
    setUserRole('');
    setSelectedDocTypes([]);
    setKeywords([]);
    setCurrentKeyword('');
    setAdvancedCriteria([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal "AdvancedSearchModal": Frame width:600px height:500px background:#FFFFFF cornerRadius:8px padding:16px */}
      <DialogContent className="advanced-search-modal dialog-rtl">
        {/* Header: Text "بحث متقدم" font:Inter Bold size:18 align:center, Button "×" position:absolute top:16px right:16px */}
        <DialogHeader className="relative mb-6">
          <DialogTitle className="advanced-search-header">
            بحث متقدم
          </DialogTitle>
          
          <DialogDescription className="text-center text-sm text-gray-600 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            استخدم الخيارات أدناه لتخصيص بحثك والوصول للنتائج المطلوبة بسرعة ودقة
          </DialogDescription>
          
          {/* Button "×" position:absolute top:16px right:16px onClick:CloseModal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="advanced-search-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Body Layout: Create Grid layout columns:2 rows:auto gap:16px padding-top:40px */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: '40px',
            maxHeight: 'calc(500px - 140px)' // تقليل المساحة للـ header والـ footer
          }}
          onKeyDown={(e) => {
            // onKeyEnter in any field: Trigger "بحث" click
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              handleSearch();
            }
          }}
        >
          <div className="advanced-search-grid">
            {/* Left Column Fields */}
            <div className="space-y-4">
              {/* Section "نوع العنصر" - Checkbox Group items:[شاشة, تاب, صلاحية, معاملة, عميل, موظف] */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  نوع العنصر
                </Label>
                <div className="advanced-search-checkbox-group">
                  {elementTypes.map(type => (
                    <div key={type} className="advanced-search-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleElementType(type)}
                        className="rounded border-gray-300"
                      />
                      <label className="advanced-search-checkbox-item label">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section "الحالة" - Dropdown options:[نشط, متجمد, مؤرشف] */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  الحالة
                </Label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm input-field"
                  style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section "التصنيف" - Multi-select: load categories from API */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  التصنيف
                </Label>
                <div className="advanced-search-multiselect">
                  {categories.slice(0, 6).map(category => (
                    <div key={category} className="advanced-search-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300"
                      />
                      <label className="advanced-search-checkbox-item label text-xs">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section "تاريخ الإنشاء" - DateRangePicker labels:[من, إلى] */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  تاريخ الإنشاء
                </Label>
                <div className="advanced-search-date-range">
                  <div className="advanced-search-date-item">
                    <Label className="advanced-search-date-label">
                      من
                    </Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="advanced-search-date-item">
                    <Label className="advanced-search-date-label">
                      إلى
                    </Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="space-y-4">
              {/* Section "المستخدم" - TextInput "اسم المستخدم", Dropdown "الدور الوظيفي" */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  المستخدم
                </Label>
                <div className="space-y-2">
                  <Input
                    placeholder="اسم المستخدم"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field text-sm"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm input-field"
                    style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
                  >
                    <option value="">الدور الوظيفي</option>
                    {userRoles.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section "المستندات" - Multi-select DocTypes checkbox list */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  المستندات
                </Label>
                <div className="border border-gray-200 rounded-lg p-2 max-h-20 overflow-y-auto">
                  {docTypes.slice(0, 5).map(docType => (
                    <label key={docType} className="flex items-center gap-2 cursor-pointer text-xs mb-1">
                      <input
                        type="checkbox"
                        checked={selectedDocTypes.includes(docType)}
                        onChange={() => toggleDocType(docType)}
                        className="rounded border-gray-300"
                      />
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {docType}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section "الكلمات المفتاحية" - Tag Input component */}
              <div className="advanced-search-section">
                <Label className="advanced-search-section-title">
                  الكلمات المفتاحية
                </Label>
                <div className="space-y-2">
                  <div className="advanced-search-tag-input">
                    <Input
                      placeholder="أضف كلمة مفتاحية"
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      className="input-field text-sm flex-1"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addKeyword}
                      className="px-2"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="advanced-search-tags">
                    {keywords.map(keyword => (
                      <div 
                        key={keyword} 
                        className="advanced-search-tag"
                        onClick={() => removeKeyword(keyword)}
                      >
                        {keyword}
                        <X className="h-2 w-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section "معايير متقدمة" - Button "إضافة معيار" onClick:AddRow */}
              <div className="advanced-search-section">
                <div className="flex items-center justify-between">
                  <Label className="advanced-search-section-title">
                    معايير متقدمة
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addAdvancedCriteria}
                    className="text-xs"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Plus className="h-3 w-3" />
                    إضافة معيار
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-20 overflow-y-auto">
                  {advancedCriteria.map(criteria => (
                    <div key={criteria.id} className="advanced-search-criteria">
                      <select
                        value={criteria.field}
                        onChange={(e) => updateAdvancedCriteria(criteria.id, 'field', e.target.value)}
                      >
                        {criteriaFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                      
                      <select
                        value={criteria.comparator}
                        onChange={(e) => updateAdvancedCriteria(criteria.id, 'comparator', e.target.value)}
                      >
                        {comparators.map(comp => (
                          <option key={comp.value} value={comp.value}>{comp.label}</option>
                        ))}
                      </select>
                      
                      <input
                        value={criteria.value}
                        onChange={(e) => updateAdvancedCriteria(criteria.id, 'value', e.target.value)}
                        placeholder="القيمة"
                      />
                      
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAdvancedCriteria(criteria.id)}
                        className="p-1"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Divider full width, Buttons aligned right: Button "مسح" width:100px onClick:ResetFields, Button "بحث" width:120px color:#0066CC onClick:SubmitSearch */}
        <div className="advanced-search-footer">
          {/* Divider full width */}
          <Separator className="mb-4" />
          
          <div className="advanced-search-info">
            {selectedTypes.length > 0 && `${selectedTypes.length} نوع محدد • `}
            {keywords.length > 0 && `${keywords.length} كلمة مفتاحية • `}
            {advancedCriteria.length > 0 && `${advancedCriteria.length} معيار متقدم`}
          </div>
          
          {/* Buttons aligned right */}
          <div className="advanced-search-buttons">
            {/* Button "مسح" width:100px onClick:ResetFields */}
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFields}
              className="advanced-search-btn-reset"
            >
              مسح
            </Button>
            
            {/* Button "بحث" width:120px color:#0066CC onClick:SubmitSearch */}
            <Button
              type="button"
              onClick={handleSearch}
              className="advanced-search-btn-search"
            >
              <Search className="h-4 w-4" />
              بحث
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;