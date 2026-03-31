"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan"); // Pega o ?plan=PRO da URL
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // O nosso DTO "Combo"
  const [formData, setFormData] = useState({
    corporateName: "",
    fantasyName: "",
    cnpj: "",
    saasPlan: planFromUrl || "BASIC",
    adminName: "",
    adminEmail: "",
    adminPassword: ""
  });

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Dispara o DTO gigante para o novo serviço Transactional do Java
      await api.post("/api/auth/register", formData);
      
      setSuccess(true);
      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Criada!</h2>
          <p className="text-slate-500 mb-6">A sua estrutura inicial foi montada com sucesso. Redirecionando para o login...</p>
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">S</div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Setdoor<span className="text-blue-600">.</span></span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Crie a sua conta SaaS</h2>
        <p className="mt-2 text-sm text-slate-600">Comece a gerir o seu inventário OOH em minutos</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            
            <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 text-blue-600">Dados da Exibidora</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Razão Social</label>
                        <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.corporateName} onChange={(e) => setFormData({...formData, corporateName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome Fantasia</label>
                        <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.fantasyName} onChange={(e) => setFormData({...formData, fantasyName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CNPJ</label>
                        <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Plano Escolhido</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-bold"
                            value={formData.saasPlan} onChange={(e) => setFormData({...formData, saasPlan: e.target.value})}>
                            <option value="BASIC">Basic</option>
                            <option value="PRO">Pro</option>
                            <option value="ENTERPRISE">Enterprise</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 text-indigo-600">Dados do Administrador</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Seu Nome Completo</label>
                        <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">E-mail Profissional</label>
                        <input required type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Senha de Acesso</label>
                        <input required type="password" minLength={6} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.adminPassword} onChange={(e) => setFormData({...formData, adminPassword: e.target.value})} />
                    </div>
                </div>
            </div>

            {error && <div className="text-rose-600 text-sm text-center font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</div>}

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-50">
              {loading ? "Processando..." : "Criar Empresa e Administrador"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Já tem uma conta? <Link href="/login" className="text-blue-600 hover:text-blue-500 font-bold">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}