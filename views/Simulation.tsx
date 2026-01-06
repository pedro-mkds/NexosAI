
import React, { useState, useEffect } from 'react';
import { SimulationQuestion, AppTab } from '../types';
import { generateSimulation } from '../services/geminiService';

const SUBJECTS = ["Matemática", "Linguagens", "Ciências da Natureza", "Ciências Humanas", "Geografia", "História", "Biologia", "Física", "Química", "Filosofia"];

const SimulationView: React.FC<{onNavigate: (tab: AppTab) => void, onComplete: (questions: SimulationQuestion[], answers: number[]) => void}> = ({ onNavigate, onComplete }) => {
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isConfigScreen, setIsConfigScreen] = useState(true);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [config, setConfig] = useState({ count: 20, selectedSubjects: ["Matemática"], enemMode: false });
  const [questionTimer, setQuestionTimer] = useState(180); // 3 minutos

  useEffect(() => {
    if (config.enemMode && !isLoading && !isConfigScreen && !isReviewMode && questions.length > 0) {
      const interval = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            handleNext(true);
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [config.enemMode, isLoading, isConfigScreen, isReviewMode, questions.length, currentIdx]);

  const toggleSubject = (sub: string) => {
    setConfig(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(sub) 
        ? prev.selectedSubjects.filter(s => s !== sub) 
        : [...prev.selectedSubjects, sub]
    }));
  };

  const startSimulation = async () => {
    if (config.selectedSubjects.length === 0) return;
    setIsConfigScreen(false);
    setIsLoading(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => (prev >= 98 ? 98 : prev + (Math.random() * 5)));
    }, 400);

    try {
      const result = await generateSimulation(config.count, config.selectedSubjects);
      setQuestions(result);
      setGenerationProgress(100);
      setQuestionTimer(180);
    } catch (e) {
      console.error(e);
      setIsConfigScreen(true);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleNext = (isTimeOut = false) => {
    const finalSelection = selectedOption !== null ? selectedOption : -1;
    const newAnswers = [...userAnswers, finalSelection];
    setUserAnswers(newAnswers);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setQuestionTimer(180);
    } else {
      setIsReviewMode(true);
      onComplete(questions, newAnswers);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isConfigScreen) {
    return (
      <div className="p-6 h-full flex flex-col space-y-6 bg-slate-50 overflow-y-auto pb-10">
        <header>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Novo Simulado</h2>
          <p className="text-slate-500 text-xs font-medium">Configure seu treino personalizado Nexos AI.</p>
        </header>

        <section className={`p-6 rounded-[35px] border-2 transition-all ${config.enemMode ? 'bg-indigo-600 border-indigo-400 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.enemMode ? 'bg-white text-indigo-600 shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                        <i className="fa-solid fa-stopwatch text-lg"></i>
                    </div>
                    <div>
                        <h4 className={`font-black text-sm uppercase tracking-tight ${config.enemMode ? 'text-white' : 'text-slate-800'}`}>Modo ENEM</h4>
                        <p className={`text-[9px] uppercase font-black tracking-widest ${config.enemMode ? 'text-indigo-200' : 'text-slate-400'}`}>
                           3 min por questão
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setConfig({...config, enemMode: !config.enemMode})}
                    className={`w-14 h-8 rounded-full relative transition-all ${config.enemMode ? 'bg-indigo-400' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${config.enemMode ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
        </section>

        <section className="space-y-4">
          <div className="bg-white p-6 rounded-[35px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantidade</label>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">{config.count} Questões</span>
            </div>
            <input 
              type="range" min="10" max="100" step="10" 
              value={config.count} 
              onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-full appearance-none"
            />
          </div>

          <div className="bg-white p-6 rounded-[35px] border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-5 tracking-widest">Eixos Temáticos</label>
            <div className="flex flex-wrap gap-2.5">
              {SUBJECTS.map(sub => (
                <button 
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-4 py-2.5 rounded-2xl text-[10px] font-black transition-all border-2 ${
                    config.selectedSubjects.includes(sub) 
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button 
          onClick={startSimulation}
          className="w-full bg-slate-900 text-white py-5 rounded-[30px] font-black shadow-2xl active:scale-95 transition-all mt-auto flex items-center justify-center gap-4 text-sm uppercase tracking-widest"
        >
          <i className="fa-solid fa-graduation-cap"></i>
          Começar Treino
        </button>
      </div>
    );
  }

  // TELA DE CARREGAMENTO (SPINNER + BARRA LINEAR)
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center p-12 space-y-12 animate-in fade-in duration-500">
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Criando Simulado</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Nexos AI está gerando questões...</p>
          </div>
        </div>
        
        <div className="w-full max-w-[280px] space-y-3">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Progresso</span>
            <span className="text-sm font-black text-slate-800">{Math.round(generationProgress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm flex items-center gap-5">
            <button onClick={() => onNavigate(AppTab.HOME)} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">Relatório Nexos</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-20">
            <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-6 opacity-10 rotate-12">
                    <i className="fa-solid fa-award text-7xl"></i>
                </div>
                <h3 className="text-xl font-black mb-1">Performance Final</h3>
                <p className="text-[10px] opacity-50 font-black uppercase mb-6 tracking-widest">Análise consolidada por IA</p>
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-5xl font-black">{userAnswers.filter((ans, i) => ans === questions[i].correctAnswer).length} <span className="text-lg opacity-40">/ {questions.length}</span></span>
                        <span className="text-[10px] font-bold text-indigo-400 mt-2 uppercase tracking-widest">Acertos Confirmados</span>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
                        <span className="text-xl font-black">{Math.round((userAnswers.filter((ans, i) => ans === questions[i].correctAnswer).length / questions.length) * 100)}%</span>
                    </div>
                </div>
            </div>

            {questions.map((q, i) => {
                const isCorrect = userAnswers[i] === q.correctAnswer;
                const userChoice = userAnswers[i];
                return (
                    <div key={i} className={`bg-white rounded-[35px] p-7 border-2 shadow-sm transition-all ${isCorrect ? 'border-emerald-50 shadow-emerald-100/20' : 'border-rose-50 shadow-rose-100/20'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{q.subject}</span>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {isCorrect ? 'Sucesso' : 'Falha'}
                            </div>
                        </div>
                        <p className="text-[14px] font-black text-slate-800 leading-snug mb-8">{q.question}</p>
                        
                        <div className="space-y-3 mb-8">
                            {q.options.map((opt, optIdx) => {
                                const isCorrectOpt = optIdx === q.correctAnswer;
                                const isUserOpt = optIdx === userChoice;
                                let statusClass = "bg-slate-50 border-transparent text-slate-400 opacity-60";
                                if (isCorrectOpt) statusClass = "bg-emerald-50 border-emerald-500/30 text-emerald-900 font-black shadow-sm shadow-emerald-100";
                                if (isUserOpt && !isCorrectOpt) statusClass = "bg-rose-50 border-rose-500/30 text-rose-900 font-black shadow-sm shadow-rose-100";

                                return (
                                    <div key={optIdx} className={`p-5 rounded-2xl border-2 text-[12px] flex gap-4 transition-all ${statusClass}`}>
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isCorrectOpt ? 'bg-emerald-600 text-white' : isUserOpt ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {String.fromCharCode(65 + optIdx)}
                                        </span>
                                        <span className="flex-1 pt-0.5">{opt}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <i className="fa-solid fa-lightbulb text-indigo-500 text-xs"></i>
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Base de Conhecimento</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">{q.explanation}</p>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <button 
                onClick={() => onNavigate(AppTab.HOME)}
                className="w-full bg-slate-900 text-white py-5 rounded-[25px] font-black shadow-2xl uppercase tracking-widest text-xs active:scale-95 transition-all"
            >
                Retornar ao Painel
            </button>
        </div>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className="p-5 flex flex-col h-full bg-slate-50">
      <header className="flex justify-between items-center mb-6 bg-white p-5 rounded-[30px] shadow-sm border border-slate-100">
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">{question.subject}</span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">Q.{currentIdx + 1} de {questions.length}</span>
        </div>
        {config.enemMode ? (
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl font-black text-sm border-2 transition-all shadow-sm ${questionTimer < 30 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
                <i className="fa-solid fa-clock-rotate-left"></i>
                {formatTime(questionTimer)}
            </div>
        ) : (
            <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase border border-slate-100">Livre</div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 px-1 scrollbar-hide pb-24">
        <div className="bg-white p-8 rounded-[35px] border border-slate-200 shadow-sm relative">
            <div className="absolute -left-1.5 top-8 w-1 h-8 bg-indigo-600 rounded-full"></div>
            <h3 className="text-slate-800 font-black leading-snug text-base">{question.question}</h3>
        </div>
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => setSelectedOption(i)}
              className={`w-full text-left p-6 rounded-[28px] text-[12px] border-2 transition-all flex items-start gap-5 ${
                selectedOption === i 
                ? 'border-indigo-600 bg-indigo-50 font-black shadow-xl shadow-indigo-100/50' 
                : 'border-white bg-white text-slate-600 hover:border-slate-200 shadow-sm'
              }`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${selectedOption === i ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="leading-snug pt-1">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 -mx-5 -mb-5 border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <button 
            disabled={selectedOption === null}
            onClick={() => handleNext()}
            className={`w-full py-5 rounded-[25px] font-black shadow-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-xs ${
            selectedOption === null ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white active:scale-95'
            }`}
        >
            Confirmar Resposta
            <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
    </div>
  );
};

export default SimulationView;
