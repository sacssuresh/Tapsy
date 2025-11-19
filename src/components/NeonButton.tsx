import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  neonColor: string; // Neon color for border and glow
}

/**
 * Big rounded button with neon outline and glow effect
 * Gen Z aesthetic with subtle glow on press
 */
export const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  disabled = false,
  neonColor,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        stiffness: 300,
        damping: 20,
      }),
      Animated.timing(glowOpacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false, // Shadows can't use native driver
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
      Animated.timing(glowOpacityAnim, {
        toValue: 0,
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
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: neonColor,
            shadowColor: neonColor,
          },
        ]}
      >
        {/* Glow effect overlay */}
        <Animated.View
          style={[
            styles.glowOverlay,
            {
              backgroundColor: neonColor,
              opacity: glowOpacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
            },
          ]}
        />
        {/* Neon glow shadow - animated on press */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.shadowGlow,
            {
              shadowColor: neonColor,
              shadowOpacity: glowOpacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
              shadowRadius: glowOpacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 12],
              }),
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
          pointerEvents="none"
        />
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.textPrimary,
              fontFamily: Platform.select({
                ios: 'SF Pro Rounded',
                android: 'Poppins',
                default: undefined,
              }),
            },
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    minHeight: 64,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    elevation: 4,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  shadowGlow: {
    borderRadius: 32,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    zIndex: 1,
  },
});

