"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar as CalendarIcon,
  LayoutGrid,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- MOCKS ---
const mockRevenueData = [
  { name: "Jan", mrr: 28000, projetado: 30000 },
  { name: "Fev", mrr: 32000, projetado: 32000 },
  { name: "Mar", mrr: 35500, projetado: 34000 },
  { name: "Abr", mrr: 41000, projetado: 38000 },
  { name: "Mai", mrr: 45200, projetado: 43000 },
  { name: "Jun", mrr: null, projetado: 48000 },
];

const mockExecutiveData = [
  { name: "Leonardo", vendas: 18500 },
  { name: "Maria", vendas: 14200 },
  { name: "Carlos", vendas: 8500 },
  { name: "Ana", vendas: 4000 },
];

const mockOccupancyData = [
  { praça: "Porto Alegre", ocupacao: 87, total: 80, ativos: 70 },
  { praça: "Caxias do Sul", ocupacao: 74, total: 40, ativos: 30 },
  { praça: "Canoas", ocupacao: 61, total: 32, ativos: 20 },
  { praça: "Santa Maria", ocupacao: 48, total: 18, ativos: 9 },
  { praça: "Pelotas", ocupacao: 39, total: 12, ativos: 5 },
];

const mockPipelineData = [
  { stage: "Propostas", count: 34, color: "#2563eb" },
  { stage: "Negociação", count: 24, color: "#7c3aed" },
  { stage: "Aprovados", count: 16, color: "#0891b2" },
  { stage: "Fechados", count: 10, color: "#16a34a" },
  { stage: "Perdidos", count: 5, color: "#dc2626" },
];

const mockExpiringContracts = [
  {
    cliente: "Supermercado Verdi",
    paineis: 3,
    valor: 4200,
    diasRestantes: 3,
    urgency: "urgent",
  },
  {
    cliente: "Auto Loja Nobre",
    paineis: 1,
    valor: 1400,
    diasRestantes: 7,
    urgency: "urgent",
  },
  {
    cliente: "Farmácia Central",
    paineis: 2,
    valor: 2800,
    diasRestantes: 18,
    urgency: "soon",
  },
  {
    cliente: "Construtora Ritter",
    paineis: 4,
    valor: 5600,
    diasRestantes: 28,
    urgency: "ok",
  },
];

const mockDelinquentClients = [
  { cliente: "Loja ABC", valor: 3200, diasAtraso: 45 },
  { cliente: "Distribuidora XYZ", valor: 2800, diasAtraso: 22 },
  { cliente: "Mercado Sul", valor: 2400, diasAtraso: 15 },
];

// --- HELPERS ---
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
    case "urgent":
      return "bg-rose-50 text-rose-600";
    case "soon":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-emerald-50 text-emerald-600";
  }
}

