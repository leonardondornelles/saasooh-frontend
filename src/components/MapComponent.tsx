import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuração dos ícones do Leaflet para o Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  panels: any[];
}

// Rastreador invisível que centraliza a câmera nos painéis filtrados
function MapBoundsTracker({ panels }: { panels: any[] }) {
  const map = useMap();

  useEffect(() => {
    const validPanels = panels.filter(
      p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
    );

    if (validPanels.length > 0) {
      const bounds = L.latLngBounds(
        validPanels.map(p => [Number(p.latitude), Number(p.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [panels, map]);

  return null;
}

export default function MapComponent({ panels }: MapComponentProps) {
  const defaultCenter: [number, number] = [-30.0346, -51.2177];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0 relative">
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsTracker panels={panels} />
        
        {panels.map((panel) => {
          // Garante que convertemos sempre para Número
          const lat = Number(panel.latitude);
          const lng = Number(panel.longitude);

          // 🚀 Lógica de Status (Lendo os dados que vêm do teu Java)
          const hasData = panel.totalFaces !== undefined;
          const isFullyBooked = hasData && panel.availableFaces === 0;

          if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            return (
              <Marker 
                key={panel.id} 
                position={[lat, lng]} 
                icon={customIcon}
              >
                <Popup className="rounded-xl">
                  <div className="text-sm font-sans min-w-[180px]">
                    <div className="mb-2">
                      <p className="font-bold text-slate-800 text-base leading-tight">Painel #{panel.id}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{panel.address}</p>
                    </div>
                    
                    {/* Linha de Tipo e Cidade */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        {panel.type?.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{panel.city}</span>
                    </div>

                    {/* 🚀 DIVISÓRIA COM O RESUMO DE STATUS E BOTÃO DE AÇÃO */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Status:</span>
                        {hasData ? (
                           <span className={`text-xs font-bold ${isFullyBooked ? 'text-rose-600' : 'text-emerald-600'}`}>
                             {isFullyBooked ? '100% Ocupado' : `${panel.availableFaces} Face(s) Livres`}
                           </span>
                        ) : (
                           <span className="text-xs font-bold text-blue-600">Verificar</span>
                        )}
                      </div>
                      
                      {/* Botão de Redirecionamento (Usamos <a> porque o Leaflet não lida bem com o <Link> do Next) */}
                      <a 
                        href={`/dashboard/panel/${panel.id}`} 
                        className="w-full block text-center bg-blue-600 !text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm no-underline"
                      >
                        Acessar Painel
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}