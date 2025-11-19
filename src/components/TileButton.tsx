import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Easing, View, Text, type GestureResponderEvent } from 'react-native';
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
  const isAnimatingRef = useRef(false);
  const lastActiveRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnimationTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number>(0); // Unique ID for each animation attempt
  const lastTileIndexRef = useRef<number | null>(null); // Track which tile index was last animated
  const lastInactiveTimeRef = useRef<number>(0); // Track when tile became inactive

  // Enhanced blink animation when tile is active (sequence playback)
  useEffect(() => {
    // Immediate guard: if already animating, return immediately
    if (isAnimatingRef.current) {
      return;
    }

    // Clear any pending animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    const now = Date.now();
    const timeSinceLastAnimation = now - lastAnimationTimeRef.current;
    const timeSinceInactive = now - lastInactiveTimeRef.current;
    const MIN_ANIMATION_INTERVAL = 250; // Minimum 250ms between animations
    const NEW_SEQUENCE_THRESHOLD = 500; // If inactive for >500ms, treat as new sequence

    // Detect new sequence start: if tile becomes active after being inactive for >500ms
    // This ensures clean state reset between sequences
    if (isActive && !lastActiveRef.current && timeSinceInactive > NEW_SEQUENCE_THRESHOLD) {
      // Fully reset all animation refs for new sequence
      lastActiveRef.current = false;
      lastTileIndexRef.current = null;
      lastAnimationTimeRef.current = 0;
      isAnimatingRef.current = false;
    }

    // Only trigger animation on transition from inactive to active
    // AND if enough time has passed since last animation
    // AND we're not already animating
    // AND this is a different tile index than the last one animated (prevents same-tile double blink)
    const isNewTileActivation = lastTileIndexRef.current !== tileIndex;
    
    if (isActive && !lastActiveRef.current && !isAnimatingRef.current && 
        timeSinceLastAnimation >= MIN_ANIMATION_INTERVAL && isNewTileActivation) {
      // Set animating flag synchronously at the very start - BEFORE any other code
      isAnimatingRef.current = true;
      
      // Generate unique animation ID for this activation
      const currentAnimationId = ++animationIdRef.current;
      
      // Mark state immediately to prevent duplicate triggers
      lastActiveRef.current = true;
      lastTileIndexRef.current = tileIndex; // Track which tile is animating
      lastAnimationTimeRef.current = now;
      
      // Stop any running animations before resetting values to prevent visual jumps
      scaleAnim.stopAnimation();
      overlayOpacityAnim.stopAnimation();
      glowOpacityAnim.stopAnimation();
      
      // Reset animations to initial state
      scaleAnim.setValue(1);
      overlayOpacityAnim.setValue(0);
      glowOpacityAnim.setValue(0);
      
      // Play sound immediately
      playSound?.();
      
      // Start animation immediately (no debounce delay)
      // Tile blink animation from theme - enhanced with glow
      const blinkScale = animations.tileBlink.scale;
      const blinkDuration = animations.tileBlink.duration;
      
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
            toValue: 1, // Colored glow at full opacity for shadow effect
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
      ]).start(() => {
        // Animation complete - only reset if this is still the current animation
        if (currentAnimationId === animationIdRef.current) {
          isAnimatingRef.current = false;
        }
      });
    } else if (!isActive) {
      // Track when tile becomes inactive for new sequence detection
      if (lastActiveRef.current) {
        lastInactiveTimeRef.current = now;
      }
      
      // Reset when tile becomes inactive - with a delay to ensure clean state
      // Only reset if we're not currently animating (to avoid interrupting animations)
      animationTimeoutRef.current = setTimeout(() => {
        // Only reset if we're still inactive (might have become active again)
        // Also check if animation is complete before resetting
        if (!isActive && !isAnimatingRef.current) {
          lastActiveRef.current = false;
          // Reset tile index tracking when tile becomes fully inactive
          // This allows the same tile to animate again in a new sequence
          if (lastTileIndexRef.current === tileIndex) {
            lastTileIndexRef.current = null;
          }
        } else if (!isActive) {
          // Still animating, wait a bit more
          setTimeout(() => {
            if (!isActive) {
              lastActiveRef.current = false;
              if (lastTileIndexRef.current === tileIndex) {
                lastTileIndexRef.current = null;
              }
            }
          }, 150);
        }
      }, 200); // Increased delay to 200ms to ensure animation completes
    }

    // Cleanup timeout on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
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
  const handlePress = (event: GestureResponderEvent) => {
    const tapScale = animations.tileTap.scale;
    const tapDuration = animations.tileTap.duration;
    
    // Get press position for sparkle
    if (onPressWithPosition && event.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      onPressWithPosition(pageX, pageY);
    }
    
    // Pulse animation - scale from 1 → 1.08 → 1
    Animated.sequence([
      Animated.timing(tapScaleAnim, {
        toValue: 1.08, // Scale up for pulse effect
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(tapScaleAnim, {
        toValue: 1, // Scale back to normal
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
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
        {/* Colored glow effect with shadow */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: color,
              opacity: glowOpacityAnim,
              shadowColor: color, // Match tile color
              shadowOpacity: 0.8,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 0 },
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
    // Shadow properties will be set dynamically via inline style to match tile color
    elevation: 12, // Android elevation for glow effect
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

