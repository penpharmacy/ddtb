import React from 'react';
import { Home, Pill, Activity, FileText } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<Props> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'medications', label: 'ยาของฉัน', icon: Pill },
    { id: 'side_effects', label: 'ผลข้างเคียง', icon: Activity },
    { id: 'pharmacist', label: 'ส่งเภสัช', icon: FileText },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-md mx-auto pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col items-center p-2 transition-colors duration-200 ${
                isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
