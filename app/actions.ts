'use server';

import { revalidatePath } from 'next/cache';
import { db, initCollections } from '@/app/lib/cloudbase';
import { chat } from '@/app/lib/deepseek';
import { SYSTEM_PROMPT } from '@/app/lib/prompts';
import type { LedgerRecord, CreateRecordInput, UpdateRecordInput, ChatMessage, DeepSeekResponse } from '@/app/lib/types';

// Initialize collections on first use
let initialized = false;
async function ensureInit() {
  if (!initialized) {
    await initCollections();
    initialized = true;
  }
}

// ============ Record CRUD ============

export async function getRecords(): Promise<LedgerRecord[]> {
  await ensureInit();
  const res = await db.collection('records').orderBy('date', 'desc').limit(100).get();
  return res.data as LedgerRecord[];
}

export async function createRecord(input: CreateRecordInput): Promise<LedgerRecord> {
  await ensureInit();
  const now = Date.now();
  const doc = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('records').add(doc);
  revalidatePath('/');
  return { _id: res.id, ...doc } as LedgerRecord;
}

export async function updateRecord(id: string, input: UpdateRecordInput): Promise<void> {
  await ensureInit();
  await db.collection('records').doc(id).update({
    ...input,
    updatedAt: Date.now(),
  });
  revalidatePath('/');
}

export async function deleteRecord(id: string): Promise<void> {
  await ensureInit();
  await db.collection('records').doc(id).remove();
  revalidatePath('/');
}

// ============ AI Processing ============

interface ProcessVoiceResult {
  extracted?: Partial<CreateRecordInput>;
  needConfirm?: boolean;
  question?: string;
  partial?: Partial<CreateRecordInput>;
  isQuery?: boolean;
  answer?: string;
}

export async function processVoiceInput(
  userInput: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ProcessVoiceResult> {
  'use server';

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user' as const, content: userInput },
  ];

  const result: DeepSeekResponse = await chat(messages);
  return result;
}

export async function confirmAndSave(input: CreateRecordInput): Promise<LedgerRecord> {
  'use server';
  return createRecord(input);
}

// ============ Chat History ============

export async function saveChatMessage(message: Omit<ChatMessage, '_id' | 'createdAt'>): Promise<void> {
  await ensureInit();
  await db.collection('chatMessages').add({
    ...message,
    createdAt: Date.now(),
  });
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  await ensureInit();
  const res = await db
    .collection('chatMessages')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
  return (res.data as ChatMessage[]).reverse();
}
