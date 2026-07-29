'use client';

import { useState } from 'react';
import type { LedgerRecord } from '@/app/lib/types';

interface Props {
  records: LedgerRecord[];
}

export default function ExportButton({ records }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (records.length === 0) return;
    setExporting(true);

    try {
      const XLSX = (await import('xlsx')).default;

      const data = records.map((r) => ({
        类型: r.type === 'expense' ? '支出' : '收入',
        金额: r.amount,
        币种: r.currency,
        类别: r.category,
        日期: r.date,
        备注: r.note,
        支付方式: r.paymentMethod,
        标签: r.tags.join(', '),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '账单记录');

      const colWidths = [
        { wch: 8 },
        { wch: 12 },
        { wch: 8 },
        { wch: 10 },
        { wch: 12 },
        { wch: 30 },
        { wch: 12 },
        { wch: 20 },
      ];
      ws['!cols'] = colWidths;

      const now = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `账单记录_${now}.xlsx`);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || records.length === 0}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
      }}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {exporting ? '导出中...' : '导出 Excel'}
    </button>
  );
}
