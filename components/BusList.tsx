import React, { useMemo } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Zap, 
  Armchair, 
  Snowflake, 
  Ticket,
  CalendarDays,
  User,
  Info,
  Car,
  Navigation,
  Wallet,
  Calculator,
  CheckCircle2
} from 'lucide-react';

interface UberOption {
  type: string;
  price: string;
  desc: string;
  recommended?: boolean;
  confirmed?: boolean;
}

interface BusTrip {
  id: string;
  type: 'ida' | 'volta';
  origin: string;
  destination: string;
  terminalOrigin: string;
  terminalDest: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  company: string;
  classType: string;
  features: string[];
  price: string;
  date: string;
  fullDate: string;
  firstMile?: {
    title: string;
    origin: string;
    dest: string;
    options: UberOption[];
  };
  lastMile?: {
    title: string;
    origin: string;
    dest: string;
    options: UberOption[];
  };
}

const BUS_DATA: BusTrip[] = [
  {
    id: 'bus-ida-rio-sp',
    type: 'ida',
    origin: 'Rio de Janeiro',
    terminalOrigin: 'Rod. Novo Rio',
    destination: 'São Paulo',
    terminalDest: 'Term. Rod. Tietê',
    departureTime: '06:30',
    arrivalTime: '12:30',
    duration: '06h 00m',
    company: 'Penha',
    classType: 'Semi-Leito',
    features: ['Ar-condicionado', 'Banheiro', 'Tomada USB', 'Conforto'],
    price: 'R$ 127,98',
    date: '24/Jan',
    fullDate: '24/01/2026',
    lastMile: {
      title: 'Conexão Final: Rodoviária → Hotel',
      origin: 'Terminal Rodoviário Tietê',
      dest: 'Hotel Domani (Guarulhos)',
      options: [
        { type: 'UberX', price: 'R$ 33,95', desc: 'Valor real conforme reserva (4 passageiros)', recommended: true },
        { type: 'Uber Comfort', price: 'R$ 41,50', desc: 'Carros mais novos e espaçosos' },
        { type: 'Uber Black', price: 'R$ 58,90', desc: 'Experiência Premium' }
      ]
    }
  },
  {
    id: 'bus-volta-sp-rio',
    type: 'volta',
    origin: 'São Paulo',
    terminalOrigin: 'Term. Rod. Tietê',
    destination: 'Rio de Janeiro',
    terminalDest: 'Rod. Novo Rio',
    departureTime: '13:00',
    arrivalTime: '19:00',
    duration: '06h 00m',
    company: 'Penha',
    classType: 'Semi-Leito',
    features: ['Ar-condicionado', 'Banheiro', 'Reclina 135º'],
    price: 'R$ 90,98',
    date: '07/Fev',
    fullDate: '07/02/2026',
    firstMile: {
      title: 'Reserva Confirmada: Estadia → Rodoviária',
      origin: 'Nobile Downtown São Paulo',
      dest: 'Terminal Rodoviário Tietê',
      options: [
        { type: 'UberX', price: 'R$ 17,92', desc: 'Reserva Confirmada às 11:30 BRT', recommended: true, confirmed: true },
        { type: 'Comfort', price: 'R$ 22,50', desc: 'Carros mais novos' }
      ]
    }
  }
];

