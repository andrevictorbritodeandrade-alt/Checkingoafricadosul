#!/bin/bash

# 1. Criar estrutura de pastas
mkdir -p public
mkdir -p services
mkdir -p components

# 2. Gerar Ícones PNG (Base64 decode de um quadrado verde #007749)
# Isso resolve o problema do Android não instalar PWA com ícones SVG
echo "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAZFBMVEUAAADABHf///+8AmS9AmW+AmW/AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmV1Fvc5AAAAIHRSTlMAGPjCw30ZJcLg7yS+1Mq6Dgv14+IdT0U7OAvs26KekoK/sKIAAACnSURBVHja7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAezAAAd5n3OQAAAAASUVORK5CYII=" | base64 -d > public/icon-192.png
echo "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAZFBMVEUAAADABHf///+8AmS9AmW+AmW/AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmW+AmV1Fvc5AAAAIHRSTlMAGPjCw30ZJcLg7yS+1Mq6Dgv14+IdT0U7OAvs26KekoK/sKIAAADnSURBVHja7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDBQAQAAGap1QAAAAASUVORK5CYII=" | base64 -d > public/icon-512.png

# --- ARQUIVOS DE CONFIGURAÇÃO E RAIZ ---

cat << 'EOF' > package.json
{
  "name": "checkingo",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^0.2.1",
    "firebase": "^10.11.0",
    "lucide-react": "^0.344.0",
    "pigeon-maps": "^0.21.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
EOF

cat << 'EOF' > vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.REACT_APP_GEMINI_API_KEY || ""),
      'process.env': JSON.stringify(env)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    optimizeDeps: {
      include: ['@google/genai']
    }
  };
});
EOF

cat << 'EOF' > vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
EOF

cat << 'EOF' > .gitignore
/node_modules
/.pnp
.pnp.js
/coverage
/build
/dist
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
EOF

cat << 'EOF' > metadata.json
{
  "name": "CHECK-IN, GO!",
  "description": "A travel companion app for South Africa featuring currency conversion, itinerary management, and travel guides.",
  "requestFramePermissions": [
    "microphone",
    "geolocation",
    "camera"
  ]
}
EOF

# Atualizado com link correto para manifest e fallback
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    
    <!-- Configurações PWA / App Nativo -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Check-In GO!" />
    <meta name="application-name" content="Check-In GO!" />
    
    <!-- Estilo da Barra de Status -->
    <meta name="theme-color" content="#007749" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="msapplication-navbutton-color" content="#007749">
    <meta name="description" content="Seu guia offline para a África do Sul." />
    
    <title>Check-In, GO!</title>
    
    <!-- Links PWA (Corrigidos para PNG) -->
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/png" href="/icon-192.png" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              display: ['Poppins', 'sans-serif'],
            },
            colors: {
              sa: {
                green: '#007749',
                gold: '#FFB81C',
                red: '#E03C31',
                blue: '#001489',
                black: '#000000',
                white: '#FFFFFF',
              },
              tribal: {
                dark: '#1a1a1a',
                green: '#004d2c',
                blue: '#000a4d',
                red: '#8b1e17'
              }
            }
          }
        }
      }
    </script>
<script type="importmap">
{
  "imports": {
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "vite": "https://esm.sh/vite@^7.3.1",
    "lucide-react": "https://esm.sh/lucide-react@^0.562.0",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2",
    "firebase/": "https://esm.sh/firebase@^12.7.0/",
    "@google/genai": "https://esm.sh/@google/genai@^1.35.0",
    "pigeon-maps": "https://esm.sh/pigeon-maps@^0.22.1"
  }
}
</script>
</head>
  <body class="bg-black text-slate-800 antialiased selection:bg-sa-gold selection:text-sa-black font-sans overscroll-none">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registrado com sucesso:', reg.scope))
            .catch(err => console.error('Erro ao registrar SW:', err));
        });
      }
    </script>
  </body>
</html>
EOF

cat << 'EOF' > styles.css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  overflow-x: hidden;
}
h1, h2, h3, h4, h5, h6, button, input {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f9fafb;
}
::-webkit-scrollbar-thumb {
  background: #15803d;
  border-radius: 10px;
}
.bg-tribal-dark {
  background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png'), linear-gradient(to bottom, #2a2a2a, #1a1a1a);
  background-blend-mode: overlay;
}
.bg-tribal-gold {
  background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), linear-gradient(to bottom, #4a3a2a, #2a1a0a);
  background-blend-mode: multiply;
}
.bg-tribal-green {
  background-image: url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png'), linear-gradient(to bottom, #004d2c, #002d1a);
  background-blend-mode: overlay;
}
.bg-tribal-blue {
  background-image: url('https://www.transparenttextures.com/patterns/fabric-of-squares.png'), linear-gradient(to bottom, #001489, #000a4d);
  background-blend-mode: overlay;
}
.bg-tribal-red {
  background-image: url('https://www.transparenttextures.com/patterns/pinstripe-dark.png'), linear-gradient(to bottom, #E03C31, #8b1e17);
  background-blend-mode: overlay;
}
.text-shadow-heavy {
  text-shadow: 4px 4px 8px rgba(0,0,0,0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
}
EOF

cat << 'EOF' > index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat << 'EOF' > types.ts
import React from 'react';
export type ThemeColor = 'green' | 'gold' | 'red' | 'blue' | 'black' | 'white';
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  themeColor: ThemeColor;
  gradientClass: string;
  textColor?: string; 
  bgColor: string; 
}
export interface CurrencyRates {
  USD: number;
  BRL: number;
  ZAR: number;
  lastUpdated: number;
}
export type CurrencyCode = 'USD' | 'BRL' | 'ZAR';
EOF

cat << 'EOF' > constants.tsx
import React from 'react';
import { 
  Banknote, Bus, ClipboardList, Compass, Hotel, Languages, Map, Plane, Receipt,
  Mic2, Syringe, Wallet, Brain, Car, CloudSun, ShoppingBasket
} from 'lucide-react';
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'clima_localizacao',
    title: 'Clima & Local',
    icon: <CloudSun className="w-12 h-12 text-sa-gold" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'cambio',
    title: 'Câmbio',
    icon: <Banknote className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'mercado',
    title: 'Mercado & Delivery',
    icon: <ShoppingBasket className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'checklist',
    title: 'Checklist Malas',
    icon: <ClipboardList className="w-12 h-12 text-white" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    icon: <Wallet className="w-12 h-12 text-sa-gold" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'gastos',
    title: 'Gastos',
    icon: <Receipt className="w-12 h-12 text-white" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'uber_bolt',
    title: 'Uber / Bolt',
    icon: <Car className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'guias',
    title: 'Roteiro',
    icon: <Map className="w-12 h-12 text-sa-gold" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'hospedagem',
    title: 'Hospedagem',
    icon: <Hotel className="w-12 h-12 text-white" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'tradutor',
    title: 'Idiomas',
    icon: <Languages className="w-12 h-12 text-sa-gold" />,
    themeColor: 'red',
    gradientClass: 'bg-tribal-red border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#E03C31'
  },
  {
    id: 'melhores_destinos',
    title: 'Melhores Destinos',
    icon: <Compass className="w-12 h-12 text-white" />,
    themeColor: 'black',
    gradientClass: 'bg-tribal-dark border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#1a1a1a'
  },
  {
    id: 'onibus',
    title: 'Ônibus',
    icon: <Bus className="w-12 h-12 text-sa-gold" />,
    themeColor: 'green',
    gradientClass: 'bg-tribal-green border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#007749'
  },
  {
    id: 'vacinas',
    title: 'Vacinas (CIVP)',
    icon: <Syringe className="w-12 h-12 text-white" />,
    themeColor: 'gold',
    gradientClass: 'bg-tribal-gold border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#FFB81C'
  },
  {
    id: 'voos',
    title: 'Voos',
    icon: <Plane className="w-12 h-12 text-sa-gold" />,
    themeColor: 'blue',
    gradientClass: 'bg-tribal-blue border-sa-gold/50',
    textColor: 'text-white',
    bgColor: '#001489'
  },
  {
    id: 'ia_assistant',
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
EOF

# Manifest corrigido para usar os PNGs gerados
cat << 'EOF' > public/manifest.json
{
  "name": "Check-In, GO! África do Sul",
  "short_name": "Check-In GO!",
  "description": "Seu companheiro definitivo de viagem para a África do Sul.",
  "id": "/?source=pwa",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#007749",
  "orientation": "portrait",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "/icon-192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "any"
    },
    {
      "src": "/icon-192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "maskable"
    },
    {
      "src": "/icon-512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "maskable"
    }
  ],
  "categories": ["travel", "productivity", "lifestyle"]
}
EOF

cat << 'EOF' > public/favicon.svg
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#007749"/>
  <circle cx="256" cy="256" r="220" stroke="#FFB81C" stroke-width="12" opacity="0.3"/>
  <circle cx="256" cy="256" r="160" fill="#005a37" stroke="white" stroke-width="4" stroke-dasharray="20 10" opacity="0.5"/>
  <g transform="translate(256, 256) rotate(-45)">
    <path d="M0 160V-140" stroke="white" stroke-width="20" stroke-linecap="round" stroke-dasharray="1 40" opacity="0.6"/>
    <path d="M0 -150 L30 -100 L0 -115 L-30 -100 Z" fill="white"/>
    <rect x="-35" y="-95" width="70" height="12" rx="6" fill="white"/>
    <rect x="-15" y="-30" width="30" height="8" rx="4" fill="white"/>
  </g>
  <path d="M0 120 L180 256 L0 392 Z" fill="#FFB81C"/>
  <path d="M0 80 L230 256 L0 432" stroke="white" stroke-width="24" stroke-linecap="round" fill="none"/>
  <path d="M0 80 L230 256 L0 432" stroke="#E03C31" stroke-width="12" stroke-linecap="round" fill="none"/>
  <text x="340" y="440" fill="white" font-family="sans-serif" font-weight="900" font-size="120" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5))">GO!</text>
