import React from 'react';
import { Home, FileText, Video, Bot, PenTool, Camera, User } from './Icons';

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md pb-safe-bottom pt-2 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl border-t border-gray-100">
      <div className="flex items-center justify-around h-16">
        
        <NavButton id="home" icon={Home} label="الرئيسية" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton id="exams" icon={FileText} label="اختبارات" activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Central Solver Button */}
        <div className="relative -top-6">
          <button
            onClick={() => setActiveTab('solver')}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 ${
              activeTab === 'solver' 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 ring-4 ring-emerald-100' 
                : 'bg-gradient-to-tr from-gray-800 to-gray-700'
            }`}
          >
            <Camera size={28} className="text-white" />
          </button>
          <span className="absolute -bottom-5 w-full text-center text-[10px] font-bold text-gray-500">
            صور وحل
          </span>
        </div>

        <NavButton id="reviews" icon={Video} label="مراجعة" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavButton id="profile" icon={User} label="حسابي" activeTab={activeTab} setActiveTab={setActiveTab} />
        
      </div>
    </div>
  );
};

const NavButton = ({ id, icon: Icon, label, activeTab, setActiveTab }: any) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className="flex flex-col items-center justify-center w-14 h-full"
    >
      <Icon 
        size={24} 
        className={`transition-colors duration-300 ${isActive ? 'text-emerald-600 fill-emerald-100' : 'text-gray-400'}`} 
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span className={`text-[10px] mt-1 font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
};

export default NavBar;