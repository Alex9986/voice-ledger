'use client';

import { useState, useRef, useCallback } from 'react';

interface Props {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onResult, disabled }: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError('您的浏览器不支持语音识别，请使用 Chrome 浏览器');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) {
        onResult(text);
      }
      setListening(false);
    };

    recognition.onerror = (event: Event) => {
      const e = event as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error:', e.error);
      if (e.error === 'not-allowed') {
        setError('请允许使用麦克风');
      } else if (e.error !== 'aborted') {
        setError('语音识别出错，请重试');
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    setError(null);
    recognition.start();
    setListening(true);
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: '4.5rem' }}>
      {listening ? (
        /* Listening state — replaces the mic button entirely */
        <button
          type="button"
          onClick={stopListening}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 0 20px rgba(239,68,68,0.5), 0 4px 12px rgba(239,68,68,0.3)',
            cursor: 'pointer',
          }}
          title="点击停止"
        >
          {/* Sound wave bars */}
          <div className="flex items-center justify-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-white/70 rounded-full"
                style={{
                  height: `${8 + i * 4}px`,
                  animation: `pulse-soft ${0.4 + i * 0.15}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </button>
      ) : (
        /* Idle state — mic button */
        <button
          type="button"
          onClick={startListening}
          disabled={disabled}
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          title="点击开始语音输入"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      )}

      {listening && (
        <span className="text-[11px] font-medium" style={{ color: 'var(--danger)' }}>
          正在聆听...
        </span>
      )}
      {!listening && !error && (
        <span className="text-[11px] text-zinc-400">点击开始说话</span>
      )}
      {error && (
        <span className="text-[11px] font-medium" style={{ color: 'var(--danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}