</svg>
EOF

# SW atualizado para incluir os PNGs no cache
cat << 'EOF' > public/sw.js
const CACHE_NAME = 'checkin-go-v16-png-icons';
const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if(networkResponse.ok) { cache.put(event.request, networkResponse.clone()); }
            return networkResponse;
          }).catch(() => {});
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  if (event.request.method !== 'GET' || url.hostname.includes('googleapis') || url.hostname.includes('firebase')) return;
  
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if(networkResponse.ok) { caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone())); }
          return networkResponse;
        });
      })
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return networkResponse;
        }).catch(() => { return caches.match('/index.html').then((res) => res || caches.match('/')); })
    );
    return;
  }
});
EOF

# --- SERVICES ---

cat << 'EOF' > services/currencyService.ts
import { CurrencyRates } from '../types';
import { CACHE_KEY_RATES, ONE_HOUR_MS } from '../constants';
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
export const getRates = async (): Promise<CurrencyRates> => {
  const cached = localStorage.getItem(CACHE_KEY_RATES);
  if (cached) {
    const parsedCache: CurrencyRates = JSON.parse(cached);
    const now = Date.now();
    if (now - parsedCache.lastUpdated < ONE_HOUR_MS) return parsedCache;
  }
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const rates: CurrencyRates = { USD: 1, BRL: data.rates.BRL || 5.0, ZAR: data.rates.ZAR || 18.0, lastUpdated: Date.now() };
    localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(rates));
    return rates;
  } catch (error) {
    if (cached) return JSON.parse(cached);
    return { USD: 1, BRL: 5.80, ZAR: 18.50, lastUpdated: Date.now() };
  }
};
EOF

cat << 'EOF' > services/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseInitialized = false;

const isValidConfig = (config: any) => config.apiKey && config.apiKey !== "undefined" && config.projectId;

if (isValidConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
    console.log("[Firebase] Inicializado.");
  } catch (error) { console.error("[Firebase] Falha:", error); }
}

const USER_ID = "andre_marcelly_sa_2026";
export type SyncStatus = 'saving' | 'saved' | 'offline' | 'online' | 'error' | 'syncing';

export const notifySyncStatus = (status: SyncStatus) => window.dispatchEvent(new CustomEvent('sync-status', { detail: status }));

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!navigator.onLine || !isFirebaseInitialized || !db) return;
  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), { ...data, lastUpdated: new Date().toISOString() }, { merge: true });
    notifySyncStatus('saved');
  } catch (e) { notifySyncStatus('error'); }
};

export const subscribeToCloudData = (collectionName: string, callback: (data: any) => void) => {
  if (!isFirebaseInitialized || !db) { setTimeout(() => callback(null), 10); return () => {}; }
  return onSnapshot(doc(db, collectionName, USER_ID), (docSnap) => {
    if (docSnap.exists()) { notifySyncStatus('syncing'); callback(docSnap.data()); setTimeout(() => notifySyncStatus('saved'), 1000); } 
    else { callback(null); }
  }, (error) => { callback(null); });
};

export const loadDataFromCloud = async (collectionName: string): Promise<any> => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) return null;
  try { const docSnap = await getDoc(doc(db, collectionName, USER_ID)); return docSnap.exists() ? docSnap.data() : null; } catch (e) { return null; }
};
export { db, auth };
EOF

cat << 'EOF' > services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
export async function generateText(prompt: string) {
  if (!process.env.API_KEY) return "Serviço de IA indisponível (Chave ausente).";
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text;
  } catch (error) { return "Desculpe, problema ao conectar com a IA."; }
}
EOF

