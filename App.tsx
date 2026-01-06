
import React, { useState, useEffect } from 'react';
import { AppTab, SavedCorrection, UserStats, SimulationQuestion } from './types';
import HomeView from './views/Home';
import CorrectionView from './views/Correction';
import GuideView from './views/Guide';
import SimulationView from './views/Simulation';
import ThemesView from './views/Themes';
import SubmissionPackage from './views/SubmissionPackage';
import OnboardingView from './views/Onboarding';
import JourneyGuideView from './views/JourneyGuide';
import RedactionJourneyView from './views/RedactionJourney';
import ChatView from './views/Chat';
import WeaknessMap from './views/WeaknessMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [history, setHistory] = useState<SavedCorrection[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    completedSimulations: 0,
    correctedEssays: 0,
    subjectStats: {},
    triScoreEstimate: 450,
    examDate: undefined
  });

  useEffect(() => {
    const accepted = localStorage.getItem('nexos_terms_accepted');
    const seenGuide = localStorage.getItem('nexos_guide_seen');
    const saved = localStorage.getItem('nexos_history');
    const savedStats = localStorage.getItem('nexos_stats');
    
    if (saved) setHistory(JSON.parse(saved));
    if (savedStats) setStats(JSON.parse(savedStats));

    if (!accepted) setActiveTab(AppTab.ONBOARDING);
    else if (!seenGuide) setActiveTab(AppTab.GUIDE);
    setLoading(false);
  }, []);

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('nexos_stats', JSON.stringify(newStats));
  };

  const handleSimulationComplete = (questions: SimulationQuestion[], userAnswers: number[]) => {
    setStats(prev => {
      const newSubjectStats = { ...prev.subjectStats };
      let totalCorrect = 0;
      let totalEasy = 0;
      let correctEasy = 0;

      questions.forEach((q, idx) => {
        const isCorrect = userAnswers[idx] === q.correctAnswer;
        if (isCorrect) totalCorrect++;
        if (q.difficulty === 'easy') {
          totalEasy++;
          if (isCorrect) correctEasy++;
        }

        if (!newSubjectStats[q.subject]) newSubjectStats[q.subject] = { correct: 0, total: 0 };
        newSubjectStats[q.subject].total += 1;
        if (isCorrect) newSubjectStats[q.subject].correct += 1;
      });

      const consistencyFactor = totalEasy > 0 ? (correctEasy / totalEasy) : 1;
      const baseScore = (totalCorrect / questions.length) * 1000;
      const finalTri = (baseScore * consistencyFactor * 0.9) + 200;

      const newStats = {
        ...prev,
        xp: prev.xp + 50,
        completedSimulations: prev.completedSimulations + 1,
        subjectStats: newSubjectStats,
        triScoreEstimate: Math.min(Math.max(finalTri, 200), 980)
      };

      if (newStats.xp >= prev.nextLevelXp) {
        newStats.level += 1;
        newStats.xp -= prev.nextLevelXp;
        newStats.nextLevelXp = Math.floor(prev.nextLevelXp * 1.5);
      }

      localStorage.setItem('nexos_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const saveToHistory = (correction: SavedCorrection) => {
    const newHistory = [correction, ...history];
    setHistory(newHistory);
    localStorage.setItem('nexos_history', JSON.stringify(newHistory));
    
    setStats(prev => {
        let newXp = prev.xp + 100;
        let newLevel = prev.level;
        let newNext = prev.nextLevelXp;
        if (newXp >= prev.nextLevelXp) {
            newLevel++; newXp -= prev.nextLevelXp; newNext *= 1.5;
        }
        const s = {...prev, level: newLevel, xp: newXp, nextLevelXp: newNext, correctedEssays: prev.correctedEssays + 1};
        localStorage.setItem('nexos_stats', JSON.stringify(s));
        return s;
    });
  };

  const renderContent = () => {
    if (loading) return null;
    switch (activeTab) {
      case AppTab.ONBOARDING: return <OnboardingView onComplete={() => { localStorage.setItem('nexos_terms_accepted', 'true'); setActiveTab(AppTab.GUIDE); }} />;
      case AppTab.GUIDE: return <JourneyGuideView onComplete={() => { localStorage.setItem('nexos_guide_seen', 'true'); setActiveTab(AppTab.HOME); }} />;
      case AppTab.HOME: return <HomeView onNavigate={setActiveTab} history={history} stats={stats} onUpdateStats={handleUpdateStats} />;
      case AppTab.CORRECTION: return <CorrectionView onSave={saveToHistory} />;
      case AppTab.SIMULATION: return <SimulationView onNavigate={setActiveTab} onComplete={handleSimulationComplete} />;
      case AppTab.CHAT: return <ChatView onNavigate={setActiveTab} onMessageSent={() => {}} />;
      case AppTab.WEAKNESS_MAP: return <WeaknessMap stats={stats} onNavigate={setActiveTab} />;
      case AppTab.REDACTION_JOURNEY: return <RedactionJourneyView onNavigate={setActiveTab} />;
      case AppTab.THEMES: return <ThemesView onNavigate={setActiveTab} />;
      default: return <HomeView onNavigate={setActiveTab} history={history} stats={stats} onUpdateStats={handleUpdateStats} />;
    }
  };

  const showNav = activeTab !== AppTab.ONBOARDING && activeTab !== AppTab.GUIDE;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md bg-white shadow-2xl relative overflow-x-hidden border-x border-slate-100">
      {showNav && (
        <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 flex items-center justify-between shadow-md border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg uppercase tracking-tighter">N</div>
            <h1 className="font-black text-lg tracking-tight">Nexos AI</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-2xl border border-white/5 shadow-inner">
            <i className="fa-solid fa-bolt text-amber-400 text-xs"></i>
            <span className="text-xs font-black uppercase tracking-widest">Nív {stats.level}</span>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-24' : ''}`}>
        {renderContent()}
      </main>

      {showNav && (
        <nav className="bg-white/80 backdrop-blur-md border-t border-slate-100 h-20 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-4">
          <NavButton active={activeTab === AppTab.HOME} icon="fa-house" label="Início" onClick={() => setActiveTab(AppTab.HOME)} />
          <NavButton active={activeTab === AppTab.CORRECTION} icon="fa-pen-nib" label="Redação" onClick={() => setActiveTab(AppTab.CORRECTION)} />
          <NavButton active={activeTab === AppTab.CHAT} icon="fa-brain" label="Nexos Chat" onClick={() => setActiveTab(AppTab.CHAT)} />
          <NavButton active={activeTab === AppTab.SIMULATION} icon="fa-bolt" label="Simulado" onClick={() => setActiveTab(AppTab.SIMULATION)} />
          <NavButton active={activeTab === AppTab.WEAKNESS_MAP} icon="fa-chart-pie" label="Status" onClick={() => setActiveTab(AppTab.WEAKNESS_MAP)} />
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{active: boolean, icon: string, label: string, onClick: () => void}> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 w-full transition-all relative ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    {active && <div className="absolute -top-3 w-8 h-1 bg-indigo-600 rounded-full animate-in slide-in-from-top-2"></div>}
    <i className={`fa-solid ${icon} text-lg ${active ? 'animate-bounce' : ''}`}></i>
    <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{label}</span>
  </button>
);

export default App;
