import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing } from '../theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(0.05)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(8)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        stiffness: 300,
        damping: 20,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: 0.12,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: 14,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 300,
        damping: 20,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: 0.05,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: 8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!!disabled}
      activeOpacity={1}
    >
      {/* Outer Animated.View: Handles shadow properties (JS-driven) */}
      <Animated.View
        style={[
          {
            shadowOpacity: shadowOpacityAnim,
            shadowRadius: shadowRadiusAnim,
          },
        ]}
      >
        {/* Inner Animated.View: Handles transform (native-driven) */}
        <Animated.View
          style={[
            {
              transform: [{ scale: scaleAnim }],
            },
            !!disabled && styles.disabled,
          ]}
        >
          <BlurView intensity={12} tint="light" style={styles.button}>
            <Text style={styles.text}>{title}</Text>
          </BlurView>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

