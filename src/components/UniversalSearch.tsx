import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { CodeDisplay } from './CodeDisplay';
import { 
  Search, 
  Settings, 
  FileText, 
  Users, 
  CreditCard, 
  Home, 
  Shield,
  Calendar,
  Filter
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'screen' | 'tab' | 'field' | 'transaction' | 'client' | 'deed' | 'permission' | 'document';
  icon: any;
  path: string;
  onClick?: () => void;
}

interface UniversalSearchProps {
  onNavigate?: (path: string) => void;
}

export function UniversalSearch({ onNavigate }: UniversalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    objectType: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all',
    owner: 'all'
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // بيانات وهمية للبحث
  const mockData: SearchResult[] = [
    { id: '1', title: 'إدارة المعاملات', subtitle: 'شاشة رئيسية', type: 'screen', icon: CreditCard, path: '/transactions' },
    { id: '2', title: 'البيانات الأساسية', subtitle: 'تاب - إدارة المعاملات', type: 'tab', icon: FileText, path: '/transactions/basic-info' },
    { id: '3', title: 'معلومات العميل', subtitle: 'تاب - إدارة المعاملات', type: 'tab', icon: Users, path: '/transactions/client-info' },
    { id: '4', title: 'معاملة TXN-2025-20-SE-0001', subtitle: 'أحمد محمد السعود - إصدار رخصة بناء', type: 'transaction', icon: CreditCard, path: '/transactions/TXN-2025-20-SE-0001' },
    { id: '5', title: 'أحمد محمد السعود', subtitle: 'عميل - رقم الهوية: 1234567890', type: 'client', icon: Users, path: '/clients/1234567890' },
    { id: '6', title: 'صك رقم 712345678', subtitle: 'حي النرجس - قطعة 1247', type: 'deed', icon: Home, path: '/deeds/712345678' },
    { id: '7', title: 'صلاحية البحث الشامل', subtitle: 'PERM-UNIV-SEARCH-ACCESS', type: 'permission', icon: Shield, path: '/permissions/univ-search' },
    { id: '8', title: 'مستند المخططات', subtitle: 'معاملة TXN-2025-20-SE-0001', type: 'document', icon: FileText, path: '/documents/plans-001' },
  ];

  // تأخير البحث 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsResultsVisible(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const filtered = mockData.filter(item => {
      const searchText = query.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchText);
      const subtitleMatch = item.subtitle.toLowerCase().includes(searchText);
      
      // تطبيق أنواع المطابقة
      const startsWithMatch = item.title.toLowerCase().startsWith(searchText);
      const endsWithMatch = item.title.toLowerCase().endsWith(searchText);
      const exactMatch = item.title.toLowerCase() === searchText;
      
      return titleMatch || subtitleMatch || startsWithMatch || endsWithMatch || exactMatch;
    }).slice(0, 10); // حد أقصى 10 نتائج

    setSearchResults(filtered);
    setIsResultsVisible(filtered.length > 0);
  };

  const generateSearchCode = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SRCH-${dateStr}-${timeStr}-${randomCode}`;
  };

  const handleResultClick = (result: SearchResult) => {
    const searchCode = generateSearchCode();
    console.log(`Search executed: ${searchCode} - ${result.title}`);
    
    if (result.onClick) {
      result.onClick();
    } else if (onNavigate) {
      onNavigate(result.path);
    }
    
    setIsResultsVisible(false);
    setSearchQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screen': return CreditCard;
      case 'tab': return FileText;
      case 'field': return Settings;
      case 'transaction': return CreditCard;
      case 'client': return Users;
      case 'deed': return Home;
      case 'permission': return Shield;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'screen': return 'شاشة';
      case 'tab': return 'تاب';
      case 'field': return 'حقل';
      case 'transaction': return 'معاملة';
      case 'client': return 'عميل';
      case 'deed': return 'صك';
      case 'permission': return 'صلاحية';
      case 'document': return 'مستند';
      default: return 'عنصر';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'screen': return 'bg-blue-100 text-blue-800';
      case 'tab': return 'bg-green-100 text-green-800';
      case 'field': return 'bg-purple-100 text-purple-800';
      case 'transaction': return 'bg-orange-100 text-orange-800';
      case 'client': return 'bg-cyan-100 text-cyan-800';
      case 'deed': return 'bg-emerald-100 text-emerald-800';
      case 'permission': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // إخفاء النتائج عند النقر خارج المكون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <CodeDisplay code="FLD-UNIV-SEARCH" position="bottom-right" />
      
      <div className="relative">
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="البحث الشامل في النظام..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-16 h-10 text-right"
          style={{ 
            width: '100%',
            height: '40px',
            fontSize: '14px',
            fontFamily: 'Tajawal, sans-serif'
          }}
        />
        
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent style={{ width: '600px', height: '400px' }}>
              <DialogHeader>
                <DialogTitle className="text-right">البحث المتقدم</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="object-type">نوع الكائن</Label>
                    <Select 
                      value={searchFilters.objectType} 
                      onValueChange={(value) => setSearchFilters(prev => ({ ...prev, objectType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="screen">الشاشات</SelectItem>
                        <SelectItem value="tab">التبويبات</SelectItem>
                        <SelectItem value="transaction">المعاملات</SelectItem>
                        <SelectItem value="client">العملاء</SelectItem>
                        <SelectItem value="deed">الصكوك</SelectItem>
                        <SelectItem value="document">المستندات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select 
                      value={searchFilters.status} 
                      onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-from">من تاريخ</Label>
                    <Input 
                      id="date-from"
                      type="date" 
                      value={searchFilters.dateFrom}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-to">إلى تاريخ</Label>
                    <Input 
                      id="date-to"
                      type="date" 
                      value={searchFilters.dateTo}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      performSearch(searchQuery);
                      setIsAdvancedSearchOpen(false);
                    }}
                    className="btn-primary"
                  >
                    <Search className="w-4 h-4 ml-2" />
                    بحث متقدم
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchFilters({
                        objectType: 'all',
                        dateFrom: '',
                        dateTo: '',
                        status: 'all',
                        owner: 'all'
                      });
                    }}
                    className="btn-secondary"
                  >
                    مسح الفلاتر
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* نتائج البحث المنسدلة */}
      {isResultsVisible && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((result) => {
                const TypeIcon = getTypeIcon(result.type);
                return (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleResultClick(result)}
                  >
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 text-right">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeBadgeColor(result.type)}`}
                    >
                      {getTypeLabel(result.type)}
                    </Badge>
                  </div>
                );
              })}
            </div>
            
            <div className="p-2 bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">
                {searchResults.length} من أصل {mockData.length} نتيجة
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}