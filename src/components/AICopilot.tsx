'use client';

import { FormEvent, useState } from 'react';
import VoiceCaptureButton from './VoiceCaptureButton';
import { useDriverStore } from '@/state/useDriverStore';

type ConversationMessage = {
  id: string;
  author: 'driver' | 'copilot';
  text: string;
};

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

async function callGemini(endpoint: string, payload: unknown) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Gemini request failed');
  }
  return response.json();
}

export default function AICopilot() {
  const preferredLanguage = useDriverStore((state) => state.preferredLanguage);
  const addVoiceNote = useDriverStore((state) => state.addVoiceNote);
  const voiceNotes = useDriverStore((state) => state.voiceNotes);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: randomId(),
      author: 'copilot',
      text: 'नमस्ते! I can help you translate, plan routes, and log duty notes. Ask me anything.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [searchResults, setSearchResults] = useState('');

  const submitPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    const prompt = input.trim();
    setMessages((prev) => [...prev, { id: randomId(), author: 'driver', text: prompt }]);
    setInput('');
    setLoading(true);
    try {
      const result = await callGemini('/api/gemini/chat', {
        mode: 'chat',
        prompt,
        language: preferredLanguage
      });
      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          author: 'copilot',
          text: result.text ?? 'I am ready to help.'
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          author: 'copilot',
          text: `⚠️ ${(error as Error).message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
    void addVoiceNote({
      transcript: text,
      language: preferredLanguage,
      created_at: new Date().toISOString()
    });
  };

  const runTranslation = async (direction: 'en-to-hi' | 'hi-to-en') => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await callGemini('/api/gemini/chat', {
        mode: 'translate',
        prompt: input,
        direction
      });
      setTranslation(response.text ?? '');
    } catch (error) {
      setTranslation(`⚠️ ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await callGemini('/api/gemini/chat', {
        mode: 'search',
        prompt: input
      });
      setSearchResults(response.text ?? '');
    } catch (error) {
      setSearchResults(`⚠️ ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
        <h2 className="text-xl font-semibold text-white">AI Co-pilot</h2>
        <form onSubmit={submitPrompt} className="flex flex-col gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask for load documents, translate instructions, or plan a stop."
            className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <VoiceCaptureButton onTranscript={handleVoiceTranscript} language={preferredLanguage === 'hi' ? 'hi-IN' : 'en-US'} />
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/80"
            >
              {loading ? 'Processing…' : 'Send to Gemini'}
            </button>
            <button
              type="button"
              onClick={() => runTranslation('hi-to-en')}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-primary"
            >
              Translate Hindi → English
            </button>
            <button
              type="button"
              onClick={() => runTranslation('en-to-hi')}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-primary"
            >
              Translate English → Hindi
            </button>
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-primary"
            >
              Smart search
            </button>
          </div>
        </form>
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl px-4 py-3 text-sm ${
                message.author === 'driver'
                  ? 'ml-auto max-w-[75%] bg-primary/30 text-white'
                  : 'mr-auto max-w-[75%] border border-slate-700 bg-slate-900/70 text-slate-200'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-sm text-slate-200">
          <h3 className="font-semibold text-white">Instant translation</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-300 min-h-[120px]">
            {translation || 'Pick a direction to translate the current prompt.'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-sm text-slate-200">
          <h3 className="font-semibold text-white">Smart search insights</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-300 min-h-[120px]">
            {searchResults || 'Use smart search to get route tips, rest stops, and compliance info.'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-xs text-slate-300">
          <h3 className="font-semibold text-white">Latest voice notes</h3>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {voiceNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
                <p className="text-[13px] text-white">{note.transcript}</p>
                <p className="text-[10px] text-slate-500">
                  {note.language === 'hi' ? 'Hindi' : 'English'} · {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
            {voiceNotes.length === 0 && <p className="text-slate-500">No voice notes yet.</p>}
          </div>
        </div>
      </aside>
    </section>
  );
}
