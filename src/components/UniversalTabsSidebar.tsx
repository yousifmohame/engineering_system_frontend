import React from 'react';
import { cn } from './ui/utils';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface UniversalTabsSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const UniversalTabsSidebar: React.FC<UniversalTabsSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div 
      className={cn(
        "w-56 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto",
        className
      )}
      dir="rtl"
    >
      <div className="p-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                "hover:bg-gray-50",
                isActive 
                  ? "bg-blue-50 text-blue-700 font-medium border border-blue-200" 
                  : "text-gray-700"
              )}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
              <span className="flex-1 text-right truncate">{tab.label}</span>
              <span className="text-xs text-gray-400 font-mono">{tab.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UniversalTabsSidebar;
