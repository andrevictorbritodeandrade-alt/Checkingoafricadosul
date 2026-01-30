import React, { useState, useRef, useEffect } from 'react';
import { Mic, Wifi, WifiOff } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

// --- TYPES FOR WEB SPEECH API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
}

// --- UTILS ---
function pcmToWav(base64: string, sampleRate: number) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  view.setUint32(0, 0x52494646, false); // RIFF
  view.setUint32(4, 36 + bytes.length, true);
  view.setUint32(8, 0x57415645, false); // WAVE
  view.setUint32(12, 0x666d7420, false); // fmt
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); // data
  view.setUint32(40, bytes.length, true);
  
  return URL.createObjectURL(new Blob([wavHeader, bytes], { type: 'audio/wav' }));
}

const SowetoPro: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [output, setOutput] = useState('Aguardando fala para tradução simultânea...');
  const [sourceLang, setSourceLang] = useState('en-ZA');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  // Monitor Connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Speech Rec
  useEffect(() => {
    // Cast window to any to avoid TypeScript conflicts with global declarations in other files
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR() as SpeechRecognition;
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const text = event.results[event.results.length - 1][0].transcript;
        if (text.trim()) {
          setTranscript(text);
          // Visual feedback immediately
          setOutput("Processando tradução...");
          await translateAndSpeak(text);
        }
      };

      recognition.onend = () => {
        if (isActive) recognition.start(); // Keep alive
      };

      recognitionRef.current = recognition;
    }
  }, [isActive, sourceLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (!isActive) {
      setIsActive(true);
      recognitionRef.current.lang = sourceLang;
      recognitionRef.current.start();
    } else {
      setIsActive(false);
      recognitionRef.current.stop();
      setOutput('Aguardando fala para tradução simultânea...');
    }
  };

  const translateAndSpeak = async (text: string) => {
    if (!process.env.API_KEY) {
       setOutput("Erro: Chave de API não configurada.");
       return;
    }

    if (!isOnline) {
       setOutput("[OFFLINE] Sem conexão para IA. Tradução indisponível.");
       return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const srcName = sourceLang === 'en-ZA' ? 'Inglês Sul-Africano' : 'Zulu';
      
      const prompt = `Traduza do ${srcName} para o Português do Brasil. 
      USE O SOTAQUE DO RIO DE JANEIRO (CARIOCA). 
      Ajuste o texto para ser falado com a cadência, gírias leves (como 'cara', 'mermão', 'sacou', 'tranquilo') e a malandragem natural do carioca. 
      Se for um discurso religioso, mantenha o fervor, mas com a alma do Rio.
      Retorne APENAS a tradução.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          systemInstruction: prompt,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
          }
        },
      });

      // Extract Audio & Text
      const candidate = response.candidates?.[0]?.content?.parts?.[0];
      
      if (candidate?.inlineData?.data) {
         const audioBlobUrl = pcmToWav(candidate.inlineData.data, 24000);
         queueAudio(audioBlobUrl);
         
         // If text is returned separately, display it; otherwise indicate audio playback
         const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
         if (textPart?.text) {
            setOutput(textPart.text);
         } else {
            setOutput("🔊 Reproduzindo áudio (Carioca)...");
         }
      }

    } catch (err) {
      console.error(err);
      setOutput("Erro na tradução IA.");
    }
  };

  const queueAudio = (url: string) => {
    audioQueueRef.current.push(url);
    if (!isPlayingRef.current) playNext();
  };

  const playNext = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const audio = new Audio(audioQueueRef.current.shift());
    audio.onended = playNext;
    audio.play();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 py-4 relative">
        
        {/* Network Status Pill */}
        <div className={`absolute top-0 right-0 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isOnline ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'ONLINE: HYBRID AI' : 'OFFLINE'}
        </div>

        {/* Visualizer Simulation */}
        <div className="flex items-end justify-center gap-1.5 h-24 w-full max-w-xs">
           {[1,2,3,4,5,6,7].map((bar) => (
               <div 
                 key={bar} 
                 className={`w-2 rounded-full transition-all duration-300 ${isActive ? 'animate-pulse bg-sa-gold' : 'bg-slate-700 h-2'}`}
                 style={{ 
                    height: isActive ? `${Math.random() * 80 + 20}%` : '10%',
                    animationDelay: `${bar * 0.1}s`
                 }}
               ></div>
           ))}
        </div>

        {/* Central Control */}
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Pulsing Rings */}
            {isActive && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-sa-gold/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-sa-gold/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </>
            )}
            
            <button 
                onClick={toggleRecording}
                className={`z-10 w-40 h-40 bg-slate-800 border-4 rounded-full flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl ${
                    isActive 
                    ? 'border-sa-gold shadow-[0_0_30px_rgba(255,184,28,0.3)]' 
                    : 'border-slate-700 hover:border-sa-gold/50'
                }`}
            >
                <Mic className={`w-12 h-12 transition-colors ${isActive ? 'text-sa-gold' : 'text-slate-500'}`} />
                <span className={`text-xs font-black uppercase tracking-tighter ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {isActive ? 'Parar' : 'Ativar Escuta'}
                </span>
            </button>
        </div>

        {/* Info Card */}
        <div className="w-full bg-slate-900/50 rounded-3xl p-6 border border-slate-800 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                <select 
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="bg-transparent text-sm font-bold focus:outline-none text-sa-gold cursor-pointer uppercase tracking-wider appearance-none"
                >
                    <option value="en-ZA">🇿🇦 Inglês (Soweto)</option>
                    <option value="zu-ZA">🇿🇦 Zulu (IsiZulu)</option>
                </select>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Voz: Carioca 🇧🇷
                </div>
            </div>
            
            <div className="space-y-4">
                 {/* Transcript Input */}
                 {transcript && (
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <p className="text-xs text-slate-500 font-mono mb-1">Entrada detectada:</p>
                        <p className="text-slate-300 text-sm italic">"{transcript}"</p>
                    </div>
                 )}

                 {/* Output */}
                 <div className="text-slate-200 text-base leading-relaxed font-medium min-h-[40px] animate-in fade-in">
                    {output}
                 </div>
            </div>
        </div>

        {/* Footer Warning */}
        <div className="text-center">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Soweto Translate Pro v2.0
            </p>
        </div>
    </div>
  );
};

export default SowetoPro;