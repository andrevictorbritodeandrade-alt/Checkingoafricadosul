import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  MapPin, 
  Mountain, 
  Wind, 
  Droplets, 
  Navigation, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
  altitude: number | null;
}

const WeatherLocation: React.FC = () => {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaceName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
      const data = await response.json();
      return data.address.city || data.address.town || data.address.suburb || data.address.state || "Local Desconhecido";
    } catch (e) {
      return "Coordenadas Ativas";
    }
  };

  const initData = () => {
    if (!navigator.geolocation) {
      setError("GPS não suportado.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, altitude } = position.coords;
        const placeName = await getPlaceName(latitude, longitude);
        
        setLocation({ name: placeName, lat: latitude, lon: longitude, altitude });

        try {
          const wData = await getWeather(latitude, longitude);
          setWeather(wData);
        } catch (e) {
          console.error("Erro clima", e);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("Ative o GPS para ver o clima.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Principal Display */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cloud className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-3 bg-sa-gold/20 rounded-2xl">
              <MapPin className="w-6 h-6 text-sa-gold" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sua Localização</span>
              <h2 className="text-2xl font-display font-black leading-none uppercase tracking-tight">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : location?.name || "Buscando..."}
              </h2>
            </div>
          </div>

          {weather ? (
            <div className="flex items-end gap-6 mb-8 animate-in fade-in zoom-in duration-500">
               <span className="text-7xl font-display font-black leading-none">{Math.round(weather.temp)}°</span>
               <div className="flex flex-col pb-1">
                  <span className="text-sa-gold font-bold text-sm uppercase tracking-widest">Sensação {Math.round(weather.feelsLike)}°</span>
                  <span className="text-slate-400 text-xs font-medium">Céu Predominante</span>
               </div>
            </div>
          ) : (
             <div className="h-24 flex items-center text-slate-500 italic text-sm">
                Aguardando dados do satélite...
             </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800">
             <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
                <Wind className="w-4 h-4 text-sa-gold" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Vento</span>
                  <span className="text-sm font-black">{weather?.windSpeed || '--'} km/h</span>
                </div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
                <Droplets className="w-4 h-4 text-sa-blue" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Chuva</span>
                  <span className="text-sm font-black">{weather?.rainProb || '0'}%</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Info Extras */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Mountain className="w-5 h-5 text-sa-green" />
            <div>
               <span className="text-[9px] font-bold text-slate-400 uppercase">Altitude Atual</span>
               <p className="font-black text-slate-800">{location?.altitude ? `${Math.round(location.altitude)}m` : '--'}</p>
            </div>
         </div>
         <button 
           onClick={initData}
           className="bg-sa-green text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-transform"
         >
           <Navigation className="w-5 h-5" />
         </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold animate-in bounce-in">
           <AlertCircle className="w-5 h-5" />
           {error}
        </div>
      )}
    </div>
  );
};

export default WeatherLocation;