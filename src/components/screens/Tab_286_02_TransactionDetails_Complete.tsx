/**
 * التاب 286-02 - اختيار نوع المعاملة (v3.0 - متصل بالخلفية)
 * =========================================================
 *
 * المميزات:
 * - [مُفعل] جلب بيانات القوالب (Transaction Types) مباشرة من الـ Backend.
 * - [مُفعل] استخدام useMutation لتحديث المعاملة عند اختيار النوع.
 * - [مُفعل] الاحتفاظ بالواجهة المفصلة (الكروت، التفاصيل، البحث، الفلترة).
 * - [مُفعل] عرض حالات التحميل (Loading) والخطأ (Error) والحالة الأولية (Initial).
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'; //
import { Badge } from '../ui/badge'; //
import { Button } from '../ui/button'; //
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'; //
import { ScrollArea } from '../ui/scroll-area'; //
import {
  Target, FileText, Clock, DollarSign, CheckCircle, AlertCircle,
  Users, Building, MapPin, Briefcase, Settings, Calendar, Eye,
  ChevronRight, Search, Filter, X, List, Layers, Shield, Hash,
  TrendingUp, Activity, FileCheck, Paperclip, Info, Loader2
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay'; //
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy'; //
import { Skeleton } from '../ui/skeleton'; //

// --- 1. استيراد دوال الـ API والأنواع ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
import { getFullTransactionTypes, updateTransactionType } from '../../api/transactionApi'; //
import { 
  TransactionType, 
  TransactionUpdateData, 
  TransactionTask, 
  TransactionFee, 
  TransactionStage 
} from '../../types/transactionTypes'; //


interface Props {
  transactionId: string | 'new';
  onTypeSelected: () => void; // دالة للانتقال للتبويب التالي
}

const Tab_286_02_TransactionDetails_Complete: React.FC<Props> = ({ 
  transactionId,
  onTypeSelected 
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);


  // --- 2. التحقق من الـ ID (قبل جلب البيانات) ---
  if (transactionId === 'new') {
    return (
      <Card className="card-element card-rtl">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-60">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg">الخطوة 2: اختيار نوع المعاملة</h3>
          <p className="text-sm text-gray-600 mt-1">
            يجب حفظ "المعلومات الأساسية" في التبويب الأول أولاً.
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- 3. جلب البيانات (Read) - (استبدال البيانات التجريبية) ---
  const { data: transactionTypes, isLoading, isError } = useQuery<TransactionType[]>({
    queryKey: ['fullTransactionTypes'], // (جلب البيانات الكاملة)
    queryFn: getFullTransactionTypes, //
  });

  // --- 4. عملية الحفظ (Update) ---
  const updateMutation = useMutation({
    mutationFn: (typeId: string) => updateTransactionType(
      transactionId, 
      { transactionTypeId: typeId } as Partial<TransactionUpdateData>
    ),
    onSuccess: (updatedData) => {
      // toast.success("تم تحديد نوع المعاملة بنجاح");
      // تحديث بيانات المعاملة في الـ cache
      queryClient.setQueryData(['transaction', transactionId], updatedData);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      // الانتقال للتبويب التالي
      onTypeSelected();
    },
    onError: (error: Error) => {
      // toast.error(`فشل تحديد النوع: ${error.message}`);
      setSelectedTypeId(null); // إلغاء الاختيار عند الفشل
    }
  });

  // --- 5. منطق الفلترة (يستخدم البيانات من useQuery) ---
  const filteredTypes = useMemo(() => {
    if (!transactionTypes) return [];
    return transactionTypes.filter(type => {
      const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (type.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || type.category === filterCategory;
      const matchesComplexity = filterComplexity === 'all' || type.complexity === filterComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [transactionTypes, searchTerm, filterCategory, filterComplexity]);

  // (دوال مساعدة كما هي)
  const getComplexityColor = (complexity: string | null | undefined) => {
    switch (complexity) {
      case 'simple': return { bg: '#dcfce7', text: '#065f46', label: 'بسيط' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e', label: 'متوسط' };
      case 'complex': return { bg: '#fee2e2', text: '#991b1b', label: 'معقد' };
      default: return { bg: '#f3f4f6', text: '#374151', label: 'غير محدد' };
    }
  };

  const handleSelect = (typeId: string) => {
    setSelectedTypeId(typeId);
    updateMutation.mutate(typeId);
  };

  // --- 6. واجهة المستخدم (Render) ---

  // (حالة التحميل)
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="p-4"><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardContent className="p-4"><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  // (حالة الخطأ)
  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-destructive">فشل تحميل قوالب المعاملات</h3>
        </CardContent>
      </Card>
    );
  }

  // (الحالة الطبيعية)
  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-02" position="top-right" />
      
      {/* الهيدر مع البحث والتصفية */}
      <Card className="card-rtl" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '2px solid #0ea5e9'
      }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                <Target className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>
                  تفاصيل أنواع المعاملات
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  اختر نوع المعاملة المناسب مع معاينة التفاصيل الكاملة
                </p>
              </div>
            </div>
            
            <Badge style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              {filteredTypes.length} نوع متاح
            </Badge>
          </div>

          {/* البحث والفلتر */}
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy
              label="بحث"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن نوع المعاملة..."
              copyable={false}
              clearable
            />
            
            <SelectWithCopy
              label="التصنيف"
              id="category"
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: 'all', label: 'جميع التصنيفات' },
                { value: 'licenses', label: 'التراخيص' },
                { value: 'properties', label: 'العقارات' },
                { value: 'consultations', label: 'الاستشارات' },
                { value: 'supervision', label: 'الإشراف' },
                { value: 'design', label: 'التصميم' },
                { value: 'surveying', label: 'المساحة' },
                { value: 'other', label: 'أخرى' }
              ]}
              copyable={false}
              clearable={false}
            />
            
            <SelectWithCopy
              label="مستوى التعقيد"
              id="complexity"
              value={filterComplexity}
              onChange={setFilterComplexity}
              options={[
                { value: 'all', label: 'جميع المستويات' },
                { value: 'simple', label: 'بسيط' },
                { value: 'medium', label: 'متوسط' },
                { value: 'complex', label: 'معقد' }
              ]}
              copyable={false}
              clearable={false}
            />
          </div>
        </CardContent>
      </Card>

      <ScrollArea style={{ height: 'calc(100vh - 280px)' }}>
        <div className="space-y-4 pl-4">
          
          {/* البطاقات التفاعلية */}
          <div className="grid grid-cols-2 gap-4">
            {filteredTypes.map((type) => {
              const complexityColor = getComplexityColor(type.complexity);
              const isSelected = selectedTypeId === type.id;
              const isExpanded = showDetailsId === type.id;
              
              return (
                <Card 
                  key={type.id} 
                  className="card-rtl"
                  style={{ 
                    background: isSelected 
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge style={{
                            background: complexityColor.bg,
                            color: complexityColor.text,
                            fontSize: '10px',
                            padding: '2px 8px'
                          }}>
                            {complexityColor.label}
                          </Badge>
                          <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {type.code}
                          </Badge>
                          <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {type.categoryAr}
                          </Badge>
                        </div>
                        <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                          {type.name}
                        </CardTitle>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* المعلومات الأساسية */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" style={{ color: '#3b82f6' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>المدة</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.duration || 0} يوم
                        </p>
                      </div>
                      
                      <div className="p-2" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3" style={{ color: '#10b981' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>التكلفة</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.estimatedCost?.toLocaleString() || 0} ر.س
                        </p>
                      </div>
                      
                      <div className="p-2" style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="h-3 w-3" style={{ color: '#f59e0b' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>المهام</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.tasks?.length || 0} مهمة
                        </p>
                      </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowDetailsId(isExpanded ? null : type.id)}
                        variant="outline"
                        style={{ flex: 1, fontSize: '12px' }}
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                      </Button>
                      <Button
                        onClick={() => handleSelect(type.id)}
                        disabled={updateMutation.isPending}
                        style={{
                          flex: 1,
                          fontSize: '12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff'
                        }}
                      >
                        {isSelected && updateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3 ml-1" />
                        )}
                        {isSelected && updateMutation.isPending ? 'جاري الاختيار...' : 'اختيار'}
                      </Button>
                    </div>

                    {/* التفاصيل الموسعة */}
                    {isExpanded && (
                      <div className="space-y-3 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                        
                        {/* المهام */}
                        {type.tasks && type.tasks.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <List className="h-4 w-4 inline ml-1" />
                              المهام ({type.tasks.length})
                            </h4>
                            <div className="space-y-1">
                              {type.tasks.map((task, index) => (
                                <div key={task.id || index} className="p-2" style={{ 
                                  background: '#f8fafc', 
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge style={{ 
                                        fontSize: '9px', 
                                        padding: '1px 4px',
                                        background: '#3b82f6',
                                        color: '#ffffff'
                                      }}>
                                        {index + 1}
                                      </Badge>
                                      <span style={{ fontSize: '11px', color: '#1f2937' }}>
                                        {task.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {task.duration} يوم
                                      </Badge>
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {task.role}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* المستندات */}
                        {type.documents && type.documents.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Paperclip className="h-4 w-4 inline ml-1" />
                              المستندات المطلوبة ({type.documents.length})
                            </h4>
                            <div className="grid grid-cols-2 gap-1">
                              {type.documents.map((doc, index) => (
                                <div key={index} className="p-2" style={{ 
                                  background: '#f0fdf4', 
                                  borderRadius: '6px',
                                  border: '1px solid #bbf7d0'
                                }}>
                                  <span style={{ fontSize: '11px', color: '#065f46' }}>
                                    • {doc}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* الجهات */}
                        {type.authorities && type.authorities.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Building className="h-4 w-4 inline ml-1" />
                              الجهات ذات العلاقة ({type.authorities.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {type.authorities.map((auth, index) => (
                                <Badge key={index} variant="outline" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                  {auth}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* الرسوم */}
                        {type.fees && type.fees.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <DollarSign className="h-4 w-4 inline ml-1" />
                              الرسوم المتوقعة
                            </h4>
                            <Table className="table-rtl dense-table">
                              <TableBody>
                                {type.fees.map((fee, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="text-right py-1" style={{ fontSize: '11px' }}>
                                      {fee.name}
                                      {fee.required && <span style={{ color: '#ef4444' }}> *</span>}
                                    </TableCell>
                                    <TableCell className="text-right py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                                      {fee.amount.toLocaleString()} ر.س
                                    </TableCell>
                                    <TableCell className="text-right py-1" style={{ fontSize: '10px', color: '#64748b' }}>
                                      {fee.authority}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* المراحل */}
                        {type.stages && type.stages.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Layers className="h-4 w-4 inline ml-1" />
                              المراحل ({type.stages.length})
                            </h4>
                            <div className="space-y-1">
                              {type.stages.map((stage, index) => (
                                <div key={stage.id || index} className="p-2" style={{ 
                                  background: '#fef3c7', 
                                  borderRadius: '6px',
                                  border: '1px solid #fde68a'
                                }}>
                                  <div className="flex items-center justify-between">
                                    <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
                                      {index + 1}. {stage.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Badge style={{ 
                                        fontSize: '9px', 
                                        padding: '1px 4px',
                                        background: '#f59e0b',
                                        color: '#ffffff'
                                      }}>
                                        {stage.duration} يوم
                                      </Badge>
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {stage.tasks} مهام
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* التحذيرات */}
                        {type.warnings && type.warnings.length > 0 && (
                          <div className="p-3" style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            borderRadius: '8px',
                            border: '1px solid #ef4444'
                          }}>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4" style={{ color: '#ef4444', flexShrink: 0 }} />
                              <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b', margin: '0 0 4px 0' }}>
                                  تحذيرات هامة:
                                </h4>
                                <ul style={{ fontSize: '11px', color: '#991b1b', margin: 0, padding: '0 0 0 16px' }}>
                                  {type.warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* الملاحظات */}
                        {type.notes && type.notes.length > 0 && (
                          <div className="p-3" style={{ 
                            background: 'rgba(59, 130, 246, 0.1)', 
                            borderRadius: '8px',
                            border: '1px solid #3b82f6'
                          }}>
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4" style={{ color: '#3b82f6', flexShrink: 0 }} />
                              <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', margin: '0 0 4px 0' }}>
                                  ملاحظات:
                                </h4>
                                <ul style={{ fontSize: '11px', color: '#1e40af', margin: 0, padding: '0 0 0 16px' }}>
                                  {type.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* لا توجد نتائج */}
          {filteredTypes.length === 0 && (
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#94a3b8' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', margin: '0 0 8px 0' }}>
                  لا توجد نتائج
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  جرب تغيير معايير البحث أو الفلتر
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_286_02_TransactionDetails_Complete;