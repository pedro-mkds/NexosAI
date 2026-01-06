
import React, { useState, useEffect } from 'react';
import { AppTab, SavedCorrection, UserStats } from '../types';

interface HomeViewProps {
  onNavigate: (tab: AppTab) => void;
  history: SavedCorrection[];
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, history, stats, onUpdateStats }) => {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, seconds: 0 });
  const [isEditingDate, setIsEditingDate] = useState(false);
  const progressPercent = Math.min((stats.xp / stats.nextLevelXp) * 100, 100);

  useEffect(() => {
    if (!stats.examDate) return;

    const calculateTime = () => {
      const target = new Date(stats.examDate!);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        const totalSeconds = Math.floor(diff / 1000);
        const totalDays = Math.floor(totalSeconds / (60 * 60 * 24));
        const months = Math.floor(totalDays / 30.44);
        const days = Math.floor(totalDays % 30.44);
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
        const seconds = totalSeconds % 60;
        setTimeLeft({ months, days, hours, seconds });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [stats.examDate]);

  const handleSetDate = (dateStr: string) => {
    if (!dateStr) return;
    onUpdateStats({ ...stats, examDate: dateStr });
    setIsEditingDate(false);
  };

  const handleEnemShortcut = () => {
    handleSetDate('2024-11-03'); 
  };

  return (
    <div className="p-5 space-y-6">
      <section className="bg-slate-900 rounded-[35px] p-6 text-white shadow-2xl relative overflow-hidden border-b-8 border-indigo-600 transition-all">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block mb-1">Status da Meta</span>
                <h2 className="text-lg font-black tracking-tight">Tempo para a Prova</h2>
            </div>
            <button 
                onClick={() => setIsEditingDate(true)} 
                className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
            >
                <i className="fa-solid fa-calendar-check text-indigo-300"></i>
            </button>
        </div>

        {isEditingDate || !stats.examDate ? (
            <div className="relative z-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                    <p className="text-[11px] font-bold text-slate-300 mb-3 text-center uppercase">Selecione sua data alvo:</p>
                    <input 
                        type="date" 
                        onChange={(e) => handleSetDate(e.target.value)}
                        className="w-full bg-slate-800 text-white p-4 rounded-2xl border-2 border-indigo-500/30 text-sm font-black focus:border-indigo-500 outline-none transition-all appearance-none"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleEnemShortcut}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-bolt"></i> Atalho: ENEM 2024
                    </button>
                    {stats.examDate && (
                        <button onClick={() => setIsEditingDate(false)} className="text-[10px] text-slate-400 font-bold uppercase tracking-widest py-2">Cancelar</button>
                    )}
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-4 gap-2 relative z-10">
                <TimeUnit value={timeLeft.months} label="Meses" />
                <TimeUnit value={timeLeft.days} label="Dias" />
                <TimeUnit value={timeLeft.hours} label="Horas" />
                <TimeUnit value={timeLeft.seconds} label="Seg" active />
            </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-[35px] p-6 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-end mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 bg-indigo-700 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-indigo-50/20">
                    {stats.level}
                </div>
                <div className="absolute -right-1 -bottom-1 bg-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-sm">
                    <i className="fa-solid fa-trophy text-white"></i>
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Progresso Global</span>
              <span className="text-base font-black text-slate-800">{stats.xp} <span className="text-slate-300 font-medium">/</span> {stats.nextLevelXp} XP</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppTab.WEAKNESS_MAP)}
            className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm active:scale-90 transition-all"
          >
            <i className="fa-solid fa-chart-pie"></i>
          </button>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-indigo-600 h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <MenuCard title="Nexos Tutor" xp="+5 XP" icon="fa-comment-dots" color="bg-indigo-600" onClick={() => onNavigate(AppTab.CHAT)} />
        <MenuCard title="Redação" xp="+50 XP" icon="fa-pen-nib" color="bg-slate-800" onClick={() => onNavigate(AppTab.CORRECTION)} />
        <MenuCard title="Radar Radar" xp="Temas" icon="fa-satellite-dish" color="bg-rose-600" onClick={() => onNavigate(AppTab.THEMES)} />
        <MenuCard title="Simulado" xp="+30 XP" icon="fa-bolt" color="bg-amber-500" onClick={() => onNavigate(AppTab.SIMULATION)} />
      </div>

      <section className="pb-6">
        <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                Histórico de Atividade
            </h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase">Ver tudo</button>
        </div>
        {history.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[35px] p-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Nenhuma atividade registrada
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-[25px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100">
                    {item.score}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-[12px] truncate max-w-[140px] leading-tight mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">{item.date}</p>
                  </div>
                </div>
                <div className="bg-slate-50 w-8 h-8 rounded-xl flex items-center justify-center text-slate-300">
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const TimeUnit: React.FC<{value: number, label: string, active?: boolean}> = ({ value, label, active }) => (
    <div className={`text-center p-3 rounded-2xl border-2 transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-white/5 border-white/5'}`}>
        <span className={`text-2xl font-black block leading-none mb-1 ${active ? 'text-indigo-400' : 'text-white'}`}>{value}</span>
        <span className="text-[8px] uppercase font-black text-slate-500 tracking-tighter">{label}</span>
    </div>
);

const MenuCard: React.FC<{title: string, xp: string, icon: string, color: string, onClick: () => void}> = ({ title, xp, icon, color, onClick }) => (
  <button onClick={onClick} className={`${color} text-white p-5 rounded-[35px] text-left shadow-xl active:scale-95 transition-all relative overflow-hidden group`}>
    <i className={`fa-solid ${icon} text-5xl absolute -right-2 -top-2 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500`}></i>
    <div className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center mb-5 border border-white/20 backdrop-blur-md">
      <i className={`fa-solid ${icon} text-sm`}></i>
    </div>
    <h4 className="font-black text-xs tracking-widest mb-1.5 leading-none uppercase">{title}</h4>
    <div className="inline-block bg-black/20 px-3 py-1 rounded-full border border-white/10">
        <span className="text-[8px] font-black uppercase tracking-tighter">{xp}</span>
    </div>
  </button>
);

export default HomeView;
