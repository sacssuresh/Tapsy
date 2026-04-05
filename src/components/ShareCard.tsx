import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { GameMode } from '../types';

interface ShareCardProps {
  score: number;
  level: number;
  mode: GameMode;
  isNewBest: boolean;
  mascotImage?: ImageSourcePropType;
  beatenCount?: number;
}

const MODE_CONFIG: Record<GameMode, { label: string; bg: string; accent: string; emoji: string }> = {
  classic: { label: 'Classic',  bg: '#E8F4FD', accent: '#5BB8F5', emoji: '🧠' },
  speed:   { label: 'Speed',    bg: '#FDE8F4', accent: '#F55BB8', emoji: '⚡' },
  reverse: { label: 'Reverse',  bg: '#FDF3E8', accent: '#F5A55B', emoji: '🔄' },
  zen:     { label: 'Zen',      bg: '#E8FDF0', accent: '#5BF5A0', emoji: '🌿' },
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  modeTag: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  mascotImage: {
    width: 64,
    height: 64,
  },
  scoreSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  newBestBadge: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#fff',
  },
  rankBadge: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#999',
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
    letterSpacing: -2,
  },
  levelText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  challenge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  appTag: {
    fontSize: 13,
    color: '#888',
  },
  appLink: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 3,
  },
});

export const ShareCard = React.forwardRef<View, ShareCardProps>(
  ({ score, level, mode, isNewBest, mascotImage, beatenCount }, ref) => {
    const config = MODE_CONFIG[mode] || MODE_CONFIG.classic;

    return (
      <View ref={ref} style={[styles.card, { backgroundColor: config.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: config.accent }]}>
          <View>
            <Text style={styles.appName}>Tapsy</Text>
            <Text style={styles.modeTag}>{config.emoji} {config.label} Mode</Text>
          </View>
          {mascotImage && (
            <Image source={mascotImage} style={styles.mascotImage} resizeMode="contain" />
          )}
        </View>

        {/* Score section */}
        <View style={styles.scoreSection}>
          {(isNewBest || (beatenCount !== undefined && beatenCount > 0)) && (
            <View style={styles.badges}>
              {isNewBest && (
                <Text style={[styles.newBestBadge, { backgroundColor: config.accent }]}>
                  ✨ New Best!
                </Text>
              )}
              {beatenCount !== undefined && beatenCount > 0 && (
                <Text style={styles.rankBadge}>🏆 Beat {beatenCount} players</Text>
              )}
            </View>
          )}
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={[styles.scoreValue, { color: config.accent }]}>{score}</Text>
          <Text style={styles.levelText}>Level {level} reached</Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: config.accent + '40' }]} />

        {/* CTA */}
        <View style={styles.footer}>
          <Text style={styles.challenge}>Can you beat this? 👇</Text>
          <Text style={styles.appTag}>🎮 Play Tapsy free on Android</Text>
          <Text style={styles.appLink}>play.google.com/store/apps/details?id=com.suresh.tapsy</Text>
        </View>
      </View>
    );
  }
);
