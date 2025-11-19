import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useUserStore } from '../state/userStore';
import { loadSoundPack } from '../audio/loadSoundPack';
import { colors, typography } from '../theme';
import { error as logError } from '../utils/logger';

export const SplashScreen: React.FC = () => {
  const { navigate } = useSimpleNavigation();
  const { loadFromStorage } = useUserStore();

  useEffect(() => {
    // Navigate immediately - don't wait for anything
    navigate('Home');
    
    // Load storage and sound pack in background (non-blocking)
    const initializeApp = async () => {
      try {
        await loadFromStorage();
        
        // Load bubble sound pack (the only available pack)
        await loadSoundPack('bubble');
      } catch (err) {
        logError('Error initializing app:', err);
        // Try to load default sound pack anyway
        loadSoundPack('bubble').catch(() => {});
      }
    };
    
    initializeApp();
  }, [navigate, loadFromStorage]);

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

