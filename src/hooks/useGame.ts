import { useState, useCallback } from 'react';
import { gameData, Question } from '@/data/questions';

export type Profile = 'agricultura' | 'industria' | 'abastecimento';
export type Screen =
  | 'splash'
  | 'cadastro'
  | 'home'
  | 'rules'
  | 'question'
  | 'feedback'
  | 'stage-result'
  | 'achievement'
  | 'final';

export interface GameState {
  screen: Screen;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  profile: Profile | null;
  stage: 1 | 2 | 3;
  questionIndex: number;
  score: number;
  stageAnswers: boolean[];
  allStageResults: boolean[][];
  streak: number;
  selectedOption: string | null;
  isAnswered: boolean;
  sealsEarned: string[];
  usedHint: boolean;
  lastAnswerCorrect: boolean | null;
  lastPointsEarned: number;
  lastStreakBonus: number;
}

const POINTS = {
  stage1Correct: 100,
  stage2Correct: 150,
  stage3Correct: 250,
  streak3Bonus: 100,
  streak5Bonus: 200,
};

const initialState: GameState = {
  screen: 'splash',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  profile: null,
  stage: 1,
  questionIndex: 0,
  score: 0,
  stageAnswers: [],
  allStageResults: [],
  streak: 0,
  selectedOption: null,
  isAnswered: false,
  sealsEarned: [],
  usedHint: false,
  lastAnswerCorrect: null,
  lastPointsEarned: 0,
  lastStreakBonus: 0,
};

export function getFinalLevel(score: number, usedHint: boolean) {
  if (score >= 1000 && !usedHint) return 'diamante';
  if (score >= 1000) return 'ouro';
  if (score >= 600) return 'prata';
  return 'bronze';
}

export function getSealName(stage: number, profile: Profile | null): string {
  if (stage === 1) return 'Conhecedor da Outorga';
  if (stage === 2) {
    switch (profile) {
      case 'agricultura': return 'Guardião da Água na Agricultura';
      case 'industria': return 'Guardião da Água na Indústria';
      case 'abastecimento': return 'Guardião do Abastecimento Público';
      default: return 'Guardião da Água';
    }
  }
  return 'Mestre da Outorga em Goiás';
}

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);

  const getCurrentQuestion = useCallback((): Question | null => {
    const { stage, questionIndex, profile } = state;
    if (stage === 1) return gameData.stage1[questionIndex] || null;
    if (!profile) return null;
    if (stage === 2) return gameData.stage2[profile][questionIndex] || null;
    if (stage === 3) return gameData.stage3[profile][questionIndex] || null;
    return null;
  }, [state]);

  const getStageQuestions = useCallback((): Question[] => {
    const { stage, profile } = state;
    if (stage === 1) return gameData.stage1;
    if (!profile) return [];
    if (stage === 2) return gameData.stage2[profile];
    if (stage === 3) return gameData.stage3[profile];
    return [];
  }, [state]);

  const setScreen = (screen: Screen) => setState(s => ({ ...s, screen }));
  const setGuest = (guestName: string, guestEmail: string, guestPhone: string, profile: Profile) =>
    setState(s => ({
      ...s,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      profile,
      screen: 'rules',
    }));
  const setProfile = (profile: Profile) => setState(s => ({ ...s, profile, screen: 'rules' }));
  
  const selectOption = (optionId: string) => {
    if (state.isAnswered) return;
    setState(s => ({ ...s, selectedOption: optionId }));
  };

  const confirmAnswer = () => {
    if (!state.selectedOption) return;
    const question = getCurrentQuestion();
    if (!question) return;

    const isCorrect = state.selectedOption === question.correct;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    
    let points = 0;
    let streakBonus = 0;
    if (isCorrect) {
      points = state.stage === 1 ? POINTS.stage1Correct : state.stage === 2 ? POINTS.stage2Correct : POINTS.stage3Correct;
      if (newStreak >= 5) streakBonus = POINTS.streak5Bonus;
      else if (newStreak >= 3) streakBonus = POINTS.streak3Bonus;
    }

    setState(s => ({
      ...s,
      isAnswered: true,
      lastAnswerCorrect: isCorrect,
      lastPointsEarned: points,
      lastStreakBonus: streakBonus,
      streak: newStreak,
      score: s.score + points + streakBonus,
      stageAnswers: [...s.stageAnswers, isCorrect],
    }));
  };

  const goToFeedback = () => setScreen('feedback');

  const nextQuestion = () => {
    const { questionIndex, stageAnswers, stage, sealsEarned, profile } = state;

    if (questionIndex >= 4) {
      // End of stage
      const correctCount = stageAnswers.filter(Boolean).length;
      const passed = correctCount >= 4;

      setState(s => ({
        ...s,
        screen: 'stage-result',
        allStageResults: [...s.allStageResults, s.stageAnswers],
        selectedOption: null,
        isAnswered: false,
      }));
      return;
    }

    setState(s => ({
      ...s,
      questionIndex: s.questionIndex + 1,
      selectedOption: null,
      isAnswered: false,
      screen: 'question',
    }));
  };

  const advanceStage = () => {
    const correctCount = state.stageAnswers.filter(Boolean).length;
    const passed = correctCount >= 4;

    if (!passed) {
      // Retry stage
      setState(s => ({
        ...s,
        questionIndex: 0,
        stageAnswers: [],
        selectedOption: null,
        isAnswered: false,
        screen: 'question',
      }));
      return;
    }

    // Show achievement
    setState(s => ({
      ...s,
      sealsEarned: [...s.sealsEarned, getSealName(s.stage, s.profile)],
      screen: 'achievement',
    }));
  };

  const continueAfterAchievement = () => {
    if (state.stage >= 3) {
      setScreen('final');
      return;
    }

    setState(s => ({
      ...s,
      stage: (s.stage + 1) as 1 | 2 | 3,
      questionIndex: 0,
      stageAnswers: [],
      selectedOption: null,
      isAnswered: false,
      screen: 'question',
    }));
  };

  const restartGame = () =>
    setState({ ...initialState, screen: 'cadastro', guestName: '', guestEmail: '', guestPhone: '', profile: null });

  const getStageName = (stage: number) => {
    if (stage === 1) return 'Base Comum';
    if (stage === 2) {
      const names: Record<string, string> = {
        agricultura: 'Trilha Agricultura',
        industria: 'Trilha Indústria',
        abastecimento: 'Trilha Abastecimento',
      };
      return names[state.profile || ''] || 'Trilha Especializada';
    }
    return 'Nível Avançado';
  };

  return {
    state,
    getCurrentQuestion,
    getStageQuestions,
    setScreen,
    setGuest,
    setProfile,
    selectOption,
    confirmAnswer,
    goToFeedback,
    nextQuestion,
    advanceStage,
    continueAfterAchievement,
    restartGame,
    getStageName,
  };
}
