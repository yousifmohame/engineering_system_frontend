/**
 * نظام مركزي لترقيم الشاشات v6.0 - النظام الموحد الجديد
 * ===============================================
 * 
 * نظام ترقيم جديد كلياً بأرقام مميزة من 3 خانات:
 * 
 * 100-199: لوحات التحكم والنظام الأساسي
 * 200-299: المحاسبة والمالية
 * 300-399: إدارة العملاء والعلاقات
 * 400-499: الموارد البشرية والتدريب
 * 500-599: المشتريات والموارد والمعدات
 * 600-699: الجودة والصيانة والسلامة
 * 700-799: التقارير والتحليل
 * 800-899: العقود والمشاريع والتطوير
 * 900-999: الإعدادات والوثائق
 * 
 * القاعدة: عند تحديث رقم شاشة هنا، يتم تحديثه تلقائياً في جميع الأماكن
 */

export interface ScreenConfig {
  id: string;
  screenNumber: string; // رقم الشاشة الرسمي (3 أرقام)
  title: string;
  icon: string;
  category: string;
  path?: string;
  component?: string;
  hasPermission?: boolean;
  totalTabs?: number; // عدد التابات (اختياري)
}

/**
 * قائمة الشاشات الرئيسية مع أرقامها الرسمية الجديدة
 * جميع الأرقام مميزة وسهلة الحفظ
 */
