import React from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, MoreVertical, Download, Upload, Eye, Ban, RefreshCw, Hash, Bell, Gift, Award, ShoppingBag, Heart, Tv, Headphones, Mail, Lock, Activity, Calendar, FileText, AlertTriangle, Zap, Database, Key, Server, BookOpen } from 'lucide-react';

// Reusable Components
export const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-500/20`}>
        <Icon size={20} className={`text-${color}-400`} />
      </div>
      {change && (
        <span className={`text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold mb-1">{value}</h3>
    <p className="text-sm text-gray-400">{title}</p>
  </div>
);

export const ChartCard = ({ title, subtitle }) => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-1">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400 mb-4">{subtitle}</p>}
    <div className="h-48 flex items-center justify-center bg-gray-800 rounded-lg">
      <p className="text-gray-500 text-sm">Chart Visualization</p>
    </div>
  </div>
);

export const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6 text-center">
    <p className="text-3xl font-bold mb-2 text-cyan-400">{value}</p>
    <p className="font-medium mb-1">{title}</p>
    <p className="text-sm text-gray-400">{subtitle}</p>
  </div>
);

export const MetricBox = ({ label, value, color }) => (
  <div className="bg-gray-800 rounded-lg p-4 text-center">
    <p className="text-3xl font-bold mb-2 text-cyan-400">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

export const ContentCard = ({ title, count, icon: Icon, onClick }) => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6 cursor-pointer hover:border-cyan-500/40 transition-colors" onClick={onClick}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/20">
        <Icon size={20} className="text-cyan-400" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  </div>
);

export const TierCard = ({ tier, count, percentage, color }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium">{tier}</span>
      <span className={`px-2 py-1 rounded text-xs bg-${color}-500/20 text-${color}-400`}>
        {percentage}
      </span>
    </div>
    <p className="text-2xl font-bold">{count}</p>
    <p className="text-sm text-gray-400">users</p>
  </div>
);

export const ActivityList = () => (
  <div className="space-y-3">
    {[
      { user: 'Ahmad Hassan', action: 'completed Iqra Page 5', time: '2 mins ago', type: 'success' },
      { user: 'Fatimah Ali', action: 'started PRO subscription', time: '5 mins ago', type: 'success' },
      { user: 'System', action: 'AI model rotated to Key #2', time: '10 mins ago', type: 'info' },
      { user: 'Ali Rahman', action: 'reported AI response', time: '15 mins ago', type: 'warning' },
    ].map((activity, idx) => (
      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${
          activity.type === 'success' ? 'bg-green-400' :
          activity.type === 'warning' ? 'bg-amber-400' :
          'bg-blue-400'
        }`}></div>
        <div className="flex-1">
          <p className="text-sm">{activity.user} {activity.action}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export const UserTable = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {[
            { name: 'Ahmad Hassan', email: 'ahmad@example.com', plan: 'PRO', joined: '2024-01-15', status: 'active' },
            { name: 'Fatimah Ali', email: 'fatimah@example.com', plan: 'FREE', joined: '2024-02-20', status: 'active' },
            { name: 'Ali Rahman', email: 'ali@example.com', plan: 'FAMILY', joined: '2024-03-10', status: 'suspended' },
          ].map((user, idx) => (
            <tr key={idx} className="hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.plan === 'PRO' ? 'bg-cyan-500/20 text-cyan-400' :
                  user.plan === 'FAMILY' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {user.plan}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {user.joined}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ContentList = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">Recent Content Updates</h3>
    <div className="space-y-3">
      {[
        { type: 'Doa', title: 'Doa Sebelum Tidur', author: 'Ustaz Ahmad', status: 'published', date: '2 hours ago' },
        { type: 'Quran', title: 'Surah Al-Baqarah Ayat 255', author: 'Ustaz Ali', status: 'review', date: '5 hours ago' },
        { type: 'Iqra', title: 'Iqra 6 - Page 15', author: 'Ustazah Fatimah', status: 'published', date: '1 day ago' },
      ].map((content, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-400">
                {content.type}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                content.status === 'published' ? 'bg-green-500/20 text-green-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {content.status}
              </span>
            </div>
            <p className="font-medium mb-1">{content.title}</p>
            <p className="text-sm text-gray-400">By {content.author} • {content.date}</p>
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Eye size={16} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const ScholarQueue = () => (
  <div className="space-y-3">
    {[
      { title: 'Hukum Forex Trading', scholar: 'Dr. Ahmad', submitted: '2 hours ago', priority: 'high' },
      { title: 'Cara Solat Istikharah', scholar: 'Ustaz Ali', submitted: '5 hours ago', priority: 'normal' },
      { title: 'Doa Musafir Lengkap', scholar: 'Ustazah Fatimah', submitted: '1 day ago', priority: 'low' },
    ].map((item, idx) => (
      <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs ${
              item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
              item.priority === 'normal' ? 'bg-amber-500/20 text-amber-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {item.priority}
            </span>
            <span className="text-xs text-gray-500">{item.submitted}</span>
          </div>
          <p className="font-medium mb-1">{item.title}</p>
          <p className="text-sm text-gray-400">Scholar: {item.scholar}</p>
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
);

export const ComplianceGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { area: 'Quran Content', status: 'compliant', score: '98%' },
      { area: 'AI Responses', status: 'compliant', score: '94%' },
      { area: 'User Data', status: 'compliant', score: '100%' },
      { area: 'Payment System', status: 'review', score: '85%' },
    ].map((item, idx) => (
      <div key={idx} className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{item.area}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            item.status === 'compliant' ? 'bg-green-500/20 text-green-400' :
            'bg-amber-500/20 text-amber-400'
          }`}>
            {item.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full" 
              style={{ width: item.score }}
            ></div>
          </div>
          <span className="text-sm text-cyan-400">{item.score}</span>
        </div>
      </div>
    ))}
  </div>
);

