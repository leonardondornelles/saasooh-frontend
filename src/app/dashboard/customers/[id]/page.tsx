"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { 
  Building2, Phone, Mail, FileText, ArrowLeft, 
  DollarSign, BarChart3, Layers, Activity, Ban, Monitor, Calendar
} from "lucide-react";
import Link from "next/link";

// Dicionário de tradução idêntico ao do Hub para manter a consistência
const statusMap: Record<string, string> = {
  PROPOSAL: "Proposta",
  NEGOTIATION: "Em Negociação",
  APPROVED: "Aprovado",
  RESERVED: "Reservado",
  ACTIVE: "Ativo",
  COMPLETED: "Concluído",
  LOST: "Perdido",
  CANCELLED: "Cancelado"
};

export default function CustomerProfilePage() {
  const { id } = useParams(); // Captura o ID do cliente diretamente da URL
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchCustomerProfile();
    }
  }, [id]);

  const fetchCustomerProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/customers/${id}/profile`);
      setProfile(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar perfil do cliente:", err);
      setError("Não foi possível carregar o dossiê do cliente.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const renderDate = (dateString: string | null) => {
    if (!dateString) return "A definir";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="min-h-screen p-10"><div className="bg-rose-50 text-rose-600 p-4 rounded-xl font-bold text-center">{error}</div></div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BOTÃO VOLTAR E CABEÇALHO PRINCIPAL */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white w-fit px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm"
          >
            <ArrowLeft size={14} /> Voltar para Clientes
          </button>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xl shadow-sm">
                {profile.fantasyName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">{profile.fantasyName}</h1>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Building2 size={14}/> {profile.corporateName} • CNPJ: {profile.cnpj}
                </p>
              </div>
            </div>
            
            {/* CONTATOS RÁPIDOS */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-semibold text-slate-600 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"><Mail size={16} className="text-slate-400"/> {profile.email}</div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"><Phone size={16} className="text-slate-400"/> {profile.telephone}</div>
            </div>
          </div>
        </div>

        {/* CARDS DE RESUMO DO CRM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><DollarSign size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Arrecadado</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(profile.totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><BarChart3 size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket Médio</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(profile.averageTicket)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-inner"><Layers size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Contratos</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{profile.totalCampaigns} contratos</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><Activity size={24}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Veiculações Ativas</p>
              <p className="text-xl font-black text-indigo-600 mt-0.5">{profile.activeCampaignsCount} rodando</p>
            </div>
          </div>
        </div>

        {/* TABELA DE HISTÓRICO COM CONTEXTO RICO */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-blue-600"/> Histórico de Campanhas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Linha do tempo comercial completa e estágios de faturamento deste cliente.</p>
          </div>

          {profile.campaignHistory.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
              <Ban size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Este cliente ainda não possui nenhuma campanha cadastrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Contrato</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Painel / Ponto</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><Calendar size={14} className="inline mr-1"/>Período</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Faturamento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estágio Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.campaignHistory.map((camp: any) => (
                    <tr key={camp.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">#{camp.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 flex items-center gap-1"><Monitor size={14} className="text-slate-400"/> {camp.faceName}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{camp.panelAddress} {camp.panelCity ? `• ${camp.panelCity}` : ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {renderDate(camp.startDate)} <span className="text-slate-400 mx-0.5">até</span> {renderDate(camp.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {formatCurrency(camp.monthlyValue)} <span className="text-[10px] font-normal text-slate-400">/mês</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 border rounded-xl text-[10px] font-bold uppercase tracking-wider ${getStatusColorClass(camp.status)}`}>
                          {statusMap[camp.status] || camp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* OBSERVAÇÕES DO CLIENTE */}
        {profile.observation && (
          <div className="bg-amber-50/40 border border-amber-200/70 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Notas e Observações Comerciais</h3>
            <p className="text-sm text-amber-900 font-medium whitespace-pre-wrap">{profile.observation}</p>
          </div>
        )}

      </div>
    </div>
  );
}