import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatsCard } from '../components/StatsCard';
import { AdBanner } from '../components/AdBanner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { getUserMascot, type MascotName } from '../mascots/MascotManager';
import { colors, typography, spacing } from '../theme';
const taglines = [
  'Big brain mode: ON.',
  'Train your brain with Tapsy & friends!',
  'Tap fast, think faster.',
  'Your mascot is cheering for you!',
  "Let's see that memory magic!",
];

export const HomeScreen: React.FC = () => {
  const { navigate, currentScreen } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();
  const { loadFromStorage } = useUserStore();
  const [selectedMascot, setSelectedMascot] = useState<MascotName>('tapsy-kid');
  const [tagline] = useState(() => taglines[Math.floor(Math.random() * taglines.length)]);
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  
  // Load storage, sound pack, and home mascot in background on mount
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        await loadFromStorage();
        
        if (!isMounted) return;
        
        // Load user's selected mascot
        const userMascot = await getUserMascot();
        if (isMounted) {
          setSelectedMascot(userMascot);
        }
        
        // Load sound pack if not already loaded
        const packName = userStore.selectedSoundPack || 'bubble';
        const { soundManager } = await import('../audio/SoundManager');
        const { loadSoundPack, isValidSoundPack } = await import('../audio/loadSoundPack');
        
        // Check if pack is already loaded before attempting to load
        if (isValidSoundPack(packName) && !soundManager.isPackLoaded(packName as any)) {
          await loadSoundPack(packName as any);
        }
        
        if (!isMounted) return;
        
        // Ensure sound manager is enabled based on settings
        const currentSettings = userStore.settings;
        if (currentSettings?.soundEnabled !== undefined) {
          soundManager.setEnabled(currentSettings.soundEnabled);
        }
      } catch (err) {
        const { error: logError } = await import('../utils/logger');
        logError('Error loading storage:', err);
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [loadFromStorage]);

  // Fade-in animation for tagline
  useEffect(() => {
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [taglineOpacity]);
  
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
        <AnimatedMascot name={selectedMascot} size={130} />
        <Text style={styles.title}>Tapsy</Text>
        <Animated.Text style={[styles.subtitle, { opacity: taglineOpacity }]}>
          {tagline}
        </Animated.Text>

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
            <Text
              style={[
                styles.navText,
                currentScreen === 'Home' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Home
            </Text>
            {currentScreen === 'Home' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          {/* Shop hidden per user request */}
          <TouchableOpacity style={styles.navItem} onPress={navigateToSettings} disabled={false}>
            <Text
              style={[
                styles.navText,
                currentScreen === 'Settings' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Settings
            </Text>
            {currentScreen === 'Settings' && <View style={styles.activeIndicator} />}
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
    paddingVertical: spacing.sm + 5,
    paddingHorizontal: spacing.sm,
    position: 'relative',
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  navTextActive: {
    color: '#7A57FD',
  },
  navTextInactive: {
    color: '#6E6E8F',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 4,
    backgroundColor: '#7A57FD',
    borderRadius: 2,
  },
});

