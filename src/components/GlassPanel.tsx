import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { effects, spacing } from '../theme';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Glass morphism panel component
 * Uses semi-transparent background with blur effect
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({ children, style }) => {
  return (
    <View
      style={[
        styles.glassPanel,
        {
          backgroundColor: effects.glassPanel.backgroundColor,
          borderRadius: effects.glassPanel.borderRadius,
          borderWidth: effects.glassPanel.borderWidth,
          borderColor: effects.glassPanel.borderColor,
          padding: effects.glassPanel.padding || spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glassPanel: {
    // Note: blur effect requires BlurView from expo-blur, but we'll use backgroundColor for now
    // For full blur effect, you'd need: import { BlurView } from 'expo-blur';
    overflow: 'hidden',
  },
});

