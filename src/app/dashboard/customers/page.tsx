"use client";

import { api } from "@/src/services/api";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  FileText, 
  X, 
  Briefcase,
  KeyRound
} from "lucide-react";

interface Customer {
  id: number;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  telephone: string;
  email: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreating, setIsCreating] = useState(false);   
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    corporateName: "", fantasyName: "", cnpj: "", telephone: "", email: "", observation: ""
  });

  //  ESTADOS PARA O MODAL DE ACESSO VIP (PORTAL DO CLIENTE)
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [submittingAccess, setSubmittingAccess] = useState(false);
  const [accessForm, setAccessForm] = useState({
    name: "", email: "", password: ""
  });

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.fantasyName.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    customer.corporateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cnpj.includes(searchTerm)
  );

  const handleCreateCustomer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/customers", formData);
      alert("Cliente cadastrado com sucesso!");

      setFormData({
        corporateName: "", fantasyName: "", cnpj: "", telephone: "", email: "", observation: ""
      });
      setIsCreating(false);
      fetchCustomers();
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error);
      alert(error.response?.data?.message || error.response?.data || "Erro ao tentar cadastrar o cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  //  FUNÇÃO PARA GERAR O LOGIN DO CLIENTE
  const handleCreateAccess = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmittingAccess(true);

    try {
      await api.post("/api/users/customer", {
        customerId: selectedCustomerId,
        name: accessForm.name,
        email: accessForm.email,
        password: accessForm.password
      });

      alert("Acesso ao Portal do Cliente gerado com sucesso!");
      setShowAccessModal(false);
      setAccessForm({ name: "", email: "", password: "" });
      
    } catch (error: any) {
      console.error("Erro ao gerar acesso:", error);
      alert(error.response?.data?.message || error.response?.data || "Erro ao gerar acesso. Verifique se seu plano permite.");
    } finally {
      setSubmittingAccess(false);
    }
  };

  // Abre o modal e guarda qual cliente foi clicado
  const openAccessModal = (id: number) => {
    setSelectedCustomerId(id);
    setShowAccessModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 className="text-blue-600" size={32} />
              Gestão de Clientes
            </h1>
            <p className="text-slate-500 mt-1">Gerencie as marcas e agências que anunciam nos seus painéis.</p>
          </div>
          
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            {isCreating ? <X size={20} /> : <Plus size={20} />}
            {isCreating ? "Cancelar" : "Novo Cliente"}
          </button>
        </div>

        {/* FORMULÁRIO DE CRIAÇÃO (MANTIDO INTACTO) */}
        {isCreating && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Razão Social *</label>
                  <input required type="text" placeholder="Ex: Coca-Cola Indústrias Ltda"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.corporateName} onChange={(e) => setFormData({...formData, corporateName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Fantasia *</label>
                  <input required type="text" placeholder="Ex: Coca-Cola"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.fantasyName} onChange={(e) => setFormData({...formData, fantasyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CNPJ *</label>
                  <input required type="text" placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone *</label>
                  <input required type="text" placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail de Contato *</label>
                  <input required type="email" placeholder="contato@empresa.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" disabled={submitting} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all disabled:opacity-70">
                  {submitting ? "Salvando..." : "Cadastrar Cliente"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BARRA DE PESQUISA */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por nome ou CNPJ..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-shadow hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ÁREA DE LISTAGEM */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-slate-500">
              {searchTerm ? "Não encontramos nenhum cliente com esta pesquisa." : "Você ainda não possui clientes cadastrados."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl border border-blue-100">
                    {customer.fantasyName.charAt(0).toUpperCase()}
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    ID: {customer.id}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1" title={customer.fantasyName}>
                  {customer.fantasyName}
                </h3>
                <p className="text-xs text-slate-500 mb-6 line-clamp-1" title={customer.corporateName}>
                  {customer.corporateName}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <FileText size={16} className="text-slate-400" />
                    <span className="font-medium">{customer.cnpj}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{customer.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>

                {/*  BOTÕES DE AÇÃO DO CLIENTE */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm transition-colors border border-slate-200">
                    Ver Perfil
                  </button>
                  <button 
                    onClick={() => openAccessModal(customer.id)}
                    className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-sm transition-colors border border-indigo-200 flex items-center justify-center gap-2"
                    title="Criar login para este cliente"
                  >
                    <KeyRound size={16} /> Dar Acesso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*  MODAL: GERAR ACESSO VIP (PORTAL DO CLIENTE) */}
        {showAccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAccessModal(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Gerar Acesso VIP</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Portal do Cliente (Agências e Marcas)</p>
                </div>
                <button onClick={() => setShowAccessModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleCreateAccess} className="p-6 space-y-4">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
                  <p className="text-xs text-indigo-700 font-medium">
                    Ao criar este acesso, o cliente poderá fazer login no sistema apenas para visualizar o checking e andamento das campanhas atreladas a ele.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome do Contato</label>
                  <input required type="text" placeholder="Ex: Maria da Agência"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={accessForm.name} onChange={e => setAccessForm({...accessForm, name: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail de Login</label>
                  <input required type="email" placeholder="maria@agencia.com.br"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={accessForm.email} onChange={e => setAccessForm({...accessForm, email: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Senha de Acesso</label>
                  <input required type="password" minLength={6} placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={accessForm.password} onChange={e => setAccessForm({...accessForm, password: e.target.value})} 
                  />
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAccessModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg">
                    Cancelar
                  </button>
                  <button type="submit" disabled={submittingAccess} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 disabled:opacity-70">
                    {submittingAccess ? "Gerando..." : "Gerar Acesso"}
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