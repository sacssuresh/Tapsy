import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatsCard } from '../components/StatsCard';
import { AdBanner } from '../components/AdBanner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Mascot } from '../components/Mascot';
import { colors, typography, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const { navigate } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();
  const { loadFromStorage } = useUserStore();
  
  // Load storage and sound pack in background on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await loadFromStorage();
        
        // Load sound pack if not already loaded
        const packName = userStore.selectedSoundPack || 'bubble';
        const { soundManager } = await import('../audio/SoundManager');
        const { loadSoundPack, isValidSoundPack } = await import('../audio/loadSoundPack');
        
        if (!soundManager.isPackLoaded(packName as any) && isValidSoundPack(packName)) {
          await loadSoundPack(packName as any);
        }
      } catch (err) {
        console.error('Error loading storage:', err);
      }
    };
    
    initialize();
  }, [loadFromStorage, userStore.selectedSoundPack]);
  
  const bestScoreByMode = userStore.bestScoreByMode || { classic: 0, speed: 0, reverse: 0, zen: 0 };
  const xp = Number(userStore.xp) || 0;
  const currentStreakDays = Number(userStore.currentStreakDays) || 0;

  const navigateToModes = () => {
    navigate('ModeSelect');
  };

  const navigateToClassic = () => {
    navigate('Game', { mode: 'classic' });
  };

  const navigateToSettings = () => {
    navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={styles.content}>
        <Mascot expression="happy" />
        <Text style={styles.title}>Tapsy</Text>
        <Text style={styles.subtitle}>Minimal memory challenge.</Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Play Classic" onPress={navigateToClassic} useGradient={true} />
          <View style={styles.buttonSpacing} />
          <SecondaryButton title="Modes" onPress={navigateToModes} />
        </View>

        <View style={styles.statsContainer}>
          <StatsCard
            bestScore={bestScoreByMode.classic}
            xp={xp}
            streak={currentStreakDays}
          />
        </View>
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.md, zIndex: 1 }]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => {}} disabled={false}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          {/* Shop hidden per user request */}
          <TouchableOpacity style={styles.navItem} onPress={navigateToSettings} disabled={false}>
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
        </View>
        {/* Ad banner - hidden in Zen mode, shown on Home */}
        <AdBanner />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    letterSpacing: typography.title.letterSpacing,
    color: typography.title.color,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.subtitle.fontSize,
    color: typography.subtitle.color,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
  buttonSpacing: {
    height: spacing.md,
  },
  statsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  bottomSection: {
    padding: spacing.lg,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  navItem: {
    padding: spacing.sm,
  },
  navText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});

