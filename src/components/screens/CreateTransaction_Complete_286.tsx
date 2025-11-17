/**
 * Screen 286 - Create New Transaction - v9.1 (Fixed Navigation)
 * ===========================================
 * * Update v9.1:
 * ✅ Added "handlePurposeSave" function to navigate to the next tab.
 * ✅ Passed "onSave" to tab "286-03".
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { toast } from 'sonner';

// --- (1. Import correct API functions and types) ---
import { createTransaction } from '../../api/transactionApi';
import { Transaction, NewTransactionData } from '../../types/transactionTypes';

// --- (2. Remove unused UI component imports here) ---
import {
  FileText, Plus, CheckCircle, Users, Calendar,
  Paperclip, Target, AlertCircle, Settings,
  Eye, User, Building, Activity, List,
  Layers, Navigation, Compass, Grid, MapPin
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// --- (3. Import all sub-tabs) ---
import Tab_286_01_BasicInfo_UltraDense from './Tab_286_01_BasicInfo_UltraDense';
import Tab_286_02_TransactionDetails_Complete from './Tab_286_02_TransactionDetails_Complete';
import {
  Tab_286_05_Tasks_UltraDense,
  Tab_286_06_StaffAssignment_UltraDense,
  Tab_286_08_Attachments_UltraDense,
  Tab_286_10_Costs_UltraDense
} from './Tab_286_AllTabs_UltraDense';
import {
  Tab_286_07_ClientInfo,
  Tab_286_09_Appointments,
  Tab_286_11_Approvals,
  Tab_286_12_Notes,
  Tab_286_13_Preview,
  Tab_286_14_Settings
} from './Tab_286_RestTabs_Complete';
import Tab_RequestPurpose_Brief_Complete from './Tab_RequestPurpose_Brief_Complete';
import Tab_RequestPurpose_Detailed_Complete from './Tab_RequestPurpose_Detailed_Complete';
import Tab_FloorsNaming_Complete from './Tab_FloorsNaming_Complete';
import Tab_Setbacks_AllFloors_Complete from './Tab_Setbacks_AllFloors_Complete';
import Tab_FinalComponents_Detailed_Complete from './Tab_FinalComponents_Detailed_Complete';
import Tab_Components_Generic_Complete from './Tab_Components_Generic_Complete';
import Tab_Boundaries_Neighbors_Complete from './Tab_Boundaries_Neighbors_Complete';
import Tab_LandArea_Complete from './Tab_LandArea_Complete';

// --- (4. Define schema and types for basic form) ---
const basicInfoSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  clientId: z.string().min(1, "يجب اختيار العميل"),
  type: z.string().optional(), // Will carry transactionTypeId
  priority: z.string().default('medium'),
  description: z.string().optional(),
});

// Use the type we defined in transactionTypes.ts
type BasicInfoFormData = NewTransactionData;

// (TABS_CONFIG stays the same)
const TABS_CONFIG: TabConfig[] = [
  { id: '286-01', number: '286-01', title: 'معلومات أساسية', icon: FileText },
  { id: '286-02', number: '286-02', title: 'تفاصيل المعاملة', icon: Target },
  { id: '286-03', number: '286-03', title: 'الغرض المختصر', icon: CheckCircle },
  { id: '286-04', number: '286-04', title: 'الغرض التفصيلي', icon: List },
  { id: '286-05', number: '286-05', title: 'المهمات', icon: CheckCircle },
  { id: '286-06', number: '286-06', title: 'إسناد الموظفين', icon: Users },
  { id: '286-07', number: '286-07', title: 'معلومات العميل', icon: User },
  { id: '286-08', number: '286-08', title: 'المرفقات', icon: Paperclip },
  { id: '286-09', number: '286-09', title: 'المواعيد', icon: Calendar },
  { id: '286-10', number: '286-10', title: 'التكاليف', icon: Activity },
  { id: '286-11', number: '286-11', title: 'الموافقات', icon: CheckCircle },
  { id: '286-12', number: '286-12', title: 'الملاحظات', icon: FileText },
  { id: '286-13', number: '286-13', title: 'معاينة', icon: Eye },
  { id: '286-14', number: '286-14', title: 'الإعدادات', icon: Settings },
  { id: '286-15', number: '286-15', title: 'مسميات وعدد الأدوار', icon: Layers },
  { id: '286-16', number: '286-16', title: 'الارتدادات من الأربع جهات', icon: Navigation },
  { id: '286-17', number: '286-17', title: 'المكونات التفصيلية النهائية', icon: Grid },
  { id: '286-18', number: '286-18', title: 'المكونات حسب الرخصة القديمة', icon: FileText },
  { id: '286-19', number: '286-19', title: 'المكونات حسب المقترح', icon: Target },
  { id: '286-20', number: '286-20', title: 'المكونات حسب القائم', icon: Building },
  { id: '286-21', number: '286-21', title: 'الحدود والمجاورين', icon: Compass },
  { id: '286-22', number: '286-22', title: 'مساحة الأرض', icon: MapPin },
];

const CreateTransaction_Complete_286: React.FC = () => {
  const [activeTab, setActiveTab] = useState('286-01');
  
  
  // --- (5. Remove unused State) ---
  // const [autoAssign, setAutoAssign] = useState(true);
  // const [sendNotifications, setSendNotifications] = useState(true);

  const [transactionId, setTransactionId] = useState<'new' | string>('new');
  const queryClient = useQueryClient();

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      clientId: "",
      type: "",
      priority: "medium",
      description: "",
    },
  });

  // --- (6. Update Mutation to use correct function) ---
  const createTransactionMutation = useMutation({
    mutationFn: (data: BasicInfoFormData) => createTransaction(data),
    onSuccess: (createdTransaction: Transaction) => {
      setTransactionId(createdTransaction.id);
      // toast.success('Transaction (draft) created successfully!');
      // --- 3. (Modified) Navigate to tab 2 to select type ---
      setActiveTab('286-02'); 
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      // toast.error(`Failed to create transaction: ${error.message}`);
      console.error("Mutation Error:", error);
    },
  });

  const onSubmitBasicInfo = (data: BasicInfoFormData) => {
    console.log('Basic form data:', data);
    createTransactionMutation.mutate(data);
  };

  // --- (7. Remove unused getStatusBadge function) ---

  // --- ✅ [Fix] Add function to navigate after saving ---
  const handlePurposeSave = () => {
    console.log("CreateTransaction_Complete_286: Purpose saved. Moving to 286-04");
    setActiveTab('286-04'); // <-- ينتقل إلى التبويب التالي
  };
  // --------------------------------------------------

  // --- (8. Completely clean renderTabContent) ---
  const renderTabContent = () => {
    const isDisabled = transactionId === 'new';

    switch (activeTab) {
      case '286-01':
        return (
          <Tab_286_01_BasicInfo_UltraDense
            form={form} 
            isSaving={createTransactionMutation.isPending}
          />
        );
      
      case '286-02':
        return (
          <Tab_286_02_TransactionDetails_Complete
            transactionId={transactionId}
            // (Pass function to navigate to next tab on selection)
            onTypeSelected={() => setActiveTab('286-03')}
          />
        );
      
      case '286-03':
        return (
          <Tab_RequestPurpose_Brief_Complete 
            transactionId={transactionId} 
            readOnly={isDisabled} 
            onSave={handlePurposeSave} // <-- ✅ [Fix] Pass function here
          />
        );
      
      case '286-04':
        return <Tab_RequestPurpose_Detailed_Complete transactionId={transactionId} />;
      
      case '286-05':
        return <Tab_286_05_Tasks_UltraDense transactionId={transactionId} />;
      
      case '286-06':
        return <Tab_286_06_StaffAssignment_UltraDense transactionId={transactionId} />;
      
      case '286-07':
        return <Tab_286_07_ClientInfo transactionId={transactionId} />;
      
      case '286-08':
        return <Tab_286_08_Attachments_UltraDense transactionId={transactionId} />;
      
      case '286-09':
        return <Tab_286_09_Appointments transactionId={transactionId} />;
      
      case '286-10':
        return <Tab_286_10_Costs_UltraDense transactionId={transactionId} />;
      
      case '286-11':
        return <Tab_286_11_Approvals transactionId={transactionId} />;
      
      case '286-12':
        return <Tab_286_12_Notes transactionId={transactionId} />;
      
      case '286-13':
        return <Tab_286_13_Preview transactionId={transactionId} />;
      
      case '286-14':
        return <Tab_286_14_Settings transactionId={transactionId} />;
      
      case '286-15':
        return <Tab_FloorsNaming_Complete transactionId={transactionId} readOnly={isDisabled} />;
      
      case '286-16':
        return <Tab_Setbacks_AllFloors_Complete transactionId={transactionId} readOnly={isDisabled} />;
      
      case '286-17':
        return <Tab_FinalComponents_Detailed_Complete transactionId={transactionId} readOnly={isDisabled} />;
      
      case '286-18':
        return <Tab_Components_Generic_Complete transactionId={transactionId} readOnly={isDisabled} type="old-license" />;
      
      case '286-19':
        return <Tab_Components_Generic_Complete transactionId={transactionId} readOnly={isDisabled} type="proposed" />;
      
      case '286-20':
        return <Tab_Components_Generic_Complete transactionId={transactionId} readOnly={isDisabled} type="existing" />;
      
      case '286-21':
        return <Tab_Boundaries_Neighbors_Complete transactionId={transactionId} readOnly={isDisabled} />;
      
      case '286-22':
        return <Tab_LandArea_Complete transactionId={transactionId} readOnly={isDisabled} />;

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>Tab content in development</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                Tab: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-286" position="top-right" />
      
      {/* Screen header v4.2.2 (stays the same) */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div 
          className="flex items-center justify-between"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <Plus 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '20px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  إنشاء معاملة جديدة
                </h1>
                
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    286
                  </span>
                </div>
              </div>
              
              <p 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px', 
                  color: '#64748b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                إنشاء وإدارة المعاملات الجديدة مع المهمات والإسناد
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '6px 14px',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.15)'
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                22 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          // --- (10. Add tab disabling logic) ---
          disabledTabs={TABS_CONFIG
            .map(t => t.id)
            .filter(id => id !== '286-01' && transactionId === 'new')}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {/* This form wraps all tabs.
            When the submit button inside (Tab_286_01) is pressed, 
            the onSubmitBasicInfo function will be triggered
          */}
          <form onSubmit={form.handleSubmit(onSubmitBasicInfo)}>
            {renderTabContent()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction_Complete_286;