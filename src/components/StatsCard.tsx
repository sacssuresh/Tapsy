import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography, spacing } from '../theme';

interface StatsCardProps {
  bestScore: number;
  xp: number;
  streak: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  bestScore,
  xp,
  streak,
}) => {
  const xpLevel = Math.floor(xp / 100) + 1;

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.stat}>
          <Text style={styles.icon}>⭐</Text>
          <Text style={styles.label}>Best Score</Text>
          <Text style={styles.value}>{bestScore}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.icon}>🧠</Text>
          <Text style={styles.label}>Level</Text>
          <Text style={styles.value}>{xpLevel}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.label}>Streak</Text>
          <Text style={styles.value}>{streak} days</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.xs,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: spacing.xs / 2,
  },
  label: {
    fontSize: 12,
    color: typography.caption.color,
    marginBottom: spacing.xs / 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: typography.body.color,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
});

