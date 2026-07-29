'use client';

import { useState } from 'react';
import type { LedgerRecord } from '@/app/lib/types';
import { CURRENCY_SYMBOLS } from '@/app/lib/types';
import EditRecordModal from './EditRecordModal';

interface Props {
  record: LedgerRecord;
  onUpdated: () => void;
  onDeleted: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  餐饮: '🍔',
  交通: '🚇',
  购物: '🛒',
  住房: '🏠',
  娱乐: '🎮',
  医疗: '💊',
  教育: '📚',
  通讯: '📱',
  服饰: '👗',
  日用: '🧴',
  工资: '💼',
  奖金: '🎁',
  理财: '📈',
  报销: '🧾',
  红包: '🧧',
  其他: '📌',
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '📌';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return '今天';
  if (date.toDateString() === yesterday.toDateString()) return '昨天';

  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function RecordCard({ record, onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const isExpense = record.type === 'expense';
  const symbol = CURRENCY_SYMBOLS[record.currency] || record.currency;
  const amountStr = `${isExpense ? '-' : '+'}${symbol}${record.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 animate-slide-up"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = isExpense ? '#fecaca' : '#bbf7d0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = 'var(--card-border)';
        }}
        onClick={() => setEditing(true)}
        onAnimationEnd={(e) => {
          (e.target as HTMLElement).style.animationFillMode = 'none';
        }}
      >
        {/* Left color strip */}
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{
            background: isExpense
              ? 'linear-gradient(180deg, var(--danger) 0%, #fb7185 100%)'
              : 'linear-gradient(180deg, var(--success) 0%, #6ee7b7 100%)',
          }}
        />

        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: isExpense ? 'var(--danger-light)' : 'var(--success-light)',
          }}
        >
          {getCategoryIcon(record.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--foreground)' }}
            >
              {record.category}
            </span>
            {record.paymentMethod && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                }}
              >
                {record.paymentMethod}
              </span>
            )}
          </div>
          {record.note && (
            <div className="text-xs text-zinc-400 truncate mt-0.5">{record.note}</div>
          )}
          {record.tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Amount & date */}
        <div className="text-right flex-shrink-0">
          <div
            className="text-sm font-bold tracking-tight"
            style={{ color: isExpense ? 'var(--danger)' : 'var(--success)' }}
          >
            {amountStr}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{formatDate(record.date)}</div>
        </div>
      </div>

      {editing && (
        <EditRecordModal
          record={record}
          onClose={() => setEditing(false)}
          onUpdated={() => {
            setEditing(false);
            onUpdated();
          }}
          onDeleted={() => {
            setEditing(false);
            onDeleted();
          }}
        />
      )}
    </>
  );
}
