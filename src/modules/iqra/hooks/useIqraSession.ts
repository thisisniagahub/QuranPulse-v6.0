import { useState, useCallback } from 'react';
import { getCurriculumForVolume } from '../data/master-curriculum';
import { getStrictPageData } from '../data/strict-loader';
import { IqraLesson } from '../types';
import { IQRA_CONFIG } from '../constants';
import { IqraService } from '../../../services/iqraService';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

export const useIqraSession = (volume: number, initialPageIndex: number = 0) => {
  const { playTrack } = useAudioPlayer();

  // Load Data
  const curriculumData = getCurriculumForVolume(volume);
  const lessons = curriculumData.lessons;

  // State
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialPageIndex);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showResult, setShowResult] = useState<'success' | 'fail' | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');

  // Derived State
  const currentLesson: IqraLesson | undefined = lessons[currentLessonIndex];
  const rawPageData = currentLesson ? getStrictPageData(volume, currentLesson.pageRef) : null;
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === lessons.length - 1;

  // Actions
  const nextLesson = useCallback(() => {
    if (!isLastLesson) {
      setLessonStarted(false);
      setShowResult(null);
      setAiFeedback('');
      setCurrentLessonIndex((prev) => prev + 1);
    }
  }, [isLastLesson]);

  const prevLesson = useCallback(() => {
    if (!isFirstLesson) {
      setLessonStarted(false);
      setShowResult(null);
      setAiFeedback('');
      setCurrentLessonIndex((prev) => prev - 1);
    }
  }, [isFirstLesson]);

  const toggleTips = useCallback(() => setShowTips((prev) => !prev), []);

  const startLesson = useCallback(() => setLessonStarted(true), []);

  const resetResult = useCallback(() => {
    setShowResult(null);
    setAiFeedback('');
  }, []);

  // Phonemic Modeling (Audio Playback)
  const playRef = useCallback((text: string) => {
    // Clean text: Remove Harakat
    const baseChar = text.replace(/[\u064B-\u065F\u0670]/g, "").charAt(0);

    const audioMap: Record<string, string> = {
      'ا': 'alif', 'أ': 'alif', 'إ': 'alif', 'آ': 'alif', 'ء': 'alif',
      'ب': 'ba', 'ت': 'ta', 'ث': 'tsa', 'ج': 'jim', 'ح': 'ha', 'خ': 'kho',
      'د': 'dal', 'ذ': 'dzal', 'ر': 'ro', 'ز': 'zai', 'س': 'sin', 'ش': 'syin',
      'ص': 'sod', 'ض': 'dhod', 'ط': 'tho', 'ظ': 'zho', 'ع': 'ain', 'غ': 'ghain',
      'ف': 'fa', 'ق': 'qof', 'ك': 'kaf', 'ل': 'lam', 'م': 'mim', 'ن': 'nun',
      'و': 'wau', 'ه': 'haa', 'هـ': 'haa', 'ي': 'ya', 'ى': 'ya'
    };

    const filename = audioMap[baseChar];
    if (!filename) return;

    const audioPath = `/audio/hijaiyah/${filename}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(e => console.error(`[Audio] Failed to play ${filename}.mp3`, e));
  }, []);

  const evaluatePerformance = useCallback(async (confidence: number, feedback?: string) => {
    const requiredScore = (currentLesson?.assessment.passingScore || IQRA_CONFIG.DEFAULT_PASSING_SCORE) / 100;
    const passed = confidence >= requiredScore;

    setAiFeedback(feedback || (passed ? 'Bacaan bagus!' : 'Sila cuba lagi.'));
    setShowResult(passed ? 'success' : 'fail');

    if (passed && currentLesson) {
      const score = Math.round(confidence * 100);
      await IqraService.saveProgress(volume, currentLesson.id, score);
    }

    return passed;
  }, [currentLesson, volume]);

  return {
    currentLesson,
    rawPageData,
    lessonStarted,
    showTips,
    showResult,
    aiFeedback,
    isFirstLesson,
    isLastLesson,
    nextLesson,
    prevLesson,
    toggleTips,
    startLesson,
    resetResult,
    evaluatePerformance,
    playRef
  };
};