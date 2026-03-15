import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import WaterBackground from './WaterBackground';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import RulesScreen from './RulesScreen';
import QuestionScreen from './QuestionScreen';
import FeedbackScreen from './FeedbackScreen';
import StageResultScreen from './StageResultScreen';
import AchievementScreen from './AchievementScreen';
import FinalScreen from './FinalScreen';

const GameContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    state,
    getCurrentQuestion,
    setScreen,
    setProfile,
    selectOption,
    confirmAnswer,
    goToFeedback,
    nextQuestion,
    advanceStage,
    continueAfterAchievement,
    restartGame,
    getStageName,
  } = useGame();

  // Scale totem to fit viewport
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scaleH = vh / 1920;
      const scaleW = vw / 1080;
      const scale = Math.min(scaleH, scaleW, 1);
      containerRef.current.style.setProperty('--totem-scale', String(scale));
      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.transformOrigin = 'top center';
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Handle answer confirmation → show states then go to feedback
  const handleConfirm = useCallback(() => {
    confirmAnswer();
    setTimeout(() => goToFeedback(), 1500);
  }, [confirmAnswer, goToFeedback]);

  const question = getCurrentQuestion();

  return (
    <div className="totem-wrapper">
      <div ref={containerRef} className="totem-container">
        <WaterBackground />

        <AnimatePresence mode="wait">
          {state.screen === 'splash' && (
            <SplashScreen key="splash" onComplete={() => setScreen('home')} />
          )}

          {state.screen === 'home' && (
            <HomeScreen key="home" onSelect={setProfile} />
          )}

          {state.screen === 'rules' && state.profile && (
            <RulesScreen
              key="rules"
              profile={state.profile}
              onStart={() => setScreen('question')}
              onBack={() => setScreen('home')}
            />
          )}

          {state.screen === 'question' && question && state.profile && (
            <QuestionScreen
              key={`q-${state.stage}-${state.questionIndex}`}
              question={question}
              stage={state.stage}
              questionIndex={state.questionIndex}
              score={state.score}
              profile={state.profile}
              selectedOption={state.selectedOption}
              isAnswered={state.isAnswered}
              stageName={getStageName(state.stage)}
              stageAnswers={state.stageAnswers}
              onSelect={selectOption}
              onConfirm={handleConfirm}
            />
          )}

          {state.screen === 'feedback' && question && state.profile && state.selectedOption && (
            <FeedbackScreen
              key={`fb-${state.stage}-${state.questionIndex}`}
              isCorrect={state.lastAnswerCorrect || false}
              pointsEarned={state.lastPointsEarned}
              streakBonus={state.lastStreakBonus}
              streak={state.streak}
              question={question}
              selectedOption={state.selectedOption}
              profile={state.profile}
              isLastQuestion={state.questionIndex >= 4}
              onNext={nextQuestion}
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
            />
          )}

          {state.screen === 'achievement' && state.profile && (
            <AchievementScreen
              key={`ach-${state.stage}`}
              stage={state.stage}
              profile={state.profile}
              onContinue={continueAfterAchievement}
            />
          )}

          {state.screen === 'final' && state.profile && (
            <FinalScreen
              key="final"
              score={state.score}
              usedHint={state.usedHint}
              sealsEarned={state.sealsEarned}
              profile={state.profile}
              onRestart={restartGame}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameContainer;
