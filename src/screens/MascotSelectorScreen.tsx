import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { Card } from '../components/Card';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { mascotsList, getUserMascot, setUserMascot, type MascotName } from '../mascots/MascotManager';
import { colors, typography, spacing } from '../theme';

export const MascotSelectorScreen: React.FC = () => {
  const { goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const [selectedMascot, setSelectedMascot] = useState<MascotName>('tapsy-kid');

  // Load current selection on mount
  useEffect(() => {
    const loadSelection = async () => {
      const current = await getUserMascot();
      setSelectedMascot(current);
    };
    loadSelection();
  }, []);

  const handleSelectMascot = async (name: MascotName) => {
    setSelectedMascot(name);
    await setUserMascot(name);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, zIndex: 1 }]}>
        <TouchableOpacity onPress={goBack} disabled={false} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose Mascot</Text>
      </View>
      <ScrollView
        style={[styles.scrollView, { zIndex: 1 }]}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        {mascotsList.map((mascot, index) => {
          const isSelected = selectedMascot === mascot.name;
          return (
            <View key={mascot.name}>
              <TouchableOpacity
                onPress={() => handleSelectMascot(mascot.name)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.mascotCard,
                    isSelected && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                >
                  <View style={styles.mascotRow}>
                    <View style={styles.mascotImageContainer}>
                      <AnimatedMascot name={mascot.name} size={80} />
                    </View>
                    <View style={styles.mascotInfo}>
                      <Text style={styles.mascotName}>{mascot.displayName}</Text>
                      <Text style={styles.mascotDescription}>{mascot.description}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedCheckmark}>✓</Text>
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
              {index < mascotsList.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </ScrollView>
    </View>
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
  mascotCard: {
    marginBottom: spacing.sm,
    borderRadius: 28,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  mascotImageContainer: {
    marginRight: spacing.md,
  },
  mascotInfo: {
    flex: 1,
  },
  mascotName: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: '600',
    color: typography.body.color,
    marginBottom: spacing.xs,
  },
  mascotDescription: {
    fontSize: typography.body.fontSize,
    color: typography.subtitle.color,
  },
  selectedIndicator: {
    marginLeft: spacing.sm,
  },
  selectedCheckmark: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});

