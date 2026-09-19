import { AppLanguage } from '../types';

// Map AppLanguage to Google TTS & Web Speech API language codes
const GOOGLE_TTS_LANG_MAP: Record<AppLanguage, string> = {
  en: 'en',
  hi: 'hi',
  mr: 'mr',
  kn: 'kn',
  te: 'te',
  gu: 'gu',
};

const WEB_SPEECH_LANG_MAP: Record<AppLanguage, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
  te: 'te-IN',
  gu: 'gu-IN',
};

// Global audio element reference for online TTS playback
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Stop any active speech (both HTML5 Audio and Web Speech API)
 */
export function stopVernacularSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio.src = '';
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Splits long text into natural sentence chunks under 180 characters for TTS APIs
 */
function chunkText(text: string, maxLength = 160): string[] {
  const clean = text.trim();
  if (clean.length <= maxLength) return [clean];

  const sentences = clean.split(/(?<=[.!?|।\n])/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks.length > 0 ? chunks : [clean.slice(0, maxLength)];
}

/**
 * Find best matching browser speech synthesis voice for an Indic language
 */
function findBestVoice(lang: AppLanguage): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetCode = WEB_SPEECH_LANG_MAP[lang] || 'en-US';
  const shortCode = targetCode.split('-')[0].toLowerCase();

  // 1. Direct exact BCP-47 match (e.g. 'mr-IN', 'hi-IN', 'te-IN')
  let match = voices.find((v) => v.lang.toLowerCase() === targetCode.toLowerCase());
  if (match) return match;

  // 2. Language prefix match (e.g. 'mr', 'hi', 'te')
  match = voices.find((v) => v.lang.toLowerCase().startsWith(shortCode));
  if (match) return match;

  // 3. Name based match (e.g. "Google हिन्दी", "Microsoft Kalpana - Marathi")
  const langNames: Record<AppLanguage, string[]> = {
    en: ['english', 'en-us', 'en-in', 'en-gb'],
    hi: ['hindi', 'hi-in', 'heera', 'swara', 'madhur'],
    mr: ['marathi', 'mr-in', 'kalpana', 'aarohi'],
    kn: ['kannada', 'kn-in', 'sapna', 'gagan'],
    te: ['telugu', 'te-in', 'mohan', 'shruti'],
    gu: ['gujarati', 'gu-in', 'niranjan', 'dhwani'],
  };

  const keywords = langNames[lang] || [];
  match = voices.find((v) => {
    const nameLower = v.name.toLowerCase();
    return keywords.some((kw) => nameLower.includes(kw));
  });
  if (match) return match;

  // 4. Devanagari Script Fallback: Marathi uses Devanagari, can be read by Hindi voice
  if (lang === 'mr') {
    const hindiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('heera')
    );
    if (hindiVoice) return hindiVoice;
  }

  // 5. Any Indian voice fallback (e.g., en-IN)
  const indianVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
  if (indianVoice) return indianVoice;

  return null;
}

/**
 * Speak text in the target vernacular language with multi-tier fallback:
 * Tier 1: Google TTS Audio Stream (100% authentic pronunciation for Marathi, Hindi, Telugu, Kannada, Gujarati, English)
 * Tier 2: Web Speech Synthesis API with intelligent voice selection
 */
export function playVernacularSpeech(
  text: string,
  lang: AppLanguage,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): () => void {
  const { onStart, onEnd, onError } = options || {};

  // Cancel any ongoing audio first
  stopVernacularSpeech();

  if (!text || !text.trim()) {
    onEnd?.();
    return () => {};
  }

  const cleanText = text.trim();
  const ttsLang = GOOGLE_TTS_LANG_MAP[lang] || 'en';
  const chunks = chunkText(cleanText, 160);

  let isCancelled = false;

  // Function to fallback to browser speechSynthesis
  const fallbackToWebSpeech = () => {
    if (isCancelled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('Speech not supported'));
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = findBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = WEB_SPEECH_LANG_MAP[lang] || 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (!isCancelled) onStart?.();
      };
      utterance.onend = () => {
        if (!isCancelled) onEnd?.();
      };
      utterance.onerror = (e) => {
        console.warn('Web Speech API error:', e);
        if (!isCancelled) onEnd?.();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech fallback failed:', err);
      onError?.(err);
    }
  };

  // Tier 1: Try Google TTS Audio stream sequence
  try {
    let currentChunkIdx = 0;
    onStart?.();

    const playNextChunk = () => {
      if (isCancelled) return;
      if (currentChunkIdx >= chunks.length) {
        onEnd?.();
        return;
      }

      const chunk = chunks[currentChunkIdx];
      const audioUrl = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${encodeURIComponent(ttsLang)}`;

      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        currentChunkIdx++;
        playNextChunk();
      };

      audio.onerror = () => {
        console.warn('Google TTS Audio stream blocked or failed, falling back to Web Speech API.');
        fallbackToWebSpeech();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play prevented or offline:', err);
          fallbackToWebSpeech();
        });
      }
    };

    playNextChunk();
  } catch (err) {
    console.warn('Google TTS init failed, falling back:', err);
    fallbackToWebSpeech();
  }

  // Return cancel handler
  return () => {
    isCancelled = true;
    stopVernacularSpeech();
    onEnd?.();
  };
}