export const SCREENS_CONFIG: ScreenConfig[] = [
  // ===== 100-199: لوحات التحكم والنظام الأساسي =====
  {
    id: 'main-dashboard',
    screenNumber: '100',
    title: 'لوحة التحكم الرئيسية',
    icon: 'Home',
    category: 'dashboards',
    component: 'MainDashboard_Complete_100_Enhanced',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'my-tasks',
    screenNumber: '998',
    title: 'مهامي الشخصية',
    icon: 'ClipboardCheck',
    category: 'tasks',
    component: 'MyTasks_Complete_999_Enhanced',
    hasPermission: true,
    totalTabs: 6,
  },
  {
    id: 'system-advanced-management',
    screenNumber: '999',
    title: 'الإدارة المتقدمة للنظام',
    icon: 'Crown',
    category: 'system',
    component: 'SystemAdvancedManagement_Complete_999_v8_Fixed',
    hasPermission: true,
    totalTabs: 10,
  },
  
  // ===== 200-299: المحاسبة والمالية =====
  {
    id: 'accounts-finance-merged',
    screenNumber: '222',
    title: 'إدارة المحاسبة والمالية والتقارير الشاملة',
    icon: 'Calculator',
    category: 'finance',
    component: 'AccountsFinanceManagement_Complete_Merged_222_Enhanced',
    hasPermission: true,
    totalTabs: 52,
  },
  {
    id: 'transactions-log',
    screenNumber: '285',
    title: 'سجل المعاملات الشامل',
    icon: 'Database',
    category: 'transactions',
    component: 'TransactionsLog_Complete_285_v9',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'create-transaction',
    screenNumber: '286',
    title: 'إنشاء معاملة جديدة',
    icon: 'PlusCircle',
    category: 'transactions',
    component: 'CreateTransaction_Complete_286',
    hasPermission: true,
    totalTabs: 22,
  },
  {
    id: 'simple-transactions',
    screenNumber: '287',
    title: 'معاملات بسيطة',
    icon: 'Zap',
    category: 'transactions',
    component: 'SimpleTransactions_Complete_287_v1',
    hasPermission: true,
    totalTabs: 8,
  },
  {
    id: 'cash-payments',
    screenNumber: '936',
    title: 'حسابات خاصة (مدفوعات كاش)',
    icon: 'Banknote',
    category: 'finance',
    component: 'CashPayments_Complete_936_v1',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'follow-up-agents',
    screenNumber: '937',
    title: 'إدارة المعقبين',
    icon: 'Users',
    category: 'operations',
    component: 'FollowUpAgents_Complete_937_v1',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'follow-up-fees',
    screenNumber: '938',
    title: 'أتعاب التعقيب',
    icon: 'DollarSign',
    category: 'finance',
    component: 'FollowUpFees_Complete_938_v1',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'riyadh-streets',
    screenNumber: '939',
    title: 'شوارع الرياض',
    icon: 'MapPin',
    category: 'settings',
    component: 'RiyadhStreets_Complete_939_v2',
    hasPermission: true,
    totalTabs: 10,
    description: 'نظام شامل لإدارة شوارع الرياض مع QR والخرائط',
  },
  
  // ===== 300-399: إدارة العملاء والعلاقات =====
  {
    id: 'clients-unified',
    screenNumber: '300',
    title: 'إدارة العملاء',
    icon: 'Users',
    category: 'clients',
    component: 'ClientManagement_300_ALL_TABS_COMPLETE_FINAL',
    hasPermission: true,
    totalTabs: 12,
    description: 'نظام شامل لإدارة العملاء - جميع التابات مطورة 100% - v16.0 FINAL',
  },
  
  // ===== 400-499: الموارد البشرية والتدريب =====
  {
    id: 'advanced-hr-management',
    screenNumber: '400',
    title: 'إدارة الموارد البشرية المتقدمة',
    icon: 'Users',
    category: 'hr',
    component: 'AdvancedHRManagement_Complete_842',
    hasPermission: true,
    totalTabs: 20,
  },
  {
    id: 'official-holidays-management',
    screenNumber: '455',
    title: 'إدارة الإجازات الرسمية',
    icon: 'Calendar',
    category: 'hr',
    component: 'OfficialHolidaysManagement_Complete_945',
    hasPermission: true,
    totalTabs: 12,
  },
  
  // ===== 500-599: المشتريات والموارد والمعدات =====
  {
    id: 'contractors-relations',
    screenNumber: '555',
    title: 'علاقات المقاولين',
    icon: 'Users',
    category: 'contractors',
    component: 'ContractorsRelations_Advanced_555_v3',
    hasPermission: true,
    totalTabs: 11,
    description: 'نظام شامل لإدارة العلاقات مع المقاولين مع ربط العقود بالمعاملات والعملاء ورخص البناء',
  },
  
  // ===== 600-699: الجودة والصيانة والسلامة =====
  {
    id: 'accounts-management',
    screenNumber: '666',
    title: 'الحسابات',
    icon: 'Calculator',
    category: 'accounting',
    component: 'AccountsManagement_Complete_666',
    hasPermission: true,
    totalTabs: 10,
    description: 'نظام محاسبة شامل ودليل حسابات ومتابعة مالية',
  },
  {
    id: 'partners-accounts',
    screenNumber: '667',
    title: 'حسابات الشركاء',
    icon: 'DollarSign',
    category: 'accounting',
    component: 'PartnersAccounts_Complete_667_v3_ULTRA',
    hasPermission: true,
    totalTabs: 7,
    description: 'نظام شامل لإدارة حسابات الشركاء مع توزيع الأتعاب والنسب والسداد',
  },
  {
    id: 'supervision-management',
    screenNumber: '967',
    title: 'إدارة الإشراف والجودة',
    icon: 'ShieldCheck',
    category: 'quality',
    component: 'SupervisionManagement_Complete_967',
    hasPermission: true,
    totalTabs: 20,
  },
  {
    id: 'hardware-software-management',
    screenNumber: '677',
    title: 'الأجهزة والبرمجيات',
    icon: 'Monitor',
    category: 'it',
    component: 'HardwareSoftware_Complete_677_v1',
    hasPermission: true,
    totalTabs: 20,
  },
  {
    id: 'building-safety',
    screenNumber: '915',
    title: 'سلامة المباني',
    icon: 'Shield',
    category: 'safety',
    component: 'BuildingSafety_Complete_915',
    hasPermission: true,
    totalTabs: 18,
  },
  {
    id: 'organizational-plans',
    screenNumber: '918',
    title: 'المخططات التنظيمية',
    icon: 'Map',
    category: 'planning',
    component: 'OrganizationalPlans_Complete_918_v8',
    hasPermission: true,
    totalTabs: 18,
  },
  
  // ===== 700-799: التقارير والتحليل =====
  {
    id: 'main-transactions-screen',
    screenNumber: '284',
    title: 'معالجة المعاملات',
    icon: 'Layers',
    category: 'transactions',
    component: 'MainTransactionsScreen_Complete_284_v9',
    hasPermission: true,
    totalTabs: 26,
  },
  {
    id: 'transactions-settings',
    screenNumber: '701',
    title: 'إعدادات المعاملات',
    icon: 'Settings',
    category: 'transactions',
    component: 'TransactionsSettings_Complete_701_v12_ALL_TABS',
    hasPermission: true,
    totalTabs: 23,
  },
  {
    id: 'contract-settings',
    screenNumber: '777',
    title: 'إعدادات العقود v3.4',
    icon: 'Settings',
    category: 'contracts',
    component: 'ContractSettings_Advanced_777_v3.4_COMPLETE',
    hasPermission: true,
    totalTabs: 13,
    description: 'نظام شامل متقدم: أنواع العقود، قوالب طباعة محسّنة، إدارة الأطراف، عدادات التوقيع',
  },
  {
    id: 'contract-approval',
    screenNumber: '778',
    title: 'اعتماد العقود',
    icon: 'FileCheck',
    category: 'contracts',
    component: 'ContractApproval_Advanced_778',
    hasPermission: true,
    totalTabs: 12,
    description: 'نظام شامل لاعتماد العقود يدوياً ورقمياً من جميع الأطراف',
  },
  {
    id: 'digital-documentation',
    screenNumber: '750',
    title: 'التوثيق الرقمي',
    icon: 'CloudUpload',
    category: 'documents',
    component: 'DigitalDocumentation_Complete_750_v8',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'technical-reports',
    screenNumber: '950',
    title: 'التقارير الفنية',
    icon: 'FileText',
    category: 'reports',
    component: 'TechnicalReports_Complete_950',
    hasPermission: true,
    totalTabs: 18,
  },
  
  // ===== 800-899: العقود والمشاريع والتطوير =====
  {
    id: 'ownership-documents',
    screenNumber: '800',
    title: 'أرقام الملكية',
    icon: 'Home',
    category: 'documents',
    component: 'OwnershipNumbers_Complete_800_v2',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'contracts-management',
    screenNumber: '814',
    title: 'إدارة عقود العملاء',
    icon: 'FileContract',
    category: 'contracts',
    component: 'ContractsManagement_Complete_814',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'quotations-management',
    screenNumber: '815',
    title: 'إدارة عروض الأسعار',
    icon: 'Receipt',
    category: 'contracts',
    component: 'QuotationsManagement_Complete_815',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'salaries-fees-management',
    screenNumber: '816',
    title: 'إدارة الرواتب والأتعاب',
    icon: 'DollarSign',
    category: 'hr',
    component: 'SalariesFees_Complete_816',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'employees-management',
    screenNumber: '817',
    title: 'إدارة الموظفين',
    icon: 'Users',
    category: 'hr',
    component: 'EmployeesManagement_Complete_817',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'external-entities',
    screenNumber: '818',
    title: 'إدارة الجهات الخارجية',
    icon: 'Building',
    category: 'management',
    component: 'ExternalEntities_Complete_818',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'geographical-division',
    screenNumber: '819',
    title: 'التقسيم الجغرافي',
    icon: 'MapPin',
    category: 'management',
    component: 'GeographicalDivision_Complete_819',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'appointments-management',
    screenNumber: '820',
    title: 'إدارة المواعيد',
    icon: 'Calendar',
    category: 'management',
    component: 'AppointmentsManagement_Complete_820_v8',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'surveying-data',
    screenNumber: '821',
    title: 'البيانات المساحية',
    icon: 'Map',
    category: 'management',
    component: 'SurveyingData_Complete_821',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'surveyors-management',
    screenNumber: '822',
    title: 'إدارة المساحين',
    icon: 'Compass',
    category: 'engineering',
    component: 'SurveyorsManagement_Complete_822',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'employee-contracts',
    screenNumber: '823',
    title: 'عقود الموظفين',
    icon: 'FileText',
    category: 'hr',
    component: 'EmployeeContracts_Complete_823',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'transaction-tasks-assignment',
    screenNumber: '825',
    title: 'إسناد مهام المعاملات',
    icon: 'ClipboardList',
    category: 'transactions',
    component: 'TransactionTasksAssignment_Complete_825',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'tasks-settings-advanced',
    screenNumber: '826',
    title: 'إعدادات المهام المتقدمة',
    icon: 'ClipboardList',
    category: 'settings',
    component: 'TasksSettings_Complete_826',
    hasPermission: true,
    totalTabs: 8,
  },
  {
    id: 'communication-logs',
    screenNumber: '827',
    title: 'سجلات التواصل',
    icon: 'MessageSquare',
    category: 'communication',
    component: 'CommunicationLogs_Complete_827',
    hasPermission: true,
    totalTabs: 6,
  },
  {
    id: 'general-reports-printing',
    screenNumber: '831',
    title: 'طباعة التقارير العامة',
    icon: 'Printer',
    category: 'reports',
    component: 'GeneralReportsPrinting_Complete_831',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'documents-printing',
    screenNumber: '832',
    title: 'طباعة الوثائق',
    icon: 'File',
    category: 'documents',
    component: 'DocumentsPrinting_Complete_832',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'transaction-documents-creation',
    screenNumber: '833',
    title: 'إنشاء وثائق المعاملات',
    icon: 'FileText',
    category: 'documents',
    component: 'TransactionDocumentsCreation_Complete_833',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'licenses-management',
    screenNumber: '841',
    title: 'إدارة الرخص',
    icon: 'FileText',
    category: 'management',
    component: 'LicensesManagement_Complete_841_v8',
    hasPermission: true,
    totalTabs: 16,
  },

  {
    id: 'annual-budget',
    screenNumber: '850',
    title: 'الميزانية السنوية',
    icon: 'DollarSign',
    category: 'finance',
    component: 'AnnualBudget_Complete_850',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'notes-processing',
    screenNumber: '860',
    title: 'معالجة الملاحظات',
    icon: 'MessageSquare',
    category: 'transactions',
    component: 'NotesProcessing_Complete_860_v8',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'communication-channels',
    screenNumber: '856',
    title: 'إدارة وسائل التواصل',
    icon: 'MessageSquare',
    category: 'communication',
    component: 'CommunicationChannels_Complete_856',
    hasPermission: true,
    totalTabs: 8,
  },
  {
    id: 'owner-commitments',
    screenNumber: '857',
    title: 'إدارة تعهدات الملاك',
    icon: 'FileSignature',
    category: 'commitments',
    component: 'OwnerCommitments_Complete_857',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'execution-supervision',
    screenNumber: '870',
    title: 'الإشراف على التنفيذ',
    icon: 'Building2',
    category: 'projects',
    component: 'ExecutionSupervision_Complete_870_v8',
    hasPermission: true,
    totalTabs: 14,
  },
  {
    id: 'engineering-drawings',
    screenNumber: '872',
    title: 'الرسومات الهندسية',
    icon: 'FileText',
    category: 'engineering',
    component: 'EngineeringDrawings_Complete_872_v8',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'supervision-transactions',
    screenNumber: '875',
    title: 'معاملات الإشراف على الإنشاء',
    icon: 'HardHat',
    category: 'supervision',
    component: 'SupervisionTransactions_Complete_875',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'transaction-invoices',
    screenNumber: '876',
    title: 'فواتير المعاملات',
    icon: 'Receipt',
    category: 'finance',
    component: 'TransactionInvoices_Complete_876',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'project-classifications',
    screenNumber: '880',
    title: 'تصنيفات المشاريع',
    icon: 'Layers',
    category: 'projects',
    component: 'ProjectClassifications_Complete_880',
    hasPermission: true,
    totalTabs: 15,
  },
  
  {
    id: 'marketing-management',
    screenNumber: '890',
    title: 'إدارة التسويق',
    icon: 'Megaphone',
    category: 'marketing',
    component: 'MarketingManagement_Complete_890_v3',
    hasPermission: true,
    totalTabs: 9,
  },
  {
    id: 'client-meetings',
    screenNumber: '891',
    title: 'مقابلات العملاء',
    icon: 'Users',
    category: 'clients',
    component: 'ClientMeetings_Complete_891',
    hasPermission: true,
    totalTabs: 12,
  },
  
  // ===== 900-999: الإعدادات والوثائق =====
  {
    id: 'files-documents-management',
    screenNumber: '900',
    title: 'إدارة الملفات والمستندات',
    icon: 'FolderOpen',
    category: 'documents',
    component: 'FilesDocumentsManagement_Complete_900',
    hasPermission: true,
    totalTabs: 4,
  },
  {
    id: 'documents-files-management',
    screenNumber: '901',
    title: 'نظام الملفات المتقدم',
    icon: 'FolderTree',
    category: 'documents',
    component: 'DocumentsFilesManagement_Complete_901',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'documents-receiving',
    screenNumber: '902',
    title: 'استلام وثائق',
    icon: 'Download',
    category: 'documents',
    component: 'DocumentsReceiving_Complete_902',
    hasPermission: true,
    totalTabs: 8,
  },
  {
    id: 'job-roles',
    screenNumber: '903',
    title: 'الأدوار الوظيفية',
    icon: 'UserCheck',
    category: 'hr',
    component: 'JobRoles_Complete_903_v8',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'office-branches',
    screenNumber: '905',
    title: 'فروع المكتب',
    icon: 'Building2',
    category: 'management',
    component: 'OfficeBranches_Complete_905_v1',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'professional-settings',
    screenNumber: '911',
    title: 'الإعدادات المهنية',
    icon: 'Settings',
    category: 'settings',
    component: 'ProfessionalSettings_Complete_925',
    hasPermission: true,
    totalTabs: 20,
  },
  {
    id: 'notification-settings',
    screenNumber: '922',
    title: 'إعدادات الإشعارات',
    icon: 'Bell',
    category: 'settings',
    component: 'NotificationSettingsScreen',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'requirements-management',
    screenNumber: '930',
    title: 'إدارة الاشتراطات والأدلة',
    icon: 'Shield',
    category: 'settings',
    component: 'RequirementsManagement_Complete_930_v1',
    hasPermission: true,
    totalTabs: 14,
  },
  {
    id: 'madinati-appointments',
    screenNumber: '933',
    title: 'مواعيد مدينتي',
    icon: 'Calendar',
    category: 'appointments',
    component: 'MadinatiAppointments_Complete_933',
    hasPermission: true,
    totalTabs: 7,
  },
  {
    id: 'exceptions-special-requests',
    screenNumber: '935',
    title: 'استثناءات وطلبات خاصة',
    icon: 'AlertCircle',
    category: 'transactions',
    component: 'ExceptionsSpecialRequests_Complete_935_v2',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'commitments-declarations',
    screenNumber: '940',
    title: 'تعهدات وإقرارات',
    icon: 'FileSignature',
    category: 'documents',
    component: 'CommitmentsDeclarations_Complete_940_v8',
    hasPermission: true,
    totalTabs: 14,
  },
  {
    id: 'commitments-declarations-settings',
    screenNumber: '941',
    title: 'إعدادات التعهدات والإقرارات',
    icon: 'Settings',
    category: 'settings',
    component: 'CommitmentsDeclarationsSettings_Complete_941',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'document-types',
    screenNumber: '942',
    title: 'أنواع المستندات',
    icon: 'FileText',
    category: 'documents',
    component: 'DocumentTypes_Complete_942',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'office-partners-ownership',
    screenNumber: '943',
    title: 'شركاء ملكية المكتب',
    icon: 'Shield',
    category: 'management',
    component: 'OfficePartnersOwnership_Complete_943',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'office-qualification',
    screenNumber: '944',
    title: 'المنصات والتأهيل',
    icon: 'Shield',
    category: 'management',
    component: 'PlatformsQualification_Complete_944',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'digital-assets',
    screenNumber: '946',
    title: 'الأصول الرقمية',
    icon: 'Key',
    category: 'management',
    component: 'DigitalAssets_Complete_946',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'targets-goals',
    screenNumber: '947',
    title: 'المستهدفات',
    icon: 'Target',
    category: 'management',
    component: 'TargetsGoals_Complete_947',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'sectors-districts',
    screenNumber: '948',
    title: 'قطاعات وأحياء الرياض',
    icon: 'Map',
    category: 'settings',
    component: 'SectorsDistricts_Complete_948_v2_ULTRA_ENHANCED',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'locations-map',
    screenNumber: '949',
    title: 'خريطة المواقع',
    icon: 'MapPin',
    category: 'reports',
    component: 'LocationsMap_Complete_949',
    hasPermission: true,
    totalTabs: 7,
  },
  {
    id: 'business-statistics',
    screenNumber: '951',
    title: 'إحصائيات الأعمال',
    icon: 'BarChart3',
    category: 'reports',
    component: 'BusinessStatistics_Complete_951',
    hasPermission: true,
    totalTabs: 18,
  },
  {
    id: 'fees-settings',
    screenNumber: '952',
    title: 'إعدادات الأتعاب والتسعير',
    icon: 'DollarSign',
    category: 'settings',
    component: 'FeesSettings_Complete_952_v8',
    hasPermission: true,
    totalTabs: 13,
  },
  {
    id: 'templates-forms-designer',
    screenNumber: '960',
    title: 'مصمم القوالب والنماذج',
    icon: 'Layout',
    category: 'documents',
    component: 'TemplatesFormsDesigner_Complete_960_v8_Enhanced',
    hasPermission: true,
    totalTabs: 15,
  },
  {
    id: 'official-email',
    screenNumber: '858',
    title: 'البريد الإلكتروني الرسمي',
    icon: 'Mail',
    category: 'communications',
    component: 'OfficialEmail_Complete_858',
    hasPermission: true,
    totalTabs: 10,
  },
  {
    id: 'ai-management',
    screenNumber: '970',
    title: 'إدارة الذكاء الصناعي',
    icon: 'Brain',
    category: 'system',
    component: 'AIManagement_Complete_970',
    hasPermission: true,
    totalTabs: 12,
  },
  {
    id: 'documentation-viewer',
    screenNumber: '992',
    title: 'عارض الوثائق التفصيلية',
    icon: 'BookOpen',
    category: 'system',
    component: 'DocumentationViewerScreen',
    hasPermission: true,
    totalTabs: 8,
  },
];

