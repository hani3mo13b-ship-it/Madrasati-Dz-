import React, { useState, useEffect, useRef } from 'react';
import { Settings, CheckCircle2, Download, GraduationCap, ImagePlus, Bot } from '../components/Icons';
import { AVATARS, YEARS } from '../constants';
import { UserProfile, EducationLevel } from '../types';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  setActiveTab?: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile, setActiveTab }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAvatarId, setTempAvatarId] = useState(userProfile.avatarId);
  const [tempCustomAvatar, setTempCustomAvatar] = useState<string | undefined>(userProfile.customAvatar);
  const [tempLevel, setTempLevel] = useState(userProfile.level);
  const [tempYear, setTempYear] = useState(userProfile.year);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      // Reset form when cancelling edit or when prop changes
      setTempName(userProfile.name);
      setTempAvatarId(userProfile.avatarId);
      setTempCustomAvatar(userProfile.customAvatar);
      setTempLevel(userProfile.level);
      setTempYear(userProfile.year);
  }, [userProfile, isEditing]);

  const handleSave = () => {
    onUpdateProfile({
        ...userProfile,
        name: tempName,
        avatarId: tempAvatarId,
        customAvatar: tempCustomAvatar,
        level: tempLevel,
        year: tempYear
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCustomAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Determines which image to show based on state (custom or preset)
  const currentAvatarSrc = tempCustomAvatar || AVATARS[tempAvatarId];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header / Cover */}
      <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-500 relative rounded-b-[40px] shadow-lg">
        <div className="absolute -bottom-14 left-0 right-0 flex justify-center">
            <div className="relative group">
                <img 
                    src={isEditing ? currentAvatarSrc : (userProfile.customAvatar || AVATARS[userProfile.avatarId])} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white object-cover transition-all"
                />
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                        <Settings size={16} />
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="mt-16 text-center px-6 animate-fade-in">
        {isEditing ? (
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 text-right">
                <h3 className="font-black text-gray-800 mb-4 text-center">تعديل الملف الشخصي</h3>
                
                {/* Avatar Selection */}
                <label className="text-xs font-bold text-gray-400 mb-2 block">الصورة الرمزية</label>
                <div className="flex items-center gap-3 mb-6 overflow-x-auto py-2 pb-4 px-1 scrollbar-hide">
                    {/* Upload Button */}
                    <div className="shrink-0">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${tempCustomAvatar ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-300 text-gray-400 hover:border-emerald-400 hover:text-emerald-500'}`}
                        >
                            <ImagePlus size={20} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {/* Presets */}
                    {AVATARS.map((avatar, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => {
                                setTempAvatarId(idx);
                                setTempCustomAvatar(undefined); // Clear custom if preset selected
                            }} 
                            className={`shrink-0 rounded-full p-1 border-2 transition-all ${(!tempCustomAvatar && tempAvatarId === idx) ? 'border-emerald-500 scale-110' : 'border-transparent opacity-50'}`}
                        >
                             <img src={avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                        </button>
                    ))}
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">الاسم</label>
                        <input 
                            type="text" 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700 focus:border-emerald-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">الطور الدراسي</label>
                        <div className="flex gap-2 mb-2 overflow-x-auto">
                             {Object.values(EducationLevel).map((l) => (
                                 <button
                                    key={l}
                                    onClick={() => { setTempLevel(l); setTempYear(''); }}
                                    className={`flex-1 py-2 px-2 text-[10px] font-bold rounded-lg border whitespace-nowrap ${tempLevel === l ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-200 text-gray-400'}`}
                                 >
                                     {l.split(' ')[1]}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">السنة الدراسية</label>
                        <select 
                            value={tempYear}
                            onChange={(e) => setTempYear(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700 focus:border-emerald-500 outline-none appearance-none"
                        >
                            <option value="">اختر السنة</option>
                            {YEARS[tempLevel].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100">إلغاء</button>
                    <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-500 shadow-lg shadow-emerald-200">حفظ</button>
                </div>
            </div>
        ) : (
            <>
                <h1 className="text-2xl font-black text-gray-800 mb-1">{userProfile.name}</h1>
                <p className="text-gray-500 text-sm font-bold mb-6 bg-gray-100 inline-block px-3 py-1 rounded-full">
                    {userProfile.year}
                </p>
            </>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <Download size={20} />
                </div>
                <span className="text-2xl font-black text-gray-800">12</span>
                <span className="text-xs text-gray-400 font-bold">تحميل</span>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 size={20} />
                </div>
                <span className="text-2xl font-black text-gray-800">85%</span>
                <span className="text-xs text-gray-400 font-bold">نشاط</span>
            </div>
        </div>

        {/* Menu Items */}
        {!isEditing && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4 text-right">
                 <div onClick={() => setIsEditing(true)} className="p-4 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><GraduationCap size={20}/></div>
                        <span className="font-bold text-gray-700 text-sm">تغيير المستوى الدراسي</span>
                    </div>
                    <div className="text-gray-300 text-xs">تعديل</div>
                 </div>
                 
                 {setActiveTab && (
                    <div onClick={() => setActiveTab('about')} className="p-4 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Bot size={20}/></div>
                            <span className="font-bold text-gray-700 text-sm">عن التطبيق والمطور</span>
                        </div>
                        <div className="text-gray-300 text-xs">هاني</div>
                    </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;