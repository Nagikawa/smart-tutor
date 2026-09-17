/**
 * Web Speech API and SpeechSynthesis helpers
 * Gracefully handles browsers with or without speech recognition
 */

// Define SpeechRecognition interface for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export function createSpeechRecognition(): any | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as IWindow;
  const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    return recognition;
  } catch (err) {
    console.warn('Could not instantiate SpeechRecognition:', err);
    return null;
  }
}

export function speakText(
  text: string,
  options: {
    voiceURI?: string | null;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !isSpeechSynthesisSupported()) {
    return null;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = text
      .replace(/[*#_`]/g, '') // remove markdown artifacts
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (options.voiceURI) {
      const selected = voices.find(v => v.voiceURI === options.voiceURI);
      if (selected) utterance.voice = selected;
    } else {
      // Prefer clean English natural voices if available
      const englishVoice = voices.find(
        v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      options.onError?.(e);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn('Failed to speak text:', err);
    options.onEnd?.();
    return null;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Error cancelling speech synthesis:', err);
    }
  }
}
