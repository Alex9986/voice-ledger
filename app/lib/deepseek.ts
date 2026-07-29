import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

export async function chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from DeepSeek');
  }

  return JSON.parse(content);
}
