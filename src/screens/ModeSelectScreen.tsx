import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { Card } from '../components/Card';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { getMascotNameForMode } from '../mascots/MascotManager';
import { colors, typography, spacing } from '../theme';
import type { GameMode } from '../types';

interface ModeConfig {
  mode: GameMode;
  name: string;
  description: string;
  icon: string;
  borderColor: string;
}

const modes: ModeConfig[] = [
  {
    mode: 'classic',
    name: 'Classic',
    description: 'Sequence grows by 1 each level, normal speed.',
    icon: '⭐',
    borderColor: '#A088FF', // Pastel purple
  },
  {
    mode: 'speed',
    name: 'Speed',
    description: 'Faster playback, higher score multiplier.',
    icon: '⚡',
    borderColor: '#5B8FD8', // Pastel blue
  },
  {
    mode: 'reverse',
    name: 'Reverse',
    description: 'Input the sequence in reverse order.',
    icon: '🔁',
    borderColor: '#F5A623', // Pastel yellow
  },
];

export const ModeSelectScreen: React.FC = () => {
  const { navigate, goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const { bestScoreByMode } = useUserStore();
  const overallBest = Math.max(...Object.values(bestScoreByMode || { classic: 0, speed: 0, reverse: 0 }));

  const handleModeSelect = (mode: GameMode) => {
    navigate('Game', { mode });
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, zIndex: 1 }]}>
        <TouchableOpacity onPress={goBack} disabled={false} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Mode</Text>
      </View>
      <ScrollView 
        style={[styles.scrollView, { zIndex: 1 }]} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.lg }]}
      >
      <Text style={styles.overallBest}>Best (All Modes): {overallBest}</Text>
      {modes.map((modeConfig) => (
        <ModeCard
          key={modeConfig.mode}
          modeConfig={modeConfig}
          bestScore={bestScoreByMode[modeConfig.mode]}
          onPress={() => handleModeSelect(modeConfig.mode)}
        />
      ))}
      </ScrollView>
    </View>
  );
};

// Enhanced Mode Card Component with animations
const ModeCard: React.FC<{
  modeConfig: ModeConfig;
  bestScore: number;
  onPress: () => void;
}> = ({ modeConfig, bestScore, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card style={[styles.modeCard, { borderColor: modeConfig.borderColor, borderWidth: 2 }]}>
          <View style={styles.modeContent}>
            <View style={styles.mascotContainer}>
              <AnimatedMascot name={getMascotNameForMode(modeConfig.mode)} size={50} />
            </View>
            <View style={styles.modeInfo}>
              <View style={styles.modeHeader}>
                <View style={styles.modeTitleRow}>
                  <View style={[styles.iconBadge, { backgroundColor: `${modeConfig.borderColor}20` }]}>
                    <Text style={styles.modeIcon}>{modeConfig.icon}</Text>
                  </View>
                  <Text style={styles.modeName}>{modeConfig.name}</Text>
                </View>
                <View style={styles.modeRight}>
                  <Text style={styles.bestScore}>
                    Best: {bestScore}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </View>
              <Text style={styles.modeDescription}>{modeConfig.description}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backButtonIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    letterSpacing: typography.title.letterSpacing,
    color: typography.title.color,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  overallBest: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  modeCard: {
    marginBottom: spacing.md,
    borderRadius: 28, // Increased corner radius
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotContainer: {
    marginRight: spacing.md,
  },
  modeInfo: {
    flex: 1,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  modeIcon: {
    fontSize: 20,
  },
  modeName: {
    fontSize: typography.subtitle.fontSize + 2,
    fontWeight: '600',
    color: typography.body.color,
  },
  modeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestScore: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
    fontWeight: '500',
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '300',
  },
  modeDescription: {
    fontSize: typography.body.fontSize,
    color: typography.subtitle.color,
  },
});

