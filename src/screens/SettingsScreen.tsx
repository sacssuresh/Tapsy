import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { GradientBackground } from '../components/GradientBackground';
import { colors, typography, spacing } from '../theme';
import { useUserStore } from '../state/userStore';
import { soundManager } from '../audio/SoundManager';
import { loadSoundPack, getAvailableSoundPacks, isValidSoundPack } from '../audio/loadSoundPack';
import type { SoundPackName } from '../audio/SoundManager';

export const SettingsScreen: React.FC = () => {
  const { goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetProgress, selectedSoundPack, updateSelectedSoundPack } = useUserStore();
  
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

  const handleSoundPackChange = async (packName: string) => {
    if (isValidSoundPack(packName)) {
      await updateSelectedSoundPack(packName);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress? This cannot be undone.',
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
    <GradientBackground>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={goBack} disabled={false} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Text style={styles.settingDescription}>Enable game sounds</Text>
          </View>
          <Switch
            value={safeSettings.soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Haptics</Text>
            <Text style={styles.settingDescription}>Vibration feedback</Text>
          </View>
          <Switch
            value={safeSettings.hapticsEnabled}
            onValueChange={handleHapticsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Hints</Text>
            <Text style={styles.settingDescription}>Show gameplay hints</Text>
          </View>
          <Switch
            value={safeSettings.hintsEnabled}
            onValueChange={handleHintsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </Card>

      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Sound Pack</Text>
        {getAvailableSoundPacks()
          .filter((packName) => packName !== 'anime') // Hide anime pack from selection
          .map((packName, index, filteredArray) => (
            <View key={packName}>
              <TouchableOpacity
                style={styles.soundPackRow}
                onPress={() => handleSoundPackChange(packName)}
                disabled={selectedSoundPack === packName}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    {packName.charAt(0).toUpperCase() + packName.slice(1)} Pack
                  </Text>
                  <Text style={styles.settingDescription}>
                    {packName === 'pastel' && 'Soft pastel sound effects'}
                    {packName === 'bubble' && 'Playful bubble sound effects'}
                  </Text>
                </View>
                {selectedSoundPack === packName && (
                  <Text style={styles.selectedLabel}>✓</Text>
                )}
              </TouchableOpacity>
              {index < filteredArray.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
      </Card>

      <View style={styles.dangerSection}>
        <PrimaryButton
          title="Reset All Progress"
          onPress={handleResetProgress}
        />
      </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    letterSpacing: typography.title.letterSpacing,
    color: typography.title.color,
    flex: 1,
  },
  settingsCard: {
    marginBottom: spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.md,
  },
  soundPackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  selectedLabel: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  dangerSection: {
    marginTop: spacing.lg,
  },
});

