
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  Luggage, 
  ShoppingBag, 
  User, 
  Pencil, 
  X, 
  Check, 
  RefreshCw, 
  Tag, 
  CloudLightning, 
  PlaneTakeoff, 
  PlaneLanding, 
  Circle 
} from 'lucide-react';
import { syncDataToCloud, subscribeToCloudData } from '../services/firebase';

type BagType = 'bag23kg' | 'bag10kg' | 'pouch5kg';
type Person = 'André' | 'Marcelly';

interface Item {
  id: string;
  text: string;
  checked: boolean;  // IDA
  returned: boolean; // VOLTA
  category?: string;
}

type PackingData = Record<Person, Record<BagType, Item[]>>;

const STORAGE_KEY = 'checkin_go_packing_list_v5';

const CATEGORY_MAP: Record<string, string[]> = {
  '👕 ROUPAS': ['camisa', 'camiseta', 'calça', 'bermuda', 'short', 'cueca', 'meia', 'casaco', 'jaqueta', 'vestido', 'saia', 'biquíni', 'sunga', 'moletom', 'agasalho', 'roupa', 'blusa', 'pijama'],
  '👟 CALÇADOS': ['tênis', 'sapato', 'chinelo', 'sandália', 'bota', 'crocs', 'pantufa'],
  '🧴 HIGIENE & SAÚDE': ['escova', 'pasta', 'shampoo', 'condicionador', 'sabonete', 'desodorante', 'perfume', 'protetor', 'repelente', 'remédio', 'farmácia', 'curativo', 'band-aid', 'nécessaire', 'maquiagem', 'batom', 'hidratante', 'barbeador', 'lâmina'],
  '🛂 DOCUMENTOS': ['passaporte', 'civp', 'vacina', 'rg', 'cpf', 'visto', 'reserva', 'comprovante', 'seguro', 'cartão', 'dinheiro', 'rand', 'dólar', 'wallet', 'carteira'],
  '🔌 ELETRÔNICOS': ['carregador', 'cabo', 'celular', 'power bank', 'adaptador', 'fone', 'headset', 'câmera', 'go pro', 'laptop', 'tablet', 'kindle'],
  '🎒 ACESSÓRIOS': ['chapéu', 'boné', 'óculos', 'relógio', 'joia', 'brinco', 'colar', 'pulseira', 'vuvuzela', 'protetor auricular', 'tampão'],
  '📦 DIVERSOS': []
};

const identifyCategory = (text: string): string => {
  const normalized = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => normalized.includes(k))) return category;
  }
  return '📦 DIVERSOS';
};

const sortItems = (items: Item[]) => {
  return [...items].sort((a, b) => a.text.localeCompare(b.text, 'pt-BR', { sensitivity: 'base', numeric: true }));
};

const INITIAL_DATA: PackingData = {
  'André': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] },
  'Marcelly': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] }
};

