import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { loadSoundPack, isValidSoundPack } from '../audio/loadSoundPack';
import { colors, typography } from '../theme';

export const SplashScreen: React.FC = () => {
  const { navigate } = useSimpleNavigation();
  const { loadFromStorage, selectedSoundPack } = useUserStore();

  useEffect(() => {
    // Navigate immediately - don't wait for anything
    navigate('Home');
    
    // Load storage and sound pack in background (non-blocking)
    const initializeApp = async () => {
      try {
        await loadFromStorage();
        
        // Load sound pack after storage is loaded
        const packName = selectedSoundPack || 'bubble';
        if (isValidSoundPack(packName)) {
          await loadSoundPack(packName);
        } else {
          // Fallback to default
          await loadSoundPack('bubble');
        }
      } catch (err) {
        console.error('Error initializing app:', err);
        // Try to load default sound pack anyway
        loadSoundPack('bubble').catch(() => {});
      }
    };
    
    initializeApp();
  }, [navigate, loadFromStorage, selectedSoundPack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tapsy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 36,
    color: colors.textPrimary,
  },
});

