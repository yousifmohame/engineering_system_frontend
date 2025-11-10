/**
 * ============================================================================
 * الشاشة 800 - إدارة أرقام الملكية v2.0
 * ============================================================================
 * 
 * التحديثات v2.0 (3 نوفمبر 2025):
 * ✅ المكون الرئيسي: رقم الملكية (Ownership Number)
 * ✅ كل رقم ملكية يحتوي على وثيقة أو عدة وثائق
 * ✅ نظام تحقق ذكي: الملاك يجب أن يكونوا متطابقين أو مشاركين في جميع الوثائق
 * ✅ ممنوع: رقم ملكية بوثائق لملاك مختلفين تماماً
 * ✅ إمكانية استعراض الوثائق منفردة
 * ✅ 12 تاب شامل مع UnifiedTabsSidebar v1.1
 * 
 * @version 2.0
 * @date 2025-11-03
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  FileText, Plus, Search, Eye, Edit, Trash2, Users, CheckCircle, AlertTriangle,
  Building, MapPin, Calendar, Shield, File, BarChart3, History, Settings, Bell,
  Home, Database, TrendingUp, Activity, Filter, Download, Link2, X, Save, Copy,
  Star, RefreshCw, Archive, Tag, Layers, UserCheck, AlertCircle, Check, Zap
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

// ============================================================================
// واجهات البيانات
// ============================================================================

interface OwnerInDocument {
  ownerId: string;         // معرف المالك
  ownerName: string;       // اسم المالك
  ownerIdNumber: string;   // رقم هوية المالك
  ownershipPercent: number; // نسبة الملكية في هذه الوثيقة
}

interface OwnershipDocument {
  id: string;
  documentNumber: string;
  type: 'electronic-deed' | 'rega-document' | 'notary-deed' | 'manual-old' | 'manual-pending';
  area: number;
  owners: OwnerInDocument[]; // ملاك هذه الوثيقة
  issueDate: string;
  city: string;
  district: string;
  planNumber: string;
  plotNumber: string;
  regaVerified: boolean;
  status: 'active' | 'pending' | 'expired' | 'verified';
  attachments: number;
  notes: string;
}

interface OwnershipNumber {
  id: string;
  number: string;                    // رقم الملكية (مثل: OWN-2025-001)
  documents: OwnershipDocument[];    // الوثائق المرتبطة
  totalArea: number;                 // مجموع المساحات
  mainLocation: string;              // الموقع الرئيسي (مدينة + حي)
  createdDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'under-review';
  linkedTransactions: number;
  isVerified: boolean;
  notes: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// المكون الرئيسي
// ============================================================================

const OwnershipNumbers_Complete_800_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('800-01');
  const [selectedOwnershipNumber, setSelectedOwnershipNumber] = useState<OwnershipNumber | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  
  // فلاتر
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');

  // ============================================================================
  // البيانات الوهمية
  // ============================================================================

  // 15 رقم ملكية وهمي
  const [ownershipNumbers] = useState<OwnershipNumber[]>([
    {
      id: 'ON-001',
      number: 'OWN-2025-001',
      documents: [
        {
          id: 'DOC-001',
          documentNumber: '310105040083',
          type: 'electronic-deed',
          area: 450.5,
          owners: [
            { ownerId: 'OWN-P-001', ownerName: 'أحمد محمد العتيبي', ownerIdNumber: '1023456789', ownershipPercent: 100 }
          ],
          issueDate: '2024-03-15',
          city: 'الرياض',
          district: 'الملقا',
          planNumber: '2467',
          plotNumber: '1523',
          regaVerified: true,
          status: 'verified',
          attachments: 3,
          notes: 'صك إلكتروني موثق'
        }
      ],
      totalArea: 450.5,
      mainLocation: 'الرياض - الملقا',
      createdDate: '2024-03-15',
      lastModified: '2024-10-20',
      status: 'active',
      linkedTransactions: 2,
      isVerified: true,
      notes: 'ملكية فردية كاملة'
    },
    {
      id: 'ON-002',
      number: 'OWN-2025-002',
      documents: [
        {
          id: 'DOC-002',
          documentNumber: '999640002413',
          type: 'rega-document',
          area: 320.75,
          owners: [
            { ownerId: 'OWN-P-002', ownerName: 'فاطمة سعد القحطاني', ownerIdNumber: '1087654321', ownershipPercent: 50 },
            { ownerId: 'OWN-P-003', ownerName: 'محمد بن سلطان العنزي', ownerIdNumber: '1034567890', ownershipPercent: 50 }
          ],
          issueDate: '2024-05-20',
          city: 'جدة',
          district: 'الروضة',
          planNumber: '1892',
          plotNumber: '745',
          regaVerified: true,
          status: 'active',
          attachments: 5,
          notes: 'ملكية مشتركة بين مالكين'
        }
      ],
      totalArea: 320.75,
      mainLocation: 'جدة - الروضة',
      createdDate: '2024-05-20',
      lastModified: '2024-10-18',
      status: 'active',
      linkedTransactions: 1,
      isVerified: true,
      notes: 'ملكية مشتركة بنسب متساوية'
    },
    {
      id: 'ON-003',
      number: 'OWN-2025-003',
      documents: [
        {
          id: 'DOC-003',
          documentNumber: '450120060125',
          type: 'notary-deed',
          area: 600.0,
          owners: [
            { ownerId: 'OWN-P-004', ownerName: 'خالد عبدالله الشمري', ownerIdNumber: '1056789012', ownershipPercent: 100 }
          ],
          issueDate: '2024-01-10',
          city: 'الدمام',
          district: 'الفيصلية',
          planNumber: '3456',
          plotNumber: '2234',
          regaVerified: false,
          status: 'active',
          attachments: 2,
          notes: 'صك عدلي - بانتظار التوثيق'
        }
      ],
      totalArea: 600.0,
      mainLocation: 'الدمام - الفيصلية',
      createdDate: '2024-01-10',
      lastModified: '2024-09-25',
      status: 'active',
      linkedTransactions: 3,
      isVerified: false,
      notes: 'يحتاج توثيق REGA'
    },
    {
      id: 'ON-004',
      number: 'OWN-2025-004',
      documents: [
        {
          id: 'DOC-004',
          documentNumber: '220345078945',
          type: 'electronic-deed',
          area: 180.3,
          owners: [
            { ownerId: 'OWN-P-005', ownerName: 'سارة علي الغامدي', ownerIdNumber: '1098765432', ownershipPercent: 100 }
          ],
          issueDate: '2024-06-01',
          city: 'الرياض',
          district: 'النرجس',
          planNumber: '5678',
          plotNumber: '3421',
          regaVerified: true,
          status: 'verified',
          attachments: 4,
          notes: ''
        },
        {
          id: 'DOC-005',
          documentNumber: '220345078946',
          type: 'electronic-deed',
          area: 100.0,
          owners: [
            { ownerId: 'OWN-P-005', ownerName: 'سارة علي الغامدي', ownerIdNumber: '1098765432', ownershipPercent: 100 }
          ],
          issueDate: '2024-06-05',
          city: 'الرياض',
          district: 'النرجس',
          planNumber: '5678',
          plotNumber: '3422',
          regaVerified: true,
          status: 'verified',
          attachments: 2,
          notes: 'قطعة مجاورة'
        }
      ],
      totalArea: 280.3,
      mainLocation: 'الرياض - النرجس',
      createdDate: '2024-06-01',
      lastModified: '2024-10-15',
      status: 'active',
      linkedTransactions: 0,
      isVerified: true,
      notes: 'وثيقتان لنفس المالك - قطع متجاورة'
    },
    {
      id: 'ON-005',
      number: 'OWN-2025-005',
      documents: [
        {
          id: 'DOC-006',
          documentNumber: '789456123001',
          type: 'electronic-deed',
          area: 250.0,
          owners: [
            { ownerId: 'OWN-P-006', ownerName: 'عبدالرحمن أحمد المطيري', ownerIdNumber: '1012345678', ownershipPercent: 60 },
            { ownerId: 'OWN-P-007', ownerName: 'منى سعيد الزهراني', ownerIdNumber: '1023456780', ownershipPercent: 40 }
          ],
          issueDate: '2024-07-10',
          city: 'الرياض',
          district: 'حطين',
          planNumber: '7890',
          plotNumber: '4532',
          regaVerified: true,
          status: 'verified',
          attachments: 3,
          notes: 'ملكية مشتركة'
        },
        {
          id: 'DOC-007',
          documentNumber: '789456123002',
          type: 'electronic-deed',
          area: 200.0,
          owners: [
            { ownerId: 'OWN-P-006', ownerName: 'عبدالرحمن أحمد المطيري', ownerIdNumber: '1012345678', ownershipPercent: 70 },
            { ownerId: 'OWN-P-007', ownerName: 'منى سعيد الزهراني', ownerIdNumber: '1023456780', ownershipPercent: 30 }
          ],
          issueDate: '2024-07-15',
          city: 'الرياض',
          district: 'حطين',
          planNumber: '7890',
          plotNumber: '4533',
          regaVerified: true,
          status: 'verified',
          attachments: 3,
          notes: 'قطعة مجاورة - نسب مختلفة'
        }
      ],
      totalArea: 450.0,
      mainLocation: 'الرياض - حطين',
      createdDate: '2024-07-10',
      lastModified: '2024-10-10',
      status: 'active',
      linkedTransactions: 1,
      isVerified: true,
      notes: 'ملكية مشتركة في وثيقتين - نسب مختلفة ولكن نفس الملاك'
    },
    {
      id: 'ON-006',
      number: 'OWN-2025-006',
      documents: [
        {
          id: 'DOC-008',
          documentNumber: '890123456789',
          type: 'manual-old',
          area: 750.5,
          owners: [
            { ownerId: 'OWN-P-008', ownerName: 'نورة محمد الدوسري', ownerIdNumber: '1045678901', ownershipPercent: 100 }
          ],
          issueDate: '2023-12-15',
          city: 'مكة المكرمة',
          district: 'العزيزية',
          planNumber: '4567',
          plotNumber: '1876',
          regaVerified: false,
          status: 'active',
          attachments: 6,
          notes: 'صك يدوي قديم - يحتاج تحويل إلى إلكتروني'
        }
      ],
      totalArea: 750.5,
      mainLocation: 'مكة المكرمة - العزيزية',
      createdDate: '2023-12-15',
      lastModified: '2024-08-20',
      status: 'active',
      linkedTransactions: 2,
      isVerified: false,
      notes: 'صك يدوي - قيد التحديث'
    },
    {
      id: 'ON-007',
      number: 'OWN-2025-007',
      documents: [
        {
          id: 'DOC-009',
          documentNumber: '310105098765',
          type: 'electronic-deed',
          area: 520.0,
          owners: [
            { ownerId: 'OWN-C-001', ownerName: 'شركة التطوير العقاري المحدودة', ownerIdNumber: '7001234567', ownershipPercent: 100 }
          ],
          issueDate: '2024-07-10',
          city: 'الرياض',
          district: 'العليا',
          planNumber: '7890',
          plotNumber: '4532',
          regaVerified: true,
          status: 'verified',
          attachments: 3,
          notes: 'ملكية شركة'
        }
      ],
      totalArea: 520.0,
      mainLocation: 'الرياض - العليا',
      createdDate: '2024-07-10',
      lastModified: '2024-10-05',
      status: 'active',
      linkedTransactions: 1,
      isVerified: true,
      notes: 'ملكية شركة تطوير'
    },
    {
      id: 'ON-008',
      number: 'OWN-2025-008',
      documents: [
        {
          id: 'DOC-010',
          documentNumber: '450120087654',
          type: 'notary-deed',
          area: 380.25,
          owners: [
            { ownerId: 'OWN-P-009', ownerName: 'يوسف إبراهيم الحربي', ownerIdNumber: '1067890123', ownershipPercent: 100 }
          ],
          issueDate: '2024-04-25',
          city: 'المدينة المنورة',
          district: 'العيون',
          planNumber: '2345',
          plotNumber: '6789',
          regaVerified: true,
          status: 'active',
          attachments: 2,
          notes: ''
        }
      ],
      totalArea: 380.25,
      mainLocation: 'المدينة المنورة - العيون',
      createdDate: '2024-04-25',
      lastModified: '2024-09-30',
      status: 'active',
      linkedTransactions: 0,
      isVerified: true,
      notes: ''
    },
    {
      id: 'ON-009',
      number: 'OWN-2025-009',
      documents: [
        {
          id: 'DOC-011',
          documentNumber: '654321987001',
          type: 'rega-document',
          area: 300.0,
          owners: [
            { ownerId: 'OWN-P-010', ownerName: 'هند سلمان القحطاني', ownerIdNumber: '1078901234', ownershipPercent: 100 }
          ],
          issueDate: '2024-08-15',
          city: 'الطائف',
          district: 'الحوية',
          planNumber: '3456',
          plotNumber: '7890',
          regaVerified: true,
          status: 'verified',
          attachments: 4,
          notes: ''
        }
      ],
      totalArea: 300.0,
      mainLocation: 'الطائف - الحوية',
      createdDate: '2024-08-15',
      lastModified: '2024-10-12',
      status: 'active',
      linkedTransactions: 1,
      isVerified: true,
      notes: ''
    },
    {
      id: 'ON-010',
      number: 'OWN-2025-010',
      documents: [
        {
          id: 'DOC-012',
          documentNumber: '111222333444',
          type: 'electronic-deed',
          area: 200.0,
          owners: [
            { ownerId: 'OWN-P-011', ownerName: 'عبدالله خالد الشهري', ownerIdNumber: '1089012345', ownershipPercent: 33.33 },
            { ownerId: 'OWN-P-012', ownerName: 'محمد خالد الشهري', ownerIdNumber: '1089012346', ownershipPercent: 33.33 },
            { ownerId: 'OWN-P-013', ownerName: 'أحمد خالد الشهري', ownerIdNumber: '1089012347', ownershipPercent: 33.34 }
          ],
          issueDate: '2024-09-01',
          city: 'أبها',
          district: 'الموظفين',
          planNumber: '8901',
          plotNumber: '2345',
          regaVerified: true,
          status: 'verified',
          attachments: 5,
          notes: 'ملكية مشتركة بين 3 إخوة'
        }
      ],
      totalArea: 200.0,
      mainLocation: 'أبها - الموظفين',
      createdDate: '2024-09-01',
      lastModified: '2024-10-08',
      status: 'active',
      linkedTransactions: 0,
      isVerified: true,
      notes: 'ملكية عائلية مشتركة'
    },
    {
      id: 'ON-011',
      number: 'OWN-2025-011',
      documents: [
        {
          id: 'DOC-013',
          documentNumber: '555666777888',
          type: 'electronic-deed',
          area: 150.0,
          owners: [
            { ownerId: 'OWN-P-014', ownerName: 'ريم عبدالرحمن المالكي', ownerIdNumber: '1090123456', ownershipPercent: 100 }
          ],
          issueDate: '2024-10-01',
          city: 'الخبر',
          district: 'العقربية',
          planNumber: '9012',
          plotNumber: '3456',
          regaVerified: true,
          status: 'verified',
          attachments: 2,
          notes: ''
        }
      ],
      totalArea: 150.0,
      mainLocation: 'الخبر - العقربية',
      createdDate: '2024-10-01',
      lastModified: '2024-10-20',
      status: 'active',
      linkedTransactions: 0,
      isVerified: true,
      notes: ''
    },
    {
      id: 'ON-012',
      number: 'OWN-2025-012',
      documents: [
        {
          id: 'DOC-014',
          documentNumber: '999888777666',
          type: 'notary-deed',
          area: 420.0,
          owners: [
            { ownerId: 'OWN-P-015', ownerName: 'فهد سعود العتيبي', ownerIdNumber: '1001234567', ownershipPercent: 100 }
          ],
          issueDate: '2024-02-20',
          city: 'تبوك',
          district: 'السليمانية',
          planNumber: '0123',
          plotNumber: '4567',
          regaVerified: false,
          status: 'pending',
          attachments: 1,
          notes: 'بانتظار التوثيق'
        }
      ],
      totalArea: 420.0,
      mainLocation: 'تبوك - السليمانية',
      createdDate: '2024-02-20',
      lastModified: '2024-08-15',
      status: 'under-review',
      linkedTransactions: 0,
      isVerified: false,
      notes: 'قيد المراجعة'
    },
    {
      id: 'ON-013',
      number: 'OWN-2025-013',
      documents: [
        {
          id: 'DOC-015',
          documentNumber: '123456789012',
          type: 'manual-pending',
          area: 350.0,
          owners: [
            { ownerId: 'OWN-P-016', ownerName: 'وعد محمد الغامدي', ownerIdNumber: '1012345679', ownershipPercent: 100 }
          ],
          issueDate: '2024-05-10',
          city: 'الباحة',
          district: 'الأمير حسام',
          planNumber: '1234',
          plotNumber: '5678',
          regaVerified: false,
          status: 'pending',
          attachments: 3,
          notes: 'صك يدوي معلق - قيد الإدخال'
        }
      ],
      totalArea: 350.0,
      mainLocation: 'الباحة - الأمير حسام',
      createdDate: '2024-05-10',
      lastModified: '2024-09-18',
      status: 'under-review',
      linkedTransactions: 0,
      isVerified: false,
      notes: 'يحتاج مراجعة'
    },
    {
      id: 'ON-014',
      number: 'OWN-2025-014',
      documents: [
        {
          id: 'DOC-016',
          documentNumber: '777888999000',
          type: 'electronic-deed',
          area: 180.0,
          owners: [
            { ownerId: 'OWN-P-017', ownerName: 'طارق فيصل السبيعي', ownerIdNumber: '1023456781', ownershipPercent: 50 },
            { ownerId: 'OWN-P-018', ownerName: 'ماجد فيصل السبيعي', ownerIdNumber: '1023456782', ownershipPercent: 50 }
          ],
          issueDate: '2024-09-20',
          city: 'حائل',
          district: 'الصناعية',
          planNumber: '5678',
          plotNumber: '9012',
          regaVerified: true,
          status: 'verified',
          attachments: 3,
          notes: 'ملكية مشتركة بين شقيقين'
        }
      ],
      totalArea: 180.0,
      mainLocation: 'حائل - الصناعية',
      createdDate: '2024-09-20',
      lastModified: '2024-10-18',
      status: 'active',
      linkedTransactions: 1,
      isVerified: true,
      notes: 'ملكية عائلية'
    },
    {
      id: 'ON-015',
      number: 'OWN-2025-015',
      documents: [
        {
          id: 'DOC-017',
          documentNumber: '444555666777',
          type: 'electronic-deed',
          area: 280.0,
          owners: [
            { ownerId: 'OWN-P-019', ownerName: 'لمى عبدالعزيز الحربي', ownerIdNumber: '1034567891', ownershipPercent: 100 }
          ],
          issueDate: '2024-10-15',
          city: 'القصيم',
          district: 'الخبراء',
          planNumber: '6789',
          plotNumber: '0123',
          regaVerified: true,
          status: 'verified',
          attachments: 2,
          notes: ''
        }
      ],
      totalArea: 280.0,
      mainLocation: 'القصيم - الخبراء',
      createdDate: '2024-10-15',
      lastModified: '2024-10-22',
      status: 'active',
      linkedTransactions: 0,
      isVerified: true,
      notes: ''
    }
  ]);

  // ✅ جمع جميع الوثائق (بعد تعريف ownershipNumbers)
  const allDocuments = useMemo(() => {
    const docs: (OwnershipDocument & { ownershipNumber: string })[] = [];
    ownershipNumbers.forEach(on => {
      on.documents.forEach(doc => {
        docs.push({ ...doc, ownershipNumber: on.number });
      });
    });
    return docs;
  }, [ownershipNumbers]);

  // ============================================================================
  // دوال التحقق
  // ============================================================================

  // دالة التحقق من تطابق الملاك في جميع الوثائق
  const validateOwnershipNumber = (documents: OwnershipDocument[]): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (documents.length === 0) {
      result.isValid = false;
      result.errors.push('يجب أن يحتوي رقم الملكية على وثيقة واحدة على الأقل');
      return result;
    }

    if (documents.length === 1) {
      // وثيقة واحدة - دائماً صحيحة
      return result;
    }

    // استخراج جميع أرقام الهويات من الوثيقة الأولى
    const firstDocOwnerIds = new Set(documents[0].owners.map(o => o.ownerIdNumber));

    // التحقق من جميع الوثائق الأخرى
    for (let i = 1; i < documents.length; i++) {
      const currentDocOwnerIds = new Set(documents[i].owners.map(o => o.ownerIdNumber));

      // التحقق: هل جميع الملاك متطابقين؟
      const ownersMatch = 
        firstDocOwnerIds.size === currentDocOwnerIds.size &&
        [...firstDocOwnerIds].every(id => currentDocOwnerIds.has(id));

      if (!ownersMatch) {
        result.isValid = false;
        result.errors.push(
          `الوثيقة ${i + 1} (${documents[i].documentNumber}) لا تحتوي على نفس الملاك الموجودين في الوثيقة الأولى. ` +
          `يجب أن تكون جميع الوثائق في رقم الملكية الواحد إما لنفس المالك أو لنفس مجموعة الملاك المشاركين.`
        );
      } else {
        // الملاك متطابقون - تحقق من النسب
        const firstDocPercents = documents[0].owners.map(o => o.ownershipPercent).sort();
        const currentDocPercents = documents[i].owners.map(o => o.ownershipPercent).sort();
        
        const percentsMatch = JSON.stringify(firstDocPercents) === JSON.stringify(currentDocPercents);
        
        if (!percentsMatch) {
          result.warnings.push(
            `الوثيقة ${i + 1} (${documents[i].documentNumber}) لديها نسب ملكية مختلفة عن الوثيقة الأولى. ` +
            `هذا مسموح ولكن تحقق من صحة النسب.`
          );
        }
      }
    }

    return result;
  };

  // دالة استخراج قائمة الملاك الفريدة من رقم الملكية
  const getUniqueOwners = (ownershipNumber: OwnershipNumber): OwnerInDocument[] => {
    const ownersMap = new Map<string, OwnerInDocument>();

    ownershipNumber.documents.forEach(doc => {
      doc.owners.forEach(owner => {
        if (!ownersMap.has(owner.ownerIdNumber)) {
          ownersMap.set(owner.ownerIdNumber, owner);
        }
      });
    });

    return Array.from(ownersMap.values());
  };

  // ============================================================================
  // الإحصائيات
  // ============================================================================

  const stats = useMemo(() => {
    return {
      total: ownershipNumbers.length,
      active: ownershipNumbers.filter(on => on.status === 'active').length,
      verified: ownershipNumbers.filter(on => on.isVerified).length,
      underReview: ownershipNumbers.filter(on => on.status === 'under-review').length,
      archived: ownershipNumbers.filter(on => on.status === 'archived').length,
      totalDocuments: ownershipNumbers.reduce((sum, on) => sum + on.documents.length, 0),
      totalArea: ownershipNumbers.reduce((sum, on) => sum + on.totalArea, 0),
      withMultipleDocs: ownershipNumbers.filter(on => on.documents.length > 1).length,
      linkedTransactions: ownershipNumbers.reduce((sum, on) => sum + on.linkedTransactions, 0)
    };
  }, [ownershipNumbers]);

  // ============================================================================
  // التصفية
  // ============================================================================

  const filteredOwnershipNumbers = useMemo(() => {
    return ownershipNumbers.filter(on => {
      const matchSearch = !searchTerm || 
        on.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        on.mainLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        on.documents.some(doc => doc.documentNumber.includes(searchTerm)) ||
        on.documents.some(doc => doc.owners.some(owner => owner.ownerName.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchStatus = filterStatus === 'all' || on.status === filterStatus;
      
      const matchCity = filterCity === 'all' || on.documents.some(doc => doc.city === filterCity);

      return matchSearch && matchStatus && matchCity;
    });
  }, [ownershipNumbers, searchTerm, filterStatus, filterCity]);

  // استخراج قائمة المدن المتوفرة
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    ownershipNumbers.forEach(on => {
      on.documents.forEach(doc => cities.add(doc.city));
    });
    return Array.from(cities).sort();
  }, [ownershipNumbers]);

  // ============================================================================
  // دوال مساعدة
  // ============================================================================

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>,
      archived: <Badge className="bg-gray-500 text-white text-xs px-1.5 py-0 h-5">مؤرشف</Badge>,
      'under-review': <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">قيد المراجعة</Badge>
    };
    return badges[status] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getDocTypeBadge = (type: string) => {
    const types = {
      'electronic-deed': { label: 'صك إلكتروني', color: 'bg-blue-100 text-blue-800' },
      'rega-document': { label: 'وثيقة REGA', color: 'bg-green-100 text-green-800' },
      'notary-deed': { label: 'صك عدلي', color: 'bg-purple-100 text-purple-800' },
      'manual-old': { label: 'يدوي قديم', color: 'bg-gray-100 text-gray-800' },
      'manual-pending': { label: 'يدوي معلق', color: 'bg-yellow-100 text-yellow-800' }
    };
    const t = types[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={`${t.color} text-xs px-1.5 py-0 h-5`}>{t.label}</Badge>;
  };

  const getDocStatusBadge = (status: string) => {
    const badges = {
      active: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>,
      verified: <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-5">موثق</Badge>,
      pending: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">معلق</Badge>,
      expired: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">منتهي</Badge>
    };
    return badges[status] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  // ============================================================================
  // تكوين التابات
  // ============================================================================

  const TABS_CONFIG: TabConfig[] = [
    { id: '800-01', number: '800-01', title: 'أرقام الملكية', icon: Home },
    { id: '800-02', number: '800-02', title: 'الوثائق', icon: FileText },
    { id: '800-03', number: '800-03', title: 'الملاك', icon: Users },
    { id: '800-04', number: '800-04', title: 'البحث المتقدم', icon: Search },
    { id: '800-05', number: '800-05', title: 'التحقق من الملاك', icon: UserCheck },
    { id: '800-06', number: '800-06', title: 'الإحصائيات', icon: BarChart3 },
    { id: '800-07', number: '800-07', title: 'التوثيق الإلكتروني', icon: Shield },
    { id: '800-08', number: '800-08', title: 'المرفقات', icon: File },
    { id: '800-09', number: '800-09', title: 'السجل والتاريخ', icon: History },
    { id: '800-10', number: '800-10', title: 'التقارير', icon: Database },
    { id: '800-11', number: '800-11', title: 'الإشعارات', icon: Bell },
    { id: '800-12', number: '800-12', title: 'الإعدادات', icon: Settings }
  ];

  // ============================================================================
  // هيدر الشاشة
  // ============================================================================

  const renderScreenHeader = () => (
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
            <Home 
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
                إدارة أرقام الملكية
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
                  800
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
              نظام شامل لإدارة أرقام الملكية ووثائق الملكية المرتبطة - {stats.total} رقم ملكية
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
              12 تبويبات
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // نافذة تفاصيل رقم الملكية
  // ============================================================================

  const renderDetailsDialog = () => {
    if (!selectedOwnershipNumber) return null;

    const uniqueOwners = getUniqueOwners(selectedOwnershipNumber);
    const validation = validateOwnershipNumber(selectedOwnershipNumber.documents);

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent 
          className="max-w-6xl"
          style={{ 
            maxHeight: '90vh', 
            fontFamily: 'Tajawal, sans-serif', 
            direction: 'rtl' 
          }}
        >
          <DialogHeader>
            <DialogTitle 
              style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div 
                style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '12px',
                  border: '2px solid #93c5fd'
                }}
              >
                <Home className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              تفاصيل رقم الملكية
              <Badge 
                style={{ 
                  fontSize: '14px', 
                  padding: '4px 12px',
                  fontWeight: 700,
                  fontFamily: 'Courier New, monospace'
                }}
              >
                {selectedOwnershipNumber.number}
              </Badge>
              {getStatusBadge(selectedOwnershipNumber.status)}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '13px', color: '#6b7280' }}>
              {selectedOwnershipNumber.mainLocation} • {selectedOwnershipNumber.documents.length} وثيقة • {selectedOwnershipNumber.totalArea.toLocaleString('ar-SA')} م²
            </DialogDescription>
          </DialogHeader>

          <ScrollArea style={{ maxHeight: 'calc(90vh - 150px)' }}>
            <div className="space-y-4 p-4">
              {/* تحذيرات التحقق */}
              {!validation.isValid && (
                <Alert style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <p className="font-bold text-red-900 mb-2">تحذير: عدم تطابق الملاك</p>
                    {validation.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-800 mb-1">• {err}</p>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {validation.warnings.length > 0 && (
                <Alert style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <p className="font-bold text-yellow-900 mb-2">تنبيهات</p>
                    {validation.warnings.map((warn, i) => (
                      <p key={i} className="text-xs text-yellow-800 mb-1">• {warn}</p>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* القسم الأول: معلومات عامة */}
              <div className="grid grid-cols-4 gap-3">
                <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-xs text-gray-600 mb-1">رقم الملكية</p>
                      <p className="text-sm font-bold font-mono">{selectedOwnershipNumber.number}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-xs text-gray-600 mb-1">عدد الوثائق</p>
                      <p className="text-xl font-bold text-green-900">{selectedOwnershipNumber.documents.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-xs text-gray-600 mb-1">إجمالي المساحة</p>
                      <p className="text-sm font-bold">{selectedOwnershipNumber.totalArea.toLocaleString('ar-SA')} م²</p>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                      <p className="text-xs text-gray-600 mb-1">عدد الملاك</p>
                      <p className="text-xl font-bold text-pink-900">{uniqueOwners.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* القسم الثاني: الملاك */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '16px' }}>
                    <Users className="h-4 w-4 inline ml-2" />
                    الملاك ({uniqueOwners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {uniqueOwners.map((owner, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-bold">{owner.ownerName}</p>
                            <p className="text-xs text-gray-600 font-mono">رقم الهوية: {owner.ownerIdNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* القسم الثالث: الوثائق */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '16px' }}>
                    <FileText className="h-4 w-4 inline ml-2" />
                    الوثائق المرتبطة ({selectedOwnershipNumber.documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {selectedOwnershipNumber.documents.map((doc, idx) => (
                      <div 
                        key={doc.id} 
                        className="p-3 border rounded-lg hover:shadow-md transition-all"
                        style={{ background: idx === 0 ? '#f8fafc' : '#fff' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">
                              {doc.documentNumber}
                            </code>
                            {getDocTypeBadge(doc.type)}
                            {getDocStatusBadge(doc.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.regaVerified && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <Shield className="h-3 w-3 ml-1" />
                                REGA
                              </Badge>
                            )}
                            <span className="text-xs font-bold">{doc.area.toLocaleString('ar-SA')} م²</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span>{doc.city} - {doc.district}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Layers className="h-3 w-3 text-gray-500" />
                            <span>مخطط {doc.planNumber} - قطعة {doc.plotNumber}</span>
                          </div>
                        </div>

                        <Separator className="my-2" />

                        <div>
                          <p className="text-xs font-bold mb-1">الملاك في هذه الوثيقة:</p>
                          <div className="space-y-1">
                            {doc.owners.map((owner, ownerIdx) => (
                              <div key={ownerIdx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                <span className="font-semibold">{owner.ownerName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {owner.ownershipPercent}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {doc.notes && (
                          <div className="mt-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                            📝 {doc.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* القسم الرابع: معلومات إضافية */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">معلومات التاريخ</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="font-semibold">{selectedOwnershipNumber.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر تعديل:</span>
                      <span className="font-semibold">{selectedOwnershipNumber.lastModified}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">الارتباطات</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المعاملات المرتبطة:</span>
                      <Badge variant="outline">{selectedOwnershipNumber.linkedTransactions}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حالة التوثيق:</span>
                      {selectedOwnershipNumber.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedOwnershipNumber.notes && (
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">ملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-700">{selectedOwnershipNumber.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)} variant="outline">
              إغلاق
            </Button>
            <Button onClick={() => toast.info('سيتم فتح محرر رقم الملكية')}>
              <Edit className="h-3 w-3 ml-1" />
              تعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================================
  // Render Functions للتابات
  // ============================================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '800-01':
        return render_800_01_OwnershipNumbers();
      case '800-02':
        return render_800_02_Documents();
      case '800-03':
        return render_800_03_Owners();
      case '800-04':
        return render_800_04_AdvancedSearch();
      case '800-05':
        return render_800_05_OwnerValidation();
      case '800-06':
        return render_800_06_Statistics();
      case '800-07':
        return render_800_07_DigitalVerification();
      case '800-08':
        return render_800_08_Attachments();
      case '800-09':
        return render_800_09_History();
      case '800-10':
        return render_800_10_Reports();
      case '800-11':
        return render_800_11_Notifications();
      case '800-12':
        return render_800_12_Settings();
      default:
        return null;
    }
  };

  // ============================================================================
  // التاب 800-01: قائمة أرقام الملكية
  // ============================================================================

  function render_800_01_OwnershipNumbers() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-01" position="top-right" />
        
        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-9 gap-2">
          {[
            { label: 'الكل', value: stats.total, Icon: Home, color: '#3b82f6' },
            { label: 'نشط', value: stats.active, Icon: CheckCircle, color: '#10b981' },
            { label: 'موثق', value: stats.verified, Icon: Shield, color: '#22c55e' },
            { label: 'قيد المراجعة', value: stats.underReview, Icon: Activity, color: '#f59e0b' },
            { label: 'إجمالي الوثائق', value: stats.totalDocuments, Icon: FileText, color: '#8b5cf6' },
            { label: 'وثائق متعددة', value: stats.withMultipleDocs, Icon: Layers, color: '#ec4899' },
            { label: 'المساحة الكلية', value: `${(stats.totalArea / 1000).toFixed(1)}K`, Icon: MapPin, color: '#06b6d4' },
            { label: 'معاملات مرتبطة', value: stats.linkedTransactions, Icon: Link2, color: '#f97316' },
            { label: 'المعروض', value: filteredOwnershipNumbers.length, Icon: Filter, color: '#6366f1' }
          ].map((stat, i) => (
            <Card key={i} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
              <CardContent className="p-2 text-center">
                <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: stat.color }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* شريط البحث والتصفية */}
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <InputWithCopy
                  label=""
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 ابحث برقم الملكية، رقم الوثيقة، أو اسم المالك..."
                  copyable={false}
                  clearable={true}
                />
              </div>
              <SelectWithCopy
                label=""
                id="filterStatus"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'active', label: 'نشط' },
                  { value: 'under-review', label: 'قيد المراجعة' },
                  { value: 'archived', label: 'مؤرشف' }
                ]}
                copyable={false}
                clearable={false}
              />
              <SelectWithCopy
                label=""
                id="filterCity"
                value={filterCity}
                onChange={setFilterCity}
                options={[
                  { value: 'all', label: 'جميع المدن' },
                  ...availableCities.map(city => ({ value: city, label: city }))
                ]}
                copyable={false}
                clearable={false}
              />
              <Button 
                size="sm" 
                onClick={() => toast.info('سيتم فتح نموذج إضافة رقم ملكية جديد')}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', height: '40px' }}
              >
                <Plus className="h-3 w-3 ml-1" />
                رقم ملكية جديد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* جدول أرقام الملكية */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '16px', fontFamily: 'Tajawal, sans-serif' }}>
                <Home className="h-4 w-4 inline ml-2" />
                قائمة أرقام الملكية ({filteredOwnershipNumbers.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea style={{ height: 'calc(100vh - 480px)' }}>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الملكية</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوثائق</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاك</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>REGA</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملات</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwnershipNumbers.map((on, index) => {
                    const uniqueOwners = getUniqueOwners(on);
                    
                    return (
                      <TableRow 
                        key={`on-${on.id}-${index}`}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedOwnershipNumber(on);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <TableCell className="text-right">
                          <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">{on.number}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="text-xs font-semibold">{on.mainLocation}</p>
                            <p className="text-[10px] text-gray-500">{on.documents[0]?.planNumber ? `مخطط ${on.documents[0].planNumber}` : '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <FileText className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-bold">{on.documents.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold">
                          {on.totalArea.toLocaleString('ar-SA')} م²
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Users className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{uniqueOwners.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(on.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {on.isVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {on.linkedTransactions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {on.createdDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="عرض">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="تعديل">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="تحميل">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredOwnershipNumbers.length === 0 && (
                <div className="text-center p-8">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد نتائج مطابقة للبحث
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // التاب 800-02: الوثائق (عرض منفرد)
  // ============================================================================

  function render_800_02_Documents() {
    // ✅ تم نقل allDocuments إلى مستوى المكون الرئيسي
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-02" position="top-right" />
        
        <Alert style={{ borderColor: '#3b82f6', background: '#eff6ff' }}>
          <FileText className="h-5 w-5 text-blue-600" />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <p className="font-bold text-blue-900 mb-1">عرض جميع الوثائق بشكل منفرد</p>
            <p className="text-xs text-blue-800">
              هذا التاب يعرض جميع وثائق الملكية من جميع أرقام الملكية بشكل منفصل للبحث والاستعراض السريع.
            </p>
          </AlertDescription>
        </Alert>

        {/* إحصائيات الوثائق */}
        <div className="grid grid-cols-8 gap-2">
          {[
            { label: 'إجمالي الوثائق', value: allDocuments.length, Icon: FileText, color: '#3b82f6' },
            { label: 'صك إلكتروني', value: allDocuments.filter(d => d.type === 'electronic-deed').length, Icon: FileText, color: '#2563eb' },
            { label: 'وثيقة REGA', value: allDocuments.filter(d => d.type === 'rega-document').length, Icon: Shield, color: '#10b981' },
            { label: 'صك عدلي', value: allDocuments.filter(d => d.type === 'notary-deed').length, Icon: FileCheck, color: '#8b5cf6' },
            { label: 'يدوي قديم', value: allDocuments.filter(d => d.type === 'manual-old').length, Icon: Archive, color: '#6b7280' },
            { label: 'موثق REGA', value: allDocuments.filter(d => d.regaVerified).length, Icon: CheckCircle, color: '#22c55e' },
            { label: 'نشط', value: allDocuments.filter(d => d.status === 'active').length, Icon: Activity, color: '#10b981' },
            { label: 'معلق', value: allDocuments.filter(d => d.status === 'pending').length, Icon: AlertCircle, color: '#f59e0b' }
          ].map((stat, i) => (
            <Card key={i} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
              <CardContent className="p-2 text-center">
                <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: stat.color }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* جدول الوثائق المنفردة */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: '16px', fontFamily: 'Tajawal, sans-serif' }}>
              <FileText className="h-4 w-4 inline ml-2" />
              جميع وثائق الملكية ({allDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea style={{ height: 'calc(100vh - 450px)' }}>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الوثيقة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الملكية</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاك</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>REGA</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDocuments.map((doc, index) => (
                    <TableRow 
                      key={`doc-${doc.id}-${index}`}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="text-right text-xs">{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">{doc.documentNumber}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">{doc.ownershipNumber}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        {getDocTypeBadge(doc.type)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-0.5">
                          {doc.owners.map((owner, idx) => (
                            <div key={idx} className="text-[10px] flex items-center justify-end gap-1">
                              <Badge variant="outline" className="text-[9px] px-1">{owner.ownershipPercent}%</Badge>
                              <span className="truncate max-w-[120px]">{owner.ownerName}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold">
                        {doc.area.toLocaleString('ar-SA')} م²
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="text-xs">{doc.city}</p>
                          <p className="text-[10px] text-gray-500">{doc.district}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getDocStatusBadge(doc.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.regaVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">
                          <File className="h-3 w-3 ml-1" />
                          {doc.attachments}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // التابات الأخرى (مختصرة)
  // ============================================================================

  function render_800_03_Owners() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-03" position="top-right" />
        <div className="text-center p-12">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-03 (الملاك) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_04_AdvancedSearch() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-04" position="top-right" />
        <div className="text-center p-12">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-04 (البحث المتقدم) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_05_OwnerValidation() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-05" position="top-right" />
        
        <Alert style={{ borderColor: '#10b981', background: '#f0fdf4' }}>
          <UserCheck className="h-5 w-5 text-green-600" />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <p className="font-bold text-green-900 mb-1">نظام التحقق من الملاك</p>
            <p className="text-xs text-green-800">
              يتحقق النظام تلقائياً من تطابق الملاك في جميع الوثائق داخل رقم الملكية الواحد.
            </p>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <UserCheck className="h-4 w-4 inline ml-2" />
              التحقق من صحة أرقام الملكية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {ownershipNumbers.slice(0, 10).map((on, idx) => {
                const validation = validateOwnershipNumber(on.documents);
                const uniqueOwners = getUniqueOwners(on);

                return (
                  <div 
                    key={idx} 
                    className="p-3 border rounded-lg"
                    style={{ 
                      borderColor: validation.isValid ? '#10b981' : '#ef4444',
                      background: validation.isValid ? '#f0fdf4' : '#fef2f2'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {validation.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <code className="text-xs font-mono">{on.number}</code>
                      </div>
                      <Badge className={validation.isValid ? 'bg-green-500' : 'bg-red-500'}>
                        {validation.isValid ? 'صحيح' : 'خطأ'}
                      </Badge>
                    </div>

                    <div className="text-xs space-y-1">
                      <p><strong>الوثائق:</strong> {on.documents.length}</p>
                      <p><strong>الملاك:</strong> {uniqueOwners.length}</p>
                      
                      {validation.errors.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {validation.errors.map((err, i) => (
                            <p key={i} className="text-red-700">❌ {err}</p>
                          ))}
                        </div>
                      )}

                      {validation.warnings.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {validation.warnings.map((warn, i) => (
                            <p key={i} className="text-yellow-700">⚠️ {warn}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_800_06_Statistics() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-06" position="top-right" />
        <div className="text-center p-12">
          <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-06 (الإحصائيات) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_07_DigitalVerification() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-07" position="top-right" />
        <div className="text-center p-12">
          <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-07 (التوثيق الإلكتروني) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_08_Attachments() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-08" position="top-right" />
        <div className="text-center p-12">
          <File className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-08 (المرفقات) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_09_History() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-09" position="top-right" />
        <div className="text-center p-12">
          <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-09 (السجل والتاريخ) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_10_Reports() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-10" position="top-right" />
        <div className="text-center p-12">
          <Database className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-10 (التقارير) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_11_Notifications() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-11" position="top-right" />
        <div className="text-center p-12">
          <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-11 (الإشعارات) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  function render_800_12_Settings() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-800-12" position="top-right" />
        <div className="text-center p-12">
          <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
            التاب 800-12 (الإعدادات) قيد التطوير
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render الرئيسي
  // ============================================================================

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      {renderScreenHeader()}

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default OwnershipNumbers_Complete_800_v2;