/**
 * الحصول على رقم الشاشة من معرّفها
 */
export function getScreenNumber(screenId: string): string {
  const screen = SCREENS_CONFIG.find(s => s.id === screenId);
  return screen?.screenNumber || '000';
}

/**
 * الحصول على تكوين الشاشة الكامل من معرّفها
 */
export function getScreenConfig(screenId: string): ScreenConfig | undefined {
  return SCREENS_CONFIG.find(s => s.id === screenId);
}

/**
 * توليد رقم تاب بناءً على رقم الشاشة ورقم التاب
 * مثال: شاشة 100، تاب 01 = 100-01
 */
export function generateTabNumber(screenId: string, tabIndex: number): string {
  const screenNumber = getScreenNumber(screenId);
  const tabNumber = String(tabIndex).padStart(2, '0');
  return `${screenNumber}-${tabNumber}`;
}

/**
 * توليد رقم شاشة كامل مع البادئة
 * مثال: شاشة 100 = شاشة 100
 */
export function getFullScreenNumber(screenId: string): string {
  const screenNumber = getScreenNumber(screenId);
  return `شاشة ${screenNumber}`;
}

/**
 * الحصول على عنوان الشاشة
 */
export function getScreenTitle(screenId: string): string {
  const screen = SCREENS_CONFIG.find(s => s.id === screenId);
  return screen?.title || 'شاشة غير معروفة';
}

