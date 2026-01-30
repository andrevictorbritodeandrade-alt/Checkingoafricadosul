
import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Calendar, 
  Utensils, 
  Camera, 
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Bus,
  RefreshCw,
  ShieldCheck,
  Zap,
  DollarSign,
  Shirt,
  CloudRain,
  Wind,
  Droplets,
  Plane,
  AlertTriangle,
  Navigation,
  Plus,
  Sparkles,
  Waves,
  ThermometerSun,
  ExternalLink,
  ClipboardList,
  Phone,
  Globe,
  WifiOff,
  Headphones,
  CreditCard,
  Search
} from 'lucide-react';
import { Map, Marker } from 'pigeon-maps';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';

export const GUIDE_STORAGE_KEY = 'checkin_go_guides_v2';

// --- INTERFACES ---

interface ActivityPlan {
  type: 'plan_a' | 'plan_b' | 'food' | 'security' | 'info' | 'flight';
  text: string;
  label?: string;
}

interface DayWeather {
  icon: string;
  temp: string;
  min: string;
  feels: string;
  rain: string;
  wind: string;
  sea?: string;
}

interface Possibility {
  id: string;
  title: string;
  description: string;
  estimatedPrice: string;
  contact: string;
  location: [number, number];
  tags: string[];
}

interface DailyPlan {
  day: number;
  weekday: string;
  date: string;
  title: string;
  weather: DayWeather;
  plans: ActivityPlan[];
  map: {
    center: [number, number];
    zoom: number;
    markers: [number, number][];
  };
  estimate: string;
  estimateLabel: string;
  look: string;
  isDeparture?: boolean;
  isArrival?: boolean;
}

interface GuideData {
  CPT: DailyPlan[];
  JNB: DailyPlan[];
  possibilities: {
    CPT: Possibility[];
    JNB: Possibility[];
  };
}

// --- DADOS PADRÃO (OFFLINE FIRST) ---

