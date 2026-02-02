
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, WifiOff, Sparkles, User, Loader2, Info } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isOfflineResponse?: boolean;
}

const OFFLINE_KNOWLEDGE: Record<string, string> = {
  'pilanesberg': `🦁 **Pilanesberg National Park:**\n- Distância: ~2h30 a 3h de Joanesburgo/Sandton.\n- Big 5: Sim, é uma reserva real (cratera de vulcão), muito melhor que o Lion Park, mas requer o dia todo.\n- **Jogo:** Para chegar no jogo as 19h30 em Pretória, você tem que sair do parque às 15h30/16h00 sem falta.`,
  'segurança': `🇿🇦 **Dica de Segurança (JNB - Modo Especialista):**\n\n1. **A Regra de Ouro:** Em Joanesburgo, não se anda na rua a pé, nem por 2 quarteirões. É Uber porta-a-porta.\n2. **Bolha de Segurança:** Sandton e Rosebank (dentro dos complexos) são seguros. Soweto APENAS com guia.\n3. **Uber:** Espere o carro DENTRO do shopping/restaurante. Nunca na calçada com celular na mão.\n4. **Emergência:** Disque 112.`,
  'safari': `🦁 **Safari (Pilanesberg):**\n- É longe. Se não tiver transfer fechado, alugar carro é arriscado se não conhecer a mão inglesa.\n- Combine o horário de volta RIGOROSAMENTE para não perder o jogo.`,
  'jogo': `⚽ **Mamelodi Sundowns (Logística):**\n- **Estádio:** Loftus Versfeld (Pretória).\n- **Horário:** 19:00.\n- **Saída de JNB:** 16:30 MÁXIMO (Trânsito pesado).\n- **Ingressos:** Computicket (Site) ou lojas Shoprite/Checkers (Balcão de serviços).`,
  'comida': `🍔 **Comida Segura (Familiar):**\n- **Wimpy:** É como um "Diner" (lanchonete americana). Tem prato, talher, mas a comida é burger e batata. Muito higiênico e "safe".\n- **McDonald's:** Padrão mundial. Igual ao do Brasil. Perfeito para quem está com medo de temperos locais.\n- **Steers:** Burger local muito bom e confiável.`,
  'economia': `💰 **Dicas de Economia:**\n- Coma na Praça de Alimentação (Wimpy, Steers, Fishaways).\n- Evite restaurantes com garçom (gorjeta 10-15%).\n- Ande apenas dentro do Shopping Sandton (é gigante e grátis).`,
  'ingressos': `🎟️ **Onde Comprar:**\n- **Jogo:** Computicket.com ou Shoprite/Checkers.\n- **FNB Stadium Tour:** Na porta (Portão 4).\n- **Mandela House:** Na porta.\n- **Gold Reef City:** Na porta (Heritage Tour).\n- **Apartheid Museum:** Na porta.`,
  'aeroporto': `✈️ **Volta para o Brasil:**\n- Voo 00h45 do dia 06 (Madrugada de quinta p/ sexta).\n- Chegue no aeroporto OR Tambo às 21h30 do dia 05.\n- OR Tambo é seguro no saguão principal.`
};

const findOfflineAnswer = (input: string): string | null => {
  const normalizedInput = input.toLowerCase();
  
  const keywords = Object.keys(OFFLINE_KNOWLEDGE);
  for (const key of keywords) {
    if (normalizedInput.includes(key)) {
      return OFFLINE_KNOWLEDGE[key];
    }
  }
  
  if (normalizedInput.includes('estadio') || normalizedInput.includes('futebol') || normalizedInput.includes('ingresso')) return OFFLINE_KNOWLEDGE['jogo'];
  if (normalizedInput.includes('leao') || normalizedInput.includes('lion') || normalizedInput.includes('pilanesberg')) return OFFLINE_KNOWLEDGE['pilanesberg'];
  if (normalizedInput.includes('barato') || normalizedInput.includes('gastar menos')) return OFFLINE_KNOWLEDGE['economia'];
  if (normalizedInput.includes('wimpy') || normalizedInput.includes('mc') || normalizedInput.includes('comer')) return OFFLINE_KNOWLEDGE['comida'];
  if (normalizedInput.includes('comprar')) return OFFLINE_KNOWLEDGE['ingressos'];

  return null;
};

