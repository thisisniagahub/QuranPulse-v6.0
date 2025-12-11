import React from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle, Clock, Download, Search, Filter, Award, Calendar, Zap, ShoppingBag, Heart, CheckCircle, Tv, Headphones, Activity, Upload, Ban, Settings, FileText } from 'lucide-react';
import { StatCard, ChartCard, ActivityList, UserTable, ContentList, MetricCard, MetricBox, TierCard, TransactionList, ModerationQueue, FeatureFlags, SystemAnnouncements } from './ui-components';

// Overview Dashboard
export const OverviewView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Users" value="10,247" change="+12.5%" trend="up" icon={Users} color="cyan" />
      <StatCard title="Monthly Revenue" value="RM 52,430" change="+8.3%" trend="up" icon={DollarSign} color="green" />
      <StatCard title="Conversion Rate" value="9.2%" change="+2.1%" trend="up" icon={TrendingUp} color="blue" />
      <StatCard title="Pending Reviews" value="23" change="-5" trend="down" icon={AlertCircle} color="amber" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="User Growth (30 Days)" />
      <ChartCard title="Revenue Breakdown" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <ActivityList />
    </div>
  </div>
);

// Analytics View
export const AnalyticsView = () => (
  <div className="space-y-6">
    <div className="flex gap-4 mb-6">
      <select className="px-4 py-2 bg-gray-900 border border-cyan-500/20 rounded-lg text-sm">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
      <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm flex items-center gap-2">
        <Download size={16} />
        Export Report
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MetricCard title="DAU/MAU Ratio" value="32.4%" subtitle="Stickiness" />
      <MetricCard title="D7 Retention" value="42%" subtitle="Week 1 Return" />
      <MetricCard title="D30 Retention" value="24.1%" subtitle="Month 1 Return" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Conversion Funnel" subtitle="FREE → PRO: 9.2%" />
      <ChartCard title="Churn Analysis" subtitle="Monthly: 3.2%" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Learning Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricBox label="Iqra 1 Completion" value="78%" color="cyan" />
        <MetricBox label="Avg Session" value="12.4 mins" color="green" />
        <MetricBox label="AI Accuracy" value="87%" color="blue" />
        <MetricBox label="Khatam Count" value="1,234" color="purple" />
      </div>
    </div>
  </div>
);

// Users View
export const UsersView = () => (
  <div className="space-y-6">
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users by name, email, or ID..."
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/50"
        />
      </div>
      <button className="px-4 py-3 bg-gray-900 border border-cyan-500/20 rounded-lg flex items-center gap-2">
        <Filter size={18} />
        Filters
      </button>
      <button className="px-4 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
        <Download size={18} />
        Export
      </button>
    </div>

    <UserTable />
  </div>
);

