import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../state/userStore';
import { soundManager } from '../audio/SoundManager';

export const SettingsScreen: React.FC = () => {
  const { goBack, navigate } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetProgress, username } = useUserStore();
  const theme = useTheme();
  
  // Ensure settings is always defined
  const safeSettings = settings || {
    soundEnabled: true,
    hapticsEnabled: true,
    hintsEnabled: false,
  };

  const handleSoundToggle = (value: boolean) => {
    updateSettings({ soundEnabled: value });
    soundManager.setEnabled(value);
  };

  const handleHapticsToggle = (value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  };

  const handleHintsToggle = (value: boolean) => {
    updateSettings({ hintsEnabled: value });
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all local progress AND remove your scores from the global leaderboard. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Success', 'All progress has been reset.');
          },
        },
      ]
    );
  };

  return (
    <AnimatedBackground>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { 
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.lg,
        }]}
      >
        <View style={[styles.header, { 
          paddingTop: insets.top + theme.spacing.md,
          marginBottom: theme.spacing.xl,
        }]}>
        <TouchableOpacity onPress={goBack} disabled={false} style={[styles.backButton, { backgroundColor: `${theme.colors.primary}1A` }]}>
          <Text style={[styles.backButtonIcon, { color: theme.colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { 
          fontSize: theme.typography.title.fontSize,
          fontWeight: theme.typography.title.fontWeight,
          letterSpacing: theme.typography.title.letterSpacing,
          color: theme.colors.textPrimary,
        }]}>Settings</Text>
      </View>

      <Card style={[getSettingsCardStyle(theme), { marginBottom: theme.spacing.xl }]}>
        <Text style={getSectionTitleStyle(theme)}>Profile</Text>
        <View style={getSettingRowStyle(theme)}>
          <View style={getSettingInfoStyle(theme)}>
            <Text style={getSettingLabelStyle(theme)}>Username</Text>
            <Text style={[getSettingDescriptionStyle(theme), { 
              color: username ? theme.colors.primary : theme.colors.textSecondary,
              fontWeight: username ? '600' : '400',
            }]}>
              {username || 'Not set'}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={[getSettingsCardStyle(theme), { marginBottom: theme.spacing.xl }]}>
        <Text style={getSectionTitleStyle(theme)}>Game Settings</Text>
        <View style={getSettingRowStyle(theme)}>
          <View style={getSettingInfoStyle(theme)}>
            <Text style={getSettingLabelStyle(theme)}>Sound</Text>
            <Text style={getSettingDescriptionStyle(theme)}>Enable game sounds</Text>
          </View>
          <Switch
            value={safeSettings.soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>

        <View style={getDividerStyle(theme)} />

        <View style={getSettingRowStyle(theme)}>
          <View style={getSettingInfoStyle(theme)}>
            <Text style={getSettingLabelStyle(theme)}>Haptics</Text>
            <Text style={getSettingDescriptionStyle(theme)}>Vibration feedback</Text>
          </View>
          <Switch
            value={safeSettings.hapticsEnabled}
            onValueChange={handleHapticsToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>

        <View style={getDividerStyle(theme)} />

        <View style={getSettingRowStyle(theme)}>
          <View style={getSettingInfoStyle(theme)}>
            <Text style={getSettingLabelStyle(theme)}>Hints</Text>
            <Text style={getSettingDescriptionStyle(theme)}>Show gameplay hints</Text>
          </View>
          <Switch
            value={safeSettings.hintsEnabled}
            onValueChange={handleHintsToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
      </Card>

      <View style={[styles.dangerSection, { marginTop: theme.spacing.lg }]}>
        <PrimaryButton
          title="Reset All Progress"
          onPress={handleResetProgress}
        />
      </View>
      </ScrollView>
    </AnimatedBackground>
  );
};

const getSettingsCardStyle = (theme: ReturnType<typeof useTheme>) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  borderRadius: 20,
  borderWidth: 1,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
});

const getSettingRowStyle = (theme: ReturnType<typeof useTheme>) => ({
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingVertical: 12,
});

const getSettingInfoStyle = (theme: ReturnType<typeof useTheme>) => ({
  flex: 1,
  marginRight: 16,
});

const getSettingLabelStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: theme.typography.body.fontSize,
  fontWeight: '600' as const,
  color: theme.colors.textPrimary,
  marginBottom: 4,
});

const getSettingDescriptionStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.colors.textSecondary,
});

const getDividerStyle = (theme: ReturnType<typeof useTheme>) => ({
  height: 1,
  backgroundColor: theme.colors.border,
  marginVertical: 8,
});

const getSectionTitleStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: theme.typography.body.fontSize,
  fontWeight: '700' as const,
  color: theme.colors.textPrimary,
  marginBottom: 16,
  letterSpacing: -0.3,
});

const getSoundPackRowStyle = (theme: ReturnType<typeof useTheme>) => ({
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingVertical: 12,
});

const getSelectedLabelStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: theme.typography.body.fontSize,
  fontWeight: '600' as const,
  color: theme.colors.primary,
});

const getChevronStyle = (theme: ReturnType<typeof useTheme>) => ({
  fontSize: 24,
  fontWeight: '300' as const,
  color: theme.colors.primary,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
  },
  backButtonIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    marginLeft: 0,
  },
  dangerSection: {},
});