const SYSTEM_INSTRUCTION = `
Você é o "Especialista de Segurança e Logística" do André e da Marcelly na África do Sul.
Situação Atual:
- Joanesburgo (Joburg). Dinheiro curto até Terça.
- **MEDO ALIMENTAR:** Sugira Wimpy/McDonald's.
- **ROTEIRO FINAL (CRÍTICO):**
  - **Terça:** Rosebank (Manhã) + Sandton (Tarde/Almoço Barato). Compra de Ingressos (Shoprite/Checkers).
  - **Quarta:** Pilanesberg (06h-15h) -> Banho -> Saída p/ Pretória (16h30) -> Jogo Mamelodi (19h).
  - **Quinta:** FNB Stadium (09h) -> Soweto -> Mina de Ouro (13h15) -> Apartheid Museum -> Aeroporto (21h).

Sua Missão:
1. Reforçar os horários. "Sair às 16h30 pra Pretória é inegociável".
2. Segurança: Uber porta-a-porta.
3. Ingressos: Explicar que compra no Shoprite/Checkers (Supermercado) se não conseguir online.

Tom de Voz:
- Seguro, direto, protetor e prático. Use emojis.
`;

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: '🚨 **Plano Final Ativado!**\n\nAndré, o roteiro está fechado e cronometrado. Terça econômica, Quarta de adrenalina (Safari + Jogo) e Quinta histórica.\n\n⚠️ **Atenção:** Para o jogo do Mamelodi, se não conseguir comprar online na Computicket, vá até um balcão do **Shoprite ou Checkers** amanhã em Rosebank/Sandton. Eles vendem ingresso físico lá.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!process.env.API_KEY || !navigator.onLine) {
         throw new Error("Offline Mode Trigger");
      }

      // Initialize right before call to ensure up-to-date config
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), 
            { role: 'user', parts: [{ text: inputText }] }
        ],
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            maxOutputTokens: 2000, 
        }
      });

      // Directly access .text property
      const aiText = response.text || "Desculpe, não consegui processar. Tente novamente.";
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.log("Entering Offline/Fallback Mode");
      
      const offlineAnswer = findOfflineAnswer(userMsg.text);
      
      let replyText = "";
      if (offlineAnswer) {
          replyText = offlineAnswer;
      } else {
          replyText = "⚠️ **Modo Offline:** Estou sem conexão.\n\nLembrete: Compre ingressos no Shoprite. Jogo às 19h em Pretória (Saia 16h30!).";
      }

      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'ai',
        timestamp: new Date(),
        isOfflineResponse: true
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#e5ddd5] rounded-xl overflow-hidden shadow-inner relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="bg-slate-900 text-white p-3 flex items-center gap-3 shadow-md z-10">
        <div className="relative">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
        </div>
        <div>
            <h3 className="font-bold text-sm">Especialista (Modo Seguro)</h3>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Foco: Logística & Ingressos
            </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
              </div>

              <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                {msg.isOfflineResponse && <WifiOff className="w-3 h-3 text-red-500" />}
                <span className="text-[9px]">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
                  msg.sender === 'user' 
                  ? 'right-[-6px] border-l-[#dcf8c6] border-t-[#dcf8c6]' 
                  : 'left-[-6px] border-r-white border-t-white'
              }`}></div>
            </div>
          </div>
        ))}
        
        {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculando rota segura...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-100 p-2 z-10 border-t border-gray-200">
         <div className="flex items-end gap-2 bg-white rounded-2xl border border-gray-300 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
             <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Onde compro ingresso?"
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 resize-none max-h-24 py-2"
                rows={1}
                style={{ minHeight: '24px' }}
             />
             <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
             >
                <Send className="w-4 h-4" />
             </button>
         </div>
      </div>
    </div>
  );
};

export default AiAssistant;
