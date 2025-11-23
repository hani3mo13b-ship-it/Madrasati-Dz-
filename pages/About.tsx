import React from 'react';
import { ChevronLeft, GraduationCap, Heart, Code, Users, Bot } from '../components/Icons';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white pb-20 animate-fade-in">
      {/* Hero */}
      <div className="bg-emerald-600 p-6 pt-12 text-white rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <button onClick={onBack} className="absolute top-6 right-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        
        <div className="text-center mt-4">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-3">
            <span className="text-4xl">🇩🇿</span>
          </div>
          <h1 className="text-3xl font-black mb-2">قصة مدرستي DZ</h1>
          <p className="text-emerald-100 font-bold text-sm opacity-90">حلم صغير.. لمستقبل كبير</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="px-6 -mt-8 relative z-10 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 space-y-4">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
               <Code size={20} />
             </div>
             <h2 className="font-black text-gray-800 text-lg">من هو المطور؟</h2>
           </div>
           
           <div className="space-y-4 text-gray-600 leading-loose font-medium text-sm text-justify">
             <p>
               أهلاً بكم في "مدرستي DZ". أنا <span className="text-emerald-600 font-black text-base">هاني</span>، وعمري <span className="text-emerald-600 font-black">13 سنة</span>.
             </p>
             <p>
               قد تستغربون كيف لطفل في سني أن يصنع هذا الموقع؟ الحقيقة هي أن الفكرة ولدت من رحم المعاناة التي نعيشها جميعاً كتلاميذ. كنت أرى أصدقائي وأبي وأمي يضيعون ساعات طويلة في البحث عن "فرض مقترح" أو "شرح مفهوم" وسط فوضى الإنترنت.
             </p>
             <p>
               قررت أن لا أقف مكتوف الأيدي. بدأت رحلة تعلم البرمجة ليالٍ طويلة، وبينما كان البعض يلعب، كنت أنا أكتب الأكواد سطراً بسطر، مدفوعاً بحلم واحد: <span className="font-bold text-gray-800">أن أصنع مكاناً يجمع كل ما يحتاجه التلميذ الجزائري في ضغطة زر.</span>
             </p>
             <p className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-800 text-xs">
               هذا الموقع هو هديتي لكل تلميذ يحلم بالنجاح، ولكل ولي أمر يتعب لأجل أبنائه. صنعته بكل حب، ليكون رفيقكم نحو التفوق.
             </p>
           </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="p-6 space-y-4">
        <h3 className="font-black text-gray-800 text-xl px-2">مميزات صنعت لكم</h3>
        
        <div className="grid grid-cols-1 gap-3">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                    <Users size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 mb-1">مساعدة التلاميذ والأولياء</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">وداعاً للبحث العشوائي. كل الفروض، الاختبارات، والمراجعات هنا منظمة ومرتبة.</p>
                </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                    <Bot size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 mb-1">الذكاء الاصطناعي</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">لأول مرة في الجزائر، ذكاء اصطناعي يساعدك في تحضير النصوص وحل التمارين المعقدة.</p>
                </div>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                    <Heart size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 mb-1">مجاني للجميع</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">التعليم حق للجميع، وهذا الموقع سيظل مجانياً لمساعدة أبناء وطني.</p>
                </div>
            </div>
        </div>
      </div>

      <div className="px-6 pb-6 mt-8 text-center">
         <p className="text-xs text-gray-400 font-bold mb-2">صُنع بكل ❤️ في الجزائر</p>
         <p className="text-[10px] text-gray-300">الإصدار 1.0.0 • برمجة هاني</p>
      </div>
    </div>
  );
};

export default About;