import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { GradientBackground } from '../components/GradientBackground';
import { colors, typography, spacing } from '../theme';
import { useUserStore } from '../state/userStore';

export const ShopScreen: React.FC = () => {
  const { goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const { hasPremium, ownedThemes, ownedSoundPacks, updateSettings } = useUserStore();

  const handlePurchaseTheme = (themeId: string) => {
    // TODO: Integrate in-app purchase here
    alert(`Purchase theme: ${themeId} (IAP integration needed)`);
  };

  const handlePurchaseSoundPack = (packId: string) => {
    // TODO: Integrate in-app purchase here
    alert(`Purchase sound pack: ${packId} (IAP integration needed)`);
  };

  const handleRemoveAds = () => {
    // TODO: Integrate in-app purchase here
    alert('Remove ads purchase (IAP integration needed)');
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
        <Text style={styles.title}>Shop</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Themes</Text>
        <Card style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Ocean Theme</Text>
              <Text style={styles.itemDescription}>Cool blue color palette</Text>
            </View>
            {ownedThemes.includes('ocean') ? (
              <Text style={styles.ownedLabel}>Owned</Text>
            ) : (
              <PrimaryButton
                title="$0.99"
                onPress={() => handlePurchaseTheme('ocean')}
              />
            )}
          </View>
        </Card>

        <Card style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Sunset Theme</Text>
              <Text style={styles.itemDescription}>Warm orange and pink tones</Text>
            </View>
            {ownedThemes.includes('sunset') ? (
              <Text style={styles.ownedLabel}>Owned</Text>
            ) : (
              <PrimaryButton
                title="$0.99"
                onPress={() => handlePurchaseTheme('sunset')}
              />
            )}
          </View>
        </Card>
      </View>

      {/* Sound Packs section removed - bubble is default, anime is premium locked */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium</Text>
        <Card style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Remove Ads</Text>
              <Text style={styles.itemDescription}>Enjoy ad-free gameplay</Text>
            </View>
            {hasPremium ? (
              <Text style={styles.ownedLabel}>Owned</Text>
            ) : (
              <PrimaryButton title="$2.99" onPress={handleRemoveAds} />
            )}
          </View>
        </Card>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.md,
  },
  itemCard: {
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  ownedLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.accentAqua,
    fontWeight: '600',
  },
});

