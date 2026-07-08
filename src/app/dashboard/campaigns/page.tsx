"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { 
  CalendarRange, Plus, Monitor, Users, MapPin, 
  X, ExternalLink, DollarSign, CalendarDays
} from "lucide-react";
import Link from "next/link";

export default function CampaignHubPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [panels, setPanels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Criação Global
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState("");
  const [availableFaces, setAvailableFaces] = useState<any[]>([]);

  const [form, setCampaignForm] = useState({
    customerId: "", faceId: "", startDate: "", endDate: "", monthlyValue: ""
  });

  useEffect(() => {
    fetchHubData();
  }, []);

  // Monitoriza a seleção do painel no formulário para liberar as faces dele
  useEffect(() => {
    const fetchFaces = async () => {
      if (selectedPanelId) {
        try {
          // Busca o painel específico que contém a lista de faces
          const response = await api.get(`/api/panels/${selectedPanelId}`);
          setAvailableFaces(response.data.faces || []);
        } catch (error) {
          console.error("Erro ao buscar as faces:", error);
          setAvailableFaces([]);
        }
      } else {
        // Se o utilizador desmarcar o painel, limpamos as faces
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

  // 🚀 Altera o status direto pela Tabela!
  const handleStatusChange = async (campaignId: number, newStatus: string) => {
    try {
      await api.patch(`/api/campaigns/${campaignId}/status?status=${newStatus}`);
      // Atualiza a lista local para espelhar a mudança na hora
      setCampaigns(campaigns.map(c => c.id === campaignId ? { ...c, status: newStatus } : c));
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao atualizar status.");
    }
  };

  const handleCreateCampaign = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(form.customerId),
        faceId: Number(form.faceId),
        startDate: form.startDate,
        endDate: form.endDate,
        monthlyValue: Number(form.monthlyValue)
      };
      await api.post("/api/campaigns", payload);
      setShowModal(false);
      setCampaignForm({ customerId: "", faceId: "", startDate: "", endDate: "", monthlyValue: "" });
      setSelectedPanelId("");
      fetchHubData(); // Recarrega tudo
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao cadastrar campanha. Verifique conflitos.");
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
      case "APPROVED": return "bg-teal-50 text-teal-700 border-teal-200";
      case "COMPLETED": return "bg-slate-100 text-slate-400 border-slate-200 line-through";
      default: return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <CalendarRange className="text-blue-600" /> Hub de Campanhas
            </h1>
            <p className="text-slate-500 mt-1">Controle o funil comercial, agendamentos globais e veiculações ativas.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-600/10 active:scale-95"
          >
            <Plus size={18} /> Nova Campanha (Global)
          </button>
        </div>

        {/* TABELA CENTRAL */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="p-20 text-center text-slate-400">Nenhuma campanha cadastrada no sistema.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente / Marca</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Localização / Face</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Período</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Investimento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estágio do Pipeline</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-sm">
                            {camp.customerName.charAt(0).toUpperCase()}
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
                        {new Date(camp.startDate).toLocaleDateString('pt-BR')} - {new Date(camp.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(camp.monthlyValue)}
                      </td>
                      
                      {/* PIPELINE LIVE DROPDOWN */}
                      <td className="px-6 py-4">
                        <select 
                          value={camp.status}
                          onChange={(e) => handleStatusChange(camp.id, e.target.value)}
                          className={`px-3 py-1.5 border rounded-xl text-xs font-bold uppercase tracking-wider outline-none bg-white ${getStatusColorClass(camp.status)}`}
                        >
                          <option value="PROPOSAL">Proposal</option>
                          <option value="NEGOTIATION">Negotiation</option>
                          <option value="APPROVED">Approved</option>
                          <option value="RESERVED">Reserved</option>
                          <option value="ACTIVE">Active</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="LOST">Lost</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/panel/${camp.panelId}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                          Ir para o Painel <ExternalLink size={12}/>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL GLOBAL DE CRIAÇÃO */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <form onSubmit={handleCreateCampaign} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-in zoom-in-95 duration-200 p-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">Nova Campanha Global</h2>
                <button type="button" onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20}/></button>
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
                  <select required disabled={!selectedPanelId} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm disabled:opacity-50" value={form.faceId} onChange={e => setCampaignForm({...form, faceId: e.target.value})}>
                    <option value="">Selecione o painel primeiro...</option>
                    {availableFaces.map(f => <option key={f.id} value={f.id}>{f.name} ({f.format})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Início</label>
                  <input required type="date" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.startDate} onChange={e => setCampaignForm({...form, startDate: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Término</label>
                  <input required type="date" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.endDate} onChange={e => setCampaignForm({...form, endDate: e.target.value})}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Mensal (R$)</label>
                <input required type="number" placeholder="5000.00" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" value={form.monthlyValue} onChange={e => setCampaignForm({...form, monthlyValue: e.target.value})}/>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-100 rounded-xl text-sm font-bold">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm disabled:opacity-50">
                  {isSubmitting ? "Salvando..." : "Criar Contrato"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}