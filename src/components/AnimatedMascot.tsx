import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Pressable, ImageSourcePropType } from 'react-native';
import { getMascot, type MascotName } from '../mascots/MascotManager';
import { mascot } from '../theme';

interface AnimatedMascotProps {
  name: MascotName;
  size?: number;
  onPress?: () => void;
}

/**
 * AnimatedMascot component with subtle glow and bounce animations
 */
export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  name,
  size = 100,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  const mascotSource: ImageSourcePropType = getMascot(name);

  // Subtle glow pulse
  useEffect(() => {
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
  }, [glowOpacity]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
    }).start();
  };

  const content = (
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
          styles.mascotContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={mascotSource}
          style={[
            styles.mascotImage,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
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
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mascot.style.backgroundColor,
    shadowColor: mascot.style.shadowColor,
    shadowOpacity: mascot.style.shadowOpacity,
    shadowRadius: mascot.style.shadowRadius,
    shadowOffset: mascot.style.shadowOffset,
    elevation: 4,
    zIndex: 1,
    overflow: 'hidden',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
});

