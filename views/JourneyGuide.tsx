
import React, { useState } from 'react';

const STEPS = [
  {
    title: "Professor Particular IA",
    desc: "Tire dúvidas sobre qualquer matéria em tempo real. Um tutor paciente focado em te fazer aprender.",
    icon: "fa-chalkboard-user",
    color: "bg-indigo-600"
  },
  {
    title: "Correção por IA",
    desc: "Envie sua redação e receba uma nota detalhada baseada nas 5 competências oficiais do ENEM.",
    icon: "fa-pen-nib",
    color: "bg-slate-800"
  },
  {
    title: "Simulados e Temas",
    desc: "Gere questões inéditas e descubra as apostas de temas baseadas nos últimos 6 meses de notícias.",
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
        <div className={`w-24 h-24 ${STEPS[step].color} text-white rounded-full flex items-center justify-center text-4xl mb-8 shadow-2xl transition-all duration-500`}>
          <i className={`fa-solid ${STEPS[step].icon}`}></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{STEPS[step].title}</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{STEPS[step].desc}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}></div>
          ))}
        </div>

        <button 
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          {isLast ? 'Entendi, vamos lá!' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default JourneyGuideView;