const parseCurrency = (valueStr: string): number => {
  return parseFloat(valueStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
};

const toCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const BusList: React.FC = () => {
  
  const totals = useMemo(() => {
    let busTotal = 0;
    let uberTotal = 0;

    BUS_DATA.forEach(trip => {
      busTotal += parseCurrency(trip.price) * 2;

      if (trip.firstMile) {
         const cheapestFirst = Math.min(...trip.firstMile.options.map(o => parseCurrency(o.price)));
         uberTotal += cheapestFirst;
      }

      if (trip.lastMile) {
         const cheapestLast = Math.min(...trip.lastMile.options.map(o => parseCurrency(o.price)));
         uberTotal += cheapestLast;
      }
    });

    return { busTotal, uberTotal, grandTotal: busTotal + uberTotal };
  }, []);

  const renderUberCard = (data: { title: string, origin: string, dest: string, options: UberOption[] }, type: 'first' | 'last') => (
    <div className={`bg-slate-900 text-white rounded-3xl p-5 shadow-2xl relative overflow-hidden border border-slate-700 ${type === 'first' ? 'mb-4' : 'mt-4'}`}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mercator_projection_Square.JPG/1200px-Mercator_projection_Square.JPG')] bg-cover mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Car className="w-4 h-4" /> {data.title}
            </div>
            {data.options.some(o => o.confirmed) && (
              <span className="flex items-center gap-1 bg-green-900/40 text-green-400 text-[9px] px-2 py-0.5 rounded-full border border-green-800">
                <CheckCircle2 className="w-3 h-3" /> RESERVADO
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span className="text-sm font-medium opacity-80">{data.origin}</span>
            </div>
            <div className="w-0.5 h-3 bg-slate-600 ml-[3px]"></div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${type === 'first' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}></div>
                <span className="text-sm font-bold text-white">{data.dest}</span>
            </div>
          </div>

          <div className="space-y-2">
            {data.options.map((opt, i) => (
              <div key={i} className={`flex justify-between items-center p-3 rounded-xl border ${opt.recommended ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{opt.type}</span>
                        {opt.confirmed ? (
                          <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Confirmado</span>
                        ) : opt.recommended && (
                          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Melhor Opção</span>
                        )}
                    </div>
                    <span className={`text-[10px] block mt-0.5 ${opt.recommended ? 'text-slate-500' : 'text-slate-500'}`}>{opt.desc}</span>
                  </div>
                  <span className="font-display font-black text-lg">{opt.price}</span>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-slate-500 mt-3 text-center italic">
            * Dados extraídos da reserva confirmada no aplicativo Uber.
          </p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-2xl shadow-sm">
        <h3 className="font-display font-black text-amber-800 uppercase text-[10px] tracking-widest mb-1 flex items-center gap-2">
          <Bus className="w-4 h-4" /> Logística Terrestre
        </h3>
        <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
          Trajetos Rodoviários (Rio x SP).
        </p>
      </div>

      {BUS_DATA.map((trip) => (
        <div key={trip.id} className="space-y-4">
          
          {trip.firstMile && renderUberCard(trip.firstMile, 'first')}

          <div className={`rounded-3xl overflow-hidden shadow-xl border-2 relative group transition-all hover:shadow-2xl ${trip.type === 'ida' ? 'bg-white border-amber-100 hover:border-amber-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
            
            <div className={`p-4 text-white relative overflow-hidden ${trip.type === 'ida' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-slate-600 to-slate-800'}`}>
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
              
              <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <Bus className="w-4 h-4" />
                    <span className="font-display font-black uppercase tracking-wider text-xs">{trip.type === 'ida' ? 'IDA / DECOLAGEM' : 'VOLTA / RETORNO'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-xs bg-black/20 px-2 py-1 rounded-lg">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {trip.fullDate}
                  </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-8 relative">
                  <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10"></div>
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-gray-400 flex items-center gap-1 border border-gray-100 rounded-full">
                      <Clock className="w-3 h-3" /> {trip.duration}
                  </div>

                  <div className="text-left">
                      <span className="block text-3xl font-black text-slate-800 tracking-tighter">{trip.departureTime}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase mt-1 block">{trip.origin}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">{trip.terminalOrigin}</span>
                  </div>

                  <div className="text-right">
                      <span className="block text-3xl font-black text-slate-800 tracking-tighter">{trip.arrivalTime}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase mt-1 block">{trip.destination}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">{trip.terminalDest}</span>
                  </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-5">
                  <div className="flex justify-between items-center mb-3">
                      <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Viação / Empresa</span>
                          <span className="font-black text-slate-800 text-lg flex items-center gap-2">
                              {trip.company} 
                              <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-md font-bold uppercase">Confirmado</span>
                          </span>
                      </div>
                      <div className="text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Classe</span>
                          <span className="font-bold text-gray-700 text-sm bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
                              {trip.classType}
                          </span>
                      </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/50">
                      {trip.features.map((feat, i) => (
                          <span key={i} className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                              {feat.includes('USB') && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-100" />}
                              {feat.includes('Ar') && <Snowflake className="w-3 h-3 text-blue-400" />}
                              {feat.includes('Banheiro') && <Ticket className="w-3 h-3 text-gray-400" />}
                              {feat.includes('Conforto') && <Armchair className="w-3 h-3 text-purple-400" />}
                              {feat.includes('Reclina') && <Armchair className="w-3 h-3 text-purple-400" />}
                              {feat}
                          </span>
                      ))}
                  </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3" /> Passageiro
                      </span>
                      <span className="text-xs font-bold text-gray-600 mt-0.5">Preço por pessoa</span>
                  </div>
                  <div className="text-right">
                      <span className="block text-3xl font-display font-black text-slate-800 tracking-tight">{trip.price}</span>
                  </div>
              </div>
            </div>
          </div>

          {trip.lastMile && renderUberCard(trip.lastMile, 'last')}
        </div>
      ))}

      <div className="bg-slate-900 text-white rounded-[30px] p-6 shadow-2xl mt-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 p-2.5 rounded-xl text-slate-900">
                <Calculator className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-display font-black text-lg leading-none">Resumo Financeiro</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logística Terrestre Total</span>
            </div>
        </div>

        <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-2">
                        <Bus className="w-4 h-4 text-amber-500" /> Passagens
                    </span>
                    <span className="text-[10px] text-slate-400">Ida e Volta (2 Pessoas)</span>
                </div>
                <span className="font-mono font-bold">{toCurrency(totals.busTotal)}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-2">
                        <Car className="w-4 h-4 text-green-500" /> Uber Total
                    </span>
                    <span className="text-[10px] text-slate-400">Menor valor por trecho (1 Carro)</span>
                </div>
                <span className="font-mono font-bold">{toCurrency(totals.uberTotal)}</span>
            </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Custo Final Estimado</span>
            <span className="text-3xl font-display font-black text-green-400 tracking-tight">
                {toCurrency(totals.grandTotal)}
            </span>
        </div>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">
            Boa viagem! 🚌
        </p>
      </div>
    </div>
  );
};

export default BusList;