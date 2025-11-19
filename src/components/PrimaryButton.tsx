import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  useGradient?: boolean; // For "Play Classic" button
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  useGradient = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(0.07)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(14)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        stiffness: 300,
        damping: 20,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: 20,
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
        toValue: 0.07,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: 14,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const buttonStyle = useGradient
    ? [styles.button, styles.gradientButton]
    : [styles.button, { backgroundColor: colors.primary }];

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
            buttonStyle,
            !!disabled && styles.disabled,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {useGradient ? (
            <View style={StyleSheet.absoluteFill}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: '#8878FF',
                    borderRadius: 30,
                  },
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: '#A088FF',
                    borderRadius: 30,
                    opacity: 0.3,
                  },
                ]}
              />
            </View>
          ) : null}
          <Text style={styles.text}>{title}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30, // Increased from 24
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
  },
  gradientButton: {
    backgroundColor: '#8878FF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.surface,
    zIndex: 1,
  },
});

