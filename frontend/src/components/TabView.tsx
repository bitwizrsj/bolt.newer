import React from 'react';
import { Code2, Eye, Monitor } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          activeTab === 'code'
            ? 'bg-gray-800 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
        }`}
      >
        <Code2 className="w-4 h-4" />
        <span className="font-medium">Code</span>
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          activeTab === 'preview'
            ? 'bg-gray-800 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
        }`}
      >
        <Monitor className="w-4 h-4" />
        <span className="font-medium">Preview</span>
      </button>
    </div>
  );
}