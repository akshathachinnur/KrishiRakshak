import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  User, 
  Flame,
  Languages,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, SoilMetrics, AppLanguage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FarmerChatBotProps {
  selectedDialect?: AppLanguage;
  setSelectedDialect?: (d: AppLanguage) => void;
  soilContext?: SoilMetrics;
  diagnosedDiseaseContext?: string;
}

const SPEECH_LANG_MAP: Record<AppLanguage, string> = {
  hi: 'hi-IN',
  en: 'en-US',
  mr: 'mr-IN',
  kn: 'kn-IN',
  te: 'te-IN',
  gu: 'gu-IN',
};

const BOT_LANGUAGES: { code: AppLanguage; label: string; english: string }[] = [
  { code: 'hi', label: 'हिन्दी', english: 'Hindi' },
  { code: 'en', label: 'English', english: 'English' },
  { code: 'mr', label: 'मराठी', english: 'Marathi' },
  { code: 'kn', label: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'te', label: 'తెలుగు', english: 'Telugu' },
  { code: 'gu', label: 'ગુજરાતી', english: 'Gujarati' },
];

const BOT_WELCOME_MESSAGES: Record<AppLanguage, string> = {
  hi: 'नमस्ते किसान भाई! मैं आपका कृषि रक्षक साथी हूँ। अपनी भाषा में कोई भी कृषि सवाल पूछें — पत्ती रोग की दवा, जैविक कीटनाशक, बुवाई का समय या आज के मंडी भाव।',
  en: 'Namaste Kisan Bhai! I am your KrishiRakshak farm companion. Ask me any farming question in your own language — leaf disease medicines, natural pest remedies, sowing advice, or today\'s Mandi market rates.',
  mr: 'नमस्कार शेतकरी बंधूंनो! मी आपला कृषी रक्षक साथीदार आहे. आपल्या भाषेत शेतीविषयक कोणताही प्रश्न विचारा — पानांच्या रोगावरील औषधे, सेंद्रिय कीटकनाशके किंवा आजचे बाजार भाव.',
  kn: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ರಕ್ಷಕ ಕೃಷಿ ಸಂಗಾತಿ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲೇ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ — ಎಲೆ ರೋಗದ ಔಷಧ, ನೈಸರ್ಗಿಕ ಕ್ರಿಮಿನಾಶಕ, ಬಿತ್ತನೆ ಮಾಹಿತಿ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳು.',
  te: 'నమస్కారం రైతు సోదరులారా! నేను మీ కృషి రక్షక్ వ్యవసాయ సహాయకుడిని. మీ మాతృభాషలోనే వ్యవసాయ ప్రశ్నలు అడగండి — ఆకు తెగుళ్ల మందులు, సేంద్రీయ పురుగుమందులు లేదా మార్కెట్ ధరలు.',
  gu: 'નમસ્તે ખેડૂત મિત્રો! હું આપનો કૃષિ રક્ષક સાથી છું. આપની ભાષામાં ખેતી સંબંધિત કોઈપણ પ્રશ્ન પૂછો — પાંદડાના રોગની દવા, જૈવિક કીટનાશક, વાવણીની સલાહ અથવા આજના મંડી ભાવ.',
};

