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


export async function uploadFilesToSupabase(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('products') // название бакета в Supabase Storage
      .upload(filePath, file);

    if (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('your-bucket-name')
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      uploadedUrls.push(data.publicUrl);
    }
  }

  return uploadedUrls;
}