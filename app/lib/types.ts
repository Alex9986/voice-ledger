export const EXPENSE_CATEGORIES = [
  '餐饮',
  '交通',
  '购物',
  '住房',
  '娱乐',
  '医疗',
  '教育',
  '通讯',
  '服饰',
  '日用',
  '其他',
] as const;

export const INCOME_CATEGORIES = [
  '工资',
  '奖金',
  '理财',
  '报销',
  '红包',
  '其他',
] as const;

export const PAYMENT_METHODS = [
  '微信',
  '支付宝',
  '银行卡',
  '现金',
  '其他',
] as const;

export const CURRENCIES = ['CNY', 'CAD', 'USD', 'GBP'] as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  CAD: 'C$',
  USD: '$',
  GBP: '£',
};

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Currency = (typeof CURRENCIES)[number];

export interface LedgerRecord {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: Currency;
  category: Category;
  date: string;
  note: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type CreateRecordInput = Omit<LedgerRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecordInput = Partial<CreateRecordInput>;

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  extracted?: Partial<CreateRecordInput>;
  createdAt: number;
}

export interface DeepSeekResponse {
  extracted?: Partial<CreateRecordInput>;
  needConfirm?: boolean;
  question?: string;
  partial?: Partial<CreateRecordInput>;
  isQuery?: boolean;
  answer?: string;
}
