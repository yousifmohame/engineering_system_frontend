/**
 * TAB: Brief Request Purpose (v5.0 - Full Dynamic Backend)
 * =========================================================
 *
 * Function:
 * - [NEW] Fetches available purposes from global settings (API).
 * - [Enabled] Fetch transaction data (transactionId) from server.
 * - [NEW] Merges global list with saved data (transaction.requestPurposes).
 * - [NEW] Works in 'NEW' mode (for creation) and 'EDIT' mode (for updates).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { CheckSquare, Square, Save, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { Skeleton } from '../ui/skeleton';

// --- 1. Import API functions and types ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';

// --- [Modified] ---
import { getTransactionById, updateTransaction } from '../../api/transactionApi'; 
import { Transaction, TransactionUpdateData } from '../../types/transactionTypes'; 
// Import the new function from our settings API
import { getRequestPurposes } from '../../api/settingsApi'; 
// --------------------


// ==================== Interfaces ====================

// This interface now matches our Prisma Model
interface BriefPurpose {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  isSelected: boolean; // This is client-side state
  color: string;
  icon: string;
}

interface TabProps {
  transactionId?: string;
  onSave?: (purposes: BriefPurpose[]) => void;
  readOnly?: boolean;
}

// ==================== Main Component ====================

const Tab_RequestPurpose_Brief_Complete: React.FC<TabProps> = ({
  transactionId = 'NEW',
  onSave,
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  // Start with an empty array, data will be loaded from API
  const [purposes, setPurposes] = useState<BriefPurpose[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // --- [Query 1] Fetch current transaction data (if editing) ---
  const { 
    data: transaction, 
    isLoading: isLoadingTransaction, 
    isError: isErrorTransaction 
  } = useQuery<Transaction>({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: transactionId !== 'NEW', // Don't try to fetch if it's a new transaction
  });

  // --- [Query 2] Fetch the global list of purposes from settings ---
  const { 
    data: globalPurposes, 
    isLoading: isLoadingPurposes, 
    isError: isErrorPurposes 
  } = useQuery<BriefPurpose[]>({
    queryKey: ['requestPurposes', 'brief'], // Cache key for brief purposes
    queryFn: () => getRequestPurposes('brief'), // Use the new API function
    staleTime: 1000 * 60 * 5, // Cache this list for 5 minutes
  });

  // --- [Modified] Merge global list with saved data ---
  useEffect(() => {
    // Wait until the global list is loaded
    if (globalPurposes) {
      
      // Get the saved selections (if any) from the transaction
      const savedPurposes = (transaction?.requestPurposes || []) as BriefPurpose[];

      // Merge the global list with the saved selections
      const mergedPurposes = globalPurposes.map(globalPurpose => ({
        ...globalPurpose,
        // Check if this ID exists in the saved list AND isSelected is true
        isSelected: savedPurposes.some(saved => saved.id === globalPurpose.id && saved.isSelected)
      }));
      
      setPurposes(mergedPurposes);
    }
  }, [transaction, globalPurposes]); // Re-run when transaction or global purposes load

  // --- [Save data] ---
  const updateMutation = useMutation({
    mutationFn: (updatedPurposes: BriefPurpose[]) => 
      updateTransaction(transactionId, { requestPurposes: updatedPurposes } as Partial<TransactionUpdateData>),
    
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['transaction', transactionId], updatedData);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setHasChanges(false);
      // toast.success("Purposes saved successfully");

      if (onSave) {
        onSave(updatedData.requestPurposes as BriefPurpose[]);
      }
    },
    onError: (error: Error) => {
      // toast.error(`Save failed: ${error.message}`);
      alert(`Save failed: ${error.message}`);
    }
  });


  // --- [Modified] HandleSave now works for NEW and EDIT modes ---
  const handleSave = () => {
    if (transactionId === 'NEW') {
      // In CREATE mode, pass data to parent component (e.g., Screen 286)
      if (onSave) {
        onSave(purposes);
      }
      setHasChanges(false);
      // toast.success("Purposes staged for creation");
    } else {
      // In EDIT mode, save directly to the server
      updateMutation.mutate(purposes);
    }
  };

  // Toggle purpose selection (stays the same)
  const togglePurpose = (id: string) => {
    if (readOnly || updateMutation.isPending) return;
    
    const newPurposes = purposes.map(p => 
      p.id === id ? { ...p, isSelected: !p.isSelected } : p
    );
    
    setPurposes(newPurposes);
    setHasChanges(true);

    // In 'NEW' mode, we can also call onSave instantly if needed,
    // but handleSave is better as it respects the "Save" button.
  };

  // --- [Modified] HandleReset now uses the dynamic global list ---
  const handleReset = () => {
    if (readOnly || updateMutation.isPending || !globalPurposes) return;
    if (confirm('Are you sure you want to reset all purposes?')) {
      // Reset using the loaded global list, setting all to false
      const resetPurposes = globalPurposes.map(p => ({ ...p, isSelected: false }));
      setPurposes(resetPurposes);
      setHasChanges(true);
    }
  };

  // Calculate selected purposes (stays the same)
  const selectedCount = purposes.filter(p => p.isSelected).length;

  // --- [Modified] Handle combined loading and error states ---
  const isLoading = (transactionId !== 'NEW' && isLoadingTransaction) || isLoadingPurposes;
  const isError = (transactionId !== 'NEW' && isErrorTransaction) || isErrorPurposes;

  // This block now handles loading for BOTH queries
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // This block now handles errors from BOTH queries
  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-destructive">
            {isErrorTransaction ? "فشل تحميل بيانات المعاملة" : "فشل تحميل قائمة الأغراض"}
          </h3>
        </CardContent>
      </Card>
    );
  }

  // --- UI (The rest of the JSX stays exactly the same) ---
  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-PURPOSE-BRIEF" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar { width: 8px !important; display: block !important; }
          .scroll-area-viewport::-webkit-scrollbar-track { background: rgba(37, 99, 235, 0.1) !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb { background: #2563eb !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover { background: #1e40af !important; }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* Stats and actions bar */}
          <Card className="card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '8px',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: '10px'
                    }}
                  >
                    <CheckSquare className="h-5 w-5" style={{ color: '#2563eb' }} />
                  </div>
                  
                  <div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                      الأغراض المختصرة من الطلب
                    </h3>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      تم اختيار {selectedCount} من {purposes.length} غرض
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {hasChanges && !updateMutation.isPending && (
                    <Badge style={{ background: '#f59e0b', color: '#fff' }}>
                      تغييرات غير محفوظة
                    </Badge>
                  )}
                  
                  {!readOnly && (
                    <>
                      <Button 
                        onClick={handleReset} 
                        variant="outline" 
                        size="sm"
                        disabled={updateMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 ml-1" />
                        إعادة تعيين
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        size="sm" 
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        disabled={!hasChanges || updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 ml-1" />
                        )}
                        {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purposes list */}
          <div className="grid grid-cols-2 gap-3">
            {purposes.map((purpose) => (
              <Card
                key={purpose.id}
                className="card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => togglePurpose(purpose.id)}
                style={{
                  border: purpose.isSelected ? `2px solid ${purpose.color}` : '2px solid #e5e7eb',
                  background: purpose.isSelected 
                    ? `linear-gradient(135deg, ${purpose.color}15 0%, ${purpose.color}05 100%)` 
                    : '#ffffff',
                  opacity: (readOnly || updateMutation.isPending) && !purpose.isSelected ? 0.5 : 1,
                  cursor: (readOnly || updateMutation.isPending) ? 'not-allowed' : 'pointer'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: '24px' }}>{purpose.icon}</span>
                        <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                          {purpose.name}
                        </h4>
                      </div>
                      
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', lineHeight: '1.6', marginBottom: '8px' }}>
                        {purpose.description}
                      </p>
                      
                      <Badge 
                        variant="outline" 
                        style={{ 
                          fontSize: '10px', 
                          fontFamily: 'Courier New, monospace',
                          color: purpose.color,
                          borderColor: purpose.color
                        }}
                      >
                        {purpose.nameEn}
                      </Badge>
                    </div>
                    
                    <div>
                      {purpose.isSelected ? (
                        <CheckSquare 
                          className="h-6 w-6" 
                          style={{ color: purpose.color }} 
                        />
                      ) : (
                        <Square 
                          className="h-6 w-6" 
                          style={{ color: '#d1d5db' }} 
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected purposes summary */}
          {selectedCount > 0 && (
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' }}>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#1e40af' }}>
                  ملخص الأغراض المختارة ({selectedCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {purposes.filter(p => p.isSelected).map((purpose) => (
                    <Badge
                      key={purpose.id}
                      style={{
                        background: purpose.color,
                        color: '#ffffff',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      {purpose.icon} {purpose.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional info */}
          <Card className="card-rtl" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <span style={{ fontSize: '16px' }}>💡</span>
                <div>
                  <p style={{ fontFamily: 'Tajawal, sans-Gserif', fontSize: '12px', color: '#92400e', fontWeight: 600, marginBottom: '4px' }}>
                    ملاحظة هامة
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#78350f', lineHeight: '1.6' }}>
                    يمكنك اختيار أكثر من غرض واحد. الأغراض المختارة ستحدد المتطلبات والإجراءات اللازمة للمعاملة. 
                    تأكد من اختيار جميع الأغراض التي تنطبق على طلبك.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_RequestPurpose_Brief_Complete;