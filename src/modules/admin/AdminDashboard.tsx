import React, { useState } from 'react';
import InfaqTab from './components/InfaqTab';
import AnalyticsTab from './components/AnalyticsTab';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INFAQ' | 'ANALYTICS'>('INFAQ');

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-kufi">Admin Dashboard</h1>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button 
            onClick={() => setActiveTab('INFAQ')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'INFAQ' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
          >
            Infaq & Kewangan
          </button>
          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'ANALYTICS' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
          >
            Analitik
          </button>
        </div>
      </div>

      {activeTab === 'INFAQ' ? <InfaqTab /> : <AnalyticsTab />}
    </div>
  );
};

export default AdminDashboard;
