
import React, { useState } from 'react';
import { AppTab } from '../types';

// Moved CompetencyItem above its usage in JOURNEY_STEPS to fix block-scoped variable error
const CompetencyItem: React.FC<{label: string, title: string, desc: string}> = ({ label, title, desc }) => (
    <div className="flex gap-3 bg-white border border-slate-100 p-2 rounded-xl">
        <span className="bg-indigo-700 text-white font-black text-[9px] w-6 h-6 rounded flex items-center justify-center shrink-0">{label}</span>
        <div>
            <h5 className="font-bold text-slate-800 text-[9px] leading-none mb-1">{title}</h5>
            <p className="text-[8px] text-slate-400 leading-none">{desc}</p>
        </div>
    </div>
);

const JOURNEY_STEPS = [
  {
    id: 1,
    category: "FUNDAMENTO",
    title: "As 5 Competências do ENEM",
    desc: "O código secreto dos corretores. Entenda o que cada uma avalia.",
    content: (
        <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">Cada competência vale até 200 pontos. O somatório define sua nota final de 0 a 1000.</p>
            <div className="space-y-2">
                <CompetencyItem label="C1" title="Norma Culta" desc="Domínio da língua portuguesa escrita." />
                <CompetencyItem label="C2" title="Tema e Repertório" desc="Compreender o tema e trazer conhecimentos externos." />
                <CompetencyItem label="C3" title="Argumentação" desc="Organizar e interpretar fatos e opiniões." />
                <CompetencyItem label="C4" title="Coesão" desc="Mecanismos linguísticos de conexão do texto." />
                <CompetencyItem label="C5" title="Proposta de Intervenção" desc="Sugestão de solução respeitando direitos humanos." />
            </div>
        </div>
    )
  },
  {
    id: 2,
    category: "ESTRUTURA",
    title: "O Esqueleto Perfeito",
    desc: "Toda redação nota 1000 segue um padrão estrutural sólido.",
    content: (
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <h5 className="font-bold text-indigo-700 text-[10px] mb-1">Introdução</h5>
                <p className="text-[9px] text-slate-600">Repertório + Tema + Tese.</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <h5 className="font-bold text-emerald-700 text-[10px] mb-1">D1 e D2</h5>
                <p className="text-[9px] text-slate-600">Argumento + Justificativa.</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 col-span-2">
                <h5 className="font-bold text-amber-700 text-[10px] mb-1">Conclusão</h5>
                <p className="text-[9px] text-slate-600">A famosa Proposta com Agente, Ação, Meio, Efeito e Detalhamento.</p>
            </div>
        </div>
    )
  },
  {
    id: 3,
    category: "EXEMPLO REAL",
    title: "Análise: Redação Nota 1000",
    desc: "Veja como um aluno real estruturou um texto impecável.",
    isExample: true,
    author: "Alice Ferreira",
    theme: "Manipulação do comportamento pelo controle de dados",
    text: "Segundo Zygmunt Bauman, a pós-modernidade é marcada pela liquidez das relações. Paralelamente, a internet potencializa essa instabilidade ao utilizar algoritmos para filtrar informações...",
    analysis: [
        { label: "Repertório", text: "Uso de Bauman (Sociologia) como base legitimada logo no início." },
        { label: "Conectivo", text: "Uso de 'Paralelamente' garante coesão entre as frases (C4)." },
        { label: "Tese", text: "Relaciona a internet à instabilidade citada por Bauman." }
    ]
  },
  {
    id: 4,
    category: "PROPOSTA",
    title: "A Proposta de Intervenção",
    desc: "Onde muitos perdem pontos fáceis. Aprenda os 5 elementos.",
    content: (
        <div className="space-y-3">
            <div className="bg-slate-800 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <span className="text-[9px] font-bold">CHECKLIST C5</span>
                    <span className="text-[10px] text-emerald-400 font-black">+200 PTS</span>
                </div>
                <ul className="text-[10px] space-y-1 opacity-90">
                    <li>• AGENTE: Quem executa? (Ex: MEC)</li>
                    <li>• AÇÃO: O que será feito?</li>
                    <li>• MEIO/MODO: Como será feito?</li>
                    <li>• EFEITO: Para que será feito?</li>
                    <li>• DETALHAMENTO: Explicação extra.</li>
                </ul>
            </div>
        </div>
    )
  }
];

const RedactionJourneyView: React.FC<{onNavigate: (tab: AppTab) => void}> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="p-5 space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Trilha Nota 1000</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Passo a passo rumo à excelência</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black">
            {activeStep + 1} / {JOURNEY_STEPS.length}
        </div>
      </header>

      <div className="relative">
        {/* Timeline Track */}
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-100 rounded-full -z-10"></div>

        <div className="space-y-8">
          {JOURNEY_STEPS.map((step, i) => (
            <div key={step.id} className="flex gap-6">
              <button 
                onClick={() => setActiveStep(i)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-md shrink-0 border-4 ${
                  activeStep === i 
                  ? 'bg-indigo-600 text-white border-indigo-100 scale-110' 
                  : 'bg-white text-slate-300 border-white'
                }`}
              >
                {step.id}
              </button>

              <div 
                className={`bg-white border-2 rounded-3xl p-6 shadow-sm transition-all flex-1 ${
                  activeStep === i ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-50 opacity-40 grayscale'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        activeStep === i ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                        {step.category}
                    </span>
                    {activeStep > i && <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>}
                </div>
                
                <h3 className="font-black text-slate-800 text-sm mb-1">{step.title}</h3>
                <p className="text-[10px] text-slate-500 mb-4 leading-tight font-medium">{step.desc}</p>
                
                {activeStep === i && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2 border-t border-slate-50">
                    {step.isExample ? (
                      <div className="space-y-4">
                         <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-indigo-500">
                            <p className="text-[10px] text-slate-700 italic leading-relaxed">"{step.text}"</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">Análise Pedagógica</span>
                            {step.analysis?.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <span className="text-[9px] font-black text-slate-400 mt-0.5">{item.label}:</span>
                                    <p className="text-[9px] text-slate-600 flex-1">{item.text}</p>
                                </div>
                            ))}
                         </div>
                      </div>
                    ) : (
                      <div className="animate-in zoom-in-95 duration-300">
                        {step.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <button 
            onClick={() => onNavigate(AppTab.CORRECTION)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
            <i className="fa-solid fa-pen-fancy"></i>
            Praticar agora
        </button>
      </div>
    </div>
  );
};

export default RedactionJourneyView;
