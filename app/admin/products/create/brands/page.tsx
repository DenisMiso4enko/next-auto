'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreateBrandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Название бренда не может быть пустым');
      return;
    }
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('brands')
      .insert([{ name, slug }]);


    if (error) {
      console.error(error);
      // setError(error);
      return;
    }

    router.push('/admin/products');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создать бренд</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Название бренда"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Создать
        </button>
      </form>
    </div>
  );
}