const BOT_QUICK_PROMPTS: Record<AppLanguage, string[]> = {
  hi: [
    'यूरिया की एक बोरी की जगह क्या इस्तेमाल करें?',
    'कर्नाटक में चने की बुवाई का सबसे सही समय क्या है?',
    'आज नासिक मंडी में प्याज का क्या भाव है?',
    'टमाटर के अगेती झुलसा के लिए मैन्कोजेब की कितनी मात्रा डालें?'
  ],
  en: [
    'How to replace 1 bag of synthetic Urea?',
    'Optimal Chickpea sowing window in Karnataka?',
    'What is today\'s Nashik Mandi onion rate?',
    'Mancozeb dosage for Tomato Early Blight?'
  ],
  mr: [
    'युरियाच्या एका गोणीऐवजी कोणते सेंद्रिय खत वापरावे?',
    'महाराष्ट्रात हरभरा पेरणीसाठी सर्वात योग्य वेळ कोणती?',
    'आज नाशिक बाजारात कांद्याचा काय भाव आहे?',
    'टोमॅटोच्या करप्यासाठी मॅन्कोझेबचे प्रमाण किती असावे?'
  ],
  kn: [
    'ಒಂದು ಚೀಲ ಯೂರಿಯಾ ಬದಲಿಗೆ ಯಾವ ನೈಸರ್ಗಿಕ ಗೊಬ್ಬರ ಬಳಸಬಹುದು?',
    'ಕರ್ನಾಟಕದಲ್ಲಿ ಕಡಲೆ ಬಿತ್ತನೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?',
    'ಇಂದಿನ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಈರುಳ್ಳಿ ಬೆಲೆ ಎಷ್ಟಿದೆ?',
    'ಟೊಮ್ಯಾಟೋ ರೋಗಕ್ಕೆ ಮ್ಯಾಂಕೋಜೆಬ್ ಪ್ರಮಾಣ ಎಷ್ಟು ಹಾಕಬೇಕು?'
  ],
  te: [
    'యూరియా బస్తాకు ప్రత్యామ్నాయంగా ఏ ఎరువు వాడాలి?',
    'శనగ విత్తడానికి అత్యంత అనుకూలమైన సమయం ఏది?',
    'ఈరోజు మార్కెట్లో ఉల్లిపాయల ధర ఎలా ఉంది?',
    'టొమాటో మచ్చల తెగులుకు మాంకోజెబ్ ఎంత మోతాదులో కలపాలి?'
  ],
  gu: [
    'યુરિયાની એક ગુણીના બદલે કયું કુદરતી ખાતર વાપરવું?',
    'ગુજરાતમાં ચણાની વાવણી માટે ઉત્તમ સમય કયો છે?',
    'આજે યાર્ડમાં ડુંગળી અને કપાસના શું ભાવ છે?',
    'ટામેટાના સુકારા માટે મેન્કોઝેબ કેટલું નાખવું?'
  ],
};

