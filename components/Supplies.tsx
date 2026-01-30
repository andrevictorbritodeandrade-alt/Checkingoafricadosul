
import React, { useState } from 'react';
import { 
  ShoppingBasket, 
  Utensils, 
  MapPin, 
  Clock, 
  Smartphone, 
  ShoppingBag,
  Coffee,
  Pill,
  AlertCircle,
  Building,
  Store,
  ShieldAlert,
  Car
} from 'lucide-react';

type City = 'CPT' | 'JNB';

const Supplies: React.FC = () => {
  const [activeCity, setActiveCity] = useState<City>('CPT');

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* City Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-[24px] shadow-inner">
        <button 
          onClick={() => setActiveCity('CPT')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeCity === 'CPT' ? 'bg-white text-sa-blue shadow-lg' : 'text-slate-400'}`}
        >
          <MapPin className="w-3.5 h-3.5" /> Cidade do Cabo
        </button>
        <button 
          onClick={() => setActiveCity('JNB')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeCity === 'JNB' ? 'bg-white text-sa-gold shadow-lg' : 'text-slate-400'}`}
        >
          <MapPin className="w-3.5 h-3.5" /> Joanesburgo
        </button>
      </div>

      {/* Header Contexto */}
      <div className={`rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden transition-colors duration-500 ${activeCity === 'CPT' ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-amber-600 to-orange-700'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <ShoppingBasket className="w-32 h-32" />
        </div>
        <div className="relative z-10">
           <h2 className="text-2xl font-display font-black uppercase leading-none mb-2">
             {activeCity === 'CPT' ? 'Sea Point' : 'Melville'}
           </h2>
           <p className="text-sm font-medium max-w-[90%] opacity-90 leading-relaxed">
             {activeCity === 'CPT' 
               ? "Vocês estão em uma das melhores áreas para compras a pé. Tudo o que precisam está a menos de 500m (5 min)." 
               : "Melville é boêmio e vibrante. Durante o dia, a 7th St é ótima. À noite, use Uber mesmo para curtas distâncias por segurança."}
           </p>
        </div>
      </div>

      {/* DELIVERY APPS (COMUM) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
           <Smartphone className="w-5 h-5 text-sa-green" />
           <h3 className="font-display font-black text-slate-700 uppercase text-sm tracking-widest">Delivery ("iFood" Local)</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
           <div className="flex items-start gap-4 pb-4 border-b border-slate-50">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shrink-0 font-bold tracking-tighter">
                 Uber<br/>Eats
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Uber Eats</h4>
                 <p className="text-xs text-slate-500 leading-tight mt-1">
                   O mesmo app do Brasil. Opção segura para pedir jantar no hotel se estiverem cansados ou for tarde da noite.
                 </p>
              </div>
           </div>

           <div className="flex items-start gap-4 pb-4 border-b border-slate-50">
              <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shrink-0 font-black italic">
                 Mr D
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Mr D Food</h4>
                 <p className="text-xs text-slate-500 leading-tight mt-1">
                   Concorrente local muito forte. Vale baixar para comparar promoções de restaurantes locais.
                 </p>
              </div>
           </div>

           <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-xs text-center">
                 Sixty<br/>60
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Checkers Sixty60</h4>
                 <p className="text-xs text-slate-500 leading-tight mt-1">
                   Entrega de <strong>mercado completo</strong> em 60 minutos. A melhor opção para comprar água, café da manhã e vinhos sem sair da hospedagem.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* CONTEÚDO ESPECÍFICO CPT */}
      {activeCity === 'CPT' && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <div className="flex items-center gap-2 px-2">
             <MapPin className="w-5 h-5 text-sa-blue" />
             <h3 className="font-display font-black text-slate-700 uppercase text-sm tracking-widest">Perto do Airbnb (Sea Point)</h3>
          </div>

          {/* The Point Mall */}
          <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-slate-800 p-3 px-5 flex justify-between items-center text-white">
                 <span className="font-bold text-sm uppercase">The Point Mall</span>
                 <span className="text-[10px] font-black bg-white text-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                   <Clock className="w-3 h-3" /> 4 min a pé (350m)
                 </span>
              </div>
              <div className="p-5 space-y-4">
                 <p className="text-xs text-slate-500 font-medium">
                   Fica na <strong>76 Regent Rd</strong>. É um shopping pequeno, mas tem tudo.
                 </p>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
                       <ShoppingBasket className="w-5 h-5 text-teal-600" />
                       <div>
                          <h5 className="text-xs font-black text-teal-800 uppercase">Checkers (Mercado)</h5>
                          <p className="text-[10px] text-teal-600">Completo. Fecha às 20h/21h.</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                       <Pill className="w-5 h-5 text-blue-600" />
                       <div>
                          <h5 className="text-xs font-black text-blue-800 uppercase">Clicks / Dis-Chem</h5>
                          <p className="text-[10px] text-blue-600">Farmácia e cosméticos.</p>
                       </div>
                    </div>
                 </div>
              </div>
          </div>

          {/* Mojo Market */}
          <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-amber-400 p-3 px-5 flex justify-between items-center text-slate-900">
                 <span className="font-black text-sm uppercase">Mojo Market</span>
                 <span className="text-[10px] font-black bg-white/50 text-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                   <Utensils className="w-3 h-3" /> Jantar Tarde
                 </span>
              </div>
              <div className="p-5 flex items-start gap-3">
                 <Coffee className="w-8 h-8 text-amber-600 shrink-0" />
                 <p className="text-xs text-slate-500">
                   <strong>30 Regent Rd</strong> (400m). Food Hall incrível com música ao vivo. Seguro, animado e com muitas opções (Pizza, Sushi, Burger). Ótimo para a primeira noite.
                 </p>
              </div>
          </div>

           {/* Woolworths */}
           <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-slate-900 p-3 px-5 flex justify-between items-center text-white">
                 <span className="font-bold text-sm uppercase">Woolworths Food</span>
                 <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded">Piazza St John (500m)</span>
              </div>
              <div className="p-5 flex items-start gap-3">
                 <ShoppingBag className="w-5 h-5 text-slate-900 shrink-0" />
                 <p className="text-xs text-slate-500">
                   Qualidade premium. As <strong>refeições prontas</strong> de micro-ondas são deliciosas e salvam vidas.
                 </p>
              </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO ESPECÍFICO JNB */}
      {activeCity === 'JNB' && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <div className="flex items-center gap-2 px-2">
             <MapPin className="w-5 h-5 text-sa-gold" />
             <h3 className="font-display font-black text-slate-700 uppercase text-sm tracking-widest">Perto de Melville (84 on 4th)</h3>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-start gap-3">
             <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
             <p className="text-xs text-orange-900 leading-relaxed font-medium">
               <strong>Atenção:</strong> Melville é seguro de dia nas ruas principais (7th St), mas evite andar com celular na mão. À noite, use Uber até para ir ao Campus Square (1.5km).
             </p>
          </div>

          {/* Campus Square */}
          <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-slate-800 p-3 px-5 flex justify-between items-center text-white">
                 <span className="font-bold text-sm uppercase">Campus Square</span>
                 <span className="text-[10px] font-black bg-white text-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                   <Car className="w-3 h-3" /> 5 min Uber (1.5km)
                 </span>
              </div>
              <div className="p-5 space-y-4">
                 <p className="text-xs text-slate-500 font-medium">
                   Shopping completo em Auckland Park. O local mais seguro e completo para compras grandes.
                 </p>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                       <ShoppingBasket className="w-5 h-5 text-red-600" />
                       <div>
                          <h5 className="text-xs font-black text-red-800 uppercase">Pick n Pay</h5>
                          <p className="text-[10px] text-red-600">Grande supermercado. Bons preços.</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                       <ShoppingBag className="w-5 h-5 text-slate-700" />
                       <div>
                          <h5 className="text-xs font-black text-slate-800 uppercase">Woolworths Food</h5>
                          <p className="text-[10px] text-slate-600">Para comidas prontas e snacks premium.</p>
                       </div>
                    </div>
                 </div>
              </div>
          </div>

          {/* Spar Melville */}
          <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-green-600 p-3 px-5 flex justify-between items-center text-white">
                 <span className="font-black text-sm uppercase">Spar Melville</span>
                 <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded flex items-center gap-1">
                   <Clock className="w-3 h-3" /> 2 min a pé (Main Rd)
                 </span>
              </div>
              <div className="p-5 flex items-start gap-3">
                 <Store className="w-8 h-8 text-green-700 shrink-0" />
                 <p className="text-xs text-slate-500">
                   Fica na esquina da Main Rd com a 4th Ave. Super prático para água, pão e itens básicos sem sair de carro.
                 </p>
              </div>
          </div>

           {/* 27 Boxes */}
           <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-pink-600 p-3 px-5 flex justify-between items-center text-white">
                 <span className="font-bold text-sm uppercase">27 Boxes</span>
                 <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded">4th Ave (300m)</span>
              </div>
              <div className="p-5 flex items-start gap-3">
                 <Building className="w-5 h-5 text-pink-700 shrink-0" />
                 <p className="text-xs text-slate-500">
                   Shopping feito de contêineres navais. Ótimo para presentes, cafés artesanais e comidas diferentes (cronuts!).
                 </p>
              </div>
          </div>
        </div>
      )}

      {/* Lista de Compras Sugerida */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Checklist de Chegada
         </h3>
         <ul className="space-y-2">
            {[
              "Garrafas de Água (5L ou várias de 1.5L)",
              "Adaptador de Tomada (Tipo M - Três pinos grandes)",
              "Chip de Celular (Vodacom/MTN) - Se não pegou no aero",
              "Café da manhã (Iogurte, Granola, Frutas)",
              "Vinho Sul-Africano (Pinotage ou Chenin Blanc)"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                 <div className="w-1.5 h-1.5 rounded-full bg-sa-green"></div>
                 {item}
              </li>
            ))}
         </ul>
      </div>

    </div>
  );
};

export default Supplies;
