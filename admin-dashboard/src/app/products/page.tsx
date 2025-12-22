import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your Souq inventory</p>
        </div>
        <Link
            href="/products/new"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20"
        >
            <Plus size={20} />
            Add Product
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {products?.map((product: any) => (
                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-xs text-slate-400">No Img</div>
                                        )}
                                    </div>
                                    {product.title}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-6 py-4">RM {product.price}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {(!products || products.length === 0) && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                No products found. Click "Add Product" to create one.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
