import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CodeDisplay } from './CodeDisplay';
import {
  Upload, Image, Stamp, PenTool, Download, Trash2, 
  CheckCircle, AlertTriangle, Building, Users, Copy, X
} from 'lucide-react';

interface StampSignature {
  id: string;
  name: string;
  type: 'stamp' | 'signature' | 'logo';
  imageUrl: string;
  branch: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  fileSize: number;
  dimensions: { width: number; height: number };
}

interface StampsAndSignaturesProps {
  onSelect?: (item: StampSignature) => void;
  allowMultiple?: boolean;
  showBranchFilter?: boolean;
}

export function StampsAndSignatures({ 
  onSelect, 
  allowMultiple = false, 
  showBranchFilter = true 
}: StampsAndSignaturesProps) {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedItems, setSelectedItems] = useState<StampSignature[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // بيانات نموذجية للأختام والتوقيعات
  const [stampsData, setStampsData] = useState<StampSignature[]>([
    {
      id: '1',
      name: 'ختم المكتب الرئيسي',
      type: 'stamp',
      imageUrl: '/stamps/main-office-stamp.png',
      branch: 'main',
      isActive: true,
      createdBy: 'م. أحمد السعود',
      createdAt: '2025-01-15',
      fileSize: 125000,
      dimensions: { width: 200, height: 200 }
    },
    {
      id: '2',
      name: 'توقيع المدير التنفيذي',
      type: 'signature',
      imageUrl: '/signatures/ceo-signature.png',
      branch: 'main',
      isActive: true,
      createdBy: 'م. سارة النمر',
      createdAt: '2025-01-10',
      fileSize: 85000,
      dimensions: { width: 300, height: 120 }
    },
    {
      id: '3',
      name: 'لوجو الشركة الرسمي',
      type: 'logo',
      imageUrl: '/logos/company-logo.png',
      branch: 'main',
      isActive: true,
      createdBy: 'إدارة العلامة التجارية',
      createdAt: '2025-01-01',
      fileSize: 250000,
      dimensions: { width: 400, height: 200 }
    },
    {
      id: '4',
      name: 'ختم فرع الرياض',
      type: 'stamp',
      imageUrl: '/stamps/riyadh-branch-stamp.png',
      branch: 'riyadh',
      isActive: true,
      createdBy: 'م. خالد المحمد',
      createdAt: '2025-01-12',
      fileSize: 115000,
      dimensions: { width: 180, height: 180 }
    },
    {
      id: '5',
      name: 'توقيع مدير فرع جدة',
      type: 'signature',
      imageUrl: '/signatures/jeddah-manager-signature.png',
      branch: 'jeddah',
      isActive: true,
      createdBy: 'م. فاطمة العتيبي',
      createdAt: '2025-01-08',
      fileSize: 78000,
      dimensions: { width: 280, height: 110 }
    }
  ]);

  const branches = [
    { id: 'main', name: 'المكتب الرئيسي', location: 'الرياض' },
    { id: 'riyadh', name: 'فرع الرياض', location: 'الرياض' },
    { id: 'jeddah', name: 'فرع جدة', location: 'جدة' },
    { id: 'dammam', name: 'فرع الدمام', location: 'الدمام' }
  ];

  const filteredStamps = showBranchFilter 
    ? stampsData.filter(item => selectedBranch === 'all' || item.branch === selectedBranch)
    : stampsData;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى رفع ملف صورة صالح (PNG, JPEG, JPG)');
        return;
      }

      // التحقق من حجم الملف (أقل من 5 ميجا)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. يجب أن يكون أقل من 5 ميجا');
        return;
      }

      setUploadFile(file);
    }
  };

  const handleSaveUpload = () => {
    if (!uploadFile) return;

    const newItem: StampSignature = {
      id: Date.now().toString(),
      name: uploadFile.name.replace(/\.[^/.]+$/, ""),
      type: activeTab === 'upload-stamp' ? 'stamp' : 'signature',
      imageUrl: URL.createObjectURL(uploadFile),
      branch: selectedBranch === 'all' ? 'main' : selectedBranch,
      isActive: true,
      createdBy: 'م. سارة النمر',
      createdAt: new Date().toISOString().split('T')[0],
      fileSize: uploadFile.size,
      dimensions: { width: 200, height: 150 }
    };

    setStampsData([...stampsData, newItem]);
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveTab('browse');
  };

  const handleSelect = (item: StampSignature) => {
    if (allowMultiple) {
      const exists = selectedItems.find(selected => selected.id === item.id);
      if (exists) {
        setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems([item]);
      onSelect?.(item);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stamp': return <Stamp className="w-4 h-4" />;
      case 'signature': return <PenTool className="w-4 h-4" />;
      case 'logo': return <Building className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stamp': return 'ختم';
      case 'signature': return 'توقيع';
      case 'logo': return 'لوجو';
      default: return 'غير محدد';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="relative">
      <CodeDisplay code="STAMPS-SIGNATURES-MGR" position="bottom-right" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stamp className="w-5 h-5" />
          إدارة الأختام والتوقيعات
        </CardTitle>
        {showBranchFilter && (
          <div className="flex items-center gap-4 mt-4">
            <Label htmlFor="branch-filter">الفرع:</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} - {branch.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">تصفح الموجود</TabsTrigger>
            <TabsTrigger value="upload-stamp">رفع ختم</TabsTrigger>
            <TabsTrigger value="upload-signature">رفع توقيع</TabsTrigger>
            <TabsTrigger value="upload-logo">رفع لوجو</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {selectedItems.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">العناصر المحددة ({selectedItems.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map(item => (
                    <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      {item.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelect(item)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStamps.map(item => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedItems.find(selected => selected.id === item.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        {selectedItems.find(selected => selected.id === item.id) && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getTypeIcon(item.type)}
                          <span className="ml-1">{getTypeLabel(item.type)}</span>
                        </Badge>
                        {item.isActive ? (
                          <Badge className="text-xs bg-green-100 text-green-800">نشط</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">غير نشط</Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>الفرع: {branches.find(b => b.id === item.branch)?.name}</p>
                        <p>الحجم: {formatFileSize(item.fileSize)}</p>
                        <p>الأبعاد: {item.dimensions.width}×{item.dimensions.height}</p>
                        <p>بواسطة: {item.createdBy}</p>
                        <p>التاريخ: {item.createdAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStamps.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد عناصر</h3>
                <p className="text-gray-500 mb-4">لا توجد أختام أو توقيعات في هذا الفرع</p>
                <Button onClick={() => setActiveTab('upload-stamp')}>
                  <Upload className="w-4 h-4 ml-1" />
                  رفع ختم جديد
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload-stamp" className="space-y-6">
            <div className="text-center">
              <Stamp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">رفع ختم جديد</h3>
              <p className="text-gray-500 mb-6">
                ارفع صورة ختم بجودة عالية (PNG, JPEG) - أقل من 5 ميجا
              </p>
            </div>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">انقر لرفع ختم</p>
              <p className="text-gray-500">أو اسحب واترك الملف هنا</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadFile && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{uploadFile.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.size)} • {uploadFile.type}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Label htmlFor="stamp-name">اسم الختم:</Label>
                        <Input
                          id="stamp-name"
                          defaultValue={uploadFile.name.replace(/\.[^/.]+$/, "")}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveUpload}>
                      <CheckCircle className="w-4 h-4 ml-1" />
                      حفظ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upload-signature" className="space-y-6">
            <div className="text-center">
              <PenTool className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">رفع توقيع جديد</h3>
              <p className="text-gray-500 mb-6">
                ارفع صورة توقيع واضحة (PNG, JPEG) - أقل من 5 ميجا
              </p>
            </div>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">انقر لرفع توقيع</p>
              <p className="text-gray-500">أو اسحب واترك الملف هنا</p>
            </div>

            {uploadFile && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <PenTool className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{uploadFile.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.size)} • {uploadFile.type}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Label htmlFor="signature-name">اسم التوقيع:</Label>
                        <Input
                          id="signature-name"
                          defaultValue={uploadFile.name.replace(/\.[^/.]+$/, "")}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveUpload}>
                      <CheckCircle className="w-4 h-4 ml-1" />
                      حفظ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upload-logo" className="space-y-6">
            <div className="text-center">
              <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">رفع لوجو جديد</h3>
              <p className="text-gray-500 mb-6">
                ارفع لوجو الشركة بجودة عالية (PNG, JPEG) - أقل من 5 ميجا
              </p>
            </div>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">انقر لرفع لوجو</p>
              <p className="text-gray-500">أو اسحب واترك الملف هنا</p>
            </div>

            {uploadFile && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{uploadFile.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.size)} • {uploadFile.type}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Label htmlFor="logo-name">اسم اللوجو:</Label>
                        <Input
                          id="logo-name"
                          defaultValue={uploadFile.name.replace(/\.[^/.]+$/, "")}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveUpload}>
                      <CheckCircle className="w-4 h-4 ml-1" />
                      حفظ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {allowMultiple && selectedItems.length > 0 && (
          <div className="flex gap-4 pt-4 border-t">
            <Button onClick={() => onSelect?.(selectedItems[0])}>
              <CheckCircle className="w-4 h-4 ml-1" />
              استخدام المحدد ({selectedItems.length})
            </Button>
            <Button variant="outline" onClick={() => setSelectedItems([])}>
              مسح التحديد
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}