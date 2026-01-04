import { useState, useCallback, useEffect } from 'react';
import { getCurriculumForVolume } from '../data/master-curriculum';
import { getStrictPageData } from '../data/strict-loader';
import { IqraLesson } from '../types';
import { IQRA_CONFIG } from '../constants';
import { IqraService } from '../../services/iqraService';

export const useIqraSession = (volume: number) => {
  // Load Data
  const curriculumData = getCurriculumForVolume(volume);
  const lessons = curriculumData.lessons;

  // State
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showResult, setShowResult] = useState<'success' | 'fail' | null>(null);

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
      setCurrentLessonIndex((prev) => prev + 1);
    }
  }, [isLastLesson]);

  const prevLesson = useCallback(() => {
    if (!isFirstLesson) {
      setLessonStarted(false);
      setShowResult(null);
      setCurrentLessonIndex((prev) => prev - 1);
    }
  }, [isFirstLesson]);

  const toggleTips = useCallback(() => setShowTips((prev) => !prev), []);

  const startLesson = useCallback(() => setLessonStarted(true), []);

  const resetResult = useCallback(() => setShowResult(null), []);

  const evaluatePerformance = useCallback(async (confidence: number) => {
    // Logic: Convert confidence (0-1) to Percentage and compare with lesson requirement
    const requiredScore = (currentLesson?.assessment.passingScore || IQRA_CONFIG.DEFAULT_PASSING_SCORE) / 100;
    
    const passed = confidence >= requiredScore;
    
    setShowResult(passed ? 'success' : 'fail');

    if (passed && currentLesson) {
        // Save to Database
        const score = Math.round(confidence * 100);
        await IqraService.saveProgress(volume, currentLesson.id, score);
    }

    return passed;
  }, [currentLesson, volume]);

  return {
    // Data
    currentLesson,
    rawPageData,
    
    // State Flags
    lessonStarted,
    showTips,
    showResult,
    isFirstLesson,
    isLastLesson,

    // Actions
    nextLesson,
    prevLesson,
    toggleTips,
    startLesson,
    resetResult,
    evaluatePerformance
  };
};
