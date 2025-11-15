import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { effects } from '../theme';

interface ConfettiProps {
  onComplete?: () => void;
}

interface Particle {
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  color: string;
}

/**
 * Simple confetti animation component
 * Creates animated particles that fall down
 */
export const Confetti: React.FC<ConfettiProps> = ({ onComplete }) => {
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: effects.confetti.particleCount }, () => {
      const translateY = new Animated.Value(-50);
      const translateX = new Animated.Value(0);
      const opacity = new Animated.Value(1);
      const rotation = new Animated.Value(0);

      const randomX = (Math.random() - 0.5) * effects.confetti.spread;
      const randomRotation = Math.random() * 360;

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 1000,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: randomX,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: randomRotation,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();

      return {
        translateY,
        translateX,
        opacity,
        rotation,
        color: effects.confetti.colors[Math.floor(Math.random() * effects.confetti.colors.length)],
      };
    });

    if (onComplete) {
      setTimeout(onComplete, 3000);
    }
  }, [onComplete]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particlesRef.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateY: particle.translateY },
                { translateX: particle.translateX },
                {
                  rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    left: '50%',
  },
});

