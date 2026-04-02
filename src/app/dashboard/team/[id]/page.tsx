"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Mail, 
  ArrowLeft,
  DollarSign,
  Monitor,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";

// Tipagem baseada no teu novo ExecutivePerformanceDTO
interface PerformanceData {
  executiveId: number;
  name: string;
  email: string;
  role: string;
  totalMrr: number;
  activeCampaignsCount: number;
  campaigns: Array<{
    id: number;
    customerName: string;
    faceName: string;
    panelAddress: string;
    startDate: string; // Vem como string no JSON (ISO date)
    endDate: string;
    monthlyValue: number;
    status: string;
  }>;
}

export default function ExecutiveProfilePage() {
  const { id } = useParams(); // Pega o ID da URL
  const router = useRouter();
  
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper para formatar moeda (R$)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Helper para formatar datas (DD/MM/AAAA)
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    if (id) {
      fetchPerformance();
    }
  }, [id]);

  const fetchPerformance = async () => {
    try {
      // 🚀 Chama o teu novo endpoint Java seguro: GET /api/users/{id}/performance
      const response = await api.get(`/api/users/${id}/performance`);
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar performance:", error);
      alert("Erro ao buscar dados do executivo.");
      router.push("/dashboard/company"); // Volta para a equipe se der erro
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'RESERVED':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      default: // CANCELED, etc
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO COM BOTÃO VOLTAR */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <button 
              onClick={() => router.push("/dashboard/company")}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Voltar para Equipe
            </button>
            
            {loading ? (
              <div className="w-64 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  Perfil de {data?.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
                  <Mail size={14} className="text-slate-400" />
                  {data?.email}
                  <span className="text-slate-300">|</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    data?.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    data?.role === 'COMERCIAL' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {data?.role}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !data ? (
          <div className="bg-white border p-16 rounded-2xl text-center">Nenhum dado encontrado.</div>
        ) : (
          <>
            {/* CARDS DE RESUMO PERFORMANCE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* Card 1: MRR Ativo do Executivo */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                  <DollarSign size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">MRR (Faturamento Ativo)</p>
                  <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.totalMrr)}</h3>
                  <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> Produção Mensal Atual
                  </p>
                </div>
              </div>

              {/* Card 2: Contagem Campanhas Ativas */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Campanhas Ativas / Reservadas</p>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {data.activeCampaignsCount} <span className="text-lg text-slate-400 font-medium">campanhas</span>
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Gerando receita este mês.</p>
                </div>
              </div>

              {/* Card 3: Valor Médio por Campanha (Bónus) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                  <Monitor size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ticket Médio Mensal</p>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {data.activeCampaignsCount > 0 
                      ? formatCurrency(data.totalMrr / data.activeCampaignsCount) 
                      : "R$ 0,00"}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Valor médio por outdoor vendido.</p>
                </div>
              </div>
            </div>

            {/* LISTA DE CAMPANHAS DELE */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 leading-none">
                <CalendarDays className="text-slate-400" size={18}/>
                Histórico de Vendas (Campanhas)
              </h2>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
              {data.campaigns.length === 0 ? (
                <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
                  <Briefcase size={40} className="text-slate-300" />
                  Este executivo ainda não possui campanhas criadas.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente / Face</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Período (Vigência)</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Mensal</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.campaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-slate-800 line-clamp-1">{camp.customerName}</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1 group">
                                <Monitor size={12} className="text-slate-400" /> {camp.faceName} 
                                <span className="text-slate-300">|</span> 
                                <span className="line-clamp-1 flex items-center gap-1">
                                    <MapPin size={12} className="text-slate-400"/> {camp.panelAddress}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            <div className="flex flex-col gap-0.5 font-medium">
                                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500"/> {formatDate(camp.startDate)}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {formatDate(camp.endDate)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-slate-800">
                            {formatCurrency(camp.monthlyValue)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(camp.status)}`}>
                              {camp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}