/**
 * Hook مخصص للحصول على معلومات الشاشة
 */
export function useScreenConfig(screenId: string) {
  const config = getScreenConfig(screenId);
  
  return {
    screenNumber: config?.screenNumber || '000',
    screenTitle: config?.title || 'شاشة غير معروفة',
    fullScreenNumber: getFullScreenNumber(screenId),
    generateTabNumber: (tabIndex: number) => generateTabNumber(screenId, tabIndex),
    category: config?.category || 'other',
    totalTabs: config?.totalTabs || 0,
  };
}

/**
 * فلترة الشاشات حسب الفئة
 */
export function getScreensByCategory(category: string): ScreenConfig[] {
  return SCREENS_CONFIG.filter(s => s.category === category);
}

/**
 * الحصول على جميع الفئات المتاحة
 */
export function getAllCategories(): string[] {
  const categories = new Set(SCREENS_CONFIG.map(s => s.category));
  return Array.from(categories);
}

/**
 * أسماء الفئات بالعربية
 */
export const CATEGORY_NAMES: Record<string, string> = {
  dashboards: 'لوحات التحكم',
  erp: 'نظام ERP',
  transactions: 'المعاملات',
  contracts: 'العقود',
  development: 'التطوير',
  documents: 'المستندات',
  settings: 'الإعدادات',
  quality: 'الجودة والإشراف',
  projects: 'المشاريع',
  system: 'النظام',
  hr: 'الموارد البشرية',
  clients: 'العملاء',
  resources: 'الموارد والمعدات',
  reports: 'التقارير',
  accounting: 'المحاسبة',
  finance: 'المالية',
  procurement: 'المشتريات',
  inventory: 'المخزون',
  sales: 'المبيعات',
  assets: 'الأصول',
  training: 'التدريب',
  maintenance: 'الصيانة',
  safety: 'السلامة',
  other: 'أخرى',
};

