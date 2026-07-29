'use client';

import { useState, useMemo } from 'react';
import type { LedgerRecord } from '@/app/lib/types';
import SearchBar from './SearchBar';
import RecordCard from './RecordCard';
import { useRouter } from 'next/navigation';

interface Props {
  initialRecords: LedgerRecord[];
}

export default function RecordList({ initialRecords }: Props) {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<LedgerRecord[]>(initialRecords);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.note.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q) ||
        r.paymentMethod.toLowerCase().includes(q)
    );
  }, [records, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, LedgerRecord[]> = {};
    filtered.forEach((r) => {
      const date = new Date(r.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label: string;
      if (date.toDateString() === today.toDateString()) {
        label = '今天';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = '昨天';
      } else {
        label = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(r);
    });
    return groups;
  }, [filtered]);

  const refresh = () => {
    router.refresh();
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent-light)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v6m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed">
          还没有记账记录<br />
          <span className="text-xs">去 AI 对话页用语音记一笔吧</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 animate-fade-in">
          没有找到匹配的记录
        </div>
      ) : (
        Object.entries(grouped).map(([dateLabel, items] , groupIdx) => (
          <div key={dateLabel} style={{ animationDelay: `${groupIdx * 0.05}s`, animationFillMode: 'both' }}
            className="animate-slide-up">
            <div className="flex items-center gap-2 mb-2.5 ml-1">
              <div className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {dateLabel}
              </span>
              <span className="text-xs text-zinc-300 dark:text-zinc-600">
                {items.length} 笔
              </span>
            </div>
            <div className="space-y-2 mb-5">
              {items.map((record, idx) => (
                <div key={record._id} style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}>
                  <RecordCard
                    record={record}
                    onUpdated={refresh}
                    onDeleted={refresh}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
