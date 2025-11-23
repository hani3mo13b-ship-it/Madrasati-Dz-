import React, { useState, useRef } from 'react';
import { Download, CheckCircle2, Search, FileText, PenTool, ChevronLeft, PenTool as EditIcon, Printer, X, Clock, Calendar } from '../components/Icons';
import { YEARS, SUBJECTS, TERMS } from '../constants';
import { EducationLevel } from '../types';
import { generateExam } from '../services/gemini';

interface ResourceListProps {
  type: 'exams' | 'exercises';
}

const ResourceList: React.FC<ResourceListProps> = ({ type }) => {
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.MIDDLE);
  const [year, setYear] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  
  // New State for Sub-Category (Furood vs Exams)
  const [subCategory, setSubCategory] = useState<'furood' | 'tests' | null>(null);

  // Editor State
  const [generatedExam, setGeneratedExam] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const isExamSection = type === 'exams';
  // If it's exercises, we don't need sub-categories. If exams, we check state.
  const showCategories = isExamSection && !subCategory;

  const getPageTitle = () => {
      if (type === 'exercises') return 'بنك التمارين';
      if (subCategory === 'furood') return 'بنك الفروض';
      if (subCategory === 'tests') return 'بنك الاختبارات';
      return 'الفروض والاختبارات';
  };

  const getMockResources = () => {
    if (!year || !subject) return [];
    
    // Customize titles based on selection
    const examTitles = [
      "اختبار الفصل المقترح رقم 1",
      "الاختبار الشامل مع التصحيح",
      "موضوع امتحان سابق (2023)",
      "نموذج اختبار للمراجعة",
    ];

    const fardTitles = [
      "الفرض الأول للفصل الحالي",
      "فرض محروس رقم 1",
      "الفرض الثاني مع الحل",
      "واجب منزلي (فرض منزلي)",
    ];

    const exerciseTitles = [
      "سلسلة تمارين رقم 1",
      "تمارين محلولة للتحضير",
      "واجب منزلي رقم 2",
      "وضعيات إدماجية مقترحة",
    ];

    let list = exerciseTitles;
    if (subCategory === 'tests') list = examTitles;
    if (subCategory === 'furood') list = fardTitles;
    
    return list.map((t, index) => ({
      id: index + 1,
      title: t,
      subtitle: term ? `${term} • ${year}` : 'جميع الفصول',
      source: index % 2 === 0 ? 'ency-education' : 'dzexams'
    }));
  };

  const handleSearchPdf = (resourceTitle: string) => {
    let itemType = 'تمارين';
    if (subCategory === 'furood') itemType = 'فروض';
    if (subCategory === 'tests') itemType = 'اختبارات';

    const query = `site:dzexams.com ${itemType} ${subject} ${year} ${term} ${resourceTitle} pdf`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleGenerateExam = async () => {
    if (!year || !subject) return;
    setIsGenerating(true);
    setShowEditor(true);
    const content = await generateExam(subject, year, term || 'الفصل الأول');
    setGeneratedExam(content);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
       const content = editorRef.current?.value || generatedExam;
       const printWindow = window.open('', '', 'height=600,width=800');
       if (printWindow) {
           printWindow.document.write(`
               <html dir="rtl">
               <head>
                   <title>موضوع ${subject}</title>
                   <style>
                       body { font-family: 'Arial', sans-serif; padding: 40px; }
                       h1 { text-align: center; color: #333; border-bottom: 2px solid #059669; padding-bottom: 10px; }
                       .header { text-align: center; margin-bottom: 30px; color: #666; }
                       .content { white-space: pre-wrap; line-height: 1.8; font-size: 14px; }
                   </style>
               </head>
               <body>
                   <h1>موضوع مقترح في مادة ${subject}</h1>
                   <div class="header">${year} - ${term || 'الفصل الأول'}</div>
                   <div class="content">${content}</div>
               </body>
               </html>
           `);
           printWindow.document.close();
           printWindow.print();
       }
    }
  };

  // Editor Modal
  if (showEditor) {
      return (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                  <button onClick={() => setShowEditor(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                      <X size={20} />
                  </button>
                  <h3 className="font-bold text-gray-800">محرر المواضيع الذكي</h3>
                  <button onClick={handlePrint} disabled={!generatedExam} className="p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 shadow-lg">
                      <Printer size={20} />
                  </button>
              </div>

              <div className="flex-1 p-6 bg-gray-50" ref={printRef}>
                  {isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                          <p className="font-bold text-gray-500">جاري كتابة الموضوع بالذكاء الاصطناعي...</p>
                      </div>
                  ) : (
                      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm min-h-[80vh]">
                          <div className="text-center border-b-2 border-gray-100 pb-4 mb-6">
                              <h2 className="text-xl font-black text-gray-800 mb-1">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                              <p className="text-sm font-bold text-gray-500">وزارة التربية الوطنية</p>
                              <div className="mt-4 flex justify-between text-xs font-bold text-gray-400">
                                  <span>المادة: {subject}</span>
                                  <span>المستوى: {year}</span>
                              </div>
                          </div>
                          <textarea
                             ref={editorRef}
                             defaultValue={generatedExam || ''}
                             className="w-full h-[60vh] p-2 resize-none outline-none text-gray-800 leading-loose text-right font-medium"
                             placeholder="اكتب الاختبار هنا..."
                          />
                      </div>
                  )}
              </div>
              
              {!isGenerating && (
                  <div className="p-4 bg-white border-t border-gray-100 text-center">
                      <button 
                        onClick={handlePrint}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                      >
                          <Download size={20} />
                          تحميل الموضوع (PDF)
                      </button>
                  </div>
              )}
          </div>
      );
  }

  // CATEGORY SELECTION SCREEN (Only for Exams tab initially)
  if (showCategories) {
      return (
          <div className="p-6 pb-28 min-h-screen flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                      <FileText size={24} />
                  </div>
                  <div>
                      <h2 className="text-2xl font-black text-gray-900">بنك الاختبارات</h2>
                      <p className="text-xs text-gray-500 font-bold">ماذا تريد أن تبحث عنه اليوم؟</p>
                  </div>
              </div>

              <div className="flex-1 grid grid-rows-2 gap-6">
                  <button 
                    onClick={() => setSubCategory('furood')}
                    className="group relative bg-gradient-to-br from-orange-500 to-amber-500 rounded-[30px] p-6 text-white shadow-lg shadow-orange-200 overflow-hidden text-right flex flex-col justify-between hover:scale-[1.02] transition-transform active:scale-95"
                  >
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
                      <div className="z-10 bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                          <Clock size={28} className="text-white" />
                      </div>
                      <div className="z-10">
                          <h3 className="text-3xl font-black mb-1">فروض</h3>
                          <p className="opacity-90 font-bold text-sm">نماذج الفروض الفصلية المحروسة</p>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-white text-orange-600 rounded-full p-2 group-hover:translate-x-[-10px] transition-transform">
                          <ChevronLeft size={24} />
                      </div>
                  </button>

                  <button 
                    onClick={() => setSubCategory('tests')}
                    className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[30px] p-6 text-white shadow-lg shadow-blue-200 overflow-hidden text-right flex flex-col justify-between hover:scale-[1.02] transition-transform active:scale-95"
                  >
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
                      <div className="z-10 bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                          <Calendar size={28} className="text-white" />
                      </div>
                      <div className="z-10">
                          <h3 className="text-3xl font-black mb-1">اختبارات</h3>
                          <p className="opacity-90 font-bold text-sm">الاختبارات الفصلية الرسمية الشاملة</p>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-white text-blue-600 rounded-full p-2 group-hover:translate-x-[-10px] transition-transform">
                          <ChevronLeft size={24} />
                      </div>
                  </button>
              </div>
          </div>
      );
  }

  // LIST VIEW (Resources)
  return (
    <div className="p-6 pb-28 min-h-screen">
      {/* Header with Back Button if SubCategory selected */}
      <div className="flex items-center gap-3 mb-6">
        {subCategory && (
            <button 
                onClick={() => setSubCategory(null)}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
                <ChevronLeft className="rotate-180" size={20} />
            </button>
        )}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isExamSection ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
          {isExamSection ? (subCategory === 'furood' ? <Clock size={24}/> : <Calendar size={24}/>) : <PenTool size={24} />}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{getPageTitle()}</h2>
          <p className="text-xs text-gray-500 font-bold">
              {subCategory === 'furood' ? 'فروض محروسة ومنزلية' : (subCategory === 'tests' ? 'اختبارات فصلية شاملة' : 'تمارين ومواضيع')}
          </p>
        </div>
      </div>

      {/* Filter Box */}
      <div className="glass p-5 rounded-3xl shadow-sm border border-white/50 space-y-4 relative overflow-hidden mb-6">
        {/* Level Selector */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl relative z-10">
          {Object.values(EducationLevel).map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setYear(''); }}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                level === l ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
              }`}
            >
              {l.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="space-y-3 relative z-10">
          <select 
            className="w-full p-3.5 rounded-2xl bg-white/80 border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-emerald-500 transition-all appearance-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">اختر السنة الدراسية</option>
            {YEARS[level].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <div className="flex gap-3">
            <select 
              className="flex-1 p-3.5 rounded-2xl bg-white/80 border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-emerald-500 transition-all appearance-none"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="">الفصل الدراسي</option>
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              className="flex-[1.5] p-3.5 rounded-2xl bg-white/80 border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-emerald-500 transition-all appearance-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">المادة</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3 animate-fade-in">
        {!year || !subject ? (
           <div className="text-center py-10 opacity-50">
             <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
               <Search size={30} className="text-gray-400"/>
             </div>
             <p className="font-bold text-gray-500">يرجى اختيار السنة والمادة لعرض النماذج</p>
           </div>
        ) : (
          <>
            {/* AI Custom Exam Button - MOVED INSIDE THE LIST */}
            {isExamSection && (
                <div 
                    onClick={handleGenerateExam}
                    className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.01] active:scale-99 transition-all flex items-center justify-between mb-6 group border border-gray-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-emerald-400">
                            <EditIcon size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">
                                {subCategory === 'furood' ? 'إنشاء فرض مقترح (AI)' : 'إنشاء اختبار مقترح (AI)'}
                            </h4>
                            <p className="text-[10px] text-gray-300">لم تجد ما تبحث عنه؟ اطلب من الذكاء الاصطناعي كتابة موضوع لك.</p>
                        </div>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg text-white group-hover:bg-emerald-500 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-sm font-bold text-gray-700">نماذج الإنترنت (PDF)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">تحميل مباشر</span>
            </div>

            {getMockResources().map((res) => (
              <div 
                key={res.id}
                onClick={() => handleSearchPdf(res.title)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-1.5 h-full bg-gray-100 group-hover:bg-emerald-500 transition-colors"></div>
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-emerald-50 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-600">PDF</span>
                      <span className="font-black text-lg text-gray-700 group-hover:text-emerald-700">{res.id}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm group-hover:text-emerald-700 transition-colors mb-1">
                        {res.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                           {res.source === 'dzexams' ? 'DzExams' : 'Ency-Ed'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {res.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Download size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceList;