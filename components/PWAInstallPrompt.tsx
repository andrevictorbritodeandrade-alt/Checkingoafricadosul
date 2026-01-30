import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="bg-sa-green p-2 rounded-xl">
             <Download className="w-6 h-6 text-white" />
           </div>
           <div>
             <h4 className="font-bold text-sm">Instalar App</h4>
             <p className="text-xs text-slate-400">Acesso rápido e offline.</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsVisible(false)}
             className="p-2 text-slate-400 hover:text-white"
           >
             <X className="w-5 h-5" />
           </button>
           <button 
             onClick={handleInstall}
             className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
           >
             Instalar
           </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;