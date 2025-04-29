import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '@supabase/auth-js';
import { supabase } from '@/lib/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAdmin = (user: User | null) => {
  return user?.user_metadata?.role === 'admin';
};

//
export const setUserRole = (user: User | null) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const role = session.user.user_metadata?.role;
      console.log('Текущая роль:', role);

      localStorage.setItem('userRole', role ?? 'user');
    } else {
      // пользователь вышел
      localStorage.removeItem('userRole');
    }
  });
};


// export async function uploadFilesToSupabase(files: File[]): Promise<string[]> {
//   const uploadedUrls: string[] = [];

//   for (const file of files) {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
//     const filePath = `products/${fileName}`;

//     const { error } = await supabase.storage
//       .from('products') // название бакета в Supabase Storage
//       .upload(filePath, file);

//     if (error) {
//       console.error('Ошибка при загрузке файла:', error);
//       throw error;
//     }

//     const { data } = supabase.storage
//       .from('your-bucket-name')
//       .getPublicUrl(filePath);

//     if (data?.publicUrl) {
//       uploadedUrls.push(data.publicUrl);
//     }
//   }

//   return uploadedUrls;
// }
function sanitizeFileName(name: string ) {
  let safe = name.replace(/\s+/g, '_');
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '');
  return safe;
}

export async function uploadFilesToSupabase(files: File[]) {
  const bucket = 'products';
  const urls = [];
  for (const file of files) {
    const filePath = `products/${Date.now()}-${Math.random()}-${sanitizeFileName(file.name)}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    urls.push(filePath);
  }
  return urls;
}
// export async function uploadFilesToSupabase(files: File[]) {
//   const bucket = 'products'; // ваше имя бакета
//   const urls = [];
//   for (const file of files) {
//     const filePath = `${Date.now()}-${Math.random()}-${file.name}`;
//     const { error } = await supabase.storage.from(bucket).upload(filePath, file);
//     if (error) throw error;
//     urls.push(filePath); // сохраняем только путь!
//   }
//   return urls;
// }