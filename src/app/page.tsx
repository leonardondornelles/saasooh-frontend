"use client";

import React from "react";
import Link from "next/link";
import { 
  Map, 
  CalendarCheck, 
  TrendingUp, 
  MonitorPlay, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Setdoor<span className="text-blue-600">.</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#recursos" className="hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-blue-600 transition-colors">Planos e Preços</a>
            <a href="#clientes" className="hover:text-blue-600 transition-colors">Para Agências</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Fazer Login
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mt-12 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            O ERP definitivo para Mídia OOH
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Gerencie seus painéis sem planilhas e sem <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">overbooking.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Do cadastro da face de LED até a fatura do cliente. Controle seu inventário de mídia exterior em tempo real, aumente suas vendas e ofereça um portal exclusivo para suas agências.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Começar teste grátis <ArrowRight size={20} />
            </Link>
            <a 
              href="#planos" 
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all text-center"
            >
              Ver planos
            </a>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div id="recursos" className="max-w-7xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <CalendarCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Anti-Overbooking</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Nosso motor inteligente impede que duas campanhas sejam vendidas para a mesma face na mesma data. Segurança total.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Mapa Interativo</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Visualize todo o seu inventário (Outdoors, Empenas, Frontlights) num mapa dinâmico para facilitar a venda por região.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Portal do Cliente</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Dê acesso VIP às agências para que elas mesmas vejam os painéis contratados, histórico e fotos de comprovação (Checking).
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <MonitorPlay size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Gestão de LED</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Controle inserções, looping de 15s ou 30s, e venda cotas de telas de LED com a mesma facilidade que vende lona.
              </p>
            </div>

          </div>
        </div>

        {/* PRICING */}
        <div id="planos" className="max-w-7xl mx-auto py-20 border-t border-slate-200">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Planos que crescem com sua empresa</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Sem taxas ocultas. Escolha o plano ideal para o tamanho do seu inventário OOH.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* PLANO BASIC */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative">
              <h3 className="text-xl font-black text-slate-800 mb-2">Basic</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Para pequenas operações locais.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">R$ 297</span>
                <span className="text-slate-500 font-medium">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Até 50 Painéis
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Mapa Interativo
                </li>
              </ul>
              <Link href="/register?plan=BASIC" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-center">
                Assinar Basic
              </Link>
            </div>

            {/* PLANO PRO */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">
                Mais Popular
              </div>
              <h3 className="text-xl font-black text-white mb-2">Pro</h3>
              <p className="text-sm text-slate-400 font-medium mb-6">Para exibidoras de médio porte e agências.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">R$ 597</span>
                <span className="text-slate-400 font-medium">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> Até 300 Painéis
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> Mapa Interativo
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> Alertas de Renovação Automáticos
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> Portal do Cliente (Visualização)
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> Propostas em PDF Automatizadas
                </li>
              </ul>
              <Link href="/register?plan=PRO" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-colors text-center">
                Assinar Pro
              </Link>
            </div>

            {/* PLANO ENTERPRISE */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative">
              <h3 className="text-xl font-black text-slate-800 mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Para grandes exibidoras e expansão.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">Personalizado</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Painéis Ilimitados
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Tudo do plano Pro
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Portal do Cliente White-label (Sua marca)
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> API Dedicada
                </li>
              </ul>
              <Link href="/register?plan=ENTERPRISE" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-center">
                Falar com consultor
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center">
        <p className="text-slate-500 font-medium text-sm">
          © {new Date().getFullYear()} Setdoor OOH SaaS. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}