export const TransactionList = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
    <div className="space-y-3">
      {[
        { user: 'Ahmad Hassan', amount: 'RM 9.90', plan: 'PRO Monthly', date: '5 mins ago', status: 'success' },
        { user: 'Fatimah Ali', amount: 'RM 199.00', plan: 'FAMILY Yearly', date: '1 hour ago', status: 'success' },
        { user: 'Ali Rahman', amount: 'RM 9.90', plan: 'PRO Monthly', date: '2 hours ago', status: 'failed' },
      ].map((tx, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <p className="font-medium mb-1">{tx.user}</p>
            <p className="text-sm text-gray-400">{tx.plan} • {tx.date}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{tx.amount}</p>
            <span className={`text-xs ${
              tx.status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ModerationQueue = () => (
  <div className="space-y-3">
    {[
      { type: 'Comment', content: 'Inappropriate language in discussion', reporter: 'Auto-mod', time: '10 mins ago', severity: 'high' },
      { type: 'User Report', content: 'User harassment in group chat', reporter: 'User: Ahmad', time: '1 hour ago', severity: 'medium' },
      { type: 'Content', content: 'Questionable religious content', reporter: 'User: Fatimah', time: '3 hours ago', severity: 'low' },
    ].map((item, idx) => (
      <div key={idx} className="p-4 bg-gray-800 rounded-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-400">
                {item.type}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                item.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {item.severity}
              </span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
            <p className="text-sm mb-1">{item.content}</p>
            <p className="text-xs text-gray-400">Reported by: {item.reporter}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm">
            Remove Content
          </button>
          <button className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm">
            Warn User
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
            Dismiss
          </button>
        </div>
      </div>
    ))}
  </div>
);

export const FeatureFlags = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">Feature Flags</h3>
    <div className="space-y-3">
      {[
        { feature: 'AI Chatbot', enabled: true, description: 'AI-powered Q&A system' },
        { feature: 'Family Plans', enabled: true, description: 'Multi-user subscription plans' },
        { feature: 'Marketplace', enabled: false, description: 'Islamic e-commerce platform' },
        { feature: 'Live Streaming', enabled: false, description: 'Live religious sessions' },
      ].map((flag, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <p className="font-medium mb-1">{flag.feature}</p>
            <p className="text-sm text-gray-400">{flag.description}</p>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm ${
            flag.enabled 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
              : 'bg-gray-700 border border-gray-600 text-gray-400'
          }`}>
            {flag.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const SystemAnnouncements = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">System Announcements</h3>
    <div className="space-y-3">
      {[
        { title: 'Scheduled Maintenance', message: 'System upgrade on March 15, 2AM-4AM', type: 'warning', date: '1 day ago' },
        { title: 'New Feature Release', message: 'AI Hallucination Detection now live', type: 'success', date: '3 days ago' },
        { title: 'Security Update', message: 'Enhanced authentication protocols deployed', type: 'info', date: '1 week ago' },
      ].map((announcement, idx) => (
        <div key={idx} className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs ${
              announcement.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
              announcement.type === 'success' ? 'bg-green-500/20 text-green-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {announcement.type}
            </span>
            <span className="text-xs text-gray-500">{announcement.date}</span>
          </div>
          <p className="font-medium mb-1">{announcement.title}</p>
          <p className="text-sm text-gray-400">{announcement.message}</p>
        </div>
      ))}
    </div>
  </div>
);