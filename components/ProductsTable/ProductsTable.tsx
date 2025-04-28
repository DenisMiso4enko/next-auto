'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { twMerge } from 'tailwind-merge';
import { Database } from '@/lib/database.types';
import Link from 'next/link';

type Product = Database['public']['Tables']['products']['Row'];

const PAGE_SIZE = 10;

const SORTABLE_FIELDS = ['name', 'brand', 'stock', 'price', 'created_at'] as const;
type SortField = (typeof SORTABLE_FIELDS)[number];
type SortDirection = 'asc' | 'desc';

export default function ProductsTable() {
  const supabase = createClientComponentClient<Database>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at' as SortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortField, sortDirection]);

  async function fetchProducts() {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('products')
      .select('*, brands(name)', { count: 'exact' })
      .range(from, to)
      .order(sortField, { ascending: sortDirection === 'asc' });

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } else {
      setProducts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }

  function handleNextPage() {
    if (page < totalPages) setPage((prev) => prev + 1);
  }

  function handlePrevPage() {
    if (page > 1) setPage((prev) => prev - 1);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <Link
          href="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Создать продукт
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-4 py-2 rounded w-full max-w-xs focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100">
          <tr>
            <SortableHeader
              label="Name"
              field="name"
              activeField={sortField}
              direction={sortDirection}
              onClick={handleSort}
            />
            <th className="px-4 py-2 text-left">ID</th>
            <SortableHeader
              label="Brand"
              field="brand"
              activeField={sortField}
              direction={sortDirection}
              onClick={handleSort}
            />
            <SortableHeader
              label="Stock"
              field="stock"
              activeField={sortField}
              direction={sortDirection}
              onClick={handleSort}
            />
            <SortableHeader
              label="Created At"
              field="created_at"
              activeField={sortField}
              direction={sortDirection}
              onClick={handleSort}
            />
            <SortableHeader
              label="Price"
              field="price"
              activeField={sortField}
              direction={sortDirection}
              onClick={handleSort}
            />
            <th
              className="px-4 py-2 text-left cursor-pointer select-none hover:bg-gray-200"
            >
              <div className="flex items-center gap-1">
                Действия
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-10">
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => {
              console.log('product.brand_id', product);
              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.id}</td>
                  {/*<td className="px-4 py-2">{product.brand_id}</td>*/}
                  <td className="px-4 py-2">{product.brands?.name}</td>
                  {/* Отображаем имя бренда */}
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">${product.price?.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-500 hover:underline">
                      {product.name}
                    </Link>
                  </td>

                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={twMerge(
            'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300',
            page === 1 && 'opacity-50 cursor-not-allowed'
          )}
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={twMerge(
            'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300',
            page === totalPages && 'opacity-50 cursor-not-allowed'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}

type SortableHeaderProps = {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
};

function SortableHeader({
                          label,
                          field,
                          activeField,
                          direction,
                          onClick
                        }: SortableHeaderProps) {
  const isActive = field === activeField;

  return (
    <th
      onClick={() => onClick(field)}
      className="px-4 py-2 text-left cursor-pointer select-none hover:bg-gray-200"
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          <span>{direction === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  );
}
