import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import {
  Shield,
  Check,
  ChevronRight,
  ChevronDown,
  Loader2,
  Search
} from 'lucide-react';
import { Permission } from '../../../api/permissionApi'; // تأكد من أن المسار صحيح

// دالة لعرض التحميل
const renderLoading = (message: string = 'جاري تحميل البيانات...') => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
      <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{message}</p>
    </div>
  </div>
);

interface RolePermissionsTabProps {
  allPermissions: Permission[];
  assignedPermissionIds: string[];
  onSave: (newPermissionIds: string[]) => void;
  isLoading: boolean;
  isSaving: boolean;
  roleName: string;
}

const RolePermissionsTab: React.FC<RolePermissionsTabProps> = ({
  allPermissions,
  assignedPermissionIds,
  onSave,
  isLoading,
  isSaving,
  roleName
}) => {
  // استخدام Set لسرعة البحث والتعديل
  const [selectedIds, setSelectedIds] = useState(new Set(assignedPermissionIds));
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");

  // مزامنة الحالة الداخلية عند تغيير الدور المحدد
  useEffect(() => {
    setSelectedIds(new Set(assignedPermissionIds));
  }, [assignedPermissionIds]);

  const permissionsByCategory = useMemo(() => {
    const categoriesMap: Record<string, Permission[]> = {};
    allPermissions.forEach(perm => {
      const category = perm.category || 'غير مصنف';
      if (!categoriesMap[category]) categoriesMap[category] = [];
      categoriesMap[category].push(perm);
    });
    return Object.entries(categoriesMap).map(([category, permissions]) => ({
      category,
      permissions
    }));
  }, [allPermissions]);

  const filteredCategories = useMemo(() => {
    if (!filterText) return permissionsByCategory;
    
    return permissionsByCategory
      .map(({ category, permissions }) => ({
        category,
        permissions: permissions.filter(p => 
          p.name.includes(filterText) || p.code.toLowerCase().includes(filterText.toLowerCase())
        )
      }))
      .filter(c => c.permissions.length > 0);

  }, [permissionsByCategory, filterText]);
  
  const togglePermission = (permissionId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };
  
  const handleSaveClick = () => {
    onSave(Array.from(selectedIds));
  };

  const totalAssigned = selectedIds.size;
  const hasChanges = selectedIds.size !== assignedPermissionIds.length || 
                     assignedPermissionIds.some(id => !selectedIds.has(id));

  if (isLoading) return renderLoading('جاري تحميل الصلاحيات...');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          صلاحيات الدور: <strong>{roleName}</strong>
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-base px-3 py-1">
            {totalAssigned} / {allPermissions.length} صلاحية
          </Badge>
          <Button 
            size="sm" 
            className="h-8 text-xs bg-green-500"
            onClick={handleSaveClick}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? <Loader2 className="h-3 w-3 ml-1 animate-spin" /> : <Check className="h-3 w-3 ml-1" />}
            حفظ التغييرات
          </Button>
        </div>
      </div>
      
      {/* فلتر البحث */}
      <div className="relative">
        <Input 
          placeholder="ابحث عن صلاحية بالاسم أو الكود..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-8"
        />
        <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* قائمة الصلاحيات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredCategories.map(({ category, permissions }) => (
                <div key={category} className="border rounded-lg overflow-hidden">
                  <div
                    className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedCategories.includes(category) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {permissions.filter(p => selectedIds.has(p.id)).length} / {permissions.length}
                    </Badge>
                  </div>
                  
                  {expandedCategories.includes(category) && (
                    <div className="p-2 bg-white space-y-1">
                      {permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className={`p-2 border rounded cursor-pointer transition-all ${
                            selectedIds.has(perm.id)
                              ? 'bg-blue-50 border-blue-300'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => togglePermission(perm.id)}
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox 
                              checked={selectedIds.has(perm.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{perm.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono">{perm.code}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionsTab;