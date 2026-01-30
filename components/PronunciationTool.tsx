import React, { useState, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  Globe2, 
  MessageCircle, 
  Plane, 
  Utensils, 
  Volume2
} from 'lucide-react';

export type ScreenState = 'welcome' | 'language-select' | 'dialect-select' | 'category-select' | 'practice';

export interface PhraseData {
  id: number;
  pt: string;
  target_text: string;
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  countryCode: string;
  code: string;
}

export interface Dialect {
  id: string;
  name: string;
  countryCode: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export const LANGUAGES: Language[] = [
  { id: 'en', name: 'Inglês', flag: '🇺🇸', countryCode: 'us', code: 'en-US' },
  { id: 'es', name: 'Espanhol', flag: '🇪🇸', countryCode: 'es', code: 'es-ES' },
  { id: 'fr', name: 'Francês', flag: '🇫🇷', countryCode: 'fr', code: 'fr-FR' },
];

export const DIALECTS: Record<string, Dialect[]> = {
  en: [
    { id: 'en-ZA', name: 'África do Sul', countryCode: 'za', code: 'en-ZA' },
    { id: 'en-US', name: 'Estados Unidos', countryCode: 'us', code: 'en-US' },
    { id: 'en-GB', name: 'Reino Unido', countryCode: 'gb', code: 'en-GB' },
  ],
  es: [{ id: 'es-ES', name: 'Espanha', countryCode: 'es', code: 'es-ES' }],
  fr: [{ id: 'fr-FR', name: 'França', countryCode: 'fr', code: 'fr-FR' }],
};

export const CATEGORIES: Category[] = [
  { id: 'basics', name: 'Básico', icon: MessageCircle, description: 'Cumprimentos' },
  { id: 'travel', name: 'Aeroporto', icon: Plane, description: 'Check-in e voo' },
  { id: 'food', name: 'Restaurante', icon: Utensils, description: 'Pedidos' },
];

const PHRASES: Record<string, Record<string, PhraseData[]>> = {
  en: {
    basics: [
      { id: 1, pt: "Como você está?", target_text: "How are you doing?" },
      { id: 2, pt: "Prazer em te conhecer.", target_text: "Nice to meet you." },
    ],
    travel: [
      { id: 101, pt: "Onde fica o portão 5?", target_text: "Where is gate 5?" },
    ],
  },
};

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex-1 bg-slate-50 flex flex-col items-center relative overflow-hidden font-sans rounded-[40px] min-h-[600px] shadow-inner border border-slate-100">
    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-sa-green/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-sa-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="z-10 w-full flex-1 flex flex-col">{children}</div>
  </div>
);

