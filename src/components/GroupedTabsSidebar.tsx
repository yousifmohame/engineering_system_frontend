/**
 * سايد بار التابات مع نظام المجموعات - نسخة محسّنة
 * ==============================================
 * 
 * المميزات:
 * ✅ 4 أزرار مجموعات في الأعلى (إجراءات، معلومات، مستندات، أخرى)
 * ✅ كل زر يعرض مجموعة محددة من التابات
 * ✅ يمكن للتاب أن يكون في أكثر من مجموعة
 * ✅ التصنيفات قابلة للتخصيص من شاشة الإعدادات
 * ✅ حفظ التفضيلات في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  PlayCircle, Info, FileText, MoreHorizontal,
  type LucideIcon 
} from 'lucide-react';

export interface TabConfig {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
  groups?: string[]; // المجموعات التي ينتمي لها التاب
}

export interface GroupConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
}

interface GroupedTabsSidebarProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  transactionId?: string;
}

const DEFAULT_GROUPS: GroupConfig[] = [
  {
    id: 'actions',
    name: 'إجراءات',
    icon: PlayCircle,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
  },
  {
    id: 'info',
    name: 'معلومات',
    icon: Info,
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
  },
  {
    id: 'documents',
    name: 'مستندات',
    icon: FileText,
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
  },
  {
    id: 'other',
    name: 'أخرى',
    icon: MoreHorizontal,
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
  }
];

const GroupedTabsSidebar: React.FC<GroupedTabsSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  transactionId = 'default'
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('actions');
  const [groups] = useState<GroupConfig[]>(DEFAULT_GROUPS);
  const [tabGroupMappings, setTabGroupMappings] = useState<Record<string, string[]>>({});

  // تحميل التصنيفات المخصصة من localStorage
  useEffect(() => {
    const savedMappings = localStorage.getItem('tab_group_mappings');
    if (savedMappings) {
      try {
        setTabGroupMappings(JSON.parse(savedMappings));
      } catch (error) {
        console.error('Error loading tab group mappings:', error);
        loadDefaultMappings();
      }
    } else {
      loadDefaultMappings();
    }
  }, []);

  // تحميل التصنيفات الافتراضية
  const loadDefaultMappings = () => {
    const defaultMappings: Record<string, string[]> = {};
    
    tabs.forEach(tab => {
      const tabNumber = parseInt(tab.number.split('-')[1]);
      
      // التصنيف الافتراضي حسب رقم التاب
      if (tabNumber >= 1 && tabNumber <= 10) {
        defaultMappings[tab.id] = ['info']; // المعلومات الأساسية
      } else if (tabNumber >= 11 && tabNumber <= 22) {
        defaultMappings[tab.id] = ['documents']; // المستندات والعقود
      } else if (tabNumber >= 23 && tabNumber <= 33) {
        defaultMappings[tab.id] = ['actions']; // الإجراءات والمهام
      } else {
        defaultMappings[tab.id] = ['other']; // باقي التابات
      }
    });
    
    setTabGroupMappings(defaultMappings);
    localStorage.setItem('tab_group_mappings', JSON.stringify(defaultMappings));
  };

  // الحصول على التابات حسب المجموعة المختارة
  const getTabsByGroup = (groupId: string): TabConfig[] => {
    return tabs.filter(tab => {
      const tabGroups = tabGroupMappings[tab.id] || [];
      return tabGroups.includes(groupId);
    });
  };

  const filteredTabs = getTabsByGroup(selectedGroup);
  const selectedGroupConfig = groups.find(g => g.id === selectedGroup);

  return (
    <div
      style={{
        width: '220px',
        minWidth: '220px',
        height: 'calc(100vh - 140px)',
        position: 'sticky',
        top: '62px',
        right: 0,
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
        borderLeft: '2px solid #f59e0b',
        borderRadius: '16px 0 0 16px',
        boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* أزرار المجموعات */}
      <div style={{ 
        padding: '8px',
        borderBottom: '2px solid #f59e0b',
        background: 'rgba(255, 255, 255, 0.3)'
      }}>
        <div className="grid grid-cols-2 gap-2">
          {groups.map(group => {
            const Icon = group.icon;
            const isSelected = selectedGroup === group.id;
            const groupTabs = getTabsByGroup(group.id);
            
            return (
              <Button
                key={group.id}
                size="sm"
                onClick={() => setSelectedGroup(group.id)}
                style={{
                  background: isSelected ? group.bgGradient : 'rgba(255, 255, 255, 0.5)',
                  border: `2px solid ${group.color}`,
                  color: group.color,
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 600,
                  padding: '6px 8px',
                  height: 'auto',
                  boxShadow: isSelected ? `0 2px 8px ${group.color}40` : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon className="h-3 w-3 ml-1" />
                <span>{group.name}</span>
                <Badge 
                  style={{
                    marginRight: '4px',
                    background: group.color,
                    color: 'white',
                    fontSize: '9px',
                    padding: '1px 4px',
                    fontFamily: 'monospace'
                  }}
                >
                  {groupTabs.length}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* عنوان المجموعة */}
      {selectedGroupConfig && (
        <div style={{
          padding: '8px 12px',
          background: selectedGroupConfig.bgGradient,
          borderBottom: `2px solid ${selectedGroupConfig.color}`
        }}>
          <div className="flex items-center gap-2">
            <selectedGroupConfig.icon 
              className="h-4 w-4" 
              style={{ color: selectedGroupConfig.color }} 
            />
            <span style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              color: selectedGroupConfig.color
            }}>
              {selectedGroupConfig.name}
            </span>
            <Badge style={{
              marginRight: 'auto',
              background: selectedGroupConfig.color,
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '10px'
            }}>
              {filteredTabs.length} تبويب
            </Badge>
          </div>
        </div>
      )}

      {/* قائمة التابات */}
      <ScrollArea className="flex-1">
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar {
            width: 8px !important;
            display: block !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-track {
            background: rgba(245, 158, 11, 0.2) !important;
            border-radius: 6px !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb {
            background: #d97706 !important;
            border-radius: 6px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
            background: #f59e0b !important;
          }
        `}</style>

        <div className="p-2 space-y-0.5">
          {filteredTabs.length > 0 ? (
            filteredTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Card
                  key={tab.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    padding: '8px 10px',
                    background: isActive ? 'white' : 'rgba(255, 255, 255, 0.2)',
                    border: isActive ? '2px solid #dc2626' : '1px solid rgba(245, 158, 11, 0.3)',
                    boxShadow: isActive ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    marginBottom: '2px'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-4 w-4"
                      style={{ color: isActive ? '#dc2626' : '#1e40af' }}
                    />
                    <span
                      style={{
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#dc2626' : '#1e3a8a',
                        flex: 1
                      }}
                    >
                      {tab.title}
                    </span>
                    <Badge
                      style={{
                        background: isActive ? '#dc2626' : '#dbeafe',
                        color: isActive ? 'white' : '#1e40af',
                        border: isActive ? 'none' : '1px solid #3b82f6',
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        padding: '2px 6px'
                      }}
                    >
                      {tab.number}
                    </Badge>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8">
              <MoreHorizontal className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                لا توجد تبويبات في هذه المجموعة
              </p>
              <p style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '11px',
                color: '#9ca3af',
                marginTop: '4px'
              }}>
                يمكن تخصيص المجموعات من شاشة الإعدادات
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GroupedTabsSidebar;
