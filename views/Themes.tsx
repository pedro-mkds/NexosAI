
import React, { useState } from 'react';
import { AIProbableTheme, AppTab } from '../types';
import { fetchProbableThemes } from '../services/geminiService';

const ThemesView: React.FC<{onNavigate: (tab: AppTab) => void}> = ({ onNavigate }) => {
  const [themes, setThemes] = useState<AIProbableTheme[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChoiceScreen, setIsChoiceScreen] = useState(true);
  const [rocketState, setRocketState] = useState<'idle' | 'shaking' | 'flying'>('idle');

  const startGeneration = async () => {
    setIsChoiceScreen(false);
    setIsLoading(true);
    setRocketState('shaking');
    
    try {
      const result = await fetchProbableThemes();
      
      setTimeout(() => {
        setRocketState('flying');
        setTimeout(() => {
            setThemes(result);
            setIsLoading(false);
        }, 1000);
      }, 2500);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsChoiceScreen(true);
    }
  };

  if (isChoiceScreen) {
    return (
      <div className="p-8 h-full flex flex-col justify-center space-y-8 text-center animate-in fade-in duration-700">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm transform -rotate-6">
            <i className="fa-solid fa-rocket"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Radar 6 Meses</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Nossa IA vasculha as notícias dos últimos 180 dias para prever tendências reais da prova.</p>
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold mx-auto">
            <i className="fa-solid fa-calendar-check"></i>
            FILTRO: ÚLTIMO SEMESTRE
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={startGeneration} className="w-full bg-rose-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-rose-100 active:scale-95 transition-all group flex items-center justify-center gap-3">
            Explorar Temas <i className="fa-solid fa-satellite-dish animate-pulse"></i>
          </button>
          <button onClick={() => onNavigate(AppTab.HOME)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold active:scale-95 transition-transform">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center text-center space-y-12 overflow-hidden relative">
        <div className={`transition-all duration-1000 ease-in ${
            rocketState === 'flying' ? '-translate-y-[120vh] scale-150 opacity-0' : 
            rocketState === 'shaking' ? 'animate-rocket-shake' : ''
        }`}>
           <div className={`text-7xl text-rose-500`}>
                <i className="fa-solid fa-rocket"></i>
           </div>
           {rocketState === 'shaking' && (
               <div className="flex justify-center gap-1 mt-2">
                   <div className="w-3 h-8 bg-orange-400 rounded-full animate-ping"></div>
                   <div className="w-4 h-12 bg-red-600 rounded-full animate-ping delay-75"></div>
                   <div className="w-3 h-8 bg-orange-400 rounded-full animate-ping delay-150"></div>
               </div>
           )}
        </div>
        <div className={`transition-opacity duration-300 ${rocketState === 'flying' ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="text-2xl font-black text-slate-800">Sondando Último Semestre...</h3>
          <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest animate-pulse">Filtrando notícias de 180 dias atrás</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 animate-in slide-in-from-bottom-12 duration-700">
      <header className="flex items-center gap-4">
        <button onClick={() => setIsChoiceScreen(true)} className="text-rose-600 bg-rose-50 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800">Apostas Recentes</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Eventos dos últimos 6 meses</p>
        </div>
      </header>

      <div className="space-y-4">
        {themes?.map((theme, i) => (
          <div key={i} className="bg-white border-2 border-slate-50 rounded-3xl p-6 shadow-sm border-t-8 border-t-rose-500 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-slate-800 text-sm leading-tight flex-1">{theme.title}</h3>
                <span className="bg-rose-100 text-rose-700 text-[8px] px-2 py-0.5 rounded font-black ml-2 whitespace-nowrap">ALTA CHANCE</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed font-medium">{theme.description}</p>
            
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-5 relative overflow-hidden">
              <div className="absolute -right-2 -top-2 opacity-5 text-amber-500 text-4xl">
                  <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block mb-2">Por que agora? (Últimos 6 meses)</span>
              <p className="text-[10px] text-amber-800 italic leading-relaxed font-medium">{theme.reasons}</p>
            </div>

            {theme.sources && theme.sources.length > 0 && (
                <div className="pt-4 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Baseado nestas fontes:</span>
                    <div className="flex flex-wrap gap-2">
                        {theme.sources.map((s, idx) => (
                            <a key={idx} href={s.uri} target="_blank" className="text-[9px] bg-slate-50 text-indigo-600 px-3 py-1.5 rounded-xl font-black border border-slate-100 hover:bg-indigo-50 transition-colors flex items-center gap-1">
                                <i className="fa-solid fa-link opacity-50"></i>
                                {s.title.length > 25 ? s.title.substring(0, 25) + '...' : s.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 text-white p-6 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
              <p className="text-xs font-bold leading-tight">Mantenha-se informado!</p>
              <p className="text-[10px] opacity-70">O ENEM adora cobrar temas que estão em alta nos noticiários recentes.</p>
          </div>
      </div>
    </div>
  );
};

export default ThemesView;
