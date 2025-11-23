import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ResourceList from './pages/ResourceList';
import ReviewZone from './pages/ReviewZone';
import AiTutor from './pages/AiTutor';
import AiSolver from './pages/AiSolver';
import Profile from './pages/Profile';
import About from './pages/About';
import Onboarding from './components/Onboarding';
import InstallPrompt from './components/InstallPrompt';
import { UserProfile, EducationLevel } from './types';
import { AVATARS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from local storage on mount
    const savedProfile = localStorage.getItem('madrassati_user');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('madrassati_user', JSON.stringify(newProfile));
  };

  // While checking storage
  if (isLoading) return <div className="min-h-screen bg-gray-50"></div>;

  // Show Onboarding if no profile exists
  if (!userProfile) {
    return <Onboarding onComplete={handleUpdateProfile} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'exams':
        return <ResourceList type="exams" />;
      case 'exercises':
        return <ResourceList type="exercises" />;
      case 'reviews':
        return <ReviewZone />;
      case 'ai':
        return <AiTutor />;
      case 'solver':
        return <AiSolver userProfile={userProfile} />;
      case 'profile':
        return <Profile userProfile={userProfile} onUpdateProfile={handleUpdateProfile} setActiveTab={setActiveTab} />;
      case 'about':
        return <About onBack={() => setActiveTab('profile')} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen font-cairo text-right relative overflow-hidden bg-gray-50">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Install Prompt Modal */}
      <InstallPrompt />

      {/* Main Content */}
      <div className="relative z-10">
        {activeTab !== 'profile' && activeTab !== 'solver' && activeTab !== 'about' && <Header />}
        <main className="max-w-md mx-auto bg-white/80 backdrop-blur-sm min-h-screen shadow-2xl relative border-x border-white/50">
          {renderContent()}
        </main>
        {activeTab !== 'about' && <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
};

export default App;