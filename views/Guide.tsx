
import React from 'react';

const GuideView: React.FC = () => {
  return (
    <div className="p-5 space-y-6">
      <header>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Guia de Redação</h2>
        <p className="text-slate-400 text-xs">Aprenda a estrutura de uma redação nota 1000.</p>
      </header>

      <section className="space-y-4">
        <GuideCard 
          title="Introdução" 
          description="Apresentação do tema e tese. Use repertório sociocultural logo de início."
          tips={["Apresente o tema claramente.", "Cite uma obra ou fato histórico.", "Finalize com sua tese."]}
          icon="fa-door-open"
          color="border-l-indigo-500"
        />
        <GuideCard 
          title="Desenvolvimento" 
          description="Defesa do seu ponto de vista através de argumentos sólidos."
          tips={["Use conectivos entre parágrafos.", "Use dados ou citações.", "Explique a causa/consequência."]}
          icon="fa-gears"
          color="border-l-amber-500"
        />
        <GuideCard 
          title="Conclusão" 
          description="Solução para o problema respeitando os direitos humanos."
          tips={["Agente (Quem fará?)", "Ação (O que fará?)", "Meio/Modo (Como fará?)", "Efeito (Para quê?)"]}
          icon="fa-flag-checkered"
          color="border-l-green-500"
        />
      </section>

      <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl">
        <h4 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-2">
          <i className="fa-solid fa-ban"></i>
          O que zera a redação?
        </h4>
        <ul className="text-xs text-rose-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="bg-rose-200 text-rose-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
            Fugir totalmente do tema proposto.
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-rose-200 text-rose-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
            Não obedecer à estrutura dissertativo-argumentativa.
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-rose-200 text-rose-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">3</span>
            Ter menos de 7 linhas escritas.
          </li>
        </ul>
      </div>
    </div>
  );
};

const GuideCard: React.FC<{title: string, description: string, tips: string[], icon: string, color: string}> = ({ title, description, tips, icon, color }) => (
  <div className={`bg-white border border-slate-200 border-l-4 ${color} p-5 rounded-xl shadow-sm`}>
    <div className="flex items-center gap-3 mb-2">
      <i className={`fa-solid ${icon} text-slate-400`}></i>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
          <i className="fa-solid fa-circle-check text-green-500"></i>
          {tip}
        </div>
      ))}
    </div>
  </div>
);

export default GuideView;
