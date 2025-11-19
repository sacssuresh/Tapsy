import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useGameStore } from '../state/gameStore';
import { useUserStore } from '../state/userStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Card } from '../components/Card';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { colors, typography, spacing } from '../theme';
import { soundManager } from '../audio/SoundManager';
import { submitScore, type LeaderboardMode } from '../services/leaderboardService';
import type { GameMode } from '../types';

export const GameOverScreen: React.FC<{ route?: { params?: { mode?: GameMode } } }> = ({ route }) => {
  const { navigate } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const mode = route?.params?.mode || 'classic';

  const { level, score, resetGame } = useGameStore();
  const {
    bestScoreByMode,
    updateBestScore,
    updateStreak,
    incrementGamesPlayed,
    settings,
    username,
  } = useUserStore();
  
  const safeSettings = settings || {
    soundEnabled: true,
    hapticsEnabled: true,
    hintsEnabled: false,
  };

  const bestScore = bestScoreByMode[mode];
  const isNewBest = score > bestScore;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Update stats
    const wasNewBest = score > bestScore;
    updateBestScore(mode, score);
    updateStreak();
    incrementGamesPlayed();

    // Submit score to leaderboard (if username is set and score is new best)
    if (username && username.trim() && wasNewBest) {
      // Map game mode to leaderboard mode: 'speed' -> 'hard'
      const leaderboardMode: LeaderboardMode = mode === 'speed' ? 'hard' : mode === 'reverse' ? 'reverse' : 'classic';
      
      submitScore(leaderboardMode, score, username).catch((error) => {
        // Fail silently - leaderboard is non-critical
        console.warn('Error submitting score to leaderboard:', error);
      });
    }

    // Show confetti if new best
    if (wasNewBest) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Play fail sound on game over
    if (safeSettings.soundEnabled) {
      soundManager.play('fail');
    }
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigate('Game', { mode });
  };

  const handleChangeMode = () => {
    resetGame();
    navigate('ModeSelect');
  };

  const handleGoHome = () => {
    resetGame();
    navigate('Home');
  };

  const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);
  const mascotExpression = isNewBest ? 'celebrate' : 'sad';

  return (
    <AnimatedBackground>
      {showConfetti && <Confetti />}
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}
      >
        <Mascot expression={mascotExpression} />
        <Text style={styles.title}>Game Over</Text>

      <Card style={styles.statsCard}>
        <Text style={styles.modeLabel}>Mode: {modeName}</Text>
        <Text style={styles.levelLabel}>Level Reached: {level}</Text>
        <Text style={styles.scoreLabel}>Score: {score}</Text>
        <Text style={styles.bestScoreLabel}>
          Best Score: {isNewBest ? score : bestScore}
          {Boolean(isNewBest) && <Text style={styles.newBest}> (New Best!)</Text>}
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Play Again" onPress={handlePlayAgain} />
        <View style={styles.buttonSpacing} />
        <SecondaryButton title="Change Mode" onPress={handleChangeMode} />
        <View style={styles.buttonSpacing} />
        <SecondaryButton title="Home" onPress={handleGoHome} />
      </View>
      </ScrollView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    letterSpacing: typography.title.letterSpacing,
    color: typography.title.color,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  statsCard: {
    width: '100%',
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
  modeLabel: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
    marginBottom: spacing.sm,
  },
  levelLabel: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
    marginBottom: spacing.sm,
  },
  scoreLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.sm,
  },
  bestScoreLabel: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
    marginBottom: spacing.sm,
  },
  newBest: {
    color: colors.accentAqua,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacing: {
    height: spacing.md,
  },
});

