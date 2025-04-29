'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadFilesToSupabase } from '@/lib/upload';
import { log } from 'console';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  brand_id: z.string().uuid('Please select a brand'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear()),
  volume: z.coerce.number().min(0.1).max(9.9),
  fuel_type: z.enum(['Бензин', 'Дизель']),
  body_type: z.enum(['Седан', 'Универсал', 'Хэтчбэк', 'Минивэн', 'Купе', 'Фургон']),
  transmission: z.enum(['Механика', 'Автомат']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.enum(['USD', 'EUR', 'BYN', 'RUB']),
  condition: z.enum(['Новое', 'Б/У']),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  images: z.string().array().optional()
});

type ProductForm = z.infer<typeof formSchema>;

// --- Utility for safe file names ---
function sanitizeFileName(name: string) {
  let safe = name.replace(/\s+/g, '_');
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '');
  return safe;
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const [brands, setBrands] = useState<{ id: string; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File | null; url: string }[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model: '',
      year: new Date().getFullYear(),
      volume: 2.0,
      fuel_type: 'Бензин',
      body_type: 'Фургон',
      transmission: 'Автомат',
      description: '',
      price: 0,
      currency: 'USD',
      condition: 'Б/У',
      stock: 1,
      images: []
    }
  });

  // Fetch product and brands data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch brands
        const { data: brandsData } = await supabase.from('brands').select('id, name');
        if (brandsData) {
          setBrands(brandsData);
        }

        // Fetch product
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (productData) {
          // Set form values with product data
          form.reset({
            name: productData.name,
            brand_id: productData.brand_id,
            model: productData.model || '',
            year: productData.year || new Date().getFullYear(),
            volume: productData.volume || 2.0,
            fuel_type: productData.fuel_type || 'Бензин',
            body_type: productData.body_type || 'Фургон',
            transmission: productData.transmission || 'Автомат',
            description: productData.description || '',
            price: productData.price || 0,
            currency: productData.currency || 'USD',
            condition: productData.condition || 'Б/У',
            stock: productData.stock || 1,
            images: productData.images || []
          });

          // Set preview images if they exist
          if (productData.images?.length) {
            const previewImages = productData.images.map((img: string) => {
              // The path is already in the correct format: "products/filename.ext"
              const url = supabase.storage.from('products').getPublicUrl(img).data.publicUrl;
              return {
                file: null,
                url
              };
            });
            setPreviewImages(previewImages);
          }
          
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, form]);

  async function onSubmit(data: ProductForm) {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('products')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product updated successfully'
      });

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    form.setValue(
      'images',
      (form.getValues('images') || []).filter((_: string, i: number) => i !== index)
    );
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter car model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Volume</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="Enter engine volume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Дизель">Дизель</SelectItem>
                      <SelectItem value="Бензин">Бензин</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Седан">Седан</SelectItem>
                      <SelectItem value="Универсал">Универсал</SelectItem>
                      <SelectItem value="Хэтчбэк">Хэтчбэк</SelectItem>
                      <SelectItem value="Минивэн">Минивэн</SelectItem>
                      <SelectItem value="Купе">Купе</SelectItem>
                      <SelectItem value="Фургон">Фургон</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Автомат">Автомат</SelectItem>
                      <SelectItem value="Механика">Механика</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="BYN">BYN</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Новое">Новое</SelectItem>
                      <SelectItem value="Б/У">Б/У</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Enter stock quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        // 1. Local preview
                        const localPreviews = files.map((file) => ({
                          file,
                          url: URL.createObjectURL(file)
                        }));
                        setPreviewImages((prev) => [...prev, ...localPreviews]);
                        // 2. Upload to Supabase
                        try {
                          const urls = await uploadFilesToSupabase(files);
                          field.onChange([...(field.value || []), ...urls]);
                        } catch (error) {
                          console.error('Ошибка загрузки файлов:', error);
                        }
                      }}
                    />
                    {/* Preview with delete option */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={preview.url}
                            alt="preview"
                            fill
                            className="object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

async function getPublicUrls(urls: string[]) {
  // urls — это массив путей в storage, например: ['products/abc.jpg']
  return await Promise.all(
    urls.map(async (path) => {
      const { data } = supabase.storage.from('products').getPublicUrl(path);
      return data.publicUrl;
    })
  );
}