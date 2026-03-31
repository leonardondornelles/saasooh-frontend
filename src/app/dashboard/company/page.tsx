"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { Users, Briefcase, TrendingUp, ShieldCheck, Plus, Mail, X, CheckCircle2 } from "lucide-react";

// Tipagem para ajudar o TypeScript a entender quem é o funcionário
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CompanyHubPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [employeeForm, setEmployeeForm] = useState({
    name: "", email: "", password: "", role: "COMERCIAL"
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // 🚀 Busca real no teu backend Java
      const response = await api.get("/api/users/company");
      setEmployees(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 🚀 Salva no banco de dados e pega a resposta (UserResponseDTO)
      const response = await api.post("/api/users/employee", employeeForm);
      
      // 🚀 Adiciona o funcionário retornado pelo Java (com o ID verdadeiro do Postgres)
      setEmployees([...employees, response.data]);
      
      setShowModal(false);
      setEmployeeForm({ name: "", email: "", password: "", role: "COMERCIAL" });
      
    } catch (error: any) {
      // Tenta pegar a mensagem de erro formatada pelo teu GlobalExceptionHandler
      const errorMsg = error.response?.data?.message || error.response?.data || "Erro ao adicionar funcionário.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função auxiliar para definir as cores das tags de função
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'COMERCIAL':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'OPERATIONAL':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Hub da Empresa</h1>
            <p className="text-slate-200 text-sm mt-1">Gerencie sua equipe, plano e configurações de acesso.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} />
            Novo Funcionário
          </button>
        </div>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          
          {/* Card 1: Uso do Plano */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                Plano PRO
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Painéis Utilizados</p>
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-3xl font-bold text-slate-800">142</h3>
                <span className="text-sm font-medium text-slate-400">/ 300</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{width: '47%'}}></div>
              </div>
            </div>
          </div>

          {/* Card 2: MRR Estimado */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">MRR (Faturamento Ativo)</p>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">R$ 45.200</h3>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp size={12} /> +12% este mês
              </p>
            </div>
          </div>

          {/* Card 3: Equipe */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={140} />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={20} />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Equipe Ativa</p>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{employees.length} <span className="text-lg text-slate-400 font-medium">membros</span></h3>
              <p className="text-xs font-medium text-slate-400 mt-2">
                Acessos gerenciados com segurança.
              </p>
            </div>
          </div>
        </div>

        {/* LISTA DE FUNCIONÁRIOS */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Membros da Equipe
          </h2>
        </div>
        
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Carregando equipe...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                <Users size={24} />
              </div>
              <h3 className="text-slate-700 font-medium mb-1">Nenhum funcionário encontrado</h3>
              <p className="text-slate-500 text-sm mb-4">Comece adicionando o primeiro membro da sua equipe.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                + Adicionar Funcionário
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acesso</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-sm font-bold shadow-sm">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={14} className="text-slate-400" />
                          {emp.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(emp.role)}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium text-slate-600">Ativo</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: ADICIONAR NOVO FUNCIONÁRIO */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal Box */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header do Modal */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Novo Funcionário</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Preencha os dados para liberar o acesso.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Corpo do Formulário */}
              <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome Completo</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    value={employeeForm.name} 
                    onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail Corporativo</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="joao@suaempresa.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    value={employeeForm.email} 
                    onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Senha Provisória</label>
                    <input 
                      required 
                      type="password" 
                      minLength={6} 
                      placeholder="Mínimo 6 carac."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                      value={employeeForm.password} 
                      onChange={e => setEmployeeForm({...employeeForm, password: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nível de Acesso</label>
                    <select 
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm bg-white appearance-none"
                      value={employeeForm.role} 
                      onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                      <option value="COMERCIAL">Comercial</option>
                      <option value="OPERATIONAL">Operacional</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>

                {/* Footer do Form */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : (
                      "Confirmar Cadastro"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}