// Gamification View
export const GamificationView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total Badges" value="24" icon={Award} color="purple" />
      <StatCard title="Active Events" value="3" icon={Calendar} color="cyan" />
      <StatCard title="Avg User XP" value="1,247" icon={Zap} color="amber" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Badges & Achievements</h3>
        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
          <Award size={16} />
          Create Badge
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'First Khatam', icon: '📖', earned: 234 },
          { name: 'Iqra Master', icon: '🎓', earned: 567 },
          { name: '30 Day Streak', icon: '🔥', earned: 123 },
          { name: 'AI Scholar', icon: '🤖', earned: 456 },
        ].map((badge, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">{badge.icon}</div>
            <p className="font-medium text-sm mb-1">{badge.name}</p>
            <p className="text-xs text-gray-400">{badge.earned} earned</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">XP Multiplier Settings</h3>
      <div className="space-y-3">
        {[
          { action: 'Complete Iqra Page', baseXP: 10, multiplier: '1x' },
          { action: 'AI Chat Session', baseXP: 5, multiplier: '1x' },
          { action: 'Daily Prayer Log', baseXP: 3, multiplier: '2x (Weekend)' },
        ].map((xp, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">{xp.action}</p>
              <p className="text-sm text-gray-400">Base: {xp.baseXP} XP</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-medium">{xp.multiplier}</span>
              <button className="px-3 py-1 bg-gray-700 rounded text-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Family View
export const FamilyView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total Families" value="1,520" icon={Users} color="purple" />
      <StatCard title="Avg Members" value="4.2" icon={Users} color="cyan" />
      <StatCard title="Disputes" value="3" icon={AlertCircle} color="amber" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Family Groups</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search family..."
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <button className="px-4 py-2 bg-gray-800 rounded-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Keluarga Ahmad', head: 'Ahmad bin Hassan', members: 6, plan: 'Active', disputes: 0 },
          { name: 'Keluarga Fatimah', head: 'Fatimah binti Ali', members: 4, plan: 'Active', disputes: 0 },
          { name: 'Keluarga Ibrahim', head: 'Ibrahim Rahman', members: 5, plan: 'Expired', disputes: 1 },
        ].map((family, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium mb-1">{family.name}</p>
                <p className="text-sm text-gray-400">Head: {family.head}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-gray-500">Members: {family.members}/6</span>
                  <span className={`px-2 py-0.5 rounded ${
                    family.plan === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {family.plan}
                  </span>
                  {family.disputes > 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      {family.disputes} Dispute
                    </span>
                  )}
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Souq/Marketplace View
export const SouqView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Products" value="234" icon={ShoppingBag} color="blue" />
      <StatCard title="Vendors" value="45" icon={Users} color="green" />
      <StatCard title="Pending Approval" value="12" icon={Clock} color="amber" />
      <StatCard title="Commission" value="RM 2,340" icon={DollarSign} color="purple" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Vendor Approval Queue</h3>
      <div className="space-y-3">
        {[
          { vendor: 'Islamic Books Sdn Bhd', products: 24, submitted: '2 days ago', status: 'pending' },
          { vendor: 'Halal Fashion Store', products: 15, submitted: '1 week ago', status: 'pending' },
        ].map((vendor, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium mb-1">{vendor.vendor}</p>
              <p className="text-sm text-gray-400">{vendor.products} products • {vendor.submitted}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm">
                Approve
              </button>
              <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Barakah/Donation View
export const BarakahView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total Donations" value="RM 12,450" icon={Heart} color="pink" />
      <StatCard title="This Month" value="RM 3,200" icon={TrendingUp} color="green" />
      <StatCard title="Projects Funded" value="5" icon={CheckCircle} color="cyan" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Infaq Ledger</h3>
        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
          <FileText size={16} />
          Generate Report
        </button>
      </div>
      <div className="space-y-3">
        {[
          { donor: 'Anonymous', amount: 'RM 100', purpose: 'Server Costs', date: '1 hour ago' },
          { donor: 'Ahmad Hassan', amount: 'RM 50', purpose: 'General Fund', date: '3 hours ago' },
          { donor: 'Siti Aminah', amount: 'RM 200', purpose: 'Scholarship', date: '1 day ago' },
        ].map((donation, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium mb-1">{donation.donor}</p>
              <p className="text-sm text-gray-400">{donation.purpose}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-400">{donation.amount}</p>
              <p className="text-xs text-gray-500">{donation.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Transparency Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Total Received</p>
          <p className="text-2xl font-bold text-green-400">RM 12,450</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-blue-400">RM 8,200</p>
        </div>
      </div>
    </div>
  </div>
);

// Moderation View
export const ModerationView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Reported Content" value="8" icon={AlertCircle} color="red" />
      <StatCard title="Pending Approvals" value="15" icon={Clock} color="amber" />
      <StatCard title="Active Bans" value="3" icon={Ban} color="gray" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Content Moderation Queue</h3>
      <ModerationQueue />
    </div>
  </div>
);

// Multimedia View
export const MultimediaView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Videos" value="45" icon={Tv} color="red" />
      <StatCard title="Podcasts" value="78" icon={Headphones} color="purple" />
      <StatCard title="Live Sessions" value="12" icon={Activity} color="green" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Video Library</h3>
        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
          <Upload size={16} />
          Upload Video
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Tafsir Al-Fatihah', duration: '15:23', views: '1.2K' },
          { title: 'Tajwid Basics', duration: '22:45', views: '2.5K' },
          { title: 'Morning Zikir', duration: '10:30', views: '890' },
        ].map((video, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-700 flex items-center justify-center">
              <Tv size={32} className="text-gray-500" />
            </div>
            <div className="p-3">
              <p className="font-medium mb-1 text-sm">{video.title}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{video.duration}</span>
                <span>{video.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// System View
export const SystemView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Uptime" value="99.8%" icon={CheckCircle} color="green" />
      <StatCard title="API Latency" value="124ms" icon={Clock} color="blue" />
      <StatCard title="Active Features" value="12/15" icon={Settings} color="cyan" />
    </div>

    <FeatureFlags />
    <SystemAnnouncements />
  </div>
);