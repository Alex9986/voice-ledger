'use client';

import { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="relative group transition-all duration-300"
      style={{
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
        borderRadius: '14px',
      }}
    >
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
        style={{ color: focused ? 'var(--accent)' : '#a1a1aa' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="搜索标签、备注、类别..."
        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border transition-all duration-200 outline-none placeholder:text-zinc-400"
        style={{
          background: 'var(--card-bg)',
          borderColor: focused ? 'var(--accent)' : 'var(--card-border)',
          color: 'var(--foreground)',
        }}
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
