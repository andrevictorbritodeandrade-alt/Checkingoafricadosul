
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TopBar from './components/TopBar';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MenuCard from './components/MenuCard'; 
import CurrencyConverter from './components/CurrencyConverter';
import FlightList from './components/FlightList';
import PackingList from './components/PackingList';
import GuideList from './components/GuideList';
import MelhoresDestinos from './components/MelhoresDestinos';
import FinancialControl from './components/FinancialControl'; 
import ExpenseTracker from './components/ExpenseTracker';
import Translator from './components/Translator';
import AiAssistant from './components/AiAssistant';
import AccommodationList from './components/AccommodationList'; 
import BusList from './components/BusList';
import VaccineCertificate from './components/VaccineCertificate';
import UberBoltList, { RIDES } from './components/UberBoltList';
import WeatherLocation from './components/WeatherLocation';
import WeatherCardHome from './components/WeatherCardHome';
import Supplies from './components/Supplies';
import { MENU_ITEMS } from './constants';
import { Construction, ArrowLeft, Grip } from 'lucide-react';
import { ThemeColor, MenuItem } from './types';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());

  // Solicita permissão de notificação no início
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Monitor de Viagens de Uber (Notificações)
  useEffect(() => {
    const checkRides = () => {
      const now = new Date();
      
      RIDES.forEach(ride => {
        // Parsing data e hora (Ex: '24/Jan' e '05:00')
        const [day, monthStr] = ride.date.split('/');
        const [hours, minutes] = ride.time.split(':');
        
        const months: Record<string, number> = { 
          'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5,
          'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11
        };

        const rideDate = new Date(2026, months[monthStr], parseInt(day), parseInt(hours), parseInt(minutes));
        const diffMs = rideDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        // Janelas de alerta: 120min (2h), 60min (1h), 30min
        const thresholds = [120, 60, 30];
        
        thresholds.forEach(t => {
          const key = `${ride.id}-${t}`;
          // Se estiver na janela de tempo e ainda não notificamos esse limite específico
          if (diffMins === t && !notifiedIds.current.has(key)) {
            triggerNotification(ride, t);
            notifiedIds.current.add(key);
          }
        });
      });
    };

    const triggerNotification = (ride: any, minutesLeft: number) => {
      const title = `⚠️ ALERTA DE VIAGEM (${minutesLeft}min)`;
      const body = `Faltam ${minutesLeft} minutos para sua viagem de ${ride.app} para: ${ride.destination}. Prepare-se!`;
      
      // 1. Notificação de Navegador (Acende a tela / Barra de status)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: '/favicon.svg' });
      }

      // 2. Evento Interno para o "Sininho" (TopBar)
      const event = new CustomEvent('app-notification', { detail: body });
      window.dispatchEvent(event);
    };

    // Verifica a cada 60 segundos
    const interval = setInterval(checkRides, 60000);
    checkRides(); // Check imediato

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.sectionId) {
        setActiveSectionId(event.state.sectionId);
      } else {
        setActiveSectionId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (id: string) => {
    if (id === 'clima_localizacao') return;

    setActiveSectionId(id);
    try {
      window.history.pushState({ sectionId: id }, '', `#${id}`);
    } catch (e) {
      console.warn("Navigation state update skipped", e);
    }
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (window.history.state && window.history.state.sectionId) {
      window.history.back();
    } else {
      setActiveSectionId(null);
      try {
        window.history.replaceState(null, '', ' ');
      } catch (e) {
         console.warn("History replaceState skipped", e);
      }
    }
  };

  const getMenuItem = (id: string): MenuItem | undefined => {
    return MENU_ITEMS.find(i => i.id === id);
  };

  const renderContent = (id: string) => {
    switch (id) {
      case 'clima_localizacao':
        return <WeatherLocation />;
      case 'ia_assistant':
        return <AiAssistant />;
      case 'tradutor':
        return <Translator />;
      case 'cambio':
        return <CurrencyConverter />;
      case 'melhores_destinos':
        return <MelhoresDestinos />;
      case 'voos':
        return <FlightList />;
      case 'checklist':
        return <PackingList />;
      case 'guias':
        return <GuideList />;
      case 'financeiro':
          return <FinancialControl />;
      case 'gastos':
          return <ExpenseTracker />;
      case 'hospedagem': 
          return <AccommodationList />;
      case 'onibus':
          return <BusList />;
      case 'uber_bolt':
          return <UberBoltList />;
      case 'vacinas':
          return <VaccineCertificate />;
      case 'mercado':
          return <Supplies />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Construction className="w-12 h-12 mb-4 opacity-20 text-sa-green" />
            <p className="text-lg font-bold text-sa-green font-display">Em construção</p>
            <p className="text-sm text-gray-400 mt-2">Aguardando conteúdo.</p>
          </div>
        );
    }
  };

  const DetailHeader: React.FC<{ id: string }> = ({ id }) => {
    const item = getMenuItem(id);
    const gradientClass = item ? item.gradientClass : 'bg-tribal-green';
    const title = item ? item.title : 'Detalhes';
    const icon = item ? item.icon : <Grip className="w-6 h-6 text-white" />;

    return (
      <div className={`sticky top-0 z-50 shadow-xl transition-all duration-300 ${gradientClass} border-b border-white/10`}>
        <div className="h-2 w-full"></div>
        <div className="flex items-center px-4 py-4 max-w-md mx-auto relative">
          <button 
            onClick={goBack} 
            className="p-3 -ml-2 rounded-full hover:bg-white/20 transition-all active:scale-90 active:bg-white/30 text-white z-50 group"
          >
            <ArrowLeft className="w-7 h-7 drop-shadow-md group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center -ml-8 animate-in fade-in slide-in-from-top-1">
             <div className="text-white/80 scale-75 opacity-80 mb-0.5">{icon}</div>
             <h2 className="text-lg font-display font-black tracking-widest text-white uppercase drop-shadow-md text-center leading-none">{title}</h2>
          </div>
          <div className="w-10"></div>
        </div>
      </div>
    );
  };

  if (activeSectionId) {
    return (
      <div className={`min-h-screen font-sans animate-in slide-in-from-right duration-300 ease-out bg-gray-50`}>
        <TopBar variant="minimal" />
        <DetailHeader id={activeSectionId} />
        <main className="max-w-md mx-auto px-4 py-6 pb-24">
          {renderContent(activeSectionId)}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans animate-in fade-in duration-300 relative">
      <TopBar variant="home" />
      <PWAInstallPrompt />
      
      {/* Background Layer Global: Savana Africana */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[1px] scale-105 opacity-50 contrast-125"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop")' }}
        ></div>
        
        {/* Overlay para suavizar o fundo em direção ao preto na base, sem cortar o topo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="max-w-md mx-auto px-4 py-4 pb-12 w-full">
          <div className="grid grid-cols-3 gap-3">
            {MENU_ITEMS.map((item) => (
              item.id === 'clima_localizacao' ? (
                <WeatherCardHome key={item.id} />
              ) : (
                <MenuCard key={item.id} {...item} onClick={() => navigateTo(item.id)} />
              )
            ))}
          </div>
        </main>

        <footer className="text-center text-[10px] text-white/50 pb-12 font-black font-display tracking-widest uppercase space-y-1 mt-auto">
          <p>África do Sul 🇿🇦</p>
          <p className="opacity-50 mt-4 font-sans font-medium capitalize tracking-normal">Desenvolvido por: André Brito</p>
          <p className="pt-2 text-[9px] opacity-30">© 2026 CHECK-IN, GO!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
