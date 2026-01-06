
import React from 'react';
import { UserStats, AppTab, SubjectStat } from '../types';

interface WeaknessMapProps {
  stats: UserStats;
  onNavigate: (tab: AppTab) => void;
}

const WeaknessMap: React.FC<WeaknessMapProps> = ({ stats, onNavigate }) => {
  // Explicitly cast Object.entries result to SubjectStat array to fix type inference errors
  const subjects = Object.entries(stats.subjectStats || {}) as [string, SubjectStat][];

  // Lógica simples de TRI simulada:
  // Se acertar difíceis e errar fáceis, o "peso" da nota cai
  // Aqui apenas simulamos com base nos dados reais salvos nas stats do App
  const triScore = stats.triScoreEstimate || 0;

  return (
    <div className="p-5 space-y-8 bg-slate-50 min-h-full">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate(AppTab.HOME)} className="text-indigo-600 bg-white w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800">Mapa de Fraquezas</h2>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Análise de Eixos do ENEM</p>
        </div>
      </header>

      {/* TRI Simulation Card */}
      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fa-solid fa-chart-line text-6xl"></i>
        </div>
        <span className="text-[10px] font-black uppercase text-indigo-200">Simulação TRI Atual</span>
        <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-5xl font-black">{triScore.toFixed(0)}</h3>
            <span className="text-indigo-300 font-bold">pontos</span>
        </div>
        <p className="text-[10px] opacity-70 mt-3 leading-relaxed">Nota baseada no seu padrão de acertos. Errar questões fáceis penaliza mais que errar difíceis.</p>
      </section>

      {/* Performance by Subject */}
      <section className="space-y-4">
        <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest px-1">Seu Desempenho por Eixo</h4>
        {subjects.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 shadow-sm">
            <i className="fa-solid fa-circle-nodes text-slate-200 text-4xl mb-4"></i>
            <p className="text-slate-400 text-xs font-bold uppercase">Nenhum simulado concluído para análise.</p>
          </div>
        ) : (
          subjects.map(([subject, data]) => {
            const percent = (data.correct / data.total) * 100;
            const isWeak = percent < 50;
            return (
              <div key={subject} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-slate-800 text-xs">{subject}</span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${isWeak ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isWeak ? 'Focar agora' : 'Sólido'}
                  </span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ${isWeak ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase">
                  <span>{percent.toFixed(0)}% Acerto</span>
                  <span>{data.correct}/{data.total} Questões</span>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Guidance Section */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border-t-4 border-indigo-500 shadow-xl">
        <h5 className="font-black text-xs uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb text-amber-400"></i> Dica de Estudo
        </h5>
        <p className="text-[11px] leading-relaxed opacity-80">
          Foque primeiro em transformar seus eixos de cor <span className="text-rose-400 font-bold uppercase">Rosa</span> em <span className="text-emerald-400 font-bold uppercase">Verde</span>. No ENEM, a base é mais importante que o topo para a nota subir.
        </p>
      </div>
    </div>
  );
};

export default WeaknessMap;
