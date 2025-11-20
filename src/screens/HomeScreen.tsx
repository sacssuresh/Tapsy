import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { NeonButton } from '../components/NeonButton';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { UsernameModal } from '../components/UsernameModal';
import { getUserMascot, setUserMascot, getNextMascot, type MascotName } from '../mascots/MascotManager';
import { useTheme } from '../hooks/useTheme';
import type { GameMode } from '../types';

export const HomeScreen: React.FC = () => {
  const { navigate, currentScreen } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();
  const { loadFromStorage, username, updateUsername } = useUserStore();
  const [selectedMascot, setSelectedMascot] = useState<MascotName>('tapsy-kid');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const theme = useTheme();
  
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
        
        // Load bubble sound pack if not already loaded
        const { soundManager } = await import('../audio/SoundManager');
        const { loadSoundPack } = await import('../audio/loadSoundPack');
        
        // Always load bubble pack (the only pack available)
        if (!soundManager.isPackLoaded('bubble')) {
          await loadSoundPack('bubble');
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

  // Watch for username changes (e.g., after reset or initial load)
  // This ensures modal shows/hides correctly based on username state
  useEffect(() => {
    if (!username || username.trim() === '') {
      setShowUsernameModal(true);
    } else {
      setShowUsernameModal(false);
    }
  }, [username]);

  const navigateToGame = (mode: GameMode) => {
    navigate('Game', { mode });
  };

  const navigateToSettings = () => {
    navigate('Settings');
  };

  const navigateToLeaderboard = () => {
    navigate('Leaderboard');
  };

  const handleToggleCharacter = async () => {
    const newMascot = getNextMascot(selectedMascot);
    setSelectedMascot(newMascot);
    await setUserMascot(newMascot);
  };

  const handleUsernameSubmit = async (username: string) => {
    await updateUsername(username);
    setShowUsernameModal(false);
  };

  // Neon colors for buttons
  const classicColor = '#5EEBFF'; // Cyan
  const reverseColor = '#FFB562'; // Orange (for Reverse mode)
  const hardColor = '#FF75D8'; // Pink (for Hard/Speed mode)

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <UsernameModal
        visible={showUsernameModal}
        onSubmit={handleUsernameSubmit}
      />
      <View style={[styles.content, getContentStyle(theme, insets)]}>
        {/* Character - centered and tappable */}
        <View style={styles.characterContainer}>
          <AnimatedMascot 
            name={selectedMascot} 
            size={130}
            onPress={handleToggleCharacter}
          />
          <Text style={getHintTextStyle(theme)}>
            Tap to change character
          </Text>
        </View>

        {/* Title area - Poppins SemiBold */}
        <View style={styles.titleContainer}>
          <Text style={getTitleStyle(theme)}>
            Tapsy
          </Text>
          {username && (
            <Text style={getUsernameStyle(theme)}>
              @{username}
            </Text>
          )}
        </View>

        {/* 3 Big Buttons */}
        <View style={getButtonContainerStyle(theme)}>
          <NeonButton
            title="Classic"
            onPress={() => navigateToGame('classic')}
            neonColor={classicColor}
          />
          <NeonButton
            title="Reverse"
            onPress={() => navigateToGame('reverse')}
            neonColor={reverseColor}
          />
          <NeonButton
            title="Hard"
            onPress={() => navigateToGame('speed')}
            neonColor={hardColor}
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={getBottomSectionStyle(theme, insets)}>
        <View style={getBottomNavStyle(theme)}>
          <TouchableOpacity style={getNavItemStyle(theme)} onPress={() => {}} disabled={false}>
            <Text style={getNavTextStyle(theme, currentScreen === 'Home')}>
              Home
            </Text>
            {currentScreen === 'Home' && <View style={getActiveIndicatorStyle(theme)} />}
          </TouchableOpacity>
          <TouchableOpacity style={getNavItemStyle(theme)} onPress={navigateToLeaderboard} disabled={false}>
            <Text style={getNavTextStyle(theme, currentScreen === 'Leaderboard')}>
              Leaderboard
            </Text>
            {currentScreen === 'Leaderboard' && <View style={getActiveIndicatorStyle(theme)} />}
          </TouchableOpacity>
          <TouchableOpacity style={getNavItemStyle(theme)} onPress={navigateToSettings} disabled={false}>
            <Text style={getNavTextStyle(theme, currentScreen === 'Settings')}>
              Settings
            </Text>
            {currentScreen === 'Settings' && <View style={getActiveIndicatorStyle(theme)} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getContentStyle = (theme: ReturnType<typeof useTheme>, insets: { top: number; bottom: number }) => ({
  paddingTop: insets.top + theme.spacing.xl,
  paddingBottom: insets.bottom + theme.spacing.xl,
  paddingHorizontal: theme.spacing.lg,
});

const getHintTextStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: 12,
  color: theme.colors.textSecondary,
  marginTop: 8,
  opacity: 0.7,
  fontFamily: Platform.select({
    ios: 'SF Pro Rounded',
    android: 'Poppins',
    default: 'Poppins',
  }),
});

const getTitleStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: 42,
  fontWeight: '600' as const,
  letterSpacing: -1,
  color: theme.colors.textPrimary,
  textAlign: 'center' as const,
  fontFamily: Platform.select({
    ios: 'SF Pro Rounded',
    android: 'Poppins',
    default: 'Poppins',
  }),
});

const getUsernameStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: 14,
  fontWeight: '500' as const,
  letterSpacing: 0,
  color: theme.colors.textSecondary,
  textAlign: 'center' as const,
  marginTop: 8,
  fontFamily: Platform.select({
    ios: 'SF Pro Rounded',
    android: 'Poppins',
    default: 'Poppins',
  }),
});

const getButtonContainerStyle = (theme: ReturnType<typeof useTheme>) => ({
  marginTop: theme.spacing.xl * 1.5,
  width: '100%',
  maxWidth: 320,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  alignSelf: 'center' as const,
});

const getBottomSectionStyle = (theme: ReturnType<typeof useTheme>, insets: { bottom: number }) => ({
  padding: theme.spacing.lg,
  paddingBottom: insets.bottom + theme.spacing.md,
  zIndex: 1,
});

const getBottomNavStyle = (theme: ReturnType<typeof useTheme>) => ({
  flexDirection: 'row' as const,
  justifyContent: 'space-around' as const,
  marginBottom: theme.spacing.md,
});

const getNavItemStyle = (theme: ReturnType<typeof useTheme>) => ({
  position: 'relative' as const,
  alignItems: 'center' as const,
  paddingVertical: theme.spacing.sm + 5,
  paddingHorizontal: theme.spacing.sm,
});

const getNavTextStyle = (theme: ReturnType<typeof useTheme>, isActive: boolean) => ({
  fontSize: 16,
  fontWeight: '600' as const,
  letterSpacing: -0.3,
  color: isActive ? theme.colors.primary : theme.colors.textSecondary,
  fontFamily: Platform.select({
    ios: 'SF Pro Rounded',
    android: 'Poppins',
    default: undefined,
  }),
});

const getActiveIndicatorStyle = (theme: ReturnType<typeof useTheme>) => ({
  position: 'absolute' as const,
  bottom: 0,
  width: 32,
  height: 4,
  borderRadius: 2,
  backgroundColor: theme.colors.primary,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
});

