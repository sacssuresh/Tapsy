import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { mascot } from '../theme';

interface MascotProps {
  expression?: 'happy' | 'celebrate' | 'fire' | 'shock' | 'sad' | 'fail';
  size?: number;
}

/**
 * Mascot component with expressions, glow, and idle animation
 */
export const Mascot: React.FC<MascotProps> = ({
  expression = 'happy',
  size = mascot.style.size,
}) => {
  const emoji = mascot.expressions[expression];
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  // Idle float animation: slow up & down
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();

    // Subtle glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, glowOpacity]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-3, 3],
  });

  return (
    <View style={styles.container}>
      {/* Glow circle behind mascot */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            opacity: glowOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.mascot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: mascot.style.backgroundColor,
            shadowColor: mascot.style.shadowColor,
            shadowOpacity: mascot.style.shadowOpacity,
            shadowRadius: mascot.style.shadowRadius,
            shadowOffset: mascot.style.shadowOffset,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.emoji, { fontSize: size * 0.5 }]}>{emoji}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    backgroundColor: '#A088FF', // Soft pastel purple
    shadowColor: '#A088FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 1,
  },
  emoji: {
    textAlign: 'center',
  },
});

