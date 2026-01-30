
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  CalendarDays, 
  Calculator,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { getRates } from '../services/currencyService';

export interface Ride {
  id: string;
  date: string;
  weekday: string;
  time: string;
  origin: string;
  destination: string;
  price: number;
  currency: 'ZAR' | 'BRL';
  app: 'Uber' | 'Bolt';
  appLabel?: string;
  isConfirmed?: boolean;
}

// DADOS DOS TRAJETOS - Exportados para o sistema de alertas
export const RIDES: Ride[] = [
  {
    id: 'u-01',
    date: '24/Jan',
    weekday: 'Sábado',
    time: '05:00',
    origin: 'R. García Redondo, 100',
    destination: 'Terminal Rodoviário Novo Rio',
    price: 36.93,
    currency: 'BRL',
    app: 'Uber',
    appLabel: 'UberX'
  },
  {
    id: 'u-02',
    date: '24/Jan',
    weekday: 'Sábado',
    time: '13:00',
    origin: 'Terminal Rodoviário Tietê',
    destination: 'Hotel Domani',
    price: 33.95,
    currency: 'BRL',
    app: 'Uber',
    appLabel: 'UberX'
  },
  {
    id: 'u-03',
    date: '07/Fev',
    weekday: 'Sábado',
    time: '11:30',
    origin: 'Nobile Downtown São Paulo',
    destination: 'Terminal Rodoviário Tietê',
    price: 17.92,
    currency: 'BRL',
    app: 'Uber',
    appLabel: 'UberX',
    isConfirmed: true
  },
  {
    id: '1',
    date: '26/Jan',
    weekday: 'Segunda',
    time: '14:30',
    origin: 'Aeroporto CPT (CPT)',
    destination: 'Airbnb (Sea Point)',
    price: 280,
    currency: 'ZAR',
    app: 'Uber',
    appLabel: 'Uber Black'
  },
  {
    id: '2',
    date: '26/Jan',
    weekday: 'Segunda',
    time: '19:00',
    origin: 'Airbnb (Sea Point)',
    destination: 'V&A Waterfront',
    price: 65,
    currency: 'ZAR',
    app: 'Uber',
    appLabel: 'UberX'
  },
  {
    id: '3',
    date: '26/Jan',
    weekday: 'Segunda',
    time: '21:30',
    origin: 'V&A Waterfront',
    destination: 'Airbnb (Sea Point)',
    price: 85,
    currency: 'ZAR',
    app: 'Bolt',
    appLabel: 'Bolt Premium'
  }
];

const UberBoltList: React.FC = () => {
  const [zarToBrlRate, setZarToBrlRate] = useState<number>(0.32); // 1 ZAR = 0.32 BRL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const rates = await getRates();
        if (rates.ZAR && rates.BRL) {
            setZarToBrlRate(rates.BRL / rates.ZAR);
        }
      } catch (e) {
        console.error("Using fallback rate");
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  // Conversão: BRL to ZAR é 1 / zarToBrlRate
  const brlToZarRate = 1 / zarToBrlRate;

  // Cálculo de Totais
  const totals = RIDES.reduce((acc, ride) => {
    if (ride.currency === 'ZAR') {
      acc.zar += ride.price;
      acc.brl += ride.price * zarToBrlRate;
    } else {
      acc.brl += ride.price;
      acc.zar += ride.price * brlToZarRate;
    }
    return acc;
  }, { zar: 0, brl: 0 });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Calculadora */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl border border-slate-700 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calculator className="w-24 h-24" />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-sa-green font-bold text-[10px] uppercase tracking-widest">
                <Car className="w-4 h-4" /> Resumo Financeiro de Trajetos
            </div>
            
            <div className="flex flex-col gap-1">
                <span className="text-4xl font-display font-black tracking-tight text-white">
                    R$ {totals.brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-medium text-slate-400">
                    Equivalente em Rands: <span className="text-sa-gold font-black">R {totals.zar.toFixed(0)}</span>
                </span>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{RIDES.length} Trajetos Registrados</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-sa-green" />
                  Câmbio: R 1 = R$ {zarToBrlRate.toFixed(2)}
                </span>
            </div>
        </div>
      </div>

      {/* Lista de Corridas */}
      <div className="space-y-4">
        {RIDES.map((ride) => {
            const displayPriceBRL = ride.currency === 'BRL' ? ride.price : ride.price * zarToBrlRate;
            const displayPriceZAR = ride.currency === 'ZAR' ? ride.price : ride.price * brlToZarRate;

            return (
              <div key={ride.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Lateral Color Bar based on App */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ride.app === 'Uber' ? 'bg-black' : 'bg-green-500'}`}></div>

                  <div className="pl-3">
                      {/* Header do Card */}
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                  <CalendarDays className="w-3 h-3" /> {ride.date} • {ride.weekday}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-lg font-black text-slate-800">
                                    <Clock className="w-4 h-4 text-slate-300" /> {ride.time}
                                </span>
                                {ride.isConfirmed && (
                                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Confirmado
                                  </span>
                                )}
                              </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              ride.app === 'Uber' 
                              ? 'bg-black text-white border-black' 
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                              {ride.appLabel || ride.app}
                          </div>
                      </div>

                      {/* Rota */}
                      <div className="relative pl-3 border-l-2 border-dashed border-slate-200 space-y-4 my-4 ml-1">
                          <div className="relative">
                              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Origem</p>
                              <p className="text-xs font-bold text-slate-600 uppercase leading-tight">{ride.origin}</p>
                          </div>
                          <div className="relative">
                              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-sa-green border-2 border-white shadow-sm"></div>
                              <p className="text-[10px] font-bold text-sa-green uppercase leading-none mb-1">Destino</p>
                              <p className="text-sm font-black text-slate-800 uppercase leading-tight">{ride.destination}</p>
                          </div>
                      </div>

                      {/* Footer Preço */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor do Trajeto</span>
                          <div className="text-right">
                              <span className="block text-xl font-display font-black text-slate-800 leading-none">
                                {ride.currency === 'ZAR' ? `R ${ride.price}` : `R$ ${ride.price.toFixed(2)}`}
                              </span>
                              <span className="block text-[10px] font-bold text-sa-green mt-1">
                                  ≈ {ride.currency === 'ZAR' 
                                    ? `R$ ${displayPriceBRL.toFixed(2)}` 
                                    : `R ${displayPriceZAR.toFixed(0)}`}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
            );
        })}
      </div>

      {RIDES.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
              Nenhuma corrida cadastrada ainda.
          </div>
      )}
    </div>
  );
};

export default UberBoltList;
