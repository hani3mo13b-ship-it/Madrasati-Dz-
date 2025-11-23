import React, { useState } from 'react';
import { UserProfile, EducationLevel } from '../types';
import { YEARS, AVATARS } from '../constants';
import { CheckCircle2 } from './Icons';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.MIDDLE);
  const [year, setYear] = useState('');
  const [avatarId, setAvatarId] = useState(0);

  const handleNext = () => {
    if (step === 3) {
      onComplete({
        name,
        level,
        year,
        avatarId,
        hasCompletedOnboarding: true
      });
    } else {
      setStep(step + 1);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return name.trim().length < 2;
    if (step === 2) return !year;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500" 
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 p-8 flex flex-col justify-center max-w-md mx-auto w-full">
        
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800">مرحباً بك في مدرستي!</h2>
            <p className="text-gray-500 font-medium">دعنا نتعرف عليك. ما هو اسمك؟</p>
            <input 
              type="text" 
              placeholder="اكتب اسمك هنا"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 text-center font-black text-xl text-black placeholder-gray-400 focus:border-emerald-500 outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Level & Year */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
               <h2 className="text-2xl font-black text-gray-800 mb-2">في أي سنة تدرس؟</h2>
               <p className="text-gray-500 text-sm">سنقوم بتجهيز المحتوى المناسب لك</p>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-xl flex gap-1">
                {Object.values(EducationLevel).map((l) => (
                    <button
                    key={l}
                    onClick={() => { setLevel(l); setYear(''); }}
                    className={`flex-1 py-3 text-[10px] font-bold rounded-lg transition-all ${
                        level === l ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'
                    }`}
                    >
                    {l.split(' ')[1]}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {YEARS[level].map((y) => (
                    <button
                        key={y}
                        onClick={() => setYear(y)}
                        className={`w-full p-4 rounded-2xl font-bold text-right transition-all flex justify-between items-center ${
                            year === y ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-gray-100 text-gray-600'
                        }`}
                    >
                        {y}
                        {year === y && <CheckCircle2 size={20} />}
                    </button>
                ))}
            </div>
          </div>
        )}

        {/* Step 3: Avatar */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in text-center">
             <div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">اختر صورتك الرمزية</h2>
                <p className="text-gray-500 text-sm">يمكنك تغييرها لاحقاً من الملف الشخصي</p>
             </div>

             <div className="grid grid-cols-3 gap-4">
                {AVATARS.map((av, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setAvatarId(idx)}
                        className={`relative rounded-full p-1 transition-all ${
                            avatarId === idx ? 'scale-110 ring-4 ring-emerald-200 bg-emerald-100' : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                        <img src={av} className="w-full rounded-full bg-white shadow-sm" />
                        {avatarId === idx && (
                            <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-1">
                                <CheckCircle2 size={12} />
                            </div>
                        )}
                    </button>
                ))}
             </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-30 disabled:shadow-none transition-all"
        >
          {step === 3 ? 'ابدأ رحلة النجاح 🚀' : 'استمرار'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;