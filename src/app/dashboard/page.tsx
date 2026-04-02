"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import Link from "next/link";
import { 
  Map, 
  CalendarRange, 
  Users, 
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";

export default function OverviewPage() {
  const [userName, setUserName] = useState("Usuário");
  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    // Busca os dados do usuário logado para dar boas-vindas
    api.get("/api/users/me")
      .then(response => {
        // Pega só o primeiro nome
        const firstName = response.data.name.split(" ")[0];
        setUserName(firstName);
      })
      .catch(console.error);

    // Lógica simples de Bom dia / Boa tarde / Boa noite
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 mb-10 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          {/* Elementos decorativos no fundo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 right-40 -mb-10 w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-wider uppercase text-xs mb-3">
              <Sparkles size={14} />
              <span>Bem-vindo ao Setdoor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              {greeting}, {userName}.
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-medium">
              O que você gostaria de gerenciar hoje? Acesse rapidamente seu inventário, campanhas ou base de clientes.
            </p>
          </div>
        </div>

        {/* Acesso Rápido (Quick Links) */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Acesso Rápido
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Atalho 1: Inventário */}
          <Link href="/dashboard/panels" className="group bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Map size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Inventário (Painéis)</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">
              Visualize seus outdoors, frontlights e painéis de LED. Verifique a disponibilidade e o status das faces.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              Acessar Mapa <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Atalho 2: Campanhas */}
          <Link href="/dashboard/campaigns" className="group bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarRange size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Campanhas</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">
              Gerencie as veiculações atuais, agendamentos futuros e veja as datas de checking.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Ver Calendário <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Atalho 3: Clientes */}
          <Link href="/dashboard/customers" className="group bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Clientes e Agências</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">
              Cadastre novas marcas, consulte contatos e gere acessos VIP para o Portal do Cliente.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              Gerenciar Base <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}