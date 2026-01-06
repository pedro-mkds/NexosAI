
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppTab } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

type ChatMode = 'general' | 'mindmap' | 'summary';

interface ChatHistories {
  general: Message[];
  mindmap: Message[];
  summary: Message[];
}

const ChatView: React.FC<{onNavigate: (tab: AppTab) => void, onMessageSent: () => void}> = ({ onNavigate, onMessageSent }) => {
  const [activeMode, setActiveMode] = useState<ChatMode | null>(null);
  const [histories, setHistories] = useState<ChatHistories>({
    general: [],
    mindmap: [],
    summary: []
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nexos_ai_chats');
    if (saved) {
      try {
        setHistories(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar chat:", e);
      }
    }
  }, []);

  // Persistir histórico no localStorage
  useEffect(() => {
    localStorage.setItem('nexos_ai_chats', JSON.stringify(histories));
  }, [histories]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMode, histories]);

  const getSystemInstruction = (mode: ChatMode) => {
    const base = "Você é o Nexos AI, um tutor educacional avançado focado no ENEM. ";
    
    switch (mode) {
      case 'mindmap':
        return base + "Sua especialidade é criar MAPAS MENTAIS. Quando o usuário pedir um assunto, estruture a resposta como um mapa mental hierárquico usando markdown, emojis e tópicos claros. Ajude-o a visualizar as conexões entre os temas.";
      case 'summary':
        return base + "Sua especialidade é criar RESUMOS ESTRUTURADOS. Sintetize conteúdos complexos em tópicos diretos, definições-chave e uma seção final de 'O que cai no ENEM'.";
      default:
        return base + "Você é um tutor geral. Tire dúvidas de qualquer matéria do ENEM. Use o método socrático: não dê a resposta de bandeja, faça perguntas que guiem o aluno ao raciocínio correto.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !activeMode) return;

    const userMsg: Message = { role: 'user', text: input };
    setHistories(prev => ({
      ...prev,
      [activeMode]: [...prev[activeMode], userMsg]
    }));
    
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    onMessageSent();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: getSystemInstruction(activeMode),
          temperature: 0.7,
        }
      });

      const response = await chat.sendMessageStream({ message: currentInput });
      
      let aiText = '';
      setHistories(prev => ({
        ...prev,
        [activeMode]: [...prev[activeMode], { role: 'model', text: '' }]
      }));

      for await (const chunk of response) {
        aiText += chunk.text;
        setHistories(prev => {
          const newModeHist = [...prev[activeMode]];
          newModeHist[newModeHist.length - 1].text = aiText;
          return { ...prev, [activeMode]: newModeHist };
        });
      }
    } catch (error) {
      console.error(error);
      setHistories(prev => ({
        ...prev,
        [activeMode]: [...prev[activeMode], { role: 'model', text: 'Ops! Tive um problema de conexão com o Nexos Hub. Pode repetir?' }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const clearCurrentChat = () => {
    if (activeMode && window.confirm("Deseja apagar todo o histórico desta área?")) {
      setHistories(prev => ({ ...prev, [activeMode]: [] }));
    }
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const isHeader = line.startsWith('#') || (line.toUpperCase() === line && line.length > 5 && !line.includes(' '));
      return (
        <div key={i} className={`${isHeader ? 'font-black text-indigo-700 mt-3 mb-1 text-sm' : 'mb-1 text-[13px] leading-relaxed'} ${line.startsWith('-') ? 'pl-4' : ''}`}>
          {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
      );
    });
  };

  if (!activeMode) {
    return (
      <div className="p-6 h-full flex flex-col justify-center bg-slate-50 space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-indigo-200">
                <i className="fa-solid fa-brain"></i>
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nexos Hub</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Selecione seu modo de estudo</p>
            </div>
        </div>

        <div className="space-y-4">
            <ModeCard 
                title="Chat Principal" 
                desc="Tutor geral para todas as matérias."
                icon="fa-comments" 
                color="bg-indigo-600"
                onClick={() => setActiveMode('general')}
                count={histories.general.length}
            />
            <ModeCard 
                title="Mapas Mentais" 
                desc="Gere diagramas e conexões visuais."
                icon="fa-sitemap" 
                color="bg-purple-600"
                onClick={() => setActiveMode('mindmap')}
                count={histories.mindmap.length}
            />
            <ModeCard 
                title="Resumos IA" 
                desc="Sínteses estruturadas de conteúdos."
                icon="fa-file-lines" 
                color="bg-blue-600"
                onClick={() => setActiveMode('summary')}
                count={histories.summary.length}
            />
        </div>
      </div>
    );
  }

  const currentMessages = histories[activeMode];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-10 duration-500">
      <header className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={() => setActiveMode(null)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex flex-col">
                <h2 className="font-black text-slate-800 text-xs uppercase tracking-tight">
                    {activeMode === 'general' ? 'Nexos Chat' : activeMode === 'mindmap' ? 'Mapas Mentais' : 'Resumos IA'}
                </h2>
                <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Sessão Persistente</span>
            </div>
        </div>
        <button onClick={clearCurrentChat} className="w-10 h-10 rounded-2xl text-slate-200 hover:text-rose-500 transition-colors">
            <i className="fa-solid fa-trash-can text-sm"></i>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-20">
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-20">
            <i className="fa-solid fa-message text-6xl"></i>
            <p className="text-sm font-black uppercase tracking-widest">Comece a digitar sua dúvida abaixo...</p>
          </div>
        ) : (
          currentMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 rounded-[28px] shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text ? formatMessageText(msg.text) : (
                    <div className="flex gap-1.5 py-1">
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <footer className="p-4 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
        <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-500 transition-all">
          <input 
            type="text" 
            placeholder="Como o Nexos pode te ajudar?" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 px-4 py-2 disabled:opacity-50"
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                !input.trim() || isTyping ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white active:scale-90'
            }`}
          >
            <i className={`fa-solid ${isTyping ? 'fa-spinner animate-spin' : 'fa-paper-plane'} text-sm`}></i>
          </button>
        </div>
      </footer>
    </div>
  );
};

const ModeCard: React.FC<{title: string, desc: string, icon: string, color: string, onClick: () => void, count: number}> = ({ title, desc, icon, color, onClick, count }) => (
    <button onClick={onClick} className="w-full bg-white p-5 rounded-[30px] shadow-sm border border-slate-100 flex items-center gap-5 active:scale-95 transition-all text-left group">
        <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="flex-1">
            <h4 className="font-black text-slate-800 text-sm tracking-tight mb-0.5">{title}</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">{desc}</p>
        </div>
        {count > 0 && (
            <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black">
                {count} MSG
            </div>
        )}
    </button>
);

export default ChatView;
