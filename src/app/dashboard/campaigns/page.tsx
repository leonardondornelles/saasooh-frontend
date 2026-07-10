"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { 
  CalendarRange, Plus, Monitor, X, ExternalLink, 
  Filter, CheckCircle2, AlertCircle, Ban, Search
} from "lucide-react";
import Link from "next/link";

export default function CampaignHubPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [panels, setPanels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 NOVOS FILTROS: Status e Pesquisa de Cliente
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados do Modal de Criação Global
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState("");
  const [availableFaces, setAvailableFaces] = useState<any[]>([]);
  const [form, setCampaignForm] = useState({
    customerId: "", faceId: "", startDate: "", endDate: "", monthlyValue: ""
  });

  // Estados do Modal de Evolução de Status
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({
    status: "", startDate: "", endDate: "", observations: ""
  });

  useEffect(() => {
    fetchHubData();
  }, []);

  useEffect(() => {
    const fetchFaces = async () => {
      if (selectedPanelId) {
        try {
          const response = await api.get(`/api/panels/${selectedPanelId}`);
          setAvailableFaces(response.data.faces || []);
        } catch (error) {
          setAvailableFaces([]);
        }
      } else {
        setAvailableFaces([]);
      }
    };
    fetchFaces();
  }, [selectedPanelId]);

  const fetchHubData = async () => {
    try {
      const [campResp, custResp, panelResp] = await Promise.all([
        api.get("/api/campaigns"),
        api.get("/api/customers"),
        api.get("/api/panels")
      ]);
      setCampaigns(campResp.data);
      setCustomers(custResp.data);
      setPanels(panelResp.data);
    } catch (error) {
      console.error("Erro ao carregar dados do Hub:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(form.customerId),
        faceId: Number(form.faceId),
        startDate: form.startDate ? form.startDate : null,
        endDate: form.endDate ? form.endDate : null,
        monthlyValue: Number(form.monthlyValue)
      };
      
      await api.post("/api/campaigns", payload);
      setShowCreateModal(false);
      setCampaignForm({ customerId: "", faceId: "", startDate: "", endDate: "", monthlyValue: "" });
      setSelectedPanelId("");
      fetchHubData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao cadastrar campanha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusModal = (campaign: any) => {
    setSelectedCampaign(campaign);
    setStatusForm({
      status: campaign.status === "APPROVED" ? "RESERVED" : campaign.status, // Fallback preventivo
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
      observations: campaign.observations || ""
    });
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        status: statusForm.status,
        startDate: statusForm.startDate ? statusForm.startDate : null,
        endDate: statusForm.endDate ? statusForm.endDate : null,
        observations: statusForm.observations
      };

      const response = await api.put(`/api/campaigns/${selectedCampaign.id}/status`, payload);
      setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? response.data : c));
      setShowStatusModal(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao atualizar status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "RESERVED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "PROPOSAL": return "bg-slate-100 text-slate-600 border-slate-200";
      case "NEGOTIATION": return "bg-purple-50 text-purple-700 border-purple-200";
      case "COMPLETED": return "bg-slate-100 text-slate-400 border-slate-200";
      case "LOST": return "bg-rose-50 text-rose-700 border-rose-200";
      case "CANCELLED": return "bg-rose-100 text-rose-800 border-rose-300";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const renderDate = (dateString: string | null) => {
    if (!dateString) return "A definir";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // 🚀 LÓGICA DE FILTRO COMBINADA: Status + Nome do Cliente (Case Insensitive)
  const displayedCampaigns = campaigns.filter(c => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesSearch = c.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const requiresDates = ["RESERVED", "ACTIVE"].includes(statusForm.status);
  const requiresObservation = statusForm.status === "LOST";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO E ÁREA DE FILTROS */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <CalendarRange className="text-blue-600" /> Hub de Campanhas
            </h1>
            <p className="text-slate-500 mt-1">Controle o funil comercial, agendamentos globais e veiculações ativas.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* 🚀 NOVA: Barra de Pesquisa por Cliente */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Filtrar por cliente..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filtro de Status Sem a Opção "APPROVED" */}
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-9 pr-8 py-3 bg-white border border-slate-200/60 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm appearance-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todas as Fases</option>
                <option value="PROPOSAL">Apenas Propostas</option>
                <option value="NEGOTIATION">Em Negociação</option>
                <option value="RESERVED">Reservadas (Futuro)</option>
                <option value="ACTIVE">Ativas (Rodando)</option>
                <option value="COMPLETED">Concluídas</option>
                <option value="LOST">Perdidas</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-600/10 active:scale-95 shrink-0"
            >
              <Plus size={18} /> Nova Campanha
            </button>
          </div>
        </div>

        {/* TABELA CENTRAL */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
          {displayedCampaigns.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
              <Ban size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Nenhuma campanha encontrada com estes filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente / Marca</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Localização / Face</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Período</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Investimento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estágio / Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-sm">
                            {camp.customerName?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <span className="font-bold text-slate-800">{camp.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 flex items-center gap-1"><Monitor size={14}/> {camp.faceName}</span>
                          <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">{camp.panelAddress}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {renderDate(camp.startDate)} <span className="text-slate-400 mx-1">até</span> {renderDate(camp.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(camp.monthlyValue || 0)}
                      </td>
                      
                      {/* STATUS CLICÁVEL */}
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => camp.status !== "COMPLETED" && openStatusModal(camp)}
                          disabled={camp.status === "COMPLETED"}
                          className={`px-3 py-1.5 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all 
                            ${getStatusColorClass(camp.status)} 
                            ${camp.status === "COMPLETED" ? 'cursor-not-allowed opacity-60' : 'hover:scale-105 hover:shadow-sm'}`}
                        >
                          {camp.status} {camp.status !== "COMPLETED" && " ▾"}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/panel/${camp.panelId}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                          Ver Painel <ExternalLink size={12}/>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: CRIAÇÃO DE CAMPANHA */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
            <form onSubmit={handleCreateCampaign} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-in zoom-in-95 duration-200 p-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">Nova Campanha</h2>
                <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cliente</label>
                <select required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.customerId} onChange={e => setCampaignForm({...form, customerId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.fantasyName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Escolha o Painel</label>
                  <select required className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={selectedPanelId} onChange={e => setSelectedPanelId(e.target.value)}>
                    <option value="">Selecione...</option>
                    {panels.map(p => <option key={p.id} value={p.id}>Painel #{p.id} - {p.city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Face Disponível</label>
                  <select required disabled={!selectedPanelId || availableFaces.length === 0} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm disabled:opacity-50" value={form.faceId} onChange={e => setCampaignForm({...form, faceId: e.target.value})}>
                    <option value="">{!selectedPanelId ? "Selecione o painel..." : availableFaces.length === 0 ? "A carregar..." : "Selecione a face..."}</option>
                    {availableFaces.map(f => <option key={f.id} value={f.id}>{f.name} ({f.format})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Início <span className="text-[10px] font-normal lowercase">(Opcional)</span></label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.startDate} onChange={e => setCampaignForm({...form, startDate: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Término <span className="text-[10px] font-normal lowercase">(Opcional)</span></label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.endDate} onChange={e => setCampaignForm({...form, endDate: e.target.value})}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Mensal (R$)</label>
                <input required type="number" placeholder="5000.00" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.monthlyValue} onChange={e => setCampaignForm({...form, monthlyValue: e.target.value})}/>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-slate-100 rounded-xl text-sm font-bold">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm disabled:opacity-50">{isSubmitting ? "Salvando..." : "Criar Contrato"}</button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            🚀 MODAL: EVOLUÇÃO DE STATUS (SEM APPROVED)
            ========================================= */}
        {showStatusModal && selectedCampaign && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowStatusModal(false)}></div>
            <form onSubmit={handleUpdateStatus} className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95 duration-200 p-8 space-y-5">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Evolução da Campanha</h2>
                  <p className="text-sm text-slate-500">{selectedCampaign.customerName}</p>
                </div>
                <button type="button" onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>

              {/* 🚀 LÓGICA CONDICIONAL DE BOTÕES */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Novo Estágio</label>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Se estiver no início, mostra o funil de vendas normal */}
                  {(selectedCampaign.status === "PROPOSAL" || selectedCampaign.status === "NEGOTIATION") && (
                    <>
                      {["PROPOSAL", "NEGOTIATION", "RESERVED", "LOST"].map((s) => (
                        <button
                          key={s} type="button" onClick={() => setStatusForm({...statusForm, status: s})}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                            ${statusForm.status === s ? getStatusColorClass(s) + ' ring-2 ring-offset-1 ring-slate-200 font-black' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          {s === "RESERVED" ? "RESERVAR / WIN" : s}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Se já estiver fechada (RESERVED ou ACTIVE), só permite Cancelar (ou Concluir manualmente) */}
                  {(selectedCampaign.status === "RESERVED" || selectedCampaign.status === "ACTIVE") && (
                    <>
                      <div className="col-span-2 p-3 bg-slate-50 border rounded-xl mb-2">
                        <p className="text-xs text-slate-500 text-center">Esta campanha já está fechada e em operação.</p>
                      </div>
                      <button
                        type="button" onClick={() => setStatusForm({...statusForm, status: "CANCELLED"})}
                        className={`col-span-2 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                          ${statusForm.status === "CANCELLED" ? getStatusColorClass("CANCELLED") + ' ring-2 ring-offset-1 ring-slate-200 font-black' : 'bg-white border-rose-200 text-rose-500 hover:bg-rose-50'}`}
                      >
                        CANCELAR CONTRATO ATIVO
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Exige datas se mover para RESERVED */}
              {statusForm.status === "RESERVED" && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                  <div className="flex items-start gap-2 text-blue-700">
                    <CheckCircle2 size={16} className="mt-0.5" />
                    <p className="text-xs font-semibold">Defina o período do contrato. Se iniciar hoje ou antes, o sistema ativará como ACTIVE automaticamente.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">Data de Início</label>
                      <input required type="date" className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:border-blue-400" 
                        value={statusForm.startDate} onChange={e => setStatusForm({...statusForm, startDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">Data de Término</label>
                      <input required type="date" className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:border-blue-400" 
                        value={statusForm.endDate} onChange={e => setStatusForm({...statusForm, endDate: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {/* Exige motivo se for LOST ou CANCELLED */}
              {(statusForm.status === "LOST" || statusForm.status === "CANCELLED") && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 space-y-3">
                  <div className="flex items-start gap-2 text-rose-700">
                    <AlertCircle size={16} className="mt-0.5" />
                    <p className="text-xs font-semibold">
                      {statusForm.status === "LOST" ? "Justifique o motivo da perda da venda." : "Justifique o motivo do cancelamento do contrato."}
                    </p>
                  </div>
                  <textarea 
                    required 
                    placeholder={statusForm.status === "LOST" ? "Ex: Cliente achou caro..." : "Ex: Cliente pediu rescisão de contrato..."}
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-sm outline-none focus:border-rose-400 min-h-[80px]"
                    value={statusForm.observations} onChange={e => setStatusForm({...statusForm, observations: e.target.value})}
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button type="submit" disabled={isSubmitting || statusForm.status === selectedCampaign.status} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "A atualizar..." : "Confirmar Mudança"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}