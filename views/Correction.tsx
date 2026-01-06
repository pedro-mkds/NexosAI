
import React, { useState } from 'react';
import { EssayCorrection, SavedCorrection } from '../types';
import { correctEssay } from '../services/geminiService';
import { COMPETENCIES_INFO } from '../constants';

interface CorrectionViewProps {
  onSave: (correction: SavedCorrection) => void;
}

const CorrectionView: React.FC<CorrectionViewProps> = ({ onSave }) => {
  const [essayText, setEssayText] = useState('');
  const [essayTitle, setEssayTitle] = useState('');
  const [isRigorous, setIsRigorous] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [result, setResult] = useState<EssayCorrection | null>(null);

  const handleCorrect = async () => {
    if (essayText.length < 500) return;
    setIsCorrecting(true);
    try {
      const correction = await correctEssay(essayText, isRigorous);
      setResult(correction);
      onSave({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        title: essayTitle || "Redação sem título",
        score: correction.totalScore,
        correction: correction
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsCorrecting(false);
    }
  };

  if (result) {
    return (
      <div className="p-5 space-y-6 bg-slate-50 min-h-full">
        <header className="flex items-center gap-3">
          <button onClick={() => setResult(null)} className="text-indigo-600 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="font-black text-slate-800">Resultado da Análise</h2>
        </header>

        <div className="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-2xl">
          <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">Pontuação Final</span>
          <h3 className="text-6xl font-black">{result.totalScore}</h3>
          {isRigorous && <span className="text-[8px] bg-rose-600 px-2 py-1 rounded-full uppercase mt-2 inline-block font-black">MODO RIGOROSO ATIVO</span>}
        </div>

        {/* Repertory Analysis Section */}
        <section className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-sm">
          <h4 className="font-black text-indigo-700 text-xs mb-3 flex items-center gap-2">
            <i className="fa-solid fa-book-bookmark"></i> Repertório Sociocultural
          </h4>
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-4">
             <span className="text-[9px] font-black uppercase text-indigo-600 mb-1 block">Qualidade do Repertório</span>
             <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{result.repertoryAnalysis.quality}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <span className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Feedback de Conexão</span>
             <p className="text-[11px] text-slate-600 leading-relaxed italic">{result.repertoryAnalysis.connectionFeedback}</p>
          </div>
        </section>

        <div className="space-y-4">
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">Competências</h4>
          {Object.entries(result.competencies).map(([key, data]: any) => (
            <div key={key} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-indigo-600 text-xs">{key}</span>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black">{data.score}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{data.feedback}</p>
            </div>
          ))}
        </div>

        <button onClick={() => setResult(null)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">Nova Redação</button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <header>
        <h2 className="text-xl font-black text-slate-800">Avaliador Inteligente</h2>
        <p className="text-slate-400 text-xs">Simulador avançado de corretor humano.</p>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRigorous ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
              <i className={`fa-solid ${isRigorous ? 'fa-user-ninja' : 'fa-user-graduate'}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-800">Simulador Rigoroso</p>
              <p className="text-[8px] text-slate-400 leading-none">Corrige sem "pena" para te desafiar.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsRigorous(!isRigorous)}
            className={`w-10 h-6 rounded-full transition-all relative ${isRigorous ? 'bg-rose-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRigorous ? 'left-5' : 'left-1'}`}></div>
          </button>
        </div>

        <input 
          type="text" placeholder="Tema da redação..." value={essayTitle} onChange={(e) => setEssayTitle(e.target.value)}
          className="w-full border border-slate-200 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        <textarea 
          rows={12} placeholder="Sua redação aqui (mínimo 500 caracteres)..." value={essayText} onChange={(e) => setEssayText(e.target.value)}
          className="w-full border border-slate-200 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium"
        />

        <button 
          onClick={handleCorrect}
          disabled={isCorrecting || essayText.length < 500}
          className={`w-full py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-3 ${
            isCorrecting || essayText.length < 500 ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white active:scale-95'
          }`}
        >
          {isCorrecting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
          Análise Completa IA
        </button>
      </div>
    </div>
  );
};

export default CorrectionView;