const DEFAULT_GUIDE: GuideData = {
  CPT: [
    {
      day: 26,
      weekday: 'SEGUNDA',
      date: 'JAN',
      isArrival: true,
      title: 'Chegada e Logística de Desembarque',
      weather: { icon: '☀️', temp: '27°', min: '17°', feels: '28°', rain: '0%', wind: '22km/h', sea: '14°' },
      plans: [
        { type: 'flight', text: 'Conexão Luanda (3h): Área de trânsito. Use Inter/Wise via aproximação. (AOA)' },
        { type: 'info', text: 'Conexão JNB (3h): Saque Rands no Standard Bank ou FNB. Recuse a conversão (Decline Conversion)!' },
        { type: 'flight', text: 'Chegada CPT (Voo Interno): Use o Wi-Fi grátis do aeroporto para chamar o Uber.' },
        { type: 'security', text: 'Logística Uber: Siga placas "E-Hailing" -> Parkade P1 (Ground Floor/Térreo). Ignore ofertas de táxi no saguão.' },
        { type: 'plan_a', label: 'UBER', text: 'Vá direto para o Airbnb em Sea Point (38 Michau St). ~R$ 150. Prefira Uber ao Bolt em CPT.' },
        { type: 'plan_b', label: 'ECONÔMICO', text: 'Ônibus MyCiti. Sai do terminal para o Civic Centre por R$ 30.' },
        { type: 'info', text: 'Dica Sensorial (QCY): Use os fones no Parkade/Garagem para evitar o barulho.' },
        { type: 'food', text: 'Jantar: V&A Waterfront (Perto do Airbnb) - Seguro e com muitas opções.' }
      ],
      map: { center: [-33.9145, 18.4239], zoom: 12, markers: [[-33.9145, 18.4239]] },
      estimate: 'R$ 280',
      estimateLabel: 'Uber Black + Jantar Waterfront',
      look: 'Aerolook em camadas (Ar gelado no voo, vento fresco no desembarque).'
    },
    {
      day: 27,
      weekday: 'TERÇA',
      date: 'JAN',
      title: 'Montanhas, Praias e Futebol',
      weather: { icon: '🌬️', temp: '28°', min: '18°', feels: '29°', rain: '0%', wind: '38km/h', sea: '15°' },
      plans: [
        { type: 'plan_a', label: 'PLANO A', text: 'Subida de Bondinho (Cableway) na Table Mountain (~R$ 250 casal). Vista panorâmica sem esforço.' },
        { type: 'plan_b', label: 'PLANO B', text: 'Trilha "Platteklip Gorge" (Grátis, mas cansativo, 2h subida) OU Pôr do sol no Signal Hill (Grátis, vá de Uber) com piquenique.' },
        { type: 'info', text: '⚽ Jogo: Cape Town City FC vs AmaTuks às 15h30 no Athlone Stadium.' },
        { type: 'food', text: 'Jantar: Mojo Market (Sea Point) - Opções baratas e música ao vivo.' }
      ],
      map: { center: [-33.9608, 18.4131], zoom: 12, markers: [[-33.9608, 18.4131], [-33.9185, 18.3944]] },
      estimate: 'R$ 300',
      estimateLabel: 'Bondinho ou Trilha',
      look: 'Tênis obrigatório se fizer trilha. Casaco corta-vento (Vento Forte!).'
    },
    {
      day: 28,
      weekday: 'QUARTA',
      date: 'JAN',
      title: 'Vinhos & Chocolate (Confirmado)',
      weather: { icon: '⛅', temp: '25°', min: '16°', feels: '26°', rain: '5%', wind: '18km/h', sea: '15°' },
      plans: [
        { type: 'plan_a', label: 'AGENDADO', text: '10:30: Groot Constantia (Ref: 7whdlc). "Visitors Route + Chocolate" (CONFIRMADO).' },
        { type: 'info', text: 'Inclui: 5 Vinhos harmonizados com 5 Chocolates, entrada nos Museus, Tour na Adega e Taça de Cristal.' },
        { type: 'info', text: 'Custo ~R$ 90/pessoa. Dica: Baixe o app VoiceMap para o audio guide.' },
        { type: 'food', text: 'Almoço: Restaurante Jonkershuis ou Simons dentro da vinícola.' },
        { type: 'info', text: 'Tarde: The Watershed (V&A Waterfront) para artesanato ou relaxar.' }
      ],
      map: { center: [-34.0281, 18.4239], zoom: 13, markers: [[-34.0281, 18.4239]] },
      estimate: 'R$ 560',
      estimateLabel: 'Groot Constantia (Já pago)',
      look: 'Casual elegante (fotos na vinícola).'
    },
    {
      day: 29,
      weekday: 'QUINTA',
      date: 'JAN',
      title: 'Cores e Sabores',
      weather: { icon: '☀️', temp: '30°', min: '19°', feels: '32°', rain: '0%', wind: '20km/h', sea: '16°' },
      plans: [
        { type: 'info', text: 'Manhã: Bo-Kaap (Casas Coloridas). Grátis para andar e tirar fotos.' },
        { type: 'plan_a', label: 'PLANO A', text: 'Almoço em restaurante típico Malalo no Bo-Kaap.' },
        { type: 'plan_b', label: 'PLANO B', text: 'Almoço no "Eastern Food Bazaar". Comida indiana/asiática deliciosa por R$ 20-30 o prato.' },
        { type: 'security', text: 'Segurança: Não ande no centro (CBD) após as 17h30.' }
      ],
      map: { center: [-33.9197, 18.4168], zoom: 14, markers: [[-33.9197, 18.4168]] },
      estimate: 'R$ 180',
      estimateLabel: 'Comida barata no centro',
      look: 'Roupas coloridas para fotos no Bo-Kaap.'
    },
    {
      day: 30,
      weekday: 'SEXTA',
      date: 'JAN',
      title: 'Dia Livre / Praias',
      weather: { icon: '☀️', temp: '29°', min: '19°', feels: '30°', rain: '0%', wind: '12km/h', sea: '17°' },
      plans: [
        { type: 'info', text: 'Sugestão: Praias de Clifton ou Camps Bay para curtir o mar gelado.' },
        { type: 'info', text: 'Despedida: Pôr do sol clássico na orla.' }
      ],
      map: { center: [-33.9401, 18.3776], zoom: 13, markers: [[-33.9401, 18.3776]] },
      estimate: 'R$ 350',
      estimateLabel: 'Último dia',
      look: 'Roupa de banho e protetor solar.'
    },
    {
      day: 31,
      weekday: 'SÁBADO',
      date: 'JAN',
      isDeparture: true,
      title: 'Ida para Joanesburgo',
      weather: { icon: '☀️', temp: '26°', min: '16°', feels: '26°', rain: '5%', wind: '25km/h', sea: '15°' },
      plans: [
        { type: 'info', text: 'Manhã livre. Voo para JNB à noite.' },
        { type: 'plan_b', label: 'PLANO B (Econômico)', text: 'Use o MyCiti Bus para ir ao aeroporto se estiver perto de uma parada.' }
      ],
      map: { center: [-33.9694, 18.5971], zoom: 13, markers: [[-33.9694, 18.5971]] },
      estimate: 'R$ 200',
      estimateLabel: 'Uber + Comida + Ingressos',
      look: 'Roupa de viagem.'
    }
  ],
  JNB: [
    {
      day: 1,
      weekday: 'DOMINGO',
      date: 'FEV',
      title: 'História, Jogo do Povo & Melville',
      weather: { icon: '⛅', temp: '28°', min: '16°', feels: '29°', rain: '30%', wind: '12km/h' },
      plans: [
        { type: 'info', text: 'Manhã: Acorde na sua base "84 on Fourth" em Melville.' },
        { type: 'plan_a', label: 'UBER', text: '09:00: Uber para Soweto (Vilakazi St). Visite a Mandela House e Memorial Hector Pieterson.' },
        { type: 'food', text: 'Almoço: Sakhumzi Restaurant (Vilakazi St). Comida típica e vibração da torcida.' },
        { type: 'info', text: 'Tarde: Uber para FNB Stadium (Soccer City).' },
        { type: 'plan_a', label: 'EVENTO', text: '⚽ JOGO: Kaizer Chiefs vs Zesco United (CAF). A entrada é elétrica!' },
        { type: 'food', text: 'Noite: Retorno para Melville. Jantar relaxante na 7th Street (5 min a pé).' }
      ],
      map: { center: [-26.2348, 27.9734], zoom: 12, markers: [[-26.2348, 27.9734], [-26.2384, 27.9056]] },
      estimate: 'R$ 460',
      estimateLabel: 'Soweto e Jogo (Uber/Bolt)',
      look: 'Camisa Amarela/Preta (Chiefs) + Tênis.'
    },
    {
      day: 2,
      weekday: 'SEGUNDA',
      date: 'FEV',
      title: 'O Peso da História e o Ouro',
      weather: { icon: '⛈️', temp: '25°', min: '15°', feels: '27°', rain: '70%', wind: '15km/h' },
      plans: [
        { type: 'plan_a', label: 'CULTURA', text: 'Manhã: Apartheid Museum. Reserve pelo menos 3 horas. É profundo e necessário.' },
        { type: 'plan_b', label: 'DIVERSÃO', text: 'Tarde: Gold Reef City (Ao lado). Parque temático numa mina de ouro.' },
        { type: 'info', text: 'Atividade: Faça o "Mine Tour" para descer na mina de verdade.' },
        { type: 'security', text: 'Dica: É um dia mais caro de ingressos, mas vale cada centavo.' }
      ],
      map: { center: [-26.2366, 28.0069], zoom: 14, markers: [[-26.2366, 28.0069], [-26.2392, 28.0128]] },
      estimate: 'R$ 530',
      estimateLabel: 'Combo Museu + Gold Reef',
      look: 'Tênis confortável. Anda-se muito. Leve capa de chuva.'
    },
    {
      day: 3,
      weekday: 'TERÇA',
      date: 'FEV',
      title: 'Vista Panorâmica & Red Bus',
      weather: { icon: '☁️', temp: '27°', min: '16°', feels: '28°', rain: '40%', wind: '10km/h' },
      plans: [
        { type: 'plan_a', label: 'PASSEIO', text: 'Manhã: Uber até Constitution Hill (Antigo forte/prisão e atual Corte Constitucional).' },
        { type: 'plan_b', label: 'RED BUS', text: 'Tarde: Embarque no "City Sightseeing Red Bus" (Green Tour) na parada da Constitution Hill.' },
        { type: 'info', text: 'Parada Sugerida: Desça em Rosebank para o Mercado de Artesanato e passar no Pick n Pay.' },
        { type: 'security', text: 'Segurança: O Red Bus é a forma mais segura de ver o centro da cidade.' }
      ],
      map: { center: [-26.1895, 28.0422], zoom: 12, markers: [[-26.1895, 28.0422]] },
      estimate: 'R$ 430',
      estimateLabel: 'Red Bus Ticket',
      look: 'Urbano e leve.'
    },
    {
      day: 4,
      weekday: 'QUARTA',
      date: 'FEV',
      title: 'Safari: Leão & Girafa',
      weather: { icon: '☀️', temp: '30°', min: '17°', feels: '33°', rain: '10%', wind: '8km/h' },
      plans: [
        { type: 'plan_a', label: 'DIA TODO', text: 'Dia todo: Lion & Safari Park (40 min de Melville).' },
        { type: 'info', text: 'Atividade: Safári Guiado (Guided Game Drive). Veja leões, guepardos e girafas de perto.' },
        { type: 'security', text: 'Experiência: Ambiente controlado e seguro, perfeito para quem tem pouco tempo.' }
      ],
      map: { center: [-25.8906, 27.8864], zoom: 12, markers: [[-25.8906, 27.8864]] },
      estimate: 'R$ 700',
      estimateLabel: 'Lion Park Tour',
      look: 'Cores neutras (Bege/Verde) + Chapéu. Sol forte!'
    },
    {
      day: 5,
      weekday: 'QUINTA',
      date: 'FEV',
      isDeparture: true,
      title: 'Compras & Despedida',
      weather: { icon: '⛈️', temp: '24°', min: '15°', feels: '26°', rain: '65%', wind: '14km/h' },
      plans: [
        { type: 'plan_a', label: 'SHOPPING', text: 'Manhã: Sandton City Mall e Nelson Mandela Square. Compras de camisas e presentes.' },
        { type: 'food', text: 'Almoço: Na praça da estátua gigante de Mandela.' },
        { type: 'info', text: 'Tarde: Retorno para Melville. Relaxar na piscina do 84 on Fourth e arrumar malas.' },
        { type: 'flight', text: '21:30: Uber para Aeroporto OR Tambo (Trajeto 40min).' },
        { type: 'flight', text: 'Voo de volta: 00h45 (Madrugada de Quinta p/ Sexta).' }
      ],
      map: { center: [-26.1075, 28.0567], zoom: 13, markers: [[-26.1075, 28.0567]] },
      estimate: 'R$ 400',
      estimateLabel: 'Jantar + Uber Aeroporto',
      look: 'Confortável para viagem longa.'
    },
    {
      day: 6,
      weekday: 'SEXTA',
      date: 'FEV',
      isDeparture: true,
      title: 'Retorno ao Brasil',
      weather: { icon: '⛅', temp: '25°', min: '14°', feels: '25°', rain: '40%', wind: '12km/h' },
      plans: [
        { type: 'flight', text: 'Voo em andamento. Chegada em GRU prevista para a tarde.' }
      ],
      map: { center: [-23.4356, -46.4731], zoom: 10, markers: [[-23.4356, -46.4731]] },
      estimate: 'R$ 0',
      estimateLabel: 'Voo Internacional',
      look: 'Confortável.'
    }
  ],
  possibilities: {
    CPT: [
      {
        id: 'robben',
        title: 'Robben Island',
        description: 'Prisão onde Nelson Mandela ficou. Os ingressos esgotam semanas antes.',
        estimatedPrice: 'R600 (R$ 190)',
        contact: 'robben-island.org.za',
        location: [-33.805, 18.369],
        tags: ['História', 'Importante']
      },
      {
        id: 'kirstenbosch',
        title: 'Jardim Botânico Kirstenbosch',
        description: 'Um dos maiores do mundo. Ideal para piquenique. Veja se tem shows no domingo (Summer Sunset Concerts).',
        estimatedPrice: 'R220 (R$ 70)',
        contact: 'webtickets.co.za',
        location: [-33.987, 18.432],
        tags: ['Natureza', 'Relax']
      },
      {
        id: 'aquarium',
        title: 'Two Oceans Aquarium',
        description: 'No V&A Waterfront. Excelente opção para dias de muito vento ou chuva.',
        estimatedPrice: 'R250 (R$ 80)',
        contact: 'aquarium.co.za',
        location: [-33.907, 18.416],
        tags: ['Indoor', 'Chuva']
      },
      {
        id: 'oranjezicht',
        title: 'Oranjezicht City Farm Market',
        description: 'Mercado gastronômico incrível perto do Waterfront. Apenas Sábados e Domingos de manhã/tarde.',
        estimatedPrice: 'Entrada Grátis',
        contact: 'ozcf.co.za',
        location: [-33.908, 18.411],
        tags: ['Comida', 'Local']
      },
      {
        id: 'boulders',
        title: 'Boulders Beach (Pinguins)',
        description: 'Praia dos Pinguins em Simon\'s Town. Pode ser combinado com o Cabo da Boa Esperança.',
        estimatedPrice: 'R190 (R$ 60)',
        contact: 'sanparks.org',
        location: [-34.197, 18.451],
        tags: ['Animais', 'Foto']
      }
    ],
    JNB: []
  }
};

