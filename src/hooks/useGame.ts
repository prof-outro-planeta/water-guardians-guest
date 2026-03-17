import { useState, useCallback } from 'react';
import { gameData, Question } from '@/data/questions';

export type Profile = 'agricultura' | 'industria' | 'abastecimento';
export type Screen =
  | 'splash'
  | 'cadastro'
  | 'home'
  | 'rules'
  | 'question'
  | 'points-transition'
  | 'feedback'
  | 'game-over'
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
  lives: number;
  /** Option id that was wrong when player got game over; after recovery this option is hidden and question is worth half points. */
  eliminatedOptionForRetry: string | null;
  /** Points earned in the current stage only (for stage bucket). */
  stageScore: number;
}

const POINTS = {
  stage1Correct: 100,
  stage2Correct: 150,
  stage3Correct: 250,
  streak3Bonus: 100,
  streak5Bonus: 200,
};

/** Pontos máximos de referência para encher o balde na tela de transição (5 perguntas × 250 pts estágio 3). */
export const MAX_SCORE_FOR_BUCKET = 5 * POINTS.stage3Correct;

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
  lives: 1,
  eliminatedOptionForRetry: null,
  stageScore: 0,
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

/** Max points possible in a stage (5 questions × points per correct). Used for that stage's bucket. */
export function getStageMaxScore(stage: 1 | 2 | 3): number {
  if (stage === 1) return 5 * POINTS.stage1Correct;
  if (stage === 2) return 5 * POINTS.stage2Correct;
  return 5 * POINTS.stage3Correct;
}

/** Number of visual drops to animate for a given points + streak bonus. */
export function getDropsCount(points: number, streakBonus: number): number {
  const total = points + streakBonus;
  if (total <= 0) return 0;
  return Math.min(10, Math.max(1, Math.ceil(total / 50)));
}

/** Feedback auto-advance delay (ms): decreases as game progresses for faster pace. */
export function getFeedbackDelayMs(questionIndex: number, stage: number): number {
  const progress = questionIndex + (stage - 1) * 5;
  return Math.max(2000, 4000 - progress * 350);
}

/** Points transition screen duration (ms): decreases as game progresses. */
export function getPointsTransitionDurationMs(questionIndex: number, stage: number): number {
  const progress = questionIndex + (stage - 1) * 5;
  return Math.max(1200, 2300 - progress * 150);
}

/** Delay after bucket water rise before going to transition (ms). */
export function getWaterRiseCompleteDelayMs(questionIndex: number, stage: number): number {
  const progress = questionIndex + (stage - 1) * 5;
  return Math.max(350, 650 - progress * 40);
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

  /** Returns true if game over was triggered (caller should not navigate to feedback). */
  const confirmAnswer = (): boolean => {
    if (!state.selectedOption) return false;
    const question = getCurrentQuestion();
    if (!question) return false;

    const isCorrect = state.selectedOption === question.correct;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newLives = isCorrect ? state.lives : state.lives - 1;

    if (!isCorrect && newLives < 0) {
      // Second error: game over. Add this wrong answer to stageAnswers and go to game-over screen.
      setState(s => ({
        ...s,
        isAnswered: true,
        lastAnswerCorrect: false,
        lastPointsEarned: 0,
        lastStreakBonus: 0,
        streak: 0,
        lives: 0,
        stageAnswers: [...s.stageAnswers, false],
        screen: 'game-over',
      }));
      return true;
    }

    let points = 0;
    let streakBonus = 0;
    if (isCorrect) {
      points = state.stage === 1 ? POINTS.stage1Correct : state.stage === 2 ? POINTS.stage2Correct : POINTS.stage3Correct;
      if (state.eliminatedOptionForRetry) {
        points = Math.floor(points / 2);
      }
      if (newStreak >= 5) streakBonus = POINTS.streak5Bonus;
      else if (newStreak >= 3) streakBonus = POINTS.streak3Bonus;
    }

    const pointsEarned = points + streakBonus;
    setState(s => ({
      ...s,
      isAnswered: true,
      lastAnswerCorrect: isCorrect,
      lastPointsEarned: points,
      lastStreakBonus: streakBonus,
      streak: newStreak,
      lives: newLives,
      eliminatedOptionForRetry: null,
      score: s.score + pointsEarned,
      stageScore: isCorrect ? s.stageScore + pointsEarned : s.stageScore,
      stageAnswers: [...s.stageAnswers, isCorrect],
    }));
    return false;
  };

  const goToFeedback = () => setScreen('feedback');

  const nextQuestion = () => {
    const { questionIndex, stageAnswers, stage, sealsEarned, profile } = state;

    if (questionIndex >= 4) {
      // Só finaliza a etapa se já temos 5 respostas (evita finalizar após recuperar vida na pergunta 5)
      if (stageAnswers.length < 5) {
        return;
      }
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
        stageScore: 0,
        selectedOption: null,
        isAnswered: false,
        lives: 1,
        eliminatedOptionForRetry: null,
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
      stageScore: 0,
      selectedOption: null,
      isAnswered: false,
      lives: 1,
      eliminatedOptionForRetry: null,
      screen: 'question',
    }));
  };

  const recoverLifeAndRetryQuestion = () => {
    setState(s => {
      const newStageAnswers = s.stageAnswers.slice(0, -1);
      return {
        ...s,
        lives: 1,
        selectedOption: null,
        isAnswered: false,
        stageAnswers: newStageAnswers,
        eliminatedOptionForRetry: s.selectedOption,
        screen: 'question',
        // Manter o mesmo questionIndex (voltar para a mesma pergunta, inclusive a 5)
        questionIndex: s.questionIndex,
      };
    });
  };

  const giveUpFromGameOver = () => {
    setState(s => {
      // Pad stageAnswers to 5 so StageResultScreen shows full result (game over = failed stage)
      const padded = [...s.stageAnswers];
      while (padded.length < 5) padded.push(false);
      const stageAnswersForResult = padded.slice(0, 5);
      return {
        ...s,
        screen: 'stage-result',
        stageAnswers: stageAnswersForResult,
        allStageResults: [...s.allStageResults, stageAnswersForResult],
        selectedOption: null,
        isAnswered: false,
      };
    });
  };

  /** Reinicia o jogo para uma nova pessoa — volta ao cadastro. */
  const restartGame = () =>
    setState({ ...initialState, screen: 'cadastro', guestName: '', guestEmail: '', guestPhone: '', profile: null, stageScore: 0 });

  /** Reinicia o jogo mantendo o mesmo usuário — volta às regras para jogar de novo. */
  const restartSameGuest = () =>
    setState(s => ({
      ...initialState,
      screen: 'rules',
      guestName: s.guestName,
      guestEmail: s.guestEmail,
      guestPhone: s.guestPhone,
      profile: s.profile,
      stageScore: 0,
    }));

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
    recoverLifeAndRetryQuestion,
    giveUpFromGameOver,
    restartGame,
    restartSameGuest,
    getStageName,
  };
}
