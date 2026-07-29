'use client';

import { useState, useEffect } from 'react';
import type { LedgerRecord } from '@/app/lib/types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  CURRENCIES,
} from '@/app/lib/types';
import { updateRecord, deleteRecord } from '@/app/actions';

interface Props {
  record: LedgerRecord;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function EditRecordModal({ record, onClose, onUpdated, onDeleted }: Props) {
  const [type, setType] = useState(record.type);
  const [amount, setAmount] = useState(String(record.amount));
  const [currency, setCurrency] = useState(record.currency);
  const [category, setCategory] = useState(record.category);
  const [date, setDate] = useState(record.date);
  const [note, setNote] = useState(record.note);
  const [paymentMethod, setPaymentMethod] = useState(record.paymentMethod);
  const [tags, setTags] = useState(record.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRecord(record._id, {
        type,
        amount: parseFloat(amount) || 0,
        currency: currency as LedgerRecord['currency'],
        category,
        date,
        note,
        paymentMethod: paymentMethod as LedgerRecord['paymentMethod'],
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onUpdated();
    } catch (e) {
      console.error('Failed to update:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定删除这条记录吗？')) return;
    setDeleting(true);
    try {
      await deleteRecord(record._id);
      onDeleted();
    } catch (e) {
      console.error('Failed to delete:', e);
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0';
  const inputStyle = {
    borderColor: 'var(--card-border)',
    background: 'var(--card-bg)',
    color: 'var(--foreground)',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'}`}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto transition-all duration-400 ease-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          animation: visible ? 'slide-up 0.4s ease-out' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="w-10 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 mx-auto mb-4 sm:hidden" />

        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--foreground)' }}>
          编辑账单
        </h2>

        {/* Type */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">类型</label>
          <div className="flex gap-2">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  if (t === 'expense') setCategory(EXPENSE_CATEGORIES[0]);
                  else setCategory(INCOME_CATEGORIES[0]);
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  type === t
                    ? t === 'expense'
                      ? 'bg-red-50 text-red-600 ring-2 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800'
                      : 'bg-green-50 text-green-600 ring-2 ring-green-200 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-800'
                    : 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {t === 'expense' ? '📤 支出' : '📥 收入'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">金额</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${inputClass} flex-1`}
              style={inputStyle}
              step="0.01"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as LedgerRecord['currency'])}
              className={`${inputClass} w-24`}
              style={inputStyle}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">类别</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className={inputClass}
            style={inputStyle}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">日期</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">备注</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="备注信息..."
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">支付方式</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as LedgerRecord['paymentMethod'])}
            className={inputClass}
            style={inputStyle}
          >
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 ml-1">
            标签 <span className="text-zinc-300">（逗号分隔）</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="如: 聚餐, 同事"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl text-sm font-semibold hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
            }}
          >
            {deleting ? '删除中...' : '删除'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
