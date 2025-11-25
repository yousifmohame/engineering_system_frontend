export interface SetbackRow {
  direction: string; // الشمال، الشرق، ...
  description: string; // شارع عرض 60م
  length: string; // الطول
  licenseSetback: string; // الارتداد حسب الرخصة
  actualSetback: string; // الارتداد حسب الطبيعة
  notes: string; // ملاحظات (مطابق...)
}

export interface ComponentRow {
  floor: string; // أرضي، أول...
  usage: string; // سكني، تجاري
  units: string; // عدد الوحدات
  area: string; // المساحة
  percentage: string; // النسبة
}

export interface TechnicalReportData {
  id?: string;
  reportNumber?: string;
  reportDate: string;
  transactionId: string;
  
  // ترويسة
  oldLicenseNumber: string;
  oldLicenseDate: string;
  municipality: string;
  
  // المالك والموقع
  ownerName: string;
  deedNumber: string;
  deedDate: string;
  district: string;
  commercialRecord: string;
  plotNumber: string;
  planNumber: string;
  area: string;
  
  purpose: string;
  
  // الجداول (JSON)
  setbacks: SetbackRow[];
  
  componentsLicense: ComponentRow[];
  componentsActual: ComponentRow[];
  
  landAreaLicense: string;
  landAreaActual: string;
  
  fencesLicense: string;
  fencesActual: string;
  
  siteStatus: string;
}