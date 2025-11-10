/**
 * التاب 901-02: الملفات - العرض الشجري
 * ====================================
 * 
 * عرض شجري للملفات حسب:
 * - السنة
 * - الشهر
 * - المعاملة (رقم المكتب + اسم المالك الأول والأخير + حالة المعاملة)
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ChevronDown, ChevronRight, Folder, File, FileText,
  Calendar, Hash, User, Activity, Search, Filter,
  Download, Eye, FolderOpen
} from 'lucide-react';
import InputWithCopy from '../InputWithCopy';

// واجهات البيانات
interface FileNode {
  id: string;
  name: string;
  type: 'year' | 'month' | 'transaction' | 'file';
  count?: number;
  year?: string;
  month?: string;
  transactionNumber?: string;
  firstOwner?: string;
  lastOwner?: string;
  status?: string;
  statusColor?: string;
  extension?: string;
  size?: number;
  createdDate?: string;
  children?: FileNode[];
}

// بيانات وهمية شجرية
const TREE_DATA: FileNode[] = [
  {
    id: 'y-2025',
    name: '2025',
    type: 'year',
    year: '2025',
    count: 156,
    children: [
      {
        id: 'm-2025-01',
        name: 'يناير - 01',
        type: 'month',
        month: '01',
        count: 45,
        children: [
          {
            id: 't-2501001',
            name: '2501001 - أحمد محمد الشمري - جديدة',
            type: 'transaction',
            transactionNumber: '2501001',
            firstOwner: 'أحمد',
            lastOwner: 'الشمري',
            status: 'جديدة',
            statusColor: '#2563eb',
            count: 8,
            children: [
              {
                id: 'f-1',
                name: 'صورة_صك_الملكية.pdf',
                type: 'file',
                extension: 'pdf',
                size: 2456000,
                createdDate: '2025-01-15'
              },
              {
                id: 'f-2',
                name: 'كروكي_الموقع.dwg',
                type: 'file',
                extension: 'dwg',
                size: 1234000,
                createdDate: '2025-01-16'
              },
              {
                id: 'f-3',
                name: 'صورة_هوية_المالك.jpg',
                type: 'file',
                extension: 'jpg',
                size: 890000,
                createdDate: '2025-01-15'
              },
              {
                id: 'f-4',
                name: 'عقد_الشراء.pdf',
                type: 'file',
                extension: 'pdf',
                size: 3200000,
                createdDate: '2025-01-17'
              },
              {
                id: 'f-5',
                name: 'المخططات_المعمارية.pdf',
                type: 'file',
                extension: 'pdf',
                size: 5600000,
                createdDate: '2025-01-18'
              }
            ]
          },
          {
            id: 't-2501002',
            name: '2501002 - فاطمة خالد العتيبي - قيد المعالجة',
            type: 'transaction',
            transactionNumber: '2501002',
            firstOwner: 'فاطمة',
            lastOwner: 'العتيبي',
            status: 'قيد المعالجة',
            statusColor: '#f59e0b',
            count: 12,
            children: [
              {
                id: 'f-6',
                name: 'صك_الملكية_الأصلي.pdf',
                type: 'file',
                extension: 'pdf',
                size: 1890000,
                createdDate: '2025-01-20'
              },
              {
                id: 'f-7',
                name: 'المخطط_الإنشائي.dwg',
                type: 'file',
                extension: 'dwg',
                size: 4500000,
                createdDate: '2025-01-21'
              },
              {
                id: 'f-8',
                name: 'تقرير_التربة.pdf',
                type: 'file',
                extension: 'pdf',
                size: 2100000,
                createdDate: '2025-01-22'
              }
            ]
          },
          {
            id: 't-2501003',
            name: '2501003 - محمد عبدالله القحطاني - معتمدة',
            type: 'transaction',
            transactionNumber: '2501003',
            firstOwner: 'محمد',
            lastOwner: 'القحطاني',
            status: 'معتمدة',
            statusColor: '#22c55e',
            count: 15,
            children: []
          }
        ]
      },
      {
        id: 'm-2025-02',
        name: 'فبراير - 02',
        type: 'month',
        month: '02',
        count: 38,
        children: [
          {
            id: 't-2502001',
            name: '2502001 - سارة عبدالرحمن المطيري - جديدة',
            type: 'transaction',
            transactionNumber: '2502001',
            firstOwner: 'سارة',
            lastOwner: 'المطيري',
            status: 'جديدة',
            statusColor: '#2563eb',
            count: 6,
            children: []
          },
          {
            id: 't-2502002',
            name: '2502002 - عبدالله سعد الدوسري - مكتملة',
            type: 'transaction',
            transactionNumber: '2502002',
            firstOwner: 'عبدالله',
            lastOwner: 'الدوسري',
            status: 'مكتملة',
            statusColor: '#10b981',
            count: 20,
            children: []
          }
        ]
      },
      {
        id: 'm-2025-03',
        name: 'مارس - 03',
        type: 'month',
        month: '03',
        count: 52,
        children: []
      },
      {
        id: 'm-2025-04',
        name: 'أبريل - 04',
        type: 'month',
        month: '04',
        count: 21,
        children: []
      }
    ]
  },
  {
    id: 'y-2024',
    name: '2024',
    type: 'year',
    year: '2024',
    count: 523,
    children: [
      {
        id: 'm-2024-12',
        name: 'ديسمبر - 12',
        type: 'month',
        month: '12',
        count: 67,
        children: [
          {
            id: 't-2412001',
            name: '2412001 - نورة فهد الغامدي - مكتملة',
            type: 'transaction',
            transactionNumber: '2412001',
            firstOwner: 'نورة',
            lastOwner: 'الغامدي',
            status: 'مكتملة',
            statusColor: '#10b981',
            count: 18,
            children: []
          }
        ]
      },
      {
        id: 'm-2024-11',
        name: 'نوفمبر - 11',
        type: 'month',
        month: '11',
        count: 54,
        children: []
      }
    ]
  }
];

const Tab_901_02_TreeView: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['y-2025']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  // توسيع/طي العقد
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // توسيع الكل
  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(TREE_DATA);
    setExpandedNodes(allIds);
  };

  // طي الكل
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // الحصول على أيقونة النوع
  const getTypeIcon = (node: FileNode) => {
    switch (node.type) {
      case 'year':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'month':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'transaction':
        return <Hash className="h-4 w-4 text-violet-600" />;
      case 'file':
        if (node.extension === 'pdf') return <FileText className="h-4 w-4 text-red-600" />;
        if (node.extension === 'dwg') return <FileText className="h-4 w-4 text-blue-600" />;
        if (node.extension === 'jpg') return <FileText className="h-4 w-4 text-green-600" />;
        return <File className="h-4 w-4 text-gray-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  // تنسيق حجم الملف
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(0) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // عرض عقدة واحدة
  const renderNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const paddingRight = level * 24;

    return (
      <div key={node.id}>
        <div
          className={`
            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
            hover:bg-gray-50
            ${node.type === 'file' ? 'hover:bg-blue-50' : ''}
          `}
          style={{ paddingRight: `${paddingRight + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else if (node.type === 'file') {
              setSelectedFile(node);
            }
          }}
        >
          {/* زر التوسيع/الطي */}
          {hasChildren ? (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </div>
          ) : (
            <div className="w-4" /> // مسافة فارغة للملفات
          )}

          {/* الأيقونة */}
          <div className="flex-shrink-0">
            {hasChildren && !isExpanded ? (
              <Folder className="h-4 w-4 text-amber-600" />
            ) : hasChildren && isExpanded ? (
              <FolderOpen className="h-4 w-4 text-amber-600" />
            ) : (
              getTypeIcon(node)
            )}
          </div>

          {/* الاسم */}
          <div className="flex-1">
            <span
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: node.type === 'file' ? '13px' : '14px',
                fontWeight: node.type === 'year' ? 700 : node.type === 'month' ? 600 : 500,
                color: node.type === 'file' ? '#374151' : '#1f2937'
              }}
            >
              {node.name}
            </span>
          </div>

          {/* العدد للمجلدات */}
          {node.count !== undefined && node.type !== 'file' && (
            <Badge variant="outline" className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {node.count} عنصر
            </Badge>
          )}

          {/* الحالة للمعاملات */}
          {node.type === 'transaction' && node.status && (
            <Badge
              variant="outline"
              className="text-[10px]"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                background: `${node.statusColor}15`,
                borderColor: node.statusColor,
                color: node.statusColor
              }}
            >
              {node.status}
            </Badge>
          )}

          {/* حجم الملف */}
          {node.type === 'file' && node.size && (
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {formatSize(node.size)}
            </span>
          )}

          {/* أزرار الإجراءات للملفات */}
          {node.type === 'file' && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* العناصر الفرعية */}
        {hasChildren && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* شريط الأدوات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* البحث */}
            <div className="flex-1">
              <InputWithCopy
                id="search-tree"
                placeholder="ابحث في الملفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                copyable={false}
                clearable={true}
              />
            </div>

            {/* أزرار التحكم */}
            <Button
              size="sm"
              variant="outline"
              onClick={expandAll}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              توسيع الكل
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={collapseAll}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              طي الكل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الملفات</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>679</p>
              </div>
              <File className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنوات</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>2</p>
              </div>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fbbf24' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأشهر</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>6</p>
              </div>
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>8</p>
              </div>
              <Hash className="h-6 w-6 text-violet-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الكلي</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>1.2 GB</p>
              </div>
              <Activity className="h-6 w-6 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', border: '2px solid #67e8f9' }}>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاك</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>8</p>
              </div>
              <User className="h-6 w-6 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* العرض الشجري */}
      <Card className="card-element card-rtl">
        <CardContent className="p-4">
          <div className="space-y-1">
            {TREE_DATA.map(node => renderNode(node, 0))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات الملف المختار */}
      {selectedFile && (
        <Card className="card-element card-rtl">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getTypeIcon(selectedFile)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedFile.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div>
                    <span className="text-gray-600">الحجم: </span>
                    <span className="font-medium">{selectedFile.size ? formatSize(selectedFile.size) : '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">النوع: </span>
                    <span className="font-medium">{selectedFile.extension?.toUpperCase() || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التاريخ: </span>
                    <span className="font-medium">{selectedFile.createdDate || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 ml-2" />
                  عرض
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tab_901_02_TreeView;
