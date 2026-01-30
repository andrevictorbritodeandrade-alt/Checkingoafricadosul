import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, WifiOff, TrendingUp } from 'lucide-react';
import { getRates } from '../services/currencyService';
import { CurrencyRates, CurrencyCode } from '../types';

const CurrencyInput: React.FC<{
  code: CurrencyCode;
  value: string;
  flag: string;
  name: string;
  rateText: string;
  onChange: (value: string, code: CurrencyCode) => void;
}> = ({ code, value, flag, name, rateText, onChange }) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <div className="flex justify-between items-end px-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-display">
        {name}
      </label>
    </div>
    <div className="relative flex items-center group">
      <div className="absolute left-4 flex items-center gap-3 pointer-events-none z-10">
        <span className="text-2xl drop-shadow-sm select-none grayscale-[0.2]">{flag}</span>
        <span className="font-display font-bold text-green-900 text-lg tracking-wide">{code}</span>
      </div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder="0.00"
        onChange={(e) => onChange(e.target.value, code)}
        className="w-full pl-28 pr-4 pt-4 pb-8 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-right font-display text-2xl font-bold text-slate-800 shadow-sm group-hover:bg-white group-hover:border-gray-200 placeholder:text-gray-300"
      />
      {/* Rate Helper Display inside the input box */}
      <div className="absolute right-4 bottom-2 pointer-events-none flex items-center gap-1">
        <TrendingUp className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] font-bold text-gray-400 tracking-wide font-display bg-gray-100/50 px-1.5 py-0.5 rounded-md">
           {rateText}
        </span>
      </div>
    </div>
  </div>
);

const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // State for input values
  const [values, setValues] = useState({
    BRL: '',
    USD: '',
    ZAR: '',
  });

  const fetchAndSetRates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRates();
      setRates(data);
      const date = new Date(data.lastUpdated);
      setLastUpdated(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error("Error in component fetch", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetRates();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchAndSetRates, 300000); 
    return () => clearInterval(interval);
  }, [fetchAndSetRates]);

  const handleConversion = (value: string, source: CurrencyCode) => {
    if (!rates) return;
    
    // Allow empty input
    if (value === '') {
      setValues({ BRL: '', USD: '', ZAR: '' });
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount)) return;

    // Convert source to USD (Base)
    const amountInUSD = amount / rates[source];

    const newValues = {
      USD: source === 'USD' ? value : (amountInUSD * rates.USD).toFixed(2),
      BRL: source === 'BRL' ? value : (amountInUSD * rates.BRL).toFixed(2),
      ZAR: source === 'ZAR' ? value : (amountInUSD * rates.ZAR).toFixed(2),
    };

    setValues(newValues);
  };

  // Helper to generate the "market rate" text
  const getRateText = (code: CurrencyCode) => {
    if (!rates) return '...';
    
    // Format options
    const fmt = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    if (code === 'ZAR') {
      // Show value of 1 ZAR in BRL
      const val = rates.BRL / rates.ZAR;
      return `1 ZAR ≈ ${val.toLocaleString('pt-BR', fmt)} BRL`;
    }
    
    if (code === 'USD') {
       // Show value of 1 USD in BRL
       const val = rates.BRL; // Since base is USD
       return `1 USD ≈ ${val.toLocaleString('pt-BR', fmt)} BRL`;
    }

    if (code === 'BRL') {
        // Show value of 1 BRL in ZAR (Buying power)
        const val = rates.ZAR / rates.BRL;
        return `1 BRL ≈ ${val.toLocaleString('pt-BR', fmt)} ZAR`;
    }
    return '';
  };

  if (!rates && loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-green-500 animate-pulse">
        <RefreshCw className="w-8 h-8 animate-spin mb-2" />
        <p className="font-display font-medium">Carregando taxas...</p>
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="bg-white rounded-3xl p-1">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
            </span>
            <span className="text-xs text-green-700 font-medium font-display tracking-wide">
              ATUALIZADO: {lastUpdated}
            </span>
          </div>
          <button 
            onClick={fetchAndSetRates} 
            disabled={loading}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors border border-transparent hover:border-green-100"
            aria-label="Atualizar taxas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <CurrencyInput 
          code="ZAR" 
          name="Rand Sul-Africano" 
          flag="🇿🇦" 
          value={values.ZAR} 
          rateText={getRateText('ZAR')}
          onChange={handleConversion} 
        />
        <CurrencyInput 
          code="BRL" 
          name="Real Brasileiro" 
          flag="🇧🇷" 
          value={values.BRL} 
          rateText={getRateText('BRL')}
          onChange={handleConversion} 
        />
        <CurrencyInput 
          code="USD" 
          name="Dólar Americano" 
          flag="🇺🇸" 
          value={values.USD} 
          rateText={getRateText('USD')}
          onChange={handleConversion} 
        />

        {!navigator.onLine && (
           <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
             <WifiOff className="w-4 h-4" />
             <span>Modo offline. Usando últimas taxas.</span>
           </div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100/50 shadow-sm">
        <p className="text-green-800 text-sm font-medium text-center leading-relaxed">
          💡 <strong>Dica:</strong> Use o valor em ZAR acima para ter noção rápida de preços em menus e lojas!
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;