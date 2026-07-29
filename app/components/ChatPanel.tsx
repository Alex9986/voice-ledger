'use client';

import { useState, useRef, useEffect } from 'react';
import { processVoiceInput, confirmAndSave } from '@/app/actions';
import VoiceInput from './VoiceInput';
import type { CreateRecordInput, DeepSeekResponse } from '@/app/lib/types';
import { CURRENCY_SYMBOLS } from '@/app/lib/types';

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  extracted?: Partial<CreateRecordInput>;
  isConfirmation?: boolean;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的语音记账助手。你可以直接说话或打字描述一笔账单，比如"今天午饭花了35块"。也可以问我"这个月花了多少钱"来看看支出情况。',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [processing, setProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: LocalMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || processing) return;

    const userMsg: LocalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    addMessage(userMsg);
    setInputText('');
    setProcessing(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const result: DeepSeekResponse = await processVoiceInput(text, history);

      if (result.extracted) {
        await confirmAndSave(result.extracted as CreateRecordInput);
        const r = result.extracted;
        const symbol = CURRENCY_SYMBOLS[r.currency || 'CNY'];
        const amountStr = `${symbol}${r.amount}`;
        const typeStr = r.type === 'expense' ? '支出' : '收入';
        addMessage({
          id: Date.now().toString() + '-a',
          role: 'assistant',
          content: `已记录：${typeStr} ${amountStr} - ${r.category}${r.note ? `（${r.note}）` : ''}`,
          extracted: result.extracted,
        });
      } else if (result.needConfirm) {
        addMessage({
          id: Date.now().toString() + '-a',
          role: 'assistant',
          content: result.question || '请补充更多信息',
          extracted: result.partial,
          isConfirmation: true,
        });
      } else if (result.isQuery) {
        addMessage({
          id: Date.now().toString() + '-a',
          role: 'assistant',
          content: result.answer || '好的，我来帮你看看',
        });
      } else {
        addMessage({
          id: Date.now().toString() + '-a',
          role: 'assistant',
          content: '收到，还有什么我可以帮你的吗？',
        });
      }
    } catch (e) {
      console.error('AI processing error:', e);
      addMessage({
        id: Date.now().toString() + '-a',
        role: 'assistant',
        content: '抱歉，处理出错了，请重试。',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 px-0.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            {/* Assistant avatar */}
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                }}
              >
                AI
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                msg.role === 'user'
                  ? ''
                  : msg.isConfirmation
                  ? ''
                  : ''
              }`}
              style={
                msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      borderBottomRightRadius: '6px',
                    }
                  : msg.isConfirmation
                  ? {
                      background: 'var(--warning-light)',
                      border: '1px solid #fde68a',
                      color: '#92400e',
                      borderBottomLeftRadius: '6px',
                    }
                  : {
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      color: 'var(--foreground)',
                      borderBottomLeftRadius: '6px',
                    }
              }
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Quick confirm buttons for confirmation messages */}
              {msg.isConfirmation && msg.extracted && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={async () => {
                      try {
                        const input: CreateRecordInput = {
                          ...msg.extracted as CreateRecordInput,
                        };
                        await confirmAndSave(input);
                        addMessage({
                          id: Date.now().toString() + '-c',
                          role: 'assistant',
                          content: '好的，已确认并保存！',
                        });
                      } catch (e) {
                        console.error('Confirm failed:', e);
                      }
                    }}
                    className="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                    style={{
                      background: 'var(--accent)',
                      color: '#fff',
                    }}
                  >
                    确认
                  </button>
                  <button
                    onClick={() => {
                      addMessage({
                        id: Date.now().toString() + '-c',
                        role: 'assistant',
                        content: '好的，你可以补充更多细节后我再帮你记录。',
                      });
                    }}
                    className="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                    style={{
                      background: 'var(--card-bg)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--card-border)',
                    }}
                  >
                    补充细节
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {processing && (
          <div className="flex justify-start animate-slide-up">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
              }}
            >
              AI
            </div>
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderBottomLeftRadius: '6px',
              }}
            >
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'var(--accent)', animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'var(--accent)', animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'var(--accent)', animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="border-t pt-3 pb-2"
        style={{ borderColor: 'var(--card-border)' }}
      >
        <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
              placeholder="输入文字或点击麦克风说话..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl text-sm resize-none outline-none transition-all duration-200"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--foreground)',
              }}
              disabled={processing}
            />
            {/* Send button overlay */}
            {inputText.trim() && (
              <button
                type="submit"
                className="absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            )}
          </div>
          <VoiceInput onResult={handleSend} disabled={processing} />
        </form>
      </div>
    </div>
  );
}
