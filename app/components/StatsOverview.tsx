'use client';

import { useMemo } from 'react';
import type { LedgerRecord } from '@/app/lib/types';
import { CURRENCY_SYMBOLS } from '@/app/lib/types';

interface Props {
  records: LedgerRecord[];
}

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CARD_STYLES = [
  {
    label: '本月支出',
    gradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    darkGradient: 'linear-gradient(135deg, #1c1017 0%, #2d1215 100%)',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v-1m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: '本月收入',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    darkGradient: 'linear-gradient(135deg, #0a1f1a 0%, #0d3324 100%)',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v-1m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: '本月结余',
    gradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    darkGradient: 'linear-gradient(135deg, #1e1b4b 0%, #2e2060 100%)',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
];

export default function StatsOverview({ records }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = records.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalExpense = thisMonth
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalIncome = thisMonth
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    const currencyCounts: Record<string, number> = {};
    thisMonth.forEach((r) => {
      currencyCounts[r.currency] = (currencyCounts[r.currency] || 0) + 1;
    });
    const displayCurrency =
      Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'CNY';

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      displayCurrency,
    };
  }, [records]);

  const values = [
    { value: stats.totalExpense, color: 'var(--danger)' },
    { value: stats.totalIncome, color: 'var(--success)' },
    { value: stats.balance, color: stats.balance >= 0 ? '#6366f1' : 'var(--danger)' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {CARD_STYLES.map((card, i) => {
        const isBalance = i === 2;
        return (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl p-3.5 border shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
            style={{
              background: card.gradient,
              borderColor: 'transparent',
              animationDelay: `${i * 0.08}s`,
              animationFillMode: 'both',
            }}
          >
            {/* Background icon */}
            <svg
              className="absolute -right-2 -bottom-2 w-14 h-14 opacity-[0.08] dark:opacity-[0.06]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              style={{ color: isBalance ? '#6366f1' : i === 0 ? 'var(--danger)' : 'var(--success)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
            </svg>

            {/* Content */}
            <div className="relative z-10">
              <div
                className="text-[11px] font-medium mb-1.5 tracking-wide"
                style={{ color: isBalance ? '#6366f1' : i === 0 ? 'var(--danger)' : 'var(--success)' }}
              >
                {card.label}
              </div>
              <div
                className="text-base font-bold tracking-tight"
                style={{ color: isBalance ? '#6366f1' : i === 0 ? 'var(--danger)' : 'var(--success)' }}
              >
                {formatAmount(values[i].value, stats.displayCurrency)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