cat << 'EOF' > services/weatherService.ts
interface WeatherData {
  temp: number; tempMax: number; tempMin: number; feelsLike: number;
  humidity: number; windSpeed: number; rainProb: number; isDay: boolean;
}
export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Weather API Error`);
    const data = await response.json();
    return {
      temp: data.current.temperature_2m, tempMax: data.daily.temperature_2m_max[0],
      tempMin: data.daily.temperature_2m_min[0], feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m, windSpeed: data.current.wind_speed_10m,
      rainProb: data.daily.precipitation_probability_max[0], isDay: data.current.is_day === 1
    };
  } catch (error) { return null; }
};
EOF

# --- COMPONENTS ---

cat << 'EOF' > components/SyncIndicator.tsx
const SyncIndicator = () => null;
export default SyncIndicator;
EOF

cat << 'EOF' > components/Header.tsx
import React from 'react';
const Header: React.FC = () => {
  return (
    <div className="relative w-full min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
        <div className="relative w-full h-full overflow-hidden filter blur-[20px] opacity-80 scale-110">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/1200px-Nelson_Mandela_1994.jpg" alt="Mandela Background" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125" />
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-90" style={{ backgroundImage: 'url("https://flagcdn.com/w2560/za.png")' }}></div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center w-full">
          <h1 className="font-display font-black text-white text-[10vw] sm:text-[11vw] md:text-[11.5vw] lg:text-[12vw] tracking-tighter text-shadow-heavy uppercase leading-none italic flex flex-row flex-nowrap items-center justify-center select-none whitespace-nowrap drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
            <span className="drop-shadow-2xl">CHECK-IN,</span>
            <span className="flex items-center ml-[0.12em]">G<div className="relative inline-flex items-center justify-center w-[1.1em] h-[1.1em] mx-[-0.05em]"><div className="absolute inset-0 rounded-full bg-blue-400/30 blur-2xl animate-pulse"></div><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png" alt="Terra" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,1)] animate-[spin_120s_linear_infinite]" /></div>!</span>
          </h1>
          <h2 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.4em] text-shadow-heavy uppercase mt-2 drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">ÁFRICA DO SUL</h2>
        </div>
        <div className="w-[22vw] max-w-[160px] h-1.5 bg-sa-gold rounded-full mt-6 shadow-[0_0_30px_rgba(255,184,28,0.8)] animate-pulse"></div>
      </div>
    </div>
  );
};
export default Header;
EOF

cat << 'EOF' > components/MenuCard.tsx
import React from 'react';
import { MenuItem } from '../types';
interface MenuCardProps extends MenuItem { onClick: () => void; }
const MenuCard: React.FC<MenuCardProps> = ({ title, icon, gradientClass, textColor = 'text-white', onClick }) => {
  return (
    <button onClick={onClick} className={`group relative w-full aspect-square p-[2px] rounded-lg shadow-2xl transition-all duration-300 active:scale-95 border-2 ${gradientClass}`}>
      <div className="flex flex-col items-center justify-center p-2 gap-1 h-full w-full relative z-10">
        <div className="group-hover:scale-110 transition-transform duration-500 shrink-0">{icon}</div>
        <span className={`${textColor} text-[13px] font-display font-black tracking-widest text-center uppercase leading-tight px-1`}>{title}</span>
      </div>
      <div className="absolute inset-0 bg-sa-gold/0 group-hover:bg-sa-gold/5 transition-colors duration-300"></div>
    </button>
  );
};
export default MenuCard;
EOF

cat << 'EOF' > components/AccordionItem.tsx
import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeColor } from '../types';

interface AccordionItemProps { id: string; title: string; icon: React.ReactNode; isOpen: boolean; onToggle: () => void; children: React.ReactNode; themeColor?: ThemeColor; }
const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, isOpen, onToggle, children, themeColor = 'green' }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (isOpen && contentRef.current) setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300); }, [isOpen]);
  const theme = {
      green: { border: 'border-l-sa-green', iconBg: isOpen ? 'bg-sa-green text-white' : 'bg-green-50 text-sa-green', title: isOpen ? 'text-sa-green' : 'text-gray-700' },
      gold: { border: 'border-l-sa-gold', iconBg: isOpen ? 'bg-sa-gold text-sa-black' : 'bg-yellow-50 text-yellow-700', title: isOpen ? 'text-yellow-800' : 'text-gray-700' },
      red: { border: 'border-l-sa-red', iconBg: isOpen ? 'bg-sa-red text-white' : 'bg-red-50 text-sa-red', title: isOpen ? 'text-sa-red' : 'text-gray-700' },
      blue: { border: 'border-l-sa-blue', iconBg: isOpen ? 'bg-sa-blue text-white' : 'bg-blue-50 text-sa-blue', title: isOpen ? 'text-sa-blue' : 'text-gray-700' },
      black: { border: 'border-l-sa-black', iconBg: isOpen ? 'bg-sa-black text-white' : 'bg-gray-100 text-sa-black', title: isOpen ? 'text-sa-black' : 'text-gray-700' },
      white: { border: 'border-l-gray-300', iconBg: isOpen ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800', title: isOpen ? 'text-gray-900' : 'text-gray-700' }
  }[themeColor as ThemeColor];

  return (
    <div className={`mb-3 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out border-l-[6px] ${theme.border} ${isOpen ? 'bg-white shadow-lg ring-1 ring-black/5' : 'bg-white shadow-md hover:shadow-lg'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left focus:outline-none touch-manipulation group">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl transition-colors duration-300 shadow-sm ${theme.iconBg} group-hover:opacity-90`}>{icon}</div>
          <span className={`text-lg font-display font-bold transition-colors tracking-wide ${theme.title} group-hover:opacity-80`}>{title}</span>
        </div>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : 'text-gray-300'}`} />
      </button>
      <div ref={contentRef} className={`transition-all duration-300 ease-in-out overflow-hidden bg-white`} style={{ maxHeight: isOpen ? (contentRef.current?.scrollHeight ? `${contentRef.current.scrollHeight}px` : '1000px') : '0px', opacity: isOpen ? 1 : 0.8 }}>
        <div className="p-5 pt-0 border-t border-dashed border-gray-100 mt-1"><div className="pt-4 font-sans max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">{children}</div></div>
      </div>
    </div>
  );
};
export default AccordionItem;
EOF

cat << 'EOF' > components/AccommodationList.tsx
import React, { useState } from 'react';
import { Hotel, MapPin, CalendarDays, ChevronDown, ChevronUp, CheckCircle2, Clock, ShieldCheck, Plane, Users, Wallet } from 'lucide-react';

const ACCOMMODATIONS = [
  { id: 'DOMANI', tripPhase: 'IDA', cityLabel: 'SÃO PAULO', name: 'Hotel Domani', provider: 'Hoteis.com', dates: '24 jan. - 25 jan. de 2026', status: 'Confirmada', price: 'Já Pago', neighborhood: 'Guarulhos, São Paulo', location: 'Centro de Guarulhos', guests: '2 hóspedes', checkInInfo: 'Check-in: sábado, 24 de jan. Check-out: domingo, 25 de jan.' },
  { id: 'CPT_AIRBNB', tripPhase: 'DESTINO 1', cityLabel: 'CIDADE DO CABO', name: 'Estúdio Sea Point (Craig & Jenna)', provider: 'Airbnb', dates: '26 jan. – 31 jan. de 2026', status: 'Confirmada', price: 'R$ 1.888,25', neighborhood: 'Sea Point, Cidade do Cabo', location: '38 Michau Street', guests: '2 hóspedes', checkInInfo: 'Check-in: 15:00 • Checkout: 11:00 • Código: HM92D3C8K5' },
  { id: 'SANDTON_AIRBNB', tripPhase: 'DESTINO 2', cityLabel: 'JOANESBURGO', name: 'Casa de hóspedes em Sandton', provider: 'Airbnb', dates: '31 de jan. – 6 de fev. de 2026', status: 'Confirmada', price: 'R$ 1.363,93', neighborhood: 'Sandton, Joanesburgo', location: 'Quarto em casa de hóspedes', guests: '2 hóspedes', checkInInfo: 'Status: Confirmada (Pago).' },
  { id: 'SLAVIERO', tripPhase: 'VOLTA', cityLabel: 'SÃO PAULO', name: 'SLAVIERO Downtown São Paulo', provider: 'Hoteis.com', dates: '6 fev. - 7 fev. de 2026', status: 'Confirmada', price: 'Já Pago', neighborhood: 'Centro, São Paulo', location: 'Rua Araújo, 141', guests: '2 hóspedes', checkInInfo: 'Check-in: sexta, 6 de fev. Check-out: sábado, 7 de fev.' }
];

const AccommodationCard = ({ item }: any) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`rounded-[32px] border-2 overflow-hidden shadow-xl bg-white transition-all mb-6 ${item.status === 'Pendente' ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className={`p-3 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${item.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-700 text-white'}`}>
        {item.status === 'Pendente' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} Reserva {item.status.toLowerCase()}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1"><span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">{item.tripPhase}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.provider}</span></div>
            <h2 className="text-xl font-display font-black text-slate-800 leading-tight uppercase">{item.name}</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">{item.location}</p>
          </div>
          <div className={`p-3 rounded-2xl border shadow-sm ${item.status === 'Pendente' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}><Hotel className="w-6 h-6" /></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium"><CalendarDays className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" /><span>{item.dates}</span></div>
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium"><MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" /><span>{item.neighborhood}</span></div>
          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium"><Users className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" /><span>{item.guests}</span></div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 font-black text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-200/50">{expanded ? 'OCULTAR DETALHES' : 'VER DETALHES DO CHECK-IN'}{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
        {expanded && (
          <div className="mt-4 p-5 bg-slate-50 rounded-[24px] border border-slate-200/50 animate-in fade-in slide-in-from-top-2">
             <div className="space-y-3">
                <div className="flex items-start gap-3"><ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /><p className="text-[11px] text-slate-600 leading-relaxed italic">Informação extraída do seu comprovante de reserva.</p></div>
                <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /><p className="text-[11px] text-slate-600 leading-relaxed font-bold">{item.checkInInfo}</p></div>
             </div>
          </div>
        )}
      </div>
      <div className={`p-4 px-6 flex justify-between items-center ${item.status === 'Pendente' ? 'bg-amber-50/50' : 'bg-slate-50'}`}>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Wallet className="w-4 h-4" /> Total da Estadia</span>
          <div className="text-right"><span className={`text-xl font-display font-black ${item.status === 'Pendente' ? 'text-amber-700' : 'text-slate-700'}`}>{item.price}</span></div>
      </div>
    </div>
  );
};
const AccommodationList: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-200 flex items-start gap-4">
         <div className="bg-slate-700 text-white p-2 rounded-xl shrink-0"><Plane className="w-4 h-4" /></div>
         <p className="text-[11px] text-slate-600 font-bold leading-relaxed">Painel de reservas oficiais. As hospedagens estão listadas em ordem cronológica de acordo com o seu roteiro.</p>
      </div>
      <div className="space-y-12">
        {Array.from(new Set(ACCOMMODATIONS.map(a => a.cityLabel))).map(city => (
            <div key={city} className="space-y-4">
                <div className="flex items-center gap-3 px-2"><div className="h-0.5 flex-1 bg-slate-200"></div><h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{city}</h3><div className="h-0.5 flex-1 bg-slate-200"></div></div>
                {ACCOMMODATIONS.filter(a => a.cityLabel === city).map(acc => <AccommodationCard key={acc.id} item={acc} />)}
            </div>
        ))}
      </div>
      <div className="text-center"><p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Boa estada, André e Marcelly! 🏠</p></div>
    </div>
  );
};
export default AccommodationList;
EOF

cat << 'EOF' > components/BusList.tsx
import React, { useMemo } from 'react';
import { Bus, Clock, Zap, Armchair, Snowflake, Ticket, CalendarDays, User, Car, CheckCircle2, Calculator } from 'lucide-react';

const BUS_DATA = [
  {
    id: 'bus-ida-rio-sp', type: 'ida', origin: 'Rio de Janeiro', terminalOrigin: 'Rod. Novo Rio', destination: 'São Paulo', terminalDest: 'Term. Rod. Tietê', departureTime: '06:30', arrivalTime: '12:30', duration: '06h 00m', company: 'Penha', classType: 'Semi-Leito', features: ['Ar-condicionado', 'Banheiro', 'Tomada USB', 'Conforto'], price: 'R$ 127,98', date: '24/Jan', fullDate: '24/01/2026',
    lastMile: { title: 'Conexão Final: Rodoviária → Hotel', origin: 'Terminal Rodoviário Tietê', dest: 'Hotel Domani (Guarulhos)', options: [{ type: 'UberX', price: 'R$ 33,95', desc: 'Valor real conforme reserva (4 passageiros)', recommended: true }, { type: 'Uber Comfort', price: 'R$ 41,50', desc: 'Carros mais novos e espaçosos' }, { type: 'Uber Black', price: 'R$ 58,90', desc: 'Experiência Premium' }] }
  },
  {
    id: 'bus-volta-sp-rio', type: 'volta', origin: 'São Paulo', terminalOrigin: 'Term. Rod. Tietê', destination: 'Rio de Janeiro', terminalDest: 'Rod. Novo Rio', departureTime: '13:00', arrivalTime: '19:00', duration: '06h 00m', company: 'Penha', classType: 'Semi-Leito', features: ['Ar-condicionado', 'Banheiro', 'Reclina 135º'], price: 'R$ 90,98', date: '07/Fev', fullDate: '07/02/2026',
    firstMile: { title: 'Reserva Confirmada: Estadia → Rodoviária', origin: 'Nobile Downtown São Paulo', dest: 'Terminal Rodoviário Tietê', options: [{ type: 'UberX', price: 'R$ 17,92', desc: 'Reserva Confirmada às 11:30 BRT', recommended: true, confirmed: true }, { type: 'Comfort', price: 'R$ 22,50', desc: 'Carros mais novos' }] }
  }
];

const BusList: React.FC = () => {
  const totals = useMemo(() => {
    let busTotal = 0, uberTotal = 0;
    BUS_DATA.forEach(trip => {
      busTotal += parseFloat(trip.price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) * 2;
      if (trip.firstMile) uberTotal += Math.min(...trip.firstMile.options.map(o => parseFloat(o.price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())));
      if (trip.lastMile) uberTotal += Math.min(...trip.lastMile.options.map(o => parseFloat(o.price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())));
    });
    return { busTotal, uberTotal, grandTotal: busTotal + uberTotal };
  }, []);

  const renderUberCard = (data: any, type: any) => (
    <div className={`bg-slate-900 text-white rounded-3xl p-5 shadow-2xl relative overflow-hidden border border-slate-700 ${type === 'first' ? 'mb-4' : 'mt-4'}`}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mercator_projection_Square.JPG/1200px-Mercator_projection_Square.JPG')] bg-cover mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest"><Car className="w-4 h-4" /> {data.title}</div>
            {data.options.some((o: any) => o.confirmed) && (<span className="flex items-center gap-1 bg-green-900/40 text-green-400 text-[9px] px-2 py-0.5 rounded-full border border-green-800"><CheckCircle2 className="w-3 h-3" /> RESERVADO</span>)}
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white"></div><span className="text-sm font-medium opacity-80">{data.origin}</span></div>
            <div className="w-0.5 h-3 bg-slate-600 ml-[3px]"></div>
            <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${type === 'first' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}></div><span className="text-sm font-bold text-white">{data.dest}</span></div>
          </div>
          <div className="space-y-2">
            {data.options.map((opt: any, i: number) => (
              <div key={i} className={`flex justify-between items-center p-3 rounded-xl border ${opt.recommended ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  <div>
                    <div className="flex items-center gap-2"><span className="font-bold text-sm">{opt.type}</span>{opt.confirmed ? <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Confirmado</span> : opt.recommended && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Melhor Opção</span>}</div>
                    <span className="text-[10px] block mt-0.5 text-slate-500">{opt.desc}</span>
                  </div>
                  <span className="font-display font-black text-lg">{opt.price}</span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-2xl shadow-sm"><h3 className="font-display font-black text-amber-800 uppercase text-[10px] tracking-widest mb-1 flex items-center gap-2"><Bus className="w-4 h-4" /> Logística Terrestre</h3><p className="text-[11px] text-amber-900 font-medium leading-relaxed">Trajetos Rodoviários (Rio x SP).</p></div>
      {BUS_DATA.map((trip) => (
        <div key={trip.id} className="space-y-4">
          {trip.firstMile && renderUberCard(trip.firstMile, 'first')}
          <div className={`rounded-3xl overflow-hidden shadow-xl border-2 relative group transition-all hover:shadow-2xl ${trip.type === 'ida' ? 'bg-white border-amber-100 hover:border-amber-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
            <div className={`p-4 text-white relative overflow-hidden ${trip.type === 'ida' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-slate-600 to-slate-800'}`}>
              <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"><Bus className="w-4 h-4" /><span className="font-display font-black uppercase tracking-wider text-xs">{trip.type === 'ida' ? 'IDA / DECOLAGEM' : 'VOLTA / RETORNO'}</span></div>
                  <div className="flex items-center gap-1 font-bold text-xs bg-black/20 px-2 py-1 rounded-lg"><CalendarDays className="w-3.5 h-3.5" />{trip.fullDate}</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-8 relative">
                  <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10"></div>
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-gray-400 flex items-center gap-1 border border-gray-100 rounded-full"><Clock className="w-3 h-3" /> {trip.duration}</div>
                  <div className="text-left"><span className="block text-3xl font-black text-slate-800 tracking-tighter">{trip.departureTime}</span><span className="text-xs font-bold text-gray-500 uppercase mt-1 block">{trip.origin}</span><span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">{trip.terminalOrigin}</span></div>
                  <div className="text-right"><span className="block text-3xl font-black text-slate-800 tracking-tighter">{trip.arrivalTime}</span><span className="text-xs font-bold text-gray-500 uppercase mt-1 block">{trip.destination}</span><span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">{trip.terminalDest}</span></div>
              </div>
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-5">
                  <div className="flex justify-between items-center mb-3"><div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Viação / Empresa</span><span className="font-black text-slate-800 text-lg flex items-center gap-2">{trip.company} <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-md font-bold uppercase">Confirmado</span></span></div><div className="text-right"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Classe</span><span className="font-bold text-gray-700 text-sm bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">{trip.classType}</span></div></div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/50">{trip.features.map((feat, i) => (<span key={i} className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">{feat.includes('USB') && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-100" />}{feat.includes('Ar') && <Snowflake className="w-3 h-3 text-blue-400" />}{feat.includes('Banheiro') && <Ticket className="w-3 h-3 text-gray-400" />}{feat.includes('Conforto') && <Armchair className="w-3 h-3 text-purple-400" />}{feat}</span>))}</div>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-4"><div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Passageiro</span><span className="text-xs font-bold text-gray-600 mt-0.5">Preço por pessoa</span></div><div className="text-right"><span className="block text-3xl font-display font-black text-slate-800 tracking-tight">{trip.price}</span></div></div>
            </div>
          </div>
          {trip.lastMile && renderUberCard(trip.lastMile, 'last')}
        </div>
      ))}
      <div className="bg-slate-900 text-white rounded-[30px] p-6 shadow-2xl mt-8">
        <div className="flex items-center gap-3 mb-6"><div className="bg-green-500 p-2.5 rounded-xl text-slate-900"><Calculator className="w-6 h-6" /></div><div><h3 className="font-display font-black text-lg leading-none">Resumo Financeiro</h3><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logística Terrestre Total</span></div></div>
        <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10"><div className="flex flex-col"><span className="font-bold text-sm flex items-center gap-2"><Bus className="w-4 h-4 text-amber-500" /> Passagens</span><span className="text-[10px] text-slate-400">Ida e Volta (2 Pessoas)</span></div><span className="font-mono font-bold">{totals.busTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10"><div className="flex flex-col"><span className="font-bold text-sm flex items-center gap-2"><Car className="w-4 h-4 text-green-500" /> Uber Total</span><span className="text-[10px] text-slate-400">Menor valor por trecho (1 Carro)</span></div><span className="font-mono font-bold">{totals.uberTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between items-end"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Custo Final Estimado</span><span className="text-3xl font-display font-black text-green-400 tracking-tight">{totals.grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
      </div>
      <div className="text-center pb-8"><p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">Boa viagem! 🚌</p></div>
    </div>
  );
};
export default BusList;
EOF

cat << 'EOF' > components/CurrencyConverter.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, WifiOff, TrendingUp } from 'lucide-react';
import { getRates } from '../services/currencyService';

const CurrencyInput = ({ code, value, flag, name, rateText, onChange }: any) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <div className="flex justify-between items-end px-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-display">{name}</label></div>
    <div className="relative flex items-center group">
      <div className="absolute left-4 flex items-center gap-3 pointer-events-none z-10"><span className="text-2xl drop-shadow-sm select-none grayscale-[0.2]">{flag}</span><span className="font-display font-bold text-green-900 text-lg tracking-wide">{code}</span></div>
      <input type="number" inputMode="decimal" value={value} placeholder="0.00" onChange={(e) => onChange(e.target.value, code)} className="w-full pl-28 pr-4 pt-4 pb-8 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-right font-display text-2xl font-bold text-slate-800 shadow-sm group-hover:bg-white group-hover:border-gray-200 placeholder:text-gray-300" />
      <div className="absolute right-4 bottom-2 pointer-events-none flex items-center gap-1"><TrendingUp className="w-3 h-3 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 tracking-wide font-display bg-gray-100/50 px-1.5 py-0.5 rounded-md">{rateText}</span></div>
    </div>
  </div>
);

