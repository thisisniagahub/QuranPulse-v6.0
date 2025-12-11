/**
 * 📊 QuranPulse Analytics System
 * 
 * Custom event tracking for Quran features
 * Tracks user engagement, feature usage, and learning progress
 */

import { PerformanceMonitor, addBreadcrumb } from './monitoring';

// =====================================
// TYPES
// =====================================

interface QuranEvent {
  category: 'quran' | 'iqra' | 'ibadah' | 'navigation' | 'user' | 'tts';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

interface SessionData {
  startTime: number;
  pageViews: number;
  events: QuranEvent[];
  versesRead: Set<string>;
  surahsVisited: Set<number>;
}

// =====================================
// SESSION TRACKING
// =====================================

class AnalyticsSession {
  private data: SessionData = {
    startTime: Date.now(),
    pageViews: 0,
    events: [],
    versesRead: new Set(),
    surahsVisited: new Set(),
  };
  
  addEvent(event: QuranEvent) {
    this.data.events.push(event);
  }
  
  addPageView() {
    this.data.pageViews++;
  }
  
  markVerseRead(verseKey: string) {
    this.data.versesRead.add(verseKey);
  }
  
  markSurahVisited(surahId: number) {
    this.data.surahsVisited.add(surahId);
  }
  
  getSummary() {
    return {
      duration: Date.now() - this.data.startTime,
      pageViews: this.data.pageViews,
      eventsCount: this.data.events.length,
      versesRead: this.data.versesRead.size,
      surahsVisited: this.data.surahsVisited.size,
    };
  }
}

// Global session
const session = new AnalyticsSession();

// =====================================
// ANALYTICS CLASS
// =====================================

export class Analytics {
  
  // ===== QURAN EVENTS =====
  
  static trackVerseRead(surahId: number, ayahNumber: number) {
    const verseKey = `${surahId}:${ayahNumber}`;
    session.markVerseRead(verseKey);
    session.markSurahVisited(surahId);
    
    this.track({
      category: 'quran',
      action: 'verse_read',
      label: verseKey,
      metadata: { surahId, ayahNumber },
    });
  }
  
  static trackAudioPlay(surahId: number, ayahNumber: number, reciterId: number) {
    this.track({
      category: 'quran',
      action: 'audio_play',
      label: `${surahId}:${ayahNumber}`,
      metadata: { surahId, ayahNumber, reciterId },
    });
  }
  
  static trackBookmark(surahId: number, ayahNumber: number) {
    this.track({
      category: 'quran',
      action: 'bookmark',
      label: `${surahId}:${ayahNumber}`,
    });
  }
  
  static trackSurahComplete(surahId: number, durationMs: number) {
    this.track({
      category: 'quran',
      action: 'surah_complete',
      label: `Surah ${surahId}`,
      value: durationMs,
    });
    
    PerformanceMonitor.trackMetric('surah.reading_time', durationMs, 'ms');
  }
  
  // ===== TTS EVENTS =====
  
  static trackRumiTTSPlay(text: string, verseKey?: string) {
    this.track({
      category: 'tts',
      action: 'rumi_play',
      label: verseKey,
      metadata: { textLength: text.length },
    });
  }
  
  static trackRumiTTSWordClick(word: string, index: number) {
    this.track({
      category: 'tts',
      action: 'word_click',
      label: word,
      value: index,
    });
  }
  
  static trackPracticeMode(surahId: number, ayahNumber: number, repeatCount: number) {
    this.track({
      category: 'tts',
      action: 'practice_mode',
      label: `${surahId}:${ayahNumber}`,
      value: repeatCount,
    });
  }
  
  // ===== IQRA EVENTS =====
  
  static trackIqraPageComplete(jilid: number, page: number, score: number) {
    this.track({
      category: 'iqra',
      action: 'page_complete',
      label: `Jilid ${jilid} Page ${page}`,
      value: score,
    });
  }
  
  static trackIqraLetterPractice(letter: string, correct: boolean) {
    this.track({
      category: 'iqra',
      action: correct ? 'letter_correct' : 'letter_incorrect',
      label: letter,
    });
  }
  
  // ===== IBADAH EVENTS =====
  
  static trackPrayerLogged(prayer: string, onTime: boolean) {
    this.track({
      category: 'ibadah',
      action: 'prayer_logged',
      label: prayer,
      value: onTime ? 1 : 0,
    });
  }
  
  static trackDzikirComplete(type: string, count: number) {
    this.track({
      category: 'ibadah',
      action: 'dzikir_complete',
      label: type,
      value: count,
    });
  }
  
  // ===== NAVIGATION EVENTS =====
  
  static trackPageView(pageName: string) {
    session.addPageView();
    
    this.track({
      category: 'navigation',
      action: 'page_view',
      label: pageName,
    });
    
    addBreadcrumb('navigation', `Viewed ${pageName}`);
  }
  
  static trackFeatureUsed(featureName: string) {
    this.track({
      category: 'navigation',
      action: 'feature_used',
      label: featureName,
    });
  }
  
  // ===== USER EVENTS =====
  
  static trackSignUp(method: 'email' | 'google' | 'facebook') {
    this.track({
      category: 'user',
      action: 'sign_up',
      label: method,
    });
  }
  
  static trackLogin(method: 'email' | 'google' | 'facebook') {
    this.track({
      category: 'user',
      action: 'login',
      label: method,
    });
  }
  
  static trackSubscription(tier: 'free' | 'premium' | 'family') {
    this.track({
      category: 'user',
      action: 'subscription',
      label: tier,
    });
  }
  
  // ===== CORE TRACKING =====
  
  private static track(event: QuranEvent) {
    session.addEvent(event);
    
    // Log to console in dev
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${event.category}/${event.action}`, event.label || '', event.metadata || '');
    }
    
    // Add as breadcrumb for Sentry
    addBreadcrumb(event.category, `${event.action}: ${event.label || ''}`, event.metadata);
    
    // Send to external analytics (if configured)
    this.sendToExternalAnalytics(event);
  }
  
  private static sendToExternalAnalytics(event: QuranEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
    
    // Future: PostHog, Mixpanel, etc.
  }
  
  // ===== SESSION SUMMARY =====
  
  static getSessionSummary() {
    return session.getSummary();
  }
  
  static logSessionEnd() {
    const summary = session.getSummary();
    
    console.log('[Analytics] Session Summary:', summary);
    
    // Track session metrics
    PerformanceMonitor.trackMetric('session.duration', summary.duration, 'ms');
    PerformanceMonitor.trackMetric('session.verses_read', summary.versesRead, 'count');
    PerformanceMonitor.trackMetric('session.surahs_visited', summary.surahsVisited, 'count');
  }
}

// =====================================
// AUTO-INIT
// =====================================

// Track session end on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    Analytics.logSessionEnd();
  });
}

export default Analytics;
