"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { 
  Receipt, CheckCircle, Clock, AlertCircle, X, Search, 
  FileText, ArrowDownToLine, AlertTriangle
} from "lucide-react";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para o Modal de Pagamento
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payForm, setPayForm] = useState({ paymentMethod: "PIX", notes: "" });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Validação de segurança no Frontend
      const meResp = await api.get("/api/users/me");
      if (meResp.data.role !== "ADMIN" && meResp.data.role !== "FINANCEIRO") {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const response = await api.get("/api/invoices");
      setInvoices(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar faturas:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPayment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/api/invoices/${selectedInvoice.id}/pay`, payForm);
      
      // Atualiza a lista localmente para refletir o status imediatamente
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, status: "PAID", paymentDate: new Date().toISOString(), paymentMethod: payForm.paymentMethod } 
          : inv
      ));
      
      setShowPayModal(false);
      setPayForm({ paymentMethod: "PIX", notes: "" });
    } catch (error) {
      alert("Erro ao registrar pagamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const openPayModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPayModal(true);
  };

  // --- Funções Auxiliares de Formatação ---
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

  const formatDateBR = (isoDate: string) => {
    if (!isoDate) return "-";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  // Lógica para determinar se está atrasado visualmente
  const getInvoiceStatusProps = (invoice: any) => {
    if (invoice.status === "PAID") {
      return { label: "Pago", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle size={14} /> };
    }
    
    const isOverdue = new Date(invoice.dueDate) < new Date(new Date().setHours(0,0,0,0));
    
    if (isOverdue) {
      return { label: "Atrasado", color: "bg-rose-50 text-rose-700 border-rose-200", icon: <AlertCircle size={14} /> };
    }
    return { label: "Pendente", color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- TELA DE ACESSO NEGADO ---
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Acesso Restrito</h2>
          <p className="text-slate-500 mb-8">Área exclusiva para a gestão financeira.</p>
          <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full">
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Receipt className="text-blue-600" size={32} />
              Contas a Receber
            </h1>
            <p className="text-slate-500 mt-1">Gerencie as mensalidades e realize a conciliação bancária.</p>
          </div>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por cliente..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABELA DE FATURAS */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fatura / Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => {
                    const statusProps = getInvoiceStatusProps(inv);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{inv.customerName}</span>
                            <span className="text-xs text-slate-400 mt-0.5">Campanha #{inv.campaignId} • Fatura #{inv.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700">{formatDateBR(inv.dueDate)}</span>
                            {inv.paymentDate && <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Pago em {formatDateBR(inv.paymentDate)}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-slate-800">
                          {formatCurrency(inv.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider ${statusProps.color}`}>
                            {statusProps.icon} {statusProps.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {inv.status === "PENDING" ? (
                            <button 
                              onClick={() => openPayModal(inv)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                            >
                              <ArrowDownToLine size={14} /> Registrar Pagamento
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                              Baixa Realizada
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL DE REGISTRO DE PAGAMENTO (BAIXA) */}
        {showPayModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPayModal(false)}></div>
            <form onSubmit={handleRegisterPayment} className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Registrar Pagamento</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Conciliação da Fatura #{selectedInvoice.id}</p>
                </div>
                <button type="button" onClick={() => setShowPayModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Valor a Receber</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedInvoice.customerName}</p>
                  </div>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(selectedInvoice.amount)}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Método de Pagamento</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={payForm.paymentMethod} 
                    onChange={e => setPayForm({...payForm, paymentMethod: e.target.value})}
                  >
                    <option value="PIX">PIX</option>
                    <option value="Boleto Bancário">Boleto Bancário</option>
                    <option value="Transferência Bancária">Transferência Bancária (TED/DOC)</option>
                    <option value="Dinheiro">Dinheiro Físico</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                    Notas de Auditoria <span className="text-[10px] font-normal lowercase">(Opcional)</span>
                  </label>
                  <textarea 
                    placeholder="Ex: Comprovante salvo na pasta do Drive. Transação #12345"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                    value={payForm.notes} 
                    onChange={e => setPayForm({...payForm, notes: e.target.value})} 
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button type="button" onClick={() => setShowPayModal(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-100">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-600/20 disabled:opacity-70 transition-colors">
                  {submitting ? "Registrando..." : "Confirmar Recebimento"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}