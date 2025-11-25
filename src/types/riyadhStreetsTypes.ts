// src/types/riyadhStreetsTypes.ts

export interface RiyadhSector {
  id: string;
  name: string;
}

export interface RiyadhDistrict {
  id: string;
  name: string;
}

export interface RegulationDetails {
  regulationType: string;
  reason: string;
  issuingAuthority: string;
  validFrom: string;
  validUntil?: string;
  restrictions: string[];
  impacts: string[];
  notes: string;
}

export interface RiyadhStreet {
  id: string;
  streetCode: string;
  name: string;
  sectorId: string;
  sector?: RiyadhSector;
  districtId: string;
  district?: RiyadhDistrict;
  type: 'main' | 'secondary' | 'branch';
  width: number;
  length: number;
  lanes: number;
  status: 'active' | 'under-construction' | 'planned';
  lighting: boolean;
  sidewalks: boolean;
  centerLat: number;
  centerLng: number;
  hasSpecialRegulation: boolean;
  regulationDetails?: RegulationDetails | null; // يمكن أن يكون null إذا لم يوجد تنظيم
  createdAt: string;
}

export interface CreateStreetPayload {
  name: string;
  sectorId: string;
  districtId: string; // ✅ تمت إضافته
  type: string;
  width: number;
  length: number;
  lanes: number;
  status: string;
  centerLat?: number;
  centerLng?: number;
  lighting: boolean;
  sidewalks: boolean;
  hasSpecialRegulation: boolean;
  regulationDetails?: RegulationDetails;
}

export interface StreetStatistics {
  total: number;
  withRegulations: number;
  active: number;
  lighting: number;
  totalLength: number;
  byType: { 
    type: string; 
    _count: { id: number }; 
    _sum: { length: number; width: number; lanes: number } 
  }[];
}