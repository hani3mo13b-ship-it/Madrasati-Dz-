import React, { useState, useEffect } from 'react';
import { Download, X } from './Icons';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if user has dismissed it recently (optional logic could go here)
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl border border-emerald-100 relative overflow-hidden">
         {/* Decorative background blob */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>

         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 text-white font-black text-xl">
                    DZ
                </div>
                <button onClick={() => setShowPrompt(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100">
                    <X size={20} />
                </button>
            </div>

            <h3 className="text-xl font-black text-gray-800 mb-2">تحميل التطبيق</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                قم بتثبيت تطبيق "مدرستي" على هاتفك لتصفح أسرع ووصول سهل للدروس بدون إنترنت مستقبلاً.
            </p>

            <div className="flex gap-3">
                <button 
                    onClick={() => setShowPrompt(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    لاحقاً
                </button>
                <button 
                    onClick={handleInstallClick}
                    className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    تثبيت الآن
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstallPrompt;