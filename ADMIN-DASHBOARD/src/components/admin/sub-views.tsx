import React, { useState } from 'react';
import { BookOpen, Hash, CheckCircle, AlertTriangle, RefreshCw, FileText, Brain, Clock, Key, AlertCircle, Shield, DollarSign, Gift, Users, Award, ShoppingBag, Heart, MessageSquare, Tv, Headphones, Mail, Lock, Activity, Calendar, Search, Filter, MoreVertical, Download, Upload, Eye, Ban, TrendingUp } from 'lucide-react';
import { StatCard, ContentCard, ChartCard, MetricCard, MetricBox, TierCard, TransactionList, ScholarQueue, ComplianceGrid, ContentList } from './ui-components';

// Content View with Sub-Views
export const ContentView = ({ subView }) => {
  if (!subView) return <ContentOverview />;
  
  switch(subView) {
    case 'doa': return <DoaManager />;
    case 'quran': return <QuranManager />;
    case 'iqra': return <IqraManager />;
    case 'tafsir': return <TafsirManager />;
    case 'integrity': return <IntegrityChecker />;
    default: return <ContentOverview />;
  }
};

const ContentOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ContentCard title="Doa & Zikir" count={124} icon={BookOpen} onClick={() => {}} />
      <ContentCard title="Quran Pages" count={604} icon={BookOpen} onClick={() => {}} />
      <ContentCard title="Iqra Lessons" count={180} icon={BookOpen} onClick={() => {}} />
      <ContentCard title="Tafsir Entries" count={456} icon={BookOpen} onClick={() => {}} />
    </div>

    <ContentList />
  </div>
);

// Integrity Checker (NEW - P0)
const IntegrityChecker = () => (
  <div className="space-y-6">
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1">SHA-256 Integrity Verification</h3>
          <p className="text-sm text-gray-400">Ensure Quran text authenticity</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
          <RefreshCw size={16} />
          Run Full Check
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Files" value="604" icon={FileText} color="blue" />
        <StatCard title="Verified" value="604" icon={CheckCircle} color="green" />
        <StatCard title="Corrupted" value="0" icon={AlertTriangle} color="red" />
      </div>

      <div className="space-y-3">
        {[
          { file: 'surah_001.json', hash: 'a3f2e9...', status: 'verified', lastCheck: '2 mins ago' },
          { file: 'surah_002.json', hash: 'b7d4c1...', status: 'verified', lastCheck: '2 mins ago' },
          { file: 'surah_003.json', hash: 'e9a1f3...', status: 'verified', lastCheck: '2 mins ago' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Hash size={20} className="text-cyan-400" />
              <div>
                <p className="font-medium font-mono text-sm">{item.file}</p>
                <p className="text-xs text-gray-400 font-mono">{item.hash}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{item.lastCheck}</span>
              <CheckCircle size={18} className="text-green-400" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Integrity History</h3>
      <ChartCard title="Daily Verification Status" subtitle="Last 30 days" />
    </div>
  </div>
);

const DoaManager = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">Doa & Zikir Management</h3>
      <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">Add New Doa</button>
    </div>
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <p className="text-gray-400">Doa management interface - Total: 124 entries</p>
    </div>
  </div>
);

const QuranManager = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">Quran Content Management</h3>
      <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">Add Surah</button>
    </div>
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <p className="text-gray-400">Quran management interface - Total: 604 pages</p>
    </div>
  </div>
);

const IqraManager = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">Iqra Lessons Management</h3>
      <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">Add Lesson</button>
    </div>
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <p className="text-gray-400">Iqra management interface - Total: 180 lessons</p>
    </div>
  </div>
);

const TafsirManager = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">Tafsir Management</h3>
      <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">Add Tafsir</button>
    </div>
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <p className="text-gray-400">Tafsir management interface - Total: 456 entries</p>
    </div>
  </div>
);

// AI Monitoring with Sub-Views
export const AIMonitoringView = ({ subView }) => {
  if (!subView) return <AIOverview />;
  
  switch(subView) {
    case 'conversations': return <ConversationLogs />;
    case 'hallucinations': return <HallucinationWatch />;
    case 'usage': return <APIUsage />;
    case 'keys': return <KeyRotation />;
    default: return <AIOverview />;
  }
};

const AIOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="API Calls Today" value="3,247" icon={Brain} color="purple" />
      <StatCard title="Avg Response Time" value="1.8s" icon={Clock} color="blue" />
      <StatCard title="Flagged Responses" value="12" icon={AlertCircle} color="amber" />
      <StatCard title="Accuracy Score" value="87%" icon={CheckCircle} color="green" />
    </div>
    <ConversationLogs />
    <KeyRotation />
  </div>
);

