'use client';

import React, { useState } from 'react';
import { BarChart3, Users, Brain, Shield, DollarSign, Settings, BookOpen, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, MoreVertical, Download, Upload, Eye, Ban, RefreshCw, Hash, Bell, Gift, Award, ShoppingBag, Heart, Tv, Headphones, Mail, Lock, Activity, Calendar, FileText, AlertTriangle, Zap, Database, Key, Server } from 'lucide-react';

// Import all views
import {
  OverviewView,
  AnalyticsView,
  UsersView,
  GamificationView,
  FamilyView,
  SouqView,
  BarakahView,
  ModerationView,
  MultimediaView,
  SystemView
} from './views';

import {
  ContentView,
  AIMonitoringView,
  ComplianceView,
  SubscriptionsView,
  SupportView,
  SecurityView
} from './sub-views';

const QuranPulseAdmin = () => {
  const [activeView, setActiveView] = useState('overview');
  const [activeSubView, setActiveSubView] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { 
      id: 'content', 
      label: 'Content CMS', 
      icon: BookOpen,
      subItems: ['doa', 'quran', 'iqra', 'tafsir', 'integrity']
    },
    { 
      id: 'ai', 
      label: 'AI Monitoring', 
      icon: Brain,
      subItems: ['conversations', 'hallucinations', 'usage', 'keys']
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      icon: Shield,
      subItems: ['jakim', 'review', 'halal']
    },
    { 
      id: 'subscriptions', 
      label: 'Subscriptions', 
      icon: DollarSign,
      subItems: ['overview', 'refunds', 'promos']
    },
    { id: 'gamification', label: 'Gamification', icon: Award },
    { id: 'family', label: 'Family Plans', icon: Users },
    { id: 'souq', label: 'Marketplace', icon: ShoppingBag },
    { id: 'barakah', label: 'Barakah', icon: Heart },
    { id: 'moderation', label: 'Moderation', icon: MessageSquare },
    { id: 'multimedia', label: 'Multimedia', icon: Tv },
    { id: 'support', label: 'Support', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Settings },
  ];

  const renderView = () => {
    switch(activeView) {
      case 'overview': return <OverviewView />;
      case 'analytics': return <AnalyticsView />;
      case 'users': return <UsersView />;
      case 'content': return <ContentView subView={activeSubView} />;
      case 'ai': return <AIMonitoringView subView={activeSubView} />;
      case 'compliance': return <ComplianceView subView={activeSubView} />;
      case 'subscriptions': return <SubscriptionsView subView={activeSubView} />;
      case 'gamification': return <GamificationView />;
      case 'family': return <FamilyView />;
      case 'souq': return <SouqView />;
      case 'barakah': return <BarakahView />;
      case 'moderation': return <ModerationView />;
      case 'multimedia': return <MultimediaView />;
      case 'support': return <SupportView />;
      case 'security': return <SecurityView />;
      case 'system': return <SystemView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-cyan-500/20 transition-all duration-300 flex flex-col overflow-y-auto`}>
        <div className="h-16 flex items-center justify-center border-b border-cyan-500/20 gap-3 sticky top-0 bg-gray-900 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">Q</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-sm font-bold">QuranPulse</div>
              <div className="text-xs text-gray-400">Admin v6.0</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setActiveView(item.id);
                    setActiveSubView(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
                {!sidebarCollapsed && isActive && item.subItems && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setActiveSubView(sub)}
                        className={`w-full text-left px-4 py-2 rounded text-sm ${
                          activeSubView === sub ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-12 border-t border-cyan-500/20 text-gray-400 hover:text-white transition-colors sticky bottom-0 bg-gray-900 flex items-center justify-center"
        >
          <RefreshCw size={18} className={sidebarCollapsed ? '' : 'rotate-180'} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-cyan-500/20 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold">{navItems.find(i => i.id === activeView)?.label}</h1>
            <p className="text-xs text-gray-400">Complete Admin Control Center</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-800 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">All Systems Online</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default QuranPulseAdmin;