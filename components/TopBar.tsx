
import React, { useState, useEffect } from 'react';
import { 
  CloudOff,
  RefreshCw,
  Bell,
  X,
  Clock,
  Car,
  AlertTriangle,
  CloudUpload,
  CloudCheck,
  WifiOff,
  Wifi,
  CloudAlert
} from 'lucide-react';
import { SyncStatus } from '../services/firebase';

interface TopBarProps {
  variant?: 'home' | 'minimal';
}

const TopBar: React.FC<TopBarProps> = ({ variant = 'home' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(navigator.onLine ? 'saved' : 'offline');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        setSyncStatus('online');
    };
    const handleOffline = () => {
        setIsOnline(false);
        setSyncStatus('offline');
    };
    
    const handleSyncStatus = (e: any) => setSyncStatus(e.detail);
    const handleNewAlert = (e: any) => setActiveAlerts(prev => [...prev, e.detail]);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sync-status', handleSyncStatus);
    window.addEventListener('app-notification', handleNewAlert);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sync-status', handleSyncStatus);
      window.removeEventListener('app-notification', handleNewAlert);
    };
  }, []);

  return (
    <>
      <div className="fixed top-2 right-2 z-[70] flex gap-2 pointer-events-none items-center">
        
        {/* Indicador de Status de Conexão e Backup */}
        <div className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-500 ${
          !isOnline ? 'bg-red-600 text-white border-red-400' :
          syncStatus === 'saving' ? 'bg-sa-green text-white border-white animate-pulse' :
          syncStatus === 'error' ? 'bg-amber-600 text-white border-amber-400' :
          'bg-black/40 border-white/20 text-white'
        }`}>
            {!isOnline ? (
                <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Modo Offline</span>
                </>
            ) : syncStatus === 'saving' ? (
                <>
                    <CloudUpload className="w-3.5 h-3.5 animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Fazendo Backup...</span>
                </>
            ) : syncStatus === 'error' ? (
                <>
                    <CloudAlert className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Erro de Nuvem</span>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-sa-green" />
                        <CloudCheck className="w-3.5 h-3.5 text-sa-green" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider">Online & Seguro</span>
                </>
            )}
        </div>

        {/* Sino de Notificações */}
        <button 
          onClick={() => setIsAlertsOpen(true)}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border shadow-lg transition-all relative ${
            activeAlerts.length > 0 
              ? 'bg-sa-gold text-sa-black border-white animate-bounce' 
              : 'bg-black/40 border-white/20 text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          {activeAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white">
              {activeAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Painel de Alertas */}
      {isAlertsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sa-gold rounded-xl text-black">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase leading-none">Notificações</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Alertas de Viagem</span>
                </div>
              </div>
              <button onClick={() => setIsAlertsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="py-12 text-center space-y-3 opacity-30">
                  <Clock className="w-12 h-12 mx-auto" />
                  <p className="text-sm font-bold uppercase tracking-widest">Sem alertas ativos</p>
                </div>
              ) : (
                activeAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-4 items-start animate-in slide-in-from-left">
                    <div className="p-2 bg-amber-200 text-amber-700 rounded-xl">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800 leading-snug">{alert}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-amber-600 uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        Verifique seu aplicativo Uber
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
               <button 
                onClick={() => { setActiveAlerts([]); setIsAlertsOpen(false); }}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
               >
                 Limpar Tudo
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
