
import React, { useState } from 'react';

const STEPS = [
  {
    title: "Nexos Tutor AI",
    desc: "Tire dúvidas sobre qualquer matéria em tempo real. Um tutor paciente e inteligente focado em te fazer aprender.",
    icon: "fa-chalkboard-user",
    color: "bg-indigo-600"
  },
  {
    title: "Correção por Nexos AI",
    desc: "Envie sua redação e receba uma nota detalhada baseada nas 5 competências oficiais do ENEM em poucos segundos.",
    icon: "fa-pen-nib",
    color: "bg-slate-800"
  },
  {
    title: "Simulados e Radar",
    desc: "Gere questões inéditas e descubra as apostas de temas baseadas nos últimos 6 meses de notícias do Brasil.",
    icon: "fa-bolt",
    color: "bg-amber-500"
  }
];

const JourneyGuideView: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className={`w-24 h-24 ${STEPS[step].color} text-white rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-2xl transition-all duration-500 transform hover:scale-105`}>
          <i className={`fa-solid ${STEPS[step].icon}`}></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{STEPS[step].title}</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">{STEPS[step].desc}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}></div>
          ))}
        </div>

        <button 
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          {isLast ? 'Vamos Começar!' : 'Próximo Passo'}
        </button>
      </div>
    </div>
  );
};

export default JourneyGuideView;