/**
 * خريطة الترقيم الجديد - للمرجع السريع
 * 
 * 100: لوحة التحكم الرئيسية
 * 111: لوحة تحكم ERP
 * 200: المحاسبة العامة
 * 222: إدارة المحاسبة والمالية
 * 300: إدارة العملاء
 * 333: إدارة العملاء الشاملة
 * 355: إدارة العملاء المتقدمة (CRM)
 * 366: إدارة العلاقات المتقدمة
 * 377: إدارة العلاقات مع العملاء والمقاولين
 * 400: إدارة الموارد البشرية المتقدمة
 * 444: إدارة التدريب والتطوير
 * 455: إدارة الإجازات الرسمية
 * 500: إدارة المشتريات والموردين
 * 555: [محذوفة] إدارة الموارد والمعدات
 * 577: إدارة المبيعات والعروض
 * 588: [محذوفة] إدارة الأصول والممتلكات
 * 600: إدارة الجودة والاختبارات
 * 666: إدارة الإشراف والجودة
 * 677: الأجهزة والبرمجيات
 * 688: السلامة والأمان المهني
 * 700: إدارة المعاملات
 * 777: التقارير المالية التفصيلية
 * 800: إدارة العقود
 * 860: معالجة الملاحظات
 * 870: الإشراف على التنفيذ
 * 872: الرسومات الهندسية
 * 877: تتبع المشاريع
 * 880: تصنيفات المشاريع
 * 888: إدارة التطوير
 * 900: إدارة الملفات والمستندات
 * 911: الإعدادات المهنية
 * 922: إعدادات الإشعارات
 * 990: توثيق النظام
 * 991: دليل المستخدم
 * 992: عارض الوثائق التفصيلية
 * 999: الإدارة المتقدمة للنظام
 */

export default SCREENS_CONFIG;