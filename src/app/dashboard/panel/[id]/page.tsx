"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/services/api";
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
  Info,
  Plus
} from "lucide-react";

// --- Tipagens ---
type FaceStatus = "LIVRE" | "RESERVADO" | "OCUPADO";

interface Face {
  id: number;
  name: string;
  format: string;
  status: FaceStatus;
  lighting: boolean;
  campaigns?: {
    customerName: string;
    startDate: string;
    endDate: string;
    daysLeft: number;
    totalDays: number;
    contractValue: string;
  }[];
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

  const [customers, setCustomers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    customerId: "",
    startDate: "",
    endDate: "",
    monthlyValue: ""
  });

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const parseDateBR = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const panelResponse = await api.get(`/api/panels/${panelId}`);
        setPanelData(panelResponse.data);

        const customerResponse = await api.get("/api/customers");
        setCustomers(customerResponse.data);
      } catch (err) {
        console.error("Erro ao carregar os dados:", err);
        setError("Não foi possível carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [panelId]);

  const handleCreateCampaign = async () => {
    if (!campaignForm.customerId || !campaignForm.startDate || !campaignForm.endDate || !campaignForm.monthlyValue){
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(campaignForm.customerId),
        faceId: selectedFace?.id,
        startDate: campaignForm.startDate,
        endDate: campaignForm.endDate,
        monthlyValue: Number(campaignForm.monthlyValue),
      };

      await api.post("/api/campaigns", payload);
      alert("Campanha criada com sucesso");

      setIsCreatingCampaign(false);
      setCampaignForm({ customerId: "", startDate: "", endDate: "", monthlyValue: ""});
      window.location.reload();

    } catch (error:any) {
      console.error("Erro ao criar campanha:", error);
      
      let errorMessage = "Erro ao tentar cadastrar a campanha. Verifique conflito de datas";

      if(error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data; 
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message; 
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error; 
        }
      }

    } finally {
      setIsSubmitting(false);
    }
  };

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
  const activeCampaign = selectedFace?.campaigns?.[0];
  const isFaceBusy = (selectedFace?.status === "OCUPADO" || selectedFace?.status === "RESERVADO") && activeCampaign;

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
                  onClick={() => { setSelectedFace(null); setIsCreatingCampaign(false); }} 
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
            <div className="flex-1 overflow-y-auto p-8 relative bg-slate-50/30">
              
              {isCreatingCampaign ? (
                // 🚀 MODO 1: FORMULÁRIO DE NOVA CAMPANHA
                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setIsCreatingCampaign(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-sm border border-slate-100">
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-lg font-bold text-slate-800">Agendar Nova Campanha</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cliente</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                        value={campaignForm.customerId}
                        onChange={(e) => setCampaignForm({...campaignForm, customerId: e.target.value})}
                      >
                        <option value="">Selecione o cliente...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.fantasyName} - {c.cnpj}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Início</label>
                        <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                          value={campaignForm.startDate} onChange={(e) => setCampaignForm({...campaignForm, startDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Término</label>
                        <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                          value={campaignForm.endDate} onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Mensal (R$)</label>
                      <input type="number" placeholder="Ex: 5000.00" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                        value={campaignForm.monthlyValue} onChange={(e) => setCampaignForm({...campaignForm, monthlyValue: e.target.value})} />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 mt-6 bg-slate-50/80 -mx-8 -mb-8 p-8">
                    <button 
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                      onClick={handleCreateCampaign}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processando..." : "Confirmar Agendamento"}
                    </button>
                  </div>
                </div>
                
              ) : (
                // 🚀 MODO 2: TIMELINE DE CAMPANHAS E AÇÕES
                <div className="flex flex-col h-full animate-in fade-in duration-300">
                  
                  {/* Botões de Ação Rápidos */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <button 
                      onClick={() => setIsCreatingCampaign(true)}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
                    >
                      <Plus size={16} /> Nova Reserva 
                    </button>
                    <button 
                      onClick={() => setShowCalendarModal(true)}
                      className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Calendar size={16} /> Calendário
                    </button>
                  </div>

                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Clock size={14} /> Linha do Tempo da Face
                  </h3>

                  {(!selectedFace.campaigns || selectedFace.campaigns.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner border border-emerald-100">🌿</div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">Face Totalmente Livre</h4>
                      <p className="text-slate-500 text-sm max-w-[250px]">Nenhuma campanha ou reserva atrelada a este espaço no momento.</p>
                    </div>
                  ) : (
                    // 🚀 A TIMELINE DE CAMPANHAS
                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-10">
                      
                      {selectedFace.campaigns.map((camp, index) => {
                        // Lógica simples para decidir o status visual (No futuro o Java manda isso direto)
                        const isCurrent = camp.daysLeft > 0 && camp.daysLeft <= camp.totalDays;
                        const isFuture = camp.daysLeft > camp.totalDays; // Exemplo didático
                        
                        return (
                          <div key={index} className="relative pl-6 group">
                            {/* Bolinha da Timeline */}
                            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors ${
                              isCurrent ? 'bg-rose-500' : isFuture ? 'bg-blue-500' : 'bg-slate-400'
                            }`}></div>
                            
                            {/* Card da Campanha na Timeline */}
                            <div className={`bg-white border rounded-2xl p-5 transition-shadow ${
                              isCurrent ? 'border-rose-200 shadow-md shadow-rose-100/50' : 'border-slate-200 shadow-sm hover:shadow-md'
                            }`}>
                              
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                                    {isCurrent ? 'Exibição Atual' : 'Reserva Futura'}
                                  </p>
                                  <h4 className="font-bold text-slate-800 text-base leading-tight">{camp.customerName}</h4>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-emerald-600">{camp.contractValue}</p>
                                  <p className="text-[10px] text-slate-400 uppercase">/ mês</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400"/> {camp.startDate}</div>
                                <span className="text-slate-300">até</span>
                                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400"/> {camp.endDate}</div>
                              </div>

                              {isCurrent && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Progresso</p>
                                    <p className="text-xs font-black text-rose-500">{camp.daysLeft} dias restantes</p>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className="bg-rose-500 h-full rounded-full" 
                                      style={{ width: `${(1 - (camp.daysLeft / camp.totalDays)) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {/* Bolinha final da timeline indicando futuro */}
                      <div className="absolute -left-[7px] -bottom-2 w-3 h-3 rounded-full border-2 border-slate-300 bg-white"></div>
                    </div>
                  )}
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
          onClick={() => { setSelectedFace(null); setIsCreatingCampaign(false); }}
        ></div>
      )}

      {/* Estilos Auxiliares */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-base { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }
      `}} />
      {showCalendarModal && selectedFace && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCalendarModal(false)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Calendário de Ocupação</h2>
                <p className="text-sm text-slate-500">{selectedFace.name} • {panelData.id}</p>
              </div>
              <button onClick={() => setShowCalendarModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Controles de Mês */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 font-bold border border-slate-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-bold text-slate-800 capitalize">
                  {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 font-bold border border-slate-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Grid do Calendário */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-wider py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 rounded-xl bg-slate-50/50"></div>
                ))}
                
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  
                  // Lógica: Verifica se este dia pertence a alguma campanha desta face
                  let dayColor = "bg-slate-50 border-slate-100 text-slate-700 hover:border-blue-300";
                  let campaignInfo = null;

                  if (selectedFace.campaigns) {
                    for (const camp of selectedFace.campaigns) {
                      const start = parseDateBR(camp.startDate);
                      const end = parseDateBR(camp.endDate);
                      
                      if (currentDate >= start && currentDate <= end) {
                        dayColor = "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200";
                        campaignInfo = camp;
                        break; // Se achou uma campanha, pinta e para de procurar
                      }
                    }
                  }

                  return (
                    <div 
                      key={day} 
                      className={`relative h-12 rounded-xl border flex items-center justify-center font-bold text-sm cursor-default transition-all group ${dayColor}`}
                    >
                      {day}
                      {/* Tooltip Hover para mostrar quem é o cliente no dia */}
                      {campaignInfo && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-slate-900 text-white text-[10px] py-1 px-3 rounded shadow-xl z-10">
                          {campaignInfo.customerName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Dia Livre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-rose-500 border border-rose-600"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Campanha Ativa/Reservada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}