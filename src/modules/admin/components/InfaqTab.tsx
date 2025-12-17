import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  reference_id: string;
}

const InfaqTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setTransactions(data);
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const totalRaised = transactions.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? t.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Total Kutipan</p>
          <h3 className="text-3xl font-bold text-emerald-400">RM {totalRaised}</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Transaksi</p>
          <h3 className="text-3xl font-bold text-white">{transactions.length}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-4">Reference</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-mono text-xs text-slate-300">{t.reference_id}</td>
                <td className="p-4 font-bold text-emerald-400">RM {t.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] ${t.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {transactions.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Tiada rekod transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfaqTab;