// Hallucination Watch (NEW - P0)
const HallucinationWatch = () => (
  <div className="space-y-6">
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={24} />
            Hallucination Detection Queue
          </h3>
          <p className="text-sm text-gray-400">AI responses flagged by users or system</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">All</button>
          <button className="px-4 py-2 bg-amber-500/20 rounded-lg text-sm text-amber-400">High Priority</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Resolved</button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { 
            question: 'Bolehkah makan udang?',
            aiAnswer: 'Udang adalah halal mengikut mazhab Shafie...',
            issue: 'Missing dalil citation',
            reporter: 'System Auto-Flag',
            severity: 'high',
            time: '15 mins ago'
          },
          { 
            question: 'Cara solat istikharah?',
            aiAnswer: 'Solat istikharah dilakukan dengan...',
            issue: 'Incomplete rukun explanation',
            reporter: 'User: Ahmad',
            severity: 'medium',
            time: '1 hour ago'
          },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <p className="font-medium mb-2">Q: {item.question}</p>
                <p className="text-sm text-gray-400 mb-2 italic">"{item.aiAnswer}"</p>
                <div className="flex items-center gap-2 text-xs">
                  <AlertCircle size={14} className="text-amber-400" />
                  <span className="text-amber-400">Issue: {item.issue}</span>
                  <span className="text-gray-500">• Reported by: {item.reporter}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm">
                Override & Correct
              </button>
              <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm">
                Mark Safe
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
                View Full Context
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConversationLogs = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">Recent AI Conversations</h3>
    <div className="space-y-3">
      {[
        { question: 'Hukum menjual haiwan peliharaan?', status: 'safe', user: 'Ahmad', time: '5 mins ago' },
        { question: 'Bagaimana cara solat jenazah?', status: 'safe', user: 'Fatimah', time: '12 mins ago' },
        { question: 'Bolehkah trade forex?', status: 'flagged', user: 'Ali', time: '25 mins ago' },
      ].map((conv, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <p className="font-medium mb-1">{conv.question}</p>
            <p className="text-xs text-gray-400">User: {conv.user} • {conv.time}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs ${
              conv.status === 'flagged' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {conv.status}
            </span>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <Eye size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KeyRotation = () => (
  <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
    <h3 className="text-lg font-bold mb-4">API Key Rotation Status</h3>
    <div className="space-y-3">
      {[
        { key: 'Zhipu Key #1', usage: '4,200 / 5,000', status: 'active' },
        { key: 'Zhipu Key #2', usage: '2,100 / 5,000', status: 'standby' },
        { key: 'Zhipu Key #3', usage: '890 / 5,000', status: 'standby' },
      ].map((key, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <p className="font-medium mb-2">{key.key}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full" 
                  style={{ width: `${(parseInt(key.usage.split('/')[0].trim()) / parseInt(key.usage.split('/')[1].trim())) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">{key.usage}</span>
            </div>
          </div>
          <span className={`ml-4 px-3 py-1 rounded-full text-xs ${
            key.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}>
            {key.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const APIUsage = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Daily Calls" value="3,247" icon={Brain} color="purple" />
      <StatCard title="Cost Today" value="$12.50" icon={DollarSign} color="green" />
      <StatCard title="Avg Latency" value="1.8s" icon={Clock} color="blue" />
    </div>
    <ChartCard title="API Usage Trends" subtitle="Last 30 days" />
  </div>
);

// Compliance View
export const ComplianceView = ({ subView }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Pending Reviews" value="23" icon={Clock} color="amber" />
      <StatCard title="Approved This Week" value="67" icon={CheckCircle} color="green" />
      <StatCard title="Compliance Score" value="94%" icon={Shield} color="cyan" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Scholar Review Queue</h3>
      <ScholarQueue />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">JAKIM Compliance Status</h3>
      <ComplianceGrid />
    </div>
  </div>
);

// Subscriptions View
export const SubscriptionsView = ({ subView }) => {
  if (subView === 'refunds') return <RefundHandler />;
  if (subView === 'promos') return <PromoManager />;
  
  return <SubscriptionsOverview />;
};

const SubscriptionsOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="MRR" value="RM 52,430" icon={DollarSign} color="green" />
      <StatCard title="Active Subs" value="5,643" icon={Users} color="cyan" />
      <StatCard title="Churn Rate" value="3.2%" icon={TrendingUp} color="amber" />
      <StatCard title="ARPU" value="RM 9.29" icon={DollarSign} color="blue" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Subscription Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TierCard tier="FREE" count="4,604" percentage="45%" color="gray" />
        <TierCard tier="PRO" count="4,123" percentage="40%" color="cyan" />
        <TierCard tier="FAMILY" count="1,520" percentage="15%" color="purple" />
      </div>
    </div>

    <TransactionList />
  </div>
);

// Refund Handler (NEW - P1)
const RefundHandler = () => (
  <div className="space-y-6">
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1">Refund Management</h3>
          <p className="text-sm text-gray-400">Process refunds & handle disputes</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Pending</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Approved</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Rejected</button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { user: 'Ahmad Hassan', plan: 'PRO Monthly', amount: 'RM 9.90', reason: 'Not satisfied with AI accuracy', date: '2 hours ago', status: 'pending' },
          { user: 'Siti Aminah', plan: 'FAMILY Yearly', amount: 'RM 199.00', reason: 'Duplicate charge', date: '1 day ago', status: 'pending' },
        ].map((refund, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium mb-1">{refund.user}</p>
                <p className="text-sm text-gray-400">{refund.plan} • {refund.amount}</p>
                <p className="text-sm text-gray-500 mt-1">Reason: {refund.reason}</p>
                <p className="text-xs text-gray-600 mt-1">{refund.date}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                {refund.status}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400">
                Approve Refund
              </button>
              <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400">
                Reject
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
                Contact User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Promo Manager (NEW - P1)
const PromoManager = () => (
  <div className="space-y-6">
    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Promo Codes</h3>
        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-2">
          <Gift size={16} />
          Create New
        </button>
      </div>

      <div className="space-y-3">
        {[
          { code: 'RAMADAN2025', discount: '50%', used: '234 / 1000', expires: 'Mar 30, 2025', active: true },
          { code: 'NEWUSER20', discount: '20%', used: '567 / ∞', expires: 'Dec 31, 2025', active: true },
          { code: 'FAMILYDEAL', discount: 'RM 30 OFF', used: '89 / 500', expires: 'Jan 15, 2025', active: false },
        ].map((promo, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <code className="px-3 py-1 bg-gray-900 rounded font-mono text-cyan-400 text-sm">{promo.code}</code>
                <span className="text-sm font-medium text-gray-300">{promo.discount}</span>
                {promo.active && (
                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Active</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Used: {promo.used}</span>
                <span>Expires: {promo.expires}</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Support/Ticketing View (NEW - P1)
export const SupportView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Open Tickets" value="23" icon={Mail} color="blue" />
      <StatCard title="Avg Response" value="2.4 hrs" icon={Clock} color="green" />
      <StatCard title="Resolved Today" value="15" icon={CheckCircle} color="cyan" />
      <StatCard title="Satisfaction" value="4.8/5" icon={Award} color="amber" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Support Tickets</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-500/20 rounded-lg text-sm">Urgent</button>
          <button className="px-4 py-2 bg-amber-500/20 rounded-lg text-sm">Open</button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Resolved</button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { id: '#1234', user: 'Ahmad Hassan', subject: 'Cannot login to account', priority: 'urgent', time: '30 mins ago', status: 'open' },
          { id: '#1233', user: 'Fatimah Ali', subject: 'Subscription not activated', priority: 'high', time: '2 hours ago', status: 'open' },
          { id: '#1232', user: 'Ali Rahman', subject: 'Audio not playing', priority: 'normal', time: '5 hours ago', status: 'in-progress' },
        ].map((ticket, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs text-gray-500">{ticket.id}</code>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    ticket.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-gray-500">{ticket.time}</span>
                </div>
                <p className="font-medium mb-1">{ticket.subject}</p>
                <p className="text-sm text-gray-400">From: {ticket.user}</p>
              </div>
              <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">Knowledge Base Articles</h3>
      <button className="w-full px-4 py-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
        <p className="font-medium mb-1">How to reset your password</p>
        <p className="text-sm text-gray-400">Viewed 234 times</p>
      </button>
    </div>
  </div>
);

// Security/Audit View (NEW - P0)
export const SecurityView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Failed Logins" value="23" icon={Lock} color="red" />
      <StatCard title="Active Sessions" value="1,234" icon={Activity} color="green" />
      <StatCard title="Blocked IPs" value="5" icon={Ban} color="amber" />
      <StatCard title="Audit Logs" value="5,678" icon={FileText} color="blue" />
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Admin Audit Trail</h3>
        <div className="flex gap-2">
          <input
            type="date"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <button className="px-4 py-2 bg-gray-800 rounded-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { admin: 'Admin: Fatimah', action: 'Banned user', target: 'user_12345', time: '10 mins ago', ip: '192.168.1.100' },
          { admin: 'Admin: Ahmad', action: 'Updated content', target: 'doa_456', time: '1 hour ago', ip: '192.168.1.101' },
          { admin: 'Super Admin: Ali', action: 'Changed system settings', target: 'maintenance_mode', time: '3 hours ago', ip: '192.168.1.102' },
        ].map((log, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg font-mono text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-cyan-400" />
                <div>
                  <p className="text-gray-300">{log.admin} <span className="text-cyan-400">{log.action}</span></p>
                  <p className="text-gray-500 text-xs mt-1">Target: {log.target} • IP: {log.ip}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900 rounded-lg border border-cyan-500/20 p-6">
      <h3 className="text-lg font-bold mb-4">IP Blocklist</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter IP address to block..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
          Block IP
        </button>
      </div>
      <div className="space-y-2">
        {['192.168.1.50', '10.0.0.25', '172.16.0.100'].map((ip, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <code className="text-sm">{ip}</code>
            <button className="text-sm text-red-400 hover:text-red-300">Unblock</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);