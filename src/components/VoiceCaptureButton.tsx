'use client';

import { useEffect, useState } from 'react';

interface VoiceCaptureButtonProps {
  onTranscript: (text: string) => void;
  language?: 'en-US' | 'hi-IN';
}

export default function VoiceCaptureButton({ onTranscript, language = 'en-US' }: VoiceCaptureButtonProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as typeof window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).webkitSpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).SpeechRecognition;
    if (SpeechRecognition) setSupported(true);
  }, []);

  const startListening = () => {
    const SpeechRecognitionCtor =
      (window as typeof window & { webkitSpeechRecognition?: new () => unknown; SpeechRecognition?: new () => unknown })
        .webkitSpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: new () => unknown; SpeechRecognition?: new () => unknown }).
        SpeechRecognition;

    if (!SpeechRecognitionCtor) return;
    const recognition = new (SpeechRecognitionCtor as new () => any)();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    setListening(true);
    recognition.start();
  };

  if (!supported) {
    return (
      <button
        type="button"
        className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-400"
        disabled
      >
        Voice input unavailable
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startListening}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        listening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-primary'
      }`}
    >
      {listening ? 'Listening…' : '🎤 Speak'}
    </button>
  );
}
