'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);
  
  const activeTabContent = tabs.find(tab => tab.key === activeTab)?.content;
  
  return (
    <div className={cn('bg-white rounded-2xl shadow-soft border border-slate-100', className)}>
      {/* Tab Headers */}
      <div className="border-b border-slate-100">
        <nav className="flex space-x-6 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'py-4 text-sm font-semibold transition-all relative flex items-center space-x-2',
                activeTab === tab.key
                  ? 'text-primary-600'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.icon && <span className={cn(activeTab === tab.key ? "text-primary-600" : "text-slate-400")}>{tab.icon}</span>}
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 rounded-t-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTabContent}
      </div>
    </div>
  );
}
