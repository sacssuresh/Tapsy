import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../theme';

type GamePhase = 'watching' | 'playing' | 'levelComplete' | 'mistake';

interface DynamicMessageProps {
  phase: GamePhase;
  isPaused?: boolean;
}

const messages: Record<GamePhase, string[]> = {
  watching: ['Watch closely 👀', 'Memorize this… 🧠'],
  playing: ['Your turn! Let\'s go 🎉', 'Show me what you got 💪'],
  levelComplete: ['Nice! Level up ✨', 'You crushed it! 🚀'],
  mistake: ['Almost! Try again 🙈', 'Good try! Want another round? ❤️'],
};

export const DynamicMessage: React.FC<DynamicMessageProps> = ({ phase, isPaused = false }) => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPaused) {
      setCurrentMessage('Paused ⏸️');
      return;
    }

    const phaseMessages = messages[phase];
    if (phaseMessages && phaseMessages.length > 0) {
      // Randomly select a message from the phase
      const randomIndex = Math.floor(Math.random() * phaseMessages.length);
      const newMessage = phaseMessages[randomIndex];

      // Fade out, change message, fade in
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentMessage(newMessage);
    }
  }, [phase, isPaused, fadeAnim]);

  if (!currentMessage) {
    return null;
  }

  return (
    <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
      {currentMessage}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.primary,
    marginTop: spacing.xl,
  },
});

