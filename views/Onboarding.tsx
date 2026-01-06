
import React, { useState } from 'react';

interface OnboardingViewProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white p-8 relative">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[35px] flex items-center justify-center text-4xl shadow-2xl animate-bounce shadow-indigo-200">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Nexos AI</h1>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Sua jornada rumo à nota 1000 começa aqui. Aprenda, pratique e evolua com o poder da inteligência artificial de ponta.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              checked={accepted} 
              onChange={() => setAccepted(!accepted)}
              className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-600 leading-normal font-medium">
              Eu aceito os <button onClick={() => setShowTerms(true)} className="text-indigo-600 font-black underline">Termos de Uso</button> e a <strong>Política de Privacidade</strong>. Entendo que as análises do Nexos AI são de caráter pedagógico.
            </label>
          </div>
        </div>

        <button 
          disabled={!accepted}
          onClick={onComplete}
          className={`w-full py-5 rounded-[25px] font-black transition-all shadow-xl uppercase tracking-widest text-xs ${
            accepted ? 'bg-indigo-600 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Iniciar Jornada
        </button>
      </div>

      {showTerms && (
        <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-2xl text-slate-800 tracking-tight">Termos de Uso</h2>
            <button onClick={() => setShowTerms(false)} className="text-slate-400 text-xl"><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-600 space-y-5 leading-relaxed pr-2 font-medium">
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><strong>1. Nexos AI:</strong> O Nexos AI é uma ferramenta de apoio pedagógico avançado. As correções geradas pela IA seguem critérios do ENEM, mas não garantem resultados oficiais.</p>
            <p><strong>2. Uso de IA:</strong> Utilizamos modelos avançados de processamento de linguagem natural (Gemini 3.0) para fornecer feedbacks. Erros pontuais podem ocorrer devido à natureza da tecnologia.</p>
            <p className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-900"><strong>3. Privacidade:</strong> Suas redações e chats são processados de forma anônima. O histórico é armazenado localmente em seu dispositivo.</p>
            <p><strong>4. Responsabilidade:</strong> O Nexos AI não se responsabiliza pelo desempenho final do usuário em exames oficiais do INEP ou outros vestibulares.</p>
            <p><strong>5. Modificações:</strong> Reservamos o direito de atualizar os termos e funcionalidades do app para garantir a melhor experiência de aprendizado.</p>
          </div>
          <button onClick={() => setShowTerms(false)} className="mt-6 w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg uppercase tracking-widest text-[10px]">Entendido</button>
        </div>
      )}
    </div>
  );
};

export default OnboardingView;
