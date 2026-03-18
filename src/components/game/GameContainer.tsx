import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame, getStageMaxScore } from '@/hooks/useGame';
import WaterBackground from './WaterBackground';
import SplashScreen from './SplashScreen';
import CadastroScreen from './CadastroScreen';
import HomeScreen from './HomeScreen';
import RulesScreen from './RulesScreen';
import QuestionScreen from './QuestionScreen';
import PointsTransitionScreen from './PointsTransitionScreen';
import FeedbackScreen from './FeedbackScreen';
import GameOverScreen from './GameOverScreen';
import StageResultScreen from './StageResultScreen';
import AchievementScreen from './AchievementScreen';
import FinalScreen from './FinalScreen';

const GameContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    state,
    getCurrentQuestion,
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
  } = useGame();

  // Scale totem to fit viewport: use full width so it's easy to view on desktop
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const vw = window.innerWidth;
      const scale = vw / 1080;
      containerRef.current.style.setProperty('--totem-scale', String(scale));
      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.transformOrigin = 'top center';
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Handle answer confirmation: correct → drops animate then callback; wrong → go to feedback after delay
  const handleConfirm = useCallback(() => {
    const isGameOver = confirmAnswer();
    if (isGameOver) return;
    const question = getCurrentQuestion();
    const isCorrect = question != null && state.selectedOption === question.correct;
    if (!isCorrect) {
      setTimeout(() => goToFeedback(), 1500);
    }
    // If correct, QuestionScreen runs drop animation and calls onPointsAnimationComplete → points-transition → feedback
  }, [confirmAnswer, goToFeedback, getCurrentQuestion, state.selectedOption]);

  const question = getCurrentQuestion();

  return (
    <div className="totem-wrapper">
      <div ref={containerRef} className="totem-container">
        <WaterBackground />

        <AnimatePresence mode="wait">
          {state.screen === 'splash' && (
            <SplashScreen key="splash" onComplete={() => setScreen('cadastro')} />
          )}

          {state.screen === 'cadastro' && (
            <CadastroScreen
              key="cadastro"
              onComplete={(name, email, phone, profile) => setGuest(name, email, phone, profile)}
            />
          )}

          {state.screen === 'home' && (
            <HomeScreen key="home" onSelect={setProfile} />
          )}

          {state.screen === 'rules' && state.profile && (
            <RulesScreen
              key="rules"
              profile={state.profile}
              onStart={() => setScreen('question')}
              onBack={() => setScreen('cadastro')}
            />
          )}

          {state.screen === 'question' && question && state.profile && (
            <QuestionScreen
              key={`q-${state.stage}-${state.questionIndex}`}
              question={question}
              stage={state.stage}
              questionIndex={state.questionIndex}
              score={state.score}
              stageScore={state.stageScore}
              stageMaxScore={getStageMaxScore(state.stage)}
              profile={state.profile}
              lives={state.lives}
              eliminatedOptionId={state.eliminatedOptionForRetry}
              selectedOption={state.selectedOption}
              isAnswered={state.isAnswered}
              stageName={getStageName(state.stage)}
              stageAnswers={state.stageAnswers}
              lastPointsEarned={state.lastPointsEarned}
              lastStreakBonus={state.lastStreakBonus}
              lastAnswerCorrect={state.lastAnswerCorrect}
              onPointsAnimationComplete={() => setScreen('points-transition')}
              onSelect={selectOption}
              onConfirm={handleConfirm}
            />
          )}

          {state.screen === 'points-transition' && (
            <PointsTransitionScreen
              key="points-transition"
              correctCount={state.stageAnswers.filter(Boolean).length}
              stage={state.stage}
              questionIndex={state.questionIndex}
              onComplete={goToFeedback}
            />
          )}

          {state.screen === 'feedback' && question && state.profile && state.selectedOption && (
            <FeedbackScreen
              key={`fb-${state.stage}-${state.questionIndex}`}
              isCorrect={state.lastAnswerCorrect || false}
              pointsEarned={state.lastPointsEarned}
              streakBonus={state.lastStreakBonus}
              streak={state.streak}
              score={state.score}
              questionIndex={state.questionIndex}
              stage={state.stage}
              question={question}
              selectedOption={state.selectedOption}
              profile={state.profile}
              isLastQuestion={state.questionIndex >= 4}
              onNext={nextQuestion}
            />
          )}

          {state.screen === 'game-over' && (
            <GameOverScreen
              key="game-over"
              onRecoverLife={recoverLifeAndRetryQuestion}
              onGiveUp={giveUpFromGameOver}
            />
          )}

          {state.screen === 'stage-result' && state.profile && (
            <StageResultScreen
              key={`sr-${state.stage}`}
              stage={state.stage}
              stageAnswers={state.stageAnswers}
              score={state.score}
              profile={state.profile}
              stageName={getStageName(state.stage)}
              onAdvance={advanceStage}
              onRestartNewPerson={restartGame}
            />
          )}

          {state.screen === 'achievement' && state.profile && (
            <AchievementScreen
              key={`ach-${state.stage}`}
              stage={state.stage}
              profile={state.profile}
              onContinue={continueAfterAchievement}
              onBackToStart={restartGame}
            />
          )}

          {state.screen === 'final' && state.profile && (
            <FinalScreen
              key="final"
              score={state.score}
              usedHint={state.usedHint}
              sealsEarned={state.sealsEarned}
              profile={state.profile}
              guestName={state.guestName || undefined}
              onRestartSameGuest={restartSameGuest}
              onRestartNewPerson={restartGame}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameContainer;
