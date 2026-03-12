"use client";   

import React, { useState, use } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  User, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Info
} from "lucide-react";

// --- Tipagens e Mocks ---
type FaceStatus = "LIVRE" | "RESERVADO" | "OCUPADO";

interface Face {
  id: number;
  name: string;
  format: string;
  status: FaceStatus;
  lighting: boolean;
  campaign?: {
    customerName: string;
    startDate: string;
    endDate: string;
    daysLeft: number;
    totalDays: number;
    contractValue: string;
  };
}

export default function App({ params }: { params: Promise<{ id: string }> }) {
  // Simulação de params.id (ajuste conforme seu roteador)
  const panelId = "OUT-4482"; 
  const [selectedFace, setSelectedFace] = useState<Face | null>(null);

  const panelMock = {
    id: panelId,
    type: "OUTDOOR DUPLA FACE",
    address: "Av. Ipiranga, 6681",
    city: "Porto Alegre",
    state: "RS",
    lat: -30.0601,
    lng: -51.1748,
    faces: [
      {
        id: 1,
        name: "Face A (Sentido Bairro)",
        format: "9.00x3.00m",
        status: "OCUPADO",
        lighting: true,
        campaign: {
          customerName: "Coca-Cola Brasil",
          startDate: "2024-01-10",
          endDate: "2024-04-10",
          daysLeft: 30,
          totalDays: 90,
          contractValue: "R$ 12.500,00"
        }
      } as Face,
      {
        id: 2,
        name: "Face B (Sentido Centro)",
        format: "9.00x3.00m",
        status: "LIVRE",
        lighting: true,
      } as Face,
    ]
  };

  const getStatusConfig = (status: FaceStatus) => {
    switch (status) {
      case "LIVRE": 
        return { 
          color: "bg-emerald-500", 
          light: "bg-emerald-50", 
          text: "text-emerald-700",
          border: "border-emerald-200",
          label: "Disponível"
        };
      case "RESERVADO": 
        return { 
          color: "bg-amber-500", 
          light: "bg-amber-50", 
          text: "text-amber-700",
          border: "border-amber-200",
          label: "Reservado"
        };
      case "OCUPADO": 
        return { 
          color: "bg-rose-500", 
          light: "bg-rose-50", 
          text: "text-rose-700",
          border: "border-rose-200",
          label: "Ocupado"
        };
      default: 
        return { color: "bg-slate-400", light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", label: "Desconhecido" };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        
        {/* Header Profissional */}
        <header className="max-w-6xl mx-auto mb-10">
          <button className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium">
            <ChevronLeft size={18} />
            Voltar para o inventário
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Painel {panelMock.id}</h1>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {panelMock.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} />
                <span className="text-sm">{panelMock.address} • {panelMock.city}, {panelMock.state}</span>
                <a href="#" className="text-blue-600 hover:underline text-xs ml-2 flex items-center gap-1">
                  Ver no mapa <ExternalLink size={12} />
                </a>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-semibold hover:bg-slate-50 transition-all">
                Editar Cadastro
              </button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm text-sm font-semibold hover:bg-slate-800 transition-all">
                Gerar Relatório
              </button>
            </div>
          </div>
        </header>

        {/* Visualização da Silhueta (O "Palco") */}
        <main className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
            
            {/* Background Decorativo (Grid de engenharia) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Moldura Superior (Luminárias simulação) */}
              <div className="flex gap-20 mb-[-4px]">
                <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
                <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
                <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
              </div>

              {/* FACES DO OUTDOOR */}
              <div className="flex gap-1 relative perspective-1000">
                {panelMock.faces.map((face) => {
                  const config = getStatusConfig(face.status);
                  const isSelected = selectedFace?.id === face.id;
                  
                  return (
                    <div 
                      key={face.id}
                      onClick={() => setSelectedFace(face)}
                      className={`
                        group relative w-[340px] h-[180px] cursor-pointer transition-all duration-300
                        border-[6px] border-slate-800 bg-slate-100 rounded-sm overflow-hidden
                        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-4 scale-[1.02]' : 'hover:scale-[1.01]'}
                        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                      `}
                    >
                      {/* Conteúdo da Face */}
                      <div className={`absolute inset-0 opacity-10 ${config.color}`}></div>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Face {face.id}</span>
                        <h3 className="text-slate-800 font-bold text-center leading-tight mb-2">{face.name}</h3>
                        
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.light} ${config.text} border ${config.border}`}>
                          <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                          {config.label}
                        </div>
                      </div>

                      {/* Overlay de Hover */}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
                    </div>
                  );
                })}
              </div>

              {/* Estrutura de Sustentação (Monoposte) */}
              <div className="w-12 h-40 bg-gradient-to-b from-slate-700 to-slate-900 shadow-inner"></div>
              <div className="w-40 h-3 bg-slate-900 rounded-full mt-[-2px]"></div>
            </div>

            {/* Legenda Flutuante */}
            <div className="absolute bottom-8 right-8 flex gap-6 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl">
              {["LIVRE", "RESERVADO", "OCUPADO"].map((s) => {
                const c = getStatusConfig(s as FaceStatus);
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${c.color}`}></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{c.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-2 text-slate-400 text-sm italic">
                <Info size={16} />
                Clique em uma face para gerenciar
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Side Drawer (Gaveta de Detalhes) */}
      <div 
        className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-200 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 ${selectedFace ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedFace && (
          <div className="h-full flex flex-col">
            {/* Header da Gaveta */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedFace.name}</h2>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <Maximize2 size={14} /> Formato: {selectedFace.format}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedFace(null)} 
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusConfig(selectedFace.status).border} ${getStatusConfig(selectedFace.status).light} ${getStatusConfig(selectedFace.status).text} text-xs font-bold uppercase`}>
                  {getStatusConfig(selectedFace.status).label}
                </div>
                {selectedFace.lighting && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                    Iluminação Ativa
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo da Gaveta */}
            <div className="flex-1 overflow-y-auto p-8">
              
              {selectedFace.status === "OCUPADO" && selectedFace.campaign ? (
                <div className="space-y-8">
                  {/* Card de Campanha */}
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Campanha Atual</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                          🥤
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Cliente</p>
                          <p className="font-bold text-slate-800">{selectedFace.campaign.customerName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter leading-none">Início</p>
                          <p className="text-sm font-semibold flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {selectedFace.campaign.startDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter leading-none">Término</p>
                          <p className="text-sm font-semibold flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {selectedFace.campaign.endDate}</p>
                        </div>
                      </div>

                      {/* Progresso de Tempo */}
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Vigência do contrato</p>
                          <p className="text-xs font-black text-blue-600 italic">Faltam {selectedFace.campaign.daysLeft} dias</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(1 - (selectedFace.campaign.daysLeft / selectedFace.campaign.totalDays)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Informações Financeiras Simbolizadas */}
                  <section>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Financeiro</h3>
                     <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500 text-white rounded-lg">
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-700 font-bold uppercase">Valor Mensal</p>
                            <p className="text-lg font-bold text-emerald-900">{selectedFace.campaign.contractValue}</p>
                          </div>
                        </div>
                        <button className="text-emerald-700 hover:underline text-xs font-bold">Ver NF-e</button>
                     </div>
                  </section>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                      <Clock size={16} /> Histórico
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 font-bold text-sm hover:bg-rose-100 transition-all">
                      <AlertCircle size={16} /> Baixa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner border border-emerald-100">
                    🌿
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Espaço Livre</h3>
                  <p className="text-slate-500 text-sm mb-8 max-w-[280px]">
                    Não há campanhas ativas para esta face. Você pode criar uma reserva ou uma nova campanha direta.
                  </p>
                  
                  <div className="w-full space-y-3">
                    <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                      <span className="text-xl">+</span> Nova Campanha
                    </button>
                    <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
                      Fazer Reserva
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay */}
      {selectedFace && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-500" 
          onClick={() => setSelectedFace(null)}
        ></div>
      )}

    </div>
  );
}