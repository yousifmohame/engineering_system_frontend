import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useScreen } from './ScreenContext';

// استيراد الشاشات الأساسية
import CodeDisplay from './CodeDisplay';

// ===== Lazy load الشاشات المسجلة في ScreensConfig فقط =====

// 100-199: لوحات التحكم والنظام
const HomePage_Complete_001 = lazy(() => import('./screens/HomePage_Complete_001'));
const MainDashboard_Complete_100_Enhanced = lazy(() => import('./screens/MainDashboard_Complete_100_Enhanced'));
const MyTasks_Complete_999_Enhanced = lazy(() => import('./screens/MyTasks_Complete_999_Enhanced'));
const SystemAdvancedManagement_Complete_999_v8_Fixed = lazy(() => import('./screens/SystemAdvancedManagement_Complete_999_v8_Fixed'));

// 200-299: المحاسبة والمالية
const AccountsFinanceManagement_Complete_Merged_222 = lazy(() => import('./screens/AccountsFinanceManagement_Complete_Merged_222_Enhanced'));
const TransactionsLog_Complete_285_v10 = lazy(() => import('./screens/TransactionsLog_Complete_285_v10_ALL_TABS'));
const CreateTransaction_Complete_286 = lazy(() => import('./screens/CreateTransaction_Complete_286'));
const SimpleTransactions_Complete_287_v1 = lazy(() => import('./screens/SimpleTransactions_Complete_287_v1'));

// 300-399: إدارة العملاء
const ClientManagement_300_v19 = lazy(() => import('./screens/ClientManagement_300_v19_WITH_COMPLETE_CLIENTS'));

// 400-499: الموارد البشرية
const AdvancedHRManagement_Complete_842 = lazy(() => import('./screens/AdvancedHRManagement_Complete_842'));
const OfficialHolidaysManagement_Complete_945 = lazy(() => import('./screens/OfficialHolidaysManagement_Complete_945'));

// 500-599: المشتريات والموارد
const ContractorsRelations_Complete_555_v4 = lazy(() => import('./screens/ContractorsRelations_Complete_555_v4_ALL_TABS'));

// 600-699: الحسابات والجودة والصيانة
const AccountsManagement_Complete_666 = lazy(() => import('./screens/AccountsManagement_Complete_666'));
const PartnersAccounts_Complete_667_v3 = lazy(() => import('./screens/PartnersAccounts_Complete_667_v3_ULTRA'));
const HardwareSoftware_Complete_677_v1 = lazy(() => import('./screens/HardwareSoftware_Complete_677_v1'));
const MaintenanceServicesManagement_Complete_672 = lazy(() => import('./screens/MaintenanceServicesManagement_Complete_672'));
const BuildingSafety_Complete_915 = lazy(() => import('./screens/BuildingSafety_Complete_915'));
const OrganizationalPlans_Complete_918_v8 = lazy(() => import('./screens/OrganizationalPlans_Complete_918_v8'));

// 700-799: المعاملات والتقارير
const MainTransactionsScreen_Complete_284_v10 = lazy(() => import('./screens/MainTransactionsScreen_Complete_284'));
const TransactionsSettings_Complete_701_v14_ALL_TABS = lazy(() => import('./screens/TransactionsSettings_Complete_701_v14_ALL_TABS'));
const ContractSettings_Advanced_777_v3_4 = lazy(() => import('./screens/ContractSettings_Advanced_777_v3.4_COMPLETE'));
const ContractApproval_Complete_778_v4 = lazy(() => import('./screens/ContractApproval_Complete_778_v4_ALL_TABS_FINAL'));
const DigitalDocumentation_Complete_750_v8 = lazy(() => import('./screens/DigitalDocumentation_Complete_750_v8'));
const TechnicalReports_Complete_950_v3 = lazy(() => import('./screens/TechnicalReports_Complete_950_v3'));

