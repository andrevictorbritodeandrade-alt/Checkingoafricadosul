
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Loader2,
  CloudRain,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  CloudSun
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface WeatherState {
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

const WeatherCardHome: React.FC = () => {
  const [locationName, setLocationName] = useState<string>('BUSCANDO...');
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat: number, lon: number, name?: string) => {
    try {
      if (!name) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`);
        const data = await response.json();
        const place = data.address.city || data.address.town || data.address.suburb || "S. AFRICA";
        setLocationName(place.toUpperCase());
      } else {
        setLocationName(name.toUpperCase());
      }

      const wData = await getWeather(lat, lon);
      setWeather({
        temp: wData.temp,
        tempMax: wData.tempMax,
        tempMin: wData.tempMin,
        feelsLike: wData.feelsLike,
        humidity: wData.humidity,
        windSpeed: wData.windSpeed,
        rainProb: wData.rainProb
      });
    } catch (e) {
      console.error("Erro ao buscar clima:", e);
      setLocationName("ERRO");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(-33.9249, 18.4241, "CIDADE DO CABO");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fetchWeather(-33.9249, 18.4241, "CIDADE DO CABO");
      },
      { timeout: 8000 }
    );
  }, []);

  return (
    <div className="relative w-full aspect-square p-[1px] rounded-2xl shadow-2xl border-2 bg-[#1a1a1a] border-sa-gold/40 overflow-hidden flex flex-col">
      <div className="flex flex-col flex-1 p-2 pb-1 z-10 text-white relative h-full justify-between">
        
        {/* Top: Location */}
        <div className="flex items-center gap-1 w-full justify-center pt-1">
          <MapPin className="w-3.5 h-3.5 text-sa-gold shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[90px]">
            {locationName}
          </span>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-sa-gold opacity-50" />
          </div>
        ) : weather ? (
          <div className="flex flex-col flex-1 justify-around py-1">
            
            {/* Main Temp & Feels Like Row */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-display font-black leading-none">
                {Math.round(weather.temp)}°
              </span>
              <div className="flex flex-col justify-center border-l border-white/10 pl-2">
                <span className="text-[8px] font-black text-sa-gold uppercase leading-none">SENS.</span>
                <span className="text-sm font-bold leading-none">{Math.round(weather.feelsLike)}°</span>
              </div>
            </div>
            
            {/* High/Low Row */}
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-sa-red" />
                <span className="text-xs font-black">{Math.round(weather.tempMax)}°</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-sa-blue" />
                <span className="text-xs font-black">{Math.round(weather.tempMin)}°</span>
              </div>
            </div>

            {/* Bottom Grid: Chuva, Umidade, Vento */}
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 mx-1">
              <div className="flex flex-col items-center">
                <CloudRain className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold text-white mt-0.5">{weather.rainProb}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-bold text-white mt-0.5">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold text-white mt-0.5">{Math.round(weather.windSpeed)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[10px] text-red-500 font-black">
            ERRO
          </div>
        )}
      </div>

      {/* Footer Label */}
      <div className="bg-black/80 py-1 text-center mt-auto border-t border-white/5 relative z-10">
        <span className="text-sa-gold text-[8px] font-display font-black tracking-[0.2em] uppercase">
          CLIMA AO VIVO
        </span>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-2 right-2 opacity-[0.03] pointer-events-none z-0">
        <CloudSun className="w-16 h-16 text-sa-gold" />
      </div>
    </div>
  );
};

export default WeatherCardHome;
