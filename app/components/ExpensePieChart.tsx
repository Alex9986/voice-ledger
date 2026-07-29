'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { LedgerRecord } from '@/app/lib/types';

const COLORS = [
  '#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#3b82f6', '#94a3b8',
];

interface Props {
  records: LedgerRecord[];
}

export default function ExpensePieChart({ records }: Props) {
  const data = useMemo(() => {
    const now = new Date();
    const thisMonthExpenses = records.filter((r) => {
      const d = new Date(r.date);
      return (
        r.type === 'expense' &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    const categoryMap: Record<string, number> = {};
    thisMonthExpenses.forEach((r) => {
      categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <div
      className="rounded-2xl p-4 border shadow-sm"
      style={{
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          本月支出分类
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <div
            className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent-light)' }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-xs text-zinc-400">暂无支出数据</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`¥${Number(value).toFixed(2)}`, '金额']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom legend */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.slice(0, 6).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs text-zinc-500">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                {entry.name}
              </div>
            ))}
            {data.length > 6 && (
              <span className="text-xs text-zinc-400">+{data.length - 6}项</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
