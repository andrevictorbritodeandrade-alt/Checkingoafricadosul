
import React, { useState } from 'react';
import { 
  Hotel, 
  MapPin, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Plane,
  Users,
  Wallet
} from 'lucide-react';

type CityId = 'DOMANI' | 'CPT_AIRBNB' | 'SANDTON_AIRBNB' | 'SLAVIERO';

interface Accommodation {
  id: CityId;
  name: string;
  provider: 'Airbnb' | 'Hoteis.com';
  dates: string;
  status: 'Confirmada' | 'Pendente';
  price: string;
  neighborhood: string;
  guests: string;
  checkInInfo: string;
  location: string;
  cityLabel: string;
  tripPhase: string;
}

const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'DOMANI',
    tripPhase: 'IDA',
    cityLabel: 'SÃO PAULO',
    name: 'Hotel Domani',
    provider: 'Hoteis.com',
    dates: '24 jan. - 25 jan. de 2026',
    status: 'Confirmada',
    price: 'Já Pago',
    neighborhood: 'Guarulhos, São Paulo',
    location: 'Centro de Guarulhos',
    guests: '2 hóspedes',
    checkInInfo: 'Check-in: sábado, 24 de jan. Check-out: domingo, 25 de jan.'
  },
  {
    id: 'CPT_AIRBNB',
    tripPhase: 'DESTINO 1',
    cityLabel: 'CIDADE DO CABO',
    name: 'Estúdio Sea Point (Craig & Jenna)',
    provider: 'Airbnb',
    dates: '26 jan. – 31 jan. de 2026',
    status: 'Confirmada',
    price: 'R$ 1.888,25',
    neighborhood: 'Sea Point, Cidade do Cabo',
    location: '38 Michau Street',
    guests: '2 hóspedes',
    checkInInfo: 'Check-in: 15:00 • Checkout: 11:00 • Código: HM92D3C8K5'
  },
  {
    id: 'SANDTON_AIRBNB',
    tripPhase: 'DESTINO 2',
    cityLabel: 'JOANESBURGO',
    name: 'Casa de hóspedes em Sandton',
    provider: 'Airbnb',
    dates: '31 de jan. – 6 de fev. de 2026',
    status: 'Confirmada',
    price: 'R$ 1.363,93',
    neighborhood: 'Sandton, Joanesburgo',
    location: 'Quarto em casa de hóspedes',
    guests: '2 hóspedes',
    checkInInfo: 'Status: Confirmada (Pago).'
  },
  {
    id: 'SLAVIERO',
    tripPhase: 'VOLTA',
    cityLabel: 'SÃO PAULO',
    name: 'SLAVIERO Downtown São Paulo',
    provider: 'Hoteis.com',
    dates: '6 fev. - 7 fev. de 2026',
    status: 'Confirmada',
    price: 'Já Pago',
    neighborhood: 'Centro, São Paulo',
    location: 'Rua Araújo, 141',
    guests: '2 hóspedes',
    checkInInfo: 'Check-in: sexta, 6 de fev. Check-out: sábado, 7 de fev.'
  }
];

const AccommodationCard: React.FC<{ item: Accommodation }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-[32px] border-2 overflow-hidden shadow-xl bg-white transition-all mb-6 ${
      item.status === 'Pendente' ? 'border-amber-200' : 'border-slate-200'
    }`}>
      <div className={`p-3 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
        item.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-700 text-white'
      }`}>
        {item.status === 'Pendente' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        Reserva {item.status.toLowerCase()}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {item.tripPhase}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.provider}</span>
            </div>
            <h2 className="text-xl font-display font-black text-slate-800 leading-tight uppercase">{item.name}</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">{item.location}</p>
          </div>
          <div className={`p-3 rounded-2xl border shadow-sm ${item.status === 'Pendente' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
             <Hotel className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <CalendarDays className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <span>{item.dates}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <span>{item.neighborhood}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <Users className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <span>{item.guests}</span>
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 font-black text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-200/50"
        >
          {expanded ? 'OCULTAR DETALHES' : 'VER DETALHES DO CHECK-IN'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-4 p-5 bg-slate-50 rounded-[24px] border border-slate-200/50 animate-in fade-in slide-in-from-top-2">
             <div className="space-y-3">
                <div className="flex items-start gap-3">
                   <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-slate-600 leading-relaxed italic">
                     Informação extraída do seu comprovante de reserva.
                   </p>
                </div>
                <div className="flex items-start gap-3">
                   <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                     {item.checkInInfo}
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className={`p-4 px-6 flex justify-between items-center ${item.status === 'Pendente' ? 'bg-amber-50/50' : 'bg-slate-50'}`}>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Total da Estadia
          </span>
          <div className="text-right">
            <span className={`text-xl font-display font-black ${item.status === 'Pendente' ? 'text-amber-700' : 'text-slate-700'}`}>
              {item.price}
            </span>
          </div>
      </div>
    </div>
  );
};

const AccommodationList: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-200 flex items-start gap-4">
         <div className="bg-slate-700 text-white p-2 rounded-xl shrink-0">
            <Plane className="w-4 h-4" />
         </div>
         <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
            Painel de reservas oficiais. As hospedagens estão listadas em ordem cronológica de acordo com o seu roteiro.
         </p>
      </div>

      <div className="space-y-12">
        {Array.from(new Set(ACCOMMODATIONS.map(a => a.cityLabel))).map(city => (
            <div key={city} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-0.5 flex-1 bg-slate-200"></div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{city}</h3>
                    <div className="h-0.5 flex-1 bg-slate-200"></div>
                </div>
                
                {ACCOMMODATIONS.filter(a => a.cityLabel === city).map(acc => (
                    <AccommodationCard key={acc.id} item={acc} />
                ))}
            </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Boa estada, André e Marcelly! 🏠
        </p>
      </div>
    </div>
  );
};

export default AccommodationList;