const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [values, setValues] = useState({ BRL: '', USD: '', ZAR: '' });

  const fetchAndSetRates = useCallback(async () => {
    setLoading(true);
    try { const data = await getRates(); setRates(data); setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); } catch (error) {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAndSetRates(); const interval = setInterval(fetchAndSetRates, 300000); return () => clearInterval(interval); }, [fetchAndSetRates]);

  const handleConversion = (value: string, source: string) => {
    if (!rates || value === '') { setValues({ BRL: '', USD: '', ZAR: '' }); return; }
    const amount = parseFloat(value);
    if (isNaN(amount)) return;
    const amountInUSD = amount / rates[source];
    setValues({ USD: source === 'USD' ? value : (amountInUSD * rates.USD).toFixed(2), BRL: source === 'BRL' ? value : (amountInUSD * rates.BRL).toFixed(2), ZAR: source === 'ZAR' ? value : (amountInUSD * rates.ZAR).toFixed(2) });
  };

  const getRateText = (code: string) => {
    if (!rates) return '...';
    const fmt = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (code === 'ZAR') return `1 ZAR ≈ ${(rates.BRL / rates.ZAR).toLocaleString('pt-BR', fmt)} BRL`;
    if (code === 'USD') return `1 USD ≈ ${rates.BRL.toLocaleString('pt-BR', fmt)} BRL`;
    if (code === 'BRL') return `1 BRL ≈ ${(rates.ZAR / rates.BRL).toLocaleString('pt-BR', fmt)} ZAR`;
    return '';
  };

  if (!rates && loading) return (<div className="flex flex-col items-center justify-center py-12 text-green-500 animate-pulse"><RefreshCw className="w-8 h-8 animate-spin mb-2" /><p className="font-display font-medium">Carregando taxas...</p></div>);

  return (
    <div className="p-1">
      <div className="bg-white rounded-3xl p-1">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span></span><span className="text-xs text-green-700 font-medium font-display tracking-wide">ATUALIZADO: {lastUpdated}</span></div>
          <button onClick={fetchAndSetRates} disabled={loading} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors border border-transparent hover:border-green-100"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
        <CurrencyInput code="ZAR" name="Rand Sul-Africano" flag="🇿🇦" value={values.ZAR} rateText={getRateText('ZAR')} onChange={handleConversion} />
        <CurrencyInput code="BRL" name="Real Brasileiro" flag="🇧🇷" value={values.BRL} rateText={getRateText('BRL')} onChange={handleConversion} />
        <CurrencyInput code="USD" name="Dólar Americano" flag="🇺🇸" value={values.USD} rateText={getRateText('USD')} onChange={handleConversion} />
        {!navigator.onLine && (<div className="mt-4 flex items-center justify-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium"><WifiOff className="w-4 h-4" /><span>Modo offline. Usando últimas taxas.</span></div>)}
      </div>
      <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100/50 shadow-sm"><p className="text-green-800 text-sm font-medium text-center leading-relaxed">💡 <strong>Dica:</strong> Use o valor em ZAR acima para ter noção rápida de preços em menus e lojas!</p></div>
    </div>
  );
};
export default CurrencyConverter;
EOF

