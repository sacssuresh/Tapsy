import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, AppState } from 'react-native';

/**
 * Subtle animated gradient background
 * Colors: #EFEAFE → #F7F7FF → #EAF4FF
 * Slow 12-15s animation with 40% opacity
 */
export const AnimatedBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    const start = () => {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 14000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 14000,
            useNativeDriver: false,
          }),
        ])
      );
      loopRef.current.start();
    };

    const stop = () => {
      loopRef.current?.stop();
      loopRef.current = null;
    };

    start();

    const sub = AppState.addEventListener('change', (next) => {
      const wasActive = isActiveRef.current;
      const nowActive = next === 'active';
      if (wasActive && !nowActive) {
        isActiveRef.current = false;
        stop();
      } else if (!wasActive && nowActive) {
        isActiveRef.current = true;
        start();
      }
    });

    return () => {
      sub.remove();
      stop();
    };
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

