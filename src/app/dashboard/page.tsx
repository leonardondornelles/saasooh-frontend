
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/src/services/api";


export default function DashboardPage() {
  const router = useRouter();

  // Panels State
  const [panels, setPanels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Creation Form States
  const [addressName, setAddressName] = useState("");
  const [cityName, setCityName] = useState("");
  const [latitudeValue, setLatitudeValue] = useState(0);
  const [longitude, setLongitude] = useState(0.0);
  const [panelType, setPanelType] = useState("");
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


// LOGOUT FUNCTION
  const handleLogout = () => {
    Cookies.remove("saas_token");
    router.push("/");
  };

  // CREATE PANEL FUNCTION
  const handleCreatePanel = async (e:React.SyntheticEvent) => {
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
      setPanelType("");

      loadData();

    } catch (error){
      console.error("Erro ao criar painel:", error);
      alert("Erro ao criar o painel. Verifique o console.");
    } finally {
      setCreating(false);
    }
  };

  // DELETE PANEL FUNCTION
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel de Gestão OOH</h1>
            <p className="text-sm text-gray-500">Bem vindo(a) ao seu sistema.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-md hover:bg-red-100 transition-colors"
            >
              Sair do Sistema
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cadastrar Novo Painel</h2>
          <form onSubmit={handleCreatePanel} className="flex gap-4 items-end">
            {/* Div Address */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1"> Endereço </label>
              <input
                type="text"
                required
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outilne-none focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Ex: 24 de Outubro, 1201 x Cel. Bordini"
                />
            </div>
            {/* Div City Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Ex: Porto Alegre, RS"
              />
            </div>
            {/* Div Latitude */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={latitudeValue}
                onChange={(e) => setLatitudeValue(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Ex: -30.0346"
              />
            </div>
            {/* Div Longetude */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Longetude</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Ex: -51.2177"
              />
            </div>
             {/* Div Type (Dropdown*/}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                required
                value={panelType}
                onChange={(e) => setPanelType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-500"
              >
                <option value="OUTDOOR">Outdoor</option>
                <option value="FRONT_LIGHT">Front Light</option>
                <option value="TRIEDRO">Triedro</option>
                <option value="LED">LED</option>
                <option value="EMPENA">Empena</option>
                <option value="RODOVIARIO">Rodoviário</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {creating ? "Salvando..." : "Cadastrar"}
            </button>
          </form>
        </div>

         {/* Content Area (Panel Listing) */}
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meus Painéis</h2>

          {loading ?(
            <p className="text-gray-500">Carregando dados do servidor...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : panels.length === 0 ? (
            <p className="text-gray-500 italic">Nenhum painel encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {panels.map((panel, index) => (
                <div key={panel.id || index} className="border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow overflow-hidden">
                  
                  {/* Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium tracking-wide">Imagem em breve</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Header com título e lixeira */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">Painel #{panel.id}</h3>
                        <span className="text-xs text-gray-400">{panel.identificationCode}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePanel(panel.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir painel"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-700">Cidade:</span> {panel.city}</p>
                      <p><span className="font-semibold text-gray-700">Endereço:</span> {panel.address}</p>
                      <p><span className="font-semibold text-gray-700">GPS:</span> {panel.latitude}, {panel.longitude}</p>
                    </div>

                    <div className="mt-3">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                        {panel.type}
                      </span>
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