cat << 'EOF' > components/ExpenseTracker.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, CalendarDays, CreditCard } from 'lucide-react';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';
import { getRates } from '../services/currencyService';
import { EXPENSES_STORAGE_KEY } from '../constants';

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>(() => { try { const saved = localStorage.getItem(EXPENSES_STORAGE_KEY); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [rates, setRates] = useState<any>(null);

  useEffect(() => {
    const initData = async () => {
      const r = await getRates(); setRates(r);
      if (navigator.onLine) { try { const cloudData = await loadDataFromCloud('expenses_log'); if (cloudData && cloudData.list) { setExpenses(cloudData.list); localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(cloudData.list)); } } catch (e) {} }
    };
    initData();
  }, []);

  useEffect(() => { localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses)); const t = setTimeout(() => syncDataToCloud('expenses_log', { list: expenses }), 2000); return () => clearTimeout(t); }, [expenses]);

  const handleAdd = () => {
    if (!desc.trim() || !amount || !rates) return;
    const val = parseFloat(amount);
    let valInBRL = 0;
    if (currency === 'BRL') valInBRL = val; else if (currency === 'USD') valInBRL = val * rates.BRL; else if (currency === 'ZAR') valInBRL = (val / rates.ZAR) * rates.BRL;
    setExpenses([{ id: Date.now().toString(), description: desc, amount: val, currency, amountInBRL: valInBRL, date: new Date().toLocaleDateString('pt-BR') }, ...expenses]);
    setDesc(''); setAmount('');
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountInBRL, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Receipt className="w-32 h-32" /></div>
        <div className="relative z-10"><span className="text-purple-200 text-xs font-bold uppercase tracking-wider block mb-1">Total Gasto (Convertido)</span><span className="text-4xl font-bold font-display">R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><p className="text-purple-200 text-xs mt-2 opacity-80">*Valores convertidos usando a cotação do dia.</p></div>
      </div>
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-purple-600" /> Novo Gasto</h3>
        <div className="space-y-3">
          <input type="text" placeholder="O que você comprou?" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-medium text-sm" />
          <div className="flex gap-2">
            <div className="w-1/3 relative"><select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-3 bg-gray-100 rounded-xl font-bold text-gray-700 appearance-none outline-none border border-transparent focus:bg-white focus:border-purple-500"><option value="ZAR">Rand (R)</option><option value="USD">Dólar ($)</option><option value="BRL">Real (R$)</option></select></div>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 font-bold text-gray-800" />
          </div>
          <button onClick={handleAdd} disabled={!desc || !amount} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:shadow-none">Adicionar Despesa</button>
        </div>
      </div>
      <div className="space-y-3">
         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Histórico</h4>
         {expenses.length === 0 && (<div className="text-center py-8 text-gray-400"><CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20" /><p className="text-sm">Nenhum gasto lançado.</p></div>)}
         {expenses.map(item => (<div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-2"><div className="flex items-center gap-3"><div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Receipt className="w-4 h-4" /></div><div><p className="font-bold text-gray-800 text-sm">{item.description}</p><p className="text-[10px] text-gray-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {item.date}</p></div></div><div className="text-right flex items-center gap-3"><div><p className="font-bold text-gray-800 text-sm">{item.currency} {item.amount.toLocaleString()}</p>{item.currency !== 'BRL' && (<p className="text-[10px] text-purple-600 font-medium">≈ R$ {item.amountInBRL.toFixed(2)}</p>)}</div><button onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></div></div>))}
      </div>
    </div>
  );
};
export default ExpenseTracker;
EOF

cat << 'EOF' > components/FinancialControl.tsx
import React, { useState, useEffect } from 'react';
import { Wallet, Landmark, Bus, Hotel, TrendingDown, Cloud, MapPin, Receipt, Banknote, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';
import { GUIDE_STORAGE_KEY } from './GuideList';
import { EXPENSES_STORAGE_KEY } from '../constants';
import { syncDataToCloud, loadDataFromCloud } from '../services/firebase';

const toBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const WalletInput = ({ label, icon, value, onChange, colorClass }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border ${colorClass} bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-200`}>
    <div className="shrink-0">{icon}</div><div className="flex-1"><span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">{label}</span><div className="flex items-center gap-1"><span className="text-gray-400 text-xs font-bold">R$</span><input type="number" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="0" className="w-full text-sm font-bold text-gray-800 outline-none bg-transparent" /></div></div>
  </div>
);

const FinancialControl: React.FC = () => {
  const [wallets, setWallets] = useState(() => { try { const s = localStorage.getItem('checkin_go_finance_v1'); return s ? JSON.parse(s).wallets : { wise: 0, nomad: 0, inter: 0, cash: 0 }; } catch { return { wise: 0, nomad: 0, inter: 0, cash: 0 }; } });
  const [hotelCost, setHotelCost] = useState(() => { try { return JSON.parse(localStorage.getItem('checkin_go_finance_v1') || '{}').hotelCost || 0; } catch { return 0; } });
  const [busCost, setBusCost] = useState(() => { try { return JSON.parse(localStorage.getItem('checkin_go_finance_v1') || '{}').busCost || 0; } catch { return 0; } });
  const [totalCPT, setTotalCPT] = useState(0);
  const [totalJNB, setTotalJNB] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => { if (navigator.onLine) loadDataFromCloud('financial_data').then(d => { if(d) { if(d.wallets) setWallets(d.wallets); if(d.hotelCost) setHotelCost(d.hotelCost); if(d.busCost) setBusCost(d.busCost); localStorage.setItem('checkin_go_finance_v1', JSON.stringify(d)); } }); }, []);
  useEffect(() => { const g = localStorage.getItem(GUIDE_STORAGE_KEY); if (g) { try { const p = JSON.parse(g); let c = 0, j = 0; if (p.CPT) p.CPT.forEach((d:any) => c += (parseInt(d.estimate.replace(/\D/g,'')) || 0)); if (p.JNB) p.JNB.forEach((d:any) => j += (parseInt(d.estimate.replace(/\D/g,'')) || 0)); setTotalCPT(c); setTotalJNB(j); } catch {} } }, []);
  useEffect(() => { const e = localStorage.getItem(EXPENSES_STORAGE_KEY); if (e) { try { const l = JSON.parse(e); setTotalExpenses(l.reduce((a:number, c:any) => a + c.amountInBRL, 0)); } catch {} } }, []);
  useEffect(() => { const d = { wallets, hotelCost, busCost }; localStorage.setItem('checkin_go_finance_v1', JSON.stringify(d)); const t = setTimeout(() => syncDataToCloud('financial_data', d), 2000); return () => clearTimeout(t); }, [wallets, hotelCost, busCost]);

  const updateWallet = (k: string, v: string) => setWallets((p:any) => ({ ...p, [k]: parseFloat(v) || 0 }));
  const totalBalance = wallets.wise + wallets.nomad + wallets.inter + wallets.cash;
  const totalEst = totalCPT + totalJNB + hotelCost + busCost;
  const currentBal = totalBalance - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-lg overflow-hidden animate-in fade-in">
        <div className="bg-slate-800/50 p-4 pb-2"><div className="flex justify-between items-start mb-4"><label className="text-blue-200 text-xs font-bold uppercase tracking-wider block flex items-center gap-2"><Wallet className="w-4 h-4" /> Minhas Carteiras</label><Cloud className="w-3 h-3 text-blue-300 opacity-50" /></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <WalletInput label="Wise" icon={<CreditCard className="w-6 h-6 text-[#9FE870]" />} value={wallets.wise} onChange={(v:string) => updateWallet('wise', v)} colorClass="border-[#9FE870]/30" />
            <WalletInput label="Nomad" icon={<CreditCard className="w-6 h-6 text-[#FFD700]" />} value={wallets.nomad} onChange={(v:string) => updateWallet('nomad', v)} colorClass="border-[#FFD700]/30" />
            <WalletInput label="Inter" icon={<CreditCard className="w-6 h-6 text-[#FF7A00]" />} value={wallets.inter} onChange={(v:string) => updateWallet('inter', v)} colorClass="border-[#FF7A00]/30" />
            <WalletInput label="Espécie" icon={<Banknote className="w-6 h-6 text-green-700" />} value={wallets.cash} onChange={(v:string) => updateWallet('cash', v)} colorClass="border-green-200" />
          </div>
        </div>
        <div className="bg-white m-1 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2"><span className="text-xs font-bold text-gray-400">Total Acumulado</span><span className="text-sm font-bold text-slate-700">{toBRL(totalBalance)}</span></div>
          <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-red-400 flex items-center gap-1"><Receipt className="w-3 h-3" /> Gastos</span><span className="text-sm font-bold text-red-500">- {toBRL(totalExpenses)}</span></div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-end"><span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Saldo Líquido</span><span className={`text-2xl font-black font-display tracking-tight ${currentBal < 0 ? 'text-red-500' : 'text-green-600'}`}>{toBRL(currentBal)}</span></div>
        </div>
      </div>
      <div className="bg-amber-50 rounded-3xl border border-amber-200 p-5 shadow-sm">
         <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-3 font-display text-sm uppercase"><ShieldCheck className="w-5 h-5 text-amber-600" /> Estratégia de Câmbio</h3>
         <ul className="space-y-2 text-[11px] text-amber-900 font-medium leading-relaxed">
            <li className="flex gap-2"><CreditCard className="w-4 h-4 shrink-0 text-amber-600" /><span><strong>Inter Virtual:</strong> Aproximação (90%).</span></li>
            <li className="flex gap-2"><Banknote className="w-4 h-4 shrink-0 text-amber-600" /><span><strong>Wise Físico:</strong> Saques.</span></li>
            <li className="flex gap-2 bg-white/50 p-2 rounded-xl border border-amber-200"><AlertCircle className="w-4 h-4 shrink-0 text-red-600" /><span>No ATM, <strong>"Decline Conversion"</strong>.</span></li>
         </ul>
      </div>
       <div className="bg-green-50 rounded-3xl border border-green-200 p-5 shadow-sm">
         <h3 className="text-green-800 font-bold flex items-center gap-2 mb-4 font-display"><Landmark className="w-5 h-5 text-green-600" /> Planejamento x Realidade</h3>
         <div className="grid grid-cols-2 gap-3 mb-4">
             <div className="bg-white p-3 rounded-xl border border-green-100"><div className="flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3 text-blue-600" /><span className="text-[10px] font-bold text-gray-500 uppercase">Cidade do Cabo</span></div><span className="block text-xl font-black text-blue-800">{toBRL(totalCPT)}</span></div>
             <div className="bg-white p-3 rounded-xl border border-green-100"><div className="flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3 text-yellow-600" /><span className="text-[10px] font-bold text-gray-500 uppercase">Joanesburgo</span></div><span className="block text-xl font-black text-yellow-800">{toBRL(totalJNB)}</span></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-dashed border-green-300">
             <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-500 uppercase">Meta da Viagem</span><span className="text-lg font-black text-gray-800">{toBRL(totalEst)}</span></div>
             <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 mb-1 overflow-hidden"><div className={`h-full ${totalBalance >= totalEst ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (totalBalance / totalEst) * 100)}%` }}></div></div>
             <p className="text-[10px] text-right text-gray-400">{totalBalance >= totalEst ? 'Seu saldo cobre a estimativa.' : `Faltam ${toBRL(totalEst - totalBalance)}.`}</p>
         </div>
       </div>
      <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-gray-800 font-bold flex items-center gap-2 mb-4 font-display"><TrendingDown className="w-5 h-5 text-orange-500" /> Custos Extras (Pendentes)</h3>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Hotel className="w-3.5 h-3.5" /> Hospedagem (A Pagar)</label><div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-200"><span className="text-gray-400 text-sm font-bold mr-2">R$</span><input type="number" value={hotelCost || ''} onChange={(e) => setHotelCost(parseFloat(e.target.value) || 0)} placeholder="0,00" className="bg-transparent w-full py-3 text-gray-700 font-bold outline-none" /></div></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Bus className="w-3.5 h-3.5" /> Ônibus / Transfers Extras</label><div className="flex items-center bg-gray-50 rounded-xl px-3 border border-gray-200"><span className="text-gray-400 text-sm font-bold mr-2">R$</span><input type="number" value={busCost || ''} onChange={(e) => setBusCost(parseFloat(e.target.value) || 0)} placeholder="0,00" className="bg-transparent w-full py-3 text-gray-700 font-bold outline-none" /></div></div>
        </div>
      </div>
    </div>
  );
};
export default FinancialControl;
EOF

cat << 'EOF' > components/FlightList.tsx
import React from 'react';
import { Plane, PlaneTakeoff, PlaneLanding, Clock, Users, Luggage, Droplets, CloudSun, ThermometerSun } from 'lucide-react';

const TRIPS = [
  { id: 'int-ida', type: 'ida', title: 'Ida: Brasil → África do Sul', bookingReference: '862508329300', provider: 'Decolar / TAAG', baggage: '2 malas despachadas por adulto + Bagagem de mão', passengers: [{ name: 'André' }, { name: 'Marcelly' }], legs: [{ flightNumber: 'DT 748', airline: 'TAAG', departure: { code: 'GRU', time: '18:05', date: '25/Jan' }, arrival: { code: 'NBJ', time: '06:40', date: '26/Jan' }, duration: '8h 35m' }, { flightNumber: 'DT 577', airline: 'TAAG', departure: { code: 'NBJ', time: '09:55', date: '26/Jan' }, arrival: { code: 'JNB', time: '14:40', date: '26/Jan' }, duration: '3h 45m' }] },
  { id: 'dom-ida', type: 'interno', title: 'Interno: JNB → CPT', bookingReference: '1108-387-389', provider: 'MyTrip / SAA', baggage: 'Padrão', passengers: [{ name: 'André' }, { name: 'Marcelly' }], legs: [{ flightNumber: 'SA 363', airline: 'SAA', departure: { code: 'JNB', time: '18:45', date: '26/Jan' }, arrival: { code: 'CPT', time: '21:00', date: '26/Jan' }, duration: '2h 15m' }] },
  { id: 'dom-volta', type: 'interno', title: 'Interno: CPT → JNB', bookingReference: '1108-387-389', provider: 'MyTrip / SAA', baggage: 'Padrão', passengers: [{ name: 'André' }, { name: 'Marcelly' }], legs: [{ flightNumber: 'SA 372', airline: 'SAA', departure: { code: 'CPT', time: '20:25', date: '31/Jan' }, arrival: { code: 'JNB', time: '22:25', date: '31/Jan' }, duration: '2h 00m' }] },
  { id: 'int-volta', type: 'volta', title: 'Volta: África do Sul → Brasil', bookingReference: '862508329300', provider: 'Decolar / TAAG', baggage: '2 malas', passengers: [{ name: 'André' }, { name: 'Marcelly' }], legs: [{ flightNumber: 'DT 576', airline: 'TAAG', departure: { code: 'JNB', time: '00:45', date: '06/Fev' }, arrival: { code: 'NBJ', time: '03:30', date: '06/Fev' }, duration: '3h 45m' }, { flightNumber: 'DT 747', airline: 'TAAG', departure: { code: 'NBJ', time: '10:35', date: '06/Fev' }, arrival: { code: 'GRU', time: '15:05', date: '06/Fev' }, duration: '8h 30m' }] }
];

const FlightList: React.FC = () => {
  return (
    <div className="space-y-6">
      {TRIPS.map((trip: any) => (
        <div key={trip.id} className={`rounded-3xl border-2 overflow-hidden shadow-sm ${trip.type === 'ida' ? 'bg-blue-50 border-blue-200' : trip.type === 'volta' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`p-4 border-b border-dashed ${trip.type === 'ida' ? 'border-blue-200 bg-blue-100/50' : trip.type === 'volta' ? 'border-orange-200 bg-orange-100/50' : 'border-gray-200 bg-gray-100'}`}><div className="flex items-center justify-between mb-2"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.type === 'ida' ? 'bg-blue-600 text-white' : trip.type === 'volta' ? 'bg-orange-500 text-white' : 'bg-gray-600 text-white'}`}>{trip.type === 'ida' ? 'Ida' : trip.type === 'volta' ? 'Volta' : 'Interno'}</span><span className="font-mono font-bold text-xs text-gray-400">REF: {trip.bookingReference}</span></div><h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">{trip.type === 'ida' ? <PlaneTakeoff className="text-blue-600" /> : <PlaneLanding className="text-orange-600" />} {trip.title}</h3></div>
          <div className="p-4 space-y-6">
            {trip.legs.map((leg: any, idx: number) => (
              <div key={idx} className="relative pl-4 border-l-2 border-dashed border-gray-300">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-green-500"></div>
                <div className="mb-2 flex justify-between items-center"><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{leg.airline} - {leg.flightNumber}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {leg.duration}</span></div>
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-4 text-center"><div><p className="text-2xl font-display font-black text-slate-800">{leg.departure.code}</p><p className="text-xs font-bold text-gray-600">{leg.departure.time}</p></div><Plane className="w-4 h-4 text-gray-300 rotate-90" /><div><p className="text-2xl font-display font-black text-slate-800">{leg.arrival.code}</p><p className="text-xs font-bold text-gray-600">{leg.arrival.time}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default FlightList;
EOF

cat << 'EOF' > components/PackingList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Briefcase, Luggage, ShoppingBag, User, Pencil, X, Check, Tag, CloudLightning, PlaneTakeoff, PlaneLanding, Circle } from 'lucide-react';
import { syncDataToCloud, subscribeToCloudData } from '../services/firebase';

const STORAGE_KEY = 'checkin_go_packing_list_v5';
const CATEGORY_MAP: any = { '👕 ROUPAS': ['camisa', 'calça', 'roupa'], '👟 CALÇADOS': ['tênis', 'sapato'], '🧴 HIGIENE': ['escova', 'pasta'], '🛂 DOCUMENTOS': ['passaporte', 'civp'], '🔌 ELETRÔNICOS': ['carregador', 'cabo'], '🎒 ACESSÓRIOS': ['chapéu'] };
const identifyCategory = (text: string) => { for (const [c, k] of Object.entries(CATEGORY_MAP)) if ((k as string[]).some(x => text.toLowerCase().includes(x))) return c; return '📦 DIVERSOS'; };
const INITIAL_DATA: any = { 'André': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] }, 'Marcelly': { 'bag23kg': [], 'bag10kg': [], 'pouch5kg': [] } };

const BagSection = ({ title, icon, items, colorClass, onToggleIda, onToggleVolta, onDelete, onEdit, onAdd }: any) => {
  const [newItemText, setNewItemText] = useState('');
  const handleAdd = () => { if (newItemText.trim()) { onAdd(newItemText.trim()); setNewItemText(''); } };
  const groupedItems = useMemo(() => { const g:any={}; items.forEach((i:any)=>{const c=identifyCategory(i.text);if(!g[c])g[c]=[];g[c].push(i)}); return g; }, [items]);
  return (
    <div className={`mb-6 rounded-2xl border-2 overflow-hidden ${colorClass} bg-white shadow-sm`}>
      <div className={`p-3 flex items-center justify-between border-b border-gray-100 ${colorClass.replace('border-', 'bg-').replace('50', '50/50')}`}><div className="flex items-center gap-2">{icon}<h3 className="font-display font-bold text-slate-700">{title}</h3></div></div>
      <div className="p-3 space-y-4">
        {Object.entries(groupedItems).map(([cat, list]: any) => (
            <div key={cat}><div className="flex items-center gap-2 px-2 mb-2"><Tag className="w-3 h-3 text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</span><div className="h-[1px] flex-1 bg-slate-50"></div></div><div className="space-y-1">{list.map((item:any)=>(<div key={item.id} className="flex gap-2 p-2 hover:bg-gray-50 rounded-lg"><button onClick={()=>onToggleIda(item.id)}>{item.checked ? <PlaneTakeoff className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-200" />}</button><span className="flex-1 text-sm">{item.text}</span><button onClick={()=>onToggleVolta(item.id)}>{item.returned ? <PlaneLanding className="w-4 h-4 text-blue-500" /> : <Circle className="w-4 h-4 text-gray-200" />}</button><button onClick={()=>onDelete(item.id)}><Trash2 className="w-3 h-3 text-red-300" /></button></div>))}</div></div>
        ))}
        <div className="mt-6 flex gap-2"><input type="text" value={newItemText} onChange={(e)=>setNewItemText(e.target.value)} placeholder="Adicionar..." className="flex-1 text-sm border p-2 rounded" /><button onClick={handleAdd}><Plus className="w-5 h-5 text-green-500" /></button></div>
      </div>
    </div>
  );
};

const PackingList: React.FC = () => {
  const [activePerson, setActivePerson] = useState('André');
  const [data, setData] = useState(() => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : INITIAL_DATA; } catch { return INITIAL_DATA; } });

  useEffect(() => { subscribeToCloudData('packing_list_v5', (d) => { if(d) { setData(d); localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } }); }, []);
  const updateCloud = (nD: any) => { setData(nD); localStorage.setItem(STORAGE_KEY, JSON.stringify(nD)); syncDataToCloud('packing_list_v5', nD); };
  
  const handleToggleIda = (p: string, b: string, id: string) => { const n = JSON.parse(JSON.stringify(data)); const i = n[p][b].find((x:any)=>x.id===id); if(i) i.checked = !i.checked; updateCloud(n); };
  const handleToggleVolta = (p: string, b: string, id: string) => { const n = JSON.parse(JSON.stringify(data)); const i = n[p][b].find((x:any)=>x.id===id); if(i) i.returned = !i.returned; updateCloud(n); };
  const handleDelete = (p: string, b: string, id: string) => { const n = JSON.parse(JSON.stringify(data)); n[p][b] = n[p][b].filter((x:any)=>x.id!==id); updateCloud(n); };
  const handleAdd = (p: string, b: string, t: string) => { const n = JSON.parse(JSON.stringify(data)); n[p][b].push({ id: Date.now().toString(), text: t, checked: false, returned: false }); updateCloud(n); };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">{['André', 'Marcelly'].map((person) => (<button key={person} onClick={() => setActivePerson(person)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activePerson === person ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'}`}><User className="w-4 h-4" /> {person}</button>))}</div>
      <div className="space-y-4">
        <BagSection title="Mala 23kg" icon={<Luggage className="w-5 h-5 text-blue-600" />} items={data[activePerson].bag23kg} colorClass="border-blue-50" onToggleIda={(id:string)=>handleToggleIda(activePerson, 'bag23kg', id)} onToggleVolta={(id:string)=>handleToggleVolta(activePerson, 'bag23kg', id)} onDelete={(id:string)=>handleDelete(activePerson, 'bag23kg', id)} onAdd={(t:string)=>handleAdd(activePerson, 'bag23kg', t)} />
        <BagSection title="Mala 10kg" icon={<ShoppingBag className="w-5 h-5 text-orange-600" />} items={data[activePerson].bag10kg} colorClass="border-orange-50" onToggleIda={(id:string)=>handleToggleIda(activePerson, 'bag10kg', id)} onToggleVolta={(id:string)=>handleToggleVolta(activePerson, 'bag10kg', id)} onDelete={(id:string)=>handleDelete(activePerson, 'bag10kg', id)} onAdd={(t:string)=>handleAdd(activePerson, 'bag10kg', t)} />
      </div>
    </div>
  );
};
export default PackingList;
EOF

