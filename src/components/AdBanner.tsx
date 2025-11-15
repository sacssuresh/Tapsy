import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

/**
 * Placeholder ad banner component
 * TODO: Integrate AdMob banner ads here
 */
export const AdBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Ad Space</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  placeholder: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

