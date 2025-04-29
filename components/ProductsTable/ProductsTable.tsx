'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { twMerge } from 'tailwind-merge';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';

type Product = Database['public']['Tables']['products']['Row'] & {
  brands: {
    name: string;
  } | null;
};

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
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  async function deleteProduct(productId: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        return;
      }

      // Refresh the products list after deletion
      fetchProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
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
          Create Product
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

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description className="mb-4">
              Are you sure you want to delete the product {productToDelete?.name}? This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => productToDelete && deleteProduct(productToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                    <button 
                      onClick={() => setProductToDelete(product)} 
                      className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition'
                    >
                      Delete
                    </button>
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