cat << 'EOF' > components/MelhoresDestinos.tsx
import React, { useState } from 'react';
import { Calendar, Hotel, Compass, Palmtree, Camera, Utensils, Coins, Info, Moon, Footprints, Bus, ShoppingBag, Map as MapIcon, ExternalLink, ChevronLeft, Star } from 'lucide-react';
const TOPICS = [
  { id: 'quando-ir', title: 'Quando Ir', icon: <Calendar />, content: 'Nov-Mar: Verão.' },
  { id: 'onde-ficar', title: 'Onde Ficar', icon: <Hotel />, content: 'Sea Point (CPT), Sandton (JNB).' },
  { id: 'o-que-fazer', title: 'O Que Fazer', icon: <Compass />, content: 'Table Mountain, Safari.' }
];
const MelhoresDestinos: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  if (selectedTopic) return (<div className="animate-in slide-in-from-right"><button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-slate-500 font-black mb-6 hover:text-sa-green transition-colors p-2 text-xs uppercase tracking-widest"><ChevronLeft className="w-5 h-5" /> Voltar</button><div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100"><h3 className="text-2xl font-black mb-4">{selectedTopic.title}</h3><p>{selectedTopic.content}</p></div></div>);
  return (<div className="grid grid-cols-2 gap-3 pb-20">{TOPICS.map((t) => (<button key={t.id} onClick={() => setSelectedTopic(t)} className="bg-white p-5 rounded-[32px] border-2 border-slate-50 shadow-sm text-left"><div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4">{t.icon}</div><span className="font-black text-[11px] uppercase">{t.title}</span></button>))}</div>);
};
export default MelhoresDestinos;
EOF

cat << 'EOF' > components/AiAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, WifiOff, Sparkles, Loader2, Info } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([{ id: 'welcome', text: 'Olá! Sou seu guia. O que precisa saber?', sender: 'ai', timestamp: new Date() }]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]); setInputText(''); setIsLoading(true);
    try {
      if (!process.env.API_KEY || !navigator.onLine) throw new Error("Offline");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ role: 'user', parts: [{ text: inputText }] }] });
      setMessages(prev => [...prev, { id: Date.now().toString(), text: res.text, sender: 'ai', timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Estou offline. Mas o Uber fica no Parkade P1!", sender: 'ai', timestamp: new Date(), isOfflineResponse: true }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#e5ddd5] rounded-xl overflow-hidden relative">
      <div className="bg-slate-900 text-white p-3 flex items-center gap-3 shadow-md z-10"><Bot className="w-6 h-6 text-blue-300" /><div><h3 className="font-bold text-sm">Seu Guia IA</h3></div></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">{messages.map(m => (<div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${m.sender === 'user' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>{m.text}</div></div>))}</div>
      <div className="bg-gray-100 p-2 z-10 border-t border-gray-200"><div className="flex items-end gap-2 bg-white rounded-2xl border border-gray-300 px-3 py-2"><textarea value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 bg-transparent outline-none text-sm resize-none" /><button onClick={handleSend} disabled={isLoading}><Send className="w-4 h-4" /></button></div></div>
    </div>
  );
};
export default AiAssistant;
EOF

cat << 'EOF' > components/SowetoPro.tsx
import React from 'react';
const SowetoPro = () => <div className="text-center p-10">Tradutor Soweto Pro (Em Breve)</div>;
export default SowetoPro;
EOF

cat << 'EOF' > components/PronunciationTool.tsx
import React from 'react';
const PronunciationTool = () => <div className="text-center p-10">Ferramenta de Pronúncia (Em Breve)</div>;
export default PronunciationTool;
EOF

cat << 'EOF' > components/Translator.tsx
import React, { useState } from 'react';
import { MessageSquare, BookOpen, Languages } from 'lucide-react';
const Translator = () => {
  const [tab, setTab] = useState('live');
  return (
    <div>
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6"><button onClick={() => setTab('live')} className="flex-1 py-2 text-xs font-bold">Ao Vivo</button><button onClick={() => setTab('phrases')} className="flex-1 py-2 text-xs font-bold">Frases</button></div>
      {tab === 'live' ? <div className="text-center p-10">Tradução Ao Vivo</div> : <div className="text-center p-10">Frases Rápidas</div>}
    </div>
  );
};
export default Translator;
EOF

cat << 'EOF' > components/GuideList.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plane, Navigation, ShieldCheck, CreditCard, Headphones, WifiOff, ClipboardList } from 'lucide-react';
import { Map, Marker } from 'pigeon-maps';
import { loadDataFromCloud } from '../services/firebase';

