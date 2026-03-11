"use function";
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

  const handleLogout = () => {
    Cookies.remove("saas_token");
    router.push("/");
  };

  const handleCreatePanel = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);

    try{
      await api.post("/api/panels", {
        address: addressName,
        city: cityName,
        latitude: latitudeValue,
        longetude: longitude,
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outilne-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled>Selecione...</option>
                <option value="OUTDOOR" disabled>Outdoor</option>
                <option value="FRONT_LIGHT" disabled>Front Light</option>
                <option value="TRIEDRO" disabled>Triedro</option>
                <option value="LED" disabled>LED</option>
                <option value="EMPENA" disabled>Empena</option>
                <option value="RODOVIARIO" disabled>Rodoviario</option>

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
                <div key={index} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-800 mb-3">Painel #{panel.id || index}</h3>
                  
                  {/* Image PlaceHolder */}
                  <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-4 text-gray-400 border-2 border-dashed border-gray-200">
                    <span>📷 Imagem em breve</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-700">Cidade:</span> {panel.city}</p>
                    <p><span className="font-semibold text-gray-700">Endereço:</span> {panel.address}</p>
                    <p><span className="font-semibold text-gray-700">GPS:</span> {panel.latitude}, {panel.longitude}</p>
                    <p><span className="font-semibold text-gray-700">Tipo:</span> <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{panel.type}</span></p>
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