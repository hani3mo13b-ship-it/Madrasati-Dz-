import React from 'react';
import { BookOpen, FileText, Video, PenTool, CheckCircle2, GraduationCap } from '../components/Icons';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const features = [
    {
      id: 'exams',
      title: 'بنك الاختبارات',
      desc: 'نماذج فروض واختبارات مع الحلول',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'exercises',
      title: 'تمارين محلولة',
      desc: 'سلاسل تمارين لجميع المستويات',
      icon: PenTool,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      id: 'reviews',
      title: 'مراجعة بالفيديو',
      desc: 'دروس مشروحة من يوتيوب',
      icon: Video,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Hero Section with Glass Effect */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-[30px] p-6 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('ai')}>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
             <div>
                <h2 className="text-2xl font-black mb-1">مرحباً بك يا بطل 🇩🇿</h2>
                <p className="text-emerald-100 text-xs font-bold mb-4">اليوم هو يوم مثالي للنجاح!</p>
             </div>
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <GraduationCap size={24} className="text-white" />
             </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <span className="text-emerald-600 text-xl">✨</span>
             </div>
             <div>
               <p className="font-bold text-sm">اسأل المساعد الذكي</p>
               <p className="text-[10px] text-emerald-50 opacity-90">يساعدك في التلخيص وحل الواجبات</p>
             </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      </div>

      {/* Main Features Grid */}
      <div>
        <h3 className="text-lg font-black text-gray-800 mb-4 px-2">
          ماذا تريد أن تفعل اليوم؟
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className="glass p-4 rounded-[24px] border border-white shadow-sm flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center group-hover:shadow-inner transition-shadow`}>
                  <Icon className={`${feature.color}`} size={30} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg mb-0.5">{feature.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
                </div>
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 9L5 5L1 1" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parents/Motivation Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-[24px] border border-orange-100">
           <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 mb-2">
             <span className="font-bold">1</span>
           </div>
           <h4 className="font-bold text-gray-800 text-sm mb-1">لأولياء الأمور</h4>
           <p className="text-[10px] text-gray-500 leading-tight">تابع تقدم ابنك وحمل له المواضيع المقترحة.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-[24px] border border-blue-100">
           <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 mb-2">
             <CheckCircle2 size={16} />
           </div>
           <h4 className="font-bold text-gray-800 text-sm mb-1">نصيحة اليوم</h4>
           <p className="text-[10px] text-gray-500 leading-tight">حل التمارين يومياً أفضل من المراجعة المكثفة ليلة الامتحان.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;