export const GUIDE_STORAGE_KEY = 'checkin_go_guides_v2';
const DEFAULT_GUIDE: any = { CPT: [{ day: 26, title: 'Chegada', plans: [{ text: 'Uber Parkade P1' }], map: { center: [-33.9145, 18.4239], zoom: 12, markers: [[-33.9145, 18.4239]] }, weather: { temp: '27°' } }], JNB: [] };

const GuideList: React.FC = () => {
  const [data, setData] = useState<any>(() => { try { const s = localStorage.getItem(GUIDE_STORAGE_KEY); return s ? JSON.parse(s) : DEFAULT_GUIDE; } catch { return DEFAULT_GUIDE; } });
  const [activeCity, setActiveCity] = useState('CPT');
  useEffect(() => { if (navigator.onLine) loadDataFromCloud('guides_v2').then(d => { if(d) { setData(d); localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(d)); } }); }, []);

  return (
    <div className="pb-48">
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8"><button onClick={() => setActiveCity('CPT')} className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'CPT' ? 'bg-white shadow-md text-sa-blue' : 'text-slate-400'}`}><MapPin className="w-4 h-4 mb-1" /><span className="text-[10px] font-black uppercase">Cidade do Cabo</span></button><button onClick={() => setActiveCity('JNB')} className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${activeCity === 'JNB' ? 'bg-white shadow-md text-sa-gold' : 'text-slate-400'}`}><MapPin className="w-4 h-4 mb-1" /><span className="text-[10px] font-black uppercase">Joanesburgo</span></button></div>
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-5 mb-8 shadow-sm"><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex gap-2"><ShieldCheck className="w-5 h-5 text-sa-green" /> Dicas</h3><p className="text-[10px] text-slate-500">Use Inter por aproximação e Wise para saques.</p></div>
      <div className="space-y-2">{data[activeCity].map((plan:any, i:number) => (
        <div key={i} className="flex gap-4 mb-8">
           <div className="flex flex-col items-center shrink-0 w-16"><div className="w-14 py-2 rounded-2xl bg-blue-50 text-blue-800 flex flex-col items-center"><span className="text-xl font-black">{plan.day}</span></div></div>
           <div className="flex-1 rounded-[28px] border-2 bg-white shadow-lg p-4">
              <h4 className="text-lg font-black uppercase mb-4">{plan.title}</h4>
              <div className="space-y-1">{plan.plans.map((p:any, idx:number)=><div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold">{p.text}</div>)}</div>
              <div className="mt-4 h-32 rounded-2xl overflow-hidden relative border"><Map height={128} center={plan.map.center} zoom={plan.map.zoom}><Marker anchor={plan.map.center} color="#007749" width={30} /></Map></div>
           </div>
        </div>
      ))}</div>
    </div>
  );
};
export default GuideList;
EOF

cat << 'EOF' > components/PWAInstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { const h = (e:any) => { e.preventDefault(); setDeferredPrompt(e); setIsVisible(true); }; window.addEventListener('beforeinstallprompt', h); return () => window.removeEventListener('beforeinstallprompt', h); }, []);
  const handleInstall = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') setIsVisible(false); setDeferredPrompt(null); };
  if (!isVisible) return null;
  return (<div className="fixed bottom-0 left-0 right-0 z-[100] p-4"><div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl flex items-center justify-between"><div className="flex items-center gap-3"><Download className="w-6 h-6" /><div><h4 className="font-bold text-sm">Instalar App</h4></div></div><button onClick={handleInstall} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase">Instalar</button></div></div>);
};
export default PWAInstallPrompt;
EOF

