import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Easing, View, Text } from 'react-native';
import { tiles, animations, spacing, colors } from '../theme';
import type { TileIndex } from '../types';

interface TileButtonProps {
  tileIndex: TileIndex;
  color: string;
  isActive: boolean;
  onPress: () => void;
  disabled?: boolean;
  playSound?: () => void;
  onPressWithPosition?: (x: number, y: number) => void; // For sparkle animation
  showHint?: boolean; // Show hint indicator
}

export const TileButton: React.FC<TileButtonProps> = ({
  tileIndex,
  color,
  isActive,
  onPress,
  disabled = false,
  playSound,
  onPressWithPosition,
  showHint = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;
  const tapScaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0)).current;
  const hintPulseAnim = useRef(new Animated.Value(0.3)).current;

  // Enhanced blink animation when tile is active (sequence playback)
  useEffect(() => {
    if (isActive) {
      playSound?.();
      
      // Reset animations to initial state
      scaleAnim.setValue(1);
      overlayOpacityAnim.setValue(0);
      glowOpacityAnim.setValue(0);
      
      // Tile blink animation from theme - enhanced with glow
      const blinkScale = animations.tileBlink.scale;
      const blinkDuration = animations.tileBlink.duration;
      const overlayOpacity = animations.tileBlink.overlayOpacity;
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: blinkScale[1], // Scale to 1.08
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacityAnim, {
            toValue: 0.3, // White overlay at 30% opacity
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacityAnim, {
            toValue: 0.6, // Colored glow
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: blinkScale[2], // Scale back to 1
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacityAnim, {
            toValue: 0, // Overlay opacity back to 0
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacityAnim, {
            toValue: 0, // Glow back to 0
            duration: blinkDuration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isActive, scaleAnim, overlayOpacityAnim, glowOpacityAnim, playSound]);

  // Hint pulse animation
  useEffect(() => {
    if (showHint) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(hintPulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulseAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (showHint) pulse();
        });
      };
      pulse();
    } else {
      hintPulseAnim.setValue(0.3);
    }
  }, [showHint, hintPulseAnim]);

  // Enhanced tap animation when user presses tile (squishy effect)
  const handlePress = (event: any) => {
    const tapScale = animations.tileTap.scale;
    const tapDuration = animations.tileTap.duration;
    
    // Get press position for sparkle
    if (onPressWithPosition && event.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      onPressWithPosition(pageX, pageY);
    }
    
    // Squishy bounce animation
    Animated.sequence([
      Animated.spring(tapScaleAnim, {
        toValue: 0.92, // Scale down more for squishy effect
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
      Animated.spring(tapScaleAnim, {
        toValue: 1, // Bounce back
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
    
    onPress();
  };

  const animatedStyle = {
    transform: [
      { scale: Animated.multiply(scaleAnim, tapScaleAnim) },
    ],
  };

  const overlayStyle = {
    opacity: overlayOpacityAnim,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!!disabled}
      activeOpacity={1}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.tile,
          { backgroundColor: color },
          animatedStyle,
        ]}
      >
        {/* White overlay for brightness */}
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: '#FFFFFF',
              opacity: overlayOpacityAnim,
            },
          ]}
        />
        {/* Colored glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: color,
              opacity: glowOpacityAnim,
            },
          ]}
        />
        {/* Hint indicator - pulsing border */}
        {showHint && (
          <Animated.View
            style={[
              styles.hintBorder,
              {
                borderColor: colors.primary,
                opacity: hintPulseAnim,
              },
            ]}
          />
        )}
        {/* Hint icon */}
        {showHint && (
          <View style={styles.hintIcon}>
            <Text style={styles.hintIconText}>👆</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    margin: spacing.xs,
  },
  tile: {
    flex: 1,
    borderRadius: 28, // Increased corner radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 5,
    opacity: tiles.style.opacity,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  hintBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 4,
    borderStyle: 'solid',
  },
  hintIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hintIconText: {
    fontSize: 16,
  },
});

