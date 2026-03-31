"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  LayoutDashboard, 
  Map, 
  CalendarRange, 
  Users, 
  Building2, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // A função de Logout que limpa o cookie e expulsa o utilizador para o Login
  const handleLogout = () => {
    Cookies.remove("saas_token");
    router.push("/login");
  };

  // As nossas rotas do sistema
  const menuItems = [
    { name: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Inventário (Painéis)", icon: Map, href: "/dashboard/paineis" }, // Ajusta o href se o teu for diferente
    { name: "Campanhas", icon: CalendarRange, href: "/dashboard/campanhas" }, // Ajusta o href se o teu for diferente
    { name: "Clientes e Agências", icon: Users, href: "/dashboard/customers" },
    { name: "Hub da Empresa", icon: Building2, href: "/dashboard/company" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* MENU MOBILE (Hamburguer) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-black text-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">S</div>
          Setdoor.
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* SIDEBAR (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Logo da Sidebar */}
        <div className="h-20 hidden md:flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Setdoor<span className="text-blue-500">.</span>
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto mt-16 md:mt-0">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Menu Principal</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400 transition-colors"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar (Botão de Sair) */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors group"
          >
            <LogOut size={20} className="group-hover:text-rose-500 transition-colors" />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL ONDE AS PÁGINAS RENDERIZAM */}
      <main className="flex-1 overflow-y-auto h-full w-full pt-16 md:pt-0">
        <div className="animate-in fade-in duration-500 h-full">
          {children}
        </div>
      </main>

      {/* Backdrop para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}