
import React from 'react';
import { 
  Banknote, 
  Bus, 
  ClipboardList,
  Compass,
  Hotel, 
  Languages,
  Map, 
  Plane, 
  Receipt,
  Mic2,
  Syringe,
  Wallet,
  Brain,
  Car,
  CloudSun,
  ShoppingBasket
} from 'lucide-react';
import { MenuItem } from './types';

/**
 * PADRÃO DE CORES ESTREITO (Ciclo de 5):
 * 1. Verde (sa-green)
 * 2. Dourado (sa-gold)
 * 3. Azul (sa-blue)
 * 4. Vermelho (sa-red)
 * 5. Preto (tribal-dark)
 */

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'clima_localizacao', // POS 1: Card Especial (Preto/Ouro)
    title: 'Clima & Local',
    icon: <CloudSun className="w-12 h-12 text-sa-gold" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'cambio', // POS 2: Verde
    title: 'Câmbio',
    icon: <Banknote className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'mercado', // POS 3: Dourado (NOVO)
    title: 'Mercado & Delivery',
    icon: <ShoppingBasket className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'checklist', // POS 4: Azul
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-12 h-12 text-white" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'financeiro', // POS 5: Vermelho
    title: 'Financeiro',
    icon: <Wallet className="w-12 h-12 text-sa-gold" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'gastos', // POS 6: Dark
    title: 'Gastos',
    icon: <Receipt className="w-12 h-12 text-white" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'uber_bolt', // POS 7: Verde
    title: 'Uber / Bolt',
    icon: <Car className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'guias', // POS 8: Dourado
    title: 'Roteiro',
    icon: <Map className="w-12 h-12 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'hospedagem', // POS 9: Azul
    title: 'Hospedagem',
    icon: <Hotel className="w-12 h-12 text-white" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'tradutor', // POS 10: Vermelho
    title: 'Idiomas',
    icon: <Languages className="w-12 h-12 text-sa-gold" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'melhores_destinos', // POS 11: Dark
    title: 'Melhores Destinos',
    icon: <Compass className="w-12 h-12 text-white" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'onibus', // POS 12: Verde
    title: 'Ônibus',
    icon: <Bus className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'vacinas', // POS 13: Dourado
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'voos', // POS 14: Azul
    title: 'Voos',
    icon: <Plane className="w-12 h-12 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'ia_assistant', // POS 15: Vermelho
    title: 'Guia IA',
    icon: <Brain className="w-12 h-12 text-white" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
];

export const CACHE_KEY_RATES = 'checkin_go_rates';
export const ONE_HOUR_MS = 3600 * 1000;
export const EXPENSES_STORAGE_KEY = 'checkin_go_expenses_v1';
