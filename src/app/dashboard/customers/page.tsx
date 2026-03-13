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
  Briefcase 
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
        corporateName: "",
        fantasyName: "",
        cnpj: "",
        telephone: "",
        email: "",
        observation: ""
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
            alert(error.response?.data?.message || "Erro ao tentar cadastrar o cliente. Verifique os dados.");
        } finally {
            setSubmitting(false);
        }
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

        {/* FORMULÁRIO DE CRIAÇÃO (Abre e Fecha) */}
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
              <div key={customer.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
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

                <div className="space-y-3 pt-4 border-t border-slate-100">
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

                <div className="mt-6 pt-4">
                  <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm transition-colors border border-slate-200">
                    Ver Perfil Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}