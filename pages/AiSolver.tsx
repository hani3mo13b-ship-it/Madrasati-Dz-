import React, { useState, useRef } from 'react';
import { Camera, X, Send, CheckCircle2, Bot, FileText, PenTool } from '../components/Icons';
import { solveHomeworkWithImage, prepareLessonText } from '../services/gemini';
import { UserProfile } from '../types';

interface AiSolverProps {
  userProfile?: UserProfile;
}

const AiSolver: React.FC<AiSolverProps> = ({ userProfile }) => {
  const [mode, setMode] = useState<'camera' | 'text'>('camera');
  
  // Camera State
  const [image, setImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  
  // Text Prep State
  const [textTitle, setTextTitle] = useState('');
  const [textPrepResult, setTextPrepResult] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setSolution(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolveImage = async () => {
    if (!image) return;
    setLoading(true);
    const result = await solveHomeworkWithImage(image);
    setSolution(result);
    setLoading(false);
  };

  const handlePrepareText = async () => {
    if (!textTitle.trim()) return;
    setLoading(true);
    const userYear = userProfile?.year || 'السنة الرابعة متوسط';
    const result = await prepareLessonText(textTitle, userYear);
    setTextPrepResult(result);
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setSolution(null);
    setTextTitle('');
    setTextPrepResult(null);
  };

  return (
    <div className="p-4 pb-28 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-600 flex items-center justify-center shadow-sm">
          {mode === 'camera' ? <Camera size={24} /> : <FileText size={24} />}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {mode === 'camera' ? 'صور وحل' : 'تحضير النصوص'}
          </h2>
          <p className="text-xs text-gray-500 font-bold">
             {mode === 'camera' ? 'حل فوري للتمارين' : 'أفكار وتحليل للنصوص'}
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex mb-6">
        <button 
          onClick={() => setMode('camera')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'camera' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}
        >
          <Camera size={16} />
          تصوير تمرين
        </button>
        <button 
          onClick={() => setMode('text')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'text' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}
        >
          <PenTool size={16} />
          تحضير نص
        </button>
      </div>

      {/* CAMERA MODE */}
      {mode === 'camera' && (
        !image ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-emerald-50">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" 
                  alt="Scan" 
                  className="w-32 h-32 opacity-80"
                />
              </div>
            </div>

            <div className="space-y-3 w-full max-w-xs px-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                <Camera size={20} />
                التقط صورة
              </button>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-white mb-6 bg-black group max-h-[40vh]">
              <img src={image} alt="Problem" className="w-full h-full object-contain opacity-90" />
              <button 
                onClick={reset}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors"
              >
                <X size={16} />
              </button>
              {!solution && !loading && (
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <button 
                    onClick={handleSolveImage}
                    className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                  >
                    <Send size={18} className="text-emerald-600" />
                    تحليل وحل
                  </button>
                </div>
              )}
            </div>

            {loading && <LoadingState text="جاري تحليل الصورة..." />}
            {solution && <ResultCard title="الحل النموذجي" content={solution} onReset={reset} />}
          </div>
        )
      )}

      {/* TEXT PREP MODE */}
      {mode === 'text' && (
        <div className="flex-1 flex flex-col animate-fade-in">
          {!textPrepResult && !loading ? (
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">ما هو عنوان النص؟</h3>
                  <p className="text-xs text-gray-400 mb-6">
                    يمكنك كتابة العنوان بدون تشكيل أو همزات
                  </p>
                  
                  <input 
                    type="text" 
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="مثلاً: ماسح الأحذية"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center font-black text-black placeholder-gray-400 outline-none focus:border-emerald-500 mb-4"
                  />
                  
                  <div className="text-xs text-gray-500 mb-6 font-bold bg-gray-50 py-2 rounded-lg border border-gray-200">
                    للسنة: {userProfile?.year || 'غير محدد'}
                  </div>

                  <button 
                    onClick={handlePrepareText}
                    disabled={!textTitle.trim()}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
                  >
                    تحضير النص الآن
                  </button>
               </div>
               
               <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                 <Bot size={20} className="text-blue-600 shrink-0 mt-1" />
                 <p className="text-xs text-blue-700 leading-relaxed font-medium">
                   لا تقلق بشأن الأخطاء الإملائية، سأحاول فهم العنوان.
                 </p>
               </div>
            </div>
          ) : (
            <>
              {loading && <LoadingState text="جاري استخراج الأفكار..." />}
              {textPrepResult && <ResultCard title={`تحضير: ${textTitle}`} content={textPrepResult} onReset={reset} isTextPrep />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-components
const LoadingState = ({ text }: { text: string }) => (
  <div className="flex-1 flex flex-col items-center justify-start pt-10 animate-fade-in">
    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
    <p className="font-bold text-gray-600 animate-pulse">{text}</p>
  </div>
);

const ResultCard = ({ title, content, onReset, isTextPrep }: any) => (
  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex-1 overflow-y-auto animate-fade-in relative">
    {isTextPrep && (
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-yellow-50 to-white opacity-50 pointer-events-none"></div>
    )}
    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
      {isTextPrep ? <PenTool className="text-orange-500" size={24}/> : <CheckCircle2 className="text-emerald-600" size={24} />}
      <h3 className="font-bold text-lg text-black">{title}</h3>
    </div>
    
    <div className="text-black text-sm font-medium leading-loose whitespace-pre-line" dir="rtl">
      {content}
    </div>

    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
       <button 
         onClick={onReset} 
         className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
       >
         {isTextPrep ? 'تحضير نص آخر' : 'حل تمرين آخر'}
       </button>
    </div>
  </div>
);

export default AiSolver;