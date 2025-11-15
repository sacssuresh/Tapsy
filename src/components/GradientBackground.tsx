import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { effects } from '../theme';

/**
 * Animated gradient background component
 * Uses opacity transitions between gradient layers for smooth color transitions
 */
export const GradientBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const opacity1 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      // Cycle through colors with opacity transitions
      Animated.sequence([
        // Transition from color1 to color2
        Animated.parallel([
          Animated.timing(opacity1, {
            toValue: 0,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 1,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
        ]),
        // Transition from color2 to color3
        Animated.parallel([
          Animated.timing(opacity2, {
            toValue: 0,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(opacity3, {
            toValue: 1,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
        ]),
        // Transition from color3 back to color1
        Animated.parallel([
          Animated.timing(opacity3, {
            toValue: 0,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(opacity1, {
            toValue: 1,
            duration: effects.gradientBackground.duration / 3,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (effects.gradientBackground.loop) {
          animate();
        }
      });
    };

    animate();
  }, [opacity1, opacity2, opacity3]);

  // Interpolate opacity with the base opacity value
  const opacity1Interpolated = opacity1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, effects.gradientBackground.opacity],
  });
  const opacity2Interpolated = opacity2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, effects.gradientBackground.opacity],
  });
  const opacity3Interpolated = opacity3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, effects.gradientBackground.opacity],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: effects.gradientBackground.colors[0],
            opacity: opacity1Interpolated,
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: effects.gradientBackground.colors[1],
            opacity: opacity2Interpolated,
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: effects.gradientBackground.colors[2],
            opacity: opacity3Interpolated,
          },
        ]}
      />
      {children}
    </View>
  );
};

