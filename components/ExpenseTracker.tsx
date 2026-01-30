
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Receipt, 
  CalendarDays,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';
import { getRates } from '../services/currencyService';
import { EXPENSES_STORAGE_KEY } from '../constants';
import { CurrencyCode } from '../types';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  amountInBRL: number;
  date: string;
}

const ExpenseTracker: React.FC = () => {
  // OFFLINE FIRST STATE
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('ZAR');
  const [rates, setRates] = useState<{USD: number, BRL: number, ZAR: number} | null>(null);

  useEffect(() => {
    // 1. Load Rates (Network First, but CurrencyService handles cache)
    const initData = async () => {
      const r = await getRates();
      setRates(r);

      // 2. Background Sync for Expenses
      if (navigator.onLine) {
        try {
            const cloudData = await loadDataFromCloud('expenses_log');
            if (cloudData && cloudData.list) {
                // Em um app real, faríamos merge. Aqui, assumimos cloud como verdade se online.
                setExpenses(cloudData.list);
                localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(cloudData.list));
            }
        } catch (e) { console.error("Background sync failed", e); }
      }
    };
    initData();
  }, []);

  // Auto Save Changes
  useEffect(() => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    
    // Debounce cloud sync
    const t = setTimeout(() => {
      syncDataToCloud('expenses_log', { list: expenses });
    }, 2000);
    return () => clearTimeout(t);
  }, [expenses]);

  const handleAdd = () => {
    if (!desc.trim() || !amount || !rates) return;

    const val = parseFloat(amount);
    let valInBRL = 0;

    // Conversion Logic (Base USD)
    if (currency === 'BRL') valInBRL = val;
    else if (currency === 'USD') valInBRL = val * rates.BRL; 
    else if (currency === 'ZAR') {
      const valInUSD = val / rates.ZAR;
      valInBRL = valInUSD * rates.BRL;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: desc,
      amount: val,
      currency,
      amountInBRL: valInBRL,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setExpenses([newExpense, ...expenses]);
    setDesc('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountInBRL, 0);

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Receipt className="w-32 h-32" />
        </div>
        <div className="relative z-10">
           <span className="text-purple-200 text-xs font-bold uppercase tracking-wider block mb-1">
             Total Gasto (Convertido)
           </span>
           <span className="text-4xl font-bold font-display">
             R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </span>
           <p className="text-purple-200 text-xs mt-2 opacity-80">
             *Valores convertidos usando a cotação do dia.
           </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-600" /> Novo Gasto
        </h3>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="O que você comprou?" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-medium text-sm"
          />
          
          <div className="flex gap-2">
            <div className="w-1/3 relative">
               <select 
                 value={currency} 
                 onChange={e => setCurrency(e.target.value as CurrencyCode)}
                 className="w-full p-3 bg-gray-100 rounded-xl font-bold text-gray-700 appearance-none outline-none border border-transparent focus:bg-white focus:border-purple-500"
               >
                 <option value="ZAR">Rand (R)</option>
                 <option value="USD">Dólar ($)</option>
                 <option value="BRL">Real (R$)</option>
               </select>
            </div>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-bold text-gray-800"
            />
          </div>

          <button 
            onClick={handleAdd}
            disabled={!desc || !amount}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:shadow-none"
          >
            Adicionar Despesa
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Histórico</h4>
         
         {expenses.length === 0 && (
           <div className="text-center py-8 text-gray-400">
             <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20" />
             <p className="text-sm">Nenhum gasto lançado.</p>
           </div>
         )}

         {expenses.map(item => (
           <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.description}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> {item.date}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                 <div>
                   <p className="font-bold text-gray-800 text-sm">
                     {item.currency} {item.amount.toLocaleString()}
                   </p>
                   {item.currency !== 'BRL' && (
                     <p className="text-[10px] text-purple-600 font-medium">
                       ≈ R$ {item.amountInBRL.toFixed(2)}
                     </p>
                   )}
                 </div>
                 <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ExpenseTracker;
