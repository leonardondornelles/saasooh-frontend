"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/src/services/api";
import Link from "next/link";
import { Search, Filter, MapPin, Monitor, X, ExternalLink } from "lucide-react";// 🚀 Novos ícones

export default function PanelsPage() {
  const router = useRouter();

  // Panels State
  const [panels, setPanels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 NOVOS ESTADOS: Filtro e Pesquisa
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Creation Form States
  const [addressName, setAddressName] = useState("");
  const [cityName, setCityName] = useState("");
  const [latitudeValue, setLatitudeValue] = useState(0);
  const [longitude, setLongitude] = useState(0.0);
  const [panelType, setPanelType] = useState("OUTDOOR");
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const loadData = async () => { 
    try {
      const response = await api.get("/api/panels");
      setPanels(response.data);
    } catch (error) {
      console.error("Erro ao buscar painéis:", error);
      setError("Não foi possível carregar os dados. Sua sessão pode ter expirado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("saas_token");
    router.push("/");
  };

  const handleCreatePanel = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);

    try{
      await api.post("/api/panels", {
        address: addressName,
        city: cityName,
        latitude: latitudeValue,
        longitude: longitude,
        panelType: panelType
      });

      setCityName("");
      setAddressName("");
      setLatitudeValue(0.0);
      setLongitude(0.0);
      setPanelType("OUTDOOR"); // Reseta para o padrão

      loadData();
    } catch (error){
      console.error("Erro ao criar painel:", error);
      alert("Erro ao criar o painel. Verifique se preencheu tudo corretamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePanel = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este painel? Esta ação não pode ser desfeita.")){
      return;
    }
    try {
      await api.delete(`/api/panels/${id}`);
      loadData();
    } catch (error) {
      console.error("Erro ao deletar painel:", error);
      alert("Erro ao tentar excluir o painel");
    }
  };

  // 🚀 LÓGICA DE FILTRAGEM COMBINADA (Tipo + Endereço/Cidade)
  const displayedPanels = panels.filter(panel => {
    const matchesType = filterType === "ALL" || panel.type === filterType;
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (panel.city?.toLowerCase().includes(term)) || 
      (panel.address?.toLowerCase().includes(term)) ||
      (panel.identificationCode?.toLowerCase().includes(term)); // Bónus: pesquisa por ID do painel
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-200/60">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestão de Inventário (Painéis)</h1>
            <p className="text-sm text-slate-500">Administre as suas localizações e faces.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors text-sm"
            >
              Sair do Sistema
          </button>
        </div>

        {/* CADASTRAR NOVO PAINEL */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Cadastrar Novo Painel</h2>
          <form onSubmit={handleCreatePanel} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"> Endereço </label>
              <input type="text" required value={addressName} onChange={(e) => setAddressName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                placeholder="Ex: 24 de Outubro, 1201" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cidade</label>
              <input type="text" required value={cityName} onChange={(e) => setCityName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                placeholder="Ex: Porto Alegre, RS" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GPS</label>
              <div className="flex gap-2">
                <input type="number" step="any" required value={latitudeValue || ""} onChange={(e) => setLatitudeValue(parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none" placeholder="Lat" />
                <input type="number" step="any" required value={longitude || ""} onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none" placeholder="Long" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo</label>
              <select required value={panelType} onChange={(e) => setPanelType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium">
                <option value="OUTDOOR">Outdoor</option>
                <option value="FRONT_LIGHT">Front Light</option>
                <option value="TRIEDRO">Triedro</option>
                <option value="LED">LED</option>
                <option value="EMPENA">Empena</option>
                <option value="RODOVIARIO">Rodoviário</option>
              </select>
            </div>
            <button type="submit" disabled={creating}
              className="w-full px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm">
                {creating ? "A salvar..." : "Cadastrar"}
            </button>
          </form>
        </div>

         {/* ÁREA DE LISTAGEM COM FILTROS */}
         <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
          
          {/* Cabeçalho da Lista e Barra de Filtros */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Meus Painéis</h2>
              {!loading && !error && (
                <p className="text-sm text-slate-500 mt-1">
                  Exibindo <span className="font-bold text-blue-600">{displayedPanels.length}</span> de {panels.length} painéis
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Pesquisa de Endereço/Cidade */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Pesquisar rua ou cidade..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filtro de Tipo */}
              <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="ALL">Todos os Tipos</option>
                  <option value="OUTDOOR">Outdoor</option>
                  <option value="FRONT_LIGHT">Front Light</option>
                  <option value="TRIEDRO">Triedro</option>
                  <option value="LED">LED</option>
                  <option value="EMPENA">Empena</option>
                  <option value="RODOVIARIO">Rodoviário</option>
                </select>
              </div>
            </div>
          </div>

          {/* Renderização da Lista */}
          {loading ?(
            <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold text-center">{error}</div>
          ) : displayedPanels.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
              <MapPin size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Nenhum painel encontrado para esta pesquisa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPanels.map((panel, index) => (
                <div key={panel.id || index} className="border border-slate-200 rounded-2xl bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  
                  {/* Image Placeholder */}
                  <div className="h-36 bg-slate-100 flex flex-col items-center justify-center text-slate-400 relative">
                    <Monitor className="h-10 w-10 mb-2 text-slate-300" strokeWidth={1.5} />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">Painel #{panel.id}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{panel.identificationCode || 'S/ CÓDIGO'}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePanel(panel.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir painel"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 text-sm text-slate-500 mb-4 flex-1">
                      <p className="flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 shrink-0"/> <span className="line-clamp-2">{panel.address}</span></p>
                      <p className="pl-5 font-medium">{panel.city}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {panel.type?.replace('_', ' ')}
                      </span>
                      <Link 
                        href={`/dashboard/panel/${panel.id}`}
                        className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1"
                      >
                        Gerenciar Faces <ExternalLink size={12}/>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
         </div>
      </div>
    </div>
  );
}