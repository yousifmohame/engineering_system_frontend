/**
 * سايد بار التابات الموحد v1.3 - تكثيف فائق ومحسّن
 * ================================================
 * 
 * مكون موحد لعرض سايد بار التابات في جميع شاشات النظام
 * بتصميم احترافي موحد مطابق للشاشة 111 مع تكثيف فائق
 * 
 * المواصفات v1.3:
 * ✅ عرض ثابت 220px
 * ✅ ارتفاع كامل: calc(100vh - 72px) (من أسفل الهيدر إلى أعلى الفوتر)
 * ✅ موضع: top: 40px (بداية من أسفل هيدر النظام 40px مباشرة)
 * ✅ خلفية تدرجية بيج/كريمي فاتح
 * ✅ حد كامل ذهبي 2px
 * ✅ زوايا دائرية من الجهة اليمنى
 * ✅ سكرول ظاهر بلون ذهبي
 * ✅ التاب النشط باللون الأحمر
 * ✅ مسافة 4px من سايد بار الشاشات (قليلة جداً)
 * ✅ مسافات مضغوطة جداً بين التابات (0px)
 * ✅ خط أسماء التابات مصغر جداً (text-[10px] = 10px)
 * ✅ padding مصغر جداً للتابات (p-1.5 = 6px)
 * ✅ padding مصغر للحاوية (p-1 = 4px)
 * ✅ gap مصغر بين العناصر (gap-1 = 4px)
 * ✅ كل تاب: أيقونة + نص + Badge بالرقم
 * 
 * @version 1.3
 * @date 2025-10-25
 */

import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { LucideIcon } from 'lucide-react';

// واجهة تعريف التاب
export interface TabConfig {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
}

interface UnifiedTabsSidebarProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const UnifiedTabsSidebar: React.FC<UnifiedTabsSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div
      style={{
        width: '220px',
        minWidth: '220px',
        height: 'calc(100vh - 72px)', // ✅ محدث: يبدأ من الهيدر ويصل للفوتر (40px + 32px = 72px)
        position: 'sticky',
        top: '40px', // ✅ محدث: بداية من أسفل هيدر النظام مباشرة
        right: 0,
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
        border: '2px solid #f59e0b',
        borderRadius: '16px 0 0 16px',
        boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
        overflow: 'hidden'
      }}
    >
      <ScrollArea 
        className="h-full" 
        style={{ 
          '--scrollbar-width': '8px',
          '--scrollbar-track-color': 'rgba(245, 158, 11, 0.2)',
          '--scrollbar-thumb-color': '#d97706',
          '--scrollbar-thumb-hover-color': '#f59e0b'
        } as React.CSSProperties}
      >
        {/* تنسيقات السكرول المخصصة */}
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
        
        <div className="space-y-0 px-[17px] py-[9px] mx-[10px] my-[0px]"> {/* ✅ محدث v1.3: padding مصغر جداً (4px) ومسافة صفر بين التابات */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  w-full p-1.5 rounded-xl transition-all duration-300 text-right
                  flex items-center gap-1
                  ${isActive 
                    ? 'bg-white shadow-lg scale-[1.03] border-2' 
                    : 'bg-white/20 hover:bg-white/40 hover:shadow-md'
                  }
                `}
                style={{
                  borderColor: isActive ? '#dc2626' : 'transparent',
                  backdropFilter: isActive ? 'blur(10px)' : 'none'
                }}
              >
                {/* الأيقونة */}
                <Icon 
                  className="h-4 w-4 flex-shrink-0" 
                  style={{ color: isActive ? '#dc2626' : '#1e40af' }}
                />
                
                {/* اسم التاب */}
                <div 
                  className="flex-1 text-right line-clamp-1" 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 700,
                    fontSize: '10px',
                    color: isActive ? '#dc2626' : '#1e3a8a',
                    lineHeight: '1.3'
                  }}
                >
                  {tab.title}
                </div>
                
                {/* رقم التاب */}
                <Badge 
                  variant="outline" 
                  className="font-mono flex-shrink-0"
                  style={{
                    background: isActive ? '#fef2f2' : 'rgba(255, 255, 255, 0.6)',
                    border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`,
                    color: isActive ? '#dc2626' : '#1e40af',
                    padding: '1px 5px',
                    fontSize: '9px',
                    lineHeight: '1.2'
                  }}
                >
                  {tab.number}
                </Badge>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UnifiedTabsSidebar;
