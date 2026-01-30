import React, { useState } from 'react';
import { 
  Calendar, 
  Hotel, 
  Compass, 
  Palmtree, 
  Camera, 
  Utensils, 
  Coins, 
  Info, 
  Moon, 
  Footprints, 
  Bus, 
  ShoppingBag, 
  Map as MapIcon,
  ExternalLink,
  ChevronLeft,
  Star,
  ShieldCheck
} from 'lucide-react';

type City = 'JNB' | 'CPT';

interface SubTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  highlights?: string[];
}

const TOPICS_JNB: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'O inverno (maio a setembro) é seco e excelente para safáris no Kruger. O verão (novembro a março) traz tempestades elétricas espetaculares ao entardecer.',
    highlights: ['Seca (Maio-Set): Melhor p/ Safári', 'Verão (Nov-Mar): Calor e Chuva']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O aeroporto OR Tambo é o maior da África. Recebe voos diretos da TAAG, South African e Latam (via SP).',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Sandton é a escolha segura e luxuosa. Rosebank oferece modernidade e arte. Melville é ideal para quem busca vida noturna e estilo boêmio.',
    highlights: ['Sandton (Segurança)', 'Rosebank (Conveniência)']
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Mergulhe na história no Museu do Apartheid e na Constitution Hill. Explore o Soweto e a Rua Vilakazi.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Lion & Safari Park para interação com animais e Gold Reef City para um mergulho na história da corrida do ouro.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Mandela House, Hector Pieterson Memorial e a Nelson Mandela Square com sua estátua gigante.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Desde o requinte do The Butcher Shop em Sandton até a autenticidade do Sakhumzi no Soweto.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Moeda: Rand (ZAR). Cartões Wise/Nomad funcionam perfeitamente. Gorjetas de 10-15% são esperadas.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Segurança: Não ande no centro (CBD) à pé. Use Uber Black para jantares e prefira hotéis com segurança 24h.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Melville (7th Street) e Maboneng são os centros da agitação. Sandton possui bares mais exclusivos.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Visitas guiadas ao Soweto de bicicleta ou caminhadas artísticas em Rosebank.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Gautrain é eficiente para trajetos Aeroporto-Sandton. Para o resto, Uber é indispensável.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'Sandton City (Luxo), Rosebank Mall (Artesanato) e Maboneng (Design local).',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Pretória (Capital Executiva), Sun City (Resort/Casino) e as cavernas de Sterkfontein.',
  }
];

const TOPICS_CPT: SubTopic[] = [
  {
    id: 'quando-ir',
    title: 'Quando Ir',
    icon: <Calendar className="w-5 h-5" />,
    content: 'Novembro a Março é a melhor época. Dias longos, sol até às 20h e vento forte (Cape Doctor).',
    highlights: ['Janeiro: Auge do Verão', 'Junho-Agosto: Chuva e Frio']
  },
  {
    id: 'como-chegar',
    title: 'Como Chegar',
    icon: <Bus className="w-5 h-5" />,
    content: 'O Aeroporto Internacional da Cidade do Cabo fica a 20min do centro. Uber custa cerca de R$ 60.',
  },
  {
    id: 'onde-ficar',
    title: 'Onde Ficar',
    icon: <Hotel className="w-5 h-5" />,
    content: 'Sea Point para vistas do mar, V&A Waterfront para segurança total e Camps Bay para o agito da praia.',
  },
  {
    id: 'o-que-fazer',
    title: 'O Que Fazer',
    icon: <Compass className="w-5 h-5" />,
    content: 'Subir a Table Mountain, visitar a Robben Island e explorar a orla de Sea Point.',
  },
  {
    id: 'passeios',
    title: 'Passeios',
    icon: <Palmtree className="w-5 h-5" />,
    content: 'Península do Cabo (Cabo da Boa Esperança), Boulders Beach (Pinguins) e as Vinícolas de Stellenbosch.',
  },
  {
    id: 'pontos-turisticos',
    title: 'Pontos Turísticos',
    icon: <Camera className="w-5 h-5" />,
    content: 'Table Mountain, Cape Point, Jardim Botânico Kirstenbosch e as casas coloridas de Bo-Kaap.',
  },
  {
    id: 'onde-comer',
    title: 'Onde Comer',
    icon: <Utensils className="w-5 h-5" />,
    content: 'Mercado de Comida do Waterfront, Kloof Street (Bares) e os vinhos de Constantia.',
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro',
    icon: <Coins className="w-5 h-5" />,
    content: 'Rand (ZAR). Cartão é aceito até em barracas de rua. Saques no aeroporto são seguros.',
  },
  {
    id: 'dicas',
    title: 'Dicas',
    icon: <Info className="w-5 h-5" />,
    content: 'Baixe o app VoiceMap para tours guiados e o app da MyCiti para ônibus.',
  },
  {
    id: 'vida-noturna',
    title: 'Vida Noturna',
    icon: <Moon className="w-5 h-5" />,
    content: 'Long Street para mochileiros, Bree Street para cocktails sofisticados e Camps Bay para o pôr do sol.',
  },
  {
    id: 'atividades',
    title: 'Atividades',
    icon: <Footprints className="w-5 h-5" />,
    content: 'Trilha de Lion\'s Head, surfe em Muizenberg e mergulho com tubarões em Gansbaai.',
  },
  {
    id: 'transportes',
    title: 'Transportes',
    icon: <Bus className="w-5 h-5" />,
    content: 'Ônibus MyCiti é excelente. Red Bus turístico cobre os principais pontos. Uber é dominante.',
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    content: 'V&A Waterfront Shopping (o melhor), The Watershed (Artistas) e Greenmarket Square.',
  },
  {
    id: 'atracoes-proximas',
    title: 'Atrações Próximas',
    icon: <MapIcon className="w-5 h-5" />,
    content: 'Hermanus (Baleias), Franschhoek (Vinhos) e o início da Garden Route.',
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <ShieldCheck className="w-5 h-5" />,
    content: 'Mais segura que Joanesburgo, mas evite Long Street de madrugada e trilhas isoladas sozinho.',
  }
];