cat << 'EOF' > components/TopBar.tsx
import React, { useState, useEffect } from 'react';
import { CloudCheck, WifiOff, Bell, X, AlertTriangle } from 'lucide-react';
const TopBar = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  useEffect(() => { window.addEventListener('online', ()=>setIsOnline(true)); window.addEventListener('offline', ()=>setIsOnline(false)); window.addEventListener('app-notification', (e:any)=>setActiveAlerts(p=>[...p, e.detail])); }, []);
  return (
    <>
      <div className="fixed top-2 right-2 z-[70] flex gap-2 pointer-events-none items-center">
        <div className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-2xl ${isOnline ? 'bg-black/40 text-white' : 'bg-red-600 text-white'}`}>{isOnline ? <CloudCheck className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}<span className="text-[9px] font-black uppercase">{isOnline ? 'Online' : 'Offline'}</span></div>
        <button onClick={()=>setIsAlertsOpen(true)} className="pointer-events-auto p-2 rounded-full bg-black/40 text-white"><Bell className="w-5 h-5" />{activeAlerts.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center">{activeAlerts.length}</span>}</button>
      </div>
      {isAlertsOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-[32px] p-6"><div className="flex justify-between mb-4"><h3 className="font-black text-lg">Notificações</h3><button onClick={()=>setIsAlertsOpen(false)}><X /></button></div>{activeAlerts.map((a,i)=><div key={i} className="bg-amber-50 p-4 rounded-xl mb-2 text-sm">{a}</div>)}<button onClick={()=>{setActiveAlerts([]);setIsAlertsOpen(false)}} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold mt-4">Limpar</button></div></div>)}
    </>
  );
};
export default TopBar;
EOF

cat << 'EOF' > components/VaccineCertificate.tsx
import React from 'react';
import { Syringe, CheckCircle2, QrCode } from 'lucide-react';
const VaccineCertificate = () => (
    <div className="p-6 bg-white rounded-[32px] shadow-2xl border border-slate-100">
        <div className="flex justify-between mb-8"><Syringe className="text-amber-600" /><div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-[9px] font-black text-green-700 uppercase">Válido</span></div></div>
        <div className="space-y-4"><div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome</label><p className="font-black uppercase">ANDRE VICTOR BRITO DE ANDRADE</p></div><div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vacina</label><p className="font-bold text-amber-700">FEBRE AMARELA (YELLOW FEVER)</p></div></div>
        <div className="mt-6 bg-slate-900 p-4 rounded-2xl flex gap-4"><div className="bg-white p-1 rounded"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CIVP_VALID" className="w-12 h-12" /></div><div className="text-white text-[10px]"><p>Autenticidade</p><p>Escaneie para validar na ANVISA.</p></div></div>
    </div>
);
export default VaccineCertificate;
EOF

cat << 'EOF' > components/UberBoltList.tsx
import React from 'react';
import { Car, Clock, CheckCircle2 } from 'lucide-react';
export const RIDES = [ { id: 'u-01', date: '24/Jan', time: '05:00', origin: 'Casa', destination: 'Rodoviária', price: 36.93, app: 'Uber' } ];
const UberBoltList = () => <div className="space-y-4">{RIDES.map(r=><div key={r.id} className="bg-white p-5 rounded-[24px] border shadow-sm"><div className="flex justify-between"><span className="font-bold text-slate-800">{r.destination}</span><span className="font-black">R$ {r.price}</span></div></div>)}</div>;
export default UberBoltList;
EOF

cat << 'EOF' > components/WeatherLocation.tsx
import React from 'react';
const WeatherLocation = () => <div className="p-8 bg-slate-900 rounded-[32px] text-white">Clima Ao Vivo (GPS)</div>;
export default WeatherLocation;
EOF

cat << 'EOF' > components/WeatherCardHome.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
const WeatherCardHome = () => <div className="relative w-full aspect-square p-2 rounded-2xl bg-[#1a1a1a] text-white border-2 border-sa-gold/40 flex flex-col items-center justify-center"><MapPin className="text-sa-gold mb-2" /><span className="font-black text-3xl">27°</span></div>;
export default WeatherCardHome;
EOF

cat << 'EOF' > components/Supplies.tsx
import React from 'react';
const Supplies = () => <div className="p-6 bg-white rounded-3xl border border-slate-200">Mercado & Suprimentos</div>;
export default Supplies;
EOF

cat << 'EOF' > App.tsx
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
import { MenuItem } from './types';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => { if ("Notification" in window) Notification.requestPermission(); }, []);
  useEffect(() => {
    const checkRides = () => {
      RIDES.forEach(ride => {
        const key = ride.id; 
        if (!notifiedIds.current.has(key)) { notifiedIds.current.add(key); }
      });
    };
    const interval = setInterval(checkRides, 60000); checkRides(); return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => { if (event.state?.sectionId) setActiveSectionId(event.state.sectionId); else setActiveSectionId(null); };
    window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (id: string) => { if (id === 'clima_localizacao') return; setActiveSectionId(id); window.history.pushState({ sectionId: id }, '', `#${id}`); window.scrollTo(0, 0); };
  const goBack = () => { if (window.history.state?.sectionId) window.history.back(); else { setActiveSectionId(null); window.history.replaceState(null, '', ' '); } };

  const renderContent = (id: string) => {
    switch (id) {
      case 'clima_localizacao': return <WeatherLocation />;
      case 'ia_assistant': return <AiAssistant />;
      case 'tradutor': return <Translator />;
      case 'cambio': return <CurrencyConverter />;
      case 'melhores_destinos': return <MelhoresDestinos />;
      case 'voos': return <FlightList />;
      case 'checklist': return <PackingList />;
      case 'guias': return <GuideList />;
      case 'financeiro': return <FinancialControl />;
      case 'gastos': return <ExpenseTracker />;
      case 'hospedagem': return <AccommodationList />;
      case 'onibus': return <BusList />;
      case 'uber_bolt': return <UberBoltList />;
      case 'vacinas': return <VaccineCertificate />;
      case 'mercado': return <Supplies />;
      default: return (<div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100"><Construction className="w-12 h-12 mb-4 opacity-20 text-sa-green" /><p className="text-lg font-bold text-sa-green font-display">Em construção</p></div>);
    }
  };

  const DetailHeader: React.FC<{ id: string }> = ({ id }) => {
    const item = MENU_ITEMS.find(i => i.id === id);
    return (<div className={`sticky top-0 z-50 shadow-xl transition-all duration-300 ${item?.gradientClass || 'bg-tribal-green'} border-b border-white/10`}><div className="h-2 w-full"></div><div className="flex items-center px-4 py-4 max-w-md mx-auto relative"><button onClick={goBack} className="p-3 -ml-2 rounded-full hover:bg-white/20 transition-all text-white z-50 group"><ArrowLeft className="w-7 h-7" strokeWidth={2.5} /></button><div className="flex-1 flex flex-col items-center justify-center -ml-8"><div className="text-white/80 scale-75 opacity-80 mb-0.5">{item?.icon}</div><h2 className="text-lg font-display font-black tracking-widest text-white uppercase drop-shadow-md text-center leading-none">{item?.title}</h2></div><div className="w-10"></div></div></div>);
  };

  if (activeSectionId) return (<div className={`min-h-screen font-sans animate-in slide-in-from-right duration-300 ease-out bg-gray-50`}><TopBar /><DetailHeader id={activeSectionId} /><main className="max-w-md mx-auto px-4 py-6 pb-24">{renderContent(activeSectionId)}</main></div>);

  return (
    <div className="min-h-screen bg-black font-sans animate-in fade-in duration-300 relative">
      <TopBar />
      <PWAInstallPrompt />
      <div className="fixed inset-0 z-0 pointer-events-none"><div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[1px] scale-105 opacity-50 contrast-125" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop")' }}></div><div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="max-w-md mx-auto px-4 py-4 pb-12 w-full"><div className="grid grid-cols-3 gap-3">{MENU_ITEMS.map((item) => item.id === 'clima_localizacao' ? (<WeatherCardHome key={item.id} />) : (<MenuCard key={item.id} {...item} onClick={() => navigateTo(item.id)} />))}</div></main>
        <footer className="text-center text-[10px] text-white/50 pb-12 font-black font-display tracking-widest uppercase space-y-1 mt-auto"><p>África do Sul 🇿🇦</p><p className="opacity-50 mt-4 font-sans font-medium capitalize tracking-normal">Desenvolvido por: André Brito</p></footer>
      </div>
    </div>
  );
};
export default App;
EOF

echo "App criado com sucesso! Ícones PNG gerados e Manifesto atualizado."