const PlanItem: React.FC<{ plan: ActivityPlan }> = ({ plan }) => {
  const getStyle = () => {
    switch(plan.type) {
      case 'plan_a': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'plan_b': return 'bg-green-50 text-green-700 border-green-100';
      case 'security': return 'bg-red-50 text-red-700 border-red-100';
      case 'food': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'flight': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-white text-slate-700 border-transparent';
    }
  };

  const getIcon = () => {
    switch(plan.type) {
      case 'plan_a': return <Zap className="w-3.5 h-3.5 shrink-0" />;
      case 'plan_b': return <RefreshCw className="w-3.5 h-3.5 shrink-0" />;
      case 'security': return <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
      case 'food': return <Utensils className="w-3.5 h-3.5 shrink-0" />;
      case 'flight': return <Bus className="w-3.5 h-3.5 shrink-0" />;
      default: return <div className="w-1.5 h-1.5 rounded-full bg-sa-green shrink-0 mt-1.5 ml-1"></div>;
    }
  };

  return (
    <div className={`p-3 rounded-xl border flex gap-2.5 mb-2 shadow-sm ${getStyle()}`}>
      {getIcon()}
      <div className="text-[11px] leading-relaxed font-bold">
        {plan.label && <span className="uppercase tracking-tighter mr-1.5">{plan.label}:</span>}
        {plan.text}
      </div>
    </div>
  );
};