export const FarmerChatBot: React.FC<FarmerChatBotProps> = ({
  soilContext,
  diagnosedDiseaseContext,
}) => {
  const { t } = useLanguage();

  // Chatbot language is chosen separately and independently from the web language!
  const [botLanguage, setBotLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('krishi_chatbot_language');
      if (saved && (['en', 'hi', 'mr', 'kn', 'te', 'gu'] as string[]).includes(saved)) {
        return saved as AppLanguage;
      }
    } catch {
      // ignore
    }
    return 'hi';
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: BOT_WELCOME_MESSAGES['hi'],
      timestamp: Date.now(),
      dialect: 'hi',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleBotLanguageSelect = (lang: AppLanguage) => {
    setBotLanguage(lang);
    try {
      localStorage.setItem('krishi_chatbot_language', lang);
    } catch {
      // ignore
    }

    // If only welcome message exists or user switches language, inject language greeting
    setMessages(prev => {
      if (prev.length <= 1) {
        return [{
          id: 'welcome-' + lang,
          sender: 'bot',
          text: BOT_WELCOME_MESSAGES[lang],
          timestamp: Date.now(),
          dialect: lang,
        }];
      }
      return [
        ...prev,
        {
          id: 'lang-switched-' + Date.now(),
          sender: 'bot',
          text: `[${BOT_LANGUAGES.find(b => b.code === lang)?.label}] ${BOT_WELCOME_MESSAGES[lang]}`,
          timestamp: Date.now(),
          dialect: lang,
        }
      ];
    });
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputVal).trim();
    if (!queryText) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: Date.now(),
      dialect: botLanguage,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          dialect: botLanguage, // Independent chatbot dialect!
          context: {
            n: soilContext?.nitrogen,
            p: soilContext?.phosphorus,
            k: soilContext?.potassium,
            ph: soilContext?.ph,
            rainfall: soilContext?.rainfall,
            currentDisease: diagnosedDiseaseContext,
          }
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: data.reply || "Consult local Krishi Vigyan Kendra (KVK) for exact regional application schedules.",
        timestamp: Date.now(),
        dialect: botLanguage,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend chat failed, using vernacular agronomist fallback:', err);
      
      const fallbacksByLang: Record<AppLanguage, string> = {
        hi: "आपके प्रश्न के अनुसार: फसल के संतुलित विकास के लिए सही मात्रा में जैविक खाद का प्रयोग करें। किसी भी तत्काल कृषि सलाह के लिए किसान कॉल सेंटर टोल फ्री नंबर 1800-180-1551 पर कॉल करें।",
        en: "For optimal crop health, maintain balanced NPK ratios and apply bio-fungicides early. For instant telephone assistance, dial Kisan Call Center at 1800-180-1551.",
        mr: "आपल्या प्रश्नानुसार: पिकांच्या योग्य वाढीसाठी संतुलित सेंद्रिय खतांचा वापर करा. तात्काळ मोफत सल्ल्यासाठी किसान कॉल सेंटर टोल-फ्री १८००-१८०-१५५१ वर संपर्क साधा.",
        kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಅನುಗುಣವಾಗಿ: ಉತ್ತಮ ಇಳುವರಿಗೆ ಸಮತೋಲಿತ ಪೋಷಕಾಂಶಗಳನ್ನು ನೀಡಿ. ಉಚಿತ ತಜ್ಞರ ಸಲಹೆಗೆ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ ಸಂಖ್ಯೆ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ.",
        te: "మీ ప్రశ్నకు అనుగుణంగా: పంట ఆరోగ్యానికి తగినంత సేంద్రీయ ఎరువులు వాడండి. ఉచిత సలహా కొరకు కిసాన్ కాల్ సెంటర్ 1800-180-1551 కు కాల్ చేయండి.",
        gu: "આપના પ્રશ્ન મુજબ: પાકના સંતુલિત વિકાસ માટે સેન્દ્રીય ખાતરનો ઉપયોગ કરો. ત્વરિત માર્ગદર્શન માટે કિસાન કૉલ સેન્ટર ૧૮૦૦-૧૮૦-૧૫૫૧ પર ફોન કરો."
      };

      const fallbackMsg: ChatMessage = {
        id: 'bot-fallback-' + Date.now(),
        sender: 'bot',
        text: fallbacksByLang[botLanguage] || fallbacksByLang.hi,
        timestamp: Date.now(),
        dialect: botLanguage,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG_MAP[botLanguage] || 'hi-IN';
    utterance.rate = 0.95;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. You can type your query below.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LANG_MAP[botLanguage] || 'hi-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition error:', err);
      setIsListening(false);
    }
  };

  const activePrompts = BOT_QUICK_PROMPTS[botLanguage] || BOT_QUICK_PROMPTS.hi;
  const currentBotLangMeta = BOT_LANGUAGES.find(b => b.code === botLanguage) || BOT_LANGUAGES[0];

  return (
    <section id="kisan-ai" className="w-full bg-[#0c1510] py-14 px-3 sm:px-6 lg:px-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* Chatbot Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#141e18] border border-[#2d3731] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5bf06c]/20 border border-[#5bf06c]/40 text-[#5bf06c] flex items-center justify-center shadow-lg shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-space text-xl sm:text-2xl font-bold text-[#dae5dc]">
                  {t.chatbot.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#5bf06c]/20 text-[#5bf06c] text-[10px] font-bold border border-[#5bf06c]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bf06c] animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-xs text-[#bccbb6] mt-0.5">
                {t.chatbot.subtitle}
              </p>
            </div>
          </div>

          {/* INDEPENDENT Chatbot Language Selector (Explicit User Mandate) */}
          <div 
            id="chatbot-independent-language-selector"
            className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-2xl bg-[#18221c] border border-[#3d4f40]"
          >
            <div className="flex items-center gap-1.5 text-xs text-[#dae5dc] font-semibold">
              <Languages className="w-3.5 h-3.5 text-[#5bf06c]" />
              <span className="text-[#869582] text-[11px]">{t.chatbot.botLanguageLabel}</span>
            </div>
            
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1">
              {BOT_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  id={`chatbot-lang-${lang.code}`}
                  onClick={() => handleBotLanguageSelect(lang.code)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    botLanguage === lang.code
                      ? 'bg-[#5bf06c] text-[#00390c] shadow-[0_0_10px_rgba(91,240,108,0.3)]'
                      : 'text-[#bccbb6] hover:text-[#dae5dc] hover:bg-[#222c26]'
                  }`}
                  title={`${lang.english} voice & replies for chatbot`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#869582] flex items-center gap-1 shrink-0 font-medium">
            <Flame className="w-3.5 h-3.5 text-[#ffcb87]" />
            Suggestions ({currentBotLangMeta.label}):
          </span>
          {activePrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#141e18] hover:bg-[#1f2c22] text-[#bccbb6] hover:text-[#dae5dc] border border-[#2d3731] transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Window Box */}
        <div className="rounded-3xl bg-[#141e18] border border-[#2d3731] shadow-2xl flex flex-col h-[520px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 sm:gap-3 max-w-[88%] ${
                    isUser ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-[#222c26] text-[#dae5dc] border border-[#3d4a3b]'
                        : 'bg-[#5bf06c]/20 text-[#5bf06c] border border-[#5bf06c]/40'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#5bf06c] text-[#00390c] font-medium rounded-tr-none'
                        : 'bg-[#18221c] text-[#dae5dc] border border-[#222c26] rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {!isUser && (
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#222c26] text-[10px] text-[#869582]">
                        <span className="flex items-center gap-1 font-medium">
                          <Sparkles className="w-3 h-3 text-[#5bf06c]" /> 
                          Kisan AI ({BOT_LANGUAGES.find(b => b.code === (m.dialect || botLanguage))?.label})
                        </span>
                        <button
                          onClick={() => handleSpeakMessage(m.text)}
                          className="text-[#5bf06c] hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#5bf06c]/10"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 
                          {isSpeaking ? t.chatbot.stopSpeech : t.chatbot.speakBtn}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3 self-start">
                <div className="w-8 h-8 rounded-full bg-[#5bf06c]/20 text-[#5bf06c] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#18221c] border border-[#222c26] text-xs text-[#869582] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bf06c] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bf06c] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bf06c] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="pl-1 text-[#bccbb6]">
                    {currentBotLangMeta.label} उत्तर तैयार हो रहा है...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-[#0c1510]/90 border-t border-[#222c26] flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleVoiceInput}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-[#93000a] text-[#ffb4ab] animate-pulse shadow-[0_0_12px_rgba(255,180,171,0.5)]'
                  : 'bg-[#18221c] text-[#5bf06c] hover:bg-[#222c26] border border-[#2d3731]'
              }`}
              title={isListening ? t.chatbot.listening : `Speak in ${currentBotLangMeta.label}`}
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`${t.chatbot.inputPlaceholder} (${currentBotLangMeta.label})`}
              className="flex-1 h-10 sm:h-11 bg-[#18221c] border border-[#2d3731] rounded-2xl px-3 sm:px-4 text-xs sm:text-sm text-[#dae5dc] placeholder:text-[#869582] outline-none focus:border-[#5bf06c]/60"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputVal.trim() || isTyping}
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-[#5bf06c] text-[#00390c] font-space text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 shrink-0"
            >
              <span>{t.chatbot.send}</span>
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