// 800-899: العقود والمشاريع
const OwnershipNumbers_Complete_800_v2 = lazy(() => import('./screens/OwnershipNumbers_Complete_800_v2'));
const ContractsManagement_Complete_814_v10 = lazy(() => import('./screens/ContractsManagement_Complete_814_v10_ALL_TABS_FINAL'));
const QuotationsManagement_Complete_815_v10 = lazy(() => import('./screens/QuotationsManagement_Complete_815_v10'));
const SalariesFees_Complete_816 = lazy(() => import('./screens/SalariesFees_Complete_816'));
const EmployeesManagement_Complete_817 = lazy(() => import('./screens/EmployeesManagement_Complete_817'));
const ExternalEntities_Complete_818 = lazy(() => import('./screens/ExternalEntities_Complete_818_v8_FULL_TABS'));
const GeographicalDivision_Complete_819 = lazy(() => import('./screens/GeographicalDivision_Complete_819'));
const AppointmentsManagement_Complete_820_v8 = lazy(() => import('./screens/AppointmentsManagement_Complete_820_v8'));
const SurveyingData_Complete_821 = lazy(() => import('./screens/SurveyingData_Complete_821'));
const SurveyorsManagement_Complete_822 = lazy(() => import('./screens/SurveyorsManagement_Complete_822'));
const EmployeeContracts_Complete_823 = lazy(() => import('./screens/EmployeeContracts_Complete_823'));
const TransactionTasksAssignment_Complete_825 = lazy(() => import('./screens/TransactionTasksAssignment_Complete_825'));
const TasksSettings_Complete_826 = lazy(() => import('./screens/TasksSettings_Complete_826'));
const CommunicationLogs_Complete_827 = lazy(() => import('./screens/CommunicationLogs_Complete_827'));
const GeneralReportsPrinting_Complete_831 = lazy(() => import('./screens/GeneralReportsPrinting_Complete_831'));
const DocumentsReceiving_Complete_902 = lazy(() => import('./screens/DocumentsReceiving_Complete_902'));
const JobRoles_Complete_903_v10 = lazy(() => import('./screens/JobRoles_Complete_903_v10_WITH_PERMISSIONS'));
const OfficeBranches_Complete_905_v1 = lazy(() => import('./screens/OfficeBranches_Complete_905_v1'));
const DocumentsPrinting_Complete_832 = lazy(() => import('./screens/DocumentsPrinting_Complete_832'));
const TransactionDocumentsCreation_Complete_833 = lazy(() => import('./screens/TransactionDocumentsCreation_Complete_833'));
const LicensesManagement_Complete_841 = lazy(() => import('./screens/LicensesManagement_Complete_841'));
const LicensesManagement_Complete_841_v8 = lazy(() => import('./screens/LicensesManagement_Complete_841_v8'));
const AnnualBudget_Complete_850 = lazy(() => import('./screens/AnnualBudget_Complete_850'));
const CommunicationChannels_Complete_856 = lazy(() => import('./screens/CommunicationChannels_Complete_856'));
const OwnerCommitments_Complete_857 = lazy(() => import('./screens/OwnerCommitments_Complete_857'));
const OfficialEmail_Complete_858 = lazy(() => import('./screens/OfficialEmail_Complete_858'));
const NotesProcessing_Complete_860_v8 = lazy(() => import('./screens/NotesProcessing_Complete_860_v8'));
const ExecutionSupervision_Complete_870_v8 = lazy(() => import('./screens/ExecutionSupervision_Complete_870_v8'));
const EngineeringDrawings_Complete_872_v8 = lazy(() => import('./screens/EngineeringDrawings_Complete_872_v8'));
const SupervisionTransactions_Complete_875 = lazy(() => import('./screens/SupervisionTransactions_Complete_875'));
const TransactionInvoices_Complete_876 = lazy(() => import('./screens/TransactionInvoices_Complete_876'));
const ProjectClassifications_Complete_880 = lazy(() => import('./screens/ProjectClassifications_Complete_880'));
const MarketingManagement_Complete_890_v3 = lazy(() => import('./screens/MarketingManagement_Complete_890_v3'));
const ClientMeetings_Complete_891 = lazy(() => import('./screens/ClientMeetings_Complete_891'));

