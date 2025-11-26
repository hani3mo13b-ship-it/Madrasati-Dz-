import React, { useEffect, useState } from 'react';
import { GraduationCap } from './Icons';
import { UserProfile } from '../types';
import { AVATARS } from '../constants';

const Header: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
      const checkUser = () => {
          const saved = localStorage.getItem('madrassati_user');
          if (saved) {
              const parsed = JSON.parse(saved);
              // Only update if changed to prevent loop
              setUser(prev => JSON.stringify(prev) !== JSON.stringify(parsed) ? parsed : prev);
          }
      };
      
      checkUser();
      const interval = setInterval(checkUser, 1000); // Poll for changes
      return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white pt-safe-top pb-2 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sticky top-0 z-40">
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 rounded-2xl shadow-lg shadow-emerald-200">
             {user ? (
               <img 
                 src={user.customAvatar || AVATARS[user.avatarId]} 
                 alt="Avatar" 
                 className="w-10 h-10 bg-white rounded-[14px] object-cover" 
               />
             ) : (
               <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center">
                 <GraduationCap className="text-emerald-500" size={24} />
               </div>
             )}
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 leading-none mb-1">
              {user ? `أهلاً، ${user.name.split(' ')[0]}` : 'مدرستي DZ'}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold bg-gray-100 inline-block px-2 py-0.5 rounded-full">
              {user ? user.year : 'رفيق النجاح 🇩🇿'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;