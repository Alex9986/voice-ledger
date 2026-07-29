import cloudbase from '@cloudbase/node-sdk';

const app = cloudbase.init({
  env: process.env.CLOUDBASE_ENV_ID!,
  accessKey: process.env.CLOUDBASE_API_KEY!,
});

export const db = app.database();

export async function ensureCollection(name: string) {
  try {
    await db.createCollection(name);
    console.log(`Collection "${name}" created successfully`);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    // Ignore if collection already exists
    if (err.code !== 'ResourceConflict') {
      console.error(`Failed to create collection "${name}":`, err.message);
    }
  }
}

export async function initCollections() {
  await ensureCollection('records');
  await ensureCollection('chatMessages');
}
