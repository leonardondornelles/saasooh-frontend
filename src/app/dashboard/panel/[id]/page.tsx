"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/services/api"; // Certifique-se de que o caminho import está correto para o seu projeto!
import { 
  ChevronLeft, 
  ChevronRight,
  MapPin, 
  Calendar, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Info
} from "lucide-react";

// --- Tipagens ---
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

export default function PanelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Desempacota o ID da URL
  const resolvedParams = use(params);
  const panelId = resolvedParams.id; 

  const [selectedFace, setSelectedFace] = useState<Face | null>(null);
  const [panelData, setPanelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estado exclusivo para navegação das faces no painel de LED
  const [activeLedFaceIndex, setActiveLedFaceIndex] = useState(0);

  useEffect(() => {
    const fetchPanelDetails = async () => {
      try {
        const response = await api.get(`/api/panels/${panelId}`);
        setPanelData(response.data);
      } catch (err) {
        console.error("Erro ao carregar os detalhes do painel:", err);
        setError("Não foi possível carregar os dados deste painel.");
      } finally {
        setLoading(false);
      }
    };

    fetchPanelDetails();
  }, [panelId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Carregando inventário...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;
  if (!panelData || !panelData.faces || panelData.faces.length === 0) {
     return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Nenhuma face cadastrada para este painel.</div>;
  }

  const getStatusConfig = (status: FaceStatus) => {
    switch (status) {
      case "LIVRE": 
        return { color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Disponível" };
      case "RESERVADO": 
        return { color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Reservado" };
      case "OCUPADO": 
        return { color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "Ocupado" };
      default: 
        return { color: "bg-slate-400", light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", label: "Desconhecido" };
    }
  };

  // Lógica Dinâmica baseada no panelData.type real vindo do banco
  const isVertical = panelData.type === 'EMPENA';
  const isLed = panelData.type === 'LED' || panelData.type === 'PAINEL_DE_LED';
  const isFrontlight = panelData.type === 'FRONTLIGHT' || panelData.type === 'FRONT_LIGHT';
  const isOutdoor = panelData.type === 'OUTDOOR';
  
  const faceContainerClass = isVertical ? 'flex-col gap-4' : 'flex-row gap-2';
  
  const faceSizeClass = isVertical 
    ? 'w-[200px] h-[300px]' 
    : isLed 
      ? 'w-[560px] h-[280px]' 
      : 'w-[340px] h-[180px]';

  // Faces a serem exibidas: Apenas 1 no LED (carrossel), ou todas as faces para os normais
  const displayFaces = isLed ? [panelData.faces[activeLedFaceIndex]] : panelData.faces;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        
        {/* Header Profissional */}
        <header className="max-w-6xl mx-auto mb-10">
          <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium w-fit">
            <ChevronLeft size={18} />
            Voltar para o inventário
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Painel {panelData.id}</h1>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {panelData.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} />
                <span className="text-sm">{panelData.address} • {panelData.city}</span>
                <a href="#" className="text-blue-600 hover:underline text-xs ml-2 flex items-center gap-1">
                  Ver no mapa <ExternalLink size={12} />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
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
          <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[560px] overflow-hidden">
            
            {/* Background Decorativo (Grid de engenharia) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 flex flex-col items-center">
              
              {/* --- ESTRUTURAS DE FUNDO --- */}
              {isVertical && (
                <div className="absolute inset-0 flex justify-center -z-10 mt-[-60px] mb-[-48px]">
                  {/* Prédio */}
                  <div className="w-[320px] h-[600px] bg-slate-300 border-x-4 border-slate-400 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(slate-600 2px, transparent 2px), linear-gradient(90deg, slate-600 2px, transparent 2px)', backgroundSize: '40px 60px' }}></div>
                  </div>
                </div>
              )}

              {isOutdoor && (
                <div className="absolute inset-0 flex justify-center items-center -z-10 mt-[-20px]">
                  {/* Treliça de Fundo Tradicional */}
                  <div className="w-[720px] h-[200px] bg-slate-200 opacity-50 relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #94a3b8 20px, #94a3b8 22px)'}}></div>
                </div>
              )}

              {/* --- LUMINÁRIAS SUPERIORES --- */}
              {(!isVertical && !isLed) && (
                <div className={`flex mb-[-4px] ${isOutdoor ? 'gap-32' : 'gap-20'}`}>
                  <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
                  <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
                  <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>
                  {isOutdoor && <div className="w-8 h-2 bg-slate-700 rounded-t-lg"></div>}
                </div>
              )}

              {/* --- FACES DINÂMICAS --- */}
              <div className={`flex relative perspective-1000 ${faceContainerClass} ${isVertical ? 'mt-8' : ''}`}>
                {displayFaces.map((face: Face) => {
                  if (!face) return null; // Prevenção de quebras no carrossel de LED
                  const config = getStatusConfig(face.status);
                  const isSelected = selectedFace?.id === face.id;
                  
                  return (
                    <div 
                      key={face.id}
                      onClick={() => setSelectedFace(face)}
                      className={`
                        group relative cursor-pointer transition-all duration-300
                        ${isLed ? 'border-[4px] border-slate-900 bg-black' : 'border-[6px] border-slate-800 bg-slate-100'}
                        rounded-sm overflow-hidden
                        ${faceSizeClass}
                        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-4 scale-[1.02] z-20' : 'hover:scale-[1.01] z-10'}
                        ${isLed ? 'shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}
                      `}
                    >
                      {/* Conteúdo da Face (Cor base de status) */}
                      <div className={`absolute inset-0 ${config.color} ${isLed ? 'opacity-20' : 'opacity-10'}`}></div>
                      
                      {/* Grid sutil para LED */}
                      {isLed && (
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isLed ? 'text-slate-500' : 'text-slate-400'}`}>Face {face.id}</span>
                        <h3 className={`font-bold leading-tight mb-3 ${isLed ? 'text-white' : 'text-slate-800'}`}>{face.name}</h3>
                        
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.light} ${config.text} border ${config.border} ${isLed ? 'shadow-[0_0_15px_currentColor]' : ''}`}>
                          <div className={`w-2 h-2 rounded-full ${config.color} ${isLed ? 'animate-pulse' : ''}`}></div>
                          {config.label}
                        </div>
                      </div>

                      {/* Overlay de Hover */}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-20"></div>
                    </div>
                  );
                })}
              </div>

              {/* --- ESTRUTURA INFERIOR DE SUSTENTAÇÃO --- */}
              {isFrontlight && (
                <>
                  <div className="w-12 h-40 bg-gradient-to-b from-slate-700 to-slate-900 shadow-inner"></div>
                  <div className="w-40 h-3 bg-slate-900 rounded-full mt-[-2px]"></div>
                </>
              )}

              {isOutdoor && (
                <div className="flex gap-[280px] w-full justify-center">
                  <div className="w-6 h-40 bg-[#4a3f35] shadow-inner border-r border-[#3a3129]"></div>
                  <div className="w-6 h-40 bg-[#4a3f35] shadow-inner border-r border-[#3a3129]"></div>
                </div>
              )}

              {isLed && (
                <>
                  <div className="w-20 h-40 bg-gradient-to-b from-slate-800 to-black shadow-inner clip-base"></div>
                  <div className="w-48 h-4 bg-black rounded-full mt-[-2px] shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                </>
              )}

            </div>

            {/* --- CONTROLES DO CARROSSEL (SOMENTE LED) --- */}
            {isLed && panelData.faces.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4 bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveLedFaceIndex(prev => prev === 0 ? panelData.faces.length - 1 : prev - 1); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2">
                  {panelData.faces.map((f: Face, idx: number) => (
                    <button 
                      key={f.id} 
                      onClick={(e) => { e.stopPropagation(); setActiveLedFaceIndex(idx); }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeLedFaceIndex ? 'bg-blue-500 w-8 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-600 w-2.5 hover:bg-slate-400'}`}
                      title={f.name}
                    />
                  ))}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveLedFaceIndex(prev => prev === panelData.faces.length - 1 ? 0 : prev + 1); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

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

      {/* Estilos Auxiliares */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-base { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }
      `}} />
    </div>
  );
}