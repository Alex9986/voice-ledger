'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { LedgerRecord } from '@/app/lib/types';

interface Props {
  records: LedgerRecord[];
}

export default function MonthlyTrend({ records }: Props) {
  const data = useMemo(() => {
    const months: Array<{ label: string; 支出: number; 收入: number }> = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = `${month + 1}月`;

      const monthRecords = records.filter((r) => {
        const rd = new Date(r.date);
        return rd.getFullYear() === year && rd.getMonth() === month;
      });

      const expense = monthRecords
        .filter((r) => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0);

      const income = monthRecords
        .filter((r) => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0);

      months.push({
        label,
        支出: Math.round(expense * 100) / 100,
        收入: Math.round(income * 100) / 100,
      });
    }

    return months;
  }, [records]);

  const hasData = data.some((d) => d.支出 > 0 || d.收入 > 0);

  return (
    <div
      className="rounded-2xl p-4 border shadow-sm"
      style={{
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full" style={{ background: '#f59e0b' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          月度趋势
        </h3>
      </div>

      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                stroke="#a1a1aa"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#a1a1aa"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`¥${Number(value).toFixed(2)}`, '']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="支出"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 0 }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="收入"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Custom legend */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
              支出
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
              收入
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div
            className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center"
            style={{ background: 'var(--warning-light)' }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-xs text-zinc-400">暂无数据</p>
        </div>
      )}
    </div>
  );
}
