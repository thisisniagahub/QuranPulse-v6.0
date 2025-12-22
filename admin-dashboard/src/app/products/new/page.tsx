'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const product = {
        title: formData.get('title'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        stock: Number(formData.get('stock')),
        description: formData.get('description'),
        image: formData.get('image'), // In real app, handle file upload to storage bucket
        is_featured: formData.get('is_featured') === 'on'
    };

    const { error } = await supabase.from('products').insert(product);

    if (error) {
        alert('Error creating product: ' + error.message);
        setLoading(false);
    } else {
        router.push('/products');
        router.refresh();
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">

        <div className="space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <input
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. Tafsir Al-Quran"
            />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Price (RM)</label>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-cyan-500 outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <input
                    name="stock"
                    type="number"
                    required
                    defaultValue={10}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-cyan-500 outline-none"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select name="category" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none">
                <option value="BOOK">Book</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="COURSES">Digital Course</option>
            </select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input
                name="image"
                type="url"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="https://..."
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-cyan-500 outline-none"
            />
        </div>

        <div className="pt-4 flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Product
            </button>
        </div>

      </form>
    </div>
  );
}