export default function FinanceDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    api
      .get("/api/users/me")
      .then((response) => {
        const role = response.data.role;
        if (role !== "ADMIN" && role !== "FINANCEIRO") {
          setAccessDenied(true);
        }
      })
      .catch(() => setAccessDenied(true))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-slate-500 mb-8">
            Esta área contém dados financeiros sensíveis. Apenas
            administradores e equipe financeira têm acesso.
          </p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPaineis = mockOccupancyData.reduce((s, p) => s + p.total, 0);
  const paineiAtivos = mockOccupancyData.reduce((s, p) => s + p.ativos, 0);
  const ocupacaoGeral = Math.round((paineiAtivos / totalPaineis) * 100);
  const totalInadimplencia = mockDelinquentClients.reduce(
    (s, c) => s + c.valor,
    0
  );
  const maxPipeline = Math.max(...mockPipelineData.map((d) => d.count));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Visão Financeira
            </h1>
            <p className="text-slate-500 mt-1">
              Acompanhe faturamento, ocupação, pipeline e performance da equipe.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all">
            <Download size={18} /> Exportar Relatório
          </button>
        </div>

        {/* KPIs — 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

          {/* MRR */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <DollarSign size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={13} /> +12%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              MRR Atual (Ativo)
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {formatCurrency(45200)}
            </h3>
          </div>

          {/* ARR */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={22} />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Previsão Anual (ARR)
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {formatCurrency(542400)}
            </h3>
          </div>

          {/* Ticket Médio */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <CreditCard size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={13} /> +5%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Ticket Médio
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {formatCurrency(318.3)}
            </h3>
          </div>

          {/* Ocupação Geral — NOVO */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                <LayoutGrid size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                {ocupacaoGeral}%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Ocupação Total
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {paineiAtivos}{" "}
              <span className="text-base text-slate-400 font-medium">
                / {totalPaineis} painéis
              </span>
            </h3>
          </div>

          {/* Contratos a vencer */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <CalendarIcon size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                <ArrowDownRight size={13} /> Atenção
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Contratos a Vencer (30d)
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              4{" "}
              <span className="text-base text-slate-400 font-medium">
                campanhas
              </span>
            </h3>
          </div>

          {/* Inadimplência — NOVO */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                3 clientes
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Inadimplência
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {formatCurrency(totalInadimplencia)}
            </h3>
          </div>
        </div>

        {/* LINHA 2: MRR + Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* MRR Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Evolução do Faturamento (MRR)
                </h3>
                <p className="text-sm text-slate-500">
                  Comparativo do realizado vs. projetado.
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  Realizado
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  Projetado
                </div>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockRevenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? formatCurrency(value) : ""
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="projetado"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="#2563eb"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorMrr)"
                    activeDot={{ r: 8, strokeWidth: 0, fill: "#2563eb" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking de Vendedores */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Ranking de Vendas
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Performance por executivo (Top 4).
            </p>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockExecutiveData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    vertical={true}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) =>
                      `R$${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 13, fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? formatCurrency(value) : ""
                    }
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="vendas"
                    fill="#10b981"
                    radius={[0, 8, 8, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* LINHA 3: Ocupação + Pipeline + Contratos a vencer + Inadimplência */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Ocupação por Praça — NOVO */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Ocupação por Praça
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              % de painéis com campanha ativa.
            </p>
            <div className="flex flex-col gap-4">
              {mockOccupancyData.map((item) => (
                <div key={item.praça}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-slate-600 font-medium">
                      {item.praça}
                    </span>
                    <span
                      className={`text-xs font-bold ${getOccupancyTextColor(item.ocupacao)}`}
                    >
                      {item.ocupacao}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getOccupancyColor(item.ocupacao)}`}
                      style={{ width: `${item.ocupacao}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {item.ativos} ativos de {item.total}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline de Contratos — NOVO */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Pipeline de Contratos
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Funil de vendas do mês atual.
            </p>
            <div className="flex flex-col gap-3">
              {mockPipelineData.map((item) => (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-20 text-right shrink-0">
                    {item.stage}
                  </span>
                  <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center px-3 text-xs font-bold text-white"
                      style={{
                        width: `${(item.count / maxPipeline) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contratos a Vencer — EXPANDIDO */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Contratos a Vencer
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Próximas 4 semanas.
            </p>
            <div className="flex flex-col gap-3">
              {mockExpiringContracts.map((c) => (
                <div
                  key={c.cliente}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {c.cliente}
                    </p>
                    <p className="text-xs text-slate-400">
                      {c.paineis} painel{c.paineis > 1 ? "is" : ""} ·{" "}
                      {formatCurrency(c.valor)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${getUrgencyStyle(c.urgency)}`}
                  >
                    {c.diasRestantes}d
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inadimplência — NOVO */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Inadimplência
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Clientes com pagamento em atraso.
            </p>

            <div className="flex items-center justify-between mb-5 p-3 bg-rose-50 rounded-2xl">
              <p className="text-sm font-semibold text-rose-700">
                Total em aberto
              </p>
              <p className="text-base font-black text-rose-700">
                {formatCurrency(totalInadimplencia)}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {mockDelinquentClients.map((c) => (
                <div
                  key={c.cliente}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {c.cliente}
                    </p>
                    <p className="text-xs text-slate-400">
                      {c.diasAtraso} dias em atraso
                    </p>
                  </div>
                  <span className="text-sm font-bold text-rose-600">
                    {formatCurrency(c.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}