import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSimpleNavigation } from '../navigation/SimpleNavigator';
import { useGameStore } from '../state/gameStore';
import { useUserStore } from '../state/userStore';
import { GameGrid } from '../components/GameGrid';
import { SecondaryButton } from '../components/SecondaryButton';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { DynamicMessage } from '../components/DynamicMessage';
import { Sparkle } from '../components/Sparkle';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { getUserMascot, type MascotName } from '../mascots/MascotManager';
import { colors, typography, spacing, animations } from '../theme';
import { soundManager } from '../audio/SoundManager';
import type { GameMode, TileIndex } from '../types';

type GameStatus = 'watching' | 'playing' | 'levelComplete' | 'mistake';

export const GameScreen: React.FC<{ route?: { params?: { mode?: GameMode } } }> = ({ route }) => {
  const { navigate, goBack } = useSimpleNavigation();
  const insets = useSafeAreaInsets();
  const mode = route?.params?.mode || 'classic';

  const {
    level,
    score,
    currentTileIndex,
    isPlayingSequence,
    isGameOver,
    isPaused,
    sequence,
    playerInput,
    startGame,
    playSequence,
    handleTileTap,
    pauseGame,
    resumeGame,
  } = useGameStore();

  const { settings, bestScoreByMode } = useUserStore();
  const modeBest = (bestScoreByMode && bestScoreByMode[mode]) || 0;
  const safeSettings = settings || {
    soundEnabled: true,
    hapticsEnabled: true,
    hintsEnabled: false,
  };
  const [status, setStatus] = useState<GameStatus>('watching');
  const [sequencePlayed, setSequencePlayed] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const sparkleIdRef = useRef(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const levelUpAnim = useRef(new Animated.Value(1)).current;
  const [selectedMascot, setSelectedMascot] = useState<MascotName>('tapsy-kid');

  // Initialize game on mount
  useEffect(() => {
    startGame(mode);
    setSequencePlayed(false);
  }, [mode, startGame]);

  // Load user's selected mascot on mount
  useEffect(() => {
    const loadMascot = async () => {
      const userMascot = await getUserMascot();
      setSelectedMascot(userMascot);
    };
    loadMascot();
  }, []);

  // Play sequence when level changes or game starts
  useEffect(() => {
    if (Boolean(!sequencePlayed) && Boolean(!isPaused) && Boolean(!isGameOver)) {
      setStatus('watching');
      setSequencePlayed(true);
      
      // Delay to ensure all tile states are fully reset from previous sequence
      // This prevents double blink on first tile of new sequence
      // For level 1, use 1 second delay to let user understand the screen first
      const delay = 1000; // 1 second delay for all levels
      
      setTimeout(() => {
        // Double-check state is clean before starting
        if (!isPlayingSequence && !isGameOver && !isPaused) {
          playSequence(() => {
            setStatus('playing');
          });
        }
      }, delay);
    }
  }, [level, sequencePlayed, isPaused, isGameOver, isPlayingSequence, playSequence]);

  // Track previous pause state to detect resume
  const prevIsPaused = useRef(isPaused);
  
  // Handle resume - if sequence was interrupted during pause, restart it
  useEffect(() => {
    // Detect transition from paused to not paused (resume)
    const wasPaused = prevIsPaused.current;
    prevIsPaused.current = isPaused;
    
    if (wasPaused && Boolean(!isPaused) && Boolean(!isGameOver)) {
      // Just resumed - check if we need to replay sequence
      if (Boolean(!isPlayingSequence) && status === 'watching' && sequencePlayed) {
        // Sequence was interrupted during pause, need to replay
        setSequencePlayed(false);
      } else if (status === 'playing') {
        // We're in input phase, just ensure status is correct
        setStatus('playing');
      }
    }
  }, [isPaused, isGameOver, isPlayingSequence, sequencePlayed, status]);

  // Handle game over - add delay so user can see what happened
  useEffect(() => {
    if (Boolean(isGameOver)) {
      // Wait 1.5 seconds before showing game over screen
      // This gives user time to see the mistake and process it
      const timer = setTimeout(() => {
        navigate('GameOver', { mode });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameOver, navigate, mode]);

  // Play sound when tile becomes active during sequence
  useEffect(() => {
    if (Boolean(isPlayingSequence) && currentTileIndex >= 0 && currentTileIndex <= 3 && Boolean(safeSettings.soundEnabled)) {
      soundManager.playTileSound(currentTileIndex as TileIndex);
    }
  }, [currentTileIndex, isPlayingSequence, safeSettings.soundEnabled]);
  
  // Play success sound on level complete
  useEffect(() => {
    if (status === 'levelComplete' && Boolean(safeSettings.soundEnabled)) {
      soundManager.play('success');
    }
  }, [status, safeSettings.soundEnabled]);

  const onTilePressWithPosition = useCallback(
    (tileIndex: TileIndex, x: number, y: number) => {
      if (Boolean(isPlayingSequence) || Boolean(isPaused) || Boolean(isGameOver)) return;

      // Add sparkle animation
      const id = sparkleIdRef.current++;
      setSparkles((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 600);

      handleTileTap(
        tileIndex,
        () => {
          // onMismatch - shake animation and fail sound
          setStatus('mistake');
          const shakeValues = animations.shake.translateX;
          const shakeDuration = animations.shake.duration;
          
          shakeAnim.setValue(0);
          Animated.sequence(
            shakeValues.map((value, index) =>
              Animated.timing(shakeAnim, {
                toValue: value,
                duration: shakeDuration / shakeValues.length,
                useNativeDriver: true,
              })
            )
          ).start(() => {
            shakeAnim.setValue(0);
          });
          
          // Play fail sound
          if (safeSettings.soundEnabled) {
            soundManager.play('fail');
          }
        },
        () => {
          // onLevelComplete - delay celebration by 1 second so user can process level completion
          setTimeout(() => {
            // levelUp animation
            levelUpAnim.setValue(1);
            Animated.sequence([
              Animated.timing(levelUpAnim, {
                toValue: animations.levelUp.scale[1],
                duration: animations.levelUp.duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(levelUpAnim, {
                toValue: animations.levelUp.scale[2],
                duration: animations.levelUp.duration / 2,
                useNativeDriver: true,
              }),
            ]).start();
            
            setStatus('levelComplete');
            
            // After showing level complete message, prepare for next sequence
            setTimeout(() => {
              setStatus('watching');
              setSequencePlayed(false); // This will trigger the useEffect to play new sequence
            }, 1500);
          }, 1000); // 1 second delay before showing level complete animation
        }
      );

      // Play sound
      if (safeSettings.soundEnabled) {
        soundManager.playTileSound(tileIndex);
      }
    },
    [isPlayingSequence, isPaused, isGameOver, handleTileTap, safeSettings.soundEnabled, shakeAnim, levelUpAnim]
  );

  const onTilePress = useCallback(
    (tileIndex: TileIndex) => {
      // This will be handled by onTilePressWithPosition
    },
    []
  );

  const handlePause = () => {
    if (Boolean(isPaused)) {
      resumeGame();
    } else {
      pauseGame();
      Alert.alert('Paused', 'Game is paused', [
        { text: 'Resume', onPress: resumeGame },
        { text: 'Quit', onPress: goBack },
      ]);
    }
  };

  const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);

  // Determine phase for DynamicMessage
  const messagePhase: 'watching' | 'playing' | 'levelComplete' | 'mistake' = 
    Boolean(isPaused) ? 'watching' : status;

  // Calculate hint tile index when hints are enabled
  const getHintTileIndex = (): number | null => {
    if (!safeSettings.hintsEnabled || Boolean(isPlayingSequence) || Boolean(isPaused) || Boolean(isGameOver) || status !== 'playing') {
      return null;
    }

    // Get expected sequence (reversed for reverse mode)
    const expectedSequence = mode === 'reverse' ? [...sequence].reverse() : sequence;
    
    // Get the next tile index the user should press
    const nextIndex = playerInput.length;
    
    if (nextIndex < expectedSequence.length) {
      return expectedSequence[nextIndex];
    }
    
    return null;
  };

  const hintTileIndex = getHintTileIndex();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity onPress={goBack} disabled={false} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.modeText}>{modeName}</Text>
            <Text style={styles.levelText}>Level {level}</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.bestText}>Best: {modeBest}</Text>
          </View>
          <View style={styles.mascotContainer}>
            <AnimatedMascot name={selectedMascot} size={60} />
          </View>
        </View>

        <Animated.View 
          style={[
            styles.gameArea,
            {
              transform: [{ scale: levelUpAnim }],
            },
          ]}
        >
          <GameGrid
            key={`level-${level}`} // Force remount on level change to reset all tile states
            activeTileIndex={
              Boolean(isPlayingSequence) && 
              typeof currentTileIndex === 'number' && 
              currentTileIndex >= 0 && 
              currentTileIndex <= 3 && 
              status !== 'levelComplete' // Don't show active tiles during level complete
                ? currentTileIndex 
                : null
            }
            onTilePress={onTilePress}
            onTilePressWithPosition={onTilePressWithPosition}
            disabled={Boolean(Boolean(isPlayingSequence) || Boolean(isPaused) || Boolean(isGameOver) || status === 'levelComplete')}
            hintTileIndex={hintTileIndex}
            playSound={(tileIndex) => {
              if (safeSettings.soundEnabled) {
                soundManager.playTileSound(tileIndex);
              }
            }}
          />
          <DynamicMessage phase={messagePhase} isPaused={Boolean(isPaused)} />
        </Animated.View>

        {/* Sparkle animations */}
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            x={sparkle.x}
            y={sparkle.y}
            onComplete={() => {}}
          />
        ))}

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <SecondaryButton
            title={Boolean(isPaused) ? 'Resume' : 'Pause'}
            onPress={handlePause}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backButtonIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  mascotContainer: {
    marginLeft: spacing.sm,
  },
  modeText: {
    fontSize: typography.body.fontSize + 2,
    fontWeight: '600',
    color: typography.body.color,
  },
  levelText: {
    fontSize: typography.body.fontSize - 1,
    color: typography.body.color,
  },
  scoreText: {
    fontSize: typography.body.fontSize - 1,
    color: typography.body.color,
  },
  bestText: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
});