// 900-999: الإعدادات والوثائق
const FilesDocumentsManagement_Complete_900 = lazy(() => import('./screens/FilesDocumentsManagement_Complete_900'));
const DocumentsFilesManagement_Complete_901 = lazy(() => import('./screens/DocumentsFilesManagement_Complete_901'));
const ProfessionalSettings_Complete_925 = lazy(() => import('./screens/ProfessionalSettings_Complete_925'));
const NotificationSettingsScreen = lazy(() => import('./screens/NotificationSettingsScreen'));
const RequirementsManagement_Complete_930_v1 = lazy(() => import('./screens/RequirementsManagement_Complete_930_v1'));
const MadinatiAppointments_Complete_933 = lazy(() => import('./screens/MadinatiAppointments_Complete_933'));
const ExceptionsSpecialRequests_Complete_935_v2 = lazy(() => import('./screens/ExceptionsSpecialRequests_Complete_935_v2_ALL_TABS'));
const CashPayments_Complete_936_v1 = lazy(() => import('./screens/CashPayments_Complete_936_v1'));
const FollowUpAgents_Complete_937_v1 = lazy(() => import('./screens/FollowUpAgents_Complete_937_v1'));
const FollowUpFees_Complete_938_v1 = lazy(() => import('./screens/FollowUpFees_Complete_938_v1'));
const RiyadhStreets_Complete_939_v1 = lazy(() => import('./screens/RiyadhStreets_Complete_939_v1'));
const RiyadhStreets_Complete_939_v2 = lazy(() => import('./screens/RiyadhStreets_Complete_939_v2_ALL_TABS_WORKING'));
const SectorsDistricts_Complete_948_v1 = lazy(() => import('./screens/SectorsDistricts_Complete_948_v1'));
const SectorsDistricts_Complete_948_v2 = lazy(() => import('./screens/SectorsDistricts_Complete_948_v2_ULTRA_ENHANCED'));
const LocationsMap_Complete_949 = lazy(() => import('./screens/LocationsMap_Complete_949'));
const CommitmentsDeclarations_Complete_940_v8 = lazy(() => import('./screens/CommitmentsDeclarations_Complete_940_v8'));
const CommitmentsDeclarationsSettings_Complete_941 = lazy(() => import('./screens/CommitmentsDeclarationsSettings_Complete_941'));
const DocumentTypes_Complete_942_v2 = lazy(() => import('./screens/DocumentTypes_Complete_942_v2_WITH_CODES'));
const OfficePartnersOwnership_Complete_943 = lazy(() => import('./screens/OfficePartnersOwnership_Complete_943'));
const OfficeQualification_Complete_944 = lazy(() => import('./screens/PlatformsQualification_Complete_944_FULL'));
const DigitalAssets_Complete_946 = lazy(() => import('./screens/DigitalAssets_Complete_946'));
const TargetsGoals_Complete_947 = lazy(() => import('./screens/TargetsGoals_Complete_947'));
const BusinessStatistics_Complete_951 = lazy(() => import('./screens/BusinessStatistics_Complete_951'));
const FeesSettings_Complete_952_v8 = lazy(() => import('./screens/FeesSettings_Complete_952_v8'));
const TemplatesFormsDesigner_Complete_960_v8_Enhanced = lazy(() => import('./screens/TemplatesFormsDesigner_Complete_960_v8_Enhanced'));
const AIManagement_Complete_970 = lazy(() => import('./screens/AIManagement_Complete_970'));
const DocumentationViewerScreen = lazy(() => import('./screens/DocumentationViewerScreen'));

// ===== نهاية استيرادات الشاشات =====