const SelectionScreen: React.FC<{
  title: string; subtitle: string; items: any[]; type: 'language' | 'category';
  onSelect: (item: any) => void; onBack: () => void; headerIcon?: React.ReactNode;
}> = ({ title, subtitle, items, type, onSelect, onBack, headerIcon }) => (
  <div className="flex flex-col p-6 max-w-lg mx-auto w-full animate-in slide-in-from-right h-full overflow-y-auto">
    <header className="flex items-center mb-4 pt-2">
      <button onClick={onBack} className="p-3 -ml-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"><ChevronLeft size={32} strokeWidth={3} /></button>
    </header>
    <div className="flex flex-row items-center gap-4 mb-2">
      <h2 className="text-3xl font-display font-black text-slate-800">{title}</h2>
      {headerIcon && <div className="w-12 h-12 shadow-md rounded-2xl bg-white flex items-center justify-center border border-slate-100 overflow-hidden">{headerIcon}</div>}
    </div>
    <p className="text-slate-500 mb-8 text-base font-bold">{subtitle}</p>
    <div className="flex flex-col gap-4 pb-8">
      {items.map((item) => (
        <button key={item.id} onClick={() => onSelect(item)} className="group bg-white p-5 rounded-[28px] shadow-sm border-2 border-transparent hover:border-sa-green/20 hover:shadow-lg transition-all text-left flex items-center gap-5">
          {type === 'category' ? (
              <div className="w-14 h-14 rounded-2xl bg-sa-green/5 flex items-center justify-center text-sa-green shrink-0 group-hover:bg-sa-green group-hover:text-white transition-colors"><item.icon size={26} /></div>
          ) : (
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0"><img src={`https://flagcdn.com/w160/${item.countryCode}.png`} className="w-full h-full object-cover" alt={item.name} /></div>
          )}
          <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-display font-black text-slate-800 text-lg uppercase leading-none mb-1">{item.name}</h3>
              {item.description && <p className="text-slate-400 text-xs font-bold leading-snug uppercase tracking-wider">{item.description}</p>}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const PracticeSession: React.FC<{ 
  languageName: string; dialect: Dialect; phrases: PhraseData[]; onBack: () => void;
}> = ({ languageName, dialect, phrases, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<any[]>([]);

  const currentPhrase = phrases[currentIndex] || { id: -1, pt: '', target_text: '' };

  const speakNative = useCallback(() => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentPhrase.target_text);
    utterance.lang = dialect.code; utterance.rate = 0.8; 
    utterance.onstart = () => setIsPlayingNative(true);
    utterance.onend = () => setIsPlayingNative(false);
    window.speechSynthesis.speak(utterance);
  }, [currentPhrase, dialect]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start(); setIsRecording(true);
    } catch (err) { alert("Acesso ao microfone negado."); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current?.state === 'recording') { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  return (
    <div className="flex flex-col items-center h-full p-6 relative animate-in fade-in pb-20 overflow-y-auto">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 text-slate-500 hover:bg-white rounded-xl shadow-sm"><ChevronLeft size={24} /></button>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{languageName} ({dialect.name})</span>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md"><img src={`https://flagcdn.com/w80/${dialect.countryCode}.png`} className="w-full h-full object-cover" alt={dialect.name} /></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl mb-8 text-center relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-50"><div className="h-full bg-sa-green transition-all" style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}></div></div>
        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">{currentPhrase.pt}</h3>
        <h2 className="text-3xl font-display font-black text-slate-800 leading-tight">{currentPhrase.target_text}</h2>
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center gap-6">
        <button onClick={speakNative} className="w-full bg-white border-2 border-sa-green text-sa-green font-black py-4 rounded-[20px] shadow-sm flex items-center justify-center gap-2 uppercase text-[10px] tracking-wider hover:bg-sa-green hover:text-white transition-all">
          <Volume2 size={18} /> {isPlayingNative ? 'Falando...' : 'Ouvir Nativo'}
        </button>
        
        <div className="flex flex-col items-center gap-3">
            <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording ? 'bg-sa-red scale-110 animate-pulse ring-8 ring-sa-red/20' : 'bg-sa-green ring-8 ring-sa-green/10'}`}>
                <Mic size={44} className="text-white" />
            </button>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isRecording ? 'text-sa-red' : 'text-slate-400'}`}>
                {isRecording ? 'Gravando...' : 'Segure para gravar'}
            </span>
        </div>
      </div>

      <div className="w-full max-w-md flex justify-between items-center mt-10">
        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 disabled:opacity-10"><ChevronLeft size={20} /> Anterior</button>
        <button onClick={() => setCurrentIndex(prev => Math.min(phrases.length - 1, prev + 1))} disabled={currentIndex === phrases.length - 1} className="flex items-center gap-2 bg-sa-green/10 text-sa-green px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-10">Próxima <ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

const PronunciationTool: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedDialect, setSelectedDialect] = useState<Dialect | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleStart = () => setScreen('language-select');

  return (
    <Wrapper>
      {screen === 'welcome' && (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="bg-white p-6 rounded-[32px] shadow-xl mb-8 transform rotate-3 border-2 border-sa-green/20"><Globe2 size={64} className="text-sa-green" /></div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Lingo<span className="text-sa-green">Travel</span></h1>
            <p className="text-slate-500 text-lg mb-12 max-w-xs font-medium">Aprimore sua pronúncia antes de desembarcar.</p>
            <button onClick={handleStart} className="w-full max-w-xs bg-sa-green text-white font-black py-5 rounded-[24px] shadow-lg shadow-sa-green/20 hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"><Mic size={20} /> Começar Agora</button>
        </div>
      )}
      {screen === 'language-select' && <SelectionScreen title="Idioma" subtitle="Escolha o idioma base." items={LANGUAGES} type="language" onSelect={(l) => { setSelectedLanguage(l); setScreen('dialect-select'); }} onBack={() => setScreen('welcome')} />}
      {screen === 'dialect-select' && selectedLanguage && <SelectionScreen title="Sotaque" subtitle="Selecione a região." items={DIALECTS[selectedLanguage.id] || []} type="language" onSelect={(d) => { setSelectedDialect(d); setScreen('category-select'); }} onBack={() => setScreen('language-select')} />}
      {screen === 'category-select' && selectedDialect && <SelectionScreen title="Tópico" subtitle="O que vamos aprender?" items={CATEGORIES} type="category" onSelect={(c) => { setSelectedCategory(c); setScreen('practice'); }} onBack={() => setScreen('dialect-select')} />}
      {screen === 'practice' && selectedLanguage && selectedDialect && (
        <PracticeSession languageName={selectedLanguage.name} dialect={selectedDialect} phrases={PHRASES[selectedLanguage.id]?.[selectedCategory?.id || 'basics'] || []} onBack={() => setScreen('category-select')} />
      )}
    </Wrapper>
  );
};

export default PronunciationTool;