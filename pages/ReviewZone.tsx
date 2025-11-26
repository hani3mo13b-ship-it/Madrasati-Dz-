import React, { useState } from 'react';
import { Video, ExternalLink, Search, PlayCircle, BookOpen, FileText, CheckCircle2, X } from '../components/Icons';
import { YEARS, SUBJECTS, TERMS, ALGERIAN_SOURCES } from '../constants';
import { EducationLevel, Subject } from '../types';
import { generateStudyAdvice, searchYouTubeVideos } from '../services/gemini';

interface VideoResult {
  id: string;
  title: string;
  channel: string;
}

const ReviewZone: React.FC = () => {
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.SECONDARY);
  const [year, setYear] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  
  // Video Search State
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const isSelectionComplete = year && term && subject;

  const handleGenerateAdvice = async () => {
    if (!isSelectionComplete) return;
    setLoadingAdvice(true);
    const advice = await generateStudyAdvice(year, subject, term);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  // Smart Shortcut Handler
  const handleShortcut = async (type: 'review' | 'summary' | 'exercises' | 'exams') => {
    if (!isSelectionComplete) return;

    // Get the specific teacher for this subject (e.g. Noureddine for Math)
    const teacher = ALGERIAN_SOURCES.YOUTUBE_CHANNELS[subject as Subject] || 'دروس الدعم الجزائر';
    
    let query = '';
    
    // Reset states
    setVideos([]);
    setHasSearched(false);
    setAiAdvice(null);

    if (type === 'exams') {
        // For exams, we stick to PDF search (External)
        query = `site:dzexams.com اختبارات ${subject} ${year} ${term}`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        return;
    }

    // Build query for videos
    switch (type) {
        case 'review':
            query = `مراجعة شاملة ${subject} ${year} ${term} ${teacher}`;
            setVideoSearchQuery('المراجعة الشاملة');
            break;
        case 'summary':
            query = `ملخص دروس ${subject} ${year} ${term} ${teacher}`;
            setVideoSearchQuery('الملخصات');
            break;
        case 'exercises':
            query = `حل تمارين الكتاب المدرسي ${subject} ${year} ${term} ${teacher}`;
            setVideoSearchQuery('حلول التمارين');
            break;
    }

    setLoadingVideos(true);
    const results = await searchYouTubeVideos(query);
    setVideos(results);
    setHasSearched(true);
    setLoadingVideos(false);
  };

  const handleVideoClick = (video: VideoResult) => {
      // If it's a fallback search result (starts with SEARCH_FALLBACK), open search results
      if (video.id.startsWith('SEARCH_FALLBACK')) {
          // Extract the query from the title or just search the title
          const cleanQuery = video.title.replace('بحث يوتيوب: ', '').replace('شاهد شرح: ', '');
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
          window.open(searchUrl, '_blank');
      } else {
          // It's a real video ID
          window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
      }
  };

  return (
    <div className="p-6 pb-28 min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <Video size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">قسم المراجعة</h2>
          <p className="text-xs text-gray-500 font-bold">اختر درسك وابدأ فوراً 📺</p>
        </div>
      </div>

      {/* Filters Container */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4 mb-8">
        {/* Level Selector */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {Object.values(EducationLevel).map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setYear(''); }}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                level === l ? 'bg-white shadow-sm text-purple-600' : 'text-gray-400'
              }`}
            >
              {l.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 gap-3">
          <select 
            className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-black outline-none focus:border-purple-500 transition-colors appearance-none"
            value={year}
            onChange={(e) => { setYear(e.target.value); setVideos([]); setHasSearched(false); }}
          >
            <option value="">اختر السنة الدراسية</option>
            {YEARS[level].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <div className="flex gap-3">
            <select 
              className="flex-1 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-black outline-none focus:border-purple-500 transition-colors appearance-none"
              value={term}
              onChange={(e) => { setTerm(e.target.value); setVideos([]); setHasSearched(false); }}
            >
              <option value="">الفصل الدراسي</option>
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              className="flex-[2] p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-black outline-none focus:border-purple-500 transition-colors appearance-none"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setVideos([]); setHasSearched(false); }}
            >
              <option value="">المادة</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Smart Lists & Actions */}
      {isSelectionComplete ? (
        <div className="space-y-6 animate-fade-in">
          
            {/* Action Grid */}
            <div>
                <h3 className="font-bold text-gray-800 text-lg mb-3 px-2">ماذا تريد أن تراجع؟</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleShortcut('review')}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all group active:scale-95"
                    >
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle size={20} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">مراجعة شاملة</span>
                    </button>

                    <button 
                        onClick={() => handleShortcut('summary')}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-all group active:scale-95"
                    >
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">ملخص الفصل</span>
                    </button>

                    <button 
                        onClick={() => handleShortcut('exercises')}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all group active:scale-95"
                    >
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">حلول التمارين</span>
                    </button>

                    <button 
                        onClick={() => handleShortcut('exams')}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all group active:scale-95"
                    >
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">مقترحات PDF</span>
                    </button>
                </div>
            </div>

          {/* Loading State */}
          {loadingVideos && (
             <div className="text-center py-12 animate-fade-in">
                <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-bold text-gray-500">جاري البحث عن أفضل الشروحات...</p>
             </div>
          )}

          {/* Video Results List */}
          {!loadingVideos && videos.length > 0 && (
             <div className="animate-fade-in">
                <div className="flex items-center justify-between px-2 mb-3">
                   <h3 className="font-black text-gray-800 text-lg">نتائج {videoSearchQuery}</h3>
                   <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                     مقترحات
                   </span>
                </div>
                <div className="grid gap-4">
                   {videos.map((video, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleVideoClick(video)}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-md transition-all flex flex-col sm:flex-row relative"
                      >
                         {/* Smart Thumbnail */}
                         <div className="relative aspect-video sm:w-40 shrink-0 bg-gray-200 flex items-center justify-center overflow-hidden">
                            {!video.id.startsWith('SEARCH_FALLBACK') ? (
                                <img 
                                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback if thumb fails
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Search size={32} className="text-white/80" />
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                               <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                  {video.id.startsWith('SEARCH_FALLBACK') ? (
                                      <Search size={20} className="text-purple-600" />
                                  ) : (
                                      <PlayCircle size={24} className="text-red-600 fill-red-100" />
                                  )}
                               </div>
                            </div>
                         </div>
                         
                         {/* Info */}
                         <div className="p-3 flex flex-col justify-center flex-1">
                            <h4 className="font-bold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">
                                {video.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold">
                                   {video.channel}
                                </span>
                                {video.id.startsWith('SEARCH_FALLBACK') && (
                                    <span className="text-[10px] text-purple-600 font-bold">بحث ذكي</span>
                                )}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* AI Advice Section */}
          {!aiAdvice && !loadingVideos && !hasSearched && (
            <button 
                onClick={handleGenerateAdvice}
                disabled={loadingAdvice}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4"
            >
                {loadingAdvice ? 'جاري التحضير...' : '✨ اطلب خطة مراجعة ذكية'}
            </button>
          )}

          {/* AI Advice Result */}
          {aiAdvice && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-3xl text-white shadow-lg relative overflow-hidden animate-fade-in">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-emerald-400">💡 خطة المراجعة</h3>
                    <button onClick={() => setAiAdvice(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-medium">
                  {aiAdvice}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-10 opacity-50 animate-fade-in">
             <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
               <Search size={30} className="text-gray-400"/>
             </div>
             <p className="font-bold text-gray-500">اختر السنة والمادة لتظهر القوائم</p>
        </div>
      )}
    </div>
  );
};

export default ReviewZone;