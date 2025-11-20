import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { LeaderboardEntry } from '../services/leaderboardService';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  rank,
  isCurrentUser = false,
}) => {
  const theme = useTheme();

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isCurrentUser ? `${theme.colors.primary}10` : 'transparent',
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      {/* Rank */}
      <View style={styles.rankCell}>
        <Text
          style={[
            styles.rankText,
            {
              color: isCurrentUser ? theme.colors.primary : theme.colors.textPrimary,
              fontWeight: '700',
            },
          ]}
        >
          {rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}
        </Text>
      </View>

      {/* Name */}
      <View style={styles.nameCell}>
        <Text
          style={[
            styles.nameText,
            {
              color: isCurrentUser ? theme.colors.primary : theme.colors.textPrimary,
              fontWeight: isCurrentUser ? '600' : '500',
            },
          ]}
          numberOfLines={1}
        >
          {entry.name}
        </Text>
      </View>

      {/* Combined Score */}
      <View style={styles.combinedCell}>
        <Text
          style={[
            styles.combinedText,
            {
              color: isCurrentUser ? theme.colors.primary : theme.colors.textPrimary,
              fontWeight: '600',
            },
          ]}
        >
          {formatScore(entry.combined)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  rankCell: {
    width: 50,
    alignItems: 'flex-start',
  },
  rankText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  nameCell: {
    flex: 1,
    marginHorizontal: 8,
    minWidth: 100,
  },
  nameText: {
    fontSize: 15,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
  combinedCell: {
    width: 110,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  combinedText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Poppins',
      default: undefined,
    }),
  },
});

