
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Impede o Chrome de mostrar o prompt nativo automaticamente (para controlarmos quando aparece)
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
      <div className="bg-sa-green text-white p-1 rounded-[24px] shadow-2xl border border-white/20">
        <div className="bg-black/20 backdrop-blur-md rounded-[20px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="bg-white text-sa-green p-2.5 rounded-xl shadow-sm">
                <Smartphone className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-black text-sm uppercase tracking-wide">Instalar App</h4>
                <p className="text-[10px] text-white/80 font-medium">Acesso offline e tela cheia.</p>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-white/50 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            <button 
                onClick={handleInstall}
                className="bg-white text-sa-green px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
            >
                Baixar
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