const MelhoresDestinos: React.FC = () => {
  const [activeCity, setActiveCity] = useState<City>('CPT');
  const [selectedTopic, setSelectedTopic] = useState<SubTopic | null>(null);

  const topics = activeCity === 'CPT' ? TOPICS_CPT : TOPICS_JNB;

  if (selectedTopic) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-500 font-black mb-6 hover:text-sa-green transition-colors p-2 text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar ao Guia
        </button>

        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
           <div className="w-16 h-16 bg-sa-green text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              {selectedTopic.icon}
           </div>
           <h3 className="text-2xl font-display font-black text-slate-800 mb-4 uppercase leading-tight">{selectedTopic.title}</h3>
           <div className="w-12 h-1.5 bg-sa-gold rounded-full mb-8"></div>
           
           <p className="text-slate-600 leading-relaxed text-base mb-8 whitespace-pre-line">
             {selectedTopic.content}
           </p>

           {selectedTopic.highlights && (
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destaques</h4>
                {selectedTopic.highlights.map((h, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-sa-gold"></div>
                    <span className="font-bold text-slate-700 text-sm">{h}</span>
                  </div>
                ))}
             </div>
           )}

           <div className="mt-12 p-6 bg-sa-green/5 rounded-3xl border border-sa-green/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sa-green">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Fonte: Melhores Destinos</span>
                </div>
                <a 
                  href={activeCity === 'CPT' ? 'https://guia.melhoresdestinos.com.br/cidade-do-cabo-africa-sul.html' : 'https://guia.melhoresdestinos.com.br/joanesburgo-africa-do-sul-141-c.html'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sa-blue hover:scale-110 transition-transform p-2"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-900 p-1.5 rounded-[24px] shadow-xl">
        <button 
          onClick={() => setActiveCity('CPT')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.2em] transition-all ${activeCity === 'CPT' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          Cidade do Cabo
        </button>
        <button 
          onClick={() => setActiveCity('JNB')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black font-display uppercase tracking-[0.2em] transition-all ${activeCity === 'JNB' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          Joanesburgo
        </button>
      </div>

      <div className="text-center py-4">
        <h3 className="text-2xl font-display font-black text-slate-800 leading-tight uppercase">
          Guia Melhores <br/> <span className="text-sa-green">Destinos</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Clique nos tópicos para visualizar</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-20">
        {topics.map((topic) => (
          <button 
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="bg-white p-5 rounded-[32px] border-2 border-slate-50 shadow-sm hover:shadow-md hover:border-sa-green/20 transition-all active:scale-95 group text-left"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sa-green group-hover:text-white transition-colors mb-4">
              {topic.icon}
            </div>
            <span className="block text-[11px] font-black text-slate-700 leading-tight uppercase tracking-tight group-hover:text-sa-green">
              {topic.title}
            </span>
          </button>
        ))}

        <a 
          href={activeCity === 'CPT' ? 'https://guia.melhoresdestinos.com.br/cidade-do-cabo-africa-sul.html' : 'https://guia.melhoresdestinos.com.br/joanesburgo-africa-do-sul-141-c.html'}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sa-blue/10 p-6 rounded-[32px] border-2 border-sa-blue/20 flex flex-col items-center justify-center text-center group active:scale-95 transition-all col-span-2 mt-4"
        >
          <div className="w-12 h-12 bg-sa-blue text-white rounded-2xl flex items-center justify-center mb-3">
            <ExternalLink className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-sa-blue uppercase tracking-[0.2em]">Acessar Portal Completo</span>
          <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">Informações atualizadas via web</span>
        </a>
      </div>
    </div>
  );
};

export default MelhoresDestinos;