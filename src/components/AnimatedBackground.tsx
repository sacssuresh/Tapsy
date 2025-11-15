import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * Subtle animated gradient background
 * Colors: #EFEAFE → #F7F7FF → #EAF4FF
 * Slow 12-15s animation with 40% opacity
 */
export const AnimatedBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 14000, // 14 seconds
            useNativeDriver: false, // Colors can't use native driver
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 14000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animate();
  }, [animatedValue]);

  // Interpolate opacity for smooth transitions
  const opacity1 = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.2, 0.4],
  });

  const opacity2 = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.4, 0.2],
  });

  const opacity3 = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.2, 0.4],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#EFEAFE',
            opacity: opacity1,
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#F7F7FF',
            opacity: opacity2,
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#EAF4FF',
            opacity: opacity3,
          },
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

