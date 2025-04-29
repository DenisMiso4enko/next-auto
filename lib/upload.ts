import { supabase } from './supabase';

// --- Utility for safe file names ---
function sanitizeFileName(name: string) {
  let safe = name.replace(/\s+/g, '_');
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '');
  return safe;
}

// --- Updated uploadFilesToSupabase ---
export async function uploadFilesToSupabase(files: File[]) {
  const bucket = 'products';
  const urls: string[] = [];
  for (const file of files) {
    const filePath = `products/${Date.now()}-${Math.random()}-${sanitizeFileName(file.name)}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    urls.push(filePath); // сохраняем путь с папкой
  }
  return urls;
} 