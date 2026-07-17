"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import Link from "next/link";
import {
  TrendingUp, DollarSign, CreditCard, AlertTriangle, ArrowDownRight, 
  Download, Receipt, Calendar as CalendarIcon, LayoutGrid, AlertCircle, X, 
  MapPin, ExternalLink
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar
} from "recharts";

// --- HELPERS VISUAIS ---
function getOccupancyColor(pct: number) {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 55) return "bg-amber-400";
  return "bg-rose-500";
}

function getOccupancyTextColor(pct: number) {
  if (pct >= 75) return "text-emerald-600";
  if (pct >= 55) return "text-amber-600";
  return "text-rose-600";
}

function getUrgencyStyle(urgency: string) {
  switch (urgency) {
    case "urgent": return "bg-rose-50 text-rose-600 border-rose-100";
    case "soon": return "bg-amber-50 text-amber-600 border-amber-100";
    default: return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }
}

function formatShortName(fullName: string) {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  if (parts.length > 1) return `${parts[0]} ${parts[1]}`;
  return parts[0];
}

export default function FinanceDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Estado que guardará o "pacotão" de dados reais vindo do Java
  const [financeData, setFinanceData] = useState<any>(null);
  const [showExpiringModal, setShowExpiringModal] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1. Validação de Segurança de Nível de Usuário
        const meResp = await api.get("/api/users/me");
        const role = meResp.data.role;
        
        if (role !== "ADMIN" && role !== "FINANCEIRO") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        // 2. Chamada para a API real recalculada pelo FinanceService
        const dashResp = await api.get("/api/finance/dashboard");
        
        // Formata os nomes do ranking para caberem perfeitamente no gráfico de barras
        const formattedRanking = (dashResp.data.ranking || []).map((r: any) => ({
          ...r,
          shortName: formatShortName(r.name)
        }));
        
        setFinanceData({ ...dashResp.data, ranking: formattedRanking });

      } catch (error: any) {
        console.error("Erro ao carregar painel financeiro", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAccessDenied(true);
        } else {
          alert("Erro no Backend Financeiro! Certifica-te de que aplicaste a anotação @Service e mapeaste os novos DTOs.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
    
  const formatDateBR = (isoDate: string) => {
    if(!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // --- TELA DE ACESSO NEGADO ---
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Acesso Restrito</h2>
          <p className="text-slate-500 mb-8">Esta área contém dados financeiros confidenciais da sua empresa.</p>
          <button 
            onClick={() => router.push("/dashboard")} 
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  // --- TELA DE SPINNER LOADING ---
  if (loading || !financeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const occupancyData = financeData.occupancyByCity || [];
  const revenueData = financeData.revenueEvolution || [];
  const delinquentClients = financeData.delinquencies || [];

  // Cálculos dinâmicos com base no DTO de Ocupação por Cidade do Java
  const totalPaineis = occupancyData.reduce((s: number, p: any) => s + p.total, 0);
  const paineisAtivos = occupancyData.reduce((s: number, p: any) => s + p.ativos, 0);
  const ocupacaoGeral = totalPaineis > 0 ? Math.round((paineisAtivos / totalPaineis) * 100) : 0;
  
  // Total da soma dos boletos devidos
  const totalInadimplencia = delinquentClients.reduce((s: number, c: any) => s + c.valor, 0);
  
  // Descobre a maior barra do pipeline comercial para desenhar o gráfico proporcional
  const maxPipeline = financeData.pipeline && financeData.pipeline.length > 0 
    ? Math.max(...financeData.pipeline.map((d: any) => d.count), 1) 
    : 1;

  // Extrai os 3 primeiros contratos prestes a vencer para o painel de alerta rápido
  const topExpiring = financeData.expiringContracts ? financeData.expiringContracts.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* CABEÇALHO DA TELA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Visão Financeira</h1>
            <p className="text-slate-500 mt-1">Acompanhe faturamento, ocupação por praça, funil de propostas e equipe.</p>
          </div>
          
          {/* 🚀 Adicionámos uma div para agrupar os botões */}
          <div className="flex gap-3">
            <Link 
              href="/dashboard/invoices" 
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-all"
            >
              <Receipt size={18} /> Contas a Receber
            </Link>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        {/* METRICAS KPIs — Grid com 6 Blocos Gerenciais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          
          {/* CARD 1: MRR REAL */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><DollarSign size={22} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">MRR Atual (Ativo)</p>
              <h3 className="text-2xl font-black text-slate-800">{formatCurrency(financeData.currentMrr)}</h3>
            </div>
          </div>

          {/* CARD 2: ARR PREVISTO */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><TrendingUp size={22} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Previsão Anual (ARR)</p>
              <h3 className="text-2xl font-black text-slate-800">{formatCurrency(financeData.annualArr)}</h3>
            </div>
          </div>

          {/* CARD 3: TICKET MÉDIO REAL */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><CreditCard size={22} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ticket Médio</p>
              <h3 className="text-2xl font-black text-slate-800">{formatCurrency(financeData.averageTicket)}</h3>
            </div>
          </div>

          {/* CARD 4: OCUPAÇÃO BASEADA NAS CIDADES DO JAVA */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center"><LayoutGrid size={22} /></div>
              <span className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{ocupacaoGeral}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ocupação Total</p>
              <h3 className="text-2xl font-black text-slate-800">{paineisAtivos} <span className="text-base text-slate-400 font-medium">/ {totalPaineis}</span></h3>
            </div>
          </div>

          {/* CARD 5: CONTRATOS EXPIRANDO */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><CalendarIcon size={22} /></div>
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Atenção</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">A Vencer (30d)</p>
              <h3 className="text-2xl font-black text-slate-800">{financeData.expiringContracts?.length || 0} <span className="text-base text-slate-400 font-medium">campanhas</span></h3>
            </div>
          </div>

          {/* CARD 6: INADIMPLÊNCIA REAL */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><AlertCircle size={22} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Inadimplência</p>
              <h3 className="text-2xl font-black text-rose-600">{formatCurrency(totalInadimplencia)}</h3>
            </div>
          </div>
        </div>

        {/* SEÇÃO DO MEIO: Gráfico de Evolução de MRR + Ranking de Equipe */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* GRÁFICO DINÂMICO DE REVENUE */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Evolução do Faturamento Mensal (MRR)</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                  <Tooltip formatter={(value) => typeof value === "number" ? formatCurrency(value) : ""} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="projetado" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorMrr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RANKING DE VENDEDORES (REAL DO BANCO DE DADOS) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Ranking Comercial</h3>
            <p className="text-sm text-slate-500 mb-6">Volume total ativo fechado por executivo.</p>
            <div className="h-[260px] w-full">
              {financeData.ranking?.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Nenhuma venda registrada na empresa.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeData.ranking} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="shortName" type="category" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} width={100} />
                    <Tooltip formatter={(value) => typeof value === "number" ? formatCurrency(value) : ""} cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="sales" fill="#10b981" radius={[0, 8, 8, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* SEÇÃO INFERIOR: Pipeline + Alertas de Vencimento + Ocupação por Praça Real */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FUNIL / PIPELINE DE CONTRATOS */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">Funil Comercial (Contratos)</h3>
            <div className="flex flex-col gap-3 mt-6">
              {financeData.pipeline?.map((item: any) => (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 w-20 text-right shrink-0">{item.stage}</span>
                  <div className="flex-1 h-7 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                    <div 
                      className="h-full rounded-lg flex items-center px-3 text-xs font-black text-white transition-all duration-1000" 
                      style={{ 
                        width: `${(item.count / maxPipeline) * 100}%`, 
                        backgroundColor: item.color,
                        minWidth: item.count > 0 ? '1.5rem' : '0'
                      }}
                    >
                      {item.count > 0 ? item.count : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LISTA RÁPIDA: ALERTA DE CONTRATOS EXPIRANDO */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Contratos a Vencer</h3>
              <p className="text-sm text-slate-500 mb-6">Expirando nos próximos 30 dias.</p>
              <div className="flex flex-col gap-3">
                {topExpiring.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8 italic">Tudo seguro. Sem contratos vencendo este mês.</p>
                ) : (
                  topExpiring.map((c: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-sm font-bold text-slate-700 truncate">{c.customerName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.panelsCount} face • <span className="font-semibold text-slate-600">{formatCurrency(c.monthlyValue)}</span></p>
                      </div>
                      <span className={`text-xs font-black px-2 py-1 border rounded-xl shrink-0 ${getUrgencyStyle(c.urgency)}`}>
                        {c.remainingDays} dias
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {financeData.expiringContracts?.length > 3 && (
              <button 
                onClick={() => setShowExpiringModal(true)}
                className="w-full mt-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-bold rounded-xl transition-colors border border-blue-100"
              >
                Ver todos os {financeData.expiringContracts.length} contratos
              </button>
            )}
          </div>

          {/* NOVO: OCUPAÇÃO REAL POR PRAÇA (LENDO AS CIDADES PROVENIENTES DO JAVA) */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">Ocupação por Praça</h3>
            <p className="text-sm text-slate-500 mb-6">Percentual de ocupação regional.</p>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[220px] pr-1">
              {occupancyData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8 italic">Nenhum painel cadastrado.</p>
              ) : (
                occupancyData.map((item: any) => (
                  <div key={item.praca} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {item.praca}</span>
                      <span className={getOccupancyTextColor(item.ocupacao)}>{item.ocupacao}% ({item.ativos}/{item.total} faces)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${getOccupancyColor(item.ocupacao)}`} style={{ width: `${item.ocupacao}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MODAL GLOBAL: LISTAGEM COMPLETA DOS CONTRATOS EXPIRANDO */}
        {showExpiringModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowExpiringModal(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="text-rose-500" size={24} /> Alertas de Expiração
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Lista de veiculações comerciais terminando nos próximos 30 dias.</p>
                </div>
                <button onClick={() => setShowExpiringModal(false)} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {financeData.expiringContracts?.map((c: any) => (
                  <div key={c.campaignId} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getUrgencyStyle(c.urgency)}`}>
                          Restam {c.remainingDays} dias
                        </span>
                        <span className="text-xs font-bold text-slate-400">Término: {formatDateBR(c.endDate)}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">{c.customerName}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin size={14} className="text-slate-400" /> {c.panelAddress}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="md:text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investimento</p>
                        <p className="text-lg font-black text-slate-800">{formatCurrency(c.monthlyValue)}<span className="text-xs font-normal text-slate-400">/mês</span></p>
                      </div>
                      <Link 
                        href={`/dashboard/panel/${c.panelId}`} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Acessar Inventário <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}