const ScreenRenderer_v8_Clean: React.FC = () => {
  const { activeScreen } = useScreen();
  // مكون Loading شامل
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              جارٍ تحميل الشاشة...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // مكون Error
  const ErrorFallback = ({ error }: { error: string }) => (
    <div className="flex items-center justify-center h-screen p-6">
      <Alert className="max-w-2xl border-red-200 bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-sm text-red-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <div className="font-bold mb-2">خطأ في تحميل الشاشة</div>
          <div>{error}</div>
        </AlertDescription>
      </Alert>
    </div>
  );

  // Helper function لرندر الشاشة
  const renderScreen = (Component: React.LazyExoticComponent<React.FC>) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );

  // Screen mappings - فقط الشاشات المسجلة في ScreensConfig
  const screenMappings: Record<string, () => JSX.Element> = {
    // لوحات التحكم
    'homepage': () => renderScreen(HomePage_Complete_001),
    'main-dashboard': () => renderScreen(MainDashboard_Complete_100_Enhanced),
    'my-tasks': () => renderScreen(MyTasks_Complete_999_Enhanced),
    'system-advanced-management': () => renderScreen(SystemAdvancedManagement_Complete_999_v8_Fixed),
    
    // المحاسبة والمالية
    'accounts-finance-merged': () => renderScreen(AccountsFinanceManagement_Complete_Merged_222),
    'transactions-log': () => renderScreen(TransactionsLog_Complete_285_v10),
    'create-transaction': () => renderScreen(CreateTransaction_Complete_286),
    'simple-transactions': () => renderScreen(SimpleTransactions_Complete_287_v1),
    'transactions-log-285': () => renderScreen(TransactionsLog_Complete_285_v10),
    'create-transaction-286': () => renderScreen(CreateTransaction_Complete_286),
    
    // إدارة العملاء
    'clients-unified': () => renderScreen(ClientManagement_300_v19),
    
    // الموارد البشرية
    'advanced-hr-management': () => renderScreen(AdvancedHRManagement_Complete_842),
    'official-holidays-management': () => renderScreen(OfficialHolidaysManagement_Complete_945),
    
    // المشتريات والموارد
    'contractors-relations': () => renderScreen(ContractorsRelations_Complete_555_v4),
    
    // الجودة والصيانة
    'accounts-management': () => renderScreen(AccountsManagement_Complete_666),
    'partners-accounts': () => renderScreen(PartnersAccounts_Complete_667_v3),
    'maintenance-services-management': () => renderScreen(MaintenanceServicesManagement_Complete_672),
    'building-safety': () => renderScreen(BuildingSafety_Complete_915),
    'organizational-plans': () => renderScreen(OrganizationalPlans_Complete_918_v8),
    
    // المعاملات والتقارير
    'main-transactions-screen': () => renderScreen(MainTransactionsScreen_Complete_284_v10),
    'transactions-settings': () => renderScreen(TransactionsSettings_Complete_701_v14_ALL_TABS),
    'contract-settings': () => renderScreen(ContractSettings_Advanced_777_v3_4),
    'contract-approval': () => renderScreen(ContractApproval_Complete_778_v4),
    'digital-documentation': () => renderScreen(DigitalDocumentation_Complete_750_v8),
    'technical-reports': () => renderScreen(TechnicalReports_Complete_950_v3),
    
    // العقود والمشاريع
    'ownership-documents': () => renderScreen(OwnershipNumbers_Complete_800_v2),
    'contracts-management': () => renderScreen(ContractsManagement_Complete_814_v10),
    'quotations-management': () => renderScreen(QuotationsManagement_Complete_815_v10),
    'salaries-fees-management': () => renderScreen(SalariesFees_Complete_816),
    'employees-management': () => renderScreen(EmployeesManagement_Complete_817),
    'external-entities': () => renderScreen(ExternalEntities_Complete_818),
    'geographical-division': () => renderScreen(GeographicalDivision_Complete_819),
    'appointments-management': () => renderScreen(AppointmentsManagement_Complete_820_v8),
    'appointments-820': () => renderScreen(AppointmentsManagement_Complete_820_v8),
    'surveying-data': () => renderScreen(SurveyingData_Complete_821),
    'surveyors-management': () => renderScreen(SurveyorsManagement_Complete_822),
    'employee-contracts': () => renderScreen(EmployeeContracts_Complete_823),
    'transaction-tasks-assignment': () => renderScreen(TransactionTasksAssignment_Complete_825),
    'tasks-settings-advanced': () => renderScreen(TasksSettings_Complete_826),
    'communication-logs': () => renderScreen(CommunicationLogs_Complete_827),
    'general-reports-printing': () => renderScreen(GeneralReportsPrinting_Complete_831),
    'documents-printing': () => renderScreen(DocumentsPrinting_Complete_832),
    'transaction-documents-creation': () => renderScreen(TransactionDocumentsCreation_Complete_833),
    'licenses-management': () => renderScreen(LicensesManagement_Complete_841_v8),
    'annual-budget': () => renderScreen(AnnualBudget_Complete_850),
    'communication-channels': () => renderScreen(CommunicationChannels_Complete_856),
    'owner-commitments': () => renderScreen(OwnerCommitments_Complete_857),
    'official-email': () => renderScreen(OfficialEmail_Complete_858),
    'notes-processing': () => renderScreen(NotesProcessing_Complete_860_v8),
    'hardware-software-management': () => renderScreen(HardwareSoftware_Complete_677_v1),
    'execution-supervision': () => renderScreen(ExecutionSupervision_Complete_870_v8),
    'engineering-drawings': () => renderScreen(EngineeringDrawings_Complete_872_v8),
    'supervision-transactions': () => renderScreen(SupervisionTransactions_Complete_875),
    'transaction-invoices': () => renderScreen(TransactionInvoices_Complete_876),
    'project-classifications': () => renderScreen(ProjectClassifications_Complete_880),
    'marketing-management': () => renderScreen(MarketingManagement_Complete_890_v3),
    'client-meetings': () => renderScreen(ClientMeetings_Complete_891),
    
    // الإعدادات والوثائق
    'files-documents-management': () => renderScreen(FilesDocumentsManagement_Complete_900),
    'documents-files-management': () => renderScreen(DocumentsFilesManagement_Complete_901),
    'documents-receiving': () => renderScreen(DocumentsReceiving_Complete_902),
    'job-roles': () => renderScreen(JobRoles_Complete_903_v10),
    'office-branches': () => renderScreen(OfficeBranches_Complete_905_v1),
    'professional-settings': () => renderScreen(ProfessionalSettings_Complete_925),
    'notification-settings': () => renderScreen(NotificationSettingsScreen),
    'requirements-management': () => renderScreen(RequirementsManagement_Complete_930_v1),
    'madinati-appointments': () => renderScreen(MadinatiAppointments_Complete_933),
    'exceptions-special-requests': () => renderScreen(ExceptionsSpecialRequests_Complete_935_v2),
    'cash-payments': () => renderScreen(CashPayments_Complete_936_v1),
    'follow-up-agents': () => renderScreen(FollowUpAgents_Complete_937_v1),
    'follow-up-fees': () => renderScreen(FollowUpFees_Complete_938_v1),
    'riyadh-streets': () => renderScreen(RiyadhStreets_Complete_939_v2),
    'sectors-districts': () => renderScreen(SectorsDistricts_Complete_948_v2),
    'commitments-declarations': () => renderScreen(CommitmentsDeclarations_Complete_940_v8),
    'commitments-declarations-settings': () => renderScreen(CommitmentsDeclarationsSettings_Complete_941),
    'document-types': () => renderScreen(DocumentTypes_Complete_942_v2),
    'office-partners-ownership': () => renderScreen(OfficePartnersOwnership_Complete_943),
    'office-qualification': () => renderScreen(OfficeQualification_Complete_944),
    'digital-assets': () => renderScreen(DigitalAssets_Complete_946),
    'targets-goals': () => renderScreen(TargetsGoals_Complete_947),
    'locations-map': () => renderScreen(LocationsMap_Complete_949),
    'business-statistics': () => renderScreen(BusinessStatistics_Complete_951),
    'fees-settings': () => renderScreen(FeesSettings_Complete_952_v8),
    'templates-forms-designer': () => renderScreen(TemplatesFormsDesigner_Complete_960_v8_Enhanced),
    'ai-management': () => renderScreen(AIManagement_Complete_970),
    'documentation-viewer': () => renderScreen(DocumentationViewerScreen),
    
    // Code display
    'code-display': () => <CodeDisplay />,
  };

  // رندر الشاشة المحددة أو عرض رسالة خطأ
  const renderContent = () => {
    const screenRenderer = screenMappings[activeScreen];
    
    if (screenRenderer) {
      return screenRenderer();
    }
    
    return (
      <ErrorFallback 
        error={`الشاشة "${activeScreen}" غير موجودة أو لم يتم تسجيلها في ScreensConfig`} 
      />
    );
  };

  return renderContent();
};

export default ScreenRenderer_v8_Clean;