const PossibilityCard: React.FC<{ item: Possibility }> = ({ item }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.location[0]},${item.location[1]}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-4 mb-3 relative overflow-hidden group hover:border-sa-green/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-black text-slate-700 uppercase leading-tight">{item.title}</h4>
        <a 
          href={googleMapsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-slate-50 text-slate-400 p-1.5 rounded-lg hover:bg-sa-green hover:text-white transition-colors"
        >
          <MapIcon className="w-4 h-4" />
        </a>
      </div>
      
      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{item.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {item.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase">
            {tag}
          </span>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <DollarSign className="w-3 h-3" /> Valor Estimado
          </span>
          <span className="text-[10px] font-bold text-slate-700">{item.estimatedPrice}</span>
        </div>
        <div className="w-[1px] h-6 bg-slate-200"></div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <Globe className="w-3 h-3" /> Contato / Site
          </span>
          <span className="text-[10px] font-bold text-blue-600 truncate max-w-[120px]">{item.contact}</span>
        </div>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ plan: DailyPlan; city: string }> = ({ plan, city }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${plan.map.center[0]},${plan.map.center[1]}`;

  return (
    <div className="flex gap-4 mb-8">
      {/* Coluna Lateral de Clima + Sensação Térmica + Mar (Se CPT) */}
      <div className="flex flex-col items-center shrink-0 w-16">
        <div className={`w-14 py-2 rounded-2xl flex flex-col items-center shadow-md mb-2 ${plan.isDeparture ? 'bg-sa-gold text-white' : plan.isArrival ? 'bg-sa-blue text-white' : 'bg-blue-50 text-blue-800'}`}>
          <span className="text-xl font-black leading-none">{plan.day}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{plan.date}</span>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-2 w-14 flex flex-col items-center gap-1 shadow-sm text-slate-400">
           <span className="text-lg leading-none mb-1">{plan.weather.icon}</span>
           <div className="flex flex-col items-center leading-none mb-1">
              <span className="text-xs font-black text-slate-800">{plan.weather.temp}</span>
              <span className="text-[8px] font-bold">{plan.weather.min}</span>
           </div>
           
           <div className="flex flex-col items-center gap-1 w-full pt-1 border-t border-slate-50 opacity-60">
              <div className="flex flex-col items-center gap-0.5 mb-1">
                 <span className="text-[7px] font-black uppercase text-sa-gold leading-none">Sens.</span>
                 <span className="text-[9px] font-black text-slate-800">{plan.weather.feels}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[8px] font-bold">
                <CloudRain className="w-2.5 h-2.5" /> {plan.weather.rain}
              </div>
              <div className="flex items-center gap-0.5 text-[8px] font-bold">
                <Wind className="w-2.5 h-2.5" /> {plan.weather.wind}
              </div>
              {/* Temperatura do Mar Especial APENAS para CPT */}
              {city === 'CPT' && plan.weather.sea && (
                <div className="flex items-center gap-0.5 text-[8px] font-black text-sa-blue mt-0.5 border-t border-slate-100 pt-1 w-full justify-center">
                  <Waves className="w-2.5 h-2.5" /> {plan.weather.sea}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Card de Roteiro */}
      <div className={`flex-1 rounded-[28px] border-2 bg-white shadow-lg overflow-hidden flex flex-col ${plan.isDeparture || plan.isArrival ? 'border-sa-gold/30' : 'border-slate-50'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.weekday}</span>
                {plan.isDeparture && <span className="bg-sa-gold text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1"><Plane className="w-2.5 h-2.5" /> PARTIDA</span>}
                {plan.isArrival && <span className="bg-sa-blue text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1"><Navigation className="w-2.5 h-2.5" /> CHEGADA</span>}
             </div>
             <ChevronDown className="w-4 h-4 text-slate-300" />
          </div>
          <h4 className="text-lg font-display font-black text-slate-800 leading-tight mb-4 uppercase">{plan.title}</h4>
          
          <div className="space-y-1">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Clock className="w-3.5 h-3.5" /> Roteiro
             </div>
             {(plan.plans as ActivityPlan[]).map((p, idx) => <PlanItem key={idx} plan={p} />)}
          </div>

          {/* Map Clicável */}
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-4 block rounded-2xl overflow-hidden border border-slate-100 shadow-inner h-32 relative group active:scale-[0.98] transition-all"
          >
            <Map height={128} center={plan.map.center} zoom={plan.map.zoom} mouseWheel={false} touchEvents={false}>
              {plan.map.markers.map((pos, i) => <Marker key={i} width={30} anchor={pos} color="#007749" />)}
            </Map>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            <div className="absolute top-2 right-2 bg-sa-blue/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase flex items-center gap-1.5 shadow-lg border border-white/20">
               <ExternalLink className="w-2.5 h-2.5" /> Abrir no Maps
            </div>
            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-black text-slate-500 uppercase flex items-center gap-1 shadow-sm">
               <Navigation className="w-2.5 h-2.5" /> {plan.map.markers.length} Locais
            </div>
          </a>

          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-end">
             <div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                   <DollarSign className="w-3 h-3" /> Estimativa (Casal)
                </div>
                <p className="text-[9px] text-sa-green font-bold">{plan.estimateLabel}</p>
             </div>
             <div className="text-right">
                <span className="text-xl font-display font-black text-sa-green leading-none">{plan.estimate}</span>
                <p className="text-[8px] font-bold text-slate-300 uppercase leading-none mt-1">Uber + Comida + Ingressos</p>
             </div>
          </div>
        </div>

        <div className="bg-slate-50/50 p-4 border-t border-slate-50">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Shirt className="w-3.5 h-3.5" /> Look & Dicas
              </span>
              <Plus className="w-3.5 h-3.5 text-slate-300" />
           </div>
           <div className="flex gap-2.5 items-start">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{plan.look}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const GoldenTips: React.FC = () => (
  <div className="bg-white rounded-3xl border-2 border-slate-100 p-5 mb-8 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <ShieldCheck className="w-5 h-5 text-sa-green" />
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dicas de Ouro</h3>
    </div>
    
    <div className="space-y-3">
       <div className="flex gap-3 items-start">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
             <CreditCard className="w-4 h-4" />
          </div>
          <div>
             <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">Estratégia Financeira</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Use Inter (Virtual) via aproximação e Wise (Físico) apenas para saques. Recuse a conversão no ATM!</p>
          </div>
       </div>

       <div className="flex gap-3 items-start">
          <div className="p-2 bg-sa-gold/10 text-sa-gold rounded-xl">
             <Headphones className="w-4 h-4" />
          </div>
          <div>
             <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">Conforto Sensorial</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Use os fones QCY em Luanda e no Parkade de CPT para gerenciar o ruído e ansiedade.</p>
          </div>
       </div>
       
       <div className="flex gap-3 items-start">
          <div className="p-2 bg-red-50 text-red-500 rounded-xl">
             <WifiOff className="w-4 h-4" />
          </div>
          <div>
             <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">Modo Híbrido</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Este guia funciona 100% offline. Ideal para consultar durante o voo ou na rua.</p>
          </div>
       </div>
    </div>
  </div>
);

const GuideList: React.FC = () => {
  // OFFLINE FIRST: Estado inicial vem do Storage, com fallback para o Default
  const [data, setData] = useState<GuideData>(() => {
    try {
      const saved = localStorage.getItem(GUIDE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_GUIDE;
    } catch {
      return DEFAULT_GUIDE;
    }
  });
  
  const [activeCity, setActiveCity] = useState<'CPT' | 'JNB'>('CPT');

  // Background Sync
  useEffect(() => {
    if (navigator.onLine) {
        loadDataFromCloud('guides_v2').then(cloudData => {
            if (cloudData) {
                const mergedData = {
                  ...DEFAULT_GUIDE,
                  ...(cloudData as any),
                  possibilities: {
                    ...DEFAULT_GUIDE.possibilities,
                    ...((cloudData as any).possibilities || {})
                  }
                };
                setData(mergedData as GuideData);
                localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(mergedData));
            }
        });
    }
  }, []);

  const cityTotal = activeCity === 'CPT' ? 'R$ 1.840' : 'R$ 2.520';
  const cityLabel = activeCity === 'CPT' ? 'Cidade do Cabo' : 'Joanesburgo';
  const currentPossibilities = data.possibilities ? data.possibilities[activeCity] : [];

  return (
    <div className="pb-48">
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
        <button
            onClick={() => setActiveCity('CPT')}
            className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'CPT' ? 'bg-white shadow-md text-sa-blue' : 'text-slate-400'}`}
        >
            <MapPin className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Cidade do Cabo</span>
            <span className="text-[8px] font-bold opacity-60">26 Jan - 31 Jan</span>
        </button>
        <button
            onClick={() => setActiveCity('JNB')}
            className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'JNB' ? 'bg-white shadow-md text-sa-gold' : 'text-slate-400'}`}
        >
            <MapPin className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Joanesburgo</span>
            <span className="text-[8px] font-bold opacity-60">01 Fev - 06 Fev</span>
        </button>
      </div>

      <GoldenTips />

      <div className="space-y-2 animate-in fade-in">
        {(data[activeCity] as DailyPlan[]).map((plan, i) => (
           <DayCard key={i} plan={plan} city={activeCity as string} />
        ))}

        {data[activeCity].length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Roteiro em preparação...</p>
            </div>
        )}
      </div>
      
      {currentPossibilities && currentPossibilities.length > 0 && (
        <div className="mt-12 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-slate-200 p-2 rounded-xl text-slate-500">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">Banco de Ideias & Pendências</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atrações para verificar preço/disponibilidade</p>
            </div>
          </div>
          
          <div className="bg-slate-100 rounded-[28px] p-2">
            {(currentPossibilities as Possibility[]).map((item) => (
              <PossibilityCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {data[activeCity].length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-40 animate-in slide-in-from-bottom-5">
           <div className="bg-slate-900/90 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/10 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Estimativa Total (Média)</span>
              <h4 className="text-slate-400 text-xs font-bold mb-2">{cityLabel}</h4>
              <div className="text-4xl font-display font-black text-sa-green tracking-tight mb-1">{cityTotal}</div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Soma de todos os dias desta cidade</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default GuideList;