const PackingListItem: React.FC<{
  item: Item;
  onToggleIda: (id: string) => void;
  onToggleVolta: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}> = ({ item, onToggleIda, onToggleVolta, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(item.id, editText.trim());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200 shadow-sm">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 text-sm outline-none text-slate-700 font-medium bg-transparent min-w-0"
          autoFocus
        />
        <div className="flex shrink-0 gap-1">
          <button onClick={handleSave} className="text-green-600 p-1.5 hover:bg-green-50 rounded-md"><Check className="w-4 h-4" /></button>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-md"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
      <button 
        onClick={() => onToggleIda(item.id)} 
        className={`shrink-0 p-1 rounded-full transition-all ${item.checked ? 'bg-sa-green/10' : 'bg-transparent'}`}
        title="Verificar Ida"
      >
        {item.checked ? <PlaneTakeoff className="w-5 h-5 text-sa-green" /> : <Circle className="w-5 h-5 text-slate-200" />}
      </button>
      <span className={`flex-1 text-sm font-medium pt-0.5 ${(item.checked && item.returned) ? 'text-gray-300 line-through decoration-gray-400' : 'text-gray-700'}`}>
        {item.text}
      </span>
      <button 
        onClick={() => onToggleVolta(item.id)} 
        className={`shrink-0 p-1 rounded-full transition-all ${item.returned ? 'bg-sa-blue/10' : 'bg-transparent'}`}
        title="Verificar Volta"
      >
        {item.returned ? <PlaneLanding className="w-5 h-5 text-sa-blue" /> : <Circle className="w-5 h-5 text-slate-200" />}
      </button>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
        <button onClick={() => setIsEditing(true)} className="text-gray-300 hover:text-blue-500 p-1"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

const BagSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: Item[];
  colorClass: string;
  onToggleIda: (id: string) => void;
  onToggleVolta: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onAdd: (text: string) => void;
}> = ({ title, icon, items, colorClass, onToggleIda, onToggleVolta, onDelete, onEdit, onAdd }) => {
  const [newItemText, setNewItemText] = useState('');
  const handleAdd = () => { if (newItemText.trim()) { onAdd(newItemText.trim()); setNewItemText(''); } };

  const groupedItems = useMemo<Record<string, Item[]>>(() => {
    const groups: Record<string, Item[]> = {};
    items.forEach(item => {
      const cat = identifyCategory(item.text);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    const sortedGroups: Record<string, Item[]> = {};
    Object.keys(groups).sort().forEach(cat => { sortedGroups[cat] = sortItems(groups[cat]); });
    return sortedGroups;
  }, [items]);

  const idaCount = items.filter(i => i.checked).length;
  const voltaCount = items.filter(i => i.returned).length;
  const totalCount = items.length;
  const idaProgress = totalCount === 0 ? 0 : (idaCount / totalCount) * 100;
  const voltaProgress = totalCount === 0 ? 0 : (voltaCount / totalCount) * 100;

  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white shadow-sm`}>
      <div className={`p-3 flex items-center justify-between border-b border-gray-100 ${colorClass.replace('border-', 'bg-').replace('50', '50/50')}`}>
        <div className="flex items-center gap-2">{icon}<h3 className="font-display font-bold text-slate-700">{title}</h3></div>
        <div className="flex items-center gap-1.5">
           <span className="text-[9px] font-black text-sa-green bg-white px-2 py-0.5 rounded-full border border-sa-green/20">🛫 {idaCount}/{totalCount}</span>
           <span className="text-[9px] font-black text-sa-blue bg-white px-2 py-0.5 rounded-full border border-sa-blue/20">🛬 {voltaCount}/{totalCount}</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-gray-100 flex">
        <div className="h-full bg-sa-green transition-all duration-500" style={{ width: `${idaProgress / 2}%` }} />
        <div className="h-full bg-sa-blue transition-all duration-500" style={{ width: `${voltaProgress / 2}%` }} />
      </div>
      <div className="p-3">
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category}>
              <div className="flex items-center gap-2 px-2 mb-2"><Tag className="w-3 h-3 text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category}</span><div className="h-[1px] flex-1 bg-slate-50"></div></div>
              <div className="space-y-1">{(catItems as Item[]).map(item => <PackingListItem key={item.id} item={item} onToggleIda={onToggleIda} onToggleVolta={onToggleVolta} onDelete={onDelete} onEdit={onEdit} />)}</div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-gray-300 text-xs italic py-2">Nenhum item nesta lista.</p>}
        </div>
        <div className="mt-6 flex gap-2">
          <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="Adicionar item..." className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500" />
          <button onClick={handleAdd} disabled={!newItemText.trim()} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

const PackingList: React.FC = () => {
  const [activePerson, setActivePerson] = useState<Person>('André');
  
  // OFFLINE-FIRST: Inicializa o estado DIRETAMENTE do localStorage.
  // Isso evita a "piscada" de carregamento e faz o app parecer nativo/instantâneo.
  const [data, setData] = useState<PackingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  // Sincronização em Background
  useEffect(() => {
    // Escuta mudanças na nuvem sem bloquear a UI
    const unsubscribe = subscribeToCloudData('packing_list_v5', (cloudData: any) => {
      if (cloudData) {
        const migrated: any = {};
        (['André', 'Marcelly'] as Person[]).forEach(p => {
          migrated[p] = {};
          (['bag23kg', 'bag10kg', 'pouch5kg'] as BagType[]).forEach(b => {
            const list = cloudData[p]?.[b];
            if (Array.isArray(list)) {
              migrated[p][b] = (list as any[]).map((item: any) => ({
                ...item,
                checked: !!item.checked,
                returned: !!item.returned
              }));
            } else {
              migrated[p][b] = [];
            }
          });
        });
        // Atualiza apenas se for diferente (em um app real, faríamos um merge mais inteligente)
        // Aqui confiamos que a nuvem é a verdade se estivermos online
        setData(migrated as PackingData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
    });

    return () => unsubscribe();
  }, []);

  const updateCloud = (newData: PackingData) => {
    // Atualiza localmente IMEDIATAMENTE (Optimistic UI)
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    // Envia para nuvem em background
    syncDataToCloud('packing_list_v5', newData);
  };

  const handleToggleIda = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].checked = !list[idx].checked; updateCloud(newData); }
  };

  const handleToggleVolta = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].returned = !list[idx].returned; updateCloud(newData); }
  };

  const handleDelete = (person: Person, bag: BagType, itemId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag] = (newData[person][bag] as Item[]).filter((i: Item) => i.id !== itemId);
    updateCloud(newData);
  };

  const handleEdit = (person: Person, bag: BagType, itemId: string, newText: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[person][bag] as Item[];
    const idx = list.findIndex((i: Item) => i.id === itemId);
    if (idx > -1) { list[idx].text = newText; updateCloud(newData); }
  };

  const handleAdd = (person: Person, bag: BagType, text: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[person][bag].push({ id: Date.now().toString(), text, checked: false, returned: false });
    updateCloud(newData);
  };

  const personData = data[activePerson];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-sa-green/10 border border-sa-green/20 rounded-2xl p-4 mb-6 flex gap-3 items-start shadow-sm">
        <PlaneTakeoff className="w-5 h-5 text-sa-green shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sa-green font-bold text-sm uppercase">Check-in de Segurança</h3>
          <p className="text-[10px] text-green-800 leading-relaxed font-medium">Use 🛫 para a **Ida** e 🛬 para garantir que o item voltou na mala na **Volta**.</p>
        </div>
      </div>
      
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">
        {(['André', 'Marcelly'] as Person[]).map((person) => (
          <button key={person} onClick={() => setActivePerson(person)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activePerson === person ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <User className="w-4 h-4" /> {person}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <BagSection title="Mala 23kg (Despachada)" icon={<Luggage className="w-5 h-5 text-blue-600" />} items={personData.bag23kg} colorClass="border-blue-50" onToggleIda={(id) => handleToggleIda(activePerson, 'bag23kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'bag23kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag23kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag23kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag23kg', text)} />
        <BagSection title="Mala 10kg (Mão)" icon={<ShoppingBag className="w-5 h-5 text-orange-600" />} items={personData.bag10kg} colorClass="border-orange-50" onToggleIda={(id) => handleToggleIda(activePerson, 'bag10kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'bag10kg', id)} onDelete={(id) => handleDelete(activePerson, 'bag10kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'bag10kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'bag10kg', text)} />
        <BagSection title="Frasqueira 5kg (Mão)" icon={<Briefcase className="w-5 h-5 text-purple-600" />} items={personData.pouch5kg} colorClass="border-purple-50" onToggleIda={(id) => handleToggleIda(activePerson, 'pouch5kg', id)} onToggleVolta={(id) => handleToggleVolta(activePerson, 'pouch5kg', id)} onDelete={(id) => handleDelete(activePerson, 'pouch5kg', id)} onEdit={(id, txt) => handleEdit(activePerson, 'pouch5kg', id, txt)} onAdd={(text) => handleAdd(activePerson, 'pouch5kg', text)} />
      </div>
      
      <div className="text-center mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 uppercase font-black tracking-widest"><CloudLightning className="w-3 h-3 text-sa-green" /> Sincronização em tempo real</p>
      </div>
    </div>
  );
};

export default PackingList;
