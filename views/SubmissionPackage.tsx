
import React from 'react';

const SubmissionPackage: React.FC = () => {
  return (
    <div className="p-5 space-y-8 bg-slate-50 pb-24">
      <section>
        <h2 className="text-xl font-black text-indigo-700 uppercase tracking-tighter mb-4">Checklist de Lançamento</h2>
        <div className="space-y-3">
          <CheckItem label="Android App Bundle (AAB) Gerado" />
          <CheckItem label="Política de Privacidade URL ativa" />
          <CheckItem label="Classificação Indicativa (13+)" />
          <CheckItem label="Assets Visuais (Nexos AI 512x512)" />
          <CheckItem label="Data Safety Form (Gemini API)" />
        </div>
      </section>

      <section className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-200 space-y-5">
        <h3 className="font-black text-slate-800 border-b pb-3 uppercase tracking-widest text-[10px]">Play Store Listing</h3>
        <div className="space-y-5">
          <ListingField label="App Name" value="Nexos AI: Redação & Simulado ENEM" />
          <ListingField label="Short Description" value="Seu tutor IA 24h para redação, dúvidas de matérias e simulados avançados para o ENEM." />
          <ListingField label="Long Description" value={`O Nexos AI é o assistente de inteligência artificial definitivo para estudantes que buscam a excelência no ENEM e grandes vestibulares. 

Funcionalidades Exclusivas:
- Nexos Chat: Três modos especializados (Geral, Mapas Mentais e Resumos) para acelerar sua compreensão.
- Avaliador de Redação Rigoroso: Receba notas detalhadas baseadas nas 5 competências oficiais do INEP.
- Simulado Customizado: Gere questões inéditas com cronômetro modo ENEM.
- Radar de Temas: Descubra apostas baseadas em eventos reais dos últimos 6 meses.
- Mapa de Fraquezas: Visualize seu desempenho e entenda sua nota TRI.

Privacidade:
Os dados são processados para gerar feedback pedagógico. O Nexos AI respeita sua privacidade e utiliza o poder do Google Gemini para transformar seus estudos.`} />
        </div>
      </section>

      <section className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-black text-slate-800 border-b pb-3 uppercase tracking-widest text-[10px]">Privacy Policy (Preview)</h3>
        <div className="bg-slate-50 p-5 rounded-2xl text-[9px] font-mono text-slate-500 max-h-48 overflow-y-auto leading-relaxed border border-slate-100">
          POLÍTICA DE PRIVACIDADE - NEXOS AI<br/><br/>
          Última atualização: 2024-05-24<br/><br/>
          1. COLETA DE DADOS<br/>
          O Nexos AI coleta textos de redação e interações de chat exclusivamente para processamento via API de Inteligência Artificial e armazenamento de histórico local no dispositivo do usuário.<br/><br/>
          2. USO DE DADOS<br/>
          Os dados são utilizados para fornecer feedback educacional personalizado, análise de desempenho TRI e gamificação. Não compartilhamos nem comercializamos dados com terceiros.<br/><br/>
          3. TECNOLOGIA<br/>
          Utilizamos a infraestrutura da Google Gemini API para o processamento de linguagem natural. Os dados enviados são processados seguindo os padrões de segurança da plataforma.<br/><br/>
          4. CONTATO<br/>
          suporte@nexosai.edu
        </div>
      </section>

      <section className="bg-slate-900 text-white p-7 rounded-[40px] space-y-5 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-6 opacity-10">
            <i className="fa-solid fa-shapes text-6xl"></i>
        </div>
        <h3 className="font-black text-lg tracking-tight">Identidade Visual</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <h4 className="text-[10px] font-black uppercase mb-2 text-indigo-400">Ícone</h4>
            <div className="w-full aspect-square bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">N</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <h4 className="text-[10px] font-black uppercase mb-2 text-indigo-400">Screenshots</h4>
            <ul className="text-[9px] font-bold space-y-1.5 text-slate-300">
                <li className="flex items-center gap-1.5"><i className="fa-solid fa-check text-[7px] text-emerald-400"></i> Nexos Hub</li>
                <li className="flex items-center gap-1.5"><i className="fa-solid fa-check text-[7px] text-emerald-400"></i> Radar 180 Dias</li>
                <li className="flex items-center gap-1.5"><i className="fa-solid fa-check text-[7px] text-emerald-400"></i> Simulado TRI</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const CheckItem: React.FC<{label: string}> = ({ label }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-[10px] shadow-sm">
      <i className="fa-solid fa-check"></i>
    </div>
    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
  </div>
);

const ListingField: React.FC<{label: string, value: string}> = ({ label, value }) => (
  <div className="space-y-1.5">
    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-1">{label}</span>
    <p className="text-[11px] text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-1 whitespace-pre-wrap font-medium leading-relaxed">{value}</p>
  </div>
);

export default SubmissionPackage;
